/**
 * Checks the Arabic pages against their English twins, run against out/.
 *
 * Fails on what would be invisible in review: a price or measurement that changed
 * in translation, English left on an Arabic page, broken hreflang, or a title too
 * long for search results. It cannot judge whether the Arabic reads naturally.
 *
 * The first loop covers every page in both languages. Besides titles, descriptions
 * and headings, it fails when a title is identical to the h1, when structured data
 * carries inLanguage on a type that does not define it, or when a Product lacks an
 * offer, a price or an offerCount. These came from a site audit and from Search
 * Console, and none shows up when looking at the page.
 */
import fs from "node:fs";

const SITE = "https://alarabiacarpets.com";
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

// Latin text allowed on an Arabic page: materials, trade terms, brands, contact details.
const LATIN_OK = new Set(
  "PVC SPC UV MDF HPL HDF LED LVT HDMI WPC EVA WhatsApp C-Board Board Karndean Instagram Facebook EN English QAR com info alarabiacarpets your email Al Arabia Carpets Ezdan Mall Enormous Festival City Khalij MUFTAH GROUP Anaka event planning ALSAM Trading contacting service L.L.C GRADE ONE Contracting Inworth Petro guard offshore Shapelier Asia Engineering Services Aquatech for trading contracting WLL New star Co W.L.L".split(" ")
);

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const fileFor = (url) => `out${url === "/" ? "/index" : url}.html`;

// schema.org defines inLanguage for creative works (pages, articles), not for things
// or businesses. On Product, Service, Organization or LocalBusiness, audits report it
// as a structured data error. Add a type here only after checking schema.org.
const IN_LANGUAGE_OK = new Set(["WebSite", "WebPage", "CollectionPage", "FAQPage", "Article"]);

// Search Console's Product snippets report. A Product with no offer is invalid there
// (we have no reviews to mark up instead), and an AggregateOffer without offerCount is
// reported as a warning on every priced page.
function productProblems(product) {
  const offers = [product.offers].flat().filter(Boolean);
  if (!offers.length) return ["structured data has a Product with no offers"];
  const problems = [];
  for (const offer of offers) {
    if ([offer["@type"]].flat().includes("AggregateOffer")) {
      if (typeof offer.lowPrice !== "number" || !offer.priceCurrency) {
        problems.push("structured data has an AggregateOffer without lowPrice or priceCurrency");
      }
      if (typeof offer.offerCount !== "number") {
        problems.push("structured data has an AggregateOffer without offerCount");
      }
    } else if (typeof offer.price !== "number" && typeof offer.priceSpecification?.price !== "number") {
      problems.push("structured data has a Product offer without a price");
    }
  }
  return problems;
}

function jsonLdProblems(html) {
  const problems = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const types = [node["@type"]].flat().filter(Boolean);
    if ("inLanguage" in node && !types.some((t) => IN_LANGUAGE_OK.has(t))) {
      problems.push(`structured data has inLanguage on ${types.join("/") || "an untyped node"}`);
    }
    if (types.includes("Product")) problems.push(...productProblems(node));
    Object.values(node).forEach(walk);
  };
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      walk(JSON.parse(json));
    } catch {
      problems.push("a structured data block is not valid JSON");
    }
  }
  return problems;
}

function read(url) {
  const html = fs.readFileSync(fileFor(url), "utf8");
  const main = /<main\b[\s\S]*<\/main>/.exec(html)?.[0] ?? "";
  const text = decode(
    main
      .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  );
  return {
    html,
    text,
    title: decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? ""),
    description: decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? ""),
    h1s: (main.match(/<h1\b/g) ?? []).length,
    h1: decode(
      (/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(main)?.[1] ?? "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    ),
    headings: [...main.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1])),
    numbers: (text.match(/\d+(?:[.,]\d+)*/g) ?? []).sort(),
  };
}

const urls = [...new Set(
  [...fs.readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/")
)];
const arUrls = urls.filter((u) => u === "/ar" || u.startsWith("/ar/"));
const enUrls = urls.filter((u) => !arUrls.includes(u));

const errors = [];
const seenTitle = new Map();
const seenDescription = new Map();

for (const url of urls) {
  const page = read(url);
  if (!page.title) errors.push(`${url}: no title`);
  if (page.title.length > TITLE_MAX) errors.push(`${url}: title ${page.title.length} chars: ${page.title}`);
  if (page.description.length > DESCRIPTION_MAX) errors.push(`${url}: description ${page.description.length} chars`);
  if (seenTitle.has(page.title)) errors.push(`${url}: duplicate title with ${seenTitle.get(page.title)}: ${page.title}`);
  if (seenDescription.has(page.description)) errors.push(`${url}: duplicate description with ${seenDescription.get(page.description)}`);
  seenTitle.set(page.title, url);
  seenDescription.set(page.description, url);
  if (page.h1s !== 1) errors.push(`${url}: ${page.h1s} h1 tags`);
  // With the brand after it the title is fine; a bare copy of the heading is not.
  if (page.h1 && page.title === page.h1) errors.push(`${url}: title is identical to the h1: ${page.title}`);
  for (const problem of jsonLdProblems(page.html)) errors.push(`${url}: ${problem}`);
  page.headings.forEach((level, i) => {
    if (i > 0 && level > page.headings[i - 1] + 1) errors.push(`${url}: heading skips h${page.headings[i - 1]} to h${level}`);
  });
}

if (arUrls.length !== enUrls.length) errors.push(`sitemap: ${enUrls.length} English URLs but ${arUrls.length} Arabic`);

for (const arUrl of arUrls) {
  const enUrl = arUrl === "/ar" ? "/" : arUrl.slice(3);
  if (!enUrls.includes(enUrl)) {
    errors.push(`${arUrl}: no English twin`);
    continue;
  }
  const ar = read(arUrl);
  const en = read(enUrl);

  if (!ar.html.includes('<html lang="ar-QA" dir="rtl"')) errors.push(`${arUrl}: wrong <html> lang/dir`);
  if (!en.html.includes('<html lang="en"')) errors.push(`${enUrl}: wrong <html> lang`);
  for (const [page, label] of [[ar, arUrl], [en, enUrl]]) {
    if (!page.html.includes(`hrefLang="ar-QA" href="${SITE}${arUrl}"`)) errors.push(`${label}: missing ar-QA hreflang`);
    if (!page.html.includes(`hrefLang="en" href="${SITE}${enUrl === "/" ? "" : enUrl}`)) errors.push(`${label}: missing en hreflang`);
    if (!page.html.includes(`hrefLang="x-default"`)) errors.push(`${label}: missing x-default hreflang`);
  }
  if (!ar.html.includes(`rel="canonical" href="${SITE}${arUrl}"`)) errors.push(`${arUrl}: wrong canonical`);

  if (/[٠-٩]/.test(ar.text)) errors.push(`${arUrl}: Arabic-Indic digits`);

  // Each number on the English page must survive translation. English-only numbers
  // like "24" in a phone-free sentence are real drift, so this is a multiset check.
  const remaining = [...ar.numbers];
  const missing = [];
  for (const n of en.numbers) {
    const at = remaining.indexOf(n);
    if (at === -1) missing.push(n);
    else remaining.splice(at, 1);
  }
  if (missing.length) errors.push(`${arUrl}: numbers missing vs English: ${missing.join(" ")} (extra: ${remaining.join(" ") || "none"})`);

  const latin = [...new Set(ar.text.replace(/\S+@\S+/g, " ").match(/[A-Za-z][A-Za-z.-]*[A-Za-z]/g) ?? [])].filter((w) => !LATIN_OK.has(w));
  if (latin.length) errors.push(`${arUrl}: leftover Latin: ${latin.slice(0, 12).join(" ")}`);
}

for (const e of errors) console.log(e);
console.log(`check-arabic: ${arUrls.length} Arabic pages, ${errors.length} problems`);
process.exit(errors.length ? 1 : 0);
