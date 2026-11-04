import AboutView, { aboutMetadata } from "@/views/AboutView";

export const metadata = aboutMetadata("ar");

export default function AboutPage() {
  return <AboutView locale="ar" />;
}
