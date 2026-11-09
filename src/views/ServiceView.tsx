import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import BarIntent from "@/components/BarIntent";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import BusinessFacts from "@/components/BusinessFacts";
import FaqList from "@/components/FaqList";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import HeroQuoteCta from "@/components/HeroQuoteCta";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { Check } from "@/components/icons";
import { findCategory, findProduct, findService, getServices, guidesForServiceL } from "@/data/localized";
import { cardImage, fullImage } from "@/lib/card-image";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import {
  buildBreadcrumb,
  buildFaq,
  buildServiceJsonLd,
  absoluteUrl,
  buildTitle,
  clampDescription,
  defaultOgImages,
  ogLocaleFields,
  pageAlternates,
  productImageAlt,
} from "@/lib/seo";

export function serviceStaticParams() {
  return getServices("en").map((service) => ({ slug: service.slug }));
}

export function serviceMetadata(locale: Locale, slug: string): Metadata {
  const service = findService(locale, slug);
  if (!service) return { title: getDict(locale).common.notFound.service, robots: { index: false, follow: false } };

  const title = buildTitle(service.seoTitle, locale);
  const path = `/services/${service.slug}`;

  // Real project photo when we have one; brand logo otherwise. Never a
  // borrowed image -- see the note at the top of src/data/services.ts.
  const images = service.heroImage
    ? [{ url: absoluteUrl(service.heroImage), alt: service.heroImageAlt ?? service.heading }]
    : defaultOgImages(locale);

  return {
    title: { absolute: title },
    description: clampDescription(service.metaDescription),
    alternates: pageAlternates(path, locale),
    openGraph: {
      ...ogLocaleFields(locale),
      type: "website",
      title,
      description: service.metaDescription,
      url: localePath(locale, path),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.metaDescription,
      images: images.map((i) => i.url),
    },
  };
}

export default function ServiceView({ locale, slug }: { locale: Locale; slug: string }) {
  const service = findService(locale, slug);
  if (!service) notFound();

  const t = getDict(locale);
  const lp = (path: string) => localePath(locale, path);

  const related = service.relatedProductIds.map((id) => {
    const p = findProduct(locale, id);
    if (!p) throw new Error(`Service "${service.slug}" references unknown product id: ${id}`);
    return p;
  });

  const relatedCategories = service.relatedCategorySlugs.map((s) => {
    const c = findCategory(locale, s);
    if (!c) throw new Error(`Service "${service.slug}" references unknown category slug: ${s}`);
    return c;
  });

  const relatedServices = (service.relatedServiceSlugs ?? []).map((s) => {
    const other = findService(locale, s);
    if (!other) throw new Error(`Service "${service.slug}" references unknown service slug: ${s}`);
    if (other.slug === service.slug) throw new Error(`Service "${service.slug}" links to itself`);
    return other;
  });

  const relatedGuides = guidesForServiceL(locale, service.slug);

  // A folded-in sub-topic contributes its questions to the same FAQPage rather
  // than to a second one -- same handling as Category.secondary.
  const allFaqs = [...service.faqs, ...(service.secondary?.faqs ?? [])];
  const price = service.priceFrom ? formatFromPrice(service.priceFrom, service.priceUnit, locale) : null;
  // One trail for the visible breadcrumb and the BreadcrumbList.
  const crumbs: Crumb[] = [
    [t.common.services, "/services"],
    [service.label, `/services/${service.slug}`],
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildServiceJsonLd(service, locale)} />
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      {allFaqs.length > 0 && <JsonLd data={buildFaq(allFaqs, locale)} />}

      <BarIntent name={service.label} type="service" slug={service.slug} />
      <Navbar />
      {/* Below md, main is a column whose order puts the project photos, where a service
          has them, straight under the band and its hero photo, ahead of the intro. Only the
          order on screen changes: the HTML, its headings and its links keep their order
          (check-internal-links and the SEO snapshot read it), and the photos hold no control. */}
      <main className="flex-grow max-md:flex max-md:flex-col">
        {/* Text band. A hero photo follows it when the service has one; the
            services without photography stay text-only rather than borrowing. */}
        <div className="bg-primary text-white py-12 md:py-16 max-md:order-first">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <Breadcrumb locale={locale} trail={crumbs} dark />
            <h1 className="h1-band">
              {service.heading}
            </h1>
            <p className="font-poppins max-w-2xl text-white font-medium text-sm md:text-base mb-2">
              {price ? t.service.pricedSummary(service.label, price) : t.facts.serviceSummary(service.label)}
            </p>
            <p className="font-poppins max-w-2xl text-white/80 text-sm md:text-base">
              {service.excerpt}
            </p>
            {/* Without a price, what the free quote takes (S17), just above the button. */}
            {!price && <p className="no-price">{t.price.noPrice[service.quoteKind ?? "measure"]}</p>}
            <HeroQuoteCta locale={locale} source={`service:${service.slug}:hero`} message={t.common.quoteMessage(service.label)} />
          </div>
        </div>

        {service.heroImage && (
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-4xl -mt-8 md:-mt-10 relative max-md:order-first">
            <img
              {...fullImage(service.heroImage, "(min-width:1024px) 896px, 66vw")}
              alt={service.heroImageAlt ?? service.heading}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full rounded-xl shadow-lg object-cover aspect-[16/10]"
            />
          </div>
        )}

        <section className="py-12 md:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            {service.intro.map((para, i) => (
              <p key={i} className="body-p">
                {para}
              </p>
            ))}

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
              {t.service.whatWeDo}
            </h2>
            <ul className="font-poppins text-neutral-700 text-[15px] space-y-2 list-disc ps-5">
              {service.offers.map((o) => <li key={o} className="leading-relaxed">{o}</li>)}
            </ul>

            {/* Includes and Specifications fold on phones, each heading its toggle (.fold in
                index.css); open from md, where the heading shows as before. */}
            <details className="fold max-md:mt-8">
              <summary>
                <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
                  {t.service.workIncludes}
                </h2>
              </summary>
            </details>
            <ul className="fold-body font-poppins text-neutral-700 text-[15px] space-y-2">
              {service.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 leading-relaxed">
                  <Check size={16} className="text-primary flex-shrink-0 mt-1" />
                  {inc}
                </li>
              ))}
            </ul>

            <details className="fold max-md:mt-8">
              <summary>
                <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
                  {t.common.specifications}
                </h2>
              </summary>
            </details>
            <dl className="fold-body font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100">
              {service.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-neutral-500">{spec.label}</dt>
                  <dd className="text-neutral-900 font-medium text-end">{spec.value}</dd>
                </div>
              ))}
            </dl>

            {service.secondary && (
              <>
                <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
                  {service.secondary.heading}
                </h2>
                {service.secondary.intro.map((para, i) => (
                  <p key={i} className="body-p">
                    {para}
                  </p>
                ))}
                {service.secondary.specs?.length ? (
                  <dl className="font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100 mt-6">
                    {service.secondary.specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                        <dt className="text-neutral-500">{spec.label}</dt>
                        <dd className="text-neutral-900 font-medium text-end">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </>
            )}

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
              {t.service.howItWorks}
            </h2>
            <ol className="font-poppins text-neutral-700 text-[15px] space-y-4 list-decimal ps-5">
              {service.steps.map((step) => (
                <li key={step.title} className="leading-relaxed">
                  <span className="font-medium text-neutral-900">{step.title}.</span>{" "}
                  {step.body}
                </li>
              ))}
            </ol>

            <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-6 faq-h">
              {t.common.faqTitle}
            </h2>
            <FaqList faqs={allFaqs} />
          </div>
        </section>

        {/* Our work -- real project photos for this service. */}
        {service.gallery?.length ? (
          <section className="py-12 md:py-14 bg-neutral-50 max-md:order-first">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8">
              <h2 className="h2-sec">
                {t.service.projects(service.label)}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {service.gallery.map((img) => (
                  <figure key={img.src} className="overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      {...cardImage(img.src, "(min-width:1024px) 25vw, 33vw")}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover aspect-[4/3] transition-transform duration-500 hover:scale-105"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Related products. Each image belongs to the product it depicts. */}
        {related.length > 0 && (
          <section className="py-12 md:py-14 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8">
              <h2 className="h2-sec">
                {t.service.relatedWork}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={lp(`/products/${p.id}`)}
                    className="group rel-card"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                      {p.imageSrc.endsWith(".mp4") ? (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs p-2 text-center">
                          {p.name}
                        </div>
                      ) : (
                        <img
                          {...cardImage(p.imageSrc, "(min-width:1024px) 25vw, 33vw")}
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
                    </div>
                  </Link>
                ))}
              </div>

              {relatedCategories.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {relatedCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={lp(`/products/${c.slug}`)}
                      className="chip-link bg-white"
                    >
                      {t.service.browse(c.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Cluster links: guides that cover this service, and the sibling
            service pages a visitor is most likely to need next. */}
        {(relatedGuides.length > 0 || relatedServices.length > 0) && (
          <section className="py-12 md:py-14 bg-white border-t border-neutral-100">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              {relatedGuides.length > 0 && (
                <>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6">
                    {t.common.helpfulReading}
                  </h2>
                  <ul className="space-y-4">
                    {relatedGuides.map((guide) => (
                      <li key={guide.slug}>
                        <Link
                          href={lp(`/guides/${guide.slug}`)}
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
                </>
              )}

              {relatedServices.length > 0 && (
                <>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-900 mt-10 mb-4">
                    {t.service.relatedServices}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {relatedServices.map((other) => (
                      <Link
                        key={other.slug}
                        href={lp(`/services/${other.slug}`)}
                        className="chip-link bg-white"
                      >
                        {other.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        <BusinessFacts locale={locale} title={t.facts.whereTitle(service.label)} />

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              {t.service.ctaTitle}
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              {t.service.ctaText}
            </p>
            <WhatsAppLink
              source={`service:${service.slug}`}
              message={t.common.quoteMessage(service.label)}
              className="cta cta-m"
            >
              <WhatsAppIcon />
              {t.common.heroQuote}
            </WhatsAppLink>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
