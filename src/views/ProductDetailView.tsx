import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import Navbar from "@/components/Navbar";
import BarIntent from "@/components/BarIntent";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import BusinessFacts from "@/components/BusinessFacts";
import FaqList from "@/components/FaqList";
import FoldHead from "@/components/FoldHead";
import ProductMedia from "@/components/ProductMedia";
import type { GallerySlide } from "@/components/ProductGallery";
import RelatedProducts from "@/components/RelatedProducts";
import RelatedGuides from "@/components/RelatedGuides";
import ServiceLinks from "@/components/ServiceLinks";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "@/components/icons";
import { categoryLabelFor, findProduct, getProducts, servicesForProductL } from "@/data/localized";
import { cardImagePath, fullImage, fullImagePath } from "@/lib/card-image";
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

  // A product that leads with a video shows its image as the poster. A <video poster>
  // isn't preloaded the way an eager <img> is, and it is the LCP element.
  const videoSrc = product.media?.[0]?.type === "video" ? product.media[0].src : undefined;
  const poster = fullImagePath(product.imageSrc);
  if (videoSrc) preload(poster, { as: "image", fetchPriority: "high" });

  // The phone gallery's slides after the hero: the product's other photos and videos.
  // A video hero's poster is the product's own photo, so that photo isn't repeated. The
  // photos are the cards' 4:3 copies, one URL each: the phone box is 4:3 too (.pd-media),
  // and only hero images have uncropped copies. Compared by copy, not by file name: two
  // files with the same picture share one copy (image-manifest.json), and would show twice.
  const heroCopy = cardImagePath(product.imageSrc);
  const slides: GallerySlide[] = [
    ...new Map(
      product.media
        .slice(1)
        .map((item) => ({ type: item.type, src: item.type === "video" ? item.src : cardImagePath(item.src) }))
        .filter((slide) => !(slide.type === "image" && slide.src === heroCopy))
        .map((slide) => [slide.src, slide] as const)
    ).values(),
  ];

  const t = getDict(locale);
  const lp = (path: string) => localePath(locale, path);
  const label = categoryLabelFor(locale, product.category);
  const fromPrice =
    typeof product.priceFrom === "number" ? formatFromPrice(product.priceFrom, product.priceUnit, locale) : undefined;
  // One trail for the visible breadcrumb and the BreadcrumbList, so the two can't disagree.
  const crumbs: Crumb[] = [
    [t.common.products, "/products"],
    [product.name, `/products/${product.id}`],
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildProductJsonLd(product, locale)} />
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      {product.faqs?.length ? <JsonLd data={buildFaq(product.faqs, locale)} /> : null}

      <BarIntent name={product.name} type="product" slug={product.id} />
      <Navbar />
      <main className="flex-grow">
        <section className="py-10 md:py-14 bg-neutral-50">
          {/* On a phone the card runs edge to edge (.pd-card): the first screen is the
              trail, the photos, the name and the price. */}
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            {/* Breadcrumb: real anchors, not a JS-only back button */}
            <Breadcrumb locale={locale} trail={crumbs} className="mb-6" />

            {/* On phones the trail's Products link does this job. */}
            <div className="mb-6 max-md:hidden">
              <Button asChild variant="ghost" className="flex items-center gap-2 w-fit">
                <Link href={lp("/products")}>
                  <ArrowLeft size={16} className="rtl:-scale-x-100" />
                  {t.productDetail.back}
                </Link>
              </Button>
            </div>

            <div className="pd-card">
              <ProductMedia
                alt={productImageAlt(product, locale)}
                {...(videoSrc ? { src: poster } : fullImage(product.imageSrc, "(min-width:1024px) 50vw, 66vw"))}
                videoSrc={videoSrc}
                slides={slides}
                poster={slides.some((slide) => slide.type === "video") ? poster : undefined}
              />

              <div className="pd-body">
                <div>
                  <div className="mb-6">
                    <p className="font-poppins text-sm text-primary/70 mb-2">{label}</p>
                    <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                      {product.name}
                    </h1>
                    {/* Without a price, what the free quote takes (S17), never a dead end. */}
                    <p className="font-poppins font-medium text-lg text-primary">
                      {fromPrice ?? t.price.noPrice[product.quoteKind ?? "measure"]}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">{t.productDetail.description}</h2>
                    <p className="font-poppins font-medium text-neutral-800 mb-3">
                      {t.facts.productSummary(product.name, fromPrice)}
                    </p>
                    <p className="font-poppins text-muted-foreground">{product.description}</p>
                    {/* Folded on phones (.fold in index.css): the toggle is a <details> of its
                        own and the text follows it, so the text is in the HTML and shows at
                        md and up in every browser, with no script. The toggle goes at md. */}
                    {product.longDescription?.length ? (
                      <>
                        <details className="fold md:hidden">
                          <summary className="fold-l">{t.service.viewDetails(product.name)}</summary>
                        </details>
                        <div className="fold-body">
                          {product.longDescription.map((para, i) => (
                            <p key={i} className="font-poppins text-muted-foreground mt-3">
                              {para}
                            </p>
                          ))}
                        </div>
                      </>
                    ) : null}
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

                  {/* Folded on phones too, its heading the toggle (FoldHead); at md and up
                      the heading shows as before and there is no toggle. */}
                  <div className="mb-8">
                    <FoldHead id="pd-inc" as="h2" className="font-playfair text-xl font-semibold mb-3">
                      {t.productDetail.included}
                    </FoldHead>
                    <ul className="fold-body font-poppins space-y-2">
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
                  <WhatsAppLink
                    message={t.common.quoteMessage(product.name)}
                    source={`product_detail:${product.id}`}
                    className="cta cta-m w-full"
                  >
                    <WhatsAppIcon />
                    {/* The product-card label: heroQuote took two lines here on a 320px phone
                        in both languages, and at 360 in Arabic. */}
                    {t.nav.getFreeQuote}
                  </WhatsAppLink>
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
              <h2 className="h2-sec faq-h">
                {t.common.faqTitle}
              </h2>
              <FaqList faqs={product.faqs} />
            </div>
          </section>
        ) : null}

        <RelatedGuides locale={locale} productId={product.id} />

        <RelatedProducts locale={locale} currentId={product.id} category={product.category} />

        <ServiceLinks locale={locale} services={servicesForProductL(locale, product.id).slice(0, 3)} />

        <BusinessFacts locale={locale} title={t.facts.whereTitle(product.name)} />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              {t.productDetail.needHelp}
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8">
              {t.productDetail.needHelpText}
            </p>
            <WhatsAppLink
              message={t.common.quoteMessage(product.name)}
              source={`product_detail_bottom:${product.id}`}
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
