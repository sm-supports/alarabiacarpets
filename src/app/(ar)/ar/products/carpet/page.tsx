import CategoryLanding, { categoryMetadata } from "@/components/CategoryLanding";

// Literal segment: takes /products/carpet from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = categoryMetadata("ar", "carpet");

export default function CarpetCategoryPage() {
  return <CategoryLanding slug="carpet" locale="ar" />;
}
