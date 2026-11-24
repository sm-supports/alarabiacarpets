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
- **Chat:** Tawk.to widget (from md: loads on first interaction or after 10 s; below md: only from the menu's Live chat row, `src/lib/tawk.ts`)
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
| `src/hooks/` | Custom hooks (use-hydrated, use-online) |
| `src/lib/utils.ts` | Utility functions (cn helper) |
| `functions/api/` | Cloudflare Workers API endpoints |
| `functions/email-templates/` | HTML email template generators |
| `public/Products/` | Product images/videos organized by category folder |
| `src/app/layout.tsx` | Root metadata, fonts, third-party scripts (replaces the old index.html) |
| `src/lib/seo.ts` | SEO constants + JSON-LD builders |
| `src/lib/site.ts` | Phone, WhatsApp and email constants with no imports, for client components |
| `src/lib/card-image.ts` | Sized copies of catalog photos (`cardImage`, `fullImage`). Server only |
| `src/lib/analytics.ts` | GA4 + Google Ads events — all tracking goes through here |
| `src/lib/status.ts` | The overlay status (the plan's S1-S4 tap feedback): `showStatus` puts one `StatePanel` on screen through `StatusRegion` in `providers.tsx`. Its caller is `src/lib/feedback.ts`, installed by `TapFeedback`. The contact form's states are inline in `ContactSection`, not here. No lazy chunks: a failure has to report itself offline |
| `src/lib/feedback.ts` | When a phone says S1-S4 after a WhatsApp or Call tap (timings, once-per-session S1, priority). `TapFeedback.tsx` supplies the words and installs it |
| `src/lib/tap.ts` | Import-free hand-off: `WhatsAppLink` and `CallLink` report taps here, `lib/feedback.ts` listens |
| `src/lib/bar-intent.ts` | What the action bar's prefill names (product, service or category), registered by `BarIntent.tsx` in those views; name, type and slug only |
| `src/lib/tawk.ts` | Opens Tawk from the phone menu's Live chat row (S18): loads it, maximizes it, hides the bubble on minimize; 8 s limit |
| `src/lib/draft.ts` | The contact form's draft in this tab's sessionStorage (`contact-draft`): text, submission id, sent time and REF. Import-free (`global-error.tsx` reads it) |
| `src/components/StatePanel.tsx`, `StatusRegion.tsx` | The one panel every state uses (badge, headline, facts, primary button last) and the overlay region that shows `lib/status.ts`. Specs in `design.md` |
| `src/components/WhatsAppFloat.tsx` | The phone action bar ([Call][Get a Free Quote]) below md, the WhatsApp pill from md. Mounted by both layouts through `client.ts` |
| `src/components/CallLink.tsx`, `WhatsAppLink.tsx` | Every `tel:` and WhatsApp CTA: tracking (`source`), tap reporting, and WhatsApp's `/contact` stand-in before hydration |
| `src/components/TapFeedback.tsx`, `NavProgress.tsx`, `ImageFallback.tsx`, `RegisterSW.tsx` | Site-wide client pieces mounted in `src/app/providers.tsx`, none with static HTML: tap feedback, the 2px progress line on slow page changes, the tile for a failed photo or video (S16), the service worker switch |
| `src/components/Breadcrumb.tsx` | The visible trail on every interior page; takes the same `trail` as `buildBreadcrumb` so it matches the BreadcrumbList (`check-consistency`) |
| `src/components/FoldHead.tsx` | A section heading that folds the next `.fold-body` on phones (see Conventions) |
| `src/components/ProductGallery.tsx` | The product page's phone swipe gallery; extra slides only after hydration |
| `src/components/HeroVideo.tsx`, `src/lib/hero-media.ts`, `public/video/` | Home hero's background loop over its poster (see Conventions). Files made by `scripts/encode-hero-video.sh`; source and licence in `docs/media-credits.md` |
| `src/components/PageError.tsx`, `src/app/(en)/error.tsx`, `src/app/(ar)/error.tsx` | A page that throws: Navbar plus a page `StatePanel` (S15) |
| `src/app/global-error.tsx`, `src/app/global-not-found.tsx` | A root layout that throws, and the bilingual 404 (`out/404.html`, real 404 status). Both are complete documents with inline styles (see Conventions) |
| `public/sw.js`, `scripts/sw-kill.js` | The offline page's service worker (S14), switched by `SERVICE_WORKER`, and its kill switch template (see Service worker) |
| `scripts/audit-mobile.mjs`, `scripts/snapshot-seo.mjs`, `scripts/lib/` | Dev-only headless-Chrome tools: tap targets, bar, page heights and every form outcome with a fake Turnstile and a mocked `/api/contact`; the SEO snapshot and its `--diff` |
| `docs/mobile-audit/`, `docs/mobile-states/` | The mobile redesign's baseline, owner decisions, core flows, backlog, acceptance and state screenshots |

## Commands

```bash
npm run dev          # Next dev server (frontend only)
npm run build        # Static export → out/
npm run pages:dev    # Full-stack local dev (build + Workers + static)
npm run typecheck    # TypeScript type check: the site, then functions/ (its own tsconfig)
npm run llms         # Regenerate public/llms.txt from out/ (run after a build)
npm run check        # Text-to-HTML ratio, Arabic, page-weight, internal-link and consistency checks against out/ (run after a build)
npm run perf         # Lighthouse on a simulated slow phone against out/ (needs Chrome; not a deploy gate)
npm run deploy       # Build, stage on a case-sensitive image, deploy (prod only on main)

node scripts/snapshot-seo.mjs --diff     # titles, descriptions, h1s, headings and main text vs docs/mobile-audit/baseline
node scripts/audit-mobile.mjs --strict   # tap targets, inputs, bar and heights at 320/360/390, EN and AR
node scripts/audit-mobile.mjs --form     # every contact form outcome, mocked (no real send)
```

`check-consistency` (`scripts/check-consistency.mjs`) fails on a retired CTA label (in
`out/`, or in `src/` written out or as `nav.getQuote` outside the `.nav-cta` element), a
desktop header button (`.nav-cta`) that doesn't say `nav.getQuote`, a wrong icon on a CTA,
a breadcrumb that differs from its BreadcrumbList, a phone number, hours or saved-message
line in `global-error.tsx`, `global-not-found.tsx`, `out/404.html` or `public/sw.js` that
differs from `src/lib/site.ts` and the dictionaries (`global-error.tsx` must have the saved
line in both languages), a `/contact` hours line (`pages.contact.hoursLine`) whose days and
hours differ from `formStates.open`, a draft key or version in `sw.js` that differs from
`src/lib/draft.ts`, and a missing `sw.js`. The audit
and snapshot scripts need Chrome (`CHROME_PATH` if it isn't in `/Applications`) and serve
`out/` themselves.

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
  push interactivity into `"use client"` leaf components (see `ProductCard`)
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
- `src/app/global-error.tsx` is loaded by every page of both languages and replaces the whole
  document, so it stays self-contained: no context, no dictionaries, inline styles. `check-page-weight`
  can't see a dictionary imported there. It imports `src/lib/draft.ts` (to say a typed message is
  saved), so that file must stay free of imports
- `src/app/global-not-found.tsx` becomes `out/404.html`, served with a 404 status for every
  unknown URL in both languages, so it is one bilingual document with its own inline CSS: no
  providers, no Navbar, no analytics, and the plain `wa.me` and `tel:` links. Its phone
  number goes through `check-consistency`
- Site-wide client pieces mount inside `src/app/providers.tsx` (`StatusRegion`, `TapFeedback`,
  `NavProgress`, `ImageFallback`, `RegisterSW`), never as a new import in a root layout
- Every state the visitor is told about is a `StatePanel` (specs in `design.md`): inline next
  to what it is about, an overlay through `lib/status.ts`, or a page. There are no toasts.
  Nothing that reports a failure may load from a lazy chunk: offline, the chunk fails too and
  the page goes with it
- CTA labels come from the vocabulary in `design.md` (`common.heroQuote`, `nav.getFreeQuote`,
  `statePanel.call`, `common.askOnWhatsApp` on guides; `nav.getQuote` only on the desktop
  header's `.nav-cta`). Buttons use the `.cta` family. WhatsApp CTAs go through
  `WhatsAppLink` with a `source`, calls through `CallLink`
- The action bar (`WhatsAppFloat`, below md) is about 64px plus the safe area. The page
  clears it with body padding and `html` `scroll-padding-bottom` of
  `4rem + env(safe-area-inset-bottom)` (end of `src/index.css`); change the bar and those
  together. It hides while a field has focus. Nothing else may float on phones: no chat
  bubble, no second button. Stack: bar 30, header 40, menu 60, progress line 70, status 100
- Folds: text folded on phones and open from md is a `<details class="fold">` holding only an
  empty or label `<summary>`, followed by the text as `.fold-body`, so the text stays in the
  HTML and desktop never sees a fold. When the toggle is a section heading, use `FoldHead`:
  the heading stays outside the summary (a heading inside a summary stops being a heading),
  and the summary is named by the heading's id. `always` (`.fold-all`) folds at every width
  (the `/contact` panels only). Only a `.fold-lead` paragraph may sit between `.fold-h` and
  `.fold-body`
- Every control outside running text is at least 44px both ways on phones, and inputs are
  16px; `node scripts/audit-mobile.mjs --strict` checks it
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
- Home hero video: the poster (`<picture>` in `HeroSection`, `fetchpriority="high"`) is in
  the static HTML and is the page's LCP element; `HeroVideo` creates the `<video>` only after
  the load event and an idle moment, in the poster's box and never a larger one, so its first
  frame can't become a later LCP. The poster must not fill the whole viewport (the hero starts
  below the header's spacer): Chrome ignores a full-viewport image for LCP. No video for reduced
  motion, Save-Data or a slow connection; the 44px pause button is required (WCAG 2.2.2) and
  remembered in `localStorage`. `/video/*` is immutable: a new clip gets new hashed names
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
on every job, including floor mats and ceramic tiles. Confirmed on 2026-11-09: the site survey
and measurement is offered on floor mats, ceramic tiles and sofa upholstery too, so every job
without a price shows the one line "Free measurement and quote" (`price.noPrice`).

## Service worker

`public/sw.js` shows a page of its own (S14, EN or AR by path) when a page can't load
offline. It ships after the rest of the mobile redesign, in its own release.

- The switch is `SERVICE_WORKER` in `src/lib/site.ts`, `false` until that release.
  `RegisterSW` registers `/sw.js` after the load event when it is `true`, and unregisters
  any copy a browser has when it is `false`, which is also the quick rollback. Never commit
  it `true` outside that release.
- Navigation requests only, and no Cache API: every page comes from the network and the
  response is returned untouched, so 301, 308, 404 and 5xx pass through and nothing goes
  stale. Don't add caching, precaching or `/offline.html` (Pages would 308 it to `/offline`,
  and Qatar's redirect rule would send that to `/ar/offline`, a 404).
- Its phone, hours and saved-message line are copies; `check-consistency` holds them to
  `src/lib/site.ts` and the dictionaries, and its draft key and version to `src/lib/draft.ts`.
- Never delete or rename `sw.js`: a 404 on the browser's update check keeps the old worker
  running. `public/_headers` serves it `no-cache`; keep that.
- Kill switch, if `sw.js` itself breaks pages: copy `scripts/sw-kill.js` over
  `public/sw.js` (same name), set `SERVICE_WORKER = false`, `npm run deploy`, and leave the
  kill version deployed for months. It unregisters itself and reloads the tabs it controlled.
- A first-ever visit made offline still gets the browser's own error page.

## Analytics

All tracking goes through `src/lib/analytics.ts`. Each WhatsApp tap fires the Ads
`whatsappClick` conversion and GA4 `whatsapp_click {source}`; `conversion={false}` on
`WhatsAppLink` (the Sent panel's follow-up) sends GA4 only. `BAR_SENDS_ADS` (true) decides
whether the action bar's and the pill's taps count for Ads; the owner reviews `sticky_bar:*`
against real chats for 28 days after release. Calls fire GA4 `phone_click {source}` only
(`CONVERSION_LABELS.phoneClick` is null until an Ads call conversion exists). A sent form
fires `formLead` and GA4 `generate_lead` once; a correction fires `form_correction` and no
second lead; a failure fires `form_failed {code}`. S1's "Back to WhatsApp" fires
`whatsapp_reopen` and no conversion. No personal data in any event.

The `source` values in use (`:` parts are the page's type and slug or id):

| Source | Where |
|--------|-------|
| `sticky_bar:{type}:{slug}`, `sticky_bar_call:{type}:{slug}` | Phone action bar, WhatsApp and Call. `type` is product, service or category from `BarIntent`; elsewhere `page` and the path, e.g. `sticky_bar:page:home` |
| `floating_button` | The WhatsApp pill from md |
| `navbar_desktop`, `navbar_mobile` | Desktop header button, phone menu |
| `footer_get_quote`, `footer_contact`, `footer_social` | Footer |
| `category:{slug}:hero`, `category:{slug}` | Category page hero and closing CTA |
| `service:{slug}:hero`, `service:{slug}` | Service page hero and closing CTA |
| `product_detail:{id}`, `product_detail_bottom:{id}` | Product page |
| `product_card:{name}`, `showcase:{id}` | Product cards, Home showcase |
| `products_page`, `services_section`, `about_page`, `guide:{slug}` | Other page CTAs |
| `contact_page_whatsapp`, `contact_page_call` | `/contact` tiles |
| `contact_section_primary`, `contact_section_methods`, `contact_section_call` | The contact section (Home, `/contact`) |
| `contact_sent_followup` | Sent panel's "Continue on WhatsApp" (no Ads conversion) |
| `contact_form_failed` | A failed send's "Send this on WhatsApp" and Call |
| `feedback_s2`, `feedback_s4` (Call), `feedback_s3` (WhatsApp, counted like the bar) | Tap feedback panels |
| `page_error` | `error.tsx`'s Call |

GA4 needs `source` registered as an event-scoped custom dimension to report on it, and
dimensions don't fill in retroactively (see `docs/mobile-audit/backlog.md`). The 404,
`global-error` and the offline page send nothing.

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
