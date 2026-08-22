import Link from "next/link";
import { guidesForProduct } from "@/data/guides";

/**
 * Reverse half of the topic cluster: product pages link back out to the guides
 * that reference them, so link equity flows both ways rather than only from
 * guide to money page.
 */
export default function RelatedGuides({ productId }: { productId: string }) {
  const related = guidesForProduct(productId);
  if (related.length === 0) return null;

  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-4xl">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
          Helpful reading
        </h2>
        <ul className="space-y-4">
          {related.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group block rounded-xl border border-neutral-200 p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30"
              >
                <h3 className="font-playfair text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="font-poppins text-sm text-neutral-500 mt-1 leading-relaxed">
                  {guide.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
