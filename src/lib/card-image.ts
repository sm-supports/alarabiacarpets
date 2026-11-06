import "server-only";
import manifestJson from "@/data/image-manifest.json";

/**
 * Sized WebP copies of catalog photos, made by scripts/build-card-images.mjs.
 *
 * Server only: the manifest lists every photo, so it must not reach the browser.
 * Client components get the resolved URLs as props (see ProductsGrid -> ProductCard).
 *
 * `card` copies are cropped to 4:3, for grids. `full` copies are uncropped, for hero
 * images and for tiles that are not 4:3, where a second crop would change the framing.
 * og:image and JSON-LD keep pointing at the originals.
 */
type Variant = [width: number, url: string];
interface Entry {
  c?: Variant[];
  f?: Variant[];
}
const manifest = manifestJson as unknown as Record<string, Entry>;

export interface ImageAttrs {
  src: string;
  srcSet?: string;
  sizes?: string;
}

function variants(src: string, kind: "c" | "f"): Variant[] | undefined {
  const found = manifest[src]?.[kind];
  if (found?.length) return found;
  // A catalog photo with no copies means the data and the manifest disagree: the
  // script didn't run, or a hero image is used that the script only treats as a card.
  if (/^\/(Products|Services)\//.test(src) && !/\.mp4$/i.test(src)) {
    throw new Error(`No ${kind === "c" ? "card" : "full"} image for ${src}. Run node scripts/build-card-images.mjs`);
  }
  return undefined;
}

/** The widest copy no wider than `width`, or the smallest there is. */
function pick(list: Variant[], width: number): string {
  return ([...list].reverse().find(([w]) => w <= width) ?? list[0])[1];
}

function attrs(list: Variant[] | undefined, src: string, sizes: string): ImageAttrs {
  if (!list) return { src };
  const largest = list[list.length - 1][1];
  if (list.length === 1) return { src: largest };
  return { src: largest, srcSet: list.map(([w, url]) => `${url} ${w}w`).join(", "), sizes };
}

/** One 4:3 URL. Use where the page is close to the 10% text-to-HTML floor. */
export function cardImagePath(src: string, width: 400 | 720 = 720): string {
  const list = variants(src, "c");
  return list ? pick(list, width) : src;
}

/**
 * 4:3 `src`, `srcSet` and `sizes` to spread onto an <img>.
 *
 * Callers pass a phone `sizes` value of about two-thirds of the real slot (66vw for a
 * full-width hero, 33vw for a two-column grid). That is deliberate: it makes a 3x phone
 * take the smaller copy, which still gives it over two device pixels per CSS pixel, for
 * about half the bytes on the connections where bytes matter most. Raise it if photos
 * ever look soft on a phone.
 */
export function cardImage(src: string, sizes: string): ImageAttrs {
  return attrs(variants(src, "c"), src, sizes);
}

/** One uncropped URL. */
export function fullImagePath(src: string, width: 800 | 1200 = 800): string {
  const list = variants(src, "f");
  return list ? pick(list, width) : src;
}

/** Uncropped `src`, `srcSet` and `sizes` to spread onto an <img>. */
export function fullImage(src: string, sizes: string): ImageAttrs {
  return attrs(variants(src, "f"), src, sizes);
}
