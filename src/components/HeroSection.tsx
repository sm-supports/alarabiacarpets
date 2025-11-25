import { ArrowRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-subtle"
    >
      {/* Ambient Background Elements - Smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs - reduced size on mobile for performance */}
        <div className="absolute top-1/4 -left-16 md:-left-32 w-48 h-48 md:w-96 md:h-96 bg-gold-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-16 md:-right-32 w-64 h-64 md:w-[500px] md:h-[500px] bg-teal-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-forest-100/20 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern - hidden on mobile for performance */}
        <div 
          className="absolute inset-0 opacity-[0.015] hidden md:block"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 42, 31, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(10, 42, 31, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-5 lg:px-8 py-8 md:py-0">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-subtle transition-all duration-700 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-pulse-subtle" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Premium Home Furnishings in Qatar
            </span>
      </div>

          {/* Main Headline - Tighter on mobile */}
          <h1
            className={`font-display text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-forest-900 mb-4 sm:mb-6 transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms', letterSpacing: '-0.02em' }}
          >
            Transform Your Space
            <br />
            <span className="text-gradient">Into Art</span>
                    </h1>

          {/* Subheadline - Smaller on mobile */}
          <p
            className={`text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-2 transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Discover handcrafted carpets, elegant majlis sofas, and premium 
            home furnishings with complimentary delivery and installation 
            throughout Qatar.
          </p>

          {/* CTA Buttons - Full width on mobile */}
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4 sm:px-0 transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <button
              onClick={() => scrollToSection('products')}
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-forest-900 text-white text-base font-medium rounded-full transition-all duration-300 hover:bg-forest-700 hover:shadow-float active:scale-[0.98]"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-forest-900 text-base font-medium rounded-full border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
            >
              <Play className="w-4 h-4" />
              Our Services
            </button>
                  </div>

          {/* Trust Indicators - Vertical stack on mobile, horizontal on larger screens */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            {/* Mobile: Horizontal scroll container */}
            <div className="flex sm:hidden items-center gap-6 overflow-x-auto pb-2 px-4 w-full justify-center scrollbar-hide">
              <TrustIndicator 
                icon="check"
                title="Free Delivery"
                subtitle="Across Qatar"
                bgColor="bg-forest-100"
                iconColor="text-forest-700"
              />
              <TrustIndicator 
                icon="tool"
                title="Free Install"
                subtitle="Pro Team"
                bgColor="bg-gold-100"
                iconColor="text-gold-600"
              />
              <TrustIndicator 
                icon="star"
                title="1000+"
                subtitle="Customers"
                bgColor="bg-teal-100"
                iconColor="text-teal-600"
              />
            </div>

            {/* Desktop: Regular layout */}
            <div className="hidden sm:flex items-center gap-8 md:gap-12">
              <TrustIndicator 
                icon="check"
                title="Free Delivery"
                subtitle="Across Qatar"
                bgColor="bg-forest-100"
                iconColor="text-forest-700"
              />
              <TrustIndicator 
                icon="tool"
                title="Free Installation"
                subtitle="Professional Team"
                bgColor="bg-gold-100"
                iconColor="text-gold-600"
              />
              <TrustIndicator 
                icon="star"
                title="1000+ Happy"
                subtitle="Customers"
                bgColor="bg-teal-100"
                iconColor="text-teal-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '600ms' }}
      />

      {/* Scroll Indicator - Hidden on mobile */}
      <div
        className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '800ms' }}
      >
        <span className="text-xs text-gray-400 uppercase tracking-wider">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// Trust Indicator Component for cleaner code
function TrustIndicator({ 
  icon, 
  title, 
  subtitle, 
  bgColor, 
  iconColor 
}: { 
  icon: 'check' | 'tool' | 'star';
  title: string;
  subtitle: string;
  bgColor: string;
  iconColor: string;
}) {
  const icons = {
    check: (
      <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    tool: (
      <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    star: (
      <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${bgColor} flex items-center justify-center`}>
        {icons[icon]}
      </div>
      <div className="text-left">
        <p className="text-xs sm:text-sm font-semibold text-forest-900 whitespace-nowrap">{title}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{subtitle}</p>
      </div>
    </div>
  );
}
