import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/ProductsGrid";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import Link from "next/link";
import { buildBreadcrumb, buildItemList, clampDescription, productPath, DEFAULT_OG_IMAGES } from "@/lib/seo";
import WhatsAppLink from "@/components/WhatsAppLink";

const DESCRIPTION =
  "Browse premium carpets, Barkia, PVC flooring, curtains, furniture & interior design products at Al Arabia Carpets. Free installation & delivery across Qatar.";

export const metadata: Metadata = {
  title: "Products",
  description: clampDescription(DESCRIPTION),
  alternates: { canonical: "/products" },
  openGraph: { title: "Products", description: DESCRIPTION, url: "/products", images: DEFAULT_OG_IMAGES },
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

        {/* Shop by category -- makes /products a hub that links down to the
            landing pages rather than a competitor for the same queries. */}
        <section className="py-10 md:py-12 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
              Shop by category
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  className="group block rounded-xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={c.heroImage}
                      alt={c.heroImageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-playfair text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                      {c.label}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
