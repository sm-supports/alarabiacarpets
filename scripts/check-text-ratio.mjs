/**
 * Reports pages under Semrush's 10% text-to-HTML threshold, run against out/.
 *
 * Semrush's published 0.05 for /services/wardrobes matched this formula on the live
 * page: text outside <script>/<style> over total HTML. Bytes and characters are the
 * same for English; Arabic text is 2 bytes per character, so this counts characters,
 * the stricter reading, rather than rely on how Semrush treats it.
 *
 * Pages come from the sitemap, not a directory walk: on a case-insensitive volume
 * Next's out/products merges into public/Products, so paths aren't a reliable guide.
 * Exits 1 if any page is under the threshold.
 */
import fs from "node:fs";

const THRESHOLD = 0.1;
const SITE = "https://alarabiacarpets.com";

const urls = [...fs.readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(SITE, "") || "/");

const rows = [...new Set(urls)].map((url) => {
  const clean = url.replace(/\/$/, "");
  const file = `out${clean === "" ? "/index" : clean}.html`;
  const html = fs.readFileSync(file, "utf8");
  const text = html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { url, ratio: text.length / html.length, html: html.length, text: text.length };
});

rows.sort((a, b) => a.ratio - b.ratio);
const failing = rows.filter((r) => r.ratio < THRESHOLD);

for (const r of failing) {
  const pct = (r.ratio * 100).toFixed(1).padStart(4);
  console.log(`${pct}%  html ${String(r.html).padStart(6)}  text ${String(r.text).padStart(5)}  ${r.url}`);
}
console.log(`check-text-ratio: ${rows.length - failing.length}/${rows.length} pages at or above ${THRESHOLD * 100}%`);
process.exit(failing.length ? 1 : 0);
