import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getGuides } from "@/data/localized";
import { fullImagePath } from "@/lib/card-image";
import { getDict, localePath, type Locale } from "@/i18n";
import {
  buildBreadcrumb,
  buildItemList,
  clampDescription,
  defaultOgImages,
  ogLocaleFields,
  pageAlternates,
} from "@/lib/seo";

export function guidesIndexMetadata(locale: Locale): Metadata {
  const { title, description } = getDict(locale).pages.guides;
  return {
    title,
    description: clampDescription(description),
    alternates: pageAlternates("/guides", locale),
    openGraph: {
      ...ogLocaleFields(locale),
      title,
      description,
      url: localePath(locale, "/guides"),
      images: defaultOgImages(locale),
    },
  };
}

export default function GuidesIndexView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.guides;
  const guides = getGuides(locale);
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([[t.common.guides, "/guides"]], locale)} />
      <JsonLd
        data={buildItemList(
          guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })),
          locale
        )}
      />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="h1-band">
              {page.heading}
            </h1>
            <p className="hero-p">
              {page.intro}
            </p>
            <p className="hero-p mt-3">
              {t.facts.guideSummary}
            </p>
          </div>
        </div>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => {
                const href = localePath(locale, `/guides/${guide.slug}`);
                return (
                  <article
                    key={guide.slug}
                    className="idx-card"
                  >
                    <Link href={href} className="block group">
                      <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                        <img
                          src={fullImagePath(guide.heroImage)}
                          alt={guide.heroImageAlt}
                          loading="lazy"
                          decoding="async"
                          className="rel-img"
                        />
                      </div>
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="idx-title">
                        <Link href={href} className="hover:text-primary transition-colors">
                          {guide.title}
                        </Link>
                      </h2>
                      <p className="idx-text">
                        {guide.excerpt}
                      </p>
                      <Link
                        href={href}
                        className="font-poppins text-sm font-medium text-primary mt-4 hover:underline"
                      >
                        {t.guide.read}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
