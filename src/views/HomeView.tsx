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
import { findCategory } from "@/data/localized";
import { formatFromPrice, getDict, localePath, type Locale } from "@/i18n";
import { buildFaq, buildLocalBusiness, buildOrganization, buildWebSite, pageAlternates } from "@/lib/seo";

// Title/description come from the root layout defaults.
export function homeMetadata(locale: Locale): Metadata {
  return {
    alternates: pageAlternates("/", locale),
  };
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
        <ProductsSection />
        <ServicesSection />
        {/* States who we are and what things cost in plain text. AI tools quote this
            kind of passage; the sections above are mostly images and short labels. */}
        <section className="py-14 md:py-16 bg-gray-50/50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl font-poppins text-neutral-700 leading-relaxed text-[15px]">
            <h2 className="h2-sec6">{t.home.aboutTitle}</h2>
            <p className="mb-4">{t.home.aboutIntro}</p>
            <ul className="space-y-3">
              {aboutItems.map((item) => (
                <li key={item.slug}>
                  <Link href={localePath(locale, `/products/${item.slug}`)} className="font-medium text-primary hover:underline">
                    {findCategory(locale, item.slug)?.label}
                  </Link>
                  {": "}
                  {item.text}
                </li>
              ))}
            </ul>
            <p className="mt-4">{t.facts.whereText}</p>
            <p className="mt-3">{t.facts.whereTrack}</p>
          </div>
        </section>
        {/* Native <details>, so the answers stay in the static HTML for crawlers. */}
        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
            <h2 className="h2-sec">
              {t.home.faqTitle}
            </h2>
            <FaqList faqs={faqs} />
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
