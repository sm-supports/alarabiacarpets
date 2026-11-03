import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { categories } from "@/data/categories";
import {
  buildBreadcrumb,
  CITY,
  clampDescription,
  COUNTRY,
  DEFAULT_OG_IMAGES,
  EMAIL,
  OPENING_HOURS_TEXT,
  PHONE,
  SERVICE_AREAS,
  STREET,
} from "@/lib/seo";

const DESCRIPTION =
  "Contact Al Arabia Carpets in Doha for carpets, Barkia, PVC flooring, curtains, furniture and interior design. Free consultation, delivery and fitting.";

export const metadata: Metadata = {
  title: "Contact Us",
  description: clampDescription(DESCRIPTION),
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Us", description: DESCRIPTION, url: "/contact", images: DEFAULT_OG_IMAGES },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([["Contact", "/contact"]])} />
      <Navbar />
      {/* This page previously had no <h1> at all and no <main> wrapper --
          ContactSection starts at <h2>. */}
      <main className="flex-grow">
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Contact Al Arabia Carpets
            </h1>
            <p className="font-poppins max-w-2xl mx-auto text-white/80 text-sm md:text-base">
              Visit our showroom on Al Mansoura St in Doha, or reach us on WhatsApp for a
              free consultation and quote anywhere in Qatar.
            </p>
          </div>
        </div>
        <ContactSection />
        <ContactDetails />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Plain, factual detail under the form: hours, showroom, areas, what to send for
 * a quote. Every fact comes from src/lib/seo.ts or copy already on the site, so
 * it stays in step with the LocalBusiness schema.
 */
function ContactDetails() {
  const areas = `${SERVICE_AREAS.slice(0, -1).join(", ")} and ${SERVICE_AREAS[SERVICE_AREAS.length - 1]}`;
  return (
    <section className="bg-white py-14 md:py-16">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 grid gap-10 md:grid-cols-2 font-poppins text-neutral-700 leading-relaxed">
        <div>
          <h2 className="font-playfair text-2xl font-semibold text-neutral-900 mb-3">Visit our showroom in {CITY}</h2>
          <p>
            Our showroom is on {STREET}, {CITY}, {COUNTRY}. Come in to see carpet, Barkia and SPC flooring
            samples, curtain fabrics and majlis upholstery in person before you decide.
          </p>
          <h3 className="font-playfair text-lg font-semibold text-neutral-900 mt-6 mb-2">Opening hours</h3>
          <p>{OPENING_HOURS_TEXT}. You can also message us on WhatsApp at {PHONE} or email {EMAIL}.</p>
          <h3 className="font-playfair text-lg font-semibold text-neutral-900 mt-6 mb-2">Areas we serve</h3>
          <p>
            We work across {areas} and the rest of {COUNTRY}, with free delivery and installation.
          </p>
        </div>
        <div>
          <h2 className="font-playfair text-2xl font-semibold text-neutral-900 mb-3">Get an accurate quote faster</h2>
          <p>Consultation, measurement and quotes are free. To help us price your project quickly, send us:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>The room sizes or the approximate area in square metres</li>
            <li>A few photos of the space as it is now</li>
            <li>The product you have in mind, or a reference picture you like</li>
            <li>Your location in {COUNTRY} and when you would like the work done</li>
          </ul>
          <p className="mt-3">
            If you are not sure of the sizes, we can visit, take the measurements on site and recommend
            the right material for the room.
          </p>
          <h3 className="font-playfair text-lg font-semibold text-neutral-900 mt-6 mb-2">What we can help with</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/products/${category.slug}`} className="text-primary hover:underline">
                  {category.label} in {CITY}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
