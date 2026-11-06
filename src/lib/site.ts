/**
 * Contact constants with no imports, so client components can use them without
 * pulling the rest of seo.ts (and the category data it imports) into the browser.
 * seo.ts re-exports them for server code.
 */
export const PHONE = "+974 5551 2858";
export const PHONE_E164 = "+97455512858";
/**
 * WhatsApp click-to-chat link. wa.me's documented format is the number without
 * "+", spaces or dashes; the "+" form redirects too, but audit crawlers report it
 * as a broken external link.
 */
export const WHATSAPP_URL = `https://wa.me/${PHONE_E164.replace(/\D/g, "")}`;
export const EMAIL = "info@alarabiacarpets.com";
