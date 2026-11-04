/**
 * Locale routing rules. English keeps the unprefixed URLs that are already
 * indexed and cited by AI tools; Arabic lives under /ar with the same slugs, so
 * every page maps 1:1 between languages.
 */
export type Locale = "en" | "ar";

export const LOCALES: Locale[] = ["en", "ar"];

/** BCP 47 tags for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = { en: "en", ar: "ar-QA" };

/** Cookie set by the navbar switcher. The Cloudflare redirect rule reads it. */
export const LOCALE_COOKIE = "site_lang";

/** Site-relative path for `path` (an English path) in the given locale. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  return path === "/" ? "/ar" : `/ar${path}`;
}

/** The locale a pathname belongs to. */
export function pathLocale(pathname: string): Locale {
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

/** The English path of a pathname in either locale. */
export function stripLocale(pathname: string): string {
  if (pathname === "/ar") return "/";
  return pathname.startsWith("/ar/") ? pathname.slice(3) : pathname;
}
