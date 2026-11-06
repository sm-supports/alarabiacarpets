import { Truck, Wrench, Headphones, Shield } from "@/components/icons";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getDict, type Locale } from "@/i18n";

const services = [
  { icon: Truck, key: "delivery", color: "forest" },
  { icon: Wrench, key: "installation", color: "gold" },
  { icon: Headphones, key: "consultation", color: "teal" },
  { icon: Shield, key: "guarantee", color: "forest" },
] as const;

export default function ServicesSection({ locale }: { locale: Locale }) {
  const t = getDict(locale);

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
      id="services"
      className="py-12 sm:py-16 lg:py-24 bg-gray-50/50"
    >
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        {/* Header */}
        <div
          className="reveal text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <p className="text-xs sm:text-sm font-medium text-gold-600 uppercase tracking-wider mb-2 sm:mb-3">
            {t.whyUs.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-forest-900 mb-3 sm:mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* Services Grid - 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const colors = colorClasses[service.color];
            const copy = t.whyUs.items[service.key];

            return (
              <div
                key={service.key}
                className="group why-card reveal"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${colors.iconColor}`} />
                </div>
                <h3 className="why-title">
                  {copy.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {copy.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="reveal mt-10 sm:mt-12 lg:mt-16 text-center"
        >
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {t.whyUs.question}
          </p>
          <WhatsAppLink
            source="services_section"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-forest-900 text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-forest-700 hover:shadow-float active:scale-[0.98] w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
          >
            <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            {t.common.contactOnWhatsApp}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
