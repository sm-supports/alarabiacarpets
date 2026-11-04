"use client";

import { createContext, useContext } from "react";
import { getDict, localePath, type Locale } from "@/i18n";

const LocaleContext = createContext<Locale>("en");

/** Set once per root layout, so client components can read the page's language. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Interface strings and a path helper for the current language. */
export function useI18n() {
  const locale = useContext(LocaleContext);
  return {
    locale,
    t: getDict(locale),
    lp: (path: string) => localePath(locale, path),
  };
}
