"use client";

import { trackPhoneClick } from "@/lib/analytics";
import { reportTap } from "@/lib/tap";
import { PHONE_E164 } from "@/lib/site";

interface CallLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Where the tap came from, e.g. "sticky_bar_call:product:carpet". */
  source: string;
  children: React.ReactNode;
}

/**
 * Tracked tel: link. A plain anchor in the static HTML, so it calls with JavaScript off
 * and before hydration; the tap is recorded in GA4 only (CONVERSION_LABELS.phoneClick).
 * On a phone, coming back within 20 s offers the other route (S3 in lib/feedback.ts).
 */
export default function CallLink({ source, children, ...rest }: CallLinkProps) {
  return (
    <a
      href={`tel:${PHONE_E164}`}
      {...rest}
      onClick={(e) => {
        trackPhoneClick(source);
        reportTap({ kind: "call", link: e.currentTarget });
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
