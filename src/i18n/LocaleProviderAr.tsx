"use client";

import { arClient } from "@/i18n/ar.client";
import { LocaleContext, type LocaleValue } from "@/i18n/LocaleProvider";

const VALUE: LocaleValue = { locale: "ar", t: arClient };

/** Set once in the Arabic root layout. */
export default function LocaleProviderAr({ children }: { children: React.ReactNode }) {
  return <LocaleContext.Provider value={VALUE}>{children}</LocaleContext.Provider>;
}
