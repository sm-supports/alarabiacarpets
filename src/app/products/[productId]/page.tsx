import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ProductMedia from "@/components/ProductMedia";
import RelatedProducts from "@/components/RelatedProducts";
import RelatedGuides from "@/components/RelatedGuides";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { products } from "@/data/products";
import {
  absoluteUrl,
  buildBreadcrumb,
  buildFaq,
  buildProductJsonLd,
  categoryLabel,
  clampDescription,
  productDescription,
  productImage,
  productImageAlt,
  productTitle,
} from "@/lib/seo";

// Every product page is baked at build time from src/data/products.ts.
export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

// The params above are exhaustive, so any other path is a genuine 404.
export const dynamicParams = false;

const STANDARD_FEATURES = [
  "Free installation across Qatar",
  "Free delivery to your location",
  "Expert consultation included",
  "Premium quality materials",
];

function findProduct(productId: string) {
  return products.find((p) => p.id === productId);
}

// Next 15: params is a Promise and must be awaited. Forgetting the await yields
// an undefined productId, which would silently render 43 not-found pages.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) return { title: "Product Not Found", robots: { index: false, follow: false } };

  const title = productTitle(product);
  const description = productDescription(product);
  const path = `/products/${product.id}`;

  return {
    // absolute: productTitle already accounts for the brand suffix, so the root
    // layout template must not append it again.
    title: { absolute: title },
    description: clampDescription(description),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: [{ url: absoluteUrl(productImage(product)), alt: productImageAlt(product) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(productImage(product))],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) notFound();

  const label = categoryLabel(product.category);

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd
        data={buildBreadcrumb([
          ["Products", "/products"],
          [product.name, `/products/${product.id}`],
        ])}
      />
      {product.faqs?.length ? <JsonLd data={buildFaq(product.faqs)} /> : null}

      <Navbar />
      <main className="flex-grow">
        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-5 lg:px-8">
            {/* Breadcrumb: real anchors, not a JS-only back button */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 font-poppins text-sm text-neutral-500">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/products" className="hover:text-primary">Products</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-neutral-800 font-medium">{product.name}</li>
              </ol>
            </nav>

            <div className="mb-6">
              <Button asChild variant="ghost" className="flex items-center gap-2 w-fit">
                <Link href="/products">
                  <ArrowLeft size={16} />
                  Back to Products
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
              <ProductMedia product={product} alt={productImageAlt(product)} />

              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <p className="font-poppins text-sm text-primary/70 mb-2">{label}</p>
                    <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                      {product.name}
                    </h1>
                    <p className="font-poppins font-medium text-lg text-primary">
                      {typeof product.priceFrom === "number"
                        ? `From QAR ${product.priceFrom}${product.priceUnit ? ` ${product.priceUnit}` : ""}`
                        : product.price}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">Description</h2>
                    <p className="font-poppins text-muted-foreground">{product.description}</p>
                    {product.longDescription?.map((para, i) => (
                      <p key={i} className="font-poppins text-muted-foreground mt-3">
                        {para}
                      </p>
                    ))}
                  </div>

                  {product.specs?.length ? (
                    <div className="mb-8">
                      <h2 className="font-playfair text-xl font-semibold mb-3">Specifications</h2>
                      <dl className="font-poppins text-sm divide-y divide-neutral-100 border-y border-neutral-100">
                        {product.specs.map((spec) => (
                          <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                            <dt className="text-neutral-500">{spec.label}</dt>
                            <dd className="text-neutral-900 font-medium text-right">
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}

                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">
                      What&apos;s Included
                    </h2>
                    <ul className="font-poppins space-y-2">
                      {STANDARD_FEATURES.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check size={16} className="text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-primary hover:bg-accent text-white flex items-center justify-center gap-2"
                  >
                    <WhatsAppLink
                      href={product.whatsappLink}
                      source={`product_detail:${product.id}`}
                    >
                      <ShoppingCart size={18} />
                      <span>Inquire on WhatsApp</span>
                    </WhatsAppLink>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs. Native <details> rather than a JS accordion: the answers stay in
            the DOM for crawlers and AI Overview extraction with zero JS. */}
        {product.faqs?.length ? (
          <section className="py-14 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-neutral-900">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {product.faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="font-poppins font-medium text-neutral-900 cursor-pointer list-none flex justify-between items-center gap-4">
                      <h3 className="text-base">{faq.q}</h3>
                      <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">
                        +
                      </span>
                    </summary>
                    <p className="font-poppins text-sm text-neutral-600 mt-3 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <RelatedGuides productId={product.id} />

        <RelatedProducts currentId={product.id} category={product.category} />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
              Need Help Choosing?
            </h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8">
              Our team is ready to assist you in finding the perfect product for your home.
              Contact us directly!
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <WhatsAppLink
                source={`product_detail_bottom:${product.id}`}
                className="flex items-center space-x-2"
              >
                <ShoppingCart size={16} />
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
