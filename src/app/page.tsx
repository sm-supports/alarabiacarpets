import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { buildLocalBusiness, buildOrganization, buildWebSite } from "@/lib/seo";

// Title/description come from the root layout defaults.
export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Homepage LCP candidate: the first ProductsSection showcase image.
          Page-specific, so it must not live in the root layout. */}
      <link rel="preload" as="image" href="/Products/Carpets/carpet.webp" fetchPriority="high" />
      <JsonLd data={buildOrganization()} />
      <JsonLd data={buildWebSite()} />
      <JsonLd data={buildLocalBusiness()} />
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBy />
        <ProductsSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
