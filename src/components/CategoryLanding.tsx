import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { products } from "@/data/products";
import { categories, getCategory, type CategorySection } from "@/data/categories";
import { guidesForCategory } from "@/data/guides";
import {
  buildBreadcrumb,
  buildCollectionPage,
  buildFaq,
  productImageAlt,
} from "@/lib/seo";

/** Specs table and FAQ list, shared by the main body and any secondary section. */
function SpecList({ specs }: { specs: NonNullable<CategorySection["specs"]> }) {
  return (
    <dl className="font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100 max-w-2xl">
      {specs.map((spec) => (
        <div key={spec.label} className="flex justify-between gap-4 py-2.5">
          <dt className="text-neutral-500">{spec.label}</dt>
          <dd className="text-neutral-900 font-medium text-right">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Category landing page.
 *
 * Serves the five URLs that previously held category-hub *products*
 * (/products/carpet, /products/barkia, ...). Same URL, same title, new page
 * type: it now lists every product in the category and emits CollectionPage
 * rather than Product.
 */
export default function CategoryLanding({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) throw new Error(`Unknown category slug: ${slug}`);

  const items = products.filter((p) => p.category === category.key);
  const guides = guidesForCategory(category.slug);
  const siblings = categories.filter((c) => c.slug !== category.slug);
  const path = `/products/${category.slug}`;

  // FAQs from the main body and any folded-in secondary section are emitted as
  // one FAQPage, matching what a reader sees on the page.
  const allFaqs = [...(category.faqs ?? []), ...(category.secondary?.faqs ?? [])];

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd
        data={buildCollectionPage({
          name: category.heading,
          description: category.metaDescription,
          path,
          items: items.map((p) => ({ name: p.name, path: `/products/${p.id}` })),
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          ["Products", "/products"],
          [category.label, path],
        ])}
      />
      {allFaqs.length > 0 && <JsonLd data={buildFaq(allFaqs)} />}

      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-2 font-poppins text-sm text-white/70">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/products" className="hover:text-white">Products</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white">{category.label}</li>
              </ol>
            </nav>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {category.heading}
            </h1>
            <p className="font-poppins max-w-2xl text-white/80 text-sm md:text-base">
              {category.intro[0]}
            </p>
          </div>
        </div>

        {/* Body copy */}
        <section className="py-12 md:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            {category.intro.slice(1).map((para, i) => (
              <p key={i} className="font-poppins text-neutral-700 leading-relaxed mb-4 text-[15px]">
                {para}
              </p>
            ))}

            {category.specs?.length ? (
              <div className="mt-8">
                <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">
                  What we offer
                </h2>
                <SpecList specs={category.specs} />
              </div>
            ) : null}

            {category.secondary ? (
              <div className="mt-10">
                <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">
                  {category.secondary.heading}
                </h2>
                {category.secondary.intro.map((para, i) => (
                  <p key={i} className="font-poppins text-neutral-700 leading-relaxed mb-4 text-[15px]">
                    {para}
                  </p>
                ))}
                {category.secondary.specs?.length ? (
                  <SpecList specs={category.secondary.specs} />
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* The products in this category */}
        {items.length > 0 && (
          <section className="py-12 md:py-14 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-neutral-900">
                {category.label} we supply
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                      {p.imageSrc.endsWith(".mp4") ? (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs p-2 text-center">
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
                      <p className="font-poppins text-xs text-neutral-500 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs -- native <details> so answers stay in the HTML for crawlers */}
        {category.faqs?.length ? (
          <section className="py-12 md:py-14 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {[...category.faqs, ...(category.secondary?.faqs ?? [])].map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="font-poppins font-medium text-neutral-900 cursor-pointer list-none flex justify-between items-center gap-4">
                      <h3 className="text-base">{faq.q}</h3>
                      <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">
                        +
                      </span>
                    </summary>
                    <p className="font-poppins text-sm text-neutral-600 mt-3 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Reverse cluster link out to the guides */}
        {guides.length > 0 && (
          <section className="py-12 md:py-14 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-4xl">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
                Helpful reading
              </h2>
              <ul className="space-y-4">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="group block rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30"
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
        )}

        {/* Sibling categories -- keeps every landing page one hop from the others */}
        <section className="py-12 md:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
              Explore our other ranges
            </h2>
            <div className="flex flex-wrap gap-3">
              {siblings.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  className="font-poppins text-sm px-4 py-2.5 rounded-full border border-neutral-200 text-neutral-700 transition-all duration-300 hover:border-primary/40 hover:text-primary"
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href="/products"
                className="font-poppins text-sm px-4 py-2.5 rounded-full border border-neutral-200 text-neutral-700 transition-all duration-300 hover:border-primary/40 hover:text-primary"
              >
                All Products
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              Get a free measurement and quote
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              Send us a message on WhatsApp and our team in Doha will talk through the
              options, measure your space and quote — at no cost.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <WhatsAppLink
                source={`category:${category.slug}`}
                message={`Hi, I'd like a quote for ${category.label}.`}
                className="flex items-center space-x-2"
              >
                <ShoppingCart size={16} />
                <span>Ask us on WhatsApp</span>
              </WhatsAppLink>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
