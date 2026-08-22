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
    "description": "Premium Artificial flowers grass for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Artificial%20flowers%20grass"
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Artificial%20grass%20installation%20work",
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
    "name": "Event:normal carpet",
    "category": "carpet",
    "description": "Premium Event:normal carpet for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Event:normal carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Event:normal carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Event%3Anormal%20carpet"
  },
  {
    "id": "home-design-luxury-carpet",
    "name": "Home design luxury carpet",
    "category": "carpet",
    "description": "Premium Home design luxury carpet for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Home design luxury carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Home design luxury carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Home%20design%20luxury%20carpet"
  },
  {
    "id": "luxury-home-carpet",
    "name": "Luxury home carpet",
    "category": "carpet",
    "description": "Premium Luxury home carpet for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20home%20carpet"
  },
  {
    "id": "mosjid-mosque-carpet-installation",
    "name": "Mosjid:mosque carpet installation",
    "category": "carpet",
    "description": "Premium Mosjid:mosque carpet installation for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Mosjid%3Amosque%20carpet%20installation"
  },
  {
    "id": "mosque-masjid-carpet",
    "name": "Mosque:masjid carpet",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Mosque%3Amasjid%20carpet",
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
    "name": "PVC gym mat:indoor game mat",
    "category": "carpet",
    "description": "Premium PVC gym mat:indoor game mat for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/PVC gym mat:indoor game mat.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/PVC gym mat:indoor game mat.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20PVC%20gym%20mat%3Aindoor%20game%20mat"
  },
  {
    "id": "tiles-carpet-office-carpet",
    "name": "Tiles carpet:office carpet",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Tiles%20carpet%3Aoffice%20carpet",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20grass-carpet",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Home%20curtains",
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
    "name": "Office blind:office roller:vertical blinds",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Office%20blind%3Aoffice%20roller%3Avertical%20blinds",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20roller",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Khema%20majlis%20sofa"
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20majlis%20sofa",
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
    "name": "Majlis and cabinets:majlis sofa",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Majlis%20and%20cabinets%3Amajlis%20sofa"
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Modern%20majlis"
  },
  {
    "id": "cabin-interior-design",
    "name": "Cabin interior design",
    "category": "interior",
    "description": "Premium Cabin interior design for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Cabin%20interior%20design"
  },
  {
    "id": "cabinet-and-gypsum-board-work",
    "name": "Cabinet and gypsum board work",
    "category": "interior",
    "description": "Premium Cabinet and gypsum board work for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Cabinet%20and%20gypsum%20board%20work"
  },
  {
    "id": "gypsum-board-work-design",
    "name": "Gypsum board work design",
    "category": "interior",
    "description": "Premium Gypsum board work design for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Gypsum%20board%20work%20design"
  },
  {
    "id": "indoor-wall-panel-design",
    "name": "Indoor wall panel design",
    "category": "interior",
    "description": "Premium Indoor wall panel design for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Indoor%20wall%20panel%20design"
  },
  {
    "id": "television-decore-with-cabin-box",
    "name": "Television decore with cabin box",
    "category": "interior",
    "description": "Premium Television decore with cabin box for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Television%20decore%20with%20cabin%20box"
  },
  {
    "id": "al-wakra-white-ultra-modern-waterproof-spc-flooring",
    "name": "Al Wakra White – Ultra-Modern Waterproof SPC Flooring",
    "category": "barkia",
    "description": "Premium Al Wakra White – Ultra-Modern Waterproof SPC Flooring for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Al%20Wakra%20White%20%E2%80%93%20Ultra-Modern%20Waterproof%20SPC%20Flooring"
  },
  {
    "id": "arabian-night-espresso-high-end-waterproof-spc",
    "name": "Arabian Night Espresso – High-End Waterproof SPC",
    "category": "barkia",
    "description": "Premium Arabian Night Espresso – High-End Waterproof SPC for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Arabian%20Night%20Espresso%20%E2%80%93%20High-End%20Waterproof%20SPC"
  },
  {
    "id": "desert-walnut-classic-luxury-spc-flooring-doha",
    "name": "Desert Walnut Classic – Luxury SPC Flooring Doha",
    "category": "barkia",
    "description": "Premium Desert Walnut Classic – Luxury SPC Flooring Doha for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Desert%20Walnut%20Classic%20%E2%80%93%20Luxury%20SPC%20Flooring%20Doha"
  },
  {
    "id": "doha-coastal-grey-premium-rigid-core-spc-vinyl",
    "name": "Doha Coastal Grey – Premium Rigid Core SPC Vinyl",
    "category": "barkia",
    "description": "Premium Doha Coastal Grey – Premium Rigid Core SPC Vinyl for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Doha%20Coastal%20Grey%20%E2%80%93%20Premium%20Rigid%20Core%20SPC%20Vinyl"
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Outdoor%20wall%20panel%20products"
  },
  {
    "id": "pearl-grey-herringbone-100-waterproof-spc-qatar",
    "name": "Pearl Grey Herringbone – 100  Waterproof SPC Qatar",
    "category": "barkia",
    "description": "Premium Pearl Grey Herringbone – 100  Waterproof SPC Qatar for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Pearl%20Grey%20Herringbone%20%E2%80%93%20100%20%20Waterproof%20SPC%20Qatar"
  },
  {
    "id": "qatar-breeze-oak-bright-waterproof-spc-flooring",
    "name": "Qatar Breeze Oak – Bright & Waterproof SPC Flooring",
    "category": "barkia",
    "description": "Premium Qatar Breeze Oak – Bright & Waterproof SPC Flooring for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Qatar%20Breeze%20Oak%20%E2%80%93%20Bright%20%26%20Waterproof%20SPC%20Flooring"
  },
  {
    "id": "qatar-sand-oak-luxury-waterproof-spc-flooring",
    "name": "Qatar Sand Oak – Luxury Waterproof SPC Flooring",
    "category": "barkia",
    "description": "Premium Qatar Sand Oak – Luxury Waterproof SPC Flooring for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Qatar%20Sand%20Oak%20%E2%80%93%20Luxury%20Waterproof%20SPC%20Flooring"
  },
  {
    "id": "royal-mahogany-luxury-waterproof-vinyl-spc",
    "name": "Royal Mahogany – Luxury Waterproof Vinyl SPC",
    "category": "barkia",
    "description": "Premium Royal Mahogany – Luxury Waterproof Vinyl SPC for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Royal%20Mahogany%20%E2%80%93%20Luxury%20Waterproof%20Vinyl%20SPC"
  },
  {
    "id": "scandinavian-white-oak-modern-waterproof-spc-doha",
    "name": "Scandinavian White Oak – Modern Waterproof SPC Doha",
    "category": "barkia",
    "description": "Premium Scandinavian White Oak – Modern Waterproof SPC Doha for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Scandinavian%20White%20Oak%20%E2%80%93%20Modern%20Waterproof%20SPC%20Doha"
  },
  {
    "id": "skerting-nala-profile",
    "name": "Skerting:Nala:profile",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Skerting%3ANala%3Aprofile"
  },
  {
    "id": "spc-zigzag-barkia-installation",
    "name": "Spc zigzag barkia installation",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Spc%20zigzag%20barkia%20installation"
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Stairs%20carpet%20installation",
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
    "description": "Premium Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Sunset%20Teak%20Gold%20%E2%80%93%20Elegant%20SPC%20Vinyl%20Flooring%20Qatar"
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20pvc-barkia",
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

