"use client";

/**
 * The client components the Arabic root layout renders, re-exported from a file
 * of its own. See src/app/(en)/client.ts for why a root layout must not import
 * them directly.
 */
export { default as Providers } from "@/app/providers";
export { default as Analytics } from "@/components/Analytics";
export { default as WebVitals } from "@/components/WebVitals";
export { default as WhatsAppFloat } from "@/components/WhatsAppFloat";
export { default as LocaleProvider } from "@/i18n/LocaleProviderAr";
export { default as Script } from "next/script";
