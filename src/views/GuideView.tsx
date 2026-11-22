import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";
import ServiceLinks from "@/components/ServiceLinks";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { categoryLabelFor, findAuthor, findCategory, findGuide, findProduct, findService, getGuides } from "@/data/localized";
import { cardImage, fullImage } from "@/lib/card-image";
import { getDict, HTML_LANG, localePath, type Locale } from "@/i18n";
import {
  absoluteUrl,
  buildBreadcrumb,
  buildFaq,
  buildTitle,
  clampDescription,
  ogLocaleFields,
  orgRef,
  pageAlternates,
  productImageAlt,
} from "@/lib/seo";

export function guideStaticParams() {
  return getGuides("en").map((guide) => ({ slug: guide.slug }));
}

export function guideMetadata(locale: Locale, slug: string): Metadata {
  const guide = findGuide(locale, slug);
  if (!guide) return { title: getDict(locale).common.notFound.guide, robots: { index: false, follow: false } };

  const title = buildTitle(guide.seoTitle ?? guide.title, locale);
  const path = `/guides/${guide.slug}`;

  return {
    title: { absolute: title },
    description: clampDescription(guide.metaDescription),
    alternates: pageAlternates(path, locale),
    openGraph: {
      ...ogLocaleFields(locale),
      type: "article",
      title,
      description: guide.metaDescription,
      url: localePath(locale, path),
      publishedTime: guide.publishedAt,
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

export default function GuideView({ locale, slug }: { locale: Locale; slug: string }) {
  const guide = findGuide(locale, slug);
  if (!guide) notFound();

  const t = getDict(locale);
  const lp = (path: string) => localePath(locale, path);

  // The cluster link: every guide points into the transactional pages.
  // Missing ids are dropped silently, so both lookups are asserted below.
  const related = guide.relatedProductIds
    .map((id) => findProduct(locale, id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (related.length !== guide.relatedProductIds.length) {
    throw new Error(
      `Guide "${guide.slug}" references a product id that no longer exists: ` +
        guide.relatedProductIds.filter((id) => !findProduct(locale, id)).join(", ")
    );
  }

  const relatedCategories = (guide.relatedCategorySlugs ?? [])
    .map((slug) => findCategory(locale, slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (relatedCategories.length !== (guide.relatedCategorySlugs ?? []).length) {
    throw new Error(`Guide "${guide.slug}" references an unknown category slug`);
  }

  const relatedServices = (guide.relatedServiceSlugs ?? []).map((slug) => {
    const service = findService(locale, slug);
    if (!service) throw new Error(`Guide "${guide.slug}" references unknown service slug: ${slug}`);
    return service;
  });

  // One trail for the visible breadcrumb and the BreadcrumbList.
  const crumbs: Crumb[] = [
    [t.common.guides, "/guides"],
    [guide.title, `/guides/${guide.slug}`],
  ];

  // A named person once the owner supplies one (src/data/authors.ts); the company until then.
  const author = guide.authorId ? findAuthor(locale, guide.authorId) : undefined;
  if (guide.authorId && !author) {
    throw new Error(`Guide "${guide.slug}" references unknown author id: ${guide.authorId}`);
  }

  const pageUrl = absoluteUrl(lp(`/guides/${guide.slug}`));
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    ...(locale === "ar" ? { inLanguage: HTML_LANG.ar } : {}),
    headline: guide.title,
    description: guide.metaDescription,
    abstract: guide.answer,
    image: absoluteUrl(guide.heroImage),
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: author
      ? {
          "@type": "Person",
          "@id": `${absoluteUrl(lp("/about"))}#${author.id}`,
          name: author.name,
          jobTitle: author.jobTitle,
          url: `${absoluteUrl(lp("/about"))}#${author.id}`,
          worksFor: orgRef(locale),
        }
      : orgRef(locale),
    publisher: orgRef(locale, { logo: true }),
    mainEntityOfPage: pageUrl,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={articleSchema} />
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      {guide.faqs?.length ? <JsonLd data={buildFaq(guide.faqs, locale)} /> : null}

      <Navbar />
      <main className="flex-grow">
        <article>
          <header className="bg-primary text-white py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <Breadcrumb locale={locale} trail={crumbs} dark currentPhoneOnly />
              <h1 className="h1-band">
                {guide.title}
              </h1>
              <p className="font-poppins text-white/80 text-sm md:text-base">
                {guide.excerpt}
              </p>
              <p className="font-poppins text-white/50 text-xs mt-4">
                {t.guide.updated}{" "}
                <time dateTime={guide.updatedAt}>
                  {new Date(guide.updatedAt).toLocaleDateString(t.guide.dateLocale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>{" "}
                {t.guide.by}{" "}
                {author ? (
                  <Link href={lp(`/about#${author.id}`)} className="underline hover:text-white">
                    {author.name}, {author.jobTitle}
                  </Link>
                ) : (
                  t.brand
                )}
              </p>
            </div>
          </header>

          <div className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <img
                {...fullImage(guide.heroImage, "(min-width:1024px) 768px, 66vw")}
                alt={guide.heroImageAlt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full rounded-xl mb-10 object-cover aspect-[16/9]"
              />

              <div className="guide-answer">
                <p className="guide-answer-label">{t.guide.answer}</p>
                <p className="font-poppins text-neutral-900 leading-relaxed text-[15px]">{guide.answer}</p>
              </div>

              {guide.intro.map((para, i) => (
                <p
                  key={i}
                  className="body-p"
                >
                  {para}
                </p>
              ))}

              <p className="font-poppins text-neutral-500 text-sm leading-relaxed mb-4">
                {t.facts.guideSummary}
              </p>

              {guide.sections.map((section) => (
                <section key={section.heading} className="mt-10">
                  <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">
                    {section.heading}
                  </h2>
                  {section.body.map((para, i) => (
                    <p
                      key={i}
                      className="body-p"
                    >
                      {para}
                    </p>
                  ))}
                  {section.bullets?.length ? (
                    <ul className="font-poppins text-neutral-700 text-[15px] space-y-2 my-4 list-disc ps-5">
                      {section.bullets.map((b) => (
                        <li key={b} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.table ? (
                    <div className="guide-table-wrap">
                      <table className="guide-table">
                        <caption>{section.table.caption}</caption>
                        <thead>
                          <tr>
                            {section.table.head.map((h) => (
                              <th key={h} scope="col">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row[0]}>
                              {row.map((cell, i) =>
                                i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </section>
              ))}

              {guide.faqs?.length ? (
                <section className="mt-12">
                  <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-6 faq-h">
                    {t.common.faqTitle}
                  </h2>
                  <FaqList faqs={guide.faqs} />
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
                {t.guide.browseRange}
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={lp(`/products/${c.slug}`)}
                    className="chip-link"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ServiceLinks locale={locale} services={relatedServices} />

        {/* Cluster link into the money pages */}
        {related.length > 0 && (
          <section className="py-14 md:py-16 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8">
              <h2 className="h2-sec">
                {t.guide.mentioned}
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
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
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
                      <p className="font-poppins text-xs text-neutral-500 mt-1">
                        {categoryLabelFor(locale, p.category)}
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
              {t.guide.ctaTitle}
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              {t.guide.ctaText}
            </p>
            {/* "Ask us on WhatsApp", not the quote label: the plan's one exception to the
                CTA vocabulary, because what a guide offers is advice. */}
            <WhatsAppLink
              source={`guide:${guide.slug}`}
              message={t.guide.adviceMessage(guide.title)}
              className="cta cta-m"
            >
              <WhatsAppIcon />
              {t.common.askOnWhatsApp}
            </WhatsAppLink>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
