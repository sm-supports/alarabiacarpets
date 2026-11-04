import type { Metadata } from "next";
import GuideView, { guideMetadata, guideStaticParams } from "@/views/GuideView";

export function generateStaticParams() {
  return guideStaticParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return guideMetadata("en", slug);
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GuideView locale="en" slug={slug} />;
}
