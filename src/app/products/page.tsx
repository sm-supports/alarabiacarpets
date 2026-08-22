import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/ProductsGrid";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { products } from "@/data/products";
import { buildBreadcrumb, buildItemList, clampDescription, productPath } from "@/lib/seo";
import WhatsAppLink from "@/components/WhatsAppLink";

const DESCRIPTION =
  "Browse premium carpets, Barkia, PVC flooring, curtains, furniture & interior design products at Al Arabia Carpets. Free installation & delivery across Qatar.";

export const metadata: Metadata = {
  title: "Products",
  description: clampDescription(DESCRIPTION),
  alternates: { canonical: "/products" },
  openGraph: { title: "Products", description: DESCRIPTION, url: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([["Products", "/products"]])} />
      <JsonLd
        data={buildItemList(
          products.map((p) => ({ name: p.name, path: productPath(p) }))
        )}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Header */}
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Our Products
            </h1>
            <p className="font-poppins max-w-2xl mx-auto text-white/80 text-sm md:text-base">
              Browse our complete collection of premium home furnishings and decor products.
              All products come with free installation and delivery in Qatar.
            </p>
          </div>
        </div>

        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4">
            <ProductsGrid products={products} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              Contact us directly through WhatsApp and our team will help you find the
              perfect solution for your home.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <WhatsAppLink source="products_page" className="flex items-center space-x-2">
                <Phone size={16} />
                <span>Contact Us on WhatsApp</span>
              </WhatsAppLink>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
