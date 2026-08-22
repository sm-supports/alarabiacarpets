import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/seo";

/**
 * Replaces scripts/generate-sitemap.ts, which regex-scraped `"id": "..."` out of
 * the raw text of products.ts. That broke if a key was ever unquoted and
 * over-matched any nested "id" field. A typed import cannot drift.
 */
// Required under output: 'export' -- without it Next treats this metadata route
// as dynamic and refuses to emit it as a static file.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
