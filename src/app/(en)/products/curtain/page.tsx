import CategoryLanding, { categoryMetadata } from "@/components/CategoryLanding";

// Literal segment: takes /products/curtain from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = categoryMetadata("en", "curtain");

export default function CurtainCategoryPage() {
  return <CategoryLanding slug="curtain" locale="en" />;
}
