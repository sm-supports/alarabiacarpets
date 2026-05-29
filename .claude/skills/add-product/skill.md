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
- `price` — `"Contact for Price"` (default) or specific like `"QAR 450"`
- `media` — array of `{ type: "image" | "video", src: "/Products/<Folder>/<filename>" }`
- `imageSrc` — path to the primary display image (first image in media array)
- `whatsappLink` — `https://wa.me/+97455512858?text=I'm%20interested%20in%20<URL-encoded-name>`

## Step 4: Add to Products Array

Open `src/data/products.ts` and add the new product object to the `products` array. Place it near other products of the same category.

The entry must match the `Product` interface exactly:
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  imageSrc: string;
  media: ProductMedia[];
  whatsappLink: string;
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
- WhatsApp link opens with the correct pre-filled message

## Rules

- The `Product` interface is in `src/data/products.ts` — do not modify it
- WhatsApp number is always `+97455512858`
- `imageSrc` must point to an image file, not a video
- Image paths are absolute from public root (start with `/Products/`)
- URL-encode the product name in the WhatsApp link text parameter

## For Bulk Operations

Use the `product-catalog/` skill instead.
