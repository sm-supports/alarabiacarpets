import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import "@/index.css";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
// Client components come from ./client, never directly: see (en)/client.ts for why.
import { Analytics, LocaleProvider, Providers, Script, WebVitals, WhatsAppFloat } from "./client";
import { rootMetadata, rootViewport } from "@/lib/root-metadata";

// Mapped onto the same CSS variables as the English fonts, so the existing
// font-playfair / font-poppins classes render Arabic faces without any changes.
//
// `subsets` only chooses which files are preloaded; every subset stays declared in
// the CSS. Keep "latin" here: Arabic pages use Latin glyphs in their first screen
// (digits, the EN switch, phone numbers), so those files download either way, and
// without the preload they are found late. Dropping it was tried and moved first
// paint on a slow phone from 0.9 s to 1.5 s for no saving in bytes.
const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
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
        <LocaleProvider>
          <Providers>{children}</Providers>
          <WhatsAppFloat />
        </LocaleProvider>
        <Analytics />
        <WebVitals />
        <ThirdPartyScripts Script={Script} />
      </body>
    </html>
  );
}
