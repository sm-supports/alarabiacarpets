import ServicesIndexView, { servicesIndexMetadata } from "@/views/ServicesIndexView";

export const metadata = servicesIndexMetadata("ar");

export default function ServicesPage() {
  return <ServicesIndexView locale="ar" />;
}
