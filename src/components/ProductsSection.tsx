"use client";

import { ArrowRight, ArrowUpRight } from "@/components/icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
// silently render a different product with a different image -- including
// swapping the homepage LCP image that src/app/page.tsx preloads.
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
  isVisible
}: {
  product: typeof productShowcases[0];
  index: number;
  isVisible: boolean;
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
            className={`order-1 ${isReversed ? 'lg:order-2' : 'lg:order-1'} transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="sc-frame group">
              <img
                src={product.imageSrc}
                alt={copy.name}
                className="sc-img"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding={index === 0 ? "sync" : "async"}
              />
              {/* Subtle gradient overlay */}
              <div className="sc-shade" />
            </div>
          </div>

          {/* Content */}
          <div
            className={`order-2 ${isReversed ? 'lg:order-1' : 'lg:order-2'} transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: `${index * 100 + 150}ms` }}
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
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const { t, lp } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '-30px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-index]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="relative">
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
        <div key={product.id} data-index={index}>
          <ProductShowcase
            product={product}
            index={index}
            isVisible={visibleItems.has(index)}
          />
        </div>
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
            {additionalProducts.map((product, index) => (
              <Link
                key={product.id}
                href={lp(product.link)}
                data-index={productShowcases.length + index}
                className={`group more-tile ${
                  visibleItems.has(productShowcases.length + index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img
                  src={product.imageSrc}
                  alt={t.showcase.more[product.id]}
                  className="more-img"
                  loading="lazy"
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
