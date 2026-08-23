import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { services } from "@/data/services";
import { buildBreadcrumb, buildCollectionPage, clampDescription, DEFAULT_OG_IMAGES } from "@/lib/seo";

const DESCRIPTION =
  "Wallpaper, kitchen cabinets, wardrobes and parquet flooring supplied and installed across Qatar by Al Arabia Carpets in Doha.";

export const metadata: Metadata = {
  title: "Services",
  description: clampDescription(DESCRIPTION),
  alternates: { canonical: "/services" },
  openGraph: { title: "Services", description: DESCRIPTION, url: "/services", images: DEFAULT_OG_IMAGES },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd
        data={buildCollectionPage({
          name: "Services",
          description: DESCRIPTION,
          path: "/services",
          items: services.map((s) => ({ name: s.heading, path: `/services/${s.slug}` })),
        })}
      />
      <JsonLd data={buildBreadcrumb([["Services", "/services"]])} />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Services
            </h1>
            <p className="font-poppins max-w-2xl mx-auto text-white/80 text-sm md:text-base">
              Fit-out work we carry out to measure, alongside our flooring, curtain and
              furniture ranges. Free survey and quotation anywhere in Qatar.
            </p>
          </div>
        </div>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            {/* Cards show a photo only where the service has one. wallpaper and
                kitchen-cabinets stay text-only until real photos exist. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <article
                  key={service.slug}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md"
                >
                  {service.heroImage && (
                    <Link href={`/services/${service.slug}`} className="block group">
                      <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                        <img
                          src={service.heroImage}
                          alt={service.heroImageAlt ?? service.heading}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                  <h2 className="font-playfair text-xl font-semibold text-neutral-900 mb-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.heading}
                    </Link>
                  </h2>
                  <p className="font-poppins text-sm text-neutral-500 flex-grow leading-relaxed">
                    {service.excerpt}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-poppins text-sm font-medium text-primary mt-4 hover:underline"
                  >
                    Read more
                  </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
