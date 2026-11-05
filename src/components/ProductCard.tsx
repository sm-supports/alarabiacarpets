"use client";


import { ShoppingCart, ExternalLink, ImageIcon, Video, ChevronLeft, ChevronRight, Play } from "@/components/icons";
import { memo, useCallback, useState, useRef, useEffect } from "react";
import { ProductMedia } from "@/data/products";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WhatsAppLink from "@/components/WhatsAppLink";
import { useI18n } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";
import { cardImagePath } from "@/lib/card-image";

interface ProductCardProps {
  name: string;
  /** English name, so the analytics source is the same in both languages. */
  analyticsName?: string;
  description: string;
  imageSrc: string; // Fallback/Preview
  media?: ProductMedia[];
  whatsappLink: string;
  onClick?: () => void;
  /** Product detail URL. When set the title renders as a real crawlable anchor. */
  href?: string;
  /** Descriptive alt text; falls back to the product name. */
  imageAlt?: string;
}

const ProductCard = memo(function ProductCard({
  name,
  analyticsName,
  description,
  imageSrc,
  media = [],
  whatsappLink,
  onClick,
  href,
  imageAlt
}: ProductCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  const hydrated = useHydrated();
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);
  // Highest slide allowed to load. Starts at the first: loading="lazy" doesn't help
  // the others, because the browser counts a neighbouring slide as near the viewport.
  const [loadedUpTo, setLoadedUpTo] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // If no media array is provided, create one from imageSrc for backward compatibility
  const displayMedia = media.length > 0 ? media : [{ type: 'image', src: imageSrc } as ProductMedia];

  const handleCardClick = useCallback(() => {
    if (href) {
      router.push(href);
      return;
    }
    onClick?.();
  }, [href, router, onClick]);

  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  // Track active slide on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
      // Load the slide coming into view and the one after it, so the next swipe is ready.
      const incoming = Math.ceil(scrollLeft / width);
      setLoadedUpTo((current) => Math.max(current, incoming + 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const goToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * index;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="group product-card pc-card">
      {/* Media Container - Fixed 4:3 aspect ratio for uniformity. LTR in Arabic too,
          because the slide tracking below assumes a positive scrollLeft. */}
      <div dir="ltr" className="pc-media">
        {/* Navigation Arrows (only if multiple items). These and the extra slides need
            JavaScript anyway, and on /products they would be most of the static HTML. */}
        {hydrated && displayMedia.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('left'); }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-neutral-700 p-1.5 rounded-full opacity-40 group-hover:opacity-100 focus:opacity-100 group-focus-within:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm"
              aria-label={t.productCard.previous}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('right'); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-neutral-700 p-1.5 rounded-full opacity-40 group-hover:opacity-100 focus:opacity-100 group-focus-within:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm"
              aria-label={t.productCard.next}
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 flex">
              {displayMedia.map((_, idx) => (
                // The button is the 24px tap target; the dot inside it stays small.
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                  className="flex h-6 w-6 items-center justify-center"
                  aria-label={t.productCard.goToSlide(idx + 1)}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-5 h-1.5 bg-white shadow-md'
                        : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Media Count Badge */}
        {hydrated && displayMedia.length > 1 && (
          <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
            {displayMedia[activeIndex]?.type === 'video' ? <Video size={11} /> : <ImageIcon size={11} />}
            <span>{activeIndex + 1}/{displayMedia.length}</span>
          </div>
        )}

        {/* Scrollable Media Container */}
        <div
          ref={scrollContainerRef}
          className="pc-track scrollbar-hide"
        >
          {(hydrated ? displayMedia : displayMedia.slice(0, 1)).map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="pc-slide"
              onClick={handleCardClick}
            >
              {index > loadedUpTo ? null : item.type === 'video' && playingSrc === item.src ? (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  onClick={(e) => e.stopPropagation()}
                />
              ) : item.type === 'video' ? (
                // A lazy image until tapped. A <video> here would fetch its poster and
                // metadata straight away, for every video on the /products grid.
                <button
                  type="button"
                  className="pc-play"
                  aria-label={t.productCard.playVideo}
                  onClick={(e) => { e.stopPropagation(); setPlayingSrc(item.src); }}
                >
                  <img
                    src={cardImagePath(imageSrc)}
                    alt={imageAlt ?? name}
                    loading="lazy"
                    decoding="async"
                    className="pc-img"
                  />
                  {hydrated && (
                    <span className="pc-play-badge">
                      <Play size={24} />
                    </span>
                  )}
                </button>
              ) : (
                <>
                  {hasError && index === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
                      <div className="text-neutral-400 text-center p-4">
                        <ImageIcon size={40} className="mx-auto mb-2" />
                        <div className="text-xs font-medium">{t.productCard.imageUnavailable}</div>
                      </div>
                    </div>
                  )}

                  <img
                    src={cardImagePath(item.src)}
                    alt={imageAlt ? `${imageAlt}${index > 0 ? t.productCard.view(index + 1) : ""}` : `${name} - ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={index === 0 ? handleImageError : undefined}
                    className="pc-img"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="pc-body">
        <h3 className="pc-title">
          {href ? (
            <Link
              href={href}
              className="hover:text-primary transition-colors"
            >
              {name}
            </Link>
          ) : (
            <span
              className="hover:text-primary transition-colors cursor-pointer"
              onClick={handleCardClick}
            >
              {name}
            </span>
          )}
        </h3>
        <p className="pc-text">
          {description}
        </p>
        <WhatsAppLink
          href={whatsappLink}
          source={`product_card:${analyticsName ?? name}`}
          className="pc-cta"
          onClick={handleWhatsAppClick}
        >
          <ShoppingCart size={15} />
          <span>{t.productCard.inquire}</span>
          <ExternalLink size={13} />
        </WhatsAppLink>
      </div>
    </div>
  );
});

export default ProductCard;
