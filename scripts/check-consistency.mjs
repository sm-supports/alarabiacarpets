/**
 * Holds the site to "one product", run against src/ and out/ after a build. In
 * `npm run check` and scripts/deploy-pages.sh. Exits 1 on any problem.
 *
 * 1. CTA vocabulary (the mobile redesign plan's Component specs). In the static HTML of
 *    every page and the 404, a link or button is a CTA when its label talks about
 *    WhatsApp, a quote or a call, when it is a tel: link, or when it carries the WhatsApp
 *    icon. Its label must then be one of the vocabulary's, read from the dictionaries in
 *    the page's language: common.heroQuote, nav.getFreeQuote, statePanel.call (alone or
 *    before the phone number). common.askOnWhatsApp is allowed on guides only, the plan's
 *    one exception. nav.getQuote is the owner's (2026-11-09): the desktop header button
 *    (.nav-cta) keeps that old label so the desktop nav doesn't move, and must say exactly
 *    that; anywhere else the label stays retired. Contact details are not CTAs: the
 *    WhatsApp, email and map rows (ct-method, ft-contact), the social icons (ft-social)
 *    and the 404's number (nf-tel).
 *    Labels the plan retired (RETIRED) fail anywhere: as an element's text in out/, or as
 *    a string anywhere in src/, which also covers what only renders after hydration. A
 *    retired label reached through its key is caught the same way: code in src/ may use
 *    nav.getQuote once, inside the .nav-cta element in Navbar.tsx.
 *    WhatsApp CTAs carry WhatsAppIcon and no cart, phone or chat icon; a .cta button with
 *    a WhatsApp label must carry it; a tel: link must not. (StatePanel's buttons render
 *    after hydration, so they are not read here; they are words only, design.md.)
 * 2. Breadcrumbs. Every page but Home shows one trail (components/Breadcrumb.tsx) and has
 *    one BreadcrumbList, and the two agree step for step: names, links and the page.
 * 3. Phone, hours and the saved-message line. global-error.tsx, global-not-found.tsx (and
 *    the built 404.html) and public/sw.js are self-contained, so a change to
 *    src/lib/site.ts or to the dictionaries doesn't reach them by itself. Any phone number
 *    in them must be PHONE / PHONE_E164 from site.ts, any time of day must sit inside the
 *    formStates.open sentence of en.client.ts or ar.client.ts, word for word, and a
 *    `saved:` line must be statePanel.draftSaved; global-error.tsx must have that line in
 *    both languages, under that key. The /contact page's hours line
 *    (pages.contact.hoursLine in en.ts and ar.ts) must give the days and hours of its
 *    language's formStates.open word for word.
 * 4. The service worker. public/sw.js (and out/sw.js after a build) must exist: a 404 on
 *    /sw.js keeps an installed worker running (its header). Only the name is checked, so
 *    the kill switch (scripts/sw-kill.js copied over it) passes. When it reads the contact
 *    draft, its key and version must be src/lib/draft.ts's DRAFT_KEY and VERSION, and its
 *    offline page must say statePanel.draftSaved in both languages.
 */
import fs from "node:fs";

const SITE = "https://alarabiacarpets.com";
// --dir=<folder> checks another build (default out/); src/ and public/ are read from here.
const OUT = process.argv.find((a) => a.startsWith("--dir="))?.slice(6) ?? "out";
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);
const read = (file) => fs.readFileSync(file, "utf8");

// ---------------------------------------------------------------- dictionaries

/** A string value from a dictionary file, by section and key: `section: { ... key: "value"`. */
function pick(file, section, key) {
  const source = read(file);
  const start = source.search(new RegExp(`\\n\\s+${section}: \\{`));
  if (start < 0) throw new Error(`check-consistency: no "${section}" section in ${file}`);
  const match = new RegExp(`\\n\\s+${key}: "((?:[^"\\\\]|\\\\.)*)"`).exec(source.slice(start));
  if (!match) throw new Error(`check-consistency: no ${section}.${key} in ${file}`);
  return match[1];
}

const DICT = { en: "src/i18n/en.client.ts", ar: "src/i18n/ar.client.ts" };
const words = (lang) => ({
  heroQuote: pick(DICT[lang], "common", "heroQuote"),
  getFreeQuote: pick(DICT[lang], "nav", "getFreeQuote"),
  call: pick(DICT[lang], "statePanel", "call"),
  ask: pick(DICT[lang], "common", "askOnWhatsApp"),
  open: pick(DICT[lang], "formStates", "open"),
  getQuote: pick(DICT[lang], "nav", "getQuote"),
  draftSaved: pick(DICT[lang], "statePanel", "draftSaved"),
});
const VOCAB = { en: words("en"), ar: words("ar") };

const site = read("src/lib/site.ts");
const PHONE = /export const PHONE = "([^"]+)"/.exec(site)?.[1];
const PHONE_E164 = /export const PHONE_E164 = "([^"]+)"/.exec(site)?.[1];
if (!PHONE || !PHONE_E164) throw new Error("check-consistency: PHONE or PHONE_E164 not found in src/lib/site.ts");
const DIGITS = PHONE_E164.replace(/\D/g, "");

// The plan replaced these. Exact labels, both languages. "Get Quote" / "اطلب عرض سعر" is
// nav.getQuote, still allowed on the desktop header button alone (HEADER_BUTTON below).
const RETIRED = [
  "Get Quote",
  "Contact Us on WhatsApp",
  "Chat on WhatsApp",
  "Inquire on WhatsApp",
  "Call Now",
  "اطلب عرض سعر",
  "كلّمنا على الواتساب",
  "استفسر على الواتساب",
  "اتصل الحين",
];

// ---------------------------------------------------------------- pages

const urls = [...new Set([...read(`${OUT}/sitemap.xml`).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/"))];
const pages = urls.map((url) => ({ url, file: `${OUT}${url === "/" ? "/index" : url}.html` }));
if (fs.existsSync(`${OUT}/404.html`)) pages.push({ url: "404", file: `${OUT}/404.html` });

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
const textOf = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (attrs, name) => new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1] ?? "";

const CTA_WORDS = /\b(whatsapp|quote|call|chat|inquire|enquire)\b|واتساب|عرض سعر|اتصل|كلّمنا|كلمنا|استفسر|اسألنا/i;
const CONTACT_DETAIL = /\b(ct-method|ft-contact|ft-social|nf-tel)\b/;
const CTA_CLASS = /\b(cta|cta-dark|cta-2|ab-wa|ab-call|nf-btn|nf-fill)\b/;
const isGuide = (url) => /^(\/ar)?\/guides\//.test(url);
// The desktop header's quote button (Navbar.tsx). The owner decided on 2026-11-09 that it
// keeps its old label, nav.getQuote, on desktop only, so the header's links stay where they
// were; the phone bar, the menu and the footer say nav.getFreeQuote.
const HEADER_BUTTON = /\bnav-cta\b/;
const pageLang = (url) => (url === "/ar" || url.startsWith("/ar/") ? "ar" : "en");

function allowedLabels(url) {
  const langs = url === "404" ? ["en", "ar"] : [pageLang(url)];
  const labels = new Set();
  const wa = new Set();
  for (const lang of langs) {
    const v = VOCAB[lang];
    for (const label of [v.heroQuote, v.getFreeQuote]) labels.add(label), wa.add(label);
    labels.add(v.call).add(`${v.call} ${PHONE}`);
    if (isGuide(url)) labels.add(v.ask), wa.add(v.ask);
  }
  // The 404 says each button in both languages, English first (global-not-found.tsx).
  if (url === "404") {
    for (const key of ["getFreeQuote", "call"]) labels.add(`${VOCAB.en[key]} ${VOCAB.ar[key]}`);
    wa.add(`${VOCAB.en.getFreeQuote} ${VOCAB.ar.getFreeQuote}`);
  }
  return { labels, wa };
}

const breadcrumbLabel = new Set(["Breadcrumb", "مسار التنقل"]);
let ctaCount = 0;

for (const { url, file } of pages) {
  const raw = read(file);
  const html = raw.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/g, "");
  const { labels, wa } = allowedLabels(url);

  for (const [, tag, attrs, inner] of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const cls = attr(attrs, "class");
    const href = attr(attrs, "href");
    // The md+ pill's own word ("WhatsApp", .ab-p) is today's desktop pill, kept by WP5;
    // the bar's label is the rest.
    const label = textOf(inner.replace(/<span class="ab-p">[\s\S]*?<\/span>/g, "")) || decode(attr(attrs, "aria-label"));
    const icons = new Set([...inner.matchAll(/icons\.svg#([\w-]+)"/g)].map((m) => m[1]));
    const where = `${url} <${tag}${cls ? ` class="${cls}"` : ""}> "${label}"`;

    if (HEADER_BUTTON.test(cls)) {
      ctaCount += 1;
      const own = url === "404" ? null : VOCAB[pageLang(url)].getQuote;
      if (label !== own) fail(where, `the desktop header button must say nav.getQuote ("${own}"), the owner's decision of 2026-11-09`);
      if (!icons.has("whatsapp")) fail(where, "WhatsApp CTA without WhatsAppIcon");
      continue;
    }
    if (RETIRED.includes(label)) fail(where, "retired CTA label");
    if (CONTACT_DETAIL.test(cls)) continue;
    const tel = href.startsWith("tel:");
    const isCta = tel || icons.has("whatsapp") || (label.length <= 60 && CTA_WORDS.test(label));
    if (!isCta) continue;
    ctaCount += 1;

    if (!labels.has(label)) fail(where, "CTA label outside the vocabulary");
    if (tel && icons.has("whatsapp")) fail(where, "a call link with the WhatsApp icon");
    if (wa.has(label)) {
      for (const icon of ["shopping-cart", "phone", "message-circle"]) {
        if (icons.has(icon)) fail(where, `WhatsApp CTA with the ${icon} icon (WhatsAppIcon only)`);
      }
      if (CTA_CLASS.test(cls) && !icons.has("whatsapp")) fail(where, "WhatsApp CTA without WhatsAppIcon");
    }
  }

  // Breadcrumbs: the visible trail and the BreadcrumbList.
  if (url === "404") continue;
  const navs = [...html.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/g)].filter(([, attrs]) => breadcrumbLabel.has(attr(attrs, "aria-label")));
  const lists = [...raw.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json))
    .flatMap((node) => (Array.isArray(node) ? node : node["@graph"] ?? [node]))
    .filter((node) => node["@type"] === "BreadcrumbList");
  const home = url === "/" || url === "/ar";
  if (home) {
    if (navs.length || lists.length) fail(url, "Home has a breadcrumb");
    continue;
  }
  if (navs.length !== 1) fail(url, `${navs.length} visible breadcrumbs, needs 1`);
  if (lists.length !== 1) fail(url, `${lists.length} BreadcrumbList nodes, needs 1`);
  if (navs.length !== 1 || lists.length !== 1) continue;
  const shown = [...navs[0][2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map(([, li]) => ({
    name: textOf(li),
    href: /<a\b[^>]*\bhref="([^"]*)"/.exec(li)?.[1] ?? null,
  }));
  const steps = lists[0].itemListElement.map((item) => ({ name: item.name, path: item.item.replace(SITE, "") || "/" }));
  const same =
    shown.length === steps.length &&
    shown.every((step, i) => step.name === steps[i].name && (i === shown.length - 1 ? step.href === null : step.href === steps[i].path)) &&
    steps.at(-1).path === url;
  if (!same) {
    fail(url, `breadcrumb ${JSON.stringify(shown.map((s) => s.name))} doesn't match BreadcrumbList ${JSON.stringify(steps.map((s) => s.name))} ending at ${steps.at(-1)?.path}`);
  }
}

// Retired labels left as strings in the source, including hydrated-only markup.
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = `${dir}/${entry.name}`;
    return entry.isDirectory() ? walk(full) : /\.(tsx?|mjs|js)$/.test(entry.name) ? [full] : [];
  });
}
// nav.getQuote's own entries in the client dictionaries hold the header button's label.
const getQuoteEntry = /^\s*getQuote: "[^"]*",$/m;
// Comments may name nav.getQuote; code may use it once, on the header button. Blank
// comments keep their newlines, so line numbers hold; the `//` rule skips "https://".
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, "")).replace(/(?<![:"'`\w\\])\/\/[^\n]*/g, "");
const NAVBAR = "src/components/Navbar.tsx";
const getQuoteUses = [];
for (const file of walk("src")) {
  let source = read(file);
  if (file === DICT.en || file === DICT.ar) source = source.replace(getQuoteEntry, "");
  for (const label of RETIRED) {
    const quoted = [`"${label}"`, `'${label}'`, `\`${label}\``, `>${label}<`];
    if (quoted.some((q) => source.includes(q))) fail(file, `retired CTA label "${label}"`);
  }
  // The label behind a key: nav.getQuote anywhere but the header button, including the
  // phone menu and the panels, which only render after hydration and so never reach out/.
  const code = stripComments(source);
  for (const match of code.matchAll(/\bgetQuote\b/g)) getQuoteUses.push({ file, code, at: match.index });
}
{
  const header = /<(\w+)\b[^>]*\bnav-cta\b[^>]*>[\s\S]*?<\/\1>/.exec(getQuoteUses.find((u) => u.file === NAVBAR)?.code ?? "");
  const onHeader = (u) => u.file === NAVBAR && header && u.at > header.index && u.at < header.index + header[0].length;
  for (const use of getQuoteUses.filter((u) => !onHeader(u))) {
    const line = use.code.slice(0, use.at).split("\n").length;
    fail(`${use.file}:${line}`, `nav.getQuote outside the desktop header button (.nav-cta): the label is retired everywhere else`);
  }
  if (getQuoteUses.filter(onHeader).length !== 1) fail(NAVBAR, "the desktop header button (.nav-cta) must show nav.getQuote once");
}

// ---------------------------------------------------------------- phone and hours

const SELF_CONTAINED = ["src/app/global-error.tsx", "src/app/global-not-found.tsx", "public/sw.js", `${OUT}/404.html`];
const openSentences = [VOCAB.en.open, VOCAB.ar.open];
let checkedFiles = 0;
for (const file of SELF_CONTAINED) {
  if (!fs.existsSync(file)) {
    // 404.html comes with a build; sw.js is reported below; the rest must be there.
    if (file !== `${OUT}/404.html` && file !== "public/sw.js") fail(file, "missing");
    continue;
  }
  checkedFiles += 1;
  let text = read(file);
  if (file.endsWith(".html")) text = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, "");

  const numbers = [
    ...[...text.matchAll(/(?:\+|00)?974[\s-]*\d{4}[\s-]*\d{4}/g)].map((m) => m[0]),
    ...[...text.matchAll(/tel:([^"'`\s>]+)/g)].map((m) => m[1]),
    ...[...text.matchAll(/wa\.me\/([^"'`\s>?]+)/g)].map((m) => m[1]),
  ];
  for (const number of numbers) {
    // A template like tel:${PHONE_E164} uses site.ts itself.
    if (/\$\{/.test(number)) continue;
    if (number.replace(/\D/g, "") !== DIGITS) fail(file, `phone number ${number} is not ${PHONE} (src/lib/site.ts)`);
  }
  if (!file.endsWith(".html")) {
    for (const [local] of text.matchAll(/(?<![\d#\w-])[3-7]\d{3}[\s-]?\d{4}(?![\d\w-])/g)) {
      if (!DIGITS.endsWith(local.replace(/\D/g, ""))) fail(file, `phone number ${local} is not ${PHONE} (src/lib/site.ts)`);
    }
  }
  // Shown to people as PHONE; PHONE_E164 is the form for tel: and wa.me.
  for (const [display] of text.matchAll(/\+974[\s-]*\d{4}[\s-]*\d{4}/g)) {
    if (display !== PHONE && display !== PHONE_E164) fail(file, `phone written "${display}", site.ts writes "${PHONE}"`);
  }

  let rest = text;
  for (const sentence of openSentences) rest = rest.split(sentence).join(" ");
  for (const [time] of rest.matchAll(/\b\d{1,2}[:٫]\d{2}\b/g)) {
    fail(file, `time "${time}" outside the formStates.open sentence ("${VOCAB.en.open}" / "${VOCAB.ar.open}")`);
  }
  // The sentence that says a draft is kept (S15's "Your message is saved."), where a file
  // has its own copy: sw.js's offline page and global-error.tsx.
  for (const [, saved] of text.matchAll(/\bsaved: "([^"]*)"/g)) {
    if (saved !== VOCAB.en.draftSaved && saved !== VOCAB.ar.draftSaved) {
      fail(file, `saved line "${saved}" is not statePanel.draftSaved ("${VOCAB.en.draftSaved}" / "${VOCAB.ar.draftSaved}")`);
    }
  }
}
// global-error.tsx always has its copy of S15's saved line (sw.js's is checked below, when
// it reads the draft): held to the key's name too, so a renamed key can't slip past.
{
  const GLOBAL_ERROR = "src/app/global-error.tsx";
  const source = fs.existsSync(GLOBAL_ERROR) ? read(GLOBAL_ERROR) : "";
  for (const lang of ["en", "ar"]) {
    if (source && !source.includes(`saved: "${VOCAB[lang].draftSaved}"`)) {
      fail(GLOBAL_ERROR, `no saved: "${VOCAB[lang].draftSaved}" (statePanel.draftSaved, ${lang})`);
    }
  }
}

// /contact's hours line is server text (en.ts, ar.ts) in its own words; its days and hours,
// from the two words before the first time to the word after the last, must be
// formStates.open's.
const hoursSpan = (text) => /(?:\S+\s+){2}\d{1,2}:\d{2}.*\d{1,2}:\d{2}\s+\S+/u.exec(text)?.[0].replace(/[.,،]$/, "") ?? null;
for (const [lang, file] of [["en", "src/i18n/en.ts"], ["ar", "src/i18n/ar.ts"]]) {
  const line = pick(file, "contact", "hoursLine");
  const want = hoursSpan(VOCAB[lang].open);
  const have = hoursSpan(line);
  if (!want) throw new Error(`check-consistency: no hours in formStates.open (${DICT[lang]})`);
  if (have !== want) fail(file, `pages.contact.hoursLine gives "${have}", formStates.open says "${want}" ("${VOCAB[lang].open}")`);
}

// ---------------------------------------------------------------- service worker

const SW = "public/sw.js";
const WORKER_GONE = "a 404 on /sw.js keeps an installed worker running; restore it, or copy scripts/sw-kill.js over it (see its header)";
if (!fs.existsSync(SW)) fail(SW, `missing: ${WORKER_GONE}`);
if (fs.existsSync(`${OUT}/index.html`) && !fs.existsSync(`${OUT}/sw.js`)) fail(`${OUT}/sw.js`, `missing from the build: ${WORKER_GONE}`);
if (fs.existsSync(SW)) {
  const worker = read(SW);
  const draft = read("src/lib/draft.ts");
  const draftKey = /const DRAFT_KEY = "([^"]+)"/.exec(draft)?.[1];
  const draftVersion = /const VERSION = (\d+);/.exec(draft)?.[1];
  if (!draftKey || !draftVersion) throw new Error("check-consistency: DRAFT_KEY or VERSION not found in src/lib/draft.ts");
  if (worker.includes("sessionStorage")) {
    const keys = [...worker.matchAll(/sessionStorage\.getItem\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
    const versions = [...worker.matchAll(/\.v === (\d+)/g)].map((m) => m[1]);
    if (!keys.length || keys.some((key) => key !== draftKey)) {
      fail(SW, `reads the draft under ${JSON.stringify(keys)}, src/lib/draft.ts writes "${draftKey}"`);
    }
    if (!versions.length || versions.some((v) => v !== draftVersion)) {
      fail(SW, `expects draft version ${JSON.stringify(versions)}, src/lib/draft.ts writes ${draftVersion}`);
    }
    // What the offline page says when a draft is there: statePanel.draftSaved, in both
    // languages (each copy is held to the dictionary above).
    for (const lang of ["en", "ar"]) {
      if (!worker.includes(`saved: "${VOCAB[lang].draftSaved}"`)) {
        fail(SW, `reads the draft but has no saved: "${VOCAB[lang].draftSaved}" (statePanel.draftSaved, ${lang})`);
      }
    }
  }
}

for (const problem of problems) console.log(problem);
console.log(
  `check-consistency: ${problems.length} problem(s); ${ctaCount} CTAs on ${pages.length} pages, ` +
    `breadcrumbs on ${pages.length - 3}, ${checkedFiles} self-contained file(s) checked for phone and hours`
);
process.exit(problems.length ? 1 : 0);
