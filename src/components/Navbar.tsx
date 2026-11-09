"use client";

import { useState, useEffect, memo, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight, MessageCircle } from "@/components/icons";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";
import { stripLocale } from "@/i18n/config";
import { openChat } from "@/lib/tawk";

/** What the menu's Live chat row is saying (S18). */
type ChatState = "idle" | "opening" | "failed";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The three bars of the menu button, crossed while the menu is open. */
function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block w-5 h-5" aria-hidden="true">
      <span className={open ? "nav-line top-2.5 rotate-45" : "nav-line top-1"} />
      <span className={open ? "nav-line top-2.5 opacity-0" : "nav-line top-2.5"} />
      <span className={open ? "nav-line top-2.5 -rotate-45" : "nav-line top-4"} />
    </span>
  );
}

const Navbar = memo(function Navbar() {
  const hydrated = useHydrated();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chat, setChat] = useState<ChatState>("idle");
  const pathname = usePathname();
  const { t, lp } = useI18n();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Whether closing should put focus back on the menu button: yes for Close, the
  // backdrop and Escape; no when a link navigates or the chat window takes over.
  const restoreFocus = useRef(false);
  // The chat attempt the row is showing, so a late answer to an older one is ignored.
  const chatAttempt = useRef(0);

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

  const close = useCallback((restore: boolean) => {
    restoreFocus.current = restore;
    setIsOpen(false);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    close(false);
  }, [pathname, close]);

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

  // While open: focus starts on Close, Tab and Shift+Tab stay inside the panel, and
  // Escape closes it. On close the row forgets its last chat attempt and, unless a link
  // or the chat took the visitor elsewhere, focus goes back to the menu button.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const burger = burgerRef.current;
    panel?.querySelector<HTMLElement>("[data-menu-close]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => item.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = panel.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      chatAttempt.current += 1;
      setChat("idle");
      if (restoreFocus.current) burger?.focus();
      restoreFocus.current = false;
    };
  }, [isOpen, close]);

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

  const startChat = useCallback(() => {
    const attempt = ++chatAttempt.current;
    setChat("opening");
    openChat().then((opened) => {
      if (attempt !== chatAttempt.current) return;
      if (opened) close(false);
      else setChat("failed");
    });
  }, [close]);

  return (
    <>
      {/* Main Navigation. Solid white below md, so it reads the same on every page. */}
      <header className={isScrolled ? "site-header is-scrolled" : "site-header"}>
        <nav className="container mx-auto px-4 md:px-5 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link
              href={lp("/")}
              className="flex items-center gap-3 group min-h-11"
            >
              <div className="relative w-9 h-9 md:w-10 md:h-10 overflow-hidden rounded-lg">
                <img
                  src="/lovable-uploads/tran-golden-logo.webp"
                  alt={t.common.logoAlt}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  loading="eager"
                  decoding="async"
                />
              </div>
              {/* Between md and lg the six links and the quote button need the room, so
                  the logo stands alone there (its alt names the brand). */}
              <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-forest-900 md:max-lg:hidden">
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

            {/* Desktop CTA. Its label is nav.getQuote, the owner's decision of 2026-11-09:
                the desktop row keeps the links where they were (.nav-cta in index.css). */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher className="nav-switch" />
              <WhatsAppLink source="navbar_desktop" className="cta cta-s nav-cta">
                <WhatsAppIcon />
                {t.nav.getQuote}
              </WhatsAppLink>
            </div>

            {/* Mobile language switch and menu button. Until hydration the menu can't
                open, so the button is a link to the footer's links instead: to the
                Products fold, which opens when the link lands on it (.fold-h in index.css). */}
            <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher
              short
              className="nav-lang"
            />
            {hydrated ? (
              <button
                ref={burgerRef}
                type="button"
                onClick={toggleMenu}
                className="nav-burger"
                aria-label={t.nav.toggleMenu}
                aria-expanded={isOpen}
              >
                <Burger open={isOpen} />
              </button>
            ) : (
              <a href="#ft-p" className="nav-burger" aria-label={t.nav.toggleMenu}>
                <Burger open={false} />
              </a>
            )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay - Full screen, above the header and the action bar.
          Added after hydration: it needs JavaScript to open, and it repeats every nav link.
          Visible at once on open, so Close can take focus in the same frame, and hidden
          only once the panel has slid out. */}
      {hydrated && (
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-[visibility] duration-0 ${
          isOpen ? 'visible' : 'invisible delay-300'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => close(true)}
        />

        {/* Menu Panel - Slides from the end, full height */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          className={`absolute top-0 end-0 w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out-expo ${
            isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100 bg-white">
            <Link
              href={lp("/")}
              onClick={() => close(false)}
              className="flex items-center gap-3 min-h-11"
            >
              <img
                src="/lovable-uploads/tran-golden-logo.webp"
                alt={t.common.logoAlt}
                className="w-8 h-8 object-contain"
              />
              <span className="font-display text-lg font-semibold text-forest-900">
                {t.brand}
              </span>
            </Link>
            <button
              type="button"
              data-menu-close=""
              onClick={() => close(true)}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -me-2"
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
                    onClick={() => close(false)}
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
              {/* Live chat: on phones Tawk loads only from here (src/lib/tawk.ts). */}
              <li
                className={`transform transition-all duration-300 ${
                  isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 rtl:-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: isOpen ? `${navigationItems.length * 50 + 100}ms` : '0ms' }}
              >
                <button
                  type="button"
                  onClick={startChat}
                  aria-busy={chat === "opening" || undefined}
                  aria-describedby="menu-chat-status"
                  className="flex w-full items-center justify-between p-4 rounded-2xl text-start text-gray-700 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="text-lg font-medium">{t.nav.liveChat}</span>
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                </button>
                {/* Always rendered, so the change of text is announced. */}
                <p
                  id="menu-chat-status"
                  role="status"
                  className={`px-4 text-sm empty:hidden ${chat === "failed" ? "pb-2 text-red-700" : "text-gray-500"}`}
                >
                  {chat === "opening" ? t.nav.chatOpening : chat === "failed" ? t.nav.chatFailed : ""}
                </p>
              </li>
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
                onClick={() => close(false)}
                className="cta w-full"
              >
                <WhatsAppIcon />
                {t.nav.getFreeQuote}
              </WhatsAppLink>
              <p className="mt-4 text-center text-sm text-gray-500">
                {t.nav.freeDelivery}
              </p>
              <LanguageSwitcher className="mt-2 flex min-h-11 items-center justify-center text-sm font-medium text-forest-900 underline underline-offset-4" />
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
