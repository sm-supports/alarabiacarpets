import CategoryLanding, { categoryMetadata } from "@/components/CategoryLanding";

// Literal segment: takes /products/barkia from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = categoryMetadata("ar", "barkia");

export default function BarkiaCategoryPage() {
  return <CategoryLanding slug="barkia" locale="ar" />;
}
