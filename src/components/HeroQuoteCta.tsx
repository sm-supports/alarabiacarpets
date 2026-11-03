import { MessageCircle } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";

/**
 * Above-the-fold quote CTA for landing pages that ads point to: an optional
 * starting price and a pre-filled WhatsApp button. `source` keeps the existing
 * analytics naming (e.g. "category:carpet:hero") so conversions split per page.
 */
export default function HeroQuoteCta({ source, message, price }: { source: string; message: string; price?: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 font-poppins">
      {price && (
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">{price}</span>
      )}
      <WhatsAppLink
        source={source}
        message={message}
        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span>Get a free quote on WhatsApp</span>
      </WhatsAppLink>
    </div>
  );
}
