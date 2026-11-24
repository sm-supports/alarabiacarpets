/**
 * Home hero's background loop (public/video/, made by scripts/encode-hero-video.sh; source and
 * licence in docs/media-credits.md). The names carry the source clip's hash and /video/* is
 * served immutable, so a new clip gets new names here. Import-free, for client components.
 *
 * "wide" is from md (768px) up, "phone" below. The posters are the loop's first frame and are
 * the page's LCP element: they are in the static HTML, the video only arrives after load.
 */
const BASE = "/video/hero-8b931dff";

export const HERO_POSTER = {
  wide: `${BASE}-wide.webp`,
  phone: `${BASE}-phone.webp`,
} as const;

export const HERO_VIDEO = {
  wide: [`${BASE}-wide.webm`, `${BASE}-wide.mp4`],
  phone: [`${BASE}-phone.webm`, `${BASE}-phone.mp4`],
} as const;

/** The breakpoint between the two cuts: Tailwind's md, as in the poster's <source media>. */
export const HERO_WIDE_QUERY = "(min-width: 768px)";
