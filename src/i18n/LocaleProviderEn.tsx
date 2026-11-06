"use client";

import { enClient } from "@/i18n/en.client";
import { LocaleContext, type LocaleValue } from "@/i18n/LocaleProvider";

const VALUE: LocaleValue = { locale: "en", t: enClient };

/** Set once in the English root layout. */
export default function LocaleProviderEn({ children }: { children: React.ReactNode }) {
  return <LocaleContext.Provider value={VALUE}>{children}</LocaleContext.Provider>;
}
