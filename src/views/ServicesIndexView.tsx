import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { getServices } from "@/data/localized";
import { fullImagePath } from "@/lib/card-image";
import { getDict, localePath, type Locale } from "@/i18n";
import {
  buildBreadcrumb,
  buildCollectionPage,
  clampDescription,
  defaultOgImages,
  ogLocaleFields,
  pageAlternates,
} from "@/lib/seo";

export function servicesIndexMetadata(locale: Locale): Metadata {
  const { title, description } = getDict(locale).pages.services;
  return {
    title,
    description: clampDescription(description),
    alternates: pageAlternates("/services", locale),
    openGraph: {
      ...ogLocaleFields(locale),
      title,
      description,
      url: localePath(locale, "/services"),
      images: defaultOgImages(locale),
    },
  };
}

export default function ServicesIndexView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.services;
  const services = getServices(locale);
  const crumbs: Crumb[] = [[t.common.services, "/services"]];
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd
        data={buildCollectionPage(
          {
            name: page.title,
            description: page.description,
            path: "/services",
            items: services.map((s) => ({ name: s.heading, path: `/services/${s.slug}` })),
          },
          locale
        )}
      />
      <JsonLd data={buildBreadcrumb(crumbs, locale)} />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4 md:text-center">
            <Breadcrumb locale={locale} trail={crumbs} dark phoneOnly />
            <h1 className="h1-band">
              {page.heading}
            </h1>
            <p className="hero-p">
              {page.intro}
            </p>
            <p className="hero-p mt-3">
              {page.summary}
            </p>
          </div>
        </div>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            {/* Cards show a photo only where the service has one. wallpaper and
                kitchen-cabinets stay text-only until real photos exist. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => {
                const href = localePath(locale, `/services/${service.slug}`);
                return (
                  <article
                    key={service.slug}
                    className="idx-card2"
                  >
                    {service.heroImage && (
                      <Link href={href} className="block group">
                        <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                          <img
                            src={fullImagePath(service.heroImage)}
                            alt={service.heroImageAlt ?? service.heading}
                            loading="lazy"
                            decoding="async"
                            className="rel-img"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="idx-h2">
                        <Link href={href} className="hover:text-primary transition-colors">
                          {service.heading}
                        </Link>
                      </h2>
                      <p className="idx-text">
                        {service.excerpt}
                      </p>
                      <Link
                        href={href}
                        className="idx-more"
                      >
                        {t.service.viewDetails(service.label)}
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
