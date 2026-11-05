import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "@/index.css";
import Providers from "@/app/providers";
import AdLanguage from "@/components/AdLanguage";
import Analytics from "@/components/Analytics";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";

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
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = rootMetadata("en");

export const viewport = rootViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <LocaleProvider locale="en">
          <Providers>{children}</Providers>
          <WhatsAppFloat />
        </LocaleProvider>
        <AdLanguage />
        <Analytics />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
