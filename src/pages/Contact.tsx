import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ContactSection from "@/components/ContactSection";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contact Us"
        description="Contact Al Arabia Carpets in Doha, Qatar. Get a free quote for carpets, Barkia, curtains, furniture & interior design. WhatsApp +974 5551 2858."
        path="/contact"
      />
      <Navbar />
      <ContactSection />
  <Footer />
    </div>
  );
};

export default Contact;

