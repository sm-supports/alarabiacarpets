/**
 * Measures the built site in out/ in headless Chrome, with nothing leaving this machine
 * (see scripts/lib/browser.mjs). Not part of `npm run check`.
 *
 *   node scripts/audit-mobile.mjs                  the 10 page types EN and AR, and the 404, at 320, 360, 390
 *   ... --widths=360,390 --langs=en                narrower run
 *   ... --pages=/contact,/ar/contact               these paths instead of the page types
 *   ... --no-404                                   leave out the 404 page
 *   ... --no-js                                    JavaScript off (acceptance 12)
 *   ... --out=file.json                            write the full result
 *   ... --strict                                   exit 1 if a tap target or an input fails
 *   ... --screenshots=dir [--full-page] [--format=jpeg --quality=60]
 *   ... --form[=ok,send_failed,offline]            run the contact form through each outcome
 *   ... --form=flows                               only the multi-step flows (flow:<name>)
 *
 * For each page it records:
 *   - tap targets: every visible control under 44px either way (acceptance 1). A link in
 *     running text doesn't count. A control's area includes an absolutely positioned
 *     ::before or ::after, so a stretched link is measured by what you can tap.
 *   - inputs that compute below 16px, which make iOS zoom the page
 *   - the fixed element at the bottom of the screen, at the top, middle and end of the
 *     page, and whether it stays put. An element marked data-action-bar wins; until
 *     there is one, that's the WhatsApp pill.
 *   - page height, horizontal overflow, the top of the first WhatsApp or call link in
 *     <main>, and the top of the first form field
 *   - which other hosts the page tried to reach. Tawk shows up here, so "no Tawk on
 *     phones" can be checked even though the widget itself is blocked.
 *
 * --form loads /contact with a fake Turnstile and a mocked /api/contact, types a message,
 * presses Send, and checks the state the form ends in (its data-form-state), where focus
 * is, how many requests were posted and whether the text survived (SINGLE below). Single
 * scenarios are the keys of CONTACT_SCENARIOS plus: network, hang, offline, and ts:<mode>
 * for a Turnstile mode (error, timeout, unsupported, expire, pending, challenge,
 * script-fail, script-hang). flow:<name> runs one of FLOWS: early press, a challenge
 * pausing the 15 s clock, the 15 s S8, retries after a lost response, a Resend 409 and a
 * 20 s abort, offline then online, Correct and resend, field errors, a long prefill.
 * Exits 1 if any run ends somewhere it shouldn't. The helpers are exported from
 * lib/browser.mjs for anything more specific.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  CONTACT_SCENARIOS,
  gotoSettled,
  installRoutes,
  launchBrowser,
  newPage,
  scrollThrough,
} from "./lib/browser.mjs";
import { serveOut } from "./lib/serve-out.mjs";

const PAGE_TYPES = [
  ["home", "/"],
  ["products", "/products"],
  ["category", "/products/carpet"],
  ["product", "/products/artificial-grass-installation-work"],
  ["services", "/services"],
  ["service", "/services/wardrobes"],
  ["guides", "/guides"],
  ["guide", "/guides/choosing-carpet-for-qatar-homes"],
  ["about", "/about"],
  ["contact", "/contact"],
];
const NOT_FOUND_PATH = "/this-page-does-not-exist";
const MIN_TAP = 44;
const MIN_INPUT_FONT = 16;

const args = process.argv.slice(2);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;
const flag = (name) => args.includes(`--${name}`);
const list = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

const dir = option("dir", "out");
const widths = list(option("widths", "320,360,390")).map(Number);
const langs = list(option("langs", "en,ar"));
const shots = option("screenshots", null);
const format = option("format", "jpeg");
const quality = Number(option("quality", "60"));
const fullPage = flag("full-page");
const outFile = option("out", null);
const strict = flag("strict");
const javascript = !flag("no-js");
const formArg = option("form", flag("form") ? "all" : null);

const localized = (lang, url) => (lang === "ar" ? (url === "/" ? "/ar" : `/ar${url}`) : url);

function targets() {
  if (option("pages", null)) {
    return list(option("pages", "")).map((url) => ({
      type: url.replace(/^\/(ar\/?)?/, "").replaceAll("/", "_") || "home",
      lang: /^\/ar(\/|$)/.test(url) ? "ar" : "en",
      url,
    }));
  }
  const pages = langs.flatMap((lang) => PAGE_TYPES.map(([type, url]) => ({ type, lang, url: localized(lang, url) })));
  if (!flag("no-404")) pages.push({ type: "404", lang: "both", url: NOT_FOUND_PATH });
  return pages;
}

/** Runs in the page. Takes no closure: puppeteer sends it over as source text. */
function collect(minTap, minFont) {
  const CONTROLS =
    'a[href], button, [role="button"], [role="link"], [role="tab"], [role="menuitem"], input:not([type="hidden"]), select, textarea, summary';
  const px = (n) => Math.round(n * 10) / 10;

  const shown = (element) => {
    if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
    const rect = element.getBoundingClientRect();
    // sr-only text, and anything parked off the side of the screen.
    if (rect.width <= 1 || rect.height <= 1) return false;
    if (rect.right <= 0 || rect.left >= window.innerWidth) return false;
    if (getComputedStyle(element).pointerEvents === "none") return false;
    // Clipped away by a scroller or carousel track. A fixed element escapes its ancestors.
    for (let node = element; node.parentElement; node = node.parentElement) {
      if (getComputedStyle(node).position === "fixed") break;
      const style = getComputedStyle(node.parentElement);
      if (style.overflowX === "visible" && style.overflowY === "visible") continue;
      const box = node.parentElement.getBoundingClientRect();
      if (rect.right <= box.left || rect.left >= box.right || rect.bottom <= box.top || rect.top >= box.bottom) return false;
    }
    return true;
  };

  const inRunningText = (element) => {
    if (element.tagName !== "A" || getComputedStyle(element).display !== "inline") return false;
    let block = element.parentElement;
    while (block && getComputedStyle(block).display === "inline") block = block.parentElement;
    if (!block) return false;
    return block.textContent.replace(element.textContent, "").trim().length > 0;
  };

  const tapSize = (element) => {
    const rect = element.getBoundingClientRect();
    let { width, height } = rect;
    for (const pseudo of ["::before", "::after"]) {
      const style = getComputedStyle(element, pseudo);
      if (style.content === "none" || style.content === "normal" || style.position !== "absolute") continue;
      width = Math.max(width, parseFloat(style.width) || 0);
      height = Math.max(height, parseFloat(style.height) || 0);
    }
    return { width, height };
  };

  const label = (element) => {
    const text =
      element.getAttribute("aria-label") ||
      element.textContent?.replace(/\s+/g, " ").trim() ||
      element.querySelector?.("img")?.getAttribute("alt") ||
      element.getAttribute("placeholder") ||
      element.getAttribute("href") ||
      "";
    return text.slice(0, 60);
  };

  const controls = [...document.querySelectorAll(CONTROLS)].filter(shown);
  const counted = controls.filter((element) => !inRunningText(element));
  const short = new Map();
  for (const element of counted) {
    const { width, height } = tapSize(element);
    if (width + 0.01 >= minTap && height + 0.01 >= minTap) continue;
    const entry = { tag: element.tagName.toLowerCase(), label: label(element), w: px(width), h: px(height) };
    const key = JSON.stringify(entry);
    short.set(key, { ...entry, count: (short.get(key)?.count ?? 0) + 1 });
  }

  const inputs = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')].filter(shown);
  const smallInputs = inputs
    .map((element) => ({ name: element.name || element.id || element.tagName.toLowerCase(), size: parseFloat(getComputedStyle(element).fontSize) }))
    .filter((input) => input.size < minFont);

  const pageTop = (element) => (element ? Math.round(element.getBoundingClientRect().top + window.scrollY) : null);
  const main = document.querySelector("main") ?? document.body;
  const firstCta = [...main.querySelectorAll('a[href*="wa.me"], a[href^="tel:"]')].find(shown);
  const firstField = [...main.querySelectorAll("input:not([type='hidden']), textarea, select")].find(shown);

  return {
    height: document.documentElement.scrollHeight,
    overflowX: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    controls: counted.length,
    runningTextLinks: controls.length - counted.length,
    shortTotal: [...short.values()].reduce((sum, entry) => sum + entry.count, 0),
    short: [...short.values()],
    inputs: inputs.length,
    smallInputs,
    firstCtaTop: pageTop(firstCta),
    firstFieldTop: pageTop(firstField),
  };
}

/** Runs in the page: scrolls to `where` and describes the fixed element at the bottom. */
async function barAt(where, settle) {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const top = where === "top" ? 0 : where === "middle" ? Math.floor(max / 2) : max;
  window.scrollTo({ top, behavior: "instant" });
  // Timers never fire with JavaScript off, and nothing can react to the scroll then anyway.
  if (settle) await new Promise((resolve) => setTimeout(resolve, 80));

  const marked = document.querySelector("[data-action-bar]");
  const fixed = marked
    ? [marked]
    : [...document.querySelectorAll("body *")].filter((element) => {
        if (getComputedStyle(element).position !== "fixed") return false;
        if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1 && rect.bottom > window.innerHeight * 0.6 && rect.top < window.innerHeight;
      });
  if (!fixed.length) return null;
  const widest = fixed.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
  const rect = widest.getBoundingClientRect();
  return {
    label: (widest.getAttribute("aria-label") || widest.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
    left: Math.round(rect.left),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    gapBelow: Math.round(window.innerHeight - rect.bottom),
    others: fixed.length - 1,
  };
}

async function measureBar(page) {
  const samples = {};
  for (const where of ["top", "middle", "end"]) samples[where] = await page.evaluate(barAt, where, javascript);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const values = Object.values(samples).map((sample) => JSON.stringify(sample));
  return { ...samples.top, stable: new Set(values).size === 1, ...(new Set(values).size > 1 && { samples }) };
}

async function screenshot(page, name) {
  fs.mkdirSync(shots, { recursive: true });
  const extension = format === "jpeg" ? "jpg" : format;
  const file = path.join(shots, `${name}.${extension}`);
  await page.screenshot({
    path: file,
    type: format,
    fullPage,
    ...(format === "jpeg" && { quality }),
    ...(format === "webp" && { quality }),
  });
  return file;
}

async function auditPages(browser, origin) {
  const results = [];
  for (const width of widths) {
    for (const target of targets()) {
      const page = await newPage(browser, { width, javascript });
      const routes = await installRoutes(page, { origin });
      const response = await gotoSettled(page, `${origin}${target.url}`, { hydrate: javascript });
      if (javascript) await scrollThrough(page);
      const measured = await page.evaluate(collect, MIN_TAP, MIN_INPUT_FONT);
      const bar = await measureBar(page);
      if (shots) {
        // The home stats count up over 2 s once scrolled past. Let them finish, so two
        // runs give the same picture.
        await new Promise((resolve) => setTimeout(resolve, 2300));
        await screenshot(page, `${target.type}-${target.lang}-${width}`);
      }
      results.push({
        type: target.type,
        lang: target.lang,
        url: target.url,
        width,
        status: response?.status() ?? null,
        ...measured,
        bar,
        otherHosts: [...routes.otherHosts].sort(),
        pageErrors: routes.errors,
      });
      await page.close();
    }
  }
  return results;
}

function printPages(results) {
  console.table(
    results.map((r) => ({
      page: r.url,
      width: r.width,
      status: r.status,
      height: r.height,
      overflowX: r.overflowX,
      controls: r.controls,
      "under 44": r.shortTotal,
      "inputs<16": r.smallInputs.length,
      "first CTA": r.firstCtaTop,
      "first field": r.firstFieldTop,
      bar: r.bar.label !== undefined ? `${r.bar.left},${r.bar.width}x${r.bar.height},gap ${r.bar.gapBelow}${r.bar.stable ? "" : " MOVES"}` : "none",
      errors: r.pageErrors.length,
    }))
  );
  const totals = { short: 0, controls: 0, small: 0, moved: 0, errors: 0 };
  for (const r of results) {
    totals.short += r.shortTotal;
    totals.controls += r.controls;
    totals.small += r.smallInputs.length;
    if (!r.bar.stable) totals.moved += 1;
    totals.errors += r.pageErrors.length;
  }
  console.log(
    `audit-mobile: ${results.length} page loads at ${widths.join(", ")}px: ${totals.short} of ${totals.controls} controls under ${MIN_TAP}px, ` +
      `${totals.small} inputs under ${MIN_INPUT_FONT}px, bar moved on ${totals.moved}, ${totals.errors} page error(s)`
  );
  return totals;
}

const FIELDS = { name: "#contact-name", email: "#contact-email", message: "#contact-message" };
const FORM_TEXT = {
  en: { name: "Audit Test", email: "audit@example.com", message: "Audit message. Sizes to follow." },
  ar: { name: "اختبار", email: "audit@example.com", message: "رسالة اختبار. المقاسات لاحقًا." },
};
// Panel buttons the flows press, as the visitor reads them.
const LABELS = {
  en: { tryAgain: "Try again", send: "Send", correct: "Correct and resend", copy: "Copy", copied: "Copied" },
  ar: { tryAgain: "حاول مرة ثانية", send: "إرسال", correct: "عدّل وأعد الإرسال", copy: "انسخ", copied: "تم النسخ" },
};

/**
 * One press of Send and the state it must end in (data-form-state in ContactSection), with
 * where focus must be: "headline" for the failures the press caused (S7 to S9) and Sent,
 * the Send button for the states that only report (S5, S5b, S11). fields_required and
 * too_long can't come from a form that checks the same rules first, so a Function that
 * still says them has drifted from the form, which shows S7 rather than blame a field.
 */
const SINGLE = {
  ok: { state: "sent", focus: "headline" },
  resend_409: { state: "sent", focus: "headline" },
  bad_body: { state: "refused", focus: "headline" },
  bot_required: { state: "checkRejected", focus: "headline" },
  bot_rejected: { state: "checkRejected", focus: "headline" },
  bot_unavailable: { state: "checkDown", focus: "headline" },
  fields_required: { state: "refused", focus: "headline" },
  too_long: { state: "refused", focus: "headline" },
  invalid_email: { state: "field:email", focus: "#contact-email" },
  send_failed: { state: "refused", focus: "headline" },
  server_error: { state: "refused", focus: "headline" },
  unknown_code: { state: "refused", focus: "headline" },
  not_json: { state: "refused", focus: "headline" },
  network: { state: "unreachable", focus: "headline" },
  offline: { state: "offline", focus: "#contact-send", posted: 0 },
  hang: { state: "noReply", focus: "headline", settle: 21_000 },
  "ts:error": { state: "checkDown", focus: "headline", posted: 0 },
  "ts:timeout": { state: "checkRejected", focus: "headline", posted: 0 },
  "ts:unsupported": { state: "checkDown", focus: "headline", posted: 0 },
  "ts:expire": { state: "checking", focus: "#contact-send", posted: 0 },
  "ts:pending": { state: "checking", focus: "#contact-send", posted: 0 },
  "ts:challenge": { state: "challenge", focus: "#contact-send", posted: 0 },
  "ts:script-fail": { state: "checkDown", focus: "headline", posted: 0 },
  "ts:script-hang": { state: "checking", focus: "#contact-send", posted: 0 },
};

/** Runs in the page: what the visitor is being told, where focus is, and whether their text is still there. */
function readFormState(fields) {
  const clean = (element) => element?.textContent.replace(/\s+/g, " ").trim() ?? null;
  const values = {};
  for (const [key, selector] of Object.entries(fields)) values[key] = document.querySelector(selector)?.value ?? null;
  const holder = document.querySelector("[data-form-state]");
  const invalid = [...document.querySelectorAll('[aria-invalid="true"]')].map((element) => element.id.replace("contact-", ""));
  const panel = holder?.querySelector("[data-state-panel]");
  const active = document.activeElement;
  const whatsApp = panel?.querySelector('a[href^="https://wa.me/"]');
  // data-state-panel: the live regions leave out a headline that has taken focus.
  const said = [...document.querySelectorAll('[role="status"], [role="alert"], [data-state-panel]')]
    .map(clean)
    .filter(Boolean);
  return {
    values,
    state: holder?.dataset.formState ?? (invalid.length ? `field:${invalid.join("+")}` : null),
    badge: clean(panel?.querySelector(".sp-badge")),
    headline: clean(panel?.querySelector(".sp-title")),
    facts: clean(panel?.querySelector(".sp-facts")),
    actions: [...(panel?.querySelectorAll(".sp-actions > *") ?? [])].map(clean),
    hasClose: Boolean(panel?.querySelector(".sp-close")),
    fieldErrors: [...document.querySelectorAll(".ct-error")].map(clean),
    whatsAppHref: whatsApp?.getAttribute("href") ?? null,
    focus: active?.classList.contains("sp-title") ? "headline" : active?.id ? `#${active.id}` : active?.tagName.toLowerCase() ?? null,
    said: [...new Set(said)],
    online: navigator.onLine,
    hasForm: Boolean(document.querySelector("form")),
  };
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sets a React-controlled field the way typing would, past maxLength if asked. */
async function setField(page, selector, value) {
  await page.evaluate(
    (target, next) => {
      const element = document.querySelector(target);
      const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(element, next);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    },
    selector,
    value
  );
}

/**
 * The tools a flow gets. waitState fails the flow if the state never comes, so a flow
 * reads top to bottom as what the visitor sees.
 */
function flowTools(page, routes, lang, problems) {
  const read = () => page.evaluate(readFormState, FIELDS);
  const tools = {
    read,
    press: () => page.click("#contact-send"),
    stub: (method, ...args) => page.evaluate((name, list) => window.__turnstileStub?.[name](...list), method, args),
    async waitState(state, timeout = 4000) {
      const reached = await page
        .waitForFunction(
          (want) => {
            const holder = document.querySelector("[data-form-state]");
            const invalid = [...document.querySelectorAll('[aria-invalid="true"]')].map((e) => e.id.replace("contact-", ""));
            const now = holder?.dataset.formState ?? (invalid.length ? `field:${invalid.join("+")}` : null);
            return now === want;
          },
          { timeout, polling: 50 },
          state
        )
        .then(() => true, () => false);
      if (!reached) problems.push(`never reached ${state} (was ${(await read()).state})`);
      return reached;
    },
    expect(label, actual, wanted) {
      if (actual !== wanted) problems.push(`${label}: ${JSON.stringify(actual)}, wanted ${JSON.stringify(wanted)}`);
    },
    /** Presses the panel button with this label. */
    async action(key) {
      const label = LABELS[lang][key];
      const clicked = await page.evaluate((text) => {
        const button = [...document.querySelectorAll("[data-state-panel] .sp-actions > *")].find(
          (element) => element.textContent.replace(/\s+/g, " ").trim() === text
        );
        button?.click();
        return Boolean(button);
      }, label);
      if (!clicked) problems.push(`no "${label}" button`);
    },
    async waitToken() {
      await page.waitForFunction(() => (window.__turnstileStub?.tokens ?? 0) > 0, { timeout: 4000, polling: 50 }).catch(() => {});
    },
    bodies: () => routes.contactRequests.map((request) => request.body),
  };
  return tools;
}

/** Several steps each, for the rules a single press can't show. */
const FLOWS = {
  // S5: Send pressed before the check finished sends by itself once it does.
  async early(t) {
    await t.press();
    await t.waitState("checking");
    await t.stub("solve");
    await t.waitState("sent");
    t.expect("posted", t.bodies().length, 1);
  },
  // S5b: a challenge stops the 15 s clock, so a slow tap doesn't turn into S8.
  async "challenge-pause"(t) {
    await t.waitState("challenge");
    await t.press();
    await t.waitState("challenge");
    await pause(16_000);
    t.expect("state after 16 s of challenge", (await t.read()).state, "challenge");
    await t.stub("solve");
    await t.waitState("sent");
    t.expect("posted", t.bodies().length, 1);
  },
  // S8 after 15 s without a token; a token arriving later clears it.
  async "pending-15s"(t) {
    await t.press();
    await t.waitState("checking");
    await t.waitState("checkDown", 17_000);
    t.expect("focus", (await t.read()).focus, "headline");
    t.expect("posted while waiting", t.bodies().length, 0);
    await t.stub("solve");
    await t.waitState(null);
    await t.press();
    await t.waitState("sent");
  },
  // The response was lost: the retry reuses the unused token and the submission id.
  async "lost-retry"(t) {
    await t.press();
    await t.waitState("unreachable");
    await t.action("tryAgain");
    await t.waitState("sent");
    const [first, second] = t.bodies();
    t.expect("same submissionId", second?.submissionId, first?.submissionId);
    t.expect("same token (never redeemed)", second?.turnstileToken, first?.turnstileToken);
  },
  // Resend already had this submission's key (409): the Function answers 200.
  async "resend-409"(t) {
    await t.press();
    await t.waitState("unreachable");
    await t.action("tryAgain");
    await t.waitState("sent");
    const [first, second] = t.bodies();
    t.expect("same submissionId", second?.submissionId, first?.submissionId);
  },
  // S7b: no answer in 20 s. The token may have been redeemed, so the retry gets a new one.
  async "abort-retry"(t) {
    await t.press();
    await t.waitState("noReply", 23_000);
    await t.page.waitForFunction(() => window.__turnstileStub.tokens >= 2, { timeout: 4000, polling: 50 }).catch(() => {});
    await t.action("tryAgain");
    await t.waitState("sent");
    const [first, second] = t.bodies();
    t.expect("same submissionId", second?.submissionId, first?.submissionId);
    t.expect("new token", second?.turnstileToken !== first?.turnstileToken, true);
  },
  // S11 then S12. Nothing sends until Send is pressed again.
  async "offline-online"(t) {
    await t.routes.setOffline(true);
    await t.press();
    await t.waitState("offline");
    t.expect("posted offline", t.bodies().length, 0);
    await t.routes.setOffline(false);
    await t.waitState("online");
    await pause(500);
    t.expect("posted on reconnect", t.bodies().length, 0);
    await t.action("send");
    await t.waitState("sent");
  },
  // The widget fails to load offline (phones load it on first focus): it is remounted on online.
  async "offline-widget"(t) {
    await t.routes.setOffline(true);
    for (const [key, selector] of Object.entries(FIELDS)) await t.page.type(selector, t.text[key]);
    await t.press();
    await t.waitState("offline");
    await t.routes.setOffline(false);
    await t.waitState("online");
    await t.waitToken();
    await t.action("send");
    await t.waitState("sent");
  },
  // Correct and resend: the last values come back, the resend is marked, Close empties.
  async correction(t) {
    await t.press();
    await t.waitState("sent");
    const firstBadge = (await t.read()).badge;
    await t.action("correct");
    await t.waitState(null);
    const restored = await t.read();
    t.expect("restored message", restored.values.message, t.text.message);
    t.expect("focus after correct", restored.focus, "#contact-name");
    await t.page.type(FIELDS.message, " +");
    await t.waitToken();
    await t.press();
    await t.waitState("sent");
    const [first, second] = t.bodies();
    t.expect("first is not a correction", first?.correction, undefined);
    t.expect("second is a correction", second?.correction, true);
    t.expect("new submissionId", second?.submissionId !== first?.submissionId, true);
    t.expect("new REF", (await t.read()).badge !== firstBadge, true);
    await t.page.click(".sp-close");
    await pause(200);
    const closed = await t.read();
    t.expect("empty after Close", Object.values(closed.values).join(""), "");
    t.expect("focus after Close", closed.focus, "#contact-send");
  },
  // S10: inline errors, focus on the first, nothing posted.
  async fields(t) {
    await t.press();
    await t.waitState("field:name+email+message");
    t.expect("focus", (await t.read()).focus, "#contact-name");
    await t.page.type(FIELDS.name, t.text.name);
    await t.page.type(FIELDS.email, "name@gmail");
    await t.page.type(FIELDS.message, t.text.message);
    await t.press();
    await t.waitState("field:email");
    t.expect("focus", (await t.read()).focus, "#contact-email");
    await t.page.type(FIELDS.email, ".com");
    await setField(t.page, FIELDS.name, "x".repeat(101));
    await t.press();
    await t.waitState("field:name");
    t.expect("posted", t.bodies().length, 0);
  },
  // S19: a long message is cut for WhatsApp, with the notice and Copy. A refused clipboard
  // selects the text instead; a working one says Copied.
  async "long-prefill"(t) {
    await setField(t.page, FIELDS.message, "سجاد ".repeat(400).trim());
    await t.press();
    await t.waitState("refused");
    const state = await t.read();
    const encoded = state.whatsAppHref?.split("?text=")[1] ?? "";
    t.expect("prefill within 1,800 bytes", encoded.length > 0 && encoded.length <= 1800, true);
    t.expect("shortened notice", /shortened|اختصرنا/.test(state.facts ?? ""), true);
    const realWrite = await t.page.evaluate(() => {
      const clipboard = navigator.clipboard;
      if (!clipboard) return false;
      window.__realWrite = clipboard.writeText.bind(clipboard);
      clipboard.writeText = () => Promise.reject(new DOMException("denied", "NotAllowedError"));
      return true;
    });
    await t.action("copy");
    await pause(200);
    const selected = await t.page.evaluate(() => {
      const area = document.querySelector("#contact-message");
      return document.activeElement === area && area.selectionEnd - area.selectionStart === area.value.length;
    });
    t.expect("refused clipboard selects the text", selected, true);
    if (realWrite) {
      await t.page.evaluate(() => {
        navigator.clipboard.writeText = window.__realWrite;
      });
      await t.action("copy");
      await pause(200);
      t.expect("working clipboard says Copied", (await t.read()).actions.includes(LABELS[t.lang].copied), true);
    }
  },
  // S9 from the challenge timing out, before any press; Send resets the widget.
  async "timeout-retry"(t) {
    await t.waitState("checkRejected");
    t.expect("focus before a press", (await t.read()).focus === "headline", false);
    await t.press();
    await pause(300);
    t.expect("reset on Send", (await t.page.evaluate(() => window.__turnstileStub.resets)) >= 1, true);
    await t.waitState("checkRejected");
    t.expect("focus after the press", (await t.read()).focus, "headline");
  },
};

const FLOW_SETUP = {
  early: { turnstile: "pending" },
  "challenge-pause": { turnstile: "challenge" },
  "pending-15s": { turnstile: "pending" },
  "lost-retry": { contact: ["network", "ok"] },
  "resend-409": { contact: ["network", "resend_409"] },
  "abort-retry": { contact: ["hang", "ok"] },
  "offline-online": {},
  "offline-widget": { type: false },
  correction: {},
  fields: { type: false },
  "long-prefill": { contact: "send_failed" },
  "timeout-retry": { turnstile: "timeout" },
};

async function runForm(browser, origin) {
  const all = [...Object.keys(SINGLE), ...Object.keys(FLOWS).map((name) => `flow:${name}`)];
  const scenarios = formArg === "all" ? all : formArg === "flows" ? all.filter((name) => name.startsWith("flow:")) : list(formArg);
  const results = [];
  for (const width of widths) {
    for (const lang of langs) {
      for (const scenario of scenarios) {
        const flowName = scenario.startsWith("flow:") ? scenario.slice(5) : null;
        const flow = flowName && FLOWS[flowName];
        const single = !flowName && SINGLE[scenario];
        if (!flow && !single) throw new Error(`Unknown form scenario: ${scenario}`);
        // The widget loads on first focus below md, so this one means nothing on desktop.
        if (flowName === "offline-widget" && width >= 768) continue;
        const setup = flow ? FLOW_SETUP[flowName] : {};
        const page = await newPage(browser, { width });
        const turnstile = setup.turnstile ?? (scenario.startsWith("ts:") ? scenario.slice(3) : "pass");
        const contact = setup.contact ?? (flow || scenario === "offline" || scenario.startsWith("ts:") ? "ok" : scenario);
        const routes = await installRoutes(page, { origin, turnstile, contact });
        await gotoSettled(page, `${origin}${localized(lang, "/contact")}`);
        await page.waitForSelector(FIELDS.name, { timeout: 8000 });
        await page.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: "center", behavior: "instant" }), FIELDS.name);
        const text = FORM_TEXT[lang];
        if (setup.type !== false) {
          for (const [key, selector] of Object.entries(FIELDS)) await page.type(selector, text[key]);
          // Typing focused the form, so the widget is loading. Give the stub its moment.
          await pause(300);
        }
        const problems = [];
        if (flow) {
          const tools = flowTools(page, routes, lang, problems);
          await flow({ ...tools, page, routes, lang, text });
        } else {
          if (scenario === "offline") await routes.setOffline(true);
          await page.click("#contact-send").catch(() => {});
          await pause(single.settle ?? 1500);
        }
        const state = await page.evaluate(readFormState, FIELDS);
        if (single) {
          if (state.state !== single.state) problems.push(`state ${state.state}, wanted ${single.state}`);
          if (state.focus !== single.focus) problems.push(`focus ${state.focus}, wanted ${single.focus}`);
          if (single.posted !== undefined && routes.contactRequests.length !== single.posted) {
            problems.push(`posted ${routes.contactRequests.length}, wanted ${single.posted}`);
          }
          const kept = Object.keys(FIELDS).every((key) => state.values[key] === text[key]);
          if (single.state !== "sent" && !kept) problems.push("text lost");
        }
        if (routes.errors.length) problems.push(...routes.errors.map((error) => `page error: ${error}`));
        if (shots) await screenshot(page, `form-${scenario.replace(":", "-")}-${lang}-${width}`);
        results.push({
          scenario,
          lang,
          width,
          posted: routes.contactRequests.length,
          problems,
          ...state,
        });
        await page.close();
      }
    }
  }
  console.table(
    results.map((r) => ({
      scenario: r.scenario,
      lang: r.lang,
      width: r.width,
      state: r.state,
      focus: r.focus,
      posted: r.posted,
      said: `${r.badge ?? ""} ${r.headline ?? r.fieldErrors.join(" ")}`.trim().slice(0, 60),
      ok: r.problems.length ? r.problems.join("; ").slice(0, 80) : "yes",
    }))
  );
  const failed = results.filter((r) => r.problems.length);
  console.log(`audit-mobile: ${results.length} form runs, ${failed.length} with problems`);
  return results;
}


const server = await serveOut({ dir });
const browser = await launchBrowser();
let exitCode = 0;
try {
  const results = formArg ? await runForm(browser, server.origin) : await auditPages(browser, server.origin);
  if (!formArg) {
    const totals = printPages(results);
    if (strict && (totals.short || totals.small)) exitCode = 1;
  } else if (results.some((r) => r.problems.length)) {
    exitCode = 1;
  }
  if (outFile) {
    const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, `${JSON.stringify({ commit, results })}\n`);
    console.log(`audit-mobile: wrote ${outFile}`);
  }
} finally {
  await browser.close();
  await server.close();
}
process.exit(exitCode);
