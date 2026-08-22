import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required under output: 'export' -- without it Next treats this metadata route
// as dynamic and refuses to emit it as a static file.
export const dynamic = "force-static";

/**
 * AI crawlers, named explicitly so the decision to welcome them is visible in
 * the codebase and survives future edits to the wildcard rule.
 *
 * The product FAQs, specification tables and guides are deliberately written as
 * bullet lists and native <details> so these crawlers can extract and cite them.
 *
 * Note this file cannot unblock anything on its own: blocking AI crawlers is a
 * zone-level Cloudflare setting (AI Crawl Control + managed robots.txt), and a
 * blocked crawler is refused at the edge with a 403 before it ever reads this.
 */
const AI_CRAWLERS = [
  // AI search and assistants -- fetch a page to answer a question and link back.
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-User",
  "Claude-SearchBot",
  "DuckAssistBot",
  "YouBot",

  // AI crawlers, including model training.
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "meta-externalagent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
