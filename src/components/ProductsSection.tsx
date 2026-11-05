"use client";

import { ArrowRight, ArrowUpRight } from "@/components/icons";
import Link from "next/link";
import { products } from "@/data/products";
import { getCategory } from "@/data/categories";
import { WHATSAPP_URL } from "@/lib/seo";
import WhatsAppLink from "@/components/WhatsAppLink";
import { useI18n } from "@/i18n/LocaleProvider";

// Showcase presentation config. Each entry points at a CATEGORY landing page --
// these were category-hub products until they became real category pages.
// Text comes from t.showcase, keyed by category slug.
const showcaseConfig = [
  { categorySlug: "carpet", color: "forest" as const },
  { categorySlug: "majlis-sofa", color: "gold" as const },
  { categorySlug: "barkia", color: "teal" as const },
];

// Resolved from the category data with NO fallback: a bad slug must throw at
// module scope. The previous `|| products.find(by category)` fallback would
// silently render a different product with a different image.
const productShowcases = showcaseConfig.map(config => {
  const category = getCategory(config.categorySlug);
  if (!category) throw new Error(`Unknown category slug: ${config.categorySlug}`);
  return {
    id: category.slug,
    imageSrc: category.heroImage,
    href: `/products/${category.slug}`,
    color: config.color,
  };
});

// "More to Explore" tiles. `categorySlug` entries link to a landing page;
// `productId` entries link to a real SKU. Neither has a fallback. Tile names come
// from t.showcase.more, keyed by slug or id.
const additionalProductConfig: Array<{ categorySlug: string } | { productId: string }> = [
  { categorySlug: "curtain" },
  { productId: "roller" },
  { productId: "grass-carpet" },
  { categorySlug: "interior" },
];

const additionalProducts = additionalProductConfig.map(config => {
  if ("categorySlug" in config) {
    const category = getCategory(config.categorySlug);
    if (!category) throw new Error(`Unknown category slug: ${config.categorySlug}`);
    return {
      id: category.slug,
      imageSrc: category.heroImage,
      link: `/products/${category.slug}`,
    };
  }
  const product = products.find(p => p.id === config.productId);
  if (!product) throw new Error(`Unknown product id: ${config.productId}`);
  return {
    id: product.id,
    imageSrc: product.imageSrc,
    link: `/products/${product.id}`,
  };
});

// Individual product showcase component
function ProductShowcase({
  product,
  index,
}: {
  product: typeof productShowcases[0];
  index: number;
}) {
  const isReversed = index % 2 === 1;
  const { t, lp } = useI18n();
  const copy = t.showcase.items[product.id];
  const whatsappLink = `${WHATSAPP_URL}?text=${encodeURIComponent(t.common.interestedMessage(copy.name))}`;

  const colorClasses = {
    forest: {
      badge: 'bg-forest-100 text-forest-700',
      accent: 'text-forest-600',
      button: 'bg-forest-900 hover:bg-forest-700',
    },
    gold: {
      badge: 'bg-gold-100 text-gold-700',
      accent: 'text-gold-600',
      button: 'bg-gold-600 hover:bg-gold-500',
    },
    teal: {
      badge: 'bg-teal-100 text-teal-700',
      accent: 'text-teal-600',
      button: 'bg-teal-600 hover:bg-teal-500',
    },
  }[product.color];

  return (
    <div className={`py-12 sm:py-16 lg:py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center"
        >
          {/* Image - Shows first on mobile */}
          <div
            className={`reveal order-1 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div className="sc-frame group">
              <img
                src={product.imageSrc}
                alt={copy.name}
                className="sc-img"
                loading="lazy"
                decoding="async"
              />
              {/* Subtle gradient overlay */}
              <div className="sc-shade" />
            </div>
          </div>

          {/* Content */}
          <div
            className={`reveal order-2 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full ${colorClasses.badge}`}>
              {copy.name}
            </span>
            <h2 className="sc-title">
              {copy.tagline}
            </h2>
            <p className="sc-text">
              {copy.description}
            </p>

            {/* Features - Horizontal scroll on mobile */}
            <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {copy.features.map((feature) => (
                <span
                  key={feature}
                  className="sc-pill"
                >
                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClasses.accent} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </span>
              ))}
            </div>

            {/* CTAs - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={lp(product.href)}
                className={`group sc-cta ${colorClasses.button}`}
              >
                {t.showcase.viewRange}
                <span className="sr-only">: {copy.name}</span>
                <ArrowRight className="arrow-go" />
              </Link>
              <WhatsAppLink
                href={whatsappLink}
                source={`showcase:${product.id}`}
                className="btn-outline"
              >
                {t.showcase.getQuote}
                <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const { t, lp } = useI18n();

  return (
    <section id="products" className="relative">
      {/* Section Header */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-forest-900 mb-3 sm:mb-4">
            {t.showcase.title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t.showcase.subtitle}
          </p>
        </div>
        </div>

      {/* Product Showcases */}
      {productShowcases.map((product, index) => (
        <ProductShowcase key={product.id} product={product} index={index} />
      ))}

      {/* Additional Products Grid */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-forest-900 mb-3 sm:mb-4">
              {t.showcase.moreTitle}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              {t.showcase.moreSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {additionalProducts.map((product) => (
              <Link
                key={product.id}
                href={lp(product.link)}
                className="group more-tile reveal"
              >
                <img
                  src={product.imageSrc}
                  alt={t.showcase.moreAlt(t.showcase.more[product.id])}
                  className="more-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="more-shade" />
                <div className="more-label">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white text-sm sm:text-base font-medium">{t.showcase.more[product.id]}</span>
                    <span className="more-arrow">
                      <ArrowUpRight className="more-icon" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>

          {/* View All CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href={lp("/products")}
              className="group all-cta"
            >
              {t.showcase.viewAll}
              <ArrowRight className="arrow-go" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
