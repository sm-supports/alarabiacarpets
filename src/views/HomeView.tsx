import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";
import Link from "next/link";
import { findCategory, findProduct, findService } from "@/data/localized";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import { buildFaq, buildLocalBusiness, buildOrganization, buildWebSite, pageAlternates } from "@/lib/seo";

// Title/description come from the root layout defaults.
export function homeMetadata(locale: Locale): Metadata {
  return {
    alternates: pageAlternates("/", locale),
  };
}

// One link for each keyword page with no tile higher up the home page.
const KEYWORD_LINKS: Array<{ service: string } | { product: string }> = [
  { product: "event-normal-carpet" },
  { service: "office-carpet" },
  { service: "vinyl-flooring" },
  { product: "pvc-barkia" },
  { service: "parquet-flooring" },
  { service: "wallpaper" },
  { service: "gypsum-c-board-fixing" },
  { service: "sofa-making" },
  { service: "sofa-upholstery" },
  { service: "cabinets" },
  { service: "kitchen-cabinets" },
  { service: "wardrobes" },
  { service: "tv-unit-design" },
];

function keywordLinks(locale: Locale) {
  return KEYWORD_LINKS.map((link) => {
    if ("service" in link) {
      const service = findService(locale, link.service);
      if (!service) throw new Error(`Unknown service slug: ${link.service}`);
      return { href: `/services/${service.slug}`, label: service.label };
    }
    const product = findProduct(locale, link.product);
    if (!product) throw new Error(`Unknown product id: ${link.product}`);
    return { href: `/products/${product.id}`, label: product.name };
  });
}

function categoryPrice(locale: Locale, slug: string): string {
  const category = findCategory(locale, slug);
  if (!category?.priceFrom) throw new Error(`Category has no starting price: ${slug}`);
  return formatFromPrice(category.priceFrom, category.priceUnit, locale);
}

export default function HomeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const faqs = t.home.faqs(categoryPrice(locale, "carpet"), categoryPrice(locale, "barkia"));
  const aboutItems = t.home.aboutItems({
    carpet: categoryPrice(locale, "carpet"),
    barkia: categoryPrice(locale, "barkia"),
    curtain: categoryPrice(locale, "curtain"),
    "majlis-sofa": categoryPrice(locale, "majlis-sofa"),
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd data={buildOrganization(locale)} />
      <JsonLd data={buildWebSite(locale)} />
      <JsonLd data={buildLocalBusiness(locale)} />
      <JsonLd data={buildFaq(faqs, locale)} />
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBy />
        <ProductsSection locale={locale} />
        <ServicesSection locale={locale} />
        {/* States who we are and what things cost in plain text. AI tools quote this
            kind of passage; the sections above are mostly images and short labels. */}
        <section className="py-10 md:py-16 bg-gray-50/50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl font-poppins text-neutral-700 leading-relaxed text-[15px]">
            {/* On phones the passage folds, its heading the toggle (.fold in index.css):
                the intro, the ranges with their prices and the showroom paragraphs. The
                keyword chips below stay open. From md it is all open, as before. */}
            <details className="fold">
              <summary><h2 className="h2-sec6">{t.home.aboutTitle}</h2></summary>
            </details>
            <div className="fold-body">
              <p className="mb-4">{t.home.aboutIntro}</p>
              <ul className="space-y-3">
                {aboutItems.map((item) => (
                  <li key={item.slug}>
                    <Link href={localePath(locale, `/products/${item.slug}`)} className="font-medium text-primary hover:underline">
                      {findCategory(locale, item.slug)?.heading}
                    </Link>
                    {": "}
                    {item.text}
                  </li>
                ))}
              </ul>
              <p className="mt-4">{t.facts.whereText}</p>
              <p className="mt-3">{t.facts.whereTrack}</p>
            </div>
            <h3 className="font-playfair text-xl font-bold text-neutral-900 mt-8 mb-4">{t.home.moreWorkTitle}</h3>
            <div className="flex flex-wrap gap-3">
              {keywordLinks(locale).map((link) => (
                <Link key={link.href} href={localePath(locale, link.href)} className="chip-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Native <details>, so the answers stay in the static HTML for crawlers. */}
        <section className="py-10 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            <h2 className="h2-sec faq-h">
              {t.home.faqTitle}
            </h2>
            <FaqList faqs={faqs} />
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
