import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import BusinessFacts from "@/components/BusinessFacts";
import FaqList from "@/components/FaqList";
import ProductMedia from "@/components/ProductMedia";
import RelatedProducts from "@/components/RelatedProducts";
import RelatedGuides from "@/components/RelatedGuides";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShoppingCart } from "@/components/icons";
import { categoryLabelFor, findProduct, getProducts } from "@/data/localized";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import {
  absoluteUrl,
  buildBreadcrumb,
  buildFaq,
  buildProductJsonLd,
  clampDescription,
  ogLocaleFields,
  pageAlternates,
  productDescription,
  productImage,
  productImageAlt,
  productTitle,
} from "@/lib/seo";

export function productStaticParams() {
  return getProducts("en").map((product) => ({ productId: product.id }));
}

export function productMetadata(locale: Locale, productId: string): Metadata {
  const product = findProduct(locale, productId);
  if (!product) return { title: getDict(locale).common.notFound.product, robots: { index: false, follow: false } };

  const title = productTitle(product, locale);
  const description = productDescription(product, locale);
  const path = `/products/${product.id}`;

  return {
    // absolute: productTitle already accounts for the brand suffix, so the root
    // layout template must not append it again.
    title: { absolute: title },
    description: clampDescription(description),
    alternates: pageAlternates(path, locale),
    openGraph: {
      ...ogLocaleFields(locale),
      type: "website",
      title,
      description,
      url: localePath(locale, path),
      images: [{ url: absoluteUrl(productImage(product)), alt: productImageAlt(product, locale) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(productImage(product))],
    },
  };
}

export default function ProductDetailView({ locale, productId }: { locale: Locale; productId: string }) {
  const product = findProduct(locale, productId);
  if (!product) notFound();

  const t = getDict(locale);
  const lp = (path: string) => localePath(locale, path);
  const label = categoryLabelFor(locale, product.category);
  const fromPrice =
    typeof product.priceFrom === "number" ? formatFromPrice(product.priceFrom, product.priceUnit, locale) : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildProductJsonLd(product, locale)} />
      <JsonLd
        data={buildBreadcrumb(
          [
            [t.common.products, "/products"],
            [product.name, `/products/${product.id}`],
          ],
          locale
        )}
      />
      {product.faqs?.length ? <JsonLd data={buildFaq(product.faqs, locale)} /> : null}

      <Navbar />
      <main className="flex-grow">
        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            {/* Breadcrumb: real anchors, not a JS-only back button */}
            <nav aria-label={t.common.breadcrumb} className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 font-poppins text-sm text-neutral-500">
                <li><Link href={lp("/")} className="hover:text-primary">{t.common.home}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={lp("/products")} className="hover:text-primary">{t.common.products}</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-neutral-800 font-medium">{product.name}</li>
              </ol>
            </nav>

            <div className="mb-6">
              <Button asChild variant="ghost" className="flex items-center gap-2 w-fit">
                <Link href={lp("/products")}>
                  <ArrowLeft size={16} className="rtl:-scale-x-100" />
                  {t.productDetail.back}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
              <ProductMedia product={product} alt={productImageAlt(product, locale)} />

              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <p className="font-poppins text-sm text-primary/70 mb-2">{label}</p>
                    <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                      {product.name}
                    </h1>
                    <p className="font-poppins font-medium text-lg text-primary">
                      {fromPrice ?? product.price}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">{t.productDetail.description}</h2>
                    <p className="font-poppins font-medium text-neutral-800 mb-3">
                      {t.facts.productSummary(product.name, fromPrice)}
                    </p>
                    <p className="font-poppins text-muted-foreground">{product.description}</p>
                    {product.longDescription?.map((para, i) => (
                      <p key={i} className="font-poppins text-muted-foreground mt-3">
                        {para}
                      </p>
                    ))}
                  </div>

                  {product.specs?.length ? (
                    <div className="mb-8">
                      <h2 className="font-playfair text-xl font-semibold mb-3">{t.common.specifications}</h2>
                      <dl className="font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100">
                        {product.specs.map((spec) => (
                          <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                            <dt className="text-neutral-500">{spec.label}</dt>
                            <dd className="text-neutral-900 font-medium text-end">
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}

                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">
                      {t.productDetail.included}
                    </h2>
                    <ul className="font-poppins space-y-2">
                      {t.productDetail.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check size={16} className="text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-primary hover:bg-accent text-white flex items-center justify-center gap-2"
                  >
                    <WhatsAppLink
                      href={product.whatsappLink}
                      source={`product_detail:${product.id}`}
                    >
                      <ShoppingCart size={18} />
                      <span>{t.productCard.inquire}</span>
                    </WhatsAppLink>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs. Native <details> rather than a JS accordion: the answers stay in
            the DOM for crawlers and AI Overview extraction with zero JS. */}
        {product.faqs?.length ? (
          <section className="py-14 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <h2 className="h2-sec">
                {t.common.faqTitle}
              </h2>
              <FaqList faqs={product.faqs} />
            </div>
          </section>
        ) : null}

        <RelatedGuides locale={locale} productId={product.id} />

        <RelatedProducts locale={locale} currentId={product.id} category={product.category} />

        <BusinessFacts locale={locale} title={t.facts.whereTitle(product.name)} />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              {t.productDetail.needHelp}
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8">
              {t.productDetail.needHelpText}
            </p>
            <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 text-white">
              <WhatsAppLink
                source={`product_detail_bottom:${product.id}`}
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} />
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
