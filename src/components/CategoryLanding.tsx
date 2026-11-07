import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import BusinessFacts from "@/components/BusinessFacts";
import FaqList from "@/components/FaqList";
import WhatsAppLink from "@/components/WhatsAppLink";
import HeroQuoteCta from "@/components/HeroQuoteCta";
import ServiceLinks from "@/components/ServiceLinks";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "@/components/icons";
import type { CategorySection } from "@/data/categories";
import { findCategory, findProduct, findService, getCategories, getProducts, guidesForCategoryL } from "@/data/localized";
import { cardImage } from "@/lib/card-image";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import {
  buildBreadcrumb,
  buildCategoryMetadata,
  buildCollectionPage,
  buildFaq,
  productImageAlt,
} from "@/lib/seo";

export function categoryMetadata(locale: Locale, slug: string): Metadata {
  const category = findCategory(locale, slug);
  if (!category) throw new Error(`Unknown category slug: ${slug}`);
  return buildCategoryMetadata(category, locale);
}

/** Specs table and FAQ list, shared by the main body and any secondary section. */
function SpecList({ specs }: { specs: NonNullable<CategorySection["specs"]> }) {
  return (
    <dl className="font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100 max-w-2xl">
      {specs.map((spec) => (
        <div key={spec.label} className="flex justify-between gap-4 py-2.5">
          <dt className="text-neutral-500">{spec.label}</dt>
          <dd className="text-neutral-900 font-medium text-end">{spec.value}</dd>
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
export default function CategoryLanding({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const category = findCategory(locale, slug);
  if (!category) throw new Error(`Unknown category slug: ${slug}`);

  const t = getDict(locale);
  const lp = (path: string) => localePath(locale, path);
  const items = getProducts(locale).filter((p) => p.category === category.key);
  const guides = guidesForCategoryL(locale, category.slug);
  const siblings = getCategories(locale).filter((c) => c.slug !== category.slug);
  const relatedServices = (category.relatedServiceSlugs ?? []).map((s) => {
    const service = findService(locale, s);
    if (!service) throw new Error(`Category "${category.slug}" references unknown service slug: ${s}`);
    return service;
  });
  const priceGuide = (category.priceGuideProductIds ?? []).map((id) => {
    const product = findProduct(locale, id);
    if (!product?.priceFrom) throw new Error(`Category "${category.slug}" price guide needs a priced product: ${id}`);
    return { id, name: product.name, price: formatFromPrice(product.priceFrom, product.priceUnit, locale) };
  });
  const path = `/products/${category.slug}`;
  const fromPrice = category.priceFrom ? formatFromPrice(category.priceFrom, category.priceUnit, locale) : undefined;

  // FAQs from the main body and any folded-in secondary section are emitted as
  // one FAQPage, matching what a reader sees on the page.
  const allFaqs = [...(category.faqs ?? []), ...(category.secondary?.faqs ?? [])];

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd
        data={buildCollectionPage(
          {
            name: category.heading,
            description: category.metaDescription,
            path,
            items: items.map((p) => ({ name: p.name, path: `/products/${p.id}` })),
          },
          locale
        )}
      />
      <JsonLd
        data={buildBreadcrumb(
          [
            [t.common.products, "/products"],
            [category.label, path],
          ],
          locale
        )}
      />
      {allFaqs.length > 0 && <JsonLd data={buildFaq(allFaqs, locale)} />}

      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <nav aria-label={t.common.breadcrumb} className="mb-5">
              <ol className="flex flex-wrap items-center gap-2 font-poppins text-sm text-white/70">
                <li><Link href={lp("/")} className="hover:text-white">{t.common.home}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={lp("/products")} className="hover:text-white">{t.common.products}</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white">{category.label}</li>
              </ol>
            </nav>
            <h1 className="h1-band">
              {category.heading}
            </h1>
            <p className="font-poppins max-w-2xl text-white font-medium text-sm md:text-base mb-2">
              {t.facts.categorySummary(category.label, fromPrice)}
            </p>
            <p className="font-poppins max-w-2xl text-white/80 text-sm md:text-base">
              {category.intro[0]}
            </p>
            <HeroQuoteCta
              locale={locale}
              source={`category:${category.slug}:hero`}
              message={t.common.quoteMessage(category.label)}
              price={fromPrice}
            />
          </div>
        </div>

        {/* Body copy */}
        <section className="py-12 md:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            {category.intro.slice(1).map((para, i) => (
              <p key={i} className="body-p">
                {para}
              </p>
            ))}

            {category.specs?.length ? (
              <div className="mt-8">
                <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">
                  {t.category.whatWeOffer}
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
                  <p key={i} className="body-p">
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
              <h2 className="h2-sec">
                {t.category.weSupply(category.label)}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((p) => (
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

        {priceGuide.length > 0 && (
          <section className="py-12 md:py-14 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <h2 className="h2-sec6">{t.category.priceGuide}</h2>
              <table className="w-full font-poppins text-sm border-y border-neutral-100">
                <thead>
                  <tr className="text-neutral-500 text-start border-b border-neutral-100">
                    <th scope="col" className="py-2.5 font-medium text-start">{t.category.priceGuideProduct}</th>
                    <th scope="col" className="py-2.5 font-medium text-end">{t.category.priceGuidePrice}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {priceGuide.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2.5">
                        <Link href={lp(`/products/${row.id}`)} className="font-medium text-primary hover:underline">{row.name}</Link>
                      </td>
                      <td className="py-2.5 text-end text-neutral-900 font-medium">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FAQs -- native <details> so answers stay in the HTML for crawlers */}
        {category.faqs?.length ? (
          <section className="py-12 md:py-14 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <h2 className="h2-sec6">
                {t.common.faqTitle}
              </h2>
              <FaqList faqs={[...category.faqs, ...(category.secondary?.faqs ?? [])]} />
            </div>
          </section>
        ) : null}

        {/* Reverse cluster link out to the guides */}
        {guides.length > 0 && (
          <section className="py-12 md:py-14 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-4xl">
              <h2 className="h2-sec6">
                {t.common.helpfulReading}
              </h2>
              <ul className="space-y-4">
                {guides.map((guide) => (
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
            </div>
          </section>
        )}

        <ServiceLinks locale={locale} services={relatedServices} />

        {/* Sibling categories -- keeps every landing page one hop from the others */}
        <section className="py-12 md:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <h2 className="h2-sec6">
              {t.category.exploreOther}
            </h2>
            <div className="flex flex-wrap gap-3">
              {siblings.map((c) => (
                <Link
                  key={c.slug}
                  href={lp(`/products/${c.slug}`)}
                  className="chip-link"
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href={lp("/products")}
                className="chip-link"
              >
                {t.common.allProducts}
              </Link>
            </div>
          </div>
        </section>

        <BusinessFacts locale={locale} title={t.facts.whereTitle(category.label)} />

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              {t.category.ctaTitle}
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              {t.category.ctaText}
            </p>
            <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 text-white">
              <WhatsAppLink
                source={`category:${category.slug}`}
                message={t.common.quoteMessage(category.label)}
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                <span>{t.common.askOnWhatsApp}</span>
              </WhatsAppLink>
            </Button>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
