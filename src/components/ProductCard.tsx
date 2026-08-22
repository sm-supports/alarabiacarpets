"use client";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, ImageIcon, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useState, useRef, useEffect } from "react";
import { ProductMedia } from "@/data/products";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackWhatsAppClick } from "@/lib/analytics";

interface ProductCardProps {
  name: string;
  description: string;
  imageSrc: string; // Fallback/Preview
  media?: ProductMedia[];
  whatsappLink: string;
  onClick?: () => void;
  priority?: boolean;
  /** Product detail URL. When set the title renders as a real crawlable anchor. */
  href?: string;
  /** Descriptive alt text; falls back to the product name. */
  imageAlt?: string;
}

const ProductCard = memo(function ProductCard({
  name,
  description,
  imageSrc,
  media = [],
  whatsappLink,
  onClick,
  priority = false,
  href,
  imageAlt
}: ProductCardProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
    trackWhatsAppClick(`product_card:${name}`);
  }, [name]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
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
    <Card className="product-card overflow-hidden h-full flex flex-col group border-0 shadow-md hover:shadow-xl transition-all duration-500 rounded-2xl bg-white">
      {/* Media Container - Fixed 4:3 aspect ratio for uniformity */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden rounded-t-2xl">
        {/* Navigation Arrows (only if multiple items) */}
        {displayMedia.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('left'); }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-neutral-700 p-1.5 rounded-full opacity-40 group-hover:opacity-100 focus:opacity-100 group-focus-within:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); scroll('right'); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-neutral-700 p-1.5 rounded-full opacity-40 group-hover:opacity-100 focus:opacity-100 group-focus-within:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {displayMedia.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-5 h-1.5 bg-white shadow-md'
                      : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Media Count Badge */}
        {displayMedia.length > 1 && (
          <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
            {displayMedia[activeIndex]?.type === 'video' ? <Video size={11} /> : <ImageIcon size={11} />}
            <span>{activeIndex + 1}/{displayMedia.length}</span>
          </div>
        )}

        {/* Scrollable Media Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory h-full w-full scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayMedia.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="flex-shrink-0 w-full h-full snap-center relative cursor-pointer"
              onClick={handleCardClick}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  playsInline
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  {(!isLoaded && !hasError && index === 0) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 animate-pulse flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}

                  {hasError && index === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
                      <div className="text-neutral-400 text-center p-4">
                        <ImageIcon size={40} className="mx-auto mb-2" />
                        <div className="text-xs font-medium">Image unavailable</div>
                      </div>
                    </div>
                  )}

                  <img
                    src={item.src}
                    alt={imageAlt ? `${imageAlt}${index > 0 ? ` (view ${index + 1})` : ""}` : `${name} - ${index + 1}`}
                    loading={priority && index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={priority && index === 0 ? "high" : "auto"}
                    onLoad={index === 0 ? handleImageLoad : undefined}
                    onError={index === 0 ? handleImageError : undefined}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-playfair text-base sm:text-lg font-semibold mb-1.5 text-neutral-900 line-clamp-1">
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
        <p className="font-poppins text-xs sm:text-sm text-neutral-500 mb-4 flex-grow line-clamp-2 leading-relaxed">
          {description}
        </p>
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-10 sm:h-11 text-sm font-medium transition-all duration-300 hover:shadow-md mt-auto"
        >
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
            onClick={handleWhatsAppClick}
          >
            <ShoppingCart size={15} />
            <span>Inquire on WhatsApp</span>
            <ExternalLink size={13} />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
