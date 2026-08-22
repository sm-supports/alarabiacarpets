"use client";

import { useCallback, useState } from "react";
import { ImageIcon } from "lucide-react";
import type { Product } from "@/data/products";

/**
 * Hero media for a product detail page.
 *
 * Client leaf holding only the image load/error state, so the surrounding page
 * can remain a server component and export generateMetadata.
 */
export default function ProductMedia({
  product,
  alt,
}: {
  product: Product;
  alt: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  const firstMedia = product.media?.[0];
  const isVideo = firstMedia?.type === "video";

  return (
    <div className="h-[300px] md:h-[500px] relative overflow-hidden bg-gray-100">
      {!imageLoaded && !imageError && !isVideo && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      )}

      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center p-6">
            <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-medium mb-2">Image not available</div>
            <div className="text-sm text-gray-400">{product.name}</div>
          </div>
        </div>
      )}

      {isVideo ? (
        <video
          src={firstMedia.src}
          className="w-full h-full object-cover"
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={product.imageSrc.endsWith(".mp4") ? undefined : product.imageSrc}
        />
      ) : (
        <img
          src={product.imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded && !imageError ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          // Hero image: eager + high priority, it is the LCP element.
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ display: imageError ? "none" : "block" }}
        />
      )}
    </div>
  );
}
