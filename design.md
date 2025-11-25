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
- Style: Lucide icons (consistent with existing)

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
