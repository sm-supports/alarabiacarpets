import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/ProductsGrid";
import JsonLd from "@/components/JsonLd";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { getCategories, getProducts } from "@/data/localized";
import { cardImagePath } from "@/lib/card-image";
import Link from "next/link";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import {
  buildBreadcrumb,
  buildItemList,
  clampDescription,
  defaultOgImages,
  ogLocaleFields,
  pageAlternates,
  productPath,
} from "@/lib/seo";
import WhatsAppLink from "@/components/WhatsAppLink";

export function productsMetadata(locale: Locale): Metadata {
  const { title, description } = getDict(locale).pages.products;
  return {
    title,
    description: clampDescription(description),
    alternates: pageAlternates("/products", locale),
    openGraph: {
      ...ogLocaleFields(locale),
      title,
      description,
      url: localePath(locale, "/products"),
      images: defaultOgImages(locale),
    },
  };
}

export default function ProductsView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.products;
  const products = getProducts(locale);
  const crumbs: Crumb[] = [[t.common.products, "/products"]];
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      <JsonLd
        data={buildItemList(
          products.map((p) => ({ name: p.name, path: productPath(p) })),
          locale
        )}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Header */}
        {/* Start-aligned under its breadcrumb on phones, like every interior band;
            centred at md and up, as before. */}
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 md:text-center">
            <Breadcrumb locale={locale} trail={crumbs} dark phoneOnly />
            <h1 className="h1-band">
              {page.heading}
            </h1>
            <p className="hero-p">
              {page.intro}
            </p>
          </div>
        </div>

        {/* Shop by category -- makes /products a hub that links down to the
            landing pages rather than a competitor for the same queries. */}
        <section className="py-10 md:py-12 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <h2 className="h2-sec6">
              {page.byCategory}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {getCategories(locale).map((c, index) => (
                <Link
                  key={c.slug}
                  href={localePath(locale, `/products/${c.slug}`)}
                  className="group cat-card"
                >
                  <div className="cat-media">
                    <img
                      src={cardImagePath(c.heroImage)}
                      alt={c.heroImageAlt}
                      // Only the first row on a phone is above the fold. No fetchPriority:
                      // React turns each high-priority image into a preload link that
                      // competes with the CSS and fonts, and the h1 is the likelier LCP.
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="rel-img"
                    />
                    {/* Real text, not part of the photo: pricing questions are a large
                        share of what people ask AI tools about flooring in Qatar. */}
                    {c.priceFrom && (
                      <span className="cat-price">
                        {formatFromPrice(c.priceFrom, c.priceUnit, locale)}
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="cat-title">
                      {c.label}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <ProductsGrid products={products} locale={locale} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              {page.ctaTitle}
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              {page.ctaText}
            </p>
            <WhatsAppLink source="products_page" className="cta cta-m">
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
