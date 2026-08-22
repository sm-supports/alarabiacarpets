/**
 * Shared SEO constants and structured-data builders.
 *
 * Replaces the old client-side <SEO> react-helmet-async component. Metadata is
 * now emitted server-side by the Next.js Metadata API, so it lands in the static
 * HTML rather than being injected after hydration.
 */

export const SITE_NAME = "Al Arabia Carpets";
export const SITE_URL = "https://alarabiacarpets.com";
export const DEFAULT_IMAGE = "/lovable-uploads/green-white-logo.webp";
export const DEFAULT_TITLE = `${SITE_NAME} | Premium Home Furnishings & Interior Design in Qatar | Doha`;
export const DEFAULT_DESCRIPTION =
  "Al Arabia Carpets - Qatar's leading provider of premium Barkia, PVC flooring, carpets, sofas, curtains & interior design services. Free installation & delivery across Doha.";

export const PHONE = "+974 5551 2858";
export const PHONE_E164 = "+97455512858";
export const EMAIL = "info@alarabiacarpets.com";
export const STREET = "Al Mansoura St";
export const CITY = "Doha";
export const COUNTRY = "Qatar";
export const LATITUDE = 25.276987;
export const LONGITUDE = 51.520008;

/**
 * Meta descriptions are truncated at 155 chars so search engines don't clip
 * mid-word. Ported verbatim from the old SEO component.
 */
export function clampDescription(description: string): string {
  return description.length > 155 ? `${description.slice(0, 152)}...` : description;
}

/**
 * Make a site-relative path absolute and URL-safe.
 *
 * Product image paths contain spaces, colons and ampersands (e.g.
 * "/Products/Carpets/Event:normal carpet.jpeg"). Browsers tolerate those in an
 * <img src>, but social scrapers reject an unencoded og:image, so anything
 * emitted into metadata or JSON-LD has to go through here.
 */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${encodeURI(path)}`;
}
