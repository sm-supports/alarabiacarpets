"use client";

import { localePath } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";
import { trackWhatsAppClick } from "@/lib/analytics";
import { reportTap } from "@/lib/tap";
import { WHATSAPP_URL } from "@/lib/site";

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Where the click came from, e.g. "products_page". */
  source: string;
  /** Prefilled message. Ignored when `href` is given. */
  message?: string;
  /** False when the tap isn't a new lead (the Sent panel's follow-up): no Ads conversion. */
  conversion?: boolean;
  /** The link before hydration, in place of the contact page: the action bar's in-page anchor on /contact. */
  staticHref?: string;
  children: React.ReactNode;
}

/**
 * Tracked WhatsApp anchor -- every WhatsApp CTA on the site goes through this.
 *
 * Exists so server-component pages can render a WhatsApp CTA: onClick handlers
 * can only live in a client component, and this keeps the boundary at the link
 * itself rather than forcing a whole page to go client.
 *
 * The static HTML links to the contact page in the page's language; the wa.me
 * URL is only set once React has hydrated. WhatsApp answers site-audit crawlers
 * with 429 on any wa.me URL, bare or prefilled, so Semrush (which crawls without
 * JS) reported one broken external link on every page. Visitors get the real
 * link a moment after load, so hover, copy-link and long-press all show it.
 *
 * A tap is also reported (lib/tap.ts) to lib/feedback.ts, which on a phone may then say
 * whether WhatsApp opened (S1, S2, S4). The tap itself is never held back.
 */
export default function WhatsAppLink({
  source,
  message,
  href,
  conversion = true,
  staticHref,
  children,
  ...rest
}: WhatsAppLinkProps) {
  const locale = useLocale();
  // false on the server and during hydration, true afterwards -- without the
  // mismatch a setState-in-effect would risk.
  const hydrated = useHydrated();
  const target =
    href ??
    `${WHATSAPP_URL}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={hydrated ? target : staticHref ?? localePath(locale, "/contact")}
      {...(hydrated && { target: "_blank", rel: "noopener noreferrer" })}
      {...rest}
      onClick={(e) => {
        trackWhatsAppClick(source, conversion);
        // Before hydration the link goes to the contact page, not WhatsApp.
        if (hydrated) reportTap({ kind: "whatsapp", link: e.currentTarget, href: target, source });
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
