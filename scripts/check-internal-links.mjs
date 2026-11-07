/**
 * Each keyword has one page meant to rank for it. Google left several of those pages
 * unindexed while the footer and /services were their only links, so this counts the
 * pages that link to each one from inside <main>, in both languages. The footer, the
 * /services and /products hubs and the page itself do not count.
 *
 * The keyword-to-page table is in CLAUDE.md; keep the two in step. Run against out/.
 * Exits 1 on any failure.
 */
import fs from "node:fs";

const SITE = "https://alarabiacarpets.com";
const MIN_LINKS = 4;
const OWNERS = [
  "/products/carpet",
  "/products/event-normal-carpet",
  "/services/office-carpet",
  "/services/vinyl-flooring",
  "/services/wallpaper",
  "/services/gypsum-c-board-fixing",
  "/products/grass-carpet",
  "/products/pvc-barkia",
  "/services/parquet-flooring",
  "/services/sofa-making",
  "/services/sofa-upholstery",
  "/products/curtain",
  "/services/cabinets",
  "/services/kitchen-cabinets",
  "/services/wardrobes",
  "/services/tv-unit-design",
];
const HUBS = new Set(["/services", "/products", "/ar/services", "/ar/products"]);

const urls = [...new Set(
  [...fs.readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/")
)];

const linkedFrom = new Map();
for (const url of urls) {
  if (HUBS.has(url)) continue;
  const html = fs.readFileSync(`out${url === "/" ? "/index" : url}.html`, "utf8");
  const main = /<main\b[\s\S]*<\/main>/.exec(html)?.[0] ?? "";
  for (const [, href] of main.matchAll(/<a\b[^>]*\bhref="([^"#?]+)/g)) {
    if (href === url) continue;
    if (!linkedFrom.has(href)) linkedFrom.set(href, new Set());
    linkedFrom.get(href).add(url);
  }
}

const problems = [];
let fewest = Infinity;
for (const owner of OWNERS.flatMap((path) => [path, `/ar${path}`])) {
  const count = linkedFrom.get(owner)?.size ?? 0;
  fewest = Math.min(fewest, count);
  if (!urls.includes(owner)) problems.push(`${owner}: not in the sitemap`);
  if (count < MIN_LINKS) problems.push(`${owner}: linked from ${count} page(s) inside <main>, needs ${MIN_LINKS}`);
}

for (const problem of problems) console.log(problem);
console.log(`check-internal-links: ${problems.length} problem(s) on ${OWNERS.length * 2} keyword pages; fewest links ${fewest}`);
process.exit(problems.length ? 1 : 0);
