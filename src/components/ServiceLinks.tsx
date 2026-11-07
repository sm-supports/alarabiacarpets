import Link from "next/link";
import type { Service } from "@/data/services";
import { getDict, localePath, type Locale } from "@/i18n";

/**
 * Links from a product, category or guide page to the service pages behind it.
 * Service pages used to get in-content links only from /services, and Google left
 * several of them unindexed. `npm run check` now counts these links.
 */
export default function ServiceLinks({ locale, services }: { locale: Locale; services: Service[] }) {
  if (services.length === 0) return null;
  const t = getDict(locale);
  return (
    <section className="py-12 md:py-14 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <h2 className="h2-sec6">{t.service.relatedServices}</h2>
        <div className="flex flex-wrap gap-3">
          {services.map((service) => (
            <Link key={service.slug} href={localePath(locale, `/services/${service.slug}`)} className="chip-link">
              {service.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
