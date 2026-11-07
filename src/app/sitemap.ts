import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { HTML_LANG, localePath } from "@/i18n/config";
import { SITE_URL } from "@/lib/seo";

/**
 * Replaces scripts/generate-sitemap.ts, which regex-scraped `"id": "..."` out of
 * the raw text of products.ts. That broke if a key was ever unquoted and
 * over-matched any nested "id" field. A typed import cannot drift.
 */
// Required under output: 'export' -- without it Next treats this metadata route
// as dynamic and refuses to emit it as a static file.
export const dynamic = "force-static";

// lastModified appears only where a record says when its content really changed.
// Stamping every page with the build date tells Google nothing, and Google stops
// trusting a lastmod that is always "now".
const lastModified = (updatedAt?: string) => (updatedAt ? { lastModified: new Date(updatedAt) } : {});

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.7 },
    // Category landing pages -- the transactional money pages, ranked highest
    // after the homepage.
    ...categories.map((c) => ({
      url: `${SITE_URL}/products/${c.slug}`,
      ...lastModified(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.7 },
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      ...lastModified(s.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      ...lastModified(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guides.map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Every page exists in both languages, so each English entry gains an Arabic
  // twin, and both carry the same hreflang set as the page's <head>.
  return pages.flatMap((page) => {
    const path = page.url.slice(SITE_URL.length) || "/";
    const languages = {
      en: `${SITE_URL}${path}`,
      [HTML_LANG.ar]: `${SITE_URL}${localePath("ar", path)}`,
      "x-default": `${SITE_URL}${path}`,
    };
    return [
      { ...page, alternates: { languages } },
      { ...page, url: languages[HTML_LANG.ar], alternates: { languages } },
    ];
  });
}
