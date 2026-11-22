# Create a New React Component

## Step 1: Determine Component Type

- **Page section** (like HeroSection, ServicesSection) → create in `src/components/`
- **shadcn/ui primitive** (Button, Dialog, etc.) → run `npx shadcn-ui@latest add <component>` — do not create manually
- **Custom standalone** → create in `src/components/`

## Step 2: Create the File

- Path: `src/components/<ComponentName>.tsx`
- PascalCase filename matching the component name

## Step 3: Follow This Structure

```tsx
// Import UI primitives from @/components/ui/ as needed
// Import icons from @/components/icons (not lucide-react)

interface <ComponentName>Props {
  // Define typed props
}

export default function <ComponentName>({ ...props }: <ComponentName>Props) {
  // Component body
}
```

Key patterns from existing components:
- Use `memo()` wrapper if rendered in lists or receiving stable props
- Export as `export default` (required for React.lazy compatibility)
- Define props with a TypeScript `interface`, not inline types

## Step 4: Styling Rules

**Fonts:**
- Headings: `font-playfair` or `font-display`
- Body text: `font-poppins` or `font-body`

**Colors (Tailwind classes):**
- Primary text: `text-forest-900`
- Accent text: `text-gold-500`, `text-gold-600`
- Secondary backgrounds: `bg-teal-100`, `text-teal-600`
- Muted text: `text-gray-600`

**Layout:**
- Mobile-first responsive: base → `sm:` → `md:` → `lg:` → `xl:`
- Container: `<div className="container mx-auto px-4 sm:px-5 lg:px-8">`
- Rounded corners: `rounded-2xl` for cards, `rounded-full` for pills
- Use logical classes (`ms-`, `pe-`, `start-`, `text-start`, `gap-`) so Arabic mirrors

**Buttons:** the `.cta` family, not utility strings (`design.md`, "Buttons: the `.cta`
family"): `.cta` on light backgrounds, `.cta-dark` on forest bands, `.cta-2` for the
secondary action; all full radius and 48px tall on phones. Labels come from the CTA
vocabulary (`design.md`, "CTA vocabulary"): `common.heroQuote`, `nav.getFreeQuote`,
`statePanel.call`, with `WhatsAppIcon` on a WhatsApp button and no other icon there.
`npm run check` (`check-consistency`) fails any other label in the static HTML. Every
control outside running text is at least 44px both ways on phones.

**Animations:**
- Transitions: `transition-all duration-700 ease-out-expo`
- Hover lift: `hover:shadow-float hover:-translate-y-1`
- Press feedback: `active:scale-[0.98]`

## Step 5: Scroll-Reveal Pattern (for section components)

Add the `reveal` class. It is a CSS scroll-driven animation defined at the end of
`src/index.css`, so the component needs no state, effect or `"use client"` for it:

```tsx
<div className="reveal text-center mb-10">
```

Do not render `opacity-0` and switch it off from an IntersectionObserver. That was the old
pattern: the content sat invisible in the static HTML until the page hydrated, which on a
slow phone is seconds, and `npm run check` now fails on it. Two limits: never put `reveal`
inside an `overflow-hidden` ancestor (the ancestor captures the scroll timeline), and never
on content that is above the fold.

A section that needs no hooks should stay a server component and take `locale` as a prop
(`getDict(locale)`), like `ServicesSection`.

## Step 6: Verify

```bash
npm run typecheck
```

Then import and use the component where needed, and run `npm run build && npm run check`.

## Canonical Examples

- Section component: read `src/components/ServicesSection.tsx`
- List-item component with props: read `src/components/ProductCard.tsx`
