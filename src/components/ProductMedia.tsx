"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "@/components/icons";
import type { Product } from "@/data/products";
import { useI18n } from "@/i18n/LocaleProvider";

/**
 * Hero media for a product detail page.
 *
 * Client leaf holding only the image error state, so the surrounding page can
 * remain a server component and export generateMetadata. The image is never hidden
 * while it loads: it is the page's LCP element, and hiding it until React runs would
 * tie LCP to hydration.
 */
export default function ProductMedia({
  product,
  alt,
}: {
  product: Product;
  alt: string;
}) {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // The image in the static HTML can fail before React attaches onError, and the
  // event won't fire again.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setImageError(true);
  }, []);

  const firstMedia = product.media?.[0];
  const isVideo = firstMedia?.type === "video";

  return (
    <div className="h-[300px] md:h-[500px] relative overflow-hidden bg-gray-100">
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center p-6">
            <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-medium mb-2">{t.productCard.imageNotAvailable}</div>
            <div className="text-sm text-gray-400">{product.name}</div>
          </div>
        </div>
      )}

      {isVideo ? (
        // Plays on request: autoplay made every visitor download the whole file, up to
        // 11 MB, during page load. The poster paints straight away and is the LCP element.
        <video
          src={firstMedia.src}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="none"
          poster={product.imageSrc}
          aria-label={alt}
        />
      ) : (
        <img
          ref={imageRef}
          src={product.imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
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
