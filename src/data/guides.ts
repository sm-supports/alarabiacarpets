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
  /** Category landing pages this guide links into (src/data/categories.ts). */
  relatedCategorySlugs?: string[];
}

export const guides: Guide[] = [
  {
    slug: "choosing-curtains-and-blinds-qatar",
    title: "Choosing Curtains and Blinds for Qatar Homes",
    seoTitle: "Choosing Curtains & Blinds for Qatar Homes",
    metaDescription:
      "How to choose curtains and blinds in Qatar: blackout vs sheer, layering, heat and glare control, tracks vs poles, and how to measure. From Al Arabia Carpets, Doha.",
    excerpt:
      "Blackout, sheer or layered; what actually reduces heat; roller versus vertical for offices; and how to measure so they hang properly.",
    heroImage: "/Products/Curtain/curtain.webp",
    heroImageAlt: "Made-to-measure curtains hanging in a Doha living room",
    updatedAt: "2026-08-23",
    intro: [
      "In most countries curtains are chosen on how they look. In Qatar they are doing real work as well: blocking a sun that will heat a room through the glass all afternoon, and cutting the glare that makes a screen unreadable.",
      "That means the fabric decision and the room decision are the same decision. This guide goes through it in the order it actually comes up.",
    ],
    sections: [
      {
        heading: "Blackout, sheer, or both?",
        body: [
          "The first question is how much light you want to keep out, and at what times of day.",
          "A blackout lining blocks essentially all light and, just as importantly, blocks the radiant heat coming through the glass. A sheer diffuses light and gives daytime privacy while keeping the room bright. Layering the two on a double track is the most flexible arrangement and the one we fit most often.",
        ],
        bullets: [
          "Bedrooms: blackout, particularly on any window taking morning or afternoon sun.",
          "Living rooms and majlis: layered — sheer by day, blackout closed in the evening.",
          "Rooms with a view you want to keep: sheer alone, or a sunscreen roller blind.",
          "Rooms that overheat: blackout with a lining, closed during the hottest hours.",
        ],
      },
      {
        heading: "What actually reduces heat",
        body: [
          "A curtain reduces heat by stopping sunlight before it is absorbed by surfaces inside the room. Once the floor and furniture have warmed up, closing the curtain no longer helps much — which is why the timing matters more than people expect.",
          "The practical rule is to close them on the sun-facing side before the room heats, not after. A lined curtain, hung close to the glass and wide enough to overlap the reveal at each side, does noticeably more than an unlined one hung narrow.",
        ],
      },
      {
        heading: "Roller and vertical blinds for offices",
        body: [
          "Offices have a different problem: glare on screens rather than heat and privacy. A sunscreen roller blind cuts glare while keeping the view and the daylight, which is usually preferable to blacking out a workspace.",
          "Vertical blinds suit wide window runs, because the slats can be angled to block low sun from one side without darkening the whole room. Between the two, the choice is mostly about window shape.",
        ],
        bullets: [
          "Wide window runs, low sun from one side: vertical blinds.",
          "Standard windows, screen glare: sunscreen roller blinds.",
          "Meeting rooms needing full darkening for projection: blackout roller.",
        ],
      },
      {
        heading: "Tracks, poles and how to measure",
        body: [
          "Curtains that do not hang properly are usually a hardware or measuring problem, not a fabric one. A track carries weight better and is what a double layer needs; a pole is more decorative and suits a single lighter curtain.",
          "Measure the track or pole, not the window — the fabric width is calculated from the hardware, and the hardware should extend past the reveal on both sides so the curtain can stack clear of the glass. Height is measured from the fixing point to where you want the hem, which is a design choice: sill, below sill, or floor length.",
        ],
        bullets: [
          "Extend the track past the window on both sides so the curtain stacks off the glass.",
          "Fix higher than the window head — it makes the window and the room read taller.",
          "Floor length looks best in a majlis or living room; sill length suits kitchens.",
          "For layered curtains, specify a double track from the start.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do blackout curtains reduce heat in Qatar?",
        a: "Yes, provided they are closed before the room heats up rather than after. A lined blackout curtain hung close to the glass and overlapping the reveal at both sides blocks the sunlight before interior surfaces absorb it, which is where the heat gain actually comes from.",
      },
      {
        q: "Should I use curtains or blinds?",
        a: "Curtains for bedrooms, living rooms and majlis, where you want softness, sound absorption and full darkening. Blinds for offices, kitchens and anywhere the priority is controlling glare in a small amount of space. Plenty of homes use both, room by room.",
      },
      {
        q: "How do I measure for curtains?",
        a: "Measure the track or pole rather than the window, because the fabric width is calculated from the hardware. Extend it past the reveal on both sides so the curtain can stack clear of the glass, and decide the drop — sill, below sill or floor — before ordering. We measure free of charge, which removes the guesswork.",
      },
      {
        q: "What is a double track and do I need one?",
        a: "Two parallel tracks so a sheer and a blackout curtain can hang and operate independently. You need one if you want daytime privacy with light plus full darkening at night. It has to be specified at the start — retrofitting a second track means refixing the whole thing.",
      },
    ],
    relatedProductIds: ["home-curtains", "roller", "office-blind-office-roller-vertical-blinds"],
    relatedCategorySlugs: ["curtain"],
  },
  {
    slug: "interior-design-guide-qatar",
    title: "Planning an Interior Fit-Out in Qatar",
    seoTitle: "Planning an Interior Fit-Out in Qatar",
    metaDescription:
      "How to plan an interior fit-out in Qatar: what to decide first, gypsum ceilings and panelling, sequencing the trades, and what a fit-out quote should include.",
    excerpt:
      "What has to be decided before work starts, why the order of trades matters more than any single choice, and what a quote should cover.",
    heroImage: "/Products/Interior Design/interior.webp",
    heroImageAlt: "Completed interior fit-out with gypsum ceiling detail in Doha",
    updatedAt: "2026-08-23",
    intro: [
      "Most fit-outs do not go wrong because someone picked the wrong colour. They go wrong at the handovers — a floor laid before the joinery was scribed to it, lighting positions fixed before the ceiling design was settled, a wardrobe built to a wall that later got panelled.",
      "This guide is about the order of decisions, which in our experience matters more than any individual choice in it.",
    ],
    sections: [
      {
        heading: "Decide these before anything is ordered",
        body: [
          "A handful of decisions constrain everything downstream. Settling them early costs nothing; changing them once work has started is where budgets go.",
        ],
        bullets: [
          "Lighting positions — they must be fixed before the ceiling is boarded.",
          "Whether the ceiling is dropped, and by how much, since it sets the final room height.",
          "Where built-in joinery goes, so wall finishes stop and start in the right places.",
          "Floor finish, because it determines threshold heights at every doorway.",
          "Whether power and data sockets need moving, which is a first-fix job.",
        ],
      },
      {
        heading: "Ceilings and wall panelling",
        body: [
          "Gypsum is what turns a flat ceiling into part of the design. A dropped section over a seating area, a perimeter cove concealing indirect lighting, or a bulkhead defining a dining zone all add depth without using any floor area — which matters in a room that is already furnished to its limit.",
          "Wall panelling does the same job vertically. The thing to keep in mind is restraint: one panelled feature wall against three plain ones reads as deliberate, whereas panelling every wall closes the room in and cancels the effect.",
        ],
      },
      {
        heading: "The order the trades should run in",
        body: [
          "This sequence is the single most useful thing in this guide. Running it out of order is what produces the gaps, the mismatched levels and the repainting.",
        ],
        bullets: [
          "First fix: electrical and any plumbing moves, before anything closes up.",
          "Gypsum: ceilings, bulkheads and coves, with lighting positions already set.",
          "Joinery: built-in cabinetry, scribed to the finished walls.",
          "Wall finishes: panelling, wallpaper or paint.",
          "Flooring: laid once dust-generating work is finished.",
          "Curtains and furniture: measured against the finished room, not the drawing.",
        ],
      },
      {
        heading: "What a fit-out quote should include",
        body: [
          "Compare quotes on what is actually covered, not the headline number. The gaps are where the variations come from later.",
        ],
        bullets: [
          "A site survey before any figure is given.",
          "Making good: filling, sanding and preparing surfaces, not just the new work.",
          "Removal and disposal of what is being taken out.",
          "Threshold and skirting details where finishes meet.",
          "A stated sequence and a realistic timeline per phase.",
          "Who is responsible for painting, and whether it is in or out.",
        ],
      },
    ],
    faqs: [
      {
        q: "What should be decided first in a fit-out?",
        a: "Lighting positions and whether the ceiling is being dropped. Both have to be fixed before the gypsum goes up, and both are expensive to change afterwards because it means opening the ceiling again. Almost everything else can be adjusted later at a manageable cost.",
      },
      {
        q: "How much ceiling height does a false ceiling take?",
        a: "Usually 10 to 20 centimetres, depending on the detail and what services run above it. In a room that is already low we would suggest a partial drop over one zone rather than the whole ceiling, so you get the detail without losing the height everywhere.",
      },
      {
        q: "Should one contractor handle the whole fit-out?",
        a: "It removes the handover problem, which is where most fit-out defects originate. When flooring, joinery and gypsum are quoted by different contractors, each sets out to their own tolerances and the junctions between them are nobody's responsibility.",
      },
      {
        q: "Can a fit-out be done while we live in the house?",
        a: "Yes, if it is phased room by room. We complete one room fully and hand it back before opening the next, so the house stays liveable. It takes longer overall than clearing out, but for most families that is the right trade.",
      },
    ],
    relatedProductIds: [
      "gypsum-board-work-design",
      "cabinet-and-gypsum-board-work",
      "indoor-wall-panel-design",
      "television-decore-with-cabin-box",
    ],
    relatedCategorySlugs: ["interior"],
  },
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
    relatedProductIds: ["pvc-barkia", "spc-zigzag-barkia-installation", "skerting-nala-profile"],
    relatedCategorySlugs: ["barkia"],
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
    relatedProductIds: ["tiles-carpet-office-carpet", "mosque-masjid-carpet", "stairs-carpet-installation"],
    relatedCategorySlugs: ["carpet"],
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
    relatedProductIds: ["luxury-majlis-sofa"],
    relatedCategorySlugs: ["majlis-sofa", "interior", "curtain"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Guides that link to a given product, for the reverse cluster link. */
export function guidesForProduct(productId: string): Guide[] {
  return guides.filter((g) => g.relatedProductIds.includes(productId));
}

/** Guides that link to a given category landing page. */
export function guidesForCategory(categorySlug: string): Guide[] {
  return guides.filter((g) => g.relatedCategorySlugs?.includes(categorySlug));
}
