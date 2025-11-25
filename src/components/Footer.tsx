import { MessageCircle, Mail, MapPin, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { label: 'Carpets', href: '/products/luxury-carpets' },
      { label: 'Majlis Sofas', href: '/products/majlis-sets' },
      { label: 'Barkia', href: '/products/premium-barkia' },
      { label: 'Curtains', href: '/products/curtains' },
      { label: 'All Products', href: '/products' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Services', href: '/#services' },
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com/alarabiacarpet', icon: Instagram },
      { label: 'Facebook', href: 'https://facebook.com/alarabiacarpets', icon: Facebook },
      { label: 'WhatsApp', href: 'https://wa.me/+97455512858', icon: MessageCircle },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="container mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/tran-golden-logo.webp" 
                alt="Al Arabia Carpets" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-display text-xl font-semibold text-forest-900">
                Al Arabia Carpets
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
              Premium home furnishing solutions in Qatar. Transform your space with our 
              curated collection of carpets, sofas, and decorative elements.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="https://wa.me/+97455512858"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+974 5551 2858</span>
              </a>
              <a 
                href="mailto:info@alarabiacarpets.com"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-900 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@alarabiacarpets.com</span>
              </a>
              <a 
                href="https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-forest-900 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Al Mansoura St, Doha</span>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-semibold text-forest-900 mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-forest-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-forest-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-forest-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h4 className="font-semibold text-forest-900 mb-4">Get Started</h4>
            <p className="text-sm text-gray-600 mb-4">
              Ready to transform your space? Get in touch for a free consultation.
            </p>
            <a
              href="https://wa.me/+97455512858"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700"
            >
              Get Quote
              <ArrowUpRight className="w-4 h-4" />
            </a>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:bg-forest-900 hover:text-white"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-5 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Al Arabia Carpets. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-400">
                Free Delivery & Installation in Qatar
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
