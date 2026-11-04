/**
 * Moves Next's inline hydration data out of every exported HTML file.
 *
 * App Router pages repeat their whole content inside `self.__next_f.push(...)`
 * scripts, which is about half of each file and the main reason every page failed
 * Semrush's 10% text-to-HTML check. The data doesn't need to be inline: Next only
 * requires the pushes to run in order while the document is still loading. So each
 * page gets one hashed external file with the same pushes in the same order.
 *
 * It must be a plain blocking <script>, not defer or async. Next closes the stream
 * straight away if readyState is past "loading", and readyState turns "interactive"
 * before deferred scripts run, so a deferred file throws "Connection closed" and the
 * page never hydrates. It sits where the last inline push was, at the end of <body>,
 * so all content has already been parsed and painted by then.
 *
 * Run after `next build` (see the "build" script). Crawlers lose nothing: the
 * visible text stays in the HTML, and JSON-LD scripts are left inline.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const OUT = "out";
const FLIGHT_DIR = "_flight";
// Bare <script> only: every other inline script (JSON-LD, gtag) has attributes or
// different content, and the payload escapes "</script" so this can't overrun.
const FLIGHT_SCRIPT = /<script>((?:\(self\.__next_f=self\.__next_f\|\|\[\]\)|self\.__next_f)\.push\(.*?\))<\/script>/gs;

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "_next" ? [] : htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

fs.mkdirSync(path.join(OUT, FLIGHT_DIR), { recursive: true });

let pages = 0;
let moved = 0;
for (const file of htmlFiles(OUT)) {
  const html = fs.readFileSync(file, "utf8");
  const pushes = [...html.matchAll(FLIGHT_SCRIPT)];
  if (pushes.length === 0) continue;

  const js = pushes.map((m) => `${m[1]};`).join("\n");
  const hash = crypto.createHash("sha256").update(js).digest("hex").slice(0, 16);
  fs.writeFileSync(path.join(OUT, FLIGHT_DIR, `${hash}.js`), js);

  let seen = 0;
  const rewritten = html.replace(FLIGHT_SCRIPT, () =>
    ++seen === pushes.length ? `<script src="/${FLIGHT_DIR}/${hash}.js"></script>` : ""
  );
  fs.writeFileSync(file, rewritten);
  pages += 1;
  moved += html.length - rewritten.length;
}

console.log(`externalize-flight: ${pages} pages, ${Math.round(moved / 1024)} KB moved to /${FLIGHT_DIR}/`);
