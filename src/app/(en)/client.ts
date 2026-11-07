"use client";

/**
 * The client components the English root layout renders, re-exported from a file
 * of its own. The Arabic layout has a twin in src/app/(ar)/client.ts.
 *
 * Why not import them directly: Next.js files both root layouts under one group
 * (it drops the "(en)" and "(ar)" folders from the name), and keeps one entry per
 * client file in that group. A component both layouts import directly is therefore
 * tied to a single layout's script, whichever was processed last, and every page of
 * the other language downloads that script as well. Going through this file gives
 * each language its own entry. `npm run check` and `npm run deploy` fail if a page
 * loads a script of the other language (scripts/check-page-weight.mjs).
 *
 * So: a root layout takes client components (and next/script) only from here.
 */
export { default as Providers } from "@/app/providers";
export { default as AdLanguage } from "@/components/AdLanguage";
export { default as Analytics } from "@/components/Analytics";
export { default as WebVitals } from "@/components/WebVitals";
export { default as WhatsAppFloat } from "@/components/WhatsAppFloat";
export { default as LocaleProvider } from "@/i18n/LocaleProviderEn";
export { default as Script } from "next/script";
