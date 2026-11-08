"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import CallLink from "@/components/CallLink";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Phone } from "@/components/icons";
import { useI18n } from "@/i18n/LocaleProvider";
import { stripLocale } from "@/i18n/config";
import { useHydrated } from "@/hooks/use-hydrated";
import { BAR_SENDS_ADS } from "@/lib/analytics";
import { barQuoteMessage, useBarIntent } from "@/lib/bar-intent";

const WIDE = "(min-width: 768px)";

function subscribeWide(onChange: () => void) {
  const query = matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** At md and up the bar is the WhatsApp pill. False on the server: the static HTML is the phone's. */
function useWide(): boolean {
  return useSyncExternalStore(subscribeWide, () => matchMedia(WIDE).matches, () => false);
}

/**
 * The action bar, on every page (both root layouts render it, from their client.ts).
 *
 * Below md: Call and Get a Free Quote across the bottom of the screen, 64px plus the safe
 * area, with Call first so Arabic mirrors it. At md and up the same markup is the green
 * WhatsApp pill at the bottom left, as before, with Call hidden (.ab in src/index.css).
 *
 * Both work in the static HTML: Call is a plain tel: link, and the quote link goes to the
 * contact page until hydration (WhatsAppLink), or on the contact page to its form. Once
 * hydrated it opens WhatsApp with the quote line, a size line to fill in, and the page
 * (origin and path only, so gclid and lang=en stay out of the customer's chat).
 */
export default function WhatsAppFloat() {
  const { t } = useI18n();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const wide = useWide();
  const intent = useBarIntent();

  const page = stripLocale(pathname);
  const type = intent?.type ?? "page";
  const slug = intent?.slug ?? (page.slice(1) || "home");
  const message = !hydrated
    ? undefined
    : wide
      ? t.common.floatMessage
      : barQuoteMessage(t, intent, pathname);

  return (
    <div data-action-bar="" className="ab">
      <CallLink source={`sticky_bar_call:${type}:${slug}`} className="ab-call">
        <Phone className="ab-ico" />
        {t.statePanel.call}
      </CallLink>
      <WhatsAppLink
        source={wide ? "floating_button" : `sticky_bar:${type}:${slug}`}
        message={message}
        conversion={BAR_SENDS_ADS}
        staticHref={page === "/contact" ? "#contact-form" : undefined}
        aria-label={wide ? t.common.floatLabel : undefined}
        className="ab-wa"
      >
        <WhatsAppIcon className="ab-ico" />
        <span className="ab-q">{t.nav.getFreeQuote}</span>
        <span className="ab-p">{t.contactSection.whatsapp}</span>
      </WhatsAppLink>
    </div>
  );
}
