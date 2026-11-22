import ProductGallery, { type GallerySlide } from "@/components/ProductGallery";

/**
 * Hero media for a product detail page. A server component: nothing here needs the
 * browser, so its props stay out of the page's hydration data.
 *
 * The image is never hidden while it loads: it is the page's LCP element, and hiding it
 * until React runs would tie LCP to hydration. A photo or video that fails becomes a
 * named tile in this same box, from ImageFallback (mounted in src/app/providers.tsx),
 * which also catches a failure from before hydration.
 *
 * With `slides`, the product's other photos and videos follow the hero in a swipe strip
 * on phones (ProductGallery). The hero is still rendered here, so it stays in the static
 * HTML exactly as before; the strip adds only the slides' URLs to the hydration data.
 */
export default function ProductMedia({
  alt,
  src,
  srcSet,
  sizes,
  videoSrc,
  slides,
  poster,
}: {
  alt: string;
  /** The hero image, or the poster when the product leads with a video. Sized copies
      resolved on the server (see ProductDetailView). */
  src: string;
  srcSet?: string;
  sizes?: string;
  videoSrc?: string;
  /** The slides after the hero, phones only. */
  slides?: GallerySlide[];
  /** The poster for video slides. */
  poster?: string;
}) {
  const hero = videoSrc ? (
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
  );

  return (
    <div className="pd-media">
      {slides?.length ? (
        // Props left out rather than passed as undefined: each is written into the page's
        // hydration data, and an undefined one as "$undefined".
        <ProductGallery slides={slides} alt={alt} {...(videoSrc ? { heroVideo: true } : {})} {...(poster ? { poster } : {})}>
          {hero}
        </ProductGallery>
      ) : (
        hero
      )}
    </div>
  );
}
