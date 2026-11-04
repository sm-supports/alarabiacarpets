import type { Metadata, Viewport } from "next";
import type { Locale } from "@/i18n/config";
import {
  CITY,
  COUNTRY,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_TITLE,
  EMAIL,
  LATITUDE,
  LONGITUDE,
  pageAlternates,
  PHONE,
  SITE_NAME,
  SITE_NAME_AR,
  SITE_URL,
  STREET,
} from "@/lib/seo";

// Kept under 60 characters so Google does not truncate it in results.
const DEFAULT_TITLE_AR = `${SITE_NAME_AR} | سجاد وباركيه وتصميم داخلي في قطر`;
// Kept within the ~155 character budget search engines display.
const DEFAULT_DESCRIPTION_AR =
  "سجاد العربية في الدوحة: باركيه وأرضيات PVC وسجاد وموكيت وكنب مجالس وستائر وتصميم داخلي، مع توصيل وتركيب مجاني في جميع أنحاء قطر.";

/** Metadata shared by every page of a language, set in that language's root layout. */
export function rootMetadata(locale: Locale): Metadata {
  const isAr = locale === "ar";
  const siteName = isAr ? SITE_NAME_AR : SITE_NAME;
  const title = isAr ? DEFAULT_TITLE_AR : DEFAULT_TITLE;
  const description = isAr ? DEFAULT_DESCRIPTION_AR : DEFAULT_DESCRIPTION;

  return {
    // Required: without it og:image/twitter:image stay relative and most social
    // scrapers silently reject them.
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    applicationName: siteName,
    authors: [{ name: siteName }],
    keywords: isAr
      ? [
          "سجاد في قطر",
          "سجاد وموكيت في قطر",
          "باركيه قطر",
          "أرضيات PVC الدوحة",
          "ستائر قطر",
          "محلات الستائر في قطر",
          "كنب مجالس قطر",
          "تصميم داخلي الدوحة",
          "مفروشات منزلية قطر",
          "أرضيات الدوحة",
          "ستائر رول قطر",
          "عشب صناعي الدوحة",
        ]
      : [
          "carpets qatar",
          "barkia qatar",
          "pvc barkia doha",
          "curtains qatar",
          "sofas doha",
          "majlis sofas qatar",
          "interior design doha",
          "home furnishing qatar",
          "flooring doha",
          "roller blinds qatar",
          "grass carpets doha",
          "furniture qatar",
        ],
    alternates: pageAlternates("/", locale),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website",
      siteName,
      locale: isAr ? "ar_QA" : "en_US",
      url: isAr ? `${SITE_URL}/ar` : SITE_URL,
      title,
      description,
      // Site-wide share image. Pages with their own imagery (products, categories,
      // guides) override this; everything else -- the homepage included -- would
      // otherwise produce a preview card with no image at all.
      images: [{ url: DEFAULT_IMAGE, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGE],
    },
    icons: {
      icon: "/lovable-uploads/green-white-logo.webp",
      apple: "/lovable-uploads/green-white-logo.webp",
    },
    formatDetection: { telephone: false },
    appleWebApp: { capable: true, statusBarStyle: "default", title: siteName },
    // Geo and business tags have no first-class Metadata API field.
    other: {
      "geo.region": "QA",
      "geo.placename": isAr ? "الدوحة، قطر" : `${CITY}, ${COUNTRY}`,
      "geo.position": `${LATITUDE};${LONGITUDE}`,
      ICBM: `${LATITUDE}, ${LONGITUDE}`,
      "business:contact_data:street_address": isAr ? "شارع المنصورة" : STREET,
      "business:contact_data:locality": isAr ? "الدوحة" : CITY,
      "business:contact_data:region": isAr ? "قطر" : COUNTRY,
      "business:contact_data:phone_number": PHONE,
      "business:contact_data:email": EMAIL,
    },
  };
}

// Next 15 requires viewport as its own export; nesting it inside metadata warns.
export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
