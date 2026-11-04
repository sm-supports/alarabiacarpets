import { ar } from "./ar";
import { en, type Dict } from "./en";
import type { Locale } from "./config";

export * from "./config";
export type { Dict };

const DICTIONARIES: Record<Locale, Dict> = { en, ar };

export function getDict(locale: Locale): Dict {
  return DICTIONARIES[locale];
}

/**
 * The one wording for starting prices across the site: "From QAR 75 per sqm" /
 * "ابتداءً من 75 ر.ق للمتر المربع". All prices are QAR in both languages.
 */
export function formatFromPrice(amount: number, unit: string | undefined, locale: Locale): string {
  const { from, units } = DICTIONARIES[locale].price;
  return from(amount.toLocaleString("en-US"), unit ? units[unit] ?? unit : undefined);
}
