/**
 * What a crawler reads on every page of the sitemap: title, description, h1s, headings
 * and the text inside <main>, from the static HTML in out/ with JavaScript off.
 *
 *   node scripts/snapshot-seo.mjs --diff      compare out/ with the committed baseline
 *   node scripts/snapshot-seo.mjs --write     replace the baseline (only from a clean main)
 *   ... --verbose                             list every page behind each line
 *   ... --dir=/path/to/out --baseline=file    another build or baseline
 *
 * Diff exits 1 on anything the mobile redesign must not do:
 *   - a title, description or h1 changed
 *   - a heading removed, changed, or moved relative to the other headings
 *   - text removed from <main>, unless it is a CTA label the plan replaces
 *     (PLANNED_CTA_LABELS below; keep that list as short as the plan allows) or a
 *     separator with no letter or digit in it
 * It reports without failing: added text and headings, and text that moved or was
 * merged into another block. Read those: an addition can still be a mistake.
 *
 * Text is split into one entry per block, link or button, so a changed CTA label shows
 * up as that label rather than as a whole changed paragraph. Text in a closed <details>
 * or hidden by CSS counts, because a crawler reads it. <noscript> doesn't count: it is
 * only a fallback, and Chrome parses it as elements here only because JavaScript is off.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { gotoSettled, installRoutes, launchBrowser, newPage } from "./lib/browser.mjs";
import { serveOut } from "./lib/serve-out.mjs";

const SITE = "https://alarabiacarpets.com";
const DEFAULT_BASELINE = "docs/mobile-audit/baseline/seo-snapshot.json";

// The plan's CTA vocabulary replaces these. Exact text of one entry, after whitespace
// is collapsed. Guides keep "Ask us on WhatsApp" (see isPlannedLabel).
const ASK_LABELS = new Set(["Ask us on WhatsApp", "اسألنا على الواتساب"]);
const PLANNED_CTA_LABELS = new Set([
  "Get Quote",
  "Get a Free Quote",
  "Get a free quote on WhatsApp",
  "Contact Us on WhatsApp",
  "Chat on WhatsApp",
  "Inquire on WhatsApp",
  "Call Now",
  "اطلب عرض سعر",
  "اطلب عرض سعر مجاني",
  "اطلب عرض سعر مجاني على الواتساب",
  "كلّمنا على الواتساب",
  "استفسر على الواتساب",
  "اتصل الحين",
]);
const isGuide = (url) => /^(\/ar)?\/guides\//.test(url);
const isPlannedLabel = (text, url) =>
  PLANNED_CTA_LABELS.has(text) || (ASK_LABELS.has(text) && !isGuide(url));
// A breadcrumb's "/" and the like: no letter or digit, so nothing a crawler could rank on.
const isSeparator = (text) => !/[\p{L}\p{N}]/u.test(text);

const args = process.argv.slice(2);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
const write = args.includes("--write");
const verbose = args.includes("--verbose");
const dir = option("dir", "out");
const baselinePath = option("baseline", DEFAULT_BASELINE);

/** Runs in the page. Takes no closure: puppeteer sends it over as source text. */
function readPage() {
  const BREAKS = new Set(
    "A ADDRESS ARTICLE ASIDE BLOCKQUOTE BR BUTTON DD DETAILS DIV DL DT FIELDSET FIGCAPTION FIGURE FOOTER FORM H1 H2 H3 H4 H5 H6 HEADER HR LABEL LI MAIN NAV OL P PRE SECTION SUMMARY TABLE TBODY TD TFOOT TH THEAD TR UL".split(" ")
  );
  const SKIP = new Set("SCRIPT STYLE TEMPLATE NOSCRIPT SVG".split(" "));
  const segments = (root) => {
    const out = [];
    let buffer = "";
    const flush = () => {
      const text = buffer.replace(/\s+/g, " ").trim().normalize("NFC");
      if (text) out.push(text);
      buffer = "";
    };
    const walk = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) buffer += child.nodeValue;
        else if (child.nodeType === Node.ELEMENT_NODE) {
          const tag = child.tagName.toUpperCase();
          if (SKIP.has(tag)) continue;
          const breaks = BREAKS.has(tag);
          if (breaks) flush();
          walk(child);
          if (breaks) flush();
        }
      }
    };
    walk(root);
    flush();
    return out;
  };
  const oneLine = (element) => segments(element).join(" ");
  const main = document.querySelector("main");
  return {
    title: document.title.replace(/\s+/g, " ").trim(),
    description: document.querySelector('meta[name="description"]')?.getAttribute("content")?.replace(/\s+/g, " ").trim() ?? null,
    h1: [...document.querySelectorAll("h1")].map(oneLine),
    headings: [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => `${h.tagName.toLowerCase()} ${oneLine(h)}`),
    main: main ? segments(main) : null,
  };
}

async function readSite() {
  const sitemap = fs.readFileSync(path.join(dir, "sitemap.xml"), "utf8");
  const urls = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/"))];
  const server = await serveOut({ dir });
  const browser = await launchBrowser();
  try {
    const page = await newPage(browser, { width: 390, javascript: false });
    await installRoutes(page, { origin: server.origin, documentsOnly: true });
    const pages = {};
    for (const url of urls) {
      const response = await gotoSettled(page, `${server.origin}${url}`, { hydrate: false });
      if (response?.status() !== 200) throw new Error(`${url} answered ${response?.status()}`);
      pages[url] = await page.evaluate(readPage);
    }
    return pages;
  } finally {
    await browser.close();
    await server.close();
  }
}

/** Entries of `a` that aren't matched one-for-one in `b`. */
function missingFrom(a, b) {
  const counts = new Map();
  for (const item of b) counts.set(item, (counts.get(item) ?? 0) + 1);
  const missing = [];
  for (const item of a) {
    const left = counts.get(item) ?? 0;
    if (left > 0) counts.set(item, left - 1);
    else missing.push(item);
  }
  return missing;
}

/**
 * The first entry that moved, or null. Takes the longest run the two lists share in
 * order: what's left over on one side was removed or added, and what's left over on
 * both sides moved. Repeated entries, like the "/" in a breadcrumb, don't confuse it.
 */
function firstMove(before, after) {
  if (JSON.stringify(before) === JSON.stringify(after)) return null;
  const n = before.length;
  const m = after.length;
  const shared = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      shared[i][j] = before[i] === after[j] ? shared[i + 1][j + 1] + 1 : Math.max(shared[i + 1][j], shared[i][j + 1]);
    }
  }
  const leftBefore = [];
  const leftAfter = new Set();
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && before[i] === after[j]) {
      i += 1;
      j += 1;
    } else if (j >= m || (i < n && shared[i + 1][j] >= shared[i][j + 1])) {
      leftBefore.push(before[i]);
      i += 1;
    } else {
      leftAfter.add(after[j]);
      j += 1;
    }
  }
  return leftBefore.find((item) => leftAfter.has(item)) ?? null;
}

function diffSite(baseline, now) {
  const failures = [];
  const warnings = [];
  const notes = [];
  const add = (list, kind, text, url) => list.push({ kind, text, url });

  for (const url of Object.keys(baseline)) {
    const before = baseline[url];
    const after = now[url];
    if (!after) {
      add(failures, "page gone", url, url);
      continue;
    }
    if (before.title !== after.title) add(failures, "title changed", `${before.title} -> ${after.title}`, url);
    if (before.description !== after.description) add(failures, "description changed", `${before.description} -> ${after.description}`, url);
    if (JSON.stringify(before.h1) !== JSON.stringify(after.h1)) add(failures, "h1 changed", `${before.h1.join(" | ")} -> ${after.h1.join(" | ")}`, url);

    for (const heading of missingFrom(before.headings, after.headings)) add(failures, "heading removed or changed", heading, url);
    for (const heading of missingFrom(after.headings, before.headings)) add(notes, "heading added", heading, url);
    const movedHeading = firstMove(before.headings, after.headings);
    if (movedHeading) add(failures, "heading order changed, first at", movedHeading, url);

    if (!after.main) {
      add(failures, "no <main>", url, url);
      continue;
    }
    const added = missingFrom(after.main, before.main);
    const addedText = added.join(" ");
    for (const text of missingFrom(before.main, after.main)) {
      if (isPlannedLabel(text, url)) add(notes, "CTA label replaced (planned)", text, url);
      else if (isSeparator(text)) add(notes, "separator removed", text, url);
      else if (addedText.includes(text)) add(warnings, "text merged into a new block", text, url);
      else add(failures, "text removed", text, url);
    }
    for (const text of added) {
      if (isPlannedLabel(text, url)) add(notes, "CTA label added (planned)", text, url);
      else add(notes, "text added", text, url);
    }
    const movedText = firstMove(before.main, after.main);
    if (movedText) add(warnings, "text order changed, first at", movedText, url);
  }
  for (const url of Object.keys(now)) {
    if (!baseline[url]) add(notes, "page added", url, url);
  }
  return { failures, warnings, notes };
}

/** One line per distinct change, with how many pages have it. */
function printGroup(heading, entries) {
  if (!entries.length) return;
  const groups = new Map();
  for (const entry of entries) {
    const key = `${entry.kind}: ${entry.text}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry.url);
  }
  console.log(`\n${heading} (${entries.length})`);
  for (const [key, urls] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    const where = urls.length === 1 ? urls[0] : `${urls.length} pages, e.g. ${urls[0]}`;
    console.log(`  ${key.length > 200 ? `${key.slice(0, 200)}…` : key}\n    ${where}`);
    if (verbose && urls.length > 1) console.log(`    ${urls.join(" ")}`);
  }
}

const pages = await readSite();

if (write) {
  const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, `${JSON.stringify({ commit, pageCount: Object.keys(pages).length, pages }, null, 1)}\n`);
  console.log(`snapshot-seo: wrote ${Object.keys(pages).length} pages from ${commit} to ${baselinePath}`);
  process.exit(0);
}

if (!fs.existsSync(baselinePath)) {
  console.error(`snapshot-seo: ${baselinePath} not found. Run with --write from a clean main first.`);
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const { failures, warnings, notes } = diffSite(baseline.pages, pages);
printGroup("FAILURES", failures);
printGroup("Look at these", warnings);
printGroup("Planned or added", notes);
console.log(
  `\nsnapshot-seo: ${Object.keys(pages).length} pages against baseline ${baseline.commit}: ` +
    `${failures.length} failure(s), ${warnings.length} to look at, ${notes.length} planned or added`
);
process.exit(failures.length ? 1 : 0);
