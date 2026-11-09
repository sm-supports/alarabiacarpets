# Add a Product to the Catalog

## Step 1: Prepare Media Files

Place images/videos in the correct category folder under `public/Products/`:

| Category Key | Folder Path |
|-------------|-------------|
| `carpet` | `public/Products/Carpets/` |
| `curtains` | `public/Products/Curtain/` |
| `furniture` | `public/Products/Furniture/` |
| `interior` | `public/Products/Interior Design/` |
| `barkia` | `public/Products/barkia&pvc/` |

- Preferred image format: `.webp` (`.jpeg` acceptable)
- Video format: `.mp4`
- Use descriptive filenames (product name + number if multiple)
- The sized copies pages show are generated from these files into `public/img/` by `scripts/build-card-images.mjs`, which runs before `npm run dev` and `npm run build` and updates `src/data/image-manifest.json` (commit that file). Don't create them by hand. The script fails if a data file points at an image or video that doesn't exist.
- To replace a photo, add it under a new filename and update `products.ts`. The originals are cached for a day under their plain names.

## Step 2: Generate the Product ID

- Convert the product name to lowercase kebab-case
- Remove special characters except hyphens
- Verify uniqueness: search `src/data/products.ts` for the ID

## Step 3: Build the Product Entry

Use `template.json` in this folder as a starting point. Fill in:

- `id` — kebab-case unique string
- `name` — display name, title case
- `category` — one of: `"carpet"`, `"curtains"`, `"furniture"`, `"interior"`, `"barkia"`
- `description` — follows pattern: `"Premium [Name] for your home and office."`
- `media` — array of `{ type: "image" | "video", src: "/Products/<Folder>/<filename>" }`
- `imageSrc` — path to the primary display image (first image in media array)
- `priceFrom` / `priceUnit` (optional) — only a starting price the owner confirmed, e.g. `450` and `"per sqm"`. It drives the page's price line and the `AggregateOffer` in the JSON-LD
- `quoteKind` (optional, only without `priceFrom`) — what the free quote takes: unset is a free measurement, `"quote"` sizes and photos, `"check"` photos of the piece (see `QuoteKind` in `src/data/products.ts`)

The record holds no price string and no WhatsApp link: without `priceFrom` the page shows the free-quote line, and every WhatsApp link is built from `quoteMessage(name)` in `src/i18n`.

## Step 4: Add to Products Array

Open `src/data/products.ts` and add the new product object to the `products` array. Place it near other products of the same category.

The entry must match the `Product` interface. Its required fields:
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  media: ProductMedia[];
  // optional: priceFrom, priceTo, priceUnit, quoteKind, longDescription, specs, faqs, ...
}
```

## Step 5: Verify

```bash
npx tsc --noEmit
npm run dev
```

Then check:
- `/products` — filter by the product's category, confirm it appears
- `/products/<id>` — click the card, confirm detail page loads
- All media items display correctly (images render, videos play)
- The WhatsApp button opens with the quote message naming the product

## Rules

- The `Product` interface is in `src/data/products.ts` — do not modify it
- `imageSrc` must point to an image file, not a video
- Image paths are absolute from public root (start with `/Products/`)

## For Bulk Operations

Use the `product-catalog/` skill instead.
