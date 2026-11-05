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
      {/* gtag.js costs about 200 KiB and 400 ms of main thread, so it loads on the first
          interaction, or 5 s after window.load. The stub below queues every event and
          conversion in dataLayer until then, so gtagReady() in lib/analytics.ts stays
          true. A visitor who leaves within those 5 s without touching the page isn't
          recorded. */}
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

          (function () {
            var events = ['pointerdown', 'scroll', 'keydown'];
            var loaded = false;
            function loadGtag() {
              if (loaded) return;
              loaded = true;
              events.forEach(function (e) { window.removeEventListener(e, loadGtag); });
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
              document.head.appendChild(s);
            }
            events.forEach(function (e) { window.addEventListener(e, loadGtag, { passive: true }); });
            function startTimer() { setTimeout(loadGtag, 5000); }
            if (document.readyState === 'complete') startTimer();
            else window.addEventListener('load', startTimer, { once: true });
          })();
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
