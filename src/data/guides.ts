/**
 * Educational guides supporting the transactional product pages.
 *
 * Mirrors the src/data/products.ts convention: a typed interface plus a plain
 * array, consumed by generateStaticParams and app/sitemap.ts.
 *
 * `relatedProductIds` is what makes this a topic cluster rather than a blog:
 * every guide links into the money pages, and product pages link back.
 */

export interface GuideSection {
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  /** Optional bullet list, rendered after the paragraphs. */
  bullets?: string[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** <title> override. Keep under 60 characters. */
  seoTitle?: string;
  /** Meta description, 150-160 characters. */
  metaDescription: string;
  /** Shown on the index card and as the article intro. */
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  /** ISO date, used for lastModified and article metadata. */
  updatedAt: string;
  intro: string[];
  sections: GuideSection[];
  faqs?: GuideFaq[];
  /** Product ids this guide links into. */
  relatedProductIds: string[];
}

export const guides: Guide[] = [
  {
    slug: "barkia-buying-guide-qatar",
    title: "Barkia Buying Guide for Qatar Homes",
    seoTitle: "Barkia Buying Guide for Qatar Homes",
    metaDescription:
      "How to choose barkia flooring in Qatar: PVC vs SPC, thickness, wet areas, and what installation should include. A practical guide from Al Arabia Carpets, Doha.",
    excerpt:
      "PVC or SPC, what thickness to ask for, which rooms need a fully waterproof floor, and what a proper installation includes.",
    heroImage: "/Products/barkia&pvc/barkia.webp",
    heroImageAlt: "Barkia flooring installed in a Doha home",
    updatedAt: "2026-08-22",
    intro: [
      "Barkia is the default floor finish in a great many Qatari homes and offices, and for good reason: it handles heat and humidity, it takes heavy foot traffic, and it cleans up easily. But “barkia” covers a range of products, and the one that suits a majlis is not necessarily the one that suits a bathroom.",
      "This guide walks through the choices you actually have to make, in the order you will face them.",
    ],
    sections: [
      {
        heading: "PVC barkia or SPC barkia?",
        body: [
          "The first decision is the core material, because it determines how the floor copes with water.",
          "PVC barkia is entirely synthetic and waterproof through its full thickness. Standing water will not make it swell. SPC (stone plastic composite) adds a mineral core, which makes the plank more rigid and more resistant to dents from furniture legs, while still being highly water-resistant.",
        ],
        bullets: [
          "Bathrooms, kitchens, laundry rooms: choose PVC for full waterproofing.",
          "Majlis, bedrooms, living rooms: SPC gives a firmer underfoot feel and better dent resistance.",
          "Offices and retail: SPC handles rolling chairs and heavy footfall better.",
        ],
      },
      {
        heading: "Thickness and wear layer",
        body: [
          "Two numbers matter, and they are not the same thing. Overall thickness affects how solid the floor feels and how well it bridges small imperfections in the sub-floor. The wear layer is the clear top film that actually resists scratching, and it is what determines how long the floor keeps looking new.",
          "A thick plank with a thin wear layer will feel substantial and still scuff quickly. If you are comparing quotes, ask for both figures.",
        ],
      },
      {
        heading: "Sub-floor preparation",
        body: [
          "Most barkia in Qatar goes over existing tiles, which is usually fine provided the tiles are sound and reasonably level. Problems come from skipped preparation: loose tiles telegraph through, and wide grout lines can show as faint lines across the new floor over time.",
          "A proper survey checks for level, loose sections and moisture before anything is ordered. Be wary of a quote given over the phone without anyone visiting.",
        ],
      },
      {
        heading: "What the installation should include",
        body: [
          "Compare what is actually in the price, not just the per-metre rate.",
        ],
        bullets: [
          "On-site measurement before the order is placed.",
          "Sub-floor preparation and levelling where needed.",
          "Skirting or beading to finish the perimeter.",
          "Door trims and thresholds where the floor meets another surface.",
          "Removal of the old floor covering and site clean-up.",
          "Delivery to your location.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can barkia be installed over existing tiles in Qatar?",
        a: "In most cases yes. The tiles need to be sound, well bonded and reasonably level. An installer should check this during an on-site survey and tell you if levelling work is needed first.",
      },
      {
        q: "Is barkia suitable for bathrooms?",
        a: "PVC barkia is, because it is waterproof through its full thickness. For bathrooms, laundry rooms and kitchens, ask specifically for PVC rather than a water-resistant composite.",
      },
      {
        q: "How long does barkia last?",
        a: "With a good wear layer and correct installation, barkia in a domestic setting lasts many years. Longevity depends far more on the wear layer thickness and the quality of the sub-floor preparation than on the headline plank thickness.",
      },
    ],
    relatedProductIds: ["barkia", "pvc-barkia", "spc-zigzag-barkia-installation", "skerting-nala-profile"],
  },
  {
    slug: "choosing-carpet-for-qatar-homes",
    title: "Choosing Carpet for Qatar Homes",
    seoTitle: "Choosing Carpet for Qatar Homes | Types & Fitting",
    metaDescription:
      "Carpet types for Qatar homes: broadloom, tiles, stair and mosque carpet. How to pick pile, handle dust and heat, and what fitting should include in Doha.",
    excerpt:
      "Which carpet type suits which room, how pile height affects wear and cleaning, and the practical realities of dust and air conditioning in Qatar.",
    heroImage: "/Products/Carpets/carpet.webp",
    heroImageAlt: "Wall-to-wall carpet fitted in a Qatari home",
    updatedAt: "2026-08-22",
    intro: [
      "Carpet does things hard flooring cannot: it softens sound, it is warm and comfortable underfoot, and it makes a majlis or bedroom feel finished. The trade-off is maintenance, and in Qatar that mostly means dust.",
      "Choosing well is less about brand and more about matching the carpet type and pile to the room it is going in.",
    ],
    sections: [
      {
        heading: "Match the carpet type to the room",
        body: [
          "Most of the decision is made once you know where the carpet is going.",
        ],
        bullets: [
          "Wall-to-wall broadloom: bedrooms and majlis, where you want an unbroken surface.",
          "Carpet tiles: offices and anywhere you need under-floor cable access or want to replace damaged sections individually.",
          "Stair carpet: templated per step, and the one job where fitting quality matters most.",
          "Mosque and prayer-hall carpet: dense pile for heavy traffic, in prayer-row or plain designs.",
          "Rugs: define a seating area without committing the whole floor.",
        ],
      },
      {
        heading: "Pile height and density",
        body: [
          "A long, loose pile feels luxurious and is the least practical choice in a dusty climate: it traps fine dust deep in the fibres and takes far more vacuuming to keep clean. A short, dense pile holds its shape under traffic and releases dust more readily.",
          "Density matters more than height for durability. Press your thumb into a sample; if you can easily feel the backing, it will flatten in traffic areas.",
        ],
      },
      {
        heading: "Living with dust and air conditioning",
        body: [
          "Fine dust is the main maintenance factor in Qatar, and it settles into carpet continuously. A short dense pile plus regular vacuuming handles it well, and a professional deep clean once or twice a year lifts what vacuuming leaves behind.",
          "Air conditioning keeps indoor humidity low, which suits carpet well. The place to watch is where a unit discharges directly onto the floor, since repeated condensation in one spot will mark any carpet over time.",
        ],
      },
      {
        heading: "What fitting should include",
        body: [
          "Carpet is cut to your room, so the fitting is part of the product rather than an add-on.",
        ],
        bullets: [
          "On-site measurement, with the fitter planning where any joins fall.",
          "Underlay where the carpet type calls for it.",
          "Joins positioned away from doorways and sight lines.",
          "Edges finished and door thresholds fitted.",
          "Removal of the old covering and clean-up.",
        ],
      },
    ],
    faqs: [
      {
        q: "What carpet is best for a majlis?",
        a: "A short, dense pile in wall-to-wall broadloom. It holds up to the traffic a majlis sees, stays easy to vacuum in a dusty climate, and gives the unbroken surface that suits floor-level seating.",
      },
      {
        q: "How often should carpet be professionally cleaned in Qatar?",
        a: "Once or twice a year for most homes, alongside regular vacuuming. Fine dust settles deep into the pile and a deep clean lifts what a vacuum leaves behind.",
      },
      {
        q: "Are carpet tiles better than broadloom for an office?",
        a: "Generally yes. Tiles wear well, lift for under-floor cable access, and let you replace a stained or damaged tile individually rather than relaying the whole floor.",
      },
    ],
    relatedProductIds: ["carpet", "tiles-carpet-office-carpet", "mosque-masjid-carpet", "stairs-carpet-installation"],
  },
  {
    slug: "majlis-interior-design-ideas",
    title: "Majlis Interior Design Ideas for Qatari Homes",
    seoTitle: "Majlis Interior Design Ideas for Qatari Homes",
    metaDescription:
      "Majlis design ideas for Qatari homes: seating layout, floor-level vs raised, fabrics, lighting, curtains and flooring. Practical guidance from Al Arabia Carpets.",
    excerpt:
      "How to plan majlis seating that fits the room, choose between floor-level and raised, and coordinate fabric, lighting and flooring.",
    heroImage: "/Products/Furniture/majlis-sofa.webp",
    heroImageAlt: "Traditional majlis seating arrangement in a Qatari home",
    updatedAt: "2026-08-22",
    intro: [
      "The majlis is where guests are received, so it carries more weight than any other room in the house. Getting it right is mostly about the seating layout, and everything else follows from that.",
      "Here is how we approach a majlis, and the decisions worth thinking about before anything is ordered.",
    ],
    sections: [
      {
        heading: "Start with the seating layout",
        body: [
          "Traditional majlis seating runs continuously along the walls, which is what makes the room feel generous and keeps every guest in the same conversation. That only works if the seating is sized to the room.",
          "This is the single biggest reason to have majlis seating made to measure rather than assembled from standard pieces. Standard sofas pushed end to end leave gaps at the corners and stop short of the walls, which breaks the line and wastes floor area.",
        ],
      },
      {
        heading: "Floor-level or raised?",
        body: [
          "Both are traditional and the choice is mostly practical.",
        ],
        bullets: [
          "Floor-level majlis: closer to the traditional arrangement, seats more people in the same footprint, and makes a room feel larger.",
          "Raised majlis: easier for older guests to get in and out of, and sits more comfortably alongside western-style furniture elsewhere in the house.",
          "A raised majlis with a floor-level extension for larger gatherings is a common compromise.",
        ],
      },
      {
        heading: "Fabric, and why you should see it in the room",
        body: [
          "Majlis seating covers a large continuous area, so the fabric dominates the room far more than a sofa would in a living room. A colour that looks subtle on a small swatch can be overwhelming across six metres of seating.",
          "Always look at samples in the actual room, in daylight and under the lighting you will use in the evening. Heavier fabrics wear better in a majlis that is used regularly, and mid-tones hide everyday marks better than very light or very dark ones.",
        ],
      },
      {
        heading: "Coordinating flooring, curtains and lighting",
        body: [
          "A majlis reads as one composition, so the finishes need to be decided together rather than one at a time.",
        ],
        bullets: [
          "Flooring: a short dense carpet for warmth and sound, or barkia with large rugs defining the seating area.",
          "Curtains: full-length and lined. They control the afternoon sun and, just as importantly, absorb sound in a room with a lot of hard surfaces.",
          "Lighting: layer it. A single bright ceiling fixture flattens the room; wall lighting and lamps at seating level are far more comfortable for guests.",
          "Gypsum ceiling detail and wall panelling add depth without taking up any floor area.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should majlis seating be custom made?",
        a: "For most rooms, yes. Majlis seating runs along the walls, and standard-size pieces leave gaps at the corners and stop short of the ends. Made-to-measure seating follows the walls exactly and uses the full floor area.",
      },
      {
        q: "What is the difference between a floor-level and a raised majlis?",
        a: "Floor-level seating sits directly on the floor, seats more people in the same space, and is closer to the traditional arrangement. A raised majlis sits at normal sofa height and is easier for older guests to use.",
      },
      {
        q: "What flooring works best in a majlis?",
        a: "Either a short, dense wall-to-wall carpet, which adds warmth and absorbs sound, or barkia with large rugs defining the seating area. Both suit floor-level and raised seating.",
      },
    ],
    relatedProductIds: ["majlis-sofa", "luxury-majlis-sofa", "interior", "curtain"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Guides that link to a given product, for the reverse cluster link. */
export function guidesForProduct(productId: string): Guide[] {
  return guides.filter((g) => g.relatedProductIds.includes(productId));
}
