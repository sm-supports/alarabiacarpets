"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { PHONE_E164 } from "@/lib/seo";

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Where the click came from, e.g. "products_page". */
  source: string;
  /** Prefilled message. Ignored when `href` is given. */
  message?: string;
  children: React.ReactNode;
}

/**
 * Tracked WhatsApp anchor.
 *
 * Exists so server-component pages can render a WhatsApp CTA: onClick handlers
 * can only live in a client component, and this keeps the boundary at the link
 * itself rather than forcing a whole page to go client.
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
    `https://wa.me/${PHONE_E164}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(source)}
      {...rest}
    >
      {children}
    </a>
  );
}
