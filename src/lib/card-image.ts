const PREFIX = "/Products/";

/** The smaller 4:3 version of a catalog image, made by scripts/build-card-images.mjs. */
export function cardImagePath(src: string): string {
  return src.startsWith(PREFIX) ? `/Products/cards/${src.slice(PREFIX.length)}.webp` : src;
}
