# Update Site Content

## Content Map

| Content Area | File | What to Edit |
|-------------|------|-------------|
| Hero headline & subtitle | `src/components/HeroSection.tsx` | `h1` text, subtitle `p` tag, badge text, CTA button labels |
| Trust indicators | `src/components/HeroSection.tsx` | TrustIndicator component props (`title`, `subtitle`) |
| Services section | `src/components/ServicesSection.tsx` | `services` array at top of file (`title`, `description`, `icon`, `color`) |
| About page | `src/app/about/page.tsx` | Our Story text, Values cards, Why Choose Us cards |
| Products page header | `src/app/products/page.tsx` | Hero header `h1` and description text |
| Contact CTA text | `src/components/ContactSection.tsx` | Section heading, description, form labels |
| Trusted By logos | `src/components/TrustedBy.tsx` | Logo images array |
| Footer | `src/components/Footer.tsx` | Address, phone, navigation links, copyright |
| Site-wide title & SEO | `src/app/layout.tsx` + `src/lib/seo.ts` | Default title/description, OG, geo tags |
| Per-page SEO | that route's `page.tsx` | `export const metadata` / `generateMetadata` |
| Structured data | `src/lib/seo.ts` | `buildLocalBusiness`, `buildOrganization`, `buildProductJsonLd`, etc. |
| Guides / blog content | `src/data/guides.ts` | `Guide` interface + `guides` array |

## Content Update Rules

- **Only change text strings** — preserve HTML/JSX structure, class names, and styling
- Keep the premium brand voice: concise, professional, Qatar-market appropriate
- Headings use `font-playfair` / `font-display`
- Body text uses `font-poppins` / `font-body`
- Do NOT change component structure or Tailwind classes when updating text

## SEO Updates

File: `src/app/layout.tsx` (root metadata) and `src/lib/seo.ts` (constants)

Key tags to update:
- `<title>` — keep under 60 characters
- `<meta name="description">` — keep under 155 characters
- `<meta property="og:title">` and `<meta property="og:description">` — match the above
- `<meta property="twitter:title">` and `<meta property="twitter:description">`

The structured data block (JSON-LD) contains business info, services, and geo data. Update if business details change.

## Adding Trusted By Logos

1. Place logo in `public/logos/` as `.webp` format
2. Name it `logo<N>.webp` following existing numbering
3. Update the logos array in `src/components/TrustedBy.tsx`

## Verify

```bash
npm run dev
```

Check all modified pages:
- Text fits within containers (no overflow or truncation issues)
- Responsive layout works on both mobile and desktop widths
- No broken images or links
- SEO tags render correctly (View Source or browser DevTools → Elements → `<head>`)
