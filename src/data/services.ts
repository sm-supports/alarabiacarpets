/**
 * Service landing pages for capabilities the business performs but does not
 * hold as catalogue SKUs.
 *
 * These live at /services/* rather than /products/* deliberately: that namespace
 * lists products, and these have none. A category page with an empty grid would
 * be worse than no page.
 *
 * IMAGES: photography lives in public/Services/<slug>/ for the original four
 * services and in public/Products/<Folder>/ for the keyword landing pages added
 * later. Every hero here has been eyeballed against the service it sits on.
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

/**
 * A sub-topic folded into a service page rather than given a thin URL of its
 * own. Same reasoning as Category.secondary in src/data/categories.ts: two
 * near-identical pages compete with each other, one deeper page does not.
 */
export interface ServiceSection {
  heading: string;
  intro: string[];
  specs?: ServiceSpec[];
  faqs?: ServiceFaq[];
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
  /** Sibling and hub service pages. Existing slugs only -- asserted at build. */
  relatedServiceSlugs?: string[];
  /** Sub-topic folded into this page instead of getting a thin URL of its own. */
  secondary?: ServiceSection;
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
      { q: "How long does wallpaper installation take?", a: "A single feature wall is usually hung in a few hours and a full room within a day, once preparation is done. Where a wall needs stripping, filling and sanding first, we allow an extra day so the filler is properly dry before any paper goes onto it." },
      { q: "Should I choose wallpaper or wall panelling?", a: "Wallpaper is cheaper, comes in far more patterns and suits bedrooms and living rooms. Panelling is more hard-wearing, adds real physical depth and copes better with knocks and humidity. For a TV wall or a busy hallway we would usually point you at panelling." },
    ],
    relatedProductIds: [
      "indoor-wall-panel-design",
      "outdoor-wall-panel-products",
      "gypsum-board-work-design",
    ],
    relatedCategorySlugs: ["interior"],
    relatedServiceSlugs: ["tv-unit-design", "gypsum-c-board-fixing", "cabinets"],
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
      { q: "Can you replace just the cabinet doors?", a: "Yes, where the carcasses are sound. New doors and handles change the look of a kitchen for a fraction of a full replacement and take a day or two rather than a week. We check the carcasses and hinges first and tell you honestly whether they are worth keeping." },
      { q: "How do you allow for appliances?", a: "We plan the cabinetry around the appliances you are keeping or buying, so tell us the models at the survey. Built-in ovens, hobs and fridges each have specific housing dimensions, and discovering a mismatch on delivery day means rebuilding a unit." },
    ],
    relatedProductIds: [
      "cabinet-and-gypsum-board-work",
      "cabin-interior-design",
      "television-decore-with-cabin-box",
    ],
    relatedCategorySlugs: ["interior", "barkia"],
    relatedServiceSlugs: ["cabinets", "wardrobes", "tv-unit-design"],
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
      { q: "What is the difference between a wardrobe and a room cabinet?", a: "They are built the same way; the difference is what goes inside. A wardrobe is planned around hanging space, a room cabinet around shelves and drawers for linen, documents or general storage. We make both, and most bedrooms end up with a mix of the two." },
      { q: "Can you build room cabinets into an alcove or corridor?", a: "Yes, and it is where fitted cabinetry earns its cost. An alcove or corridor recess is dead space that no freestanding unit fits properly. Cabinets scribed to the walls turn it into full-height storage without losing any usable floor area." },
    ],
    relatedProductIds: [
      "cabinet-and-gypsum-board-work",
      "majlis-and-cabinets-majlis-sofa",
      "cabin-interior-design",
    ],
    relatedCategorySlugs: ["interior", "majlis-sofa"],
    relatedServiceSlugs: ["cabinets", "kitchen-cabinets", "tv-unit-design"],
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
      { q: "How long does parquet flooring take to lay?", a: "A single room in a straight plank pattern is usually laid within a day. Herringbone and chevron take longer because every board is cut and fitted individually, so allow two to three days for a room, plus any time needed to level the sub-floor beforehand." },
      { q: "Can parquet be laid over existing tiles?", a: "Usually yes, provided the tiles are sound and flat, and it avoids the cost and mess of lifting them. We check for loose tiles and deep grout lines at the survey, because both telegraph through a floating floor if they are not levelled first." },
    ],
    relatedProductIds: [
      "pearl-grey-herringbone-100-waterproof-spc-qatar",
      "desert-walnut-classic-luxury-spc-flooring-doha",
      "royal-mahogany-luxury-waterproof-vinyl-spc",
      "spc-zigzag-barkia-installation",
    ],
    relatedCategorySlugs: ["barkia"],
    relatedServiceSlugs: ["vinyl-flooring", "office-carpet"],
    heroImage: "/Services/parquet-flooring/herringbone-laminate-installation.webp",
    heroImageAlt:
      "Herringbone laminate flooring being laid plank by plank over a levelled sub-floor in Qatar",
  },
  // ---------------------------------------------------------------------------
  // Keyword landing pages. Each targets a commercial search term that previously
  // had no rankable page -- the capability existed only as a single product SKU
  // inside a category grid, which will not rank for a head term.
  // ---------------------------------------------------------------------------
  {
    slug: "event-carpet",
    heading: "Event Carpet Work in Qatar",
    label: "Event Carpet",
    seoTitle: "Event Carpet Installation in Qatar",
    metaDescription:
      "Event carpet supplied and laid across Qatar for exhibitions, conferences and weddings. Overnight installation, and we lift and clear it afterwards.",
    excerpt:
      "Exhibition, conference and wedding carpet laid to a deadline, including overnight installs and same-night lifts.",
    intro: [
      "Event carpet is judged on two things: how the floor looks when the doors open, and whether it was finished in time. Neither is really about the carpet. Both come down to how much of a venue a team can cover between the last contractor leaving and the first guest arriving.",
      "We supply and lay event carpet across Qatar for exhibitions, conferences, weddings, product launches and VIP arrivals. Most of this work happens overnight, because an out-of-hours slot is usually the only access a venue will give.",
      "We lay for a single evening or for a run of several weeks, then lift and clear afterwards. " + AREAS,
    ],
    offers: [
      "Exhibition hall floors and individual stand carpet",
      "Conference, ballroom and banquet seating areas",
      "Wedding aisles and reception walkways",
      "Red carpet and VIP arrival routes",
      "Linking corridors and walkways between halls",
      "Overnight installation and post-event lifting",
    ],
    includes: [
      "Site visit and measurement ahead of the event date",
      "Delivery to the venue inside your access window",
      "Laying, taping and edge finishing to the venue's rules",
      "Cutting around stands, pillars and cable runs",
      "Lifting and removal once the event closes",
      "Disposal of used carpet where it is not being retained",
    ],
    specs: [
      { label: "Typical use", value: "Exhibitions, conferences, weddings" },
      { label: "Install window", value: "Overnight and out-of-hours" },
      { label: "Colours", value: "Full range, including red and black" },
      { label: "Supply basis", value: "One-off event or reusable purchase" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Tell us the venue and date", body: "Message us on WhatsApp with the hall, the floor area and the date. We will tell you straight away whether the access window is workable." },
      { title: "Site visit", body: "We measure the space, check the access route and confirm what the venue allows in terms of fixing and taping." },
      { title: "Quotation", body: "A written quote covering supply, laying and lifting, with the install window written into it so there is no argument on the night." },
      { title: "Install and lift", body: "We lay overnight or out of hours, hand over a finished floor, then return after the event to lift and clear." },
    ],
    faqs: [
      { q: "How quickly can you lay event carpet?", a: "For a single hall we can usually mobilise within 48 hours of confirmation and lay overnight, so the space is ready the following morning. For large exhibition floors we ask for about a week so we can order the colour and put enough fitters on site." },
      { q: "Do you install outside venue opening hours?", a: "Yes, and it is how most event carpet gets laid. Venues rarely give daytime access, so we work overnight or early morning inside whatever window you have been allocated, and hand the floor over finished." },
      { q: "Is it cheaper to hire event carpet or buy it?", a: "For a one-off event, laying a budget grade and disposing of it afterwards is normally the cheapest route. If you run several events a year, buying a heavier carpet that can be lifted, stored and relaid usually costs less across the year." },
      { q: "What colours can I get?", a: "The full commercial range, including the red used for VIP arrivals, plus black, blue, grey, green and neutral tones for exhibition floors. Tell us your brand colour at the survey and we will confirm what can be sourced in time." },
      { q: "Will the carpet damage the venue floor?", a: "No. We fix using tapes appropriate to the venue's floor finish and to whatever the venue permits, and we lift everything afterwards. If the venue has specific rules on adhesives, tell us at the survey and we will work to them." },
      { q: "Do you remove the carpet after the event?", a: "Yes. Lifting, clearing and disposal are quoted in from the start rather than added later. If you are keeping the carpet for reuse we lift it carefully, roll it and leave it ready for storage." },
    ],
    relatedProductIds: ["event-normal-carpet", "tiles-carpet-office-carpet", "stairs-carpet-installation"],
    relatedCategorySlugs: ["carpet"],
    relatedServiceSlugs: ["office-carpet", "artificial-grass"],
    // No heroImage on purpose. The only event-carpet asset we hold is a scanned
    // colour swatch card, which is not a photograph of our work -- see the rule
    // at the top of this file. Text-only until we shoot a real install.
  },
  {
    slug: "office-carpet",
    heading: "Office Carpet in Qatar",
    label: "Office Carpet",
    seoTitle: "Office Carpet & Carpet Tiles in Qatar",
    metaDescription:
      "Office carpet and carpet tiles supplied and fitted across Qatar. Hard-wearing, acoustic and easy to patch, installed around your working hours in Doha.",
    excerpt:
      "Carpet tiles and broadloom for offices, fitted out of hours so the floor is ready before your team arrives.",
    intro: [
      "An office floor gets walked on far more than a domestic one, and it has to keep looking presentable while it does. That is why most offices we fit end up on carpet tiles rather than broadloom: when a tile is stained or worn you lift that tile and drop in a new one, instead of re-carpeting the room.",
      "Carpet also does acoustic work that hard flooring cannot. In an open-plan office it takes the edge off footfall and chair movement, which is usually the difference between a room people can concentrate in and one they cannot.",
      "We supply and fit office carpet across Qatar, working around your business hours where the space cannot be handed over empty. " + AREAS,
    ],
    offers: [
      "Carpet tiles in plain, striped and patterned ranges",
      "Broadloom wall-to-wall for cellular offices and boardrooms",
      "Open-plan floors, meeting rooms and reception areas",
      "Corridors, stairs and lift lobbies",
      "Uplift and disposal of existing floorcovering",
      "Phased fit-out so departments keep working",
    ],
    includes: [
      "Free on-site measurement and floor inspection",
      "Uplift and disposal of the existing carpet",
      "Sub-floor checking and levelling where required",
      "Supply, laying and edge trimming",
      "Fitting around desks, cable boxes and floor outlets",
      "Attic stock of spare tiles for future patch repairs",
    ],
    specs: [
      { label: "Formats", value: "Carpet tiles and broadloom" },
      { label: "Tile size", value: "50 x 50 cm standard" },
      { label: "Best for", value: "Open-plan, meeting rooms, corridors" },
      { label: "Repairs", value: "Tiles replaced individually" },
      { label: "Fitting hours", value: "Evenings and weekends available" },
    ],
    steps: [
      { title: "Send us the floor plan", body: "Message us on WhatsApp with the area and a rough plan or photos, and we will come back with suitable grades and an indicative cost." },
      { title: "Free survey", body: "We measure, check the sub-floor and agree how the fit-out is phased so your team can keep working through it." },
      { title: "Quotation", body: "A written quote covering uplift, supply, fitting and spare stock, with the working hours agreed up front." },
      { title: "Installation", body: "We fit around your schedule, usually evenings or weekends for occupied offices, and clear the site before you reopen." },
    ],
    faqs: [
      { q: "Are carpet tiles better than broadloom for an office?", a: "For most offices, yes. A damaged tile is lifted and swapped in minutes, whereas a stain on broadloom means living with it or re-carpeting the room. Broadloom still wins in boardrooms and cellular offices where the seamless look matters more than patch repairs." },
      { q: "Can you fit carpet without closing the office?", a: "Yes. We normally phase the work floor by floor or department by department, and fit in the evenings or at weekends. Desks are moved, the area is laid and put back, and the space is usable the next working morning." },
      { q: "Does office carpet help with noise?", a: "Noticeably, in open-plan space. Carpet absorbs footfall and chair movement rather than reflecting it the way hard flooring does, which lowers the background noise level people are trying to concentrate through. It is one of the main reasons open-plan offices are carpeted." },
      { q: "How long does office carpet last?", a: "A contract-grade carpet tile in a normal office holds up for many years, and because tiles are replaced individually the floor does not have a single end-of-life date. Corridors and lift lobbies wear fastest, which is why we leave spare tiles from the same batch." },
      { q: "Do you take the old carpet away?", a: "Yes. Uplift and disposal of the existing floorcovering are included in the quote rather than charged as an extra, and we clear the site at the end of each phase." },
      { q: "Why do you leave spare tiles?", a: "Because dye lots change. A tile bought in two years' time will not match exactly, so we leave attic stock from your own batch. When a tile is later damaged, the replacement is invisible instead of an obvious patch." },
    ],
    relatedProductIds: ["tiles-carpet-office-carpet", "office-blind-office-roller-vertical-blinds", "stairs-carpet-installation"],
    relatedCategorySlugs: ["carpet", "curtain"],
    relatedServiceSlugs: ["event-carpet", "vinyl-flooring"],
    heroImage: "/Products/Carpets/Tiles carpet:office carpet.jpeg",
    heroImageAlt:
      "Grey striped carpet tiles laid in a quarter-turn pattern across an office floor",
  },
  {
    slug: "vinyl-flooring",
    heading: "Vinyl Flooring in Qatar",
    label: "Vinyl Flooring",
    seoTitle: "Vinyl & SPC Flooring in Qatar",
    metaDescription:
      "Vinyl, PVC and SPC flooring supplied and installed across Qatar. Fully waterproof, hard-wearing wood and stone effects, fitted by our own team in Doha.",
    excerpt:
      "Waterproof vinyl, PVC and rigid-core SPC in wood and stone effects, measured and laid by our own fitters.",
    intro: [
      "Vinyl flooring has changed a great deal. The rigid-core boards we fit now are a long way from the sheet vinyl the name still brings to mind: they click together over the existing floor, they are fully waterproof, and the better wood effects are difficult to tell from real timber until you touch them.",
      "That waterproofing is what makes vinyl so well suited to Qatar. Kitchens, bathrooms, laundry rooms and villa ground floors all see water at some point, and a board that shrugs it off will outlast laminate in the same room by years.",
      "We supply and lay vinyl, PVC and SPC flooring across Qatar, including the sub-floor preparation that decides whether a clicked floor stays flat. " + AREAS,
    ],
    offers: [
      "Rigid-core SPC planks in wood and stone effects",
      "PVC and barkia flooring for villas and majlis",
      "Waterproof flooring for kitchens, bathrooms and laundries",
      "Herringbone and chevron formats in vinyl",
      "Commercial-grade vinyl for offices and retail",
      "Skirting, nala profiles and threshold bars",
    ],
    includes: [
      "Free on-site measurement and sub-floor check",
      "Uplift and disposal of the existing floorcovering",
      "Levelling where the sub-floor needs it",
      "Underlay, laying and expansion gaps",
      "Skirting or nala profile and threshold bars",
      "Clean-up and removal of offcuts",
    ],
    specs: [
      { label: "Water resistance", value: "100% waterproof core" },
      { label: "Formats", value: "Plank, herringbone, chevron, stone tile" },
      { label: "Suitable for", value: "Kitchens, bathrooms, villas, offices" },
      { label: "Underfloor", value: "Laid over levelled tile or screed" },
      { label: "Measurement", value: "Free on-site survey" },
    ],
    steps: [
      { title: "Send us the room", body: "Message us on WhatsApp with photos and rough dimensions and we will tell you which range suits the room and how the existing floor affects the cost." },
      { title: "Free survey", body: "We measure and check the sub-floor for level. On a clicked floor this is the step that decides whether the joints hold." },
      { title: "Quotation", body: "A written quote covering preparation, boards, trims and laying, with no separate delivery or fitting charge." },
      { title: "Installation", body: "We prepare the sub-floor, lay the boards, fit trims and clear the offcuts. Most rooms are finished in a day." },
    ],
    faqs: [
      { q: "What is the difference between vinyl, PVC and SPC?", a: "They overlap heavily. PVC is the plastic the boards are made from, vinyl is the general trade name, and SPC is a rigid stone-plastic composite core that makes the board harder and more stable underfoot. Everything we fit is a rigid-core board rather than soft sheet vinyl." },
      { q: "Is vinyl flooring genuinely waterproof?", a: "The board itself is. An SPC core will not swell if water sits on it, which is why it works in kitchens and bathrooms where laminate fails. Standing water can still get through the joints to the sub-floor, so a wet room needs sealing at the edges as well." },
      { q: "Can vinyl be laid over existing tiles?", a: "Usually yes, and it saves the cost and mess of removing them. The tiles need to be sound and reasonably flat. Deep grout lines can telegraph through a thin board, so we check at the survey and level them first where needed." },
      { q: "Should I choose vinyl or parquet?", a: "Choose vinyl where water is a factor, or where you want the look at a lower cost. Choose parquet or laminate where the room stays dry and you want a genuine timber surface. We fit both, so we will tell you honestly which suits the room." },
      { q: "How long does vinyl flooring take to install?", a: "A typical room is laid in a day. The variable is preparation, not laying: if the existing floor needs levelling that adds a day and has to cure before boards go down. We confirm this at the survey rather than on the day." },
      { q: "Does vinyl flooring cope with Qatar's heat?", a: "Indoors, yes. In air-conditioned rooms it is very stable. Direct sun through large glazing is the thing to watch, since it can warm a floor unevenly, so we leave the correct expansion gap at the perimeter to allow for movement." },
    ],
    secondary: {
      heading: "Barkia, and how it relates to vinyl",
      intro: [
        "Barkia is the name most commonly used in Qatar for the click-together plastic flooring sold in wood and stone effects. In practice it is the same family of product as the vinyl and SPC boards above, so if you have been quoted for barkia by one company and vinyl by another, you are usually comparing similar things.",
        "What actually separates a cheap board from a good one is the thickness of the core and the wear layer on top. A thin board over an uneven floor will show every dip and the joints will open up. We quote on the board grade rather than the name it is sold under.",
      ],
      specs: [
        { label: "Also sold as", value: "Barkia, LVT, rigid-core vinyl" },
        { label: "What to compare", value: "Core thickness and wear layer" },
        { label: "Full range", value: "See our Barkia & PVC products" },
      ],
    },
    relatedProductIds: [
      "pvc-barkia",
      "doha-coastal-grey-premium-rigid-core-spc-vinyl",
      "qatar-sand-oak-luxury-waterproof-spc-flooring",
      "skerting-nala-profile",
    ],
    relatedCategorySlugs: ["barkia"],
    relatedServiceSlugs: ["parquet-flooring", "office-carpet"],
    heroImage: "/Products/barkia&pvc/pvc-barkia.webp",
    heroImageAlt:
      "Chevron wood-effect vinyl SPC flooring laid in a dining room with panelled walls",
  },
  {
    slug: "artificial-grass",
    heading: "Artificial Grass & Grass Carpet in Qatar",
    label: "Artificial Grass",
    seoTitle: "Artificial Grass & Grass Carpet in Qatar",
    metaDescription:
      "Artificial grass and grass carpet supplied and laid across Qatar. Villa gardens, roof terraces, majlis surrounds and play areas, fitted with proper drainage.",
    excerpt:
      "Grass carpet for gardens, terraces and play areas, laid over a drained base so it stays flat and drains after rain.",
    intro: [
      "A real lawn in Qatar is a full-time job and a standing water bill. Artificial grass gives the same green without either, and the current generation looks far more convincing than the flat plastic turf people remember, because the blades are cut to different lengths and mixed with a brown thatch at the base.",
      "The part that decides whether it looks good in three years is underneath it. Grass laid straight onto sand moves and dips; grass laid over a properly compacted, free-draining base stays flat and sheds water after rain instead of holding puddles.",
      "We supply and lay artificial grass across Qatar for villa gardens, roof terraces, majlis surrounds, play areas and entrance steps. " + AREAS,
    ],
    offers: [
      "Villa gardens and courtyards",
      "Roof terraces and balconies",
      "Entrance steps and pathways",
      "Children's play areas and nurseries",
      "Majlis and seating area surrounds",
      "Indoor grass carpet for events and displays",
    ],
    includes: [
      "Free on-site measurement and site assessment",
      "Base preparation and compaction",
      "Drainage layer so water does not sit on the surface",
      "Supply, laying, joining and edge fixing",
      "Cutting around trees, planters, steps and drains",
      "Removal of waste and site clean-up",
    ],
    specs: [
      { label: "Pile heights", value: "Short landscape to long garden pile" },
      { label: "Drainage", value: "Perforated backing over a drained base" },
      { label: "UV stability", value: "UV-stabilised for Gulf sunlight" },
      { label: "Suitable for", value: "Gardens, terraces, play areas, steps" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Send us the area", body: "Message us on WhatsApp with photos and rough dimensions, and tell us what is under it now: sand, tile or concrete all change the preparation." },
      { title: "Free survey", body: "We measure, check levels and work out how water will leave the area. On a roof terrace this matters more than anything else." },
      { title: "Quotation", body: "A written quote covering base preparation, grass and fitting, with the pile height agreed so you know what you are getting." },
      { title: "Installation", body: "We prepare and compact the base, lay and join the grass, fix the edges and clear the site." },
    ],
    faqs: [
      { q: "How long does artificial grass last in Qatar?", a: "A UV-stabilised grass over a properly built base holds its colour and shape for many years of Gulf sun. What shortens that life is almost always the base rather than the grass: poor compaction shows as dips and ripples long before the fibres wear out." },
      { q: "Does artificial grass get hot in the sun?", a: "It does warm up in direct sun, like any surface. A lighter grass with a shorter pile runs cooler, shaded areas stay comfortable, and rinsing it down brings the temperature straight back. For play areas in full sun we will talk through pile and colour with you." },
      { q: "How does the water drain away?", a: "The backing is perforated and sits on a compacted free-draining base, so rain and hose water pass through and away rather than pooling on top. On roof terraces and balconies we set the falls to the existing outlets, which is the part that needs surveying properly." },
      { q: "What maintenance does it need?", a: "Very little. Brush the pile occasionally to keep it standing upright, rinse it down to remove dust, and clear leaves from planted areas. There is no mowing, no watering and no fertiliser, which is the main reason people move to it here." },
      { q: "Can you lay grass carpet on a roof or balcony?", a: "Yes, and it is one of the most common jobs we do. The critical part is not blocking the existing drainage outlets, so we survey the falls first and build the base to keep water moving toward them rather than sitting under the grass." },
      { q: "Is it safe for children and pets?", a: "Yes. The grass is non-toxic and drains freely, so it does not hold water. For play areas we can lay a shock-absorbing layer under the grass, and pet waste rinses off the surface rather than soaking in as it would with a real lawn." },
    ],
    relatedProductIds: ["grass-carpet", "artificial-grass-installation-work", "artificial-flowers-grass"],
    relatedCategorySlugs: ["carpet"],
    relatedServiceSlugs: ["event-carpet"],
    heroImage: "/Products/Carpets/Artificial grass installation work.jpeg",
    heroImageAlt:
      "Artificial grass laid over the entrance steps and forecourt of a villa in Qatar",
  },
  {
    slug: "gypsum-c-board-fixing",
    heading: "Gypsum & C-Board Fixing in Qatar",
    label: "Gypsum & C-Board",
    seoTitle: "Gypsum & C-Board Fixing in Qatar",
    metaDescription:
      "Gypsum and C-board fixing across Qatar. False ceilings, partitions, coves and bulkheads built around your lighting and AC, finished ready for paint.",
    excerpt:
      "False ceilings, partitions, coves and bulkheads, set out around the lighting and AC and finished ready for paint.",
    intro: [
      "Most of what makes a ceiling look expensive is board work. The coves that hide the lighting, the recess a linear AC diffuser sits in, the dropped bulkhead that defines a seating area: all of it is gypsum board, cut and fixed on site.",
      "It is also the trade where setting out matters most. Ceilings are read from across the room, so a cove that is a few millimetres out of parallel with the wall is visible from the door. We set out to the finished room rather than to the structure above it, which is not always the same line.",
      "We fix gypsum and C-board across Qatar for villas, apartments, offices and retail, and we coordinate with the electrical and AC trades rather than boarding over their work. " + AREAS,
    ],
    offers: [
      "False and suspended ceilings",
      "Coves, bulkheads and dropped ceiling details",
      "Recesses for linear AC diffusers and track lighting",
      "Partition walls and room divisions",
      "Boxing in for pipework, ducting and columns",
      "Moisture-resistant board for kitchens and wet areas",
    ],
    includes: [
      "Site survey and setting out from finished levels",
      "Framing, board fixing and cutting",
      "Openings formed for lights, diffusers and speakers",
      "Jointing, taping and filling ready for paint",
      "Coordination with the electrical and AC trades",
      "Removal of offcuts and site clean-up",
    ],
    specs: [
      { label: "Board types", value: "Standard, moisture-resistant, fire-rated" },
      { label: "Typical work", value: "Ceilings, coves, bulkheads, partitions" },
      { label: "Finish level", value: "Taped and filled, ready for paint" },
      { label: "Coordination", value: "Set out around lighting and AC" },
      { label: "Service area", value: "All of Qatar" },
    ],
    steps: [
      { title: "Send us the space", body: "Message us on WhatsApp with photos and, if you have them, the lighting and AC layouts. Those drive the ceiling design more than anything else." },
      { title: "Free survey", body: "We visit, check the slab height and existing services, and confirm what drop is realistic once ducting and pipework are allowed for." },
      { title: "Setting out", body: "We agree the cove lines, bulkhead positions and diffuser recesses on site before any framing goes up, because these cannot be moved afterwards." },
      { title: "Fixing and finishing", body: "We frame, board, form the openings, then tape and fill ready for the painter, and clear the site." },
    ],
    faqs: [
      { q: "What is C-board fixing?", a: "It is the on-site fixing of board to a metal or timber frame to form ceilings, partitions and details such as coves and bulkheads. The term is used more or less interchangeably with gypsum board and drywall work in Qatar, and it covers the same scope." },
      { q: "How much ceiling height will a false ceiling take?", a: "It depends on what has to pass above it. A plain flat ceiling can drop as little as 10 centimetres, but a run of AC ducting or a linear diffuser recess needs considerably more. We confirm the realistic drop at the survey rather than promising a figure first." },
      { q: "Can you build the ceiling around the AC and lighting?", a: "That is the normal way we work. We set out the diffuser recesses and light positions before framing, and coordinate with the AC and electrical trades so nothing is boarded over. Retrofitting an opening after the ceiling is finished is far more disruptive." },
      { q: "Which board should be used in a kitchen or bathroom?", a: "Moisture-resistant board in any room that sees steam or splashing, and standard board elsewhere. The cost difference is small next to the cost of taking a ceiling down again, so we specify moisture-resistant wherever there is any doubt." },
      { q: "Do you finish ready for painting?", a: "Yes. We tape, joint and fill so the surface is ready for the painter to prime. We do not paint, but we hand over at a standard where the painter is not fixing our work before they start." },
      { q: "How long does a false ceiling take?", a: "A single room is usually framed and boarded within a few days, with jointing and filling after that. Whole-villa ceilings run to a few weeks and are sequenced room by room so other trades can keep working alongside us." },
    ],
    relatedProductIds: ["gypsum-board-work-design", "cabinet-and-gypsum-board-work", "indoor-wall-panel-design"],
    relatedCategorySlugs: ["interior"],
    relatedServiceSlugs: ["cabinets", "tv-unit-design", "wallpaper"],
    heroImage: "/Products/Interior Design/Gypsum board work design 1.jpeg",
    heroImageAlt:
      "Gypsum false ceiling with coves, recessed track lighting and linear AC diffusers in a Qatar villa",
    gallery: [
      { src: "/Products/Interior Design/Gypsum board work design 2.jpeg", alt: "Gypsum ceiling coves and slot diffuser recesses in a double-height villa entrance" },
      { src: "/Products/Interior Design/Gypsum board work design 3.jpeg", alt: "Dropped gypsum ceiling detail with a linear AC diffuser above a staircase landing" },
      { src: "/Products/Interior Design/Gypsum board work design 4.jpeg", alt: "Gypsum bulkhead and track lighting recesses set out across a villa reception ceiling" },
      { src: "/Products/Interior Design/Gypsum board work design 5.jpeg", alt: "Angular gypsum ceiling frame with concealed lighting and pendant drops" },
    ],
  },
  {
    slug: "sofa-making",
    heading: "Custom Sofa Making in Qatar",
    label: "Sofa Making",
    seoTitle: "Custom Sofa Making in Qatar",
    metaDescription:
      "Sofas and majlis seating made to your room's measurements in Qatar. Your choice of fabric, frame and firmness, built and delivered by our workshop in Doha.",
    excerpt:
      "Sofas and majlis seating built to your room's real dimensions, in the fabric and firmness you choose.",
    intro: [
      "Standard sofas are made for standard rooms, and very few rooms in Qatar are standard. Majlis seating in particular runs along the walls, so shop-bought pieces leave awkward gaps at the corners and stop short of the ends, wasting the floor area the room was designed around.",
      "Making the seating instead of buying it fixes that, and it costs less than people expect. You choose the dimensions, the fabric, the frame and how firm the seat is, and the finished pieces follow the walls exactly.",
      "We make majlis seating, sofas, corner units and daybeds for homes, offices and majlis across Qatar, and we reupholster existing frames that are still sound. " + AREAS,
    ],
    offers: [
      "Traditional floor-level majlis seating",
      "Raised majlis at standard sofa height",
      "Living room sofas and corner units",
      "Office and reception seating",
      "Daybeds, benches and window seats",
      "Reupholstery of existing sofas and majlis",
    ],
    includes: [
      "Free on-site measurement of the room",
      "Fabric selection from samples brought to you",
      "Frame construction and foam to your chosen firmness",
      "Cushions, bolsters and back supports",
      "Delivery and positioning in the room",
      "Removal of old seating where you want it taken",
    ],
    specs: [
      { label: "Made to", value: "Your room's measured dimensions" },
      { label: "Seat firmness", value: "Chosen by you at the sample stage" },
      { label: "Fabrics", value: "Full range, samples brought to site" },
      { label: "Types", value: "Floor-level majlis, raised majlis, sofas" },
      { label: "Also offered", value: "Reupholstery of sound frames" },
    ],
    steps: [
      { title: "Send us the room", body: "Message us on WhatsApp with photos and rough wall lengths, and tell us how many people the seating needs to take." },
      { title: "Free measurement", body: "We visit, measure each wall and bring fabric samples so you can see and feel them in the room's own light rather than in a showroom." },
      { title: "Quotation", body: "A written quote covering frames, foam, fabric and delivery, with the dimensions of each piece confirmed before anything is cut." },
      { title: "Making and delivery", body: "We build in our workshop, then deliver and position the pieces. Typical lead times run to a few weeks depending on the fabric." },
    ],
    faqs: [
      { q: "Is a custom sofa more expensive than buying one?", a: "Not as much as people assume, and for majlis seating it is often cheaper than buying enough standard pieces to fill the same walls. You are paying for materials and labour rather than for a showroom and shipping, and nothing is wasted on gaps that do not fit." },
      { q: "How long does a made-to-measure sofa take?", a: "Usually a few weeks from the confirmed order, and the fabric is normally what sets the pace rather than the frame. If a fabric has to be ordered in, we tell you that at quotation stage instead of after you have committed." },
      { q: "Can I choose how firm the seats are?", a: "Yes, and it is worth taking time over. Majlis seating that people sit on for hours generally wants a firmer foam than a living room sofa people sink into. We bring samples of different densities so you decide by sitting on them, not from a description." },
      { q: "Can you reupholster my existing sofa?", a: "If the frame is sound, yes, and it usually costs less than replacing it. We check the frame and springs first: where the frame itself has gone, reupholstering it is money spent on something that will fail again, and we will say so." },
      { q: "What is the difference between floor-level and raised majlis?", a: "Floor-level seating sits directly on the floor, seats more people along the same wall and is closer to the traditional arrangement. A raised majlis sits at normal sofa height and is easier for older guests to get in and out of. We make both." },
      { q: "Do you take the old seating away?", a: "Yes, if you want it removed. We can take the old pieces on the delivery run so you are not left with them, or leave them if you are keeping or passing them on. Tell us which at the measuring visit." },
    ],
    relatedProductIds: ["luxury-majlis-sofa", "modern-majlis", "khema-majlis-sofa", "majlis-and-cabinets-majlis-sofa"],
    relatedCategorySlugs: ["majlis-sofa"],
    relatedServiceSlugs: ["cabinets"],
    heroImage: "/Products/Furniture/Modern majlis.jpeg",
    heroImageAlt:
      "Custom-made majlis seating running along three walls of a Qatari living room with a matching low table",
  },
  {
    slug: "tv-unit-design",
    heading: "TV Unit Design in Qatar",
    label: "TV Unit Design",
    seoTitle: "TV Unit Design & Wall Decor in Qatar",
    metaDescription:
      "Custom TV units and feature wall decoration in Qatar. Fluted panelling, concealed lighting and cabinetry built to your wall, with the cabling hidden.",
    excerpt:
      "TV feature walls with fluted panelling, concealed lighting and built-in cabinets, with every cable hidden.",
    intro: [
      "The television wall is usually the first thing anyone looks at in a living room, and a screen sitting on a shop-bought stand with cables hanging behind it undoes an otherwise finished room. Building the wall instead solves both problems at once: the screen sits flush in a panelled recess, and the cabling runs inside the construction where nobody sees it.",
      "Most of the units we build combine a few elements: fluted or slatted panelling as a backdrop, a lit recess behind the screen, a run of low cabinets underneath, and display shelving to one side. The proportions are set by your wall and your screen size rather than by a catalogue.",
      "We design and build TV units and feature walls across Qatar, coordinating with the electrical trade so the sockets land where the unit needs them. " + AREAS,
    ],
    offers: [
      "Fluted and slatted wood panel feature walls",
      "Concealed LED lighting behind screens and shelving",
      "Low cabinet runs and floating consoles",
      "Display niches and lit shelving units",
      "Marble, stone-effect and laminate wall finishes",
      "Cable management and concealed power routing",
    ],
    includes: [
      "On-site survey and measurement of the wall",
      "Design proposal with materials and finishes",
      "Manufacture of cabinets and panelling",
      "Installation, fixing and levelling",
      "Concealed cable routing and lighting wiring",
      "Clean-up and removal of packaging",
    ],
    specs: [
      { label: "Built to", value: "Your wall and screen dimensions" },
      { label: "Panel finishes", value: "Fluted wood, laminate, stone effect" },
      { label: "Lighting", value: "Concealed LED, warm or neutral" },
      { label: "Storage", value: "Low cabinets, drawers, display niches" },
      { label: "Cabling", value: "Routed inside the construction" },
    ],
    steps: [
      { title: "Send us the wall", body: "Message us on WhatsApp with a photo of the wall, its width and height, and your screen size. That is enough for a first idea and a rough cost." },
      { title: "Survey and design", body: "We measure the wall, check where the power and aerial points are, and propose a layout with finishes you can see samples of." },
      { title: "Quotation", body: "A written quote covering manufacture, finishes, lighting and installation, with the design agreed before anything is built." },
      { title: "Installation", body: "We fit the panelling and cabinets, route the cabling, wire the lighting and clear the site. Most units are installed in one to two days." },
    ],
    faqs: [
      { q: "How much does a custom TV unit cost in Qatar?", a: "It depends on the wall width and the finishes rather than on a fixed rate. A panelled wall with concealed lighting and a cabinet run costs considerably more than plain panelling alone. We quote after measuring, with the finishes itemised so you can adjust the specification." },
      { q: "Can you hide the cables?", a: "Yes, and it is one of the main reasons to build the wall rather than buy a stand. Power, HDMI and aerial runs are routed inside the panelling and cabinets. Tell us at the survey what will be connected so we allow enough capacity for later additions." },
      { q: "Do I need to move the power socket?", a: "Often the existing socket can be enclosed within the unit, which avoids electrical work altogether. Where the screen position means the socket ends up in the wrong place, we coordinate with an electrician to relocate it before the panelling goes on." },
      { q: "How long does installation take?", a: "The cabinets and panels are made in the workshop first, so the disruption at your home is short: most units are fitted in one to two days. Lead time from order to installation is usually a few weeks, depending on the finishes chosen." },
      { q: "What is fluted panelling?", a: "It is a wall finish made from narrow vertical battens fixed side by side, giving a ribbed surface that catches light and adds depth. It has become the most requested backdrop for TV walls here, and it pairs well with concealed lighting washing down behind the screen." },
      { q: "Can the unit include storage as well?", a: "Yes. Most of what we build includes a low cabinet run under the screen for equipment, plus display shelving or lit niches to one side. Since it is made to measure, the storage is planned around what you actually need to put in it." },
    ],
    relatedProductIds: ["television-decore-with-cabin-box", "indoor-wall-panel-design", "cabin-interior-design", "gypsum-board-work-design"],
    relatedCategorySlugs: ["interior"],
    relatedServiceSlugs: ["cabinets", "gypsum-c-board-fixing", "wallpaper"],
    heroImage: "/Products/Interior Design/Television decore with cabin box 1.jpeg",
    heroImageAlt:
      "Built-in TV unit with fluted dark panelling, a backlit recess and a white cabinet run beneath",
    // Image 2 of this set is deliberately excluded: it is a watermarked 3D
    // render, not a photograph of our own work.
    gallery: [
      { src: "/Products/Interior Design/Television decore with cabin box 3.jpeg", alt: "TV feature wall with a marble-effect panel, gold trim and slatted wood sides" },
      { src: "/Products/Interior Design/Television decore with cabin box 4.jpeg", alt: "Backlit TV panel in oak with lit display shelving and a low cabinet run" },
      { src: "/Products/Interior Design/Television decore with cabin box 5.jpeg", alt: "Light oak TV panel with concealed LED lighting and a floating console" },
      { src: "/Products/Interior Design/Television decore with cabin box 6.jpeg", alt: "Full-height fluted panel TV wall with concealed lighting during installation" },
      { src: "/Products/Interior Design/Television decore with cabin box 7.jpeg", alt: "Fluted panelling and a floating cabinet run being installed on a TV wall" },
      { src: "/Products/Interior Design/Television decore with cabin box 8.jpeg", alt: "TV wall in dark fluted wood with a backlit centre panel and lit display niches" },
      { src: "/Products/Interior Design/Television decore with cabin box 9.jpeg", alt: "Finished TV unit with marble-effect centre panel, walnut shelving and LED plinth lighting" },
    ],
  },
  {
    slug: "cabinets",
    heading: "Custom Cabinets in Qatar",
    label: "Cabinets",
    seoTitle: "Custom Cabinets in Qatar",
    metaDescription:
      "Made-to-measure cabinets in Qatar for kitchens, bedrooms and living rooms. Built to your room's real height and width and installed by our own team in Doha.",
    excerpt:
      "Kitchen, bedroom and living room cabinetry built to your room's real dimensions rather than to standard sizes.",
    intro: [
      "Almost every cabinet problem in a Qatari home comes from the same place: standard carcasses fitted into a room that is not a standard size. You end up with a filler panel at one end, a gap above the units collecting dust, and storage that stops well short of the ceiling.",
      "Making cabinets to the room instead removes all three. The run reaches wall to wall, the units go to full height, and the interior is planned around what is actually being stored rather than around what a catalogue offers.",
      "We design, build and install cabinetry across Qatar for kitchens, bedrooms, living rooms and offices. Whichever room you are starting with, the process below is the same. " + AREAS,
    ],
    offers: [
      "Kitchen cabinets, islands and tall units",
      "Bedroom wardrobes and room cabinets",
      "TV units and living room storage walls",
      "Majlis storage and built-in seating cabinets",
      "Office storage, credenzas and filing units",
      "Full-height cabinetry built into alcoves and corridors",
    ],
    includes: [
      "Free on-site measurement of the room",
      "Layout and interior planning around what you store",
      "Material and finish samples brought to you",
      "Manufacture of carcasses, doors and fronts",
      "Installation, levelling and handle fitting",
      "Removal of packaging and site clean-up",
    ],
    specs: [
      { label: "Made to", value: "Your room's measured height and width" },
      { label: "Rooms", value: "Kitchens, bedrooms, living rooms, offices" },
      { label: "Finishes", value: "Laminate, veneer, matt and gloss" },
      { label: "Interiors", value: "Planned around what you store" },
      { label: "Measurement", value: "Free on-site survey" },
    ],
    steps: [
      { title: "Tell us the room", body: "Message us on WhatsApp with photos and rough dimensions, and say what needs to go inside. Storage contents shape the design more than the elevation does." },
      { title: "Free measurement", body: "We measure the room properly, including how far out of square the walls run, which is what decides whether a run fits wall to wall." },
      { title: "Design and quotation", body: "We propose a layout with finishes you can see samples of, then quote in writing with the interior fit-out itemised." },
      { title: "Manufacture and installation", body: "Built in our workshop, then delivered and installed. Most rooms are fitted within a day or two once manufacture is complete." },
    ],
    faqs: [
      { q: "What is the difference between fitted and freestanding cabinets?", a: "Fitted cabinetry is built into the room and scribed to the walls, so it reaches full height and leaves no gaps. Freestanding units can be taken with you when you move but lose the space above and beside them. In most Qatari villas, fitted storage gains a substantial amount of usable volume." },
      { q: "How long do custom cabinets take?", a: "Usually a few weeks from confirmed design to installation, with manufacture accounting for most of that. The fitting itself is quick: most single rooms are installed within a day or two, so disruption at home is short." },
      { q: "Can cabinets be built to the ceiling?", a: "Yes, and we would normally recommend it. The gap above standard-height units is wasted storage and collects dust. Building to the ceiling adds a full extra shelf for the items you reach for once or twice a year." },
      { q: "Do you handle the room's walls being out of square?", a: "Yes, and it is the main reason to measure rather than order standard sizes. We scribe the end panels to the wall so the run finishes tight against it. Standard carcasses cannot do this, which is why they need filler strips." },
      { q: "Which finishes work best in Qatar's humidity?", a: "Moisture-resistant board with a good edge seal is the important part, more than the visible finish. In kitchens and bathrooms we specify moisture-resistant carcasses as standard, because it is the exposed board edges rather than the door faces that fail first." },
      { q: "Do you make kitchen and bedroom cabinets as well?", a: "Yes, both, and they are covered in more detail on their own pages. This page is the overview; see our kitchen cabinets page for kitchens specifically, and our wardrobes page for bedroom and room cabinets." },
    ],
    relatedProductIds: ["cabinet-and-gypsum-board-work", "cabin-interior-design", "majlis-and-cabinets-majlis-sofa", "television-decore-with-cabin-box"],
    relatedCategorySlugs: ["interior", "majlis-sofa"],
    relatedServiceSlugs: ["kitchen-cabinets", "wardrobes", "tv-unit-design"],
    heroImage: "/Products/Interior Design/Cabinet and gypsum board work 1.jpeg",
    heroImageAlt:
      "Full-height flush oak-veneer cabinetry running wall to wall under a coved gypsum ceiling",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
