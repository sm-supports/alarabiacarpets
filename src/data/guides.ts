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
  /**
   * Optional table, rendered after the bullets. For prices and comparisons: a real
   * <table> is what answer engines lift whole. Prices must match `priceFrom` in
   * src/data/products.ts or services.ts.
   */
  table?: GuideTable;
}

export interface GuideTable {
  caption: string;
  head: string[];
  rows: string[][];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  /**
   * <title> override, 60 characters at most. " | Al Arabia Carpets" is added only
   * when the result still fits in 60, so an override over 40 characters must differ
   * from `title`, or the <title> comes out identical to the <h1>.
   */
  seoTitle?: string;
  /** Meta description, 150-160 characters. */
  metaDescription: string;
  /** Shown on the index card and as the article intro. */
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  /**
   * ISO date the guide first went live, from its first commit. Article
   * datePublished; never changes.
   */
  publishedAt: string;
  /** ISO date of the last real content change: dateModified and sitemap lastModified. */
  updatedAt: string;
  /**
   * The direct answer to the question the title asks, in two or three sentences.
   * Shown in a box above the intro and emitted as the Article's `abstract`, so a
   * reader or an answer engine gets the conclusion before the detail.
   */
  answer: string;
  /** An id from src/data/authors.ts. Unset: the guide is credited to the company. */
  authorId?: string;
  intro: string[];
  sections: GuideSection[];
  faqs?: GuideFaq[];
  /** Product ids this guide links into. */
  relatedProductIds: string[];
  /** Category landing pages this guide links into (src/data/categories.ts). */
  relatedCategorySlugs?: string[];
  /** Service landing pages this guide links into (src/data/services.ts). */
  relatedServiceSlugs?: string[];
}

export const guides: Guide[] = [
  {
    slug: "choosing-curtains-and-blinds-qatar",
    title: "Choosing Curtains and Blinds for Qatar Homes",
    seoTitle: "Choosing Curtains & Blinds for Qatar Homes",
    metaDescription:
      "How to choose curtains and blinds in Qatar: blackout vs sheer, layering, heat and glare control, tracks vs poles, and how to measure your windows.",
    excerpt:
      "Blackout, sheer or layered; what actually reduces heat; roller versus vertical for offices; and how to measure so they hang properly.",
    heroImage: "/Products/Curtain/curtain.webp",
    heroImageAlt: "Made-to-measure curtains hanging in a Doha living room",
    publishedAt: "2026-08-23",
    updatedAt: "2026-11-17",
    answer:
      "For most Qatar homes, layer them: a sheer for daytime privacy and a lined blackout curtain on a double track, closed before the afternoon sun heats the room. Bedrooms need blackout on any sun-facing window, and offices are usually better served by sunscreen roller or vertical blinds, which cut screen glare and keep the daylight.",
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
      "How to plan an interior fit-out in Qatar: what to decide first, gypsum ceilings and panelling, sequencing the trades, and what a quote should include.",
    excerpt:
      "What has to be decided before work starts, why the order of trades matters more than any single choice, and what a quote should cover.",
    heroImage: "/Products/Interior Design/interior.webp",
    heroImageAlt: "Completed interior fit-out with gypsum ceiling detail in Doha",
    publishedAt: "2026-08-23",
    updatedAt: "2026-11-17",
    answer:
      "Get the order right before the finishes: fix lighting positions and the ceiling drop first, then run the trades as first fix, gypsum, joinery, wall finishes, flooring, and finally curtains and furniture. Most fit-out defects come from handovers between trades, so one contractor working to one sequence avoids most of them.",
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
    relatedServiceSlugs: ["cabinets", "kitchen-cabinets", "wardrobes", "gypsum-c-board-fixing", "tv-unit-design", "wallpaper"],
  },
  {
    slug: "barkia-buying-guide-qatar",
    title: "Barkia Buying Guide for Qatar Homes",
    seoTitle: "Barkia Buying Guide for Qatar Homes",
    metaDescription:
      "How to choose barkia flooring in Qatar: PVC vs SPC, thickness, wet areas, and what installation should include. A practical guide from Al Arabia Carpets.",
    excerpt:
      "PVC or SPC, what thickness to ask for, which rooms need a fully waterproof floor, and what a proper installation includes.",
    heroImage: "/Products/barkia&pvc/barkia.webp",
    heroImageAlt: "Barkia flooring installed in a Doha home",
    publishedAt: "2026-08-22",
    updatedAt: "2026-11-17",
    answer:
      "Choose the core first: PVC barkia for bathrooms, kitchens and laundry rooms, because it is waterproof through its full thickness, and SPC for majlis, bedrooms and offices, because it is firmer and resists dents better. Then compare the wear layer rather than the overall thickness, and make sure the price includes sub-floor preparation.",
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
    relatedServiceSlugs: ["vinyl-flooring", "parquet-flooring"],
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
    publishedAt: "2026-08-22",
    updatedAt: "2026-11-17",
    answer:
      "Match the carpet to the room and choose a short, dense pile: it holds its shape under traffic and releases the fine dust Qatar homes live with, where a long loose pile traps it. Wall-to-wall broadloom suits bedrooms and majlis, carpet tiles suit offices, and the fitting matters as much as the carpet.",
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
    relatedServiceSlugs: ["office-carpet", "event-carpet"],
  },
  {
    slug: "majlis-interior-design-ideas",
    title: "Majlis Interior Design Ideas for Qatari Homes",
    // Differs from `title` (the h1) on purpose: an identical h1 and <title> is flagged as duplicate content.
    seoTitle: "Majlis Design for Home: Layouts, Seating & Room Plans",
    metaDescription:
      "Planning a majlis at home? Compare seating layouts, floor-level or raised seating, fabrics, lighting, curtains and flooring, with advice from our Doha team.",
    excerpt:
      "How to plan majlis seating that fits the room, choose between floor-level and raised, and coordinate fabric, lighting and flooring.",
    heroImage: "/Products/Furniture/majlis-sofa.webp",
    heroImageAlt: "Traditional majlis seating arrangement in a Qatari home",
    publishedAt: "2026-08-22",
    updatedAt: "2026-11-17",
    answer:
      "Start with the seating: majlis seating made to measure along the walls, floor-level or raised depending on who will use it, decides the rest of the room. Then choose the fabric from samples seen in the room itself, and plan the flooring, lined full-length curtains and layered lighting together as one scheme.",
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
    relatedServiceSlugs: ["sofa-making", "sofa-upholstery", "cabinets"],
  },
  {
    slug: "vinyl-vs-parquet-flooring-qatar",
    title: "Vinyl vs Parquet Flooring in Qatar",
    seoTitle: "Vinyl vs Parquet Flooring in Qatar",
    metaDescription:
      "Vinyl, SPC or parquet? A straight comparison for Qatar homes on water resistance, cost, feel underfoot, repairs and which rooms each one actually suits.",
    excerpt:
      "Which one belongs in which room: water resistance, cost, how each feels underfoot, and what happens when a board gets damaged.",
    heroImage: "/Products/barkia&pvc/barkia.webp",
    heroImageAlt: "Wood-effect SPC vinyl flooring laid through an open-plan villa room in Qatar",
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-17",
    answer:
      "If water can reach the room, fit vinyl or SPC: its core is waterproof, while wood-based floors are damaged by standing water. If the room stays dry and you want real timber underfoot, fit wood parquet, which can be sanded and refinished, or laminate for a similar look at lower cost.",
    intro: [
      "Almost every flooring conversation we have in Doha comes down to the same question, even when it is not asked directly: should this room have a plastic floor that looks like wood, or a wood floor?",
      "Both are good products. They fail in completely different ways, though, and the room usually decides which one is right long before taste does. Here is the comparison as we would give it on a survey.",
    ],
    sections: [
      {
        heading: "Which rooms go which way?",
        body: [
          "If water is a realistic possibility in the room, fit vinyl or SPC. If the room stays dry and you want a genuine timber surface underfoot, fit real wood parquet, or laminate for a similar look at a lower cost.",
          "That single rule settles most rooms. Kitchens, bathrooms, laundry rooms, entrance halls and ground floors that open onto a garden all go to vinyl. Bedrooms, majlis, formal reception rooms and upstairs living areas can go either way.",
        ],
        table: {
          caption: "Vinyl or SPC against wood parquet, at a glance",
          head: ["", "Vinyl or SPC", "Wood parquet"],
          rows: [
            ["Water", "Waterproof core, unaffected by standing water", "Engineered boards tolerate humidity, not standing water"],
            ["Best rooms", "Kitchens, bathrooms, laundry rooms, entrance halls, ground floors", "Bedrooms, majlis, formal reception rooms, upstairs living areas"],
            ["Damage", "Cannot be sanded; a worn board is replaced", "Can be sanded and refinished"],
            ["Cost", "Generally the cheaper floor", "Costs more; laminate gives a similar look for less"],
            ["Underfoot", "Can sound slightly hollow on a thin underlay", "Warmer feel and a denser sound"],
          ],
        },
      },
      {
        heading: "Water is the real dividing line",
        body: [
          "An SPC board has a rigid mineral core that does not absorb water. Spill a bucket on it, leave it an hour, mop it up, and the board is unchanged. Laminate in the same situation swells at the joints, and once a laminate board has swollen it never goes back.",
          "This matters more in Qatar than the raw numbers suggest, because the failure is not usually a dramatic flood. It is a slow leak under a sink, or a washing machine hose weeping for a week behind a machine nobody moves.",
        ],
        bullets: [
          "Vinyl and SPC: fully waterproof core, unaffected by standing water.",
          "Laminate: swells permanently at the joints once water gets in.",
          "Engineered parquet: tolerates humidity, but not standing water.",
          "In any room, water can still reach the sub-floor through the joints, so wet rooms need sealing at the perimeter as well.",
        ],
      },
      {
        heading: "Cost, and where the money actually goes",
        body: [
          "Vinyl is generally the cheaper floor, but the gap is smaller than people expect once fitting is included, and the preparation cost is identical. Both are floating floors, and both need a level sub-floor to sit on.",
          "That preparation is the line item that moves a quote most. Laying either product over an uneven tiled floor without levelling it first will show as dipping and, on a clicked floor, joints that open up. If a quote looks unusually cheap, this is normally the step that has been left out of it.",
        ],
      },
      {
        heading: "How each one handles damage",
        body: [
          "Parquet can be repaired in a way vinyl cannot. A solid or thick engineered board can be sanded and refinished, so scratches and dents come out and the floor is restored rather than replaced.",
          "Vinyl cannot be sanded, because the visible layer is a printed film with a wear coat over it. Once that wear layer is through, the board is replaced. On a clicked floor that means lifting back to the damaged board, which is straightforward near a wall and tedious in the middle of a room.",
        ],
      },
      {
        heading: "Feel, sound and warmth",
        body: [
          "Parquet feels warmer and sounds denser underfoot. Vinyl over a thin underlay can sound slightly hollow, though a heavier board on a good underlay closes most of that gap.",
          "Neither is a real factor in most Qatari homes, where floors are air-conditioned rather than heated. Where it does matter is upstairs bedrooms, since footfall on a floating floor carries to the room below more than tile does. A good acoustic underlay is worth specifying in either material.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is SPC the same thing as vinyl?",
        a: "Effectively yes. SPC is a type of vinyl flooring with a rigid stone-plastic composite core, which makes it harder and more dimensionally stable than older flexible vinyl. When people say vinyl, PVC, LVT or barkia in Qatar they are usually describing the same family of clicked plastic boards.",
      },
      {
        q: "Which is better for a villa ground floor?",
        a: "Usually vinyl or SPC. Ground floors here take sand from outside, open onto gardens and courtyards, and often include the kitchen and a guest bathroom on the same level. The waterproof core and the harder wear surface both count for more at ground level than the feel of real timber does.",
      },
      {
        q: "Can I have herringbone in vinyl?",
        a: "Yes. Herringbone and chevron are both available as SPC boards, so you can have the pattern with a waterproof core. The laying cost is higher than straight planks in either material, because every board is cut and fitted individually rather than run in rows.",
      },
      {
        q: "Which lasts longer in Qatar?",
        a: "In a dry, air-conditioned room a good parquet floor lasts longer, because it can be sanded and refinished rather than replaced. In a room that sees water, vinyl lasts far longer, because the failure that ends a timber or laminate floor simply does not happen to it.",
      },
    ],
    relatedProductIds: ["pvc-barkia", "pearl-grey-herringbone-100-waterproof-spc-qatar", "desert-walnut-classic-luxury-spc-flooring-doha"],
    relatedCategorySlugs: ["barkia"],
    relatedServiceSlugs: ["vinyl-flooring", "parquet-flooring"],
  },
  {
    slug: "office-carpet-tiles-guide-qatar",
    title: "Office Carpet Tiles: A Guide for Qatar Workplaces",
    seoTitle: "Office Carpet Tiles Guide for Qatar",
    metaDescription:
      "Carpet tiles or broadloom for a Doha office? How they compare on wear, repairs, acoustics and fitting around a working team, plus what to specify.",
    excerpt:
      "Tiles or broadloom, what wears fastest, why acoustics matter more than people expect, and how to fit without closing the office.",
    heroImage: "/Products/Carpets/Tiles carpet:office carpet.jpeg",
    heroImageAlt: "Grey striped carpet tiles laid in a quarter-turn pattern across an office floor",
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-17",
    answer:
      "For most Qatar offices, carpet tiles beat broadloom: a stained or worn tile is lifted and replaced on its own, and floor cabling stays accessible. Ask for spare tiles from the same batch to keep on site, value the carpet for its acoustics in open-plan space, and plan the fitting in evening or weekend phases.",
    intro: [
      "Office flooring gets specified once and then walked on by a hundred people a day for years. It is worth ten minutes of thought, because the difference between a good and a bad decision here shows up as either a floor that still looks presentable in year five, or one that needs replacing in year two.",
      "This guide covers the decision as it actually comes up in Doha offices: tiles or broadloom, what to specify, and how the fit-out is sequenced around a team that still has to work.",
    ],
    sections: [
      {
        heading: "Tiles or broadloom",
        body: [
          "For most offices, carpet tiles win, and the reason is repairs rather than looks. Coffee gets spilled, chair castors wear a patch by every desk, and a contractor drops something. With tiles you lift the affected tile and drop in a replacement. With broadloom you live with the mark or re-carpet the room.",
          "Broadloom still has a place. In a boardroom or a director's office, where the floor is seen as one continuous surface and the traffic is light, a seamless carpet looks better than a grid of tiles ever will.",
        ],
        bullets: [
          "Open-plan floors, corridors and lift lobbies: tiles.",
          "Boardrooms, cellular offices, executive areas: broadloom is defensible.",
          "Anywhere with floor boxes and heavy cabling: tiles, because access is far easier.",
        ],
      },
      {
        heading: "Ask for attic stock, always",
        body: [
          "The single most useful thing you can put in an office carpet specification is a quantity of spare tiles from the same production batch, stored on site.",
          "Carpet dye lots shift. A tile ordered in two years' time will be close but not identical, and on a plain colour the difference is obvious under office lighting. Spare tiles from your own batch make a future repair invisible. It costs very little at the point of order and cannot be bought later at any price.",
        ],
      },
      {
        heading: "Acoustics are a real part of the specification",
        body: [
          "In open-plan space, carpet is doing acoustic work as much as decorative work. Hard flooring reflects footfall, chair movement and conversation, and all of it adds to the background level people are trying to concentrate through.",
          "This is the argument that usually convinces a finance director: an open-plan floor on hard flooring is measurably harder to work in, and carpet is the cheapest intervention available. It costs far less than acoustic ceiling treatment and works on the surface generating most of the noise.",
        ],
      },
      {
        heading: "Fitting without closing the office",
        body: [
          "Almost no business can hand over an empty floor for a week, so office carpet is normally fitted in phases, in the evenings or at weekends, department by department.",
          "The practical constraint is desks and cabling. A phase involves moving furniture aside, lifting the old covering, laying the new tiles and putting everything back before the next working morning. Tell your fitter about floor boxes, server rooms and anything that cannot be powered down, because those dictate the sequence more than the floor area does.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long do office carpet tiles last?",
        a: "A contract-grade tile in a normal office holds up for many years, and because tiles are replaced individually the floor has no single end-of-life date. Corridors, doorways and lift lobbies wear several times faster than open-plan areas, which is exactly why spare tiles matter.",
      },
      {
        q: "Can carpet tiles be rotated to even out wear?",
        a: "Yes, and it is a genuinely useful maintenance tactic. Tiles from a worn doorway can be swapped with tiles from under a rarely-moved cabinet, spreading the wear across the floor and pushing back the point where the carpet needs attention. Plain and non-directional patterns make this easiest.",
      },
      {
        q: "What is a quarter-turn layout?",
        a: "It means each tile is laid rotated ninety degrees from its neighbour, so the pile direction alternates. It disguises small shade variations between tiles and makes future replacements blend in. Laying all tiles in the same direction, called monolithic, looks more like broadloom but shows replacements more clearly.",
      },
      {
        q: "Do we need to remove the old flooring first?",
        a: "Normally yes, and it should be included in the quote rather than added as an extra. Laying new tiles over an old covering traps whatever condition is underneath, and any unevenness or loose sections will show through the new floor within months.",
      },
    ],
    relatedProductIds: ["tiles-carpet-office-carpet", "office-blind-office-roller-vertical-blinds", "stairs-carpet-installation"],
    relatedCategorySlugs: ["carpet", "curtain"],
    relatedServiceSlugs: ["office-carpet", "event-carpet"],
  },
  {
    slug: "artificial-grass-guide-qatar",
    title: "Artificial Grass in Qatar: A Practical Guide",
    seoTitle: "Artificial Grass in Qatar: Buying Guide",
    metaDescription:
      "Choosing artificial grass in Qatar: pile height, drainage, UV stability and why the base under it matters more than the grass. From Al Arabia Carpets.",
    excerpt:
      "Pile height, drainage, heat and UV: what to specify, and why the base underneath decides how it looks in three years.",
    heroImage: "/Products/Carpets/Artificial grass installation work.jpeg",
    heroImageAlt: "Artificial grass laid over the entrance steps and landing of a villa in Qatar",
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-17",
    answer:
      "The base decides how an artificial lawn looks in a few years, not the grass: lay it over a compacted, free-draining sub-base rather than loose sand, with falls toward the existing drains on roofs and balconies. Where people walk, choose a shorter, denser, UV-stabilised pile; it stands up better and runs cooler in direct sun.",
    intro: [
      "Artificial grass makes obvious sense in Qatar. A real lawn here needs constant water and constant attention, and still struggles through the summer. Grass carpet stays green with almost no input.",
      "The catch is that the quality of the finished job depends far less on which grass you buy than on what goes underneath it. This guide covers both, in the order they matter.",
    ],
    sections: [
      {
        heading: "The base matters more than the grass",
        body: [
          "Almost every artificial lawn that looks bad after a couple of years looks bad for the same reason: the base moved. Grass laid straight onto loose sand develops dips and ripples that no amount of brushing will fix, because the problem is under the surface.",
          "A properly built base is compacted in layers and free-draining, so it stays where it was put and lets water through. It is the least visible part of the job and the part worth paying for.",
        ],
      },
      {
        heading: "Drainage, especially on roofs and balconies",
        body: [
          "Artificial grass has a perforated backing, so water passes through it rather than running off. That water then has to go somewhere.",
          "On a garden this is usually straightforward. On a roof terrace or balcony it needs surveying properly, because the existing drainage outlets must keep working. Grass and base built up over an outlet turns a terrace into a shallow tank, and the first anyone knows about it is water appearing where it should not be.",
        ],
        bullets: [
          "Never build a base over an existing drainage outlet.",
          "Set the base falls toward the outlets that are already there.",
          "On balconies, check the finished grass height against door thresholds before starting.",
        ],
      },
      {
        heading: "Pile height and colour",
        body: [
          "Longer pile looks lush in photographs and flattens under traffic. Shorter, denser pile stands up far better on a path, a play area or anywhere people actually walk, and it also runs cooler in direct sun.",
          "On colour, the more convincing products mix several shades of green with a brown thatch at the base, because a real lawn is never one flat colour. A single uniform green is the clearest sign of a cheap grass.",
        ],
        bullets: [
          "Paths, steps and play areas: shorter, denser pile.",
          "Ornamental garden areas with light traffic: longer pile is fine.",
          "Look for mixed green shades and a brown root thatch.",
          "Check the product is UV-stabilised, not merely UV-resistant.",
        ],
      },
      {
        heading: "Heat, and what to do about it",
        body: [
          "Any surface in direct Gulf sun gets hot, and artificial grass is no exception. It is worth being honest about this rather than pretending otherwise.",
          "Three things reduce it: a lighter colour, a shorter pile, and shade. A hose-down brings the surface temperature straight back down and takes seconds. For a play area that sits in full sun all afternoon, we would talk through pile and colour with you before quoting rather than after.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does artificial grass last in Qatar?",
        a: "A UV-stabilised grass over a properly built base holds its colour and shape for many years of Gulf sun. When an installation fails early it is almost always the base rather than the grass, showing as dips and ripples long before the fibres themselves wear out.",
      },
      {
        q: "Is artificial grass safe for children and pets?",
        a: "Yes. The grass is non-toxic and drains freely rather than holding water. For play areas a shock-absorbing layer can be laid under the grass, and pet waste rinses off the surface instead of soaking in the way it would on a real lawn.",
      },
      {
        q: "What maintenance does it need?",
        a: "Very little. Brush the pile occasionally so it stands upright, rinse it down to clear dust, and remove leaves near planted areas. There is no mowing, watering or fertiliser, which for most people in Qatar is the entire point of fitting it.",
      },
      {
        q: "Can it be laid on a roof terrace?",
        a: "Yes, and it is one of the most common installations here. The critical requirement is that the existing drainage outlets keep working, so the falls need surveying and the base built to move water toward them rather than letting it sit underneath the grass.",
      },
    ],
    relatedProductIds: ["grass-carpet", "artificial-grass-installation-work", "artificial-flowers-grass"],
    relatedCategorySlugs: ["carpet"],
  },
  {
    slug: "event-carpet-guide-qatar",
    title: "Planning Event Carpet for a Venue in Qatar",
    seoTitle: "Event Carpet Planning Guide for Qatar",
    metaDescription:
      "Planning event carpet in Qatar: access windows, one-off or reusable grades, colours, taping rules and lifting. What venues expect and how to brief a fitter.",
    excerpt:
      "Access windows, one-off or reusable grades, venue taping rules, and the questions to settle before the night of the install.",
    heroImage: "/Products/Carpets/carpet.webp",
    heroImageAlt: "Wall-to-wall carpet laid across a large open floor",
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-17",
    answer:
      "Settle the venue's access window and its fixing rules before you order, because event carpet is laid overnight inside a fixed slot and lifted just as fast. For a single event, an economy grade laid and disposed of afterwards is usually cheapest; if you run events often, a heavier grade that is lifted, stored and relaid usually works out cheaper.",
    intro: [
      "Event carpet is one of the few flooring jobs where the schedule matters more than the product. The carpet is rarely the hard part. The hard part is that a venue will give you a five-hour window in the middle of the night and expect a finished floor by morning.",
      "This guide covers what to settle before that night, so the install is a logistics exercise rather than an emergency.",
    ],
    sections: [
      {
        heading: "Start with the access window",
        body: [
          "Before anything else, find out from the venue exactly when the floor can be laid, and what else is happening in the hall at the same time. Everything else follows from that.",
          "Most exhibition and conference carpet goes down overnight, after the stand builders and before the organisers return. If the window is short, the answer is more fitters rather than an earlier start, because you cannot lay a floor while other trades are working across it.",
        ],
      },
      {
        heading: "One-off or reusable carpet",
        body: [
          "For a one-off event, laying an economy grade and disposing of it afterwards is normally the cheapest route, and it avoids storage and cleaning entirely.",
          "If you run several events a year, buying a heavier carpet that can be lifted, rolled, stored and relaid usually works out lower across the year. The trade-off is that someone has to store it and it needs cleaning between uses.",
        ],
        bullets: [
          "Single event, one venue: economy grade, laid and disposed of.",
          "Recurring events, similar floor areas: buy a reusable grade.",
          "Multi-week exhibitions: a heavier grade, because the traffic volume is much higher.",
        ],
      },
      {
        heading: "Ask the venue about fixing before you order",
        body: [
          "Venues have rules about what may be taped to their floors, and those rules vary considerably between a hotel ballroom with a stone floor and a purpose-built exhibition hall.",
          "Ask which tapes are permitted and whether any adhesive is allowed at all. Getting this wrong is expensive: it can mean a damage charge from the venue or a floor that lifts at the edges during the event. Pass the answer to your fitter at the survey rather than on the night.",
        ],
      },
      {
        heading: "Plan the lift as carefully as the lay",
        body: [
          "Removal is usually scheduled tighter than installation, because the venue wants the hall clear for the next client and the breakdown crews are all working at once.",
          "Confirm who lifts the carpet, when the vehicle can get to the loading dock, and where the waste goes. If the carpet is being kept, it needs rolling rather than dragging, and somewhere to be stored on arrival. These are dull details that reliably become a problem at two in the morning if nobody has settled them.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much notice do you need for event carpet?",
        a: "For a single hall we can often mobilise within 48 hours of confirmation. For a large exhibition floor, about a week is sensible, since the colour may need ordering and enough fitters have to be scheduled to finish inside the access window the venue has given you.",
      },
      {
        q: "Can event carpet be laid overnight?",
        a: "Yes, and it is how most of it gets laid. Venues rarely release a hall during the day, so the work happens overnight or early morning inside your allocated slot, and the floor is handed over finished before the organisers or guests arrive.",
      },
      {
        q: "What colour should exhibition carpet be?",
        a: "Darker neutrals such as grey, charcoal and blue hide traffic marks best over a multi-day event. Red remains standard for VIP arrivals and awards. Very light colours look excellent on the opening morning and show every mark by the afternoon of day one.",
      },
      {
        q: "Will laying carpet damage the venue floor?",
        a: "Not when the fixing method matches what the venue permits. Ask the venue which tapes are allowed before ordering and pass that to your fitter. Everything is lifted afterwards, and a competent lift leaves no residue on the floor beneath.",
      },
    ],
    relatedProductIds: ["event-normal-carpet", "tiles-carpet-office-carpet"],
    relatedCategorySlugs: ["carpet"],
    relatedServiceSlugs: ["event-carpet", "office-carpet"],
  },
  {
    slug: "tv-unit-design-ideas-qatar",
    title: "TV Unit and Feature Wall Ideas for Qatar Homes",
    seoTitle: "TV Unit & Feature Wall Ideas for Qatar",
    metaDescription:
      "TV wall ideas for Qatar homes: fluted panelling, concealed lighting, marble panels and built-in storage, plus how to hide the cabling properly.",
    excerpt:
      "Fluted panelling, concealed lighting, marble centres and built-in storage, and how to get the cabling out of sight.",
    heroImage: "/Products/Interior Design/Television decore with cabin box 9.jpeg",
    heroImageAlt: "TV feature wall with a marble-effect centre panel, walnut shelving and concealed LED lighting",
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-17",
    answer:
      "Build the wall rather than buying a stand: a made-to-measure unit hides the cabling and gives the room its focal point. Fluted wood panelling around a contrasting stone-effect centre panel, with a low cabinet run for the equipment, is the look most asked for in Doha. List every device you will connect before the survey.",
    intro: [
      "The television wall is usually the first thing anyone looks at when they walk into a living room, and it is often the least designed surface in the house: a screen on a shop-bought stand with a bundle of cables hanging behind it.",
      "Building the wall instead solves the cabling and the composition at the same time. These are the approaches we are asked for most often in Doha, and what each one is actually good for.",
    ],
    sections: [
      {
        heading: "Fluted and slatted panelling",
        body: [
          "Narrow vertical battens fixed side by side have become the most requested TV wall finish here, and for good reason: the ribbed surface catches light, adds real depth, and photographs well in a room that is otherwise flat.",
          "It also pairs naturally with concealed lighting. A strip washing down behind the screen picks out every rib and turns the wall into the light source for the room in the evening.",
        ],
        bullets: [
          "Dark walnut and oak flutes read as formal and suit larger majlis and living rooms.",
          "Pale oak and natural finishes keep a smaller room feeling open.",
          "Running the flutes full height, floor to ceiling, looks considerably better than stopping them at the unit.",
        ],
      },
      {
        heading: "A contrasting centre panel",
        body: [
          "Most of the strongest walls we build are not a single material. A marble or stone-effect panel behind the screen, framed by fluted wood on either side, gives the eye somewhere to settle and stops a large expanse of ribbing becoming busy.",
          "The centre panel is also where the screen mounts, so it keeps the fixings in one flat, solid area rather than through battens.",
        ],
      },
      {
        heading: "Storage that is actually planned",
        body: [
          "A low cabinet run under the screen handles the equipment; lit display niches or shelving to one side handle everything else. Because the unit is made to measure, the interior can be planned around what you genuinely need to store rather than around standard carcass sizes.",
          "Two things are worth deciding early: whether the cabinet fronts are handleless push-to-open, and whether any equipment needs ventilation or an infrared line of sight. Both are simple at design stage and awkward afterwards.",
        ],
      },
      {
        heading: "Getting the cabling right",
        body: [
          "This is the part that separates a built-in unit from a stand, and it is worth being specific about it at the survey.",
          "Tell your fitter everything that will be connected, now and plausibly later: screen power, HDMI from a receiver or console, network, aerial or satellite, and a soundbar or speakers. Conduit is cheap to install while the wall is open and effectively impossible to add once the panelling is fixed, so it is worth allowing more capacity than you currently need.",
        ],
      },
    ],
    faqs: [
      {
        q: "How high should a TV be mounted?",
        a: "Roughly at seated eye level, with the centre of the screen a little above it. In practice this puts most screens lower than people expect. Measure from your actual sofa rather than working from a standard height, and mark the position on the wall before the unit is built.",
      },
      {
        q: "Does a built-in TV unit need electrical work?",
        a: "Often not. The existing socket can frequently be enclosed within the unit, which avoids electrical work entirely. Where the screen position puts the socket in the wrong place, it is relocated before the panelling goes on, in coordination with an electrician.",
      },
      {
        q: "What is fluted panelling made from?",
        a: "Usually MDF or a wood-composite batten with a veneer or laminate finish, fixed to a backing board. Solid timber flutes are available and cost considerably more. For an interior wall in an air-conditioned room, a good composite is stable, consistent in colour and hard to distinguish from solid.",
      },
      {
        q: "How long does a TV feature wall take to build?",
        a: "The cabinets and panels are made in the workshop first, so disruption at home is short: most units are installed in one to two days. Allow a few weeks from agreeing the design to the installation date, depending on the finishes chosen.",
      },
    ],
    relatedProductIds: ["television-decore-with-cabin-box", "indoor-wall-panel-design", "cabin-interior-design"],
    relatedCategorySlugs: ["interior"],
    relatedServiceSlugs: ["tv-unit-design", "cabinets", "gypsum-c-board-fixing"],
  },
  {
    slug: "flooring-options-prices-qatar",
    title: "Flooring in Qatar: Options, Starting Prices and Choosing a Supplier",
    seoTitle: "Flooring in Qatar: Options, Prices & Suppliers",
    metaDescription:
      "Compare carpet, barkia, SPC, vinyl and artificial grass in Qatar, with Al Arabia Carpets starting prices and what to ask a flooring supplier in Doha.",
    excerpt:
      "What each floor type is good at, what it starts at, and the questions that separate a reliable flooring supplier from the rest.",
    heroImage: "/Products/barkia&pvc/barkia.webp",
    heroImageAlt: "Wood-effect barkia flooring laid through a room in a Qatar home",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-17",
    answer:
      "At Al Arabia Carpets, flooring starts from QAR 22 per sqm for event carpet, QAR 25 for artificial grass, QAR 65 for mosque carpet, QAR 70 for office carpet tiles, QAR 75 for barkia, PVC and SPC, and QAR 80 for home carpet. Choose by room first: waterproof barkia or SPC where water is possible, carpet where comfort matters most.",
    intro: [
      "Most people looking for flooring in Qatar are comparing two things at once: which material suits the room, and which supplier to trust with it. This guide covers both, using the starting prices we quote at Al Arabia Carpets in Doha.",
      "Prices below are starting prices per square metre. The final figure depends on the product you choose and the area, which is why we measure first and quote free of charge.",
    ],
    sections: [
      {
        heading: "Flooring options and starting prices",
        body: ["These are the options we supply and fit most often in Qatar, with the prices each one starts at."],
        table: {
          caption: "Starting prices per square metre at Al Arabia Carpets",
          head: ["Flooring", "From", "Best for"],
          rows: [
            ["Barkia, PVC and SPC", "QAR 75 per sqm", "Kitchens, ground floors and busy family rooms. Waterproof and easy to clean."],
            ["Home carpet", "QAR 80 per sqm", "Bedrooms and majlis. Soft and quiet underfoot."],
            ["Office carpet tiles", "QAR 70 per sqm", "Offices. A damaged tile can be replaced on its own."],
            ["Mosque carpet", "QAR 65 per sqm", "Mosques and prayer halls. Built for heavy use, with rows set out from the qiblah."],
            ["Event carpet", "QAR 22 per sqm", "Exhibitions, conferences and weddings. A short-term floor."],
            ["Artificial grass", "QAR 25 per sqm", "Gardens, terraces, roofs and play areas."],
          ],
        },
      },
      {
        heading: "How to choose by room",
        body: [
          "Let the room decide before the look does. If water is a realistic possibility, choose barkia, SPC or vinyl. If comfort and quiet matter most and the room stays dry, carpet is hard to beat. In a majlis, many families choose carpet or a wood-effect floor with a large rug.",
        ],
      },
      {
        heading: "What to ask a flooring supplier in Qatar",
        body: ["A reliable supplier will answer these questions easily. Vague answers are a warning sign."],
        bullets: [
          "Do you measure the room yourselves before you quote?",
          "Does the price include delivery, fitting and finishing at the edges?",
          "Can I see samples in person before I decide?",
          "Who does the fitting, your own team or a subcontractor?",
          "What happens to the old flooring?",
        ],
      },
    ],
    faqs: [
      { q: "Where can I find reputable flooring stores in Qatar?", a: "Al Arabia Carpets has a showroom on Al Mansoura St in Doha, open every day from 8:00 AM to 10:00 PM, where you can compare carpet, barkia and SPC samples in person. We supply and fit flooring across Qatar, with free delivery and installation." },
      { q: "How much does flooring cost in Qatar?", a: "At Al Arabia Carpets, barkia and SPC start from QAR 75 per sqm and home carpet from QAR 80 per sqm. The final price depends on the product and the area, and we measure and quote free of charge." },
      { q: "Which flooring is best for Qatar's climate?", a: "For rooms that may see water, barkia, SPC or vinyl handle heat and humidity well because they do not absorb moisture. For dry bedrooms and majlis, carpet is a comfortable choice." },
    ],
    relatedProductIds: ["pvc-barkia", "spc-zigzag-barkia-installation", "luxury-home-carpet", "grass-carpet"],
    relatedCategorySlugs: ["barkia", "carpet"],
    relatedServiceSlugs: ["vinyl-flooring", "parquet-flooring", "office-carpet"],
  },
  {
    slug: "curtain-design-ideas-qatar",
    title: "Modern Curtain Design Ideas for Qatar Homes",
    seoTitle: "Modern Curtain Design Ideas for Qatar",
    metaDescription:
      "Modern curtain designs for Qatar homes: layered sheers, blackout for bedrooms, roller blinds and full-height drapes, with advice from Al Arabia Carpets.",
    excerpt:
      "Layered sheers, blackout bedrooms, clean roller blinds and full-height drapes, and which rooms each one suits.",
    heroImage: "/Products/Curtain/curtain.webp",
    heroImageAlt: "Modern floor-to-ceiling curtains in a bright living room",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-17",
    answer:
      "The modern curtain designs that suit Qatar homes are a sheer layered under a lined curtain, full-height drapes on a track fixed close to the ceiling, and plain roller blinds where fabric is impractical. Choose neutral, mid-tone fabrics with a lining, because strong sun fades dark and saturated colours first.",
    intro: [
      "A modern curtain is mostly about proportion and light. In Qatar, where the sun is strong and many villas have tall windows, the best designs manage glare first and look good second, though a well-chosen curtain does both.",
      "These are the ideas we suggest most often at Al Arabia Carpets when customers ask what would suit a modern home in Doha.",
    ],
    sections: [
      {
        heading: "Modern curtain ideas that work in Qatar",
        body: ["Each of these handles the strong daylight differently, so choose by the room rather than by the picture."],
        bullets: [
          "Layered sheer and blackout: a light sheer softens the sun during the day, and a heavier curtain closes the room at night.",
          "Full-height drapes: hanging the track close to the ceiling makes a room feel taller, even if the window is not.",
          "Roller blinds: a clean, flat look for offices, kitchens and modern living rooms.",
          "Neutral fabrics: sand, grey and off-white sit easily with most floors and furniture and show less fading.",
        ],
      },
      {
        heading: "Which curtain style suits each room?",
        body: [
          "Bedrooms usually need blackout fabric, since morning sun arrives early for much of the year. Living rooms benefit from layers, so you can keep the view during the day. Kitchens and bathrooms are better served by blinds, which stay away from water and heat.",
        ],
        bullets: [
          "Living room: floor-length curtains in a plain or lightly textured fabric, over a sheer.",
          "Bedroom: a blackout-lined curtain in a calm colour, or a blackout roller behind a lighter curtain.",
          "Children's rooms: a blackout roller blind with the cord kept out of reach.",
          "Kitchen: a roller blind in an easy-to-clean sunscreen fabric, kept clear of the hob.",
        ],
      },
      {
        heading: "Which colours and fabrics suit Qatar's strong light?",
        body: [
          "A curtain on a south- or west-facing window takes direct sun for much of the year, and dark or saturated colours fade first, often in stripes along the folds. Sand, stone, warm grey and off-white show it least, and a lining protects the face fabric as well as blocking light.",
          "For sheers, ivory or soft off-white is easier on the eye than bright white, which glares in direct sun. In a plain modern room, texture does the work pattern used to: a linen-look weave or a soft velvet adds depth without dating the room.",
        ],
        bullets: [
          "Polyester blends hold their colour in the sun and wash well, which helps with fine dust.",
          "Velvet suits a majlis but holds dust, so it needs regular vacuuming.",
          "We bring fabric samples to the house, so you judge colour in your own light, beside your own sofa and floor.",
        ],
      },
      {
        heading: "How do tracks, headings and pelmets change the look?",
        body: [
          "The heading, meaning how the top of the curtain is gathered, sets the style. A wave heading on a ceiling-fixed track gives the soft, even folds of most modern rooms; a pinch pleat is more tailored and formal; eyelets on a pole look relaxed and suit a single, lighter curtain.",
          "If a gypsum ceiling is going in, a recessed pocket can hide the track so the fabric seems to drop from the ceiling. A pelmet across the top of the window also hides it and looks more traditional. We supply and fit tracks and poles with the curtains, including double tracks for layering.",
        ],
      },
      {
        heading: "What curtains suit a majlis?",
        body: [
          "A majlis usually has the heaviest curtains in the house: full-length, fully lined drapes that close the room for evening guests, with a sheer behind them for daytime privacy where the majlis faces the street.",
          "For a traditional majlis, a pelmet with a trimmed edge and tie-backs suits ornate seating. For a modern one, use a plain, heavy fabric on a concealed track, in a colour taken from the seating or the carpet.",
        ],
      },
    ],
    faqs: [
      {
        q: "What are the most modern curtain styles?",
        a: "Layered sheers with blackout curtains, full-height drapes and simple roller blinds are the styles customers in Qatar ask for most. Neutral colours keep them from dating quickly.",
      },
      {
        q: "What should I consider for a modern bedroom curtain?",
        a: "Start with light control, since blackout fabric makes the biggest difference to sleep. Then choose a colour that sits with the walls and flooring, and hang the curtain close to the ceiling so the room feels taller.",
      },
      {
        q: "How much do made-to-measure curtains cost in Qatar?",
        a: "Home curtains at Al Arabia Carpets start from QAR 850 per piece. The final price depends on the fabric, the lining and the size of each window, and the measurement and quotation are free.",
      },
      {
        q: "Where can I buy curtains in Qatar?",
        a: "Al Arabia Carpets makes and fits curtains from our showroom on Al Mansoura St in Doha, where you can see the fabrics in person. We measure and quote free across Qatar.",
      },
    ],
    relatedProductIds: ["home-curtains", "roller", "office-blind-office-roller-vertical-blinds"],
    relatedCategorySlugs: ["curtain"],
    relatedServiceSlugs: [],
  },
  {
    slug: "kitchen-design-guide-qatar",
    title: "Kitchen Design in Qatar: Modular or Made to Measure?",
    seoTitle: "Kitchen Design in Qatar: Modular or Made to Measure",
    metaDescription:
      "Modular or made-to-measure kitchen? How the two compare on fit, storage and layout in Qatar homes, with kitchen planning advice from Al Arabia Carpets.",
    excerpt:
      "How modular and made-to-measure kitchens compare, the layouts that work, and what to plan before you order.",
    heroImage: "/Services/kitchen-cabinets/fitted-kitchen-taupe-handleless.webp",
    heroImageAlt: "Handleless taupe fitted kitchen with a black stone worktop in Qatar",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-17",
    answer:
      "Made to measure suits most kitchens in Qatar, because real walls rarely add up to standard unit widths: the cabinets reach the wall, corners become storage, and no filler panels are needed. Modular units make sense on a simple straight run where standard sizes fit and speed matters more than storage.",
    intro: [
      "The first decision in most kitchen projects is whether to buy modular units in fixed sizes or have cabinets built to measure. Both can look good. The difference shows up at the edges of the room, in the corners and in how much storage you end up with.",
      "This guide sets out how we explain the choice at Al Arabia Carpets, where we build and install kitchen cabinets in Doha.",
    ],
    sections: [
      {
        heading: "Modular or made to measure",
        body: [
          "Modular kitchens use standard widths, which makes them quick to plan and easy to compare. The trade-off is that real walls rarely add up to standard widths, so gaps get closed with filler panels.",
          "Made-to-measure cabinets are built to the room, so the run reaches the wall and awkward corners become usable storage. They suit rooms with unusual dimensions and owners who want every part of the wall used.",
        ],
      },
      {
        heading: "Which kitchen layout suits your room?",
        body: [
          "The shape of the room usually decides the layout. Within it, keep the sink, hob and fridge close enough to work between, with worktop on both sides of the hob. We build corner units, islands and peninsulas to the measured room, so the layout is not limited to a catalogue.",
        ],
        table: {
          caption: "Kitchen layouts compared",
          head: ["Layout", "Suits", "Watch for"],
          rows: [
            ["L-shaped", "Most villa and apartment kitchens", "The corner, which needs a proper corner unit"],
            ["U-shaped", "Larger kitchens and families who cook a lot", "Space between the runs for doors to open"],
            ["Galley", "Narrow kitchens, including many compound apartments", "Oven and dishwasher doors blocking the walkway"],
            ["Island or peninsula", "Open-plan kitchens wanting extra worktop and seating", "Room to walk round; a peninsula fits where an island would not"],
          ],
        },
      },
      {
        heading: "Which cabinet materials cope with heat and steam?",
        body: [
          "Kitchen cabinets in Qatar take steam from cooking, heat from the oven and hob, and the occasional leak under the sink. The board matters more than the door finish: what counts is moisture-resistant board with a good edge seal, because exposed edges fail before door faces do. We use moisture-resistant carcasses in kitchens as standard.",
          "A cooker hood that vents outside also helps, because it removes steam and grease before they settle on the fronts.",
        ],
        bullets: [
          "Laminate: hard-wearing, easy to wipe, and practical beside the hob and sink.",
          "Wood veneer: warmer and more natural, best on runs away from the steam.",
          "Matt or gloss fronts: matt hides fingerprints; gloss makes a small kitchen feel larger but shows every mark.",
          "Soft-close hinges and runners: stop doors and drawers slamming, which protects the carcass.",
        ],
      },
      {
        heading: "How should you plan storage, worktops and appliances?",
        body: [
          "Deep drawers hold more than shelved cupboards and are easier to reach, especially for the large pots that family cooking needs. Taking the wall units up to the ceiling adds storage and removes the ledge on top, which collects dust quickly.",
          "Choose the worktop before the cabinets are drawn, because it decides how the sink and hob are cut in. Stone copes with heat and steam better than laminate, which costs less but can mark from a hot pan.",
          "Built-in ovens, hobs and fridges each need a housing of a specific size, so choose the models first and bring the details to the survey. A mismatch found on delivery day means rebuilding a unit.",
        ],
      },
      {
        heading: "What should you decide before the measurement visit?",
        body: [
          "At the free survey we measure the room, note the plumbing and electrical positions, and propose a layout that uses the full run. The written quotation covers the cabinetry, hardware, delivery and installation. Before then, settle the things that are expensive to change later.",
        ],
        bullets: [
          "Where the sink, hob and fridge sit relative to each other",
          "Plumbing and electrical positions, and whether they can move",
          "Which appliances are built in, and their exact sizes",
          "How much tall storage and pantry space you need",
          "The worktop material",
          "The flooring, ideally planned together with the cabinets",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I choose a modular kitchen or a traditional cabinet setup?",
        a: "Choose modular if your walls suit standard widths and you want a simple, fast decision. Choose made-to-measure cabinets if the room has awkward dimensions or you want to use the full wall.",
      },
      {
        q: "Can I fit an island in a small kitchen?",
        a: "Only if you can still walk round it with the oven, dishwasher and fridge doors open. If not, a peninsula joined to one run gives extra worktop and seating without blocking the route.",
      },
      {
        q: "How much do kitchen cabinets cost in Qatar?",
        a: "It depends on the length of the runs, the board and door finish, and the hardware, so we quote after measuring rather than guessing. The survey and the written quotation are free.",
      },
      {
        q: "Who makes kitchen cabinets in Doha?",
        a: "Al Arabia Carpets designs, builds and installs made-to-measure kitchen cabinets in Doha and across Qatar. We survey the room and quote free of charge.",
      },
    ],
    relatedProductIds: ["cabinet-and-gypsum-board-work", "cabin-interior-design"],
    relatedCategorySlugs: ["interior"],
    relatedServiceSlugs: ["kitchen-cabinets", "cabinets"],
  },
  {
    slug: "modern-carpet-design-qatar",
    title: "Modern Carpet Design Ideas for Qatar Homes",
    seoTitle: "Modern Carpet Design Ideas for Qatar",
    metaDescription:
      "Modern carpet designs for Qatar homes: plain neutrals, subtle geometrics and textured piles, plus which rooms suit each, from Al Arabia Carpets in Doha.",
    excerpt:
      "Plain neutrals, subtle geometrics and textured piles, and how to choose a modern carpet that suits the room.",
    heroImage: "/Products/Carpets/carpet.webp",
    heroImageAlt: "Premium wall-to-wall carpet fitted in a Doha home",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-17",
    answer:
      "Modern carpet in Qatar relies on calm colour and texture rather than bold pattern: plain or low-contrast neutrals, subtle geometrics, and loop or cut-and-loop piles. Choose mid-tones such as sand, taupe and greige, because very light and very dark carpets both show the fine dust that settles in every Qatar home.",
    intro: [
      "Modern carpet has moved away from heavy pattern. What customers in Qatar ask for now is texture, calm colour and a clean finish at the edges, so that the carpet supports the room rather than competes with it.",
      "These are the styles we show most often at Al Arabia Carpets in Doha, starting from QAR 80 per sqm for home carpet.",
    ],
    sections: [
      {
        heading: "Modern carpet styles",
        body: ["Each of these reads as modern for a different reason."],
        bullets: [
          "Plain neutrals: beige, sand and grey make a room feel larger and sit easily with most furniture.",
          "Subtle geometrics: a low-contrast pattern adds interest without dominating the room.",
          "Textured piles: a loop or cut-and-loop surface adds depth and hides footprints better than a flat pile.",
          "Wall-to-wall in bedrooms: a continuous floor feels quiet and makes small rooms look bigger.",
        ],
      },
      {
        heading: "Which carpet colours hide sand and dust?",
        body: [
          "Fine sand and dust reach every floor in Qatar, and the colour of the carpet decides how much of it you see between cleans. Pale creams show grey traffic lanes, while charcoal and navy show pale dust and lint. Mid-tones close to the colour of the dust itself hide it best.",
          "Strong sun also fades carpet beside south- and west-facing windows, so close the curtains or blinds in the hottest hours.",
        ],
        bullets: [
          "Sand, taupe and greige: the most forgiving colours for family rooms and corridors.",
          "Heathered or flecked yarns, where several tones are mixed, break up dust and small marks.",
          "Tone-on-tone patterns hide wear better than a single flat colour.",
          "Pale creams and ivories: keep them for bedrooms and rooms where shoes stay at the door.",
        ],
      },
      {
        heading: "Wall-to-wall carpet or a rug in a modern room?",
        body: [
          "Wall-to-wall carpet gives a continuous, quiet floor and makes a small room look larger, which is why it suits bedrooms and many majlis. Fitted over underlay, it is more comfortable and the pile is protected from below.",
          "In a living room with barkia, SPC or tiles, a rug is often the more modern choice: it defines the seating area, leaves the hard floor showing around it, and can be lifted for cleaning. Size it so the front feet of all the seating sit on it; a small rug floating in the middle makes the room look smaller.",
          "We cut made-to-measure rugs to any size and shape, including round and L-shaped.",
        ],
      },
      {
        heading: "How do pile and texture affect upkeep?",
        body: [
          "A smooth, velvety cut pile looks the most luxurious but shows footprints, vacuum lines and shading where the pile is brushed different ways. A loop pile hides footprints and wears well, but can snag on a pet's claws. A twisted, textured cut pile sits between the two and is the easiest modern finish to keep looking even.",
          "Whatever the texture, density keeps it looking new: a dense pile springs back from footprints and furniture dents instead of flattening along the walkways.",
        ],
        bullets: [
          "Vacuum entrances and corridors more often than bedrooms, since that is where the sand comes in.",
          "Put a mat at each outside door to catch sand before it reaches the carpet.",
          "Turn rugs from time to time so sun and foot traffic wear them evenly.",
          "Blot spills straight away rather than rubbing them into the pile.",
        ],
      },
      {
        heading: "Choosing for the room",
        body: [
          "Bedrooms can take a softer, deeper pile. Stairs and corridors need a dense, hard-wearing carpet. In a majlis, a plain carpet lets the seating stand out, while a patterned one hides everyday wear better. Bring a photo of the room and we will show you samples that suit it.",
        ],
      },
    ],
    faqs: [
      {
        q: "What carpet colours look most modern?",
        a: "Neutral tones such as beige, sand and grey look the most current and work with most furniture. Add interest through texture or a subtle pattern rather than a strong colour.",
      },
      {
        q: "What is the best carpet for bedrooms in Qatar?",
        a: "A soft cut pile in a neutral colour is the most common choice, because it is comfortable underfoot and quiet. Al Arabia Carpets supplies and fits bedroom carpet from QAR 80 per sqm, with free delivery and installation.",
      },
      {
        q: "Is wall-to-wall carpet still in style?",
        a: "Yes, particularly in bedrooms and majlis, where a plain or softly textured carpet gives a calm, continuous floor. In living rooms with hard flooring, a made-to-measure rug is often the more current look.",
      },
      {
        q: "Can you make a rug to fit my majlis?",
        a: "Yes. We cut rugs to any size and shape, including L-shapes for corner seating, and can match the colour to a cushion or fabric you bring. The edge is finished with a binding, braid or contrast border.",
      },
    ],
    relatedProductIds: ["home-design-luxury-carpet", "luxury-home-carpet", "stairs-carpet-installation"],
    relatedCategorySlugs: ["carpet"],
    relatedServiceSlugs: [],
  },
  {
    slug: "wallpaper-qatar-climate-guide",
    title: "Which Wallpaper Lasts in Qatar's Heat and Humidity?",
    seoTitle: "Vinyl, Non-Woven or Paper? Wallpaper for Qatar's Climate",
    metaDescription:
      "Which wallpaper holds up in Qatar homes: vinyl, non-woven or paper, how AC and humidity affect it, where not to hang it, and why wall preparation matters most.",
    excerpt:
      "How paper, non-woven, vinyl and textile wallpapers cope with humidity, air conditioning, sun and dust, and why the wall underneath matters as much as the roll.",
    heroImage: "/Services/wallpaper/wallpaper-tv-feature-wall.webp",
    heroImageAlt:
      "Cream wallpaper with a fine gold floral print on a TV feature wall with warm backlighting, wood slats and a floating TV unit",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    answer:
      "For most air-conditioned rooms in Qatar, non-woven wallpaper is the right choice: it stays stable as humidity rises and falls, and it lets the wall breathe. Choose vinyl where walls need washing or face steam, such as kitchens and hallways. Either way, how long it lasts depends mostly on the wall preparation underneath.",
    intro: [
      "Wallpaper in a Qatar home has a harder life than the sample book suggests. The AC runs for most of the year, the air outside stays humid for long stretches of summer, west-facing walls take the afternoon sun through the glass, and fine dust settles on every surface.",
      "This guide covers which wallpaper types cope with those conditions, why preparation decides how long the finish lasts, where wallpaper is the wrong choice, and how to keep it clean.",
    ],
    sections: [
      {
        heading: "Which wallpaper types hold up in Qatar homes?",
        body: [
          "The decision that matters is what the paper is made of, because that decides how it reacts to moisture, how it cleans and how it comes off when you want a change.",
          "Non-woven papers are made from a blend of natural and synthetic fibres. They do not swell when pasted or shrink as they dry, so seams stay closed when the humidity changes. Vinyl papers have a plastic surface that can be washed, but that same surface stops moisture passing through the wall.",
        ],
        table: {
          caption: "How common wallpaper types cope in Qatar homes",
          head: ["Type", "Cleaning", "Humidity", "Dust", "Suits"],
          rows: [
            ["Traditional paper", "Dry dusting only", "Poor: swells, and seams can open", "Marks are hard to remove", "Bedrooms and low-use rooms"],
            ["Non-woven", "Usually wipeable with a damp cloth", "Good: stays stable and breathes", "Wipes off gently", "Living rooms, bedrooms, majlis"],
            ["Vinyl", "Washable", "Good at the surface; the wall behind must be dry", "Wipes off easily", "Kitchens, hallways, children's rooms"],
            ["Textile or grasscloth", "Spot-clean only", "Poor: marks with water and can sag", "Holds dust in the weave", "Low-traffic feature walls"],
          ],
        },
      },
      {
        heading: "How do air conditioning and humidity affect wallpaper?",
        body: [
          "Inside, the AC keeps the air cool and fairly dry; outside, it is hot and often humid. Moisture in the warm air moves through an outside wall towards the cooler room. If a vinyl paper seals the inner face, that moisture can collect behind it, loosen the paste and let mould grow out of sight. That is why a breathable non-woven is often the better choice on outside walls.",
          "The other test is a house closed up with the AC off over a summer away. Humidity indoors climbs, traditional paper takes up moisture and expands, and seams can open as the room dries out again. Non-woven and vinyl papers cope with this much better.",
        ],
      },
      {
        heading: "Why does wall preparation decide how long it lasts?",
        body: [
          "Most wallpaper failures are not the paper's fault. Lifting seams, bubbles and a pattern drifting out of true usually trace back to a wall that was not made good before hanging.",
          "Preparation means filling cracks and holes, sanding the surface smooth and sizing it: sealing the wall so it does not draw the water out of the paste before the paper bonds. New gypsum board and fresh plaster are very absorbent, so sizing matters even more there. Filler must be fully dry before any paper goes on, so we allow an extra day when a wall needs stripping, filling and sanding first.",
          "A wallpaper quote should include:",
        ],
        bullets: [
          "A survey of each wall before ordering, checking the surface and the rolls the pattern repeat needs.",
          "Removal of old wallpaper rather than hanging over it.",
          "Filling, sanding and sizing of the whole wall, not just the worst patches.",
          "Pattern matching, seam finishing and neat trimming around sockets and switches.",
        ],
      },
      {
        heading: "Where should you not hang wallpaper?",
        body: [
          "Wallpaper is a finish for dry, air-conditioned interior walls. In a few places it fails however well it is hung.",
        ],
        bullets: [
          "Inside a shower area or anywhere water hits the wall directly; that is a job for tiles. Elsewhere in a well-ventilated bathroom, vinyl paper or wall panelling can work.",
          "Behind a cooking hob or a sink, where splashes and grease reach the wall.",
          "On walls with damp, salt marks or flaking paint, often low on ground-floor villa walls or under windows. Fix the cause first.",
          "On walls in strong direct sun, such as a west-facing wall opposite large windows. Sun fades wallpaper and daily heating and cooling strains the seams; if you want paper there, choose a light design and close the curtains in the afternoon.",
          "Outdoors, including balconies and open majlis areas, where exterior wall panels made for sun and rain are the right finish.",
        ],
      },
      {
        heading: "How should you clean wallpaper in a dusty climate?",
        body: [
          "Fine dust is the main cleaning job in Qatar, and it comes off more easily dry than wet: a wet cloth on a dusty wall turns it into a paste that settles into textured surfaces.",
        ],
        bullets: [
          "Dust with a soft dry cloth or the brush attachment of a vacuum, from the top down.",
          "On non-woven and vinyl, lift marks with a cloth wrung out in water and a little mild soap, then pat dry. Test a hidden corner first.",
          "Never use abrasive pads, solvents or bleach, and do not scrub traditional paper or textile at all.",
          "Re-paste a lifting edge as soon as you see it, before dust and moisture get underneath.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can wallpaper go straight onto new gypsum board?",
        a: "Only once the joints are filled and sanded and the board is sealed. Paper hung on raw gypsum board tends to tear the board's surface when it is removed later.",
      },
      {
        q: "Should a majlis have vinyl or non-woven wallpaper?",
        a: "A busy family majlis, where walls get leaned on and marked, suits vinyl because it can be washed. A formal majlis with lighter use can take non-woven or a textured paper.",
      },
      {
        q: "Will wallpaper hide cracks in the wall?",
        a: "No. Wallpaper shows every crack and dent beneath it, and a crack that is still moving will split the paper. Cracks need filling and sanding first.",
      },
      {
        q: "Can new wallpaper be hung over old wallpaper?",
        a: "It is not a good idea. The new paste can loosen the old layer, and any bubble or lifting edge underneath shows through.",
      },
    ],
    relatedProductIds: ["indoor-wall-panel-design", "outdoor-wall-panel-products", "television-decore-with-cabin-box"],
    relatedServiceSlugs: ["wallpaper"],
  },
  {
    slug: "gypsum-vs-cement-board-qatar",
    title: "Gypsum or Cement Board: Which Goes Where in Qatar?",
    seoTitle: "Gypsum Board vs Cement Board in Qatar",
    metaDescription:
      "Gypsum, moisture-resistant gypsum or cement board? Where each one belongs in Qatar ceilings, bathrooms, kitchens, outdoor soffits and partitions, and why.",
    excerpt:
      "Which board belongs in dry ceilings, wet rooms, outdoor soffits and partitions, and how water, weight, fire and finish decide it.",
    heroImage: "/Products/Interior Design/Gypsum board work design 5.jpeg",
    heroImageAlt:
      "Gypsum false ceiling with a recessed linear light channel framing the centre panel, slot AC diffusers and pendant lights in a Qatar villa",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    answer:
      "Use standard gypsum board for dry indoor ceilings, coves, bulkheads and partitions, moisture-resistant gypsum for kitchen and bathroom ceilings, and cement board anywhere the board can get wet: outdoor soffits, car porches, open-sided majlis ceilings and shower walls that will be tiled. Water decides it: gypsum softens when wet, cement board does not.",
    intro: [
      "Ask for C-board in Doha and you could mean either of two materials: gypsum board, which makes almost every false ceiling, cove and partition indoors, or cement board, which goes where gypsum would get wet. They look alike on site but behave very differently around water, weight and tight curves.",
      "Picking the wrong one rarely shows at handover. It shows later, as a sagging car porch soffit or a brown ring on a bathroom ceiling.",
    ],
    sections: [
      {
        heading: "How do the three boards differ?",
        body: [
          "Standard gypsum board is a gypsum core faced with paper. It is light, cuts cleanly, bends into curves and, once the joints are taped and filled, gives the smoothest painted ceiling there is. Its weakness is water: a wet core loses its strength and the paper facing can grow mould.",
          "Moisture-resistant gypsum is treated to repel water, so it copes with humid air and steam. Cement board is a cement core reinforced with glass-fibre mesh that does not soften or rot when wet, at the cost of weight, harder cutting and a rough face that needs a skim coat before paint.",
        ],
        table: {
          caption: "Standard gypsum, moisture-resistant gypsum and cement board compared",
          head: ["Factor", "Standard gypsum board", "Moisture-resistant gypsum", "Cement board"],
          rows: [
            ["Water", "Softens and sags if it gets wet", "Copes with steam and splashes, not soaking", "Not damaged by water"],
            ["Weight", "Light, standard framing", "Light, standard framing", "Heavy, needs closer framing and stronger fixings"],
            ["Curves and fine detail", "Bends and cuts cleanly", "Bends and cuts cleanly", "Stiff, best on flat runs"],
            ["Paint finish", "Smooth once taped and filled", "Smooth once taped and filled", "Needs a skim coat first; ideal behind tiles"],
            ["Fire", "Resists fire; a fire-rated grade is available", "Resists fire like standard board", "Non-combustible"],
            ["Where it goes", "Dry indoor ceilings, coves, bulkheads, partitions", "Bathroom, kitchen and laundry ceilings", "Outdoor soffits, car porches, open majlis, shower walls"],
          ],
        },
      },
      {
        heading: "Which board goes in a bathroom or kitchen ceiling?",
        body: [
          "Moisture-resistant gypsum, in most homes. A bathroom with a working extractor fan and a kitchen with a ducted hood get steam in bursts and then dry out, which the treated board handles and standard board does not. It tolerates damp air, but it is not waterproof.",
        ],
        bullets: [
          "Bathroom, toilet and laundry ceilings: moisture-resistant gypsum.",
          "Kitchen ceilings: moisture-resistant gypsum, with the hood ducted outside, not into the ceiling void.",
          "Shower walls and any wall to be tiled: cement board, with a waterproofing membrane before the tiles, since water passes through cement board without harming it.",
          "Apartments under a neighbour's bathroom: ask for an access panel near the pipe runs, so a leak from above can be found without cutting the ceiling open.",
        ],
      },
      {
        heading: "Which board goes outside, on soffits, car porches and an outdoor majlis?",
        body: [
          "Cement board. An outdoor ceiling in Qatar sees little rain, but humid coastal air, overnight condensation, hosing down and the afternoon heat will make gypsum, even the moisture-resistant grade, sag between the frame members and stain along the joints.",
          "An outdoor majlis needs a judgement call. If it is closed and air-conditioned, gypsum is fine. If it is open on a side or tent-style, it gets cement board, as do balcony ceilings and roof overhangs.",
          "Outdoor cement board also needs corrosion-resistant fixings, movement joints against the heat and an exterior render.",
        ],
      },
      {
        heading: "Which board suits coves, bulkheads and AC diffuser recesses?",
        body: [
          "Gypsum. A cove hiding an LED strip, a bulkhead framing a seating area and a recess for a linear diffuser all need clean cuts, crisp corners and sometimes a curve. Cement board is too stiff and heavy for that work, and its joints are harder to hide under paint.",
          "When these ceilings fail, the cause usually sits above the board.",
        ],
        bullets: [
          "Insulate AC ducts and diffuser plenums, or humid air condenses on the cold metal and drips onto the back of the board where nobody sees it.",
          "Put an access panel under every fan coil unit, because a blocked condensate drain is a common cause of a wet ceiling.",
          "Keep LED drivers reachable through the cove or a hatch, not sealed behind board.",
          "Fix diffuser and light positions on site before framing; moving them later means cutting into a finished ceiling.",
        ],
      },
      {
        heading: "Where do partitions, weight and fire come in?",
        body: [
          "Partitions follow the same water rule: gypsum on a metal stud frame for dry rooms, with insulation in the cavity where sound matters, moisture-resistant gypsum in bathrooms, and cement board on any face tiled in a shower.",
          "Cement board's weight calls for closer framing and stronger hangers. And no board of either kind should carry a chandelier, ceiling fan or projector on its own: those are fixed to the slab or to reinforcement in the frame.",
          "Gypsum's core holds chemically bound water that slows heat in a fire, and a fire-rated grade with glass fibres in the core is used where a rating is required, such as an escape corridor or a garage wall. Cement board does not burn. A rating covers the whole build-up, not the board alone.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is C-board the same as gypsum board?",
        a: "Not always. In Qatar the name covers both gypsum and cement board, so a quote that only says C-board does not say which you are getting. Ask for the board type area by area.",
      },
      {
        q: "Can moisture-resistant gypsum be used outdoors?",
        a: "No. It is made for humid rooms and steam, not for outdoor air, overnight condensation and washing down. Outdoor ceilings and soffits should be cement board.",
      },
      {
        q: "Can cement board be painted like a gypsum ceiling?",
        a: "Yes, once it has a skim coat or render over it. Painted directly, its texture and joints show through.",
      },
      {
        q: "Can one contractor fix both boards in the same project?",
        a: "Yes, and it is common in villas: gypsum inside, cement board for the car porch and shower walls. Al Arabia Carpets fixes both across Qatar, with a free survey to confirm which board each area needs.",
      },
    ],
    relatedProductIds: ["gypsum-board-work-design", "cabinet-and-gypsum-board-work", "cabin-interior-design"],
    relatedServiceSlugs: ["gypsum-c-board-fixing"],
  },
  {
    slug: "reupholster-or-replace-sofa-qatar",
    title: "Reupholster or Replace Your Sofa? How to Decide",
    seoTitle: "Reupholster or Replace a Sofa in Qatar?",
    metaDescription:
      "Reupholster, repair or replace a sofa or majlis in Qatar? How to check the frame, foam and springs, pick fabric for sun and AC dust, and when new is worth it.",
    excerpt:
      "How to read the frame, foam and springs of a tired sofa or majlis, and decide between repairing it, reupholstering it or having a new piece made.",
    heroImage: "/Products/Furniture/Modern majlis 3.jpeg",
    heroImageAlt:
      "Cream sofas on dark wooden frames with gold trim and a matching glass-topped table, in a sitting room with marble floors and tied-back curtains",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    answer:
      "Reupholster or repair a sofa when the frame is sound and only the fabric, foam or springs have worn; have a new one made when the frame is cracked, made of crumbling particle board, or the wrong size or shape for the room. The frame decides whether new fabric is money well spent.",
    intro: [
      "Most sofas in Qatar look worn long before they are worn out. Sun through large windows, fine dust and AC running most of the year are hard on fabric and foam, but they do little to a well-built frame.",
      "So the decision comes down to what is under the fabric, and you can check most of it yourself before anyone visits.",
    ],
    sections: [
      {
        heading: "How do you tell if the frame is worth keeping?",
        body: [
          "The frame is the one part that cannot be cheaply replaced, so it decides everything else. Good frames are kiln-dried hardwood or quality plywood with glued and blocked joints; cheap ones are particle board or thin softwood held together with staples.",
        ],
        bullets: [
          "Lift one front corner a little. On a rigid frame the other front leg rises with it; if the frame twists instead, it is weak.",
          "Rock the arms and the back. A slight creak is normal; movement you can see at a joint is not.",
          "Look underneath. Solid wood shows grain along the rails; particle board looks like pressed chips and crumbles around screws.",
          "Sit along the whole length. A dip in one seat points to foam or springs; a sofa that leans as a whole points to the frame.",
        ],
      },
      {
        heading: "Repair, reupholster or make new: which fits your sofa?",
        body: [
          "The frame check tells you which row you are in.",
        ],
        table: {
          caption: "Sofa and majlis condition, and the usual best route",
          head: ["What you find", "Usual best route", "Why"],
          rows: [
            ["Frame solid, fabric faded or torn", "Reupholster", "Only the surface has worn"],
            ["Fabric fine, seats gone flat", "Replace the foam", "New foam restores most of the comfort"],
            ["One seat sags or creaks", "Repair the springs or webbing", "Both can be replaced on the existing frame"],
            ["One loose joint, rest of the frame sound", "Repair, then reupholster if needed", "A single joint can be reglued and reinforced"],
            ["Frame cracked in places, or particle board crumbling", "Make new", "New fabric on a failed frame fails again"],
            ["Made-to-measure majlis that fits the room", "Reupholster", "A replacement would be made to measure anyway"],
            ["You want a new shape, size or more seats", "Make new", "Reupholstery keeps the existing frame's shape"],
          ],
        },
      },
      {
        heading: "Which fabric holds up in a Qatar room?",
        body: [
          "The room matters more than the pattern. See samples in the room itself, in daylight and in the evening light, because a colour that looks quiet on a swatch can dominate a long run of majlis seating.",
        ],
        bullets: [
          "Sun-facing rooms: cotton and linen fade fastest. Synthetic and solution-dyed fabrics hold their colour better, and lined curtains protect any fabric.",
          "Children: a tight weave in a mid-tone hides marks and resists rubbing, and zipped cushion covers can be cleaned one at a time.",
          "AC dust: it settles into deep piles such as velvet and chenille and shows most on dark plain fabric. Flatter, tighter weaves are easier to vacuum.",
          "Faux leather: it wipes clean, but cheaper grades crack and peel in direct sun.",
        ],
      },
      {
        heading: "Is inherited or built-in majlis seating worth keeping?",
        body: [
          "Usually, if the frames are sound. Seating made for the room already follows the walls and finishes cleanly at the corners, and new foam and fabric make it look new without starting again. The same applies to a carved wooden base or a sofa handed down in the family.",
          "The exception is a failed frame. Sentiment does not make a cracked rail hold, and new fabric on it is money spent on something that will fail again.",
        ],
      },
      {
        heading: "When is a new made-to-measure piece the better spend?",
        body: [
          "Reupholstery keeps the frame's shape and size, so when the shape or the frame is the problem, a new piece is usually better value.",
          "Made-to-measure sofas and majlis seating from Al Arabia Carpets start from QAR 850 per piece, and upholstery is quoted after a free check of the frame, springs and foam. Both quotes come in writing, so you can compare them side by side.",
        ],
        bullets: [
          "The frame has cracked in more than one place, or particle board is crumbling around the fixings.",
          "The sofa was inexpensive, so good fabric and foam would cost more than the frame is worth.",
          "You want a different shape, such as a corner unit, lower backs or a raised majlis instead of floor-level seating.",
          "The seating no longer fits the room after a move, or it must seat more people along the same walls.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it cheaper to reupholster a sofa than to buy a new one?",
        a: "Usually, if the frame is sound, because you pay for fabric, foam and labour but not for a new frame. If the frame has failed or the sofa was cheap to begin with, a new piece is normally the better spend.",
      },
      {
        q: "Can I just replace the foam on my sofa?",
        a: "Yes. If the fabric still looks good but the seats have gone flat, new foam alone brings back most of the comfort. Choose the density by sitting on samples; majlis seating used for hours wants firmer foam than a living room sofa.",
      },
      {
        q: "What do you need to quote for reupholstering a sofa or majlis?",
        a: "Photos on WhatsApp, including any damage, and a note of what you want changed. We then check the frame, springs and foam for free, bring fabric samples and give a written quote.",
      },
    ],
    relatedProductIds: ["luxury-majlis-sofa", "modern-majlis", "majlis-and-cabinets-majlis-sofa"],
    relatedServiceSlugs: ["sofa-upholstery", "sofa-making"],
  },
  {
    slug: "wardrobe-planning-guide-qatar",
    title: "How to Plan a Built-In Wardrobe in Qatar",
    metaDescription:
      "How to plan a built-in wardrobe in Qatar: measuring the wall, hinged vs sliding vs walk-in, hanging space for thobes and abayas, and finishes that suit the AC.",
    excerpt:
      "Measuring the wall, choosing hinged, sliding or walk-in, planning hanging space for thobes and abayas, and what to settle before the survey.",
    heroImage: "/Services/wardrobes/walk-in-wardrobe-lit-shelving.webp",
    heroImageAlt:
      "Oak-finish dressing room wardrobe with framed glass sliding doors, glass-fronted top cupboards and LED strip lighting",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    answer:
      "Measure wall to wall and floor to ceiling at several points, choose the door type by the floor space in front of the wall, and plan the inside around what you hang and fold. Sliding doors suit a bed close to the wardrobe; hinged doors need clear floor but usually cost less.",
    intro: [
      "A freestanding wardrobe leaves dead space above it and gaps at each side, and rarely has room for a full set of thobes or abayas. A built-in one runs floor to ceiling and wall to wall, but it only works if it is planned around the room and the clothes.",
      "We build wardrobes and dressing rooms to measure at Al Arabia Carpets, and this guide follows the order in which we plan them with homeowners in Doha.",
    ],
    sections: [
      {
        heading: "How do you measure a wall for a built-in wardrobe?",
        body: [
          "Walls and ceilings in Qatari villas and apartments are rarely square, and a built-in has to fit the tightest point. Measure the width at the top, middle and bottom, and the height at the left, centre and right, then keep the smallest of each.",
          "Those figures start the conversation. The final sizes come from the on-site survey, which also checks how level the floor and walls are, and small gaps are closed by scribing the unit to the wall during installation. Also note what the wardrobe will meet:",
        ],
        bullets: [
          "Skirting, cornice and any gypsum bulkhead at the ceiling.",
          "Sockets, switches and AC grilles that would end up inside the unit.",
          "Windows, and the swing of the room door near the corner.",
          "AC drain pipes or water lines in the wall, which must not be drilled into.",
        ],
      },
      {
        heading: "Hinged, sliding or walk-in: which suits your room?",
        body: [
          "Decide by the floor in front of the wardrobe, not by the look. Hinged doors need room to swing but show the whole interior at once and usually cost less. Sliding doors need no swing space but open one section at a time, and the track adds depth.",
          "A walk-in needs a room or deep alcove of its own. Open shelves collect Qatar's fine dust, so consider glass or solid doors on the upper cupboards and the shoe section.",
        ],
        table: {
          caption: "Hinged, sliding and open walk-in wardrobes compared",
          head: ["Type", "Space needed", "Access to the inside", "Best fits"],
          rows: [
            ["Hinged doors", "Clear floor in front, at least one door wide", "Whole interior visible at once", "Bedrooms with open floor in front of the wall"],
            ["Sliding doors", "No swing space; the track adds some depth", "One section at a time", "Bedrooms where the bed sits close to the wardrobe"],
            ["Open walk-in", "A spare room or deep alcove, plus walking space", "Everything on view", "Villas with a dressing room off the master bedroom"],
          ],
        },
      },
      {
        heading: "How should the inside be laid out for thobes and abayas?",
        body: [
          "Plan around a rough count of what you own, not a standard split of rails and shelves. Many ready-made layouts favour short hanging, which does not suit a household where thobes, abayas and long dresses all hang full length.",
        ],
        bullets: [
          "Long hanging: measure the longest thobe, abaya or dress on its hanger and leave a hand's width below the hem.",
          "Double hanging, one rail above another, for shirts, trousers and children's clothes.",
          "Shelves or shallow drawers for folded ghutras, shemaghs and knitwear.",
          "Drawers for accessories, watches and perfume, one with a lock if needed.",
          "A closed, ventilated shoe section rather than shoes on the wardrobe floor.",
          "Top cupboards for suitcases and spare bedding.",
        ],
      },
      {
        heading: "Which materials and lighting cope with AC and humidity?",
        body: [
          "A bedroom in Qatar spends most of the year in dry, air-conditioned air and turns humid when the house is shut up over a summer trip. Chipboard and MDF swell where moisture reaches a raw edge, so every edge, hidden ones included, should be edge-banded. On a wall shared with a bathroom, ask for moisture-resistant MDF.",
          "HPL or laminate doors take daily handling and wipe clean, lacquer looks smoother but chips more easily, and mirrored doors brighten a small room. LED strip lighting runs cool enough to sit near clothes, but its power point and cable route must be planned before the build.",
        ],
      },
      {
        heading: "What should you decide before the measurement visit?",
        body: [
          "The survey is free, and it goes further when these points are settled. Send the wall dimensions, the ceiling height and a rough idea of what needs storing on WhatsApp first.",
        ],
        bullets: [
          "Which wall, and whether the wardrobe runs to the ceiling.",
          "Hinged, sliding or mirrored doors, with handles or handleless.",
          "A rough count of long garments, folded items and shoes.",
          "Who uses which side, if the wardrobe is shared.",
          "Whether you want lighting inside, and whether the flooring will change.",
        ],
      },
    ],
    faqs: [
      {
        q: "How deep should a built-in wardrobe be?",
        a: "About 60 cm inside, so a hanger sits across the rail without the clothes pressing on the doors. Sliding doors add the depth of their track on top of that.",
      },
      {
        q: "What decides the price of a built-in wardrobe?",
        a: "The width and height of the wall, the door type and how much internal fitting goes in. That is why we quote after measuring the room, and the written quotation is free.",
      },
      {
        q: "Can a built-in wardrobe fit a wall that is not straight?",
        a: "Yes. The unit is scribed to the wall and ceiling during installation, closing the gaps that make a built-in look like a freestanding unit pushed into place.",
      },
      {
        q: "Is a walk-in wardrobe worth it in an apartment?",
        a: "Only if there is a spare room or deep alcove to give up. Otherwise a full wall of sliding-door wardrobe holds more for the same floor area, because no space goes to walking between runs.",
      },
    ],
    relatedProductIds: ["cabinet-and-gypsum-board-work", "cabin-interior-design"],
    relatedServiceSlugs: ["wardrobes"],
  },
  {
    slug: "vinyl-vs-spc-flooring-qatar",
    title: "Vinyl or SPC Flooring: Which Suits Your Room?",
    seoTitle: "Vinyl vs SPC Flooring in Qatar",
    metaDescription:
      "Glue-down vinyl or rigid-core SPC click flooring? How each copes with uneven tiles, water, heavy furniture and Qatar sun, and which rooms suit which one.",
    excerpt:
      "How flexible glue-down vinyl and click-together SPC differ, what each needs from the floor underneath, and which rooms in a Qatar home suit each one.",
    heroImage: "/Products/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp",
    heroImageAlt:
      "Grey oak-effect SPC click boards being laid in a herringbone pattern over glossy white floor tiles",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    answer:
      "For most rooms in Qatar, choose rigid-core SPC. The deciding factor is usually the tiled floor underneath: SPC clicks together over it and bridges small dips, while flexible glue-down vinyl needs the tiles skimmed smooth first. Glue-down suits a floor that is already flat, where you want a thin, quiet finish with no threshold strips.",
    intro: [
      "Ask for vinyl flooring in Doha and you may be shown two different products under one name: a flexible plank that is glued to the floor, and a rigid SPC board that clicks together and floats over an underlay. Both are largely PVC, both come in wood and stone effects, and neither is harmed by water.",
      "How each is built and fixed decides which one suits a room. Most of the vinyl floors we lay are SPC, but the flexible kind still has its place.",
    ],
    sections: [
      {
        heading: "What is the difference between flexible vinyl and SPC?",
        body: [
          "Flexible vinyl, often sold as LVT, is made of layers of PVC: a backing, a printed decor film and a clear wear layer. With no stiff core it follows whatever lies beneath it, so every plank is glued down.",
          "SPC, or stone plastic composite, puts the same film and wear layer on a core of PVC mixed with powdered limestone, which makes the board stiff and stable. Its click edges lock the boards to each other rather than to the floor, and the whole surface floats on a thin underlay with a gap at every wall.",
        ],
      },
      {
        heading: "Which copes better with an uneven tiled floor?",
        body: [
          "Most villas and compound apartments in Qatar already have porcelain or ceramic tiles, and their grout lines sit below the tile face. Glued straight onto them, a flexible plank settles into every line, and over time the tile grid shows through as faint stripes. Glue-down vinyl over tiles needs a skim coat of levelling compound first.",
          "A rigid SPC board spans grout lines and small hollows on its own. It still needs a sound, reasonably level base, because a floating board laid over a hump flexes at the joints until they open, so loose tiles are fixed and real dips levelled. We check this at the free survey.",
        ],
        bullets: [
          "SPC on its underlay sits higher than glued vinyl, so check that the doors still clear.",
          "A floating floor lifts off and leaves the tiles as they were; a glued one leaves adhesive behind, which matters in a rented flat.",
        ],
      },
      {
        heading: "Which is better in kitchens, bathrooms and on ground floors?",
        body: [
          "Both planks are waterproof; the weak point in each is the joints and edges. Water that gets past the edge of a floating SPC floor can spread underneath unseen, so in a kitchen or bathroom the perimeter needs a flexible sealant that keeps water out without pinning the floor to the wall. A glued floor has no void beneath it, but water seeping through its joints can loosen the adhesive.",
          "On villa ground floors and in kitchens, weight matters as much as water. A rigid core spreads the load from small, heavy feet such as fridges, dining tables, wardrobes and majlis seating, where flexible vinyl can take a permanent dent.",
        ],
        bullets: [
          "Kitchens and laundry rooms: SPC with a sealed perimeter, laid around fixed units rather than under them.",
          "Guest bathrooms that are mopped rather than washed down: either floor, with the edges sealed.",
          "Shower areas, or any floor hosed down to a drain: neither. Keep those tiled.",
        ],
      },
      {
        heading: "How do they handle sun, noise and repairs?",
        body: [
          "Heat is where the two differ most in Qatar. Flexible vinyl expands and softens as it warms, and a glued strip in direct afternoon sun behind a big window can open at the joints or lift at the edges. The stone in an SPC core keeps it far more stable. It still moves a little, which is why it is laid with an expansion gap at every wall, hidden under the skirting.",
          "Flexible vinyl is the quieter floor, slightly softer and with no hollow sound, which counts in upstairs bedrooms. It is also easier to repair: a damaged plank is warmed, lifted and replaced where it lies, while a mid-room SPC board means unclicking the boards back from the nearest wall. Keep a few spare boards from the same batch either way.",
        ],
      },
      {
        heading: "Which rooms suit which floor?",
        body: [
          "Put side by side, most rooms decide themselves.",
        ],
        bullets: [
          "Bedrooms, majlis, living rooms and villa ground floors over existing tiles: SPC.",
          "Rooms with big west-facing windows, or a house shut with the AC off over the summer: SPC.",
          "A new screed, or a floor already skimmed flat, where you want the thinnest finish: glue-down vinyl.",
          "A long run through several rooms with no threshold strips: glue-down vinyl, since a floating floor usually needs a break at doorways.",
        ],
        table: {
          caption: "Flexible glue-down vinyl against rigid-core SPC, at a glance",
          head: ["", "Flexible vinyl (glue-down)", "Rigid-core SPC (click)"],
          rows: [
            ["Core", "Layers of PVC; bends in the hand", "PVC and powdered stone; stiff"],
            ["Fixing", "Glued to the subfloor", "Clicks together and floats on an underlay"],
            ["Over existing tiles", "Tiles skimmed smooth first", "Laid over sound, reasonably level tiles"],
            ["Water", "Waterproof plank; seepage can loosen the glue", "Waterproof plank; perimeter sealed in wet rooms"],
            ["Heavy furniture", "Can dent under small, heavy feet", "Resists denting"],
            ["Sun and heat", "Moves more; joints can open in strong sun", "More stable; needs a gap at the walls"],
            ["Sound", "Quiet and slightly softer", "Firmer; depends on the underlay"],
            ["Repairs", "One plank replaced where it lies", "Unclicked back from the nearest wall"],
          ],
        },
      },
    ],
    faqs: [
      {
        q: "Can SPC go straight over my existing floor tiles?",
        a: "Usually, yes, if the tiles are sound and reasonably level. Loose tiles are fixed and deep grout lines filled first.",
      },
      {
        q: "Does SPC need a separate underlay?",
        a: "Not if the boards have an underlay bonded to the back; adding a second soft layer lets the joints flex. Boards without one need a thin, firm underlay laid first.",
      },
      {
        q: "Is flexible vinyl the same as sheet vinyl?",
        a: "No. Sheet vinyl comes off a roll in one wide piece. Flexible vinyl is cut into planks or tiles and glued down one by one, so it reads like boards of wood or stone.",
      },
      {
        q: "How much does SPC flooring cost in Qatar?",
        a: "Supplied and fitted, SPC starts from QAR 75 per sqm with us. The final price depends on the board, the laying pattern and how much levelling the existing floor needs, and we confirm it in a written quote after a free survey.",
      },
    ],
    relatedProductIds: [
      "doha-coastal-grey-premium-rigid-core-spc-vinyl",
      "pearl-grey-herringbone-100-waterproof-spc-qatar",
      "skerting-nala-profile",
    ],
    relatedServiceSlugs: ["vinyl-flooring"],
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

/** Guides that link to a given service landing page. */
export function guidesForService(serviceSlug: string): Guide[] {
  return guides.filter((g) => g.relatedServiceSlugs?.includes(serviceSlug));
}
