"use client";

import { MessageCircle, Mail, MapPin, Instagram, Facebook, ArrowUpRight } from "@/components/icons";
import Link from "next/link";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import WhatsAppLink from "@/components/WhatsAppLink";
import { useI18n } from "@/i18n/LocaleProvider";
import { localizedCategoryLabel, localizedServiceLabel } from "@/i18n/labels";
import { WHATSAPP_URL } from "@/lib/seo";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale, t, lp } = useI18n();

  const footerLinks = {
    // Straight from the category data -- every link is a category landing page.
    // No lookup, so no fallback that could silently point somewhere else.
    products: [
      ...categories.map((c) => ({
        label: localizedCategoryLabel(locale, c.slug, c.label),
        href: lp(`/products/${c.slug}`),
      })),
      { label: t.common.allProducts, href: lp('/products') },
    ],
    // Services share the Company column: the footer grid has no spare column,
    // and these are browse-level links like the rest of that list.
    company: [
      { label: t.common.guides, href: lp('/guides') },
      { label: t.footer.aboutUs, href: lp('/about') },
      { label: t.footer.contact, href: lp('/contact') },
      { label: t.common.services, href: lp('/services') },
      ...services.map((s) => ({
        label: localizedServiceLabel(locale, s.slug, s.label),
        href: lp(`/services/${s.slug}`),
      })),
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com/alarabiacarpet', icon: Instagram },
      { label: 'Facebook', href: 'https://facebook.com/alarabiacarpets', icon: Facebook },
      { label: t.contactSection.whatsapp, href: WHATSAPP_URL, icon: MessageCircle },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <h2 className="sr-only">{t.footer.srTitle}</h2>
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href={lp("/")} className="inline-flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <img
                src="/lovable-uploads/tran-golden-logo.webp"
                alt={t.brand}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
              <span className="font-display text-lg sm:text-xl font-semibold text-forest-900">
                {t.brand}
              </span>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 sm:mb-6 max-w-sm">
              {t.footer.tagline}
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 sm:space-y-3">
              <WhatsAppLink
                source="footer_contact"
                className="ft-contact"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <bdi dir="ltr">+974 5551 2858</bdi>
              </WhatsAppLink>
              <a
                href="mailto:info@alarabiacarpets.com"
                className="ft-contact"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <bdi dir="ltr" className="truncate">info@alarabiacarpets.com</bdi>
              </a>
              <a
                href="https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-contact"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{t.footer.address}</span>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="font-semibold text-forest-900 mb-3 sm:mb-4 text-sm sm:text-base">{t.common.products}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="ft-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-forest-900 mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.company}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="ft-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column - Hidden on small mobile, shown on larger */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-forest-900 mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.getStarted}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              {t.footer.getStartedText}
            </p>
            <WhatsAppLink
              source="footer_get_quote"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-forest-900 text-white text-xs sm:text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700 active:scale-[0.98]"
            >
              {t.nav.getQuote}
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:-scale-x-100" />
            </WhatsAppLink>

            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                const className = "ft-social";
                if (social.href === WHATSAPP_URL) {
                  return (
                    <WhatsAppLink key={social.label} source="footer_social" className={className} aria-label={social.label}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </WhatsAppLink>
                  );
                }
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-start">
              {t.footer.rights(currentYear)}
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-[10px] sm:text-xs text-gray-400">
                {t.footer.freeDelivery}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
