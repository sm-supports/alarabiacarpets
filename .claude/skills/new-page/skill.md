# Add a New Page

Routing is file-based (Next.js App Router). There is no central route table — creating the
directory *is* registering the route. Every page exists in both languages: English at the
unprefixed URL, Arabic under `/ar` (CLAUDE.md, "Languages").

A new keyword landing page is not a new route: it is an entry in `src/data/services.ts`
(CLAUDE.md, "SEO invariants"). Use this skill for anything else.

## Step 1: The strings

Interface text never goes inline. Add the page's section to `pages` in `src/i18n/en.ts`
and the same keys to `src/i18n/ar.ts` (typed against `en`, so a missing key fails
`npm run typecheck`):

```ts
// src/i18n/en.ts, inside pages: { ... }
pageName: {
  title: "Page Title",          // ≤ 60 characters with the brand; must differ from heading
  breadcrumb: "Page Title",     // the trail's last step
  description: "One sentence, 150-160 characters, describing the page for search results.",
  heading: "The page's one h1",
  intro: "The summary under the h1.",
},
```

A `"use client"` component reads its strings from `en.client.ts` / `ar.client.ts` instead.

## Step 2: The view

The page body and its metadata live in `src/views/<Name>View.tsx`, a server component that
takes `locale`. Both routes render it. This is the interior page header every page type
shares (`design.md`, "Page header"): a one-line `Breadcrumb` fed the same `crumbs` as the
`BreadcrumbList`, the h1 as `.h1-band` on the forest band, the summary as `.hero-p`, and the
quote button. `npm run check` (`check-consistency`) fails an interior page with no visible
breadcrumb, or one whose steps differ from its BreadcrumbList.

```tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import HeroQuoteCta from "@/components/HeroQuoteCta";
import { getDict, localePath, type Locale } from "@/i18n";
import { buildBreadcrumb, clampDescription, defaultOgImages, ogLocaleFields, pageAlternates } from "@/lib/seo";

export function pageNameMetadata(locale: Locale): Metadata {
  const { title, description } = getDict(locale).pages.pageName;
  return {
    title,
    description: clampDescription(description),
    alternates: pageAlternates("/page-name", locale),   // self canonical + hreflang pair
    openGraph: {
      ...ogLocaleFields(locale),
      title,
      description,
      url: localePath(locale, "/page-name"),
      images: defaultOgImages(locale),                  // Next replaces openGraph, never merges
    },
  };
}

export default function PageNameView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.pageName;
  // One trail for both: what readers see and the BreadcrumbList agree step for step.
  const crumbs: Crumb[] = [[page.breadcrumb, "/page-name"]];
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 md:text-center">
            <Breadcrumb locale={locale} trail={crumbs} dark />
            <h1 className="h1-band">{page.heading}</h1>
            <p className="hero-p">{page.intro}</p>
            {/* A page ads point to: the quote button in the band. */}
            <HeroQuoteCta locale={locale} source="page_name:hero" message={t.common.quoteMessage(page.heading)} />
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            {/* Content here */}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
```

`Breadcrumb` takes `phoneOnly` on page types that showed no trail on desktop before the
mobile redesign (About, the indexes); a new page shows it at every width.

CTAs use the `.cta` family and the CTA vocabulary (`design.md`, "Site components as
built"): `common.heroQuote` in a band or closing section, `nav.getFreeQuote` on cards,
`statePanel.call` for calls, `WhatsAppIcon` on a WhatsApp button and no other icon. A
closing section on forest is `<WhatsAppLink source="..." className="cta-dark">` with
`<WhatsAppIcon />` and `{t.common.heroQuote}` (see `AboutView`). `check-consistency` fails
any other label.

## Step 3: The routes

One thin `page.tsx` in each tree, same slug:

```tsx
// src/app/(en)/page-name/page.tsx
import PageNameView, { pageNameMetadata } from "@/views/PageNameView";

export const metadata = pageNameMetadata("en");

export default function PageNamePage() {
  return <PageNameView locale="en" />;
}
```

```tsx
// src/app/(ar)/ar/page-name/page.tsx
import PageNameView, { pageNameMetadata } from "@/views/PageNameView";

export const metadata = pageNameMetadata("ar");

export default function PageNamePage() {
  return <PageNameView locale="ar" />;
}
```

The directory name is the URL, in lowercase kebab-case. Keep `page.tsx` a **server
component** (no `"use client"`) so it can export `metadata`.

## Step 4: Interactivity

If the page needs state, effects, or event handlers, do **not** add `"use client"` to the
view or `page.tsx`. Extract the interactive part into its own `"use client"` component and
pass it only the few fields it shows (CLAUDE.md, "Conventions": client components must not
import `@/data/*`, `@/lib/seo` or `@/i18n`). See `src/components/ProductCard.tsx` and
`src/components/ProductMedia.tsx`. Markup that only matters once interactive goes behind
`useHydrated()`, so it costs no static HTML.

For a tracked WhatsApp CTA on a server page, use `<WhatsAppLink source="..." />` rather than
an `<a>` with an `onClick`; for a call, `<CallLink source="..." />`.

## Step 5: Dynamic Routes

For `things/[slug]/page.tsx` (in both trees), static export requires every path be known at
build:

```tsx
export function generateStaticParams() {
  return things.map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;   // Next 15: params is a Promise, must be awaited
  ...
}
```

Forgetting `await params` still builds successfully but yields an undefined slug, silently
rendering every page as not-found. Content from `src/data/` needs its Arabic overlay in
`src/data/ar/`, or the build throws.

## Step 6: Navigation and sitemap

- `src/components/Navbar.tsx`: add to the `navigationItems` array (`{ path, label }`, the
  label from the dictionary).
- `src/components/Footer.tsx`: add to `footerLinks.company`.
- `src/app/sitemap.ts`: static pages are listed by hand (English only; each entry gains its
  Arabic twin there). Data-driven ones are mapped from their data file.

## Step 7: Verify

```bash
npm run typecheck && npm run build && npm run check
npm run llms && npm run build       # a new page changes public/llms.txt (CLAUDE.md)
```

`npm run check` holds the page to the text-to-HTML floor, the Arabic twin and hreflang
pairs, page weight, internal links and `check-consistency` (CTA labels, the breadcrumb).
Then confirm the page was prerendered with its metadata, in both languages:

```bash
grep -o '<title>[^<]*' out/page-name.html out/ar/page-name.html
grep -o 'rel="canonical" href="[^"]*"' out/page-name.html out/ar/page-name.html
grep -c '<h1' out/page-name.html out/ar/page-name.html
```

Expect exactly one `<h1>` each, a title under 60 characters that differs from the h1, and
a self canonical.
