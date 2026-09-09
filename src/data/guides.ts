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
  /** Service landing pages this guide links into (src/data/services.ts). */
  relatedServiceSlugs?: string[];
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
    relatedServiceSlugs: ["office-carpet"],
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
    relatedServiceSlugs: ["cabinets", "kitchen-cabinets", "wardrobes", "gypsum-c-board-fixing", "tv-unit-design", "wallpaper"],
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
    relatedServiceSlugs: ["office-carpet", "event-carpet"],
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
    relatedServiceSlugs: ["sofa-making", "cabinets"],
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
    updatedAt: "2026-09-08",
    intro: [
      "Almost every flooring conversation we have in Doha comes down to the same question, even when it is not asked directly: should this room have a plastic floor that looks like wood, or a wood floor?",
      "Both are good products. They fail in completely different ways, though, and the room usually decides which one is right long before taste does. Here is the comparison as we would give it on a survey.",
    ],
    sections: [
      {
        heading: "The short answer",
        body: [
          "If water is a realistic possibility in the room, fit vinyl or SPC. If the room stays dry and you want a genuine timber surface underfoot, fit parquet or laminate.",
          "That single rule settles most rooms. Kitchens, bathrooms, laundry rooms, entrance halls and ground floors that open onto a garden all go to vinyl. Bedrooms, majlis, formal reception rooms and upstairs living areas can go either way.",
        ],
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
    updatedAt: "2026-09-08",
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
      "Choosing artificial grass in Qatar: pile height, drainage, UV stability and why the base under it matters more than the grass itself. From Al Arabia Carpets.",
    excerpt:
      "Pile height, drainage, heat and UV: what to specify, and why the base underneath decides how it looks in three years.",
    heroImage: "/Products/Carpets/Artificial grass installation work.jpeg",
    heroImageAlt: "Artificial grass laid over the entrance steps and forecourt of a villa in Qatar",
    updatedAt: "2026-09-08",
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
    relatedServiceSlugs: ["artificial-grass"],
  },
  {
    slug: "event-carpet-guide-qatar",
    title: "Planning Event Carpet for a Venue in Qatar",
    seoTitle: "Event Carpet Planning Guide for Qatar",
    metaDescription:
      "Planning event carpet in Qatar: access windows, hire versus purchase, colours, taping rules and lifting. What venues expect and what to brief your fitter.",
    excerpt:
      "Access windows, hire versus buy, venue taping rules, and the questions to settle before the night of the install.",
    heroImage: "/Products/Carpets/carpet.webp",
    heroImageAlt: "Wall-to-wall carpet laid across a large open floor",
    updatedAt: "2026-09-08",
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
        heading: "Hire or buy",
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
    updatedAt: "2026-09-08",
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
