import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

/**
 * Exported to out/404.html. Cloudflare Pages serves it with a real 404 status
 * once the SPA fallback rule is removed from public/_redirects -- previously
 * every unknown URL returned HTTP 200 with this page, a soft-404.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-neutral-50 py-20">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <p className="font-playfair text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">
            Page not found
          </h1>
          <p className="font-poppins text-neutral-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Browse our
            collection of carpets, Barkia, curtains and furniture instead.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
