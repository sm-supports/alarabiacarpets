import type { Locale } from "./config";

/**
 * Short Arabic labels for categories and services. Kept apart from the full
 * overlays in src/data/ar so client components (Footer) can use them without
 * pulling all the page copy into the browser bundle.
 */
export const AR_CATEGORY_LABELS: Record<string, string> = {
  carpet: "السجاد",
  barkia: "الباركيه و PVC",
  curtain: "الستائر",
  curtains: "الستائر",
  "majlis-sofa": "الأثاث وكنب المجالس",
  furniture: "الأثاث وكنب المجالس",
  interior: "التصميم الداخلي",
};

export const AR_SERVICE_LABELS: Record<string, string> = {
  wallpaper: "ورق الجدران",
  "kitchen-cabinets": "خزائن المطابخ",
  wardrobes: "خزائن الملابس",
  "parquet-flooring": "الباركيه الخشبي",
  "event-carpet": "تركيب سجاد المناسبات",
  "office-carpet": "سجاد المكاتب",
  "vinyl-flooring": "أرضيات الفينيل",
  "gypsum-c-board-fixing": "جبس بورد وألواح C-Board",
  "sofa-making": "تفصيل الكنب",
  "sofa-upholstery": "تنجيد الكنب",
  "tv-unit-design": "وحدات التلفزيون",
  cabinets: "الخزائن",
  "floor-mats": "دعاسات الأرضيات والمداخل",
  "room-dividers": "فواصل الغرف",
  "ceramic-tiles": "السيراميك والموزاييك",
};

/** Category label for a slug or Product.category key, in the given language. */
export function localizedCategoryLabel(locale: Locale, keyOrSlug: string, english: string): string {
  if (locale === "en") return english;
  const label = AR_CATEGORY_LABELS[keyOrSlug];
  if (!label) throw new Error(`Missing Arabic category label: ${keyOrSlug}`);
  return label;
}

export function localizedServiceLabel(locale: Locale, slug: string, english: string): string {
  if (locale === "en") return english;
  const label = AR_SERVICE_LABELS[slug];
  if (!label) throw new Error(`Missing Arabic service label: ${slug}`);
  return label;
}
