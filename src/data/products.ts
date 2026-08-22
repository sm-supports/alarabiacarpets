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
    "description": "Premium Artificial grass installation work for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Artificial%20grass%20installation%20work"
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
    "description": "Premium Mosque:masjid carpet for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Mosque:masjid carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Mosque:masjid carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Mosque%3Amasjid%20carpet"
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
    "description": "Premium Tiles carpet:office carpet for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/Tiles carpet:office carpet.jpeg"
      }
    ],
    "imageSrc": "/Products/Carpets/Tiles carpet:office carpet.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Tiles%20carpet%3Aoffice%20carpet"
  },
  {
    "id": "carpet",
    "name": "carpet",
    "category": "carpet",
    "description": "Premium carpet for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/carpet.webp"
      }
    ],
    "imageSrc": "/Products/Carpets/carpet.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20carpet"
  },
  {
    "id": "grass-carpet",
    "name": "grass-carpet",
    "category": "carpet",
    "description": "Premium grass-carpet for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Carpets/grass-carpet.webp"
      }
    ],
    "imageSrc": "/Products/Carpets/grass-carpet.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20grass-carpet"
  },
  {
    "id": "home-curtains",
    "name": "Home curtains",
    "category": "curtains",
    "description": "Premium Home curtains for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Home%20curtains"
  },
  {
    "id": "office-blind-office-roller-vertical-blinds",
    "name": "Office blind:office roller:vertical blinds",
    "category": "curtains",
    "description": "Premium Office blind:office roller:vertical blinds for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Office%20blind%3Aoffice%20roller%3Avertical%20blinds"
  },
  {
    "id": "curtain",
    "name": "curtain",
    "category": "curtains",
    "description": "Premium curtain for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Curtain/curtain.webp"
      }
    ],
    "imageSrc": "/Products/Curtain/curtain.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20curtain"
  },
  {
    "id": "roller",
    "name": "roller",
    "category": "curtains",
    "description": "Premium roller for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Curtain/roller.webp"
      }
    ],
    "imageSrc": "/Products/Curtain/roller.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20roller"
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
    "description": "Premium Luxury majlis sofa for your home and office.",
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
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20majlis%20sofa"
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
    "id": "majlis-sofa",
    "name": "majlis-sofa",
    "category": "furniture",
    "description": "Premium majlis-sofa for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Furniture/majlis-sofa.webp"
      }
    ],
    "imageSrc": "/Products/Furniture/majlis-sofa.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20majlis-sofa"
  },
  {
    "id": "sofa",
    "name": "sofa",
    "category": "furniture",
    "description": "Premium sofa for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Furniture/sofa.webp"
      }
    ],
    "imageSrc": "/Products/Furniture/sofa.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20sofa"
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
    "id": "interior",
    "name": "interior",
    "category": "interior",
    "description": "Premium interior for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/Interior Design/interior.webp"
      }
    ],
    "imageSrc": "/Products/Interior Design/interior.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20interior"
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
    "description": "Premium Stairs carpet installation for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/Stairs carpet installation.jpeg"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/Stairs carpet installation.jpeg",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20Stairs%20carpet%20installation"
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
    "id": "barkia",
    "name": "barkia",
    "category": "barkia",
    "description": "Premium barkia for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/barkia.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/barkia.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20barkia"
  },
  {
    "id": "pvc-barkia",
    "name": "pvc-barkia",
    "category": "barkia",
    "description": "Premium pvc-barkia for your home and office.",
    "price": "Contact for Price",
    "media": [
      {
        "type": "image",
        "src": "/Products/barkia&pvc/pvc-barkia.webp"
      }
    ],
    "imageSrc": "/Products/barkia&pvc/pvc-barkia.webp",
    "whatsappLink": "https://wa.me/+97455512858?text=I'm%20interested%20in%20pvc-barkia"
  }
];

