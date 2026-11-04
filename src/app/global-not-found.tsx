import type { Metadata } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "Page Not Found | الصفحة غير موجودة",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

/**
 * Exported to out/404.html, which Cloudflare Pages serves with a real 404 status
 * for every unknown URL in either language. It has to be bilingual and a complete
 * document of its own: with one root layout per language there is no layout that
 * could wrap it.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex items-center justify-center bg-neutral-50 py-20">
          <div className="container mx-auto px-4 text-center max-w-xl">
            <p className="text-6xl font-bold text-primary mb-4">404</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Page not found</h1>
            <p className="text-neutral-600 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has moved. Browse our
              collection of carpets, Barkia, curtains and furniture instead.
            </p>
            <div dir="rtl" lang="ar-QA" className="mb-8">
              <p className="text-2xl font-bold mb-2 text-neutral-900">الصفحة غير موجودة</p>
              <p className="text-neutral-600">
                الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تصفّح مجموعتنا من السجاد والباركيه والستائر والأثاث.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/products" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white">Browse Products</a>
              <a href="/" className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium">Return Home</a>
              <a href="/ar" lang="ar-QA" className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium">الصفحة الرئيسية</a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
