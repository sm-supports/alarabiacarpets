import CategoryLanding, { categoryMetadata } from "@/components/CategoryLanding";

// Literal segment: takes /products/majlis-sofa from the [productId] dynamic route.
// This URL previously served a category-hub product and is already indexed.
export const metadata = categoryMetadata("ar", "majlis-sofa");

export default function MajlisSofaCategoryPage() {
  return <CategoryLanding slug="majlis-sofa" locale="ar" />;
}
