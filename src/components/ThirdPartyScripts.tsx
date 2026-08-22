import Script from "next/script";
import { CONVERSION_LABELS, CURRENCY, GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

/**
 * Third-party tags, ported from the old index.html.
 *
 * Server component -- next/script handles the client-side loading strategy, so
 * nothing here needs a "use client" boundary.
 */
export default function ThirdPartyScripts() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');

          // Preserved for any inline handler still calling the global.
          // Currency is QAR: this is a Qatar business, it previously sent INR.
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') { window.location = url; }
            };
            gtag('event', 'conversion', {
              'send_to': '${CONVERSION_LABELS.formLead}',
              'value': 1.0,
              'currency': '${CURRENCY}',
              'event_callback': callback
            });
            return false;
          }
          window.gtag_report_conversion = gtag_report_conversion;
        `}
      </Script>

      {/* Chat widget. lazyOnload defers to after window.load, matching the
          intent of the old hand-rolled requestIdleCallback shim and keeping it
          off the LCP path. */}
      <Script id="tawk-to" strategy="lazyOnload">
        {`
          var Tawk_API = Tawk_API || {};
          var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/68a5dfd1f412351925ef40a3/1j33v4jea';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        `}
      </Script>
    </>
  );
}
