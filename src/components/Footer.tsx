"use client";

import { MessageCircle, Mail, MapPin, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    // Straight from the category data -- every link is a category landing page.
    // No lookup, so no fallback that could silently point somewhere else.
    products: [
      ...categories.map((c) => ({ label: c.label, href: `/products/${c.slug}` })),
      { label: 'All Products', href: '/products' },
    ],
    // Services share the Company column: the footer grid has no spare column,
    // and these are browse-level links like the rest of that list.
    company: [
      { label: 'Guides', href: '/guides' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Services', href: '/services' },
      ...services.map((s) => ({ label: s.label, href: `/services/${s.slug}` })),
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com/alarabiacarpet', icon: Instagram },
      { label: 'Facebook', href: 'https://facebook.com/alarabiacarpets', icon: Facebook },
      { label: 'WhatsApp', href: 'https://wa.me/+97455512858', icon: MessageCircle },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <h2 className="sr-only">Site footer</h2>
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <img 
                src="/lovable-uploads/tran-golden-logo.webp" 
                alt="Al Arabia Carpets" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
              <span className="font-display text-lg sm:text-xl font-semibold text-forest-900">
                Al Arabia Carpets
              </span>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 sm:mb-6 max-w-sm">
              Premium home furnishing solutions in Qatar. Transform your space with our 
              curated collection of carpets, sofas, and decorative elements.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2.5 sm:space-y-3">
              <a 
                href="https://wa.me/+97455512858"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("footer_contact")}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>+974 5551 2858</span>
              </a>
              <a 
                href="mailto:info@alarabiacarpets.com"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-900 transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">info@alarabiacarpets.com</span>
              </a>
              <a 
                href="https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-900 transition-colors"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Al Mansoura St, Doha</span>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="font-semibold text-forest-900 mb-3 sm:mb-4 text-sm sm:text-base">Products</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-600 hover:text-forest-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-forest-900 mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-600 hover:text-forest-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column - Hidden on small mobile, shown on larger */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-forest-900 mb-3 sm:mb-4 text-sm sm:text-base">Get Started</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Ready to transform your space? Get in touch for a free consultation.
            </p>
            <a
              href="https://wa.me/+97455512858"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("footer_get_quote")}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-forest-900 text-white text-xs sm:text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700 active:scale-[0.98]"
            >
              Get Quote
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            
            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (social.href.includes("wa.me")) trackWhatsAppClick("footer_social");
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:bg-forest-900 hover:text-white active:scale-[0.95]"
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
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {currentYear} Al Arabia Carpets. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-[10px] sm:text-xs text-gray-400">
                Free Delivery & Installation in Qatar
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
