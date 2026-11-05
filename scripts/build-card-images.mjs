/**
 * Generates the sized WebP copies of catalog photos that pages show, in public/img/,
 * and src/data/image-manifest.json, which src/lib/card-image.ts reads to find them.
 * Runs before `npm run dev` and `npm run build`. public/img/ is gitignored; the
 * manifest is committed so `tsc` works on a fresh clone.
 *
 * The originals are up to 2048 px on the long edge and are what og:image and JSON-LD
 * point at. Pages use these instead:
 *   card  4:3, cropped centred like object-cover, 400 and 720 px wide. Every image.
 *   full  uncropped, 800 and 1200 px wide. Only hero images (imageSrc, heroImage).
 * A variant is never wider than its source, and widths that would come out nearly the
 * same are dropped, so the manifest records the real width of each file.
 *
 * File names carry a hash of the source bytes and the settings below, so a changed
 * photo gets a new URL and /img/* can be cached forever (public/_headers). Nothing is
 * regenerated unless a source or a setting changed.
 *
 * Fails if a data file points at an image or video that doesn't exist.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Bump when a setting below changes, so every file is regenerated under a new name.
const SETTINGS_VERSION = 1;
const CARD_WIDTHS = [400, 720];
const CARD_QUALITY = 72;
const FULL_WIDTHS = [800, 1200];
const FULL_QUALITY = 74;
/** A second width must be at least this much wider than the first to be worth a file. */
const MIN_STEP = 1.25;

const PUBLIC = path.resolve("public");
const OUT = path.join(PUBLIC, "img");
const MANIFEST = path.resolve("src/data/image-manifest.json");
const DATA_FILES = ["products", "categories", "services", "guides"];
const HERO_KEYS = new Set(["imageSrc", "heroImage"]);

/** src -> whether it is used as a hero somewhere. */
const sources = new Map();
const videos = new Set();
for (const name of DATA_FILES) {
  const data = fs.readFileSync(`src/data/${name}.ts`, "utf8");
  for (const [, key, src] of data.matchAll(/["']?(src|imageSrc|heroImage)["']?:\s*["']([^"']+)["']/g)) {
    if (!src.startsWith("/")) continue;
    if (/\.mp4$/i.test(src)) videos.add(src);
    else sources.set(src, (sources.get(src) ?? false) || HERO_KEYS.has(key));
  }
}

const missing = [...sources.keys(), ...videos].filter((src) => !fs.existsSync(path.join(PUBLIC, src)));
if (missing.length > 0) {
  console.error(`build-card-images: data files point at missing media:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

/** Target widths capped at `max`, dropping any that add little over the one before. */
function widthsFor(targets, max) {
  const widths = [];
  for (const target of targets) {
    const width = Math.min(target, max);
    const last = widths[widths.length - 1];
    if (last === undefined || width >= last * MIN_STEP) widths.push(width);
  }
  return widths;
}

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
const wanted = new Set();
let made = 0;

for (const src of [...sources.keys()].sort()) {
  const input = path.join(PUBLIC, src);
  const bytes = fs.readFileSync(input);
  const hash = crypto
    .createHash("sha256")
    .update(bytes)
    .update(`v${SETTINGS_VERSION} sharp${sharp.versions.sharp}`)
    .digest("hex")
    .slice(0, 10);

  const meta = await sharp(bytes).metadata();
  // EXIF orientations 5-8 are stored on their side.
  const sideways = (meta.orientation ?? 1) >= 5;
  const srcWidth = sideways ? meta.height : meta.width;
  const srcHeight = sideways ? meta.width : meta.height;

  const entry = {};
  const jobs = [];

  // Card: the widest 4:3 box that fits in the source, never enlarged.
  const cardMax = Math.min(srcWidth, Math.floor((srcHeight * 4) / 3));
  entry.c = widthsFor(CARD_WIDTHS, cardMax).map((width, i) => {
    const name = `${hash}-c${CARD_WIDTHS[i]}.webp`;
    jobs.push({
      name,
      run: (output) =>
        sharp(bytes)
          .rotate()
          .resize(width, Math.round((width * 3) / 4), { fit: "cover", position: "centre" })
          .webp({ quality: CARD_QUALITY, effort: 5 })
          .toFile(output),
    });
    return [width, `/img/${name}`];
  });

  if (sources.get(src)) {
    entry.f = widthsFor(FULL_WIDTHS, srcWidth).map((width, i) => {
      const name = `${hash}-f${FULL_WIDTHS[i]}.webp`;
      jobs.push({
        name,
        run: (output) =>
          // A WebP that is already small enough is copied: re-encoding only loses quality.
          meta.format === "webp" && width === srcWidth && !sideways
            ? fs.promises.copyFile(input, output)
            : sharp(bytes).rotate().resize({ width }).webp({ quality: FULL_QUALITY, effort: 5 }).toFile(output),
      });
      return [width, `/img/${name}`];
    });
  }

  for (const job of jobs) {
    const output = path.join(OUT, job.name);
    wanted.add(job.name);
    if (fs.existsSync(output)) continue;
    // Written under a temporary name so an interrupted run can't leave a truncated
    // file that the exists-check above would then keep forever.
    const partial = `${output}.partial`;
    await job.run(partial);
    fs.renameSync(partial, output);
    made += 1;
  }
  manifest[src] = entry;
}

// A removed photo's copies would otherwise keep getting deployed.
let removed = 0;
for (const name of fs.readdirSync(OUT)) {
  if (!wanted.has(name)) {
    fs.rmSync(path.join(OUT, name), { recursive: true });
    removed += 1;
  }
}
// The folder this script wrote to before the copies had hashed names.
fs.rmSync(path.join(PUBLIC, "Products", "cards"), { recursive: true, force: true });

const json = `${JSON.stringify(manifest, null, 1)}\n`;
if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, "utf8") !== json) fs.writeFileSync(MANIFEST, json);

console.log(`build-card-images: ${sources.size} images, ${wanted.size} files, ${made} generated, ${removed} removed`);
