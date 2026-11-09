/**
 * The site's service worker. It does one thing: when a page can't load because the
 * phone has no connection, it answers with a page of its own (S14 in the mobile
 * redesign plan) instead of the browser's error screen.
 *
 * Rules, each there for a reason:
 *   - Page loads only (request.mode "navigate"). Every other request goes to the network
 *     untouched; in Chrome the route added at install keeps them away from this file.
 *   - No Cache API, nothing stored. Every page comes from the network, so nothing can go
 *     stale. The network's Response is returned as it is, never copied, so 301, 308, 404
 *     and 5xx reach the browser unchanged (/products/sofa must keep its 301).
 *   - The offline page is built here, by path: Arabic for /ar and /ar/..., English for
 *     the rest. Not an /offline.html file: Pages would 308 it to /offline, and Qatar's
 *     redirect rule would send that to /ar/offline, a 404.
 *   - Self-contained: no imports, inline styles. The phone number and the opening hours
 *     are copies of src/lib/site.ts and formStates.open in src/i18n/*.client.ts, and
 *     scripts/check-consistency.mjs fails the build when they drift.
 *   - The draft check reads the contact form's sessionStorage entry the way
 *     src/lib/draft.ts writes it (key "contact-draft", { v: 1, draft: { name, email,
 *     message } }). Change both together.
 *
 * Release and rollback:
 *   - On or off: SERVICE_WORKER in src/lib/site.ts. Off (the default) registers nothing
 *     and unregisters any copy a browser already has, after the page loads.
 *   - Kill switch, when this file itself is broken: copy scripts/sw-kill.js over this
 *     file, keep the name, set SERVICE_WORKER to false and deploy. Browsers check
 *     /sw.js on every page load (public/_headers serves it no-cache), install the
 *     replacement, which unregisters itself and reloads the tabs it controls. Leave it
 *     deployed for months.
 *   - Never delete or rename this file: a 404 on the update check keeps the old worker
 *     running.
 */

const COPY = {
  en: {
    lang: "en",
    dir: "ltr",
    brand: "Al Arabia Carpets",
    badge: "OFFLINE",
    headline: "No connection.",
    body: "Turn on Wi-Fi or mobile data. This page reloads when you're back.",
    kept: "Your text is still here.",
    calls: "Calls don't need internet.",
    open: "We're open every day, 8:00 AM to 10:00 PM.",
    tryAgain: "Try again",
    call: "Call",
  },
  ar: {
    lang: "ar-QA",
    dir: "rtl",
    brand: "سجاد العربية",
    badge: "بدون إنترنت",
    headline: "ما فيه اتصال حاليًا.",
    body: "شغّل الواي فاي أو البيانات، والصفحة ترجع أول ما يرجع الاتصال.",
    kept: "اللي كتبته باقي هنا.",
    calls: "المكالمات ما تحتاج إنترنت.",
    open: "نفتح يوميًا من 8:00 صباحًا إلى 10:00 مساءً.",
    tryAgain: "حاول مرة ثانية",
    call: "اتصل",
  },
};

const PHONE = "+974 5551 2858";
const TEL = "tel:+97455512858";

// The site's .cta and .cta-2 (src/index.css), brand colours, 48px buttons.
const CSS = `
*,::before,::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;color-scheme:light}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;background:#FAFAFA;color:#262626;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Tahoma,Arial,sans-serif;font-size:15px;line-height:1.7}
[dir=rtl] body{line-height:1.9}
main{width:100%;max-width:28rem;padding:24px;background:#fff;border:1px solid #E5E5E5;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.06)}
p{margin:0}
.br{margin-bottom:12px;color:#0A2A1F;font-family:'Playfair Display',Georgia,serif;font-weight:600}
.br::after{content:"";display:block;width:32px;height:2px;margin-top:6px;background:#C5A572}
.bd{display:inline-block;margin-bottom:8px;padding:4px 12px;border-radius:9999px;background:#D3E3DD;color:#0A2A1F;font-size:12px;line-height:16px;font-weight:600}
h1{margin:0;color:#0A2A1F;font-size:18px;line-height:1.4;font-weight:600}
.fx{display:flex;flex-direction:column;gap:8px;margin-top:8px;color:#404040;font-size:14px}
[hidden]{display:none}
.ac{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.c{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;padding:12px 16px;border:1px solid #0A2A1F;border-radius:9999px;background:#0A2A1F;color:#fff;font:inherit;font-size:14px;line-height:20px;font-weight:600;text-align:center;text-decoration:none;cursor:pointer}
.c2{border-color:rgba(10,42,31,.3);background:#fff;color:#0A2A1F}
.c:focus-visible{outline:2px solid #0A2A1F;outline-offset:2px}
.c:active{transform:scale(.98)}
@media (hover:hover){.c:hover{background:#1E4B3D}.c2:hover{background:#F5F5F5}}
`;

// Inline in the page: shows {kept} when this tab holds a draft with text in it.
const SCRIPT = `(function () {
  try {
    var stored = JSON.parse(sessionStorage.getItem("contact-draft"));
    var draft = stored && stored.v === 1 && stored.draft;
    if (draft && typeof draft.name === "string" && typeof draft.email === "string" && typeof draft.message === "string" &&
        (draft.name + draft.email + draft.message).trim() !== "") {
      document.getElementById("kept").hidden = false;
    }
  } catch (e) {}
  document.getElementById("retry").addEventListener("click", function () { location.reload(); });
  addEventListener("online", function () { location.reload(); });
})();`;

/**
 * The page a request stands for. A tapped link loads its page's data with fetch() as
 * /about.txt (/index.txt for Home), which this worker leaves alone. When that fetch fails,
 * Next (15.5, static export) falls back to loading that .txt address itself, not the page's,
 * and reloading it online would show raw data. The site's real text files keep theirs.
 */
const TEXT_FILES = ["/robots.txt", "/llms.txt"];
function pagePath(path) {
  if (!path.endsWith(".txt") || TEXT_FILES.includes(path)) return path;
  return path.slice(0, path.endsWith("/index.txt") ? -10 : -4) || "/";
}

function offlinePage(url) {
  const requested = new URL(url).pathname;
  const path = pagePath(requested);
  const t = path === "/ar" || path.startsWith("/ar/") ? COPY.ar : COPY.en;
  // Shows the page's own address, so Try again and the reload when back online load it.
  const address =
    path === requested
      ? ""
      : `<script>try { history.replaceState(null, "", ${JSON.stringify(path + new URL(url).search).replace(/</g, "\\u003c")}); } catch (e) {}</script>\n`;
  const html = `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${t.headline}</title>
${address}<style>${CSS}</style>
</head>
<body>
<main>
<p class="br">${t.brand}</p>
<p class="bd">${t.badge}</p>
<h1>${t.headline}</h1>
<div class="fx">
<p id="kept" hidden>${t.kept}</p>
<p>${t.body}</p>
<p>${t.calls} ${t.open}</p>
</div>
<div class="ac">
<button type="button" id="retry" class="c c2">${t.tryAgain}</button>
<a href="${TEL}" class="c"><span>${t.call} <bdi dir="ltr">${PHONE}</bdi></span></a>
</div>
</main>
<script>${SCRIPT}</script>
</body>
</html>`;
  return new Response(html, {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

self.addEventListener("install", (event) => {
  // A new version, the kill switch included, takes over without waiting for tabs to close.
  self.skipWaiting();
  // Chrome's static routing: everything but a page load goes straight to the network
  // without waking this worker. Browsers without it reach the early return in "fetch".
  try {
    if (typeof event.addRoutes === "function") {
      event.waitUntil(
        event.addRoutes([{ condition: { not: { requestMode: "navigate" } }, source: "network" }]).catch(() => {})
      );
    }
  } catch {
    // An older shape of the API: the fetch handler covers it.
  }
});

self.addEventListener("activate", (event) => {
  // The page request starts while this worker wakes up, so a page load costs no extra time.
  event.waitUntil(
    self.registration.navigationPreload ? self.registration.navigationPreload.enable().catch(() => {}) : Promise.resolve()
  );
});

async function pageOrOffline(event) {
  try {
    const preloaded = await event.preloadResponse;
    if (preloaded) return preloaded;
  } catch {
    // The preload failed. One plain fetch decides.
  }
  try {
    return await fetch(event.request);
  } catch {
    return offlinePage(event.request.url);
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(pageOrOffline(event));
});
