import ServicesIndexView, { servicesIndexMetadata } from "@/views/ServicesIndexView";

export const metadata = servicesIndexMetadata("en");

export default function ServicesPage() {
  return <ServicesIndexView locale="en" />;
}
