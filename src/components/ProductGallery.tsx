"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Video } from "@/components/icons";
import { useI18n } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";

/** A slide after the first: a sized photo URL, or a video shown with the product's poster. */
export interface GallerySlide {
  type: "image" | "video";
  src: string;
}

/**
 * The product page's photo strip below md (ProductMedia): the server-rendered hero, passed
 * in as `children`, is the first slide, so it keeps its place, its fetchpriority and the
 * page's LCP. The product's other photos and videos come after it, swiped through the
 * card track (.pc-track), with the cards' count badge.
 *
 * The extra slides are in neither the static HTML nor any request until they are wanted:
 * they render once hydrated, and each gets its image only when a swipe reaches the slide
 * before it, as on the cards (a lazy image next to the one in view still loads, because
 * the browser counts it as near). At md and up they are hidden and the hero stands alone,
 * as it always has. Arabic swipes the other way, so scrollLeft runs negative there.
 */
export default function ProductGallery({
  slides,
  alt,
  heroVideo = false,
  poster,
  children,
}: {
  slides: GallerySlide[];
  /** The hero's alt text; each extra slide adds its number to it. */
  alt: string;
  /** The hero is a video, for the badge's icon on the first slide. */
  heroVideo?: boolean;
  /** The poster for video slides. */
  poster?: string;
  children: React.ReactNode;
}) {
  const hydrated = useHydrated();
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Highest extra slide (1-based, the hero being 0) allowed to load.
  const [loadedUpTo, setLoadedUpTo] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const onScroll = () => {
      const width = element.clientWidth;
      if (!width) return;
      const offset = Math.abs(element.scrollLeft) / width;
      setActive(Math.round(offset));
      // The slide coming into view and the one after it, so the next swipe is ready.
      setLoadedUpTo((current) => Math.max(current, Math.ceil(offset) + 1));
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, []);

  const total = slides.length + 1;
  const video = active === 0 ? heroVideo : slides[active - 1]?.type === "video";
  const label = (index: number) => `${alt}${t.productCard.view(index + 2)}`;

  return (
    <>
      {hydrated && (
        <div className="pc-count end-3 md:hidden">
          {video ? <Video size={11} /> : <ImageIcon size={11} />}
          <span>
            {active + 1}/{total}
          </span>
        </div>
      )}
      <div ref={track} className="pc-track">
        <div className="pd-slide">{children}</div>
        {hydrated &&
          slides.map((slide, index) => (
            // A slide that fails becomes a named tile from ImageFallback (providers.tsx).
            <div key={index} className="pd-slide md:hidden">
              {index + 1 > loadedUpTo ? null : slide.type === "video" ? (
                <video
                  src={slide.src}
                  poster={poster}
                  aria-label={label(index)}
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="none"
                />
              ) : (
                <img
                  src={slide.src}
                  alt={label(index)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
}
