import HomeView, { homeMetadata } from "@/views/HomeView";

export const metadata = homeMetadata("ar");

export default function HomePage() {
  return <HomeView locale="ar" />;
}
