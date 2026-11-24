"use client";

import HeroVideo from "@/components/HeroVideo";
import { ArrowRight, Play } from "@/components/icons";
import { useI18n } from "@/i18n/LocaleProvider";
import { HERO_POSTER, HERO_WIDE_QUERY } from "@/lib/hero-media";

export default function HeroSection() {
  const { t } = useI18n();

  // The buttons are links to the sections, so they work before hydration (a jump, and
  // the hash in the address bar). Once hydrated they scroll there as they always did,
  // without the hash.
  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative md:min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-subtle"
    >
      {/* Background, in paint order: the loop's first frame as a poster, the loop itself once
          the page has loaded (HeroVideo), then the cream veil that keeps the text's contrast.
          The poster is the page's LCP element, so it stays in the static HTML. It must never
          fill the whole viewport: Chrome ignores a full-viewport image for LCP, and the later
          video frame would take its place. The hero starts below the header's spacer, which
          prevents that. */}
      <picture>
        <source media={HERO_WIDE_QUERY} srcSet={HERO_POSTER.wide} type="image/webp" />
        <img
          src={HERO_POSTER.phone}
          alt=""
          aria-hidden="true"
          width={540}
          height={720}
          fetchPriority="high"
          className="hero-poster"
        />
      </picture>
      <HeroVideo />
      <div className="hero-veil" aria-hidden="true" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-5 lg:px-8 py-8 md:py-0">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="hero-in inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 bg-white/80 md:backdrop-blur-sm border border-gray-200/50 rounded-full shadow-subtle">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-pulse-subtle" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {t.hero.badge}
            </span>
      </div>

          {/* Main Headline - the page's LCP element. It must stay visible from the
              first paint: any fade here makes LCP wait for the animation. */}
          <h1
            className="font-display text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-forest-900 mb-4 sm:mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t.hero.titleTop}
            <br />
            <span className="text-gradient">{t.hero.titleBottom}</span>
                    </h1>

          {/* Subheadline - Smaller on mobile */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons: side by side when both fit, else stacked full width (.cta-pair) */}
          <div
            className="hero-in cta-pair justify-center sm:items-center mb-10 sm:mb-16"
            style={{ animationDelay: '100ms' }}
          >
            <a
              href="#products"
              onClick={(event) => scrollToSection(event, 'products')}
              className="group cta cta-l"
            >
              {t.hero.explore}
              <ArrowRight className="arrow-go" />
            </a>
            <a
              href="#services"
              onClick={(event) => scrollToSection(event, 'services')}
              className="group cta-2 cta-l"
            >
              <Play />
              {t.hero.ourServices}
            </a>
                  </div>

          {/* Trust Indicators - Vertical stack on mobile, horizontal on larger screens */}
          <div
            className="hero-in flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-8 md:gap-12">
              <TrustIndicator
                icon="check"
                title={t.hero.freeDelivery}
                subtitle={t.hero.acrossQatar}
                bgColor="bg-forest-100"
                iconColor="text-forest-700"
              />
              <TrustIndicator
                icon="tool"
                title={t.hero.freeInstall}
                subtitle={t.hero.proTeam}
                bgColor="bg-gold-100"
                iconColor="text-gold-600"
              />
              <TrustIndicator
                icon="star"
                title={t.hero.happyCustomers}
                subtitle={t.hero.customers}
                bgColor="bg-teal-100"
                iconColor="text-teal-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="hero-fade absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent max-md:hidden"
        style={{ animationDelay: '300ms' }}
      />

      {/* Scroll Indicator - Hidden on mobile */}
      <div
        className="hero-fade absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        style={{ animationDelay: '400ms' }}
      >
        <span className="text-xs text-gray-500 uppercase tracking-wider">{t.hero.scroll}</span>
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
      <div className="text-start">
        <p className="text-xs sm:text-sm font-semibold text-forest-900 whitespace-nowrap">{title}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{subtitle}</p>
      </div>
    </div>
  );
}
