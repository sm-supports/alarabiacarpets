import WhatsAppIcon from "@/components/WhatsAppIcon";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getDict, type Locale } from "@/i18n";

/**
 * Above-the-fold quote CTA for landing pages that ads point to: an optional
 * starting price and a pre-filled WhatsApp button. `source` keeps the existing
 * analytics naming (e.g. "category:carpet:hero") so conversions split per page.
 * The band is forest, so the button is .cta-dark; 40px tall from md, as before.
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
    <div className="hq">
      {price && <span className="price-chip">{price}</span>}
      <WhatsAppLink source={source} message={message} className="cta-dark cta-s">
        <WhatsAppIcon />
        {getDict(locale).common.heroQuote}
      </WhatsAppLink>
    </div>
  );
}
