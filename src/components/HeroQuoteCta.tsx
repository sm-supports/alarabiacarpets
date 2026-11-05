import { MessageCircle } from "@/components/icons";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getDict, type Locale } from "@/i18n";

/**
 * Above-the-fold quote CTA for landing pages that ads point to: an optional
 * starting price and a pre-filled WhatsApp button. `source` keeps the existing
 * analytics naming (e.g. "category:carpet:hero") so conversions split per page.
 */
export default function HeroQuoteCta({
  locale,
  source,
  message,
  price,
}: {
  locale: Locale;
  source: string;
  message: string;
  price?: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 font-poppins">
      {price && (
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">{price}</span>
      )}
      <WhatsAppLink
        source={source}
        message={message}
        className="inline-flex items-center gap-2 rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span>{getDict(locale).common.heroQuote}</span>
      </WhatsAppLink>
    </div>
  );
}
