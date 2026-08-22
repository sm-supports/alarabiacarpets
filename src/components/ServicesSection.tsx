import { Truck, Wrench, Headphones, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";

const services = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Complimentary delivery to your doorstep anywhere in Qatar.",
    color: "forest",
  },
  {
    icon: Wrench,
    title: "Free Installation",
    description: "Professional installation by our expert team at no extra cost.",
    color: "gold",
  },
  {
    icon: Headphones,
    title: "Expert Consultation",
    description: "Personalized advice to find the perfect solutions for your space.",
    color: "teal",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Premium materials and craftsmanship you can trust.",
    color: "forest",
  },
];

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const colorClasses = {
    forest: {
      iconBg: 'bg-forest-100',
      iconColor: 'text-forest-600',
    },
    gold: {
      iconBg: 'bg-gold-100',
      iconColor: 'text-gold-600',
    },
    teal: {
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
  };

  return (
    <section 
      ref={sectionRef}
      id="services"
      className="py-12 sm:py-16 lg:py-24 bg-gray-50/50"
    >
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-10 sm:mb-12 lg:mb-16 transition-all duration-1000 ease-out-expo ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs sm:text-sm font-medium text-gold-600 uppercase tracking-wider mb-2 sm:mb-3">
            Why Choose Us
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-forest-900 mb-3 sm:mb-4">
            The Al Arabia Difference
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We go beyond selling products. Every purchase includes these complimentary services.
          </p>
        </div>

        {/* Services Grid - 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            
            return (
              <div
                key={service.title}
                className={`group p-5 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 transition-all duration-700 ease-out-expo hover:shadow-float hover:-translate-y-1 active:scale-[0.98] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${colors.iconColor}`} />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-display font-semibold text-forest-900 mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`mt-10 sm:mt-12 lg:mt-16 text-center transition-all duration-1000 ease-out-expo ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Have questions about our services?
          </p>
          <a
            href="https://wa.me/+97455512858"
            onClick={() => trackWhatsAppClick("services_section")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-forest-900 text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700 hover:shadow-float active:scale-[0.98] w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
