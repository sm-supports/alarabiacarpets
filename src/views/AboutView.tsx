import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import BusinessFacts from "@/components/BusinessFacts";
import JsonLd from "@/components/JsonLd";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getDict, localePath, type Locale } from "@/i18n";
import { buildBreadcrumb, clampDescription, defaultOgImages, ogLocaleFields, pageAlternates } from "@/lib/seo";

export function aboutMetadata(locale: Locale): Metadata {
  const { title, description } = getDict(locale).pages.about;
  return {
    title,
    description: clampDescription(description),
    alternates: pageAlternates("/about", locale),
    openGraph: {
      ...ogLocaleFields(locale),
      title,
      description,
      url: localePath(locale, "/about"),
      images: defaultOgImages(locale),
    },
  };
}

export default function AboutView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const page = t.pages.about;
  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={buildBreadcrumb([[page.breadcrumb, "/about"]], locale)} />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">{page.heading}</h1>
            <p className="font-poppins max-w-2xl mx-auto">{page.intro}</p>
          </div>
        </div>

        {/* About Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6">{page.storyTitle}</h2>
                <p className="font-poppins mb-4">{page.story[0]}</p>
                <p className="font-poppins mb-4">{page.story[1]}</p>
                <p className="font-poppins">{page.story[2]}</p>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 rounded-full overflow-hidden bg-secondary">
                    <AspectRatio ratio={1/1} className="w-full h-full">
                      <img
                        src="/About Al Arabia Carpets.webp"
                        alt={page.imageAlt}
                        className="w-full h-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">{page.valuesTitle}</h2>
              <p className="font-poppins max-w-2xl mx-auto">{page.valuesIntro}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {page.values.map((value) => (
                <Card key={value.title} className="p-6 text-center h-full">
                  <h3 className="font-playfair text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="font-poppins text-muted-foreground">{value.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">{page.whyTitle}</h2>
              <p className="font-poppins max-w-2xl mx-auto">{page.whyIntro}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {page.why.map((item) => (
                <Card key={item.title} className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="font-poppins text-muted-foreground">{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <BusinessFacts locale={locale} title={page.factsTitle} />

        {/* Contact CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">{page.ctaTitle}</h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8">{page.ctaText}</p>
            <WhatsAppLink
              source="about_page"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary rounded-md hover:bg-white/90 transition-colors font-poppins font-medium"
            >
              {t.common.contactOnWhatsApp}
            </WhatsAppLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
