/**
 * Lab speed test on a simulated slow phone, against the built site in out/.
 *
 *   npm run build && npm run perf                 the default pages
 *   npm run perf -- /products /ar/products        just these
 *   npm run perf -- --runs=3                      median of 3 runs per page (steadier)
 *   npm run perf -- --dir=/path/to/another/out    compare another build
 *
 * Lighthouse's mobile preset: a mid-range Android phone (4x CPU slowdown) on slow 4G
 * (1.6 Mbps, 150 ms round trip). That is roughly a budget phone on a weak signal, and
 * it is where the site is slowest. Numbers move by 10% or so between runs, so this is
 * a command to run and read, not a gate in `npm run deploy`. For what real visitors
 * get, see the LCP / INP / CLS events in GA4 (src/components/WebVitals.tsx).
 *
 * Serves out/ itself rather than through `wrangler pages dev`: on this Mac's
 * case-insensitive volume wrangler 404s every /products/* URL (see CLAUDE.md), and
 * this server compresses with Brotli like Cloudflare does. Third-party scripts
 * (Google tag, Tawk) load from the real internet, so the test needs a connection.
 *
 * Lighthouse is fetched by npx at a pinned version and needs Chrome installed. Set
 * CHROME_PATH if it isn't found.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";

// 12.x is the last line that runs on Node 20.
const LIGHTHOUSE = "lighthouse@12.8.2";

const DEFAULT_PAGES = [
  "/",
  "/ar",
  "/products",
  "/ar/products",
  "/contact",
  "/products/carpet",
  "/products/artificial-grass-installation-work",
  "/services/wardrobes",
];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

const args = process.argv.slice(2);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
const root = path.resolve(option("dir", "out"));
const runs = Math.max(1, Number(option("runs", "1")) || 1);
const pages = args.filter((a) => a.startsWith("/"));
if (pages.length === 0) pages.push(...DEFAULT_PAGES);

if (!fs.existsSync(path.join(root, "index.html"))) {
  console.error(`check-perf: ${root}/index.html not found. Run npm run build first.`);
  process.exit(1);
}

/** The file Cloudflare Pages would serve for a URL path, or null. */
function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, "");
  const candidates = clean === "" ? ["index.html"] : [clean, `${clean}.html`, `${clean}/index.html`];
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    // With the separator: a bare prefix test would also accept a sibling like out-old/.
    if (file.startsWith(root + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

const server = http.createServer((request, response) => {
  const { pathname } = new URL(request.url, "http://localhost");
  let file = null;
  try {
    file = resolveFile(pathname);
  } catch {
    // A malformed escape in the URL: treated as not found.
  }
  const status = file ? 200 : 404;
  file ??= path.join(root, "404.html");
  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  let body = fs.readFileSync(file);
  const headers = { "Content-Type": type };
  if (COMPRESSIBLE.test(type) && /\bbr\b/.test(request.headers["accept-encoding"] ?? "")) {
    body = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } });
    headers["Content-Encoding"] = "br";
  }
  headers["Content-Length"] = body.length;
  response.writeHead(status, headers);
  response.end(body);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "check-perf-"));

// One page load should take well under a minute; past this something is stuck.
const LIGHTHOUSE_TIMEOUT_MS = 180_000;

/** Runs a command without blocking: the server above has to keep answering Chrome. */
function run(command, commandArgs) {
  return new Promise((resolve) => {
    // Its own process group: npx starts Lighthouse, which starts Chrome, and killing
    // only npx would leave those two running and holding the stderr pipe open.
    const child = spawn(command, commandArgs, { stdio: ["ignore", "ignore", "pipe"], detached: true });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk));
    const timer = setTimeout(() => {
      stderr += `\ntimed out after ${LIGHTHOUSE_TIMEOUT_MS / 1000} s`;
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        child.kill("SIGKILL");
      }
    }, LIGHTHOUSE_TIMEOUT_MS);
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ status: 1, stderr: String(error) });
    });
    // 'exit', not 'close': 'close' waits for every holder of the pipe.
    child.on("exit", (status) => {
      clearTimeout(timer);
      resolve({ status: status ?? 1, stderr });
    });
  });
}

async function measure(page) {
  const output = path.join(temp, "report.json");
  const result = await run("npx", [
    "--yes",
    LIGHTHOUSE,
    `${origin}${page}`,
    "--only-categories=performance",
    "--output=json",
    `--output-path=${output}`,
    "--quiet",
    "--chrome-flags=--headless=new",
  ]);
  if (result.status !== 0 || !fs.existsSync(output)) {
    throw new Error(`Lighthouse failed for ${page}:\n${result.stderr.slice(-800)}`);
  }
  const report = JSON.parse(fs.readFileSync(output, "utf8"));
  fs.rmSync(output);
  const value = (id) => report.audits[id]?.numericValue ?? NaN;
  const requests = report.audits["network-requests"]?.details?.items ?? [];
  const bytes = (kind) =>
    requests.filter((r) => !kind || r.resourceType === kind).reduce((sum, r) => sum + (r.transferSize ?? 0), 0);
  return {
    score: Math.round((report.categories.performance.score ?? 0) * 100),
    fcp: value("first-contentful-paint"),
    lcp: value("largest-contentful-paint"),
    tbt: value("total-blocking-time"),
    cls: value("cumulative-layout-shift"),
    total: bytes(),
    js: bytes("Script"),
    img: bytes("Image"),
    requests: requests.length,
  };
}

const seconds = (ms) => `${(ms / 1000).toFixed(1)} s`;
const kb = (n) => `${Math.round(n / 1024)} KB`;
const rows = [];
let failed = false;
try {
  for (const page of pages) {
    process.stdout.write(`check-perf: ${page} `);
    const results = [];
    for (let i = 0; i < runs; i += 1) {
      results.push(await measure(page));
      process.stdout.write(".");
    }
    process.stdout.write("\n");
    // The run with the median LCP, so the row is one real page load, not a blend.
    const pick = [...results].sort((a, b) => a.lcp - b.lcp)[Math.floor((results.length - 1) / 2)];
    rows.push({
      page,
      score: pick.score,
      FCP: seconds(pick.fcp),
      LCP: seconds(pick.lcp),
      "blocking time": `${Math.round(pick.tbt)} ms`,
      CLS: pick.cls.toFixed(3),
      transferred: kb(pick.total),
      scripts: kb(pick.js),
      images: kb(pick.img),
      requests: pick.requests,
    });
  }
} catch (error) {
  failed = true;
  console.error(`\n${error.message}`);
} finally {
  server.close();
  fs.rmSync(temp, { recursive: true, force: true });
}

if (rows.length) console.table(rows);
if (!failed) console.log(`check-perf: simulated slow 4G and a mid-range phone, ${runs} run(s) per page, ${root}`);
process.exit(failed ? 1 : 0);
