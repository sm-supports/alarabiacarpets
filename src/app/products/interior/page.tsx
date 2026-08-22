import CategoryLanding from "@/components/CategoryLanding";
import { buildCategoryMetadata } from "@/lib/seo";

// Literal segment: takes /products/interior from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = buildCategoryMetadata("interior");

export default function InteriorCategoryPage() {
  return <CategoryLanding slug="interior" />;
}
