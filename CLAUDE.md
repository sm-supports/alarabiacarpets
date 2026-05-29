# Al Arabia Carpets

Premium home furnishing e-commerce site serving Qatar. Doha-based, showcases carpets, barkia/PVC flooring, curtains, furniture, and interior design services.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui (Radix), Lucide icons, Framer Motion
- **Routing:** React Router v6 with lazy-loaded pages
- **Data fetching:** TanStack React Query
- **Backend:** Cloudflare Workers Functions (TypeScript)
- **Email:** Resend API
- **Bot protection:** Cloudflare Turnstile
- **Analytics:** Google Analytics (G-256YMYE1WP) + Google Ads conversion tracking
- **Chat:** Tawk.to widget
- **Hosting:** Cloudflare Pages

## Key Directories

| Path | Purpose |
|------|---------|
| `src/pages/` | Route pages (Index, Products, ProductDetail, About, Contact, NotFound) |
| `src/components/` | Reusable components (Navbar, Footer, HeroSection, ProductCard, etc.) |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Input, etc.) |
| `src/data/products.ts` | Product catalog — `Product` interface + `products` array |
| `src/hooks/` | Custom hooks (use-toast, use-mobile) |
| `src/lib/utils.ts` | Utility functions (cn helper) |
| `functions/api/` | Cloudflare Workers API endpoints |
| `functions/email-templates/` | HTML email template generators |
| `public/Products/` | Product images/videos organized by category folder |
| `index.html` | SEO meta tags, structured data, analytics scripts |

## Commands

```bash
npm run dev          # Vite dev server (frontend only)
npm run build        # Production build → dist/
npm run pages:dev    # Full-stack local dev (Workers + static)
npx tsc --noEmit     # TypeScript type check
npx wrangler pages deploy dist --project-name alarabiacarpets  # Deploy
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
- All pages are lazy-loaded via `React.lazy()` in `src/App.tsx`
- New routes go ABOVE the catch-all `"*"` route in App.tsx
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
