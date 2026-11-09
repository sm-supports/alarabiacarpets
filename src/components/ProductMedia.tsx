"use client";

/**
 * Hero media for a product detail page.
 *
 * The image is never hidden while it loads: it is the page's LCP element, and hiding it
 * until React runs would tie LCP to hydration. A photo or video that fails becomes a
 * named tile in this same box, from ImageFallback (mounted in src/app/providers.tsx),
 * which also catches a failure from before hydration.
 */
export default function ProductMedia({
  alt,
  src,
  srcSet,
  sizes,
  videoSrc,
}: {
  alt: string;
  /** The hero image, or the poster when the product leads with a video. Sized copies
      resolved on the server (see ProductDetailView). */
  src: string;
  srcSet?: string;
  sizes?: string;
  videoSrc?: string;
}) {
  return (
    <div className="h-[300px] md:h-[500px] relative overflow-hidden bg-gray-100">
      {videoSrc ? (
        // Plays on request: autoplay made every visitor download the whole file, up to
        // 11 MB, during page load. The poster paints straight away and is the LCP element.
        <video
          src={videoSrc}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="none"
          poster={src}
          aria-label={alt}
        />
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className="w-full h-full object-cover"
          // Hero image: eager + high priority, it is the LCP element.
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      )}
    </div>
  );
}
