import Link from "next/link";
import { products } from "@/data/products";
import { categoryLabel, categoryPath, productImageAlt } from "@/lib/seo";

/**
 * Same-category siblings, with a top-up from other categories when a category
 * is too small to fill the row.
 *
 * Server component: these are pure internal links and belong in the static HTML.
 * The product pages previously had a "Related Products" comment over a section
 * that rendered no products at all, so every detail page was an internal-linking
 * dead end -- the only way out was the back button or WhatsApp.
 */
export default function RelatedProducts({
  currentId,
  category,
  limit = 4,
}: {
  currentId: string;
  category: string;
  limit?: number;
}) {
  // Same category only. Padding with other categories made the
  // "More in {category}" heading factually wrong for small categories, and gave
  // crawlers misleading anchor context.
  const related = products
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, limit);

  const href = categoryPath(category);

  if (related.length === 0) return null;

  return (
    <section className="py-14 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-neutral-900">
          {/* Links up to the category landing page. This fires on every product
              page, so it is the main path crawlers take from a SKU to a money page. */}
          {href ? (
            <Link href={href} className="hover:text-primary transition-colors">
              More in {categoryLabel(category)}
            </Link>
          ) : (
            <>More in {categoryLabel(category)}</>
          )}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group block bg-white rounded-xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                {p.imageSrc.endsWith(".mp4") ? (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    {p.name}
                  </div>
                ) : (
                  <img
                    src={p.imageSrc}
                    alt={productImageAlt(p)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-playfair text-sm sm:text-base font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="font-poppins text-xs text-neutral-500 mt-1">
                  {categoryLabel(p.category)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {href && (
          <div className="mt-8">
            <Link
              href={href}
              className="font-poppins text-sm font-medium text-primary hover:underline"
            >
              View all {categoryLabel(category)} &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
