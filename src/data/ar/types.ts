import type { Category, CategorySection } from "../categories";
import type { Author } from "../authors";
import type { Guide } from "../guides";
import type { Product } from "../products";
import type { Service } from "../services";

/**
 * The translatable fields of each content type. Everything else (ids, images,
 * prices, related links) comes from the English record, so facts have one source.
 * Optional fields must be present here exactly when the English record has them:
 * src/data/localized.ts throws at build otherwise.
 */
export type ProductAr = Pick<Product, "name" | "description"> &
  Partial<Pick<Product, "longDescription" | "specs" | "faqs" | "seoTitle" | "metaDescription" | "imageAlt">>;

export type CategoryAr = Pick<Category, "heading" | "seoTitle" | "metaDescription" | "intro" | "heroImageAlt"> &
  Partial<Pick<Category, "specs" | "faqs">> & { secondary?: CategorySection };

export type ServiceAr = Pick<
  Service,
  "heading" | "seoTitle" | "metaDescription" | "excerpt" | "intro" | "offers" | "includes" | "specs" | "steps" | "faqs"
> &
  Partial<Pick<Service, "secondary" | "heroImageAlt">> & {
    /** Alt text for Service.gallery, in the same order. */
    galleryAlts?: string[];
  };

export type GuideAr = Pick<Guide, "title" | "metaDescription" | "excerpt" | "heroImageAlt" | "answer" | "intro" | "sections"> &
  Partial<Pick<Guide, "seoTitle" | "faqs">>;

export type AuthorAr = Pick<Author, "jobTitle" | "bio">;
