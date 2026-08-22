# Add a New Page

Routing is file-based (Next.js App Router). There is no central route table — creating the
directory *is* registering the route.

## Step 1: Create the Route

Create `src/app/<route-segment>/page.tsx`. The directory name is the URL, in lowercase
kebab-case, so `src/app/our-services/page.tsx` serves `/our-services`.

Keep the page a **server component** (no `"use client"` at the top) so it can export
`metadata`. That is what puts the title, description and canonical into the static HTML.

```tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, clampDescription } from "@/lib/seo";

const DESCRIPTION =
  "One sentence, 150-160 characters, describing the page for search results.";

export const metadata: Metadata = {
  title: "Page Title",            // keep short: " | Al Arabia Carpets" is appended
  description: clampDescription(DESCRIPTION),
  alternates: { canonical: "/route-segment" },
  openGraph: { title: "Page Title", description: DESCRIPTION, url: "/route-segment" },
};

export default function PageNamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([["Page Title", "/route-segment"]])} />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Page Title
            </h1>
            <p className="font-poppins max-w-2xl mx-auto">
              Page description text.
            </p>
          </div>
        </div>

        {/* Page Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Content here */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

## Step 2: Interactivity

If the page needs state, effects, or event handlers, do **not** add `"use client"` to
`page.tsx` — that would remove its ability to export metadata. Instead extract the
interactive part into its own component with `"use client"` at the top and render it from
the page. See `src/components/ProductsGrid.tsx` (filter state) and
`src/components/ProductMedia.tsx` (image load state) for the pattern.

For a tracked WhatsApp CTA on a server page, use `<WhatsAppLink source="..." />` rather than
an `<a>` with an `onClick`.

## Step 3: Dynamic Routes

For `src/app/things/[slug]/page.tsx`, static export requires every path be known at build:

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
rendering every page as not-found. Check with the Step 5 verification.

## Step 4: Add Navigation Link (if applicable)

- `src/components/Navbar.tsx` — add to the `navigationItems` array (`{ path, label }`).
- `src/components/Footer.tsx` — add to `footerLinks.company`.

Both use `next/link`, so the prop is `href`, not `to`.

New routes are picked up by `src/app/sitemap.ts` only if you add them — static pages are
listed explicitly there; data-driven ones are mapped from their data file.

## Step 5: Verify

```bash
npx tsc --noEmit && npm run build
```

Then confirm the page was actually prerendered with its metadata:

```bash
grep -o '<title>[^<]*' out/<route-segment>.html
grep -o 'rel="canonical" href="[^"]*"' out/<route-segment>.html
grep -c '<h1' out/<route-segment>.html
```

Expect exactly one `<h1>`, a title under 60 characters, and a canonical URL.
