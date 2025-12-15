
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, ImageIcon, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useState, useRef } from "react";
import { ProductMedia } from "@/data/products";

interface ProductCardProps {
  name: string;
  description: string;
  imageSrc: string; // Fallback/Preview
  media?: ProductMedia[];
  whatsappLink: string;
  onClick?: () => void;
  priority?: boolean;
}

const ProductCard = memo(function ProductCard({ 
  name, 
  description, 
  imageSrc, 
  media = [],
  whatsappLink, 
  onClick,
  priority = false
}: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // If no media array is provided, create one from imageSrc for backward compatibility
  const displayMedia = media.length > 0 ? media : [{ type: 'image', src: imageSrc } as ProductMedia];

  const handleCardClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
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

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col group">
      <div className="relative aspect-square bg-secondary">
        {/* Scroll Controls (only if multiple items) */}
        {displayMedia.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); scroll('left'); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); scroll('right'); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Page Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {displayMedia.map((_, idx) => (
                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/50" />
              ))}
            </div>
          </>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayMedia.map((item, index) => (
            <div 
              key={`${item.src}-${index}`} 
              className="flex-shrink-0 w-full h-full snap-center relative"
              onClick={handleCardClick}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  controls
                  preload="auto"
                  onClick={(e) => e.stopPropagation()} // Allow controls to work
                />
              ) : (
                <>
                  {(!isLoaded && !hasError && index === 0) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {hasError && index === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-center p-4">
                        <ImageIcon size={48} className="mx-auto mb-3 text-gray-400" />
                        <div className="text-sm font-medium mb-1">Image not available</div>
                      </div>
                    </div>
                  )}

                  <img 
                    src={item.src} 
                    alt={`${name} - ${index + 1}`}
                    loading={priority && index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={priority && index === 0 ? "high" : "auto"}
                    onLoad={index === 0 ? handleImageLoad : undefined}
                    onError={index === 0 ? handleImageError : undefined}
                    className="h-full w-full object-cover"
                  />
                </>
              )}
              
              {/* Type Indicator */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {item.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                <span>{index + 1}/{displayMedia.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 
          className="font-playfair text-lg font-semibold mb-2 hover:text-primary transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
          {name}
        </h3>
        <p className="font-poppins text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        <Button 
          asChild 
          className="w-full bg-primary hover:bg-accent text-white mt-auto"
        >
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2"
            onClick={handleWhatsAppClick}
          >
            <ShoppingCart size={16} />
            <span>Inquire on WhatsApp</span>
            <ExternalLink size={14} />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
