import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, clampDescription, DEFAULT_OG_IMAGES } from "@/lib/seo";

const DESCRIPTION =
  "Contact Al Arabia Carpets in Doha, Qatar for carpets, Barkia, PVC flooring, curtains, furniture and interior design. Free consultation, installation and delivery.";

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
      </main>
      <Footer />
    </div>
  );
}
