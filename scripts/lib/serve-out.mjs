/**
 * Static server for the built site in out/, for the audit scripts.
 *
 * Does what Cloudflare Pages does for a page request: an extensionless URL serves the
 * .html file, and an unknown path serves out/404.html with status 404. It does not read
 * _redirects or _headers, and there is no /api: anything that isn't a GET or HEAD gets
 * 405, so a form can't reach a real endpoint from here.
 *
 * Not `wrangler pages dev`: on this Mac's case-insensitive volume wrangler 404s every
 * /products/* URL (see CLAUDE.md).
 *
 *   import { serveOut } from "./lib/serve-out.mjs";
 *   const server = await serveOut();          // { origin, root, close() }
 *
 *   node scripts/lib/serve-out.mjs --port=4173 --dir=out     to look at it by hand
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

/** The file Pages would serve for a URL path, or null. */
function resolveFile(root, pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, "");
  const candidates = clean === "" ? ["index.html"] : [clean, `${clean}.html`, `${clean}/index.html`];
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    // With the separator: a bare prefix test would also accept a sibling like out-old/.
    if (file.startsWith(root + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

export async function serveOut({ dir = "out", port = 0 } = {}) {
  const root = path.resolve(dir);
  const notFound = path.join(root, "404.html");
  if (!fs.existsSync(path.join(root, "index.html")) || !fs.existsSync(notFound)) {
    throw new Error(`serve-out: ${root} has no index.html or 404.html. Run npm run build first.`);
  }

  const server = http.createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }
    let file = null;
    try {
      file = resolveFile(root, new URL(request.url, "http://localhost").pathname);
    } catch {
      // A malformed escape in the URL: treated as not found.
    }
    const status = file ? 200 : 404;
    file ??= notFound;
    const body = fs.readFileSync(file);
    response.writeHead(status, {
      "Content-Type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
      "Content-Length": body.length,
      // A rebuild between two runs must not be served from a browser's cache.
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    root,
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const option = (name, fallback) =>
    process.argv.slice(2).find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
  const { origin, root } = await serveOut({ dir: option("dir", "out"), port: Number(option("port", "4173")) });
  console.log(`serve-out: ${root} at ${origin}`);
}
