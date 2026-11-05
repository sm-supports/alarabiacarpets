import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import "@/index.css";
import Providers from "@/app/providers";
import Analytics from "@/components/Analytics";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import WebVitals from "@/components/WebVitals";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LocaleProviderAr from "@/i18n/LocaleProviderAr";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";

// Mapped onto the same CSS variables as the English fonts, so the existing
// font-playfair / font-poppins classes render Arabic faces without any changes.
//
// `subsets` only chooses which files are preloaded; every subset stays declared in
// the CSS. Arabic pages preload the Arabic files, and the Latin ones (digits, phone
// numbers, "PVC") download when the page first needs them.
const elMessiri = El_Messiri({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = rootMetadata("ar");

export const viewport = rootViewport;

/** Its own root layout because <html lang dir> must be right in the static HTML. */
export default function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar-QA" dir="rtl" className={`${elMessiri.variable} ${tajawal.variable}`}>
      <body>
        <LocaleProviderAr>
          <Providers>{children}</Providers>
          <WhatsAppFloat />
        </LocaleProviderAr>
        <Analytics />
        <WebVitals />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
