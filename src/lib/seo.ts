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
/**
 * WhatsApp click-to-chat link. wa.me's documented format is the number without
 * "+", spaces or dashes; the "+" form redirects too, but audit crawlers report it
 * as a broken external link.
 */
export const WHATSAPP_URL = `https://wa.me/${PHONE_E164.replace(/\D/g, "")}`;
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
/**
 * Share image for pages with no imagery of their own.
 *
 * Next REPLACES the openGraph object rather than merging it, so a page that
 * defines `openGraph` without `images` gets no og:image at all -- not the root
 * layout's. Any such page must spread this in.
 */
export const DEFAULT_OG_IMAGES = [{ url: DEFAULT_IMAGE, alt: SITE_NAME }];

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

function areaServed() {
  return [
    { "@type": "Country", name: COUNTRY },
    ...SERVICE_AREAS.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "Country", name: COUNTRY },
    })),
  ];
}

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
    openingHours: OPENING_HOURS,
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

export function productImageAlt(product: Product): string {
  return product.imageAlt ?? `${product.name} - ${categoryLabel(product.category)} by ${SITE_NAME} in ${CITY}, ${COUNTRY}`;
}

/** UN/CEFACT unit codes for the priceUnit display strings used in products.ts. */
const UNIT_CODES: Record<string, string> = {
  "per sqm": "MTK",
  "per piece": "C62",
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
 */
export function buildProductJsonLd(product: Product) {
  const url = absoluteUrl(productPath(product));
  if (typeof product.priceFrom !== "number") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: product.name,
      description: product.metaDescription ?? product.description,
      image: absoluteUrl(productImage(product)),
      url,
      serviceType: categoryLabel(product.category),
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: areaServed(),
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
    brand: { "@type": "Brand", name: SITE_NAME },
    category: categoryLabel(product.category),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "QAR",
      lowPrice: product.priceFrom,
      highPrice: product.priceTo ?? product.priceFrom,
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": `${SITE_URL}/#organization` },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: product.priceFrom,
        priceCurrency: "QAR",
        ...(unitCode ? { unitCode } : {}),
        ...(product.priceUnit ? { unitText: product.priceUnit.replace(/^per /, "") } : {}),
      },
    },
  };
}

// --- Category landing pages ------------------------------------------------

import type { Metadata } from "next";
import { getCategory } from "@/data/categories";

/**
 * CollectionPage wrapping an ItemList.
 *
 * Category pages emit this rather than Product: they have no SKU and no price,
 * so a Product schema there was never eligible for a rich result.
 */
export function buildCollectionPage(opts: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(opts.path)}#collection`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
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
export function buildCategoryMetadata(slug: string): Metadata {
  const category = getCategory(slug);
  if (!category) throw new Error(`Unknown category slug: ${slug}`);

  const path = `/products/${category.slug}`;
  const title = buildTitle(category.seoTitle);

  return {
    title: { absolute: title },
    description: clampDescription(category.metaDescription),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description: category.metaDescription,
      url: path,
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
 * Emits `image` only when the service has real project photography, and never
 * `offers` (there is no price). Same discipline as Product: assert nothing we
 * cannot back up.
 */
export function buildServiceJsonLd(service: {
  slug: string;
  heading: string;
  label: string;
  metaDescription: string;
  heroImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.heading,
    serviceType: service.label,
    description: service.metaDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: areaServed(),
    // Only when a real project photo exists -- never the brand logo, which
    // would assert imagery of work we cannot show.
    ...(service.heroImage ? { image: absoluteUrl(service.heroImage) } : {}),
  };
}
