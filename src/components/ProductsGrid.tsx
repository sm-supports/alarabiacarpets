"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { productImageAlt } from "@/lib/seo";

/**
 * Full product grid for /products.
 *
 * Category browsing lives in the "Shop by category" image cards above this on
 * the page, which link to the real category landing pages, so there is no
 * in-page filter here. `products` crosses the server/client boundary as plain
 * serializable JSON.
 */
export default function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <>
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
        All products
      </h2>

      <div className="mb-6 flex items-center justify-between">
        <p className="font-poppins text-sm text-neutral-500">
          Showing{" "}
          <span className="font-semibold text-neutral-700">{products.length}</span>{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            imageSrc={product.imageSrc}
            media={product.media}
            whatsappLink={product.whatsappLink}
            href={`/products/${product.id}`}
            imageAlt={productImageAlt(product)}
            priority={index < 4}
          />
        ))}
      </div>
    </>
  );
}
