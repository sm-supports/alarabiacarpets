import GuidesIndexView, { guidesIndexMetadata } from "@/views/GuidesIndexView";

export const metadata = guidesIndexMetadata("ar");

export default function GuidesPage() {
  return <GuidesIndexView locale="ar" />;
}
