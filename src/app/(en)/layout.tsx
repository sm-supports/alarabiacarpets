import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "@/index.css";
import Providers from "@/app/providers";
import AdLanguage from "@/components/AdLanguage";
import Analytics from "@/components/Analytics";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LocaleProviderEn from "@/i18n/LocaleProviderEn";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";

// Self-hosted at build time into out/_next/static/media/, replacing the
// render-blocking @import + <link rel=preload> pair the old index.html used.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// Only the regular and medium body weights are preloaded: they are what the first
// screen is set in. The heavier two are declared under the same "Poppins" family by
// the second call and download when something on the page uses them.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

// next/font needs the call assigned and its class used, or the faces are dropped.
const poppinsHeavy = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins-heavy",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = rootMetadata("en");

export const viewport = rootViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${poppinsHeavy.variable}`}>
      <body>
        <LocaleProviderEn>
          <Providers>{children}</Providers>
          <WhatsAppFloat />
        </LocaleProviderEn>
        <AdLanguage />
        <Analytics />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
