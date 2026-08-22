# Al Arabia Carpets

Premium home furnishing e-commerce site serving Qatar. Doha-based, showcases carpets, barkia/PVC flooring, curtains, furniture, and interior design services.

## Tech Stack

- **Frontend:** React 19, TypeScript, Next.js 15 (App Router)
- **Rendering:** Static export (`output: 'export'`) — every route is prerendered to HTML at build time
- **UI:** Tailwind CSS, shadcn/ui (Radix), Lucide icons
- **SEO:** Next.js Metadata API + JSON-LD builders in `src/lib/seo.ts`
- **Backend:** Cloudflare Workers Functions (TypeScript)
- **Email:** Resend API
- **Bot protection:** Cloudflare Turnstile
- **Analytics:** Google Analytics (G-256YMYE1WP) + Google Ads conversion tracking
- **Chat:** Tawk.to widget
- **Hosting:** Cloudflare Pages

## Key Directories

| Path | Purpose |
|------|---------|
| `src/app/` | Routes (App Router). Each `page.tsx` is a server component exporting `metadata` |
| `src/data/guides.ts` | Guide/blog content — `Guide` interface + `guides` array |
| `src/data/categories.ts` | Category landing pages — single source of truth for category labels |
| `src/data/services.ts` | Service landing pages (no product SKUs, deliberately no images) |
| `src/components/` | Reusable components (Navbar, Footer, HeroSection, ProductCard, etc.) |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Input, etc.) |
| `src/data/products.ts` | Product catalog — `Product` interface + `products` array |
| `src/hooks/` | Custom hooks (use-toast, use-mobile) |
| `src/lib/utils.ts` | Utility functions (cn helper) |
| `functions/api/` | Cloudflare Workers API endpoints |
| `functions/email-templates/` | HTML email template generators |
| `public/Products/` | Product images/videos organized by category folder |
| `src/app/layout.tsx` | Root metadata, fonts, third-party scripts (replaces the old index.html) |
| `src/lib/seo.ts` | SEO constants + JSON-LD builders |
| `src/lib/analytics.ts` | GA4 + Google Ads events — all tracking goes through here |

## Commands

```bash
npm run dev          # Next dev server (frontend only)
npm run build        # Static export → out/
npm run pages:dev    # Full-stack local dev (build + Workers + static)
npx tsc --noEmit     # TypeScript type check
npm run deploy       # Build and deploy to Cloudflare Pages
```

## Brand Constants

| Token | Value |
|-------|-------|
| Deep Forest (primary) | `#0A2A1F` / `text-forest-900`, `bg-primary` |
| Rich Gold (accent) | `#C5A572` / `text-gold-500`, `text-gold-600` |
| Sage Teal (secondary) | `#4D7C6F` / `bg-teal-100`, `text-teal-600` |
| Heading font | Playfair Display → `font-playfair` / `font-display` |
| Body font | Poppins → `font-poppins` / `font-body` |
| WhatsApp | +974 5551 2858 → `https://wa.me/+97455512858` |
| Email | info@alarabiacarpets.com |
| Address | Al Mansoura St, Doha, Qatar |
| Domain | alarabiacarpets.com |

## Conventions

- All pages wrap content in `<Navbar />` + `<main className="flex-grow">` + `<Footer />`
- Every `page.tsx` stays a **server component** exporting `metadata` or `generateMetadata`;
  push interactivity into `"use client"` leaf components (see `ProductsGrid`, `ProductMedia`)
- New routes are new directories under `src/app/` — there is no central route table
- Dynamic routes need `generateStaticParams()`; `params` is a Promise and must be awaited
- Never use `useSearchParams` without a Suspense boundary — it hard-fails under static export
- Plain `<img>` only, not `next/image`: product paths contain `&`, which breaks `/_next/image`
- Path alias `@` maps to `src/`
- Product images live in `public/Products/<CategoryFolder>/`
- Container pattern: `<div className="container mx-auto px-4 sm:px-5 lg:px-8">`
- Scroll-reveal: IntersectionObserver → `isVisible` state → transition classes

## Product Categories

| Key | Label | Image Folder |
|-----|-------|-------------|
| `carpet` | Carpets | `public/Products/Carpets/` |
| `curtains` | Curtains | `public/Products/Curtain/` |
| `furniture` | Furniture | `public/Products/Furniture/` |
| `interior` | Interior Design | `public/Products/Interior Design/` |
| `barkia` | Barkia & PVC | `public/Products/barkia&pvc/` |

## Agent Skills

For specialized workflows, read the relevant skill in `.claude/skills/`. Each folder contains a `skill.md` with step-by-step instructions.

See `.claude/skills/README.md` for the full skills index.

## SEO invariants

Verified on every build; do not regress these:

- One `<h1>` per page, no skipped heading levels
- Titles ≤ 60 chars, descriptions ≤ 160, no duplicates across pages
- `public/_redirects` must NOT contain an SPA fallback (`/* /index.html 200`) — it causes soft-404s
- `public/_routes.json` stays pinned to `{"include": ["/api/*"]}`
- Product JSON-LD omits `offers` unless `priceFrom` is set; never emit a price-less `Offer`
- `sitemap.ts` / `robots.ts` need `export const dynamic = "force-static"`
- Category slugs in `src/data/categories.ts` are indexed URLs — never rename one
- Never re-add a `sofa` product: `/products/sofa` 301s to `/products/majlis-sofa`, and Pages
  serves a matching static asset *before* consulting `_redirects`, so emitting the file kills the redirect
- Removing any product id deletes an indexed URL — pair it with a 301 or it becomes a hard 404
- Pages that define `openGraph` must spread in `DEFAULT_OG_IMAGES`: Next replaces the
  openGraph object rather than merging, so omitting `images` yields no og:image at all
- Services in `src/data/services.ts` have no photography — never point a hero at an unrelated product image
