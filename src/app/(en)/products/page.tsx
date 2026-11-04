import ProductsView, { productsMetadata } from "@/views/ProductsView";

export const metadata = productsMetadata("en");

export default function ProductsPage() {
  return <ProductsView locale="en" />;
}
