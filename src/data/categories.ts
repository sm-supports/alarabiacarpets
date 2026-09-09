import type { ProductFaq, ProductSpec } from "./products";

/**
 * Category landing pages -- the site's transactional "money pages".
 *
 * These five slugs are the SAME URLs that previously served category-hub
 * *products* (/products/carpet, /products/barkia, ...). They are already
 * indexed, so the page type changed while the URL, title and description did
 * not. Do not rename a slug: that would churn an indexed URL.
 *
 * Content here was moved verbatim out of those hub product objects, which have
 * been deleted from `products` -- there is exactly one source of truth per
 * category, and `products` now holds only real SKUs.
 */

export interface CategorySection {
  heading: string;
  intro: string[];
  specs?: ProductSpec[];
  faqs?: ProductFaq[];
}

export interface Category {
  /** URL segment under /products/. MUST match the already-indexed hub id. */
  slug: string;
  /** The `Product.category` value this page lists. Note slug !== key for
   *  curtain/curtains and majlis-sofa/furniture. */
  key: string;
  /** Short label: filter tabs, "More in X" headings, breadcrumbs. */
  label: string;
  /** Page <h1>. Longer and location-qualified, unlike `label`. */
  heading: string;
  seoTitle: string;
  metaDescription: string;
  /** Body copy paragraphs shown under the h1. */
  intro: string[];
  specs?: ProductSpec[];
  faqs?: ProductFaq[];
  /** A real file in public/ -- unlike services, category imagery exists. */
  heroImage: string;
  heroImageAlt: string;
  /** An additional topic folded onto this page (see furniture). */
  secondary?: CategorySection;
}

export const categories: Category[] = [
  {
    slug: "carpet",
    key: "carpet",
    label: "Carpets",
    heading: "Carpets in Qatar",
    seoTitle: "Carpets in Qatar | Supply & Fitting in Doha",
    metaDescription:
      "Premium carpets supplied and fitted across Qatar. Wall-to-wall, rugs, mosque, office and stair carpet with free measurement and installation in Doha.",
    heroImage: "/Products/Carpets/carpet.webp",
    heroImageAlt: "Premium wall-to-wall carpet fitted in a Doha home by Al Arabia Carpets",
    intro: [
      "Al Arabia Carpets supplies and fits carpet across Qatar for homes, majlis, mosques, offices and event spaces. Our range covers wall-to-wall broadloom, carpet tiles, stair runners and made-to-measure rugs in a wide choice of pile heights and colours.",
      "We bring samples to you, measure the space, and handle cutting, laying, joining and edge finishing. Delivery and installation anywhere in Qatar are included in the quoted price.",
    ],
    specs: [
      {
        label: "Types",
        value: "Wall-to-wall, tiles, runners, rugs",
      },
      {
        label: "Suitable for",
        value: "Homes, majlis, mosques, offices",
      },
      {
        label: "Measurement",
        value: "Free on-site survey",
      },
      {
        label: "Installation",
        value: "Included across Qatar",
      },
      {
        label: "Samples",
        value: "Brought to your location",
      },
    ],
    faqs: [
      {
        q: "Do you measure and fit carpet in Doha?",
        a: "Yes. We carry out a free on-site measurement anywhere in Doha and across Qatar, then cut, lay and finish the carpet for you. Both delivery and fitting are included.",
      },
      {
        q: "What types of carpet do you supply?",
        a: "We supply wall-to-wall broadloom, carpet tiles for offices, stair carpet, mosque and prayer-hall carpet, event carpet and made-to-measure rugs.",
      },
      {
        q: "How long does carpet installation take?",
        a: "A typical room is fitted the same day. Larger areas such as mosques or full office floors are scheduled in advance, and we confirm the timeline after measuring.",
      },
      {
        q: "What is the difference between carpet tiles and wall-to-wall carpet?",
        a: "Carpet tiles are laid as individual squares, so a stained or worn tile is lifted and replaced without touching the rest of the floor. Wall-to-wall broadloom is a continuous surface with no visible grid, which looks better in rooms where the floor is seen as a whole.",
      },
      {
        q: "Which carpet is best for a high-traffic area?",
        a: "A short, dense pile in a mid-tone colour. Long piles flatten in walkways and show every track, while very light and very dark colours both show marks. In offices and corridors we would normally recommend contract-grade carpet tiles for the same reason.",
      },
      {
        q: "Do you supply carpet for mosques and events?",
        a: "Yes, both. We supply and fit prayer-hall carpet with the traditional row markings, and we lay event carpet for exhibitions, conferences and weddings, usually overnight, then lift it afterwards.",
      },
    ],
    secondary: {
      heading: "Carpet for offices, events and outdoor areas",
      intro: [
        "Beyond wall-to-wall carpet for homes and majlis, three other kinds of carpet work make up much of what we do in Qatar, and each is handled differently from a domestic fit.",
        "Office carpet is normally supplied as carpet tiles and fitted around working hours, so a floor can be re-covered without the business closing. Event carpet is laid to a venue's access window, usually overnight, and lifted once the event closes. Grass carpet is an outdoor product laid over a compacted, free-draining base rather than straight onto sand.",
      ],
      specs: [
        { label: "Office carpet", value: "Carpet tiles, fitted out of hours" },
        { label: "Event carpet", value: "Overnight installation, lifted after" },
        { label: "Grass carpet", value: "Laid over a drained, compacted base" },
        { label: "Mosque carpet", value: "Prayer-hall carpet with row markings" },
      ],
      faqs: [
        {
          q: "Can you re-carpet an office without closing it?",
          a: "Yes. Office floors are normally fitted in phases in the evenings or at weekends, department by department. Furniture is moved aside, the area is laid and put back, and the space is usable again the next working morning.",
        },
        {
          q: "Do you lay artificial grass as well as carpet?",
          a: "Yes. Grass carpet is laid for villa gardens, roof terraces, play areas and entrance steps. The important part is the base underneath it: laid over compacted, free-draining material it stays flat, whereas grass laid straight onto sand develops dips within a couple of years.",
        },
      ],
    },
  },
  {
    slug: "barkia",
    key: "barkia",
    label: "Barkia & PVC",
    heading: "Barkia & PVC Flooring in Qatar",
    seoTitle: "Barkia Flooring in Qatar | Supply & Installation",
    metaDescription:
      "Barkia flooring supplied and installed across Qatar. Waterproof, hard-wearing surfaces for majlis, villas and offices, with free measurement and fitting in Doha.",
    heroImage: "/Products/barkia&pvc/barkia.webp",
    heroImageAlt: "Barkia flooring installed in a Doha villa by Al Arabia Carpets",
    intro: [
      "Barkia is one of the most widely used floor finishes in Qatar, valued for standing up to heat, humidity and heavy foot traffic while staying easy to clean. Al Arabia Carpets supplies and fits barkia for villas, majlis, offices, shops and outdoor terraces throughout Doha and the surrounding municipalities.",
      "Our team measures your space, recommends the right thickness and finish for the room, and handles the full installation, including sub-floor preparation and skirting. Delivery and fitting anywhere in Qatar are included.",
    ],
    specs: [
      {
        label: "Application",
        value: "Residential, commercial and outdoor",
      },
      {
        label: "Water resistance",
        value: "Fully waterproof surface",
      },
      {
        label: "Installation",
        value: "Included, by our own fitters",
      },
      {
        label: "Measurement",
        value: "Free on-site survey in Doha",
      },
      {
        label: "Service area",
        value: "All of Qatar",
      },
    ],
    faqs: [
      {
        q: "What is barkia flooring?",
        a: "Barkia is a durable, waterproof floor covering widely used in Qatar for homes, majlis and commercial spaces. It resists heat and humidity, cleans easily, and can be laid over most existing sub-floors.",
      },
      {
        q: "Do you install barkia across Qatar?",
        a: "Yes. Al Arabia Carpets delivers and installs across Doha, Al Wakra, Al Khor, Lusail, Al Rayyan and the rest of Qatar. Delivery and installation are included.",
      },
      {
        q: "How long does barkia installation take?",
        a: "Most residential rooms are completed in a single day. Larger villas and commercial areas are scheduled over two or three days, and we confirm the timeline after the on-site measurement.",
      },
      {
        q: "Can barkia be installed over existing tiles?",
        a: "In most cases yes, provided the tiles are sound and level. Our installer checks the sub-floor during the free survey and advises if any preparation is needed.",
      },
    ],
  },
  {
    slug: "curtain",
    key: "curtains",
    label: "Curtains",
    heading: "Curtains & Blinds in Qatar",
    seoTitle: "Curtains in Qatar | Made to Measure in Doha",
    metaDescription:
      "Made-to-measure curtains in Qatar. Blackout, sheer and lined options with tracks, poles and full fitting. Free measurement and installation across Doha.",
    heroImage: "/Products/Curtain/curtain.webp",
    heroImageAlt: "Made-to-measure curtains fitted in a Doha living room",
    intro: [
      "We make curtains to the exact measurements of your windows, so they hang correctly and close without gaps at the edges \u2014 which matters a great deal for blocking light and heat in Qatar.",
      "Choose blackout linings for bedrooms, sheers for living areas, or a layered combination. We supply and fit the tracks or poles as well, and measurement and installation are included.",
    ],
    specs: [
      {
        label: "Made to measure",
        value: "Cut to your window sizes",
      },
      {
        label: "Options",
        value: "Blackout, sheer, lined, layered",
      },
      {
        label: "Hardware",
        value: "Tracks and poles supplied and fitted",
      },
      {
        label: "Measurement",
        value: "Free on-site survey",
      },
      {
        label: "Installation",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "Do you measure and install curtains in Doha?",
        a: "Yes. We measure your windows free of charge, make the curtains to those measurements, and fit them along with the track or pole. Installation is included.",
      },
      {
        q: "Do blackout curtains help with the heat?",
        a: "Yes. A lined blackout curtain blocks direct sun and reduces the heat coming through the glass, which noticeably helps in rooms that take the afternoon sun.",
      },
      {
        q: "Can I combine sheers with blackout curtains?",
        a: "Yes, layering is common. A sheer keeps daytime privacy while letting light through, with a blackout curtain closing over it at night. We fit a double track for this.",
      },
      {
        q: "How long do made-to-measure curtains take?",
        a: "Usually a couple of weeks from the measuring visit, and the fabric normally sets the pace rather than the making. If a fabric has to be ordered in we tell you at quotation stage rather than after you have committed to it.",
      },
      {
        q: "Which blinds suit an office?",
        a: "Roller and vertical blinds, in most cases. Both control glare on screens without darkening the room the way a curtain does, they take up almost no space at the window, and they are far easier to keep clean in a working office than fabric curtains.",
      },
      {
        q: "How do I measure for curtains?",
        a: "You do not need to. Measuring is the step most likely to go wrong, since it depends on the track position, the heading type and how far the curtain should extend past the glass. We measure free of charge and take responsibility for the result.",
      },
    ],
  },
  {
    slug: "majlis-sofa",
    key: "furniture",
    label: "Furniture",
    heading: "Majlis Sofas & Furniture in Qatar",
    seoTitle: "Majlis Sofas in Qatar | Custom Made in Doha",
    metaDescription:
      "Custom majlis sofas made in Qatar to your room measurements. Traditional floor seating and raised majlis in your choice of fabric, delivered across Doha.",
    heroImage: "/Products/Furniture/majlis-sofa.webp",
    heroImageAlt: "Custom traditional majlis seating in a Qatari home",
    intro: [
      "A majlis is built around its seating, so we make majlis sofas to the measurements of your room rather than to a fixed catalogue size. That means seating that runs cleanly along your walls with no awkward gaps at the corners.",
      "Choose from traditional floor-level majlis, raised majlis seating, and matching armrests, bolsters and cushions, in a wide range of fabrics. We measure, produce and deliver anywhere in Qatar.",
    ],
    specs: [
      {
        label: "Made to measure",
        value: "Sized to your room",
      },
      {
        label: "Styles",
        value: "Floor-level and raised majlis",
      },
      {
        label: "Includes",
        value: "Armrests, bolsters, cushions",
      },
      {
        label: "Fabric",
        value: "Wide range, samples brought to you",
      },
      {
        label: "Delivery",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "Are majlis sofas made to measure?",
        a: "Yes. We measure your majlis and build the seating to fit the walls exactly, which avoids the gaps you get when standard-size pieces are pushed together.",
      },
      {
        q: "Can I choose the fabric?",
        a: "Yes. We bring fabric samples to you so you can see colour and texture in your own lighting before deciding.",
      },
      {
        q: "How long does a custom majlis take?",
        a: "Production time depends on the size of the majlis and the fabric selected. We confirm a firm lead time when we measure and quote.",
      },
    ],
    // Folded in from the retired /products/sofa hub, which now 301s here.
    // Keeps the "sofas for living rooms and offices" topic on the surviving URL.
    secondary: {
      heading: "Sofas for living rooms and offices",
      intro: [
          "We supply sofas for living rooms, majlis and offices across Qatar, both ready-made and built to your own dimensions when a standard size will not suit the room.",
          "Frames are built for everyday family use and upholstered in your choice of fabric. We bring samples to you, and delivery anywhere in Qatar is included.",
        ],
      specs: [
          {
            label: "Options",
            value: "Custom-built and ready-made",
          },
          {
            label: "Suitable for",
            value: "Living rooms, majlis, offices",
          },
          {
            label: "Fabric",
            value: "Your choice, samples provided",
          },
          {
            label: "Delivery",
            value: "Included across Qatar",
          },
        ],
      faqs: [
          {
            q: "Can you build a sofa to my own size?",
            a: "Yes. If a standard sofa will not fit the space, we build to your measurements and confirm the dimensions with you before production starts.",
          },
          {
            q: "Do you deliver sofas across Qatar?",
            a: "Yes, delivery is included anywhere in Qatar, and our team positions the sofa in the room for you.",
          },
        ],
    },
  },
  {
    slug: "interior",
    key: "interior",
    label: "Interior Design",
    heading: "Interior Design in Qatar",
    seoTitle: "Interior Design in Qatar | Doha Fit-Out Services",
    metaDescription:
      "Interior design and fit-out in Qatar. Gypsum work, wall panelling, cabinetry, flooring and furnishing delivered as one project by Al Arabia Carpets in Doha.",
    heroImage: "/Products/Interior Design/interior.webp",
    heroImageAlt: "Completed interior design and fit-out project in Doha, Qatar",
    intro: [
      "We take on interior design and fit-out for homes and offices across Qatar, covering gypsum board work, false ceilings, wall panelling, TV units, cabinetry, flooring, curtains and furniture.",
      "Because we supply the flooring, curtains and furniture ourselves, the whole project runs through one team, which keeps the finishes coordinated and avoids the gaps that appear when several contractors are involved.",
    ],
    specs: [
      {
        label: "Scope",
        value: "Design through to full fit-out",
      },
      {
        label: "Includes",
        value: "Gypsum, panelling, cabinetry, ceilings",
      },
      {
        label: "Also supplied",
        value: "Flooring, curtains, furniture",
      },
      {
        label: "Projects",
        value: "Villas, apartments, offices, retail",
      },
      {
        label: "Consultation",
        value: "Free, on site in Doha",
      },
    ],
    faqs: [
      {
        q: "Do you handle the whole fit-out or just the design?",
        a: "Both. We can produce the design and carry out the full fit-out, including gypsum work, ceilings, panelling, cabinetry, flooring, curtains and furniture.",
      },
      {
        q: "Do you work on offices as well as homes?",
        a: "Yes. We take on villas, apartments, offices and retail spaces across Qatar.",
      },
      {
        q: "Is the consultation free?",
        a: "Yes. We visit the property in Doha, discuss what you want to achieve, and prepare a quotation at no cost.",
      },
    ],
  },
];

/** category key -> short label. Single source of truth; re-exported by lib/seo. */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.key, c.label])
);

export function categoryLabel(key: string): string {
  return CATEGORY_LABELS[key] ?? key;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Look a category up by the `Product.category` value rather than by slug. */
export function categoryForKey(key: string): Category | undefined {
  return categories.find((c) => c.key === key);
}

/** URL of the landing page for a `Product.category` value. */
export function categoryPath(key: string): string | undefined {
  const c = categoryForKey(key);
  return c ? `/products/${c.slug}` : undefined;
}
