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
import { useEffect, useRef, useState } from "react";
// Import UI primitives from @/components/ui/ as needed
// Import icons from lucide-react as needed

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
- Rounded corners: `rounded-2xl` for cards, `rounded-xl` for buttons, `rounded-full` for pills

**Animations:**
- Transitions: `transition-all duration-700 ease-out-expo`
- Hover lift: `hover:shadow-float hover:-translate-y-1`
- Press feedback: `active:scale-[0.98]`

## Step 5: Scroll-Reveal Pattern (for section components)

```tsx
const [isVisible, setIsVisible] = useState(false);
const sectionRef = useRef<HTMLElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.15 }
  );
  if (sectionRef.current) observer.observe(sectionRef.current);
  return () => observer.disconnect();
}, []);
```

Apply to elements:
```tsx
className={`transition-all duration-1000 ease-out-expo ${
  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
}`}
```

For staggered children, add `style={{ transitionDelay: `${index * 100}ms` }}`.

## Step 6: Verify

```bash
npx tsc --noEmit
```

Then import and use the component where needed.

## Canonical Examples

- Section component: read `src/components/ServicesSection.tsx`
- List-item component with props: read `src/components/ProductCard.tsx`
