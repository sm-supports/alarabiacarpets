import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required under output: 'export' -- without it Next treats this metadata route
// as dynamic and refuses to emit it as a static file.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
