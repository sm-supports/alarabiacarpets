#!/usr/bin/env bash
# Build the static export and deploy it to Cloudflare Pages without the
# case-collision that broke production on 2026-11-03.
#
# The repo lives on a case-insensitive APFS volume. public/Products (images)
# and the /products/[id] route pages both export into out/, so they merge into
# one folder named "Products". Cloudflare Pages is case-sensitive and then
# serves the pages at /Products/x, so every /products/* URL 404s. Same for
# public/Services and /services/[slug].
#
# On a case-insensitive filesystem this script copies out/ onto a
# case-sensitive APFS sparse image and splits each merged folder back into its
# public/ half and its route half before deploying. On a case-sensitive
# filesystem (Linux, CI) it deploys out/ as-is.
#
# Production only when the current git branch is main; anything else is a
# preview deploy on that branch's alias.
#
# Env overrides:
#   DEPLOY_SKIP_BUILD=1   reuse the existing out/ instead of running the build
#   DEPLOY_DRY_RUN=1      stage and verify, but don't call wrangler
#   DEPLOY_IMAGE=path     sparse image location
set -euo pipefail

PROJECT_NAME="alarabiacarpets"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/out"
IMAGE="${DEPLOY_IMAGE:-$HOME/Library/Caches/alarabiacarpets-deploy.sparseimage}"
MOUNT="${IMAGE%.sparseimage}.mnt"
VOLNAME="alarabia-deploy"

log() { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[deploy] FAIL:\033[0m %s\n' "$*" >&2; exit 1; }
lower() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]'; }
count_files() { find "$1" \( -type f -o -type l \) | wc -l | tr -d ' '; }

cd "$ROOT"

branch="$(git symbolic-ref --short -q HEAD || true)"
[ -n "$branch" ] || die "detached HEAD: check out a branch so the deploy target is unambiguous"
if [ "$branch" = "main" ]; then
  log "branch main -> PRODUCTION deploy"
else
  log "branch $branch -> preview deploy"
fi

if [ "${DEPLOY_SKIP_BUILD:-}" = "1" ]; then
  log "skipping build (DEPLOY_SKIP_BUILD=1)"
else
  log "building"
  npm run build
fi
[ -f "$OUT/index.html" ] || die "$OUT/index.html missing - did the build run?"

node scripts/check-text-ratio.mjs || die "pages under the 10% text-to-HTML ratio"
node scripts/check-arabic.mjs || die "Arabic pages failed their checks"
node scripts/check-page-weight.mjs || die "pages failed their weight checks"
node scripts/check-internal-links.mjs || die "keyword pages have too few internal links"

# Is out/ on a case-insensitive filesystem?
probe="$OUT/.case-probe-$$"
touch "$probe"
if [ -e "$OUT/.CASE-PROBE-$$" ]; then case_insensitive=1; else case_insensitive=0; fi
rm -f "$probe"

attached=0
cleanup() {
  if [ "$attached" = "1" ]; then
    hdiutil detach "$MOUNT" -quiet || hdiutil detach "$MOUNT" -force -quiet || true
  fi
}
trap cleanup EXIT

if [ "$case_insensitive" = "0" ]; then
  log "out/ is on a case-sensitive filesystem; deploying it directly"
  SITE="$OUT"
else
  [ "$(uname)" = "Darwin" ] || die "case-insensitive filesystem but not macOS; no staging strategy"

  # Collisions: a top-level public/ folder and an app route folder whose names
  # differ only in case. Both export into the same out/ folder here. Routes live
  # inside route groups such as src/app/(en)/, which add nothing to the URL.
  pairs=""
  for pub in "$ROOT"/public/*/; do
    P="$(basename "$pub")"
    for app in "$ROOT"/src/app/*/ "$ROOT"/src/app/\(*\)/*/; do
      R="$(basename "$app")"
      if [ "$P" != "$R" ] && [ "$(lower "$P")" = "$(lower "$R")" ]; then
        pairs="$pairs $P:$R"
      fi
    done
  done
  log "case collisions (public:route):${pairs:- none}"

  # Create or reuse the case-sensitive sparse image.
  if [ ! -e "$IMAGE" ]; then
    log "creating case-sensitive sparse image $IMAGE"
    mkdir -p "$(dirname "$IMAGE")"
    hdiutil create -quiet -size 4g -type SPARSE -fs "Case-sensitive APFS" \
      -volname "$VOLNAME" "${IMAGE%.sparseimage}"
  fi
  # A previous run that was killed may have left it attached.
  if hdiutil info | grep -qF "$IMAGE"; then
    log "image already attached; detaching first"
    hdiutil detach "$MOUNT" -force -quiet 2>/dev/null || true
  fi
  mkdir -p "$MOUNT"
  hdiutil attach -quiet -nobrowse -mountpoint "$MOUNT" "$IMAGE"
  attached=1

  # Refuse to stage on anything that isn't actually case-sensitive.
  touch "$MOUNT/.case-probe"
  if [ -e "$MOUNT/.CASE-PROBE" ]; then die "$MOUNT is not case-sensitive"; fi
  rm -f "$MOUNT/.case-probe"

  SITE="$MOUNT/site"
  rm -rf "$SITE"
  mkdir -p "$SITE"

  excludes=()
  for pair in $pairs; do
    # Exclude by the name actually on disk, whichever case won the merge.
    ondisk="$(ls "$OUT" | grep -ix -- "${pair%%:*}" || true)"
    [ -n "$ondisk" ] && excludes+=(--exclude "/$ondisk/")
  done
  log "copying out/ to $SITE"
  rsync -a ${excludes[@]+"${excludes[@]}"} "$OUT/" "$SITE/"

  # Split each merged folder: files that exist in public/<P> go back under
  # <P>, everything else (the route's .html/.txt output) goes under <R>.
  for pair in $pairs; do
    P="${pair%%:*}"; R="${pair##*:}"
    [ -d "$OUT/$P" ] || continue
    pub_n=0; route_n=0
    while IFS= read -r -d '' f; do
      rel="${f#"$OUT/$P/"}"
      if [ -e "$ROOT/public/$P/$rel" ]; then dest="$SITE/$P/$rel"; pub_n=$((pub_n + 1))
      else dest="$SITE/$R/$rel"; route_n=$((route_n + 1)); fi
      mkdir -p "$(dirname "$dest")"
      cp -p "$f" "$dest"
    done < <(find "$OUT/$P/" \( -type f -o -type l \) -print0)
    log "  $P: $pub_n public files -> $P/, $route_n route files -> $R/"

    [ "$route_n" -gt 0 ] || die "no route output found for $R/ inside out/$P"
    stray="$(find "$SITE/$P" -maxdepth 1 \( -name '*.html' -o -name '*.txt' \) | head -1)"
    [ -z "$stray" ] || die "route output left under $P/: $stray"
    # Every page Next emitted for this route must be in the lowercase folder.
    while IFS= read -r -d '' f; do
      name="$(basename "$f")"
      [ -e "$ROOT/public/$P/$name" ] && continue
      [ -f "$SITE/$R/$name" ] || die "missing staged $R/$name"
    done < <(find "$OUT/$P/" -maxdepth 1 \( -name '*.html' -o -name '*.txt' \) -print0)
  done

  out_n="$(count_files "$OUT")"
  site_n="$(count_files "$SITE")"
  [ "$out_n" = "$site_n" ] || die "staged $site_n files but out/ has $out_n"
  log "staged $site_n files (matches out/)"
fi

# Every sitemap URL must map onto a real file in what we upload.
missing=0
while IFS= read -r loc; do
  path="$(printf '%s' "$loc" | sed -E 's#^https?://[^/]+##; s#/$##')"
  if [ -z "$path" ]; then f="$SITE/index.html"; else f="$SITE$path.html"; fi
  if [ ! -f "$f" ] && [ ! -f "$SITE$path/index.html" ]; then
    echo "  sitemap URL has no file: $loc" >&2; missing=$((missing + 1))
  fi
done < <(grep -o '<loc>[^<]*</loc>' "$OUT/sitemap.xml" | sed -e 's/<loc>//' -e 's/<\/loc>//')
[ "$missing" = "0" ] || die "$missing sitemap URL(s) would 404"
log "all sitemap URLs map to files"

if [ "${DEPLOY_DRY_RUN:-}" = "1" ]; then
  log "dry run: not deploying $SITE"
  exit 0
fi

# Run from the repo root so wrangler bundles functions/.
log "wrangler pages deploy ($branch)"
npx wrangler pages deploy "$SITE" --project-name "$PROJECT_NAME" --branch "$branch"
