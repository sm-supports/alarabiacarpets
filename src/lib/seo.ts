/**
 * Shared SEO constants and structured-data builders.
 *
 * Replaces the old client-side <SEO> react-helmet-async component. Metadata is
 * now emitted server-side by the Next.js Metadata API, so it lands in the static
 * HTML rather than being injected after hydration.
 */

import { HTML_LANG, localePath, type Locale } from "@/i18n/config";
import { localizedCategoryLabel } from "@/i18n/labels";
import { EMAIL, PHONE, PHONE_E164, WHATSAPP_URL } from "@/lib/site";

export { EMAIL, PHONE, PHONE_E164, WHATSAPP_URL };

export const SITE_NAME = "Al Arabia Carpets";
export const SITE_NAME_AR = "سجاد العربية";
export const SITE_URL = "https://alarabiacarpets.com";
export const DEFAULT_IMAGE = "/lovable-uploads/green-white-logo.webp";
// Kept under 60 characters so Google does not truncate it in results.
export const DEFAULT_TITLE = `${SITE_NAME} | Carpets, Barkia & Interior Design Qatar`;
// Kept within the ~160 character budget search engines display.
export const DEFAULT_DESCRIPTION =
  "Qatar's provider of premium Barkia, PVC flooring, carpets, sofas, curtains & interior design. Free installation & delivery across Doha.";

export const STREET = "Al Mansoura St";
export const CITY = "Doha";
export const COUNTRY = "Qatar";
export const LATITUDE = 25.276987;
export const LONGITUDE = 51.520008;

/**
 * Meta descriptions are truncated at 155 chars so search engines don't clip
 * mid-word. Ported verbatim from the old SEO component.
 */
/**
 * Share image for pages with no imagery of their own.
 *
 * Next REPLACES the openGraph object rather than merging it, so a page that
 * defines `openGraph` without `images` gets no og:image at all -- not the root
 * layout's. Any such page must spread this in.
 */
export const DEFAULT_OG_IMAGES = [{ url: DEFAULT_IMAGE, alt: SITE_NAME }];

export function defaultOgImages(locale: Locale = "en") {
  return locale === "ar" ? [{ url: DEFAULT_IMAGE, alt: SITE_NAME_AR }] : DEFAULT_OG_IMAGES;
}

/**
 * Fields Arabic pages must repeat in their openGraph object: Next replaces it
 * rather than merging, so the root layout's og:locale would otherwise be lost.
 */
export function ogLocaleFields(locale: Locale = "en") {
  return locale === "ar" ? { locale: "ar_QA", siteName: SITE_NAME_AR } : {};
}

/**
 * Self-canonical plus the hreflang set. English stays x-default: it holds the
 * URLs already indexed and cited, and it is the version for visitors outside
 * Qatar. `path` is always the English form of the path.
 */
export function pageAlternates(path: string, locale: Locale = "en") {
  return {
    canonical: localePath(locale, path),
    languages: { en: path, [HTML_LANG.ar]: localePath("ar", path), "x-default": path },
  };
}

export function clampDescription(description: string): string {
  if (description.length <= 155) return description;
  // Cut at the last word boundary so the snippet never ends mid-word.
  const clipped = description.slice(0, 152);
  const lastSpace = clipped.lastIndexOf(" ");
  const base = lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped;
  return `${base.replace(/[\s.,;:-]+$/, "")}...`;
}

/**
 * Make a site-relative path absolute and URL-safe.
 *
 * Product image paths contain spaces, colons and ampersands (e.g.
 * "/Products/Carpets/Event:normal carpet.jpeg"). Browsers tolerate those in an
 * <img src>, but social scrapers reject an unencoded og:image, so anything
 * emitted into metadata or JSON-LD has to go through here.
 */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${encodeURI(path)}`;
}

const SOCIAL_PROFILES = [
  "https://facebook.com/alarabiacarpets",
  "https://instagram.com/alarabiacarpet",
];

const SERVICES = [
  ["Barkia & PVC Flooring Installation", "Premium Barkia and PVC flooring installation with free delivery"],
  ["Carpets & Grass Carpets", "High-quality carpets and artificial grass carpets for indoor and outdoor use"],
  ["Sofas & Majlis Furniture", "Custom sofas and traditional majlis furniture solutions"],
  ["Curtains & Roller Blinds", "Custom curtains and roller blinds for residential and commercial spaces"],
  ["Interior Design Services", "Complete interior design solutions for homes and offices"],
  ["Wallpaper Installation", "Wallpaper supply and installation including full wall preparation"],
  ["Kitchen Cabinets", "Made-to-measure kitchen cabinetry designed, built and installed"],
  ["Wardrobes & Room Cabinets", "Built-in wardrobes and storage sized floor to ceiling"],
  ["Parquet & Laminate Flooring", "Herringbone, chevron and plank parquet and laminate supplied and laid"],
  ["Event Carpet Installation", "Event carpet supplied and laid for exhibitions, conferences and weddings, then lifted"],
  ["Office Carpet & Carpet Tiles", "Contract carpet tiles and broadloom supplied and fitted around business hours"],
  ["Vinyl & SPC Flooring", "Waterproof vinyl, PVC and rigid-core SPC flooring supplied and installed"],
  ["Artificial Grass Installation", "Artificial grass and grass carpet laid over a compacted, free-draining base"],
  ["Gypsum & C-Board Fixing", "False ceilings, coves, bulkheads and partitions boarded and finished ready for paint"],
  ["Custom Sofa Making", "Sofas and majlis seating made to the room's measurements in your choice of fabric"],
  ["Sofa Upholstery & Repair", "New fabric, new foam and frame repairs for existing sofas and majlis seating"],
  ["TV Unit Design", "Built-in TV units and panelled feature walls with concealed lighting and cabling"],
  ["Custom Cabinets", "Made-to-measure cabinetry for kitchens, bedrooms, living rooms and offices"],
];

/**
 * Cities named in the Service schema's areaServed. Kept in step with the AREAS
 * sentence in src/data/services.ts, which says the same thing to human readers.
 */
export const SERVICE_AREAS = ["Doha", "Al Rayyan", "Al Wakra", "Al Khor", "Lusail"];

/** schema.org openingHours, plus the same hours for human readers. Keep the two in step. */
export const OPENING_HOURS = "Mo-Su 08:00-22:00";
export const OPENING_HOURS_TEXT = "Every day, 8:00 AM to 10:00 PM";

/**
 * OPENING_HOURS as an OpeningHoursSpecification, the form Google documents for
 * LocalBusiness. Throws if OPENING_HOURS stops being one daily range, so a change
 * there cannot leave the two out of step.
 */
function openingHoursSpecification() {
  const m = OPENING_HOURS.match(/^Mo-Su (\d\d:\d\d)-(\d\d:\d\d)$/);
  if (!m) throw new Error(`OPENING_HOURS "${OPENING_HOURS}" is not one daily range; update openingHoursSpecification()`);
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: m[1],
    closes: m[2],
  };
}

const COUNTRY_AR = "قطر";
const SERVICE_AREAS_AR = ["الدوحة", "الريان", "الوكرة", "الخور", "لوسيل"];

const SERVICES_AR = [
  ["توريد وتركيب الباركيه وأرضيات PVC", "توريد وتركيب الباركيه وأرضيات PVC الفاخرة مع توصيل مجاني"],
  ["السجاد والعشب الصناعي", "سجاد عالي الجودة وعشب صناعي للاستخدام الداخلي والخارجي"],
  ["الكنب وأثاث المجالس", "كنب حسب الطلب وحلول أثاث المجالس التقليدية"],
  ["الستائر وستائر الرول", "ستائر وستائر رول حسب الطلب للبيوت والمنشآت التجارية"],
  ["خدمات التصميم الداخلي", "حلول تصميم داخلي متكاملة للبيوت والمكاتب"],
  ["تركيب ورق الجدران", "توريد وتركيب ورق الجدران مع تجهيز كامل للجدار"],
  ["خزائن المطابخ", "خزائن مطابخ حسب المقاس، تصميم وتصنيع وتركيب"],
  ["خزائن الملابس والغرف", "خزائن ملابس وتخزين مدمجة من الأرضية إلى السقف"],
  ["الباركيه الخشبي واللامينيت", "توريد وتركيب الباركيه الخشبي واللامينيت بنقشة السمكة والشيفرون والألواح"],
  ["تركيب سجاد المناسبات", "توريد وفرش سجاد المناسبات للمعارض والمؤتمرات والأعراس، ثم رفعه بعد المناسبة"],
  ["سجاد المكاتب ومربعات الموكيت", "مربعات الموكيت والموكيت التجاري، توريد وتركيب خارج ساعات الدوام"],
  ["أرضيات الفينيل و SPC", "توريد وتركيب أرضيات الفينيل و PVC و SPC المقاومة للماء"],
  ["تركيب العشب الصناعي", "فرش العشب الصناعي وسجاد العشب فوق قاعدة مدكوكة جيدة التصريف"],
  ["تركيب جبس بورد وألواح C-Board", "أسقف مستعارة وكرانيش وفواصل جاهزة للدهان"],
  ["تنجيد الكنب وإصلاحه", "قماش جديد وإسفنج جديد وإصلاح الهياكل للكنب وجلسات المجالس القائمة"],
  ["تفصيل الكنب", "كنب وجلسات مجالس حسب مقاس الغرفة وبالقماش الذي تختاره"],
  ["تصميم وحدات التلفزيون", "وحدات تلفزيون مدمجة وجدران ديكورية مع إضاءة وتمديدات مخفية"],
  ["الخزائن حسب الطلب", "خزائن حسب المقاس للمطابخ وغرف النوم والمعيشة والمكاتب"],
];

function areaServed(locale: Locale = "en") {
  const country = locale === "ar" ? COUNTRY_AR : COUNTRY;
  const areas = locale === "ar" ? SERVICE_AREAS_AR : SERVICE_AREAS;
  return [
    { "@type": "Country", name: country },
    ...areas.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "Country", name: country },
    })),
  ];
}

// addressCountry is the ISO 3166-1 code in both languages: Google asks for the code.
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: STREET,
  addressLocality: CITY,
  addressCountry: "QA",
};

const POSTAL_ADDRESS_AR = {
  "@type": "PostalAddress",
  streetAddress: "شارع المنصورة",
  addressLocality: "الدوحة",
  addressCountry: "QA",
};

/** Name fields shared by the Organization, LocalBusiness and WebSite nodes. */
function nameFields(locale: Locale) {
  return locale === "ar"
    ? { name: SITE_NAME_AR, alternateName: SITE_NAME }
    : { name: SITE_NAME, alternateName: SITE_NAME_AR };
}

/**
 * Adds inLanguage to Arabic nodes and leaves English output untouched.
 *
 * Only for creative works: WebSite, FAQPage, CollectionPage, Article. schema.org
 * does not define inLanguage on Product, Service, Organization or LocalBusiness,
 * and site audits report it there as a structured data error. check-arabic fails
 * the build if it comes back.
 */
function langField(locale: Locale) {
  return locale === "ar" ? { inLanguage: HTML_LANG.ar } : {};
}

const GEO = { "@type": "GeoCoordinates", latitude: LATITUDE, longitude: LONGITUDE };

/**
 * LocalBusiness schema, ported from the old index.html.
 * Note `image` is now absolute -- it was a relative path before, which is invalid.
 */
export function buildLocalBusiness(locale: Locale = "en") {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": `${SITE_URL}/#localbusiness`,
    ...nameFields(locale),
    description: isAr
      ? "حلول مفروشات منزلية فاخرة تشمل الباركيه وأرضيات PVC والسجاد والكنب والستائر وخدمات التصميم الداخلي في قطر"
      : "Premium home furnishing solutions including Barkia, PVC flooring, carpets, sofas, curtains and interior design services in Qatar",
    url: isAr ? `${SITE_URL}/ar` : SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    knowsLanguage: ["ar", "en"],
    address: isAr ? POSTAL_ADDRESS_AR : POSTAL_ADDRESS,
    geo: GEO,
    openingHoursSpecification: openingHoursSpecification(),
    priceRange: "$$",
    image: absoluteUrl(DEFAULT_IMAGE),
    logo: absoluteUrl(DEFAULT_IMAGE),
    // The store is the company's showroom. Both nodes sit on the home page, so the
    // bare @id resolves there.
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    sameAs: SOCIAL_PROFILES,
    areaServed: areaServed(locale),
    // Plain names, not Offers: the project never emits a price-less Offer.
    knowsAbout: (isAr ? SERVICES_AR : SERVICES).map(([name]) => name),
  };
}

export function buildOrganization(locale: Locale = "en") {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    ...nameFields(locale),
    url: isAr ? `${SITE_URL}/ar` : SITE_URL,
    logo: absoluteUrl(DEFAULT_IMAGE),
    email: EMAIL,
    telephone: PHONE,
    knowsLanguage: ["ar", "en"],
    address: isAr ? POSTAL_ADDRESS_AR : POSTAL_ADDRESS,
    sameAs: SOCIAL_PROFILES,
  };
}

/**
 * A named pointer to the Organization node, for author, publisher, provider and
 * seller. Only the home page carries the full node, so a bare { "@id" } leaves the
 * company anonymous on every other page. The shared @id lets Google merge this
 * with the full node; `logo` is for Article publishers.
 */
export function orgRef(locale: Locale = "en", opts: { logo?: boolean } = {}) {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME,
    url: locale === "ar" ? `${SITE_URL}/ar` : SITE_URL,
    ...(opts.logo ? { logo: absoluteUrl(DEFAULT_IMAGE) } : {}),
  };
}

export function buildWebSite(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    ...nameFields(locale),
    ...langField(locale),
    url: locale === "ar" ? `${SITE_URL}/ar` : SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** @param trail ordered [name, English path] pairs, excluding the implicit Home root. */
export function buildBreadcrumb(trail: Array<[string, string]>, locale: Locale = "en") {
  const home = locale === "ar" ? "الرئيسية" : "Home";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [[home, "/"], ...trail].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(localePath(locale, path)),
    })),
  };
}

export function buildFaq(faqs: Array<{ q: string; a: string }>, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...langField(locale),
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function buildItemList(items: Array<{ name: string; path: string }>, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(localePath(locale, item.path)),
    })),
  };
}

// --- Product helpers -------------------------------------------------------

import type { Product } from "@/data/products";

// Category labels live with the category data, which is the single source of
// truth. Re-exported here so existing import sites keep working unchanged.
import { categoryLabel } from "@/data/categories";
export { CATEGORY_LABELS, categoryLabel, categoryPath } from "@/data/categories";

export function productPath(product: Product): string {
  return `/products/${product.id}`;
}

/** Google truncates titles around 60 characters. */
export const TITLE_MAX = 60;

/**
 * Build a complete <title>, appending the brand only when it still fits inside
 * the display budget. Product pages emit this as `title.absolute` so the root
 * layout's "%s | Al Arabia Carpets" template does not append a second time and
 * push every title past the limit.
 */
export function buildTitle(base: string, locale: Locale = "en"): string {
  const suffix = ` | ${locale === "ar" ? SITE_NAME_AR : SITE_NAME}`;
  if (base.length + suffix.length <= TITLE_MAX) return base + suffix;
  if (base.length <= TITLE_MAX) return base;
  return `${base.slice(0, TITLE_MAX - 1).trimEnd()}\u2026`;
}

export function productTitle(product: Product, locale: Locale = "en"): string {
  if (product.seoTitle) return buildTitle(product.seoTitle, locale);
  if (locale === "ar") {
    if (/قطر|الدوحة/.test(product.name)) return buildTitle(product.name, locale);
    const located = `${product.name} في قطر`;
    return buildTitle(located.length <= TITLE_MAX ? located : product.name, locale);
  }
  // Several product names already contain "Qatar" or "Doha"; appending the
  // location again produces titles like "... SPC Qatar in Qatar".
  const hasLocation = /qatar|doha/i.test(product.name);
  if (hasLocation) return buildTitle(product.name);
  // Prefer dropping the location suffix over truncating the product name.
  const withLocation = `${product.name} in Qatar`;
  return buildTitle(withLocation.length <= TITLE_MAX ? withLocation : product.name);
}

export function productDescription(product: Product, locale: Locale = "en"): string {
  if (product.metaDescription) return product.metaDescription;
  if (locale === "ar") {
    return `${product.name} - ${product.description} توصيل وتركيب مجاني في قطر. تواصل مع ${SITE_NAME_AR} على ${PHONE}.`;
  }
  return `${product.name} - ${product.description} Free installation & delivery in Qatar. Contact ${SITE_NAME} at ${PHONE}.`;
}

/**
 * The image to advertise for a product in metadata and structured data.
 *
 * `imageSrc` is a display field and is a video for some products (their media[0]
 * is an .mp4). An og:image or schema.org Product.image pointing at a video
 * yields no social preview card and is rejected by the Rich Results Test, so
 * prefer the first real image in media[] and fall back to the site logo.
 */
export function productImage(product: Product): string {
  if (!product.imageSrc.endsWith(".mp4")) return product.imageSrc;
  const firstImage = product.media?.find(
    (m) => m.type === "image" && !m.src.endsWith(".mp4")
  );
  return firstImage?.src ?? DEFAULT_IMAGE;
}

export function productImageAlt(product: Product, locale: Locale = "en"): string {
  if (product.imageAlt) return product.imageAlt;
  if (locale === "ar") {
    const label = localizedCategoryLabel(locale, product.category, product.category);
    return `${product.name} - ${label} من ${SITE_NAME_AR} في الدوحة، قطر`;
  }
  return `${product.name} - ${categoryLabel(product.category)} by ${SITE_NAME} in ${CITY}, ${COUNTRY}`;
}

/** UN/CEFACT unit codes for the priceUnit display strings used in products.ts. */
const UNIT_CODES: Record<string, string> = {
  "per sqm": "MTK",
  "per piece": "C62",
};

/** Arabic unitText for the priceUnit display strings used in products.ts. */
const UNIT_TEXT_AR: Record<string, string> = {
  "per sqm": "متر مربع",
  "per piece": "قطعة",
  "per project": "مشروع",
};

/**
 * Product (or Service) JSON-LD for a catalogue item.
 *
 * Google treats a Product as invalid unless it carries `offers`, `review` or
 * `aggregateRating`, and we have no reviews to mark up. So:
 * - with a real `priceFrom`, emit Product + AggregateOffer (with the per-unit
 *   price spelled out as a UnitPriceSpecification);
 * - without one, emit a Service offered by the business -- no price required,
 *   and true for these items, which are quoted and installed on site.
 * Never emit a price-less Offer or a fake price of 0 (it reads as "free").
 *
 * The AggregateOffer carries `offerCount: 1`: each page is one offer from one
 * seller, and Search Console warns on every priced page without the field. It
 * stays an AggregateOffer because the price is a "from" price; a plain Offer would
 * state it as exact and enrol the page as a merchant listing, which then asks for
 * shipping and return policies we do not have.
 *
 * No `review` or `aggregateRating`: Google requires them to match real customer
 * reviews shown on the same page. Search Console lists both as optional warnings;
 * leave them until the site has real reviews. check-arabic guards the rest.
 */
export function buildProductJsonLd(product: Product, locale: Locale = "en") {
  const url = absoluteUrl(localePath(locale, productPath(product)));
  const label = localizedCategoryLabel(locale, product.category, categoryLabel(product.category));
  if (typeof product.priceFrom !== "number") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: product.name,
      description: product.metaDescription ?? product.description,
      image: absoluteUrl(productImage(product)),
      url,
      serviceType: label,
      provider: orgRef(locale),
      areaServed: areaServed(locale),
    };
  }

  const unitCode = product.priceUnit ? UNIT_CODES[product.priceUnit] : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription ?? product.description,
    image: absoluteUrl(productImage(product)),
    sku: product.id,
    brand: { "@type": "Brand", name: locale === "ar" ? SITE_NAME_AR : SITE_NAME },
    category: label,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "QAR",
      lowPrice: product.priceFrom,
      highPrice: product.priceTo ?? product.priceFrom,
      offerCount: 1,
      availability: "https://schema.org/InStock",
      url,
      seller: orgRef(locale),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: product.priceFrom,
        priceCurrency: "QAR",
        ...(unitCode ? { unitCode } : {}),
        ...(product.priceUnit
          ? {
              unitText:
                locale === "ar"
                  ? UNIT_TEXT_AR[product.priceUnit] ?? product.priceUnit
                  : product.priceUnit.replace(/^per /, ""),
            }
          : {}),
      },
    },
  };
}

// --- Category landing pages ------------------------------------------------

import type { Metadata } from "next";
import type { Category } from "@/data/categories";

/**
 * CollectionPage wrapping an ItemList.
 *
 * Category pages emit this rather than Product: they have no SKU and no price,
 * so a Product schema there was never eligible for a rich result.
 */
export function buildCollectionPage(
  opts: {
    name: string;
    description: string;
    path: string;
    items: Array<{ name: string; path: string }>;
  },
  locale: Locale = "en"
) {
  const pageUrl = absoluteUrl(localePath(locale, opts.path));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    ...langField(locale),
    name: opts.name,
    description: opts.description,
    url: pageUrl,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(localePath(locale, item.path)),
      })),
    },
  };
}

/**
 * Metadata for a category landing page.
 *
 * Titles and descriptions are reused verbatim from the hub products these pages
 * replaced -- they are already indexed and already inside the 60/160 budgets, so
 * the page type changes without also changing the SERP signals.
 */
export function buildCategoryMetadata(category: Category, locale: Locale = "en"): Metadata {
  const path = `/products/${category.slug}`;
  const title = buildTitle(category.seoTitle, locale);

  return {
    title: { absolute: title },
    description: clampDescription(category.metaDescription),
    alternates: pageAlternates(path, locale),
    openGraph: {
      ...ogLocaleFields(locale),
      type: "website",
      title,
      description: category.metaDescription,
      url: localePath(locale, path),
      images: [{ url: absoluteUrl(category.heroImage), alt: category.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: category.metaDescription,
      images: [absoluteUrl(category.heroImage)],
    },
  };
}

// --- Service landing pages -------------------------------------------------

/**
 * Service schema.
 *
 * Emits `image` only when the service has real project photography, and `offers`
 * only when the page shows a starting price. Same discipline as Product: assert
 * nothing we cannot back up.
 */
export function buildServiceJsonLd(
  service: {
    slug: string;
    heading: string;
    label: string;
    metaDescription: string;
    heroImage?: string;
    priceFrom?: number;
  },
  locale: Locale = "en"
) {
  const url = absoluteUrl(localePath(locale, `/services/${service.slug}`));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.heading,
    serviceType: service.label,
    description: service.metaDescription,
    url,
    provider: orgRef(locale),
    areaServed: areaServed(locale),
    // Only when a real project photo exists -- never the brand logo, which
    // would assert imagery of work we cannot show.
    ...(service.heroImage ? { image: absoluteUrl(service.heroImage) } : {}),
    ...(service.priceFrom
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "QAR",
            lowPrice: service.priceFrom,
            offerCount: 1,
            url,
          },
        }
      : {}),
  };
}
