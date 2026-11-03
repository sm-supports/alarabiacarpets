"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/lib/seo";

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Where the click came from, e.g. "products_page". */
  source: string;
  /** Prefilled message. Ignored when `href` is given. */
  message?: string;
  children: React.ReactNode;
}

/**
 * Tracked WhatsApp anchor -- every WhatsApp CTA on the site goes through this.
 *
 * Exists so server-component pages can render a WhatsApp CTA: onClick handlers
 * can only live in a client component, and this keeps the boundary at the link
 * itself rather than forcing a whole page to go client.
 *
 * The static HTML carries the bare chat link; the prefilled `?text=` URL is
 * swapped in on pointerdown/click, before the browser follows the link. Each
 * distinct `?text=` URL is a separate external link to crawlers, and WhatsApp
 * answers a site audit's burst of them with 429, which Semrush reports as
 * dozens of broken links. One bare URL in the markup avoids that.
 */
export default function WhatsAppLink({
  source,
  message,
  href,
  children,
  ...rest
}: WhatsAppLinkProps) {
  const target =
    href ??
    `${WHATSAPP_URL}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  const prefilled = target.startsWith(`${WHATSAPP_URL}?`);

  const applyPrefill = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    if (prefilled) e.currentTarget.href = target;
  };

  return (
    <a
      href={prefilled ? WHATSAPP_URL : target}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
      onPointerDown={(e) => {
        applyPrefill(e);
        rest.onPointerDown?.(e);
      }}
      onClick={(e) => {
        applyPrefill(e);
        trackWhatsAppClick(source);
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
