/**
 * Generates the images product cards show, in public/Products/cards/. Runs before
 * `npm run dev` and `npm run build`, and only redoes images whose source changed.
 * The output is gitignored. To regenerate after changing the settings below, delete
 * that folder.
 *
 * Cards are about 328 CSS px wide on a phone, but the catalog photos are up to 1280 px
 * on the long edge. Product pages and JSON-LD keep using the originals. These are
 * cropped to the card's 4:3 box, centred like object-cover, so the framing is the same.
 *
 * Fails if products.ts points at an image that doesn't exist. The same path rule is
 * in src/lib/card-image.ts.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 720;
const HEIGHT = 540;
const QUALITY = 72;

const PUBLIC = path.resolve("public");
const PREFIX = "/Products/";
const OUT = path.join(PUBLIC, "Products", "cards");

const data = fs.readFileSync("src/data/products.ts", "utf8");
const sources = new Set(
  [...data.matchAll(/["']?(?:src|imageSrc)["']?:\s*"([^"]+)"/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith(PREFIX) && !/\.mp4$/i.test(src))
);

const missing = [...sources].filter((src) => !fs.existsSync(path.join(PUBLIC, src)));
if (missing.length > 0) {
  console.error(`build-card-images: products.ts points at missing images:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const wanted = new Set();
let made = 0;
for (const src of sources) {
  const input = path.join(PUBLIC, src);
  const output = path.join(OUT, `${src.slice(PREFIX.length)}.webp`);
  wanted.add(output);
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs) continue;

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(input)
    .rotate()
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre", withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(output);
  made += 1;
}

// A removed product's image would otherwise keep getting deployed.
let removed = 0;
for (const entry of fs.readdirSync(OUT, { recursive: true, withFileTypes: true })) {
  const file = path.join(entry.parentPath, entry.name);
  if (entry.isFile() && !wanted.has(file)) {
    fs.rmSync(file);
    removed += 1;
  }
}

console.log(`build-card-images: ${wanted.size} images, ${made} generated, ${removed} removed`);
