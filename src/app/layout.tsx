import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "@/index.css";
import Providers from "./providers";
import Analytics from "@/components/Analytics";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  CITY,
  COUNTRY,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  EMAIL,
  LATITUDE,
  LONGITUDE,
  PHONE,
  SITE_NAME,
  SITE_URL,
  STREET,
} from "@/lib/seo";

// Self-hosted at build time into out/_next/static/media/, replacing the
// render-blocking @import + <link rel=preload> pair the old index.html used.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  // Required: without it og:image/twitter:image stay relative and most social
  // scrapers silently reject them.
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
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
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  icons: {
    icon: "/lovable-uploads/green-white-logo.webp",
    apple: "/lovable-uploads/green-white-logo.webp",
  },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, statusBarStyle: "default", title: SITE_NAME },
  // Geo and business tags have no first-class Metadata API field.
  other: {
    "geo.region": "QA",
    "geo.placename": `${CITY}, ${COUNTRY}`,
    "geo.position": `${LATITUDE};${LONGITUDE}`,
    ICBM: `${LATITUDE}, ${LONGITUDE}`,
    "business:contact_data:street_address": STREET,
    "business:contact_data:locality": CITY,
    "business:contact_data:region": COUNTRY,
    "business:contact_data:phone_number": PHONE,
    "business:contact_data:email": EMAIL,
  },
};

// Next 15 requires viewport as its own export; nesting it inside metadata warns.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <WhatsAppFloat />
        <Analytics />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
