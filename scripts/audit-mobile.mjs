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
 * presses Send, and reports what the page says and whether the text survived. Scenarios
 * are the keys of CONTACT_SCENARIOS plus: network, hang, offline, and ts:<mode> for a
 * Turnstile mode (error, timeout, unsupported, pending, challenge, script-fail,
 * script-hang). The helpers are exported from lib/browser.mjs for anything more specific.
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

/** Runs in the page: what the visitor is being told, and whether their text is still there. */
function readFormState(fields) {
  const values = {};
  for (const [key, selector] of Object.entries(fields)) values[key] = document.querySelector(selector)?.value ?? null;
  // li[data-state]: an open Radix toast, which holds its text outside the live region.
  const said = [...document.querySelectorAll('[role="status"], [role="alert"], [aria-live], li[data-state="open"]')]
    .map((element) => element.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const submit = document.querySelector('form button[type="submit"]');
  return {
    values,
    said: [...new Set(said)],
    submitText: submit?.textContent.replace(/\s+/g, " ").trim() ?? null,
    submitDisabled: submit?.disabled ?? null,
    online: navigator.onLine,
    hasForm: Boolean(document.querySelector("form")),
    url: location.pathname,
  };
}

async function runForm(browser, origin) {
  const all = [
    ...Object.keys(CONTACT_SCENARIOS),
    "network",
    "offline",
    "hang",
    ...["error", "timeout", "unsupported", "expire", "pending", "challenge", "script-fail", "script-hang"].map((mode) => `ts:${mode}`),
  ];
  const scenarios = formArg === "all" ? all : list(formArg);
  const results = [];
  for (const width of widths) {
    for (const lang of langs) {
      for (const scenario of scenarios) {
        const page = await newPage(browser, { width });
        const turnstile = scenario.startsWith("ts:") ? scenario.slice(3) : "pass";
        const contact = scenario === "offline" || scenario.startsWith("ts:") ? "ok" : scenario;
        const routes = await installRoutes(page, { origin, turnstile, contact });
        await gotoSettled(page, `${origin}${localized(lang, "/contact")}`);
        await page.waitForSelector(FIELDS.name, { timeout: 8000 });
        await page.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: "center", behavior: "instant" }), FIELDS.name);
        const text = FORM_TEXT[lang];
        for (const [key, selector] of Object.entries(FIELDS)) await page.type(selector, text[key]);
        await page
          .waitForFunction(() => !document.querySelector('form button[type="submit"]')?.disabled, { timeout: 3000, polling: 50 })
          .catch(() => {});
        if (scenario === "offline") await routes.setOffline(true);
        await page.click('form button[type="submit"]').catch(() => {});
        const settle = scenario === "hang" ? 21_000 : 1500;
        await new Promise((resolve) => setTimeout(resolve, settle));
        const state = await page.evaluate(readFormState, FIELDS);
        if (shots) await screenshot(page, `form-${scenario.replace(":", "-")}-${lang}-${width}`);
        results.push({
          scenario,
          lang,
          width,
          posted: routes.contactRequests.length,
          textIntact: Object.keys(FIELDS).every((key) => state.values[key] === text[key]),
          ...state,
          pageErrors: routes.errors,
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
      posted: r.posted,
      "text kept": r.textIntact,
      form: r.hasForm,
      online: r.online,
      said: r.said.join(" / ").slice(0, 70),
      button: r.submitText?.slice(0, 20),
      errors: r.pageErrors.length,
    }))
  );
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
