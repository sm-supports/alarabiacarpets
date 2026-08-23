/**
 * Service landing pages for capabilities the business performs but does not
 * hold as catalogue SKUs.
 *
 * These live at /services/* rather than /products/* deliberately: that namespace
 * lists products, and these have none. A category page with an empty grid would
 * be worse than no page.
 *
 * IMAGES: all four services now have real project photography in
 * public/Services/<slug>/. wardrobes has a full gallery; wallpaper,
 * kitchen-cabinets and parquet-flooring currently have a hero only.
 *
 * The rule that got them here still stands: a photo goes on a service page only
 * if it depicts THAT service. Never illustrate the kitchen page with a bedroom
 * wardrobe or the wallpaper page with a carpet. If a future service has no
 * photo, leave heroImage unset -- the page renders text-only, og:image falls
 * back to the brand logo, and the Service schema omits `image` rather than
 * asserting work we cannot show.
 */

export interface ServiceStep {
  title: string;
  body: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface ServiceImage {
  src: string;
  alt: string;
}

export interface Service {
  slug: string;
  /** Page <h1>. */
  heading: string;
  /** Short label for cards, nav and breadcrumbs. */
  label: string;
  seoTitle: string;
  metaDescription: string;
  /** Card blurb on /services. */
  excerpt: string;
  intro: string[];
  /** "What we install/build" bullets. */
  offers: string[];
  /** "What the price includes" bullets. */
  includes: string[];
  specs: ServiceSpec[];
  steps: ServiceStep[];
  faqs: ServiceFaq[];
  /** Existing product ids only -- verified to exist in src/data/products.ts. */
  relatedProductIds: string[];
  /** Category landing pages this service links up to. */
  relatedCategorySlugs: string[];
  /** Real project photo. Unset means we have none -- never borrow one. */
  heroImage?: string;
  heroImageAlt?: string;
  /** Further project photos, shown as a gallery under the intro. */
  gallery?: ServiceImage[];
}

const AREAS =
  "We work across Doha, Al Wakra, Al Khor, Lusail, Al Rayyan and the rest of Qatar.";

export const services: Service[] = [
  {
    slug: "wallpaper",
    heading: "Wallpaper Installation in Qatar",
    label: "Wallpaper",
    seoTitle: "Wallpaper Installation in Qatar | Doha Fitting",
    metaDescription:
      "Wallpaper supply and installation across Qatar. Wall preparation, precise pattern matching and clean seams, fitted by our own team in Doha.",
    excerpt:
      "Supply and installation, including the wall preparation that determines whether the finish lasts.",
    intro: [
      "Wallpaper lives or dies on preparation. Most of the failures we are called to fix — lifting seams, bubbles, a pattern that drifts out of true across a wall — trace back to a wall that was not made good before hanging, not to the paper itself.",
      "We prepare the surface, hang the paper and finish the edges, working across homes, offices, majlis and retail spaces in Qatar. " + AREAS,
    ],
    offers: [
      "Feature walls and full-room installations",
      "Textured, vinyl and washable papers",
      "Patterned papers requiring drop matching",
      "Panoramic and mural papers",
      "Commercial-grade wallcoverings for offices and retail",
      "Removal and disposal of existing wallpaper",
    ],
    includes: [
      "On-site survey and measurement before ordering",
      "Wall preparation: filling, sanding and sizing",
      "Removal of old wallpaper where present",
      "Hanging, pattern matching and seam finishing",
      "Trimming around sockets, switches and fittings",
      "Clean-up and removal of waste",
    ],
    specs: [
      { label: "Surface prep", value: "Filling, sanding, sizing included" },
      { label: "Pattern matching", value: "Drop and offset matched on site" },
      { label: "Suitable for", value: "Homes, offices, majlis, retail" },
      { label: "Measurement", value: "Free on-site survey" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Send us the room", body: "Message us on WhatsApp with photos and rough dimensions, and we will tell you straight away whether the wall needs work before papering." },
      { title: "Free survey", body: "We visit, measure each wall, check the surface condition and confirm how many rolls the pattern repeat will need." },
      { title: "Quotation", body: "A written quote covering preparation, materials and hanging, with no separate charge for delivery or fitting." },
      { title: "Installation", body: "Our team preps, hangs and finishes, then clears the waste. Most single rooms are completed in a day." },
    ],
    faqs: [
      { q: "Do you prepare the wall before hanging wallpaper?", a: "Yes, and it is included. We fill, sand and size the surface first. Skipping that step is the single most common cause of seams lifting and bubbles appearing later, so we do not quote without it." },
      { q: "Can you remove existing wallpaper?", a: "Yes. Stripping the old paper and making the wall good is part of the quote when there is existing wallpaper in place. We would rather strip it than hang over it." },
      { q: "How much wallpaper will my room need?", a: "It depends on the pattern repeat as much as the wall area — a large drop match wastes considerably more than a plain paper. We calculate the roll count during the survey so you are not left short mid-wall." },
      { q: "Is wallpaper practical in Qatar's humidity?", a: "In air-conditioned rooms, yes. For bathrooms and other consistently humid areas we would recommend a vinyl or washable paper, or suggest wall panelling instead." },
    ],
    relatedProductIds: [
      "indoor-wall-panel-design",
      "outdoor-wall-panel-products",
      "gypsum-board-work-design",
    ],
    relatedCategorySlugs: ["interior"],
    heroImage: "/Services/wallpaper/wallpaper-tv-feature-wall.webp",
    heroImageAlt:
      "Damask-patterned wallpaper hung across a backlit TV feature wall in a Doha living room",
  },
  {
    slug: "kitchen-cabinets",
    heading: "Kitchen Cabinets in Qatar",
    label: "Kitchen Cabinets",
    seoTitle: "Kitchen Cabinets in Qatar | Made to Measure",
    metaDescription:
      "Made-to-measure kitchen cabinets in Qatar. Designed to your kitchen's real dimensions, built and installed by our own team in Doha.",
    excerpt:
      "Built to your kitchen's real measurements rather than assembled from fixed-size units.",
    intro: [
      "Very few kitchens are a tidy set of standard widths. Building to measure means the run reaches the wall properly, awkward corners become usable storage instead of dead space, and there are no filler panels papering over the gaps.",
      "We design, build and install kitchen cabinetry as part of our interior fit-out work, so the cabinets, the flooring and the surrounding joinery are handled by one team. " + AREAS,
    ],
    offers: [
      "Base, wall and tall units built to your dimensions",
      "Corner solutions for awkward layouts",
      "Pantry and appliance housing",
      "Island and peninsula units",
      "Soft-close hinges and drawer runners",
      "Coordinated handles and finishes",
    ],
    includes: [
      "On-site measurement and layout design",
      "Cabinet construction to your dimensions",
      "Delivery to your location",
      "Installation and levelling",
      "Fitting of hinges, runners and handles",
      "Removal of the old kitchen where required",
    ],
    specs: [
      { label: "Made to measure", value: "Built to your kitchen's dimensions" },
      { label: "Unit types", value: "Base, wall, tall, island" },
      { label: "Hardware", value: "Soft-close hinges and runners" },
      { label: "Coordinates with", value: "Our flooring and fit-out work" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Talk it through", body: "Send us your kitchen dimensions or photos on WhatsApp and tell us what is not working about the current layout." },
      { title: "Free survey and layout", body: "We measure the room, note the plumbing and electrical positions, and propose a layout that uses the full run." },
      { title: "Quotation", body: "A written quote covering the cabinetry, hardware, delivery and installation." },
      { title: "Build and install", body: "Units are built to the measured sizes, then delivered, installed and levelled by our team." },
    ],
    faqs: [
      { q: "Why choose made-to-measure over standard units?", a: "Standard-width units almost never add up to the length of a real wall, so the gaps get hidden behind filler panels. Building to measure uses the full run and turns corners into usable storage rather than dead space." },
      { q: "Can you replace a kitchen without redoing the whole room?", a: "Usually yes. If the plumbing and electrical positions are staying put, we can remove the old units and install new cabinetry without touching the rest of the room." },
      { q: "Do you handle the flooring at the same time?", a: "Yes, and it is generally easier. We supply barkia, SPC and vinyl flooring as well, so the floor and the cabinetry can be sequenced properly rather than coordinated between two contractors." },
      { q: "How long does a kitchen take?", a: "It depends on the size of the run and the finish selected. We give a firm lead time with the quotation, once the layout and materials are settled." },
    ],
    relatedProductIds: [
      "cabinet-and-gypsum-board-work",
      "cabin-interior-design",
      "television-decore-with-cabin-box",
    ],
    relatedCategorySlugs: ["interior", "barkia"],
    heroImage: "/Services/kitchen-cabinets/fitted-kitchen-taupe-handleless.webp",
    heroImageAlt:
      "Handleless taupe fitted kitchen with a black stone worktop and under-cabinet lighting in Qatar",
  },
  {
    slug: "wardrobes",
    heading: "Wardrobes & Room Cabinets in Qatar",
    label: "Wardrobes & Cabinets",
    seoTitle: "Wardrobes & Room Cabinets in Qatar | Doha",
    metaDescription:
      "Built-in wardrobes and room cabinets in Qatar. Made to your room's height and width, with interiors planned around what you actually store.",
    excerpt:
      "Built-in wardrobes and storage sized to the room, floor to ceiling, with no wasted space above.",
    intro: [
      "A freestanding wardrobe leaves dead space above it and gaps at the sides. A built-in one runs floor to ceiling and wall to wall, which in a Qatari bedroom typically adds a substantial amount of usable storage for the same footprint.",
      "We build wardrobes, dressing rooms and general room cabinetry to measure, and plan the interior around what is actually going in it rather than a fixed hanging-and-shelf ratio. " + AREAS,
    ],
    offers: [
      "Built-in and walk-in wardrobes",
      "Sliding and hinged door systems",
      "Dressing room fit-outs",
      "Bedroom and living room storage cabinets",
      "Interior fit-out: hanging rails, shelving, drawers, shoe racks",
      "Mirrored and panelled door finishes",
    ],
    includes: [
      "On-site measurement, including ceiling height and floor level",
      "Interior layout planned around what you store",
      "Construction to your dimensions",
      "Delivery and installation",
      "Door, rail, shelf and drawer fitting",
      "Scribing to uneven walls and ceilings",
    ],
    specs: [
      { label: "Made to measure", value: "Floor to ceiling, wall to wall" },
      { label: "Door types", value: "Sliding and hinged" },
      { label: "Interior", value: "Rails, shelves, drawers, shoe racks" },
      { label: "Best for", value: "Bedrooms, dressing rooms, living rooms" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Tell us the space", body: "Send the wall dimensions and ceiling height on WhatsApp, along with a rough idea of what needs to be stored." },
      { title: "Free survey", body: "We measure the opening, check how level the floor and walls actually are, and agree the door type." },
      { title: "Interior layout", body: "We plan the split between hanging, shelving and drawers around your actual wardrobe, not a standard ratio." },
      { title: "Build and install", body: "Built to the measured sizes, then installed and scribed to the walls so there are no gaps." },
    ],
    faqs: [
      { q: "How much extra storage does a built-in wardrobe give?", a: "Usually a good deal. A freestanding unit wastes the space between its top and the ceiling and leaves gaps at each side. Running floor to ceiling and wall to wall recovers all of it, and the recovered area is genuinely usable with a proper interior." },
      { q: "Sliding or hinged doors?", a: "Sliding doors need no clearance in front, which matters in a bedroom where the bed sits close to the wardrobe. Hinged doors let you see the whole interior at once and cost less. We will recommend based on how much floor clearance the room actually has." },
      { q: "Can you fit a wardrobe to a sloped or uneven wall?", a: "Yes. We scribe the unit to the wall and ceiling during installation, which closes the gaps that make a built-in look like a freestanding unit pushed into place." },
      { q: "Do you fit out dressing rooms as well?", a: "Yes. A dressing room is the same work at a larger scale — the layout planning matters more, since there is usually a mix of hanging lengths, drawers and shoe storage to balance." },
    ],
    relatedProductIds: [
      "cabinet-and-gypsum-board-work",
      "majlis-and-cabinets-majlis-sofa",
      "cabin-interior-design",
    ],
    relatedCategorySlugs: ["interior", "majlis-sofa"],
    heroImage: "/Services/wardrobes/walk-in-wardrobe-classic-white.webp",
    heroImageAlt:
      "Floor-to-ceiling fitted wardrobes with panelled doors in a Qatari dressing room",
    gallery: [
      {
        src: "/Services/wardrobes/walk-in-wardrobe-lit-shelving.webp",
        alt: "Walk-in wardrobe interior with glass shelving and integrated LED lighting",
      },
      {
        src: "/Services/wardrobes/dressing-room-island-drawers.webp",
        alt: "Dressing room fit-out with full-height wardrobes and a central drawer island",
      },
      {
        src: "/Services/wardrobes/fitted-wardrobe-wood-veneer.webp",
        alt: "Handleless wood veneer wardrobe run finished flush to the ceiling with cove lighting",
      },
      {
        src: "/Services/wardrobes/fitted-wardrobe-handleless-white.webp",
        alt: "Handleless white fitted wardrobe spanning a bedroom wall floor to ceiling",
      },
      {
        src: "/Services/wardrobes/fitted-wardrobe-installation.webp",
        alt: "Fitted wardrobe being installed and scribed to the wall in a Doha bedroom",
      },
      {
        src: "/Services/wardrobes/sliding-mirror-wardrobe.webp",
        alt: "Three-door sliding mirrored wardrobe fitted in a Qatari bedroom",
      },
      {
        src: "/Services/wardrobes/wardrobe-with-dressing-table.webp",
        alt: "Fitted wardrobe with an integrated dressing table and mirror",
      },
      {
        src: "/Services/wardrobes/fitted-wardrobe-black-handles.webp",
        alt: "White fitted wardrobes with long black handles running the width of a bedroom",
      },
      {
        src: "/Services/wardrobes/corridor-wardrobe-run.webp",
        alt: "Full-height wardrobe run built along a corridor wall",
      },
      {
        src: "/Services/wardrobes/fitted-wardrobe-grey-wood.webp",
        alt: "Fitted wardrobes in a grey wood finish with black handles",
      },
      {
        src: "/Services/wardrobes/fitted-wardrobe-flush-detail.webp",
        alt: "Detail of a handleless wardrobe finished flush with the wall and ceiling",
      },
    ],
  },
  {
    slug: "parquet-flooring",
    heading: "Parquet & Laminate Flooring in Qatar",
    label: "Parquet & Laminate",
    seoTitle: "Parquet & Laminate Flooring in Qatar",
    metaDescription:
      "Parquet and laminate flooring in Qatar. Herringbone, chevron and plank formats supplied and laid by our own fitters across Doha.",
    excerpt:
      "Herringbone, chevron and plank formats — chosen on laying pattern as much as on colour.",
    intro: [
      "Parquet is a decision about pattern before it is a decision about colour. Herringbone, chevron and basketweave each change how a room reads: they draw the eye along a particular line, and in a hallway or a formal room that effect does more work than the shade of the wood.",
      "We supply and lay parquet and laminate across Qatar in all the common formats. Where a room needs to be fully waterproof, our SPC range covers the same looks in a format that tolerates water — worth comparing before you decide.",
    ],
    offers: [
      "Herringbone, chevron and basketweave patterns",
      "Straight and random-length plank laying",
      "Laminate flooring in wood and stone decors",
      "Border and inlay detailing",
      "Threshold bars and skirting to finish",
      "Sub-floor levelling before laying",
    ],
    includes: [
      "On-site survey and sub-floor level check",
      "Layout planning: pattern direction and start point",
      "Sub-floor preparation where needed",
      "Underlay where the format calls for it",
      "Laying, cutting and border work",
      "Skirting, beading and threshold bars",
    ],
    specs: [
      { label: "Patterns", value: "Herringbone, chevron, basketweave, plank" },
      { label: "Formats", value: "Parquet blocks and laminate planks" },
      { label: "Pattern direction", value: "Set on site before laying" },
      { label: "Waterproof alternative", value: "See our SPC range" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Choose the pattern", body: "Message us on WhatsApp with the room and how it is used, and we will talk through which laying pattern suits it." },
      { title: "Free survey", body: "We measure and check the sub-floor is level — the step that decides whether a patterned floor stays true across the room." },
      { title: "Layout planning", body: "We agree the pattern direction and starting point with you on site. It cannot be changed once laying begins." },
      { title: "Laying", body: "Laid, cut and finished with skirting and threshold bars, then the site is cleared." },
    ],
    faqs: [
      { q: "What is the difference between herringbone and chevron?", a: "Herringbone lays rectangular blocks at right angles, so the ends form a stepped zig-zag. Chevron cuts the ends at an angle so they meet in a continuous point, making a cleaner V. Chevron costs more because of the angled cutting." },
      { q: "Which laying pattern suits my room?", a: "Herringbone and chevron are at their best in hallways, dining rooms and formal reception spaces, where the pattern is read as a whole. In a large open-plan room a straight or random-length plank is usually calmer and less expensive to lay." },
      { q: "Is parquet or laminate suitable for wet areas?", a: "Not really. For bathrooms, kitchens and anywhere that regularly sees water we would point you at our SPC range, which offers the same herringbone and plank looks in a fully waterproof board." },
      { q: "Does the sub-floor need preparing?", a: "It matters more here than for a plain plank floor. A patterned lay accumulates any error across the room, so a floor that is out of level shows as a pattern drifting out of true. We check and level before laying." },
    ],
    relatedProductIds: [
      "pearl-grey-herringbone-100-waterproof-spc-qatar",
      "desert-walnut-classic-luxury-spc-flooring-doha",
      "royal-mahogany-luxury-waterproof-vinyl-spc",
      "spc-zigzag-barkia-installation",
    ],
    relatedCategorySlugs: ["barkia"],
    heroImage: "/Services/parquet-flooring/herringbone-laminate-installation.webp",
    heroImageAlt:
      "Herringbone laminate flooring being laid plank by plank over a levelled sub-floor in Qatar",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
