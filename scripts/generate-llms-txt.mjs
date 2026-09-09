/**
 * Regenerates public/llms.txt from the built export in out/.
 *
 * Run AFTER `npm run build`, then rebuild so the file is copied into out/:
 *   npm run build && npm run llms && npm run build
 *
 * Driven by out/sitemap.xml rather than by walking out/, deliberately: on a
 * case-insensitive filesystem Next's out/services/ merges into the copied
 * public/Services/ asset folder, so directory paths are not a reliable guide
 * to URLs. The sitemap is.
 */
import fs from "node:fs";

const SITE = "https://alarabiacarpets.com";

const decode = (s) =>
  s
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(SITE, ""))
  .map((u) => (u === "" ? "/" : u));

const pages = {};
const missing = [];
for (const url of urls) {
  const file = "out" + (url === "/" ? "/index" : url) + ".html";
  if (!fs.existsSync(file)) {
    missing.push(url);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const title = /<title>([^<]*)<\/title>/.exec(html);
  const desc = /<meta name="description" content="([^"]*)"/.exec(html);
  pages[url] = {
    title: decode(title ? title[1] : url).replace(/ \| Al Arabia Carpets$/, "").trim(),
    desc: decode(desc ? desc[1] : "").trim(),
  };
}
if (missing.length) {
  console.error("No built HTML for these sitemap URLs:\n  " + missing.join("\n  "));
  process.exit(1);
}

const section = (heading, list) => {
  const rows = list
    .filter((u) => pages[u])
    .map((u) => `- [${pages[u].title}](${SITE}${u}): ${pages[u].desc}`);
  return rows.length ? `## ${heading}\n\n${rows.join("\n")}\n` : "";
};
const under = (prefix) => urls.filter((u) => u.startsWith(prefix + "/")).sort();
const categories = [
  "/products/carpet",
  "/products/barkia",
  "/products/curtain",
  "/products/majlis-sofa",
  "/products/interior",
];

const output =
  [
    "# Al Arabia Carpets",
    "",
    "> Supply and installation of carpets, vinyl and SPC flooring, curtains, custom furniture, cabinetry and interior fit-out across Qatar. Based on Al Mansoura St, Doha. Free on-site measurement, with installation included in quoted prices. Contact: +974 5551 2858 / info@alarabiacarpets.com",
    "",
    "This file lists the site's pages so language models and AI search engines can",
    "find the right one. Service pages describe work we carry out; product pages",
    "describe items in the catalogue; guides are editorial. Prices are quoted after",
    "an on-site survey rather than published, so no page states a price.",
    "",
    section("Services", ["/services", ...under("/services")]),
    section("Product categories", ["/products", ...categories]),
    section("Guides", ["/guides", ...under("/guides")]),
    section("Products", under("/products").filter((u) => !categories.includes(u))),
    section("Company", ["/about", "/contact"]),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd() + "\n";

fs.writeFileSync("public/llms.txt", output);
console.log(`public/llms.txt: ${Object.keys(pages).length} pages`);
