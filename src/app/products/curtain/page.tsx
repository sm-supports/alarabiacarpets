import CategoryLanding from "@/components/CategoryLanding";
import { buildCategoryMetadata } from "@/lib/seo";

// Literal segment: takes /products/curtain from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = buildCategoryMetadata("curtain");

export default function CurtainsCategoryPage() {
  return <CategoryLanding slug="curtain" />;
}
