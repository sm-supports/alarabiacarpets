import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { services, getService } from "@/data/services";
import { products } from "@/data/products";
import { getCategory } from "@/data/categories";
import {
  buildBreadcrumb,
  buildFaq,
  buildServiceJsonLd,
  buildTitle,
  clampDescription,
  DEFAULT_OG_IMAGES,
  productImageAlt,
} from "@/lib/seo";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service Not Found", robots: { index: false, follow: false } };

  const title = buildTitle(service.seoTitle);
  const path = `/services/${service.slug}`;

  // No openGraph.images: there is no photography for these services, so the
  // root layout's brand logo is the honest fallback.
  return {
    title: { absolute: title },
    description: clampDescription(service.metaDescription),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description: service.metaDescription,
      url: path,
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.metaDescription,
      images: DEFAULT_OG_IMAGES.map((i) => i.url),
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedProductIds.map((id) => {
    const p = products.find((x) => x.id === id);
    if (!p) throw new Error(`Service "${service.slug}" references unknown product id: ${id}`);
    return p;
  });

  const relatedCategories = service.relatedCategorySlugs.map((s) => {
    const c = getCategory(s);
    if (!c) throw new Error(`Service "${service.slug}" references unknown category slug: ${s}`);
    return c;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildServiceJsonLd(service)} />
      <JsonLd
        data={buildBreadcrumb([
          ["Services", "/services"],
          [service.label, `/services/${service.slug}`],
        ])}
      />
      {service.faqs.length > 0 && <JsonLd data={buildFaq(service.faqs)} />}

      <Navbar />
      <main className="flex-grow">
        {/* Text hero -- no image, deliberately. See src/data/services.ts. */}
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-2 font-poppins text-sm text-white/70">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/services" className="hover:text-white">Services</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white">{service.label}</li>
              </ol>
            </nav>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {service.heading}
            </h1>
            <p className="font-poppins max-w-2xl text-white/80 text-sm md:text-base">
              {service.excerpt}
            </p>
          </div>
        </div>

        <section className="py-12 md:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            {service.intro.map((para, i) => (
              <p key={i} className="font-poppins text-neutral-700 leading-relaxed mb-4 text-[15px]">
                {para}
              </p>
            ))}

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
              What we do
            </h2>
            <ul className="font-poppins text-neutral-700 text-[15px] space-y-2 list-disc pl-5">
              {service.offers.map((o) => <li key={o} className="leading-relaxed">{o}</li>)}
            </ul>

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
              What the price includes
            </h2>
            <ul className="font-poppins text-neutral-700 text-[15px] space-y-2">
              {service.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 leading-relaxed">
                  <Check size={16} className="text-primary flex-shrink-0 mt-1" />
                  {inc}
                </li>
              ))}
            </ul>

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
              Specifications
            </h2>
            <dl className="font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100">
              {service.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-neutral-500">{spec.label}</dt>
                  <dd className="text-neutral-900 font-medium text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
              How it works
            </h2>
            <ol className="font-poppins text-neutral-700 text-[15px] space-y-4 list-decimal pl-5">
              {service.steps.map((step) => (
                <li key={step.title} className="leading-relaxed">
                  <span className="font-medium text-neutral-900">{step.title}.</span>{" "}
                  {step.body}
                </li>
              ))}
            </ol>

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {service.faqs.map((faq) => (
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

        {/* Related work. This is the only place imagery enters a service page,
            and every image belongs to the product it actually depicts. */}
        {related.length > 0 && (
          <section className="py-12 md:py-14 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-neutral-900">
                Related work
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
                    </div>
                  </Link>
                ))}
              </div>

              {relatedCategories.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {relatedCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products/${c.slug}`}
                      className="font-poppins text-sm px-4 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-700 transition-all duration-300 hover:border-primary/40 hover:text-primary"
                    >
                      Browse {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              Get a free survey and quote
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              Message us on WhatsApp and our team in Doha will visit, measure and quote at
              no cost.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <WhatsAppLink
                source={`service:${service.slug}`}
                message={`Hi, I'd like a quote for ${service.label}.`}
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
