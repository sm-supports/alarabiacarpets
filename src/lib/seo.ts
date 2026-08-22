/**
 * Shared SEO constants and structured-data builders.
 *
 * Replaces the old client-side <SEO> react-helmet-async component. Metadata is
 * now emitted server-side by the Next.js Metadata API, so it lands in the static
 * HTML rather than being injected after hydration.
 */

export const SITE_NAME = "Al Arabia Carpets";
export const SITE_URL = "https://alarabiacarpets.com";
export const DEFAULT_IMAGE = "/lovable-uploads/green-white-logo.webp";
// Kept under 60 characters so Google does not truncate it in results.
export const DEFAULT_TITLE = `${SITE_NAME} | Carpets, Barkia & Interior Design Qatar`;
// Kept within the ~160 character budget search engines display.
export const DEFAULT_DESCRIPTION =
  "Qatar's provider of premium Barkia, PVC flooring, carpets, sofas, curtains & interior design. Free installation & delivery across Doha.";

export const PHONE = "+974 5551 2858";
export const PHONE_E164 = "+97455512858";
export const EMAIL = "info@alarabiacarpets.com";
export const STREET = "Al Mansoura St";
export const CITY = "Doha";
export const COUNTRY = "Qatar";
export const LATITUDE = 25.276987;
export const LONGITUDE = 51.520008;

/**
 * Meta descriptions are truncated at 155 chars so search engines don't clip
 * mid-word. Ported verbatim from the old SEO component.
 */
export function clampDescription(description: string): string {
  return description.length > 155 ? `${description.slice(0, 152)}...` : description;
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
];

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: STREET,
  addressLocality: CITY,
  addressCountry: COUNTRY,
};

const GEO = { "@type": "GeoCoordinates", latitude: LATITUDE, longitude: LONGITUDE };

/**
 * LocalBusiness schema, ported from the old index.html.
 * Note `image` is now absolute -- it was a relative path before, which is invalid.
 */
export function buildLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    description:
      "Premium home furnishing solutions including Barkia, PVC flooring, carpets, sofas, curtains and interior design services in Qatar",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    address: POSTAL_ADDRESS,
    geo: GEO,
    openingHours: "Mo-Su 08:00-22:00",
    priceRange: "$$",
    image: absoluteUrl(DEFAULT_IMAGE),
    sameAs: SOCIAL_PROFILES,
    serviceArea: { "@type": "GeoCircle", geoMidpoint: GEO, geoRadius: "50000" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Home Furnishing Services",
      itemListElement: SERVICES.map(([name, description]) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name, description },
      })),
    },
  };
}

export function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_IMAGE),
    email: EMAIL,
    telephone: PHONE,
    address: POSTAL_ADDRESS,
    sameAs: SOCIAL_PROFILES,
  };
}

export function buildWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** @param trail ordered [name, path] pairs, excluding the implicit Home root. */
export function buildBreadcrumb(trail: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"], ...trail].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export function buildFaq(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function buildItemList(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

// --- Product helpers -------------------------------------------------------

import type { Product } from "@/data/products";

export const CATEGORY_LABELS: Record<string, string> = {
  barkia: "Barkia & PVC",
  carpet: "Carpets",
  furniture: "Furniture",
  curtains: "Curtains",
  interior: "Interior Design",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

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
export function buildTitle(base: string): string {
  const suffix = ` | ${SITE_NAME}`;
  if (base.length + suffix.length <= TITLE_MAX) return base + suffix;
  if (base.length <= TITLE_MAX) return base;
  return `${base.slice(0, TITLE_MAX - 1).trimEnd()}\u2026`;
}

export function productTitle(product: Product): string {
  if (product.seoTitle) return buildTitle(product.seoTitle);
  // Several product names already contain "Qatar" or "Doha"; appending the
  // location again produces titles like "... SPC Qatar in Qatar".
  const hasLocation = /qatar|doha/i.test(product.name);
  if (hasLocation) return buildTitle(product.name);
  // Prefer dropping the location suffix over truncating the product name.
  const withLocation = `${product.name} in Qatar`;
  return buildTitle(withLocation.length <= TITLE_MAX ? withLocation : product.name);
}

export function productDescription(product: Product): string {
  if (product.metaDescription) return product.metaDescription;
  return `${product.name} - ${product.description} Free installation & delivery in Qatar. Contact ${SITE_NAME} at ${PHONE}.`;
}

export function productImageAlt(product: Product): string {
  return product.imageAlt ?? `${product.name} - ${categoryLabel(product.category)} by ${SITE_NAME} in ${CITY}, ${COUNTRY}`;
}

/**
 * Product JSON-LD.
 *
 * `offers` is emitted only when a real price exists. Every product's `price`
 * field is the display string "Contact for Price", so the previous schema sent
 * an Offer carrying priceCurrency but no price -- invalid, which suppressed the
 * rich result and left a standing error in Search Console. Omitting `offers`
 * is valid schema.org; emitting a fake price of 0 would read as "free".
 */
export function buildProductJsonLd(product: Product) {
  const hasPrice = typeof product.priceFrom === "number";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription ?? product.description,
    image: absoluteUrl(product.imageSrc),
    sku: product.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: categoryLabel(product.category),
    ...(hasPrice
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "QAR",
            lowPrice: product.priceFrom,
            highPrice: product.priceTo ?? product.priceFrom,
            availability: "https://schema.org/InStock",
            url: absoluteUrl(productPath(product)),
            seller: { "@id": `${SITE_URL}/#organization` },
          },
        }
      : {}),
  };
}
