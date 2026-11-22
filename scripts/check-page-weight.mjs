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
 *   - a page downloading a script of the other language, because both root layouts
 *     imported the same client file directly (see src/app/(en)/client.ts)
 *
 * Pages come from the sitemap, like check-text-ratio. Exits 1 on any failure.
 */
import fs from "node:fs";

const SITE = "https://alarabiacarpets.com";
// English pages preload 3 files. Arabic pages preload 8: both scripts are on screen.
const MAX_FONT_PRELOADS = 8;
const MAX_HIGH_PRIORITY = 2;
// The largest page is about 73 KB (an Arabic category page). Before the product
// grid became a server component, /ar/products was 173 KB.
const MAX_FLIGHT_BYTES = 90_000;

// Chunks under src/app/(en) and src/app/(ar), as they appear in a script tag, the
// hydration data and the navigation payload. The percent-encoded spelling does not
// occur in today's output; it is matched in case a Next upgrade starts encoding it.
const groupChunks = (group, rest = "") => [`chunks/app/(${group})/${rest}`, `chunks/app/%28${group}%29/${rest}`];
const isArabic = (url) => url === "/ar" || url.startsWith("/ar/");

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
  let loaded = html;
  for (const [, attributes, src] of flights) {
    // externalize-flight.mjs explains why this must stay a plain blocking script.
    if (/\b(defer|async)\b/.test(attributes)) fail("the hydration script must not be defer or async");
    const flight = fs.readFileSync(`out${src}`, "utf8");
    loaded += flight;
    const bytes = Buffer.byteLength(flight);
    if (bytes > largest.bytes) largest = { url, bytes };
    if (bytes > MAX_FLIGHT_BYTES) fail(`hydration data is ${Math.round(bytes / 1024)} KB (limit ${MAX_FLIGHT_BYTES / 1000} KB)`);
  }

  // The .txt twin is what a client-side navigation to this page downloads.
  const payload = `out${clean === "" ? "/index" : clean}.txt`;
  if (fs.existsSync(payload)) loaded += fs.readFileSync(payload, "utf8");
  const [own, other] = isArabic(url) ? ["ar", "en"] : ["en", "ar"];
  if (groupChunks(other).some((chunk) => loaded.includes(chunk))) {
    fail("loads a script of the other language; a root layout must take client components from its own client.ts");
  }
  // Also proves the patterns above still match what Next emits.
  if (!groupChunks(own, "layout-").some((chunk) => html.includes(chunk))) {
    fail("does not load its own root-layout script");
  }
}

// The 404 is one document for both languages (src/app/global-not-found.tsx), outside
// the sitemap: it must load neither language's scripts, nor the 85 KB site stylesheet.
{
  const html = fs.readFileSync("out/404.html", "utf8");
  let loaded = html;
  for (const [, src] of html.matchAll(/<script[^>]*src="(\/_flight\/[^"]+)"/g)) loaded += fs.readFileSync(`out${src}`, "utf8");
  if (["en", "ar"].some((group) => groupChunks(group).some((chunk) => loaded.includes(chunk)))) {
    problems.push("/404.html: loads a language's script; global-not-found must not render client components");
  }
  if (/<link[^>]*rel="stylesheet"/.test(html)) problems.push("/404.html: loads a stylesheet; its styles are inline");
}

for (const problem of problems) console.log(problem);
console.log(
  `check-page-weight: ${problems.length} problem(s) on ${new Set(urls).size} pages; ` +
    `largest hydration data ${Math.round(largest.bytes / 1024)} KB (${largest.url})`
);
process.exit(problems.length ? 1 : 0);
