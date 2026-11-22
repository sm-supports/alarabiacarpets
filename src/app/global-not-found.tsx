import type { Metadata } from "next";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Phone } from "@/components/icons";
import { categories } from "@/data/categories";
import { getDict, localePath, type Locale } from "@/i18n";
import { localizedCategoryLabel } from "@/i18n/labels";
import { PHONE, PHONE_E164, WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found | الصفحة غير موجودة",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

/** One row per category, plus Contact. Both lists share these rows, so they line up. */
const ROWS = categories.length + 1;

/**
 * The page's own stylesheet. index.css would cost an 85 KB download for one screen,
 * and a client component here would be filed under one language's layout script, so
 * this page loads neither: plain links, server-only imports, and these rules.
 * Below md the call and quote links are the site's action bar, fixed at the bottom, in
 * the real bar's order, sizes and colours (.ab in src/index.css: change both together);
 * at md and up they sit under the other buttons.
 */
const CSS = `
*,::before,::after{box-sizing:border-box}
html{line-height:1.5;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased}
body{margin:0;background:#FAFAFA;color:#1C1C1C;font-family:Poppins,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
h1,p,ul{margin:0}
ul{padding:0;list-style:none}
a{color:inherit;text-decoration:none}
a:focus-visible{outline:2px solid #C5A572;outline-offset:2px}
.nf{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px 16px calc(96px + env(safe-area-inset-bottom))}
.nf-in{width:100%;max-width:36rem;text-align:center}
.nf-brand{display:inline-flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 8px;min-height:44px;margin-bottom:24px;color:#0A2A1F;font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:600}
.nf-brand img{width:36px;height:36px;object-fit:contain}
.nf-code{margin-bottom:16px;color:#0A2A1F;font-size:3.75rem;line-height:1;font-weight:700}
h1{margin-bottom:16px;color:#171717;font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;line-height:2rem;font-weight:700}
.nf-muted{color:#525252}
.nf-en{margin-bottom:32px}
.nf-ar{margin-bottom:32px}
.nf-ar-title{margin-bottom:8px;color:#171717;font-size:1.5rem;line-height:2rem;font-weight:700}
.nf-acts{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.nf-btn,.nf-bar a{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 24px;border:1px solid rgba(10,42,31,.3);border-radius:9999px;background:#fff;color:#0A2A1F;font-size:14px;line-height:20px;font-weight:600}
.nf-btn:active,.nf-bar a:active{transform:scale(.98)}
.nf-fill,.nf-bar .nf-fill{border-color:#0A2A1F;background:#0A2A1F;color:#fff}
.nf-bar{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-template-columns:1fr 2fr;gap:8px;padding:8px 16px calc(8px + env(safe-area-inset-bottom));background:#fff;box-shadow:0 -1px 0 #E5E5E5,0 -4px 12px rgba(0,0,0,.06)}
.nf-bar a{padding:4px 12px;line-height:1.25}
.nf-ico{width:20px;height:20px;flex-shrink:0}
.nf-two{display:flex;flex-direction:column;align-items:center}
.nf-two [lang]{font-size:13px;font-weight:500}
.nf-nav{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(${ROWS},auto);gap:0 12px;margin-top:32px;padding:4px 12px;border:1px solid #E5E5E5;border-radius:16px;background:#fff;text-align:start}
.nf-nav nav,.nf-nav ul{display:grid;grid-row:span ${ROWS};grid-template-rows:subgrid}
.nf-nav li{display:flex}
.nf-nav a{flex:1;display:flex;align-items:center;min-height:44px;padding:6px 0;border-bottom:1px solid #F0F0F0;color:#0A2A1F;font-size:15px;line-height:1.3}
.nf-nav li:last-child a{border-bottom:0}
.nf-tel{display:inline-flex;align-items:center;min-height:44px;margin-top:16px;padding:0 12px;color:#0A2A1F;font-weight:600}
@media (hover:hover){.nf-btn:hover{background:#F5F5F5}.nf-bar a:hover{background:#FAFAFA}.nf-fill:hover,.nf-bar .nf-fill:hover{border-color:#1E4B3D;background:#1E4B3D}}
@media (min-width:768px){
.nf{padding:48px 16px}
.nf-brand{gap:4px 10px;font-size:17px}
.nf-brand img{width:40px;height:40px}
h1{font-size:1.875rem;line-height:2.25rem}
.nf-bar{position:static;max-width:30rem;margin:12px auto 0;padding:0;border:0;background:none;box-shadow:none}
.nf-bar a{padding:8px 16px}
.nf-nav{gap:0 16px;padding:4px 16px}
}
`;

function NavList({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const links = [
    ...categories.map((c) => ({
      href: localePath(locale, `/products/${c.slug}`),
      label: localizedCategoryLabel(locale, c.slug, c.label),
    })),
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];
  return (
    <nav aria-label={t.common.products} {...(locale === "ar" && { dir: "rtl", lang: "ar-QA" })}>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Exported to out/404.html, which Cloudflare Pages serves with a real 404 status
 * for every unknown URL in either language. It has to be bilingual and a complete
 * document of its own: with one root layout per language there is no layout that
 * could wrap it. So it has no providers, no navbar and no analytics, and its
 * WhatsApp link is the wa.me URL itself rather than WhatsAppLink's /contact stand-in.
 */
export default function GlobalNotFound() {
  const en = getDict("en");
  const ar = getDict("ar");
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>
        <main className="nf">
          <div className="nf-in">
            <a href="/" className="nf-brand">
              <img src="/lovable-uploads/tran-golden-logo.webp" alt="" width={40} height={40} />
              <span>{en.brand}</span>
              <span lang="ar-QA">{ar.brand}</span>
            </a>
            <p className="nf-code">404</p>
            <h1>Page not found</h1>
            <p className="nf-muted nf-en">
              The page you&apos;re looking for doesn&apos;t exist or has moved. Browse our
              collection of carpets, Barkia, curtains and furniture instead.
            </p>
            <div dir="rtl" lang="ar-QA" className="nf-ar">
              <p className="nf-ar-title">الصفحة غير موجودة</p>
              <p className="nf-muted">
                الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تصفّح مجموعتنا من السجاد والباركيه والستائر والأثاث.
              </p>
            </div>
            <div className="nf-acts">
              <a href="/products" className="nf-btn nf-fill">Browse Products</a>
              <a href="/" className="nf-btn">Return Home</a>
              <a href="/ar" lang="ar-QA" className="nf-btn">الصفحة الرئيسية</a>
            </div>
            <div className="nf-bar" data-action-bar="">
              <a href={`tel:${PHONE_E164}`}>
                <Phone className="nf-ico" />
                <span className="nf-two">
                  <span>{en.statePanel.call}</span>
                  <span lang="ar-QA">{ar.statePanel.call}</span>
                </span>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nf-fill">
                <WhatsAppIcon className="nf-ico" />
                <span className="nf-two">
                  <span>{en.nav.getFreeQuote}</span>
                  <span lang="ar-QA">{ar.nav.getFreeQuote}</span>
                </span>
              </a>
            </div>
            <div className="nf-nav">
              <NavList locale="en" />
              <NavList locale="ar" />
            </div>
            <a href={`tel:${PHONE_E164}`} className="nf-tel">
              <bdi dir="ltr">{PHONE}</bdi>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
