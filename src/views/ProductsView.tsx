import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/ProductsGrid";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Phone } from "@/components/icons";
import { getCategories, getProducts } from "@/data/localized";
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
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([[t.common.products, "/products"]], locale)} />
      <JsonLd
        data={buildItemList(
          products.map((p) => ({ name: p.name, path: productPath(p) })),
          locale
        )}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Header */}
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
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
              {getCategories(locale).map((c) => (
                <Link
                  key={c.slug}
                  href={localePath(locale, `/products/${c.slug}`)}
                  className="group block rounded-xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={c.heroImage}
                      alt={c.heroImageAlt}
                      loading="lazy"
                      decoding="async"
                      className="rel-img"
                    />
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

        {/* Prices in plain text: pricing questions are a large share of what people
            ask AI tools about flooring in Qatar. */}
        <section className="py-10 md:py-12 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl font-poppins text-neutral-700 leading-relaxed text-[15px]">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">{page.pricingTitle}</h2>
            <p className="mb-4">{page.pricingText}</p>
            <ul className="list-disc ps-5 space-y-1">
              {getCategories(locale).filter((c) => c.priceFrom).map((c) => (
                <li key={c.slug}>
                  {c.label}: {formatFromPrice(c.priceFrom!, c.priceUnit, locale)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4">
            <ProductsGrid products={products} />
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
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <WhatsAppLink source="products_page" className="flex items-center gap-2">
                <Phone size={16} />
                <span>{t.common.contactOnWhatsApp}</span>
              </WhatsAppLink>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
