import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import { cardImagePath } from "@/lib/card-image";
import { productImageAlt } from "@/lib/seo";

/**
 * Full product grid for /products.
 *
 * Category browsing lives in the "Shop by category" image cards above this on
 * the page, which link to the real category landing pages, so there is no
 * in-page filter here. Server component, so only the few fields each ProductCard
 * needs reach the page's hydration data, not the whole product records.
 *
 * Below sm it is two columns of tiles (photo, name, price line, description), each one
 * link to its product page, which holds the gallery and the quote; at sm and up, the
 * cards as before.
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

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {products.map((product) => {
          // One 720px URL per image, not a srcSet: 37 cards of srcSet would take
          // /ar/products under the 10% text-to-HTML floor.
          const poster = cardImagePath(product.imageSrc);
          const media = product.media.map((item) =>
            item.type === "video" ? item : { type: item.type, src: cardImagePath(item.src) }
          );
          // Props the card can work out itself stay out of the hydration data: the
          // poster when it is the first image slide, and in English the analytics name.
          // Left out, not passed as undefined, which is serialised too.
          const derived = {
            ...(product.analyticsName && { analyticsName: product.analyticsName }),
            ...(poster !== media.find((item) => item.type === "image")?.src && { poster }),
          };
          return (
            <ProductCard
              key={product.id}
              name={product.name}
              {...derived}
              description={product.description}
              price={
                product.priceFrom
                  ? formatFromPrice(product.priceFrom, product.priceUnit, locale)
                  : t.price.freeQuote
              }
              media={media}
              href={lp(`/products/${product.id}`)}
              imageAlt={productImageAlt(product, locale)}
            />
          );
        })}
      </div>
    </>
  );
}
