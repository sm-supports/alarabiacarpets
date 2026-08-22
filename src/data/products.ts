export interface ProductMedia {
  type: 'image' | 'video';
  src: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFaq {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  imageSrc: string;
  media: ProductMedia[];
  whatsappLink: string;

  // --- Optional SEO / content fields ---
  // Products without these fall back to the generic copy above, so the catalog
  // can be enriched incrementally rather than all 43 at once.

  /** Multi-paragraph body copy shown under the short description. */
  longDescription?: string[];
  /** Rendered as a specs table and useful for AI Overview extraction. */
  specs?: ProductSpec[];
  /** Rendered as <details> elements and emitted as FAQPage JSON-LD. */
  faqs?: ProductFaq[];
  /** Overrides the generated <title>. Keep under 60 characters. */
  seoTitle?: string;
  /** Overrides the generated meta description. Aim for 150-160 characters. */
  metaDescription?: string;
  /** Descriptive alt text; falls back to the product name. */
  imageAlt?: string;

  /**
   * Starting price in QAR. Drives the AggregateOffer in Product JSON-LD.
   * When absent the offer is omitted entirely -- a Product without offers is
   * valid schema.org, whereas the old price-less Offer was not.
   */
  priceFrom?: number;
  priceTo?: number;
  /** e.g. "per sqm", "per piece" -- display only. */
  priceUnit?: string;
}

/**
 * Real product SKUs only.
 *
 * The six category hubs (carpet, barkia, curtain, sofa, majlis-sofa, interior)
 * were moved to src/data/categories.ts and are now landing pages at the same
 * URLs. Do not re-add them: /products/sofa in particular must NOT emit a file,
 * or its 301 in public/_redirects stops firing (Pages serves a matching static
 * asset before consulting redirects).
 *
 * Removing any other id from this array deletes an indexed URL. Pair it with a
 * 301 in public/_redirects or it becomes a hard 404.
 */
export const products: Product[] = [
  {
    "id": "artificial-flowers-grass",
    "name": "Artificial flowers grass",
    "category": "carpet",
    "description": "Artificial green and flower walls for interiors, backdrops and event styling.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Artificial flowers grass 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Artificial flowers grass.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Artificial flowers grass 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Artificial%20flowers%20grass",
    seoTitle: "Artificial Green & Flower Walls in Qatar",
    metaDescription: "Artificial flower and green walls in Qatar. Vertical foliage panels for feature walls, receptions, backdrops and events. Installed across Doha.",
    imageAlt: "Artificial flower and green wall panel installed as a feature wall in Doha",
    longDescription: [
      "This is greenery for walls, not for floors. Foliage and flower panels build up into a vertical surface used behind reception desks, as a feature wall in a majlis or caf\u00e9, and as a photo backdrop for events \u2014 the look of a planted wall with none of the irrigation, drainage or light a living one demands.",
      "Panels are built up on site so the coverage reads as continuous rather than tiled, and flower clusters are distributed by hand. Mixing tones matters: a single flat green over a large area is the thing that makes an artificial wall look artificial.",
    ],
    specs: [
      {
        label: "Application",
        value: "Vertical walls and backdrops",
      },
      {
        label: "Best for",
        value: "Receptions, feature walls, events",
      },
      {
        label: "Build-up",
        value: "Panels blended on site, seams disguised",
      },
      {
        label: "Maintenance",
        value: "Occasional dusting",
      },
      {
        label: "Indoor / outdoor",
        value: "Both, UV-stable options for outdoors",
      },
    ],
    faqs: [
      {
        q: "How is a green wall different from artificial grass?",
        a: "Different product and different job. Grass is a floor covering laid flat for gardens and terraces; a green wall is foliage and flower panels built up vertically as decoration. For lawns and terraces see our artificial grass carpet instead.",
      },
      {
        q: "Does an artificial green wall look fake?",
        a: "It does if it is a single flat green tiled across the wall. We mix foliage tones and distribute flower clusters by hand, and disguise the panel seams during build-up, which is what stops it reading as a repeating pattern.",
      },
      {
        q: "How do you maintain it?",
        a: "Dust it occasionally \u2014 a soft brush or a vacuum on low suction. There is no watering, feeding or light requirement, which is the whole reason to choose it over a living wall indoors.",
      },
    ]
  },
  {
    "id": "artificial-grass-installation-work",
    "name": "Artificial grass installation work",
    "category": "carpet",
    "description": "Professional artificial grass installation with proper base preparation and drainage.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "video",
        "src": "/Products/Carpets/Artificial grass installation work vid 1.mp4"
      },
      {
        "type": "video",
        "src": "/Products/Carpets/Artificial grass installation work vid 2.mp4"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Artificial grass installation work.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Artificial grass installation work.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Artificial%20grass%20installation%20work",
    seoTitle: "Artificial Grass Installation Qatar | Doha Fitting",
    metaDescription: "Professional artificial grass installation across Qatar. Base preparation, drainage and seam-free finishing for gardens, terraces and play areas in Doha.",
    imageAlt: "Artificial grass installation in progress on a Doha garden",
    longDescription: [
      "How artificial grass is installed matters as much as the grass itself. A poorly prepared base leads to visible seams, dips and water sitting on the surface.",
      "Our installers prepare and level the base, lay a free-draining sub-layer, join the grass so seams are not visible, and secure and trim the edges. We install on gardens, terraces, balconies, play areas and pool surrounds throughout Qatar.",
    ],
    specs: [
      {
        label: "Includes",
        value: "Base preparation and levelling",
      },
      {
        label: "Drainage",
        value: "Free-draining sub-layer",
      },
      {
        label: "Seams",
        value: "Joined to be visually seamless",
      },
      {
        label: "Areas",
        value: "Gardens, terraces, pool surrounds",
      },
    ],
    faqs: [
      {
        q: "What does artificial grass installation involve?",
        a: "We clear and level the area, lay a free-draining base, roll out and join the grass so the seams are not visible, then secure and trim the edges.",
      },
      {
        q: "Will water drain away properly?",
        a: "Yes. The grass has a perforated backing and sits on a free-draining base, so rain and hose water pass through instead of pooling on the surface.",
      },
    ]
  },
  {
    "id": "event-normal-carpet",
    "name": "Event Carpet",
    "category": "carpet",
    "description": "Event and exhibition carpet supplied and laid for short-term use, then lifted.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Event:normal carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Event:normal carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Event%20Carpet",
    seoTitle: "Event Carpet Hire & Supply in Qatar | Doha",
    metaDescription: "Event and exhibition carpet in Qatar. Fast supply and laying for conferences, weddings and stands, lifted and cleared afterwards. Doha-based.",
    imageAlt: "Event carpet laid for an exhibition stand in Doha, Qatar",
    longDescription: [
      "Event carpet is judged on turnaround, not on lifespan. A stand build, a conference hall or a wedding venue needs covering to a deadline, looking sharp for a few days, and clearing again without leaving marks on the floor underneath.",
      "We supply and lay for exhibitions, conferences, weddings and openings across Qatar, working to the venue's access window \u2014 which for most halls in Doha means overnight or early morning. Lifting and disposal afterwards is part of the job.",
    ],
    specs: [
      {
        label: "Best for",
        value: "Exhibitions, conferences, weddings",
      },
      {
        label: "Turnaround",
        value: "Short lead time, deadline-driven",
      },
      {
        label: "Fitting window",
        value: "Overnight and early morning available",
      },
      {
        label: "Afterwards",
        value: "Lifted and cleared",
      },
      {
        label: "Floor protection",
        value: "Laid without marking the sub-floor",
      },
    ],
    faqs: [
      {
        q: "How quickly can event carpet be laid?",
        a: "Usually within the venue's access window, which for most Doha halls means overnight or early morning before the build starts. Tell us the deadline and the area and we will confirm whether it is achievable before you commit.",
      },
      {
        q: "Do you lift the carpet after the event?",
        a: "Yes, lifting and disposal are included. It is worth agreeing the removal slot at the same time as the install, because venues usually give a tighter window for the break-down than the build.",
      },
      {
        q: "Will it damage the floor underneath?",
        a: "No. It is laid so it can be lifted cleanly and does not mark the sub-floor, which matters in a venue with polished or finished flooring and a deposit attached to it.",
      },
    ]
  },
  {
    "id": "home-design-luxury-carpet",
    "name": "Home design luxury carpet",
    "category": "carpet",
    "description": "Made-to-measure rugs and carpet cut to your room's shape, colour and border.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Home design luxury carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Home design luxury carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Home%20design%20luxury%20carpet",
    seoTitle: "Custom Made-to-Measure Rugs in Qatar | Doha",
    metaDescription: "Custom rugs made to measure in Qatar. Any size or shape, with bound or braided borders, matched to your majlis or living room. Delivered in Doha.",
    imageAlt: "Custom made-to-measure rug with a bound border in a Qatari majlis",
    longDescription: [
      "A made-to-measure rug solves what a standard size cannot: seating that does not sit on a 2\u00d73 metre rectangle, an L-shaped majlis, a round dining table, or a room where the rug should stop short of the walls by a specific margin.",
      "We cut to your dimensions and finish the edge \u2014 bound, braided or with a contrast border \u2014 and can match a colour to fabric you already own. Bring the cushion or a photo of the seating and we will work from it.",
    ],
    specs: [
      {
        label: "Sizing",
        value: "Any size, cut to your room",
      },
      {
        label: "Shapes",
        value: "Rectangular, round, L-shaped, bespoke",
      },
      {
        label: "Edge finish",
        value: "Bound, braided or contrast border",
      },
      {
        label: "Colour matching",
        value: "Matched to existing fabric",
      },
      {
        label: "Delivery",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "What size should a majlis rug be?",
        a: "Large enough that the front feet of all the seating sit on it \u2014 that is what visually ties the arrangement together. A rug floating in the middle with every piece off it makes the room look smaller, which is the usual problem with a standard size.",
      },
      {
        q: "Can you match a rug to my existing furniture?",
        a: "Yes. Bring a cushion, an offcut of the fabric or a clear photo in daylight, and we will match the colour. Judging a match from a phone screen alone is unreliable, so we prefer something physical.",
      },
      {
        q: "Can you make a round or L-shaped rug?",
        a: "Yes. Round rugs under dining tables and L-shapes for corner majlis seating are both common. The edge finishing takes longer on a curve, which is reflected in the quote.",
      },
    ]
  },
  {
    "id": "luxury-home-carpet",
    "name": "Luxury home carpet",
    "category": "carpet",
    "description": "Premium wall-to-wall carpet for bedrooms and majlis, with denser pile and better recovery.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Luxury home carpet 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Luxury home carpet 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Luxury home carpet 3.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Luxury home carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Luxury home carpet 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Luxury%20home%20carpet",
    seoTitle: "Luxury Wall-to-Wall Carpet in Qatar | Doha",
    metaDescription: "Luxury wall-to-wall carpet in Qatar. Denser pile with better recovery underfoot for bedrooms and majlis. Measured and fitted across Doha.",
    imageAlt: "Luxury wall-to-wall carpet fitted in a Doha bedroom",
    longDescription: [
      "What you pay for in a premium carpet is density and recovery. More fibre packed into the same area means footprints and furniture dents lift out instead of setting in, and the surface still looks even after a year of use rather than showing tracks through the doorways.",
      "It is worth the money in rooms where you notice underfoot comfort \u2014 bedrooms and majlis \u2014 and much less so in a hallway, where a hard-wearing mid-range carpet does the same job for less.",
    ],
    specs: [
      {
        label: "Format",
        value: "Wall-to-wall broadloom",
      },
      {
        label: "Pile",
        value: "High density, good recovery",
      },
      {
        label: "Best for",
        value: "Bedrooms and majlis",
      },
      {
        label: "Underlay",
        value: "Recommended, quoted with the carpet",
      },
      {
        label: "Fitting",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "What actually makes one carpet better than another?",
        a: "Density more than anything. Press your thumb in \u2014 if you feel the backing easily, the pile is sparse and it will flatten along traffic routes. A dense pile springs back and keeps an even appearance far longer.",
      },
      {
        q: "Where is a luxury carpet worth it?",
        a: "Bedrooms and majlis, where you are barefoot and notice the difference underfoot. In a hallway the traffic is the dominant factor, so a hard-wearing mid-range carpet is usually the more sensible spend.",
      },
      {
        q: "Do I need underlay?",
        a: "For a wall-to-wall carpet, yes. It adds comfort, absorbs sound and \u2014 the part people underestimate \u2014 protects the pile from below, which measurably extends how long the carpet keeps its appearance.",
      },
    ]
  },
  {
    "id": "mosjid-mosque-carpet-installation",
    "name": "Masjid & Mosque Carpet Installation",
    "category": "carpet",
    "description": "Mosque carpet installation: qiblah alignment, row setting out and phased fitting.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Mosjid:mosque carpet installation 0.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Mosjid:mosque carpet installation 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Carpets/Mosjid:mosque carpet installation 2.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Mosjid:mosque carpet installation 0.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Masjid%20%26%20Mosque%20Carpet%20Installation",
    seoTitle: "Mosque Carpet Installation Qatar | Qiblah Set",
    metaDescription: "Mosque and masjid carpet installation across Qatar. Rows set true to the qiblah, work phased around prayer times, minimal disruption in Doha.",
    imageAlt: "Mosque carpet installation with prayer rows being set to the qiblah in Qatar",
    longDescription: [
      "Fitting a prayer hall is a setting-out job before it is a carpet job. The saff rows have to run true to the qiblah, not to the walls \u2014 and in most buildings those are not the same line. Get the first row wrong and the error is repeated and magnified across every row behind it.",
      "We establish the qiblah on site, set the first row from it, and work outward. The second constraint is time: a prayer hall stays in use, so we phase the work around prayer times and hand back sections progressively rather than closing the hall.",
    ],
    specs: [
      {
        label: "Setting out",
        value: "First row established from the qiblah",
      },
      {
        label: "Scheduling",
        value: "Phased around prayer times",
      },
      {
        label: "Handover",
        value: "Section by section, hall stays usable",
      },
      {
        label: "Includes",
        value: "Old carpet lifted and removed",
      },
      {
        label: "Service area",
        value: "All of Qatar",
      },
    ],
    faqs: [
      {
        q: "How do you align prayer rows to the qiblah?",
        a: "We establish the qiblah direction on site and set the first row from it, then work outward. Rows are aligned to that line rather than to the walls, because in most buildings the two differ and aligning to the wall puts every row slightly off.",
      },
      {
        q: "Does the mosque have to close during installation?",
        a: "No. We phase the work around prayer times and hand back sections as they are completed, so the hall stays usable throughout. Larger halls are scheduled over several days on that basis.",
      },
      {
        q: "Do you remove the old carpet?",
        a: "Yes, lifting and disposing of the existing carpet is included. We also check the sub-floor once it is exposed and flag anything that needs attention before the new carpet goes down.",
      },
    ]
  },
  {
    "id": "mosque-masjid-carpet",
    "name": "Mosque & Masjid Carpet",
    "category": "carpet",
    "description": "Prayer-row and plain mosque carpet, aligned to the qiblah and fitted across Qatar.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Mosque:masjid carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Mosque:masjid carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Mosque%20%26%20Masjid%20Carpet",
    seoTitle: "Mosque & Masjid Carpet Qatar | Supply & Fitting",
    metaDescription: "Mosque and masjid carpet supplied and installed across Qatar. Prayer-row designs, heavy-duty pile for high footfall, and full fitting by Al Arabia Carpets in Doha.",
    imageAlt: "Mosque prayer hall carpet with prayer rows installed in Qatar",
    longDescription: [
      "We supply and install prayer-hall carpet for mosques and masjids across Qatar, in both plain and prayer-row (saff) designs that keep rows straight and evenly spaced.",
      "Mosque carpet takes very heavy foot traffic, so we specify a dense, hard-wearing pile that holds its appearance and is straightforward to vacuum. We handle measuring, alignment of the rows toward the qiblah, cutting and fitting.",
    ],
    specs: [
      {
        label: "Designs",
        value: "Prayer-row (saff) and plain",
      },
      {
        label: "Pile",
        value: "Dense, heavy-traffic specification",
      },
      {
        label: "Row alignment",
        value: "Set to the qiblah on site",
      },
      {
        label: "Installation",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "Do you supply prayer-row mosque carpet?",
        a: "Yes. We supply saff (prayer-row) carpet as well as plain prayer-hall carpet, and we align the rows to the qiblah during installation.",
      },
      {
        q: "Is mosque carpet suitable for very high foot traffic?",
        a: "The carpet we specify for mosques uses a dense, hard-wearing pile chosen for heavy daily use, so it resists flattening and stays easy to vacuum.",
      },
      {
        q: "Can you carpet a full prayer hall?",
        a: "Yes. We measure the hall, plan the layout so rows run true across the full width, and complete the fitting to a schedule that works around prayer times.",
      },
    ]
  },
  {
    "id": "pvc-gym-mat-indoor-game-mat",
    "name": "PVC Gym Mat & Indoor Game Mat",
    "category": "carpet",
    "description": "PVC matting for gyms and play areas \u2014 shock absorbing, non-slip and wipe-clean.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/PVC gym mat:indoor game mat.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/PVC gym mat:indoor game mat.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20PVC%20Gym%20Mat%20%26%20Indoor%20Game%20Mat",
    seoTitle: "Gym & Play Area Matting in Qatar | PVC Flooring",
    metaDescription: "PVC gym and indoor play matting in Qatar. Shock-absorbing, non-slip and wipe-clean flooring for home gyms and play areas. Fitted in Doha.",
    imageAlt: "PVC gym matting installed in a home gym in Doha",
    longDescription: [
      "Gym matting is doing two jobs at once: protecting the floor beneath from dropped weights, and protecting joints from the impact of the floor. A tiled slab does neither, and in a villa gym the noise carries through the structure to the rooms below.",
      "The same material works for indoor play areas, where the priority shifts to cushioning falls and surviving being wiped down constantly. It is non-slip underfoot and cleans with a mop.",
    ],
    specs: [
      {
        label: "Best for",
        value: "Home gyms, play areas, activity rooms",
      },
      {
        label: "Impact",
        value: "Shock absorbing, protects the sub-floor",
      },
      {
        label: "Surface",
        value: "Non-slip",
      },
      {
        label: "Cleaning",
        value: "Wipe or mop clean",
      },
      {
        label: "Noise",
        value: "Reduces impact noise to rooms below",
      },
    ],
    faqs: [
      {
        q: "Will gym matting protect the floor from dropped weights?",
        a: "That is the main reason to fit it. Dropped plates crack tile and dent most hard floors. The matting absorbs the impact, and it also cuts the noise transmitted through the slab to rooms underneath, which matters in a villa.",
      },
      {
        q: "Is it suitable for a children's play area?",
        a: "Yes, and it is a common use. It cushions falls, it is non-slip, and it wipes clean \u2014 which for a play area matters more than anything else about it.",
      },
      {
        q: "How do you clean it?",
        a: "A mop and mild detergent. Avoid solvent cleaners, which can soften the surface over time. In a gym, wiping down after sessions also stops sweat marking the material.",
      },
    ]
  },
  {
    "id": "tiles-carpet-office-carpet",
    "name": "Carpet Tiles & Office Carpet",
    "category": "carpet",
    "description": "Modular office carpet tiles, hard-wearing and individually replaceable.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Tiles carpet:office carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Tiles carpet:office carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Carpet%20Tiles%20%26%20Office%20Carpet",
    seoTitle: "Office Carpet Tiles Qatar | Supply & Installation",
    metaDescription: "Office carpet tiles supplied and fitted across Qatar. Hard-wearing, individually replaceable, and installed with minimal disruption to your workplace in Doha.",
    imageAlt: "Office carpet tiles installed in a commercial workspace in Doha",
    longDescription: [
      "Carpet tiles are the practical choice for offices: they are hard-wearing, quick to lay, and any tile that becomes stained or damaged can be lifted and swapped without redoing the whole floor.",
      "We install office carpet across Qatar and can work outside business hours so your workplace keeps running. Tiles also lift easily for access to under-floor cabling.",
    ],
    specs: [
      {
        label: "Format",
        value: "Modular carpet tiles",
      },
      {
        label: "Best for",
        value: "Offices, meeting rooms, commercial",
      },
      {
        label: "Repairs",
        value: "Individual tiles replaceable",
      },
      {
        label: "Cable access",
        value: "Tiles lift for under-floor access",
      },
      {
        label: "Scheduling",
        value: "Out-of-hours fitting available",
      },
    ],
    faqs: [
      {
        q: "Why choose carpet tiles for an office?",
        a: "Tiles wear well under office traffic, and a damaged or stained tile can be replaced individually instead of relaying the whole floor. They also lift easily for access to under-floor cabling.",
      },
      {
        q: "Can you install office carpet outside working hours?",
        a: "Yes. We regularly schedule commercial installations in the evening or over a weekend so the workplace is not disrupted.",
      },
    ]
  },
  {
    "id": "grass-carpet",
    "name": "Artificial Grass Carpet",
    "category": "carpet",
    "description": "UV-stable artificial grass for gardens, terraces and play areas, installed in Doha.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/grass-carpet.webp"
      }
    ],
    "imageSrc": "/Products/Carpets/grass-carpet.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Artificial%20Grass%20Carpet",
    seoTitle: "Artificial Grass Carpet Qatar | Supply & Fitting",
    metaDescription: "Artificial grass carpet in Qatar for gardens, terraces, balconies and play areas. UV-stable, drains freely, and installed across Doha with delivery included.",
    imageAlt: "Artificial grass carpet laid on a Doha terrace by Al Arabia Carpets",
    longDescription: [
      "Artificial grass gives you a green surface all year round without irrigation, mowing or fertiliser, which makes it well suited to Qatar's climate. We install it on gardens, roof terraces, balconies, play areas and around pools.",
      "Our grass is UV-stabilised so it holds its colour under strong sun, and it is laid over a free-draining base so rain and hose water pass straight through rather than pooling.",
    ],
    specs: [
      {
        label: "Best for",
        value: "Gardens, terraces, balconies, play areas",
      },
      {
        label: "UV stability",
        value: "UV-stabilised for Gulf sun",
      },
      {
        label: "Drainage",
        value: "Free-draining backing",
      },
      {
        label: "Maintenance",
        value: "Occasional rinse and brush",
      },
      {
        label: "Installation",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "Does artificial grass fade in Qatar's sun?",
        a: "Our artificial grass is UV-stabilised specifically for Gulf conditions, so it holds its colour far longer than non-stabilised alternatives. We can show you samples that have been in service outdoors.",
      },
      {
        q: "How do you maintain artificial grass?",
        a: "Rinse it with a hose from time to time and brush the pile upright in high-traffic spots. There is no mowing, watering or fertilising.",
      },
      {
        q: "Can artificial grass be laid on a roof terrace or balcony?",
        a: "Yes. It is a common installation in Doha. We fit it over a free-draining base so water passes through to the existing drainage.",
      },
    ]
  },
  {
    "id": "home-curtains",
    "name": "Home curtains",
    "category": "curtains",
    "description": "Custom curtains for villas and apartments, measured, made and fitted in Doha.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Curtain/Home curtains 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Curtain/Home curtains 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Curtain/Home curtains 3.jpeg"
      }
    ],
    "imageSrc": "/Products/Curtain/Home curtains 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Home%20curtains",
    seoTitle: "Home Curtains Qatar | Custom Made for Villas",
    metaDescription: "Custom home curtains in Qatar for villas and apartments. Blackout and sheer options, measured, made and fitted across Doha by Al Arabia Carpets.",
    imageAlt: "Custom home curtains in a Qatari villa living room",
    longDescription: [
      "Home curtains are made to your window measurements and to the look of the room, whether that is a full lined drape for a majlis or something lighter for a bedroom.",
      "We visit with fabric samples, measure each window, and return to fit the finished curtains together with the track or pole.",
    ],
    specs: [
      {
        label: "Made to measure",
        value: "Every window measured on site",
      },
      {
        label: "Options",
        value: "Blackout, sheer, lined",
      },
      {
        label: "Suitable for",
        value: "Villas and apartments",
      },
      {
        label: "Installation",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "Do you bring fabric samples to the house?",
        a: "Yes. We bring samples so you can judge colour and weight in your own lighting, and we measure the windows during the same visit.",
      },
      {
        q: "Do you supply the curtain tracks as well?",
        a: "Yes, we supply and fit tracks and poles, including double tracks where you want sheers layered under blackout curtains.",
      },
    ]
  },
  {
    "id": "office-blind-office-roller-vertical-blinds",
    "name": "Office Roller & Vertical Blinds",
    "category": "curtains",
    "description": "Vertical and roller blinds for offices, controlling glare without darkening the space.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Curtain/Office blind:office roller:vertical blinds 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Curtain/Office blind:office roller:vertical blinds 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Curtain/Office blind:office roller:vertical blinds.jpeg"
      }
    ],
    "imageSrc": "/Products/Curtain/Office blind:office roller:vertical blinds 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Office%20Roller%20%26%20Vertical%20Blinds",
    seoTitle: "Office Blinds Qatar | Roller & Vertical Blinds",
    metaDescription: "Office roller and vertical blinds in Qatar. Glare control for workstations and meeting rooms, made to measure and fitted across Doha, out of hours if needed.",
    imageAlt: "Vertical and roller blinds fitted in a Doha office",
    longDescription: [
      "Office blinds are mainly about controlling glare on screens while keeping the space bright. We supply both vertical blinds, which suit wide window runs and let you angle the light, and roller blinds in sunscreen fabric.",
      "Every blind is made to measure and fitted by our team. Commercial installations can be scheduled out of hours so your office keeps working.",
    ],
    specs: [
      {
        label: "Types",
        value: "Vertical and roller blinds",
      },
      {
        label: "Fabrics",
        value: "Sunscreen and blackout",
      },
      {
        label: "Best for",
        value: "Workstations, meeting rooms",
      },
      {
        label: "Scheduling",
        value: "Out-of-hours fitting available",
      },
    ],
    faqs: [
      {
        q: "Which blinds are best for reducing screen glare?",
        a: "Sunscreen roller blinds or vertical blinds both work well. Verticals let you angle the slats to block low sun across a wide window run, while sunscreen rollers cut glare evenly and keep the view.",
      },
      {
        q: "Can you fit office blinds outside business hours?",
        a: "Yes. We regularly schedule commercial fitting in the evening or at a weekend so the workplace is not disrupted.",
      },
    ]
  },
  {
    "id": "roller",
    "name": "Roller Blinds",
    "category": "curtains",
    "description": "Made-to-measure roller blinds in blackout and sunscreen fabrics for homes and offices.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Curtain/roller.webp"
      }
    ],
    "imageSrc": "/Products/Curtain/roller.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Roller%20Blinds",
    seoTitle: "Roller Blinds Qatar | Made to Measure & Fitted",
    metaDescription: "Roller blinds in Qatar made to measure. Blackout and sunscreen fabrics for homes and offices, with free measurement and installation across Doha.",
    imageAlt: "Made-to-measure roller blinds fitted in a Doha office",
    longDescription: [
      "Roller blinds give a clean, uncluttered window in a minimum of space, which makes them a good fit for offices, kitchens and modern interiors where full curtains would be too heavy.",
      "We make each blind to your window measurements in either blackout or sunscreen fabric, and fit it inside or outside the reveal depending on the window. Measurement and installation are included.",
    ],
    specs: [
      {
        label: "Made to measure",
        value: "Cut to your window sizes",
      },
      {
        label: "Fabrics",
        value: "Blackout and sunscreen",
      },
      {
        label: "Mounting",
        value: "Inside or outside the reveal",
      },
      {
        label: "Best for",
        value: "Offices, kitchens, modern interiors",
      },
      {
        label: "Installation",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "What is the difference between blackout and sunscreen roller blinds?",
        a: "Blackout fabric blocks light almost entirely, which suits bedrooms. Sunscreen fabric cuts glare and heat while still letting you see out, which suits offices and living areas.",
      },
      {
        q: "Do you make roller blinds to measure?",
        a: "Yes, every blind is made to your window measurements and fitted by our team. We take the measurements ourselves so the sizing is right.",
      },
    ]
  },
  {
    "id": "khema-majlis-sofa",
    "name": "Khema majlis sofa",
    "category": "furniture",
    "description": "Premium Khema majlis sofa for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Furniture/Khema majlis sofa 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Furniture/Khema majlis sofa 2.jpeg"
      }
    ],
    "imageSrc": "/Products/Furniture/Khema majlis sofa 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Khema%20majlis%20sofa"
  },
  {
    "id": "luxury-majlis-sofa",
    "name": "Luxury majlis sofa",
    "category": "furniture",
    "description": "Premium majlis seating with heavier fabrics, deeper cushioning and detailed finishing.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "video",
        "src": "/Products/Furniture/Luxury majlis sofa vid 1.mp4"
      },
      {
        "type": "video",
        "src": "/Products/Furniture/Luxury majlis sofa vid 2.mp4"
      }
    ],
    "imageSrc": "/Products/Furniture/Luxury majlis sofa vid 1.mp4",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Luxury%20majlis%20sofa",
    seoTitle: "Luxury Majlis Sofa Qatar | Custom Made Seating",
    metaDescription: "Luxury majlis sofas custom made in Qatar. Premium fabrics, detailed finishing and seating sized to your majlis, with delivery included across Doha.",
    imageAlt: "Luxury majlis sofa with premium upholstery in a Qatari majlis",
    longDescription: [
      "Our luxury majlis seating uses heavier premium fabrics, deeper cushioning and more detailed finishing than the standard range, for a majlis intended to receive guests.",
      "Every piece is sized to your room and upholstered to your selection. We measure on site, bring samples, and deliver and position the finished seating anywhere in Qatar.",
    ],
    specs: [
      {
        label: "Made to measure",
        value: "Sized to your majlis",
      },
      {
        label: "Fabric",
        value: "Premium range",
      },
      {
        label: "Finishing",
        value: "Detailed trim and edging",
      },
      {
        label: "Delivery",
        value: "Included across Qatar",
      },
    ],
    faqs: [
      {
        q: "What makes the luxury range different?",
        a: "It uses heavier premium fabrics, deeper and firmer cushioning, and more detailed finishing on the trim and edging than our standard majlis seating.",
      },
      {
        q: "Do you measure the majlis before quoting?",
        a: "Yes. We measure on site so the seating runs cleanly along your walls, and we bring fabric samples at the same visit.",
      },
    ]
  },
  {
    "id": "majlis-and-cabinets-majlis-sofa",
    "name": "Majlis Sofa & Cabinets",
    "category": "furniture",
    "description": "Premium Majlis and cabinets:majlis sofa for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "video",
        "src": "/Products/Furniture/Majlis and cabinets:majlis sofa vid.mp4"
      },
      {
        "type": "image",
        "src": "/Products/Furniture/Majlis and cabinets:majlis sofa 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Furniture/Majlis and cabinets:majlis sofa.jpeg"
      }
    ],
    "imageSrc": "/Products/Furniture/Majlis and cabinets:majlis sofa 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Majlis%20Sofa%20%26%20Cabinets"
  },
  {
    "id": "modern-majlis",
    "name": "Modern majlis",
    "category": "furniture",
    "description": "Premium Modern majlis for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Furniture/Modern majlis 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Furniture/Modern majlis 3.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Furniture/Modern majlis.jpeg"
      }
    ],
    "imageSrc": "/Products/Furniture/Modern majlis 2.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Modern%20majlis"
  },
  {
    "id": "cabin-interior-design",
    "name": "Cabin interior design",
    "category": "interior",
    "description": "Full room fit-out delivered as one project \u2014 ceilings, panelling, joinery and finishes.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "video",
        "src": "/Products/Interior Design/Cabin interior design Vid.mp4"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabin interior design 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabin interior design 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabin interior design 3.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabin interior design.jpeg"
      }
    ],
    "imageSrc": "/Products/Interior Design/Cabin interior design 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Cabin%20interior%20design",
    seoTitle: "Room Fit-Out & Interior Design in Qatar",
    metaDescription: "Complete room fit-out in Qatar. Ceilings, panelling, joinery, flooring and furnishing designed and delivered as one project across Doha.",
    imageAlt: "Completed interior fit-out with panelling and integrated joinery in Doha",
    longDescription: [
      "Where the other interior listings cover one element, this is the whole room handled end to end: ceiling, walls, joinery, flooring and furnishing sequenced by one team against one drawing.",
      "The advantage is sequencing. A fit-out goes wrong at the handovers \u2014 flooring laid before the joinery is scribed, lighting positions fixed before the ceiling design is settled. Running it as a single project means those decisions are made in the right order and nobody is waiting on anybody.",
    ],
    specs: [
      {
        label: "Scope",
        value: "Complete room, design to handover",
      },
      {
        label: "Includes",
        value: "Ceilings, panelling, joinery, flooring",
      },
      {
        label: "Also supplied",
        value: "Curtains and furniture from our ranges",
      },
      {
        label: "Management",
        value: "One team, one sequence",
      },
      {
        label: "Consultation",
        value: "Free, on site in Doha",
      },
    ],
    faqs: [
      {
        q: "What is the advantage of one contractor for a fit-out?",
        a: "Sequencing. Most fit-out problems happen at the handover between trades \u2014 a floor laid before the joinery is scribed to it, or lighting fixed before the ceiling is designed. One team working to one drawing puts those decisions in the right order.",
      },
      {
        q: "Can you work room by room?",
        a: "Yes, and for an occupied home it is usually the sensible approach. We complete one room fully before opening the next, so the house stays liveable rather than becoming a site throughout.",
      },
      {
        q: "Do you supply the furniture and curtains too?",
        a: "Yes. We make majlis seating and curtains and supply flooring in-house, so the soft furnishings can be specified alongside the fit-out instead of chased separately once the work is done.",
      },
    ]
  },
  {
    "id": "cabinet-and-gypsum-board-work",
    "name": "Cabinet and gypsum board work",
    "category": "interior",
    "description": "Built-in joinery integrated with gypsum work, so cabinetry and ceilings finish as one.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabinet and gypsum board work 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabinet and gypsum board work 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabinet and gypsum board work 3.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Cabinet and gypsum board work 4.jpeg"
      }
    ],
    "imageSrc": "/Products/Interior Design/Cabinet and gypsum board work 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Cabinet%20and%20gypsum%20board%20work",
    seoTitle: "Built-In Cabinets & Gypsum Joinery Qatar",
    metaDescription: "Built-in cabinetry integrated with gypsum work in Qatar. Storage, niches and shelving finished flush with the walls and ceiling. Fitted in Doha.",
    imageAlt: "Built-in cabinetry integrated with gypsum wall detailing in a Doha interior",
    longDescription: [
      "This is the work that sits between carpentry and gypsum: storage that is built into the wall rather than placed against it. Cabinets finish flush with the plasterwork, niches line through with the shelving beside them, and the join between joinery and wall disappears.",
      "Doing both trades together is the whole point. When cabinetry and gypsum are quoted by separate contractors the tolerances rarely meet, and you end up with a shadow gap nobody planned. We set out the joinery and the boarding from the same drawing.",
    ],
    specs: [
      {
        label: "Work covered",
        value: "Built-in cabinets, niches, shelving",
      },
      {
        label: "Integration",
        value: "Joinery and gypsum set out together",
      },
      {
        label: "Finish",
        value: "Flush with the surrounding wall",
      },
      {
        label: "Best for",
        value: "Living rooms, majlis, offices",
      },
      {
        label: "Service area",
        value: "All of Qatar",
      },
    ],
    faqs: [
      {
        q: "Why combine cabinetry with gypsum work?",
        a: "Because the junction between them is where the finish is won or lost. Set out from one drawing by one team, the cabinet face lines through with the wall. Split between two contractors, the tolerances almost never meet and a gap appears.",
      },
      {
        q: "Can you build storage into an existing wall?",
        a: "Usually yes. We check what is behind the wall first for services and structure, then form the recess and build the joinery into it. Depth is the limiting factor, and we confirm it during the survey.",
      },
      {
        q: "Do you make lit display niches?",
        a: "Yes. Niches with concealed LED are a common request in a majlis. The wiring has to be run before the boards close, so it is decided at design stage rather than added later.",
      },
    ]
  },
  {
    "id": "gypsum-board-work-design",
    "name": "Gypsum board work design",
    "category": "interior",
    "description": "False ceilings, bulkheads, coves and wall detailing in gypsum board.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Interior Design/Gypsum board work design 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Gypsum board work design 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Gypsum board work design 3.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Gypsum board work design 4.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Gypsum board work design 5.jpeg"
      }
    ],
    "imageSrc": "/Products/Interior Design/Gypsum board work design 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Gypsum%20board%20work%20design",
    seoTitle: "Gypsum Board Work in Qatar | False Ceilings",
    metaDescription: "Gypsum board false ceilings, bulkheads, coves and wall detailing in Qatar. Designed and installed by our own team across Doha.",
    imageAlt: "Gypsum board false ceiling with cove lighting in a Doha villa",
    longDescription: [
      "Gypsum is how a flat ceiling becomes part of the design. Dropping a section, running a cove around the perimeter or forming a bulkhead over a seating area gives a room definition without taking a centimetre of floor space, and it is the standard way ceilings are detailed in Qatari villas and majlis.",
      "It is also where lighting gets planned. Coves conceal indirect strips that wash the ceiling, and recessed spots need their positions set before the boards close up. We work the lighting layout out with you at the design stage rather than cutting holes afterwards.",
    ],
    specs: [
      {
        label: "Work covered",
        value: "False ceilings, bulkheads, coves",
      },
      {
        label: "Wall detailing",
        value: "Recesses, niches, feature panels",
      },
      {
        label: "Lighting",
        value: "Cove and recessed positions planned in",
      },
      {
        label: "Finish",
        value: "Taped, jointed and ready to paint",
      },
      {
        label: "Service area",
        value: "All of Qatar",
      },
    ],
    faqs: [
      {
        q: "What is a cove ceiling?",
        a: "A recessed channel around the perimeter of the ceiling that hides an LED strip. The light washes upward and reflects back down, giving soft indirect illumination with no visible fitting. It is the most common gypsum detail we install.",
      },
      {
        q: "How much ceiling height does a false ceiling take?",
        a: "Typically 10 to 20 centimetres depending on the detail and what services run above it. We measure the existing height first, because in a room that is already low a shallower design or a partial drop is usually the better call.",
      },
      {
        q: "Is the gypsum work painted?",
        a: "We hand it over taped, jointed and ready to paint as standard. Painting can be included in the quote if you would like it finished as one job.",
      },
    ]
  },
  {
    "id": "indoor-wall-panel-design",
    "name": "Indoor wall panel design",
    "category": "interior",
    "description": "Decorative interior wall panelling \u2014 slatted, fluted and upholstered feature walls.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "video",
        "src": "/Products/Interior Design/Indoor wall panel design vid.mp4"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Indoor wall panel design 1.jpeg"
      }
    ],
    "imageSrc": "/Products/Interior Design/Indoor wall panel design 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Indoor%20wall%20panel%20design",
    seoTitle: "Indoor Wall Panelling in Qatar | Feature Walls",
    metaDescription: "Interior wall panelling in Qatar. Slatted, fluted and upholstered feature walls supplied and installed across Doha by Al Arabia Carpets.",
    imageAlt: "Slatted indoor wall panelling on a feature wall in a Doha home",
    longDescription: [
      "Panelling changes a wall's texture rather than just its colour. Vertical slats and fluted profiles catch light down their length and throw fine shadow lines, so the surface reads differently through the day in a way paint or wallpaper never does.",
      "It is most often used on one wall \u2014 behind a TV, behind the head of a bed, or along the run a majlis faces. Panelling every wall in a room usually overwhelms it, and we will say so before quoting.",
    ],
    specs: [
      {
        label: "Types",
        value: "Slatted, fluted, upholstered",
      },
      {
        label: "Best for",
        value: "TV walls, bedheads, majlis feature walls",
      },
      {
        label: "Effect",
        value: "Texture and shadow line, not just colour",
      },
      {
        label: "Coverage",
        value: "Single feature wall recommended",
      },
      {
        label: "Service area",
        value: "All of Qatar",
      },
    ],
    faqs: [
      {
        q: "Should I panel the whole room?",
        a: "Rarely. Panelling works by contrast \u2014 one textured wall against three plain ones. Wrap a room in it and the effect cancels out and the space closes in. A single feature wall is almost always the stronger result.",
      },
      {
        q: "What is the difference between slatted and fluted panelling?",
        a: "Slatted uses separate battens with a visible gap between them, usually over a dark backing, which gives a strong striped rhythm. Fluted is a continuous surface with rounded grooves, so the effect is softer and more subtle.",
      },
      {
        q: "Does panelling help with sound?",
        a: "Slatted panelling over an acoustic backing does take the edge off echo in a hard-surfaced room. It is not soundproofing, but in a majlis with tiled floors and bare walls the difference in liveliness is noticeable.",
      },
    ]
  },
  {
    "id": "television-decore-with-cabin-box",
    "name": "TV Unit with Cabinet Box",
    "category": "interior",
    "description": "TV feature walls with integrated cabinetry and concealed cable management.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 1.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 10.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 2.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 3.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 4.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 5.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 6.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 7.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 8.jpeg"
      },
      {
        "type": "image",
        "src": "/Products/Interior Design/Television decore with cabin box 9.jpeg"
      }
    ],
    "imageSrc": "/Products/Interior Design/Television decore with cabin box 1.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20TV%20Unit%20with%20Cabinet%20Box",
    seoTitle: "TV Unit & Feature Wall Design in Qatar",
    metaDescription: "TV feature walls with built-in cabinetry in Qatar. Concealed cabling, integrated storage and lighting, designed and installed across Doha.",
    imageAlt: "TV feature wall with built-in cabinetry and concealed lighting in a Doha living room",
    longDescription: [
      "A TV wall is the piece of joinery a living room is arranged around, so it is worth building rather than buying. Built in, the screen sits at the right height for your seating, the cabling disappears into the wall, and the boxes and consoles get a ventilated home instead of a shelf of visible clutter.",
      "We design the unit around your actual equipment \u2014 screen size, what needs to be reachable by remote, what needs airflow \u2014 and integrate lighting behind the screen where you want it. Backlighting a TV wall genuinely reduces eye strain in a dark room.",
    ],
    specs: [
      {
        label: "Includes",
        value: "TV wall, cabinetry, cable management",
      },
      {
        label: "Cabling",
        value: "Concealed within the unit",
      },
      {
        label: "Equipment",
        value: "Ventilated housing for boxes and consoles",
      },
      {
        label: "Lighting",
        value: "Optional backlighting behind the screen",
      },
      {
        label: "Service area",
        value: "All of Qatar",
      },
    ],
    faqs: [
      {
        q: "Can you hide the cables completely?",
        a: "Yes. Power and HDMI run inside the unit and through the wall to the equipment housing, so nothing is visible. We need to know the screen position and the socket locations at design stage, because retrofitting it means opening the wall again.",
      },
      {
        q: "How high should the TV be mounted?",
        a: "So the centre of the screen sits roughly at eye level when you are seated. That is usually lower than people expect, and lower than a unit designed without reference to the actual seating. We set it from where your majlis or sofa will be.",
      },
      {
        q: "Do the equipment boxes need ventilation?",
        a: "They do. A receiver or console in a sealed cabinet runs hot and its life suffers. We build in ventilation and leave rear access, which also makes the eventual cable change far less painful.",
      },
    ]
  },
  {
    "id": "al-wakra-white-ultra-modern-waterproof-spc-flooring",
    "name": "Al Wakra White – Ultra-Modern Waterproof SPC Flooring",
    "category": "barkia",
    "description": "Near-white SPC with a clean matt finish. Built for retail, showrooms and ultra-modern interiors.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Al%20Wakra%20White%20%E2%80%93%20Ultra-Modern%20Waterproof%20SPC%20Flooring",
    seoTitle: "Al Wakra White SPC Flooring | Retail & Showroom",
    metaDescription: "Al Wakra White SPC flooring in Qatar. A near-white matt decor for showrooms, retail and ultra-modern interiors. Commercial-grade, fitted in Doha.",
    imageAlt: "Al Wakra White SPC flooring in a modern Doha showroom",
    longDescription: [
      "Al Wakra White is the most extreme light decor in the range \u2014 closer to a painted floor than a wood one. It is specified mostly for commercial work: showrooms, clinics, salons and retail units where the floor needs to disappear so that product or merchandising carries the whole visual weight.",
      "In a domestic setting it is a bold, high-maintenance choice. We fit it in homes occasionally, almost always in a room with a specific purpose \u2014 a home office, a dressing room \u2014 rather than as a whole-house floor.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Near-white, minimal grain",
      },
      {
        label: "Finish",
        value: "Clean matt",
      },
      {
        label: "Best for",
        value: "Showrooms, retail, clinics",
      },
      {
        label: "Domestic use",
        value: "Single rooms rather than whole house",
      },
      {
        label: "Maintenance",
        value: "Higher -- marks are visible",
      },
    ],
    faqs: [
      {
        q: "Is a white floor practical at home?",
        a: "In a specific room, yes; across a whole house it is demanding. Dark marks and scuffs read immediately against near-white. We normally suggest it for a dressing room or home office rather than hallways and family areas.",
      },
      {
        q: "Why is white common in showrooms?",
        a: "Because the floor is meant to vanish. A near-white matt surface throws light back onto whatever is being displayed and adds no colour of its own, which is exactly what retail and clinical spaces want.",
      },
      {
        q: "Does it scratch more easily than darker decors?",
        a: "No \u2014 the wear layer is the same. Scratches and scuffs are simply more visible against a very pale surface, so the floor looks worn sooner even though it is wearing at the same rate.",
      },
    ]
  },
  {
    "id": "arabian-night-espresso-high-end-waterproof-spc",
    "name": "Arabian Night Espresso – High-End Waterproof SPC",
    "category": "barkia",
    "description": "Very dark espresso SPC. High contrast and dramatic, with honest trade-offs on dust.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Arabian%20Night%20Espresso%20%E2%80%93%20High-End%20Waterproof%20SPC",
    seoTitle: "Arabian Night Espresso SPC | Dark Floor Qatar",
    metaDescription: "Arabian Night Espresso SPC flooring in Qatar. A very dark, high-contrast decor for dramatic interiors. Honest advice on dust before you commit.",
    imageAlt: "Arabian Night Espresso dark SPC flooring in a Doha interior",
    longDescription: [
      "Espresso is the darkest decor we stock and the most dramatic. Against pale walls and light furniture it produces the sort of contrast that photographs extremely well and gives a room real definition.",
      "We will always raise one thing before you commit: in Qatar, fine dust is pale, and it is visible on a dark floor within a day of cleaning. Plenty of clients choose it anyway and are happy \u2014 but you should choose it knowing that, not discover it afterwards.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Very dark espresso brown",
      },
      {
        label: "Contrast",
        value: "High against pale walls",
      },
      {
        label: "Best for",
        value: "Feature rooms, low-traffic spaces",
      },
      {
        label: "Shows dust",
        value: "High -- the main trade-off",
      },
      {
        label: "Room size",
        value: "Suits larger, well-lit rooms",
      },
    ],
    faqs: [
      {
        q: "Does a dark floor show dust in Qatar?",
        a: "Yes, noticeably. Airborne dust here is pale and settles visibly on a dark surface, often within a day. It cleans off easily, but you will see it between cleans in a way you would not on a mid or light floor.",
      },
      {
        q: "Should I use espresso in a small room?",
        a: "Usually not. A very dark floor absorbs light and pulls the boundaries of a room inward, so a small or dim space can feel closed in. It is at its best in larger rooms with good natural light.",
      },
      {
        q: "How do I make a dark floor work?",
        a: "Keep the walls and larger furniture pale so the contrast is deliberate, use layered lighting rather than one ceiling fitting, and accept a slightly more frequent cleaning routine. Done that way it is the most striking floor we fit.",
      },
    ]
  },
  {
    "id": "desert-walnut-classic-luxury-spc-flooring-doha",
    "name": "Desert Walnut Classic – Luxury SPC Flooring Doha",
    "category": "barkia",
    "description": "Mid-tone walnut SPC. The most forgiving decor in the range for busy family homes.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Desert%20Walnut%20Classic%20%E2%80%93%20Luxury%20SPC%20Flooring%20Doha",
    seoTitle: "Desert Walnut SPC Flooring Doha | Mid-Tone Walnut",
    metaDescription: "Desert Walnut Classic SPC flooring in Doha. A mid-tone walnut that hides dust and marks better than pale or dark floors. Fitted across Qatar.",
    imageAlt: "Desert Walnut Classic SPC flooring in a Doha family home",
    longDescription: [
      "If you want the floor you will think about least, this is it. Mid-tone walnut sits between the two extremes that cause complaints: pale floors that show every dark mark, and dark floors that show every speck of pale dust.",
      "That makes it our standard recommendation for hallways, family rooms and any home with children or frequent guests. It is not the most striking decor we sell, and that is precisely why it keeps looking good between cleans.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Mid-tone classic walnut",
      },
      {
        label: "Best for",
        value: "Family homes, hallways",
      },
      {
        label: "Shows dust",
        value: "Lowest in the range",
      },
      {
        label: "Shows marks",
        value: "Low",
      },
      {
        label: "Traffic",
        value: "Heavy",
      },
    ],
    faqs: [
      {
        q: "Which SPC decor is easiest to keep looking clean?",
        a: "This one. Pale floors hide dust but show dark marks; dark floors do the reverse. A mid-tone walnut is the only part of the range that is forgiving in both directions, which is why we fit so much of it in hallways.",
      },
      {
        q: "Is mid-tone a boring choice?",
        a: "It is the safe one, and in a hallway or family room that is the right trade. If you want the floor to be a feature, look at Mahogany or the Herringbone; if you want it to disappear and stay tidy, choose this.",
      },
      {
        q: "Does it suit both traditional and modern rooms?",
        a: "Yes, more than any other decor here. Mid walnut is neutral enough to sit with traditional majlis seating and with contemporary furniture, which is useful if the house mixes both.",
      },
    ]
  },
  {
    "id": "doha-coastal-grey-premium-rigid-core-spc-vinyl",
    "name": "Doha Coastal Grey – Premium Rigid Core SPC Vinyl",
    "category": "barkia",
    "description": "Cool-toned grey SPC with a rigid core. Suits modern villas with white walls and dark joinery.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Doha%20Coastal%20Grey%20%E2%80%93%20Premium%20Rigid%20Core%20SPC%20Vinyl",
    seoTitle: "Doha Coastal Grey SPC Vinyl | Rigid Core Flooring",
    metaDescription: "Doha Coastal Grey rigid core SPC vinyl flooring. A cool grey decor for modern villas, dent-resistant under heavy furniture. Fitted across Qatar.",
    imageAlt: "Doha Coastal Grey SPC vinyl flooring in a modern Qatari villa",
    longDescription: [
      "Coastal Grey is a cool-toned decor built for contemporary interiors \u2014 white or off-white walls, dark joinery, glass and metal. Where an oak decor warms a room, this one keeps it crisp, which is what most modern villa schemes in Doha are reaching for.",
      "It is a rigid core board, so it resists denting under point loads better than a flexible vinyl. That matters in rooms carrying heavy furniture: majlis seating, dining tables, wardrobes and appliances all sit on small feet that concentrate a lot of weight.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Cool grey, low colour variation",
      },
      {
        label: "Core",
        value: "Rigid stone plastic composite",
      },
      {
        label: "Best for",
        value: "Modern villas, heavy furniture",
      },
      {
        label: "Dent resistance",
        value: "High",
      },
      {
        label: "Pairs with",
        value: "White walls, dark joinery",
      },
    ],
    faqs: [
      {
        q: "What does a rigid core actually change?",
        a: "It resists denting. A flexible vinyl can take a permanent mark from a heavy item on a small foot; a rigid core spreads that load. If you are putting wardrobes, a dining table or a full majlis onto the floor, it is the more forgiving choice.",
      },
      {
        q: "Is grey flooring still a good choice?",
        a: "For contemporary interiors, yes. Grey reads as neutral against white walls and lets joinery and furniture carry the colour. It suits a scheme built around glass and metal better than an oak decor does.",
      },
      {
        q: "Does a cool grey floor make a room feel cold?",
        a: "It can if the room has little natural light and no warm textures. We usually pair it with a rug and warmer upholstery, which keeps the crispness without the room feeling stark.",
      },
    ]
  },
  {
    "id": "outdoor-wall-panel-products",
    "name": "Outdoor wall panel products",
    "category": "barkia",
    "description": "Premium Outdoor wall panel products for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Outdoor wall panel products.jpeg"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Outdoor wall panel products.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Outdoor%20wall%20panel%20products"
  },
  {
    "id": "pearl-grey-herringbone-100-waterproof-spc-qatar",
    "name": "Pearl Grey Herringbone \u2013 100% Waterproof SPC",
    "category": "barkia",
    "description": "Pearl grey SPC in a herringbone pattern. The only format-led floor in the range.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Pearl%20Grey%20Herringbone%20%5Cu2013%20100%25%20Waterproof%20SPC",
    seoTitle: "Pearl Grey Herringbone SPC Flooring Qatar",
    metaDescription: "Pearl Grey Herringbone SPC flooring in Qatar. A classic herringbone laying pattern in waterproof SPC, fitted plank by plank across Doha.",
    imageAlt: "Pearl Grey Herringbone SPC flooring laid in a Doha entrance hall",
    longDescription: [
      "Every other decor in this range is chosen on colour. This one is chosen on pattern. Herringbone lays short planks at right angles into a zig-zag, and the result is a floor that carries a room on its own \u2014 which is why it turns up most often in entrance halls, dining rooms and formal majlis.",
      "The pearl grey is deliberately restrained. A strongly coloured herringbone quickly becomes overwhelming across a large area, so a quiet tone lets the pattern do the work without the floor shouting.",
    ],
    specs: [
      {
        label: "Laying pattern",
        value: "Herringbone, 45 degrees",
      },
      {
        label: "Decor",
        value: "Pearl grey, restrained",
      },
      {
        label: "Plank format",
        value: "Short planks",
      },
      {
        label: "Best for",
        value: "Entrance halls, dining, formal majlis",
      },
      {
        label: "Installation",
        value: "Longer -- laid plank by plank",
      },
    ],
    faqs: [
      {
        q: "Does herringbone cost more to install?",
        a: "Yes. Each short plank is set individually at an angle and the pattern has to stay true across the whole room, so it takes considerably longer than a straight lay and generates more offcuts. We quote herringbone separately for that reason.",
      },
      {
        q: "Does herringbone suit a small room?",
        a: "It can work well in a small entrance hall, where the pattern becomes a feature you see all at once. In a small living room it tends to be too busy \u2014 the pattern needs either a contained space or a large one to look deliberate.",
      },
      {
        q: "Which direction should herringbone run?",
        a: "Usually pointing along the main sightline as you enter, which draws the eye through the space. We set the direction on site with you before laying, because it is not something that can be changed afterwards.",
      },
    ]
  },
  {
    "id": "qatar-breeze-oak-bright-waterproof-spc-flooring",
    "name": "Qatar Breeze Oak – Bright & Waterproof SPC Flooring",
    "category": "barkia",
    "description": "Bright, airy oak SPC with a cool-neutral cast. For rooms that need to feel more open.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Qatar%20Breeze%20Oak%20%E2%80%93%20Bright%20%26%20Waterproof%20SPC%20Flooring",
    seoTitle: "Qatar Breeze Oak SPC Flooring | Bright Neutral Oak",
    metaDescription: "Qatar Breeze Oak SPC flooring in Qatar. A bright, cool-neutral oak that lifts north-facing and enclosed rooms. Supplied and installed across Doha.",
    imageAlt: "Qatar Breeze Oak SPC flooring in a bright Doha room",
    longDescription: [
      "Breeze Oak is our answer for rooms that feel closed in \u2014 north-facing spaces, rooms with one small window, interior rooms with no direct daylight. The decor is bright with a cool-neutral cast, so it lifts a space without adding the yellow that a warm oak brings.",
      "Set against Sand Oak, this is the cooler and slightly crisper of the two. If a room already gets strong afternoon sun, Sand Oak's warmth is usually the better match; if the room is dim, this one does more work.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Bright oak, cool-neutral cast",
      },
      {
        label: "Best for",
        value: "North-facing and enclosed rooms",
      },
      {
        label: "Tone",
        value: "Light, neutral rather than warm",
      },
      {
        label: "Effect",
        value: "Lifts and opens a dim space",
      },
      {
        label: "Shows dust",
        value: "Low",
      },
    ],
    faqs: [
      {
        q: "What flooring suits a room with little natural light?",
        a: "A bright, cool-neutral decor like this one. It reflects what light there is without adding a colour cast, so the room reads as more open. A warm or dark floor in the same space tends to make it feel more enclosed.",
      },
      {
        q: "How does Breeze Oak differ from Qatar Sand Oak?",
        a: "Both are light oaks. Breeze is cooler and more neutral; Sand is warmer with a golden undertone. Choose Breeze for a dim room that needs lifting, Sand for a sunny room where warmth is welcome.",
      },
      {
        q: "Will a cool oak work with warm furniture?",
        a: "Generally yes \u2014 a neutral cast is easier to pair than a strongly warm or cool one. It sits comfortably with both cream and grey upholstery, which is why it is a safe pick when the furniture is not decided yet.",
      },
    ]
  },
  {
    "id": "qatar-sand-oak-luxury-waterproof-spc-flooring",
    "name": "Qatar Sand Oak – Luxury Waterproof SPC Flooring",
    "category": "barkia",
    "description": "Warm sand-toned oak SPC. A light, forgiving floor that makes smaller rooms feel bigger.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Qatar%20Sand%20Oak%20%E2%80%93%20Luxury%20Waterproof%20SPC%20Flooring",
    seoTitle: "Qatar Sand Oak SPC Flooring | Light Oak Decor",
    metaDescription: "Qatar Sand Oak SPC flooring in Doha. A warm, light oak decor that opens up small rooms and hides everyday dust. Supplied and fitted across Qatar.",
    imageAlt: "Qatar Sand Oak SPC flooring laid in a bright Doha living room",
    longDescription: [
      "Sand Oak is the lightest decor in our SPC range and the one we suggest most often for apartments and smaller villas. Pale floors bounce daylight back into a room, which makes a modest floor area read as noticeably larger, and they keep a space feeling cool even when the light outside is harsh.",
      "The warm sand undertone is what separates it from a grey-leaning light oak. It sits comfortably with beige and cream majlis seating, which is the most common palette we work with in Qatar, and it does not fight with gold or brass fittings.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Light oak, warm sand undertone",
      },
      {
        label: "Best for",
        value: "Apartments and small rooms",
      },
      {
        label: "Plank format",
        value: "Standard straight plank",
      },
      {
        label: "Light behaviour",
        value: "Reflective, brightens a room",
      },
      {
        label: "Shows dust",
        value: "Low",
      },
    ],
    faqs: [
      {
        q: "Does a light floor make a room look bigger?",
        a: "It genuinely helps. A pale floor reflects daylight back up into the room instead of absorbing it, so the boundaries of the space read as further away. In a small majlis or an apartment living room the difference is easy to see.",
      },
      {
        q: "Will Sand Oak show dust in Qatar?",
        a: "Less than most. Fine dust here is pale, so it disappears against a light sand-toned floor in a way it never does on a dark one. This is the decor we recommend when someone tells us their current floor always looks dusty.",
      },
      {
        q: "Does it clash with beige majlis seating?",
        a: "No, and that is the main reason we suggest it. The warm undertone sits with cream and beige upholstery rather than pulling grey against it, which is what a cooler light oak tends to do.",
      },
    ]
  },
  {
    "id": "royal-mahogany-luxury-waterproof-vinyl-spc",
    "name": "Royal Mahogany – Luxury Waterproof Vinyl SPC",
    "category": "barkia",
    "description": "Deep red-brown mahogany SPC. A formal floor for majlis and reception rooms.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Royal%20Mahogany%20%E2%80%93%20Luxury%20Waterproof%20Vinyl%20SPC",
    seoTitle: "Royal Mahogany SPC Flooring | Formal Majlis Floor",
    metaDescription: "Royal Mahogany waterproof vinyl SPC flooring in Qatar. A deep red-brown decor for formal majlis and reception rooms. Supplied and installed in Doha.",
    imageAlt: "Royal Mahogany SPC flooring in a formal Qatari majlis",
    longDescription: [
      "Mahogany is a formal decor, and we fit it almost entirely in rooms meant to receive guests: the main majlis, a reception room, an office where clients are met. The deep red-brown carries a sense of weight that a pale oak simply does not.",
      "It works best where there is enough natural light or good layered lighting to bring out the red in the grain. In a dim room the same decor flattens towards plain brown, so we will usually walk through the lighting with you before recommending it.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Deep red-brown mahogany",
      },
      {
        label: "Best for",
        value: "Formal majlis, reception rooms",
      },
      {
        label: "Lighting",
        value: "Needs good light to show the red",
      },
      {
        label: "Formality",
        value: "High",
      },
      {
        label: "Shows dust",
        value: "Moderate to high",
      },
    ],
    faqs: [
      {
        q: "Is mahogany too formal for a family room?",
        a: "It can be. The depth of colour that makes it right for a guest majlis reads as heavy in a room used casually every day. For family areas we would usually point you at a mid-tone walnut or an oak instead.",
      },
      {
        q: "Does mahogany need particular lighting?",
        a: "It benefits from it. The red in the grain only shows under decent natural or layered light; under a single dim ceiling fitting the floor flattens towards a plain dark brown and you lose what you paid for.",
      },
      {
        q: "What furniture suits a mahogany floor?",
        a: "Traditional and formal majlis seating, and gold or brass detailing. It also carries patterned rugs well, which a busier floor decor would fight with.",
      },
    ]
  },
  {
    "id": "scandinavian-white-oak-modern-waterproof-spc-doha",
    "name": "Scandinavian White Oak – Modern Waterproof SPC Doha",
    "category": "barkia",
    "description": "Pale, low-contrast white oak SPC. The quietest floor in the range for minimal interiors.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Scandinavian%20White%20Oak%20%E2%80%93%20Modern%20Waterproof%20SPC%20Doha",
    seoTitle: "Scandinavian White Oak SPC Flooring Doha | Minimal",
    metaDescription: "Scandinavian White Oak SPC flooring in Doha. A pale, low-contrast decor for minimal interiors and apartments. Supplied and installed across Qatar.",
    imageAlt: "Scandinavian White Oak SPC flooring in a minimal Doha apartment",
    longDescription: [
      "This is the quietest decor we stock. The grain is subtle and the contrast between light and dark within each plank is deliberately low, so the floor recedes and lets furniture, art and joinery do the talking.",
      "That restraint is the point. In a minimal interior a busy floor with strong grain becomes the loudest thing in the room, which is rarely what the design intended. We fit a lot of this in apartments and in rooms where the client has spent their budget on the furniture.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Pale white-washed oak",
      },
      {
        label: "Grain contrast",
        value: "Low, subtle",
      },
      {
        label: "Best for",
        value: "Minimal interiors, apartments",
      },
      {
        label: "Visual weight",
        value: "Recedes",
      },
      {
        label: "Shows dust",
        value: "Low",
      },
    ],
    faqs: [
      {
        q: "Why choose a floor with less grain?",
        a: "So it does not compete. In a minimal room a strongly grained floor becomes the busiest surface in the space. A low-contrast decor lets the furniture and the architecture read clearly, which is usually the whole intent of the scheme.",
      },
      {
        q: "Does white oak look cold?",
        a: "Less than a grey. It is pale but still a warm-neutral rather than a cool one, so it stays comfortable in a room with plenty of light without tipping into the starkness a grey can bring.",
      },
      {
        q: "Is it practical in a family home?",
        a: "Yes, with the same caveat as any pale floor: it hides dust well but shows dark spills more clearly. The wear layer handles the traffic; it is a cleaning-habits question, not a durability one.",
      },
    ]
  },
  {
    "id": "skerting-nala-profile",
    "name": "Skirting & Nala Profile",
    "category": "barkia",
    "description": "Premium Skerting:Nala:profile for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Skerting:Nala:profile.jpeg"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Skerting:Nala:profile.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Skirting%20%26%20Nala%20Profile"
  },
  {
    "id": "spc-zigzag-barkia-installation",
    "name": "SPC Zigzag Barkia Installation",
    "category": "barkia",
    "description": "Premium Spc zigzag barkia installation for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "video",
        "src": "/Products/barkia&pvc/Spc zigzag barkia installation vid.mp4"
      },
      {
        "type": "video",
        "src": "/Products/barkia&pvc/Spc zigzag barkia installation.mp4"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Spc zigzag barkia installation vid.mp4",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20SPC%20Zigzag%20Barkia%20Installation"
  },
  {
    "id": "stairs-carpet-installation",
    "name": "Stairs carpet installation",
    "category": "barkia",
    "description": "Stair carpet templated and fitted to every tread, riser and landing.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Stairs carpet installation.jpeg"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Stairs carpet installation.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Stairs%20carpet%20installation",
    seoTitle: "Stairs Carpet Installation Qatar | Al Arabia",
    metaDescription: "Stair carpet supply and installation across Qatar. Precise fitting to treads, risers and landings for a safe, quiet staircase. Free measurement in Doha.",
    imageAlt: "Carpeted staircase with fitted treads and risers in a Doha villa",
    longDescription: [
      "Carpeting a staircase makes it quieter and safer underfoot, and it is the part of a home where fitting quality matters most. Every tread, riser and winder has to be measured and cut individually.",
      "Our installers template each step, fit the carpet tight to the nosing, and finish the landings so the transition is clean. We work on straight, turning and spiral staircases across Qatar.",
    ],
    specs: [
      {
        label: "Covers",
        value: "Treads, risers, winders, landings",
      },
      {
        label: "Stair types",
        value: "Straight, turning and spiral",
      },
      {
        label: "Benefit",
        value: "Quieter and safer underfoot",
      },
      {
        label: "Measurement",
        value: "Free on-site survey",
      },
    ],
    faqs: [
      {
        q: "Can you carpet a turning or spiral staircase?",
        a: "Yes. Winders and spiral flights are templated and cut step by step so the carpet sits tight to each nosing without rucking.",
      },
      {
        q: "Does stair carpet make stairs safer?",
        a: "It adds grip underfoot and softens a fall, and it noticeably reduces the noise of people using the stairs. Correct fitting to the nosing is what makes the difference.",
      },
    ]
  },
  {
    "id": "sunset-teak-gold-elegant-spc-vinyl-flooring-qatar",
    "name": "Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar",
    "category": "barkia",
    "description": "Golden teak SPC with warm honey tones. Traditional character without a dark floor.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20Sunset%20Teak%20Gold%20%E2%80%93%20Elegant%20SPC%20Vinyl%20Flooring%20Qatar",
    seoTitle: "Sunset Teak Gold SPC Flooring Qatar | Warm Teak",
    metaDescription: "Sunset Teak Gold SPC vinyl flooring in Qatar. Warm golden teak tones for traditional interiors that still want a light floor. Fitted across Doha.",
    imageAlt: "Sunset Teak Gold SPC flooring in a traditional Qatari interior",
    longDescription: [
      "Teak Gold solves a problem that comes up often: a client wants traditional warmth but does not want a dark room. The honey-gold tone reads as traditional and rich while staying mid-light, so the floor carries character without swallowing the light.",
      "The golden cast is strong enough to influence a scheme, so it is worth deciding on this floor before the upholstery rather than after. It sits beautifully with cream and gold, and works against cool greys and stark whites.",
    ],
    specs: [
      {
        label: "Decor",
        value: "Golden teak, honey tones",
      },
      {
        label: "Best for",
        value: "Traditional interiors wanting light",
      },
      {
        label: "Tone",
        value: "Mid-light, strongly warm",
      },
      {
        label: "Pairs with",
        value: "Cream and gold schemes",
      },
      {
        label: "Avoid with",
        value: "Cool greys, stark white",
      },
    ],
    faqs: [
      {
        q: "How is Teak Gold different from Sand Oak?",
        a: "Both are light, but Teak Gold has a much stronger golden cast and more visible grain character. Sand Oak is the quieter, more neutral of the two; Teak Gold is a decision that shapes the rest of the room.",
      },
      {
        q: "Will the gold tone date?",
        a: "Warm woods move in and out of fashion more than neutrals do. If you want a floor you will not think about for fifteen years, a mid oak is safer. If you want the room to feel warm and traditional now, this is the better-looking floor.",
      },
      {
        q: "Should I choose the floor or the furniture first?",
        a: "With this decor, the floor. The golden cast is strong enough to influence how upholstery colours read, so matching fabric to the floor works better than the other way round.",
      },
    ]
  },
  {
    "id": "pvc-barkia",
    "name": "PVC Barkia Flooring",
    "category": "barkia",
    "description": "100% waterproof PVC barkia flooring, ideal for kitchens, bathrooms and wet areas.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/pvc-barkia.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/pvc-barkia.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I%27m%20interested%20in%20PVC%20Barkia%20Flooring",
    seoTitle: "PVC Barkia Flooring Doha | Waterproof & Fitted",
    metaDescription: "PVC barkia flooring in Qatar: 100% waterproof, scratch-resistant and quick to install. Free measurement, delivery and fitting across Doha from Al Arabia Carpets.",
    imageAlt: "PVC barkia waterproof flooring installed in a Doha interior",
    longDescription: [
      "PVC barkia is the fully synthetic version of traditional barkia, giving you a 100% waterproof floor that will not swell, warp or stain. It is the practical choice for kitchens, bathrooms, laundry areas and any space that sees water.",
      "Available in a wide range of wood-effect and stone-effect finishes, PVC barkia installs quickly with minimal disruption and needs nothing more than routine sweeping and mopping to stay looking new.",
    ],
    specs: [
      {
        label: "Material",
        value: "PVC / vinyl composite",
      },
      {
        label: "Water resistance",
        value: "100% waterproof",
      },
      {
        label: "Best for",
        value: "Kitchens, bathrooms, wet areas",
      },
      {
        label: "Maintenance",
        value: "Sweep and damp mop",
      },
      {
        label: "Installation",
        value: "Included, typically one day per room",
      },
    ],
    faqs: [
      {
        q: "Is PVC barkia fully waterproof?",
        a: "Yes. PVC barkia is 100% waterproof through its full thickness, so standing water will not cause swelling or damage. That makes it suitable for kitchens, bathrooms and laundry rooms.",
      },
      {
        q: "How is PVC barkia different from regular barkia?",
        a: "PVC barkia is entirely synthetic and completely waterproof, while standard barkia may include composite layers that are water-resistant rather than waterproof. For wet areas we recommend PVC.",
      },
      {
        q: "How do I clean PVC barkia?",
        a: "Sweep or vacuum regularly and clean with a damp mop and mild detergent. Avoid abrasive scourers and harsh solvents, which can dull the wear layer.",
      },
    ]
  }
];

