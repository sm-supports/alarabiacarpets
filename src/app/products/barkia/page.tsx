import CategoryLanding from "@/components/CategoryLanding";
import { buildCategoryMetadata } from "@/lib/seo";

// Literal segment: takes /products/barkia from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = buildCategoryMetadata("barkia");

export default function BarkiaCategoryPage() {
  return <CategoryLanding slug="barkia" />;
}
