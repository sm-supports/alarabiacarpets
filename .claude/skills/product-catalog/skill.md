# Product Catalog Management

All product data lives in `src/data/products.ts`. The `products` array is the single source of truth.

## Data Schema

```typescript
interface ProductMedia {
  type: 'image' | 'video';
  src: string;
}

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

## Current Categories

Defined in `src/pages/Products.tsx` (the `categories` object):

| Key | Label | Image Folder |
|-----|-------|-------------|
| `carpet` | Carpets | `public/Products/Carpets/` |
| `curtains` | Curtains | `public/Products/Curtain/` |
| `furniture` | Furniture | `public/Products/Furniture/` |
| `interior` | Interior Design | `public/Products/Interior Design/` |
| `barkia` | Barkia & PVC | `public/Products/barkia&pvc/` |

## Adding a New Category

1. Choose a lowercase single-word key (e.g., `lighting`)
2. Create the image folder: `public/Products/<FolderName>/`
3. Add the category to the `categories` object in `src/pages/Products.tsx`:
   ```typescript
   const categories = {
     all: { label: "All Products" },
     // ... existing categories ...
     lighting: { label: "Lighting" },  // new
   };
   ```
4. Add products with that category value to `src/data/products.ts`

## Bulk Price Update

All products currently use `"Contact for Price"`. To add real prices:
- Update the `price` field on each product
- Price is a free-form string (e.g., `"QAR 450"`, `"From QAR 200"`)

## Bulk Description Update

Current pattern: `"Premium [Name] for your home and office."`
- Keep descriptions under 120 characters (truncated with `line-clamp-2` on cards)
- Make each description unique and product-specific

## Removing Products

1. Delete the product object from the `products` array
2. Optionally delete media files from `public/Products/` to reduce deploy size
3. Verify no other code references the removed product's ID

## Reordering Products

Products display in array order. Move product objects within the array to change display order. Within a category filter, the relative order from the full array is preserved.

## Verify

```bash
npx tsc --noEmit
npm run dev
```

- Navigate to `/products` and filter each category
- Click several products to confirm detail pages work
- Check that all product images/videos load

## For Single Product Additions

Use the `add-product/` skill instead.
