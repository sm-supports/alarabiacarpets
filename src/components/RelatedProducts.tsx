import Link from "next/link";
import { categoryLabelFor, categorySlugFor, getProducts } from "@/data/localized";
import { getDict, localePath, type Locale } from "@/i18n";
import { productImageAlt } from "@/lib/seo";

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
  locale,
  currentId,
  category,
  limit = 4,
}: {
  locale: Locale;
  currentId: string;
  category: string;
  limit?: number;
}) {
  const t = getDict(locale);
  const products = getProducts(locale);
  const label = categoryLabelFor(locale, category);

  // Same category only. Padding with other categories made the
  // "More in {category}" heading factually wrong for small categories, and gave
  // crawlers misleading anchor context.
  const siblings = products.filter(
    (p) => p.id !== currentId && p.category === category
  );

  // Circular window starting just after the current product, NOT siblings.slice(0, limit).
  // A fixed prefix meant every page in a category linked to the same first few
  // products, so in barkia (15) and carpet (10) everything past the prefix was
  // reachable only from the category page -- 15 of 37 SKUs had zero sibling
  // links, and Search Console parked them under "Discovered - currently not
  // indexed". Rotating the window makes each category graph strongly connected:
  // every product is linked from `limit` siblings, and the set stays stable
  // across builds because it is derived from array position, not randomness.
  // Math.max guards the not-found case: findIndex returns -1, and JS `%` keeps
  // the sign of the dividend, so (-1 % n) is -1 and siblings[-1] is undefined.
  // Clamping to 0 starts the window at the first sibling instead of crashing.
  const start = Math.max(
    0,
    products
      .filter((p) => p.category === category)
      .findIndex((p) => p.id === currentId)
  );
  const related = Array.from(
    { length: Math.min(limit, siblings.length) },
    (_, i) => siblings[(start + i) % siblings.length]
  );

  const slug = categorySlugFor(category);
  const href = slug ? localePath(locale, `/products/${slug}`) : undefined;

  if (related.length === 0) return null;

  return (
    <section className="py-14 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <h2 className="h2-sec">
          {/* Links up to the category landing page. This fires on every product
              page, so it is the main path crawlers take from a SKU to a money page. */}
          {href ? (
            <Link href={href} className="hover:text-primary transition-colors">
              {t.productDetail.moreIn(label)}
            </Link>
          ) : (
            <>{t.productDetail.moreIn(label)}</>
          )}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {related.map((p) => (
            <Link
              key={p.id}
              href={localePath(locale, `/products/${p.id}`)}
              className="group rel-card"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                {p.imageSrc.endsWith(".mp4") ? (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    {p.name}
                  </div>
                ) : (
                  <img
                    src={p.imageSrc}
                    alt={productImageAlt(p, locale)}
                    loading="lazy"
                    decoding="async"
                    className="rel-img"
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="rel-title">
                  {p.name}
                </h3>
                <p className="font-poppins text-xs text-neutral-500 mt-1">
                  {label}
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
              {t.productDetail.viewAll(label)} {locale === "ar" ? <>&larr;</> : <>&rarr;</>}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
