# Al Arabia Carpets - Brand Design System

A comprehensive design system for the Al Arabia Carpets website, inspired by Apple's clean, modern aesthetic while maintaining the brand's elegant green and gold identity.

---

## Brand Identity

### Brand Values
- **Elegance**: Premium quality home furnishings
- **Trust**: Established reputation in Qatar
- **Craftsmanship**: Attention to detail in every product
- **Service**: Free delivery and installation

### Brand Voice
- Professional yet approachable
- Confident and refined
- Clear and concise

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Deep Forest | `#0A2A1F` | rgb(10, 42, 31) | Primary brand color, dark backgrounds, text |
| Rich Gold | `#C5A572` | rgb(197, 165, 114) | Accent highlights, CTAs, premium elements |
| Sage Teal | `#4D7C6F` | rgb(77, 124, 111) | Secondary accent, hover states |

### Neutral Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Snow | `#FAFAFA` | rgb(250, 250, 250) | Page backgrounds |
| Pure White | `#FFFFFF` | rgb(255, 255, 255) | Card surfaces, contrast |
| Near Black | `#1D1D1F` | rgb(29, 29, 31) | Primary text |
| Stone Gray | `#86868B` | rgb(134, 134, 139) | Secondary text, captions |
| Light Gray | `#F5F5F7` | rgb(245, 245, 247) | Subtle backgrounds |
| Border Gray | `#D2D2D7` | rgb(210, 210, 215) | Borders, dividers |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#34C759` | Success states |
| Warning | `#FF9500` | Warning states |
| Error | `#FF3B30` | Error states |

### Gradient Definitions

```css
/* Hero gradient - dark elegant */
--gradient-hero: linear-gradient(135deg, #0A2A1F 0%, #1a4a3a 50%, #0A2A1F 100%);

/* Gold accent gradient */
--gradient-gold: linear-gradient(135deg, #C5A572 0%, #E8D5B5 50%, #C5A572 100%);

/* Text gradient for headlines */
--gradient-text: linear-gradient(135deg, #C5A572 0%, #E8D5B5 100%);

/* Subtle background gradient */
--gradient-subtle: linear-gradient(180deg, #FAFAFA 0%, #F5F5F7 100%);
```

---

## Typography

### Font Families

```css
/* Primary heading font - elegant serif */
--font-display: 'Playfair Display', Georgia, serif;

/* Body and UI font - clean sans-serif */
--font-body: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Name | Size | Line Height | Weight | Letter Spacing | Usage |
|------|------|-------------|--------|----------------|-------|
| Display | 80px | 1.1 | 700 | -0.02em | Hero headlines |
| Headline 1 | 56px | 1.15 | 700 | -0.015em | Section titles |
| Headline 2 | 48px | 1.2 | 600 | -0.01em | Sub-section titles |
| Headline 3 | 32px | 1.25 | 600 | -0.005em | Card titles |
| Title | 24px | 1.3 | 600 | 0 | Component headers |
| Body Large | 21px | 1.5 | 400 | 0 | Lead paragraphs |
| Body | 17px | 1.6 | 400 | 0 | Main content |
| Body Small | 14px | 1.5 | 400 | 0 | Captions, metadata |
| Caption | 12px | 1.4 | 500 | 0.02em | Labels, fine print |

### Typography CSS Classes

```css
.text-display {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-headline-1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.text-headline-2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.text-body-large {
  font-family: var(--font-body);
  font-size: 1.3125rem;
  line-height: 1.5;
  font-weight: 400;
}
```

---

## Spacing System

Based on an 8px grid system for consistency.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Small gaps, inline spacing |
| `--space-3` | 12px | Compact component padding |
| `--space-4` | 16px | Standard component padding |
| `--space-5` | 24px | Card padding, medium gaps |
| `--space-6` | 32px | Section gaps |
| `--space-8` | 48px | Large section padding |
| `--space-10` | 64px | Section margins |
| `--space-12` | 80px | Hero section padding |
| `--space-16` | 128px | Major section spacing |

---

## Animation & Motion

### Timing Functions

```css
/* Apple-inspired easing curves */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions, hovers |
| `--duration-normal` | 300ms | Standard transitions |
| `--duration-slow` | 500ms | Page transitions, reveals |
| `--duration-slower` | 800ms | Complex animations |

### Standard Animations

```css
/* Fade in up - for scroll reveals */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in - for modals and overlays */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide in from right - for drawers */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

---

## Components

The button, card and navigation specs in this section are the original brief. What the
site uses is in [Site components as built](#site-components-as-built) below; where the two
differ, that section wins.

### Buttons

#### Primary Button
- Background: `#0A2A1F` (Deep Forest)
- Text: `#FFFFFF`
- Padding: 16px 32px
- Border Radius: 980px (pill shape)
- Font: Poppins, 17px, 600 weight
- Hover: Background lightens to `#1a4a3a`
- Transition: 300ms ease-out-expo

#### Secondary Button
- Background: transparent
- Border: 1px solid `#D2D2D7`
- Text: `#1D1D1F`
- Padding: 16px 32px
- Border Radius: 980px
- Hover: Background `#F5F5F7`

#### Ghost Button
- Background: transparent
- Text: `#0A2A1F`
- Underline on hover
- Used for "Learn more" links

### Cards

#### Product Card
- Background: `#FFFFFF`
- Border Radius: 24px
- Shadow: `0 4px 24px rgba(0, 0, 0, 0.06)`
- Padding: 24px
- Hover: Transform translateY(-4px), shadow increases

#### Feature Card
- Background: `#F5F5F7`
- Border Radius: 20px
- Padding: 32px
- No shadow

### Navigation

#### Desktop Nav
- Height: 48px
- Background: `rgba(255, 255, 255, 0.72)`
- Backdrop blur: 20px
- Position: sticky top
- Links: 14px, 400 weight, `#1D1D1F`
- Link hover: `#86868B`

#### Mobile Nav
- Full-screen overlay
- Background: `#FFFFFF`
- Slide-down animation
- Links: 32px, centered

---

## Site components as built

From the mobile redesign (2026-11, plan "Premium Experience"). The rules live in
`src/index.css` (component classes near its end) and the components named here. A phone is
anything below Tailwind's `md` (768px); unless a rule says otherwise, the phone rules are
`max-md:` or `@media not all and (min-width: 768px)`, and desktop keeps what it had.
`scripts/check-consistency.mjs` (in `npm run check`) enforces the CTA vocabulary, the icons
and the breadcrumbs.

### Buttons: the `.cta` family

| Class | Look | Where |
|-------|------|-------|
| `.cta` | Deep Forest fill, white text | Light backgrounds |
| `.cta-dark` | Rich Gold fill, Deep Forest text | Forest bands (page headers, the form, closing sections) |
| `.cta-2` | White, 1px forest outline at 30% | The secondary action beside a primary one |

All three: `inline-flex`, at least 48px tall (`min-h-12`), full radius, 14px (`text-sm`)
semibold, `px-4 py-3` (`md:px-6`), 8px gap, a 16px icon, `text-wrap: balance`, pressed
scale 0.98, and a 2px focus outline 2px out (forest; gold on `.cta-dark`).

Size modifiers change desktop only, so the old desktop heights hold: `.cta-s` (`md:` 40px,
`px-5`), `.cta-m` (`md:` 44px), `.cta-l` (`md:` `px-8 py-4`, 16px text). Layout helpers:
`.cta-pair` (two side by side, each growing below `sm`), `.cta-wide` (full width up to 320px
on phones, natural width from `md`), `.pc-act` (a card's button, kept on one line).

They replaced `.pc-cta`, `.sc-cta`, `.hero-*`, `.ct-primary` and `.all-cta`. Not part of the
family, each for a reason:

- The action bar's `.ab-call` / `.ab-wa`: same 48px, own grid (below).
- The desktop header's `.nav-cta` is weight 500, not 600, so the header row keeps its
  baseline metrics to the pixel. `.ft-cta` narrows the footer's button.
- `/contact` tiles (`.ct-tile`), the 404's buttons and the self-contained screens
  (`global-error.tsx`, `public/sw.js`) copy the look inline: they can't use the stylesheet.

### CTA vocabulary

One set of labels everywhere. They are shared HTML, so desktop shows them too.

| Key | EN | AR | Where |
|-----|----|----|-------|
| `common.heroQuote` | Get a free quote on WhatsApp | اطلب عرض سعر مجاني على الواتساب | Heroes and closing sections |
| `nav.getFreeQuote` | Get a Free Quote | اطلب عرض سعر مجاني | Action bar, phone menu, footer, product cards, S3 |
| `nav.getQuote` | Get Quote | اطلب عرض سعر | The desktop header button (`.nav-cta`) only, by the owner's decision of 2026-11-09 |
| `statePanel.call` | Call | اتصل | The one call label, alone or before the number |
| `common.askOnWhatsApp` | Ask us on WhatsApp | اسألنا على الواتساب | Guides only: what a guide offers is advice |

- Every product and service prefill is `common.quoteMessage(name)`, then "Size:" /
  "المقاس:", then the page address without its query, so `gclid` and `lang=en` never reach
  the customer's chat.
- A WhatsApp CTA carries `WhatsAppIcon` and nothing else: no cart, phone or chat icon. A
  `tel:` link carries the phone icon or none. One exception: `StatePanel`'s buttons are
  words only (below).
- Retired, and failed by `check-consistency` anywhere in `src/` or `out/`: "Get Quote"
  (except on `.nav-cta`), "Contact Us on WhatsApp", "Chat on WhatsApp", "Inquire on
  WhatsApp", "Call Now", and their Arabic. In `src/` it catches the label written out and
  `nav.getQuote` used anywhere but inside the `.nav-cta` element, so the phone menu and the
  panels, which never reach `out/`, are covered too.

### Page header

Every interior page opens the same way: a one-line `Breadcrumb`, the h1 (`.h1-band`, 30px
on phones, 36 at `md`, 48 at `lg`), the summary, the price chip or the no-price line (S17),
then a `.cta-dark` (`HeroQuoteCta`). Home is exempt.

- `Breadcrumb` (`.bc`, `.bc-dark` on forest): below `md` one line, each link a 44px tap,
  the current page cut with an ellipsis, chevron separators drawn in CSS and mirrored in
  Arabic. From `md` it wraps, with "/" between steps. Desktop keeps what it had:
  `phoneOnly` hides the trail from `md` on page types that had none there, and
  `currentPhoneOnly` (`.bc-cur-m`) hides the last step from `md` where the old trail
  stopped before the page (guides, whose h1 it repeats). It must match the page's
  `BreadcrumbList` step for step (`check-consistency`).
- Product pages lead with the gallery, then the category, h1 and price. The Back link is
  hidden on phones.
- The no-price line (`price.noPrice`, `.no-price`) is "Free measurement and quote. Send your
  sizes and a few photos." / "القياس وعرض السعر مجانًا. أرسل المقاسات وبعض الصور." on every
  job without a price.

### Type on phones

Below `md` only; desktop keeps the utility sizes on each element.

| Element | Size / line height |
|---------|--------------------|
| h1 (interior) | 30px |
| h2 in `<main>` | 24 / 32px |
| h3 in `<main>` | 18 / 28px |
| Body and paragraphs | 15px / 1.7, Arabic 1.9. 14px paragraphs (summaries, FAQ answers, the S17 line) go to 15px |
| Tile small print (`.pc-price`, `.pc-text`, `.rel-text`) | 1.5, Arabic 1.6 |

Tile and card titles (`.pc-title`, `.rel-title`, `.cat-title`, `.idx-title`) and panel
headlines (`.sp-title`) keep their own sizes. Every FAQ heading uses `.faq-h`. Inputs are
16px at every width, so iOS doesn't zoom.

### StatePanel

`src/components/StatePanel.tsx`: the one way the site says what just happened. Words come in
as props; it reads no context.

- **Order:** badge (`.sp-badge`, `.sp-badge-fail` for a failure), headline (`.sp-title`,
  18px semibold forest; its element set by `headingAs` so the page keeps one h1), facts
  (`.sp-facts`, 14px), then the buttons (`.sp-actions`), full width in a column, the
  secondary ones above, the primary at the bottom.
- **Variants:**
  - `overlay`: a bottom sheet (`.sp-overlay`, z 100, at most 85% of the screen, safe-area
    padding, a 240ms slide-up). At `md` a 420px card bottom-right. Always has Close.
    Only `StatusRegion` renders it, from `lib/status.ts`: the tap feedback S1 to S4.
  - `inline`: in the flow next to what it is about (`.sp-inline`): the form states. A state
    that holds the visitor's text stays until resolved and has no Close. Sent (S6, S6r)
    has one.
  - `page`: the whole body of a page (`.sp-page`): `error.tsx` (S15). Never a Close.
- **Close** (`.sp-close`): 44px, top end. Focus goes back where it was.
- **Focus and speech:** the status and alert regions are always mounted, so a change is
  announced. Failures the visitor's own press caused move focus: S7 to S9 and Sent to the
  headline, S10 (field errors) to the first field in error. `urgent` uses the alert role.
- **Buttons are words only.** A panel's WhatsApp and Call buttons carry no icon, unlike
  the bar and the cards: the panel's headline already says what each one is for, and a
  column of full-width buttons reads by its labels. `check-consistency` reads the static
  HTML, which these never reach (they render after hydration), so this rule is held here.
- Names, emails and REF go in `<bdi>`, so they don't reorder in Arabic.
- One status at a time. A form state in view outranks all tap feedback, then S4, S2, S1,
  S3 (`lib/feedback.ts`).
- Reduced motion turns off the slide-up and the progress line.
- The self-contained screens copy the look with inline styles: `global-error.tsx` (S15 when
  a root layout fails), the 404 (`global-not-found.tsx`) and the offline page (S14, built
  inside `public/sw.js`).

### Action bar

`src/components/WhatsAppFloat.tsx` (`.ab`, marked `data-action-bar`).

- **Below `md`:** fixed to the bottom, white, z 30, a grid of `1fr 2fr` with an 8px gap,
  16px side padding, 8px above and 8px plus the safe area below: about 64px. [Call] then
  [Get a Free Quote], each 48px; Arabic mirrors. Below 360px the gaps tighten. Call is
  outlined; the quote is Deep Forest with `WhatsAppIcon`.
- The page keeps clear of it: body padding and `html` `scroll-padding-bottom` are
  `4rem + env(safe-area-inset-bottom)`, `scroll-padding-top` is 3.5rem for the header.
- It hides while a text field has focus (`body:has(input:focus, textarea:focus) .ab`), so
  it never sits on the keyboard.
- **From `md`:** the old green WhatsApp pill, bottom left, 20px in, labelled "WhatsApp";
  Call is hidden.
- Before hydration the WhatsApp half links to `/contact` (an in-page `#contact-form` anchor
  on `/contact` itself). The prefill names what the page is about, registered by
  `BarIntent` in the product, service and category views.
- No floating bubbles on phones: Tawk opens only from the menu's Live chat row.

### Folds

Text that is folded on phones and open from `md`, without script and without layout shift.
The text is always in the HTML, so crawlers and the SEO snapshot read it.

- **`.fold`:** a `<details class="fold">` holding only its `<summary>`. The text is the
  next element, `.fold-body`, which a closed fold hides below `md`. A label-only summary
  is `.fold-l` and leaves with its fold at `md`.
- **`FoldHead` (`.fold-h`):** for a section whose heading is the toggle. The heading stays
  outside the summary (a summary is a button, and a heading inside one stops being a
  heading). The summary is empty, named by the heading's id (`aria-labelledby`), and laid
  over the heading below `md`; from `md` it is gone. The heading gets a "+" at its end
  that turns to "×" when open. A URL hash naming the heading opens it (`:target`).
- **`.fold-all`** (`FoldHead always`): a toggle at every width: the `/contact` panels, closed
  on desktop too so the page fits one screen.
- **`.fold-lead`:** one always-open paragraph between `.fold-h` and `.fold-body` (Home's
  about intro). Nothing else may sit between them, or the folded text shows on phones.
- The footer's Products and Company columns fold below `md`, with 44px rows.
- Accepted: find in page and a `#:~:text=` link can't open a closed fold on a phone.

### Tiles (the `/products` grid below `sm`)

`ProductsGrid` and `ProductCard`: two columns of tiles, 12px radius. Each has one photo
(4:3; the track doesn't swipe), the name in two lines (14/20px), the price line (`.pc-price`)
or "Free quote", and two lines of description (`.pc-text`), all in the HTML. The title link
is stretched over the tile (`.pc-title a::after`), so a tap anywhere opens the product,
before hydration too, and the focus ring draws round the whole tile. The card's button
(`.pc-act`) and the count and play badges are hidden: the bar has the quote. From `sm` the
cards are as they were.

### Gallery (product page)

`ProductGallery` with `ProductMedia`, reusing `.pc-track` scroll-snap. Below `md` the photo box
is a swipe strip, edge to edge below `sm`, 4:3. The server-rendered hero comes first and is
the page's only high-priority image; the product's other photos join after hydration, with
no `fetchPriority`. A count badge ("1/4", `.pc-count`) replaces dots, and the arrows are
hidden. From `md` the 300 / 500px box is as before.

`ImageFallback` (in `providers.tsx`): a catalog photo that fails becomes a tile (`.imgx`) in
its own box, its alt text over "Image unavailable". A video keeps its poster and gets the same
words as a band across its top (`.imgx-v`); where a count badge sits over it, the band's
words keep 4.75rem clear on both sides. Both are asked for again when the connection comes
back.

### Z-stack

| Layer | z-index |
|-------|---------|
| Action bar (phones) | 30 |
| Header | 40 |
| WhatsApp pill (`md` and up) | 50 |
| Phone menu (covers the bar) | 60 |
| Navigation progress line (`NavProgress`, 2px gold, after 250ms) | 70 |
| Status overlay (S1 to S4) | 100 |

### Tap targets

On phones every control outside running text is at least 44px both ways (bar buttons and
`.cta` 48px). Where a link would move its line if it grew, it gets padding that its margins
give back (`.bc a`, `.rel-all`, `.idx-more`, `.chip-link`, `.faq-q`). `scripts/audit-mobile.mjs
--strict` fails on anything smaller.

---

## Layout

### Container Widths

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile | 100% | 20px |
| Tablet | 100% | 32px |
| Desktop | 1200px | 48px |
| Wide | 1400px | 64px |

### Grid System

- 12-column grid
- Gutter: 24px (mobile), 32px (desktop)
- Max content width: 980px (for text-heavy sections)

### Section Patterns

#### Hero Section
- Min height: 100vh
- Center-aligned content
- Large typography
- Subtle background effects

#### Product Showcase
- Full-width images
- Alternating image/text layout
- Generous whitespace

#### Feature Grid
- 3-column on desktop
- Equal height cards
- Consistent spacing

---

## Iconography

### Style Guidelines
- Line weight: 1.5px
- Size scale: 16px, 20px, 24px, 32px
- Color: Inherit from text or `#86868B`
- Style: Lucide shapes, served from the sprite (`@/components/icons`, `public/icons.svg`), not `lucide-react`

---

## Image Guidelines

### Product Photography
- Clean, neutral backgrounds (white or light gray)
- Consistent lighting
- High resolution (min 2x for retina)
- Aspect ratios: 1:1 (thumbnails), 4:3 (cards), 16:9 (heroes)

### Image Treatment
- Border radius: 16px - 24px
- Optional subtle shadow
- Lazy loading for below-fold images

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have visible focus states
- Gold accent (`#C5A572`) used sparingly on dark backgrounds

### Focus States
- Outline: 2px solid `#0A2A1F`
- Outline offset: 2px
- Visible on keyboard navigation

### Motion
- Respect `prefers-reduced-motion`
- Essential animations only when reduced motion enabled

---

## Dark Mode (Future)

Reserved for future implementation. Colors will invert while maintaining brand identity:
- Background: `#000000`
- Surface: `#1D1D1F`
- Text: `#F5F5F7`
- Brand colors remain consistent
