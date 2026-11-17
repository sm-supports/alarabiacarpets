import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { AR_CATEGORY_LABELS, AR_SERVICE_LABELS } from "@/i18n/labels";
import { WHATSAPP_URL } from "@/lib/seo";
import { authors, type Author } from "./authors";
import { categories, type Category } from "./categories";
import { guides, type Guide } from "./guides";
import { products, type Product } from "./products";
import { services, type Service } from "./services";
import { arAuthors } from "./ar/authors";
import { arCategories } from "./ar/categories";
import { arGuides } from "./ar/guides";
import { arProducts } from "./ar/products";
import { arServices } from "./ar/services";

/**
 * Content in the requested language. Server components only: this pulls every
 * page's copy in both languages, so it must not reach the browser bundle.
 *
 * English records are returned untouched. Arabic records are the English record
 * with the translated fields laid over it, so ids, images, prices and related
 * links keep one source of truth. A missing translation throws at build, the same
 * discipline as the relatedProductIds assertions: no page can silently fall back
 * to English.
 */
function need<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new Error(`Missing Arabic translation: ${what}`);
  return value;
}

const OPTIONAL_PRODUCT_FIELDS = ["longDescription", "specs", "faqs", "seoTitle", "metaDescription", "imageAlt"] as const;

const arProductList: Product[] = products.map((p) => {
  const t = need(arProducts[p.id], `product ${p.id}`);
  for (const field of OPTIONAL_PRODUCT_FIELDS) {
    if (p[field] !== undefined) need(t[field], `product ${p.id}.${field}`);
  }
  return {
    ...p,
    ...t,
    analyticsName: p.name,
    price: getDict("ar").price.contact,
    whatsappLink: `${WHATSAPP_URL}?text=${encodeURIComponent(getDict("ar").common.interestedMessage(t.name))}`,
  };
});

const arCategoryList: Category[] = categories.map((c) => {
  const t = need(arCategories[c.slug], `category ${c.slug}`);
  if (c.specs) need(t.specs, `category ${c.slug}.specs`);
  if (c.faqs) need(t.faqs, `category ${c.slug}.faqs`);
  if (c.secondary) need(t.secondary, `category ${c.slug}.secondary`);
  return { ...c, ...t, label: need(AR_CATEGORY_LABELS[c.slug], `category label ${c.slug}`) };
});

const arServiceList: Service[] = services.map((s) => {
  const { galleryAlts, ...t } = need(arServices[s.slug], `service ${s.slug}`);
  if (s.secondary) need(t.secondary, `service ${s.slug}.secondary`);
  if (s.heroImageAlt) need(t.heroImageAlt, `service ${s.slug}.heroImageAlt`);
  if (s.gallery && galleryAlts?.length !== s.gallery.length) {
    throw new Error(`Arabic gallery alts do not match gallery: service ${s.slug}`);
  }
  return {
    ...s,
    ...t,
    label: need(AR_SERVICE_LABELS[s.slug], `service label ${s.slug}`),
    gallery: s.gallery?.map((img, i) => ({ src: img.src, alt: galleryAlts![i] })),
  };
});

const arGuideList: Guide[] = guides.map((g) => {
  const t = need(arGuides[g.slug], `guide ${g.slug}`);
  if (g.faqs) need(t.faqs, `guide ${g.slug}.faqs`);
  if (g.seoTitle) need(t.seoTitle, `guide ${g.slug}.seoTitle`);
  return { ...g, ...t };
});

// The name stays as the person writes it; only the role and bio are translated.
const arAuthorList: Author[] = authors.map((a) => ({ ...a, ...need(arAuthors[a.id], `author ${a.id}`) }));

export function getAuthors(locale: Locale): Author[] {
  return locale === "ar" ? arAuthorList : authors;
}
export function findAuthor(locale: Locale, id: string): Author | undefined {
  return getAuthors(locale).find((a) => a.id === id);
}

export function getProducts(locale: Locale): Product[] {
  return locale === "ar" ? arProductList : products;
}
export function getCategories(locale: Locale): Category[] {
  return locale === "ar" ? arCategoryList : categories;
}
export function getServices(locale: Locale): Service[] {
  return locale === "ar" ? arServiceList : services;
}
export function getGuides(locale: Locale): Guide[] {
  return locale === "ar" ? arGuideList : guides;
}

export function findProduct(locale: Locale, id: string): Product | undefined {
  return getProducts(locale).find((p) => p.id === id);
}
export function findCategory(locale: Locale, slug: string): Category | undefined {
  return getCategories(locale).find((c) => c.slug === slug);
}
export function findService(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
export function findGuide(locale: Locale, slug: string): Guide | undefined {
  return getGuides(locale).find((g) => g.slug === slug);
}

/** Short label for a `Product.category` value. */
export function categoryLabelFor(locale: Locale, key: string): string {
  return getCategories(locale).find((c) => c.key === key)?.label ?? key;
}

/** Landing page path (English form) for a `Product.category` value. */
export function categorySlugFor(key: string): string | undefined {
  return categories.find((c) => c.key === key)?.slug;
}

export function guidesForProductL(locale: Locale, productId: string): Guide[] {
  return getGuides(locale).filter((g) => g.relatedProductIds.includes(productId));
}
export function guidesForCategoryL(locale: Locale, slug: string): Guide[] {
  return getGuides(locale).filter((g) => g.relatedCategorySlugs?.includes(slug));
}
export function guidesForServiceL(locale: Locale, slug: string): Guide[] {
  return getGuides(locale).filter((g) => g.relatedServiceSlugs?.includes(slug));
}
/** Service pages that list this product as related work. */
export function servicesForProductL(locale: Locale, productId: string): Service[] {
  return getServices(locale).filter((s) => s.relatedProductIds.includes(productId));
}
