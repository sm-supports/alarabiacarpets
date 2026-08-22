import CategoryLanding from "@/components/CategoryLanding";
import { buildCategoryMetadata } from "@/lib/seo";

// Literal segment: takes /products/carpet from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = buildCategoryMetadata("carpet");

export default function CarpetCategoryPage() {
  return <CategoryLanding slug="carpet" />;
}
