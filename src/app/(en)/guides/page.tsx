import GuidesIndexView, { guidesIndexMetadata } from "@/views/GuidesIndexView";

export const metadata = guidesIndexMetadata("en");

export default function GuidesPage() {
  return <GuidesIndexView locale="en" />;
}
