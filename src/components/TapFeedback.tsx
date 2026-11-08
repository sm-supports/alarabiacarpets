"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import CallLink from "@/components/CallLink";
import WhatsAppLink from "@/components/WhatsAppLink";
import { useI18n } from "@/i18n/LocaleProvider";
import { BAR_SENDS_ADS, trackWhatsAppReopen } from "@/lib/analytics";
import { barQuoteMessage, getBarIntent } from "@/lib/bar-intent";
import { forgetTap, installTapFeedback, type FeedbackView } from "@/lib/feedback";

/**
 * The words for S1 to S4, the panels a phone shows after a WhatsApp or Call tap, and the
 * listeners lib/feedback.ts needs to know when the visitor comes back. Renders nothing:
 * StatusRegion shows the panel. Each action also closes its panel.
 */
export default function TapFeedback() {
  const { t } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const f = t.tapFeedback;
    const call = (source: string, done: () => void) => (
      <CallLink source={source} className="cta" onClick={done}>
        {t.statePanel.call}
      </CallLink>
    );
    const view: FeedbackView = (kind, tap, done) => {
      switch (kind) {
        case "s1":
          return {
            headline: f.whatsAppOpened,
            facts: <p>{f.whatsAppOpenedNext}</p>,
            // The chat was counted when it first opened: a reopen is GA4's whatsapp_reopen only.
            primary: (
              <a
                href={tap.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cta"
                onClick={() => {
                  trackWhatsAppReopen(tap.source);
                  done();
                }}
              >
                {f.backToWhatsApp}
              </a>
            ),
          };
        case "s2":
          return { headline: f.stillHere, primary: call("feedback_s2", done) };
        case "s3":
          return {
            headline: f.callBack,
            facts: <p>{t.formStates.open}</p>,
            // The bar's quote, with the bar's prefill: a new WhatsApp tap, counted for Ads
            // as the bar's taps are, since it stands in for the bar.
            primary: (
              <WhatsAppLink
                source="feedback_s3"
                conversion={BAR_SENDS_ADS}
                message={barQuoteMessage(t, getBarIntent(), window.location.pathname)}
                className="cta"
                onClick={done}
              >
                {t.nav.getFreeQuote}
              </WhatsAppLink>
            ),
          };
        case "s4":
          return { headline: f.offline, primary: call("feedback_s4", done), urgent: true };
      }
    };
    return installTapFeedback(view);
  }, [t]);

  // A tap is about the page it was made on, like the status (StatusRegion).
  useEffect(() => {
    forgetTap();
  }, [pathname]);

  return null;
}
