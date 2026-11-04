import CategoryLanding, { categoryMetadata } from "@/components/CategoryLanding";

// Literal segment: takes /products/interior from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = categoryMetadata("ar", "interior");

export default function InteriorCategoryPage() {
  return <CategoryLanding slug="interior" locale="ar" />;
}
