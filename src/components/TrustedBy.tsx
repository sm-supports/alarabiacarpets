import { useEffect, useRef, useState } from 'react';

const logos = [
  { src: '/logos/logo1.webp', alt: 'Ezdan Mall' },
  { src: '/logos/logo2.webp', alt: 'Enormous' },
  { src: '/logos/logo3.webp', alt: 'Festival City' },
  { src: '/logos/logo4.webp', alt: 'Al Khalij' },
  { src: '/logos/logo5.webp', alt: 'Al Arabia' },
  { src: '/logos/logo6.webp', alt: 'AL MUFTAH GROUP' },
  { src: '/logos/logo7.webp', alt: 'Al Anaka event planning' },
  { src: '/logos/logo8.webp', alt: 'ALSAM Trading & contacting service L.L.C' },
  { src: '/logos/logo9.webp', alt: 'GRADE ONE Trading & Contracting' },
  { src: '/logos/logo10.webp', alt: 'Inworth' },
  { src: '/logos/logo11.webp', alt: 'Petro guard offshore Shapelier' },
  { src: '/logos/logo12.webp', alt: 'Asia trading Engineering & Services' },
  { src: '/logos/logo13.webp', alt: 'Aquatech for trading & contracting WLL' },
  { src: '/logos/logo14.webp', alt: 'New star Contracting Co W.L.L' },
];

export default function TrustedBy() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Duplicate logos for seamless infinite scroll
  const extendedLogos = [...logos, ...logos];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-white border-y border-gray-100"
    >
      <div className="container mx-auto px-5 lg:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-14 transition-all duration-1000 ease-out-expo ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Trusted Partners
          </p>
          <h2 className="text-headline-2 font-display text-forest-900">
            Trusted by Leading Organizations
          </h2>
        </div>

        {/* Logo Marquee */}
        <div 
          className={`relative overflow-hidden transition-all duration-1000 ease-out-expo ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Container */}
          <div className="flex animate-scroll hover:[animation-play-state:paused]">
            {extendedLogos.map((logo, index) => {
              const isLarger = logo.src === '/logos/logo2.webp' || logo.src === '/logos/logo3.webp';
              
              return (
                <div 
                  key={`${logo.src}-${index}`}
                  className="flex-shrink-0 w-36 h-20 sm:w-44 sm:h-24 lg:w-52 lg:h-28 flex items-center justify-center mx-4 lg:mx-6"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`object-contain transition-all duration-300 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 ${
                      isLarger ? 'max-h-20 sm:max-h-24 lg:max-h-28' : 'max-h-14 sm:max-h-18 lg:max-h-20'
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div 
          className={`mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ease-out-expo ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {[
            { value: '1000+', label: 'Happy Customers' },
            { value: '14+', label: 'Trusted Partners' },
            { value: '10+', label: 'Years Experience' },
            { value: '100%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center"
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <p className="text-3xl lg:text-4xl font-display font-bold text-forest-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
