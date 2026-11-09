import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import Link from "next/link";
import FaqList from "@/components/FaqList";
import CallLink from "@/components/CallLink";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Mail, MapPin, Phone } from "@/components/icons";
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

const MAPS_URL = "https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar";

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

/**
 * One screen from lg: the h1, four contact tiles and the hours line beside the form, with
 * the showroom details, quote tips and FAQs in closed panels under the tiles. Phones get
 * the h1 and tiles, then the form, then the panels. The panels' text is in the HTML, so
 * crawlers, the FAQ markup and the text-to-HTML check still read it.
 */
export default function ContactView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.contact;
  const price = (slug: string) => {
    const category = findCategory(locale, slug);
    if (!category?.priceFrom) throw new Error(`Category has no starting price: ${slug}`);
    return formatFromPrice(category.priceFrom, category.priceUnit, locale);
  };
  const faqs = t.home.faqs(price("carpet"), price("barkia"));
  const crumbs: Crumb[] = [[page.breadcrumb, "/contact"]];

  const intro = (
    <>
      <Breadcrumb locale={locale} trail={crumbs} dark phoneOnly />
      <h1 className="ct-h1">{page.heading}</h1>
      <p className="ct-intro">{page.intro}</p>
      <ul className="ct-tiles">
        <li>
          <WhatsAppLink source="contact_page_whatsapp" className="ct-tile ct-tile-main">
            <WhatsAppIcon className="ct-tile-icon" />
            {/* The site's one WhatsApp CTA label (scripts/check-consistency.mjs). */}
            <span className="ct-tile-label">{t.common.heroQuote}</span>
          </WhatsAppLink>
        </li>
        <li>
          <CallLink source="contact_page_call" className="ct-tile">
            <Phone className="ct-tile-icon" />
            <span className="ct-tile-text">
              <span className="ct-tile-label">{page.call}</span>
              <bdi dir="ltr" className="ct-tile-value">{PHONE}</bdi>
            </span>
          </CallLink>
        </li>
        <li>
          <a href={`mailto:${EMAIL}`} className="ct-tile">
            <Mail className="ct-tile-icon" />
            <span className="ct-tile-text">
              <span className="ct-tile-label">{page.email}</span>
              <bdi dir="ltr" className="ct-tile-value">{EMAIL}</bdi>
            </span>
          </a>
        </li>
        <li>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="ct-tile">
            <MapPin className="ct-tile-icon" />
            <span className="ct-tile-text">
              <span className="ct-tile-label">{page.directions}</span>
              <span className="ct-tile-value">{page.showroomShort}</span>
            </span>
          </a>
        </li>
      </ul>
      <p className="ct-hours">{page.hoursLine}</p>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildFaq(faqs, locale)} />
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      <Navbar />
      <main className="flex-grow">
        <ContactSection layout="page" intro={intro}>
          <div className="ct-folds">
            <details className="ct-fold">
              <summary><h2 className="ct-fold-h">{page.visitTitle}</h2></summary>
              <div className="ct-fold-body">
                <p>{page.visitText}</p>
                <h3>{page.hoursTitle}</h3>
                <p>{page.hoursText(PHONE, EMAIL)}</p>
                <h3>{page.areasTitle}</h3>
                <p>{page.areasText}</p>
              </div>
            </details>
            <details className="ct-fold">
              <summary><h2 className="ct-fold-h">{page.quoteTitle}</h2></summary>
              <div className="ct-fold-body">
                <p>{page.quoteText}</p>
                <ul className="list-disc ps-5 space-y-1">
                  {page.quoteItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{page.quoteNote}</p>
                <h3>{page.helpTitle}</h3>
                <ul className="cat-links">
                  {getCategories(locale).map((category) => (
                    <li key={category.slug}>
                      <Link href={localePath(locale, `/products/${category.slug}`)}>
                        {page.categoryIn(category.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
            <details className="ct-fold">
              <summary><h2 className="ct-fold-h">{t.common.faqTitle}</h2></summary>
              <div className="ct-fold-body">
                <FaqList faqs={faqs} />
              </div>
            </details>
          </div>
        </ContactSection>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
