import type { Metadata } from "next";
import ServiceView, { serviceMetadata, serviceStaticParams } from "@/views/ServiceView";

export function generateStaticParams() {
  return serviceStaticParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return serviceMetadata("en", slug);
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceView locale="en" slug={slug} />;
}
