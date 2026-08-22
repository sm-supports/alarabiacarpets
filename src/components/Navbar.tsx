import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

const Navbar = memo(function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Navigation items
  const navigationItems = useMemo(() => [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ], []);

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
  }, [location.pathname]);

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
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

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
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative w-9 h-9 md:w-10 md:h-10 overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/tran-golden-logo.webp" 
                  alt="Al Arabia Carpets" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-forest-900">
                Al Arabia Carpets
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
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
              <a
                href="https://wa.me/+97455512858"
                onClick={() => trackWhatsAppClick("navbar_desktop")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700 hover:shadow-elevated"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Get Quote
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`md:hidden relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 z-50 ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
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
        </nav>
      </header>

      {/* Mobile Navigation Overlay - Full screen with higher z-index */}
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
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out-expo ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-14 px-5 border-b border-gray-100 bg-white">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3"
            >
              <img 
                src="/lovable-uploads/tran-golden-logo.webp" 
                alt="Al Arabia Carpets" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-display text-lg font-semibold text-forest-900">
                Al Arabia Carpets
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -mr-2"
              aria-label="Close menu"
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
                    isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: isOpen ? `${index * 50 + 100}ms` : '0ms' }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-forest-50 text-forest-900'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg font-medium">{item.label}</span>
                    <ChevronRight className={`w-5 h-5 transition-colors ${
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
              <a
                href="https://wa.me/+97455512858"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { trackWhatsAppClick("navbar_mobile"); setIsOpen(false); }}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-forest-900 text-white text-lg font-medium rounded-2xl transition-all duration-300 hover:bg-forest-700 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Get a Free Quote
              </a>
              <p className="mt-4 text-center text-sm text-gray-500">
                Free delivery & installation in Qatar
              </p>
            </div>
          </nav>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-14 md:h-16" />
    </>
  );
});

export default Navbar;
