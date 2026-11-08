/**
 * Installed Chrome, driven by puppeteer-core, for the audit scripts. Three things matter:
 *
 *   - Nothing leaves this machine. installRoutes() aborts every request to another
 *     origin, so Google tag, Google Ads and Tawk never see an audit run, and it answers
 *     /api/* itself, so no real form can be sent.
 *   - Turnstile's api.js is replaced with a fake window.turnstile, because the real site
 *     key fails on localhost (110200). The test drives it through window.__turnstileStub.
 *   - /api/contact answers with a chosen scenario, using the same status and body the
 *     Function returns for that case, including its `code` field.
 *
 *   const browser = await launchBrowser();
 *   const page = await newPage(browser, { width: 390 });
 *   const routes = await installRoutes(page, { origin, turnstile: "pass", contact: "send_failed" });
 *   await gotoSettled(page, `${origin}/contact`);
 *   routes.setContact("network", "ok");    // this attempt fails, the retry succeeds
 *   await routes.setOffline(true);         // navigator.onLine false and every request fails
 *   routes.contactRequests;                // bodies the page posted
 *
 * Set CHROME_PATH if Chrome isn't in /Applications.
 */
import fs from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const PHONE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
const PHONE_BELOW = 768;

export async function launchBrowser() {
  const executablePath = CHROME_CANDIDATES.find((file) => fs.existsSync(file));
  if (!executablePath) throw new Error("Chrome not found. Set CHROME_PATH.");
  return puppeteer.launch({ executablePath, headless: true });
}

/**
 * A tab at this width. Below 768 it emulates a touch phone, like the site's md breakpoint.
 * Reduced motion is on so .reveal and .hero-in can't leave content transparent in a
 * measurement or a screenshot. Pass reducedMotion: false to test the animations.
 */
export async function newPage(browser, { width = 390, height, javascript = true, reducedMotion = true } = {}) {
  const page = await browser.newPage();
  const phone = width < PHONE_BELOW;
  await page.setViewport({
    width,
    height: height ?? (phone ? 844 : 900),
    isMobile: phone,
    hasTouch: phone,
    deviceScaleFactor: phone ? 2 : 1,
  });
  if (phone) await page.setUserAgent(PHONE_USER_AGENT);
  if (!javascript) await page.setJavaScriptEnabled(false);
  if (reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  return page;
}

/**
 * Every answer functions/api/contact.ts gives, status and body exactly as it sends them
 * (fail() and respond() there). bot_unavailable is 403 like bot_rejected because
 * verifyTurnstileToken fails closed; the code tells them apart. The Function never
 * answers 409: when Resend says 409 (it already has a send under this submission's
 * idempotency key) the Function answers 200, so `resend_409` is that 200. `unknown_code`
 * and `not_json` are what the form must survive anyway: a code it doesn't know, and a
 * platform error page.
 */
export const CONTACT_SCENARIOS = {
  ok: { status: 200, body: { message: "Email sent successfully" } },
  resend_409: { status: 200, body: { message: "Email sent successfully" } },
  bad_body: { status: 400, body: { error: "Invalid request body", code: "bad_body" } },
  bot_required: { status: 400, body: { error: "Bot verification required", code: "bot_required" } },
  bot_rejected: { status: 403, body: { error: "Bot verification failed", code: "bot_rejected" } },
  bot_unavailable: { status: 403, body: { error: "Bot verification failed", code: "bot_unavailable" } },
  fields_required: { status: 400, body: { error: "Name, email, and message are required", code: "fields_required" } },
  too_long: { status: 400, body: { error: "One or more fields are too long", code: "too_long" } },
  invalid_email: { status: 400, body: { error: "Invalid email format", code: "invalid_email" } },
  send_failed: { status: 502, body: { error: "Failed to send email", code: "send_failed" } },
  server_error: { status: 500, body: { error: "Failed to send email", code: "send_failed" } },
  unknown_code: { status: 400, body: { error: "Something new", code: "not_a_known_code" } },
  not_json: { status: 500, raw: "<html><body>Internal Server Error</body></html>" },
};

/** The fake api.js. `mode` is what each widget does when rendered or reset. */
function turnstileStubSource(mode) {
  return `(function () {
  var stub = { mode: ${JSON.stringify(mode)}, widgets: {}, renders: 0, resets: 0, tokens: 0 };
  function call(widget, name, argument) {
    var callback = widget.options[name];
    if (typeof callback === "function") callback(argument);
  }
  function token(widget) {
    stub.tokens += 1;
    call(widget, "callback", "stub-token-" + stub.tokens);
  }
  function showBox(widget, visible) {
    widget.box.style.display = visible ? "flex" : "none";
  }
  function start(widget) {
    var mode = stub.mode;
    // A real interaction-only widget stays invisible unless it needs a tap.
    showBox(widget, widget.options.appearance !== "interaction-only" || mode === "challenge");
    setTimeout(function () {
      if (mode === "pass") token(widget);
      else if (mode === "challenge") call(widget, "before-interactive-callback");
      else if (mode === "error") call(widget, "error-callback", "stub-error");
      else if (mode === "timeout") call(widget, "timeout-callback");
      else if (mode === "unsupported") call(widget, "unsupported-callback");
      else if (mode === "expire") { token(widget); call(widget, "expired-callback"); }
      // "pending": nothing happens until the test calls solve() or fire().
    }, 50);
  }
  function only() {
    var ids = Object.keys(stub.widgets);
    return stub.widgets[ids[ids.length - 1]];
  }
  stub.setMode = function (mode) { stub.mode = mode; };
  stub.solve = function () {
    var widget = only();
    if (!widget) return;
    call(widget, "after-interactive-callback");
    showBox(widget, widget.options.appearance !== "interaction-only");
    token(widget);
  };
  stub.fire = function (name, argument) {
    var widget = only();
    if (widget) call(widget, name, argument);
  };
  window.__turnstileStub = stub;
  window.turnstile = {
    ready: function (callback) { callback(); },
    render: function (container, options) {
      var element = typeof container === "string" ? document.querySelector(container) : container;
      stub.renders += 1;
      var id = "stub-" + stub.renders;
      var box = document.createElement("div");
      box.textContent = "Security check (stub)";
      box.dataset.turnstileStub = id;
      box.style.cssText = "width:300px;height:65px;display:none;align-items:center;justify-content:center;border:1px dashed #C5A572;color:#C5A572;font:12px sans-serif";
      element.appendChild(box);
      stub.widgets[id] = { options: options, box: box };
      if (options.execution !== "execute") start(stub.widgets[id]);
      return id;
    },
    reset: function (id) {
      stub.resets += 1;
      var widget = stub.widgets[id] || only();
      if (widget) start(widget);
    },
    remove: function (id) {
      var widget = stub.widgets[id];
      if (widget) widget.box.remove();
      delete stub.widgets[id];
    },
    execute: function () { var widget = only(); if (widget) start(widget); },
    getResponse: function () { return stub.tokens ? "stub-token-" + stub.tokens : undefined; },
    isExpired: function () { return false; },
  };
  var src = document.currentScript && document.currentScript.src;
  var onload = src && new URL(src).searchParams.get("onload");
  if (onload && typeof window[onload] === "function") window[onload]();
})();`;
}

const isTurnstileScript = (url) =>
  url.hostname === "challenges.cloudflare.com" && url.pathname.startsWith("/turnstile/");

/**
 * Takes over all of the page's requests.
 *
 * turnstile: "pass" | "challenge" | "pending" | "error" | "timeout" | "unsupported" |
 *   "expire", or at the script level "script-fail" | "script-hang".
 * contact: a key of CONTACT_SCENARIOS, or "network" (the fetch rejects), or "hang" (no
 *   answer ever, so the page's own timeout fires), or { scenario, delayMs }. A list runs
 *   in order, one per request, and its last entry repeats.
 * documentsOnly: abort every subresource of the site too, for reading the static HTML.
 */
export async function installRoutes(page, { origin, turnstile = "pass", contact = "ok", documentsOnly = false } = {}) {
  if (!origin) throw new Error("installRoutes needs the site's origin");
  const state = {
    turnstile,
    contact: [].concat(contact),
    offline: false,
    used: 0,
  };
  const contactRequests = [];
  const otherHosts = new Set();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  async function answerContact(request) {
    let body = null;
    try {
      body = JSON.parse(request.postData() ?? "");
    } catch {
      body = request.postData() ?? null;
    }
    contactRequests.push({ method: request.method(), body });
    const step = state.contact[Math.min(state.used, state.contact.length - 1)];
    state.used += 1;
    const { scenario, delayMs = 0 } = typeof step === "string" ? { scenario: step } : step;
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (scenario === "network") return request.abort("failed");
    if (scenario === "hang") return undefined;
    const answer = CONTACT_SCENARIOS[scenario];
    if (!answer) throw new Error(`Unknown contact scenario: ${scenario}`);
    return request.respond(
      "raw" in answer
        ? { status: answer.status, contentType: "text/html", body: answer.raw }
        : { status: answer.status, contentType: "application/json", body: JSON.stringify(answer.body) }
    );
  }

  async function handle(request) {
    const url = new URL(request.url());
    if (url.protocol === "data:" || url.protocol === "blob:") return request.continue();
    if (state.offline) return request.abort("internetdisconnected");
    if (isTurnstileScript(url)) {
      otherHosts.add(url.hostname);
      if (state.turnstile === "script-fail") return request.abort("blockedbyclient");
      if (state.turnstile === "script-hang") return undefined;
      return request.respond({
        status: 200,
        contentType: "text/javascript",
        body: turnstileStubSource(state.turnstile),
      });
    }
    if (url.origin !== origin) {
      otherHosts.add(url.hostname);
      return request.abort("blockedbyclient");
    }
    if (url.pathname === "/api/contact") return answerContact(request);
    if (url.pathname.startsWith("/api/")) {
      return request.respond({ status: 404, contentType: "application/json", body: "{}" });
    }
    if (documentsOnly && request.resourceType() !== "document") return request.abort("blockedbyclient");
    return request.continue();
  }

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    // A request the page cancels while paused rejects here, which is not a failure.
    handle(request).catch((error) => {
      if (/Unknown contact scenario/.test(error.message)) errors.push(error.message);
    });
  });

  return {
    contactRequests,
    otherHosts,
    errors,
    /** Applies from the next time api.js loads, or now through __turnstileStub.setMode. */
    setTurnstile: async (mode) => {
      state.turnstile = mode;
      await page.evaluate((next) => window.__turnstileStub?.setMode(next), mode);
    },
    setContact: (...steps) => {
      state.contact = steps;
      state.used = 0;
    },
    setOffline: async (offline) => {
      state.offline = offline;
      await page.setOfflineMode(offline);
    },
  };
}

/**
 * Loads a URL and waits until React has hydrated and the page has stopped fetching.
 * waitUntil "domcontentloaded" for a page whose load event a hung request holds back
 * (a script added before load, such as Turnstile at desktop widths, delays it).
 */
export async function gotoSettled(page, url, { hydrate = true, waitUntil = "load" } = {}) {
  const response = await page.goto(url, { waitUntil });
  if (hydrate) {
    await page
      .waitForFunction(
        () => Object.keys(document.querySelector("main") ?? document.body).some((key) => key.startsWith("__reactFiber$")),
        { timeout: 5000, polling: 50 }
      )
      .catch(() => {});
    await page.waitForNetworkIdle({ idleTime: 250, timeout: 5000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
  }
  return response;
}

/** Walks down the page so lazy images load and observers fire, then returns to the top. */
export async function scrollThrough(page) {
  const { total, step } = await page.evaluate(() => ({
    total: document.documentElement.scrollHeight,
    step: Math.max(300, Math.floor(window.innerHeight * 0.8)),
  }));
  for (let y = 0; y < total; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
  await page.waitForNetworkIdle({ idleTime: 300, timeout: 8000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((resolve) => setTimeout(resolve, 150));
}
