"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight } from "@/components/icons";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";
import { stripLocale } from "@/i18n";

const Navbar = memo(function Navbar() {
  const hydrated = useHydrated();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t, lp } = useI18n();

  // Navigation items
  const navigationItems = useMemo(() => [
    { path: '/', label: t.common.home },
    { path: '/products', label: t.common.products },
    { path: '/services', label: t.common.services },
    { path: '/guides', label: t.common.guides },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ], [t]);

  // Track scroll position for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = useCallback((path: string) => {
    const current = stripLocale(pathname);
    if (path === '/') {
      return current === '/';
    }
    return current.startsWith(path);
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Main Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out-expo ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-subtle'
            : 'bg-transparent'
        } ${isOpen ? 'md:z-40 z-30' : 'z-40'}`}
      >
        <nav className="container mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link
              href={lp("/")}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-9 h-9 md:w-10 md:h-10 overflow-hidden rounded-lg">
                <img
                  src="/lovable-uploads/tran-golden-logo.webp"
                  alt={t.brand}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-forest-900">
                {t.brand}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={lp(item.path)}
                  className={`nav-link ${
                    isActive(item.path)
                      ? 'text-forest-900'
                      : 'text-gray-600 hover:text-forest-900'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-forest-900 transition-colors duration-200 rounded-full" />
              <WhatsAppLink
                source="navbar_desktop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700 hover:shadow-elevated"
              >
                <WhatsAppIcon className="w-4 h-4" />
                {t.nav.getQuote}
              </WhatsAppLink>
            </div>

            {/* Mobile language switch and menu button */}
            <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher
              short
              className="min-w-10 h-10 px-2 flex items-center justify-center text-sm font-semibold text-forest-900 rounded-full"
            />
            <button
              onClick={toggleMenu}
              className={`md:hidden relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 z-50 ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              aria-label={t.nav.toggleMenu}
              aria-expanded={isOpen}
            >
              <div className="relative w-5 h-5">
                <span
                  className={`absolute left-0 w-5 h-0.5 bg-forest-900 transition-all duration-300 ${
                    isOpen ? 'top-2.5 rotate-45' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 w-5 h-0.5 bg-forest-900 transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 w-5 h-0.5 bg-forest-900 transition-all duration-300 ${
                    isOpen ? 'top-2.5 -rotate-45' : 'top-4'
                  }`}
                />
              </div>
            </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay - Full screen with higher z-index. Added after
          hydration: it needs JavaScript to open, and it repeats every nav link. */}
      {hydrated && (
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel - Slides from right, full height */}
        <div
          className={`absolute top-0 end-0 w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out-expo ${
            isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-14 px-5 border-b border-gray-100 bg-white">
            <Link
              href={lp("/")}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3"
            >
              <img
                src="/lovable-uploads/tran-golden-logo.webp"
                alt={t.brand}
                className="w-8 h-8 object-contain"
              />
              <span className="font-display text-lg font-semibold text-forest-900">
                {t.brand}
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -me-2"
              aria-label={t.nav.closeMenu}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
            <ul className="space-y-1">
              {navigationItems.map((item, index) => (
                <li
                  key={item.path}
                  className={`transform transition-all duration-300 ${
                    isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 rtl:-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: isOpen ? `${index * 50 + 100}ms` : '0ms' }}
                >
                  <Link
                    href={lp(item.path)}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-forest-50 text-forest-900'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg font-medium">{item.label}</span>
                    <ChevronRight className={`w-5 h-5 transition-colors rtl:-scale-x-100 ${
                      isActive(item.path) ? 'text-gold-500' : 'text-gray-400'
                    }`} />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile CTA */}
            <div
              className={`mt-8 pt-8 border-t border-gray-100 transform transition-all duration-300 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}
            >
              <WhatsAppLink
                source="navbar_mobile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-forest-900 text-white text-lg font-medium rounded-2xl transition-all duration-300 hover:bg-forest-700 active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {t.nav.getFreeQuote}
              </WhatsAppLink>
              <p className="mt-4 text-center text-sm text-gray-500">
                {t.nav.freeDelivery}
              </p>
              <LanguageSwitcher className="mt-4 block text-center text-sm font-medium text-forest-900 underline underline-offset-4" />
            </div>
          </nav>
        </div>
      </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-14 md:h-16" />
    </>
  );
});

export default Navbar;
