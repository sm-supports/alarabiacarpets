import type NextScript from "next/script";
import { CONVERSION_LABELS, CURRENCY, GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

/**
 * Third-party tags, ported from the old index.html.
 *
 * Server component -- next/script handles the client-side loading strategy, so
 * nothing here needs a "use client" boundary.
 *
 * next/script arrives as a prop, from the calling layout's own client.ts, and is
 * imported here as a type only. Importing it directly would make it a client file
 * shared by both root layouts, and pages of one language would then download the
 * other language's layout script (see src/app/(en)/client.ts).
 */
export default function ThirdPartyScripts({ Script }: { Script: typeof NextScript }) {
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

      {/* Chat widget. Tawk costs several hundred KB of script, so it loads on the first
          interaction, or 10 s after window.load so the bubble still appears for someone
          who is only reading. The listeners are armed after load, not before: a scroll
          during loading would otherwise start Tawk while the page's own images are
          still coming in. On Save-Data or a 2G connection there is no timer, only the
          interaction. Tawk reads window.Tawk_API, so it has to be set on window here:
          a `var` inside this function would be local. */}
      <Script id="tawk-to" strategy="afterInteractive">
        {`
          (function () {
            var events = ['pointerdown', 'scroll', 'keydown'];
            var loaded = false;
            var timer;
            function inject() {
              window.Tawk_API = window.Tawk_API || {};
              window.Tawk_LoadStart = new Date();
              var s1 = document.createElement('script');
              s1.async = true;
              s1.src = 'https://embed.tawk.to/68a5dfd1f412351925ef40a3/1j33v4jea';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              document.head.appendChild(s1);
            }
            function loadTawk() {
              if (loaded) return;
              loaded = true;
              clearTimeout(timer);
              events.forEach(function (e) { window.removeEventListener(e, loadTawk); });
              // Not in the same task as the tap or scroll that triggered it.
              if ('requestIdleCallback' in window) requestIdleCallback(inject, { timeout: 2000 });
              else setTimeout(inject, 300);
            }
            function arm() {
              events.forEach(function (e) { window.addEventListener(e, loadTawk, { passive: true }); });
              var c = navigator.connection;
              var slow = c && (c.saveData || /2g/.test(c.effectiveType || ''));
              if (!slow) timer = setTimeout(loadTawk, 10000);
            }
            if (document.readyState === 'complete') arm();
            else window.addEventListener('load', arm, { once: true });
          })();
        `}
      </Script>
    </>
  );
}
