import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://alarabiacarpets.com";
const TODAY = new Date().toISOString().split("T")[0];

const productsFile = readFileSync(
  resolve(__dirname, "../src/data/products.ts"),
  "utf-8"
);

const idMatches = productsFile.matchAll(/"id":\s*"([^"]+)"/g);
const productIds = [...idMatches].map((m) => m[1]);

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/products", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
];

const urls = [
  ...staticPages.map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ),
  ...productIds.map(
    (id) => `  <url>
    <loc>${SITE_URL}/products/${id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outPath = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(outPath, sitemap);
console.log(`Sitemap generated: ${productIds.length} products + ${staticPages.length} static pages → ${outPath}`);
