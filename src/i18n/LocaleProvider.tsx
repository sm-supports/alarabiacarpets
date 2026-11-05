"use client";

import { createContext, useContext } from "react";
import { localePath, type Locale } from "@/i18n/config";
import type { ClientDict } from "@/i18n/en.client";

/**
 * The page's language and the strings client components read. The dictionary comes
 * from LocaleProviderEn / LocaleProviderAr, one per root layout, so a page only
 * downloads its own language. Don't import a dictionary here: this module is shared
 * by both.
 */
export interface LocaleValue {
  locale: Locale;
  t: ClientDict;
}

export const LocaleContext = createContext<LocaleValue | null>(null);

function useLocaleValue(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("No locale provider: render inside LocaleProviderEn or LocaleProviderAr");
  return value;
}

export function useLocale(): Locale {
  return useLocaleValue().locale;
}

/** Interface strings and a path helper for the current language. */
export function useI18n() {
  const { locale, t } = useLocaleValue();
  return {
    locale,
    t,
    lp: (path: string) => localePath(locale, path),
  };
}
