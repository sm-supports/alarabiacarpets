/**
 * Guards the page-speed work against quiet regressions, run against out/.
 *
 * Each rule is something that was slow once and is easy to reintroduce without
 * noticing, because the page still looks right on a fast laptop:
 *   - content hidden until JavaScript runs (an `opacity-0` class in the static HTML;
 *     use the CSS `.reveal` class for scroll effects instead)
 *   - a catalog photo served at full size (pages use the copies in /img/, see
 *     src/lib/card-image.ts; og:image and JSON-LD still use the originals)
 *   - too many font preloads or high-priority images competing with the page itself
 *   - hydration data growing because a whole record was passed to a client component
 *
 * Pages come from the sitemap, like check-text-ratio. Exits 1 on any failure.
 */
import fs from "node:fs";

const SITE = "https://alarabiacarpets.com";
const MAX_FONT_PRELOADS = 4;
const MAX_HIGH_PRIORITY = 2;
// The largest page is about 73 KB (an Arabic category page). Before the product
// grid became a server component, /ar/products was 173 KB.
const MAX_FLIGHT_BYTES = 90_000;

const urls = [...fs.readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(SITE, "") || "/");

const problems = [];
let largest = { url: "", bytes: 0 };

for (const url of new Set(urls)) {
  const clean = url.replace(/\/$/, "");
  const html = fs.readFileSync(`out${clean === "" ? "/index" : clean}.html`, "utf8");
  const fail = (message) => problems.push(`${url}: ${message}`);
  const count = (pattern) => (html.match(pattern) ?? []).length;

  const hidden = count(/class="[^"]*\bopacity-0\b/g);
  if (hidden) fail(`${hidden} element(s) with opacity-0 in the static HTML stay invisible until JavaScript runs`);

  const originals = html.match(/(?:src|poster|srcset|imagesrcset|href)="\/(?:Products|Services)\/[^"]*\.(?:jpe?g|png|webp|avif)/gi) ?? [];
  if (originals.length) fail(`${originals.length} full-size catalog image(s), e.g. ${originals[0].replace(/^[^"]*"/, "")}`);

  const fonts = count(/<link[^>]*rel="preload"[^>]*as="font"/g);
  if (fonts > MAX_FONT_PRELOADS) fail(`${fonts} font preloads (limit ${MAX_FONT_PRELOADS})`);

  const high = count(/fetchpriority="high"/gi);
  if (high > MAX_HIGH_PRIORITY) fail(`${high} high-priority images or preloads (limit ${MAX_HIGH_PRIORITY})`);

  const flights = [...html.matchAll(/<script([^>]*)src="(\/_flight\/[^"]+)"/g)];
  if (flights.length !== 1) fail(`${flights.length} hydration scripts, expected 1`);
  for (const [, attributes, src] of flights) {
    // externalize-flight.mjs explains why this must stay a plain blocking script.
    if (/\b(defer|async)\b/.test(attributes)) fail("the hydration script must not be defer or async");
    const bytes = fs.statSync(`out${src}`).size;
    if (bytes > largest.bytes) largest = { url, bytes };
    if (bytes > MAX_FLIGHT_BYTES) fail(`hydration data is ${Math.round(bytes / 1024)} KB (limit ${MAX_FLIGHT_BYTES / 1000} KB)`);
  }
}

for (const problem of problems) console.log(problem);
console.log(
  `check-page-weight: ${problems.length} problem(s) on ${new Set(urls).size} pages; ` +
    `largest hydration data ${Math.round(largest.bytes / 1024)} KB (${largest.url})`
);
process.exit(problems.length ? 1 : 0);
