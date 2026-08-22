import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { guides } from "@/data/guides";
import { buildBreadcrumb, buildItemList, clampDescription, DEFAULT_OG_IMAGES } from "@/lib/seo";

const DESCRIPTION =
  "Practical guides to carpets, barkia flooring, curtains and majlis design in Qatar, written by the Al Arabia Carpets team in Doha.";

export const metadata: Metadata = {
  title: "Guides",
  description: clampDescription(DESCRIPTION),
  alternates: { canonical: "/guides" },
  openGraph: { title: "Guides", description: DESCRIPTION, url: "/guides", images: DEFAULT_OG_IMAGES },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([["Guides", "/guides"]])} />
      <JsonLd
        data={buildItemList(
          guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` }))
        )}
      />
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Guides
            </h1>
            <p className="font-poppins max-w-2xl mx-auto text-white/80 text-sm md:text-base">
              Practical advice on choosing carpets, barkia flooring, curtains and majlis
              furniture for homes and offices in Qatar.
            </p>
          </div>
        </div>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <article
                  key={guide.slug}
                  className="bg-white rounded-xl overflow-hidden border border-neutral-200 flex flex-col transition-all duration-300 hover:shadow-md"
                >
                  <Link href={`/guides/${guide.slug}`} className="block group">
                    <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                      <img
                        src={guide.heroImage}
                        alt={guide.heroImageAlt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="font-playfair text-lg font-semibold text-neutral-900 mb-2">
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {guide.title}
                      </Link>
                    </h2>
                    <p className="font-poppins text-sm text-neutral-500 flex-grow leading-relaxed">
                      {guide.excerpt}
                    </p>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="font-poppins text-sm font-medium text-primary mt-4 hover:underline"
                    >
                      Read the guide
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
