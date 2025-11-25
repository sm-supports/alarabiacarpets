import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section - Full viewport immersive intro */}
        <HeroSection />
        
        {/* Trusted By - Social proof with partner logos */}
        <TrustedBy />
        
        {/* Products Section - Apple-style product showcases */}
        <section id="products">
          <ProductsSection />
        </section>
        
        {/* Services Section - Why choose us */}
        <section id="services">
          <ServicesSection />
        </section>
        
        {/* Contact Section - CTA and contact form */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
