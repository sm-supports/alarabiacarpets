"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

/**
 * Reports a GA4 page_view on every client-side navigation.
 *
 * Without this only the initial gtag('config') hit is sent, so in-app
 * navigations were invisible in analytics.
 *
 * Deliberately uses usePathname() and never useSearchParams(): under
 * output: 'export' an unwrapped useSearchParams is a hard build error, and
 * this component sits in the root layout where a Suspense boundary would
 * apply to the whole tree.
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname + window.location.search);
  }, [pathname]);

  return null;
}
