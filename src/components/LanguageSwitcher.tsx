"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/LocaleProvider";
import { HTML_LANG, LOCALE_COOKIE, localePath, stripLocale } from "@/i18n";

/**
 * Link to this page in the other language.
 *
 * A plain <a>, not next/link: the languages have separate root layouts, so this
 * is a full page load either way. The cookie records an explicit choice, which
 * the Cloudflare redirect rule honours over the visitor's country.
 */
export default function LanguageSwitcher({
  className,
  short = false,
}: {
  className?: string;
  short?: boolean;
}) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const target = locale === "en" ? "ar" : "en";
  const href = localePath(target, stripLocale(pathname));

  return (
    <a
      href={href}
      lang={HTML_LANG[target]}
      hrefLang={HTML_LANG[target]}
      aria-label={t.nav.switchAria}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; SameSite=Lax; Secure`;
      }}
      className={className}
    >
      {short ? t.nav.switchShort : t.nav.switchLabel}
    </a>
  );
}
