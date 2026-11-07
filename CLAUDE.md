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
| `src/app/(en)/` | English routes at the unprefixed, indexed URLs. Thin `page.tsx` files over `src/views/` |
| `src/app/(ar)/ar/` | Arabic routes at `/ar/...`, same slugs, own root layout with `lang="ar-QA" dir="rtl"` |
| `src/views/` | Page bodies and metadata functions, each taking `locale` |
| `src/i18n/` | `en.ts` / `ar.ts` interface strings (`ar` is typed against `en`); `en.client.ts` / `ar.client.ts` hold the sections client components read; `config.ts` routing, `labels.ts`, `LocaleProviderEn` / `LocaleProviderAr` |
| `src/data/ar/` | Arabic overlays of the English data, keyed by id or slug |
| `src/data/localized.ts` | Content by locale; throws at build on a missing translation. Server components only |
| `src/data/guides.ts` | Guide/blog content — `Guide` interface + `guides` array |
| `src/data/categories.ts` | Category landing pages — single source of truth for category labels |
| `src/data/services.ts` | Service landing pages (no product SKUs) — `Service` interface + `services` array; optional `heroImage` / `heroImageAlt` / `gallery` carry real project photos only (see SEO invariants) |
| `src/components/` | Reusable components (Navbar, Footer, HeroSection, ProductCard, etc.) |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Input, etc.) |
| `src/data/products.ts` | Product catalog — `Product` interface + `products` array |
| `src/hooks/` | Custom hooks (use-toast, use-hydrated) |
| `src/lib/utils.ts` | Utility functions (cn helper) |
| `functions/api/` | Cloudflare Workers API endpoints |
| `functions/email-templates/` | HTML email template generators |
| `public/Products/` | Product images/videos organized by category folder |
| `src/app/layout.tsx` | Root metadata, fonts, third-party scripts (replaces the old index.html) |
| `src/lib/seo.ts` | SEO constants + JSON-LD builders |
| `src/lib/site.ts` | Phone, WhatsApp and email constants with no imports, for client components |
| `src/lib/card-image.ts` | Sized copies of catalog photos (`cardImage`, `fullImage`). Server only |
| `src/lib/analytics.ts` | GA4 + Google Ads events — all tracking goes through here |

## Commands

```bash
npm run dev          # Next dev server (frontend only)
npm run build        # Static export → out/
npm run pages:dev    # Full-stack local dev (build + Workers + static)
npm run typecheck    # TypeScript type check: the site, then functions/ (its own tsconfig)
npm run llms         # Regenerate public/llms.txt from out/ (run after a build)
npm run check        # Text-to-HTML ratio, Arabic, page-weight and internal-link checks against out/ (run after a build)
npm run perf         # Lighthouse on a simulated slow phone against out/ (needs Chrome; not a deploy gate)
npm run deploy       # Build, stage on a case-sensitive image, deploy (prod only on main)
```

Never run `wrangler pages deploy out` by hand from the Mac. The repo volume is
case-insensitive, so `public/Products` merges with the `products/` route pages
(likewise `Services`/`services`) and Pages, being case-sensitive, 404s every
`/products/*` and `/services/*` URL. `npm run deploy` runs
`scripts/deploy-pages.sh`, which copies `out/` onto a case-sensitive sparse image
(`~/Library/Caches/alarabiacarpets-deploy.sparseimage`), splits any public/route
folders that differ only in case, checks file counts and sitemap URLs, then
deploys from the repo root so `functions/` is bundled. It deploys to production
only when the current branch is `main`; any other branch gets a preview URL. On a
case-sensitive filesystem it deploys `out/` directly. `DEPLOY_DRY_RUN=1` stages
and verifies without deploying; `DEPLOY_SKIP_BUILD=1` reuses the existing `out/`.

`public/llms.txt` is generated, not hand-written. After adding or renaming any
page: `npm run build && npm run llms && npm run build` (the second build copies
the regenerated file into `out/`).

## Languages

English keeps today's URLs; Arabic mirrors every page under `/ar`. A new page needs a
route in both trees, and new content needs an entry in `src/data/ar/` or the build
throws. Interface text goes in `src/i18n/en.ts` and `ar.ts`, never inline; a string a
`"use client"` component reads goes in `en.client.ts` and `ar.client.ts` instead, which
is all the browser downloads (`tsc` fails if a client component reaches outside them). Arabic is
"Gulf blend": formal Arabic with Qatari vocabulary in body text, warmer Qatari wording
on headlines and buttons. The brand is سجاد العربية, grammatically feminine. Digits stay
Western and prices stay QAR (`formatFromPrice` in `src/i18n`).

Qatar visitors reach `/ar` through a Cloudflare Redirect Rule at the zone level, not
code: country QA with no `site_lang` cookie, or `site_lang=ar`, redirects to `/ar` + path
(GET, no file extension, user agent without "bot", "crawler" or "spider"; the verified-bot
field isn't allowed in this rule type). The navbar switcher sets the cookie. The rule can't
be tested on preview URLs. Any path added to `public/_redirects` must also be added to the
rule's exclusion list, or Qatar visitors get a 404 at `/ar/<old path>` instead of the 301.

The ad's language decides the site's language. The rule skips any URL with `lang=en`, and
`AdLanguage` then sets `site_lang=en`, so English campaigns must carry the Final URL suffix
`lang=en`. Without it, their Qatar clicks land on Arabic pages. Arabic ads link to `/ar/...`.

Use logical Tailwind classes (`ms-`, `pe-`, `start-`, `text-start`, `gap-` over
`space-x-`) so Arabic mirrors; directional icons get `rtl:-scale-x-100`. Use icons from
`@/components/icons` (sprite in `public/icons.svg`, regenerated by
`scripts/build-icons.mjs`), not `lucide-react`.

## Brand Constants

| Token | Value |
|-------|-------|
| Deep Forest (primary) | `#0A2A1F` / `text-forest-900`, `bg-primary` |
| Rich Gold (accent) | `#C5A572` / `text-gold-500`, `text-gold-600` |
| Sage Teal (secondary) | `#4D7C6F` / `bg-teal-100`, `text-teal-600` |
| Heading font | Playfair Display → `font-playfair` / `font-display` |
| Body font | Poppins → `font-poppins` / `font-body` |
| WhatsApp | +974 5551 2858 → `WHATSAPP_URL` = `https://wa.me/97455512858` (no `+`; audits flag the `+` form as a broken link) |
| Email | info@alarabiacarpets.com |
| Address | Al Mansoura St, Doha, Qatar |
| Domain | alarabiacarpets.com |

## Conventions

- All pages wrap content in `<Navbar />` + `<main className="flex-grow">` + `<Footer locale={locale} />`
- Every `page.tsx` stays a **server component** exporting `metadata` or `generateMetadata`;
  push interactivity into `"use client"` leaf components (see `ProductCard`, `ProductMedia`)
- A client component's props are serialised into the page's hydration data. Pass the few
  fields it shows, never a whole product, service or category record (`ProductsGrid` is a
  server component for this reason). Client components must not import `@/data/*`,
  `@/lib/seo` or `@/i18n` (use `@/i18n/config` and `@/lib/site`): any of them pulls the
  catalog or both dictionaries into every page's JavaScript
- A root layout (`src/app/(en)/layout.tsx`, `src/app/(ar)/layout.tsx`) takes its client
  components, and `next/script`, only from the `client.ts` beside it, and a server component
  both layouts render gets them as props (`ThirdPartyScripts`). Next files both root layouts
  under one group, so a client file both import directly is tied to one layout's script and
  every page of the other language downloads it too (`check-page-weight` fails on this)
- New routes are new directories under `src/app/` — there is no central route table
- Dynamic routes need `generateStaticParams()`; `params` is a Promise and must be awaited
- Never use `useSearchParams` without a Suspense boundary — it hard-fails under static export
- Plain `<img>` only, not `next/image`: product paths contain `&`, which breaks `/_next/image`
- Path alias `@` maps to `src/`
- Product images live in `public/Products/<CategoryFolder>/`
- Pages never show a catalog photo at full size. `scripts/build-card-images.mjs` makes WebP
  copies in `public/img/` (gitignored, hashed names) before dev and build, for every image
  the data files reference, and writes `src/data/image-manifest.json` (committed).
  `src/lib/card-image.ts` resolves them, server side only: `cardImage` / `cardImagePath` for
  4:3 grid slots, `fullImage` / `fullImagePath` (uncropped) for hero images and any slot that
  is not 4:3. The `*Path` forms return one URL; use them on pages near the 10% text-to-HTML
  floor, where a `srcSet` on every card would not fit. og:image and JSON-LD keep the originals
- `/img/*` is cached forever because its names are hashed. `/Products`, `/Services`, `/logos`
  and `/lovable-uploads` hold plain names and are cached for a day: give a replaced file a new
  name anyway, and never mark those folders `immutable` again
- Container pattern: `<div className="container mx-auto px-4 sm:px-5 lg:px-8">`
- Scroll-reveal: add the CSS class `reveal` (end of `src/index.css`). Never render `opacity-0`
  and remove it from JavaScript: the content then stays invisible until the page hydrates.
  Not inside an `overflow-hidden` ancestor, and not on content above the fold

## Product Categories

| Key | Label | Image Folder |
|-----|-------|-------------|
| `carpet` | Carpets | `public/Products/Carpets/` |
| `curtains` | Curtains | `public/Products/Curtain/` |
| `furniture` | Furniture | `public/Products/Furniture/` |
| `interior` | Interior Design | `public/Products/Interior Design/` |
| `barkia` | Barkia & PVC | `public/Products/barkia&pvc/` |

## Keyword pages

Each keyword has one page meant to rank for it. Links, titles and new copy should push
that page, not a sibling. `npm run check` fails if one has fewer than 4 linking pages inside
`<main>` in either language (`scripts/check-internal-links.mjs`; keep its list in step).

| Keyword | Page |
|---------|------|
| Carpet | `/products/carpet` |
| Event carpet | `/products/event-normal-carpet` (the page Google favours; `/services/event-carpet` covers installation) |
| Office carpet | `/services/office-carpet` |
| Vinyl and, for now, SPC | `/services/vinyl-flooring` |
| PVC | `/products/pvc-barkia` |
| Wood parquet | `/services/parquet-flooring` |
| Wallpaper | `/services/wallpaper` |
| C-board, gypsum and cement board fixing | `/services/gypsum-c-board-fixing` |
| Grass carpet | `/products/grass-carpet` |
| Sofa making | `/services/sofa-making` |
| Sofa upholstery and repair | `/services/sofa-upholstery` |
| Curtains | `/products/curtain` |
| Cabinet | `/services/cabinets` |
| Kitchen cabinets | `/services/kitchen-cabinets` |
| Room cabinets, wardrobes | `/services/wardrobes` |
| TV decoration, TV units | `/services/tv-unit-design` |

Facts the owner confirmed on 2026-11-07: event carpet is sold and laid, not rented (never
write "hire" or تأجير as an offer); "C-board" covers both gypsum and cement board; real wood
parquet, wallpaper supply and sofa reupholstery and repair are all offered; the quote is free
on every job, including floor mats and ceramic tiles.

## Agent Skills

For specialized workflows, read the relevant skill in `.claude/skills/`. Each folder contains a `skill.md` with step-by-step instructions.

See `.claude/skills/README.md` for the full skills index.

## SEO invariants

Verified on every build; do not regress these:

- One `<h1>` per page, no skipped heading levels
- `check-page-weight` (run by `npm run check` and `npm run deploy`): no `opacity-0` in the
  static HTML, no full-size catalog photo, at most 8 font preloads (English pages have 3, Arabic 8) and 2 high-priority images
  per page, hydration data under 90 KB
- Every page at or above 10% text-to-HTML (`check-text-ratio`, run by `npm run deploy`).
  `scripts/externalize-flight.mjs` moves Next's hydration data out of the HTML, and must
  emit a plain blocking `<script>`: `defer` throws "Connection closed" and stops hydration.
  Keep interactive-only markup behind `useHydrated()` and name long repeated utility
  strings as component classes at the end of `src/index.css`
- Each Arabic page has an English twin, hreflang pairs, a self canonical and the same
  numbers as the English (`check-arabic`)
- Titles ≤ 60 chars, descriptions ≤ 160, no duplicates across pages
- A `<title>` is never identical to the page's `<h1>` (`check-arabic`). `buildTitle` adds the
  brand only when the result fits in 60 characters, so a `seoTitle` over 40 characters must
  differ from the heading
- JSON-LD `inLanguage` goes only on WebSite, FAQPage, CollectionPage and Article nodes
  (`langField` in `src/lib/seo.ts`). schema.org does not define it on Product, Service,
  Organization or LocalBusiness, and audits report it there as a markup error (`check-arabic`)
- `public/_redirects` must NOT contain an SPA fallback (`/* /index.html 200`) — it causes soft-404s
- `public/_routes.json` stays pinned to `{"include": ["/api/*"]}`
- Product JSON-LD: items with `priceFrom` emit `Product` + `AggregateOffer`; items without it emit `Service`
  (Google rejects a `Product` with no offers/review/rating). Never emit a price-less `Offer`.
  The `AggregateOffer` carries `offerCount: 1` (Search Console warns without it; `check-arabic`).
  Never emit `review` or `aggregateRating` without real customer reviews shown on that page
- `robots.ts` must not set `host` (it is emitted as a full URL, which audits flag as invalid robots.txt)
- `sitemap.ts` / `robots.ts` need `export const dynamic = "force-static"`
- Category slugs in `src/data/categories.ts` are indexed URLs — never rename one
- Never re-add a `sofa` product: `/products/sofa` 301s to `/products/majlis-sofa`, and Pages
  serves a matching static asset *before* consulting `_redirects`, so emitting the file kills the redirect
- Removing any product id deletes an indexed URL — pair it with a 301 or it becomes a hard 404
- Pages that define `openGraph` must spread in `DEFAULT_OG_IMAGES`: Next replaces the
  openGraph object rather than merging, so omitting `images` yields no og:image at all
- A service hero photo must depict that service. Leave `heroImage` unset rather than
  borrowing one — `/services/event-carpet` is deliberately text-only because the only
  asset we hold is a colour swatch scan, not a photo of our work
- `Television decore with cabin box 2.jpeg` is a watermarked third-party 3D render, not
  our project work — keep it out of any gallery
- Service JSON-LD carries `offers` only for a service with `priceFrom`, which the page shows.
  Set it only from a price the owner confirmed. `lastModified` in the sitemap comes from
  `updatedAt` on the record: change that date when the content really changes, and never stamp
  pages with the build date
- New keyword landing pages are entries in `src/data/services.ts`, not new routes:
  `/services/[slug]` prerenders them and `sitemap.ts`/`Footer.tsx` pick them up. Each
  also needs an overlay in `src/data/ar/` and a label in `src/i18n/labels.ts`
- `relatedProductIds` / `relatedCategorySlugs` / `relatedServiceSlugs` throw at build on
  an unknown value — that assertion is the internal-linking safety net, don't weaken it
