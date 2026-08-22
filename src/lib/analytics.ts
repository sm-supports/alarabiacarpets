/**
 * Centralized Google Analytics 4 + Google Ads conversion tracking.
 *
 * Every analytics call in the app goes through this module. Before this existed,
 * only 2 of ~14 WhatsApp CTAs fired a conversion event and the tracking code was
 * duplicated inline in ContactSection.
 */

export const GA_MEASUREMENT_ID = "G-256YMYE1WP";
export const GOOGLE_ADS_ID = "AW-16463357836";

/** Conversion labels configured in the Google Ads account. */
export const CONVERSION_LABELS = {
  formLead: `${GOOGLE_ADS_ID}/vNfLCO7DwcgbEIzPq6o9`,
  whatsappClick: `${GOOGLE_ADS_ID}/n6RiCOKH_I0bEIzPq6o9`,
} as const;

/** Al Arabia Carpets is a Qatar business — conversions are valued in Qatari riyal. */
export const CURRENCY = "QAR";

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: string, targetOrName: string | Date, params?: GtagParams) => void;
    dataLayer?: unknown[];
  }
}

/** True once gtag.js has loaded. Guards against SSR and ad-blockers. */
function gtagReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Low-level passthrough. Silently no-ops when gtag is unavailable. */
export function gtagEvent(name: string, params: GtagParams = {}): void {
  if (!gtagReady()) return;
  window.gtag!("event", name, params);
}

/**
 * Fire a Google Ads conversion.
 *
 * Deliberately does NOT intercept navigation. WhatsApp CTAs are ordinary
 * `target="_blank"` anchors, so the browser opens them natively while this
 * beacon goes out — more robust than the previous preventDefault +
 * `window.open("about:blank")` dance, which popup blockers could break.
 */
export function trackConversion(sendTo: string, params: GtagParams = {}): void {
  gtagEvent("conversion", { send_to: sendTo, value: 1.0, currency: CURRENCY, ...params });
}

/** Contact form submitted successfully. */
export function trackFormLead(): void {
  trackConversion(CONVERSION_LABELS.formLead);
  gtagEvent("generate_lead", { currency: CURRENCY, value: 1.0, method: "contact_form" });
}

/**
 * A WhatsApp CTA was clicked.
 * @param source where the click came from, e.g. "navbar", "product_card:carpet"
 */
export function trackWhatsAppClick(source: string): void {
  trackConversion(CONVERSION_LABELS.whatsappClick, { source });
  gtagEvent("whatsapp_click", { source, method: "whatsapp" });
}

/** A tel: link was clicked. */
export function trackPhoneClick(source: string): void {
  trackConversion(CONVERSION_LABELS.whatsappClick, { source });
  gtagEvent("phone_click", { source, method: "phone" });
}

/**
 * Report a page view. Needed because a client-routed app only sends the
 * initial gtag('config') hit — in-app navigations were never tracked.
 */
export function trackPageView(path: string): void {
  if (!gtagReady()) return;
  window.gtag!("config", GA_MEASUREMENT_ID, { page_path: path });
}
