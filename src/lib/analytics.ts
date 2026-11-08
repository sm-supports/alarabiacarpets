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
  formLead: `${GOOGLE_ADS_ID}/UHXsCPbnmbIdEIzPq6o9`,
  whatsappClick: `${GOOGLE_ADS_ID}/1TvGCLDmmbIdEIzPq6o9`,
  /**
   * Phone calls need their own conversion action. Until one is created in the
   * Google Ads account and its label pasted here, phone clicks are recorded in
   * GA4 only -- reusing the WhatsApp label would inflate and contaminate the
   * WhatsApp conversion that bidding optimises against.
   */
  phoneClick: null as string | null,
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

/** Contact form submitted successfully. Not for a correction of a message already sent. */
export function trackFormLead(): void {
  trackConversion(CONVERSION_LABELS.formLead);
  gtagEvent("generate_lead", { currency: CURRENCY, value: 1.0, method: "contact_form" });
}

/** A "Correct and resend" went through. The lead was counted by the first send. */
export function trackFormCorrection(): void {
  gtagEvent("form_correction", { method: "contact_form" });
}

/**
 * The contact form showed a failure. `code` is the API's code or the form's own
 * (offline, unreachable, no_reply, bot_*): never anything the visitor typed.
 */
export function trackFormFailed(code: string): void {
  gtagEvent("form_failed", { code, method: "contact_form" });
}

/**
 * A WhatsApp CTA was clicked.
 * @param source where the click came from, e.g. "navbar", "product_card:carpet"
 * @param conversion false for a tap that isn't a new lead, such as the follow-up after
 *   a sent form: GA4 still records it, Google Ads doesn't count it.
 */
export function trackWhatsAppClick(source: string, conversion = true): void {
  if (conversion) trackConversion(CONVERSION_LABELS.whatsappClick, { source });
  gtagEvent("whatsapp_click", { source, method: "whatsapp", ...(!conversion && { conversion: false }) });
}

/** A tel: link was clicked. */
export function trackPhoneClick(source: string): void {
  if (CONVERSION_LABELS.phoneClick) {
    trackConversion(CONVERSION_LABELS.phoneClick, { source });
  }
  gtagEvent("phone_click", { source, method: "phone" });
}

/**
 * Report a page view for a client-side navigation.
 *
 * Sends GA4's documented page_view event rather than re-invoking
 * gtag('config'), which would re-run initialisation and re-read campaign
 * parameters on every navigation. The initial page view is still emitted
 * automatically by the config call in ThirdPartyScripts, so callers must not
 * fire this on first mount or the landing page is counted twice.
 */
export function trackPageView(path: string): void {
  if (!gtagReady()) return;
  window.gtag!("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * A Core Web Vital measured in a real visitor's browser, sent as a GA4 event named
 * after the metric (LCP, INP, CLS), in the shape Google's web-vitals guide uses:
 * `value` is the delta so GA4's sums stay correct when a metric reports more than
 * once, and `metric_id` groups those reports. To chart them, register `metric_value`
 * as a custom metric and `metric_rating` as a custom dimension in GA4.
 *
 * gtag.js loads on the first interaction or after 5 s (see ThirdPartyScripts), and
 * these are queued in dataLayer until then. A visitor who leaves before that with no
 * interaction is not recorded.
 *
 * `page_path` is the page the visit loaded on, not the address at the time of the
 * report: CLS and INP are sent when the tab is hidden, by which point an in-site
 * link may have changed the address, and the measurement still belongs to the load.
 */
const LOADED_PATH = typeof window === "undefined" ? "" : window.location.pathname;

export function trackWebVital(metric: {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating?: string;
}): void {
  if (metric.name !== "LCP" && metric.name !== "INP" && metric.name !== "CLS") return;
  gtagEvent(metric.name, {
    value: metric.delta,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    page_path: LOADED_PATH,
    non_interaction: true,
  });
}
