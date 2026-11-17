/**
 * People credited as authors of the guides.
 *
 * Empty on purpose: the owner supplies each person's real name, role and years in
 * the trade. Never invent one. While a guide has no `authorId` it is credited to the
 * company, in the byline and in the Article schema.
 *
 * Adding a person:
 * 1. An entry here, and its Arabic `jobTitle` and `bio` in src/data/ar/authors.ts
 *    (the build throws without it).
 * 2. `authorId` on each guide they wrote. GuideView throws on an unknown id.
 * 3. The About page then shows a short profile at /about#<id>, which the guides'
 *    Person schema points to.
 */

export interface Author {
  /** URL fragment on /about, and the key in src/data/ar/authors.ts. */
  id: string;
  name: string;
  /** e.g. "Installation Manager" */
  jobTitle: string;
  yearsInTrade?: number;
  /** One or two sentences: what they do and what they have worked on. */
  bio: string;
}

export const authors: Author[] = [];
