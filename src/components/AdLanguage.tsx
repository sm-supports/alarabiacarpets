"use client";

import { useEffect } from "react";
import { rememberLocale } from "@/i18n/config";

/**
 * Keeps visitors from English ads on the English site.
 *
 * English ads link with ?lang=en, which the Cloudflare redirect rule skips, so the
 * landing page stays English even in Qatar. That only covers URLs with the
 * parameter, so this sets the cookie that covers the visitor's later page loads.
 *
 * Reads window.location rather than useSearchParams, which fails under static
 * export without a Suspense boundary.
 */
export default function AdLanguage() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "en") {
      rememberLocale("en");
    }
  }, []);

  return null;
}
