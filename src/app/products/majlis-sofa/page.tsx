import CategoryLanding from "@/components/CategoryLanding";
import { buildCategoryMetadata } from "@/lib/seo";

// Literal segment: takes /products/majlis-sofa from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = buildCategoryMetadata("majlis-sofa");

export default function FurnitureCategoryPage() {
  return <CategoryLanding slug="majlis-sofa" />;
}
