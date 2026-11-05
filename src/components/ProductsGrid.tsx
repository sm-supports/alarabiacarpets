import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { getDict, localePath, type Locale } from "@/i18n";
import { productImageAlt } from "@/lib/seo";

/**
 * Full product grid for /products.
 *
 * Category browsing lives in the "Shop by category" image cards above this on
 * the page, which link to the real category landing pages, so there is no
 * in-page filter here. Server component, so only the few fields each ProductCard
 * needs reach the page's hydration data, not the whole product records.
 */
export default function ProductsGrid({ products, locale }: { products: Product[]; locale: Locale }) {
  const t = getDict(locale);
  const lp = (path: string) => localePath(locale, path);
  return (
    <>
      <h2 className="h2-sec6">
        {t.productsGrid.heading}
      </h2>

      <div className="mb-6 flex items-center justify-between">
        <p className="font-poppins text-sm text-neutral-500">
          {t.productsGrid.showing}{" "}
          <span className="font-semibold text-neutral-700">{products.length}</span>{" "}
          {products.length === 1 ? t.productsGrid.product : t.productsGrid.products}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            analyticsName={product.analyticsName ?? product.name}
            description={product.description}
            imageSrc={product.imageSrc}
            media={product.media}
            // Arabic cards build the same link from the name: the percent-encoded
            // Arabic text is several times longer than the name itself.
            whatsappLink={locale === "ar" ? undefined : product.whatsappLink}
            href={lp(`/products/${product.id}`)}
            imageAlt={productImageAlt(product, locale)}
          />
        ))}
      </div>
    </>
  );
}
