import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { guides, getGuide } from "@/data/guides";
import { products } from "@/data/products";
import { getCategory } from "@/data/categories";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  buildBreadcrumb,
  buildFaq,
  buildTitle,
  categoryLabel,
  clampDescription,
  productImageAlt,
} from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide Not Found", robots: { index: false, follow: false } };

  const title = buildTitle(guide.seoTitle ?? guide.title);
  const path = `/guides/${guide.slug}`;

  return {
    title: { absolute: title },
    description: clampDescription(guide.metaDescription),
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title,
      description: guide.metaDescription,
      url: path,
      publishedTime: guide.updatedAt,
      modifiedTime: guide.updatedAt,
      images: [{ url: absoluteUrl(guide.heroImage), alt: guide.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: guide.metaDescription,
      images: [absoluteUrl(guide.heroImage)],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  // The cluster link: every guide points into the transactional pages.
  // Missing ids are dropped silently, so both lookups are asserted below.
  const related = guide.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (related.length !== guide.relatedProductIds.length) {
    throw new Error(
      `Guide "${guide.slug}" references a product id that no longer exists: ` +
        guide.relatedProductIds.filter((id) => !products.some((p) => p.id === id)).join(", ")
    );
  }

  const relatedCategories = (guide.relatedCategorySlugs ?? [])
    .map((slug) => getCategory(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (relatedCategories.length !== (guide.relatedCategorySlugs ?? []).length) {
    throw new Error(`Guide "${guide.slug}" references an unknown category slug`);
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    image: absoluteUrl(guide.heroImage),
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={articleSchema} />
      <JsonLd
        data={buildBreadcrumb([
          ["Guides", "/guides"],
          [guide.title, `/guides/${guide.slug}`],
        ])}
      />
      {guide.faqs?.length ? <JsonLd data={buildFaq(guide.faqs)} /> : null}

      <Navbar />
      <main className="flex-grow">
        <article>
          <header className="bg-primary text-white py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex flex-wrap items-center gap-2 font-poppins text-sm text-white/70">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
                </ol>
              </nav>
              <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {guide.title}
              </h1>
              <p className="font-poppins text-white/80 text-sm md:text-base">
                {guide.excerpt}
              </p>
              <p className="font-poppins text-white/50 text-xs mt-4">
                Updated{" "}
                <time dateTime={guide.updatedAt}>
                  {new Date(guide.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>{" "}
                by {SITE_NAME}
              </p>
            </div>
          </header>

          <div className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <img
                src={guide.heroImage}
                alt={guide.heroImageAlt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full rounded-xl mb-10 object-cover aspect-[16/9]"
              />

              {guide.intro.map((para, i) => (
                <p
                  key={i}
                  className="font-poppins text-neutral-700 leading-relaxed mb-4 text-[15px]"
                >
                  {para}
                </p>
              ))}

              {guide.sections.map((section) => (
                <section key={section.heading} className="mt-10">
                  <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">
                    {section.heading}
                  </h2>
                  {section.body.map((para, i) => (
                    <p
                      key={i}
                      className="font-poppins text-neutral-700 leading-relaxed mb-4 text-[15px]"
                    >
                      {para}
                    </p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className="font-poppins text-neutral-700 text-[15px] space-y-2 my-4 list-disc pl-5">
                      {section.bullets.map((b) => (
                        <li key={b} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              {guide.faqs?.length ? (
                <section className="mt-12">
                  <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                    {guide.faqs.map((faq) => (
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
                </section>
              ) : null}
            </div>
          </div>
        </article>

        {/* Cluster link up to the category landing pages */}
        {relatedCategories.length > 0 && (
          <section className="py-10 md:py-12 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <h2 className="font-playfair text-2xl font-bold mb-5 text-neutral-900">
                Browse the full range
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products/${c.slug}`}
                    className="font-poppins text-sm px-4 py-2.5 rounded-full border border-neutral-200 text-neutral-700 transition-all duration-300 hover:border-primary/40 hover:text-primary"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cluster link into the money pages */}
        {related.length > 0 && (
          <section className="py-14 md:py-16 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-neutral-900">
                Products mentioned in this guide
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
            </div>
          </section>
        )}

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              Want advice for your own space?
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              Send us a message on WhatsApp and our team in Doha will talk through the
              options with you. Measurement and quotation are free.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <WhatsAppLink
                source={`guide:${guide.slug}`}
                message={`Hi, I read your guide "${guide.title}" and would like some advice.`}
                className="flex items-center space-x-2"
              >
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
