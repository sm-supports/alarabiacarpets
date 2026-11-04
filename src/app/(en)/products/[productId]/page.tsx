import type { Metadata } from "next";
import ProductDetailView, { productMetadata, productStaticParams } from "@/views/ProductDetailView";

// Every product page is baked at build time from src/data/products.ts.
export function generateStaticParams() {
  return productStaticParams();
}

// The params above are exhaustive, so any other path is a genuine 404.
export const dynamicParams = false;

// Next 15: params is a Promise and must be awaited. Forgetting the await yields
// an undefined productId, which would silently render 43 not-found pages.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  return productMetadata("en", productId);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <ProductDetailView locale="en" productId={productId} />;
}
