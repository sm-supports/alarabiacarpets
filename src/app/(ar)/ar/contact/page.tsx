import ContactView, { contactMetadata } from "@/views/ContactView";

export const metadata = contactMetadata("ar");

export default function ContactPage() {
  return <ContactView locale="ar" />;
}
