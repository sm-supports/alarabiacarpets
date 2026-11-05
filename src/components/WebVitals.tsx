"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackWebVital } from "@/lib/analytics";

/**
 * Reports how fast pages are for real visitors (LCP, INP, CLS) to GA4.
 *
 * Lab tests (`npm run perf`) show one simulated phone. This shows the phones and
 * networks people in Qatar actually use. trackWebVital is a module-level function on
 * purpose: useReportWebVitals re-subscribes whenever its callback changes identity.
 */
export default function WebVitals() {
  useReportWebVitals(trackWebVital);
  return null;
}
