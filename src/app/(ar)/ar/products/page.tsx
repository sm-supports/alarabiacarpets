import ProductsView, { productsMetadata } from "@/views/ProductsView";

export const metadata = productsMetadata("ar");

export default function ProductsPage() {
  return <ProductsView locale="ar" />;
}
