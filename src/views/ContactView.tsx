import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import FaqList from "@/components/FaqList";
import { findCategory, getCategories } from "@/data/localized";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import {
  buildBreadcrumb,
  buildFaq,
  clampDescription,
  defaultOgImages,
  EMAIL,
  ogLocaleFields,
  pageAlternates,
  PHONE,
} from "@/lib/seo";

export function contactMetadata(locale: Locale): Metadata {
  const { title, description } = getDict(locale).pages.contact;
  return {
    title,
    description: clampDescription(description),
    alternates: pageAlternates("/contact", locale),
    openGraph: {
      ...ogLocaleFields(locale),
      title,
      description,
      url: localePath(locale, "/contact"),
      images: defaultOgImages(locale),
    },
  };
}

export default function ContactView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.contact;
  const price = (slug: string) => {
    const category = findCategory(locale, slug);
    if (!category?.priceFrom) throw new Error(`Category has no starting price: ${slug}`);
    return formatFromPrice(category.priceFrom, category.priceUnit, locale);
  };
  const faqs = t.home.faqs(price("carpet"), price("barkia"));
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildFaq(faqs, locale)} />
      <JsonLd data={buildBreadcrumb([[page.breadcrumb, "/contact"]], locale)} />
      <Navbar />
      {/* This page previously had no <h1> at all and no <main> wrapper --
          ContactSection starts at <h2>. */}
      <main className="flex-grow">
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="h1-band">
              {page.heading}
            </h1>
            <p className="hero-p">
              {page.intro}
            </p>
          </div>
        </div>
        <ContactSection />
        <ContactDetails locale={locale} />
        <section className="py-14 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            <h2 className="h2-sec">{t.common.faqTitle}</h2>
            <FaqList faqs={faqs} />
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

/**
 * Plain, factual detail under the form: hours, showroom, areas, what to send for
 * a quote. Every fact comes from src/lib/seo.ts or copy already on the site, so
 * it stays in step with the LocalBusiness schema.
 */
function ContactDetails({ locale }: { locale: Locale }) {
  const page = getDict(locale).pages.contact;
  return (
    <section className="bg-white py-14 md:py-16">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 grid gap-10 md:grid-cols-2 font-poppins text-neutral-700 leading-relaxed">
        <div>
          <h2 className="font-playfair text-2xl font-semibold text-neutral-900 mb-3">{page.visitTitle}</h2>
          <p>{page.visitText}</p>
          <h3 className="font-playfair text-lg font-semibold text-neutral-900 mt-6 mb-2">{page.hoursTitle}</h3>
          <p>{page.hoursText(PHONE, EMAIL)}</p>
          <h3 className="font-playfair text-lg font-semibold text-neutral-900 mt-6 mb-2">{page.areasTitle}</h3>
          <p>{page.areasText}</p>
        </div>
        <div>
          <h2 className="font-playfair text-2xl font-semibold text-neutral-900 mb-3">{page.quoteTitle}</h2>
          <p>{page.quoteText}</p>
          <ul className="list-disc ps-5 mt-3 space-y-1">
            {page.quoteItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3">{page.quoteNote}</p>
          <h3 className="font-playfair text-lg font-semibold text-neutral-900 mt-6 mb-2">{page.helpTitle}</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {getCategories(locale).map((category) => (
              <li key={category.slug}>
                <Link href={localePath(locale, `/products/${category.slug}`)} className="text-primary hover:underline">
                  {page.categoryIn(category.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
