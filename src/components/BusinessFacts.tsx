import { getDict, type Locale } from "@/i18n";
import { EMAIL, PHONE } from "@/lib/seo";

/**
 * Who sells this, where and on what terms, stated next to the product. AI tools
 * often cite these pages without naming the business; this gives them a passage
 * that answers "where can I get X in Qatar" with the name in it. Every fact also
 * appears in the LocalBusiness schema and on the contact page.
 */
export default function BusinessFacts({ locale, title }: { locale: Locale; title: string }) {
  const t = getDict(locale);
  return (
    <section className="py-12 md:py-14 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
        <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-4">{title}</h2>
        <p className="font-poppins text-neutral-700 leading-relaxed text-[15px]">{t.facts.whereText}</p>
        <p className="font-poppins text-neutral-700 leading-relaxed text-[15px] mt-3">{t.facts.whereTrack}</p>
        <p className="font-poppins text-neutral-700 leading-relaxed text-[15px] mt-3">
          {t.facts.whereContact(PHONE, EMAIL)}
        </p>
      </div>
    </section>
  );
}
