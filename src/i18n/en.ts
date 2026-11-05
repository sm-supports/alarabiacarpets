/**
 * Interface strings. Page and product content lives in src/data; this holds the
 * text the components themselves own. src/i18n/ar.ts is typed against this
 * object, so a string missing from the Arabic file fails `tsc`.
 */
export const en = {
  brand: "Al Arabia Carpets",
  common: {
    logoAlt: "Al Arabia Carpets logo",
    home: "Home",
    products: "Products",
    services: "Services",
    guides: "Guides",
    faqTitle: "Frequently Asked Questions",
    helpfulReading: "Helpful reading",
    specifications: "Specifications",
    allProducts: "All Products",
    askOnWhatsApp: "Ask us on WhatsApp",
    contactOnWhatsApp: "Contact Us on WhatsApp",
    breadcrumb: "Breadcrumb",
    quoteMessage: (label: string) => `Hi, I'd like a quote for ${label}.`,
    floatMessage: "Hi Al Arabia Carpets, I'd like a quote.",
    floatLabel: "Chat with Al Arabia Carpets on WhatsApp",
    interestedMessage: (name: string) => `I'm interested in ${name}`,
    heroQuote: "Get a free quote on WhatsApp",
    notFound: {
      product: "Product Not Found",
      service: "Service Not Found",
      guide: "Guide Not Found",
    },
  },
  price: {
    contact: "Contact for Price",
    from: (amount: string, unit?: string) => `From QAR ${amount}${unit ? ` ${unit}` : ""}`,
    units: {
      "per sqm": "per sqm",
      "per piece": "per piece",
      "per project": "per project",
    } as Record<string, string>,
  },
  nav: {
    about: "About",
    contact: "Contact",
    getQuote: "Get Quote",
    getFreeQuote: "Get a Free Quote",
    freeDelivery: "Free delivery & installation in Qatar",
    toggleMenu: "Toggle menu",
    closeMenu: "Close menu",
    switchLabel: "العربية",
    switchShort: "ع",
    switchAria: "عرض الموقع بالعربية",
  },
  footer: {
    srTitle: "Site footer",
    tagline:
      "Premium home furnishing solutions in Qatar. Transform your space with our curated collection of carpets, sofas, and decorative elements.",
    address: "Al Mansoura St, Doha",
    company: "Company",
    aboutUs: "About Us",
    contact: "Contact",
    getStarted: "Get Started",
    getStartedText: "Ready to transform your space? Get in touch for a free consultation.",
    rights: (year: number) => `© ${year} Al Arabia Carpets. All rights reserved.`,
    freeDelivery: "Free Delivery & Installation in Qatar",
  },
  hero: {
    badge: "Premium Home Furnishings in Qatar",
    titleTop: "Transform Your Space",
    titleBottom: "Into Art",
    subtitle:
      "Discover handcrafted carpets, elegant majlis sofas, and premium home furnishings with complimentary delivery and installation throughout Qatar.",
    explore: "Explore Collection",
    ourServices: "Our Services",
    scroll: "Scroll to explore",
    freeDelivery: "Free Delivery",
    acrossQatar: "Across Qatar",
    freeInstallShort: "Free Install",
    proTeamShort: "Pro Team",
    customersCount: "1000+",
    customers: "Customers",
    freeInstall: "Free Installation",
    proTeam: "Professional Team",
    happyCustomers: "1000+ Happy",
  },
  trusted: {
    eyebrow: "Trusted Partners",
    title: "Trusted by Leading Organizations",
    stats: {
      customers: "Happy Customers",
      partners: "Trusted Partners",
      years: "Years Experience",
      satisfaction: "Satisfaction",
    },
  },
  showcase: {
    title: "Our Collection",
    subtitle:
      "Explore our curated selection of premium home furnishings, each piece crafted to transform your living space.",
    moreTitle: "More to Explore",
    moreSubtitle: "Discover our complete range of home furnishing solutions.",
    viewAll: "View All Products",
    viewRange: "View Range",
    moreAlt: (name: string) => `${name} by Al Arabia Carpets in Doha`,
    getQuote: "Get Quote",
    items: {
      carpet: {
        name: "Luxury Carpets",
        tagline: "Comfort Beneath Your Feet",
        description:
          "Soft, durable carpets crafted from premium materials. Transform any room with our extensive collection of patterns and textures.",
        features: ["Premium Materials", "Stain Resistant", "Custom Sizes"],
      },
      "majlis-sofa": {
        name: "Majlis Sofas",
        tagline: "Where Tradition Meets Comfort",
        description:
          "Contemporary majlis seating that honors tradition while embracing modern comfort. Custom designs available.",
        features: ["Custom Designs", "Premium Fabrics", "Traditional Craftsmanship"],
      },
      barkia: {
        name: "Premium Barkia",
        tagline: "Flooring Built for Qatar",
        description:
          "Waterproof, hard-wearing barkia and PVC flooring for majlis, villas and offices. Easy to clean and made to handle heat and heavy foot traffic.",
        features: ["Waterproof", "Easy to Clean", "Professional Fitting"],
      },
    } as Record<string, { name: string; tagline: string; description: string; features: string[] }>,
    more: {
      curtain: "Curtains",
      roller: "Roller Blinds",
      "grass-carpet": "Grass Carpet",
      interior: "Interior Design",
    } as Record<string, string>,
  },
  whyUs: {
    eyebrow: "Why Choose Us",
    title: "The Al Arabia Difference",
    subtitle: "We go beyond selling products. Every purchase includes these complimentary services.",
    items: {
      delivery: {
        title: "Free Delivery",
        description: "Complimentary delivery to your doorstep anywhere in Qatar.",
      },
      installation: {
        title: "Free Installation",
        description: "Professional installation by our expert team at no extra cost.",
      },
      consultation: {
        title: "Expert Consultation",
        description: "Personalized advice to find the perfect solutions for your space.",
      },
      guarantee: {
        title: "Quality Guarantee",
        description: "Premium materials and craftsmanship you can trust.",
      },
    },
    question: "Have questions about our services?",
  },
  contactSection: {
    titleTop: "Ready to Transform",
    titleBottom: "Your Space?",
    subtitle:
      "Get in touch with our team for personalized recommendations and a free quote. We're here to bring your vision to life.",
    chat: "Chat on WhatsApp",
    getInTouch: "Get in Touch",
    whatsapp: "WhatsApp",
    email: "Email",
    location: "Location",
    locationValue: "Al Mansoura St, Doha, Qatar",
    quickLinks: "Quick Links",
    viewProducts: "View Products",
    aboutUs: "About Us",
    callNow: "Call Now",
    sendMessage: "Send a Message",
    thanks: "Thank You!",
    thanksText: "We'll get back to you shortly.",
    name: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    message: "Message",
    messagePlaceholder: "Tell us about your project...",
    checkFailed: (phone: string, email: string) =>
      `We couldn't load the security check. Please reach us on WhatsApp at ${phone} or email ${email}.`,
    unavailable: (phone: string, email: string) =>
      `This form is temporarily unavailable. Please reach us on WhatsApp at ${phone} or email ${email}.`,
    sending: "Sending...",
    send: "Send Message",
    sentTitle: "Message sent successfully!",
    sentText: (name: string) => `Thank you ${name}, we'll contact you soon.`,
    errorTitle: "Something went wrong!",
    errorVerification: "Verification failed. Please complete the check and try again.",
    errorGeneric: "Please try again later or contact us directly.",
  },
  productCard: {
    inquire: "Inquire on WhatsApp",
    previous: "Previous image",
    next: "Next image",
    goToSlide: (n: number) => `Go to slide ${n}`,
    view: (n: number) => ` (view ${n})`,
    imageUnavailable: "Image unavailable",
    imageNotAvailable: "Image not available",
    playVideo: "Play video",
  },
  productsGrid: {
    heading: "All products",
    showing: "Showing",
    product: "product",
    products: "products",
  },
  productDetail: {
    back: "Back to Products",
    description: "Description",
    included: "What's Included",
    features: [
      "Free installation across Qatar",
      "Free delivery to your location",
      "Expert consultation included",
      "Premium quality materials",
    ],
    needHelp: "Need Help Choosing?",
    needHelpText: "Our team is ready to assist you in finding the perfect product for your home. Contact us directly!",
    moreIn: (label: string) => `More in ${label}`,
    viewAll: (label: string) => `View all ${label}`,
  },
  category: {
    whatWeOffer: "What we offer",
    weSupply: (label: string) => `${label} we supply`,
    exploreOther: "Explore our other ranges",
    ctaTitle: "Get a free measurement and quote",
    ctaText:
      "Send us a message on WhatsApp and our team in Doha will talk through the options, measure your space and quote — at no cost.",
  },
  service: {
    whatWeDo: "What we do",
    priceIncludes: "What the price includes",
    howItWorks: "How it works",
    projects: (label: string) => `Our ${label} projects`,
    relatedWork: "Related work",
    browse: (label: string) => `Browse ${label}`,
    relatedServices: "Related services",
    ctaTitle: "Get a free survey and quote",
    ctaText: "Message us on WhatsApp and our team in Doha will visit, measure and quote at no cost.",
    viewDetails: (label: string) => `View ${label} details`,
  },
  guide: {
    updated: "Updated",
    by: "by",
    dateLocale: "en-GB",
    browseRange: "Browse the full range",
    mentioned: "Products mentioned in this guide",
    ctaTitle: "Want advice for your own space?",
    ctaText:
      "Send us a message on WhatsApp and our team in Doha will talk through the options with you. Measurement and quotation are free.",
    adviceMessage: (title: string) => `Hi, I read your guide "${title}" and would like some advice.`,
    read: "Read the guide",
  },
  pages: {
    products: {
      title: "Products",
      description:
        "Browse premium carpets, Barkia, PVC flooring, curtains, furniture & interior design at Al Arabia Carpets. Free installation & delivery across Qatar.",
      heading: "Our Products",
      intro:
        "Browse our complete collection of premium home furnishings and decor products. All products come with free installation and delivery in Qatar.",
      byCategory: "Shop by category",
      pricingTitle: "Starting prices at Al Arabia Carpets",
      pricingText:
        "These are our starting prices in Qatari riyal. The final price depends on the product and the area, and we measure and quote free of charge anywhere in Qatar. Delivery and installation are free.",
      ctaTitle: "Can't Find What You're Looking For?",
      ctaText:
        "Contact us directly through WhatsApp and our team will help you find the perfect solution for your home.",
    },
    services: {
      title: "Services",
      description:
        "Flooring, carpet, cabinetry, wallpaper, sofa making and gypsum work supplied and installed across Qatar by Al Arabia Carpets in Doha.",
      heading: "Services",
      summary:
        "Al Arabia Carpets provides flooring, carpet, cabinet, wallpaper, gypsum and sofa work in Doha and across Qatar, with a free site survey and quotation for every job.",
      intro:
        "Fit-out work we carry out to measure, alongside our flooring, curtain and furniture ranges. Free survey and quotation anywhere in Qatar.",
    },
    guides: {
      title: "Guides",
      description:
        "Practical guides to carpets, barkia flooring, curtains and majlis design in Qatar, written by the Al Arabia Carpets team in Doha.",
      heading: "Guides",
      intro:
        "Practical advice on choosing carpets, barkia flooring, curtains and majlis furniture for homes and offices in Qatar.",
    },
    about: {
      title: "About Us",
      breadcrumb: "About",
      description:
        "Learn about Al Arabia Carpets - Qatar's trusted provider of premium carpets, Barkia, PVC flooring, curtains, furniture & interior design services in Doha.",
      heading: "About Al Arabia Carpets",
      intro: "Learn more about our company and commitment to quality home furnishings in Qatar.",
      storyTitle: "Our Story",
      story: [
        "Al Arabia Carpets was founded with a vision to bring premium home furnishing solutions to Qatar. We specialize in providing high-quality products including Barkia, PVC barkia, carpets, rollers, sofas, majlis sets, curtains, and grass carpets.",
        "What sets us apart is our commitment to quality, customer satisfaction, and our comprehensive service package that includes free installation, delivery, and expert consultation.",
        "Over the years, we've built a reputation for excellence in Qatar, serving both residential and commercial clients with products that blend functionality, durability, and aesthetic appeal.",
      ],
      imageAlt: "Al Arabia Carpets shopfront",
      valuesTitle: "Our Values",
      valuesIntro: "The principles that guide everything we do at Barkia Qatar.",
      values: [
        {
          title: "Quality",
          text: "We never compromise on the quality of our products, sourcing only the best materials and designs.",
        },
        {
          title: "Customer Satisfaction",
          text: "Your satisfaction is our priority. We go the extra mile to ensure you're happy with your purchase.",
        },
        {
          title: "Excellence",
          text: "From product selection to installation, we strive for excellence in every aspect of our service.",
        },
      ],
      whyTitle: "Why Choose Al Arabia Carpets",
      whyIntro: "Discover what makes our products and services stand out in Qatar.",
      why: [
        {
          title: "Premium Products",
          text: "All our products are carefully selected for their quality, durability, and design appeal.",
        },
        {
          title: "Free Services",
          text: "Enjoy free installation, delivery, and expert consultation with every purchase.",
        },
        {
          title: "Wide Selection",
          text: "From Barkia to majlis sofas, we offer a comprehensive range of home furnishing solutions.",
        },
        {
          title: "Customer Support",
          text: "Our responsive customer service team is always ready to assist you via WhatsApp.",
        },
      ],
      factsTitle: "Al Arabia Carpets at a glance",
      ctaTitle: "Ready to Transform Your Space?",
      ctaText: "Contact us today to discuss your home furnishing needs and discover how we can help.",
    },
    contact: {
      title: "Contact Us",
      breadcrumb: "Contact",
      description:
        "Contact Al Arabia Carpets in Doha for carpets, Barkia, PVC flooring, curtains, furniture and interior design. Free consultation, delivery and fitting.",
      heading: "Contact Al Arabia Carpets",
      intro:
        "Visit our showroom on Al Mansoura St in Doha, or reach us on WhatsApp for a free consultation and quote anywhere in Qatar.",
      visitTitle: "Visit our showroom in Doha",
      visitText:
        "Our showroom is on Al Mansoura St, Doha, Qatar. Come in to see carpet, Barkia and SPC flooring samples, curtain fabrics and majlis upholstery in person before you decide.",
      hoursTitle: "Opening hours",
      hoursText: (phone: string, email: string) =>
        `Every day, 8:00 AM to 10:00 PM. You can also message us on WhatsApp at ${phone} or email ${email}.`,
      areasTitle: "Areas we serve",
      areasText: "We work across Doha, Al Rayyan, Al Wakra, Al Khor and Lusail and the rest of Qatar, with free delivery and installation.",
      quoteTitle: "Get an accurate quote faster",
      quoteText: "Consultation, measurement and quotes are free. To help us price your project quickly, send us:",
      quoteItems: [
        "The room sizes or the approximate area in square metres",
        "A few photos of the space as it is now",
        "The product you have in mind, or a reference picture you like",
        "Your location in Qatar and when you would like the work done",
      ],
      quoteNote:
        "If you are not sure of the sizes, we can visit, take the measurements on site and recommend the right material for the room.",
      helpTitle: "What we can help with",
      categoryIn: (label: string) => `${label} in Doha`,
    },
  },
  /** Named-business answers, so AI tools and readers get who/where/what up front. */
  facts: {
    productSummary: (name: string, price?: string) =>
      `Al Arabia Carpets supplies and installs ${name} in Doha and across Qatar${price ? `, ${price.charAt(0).toLowerCase()}${price.slice(1)}` : ""}, with free delivery and installation.`,
    categorySummary: (label: string, price?: string) =>
      `Al Arabia Carpets is a Doha showroom supplying and fitting ${label} across Qatar${price ? `, ${price.charAt(0).toLowerCase()}${price.slice(1)}` : ""}, with free measurement, delivery and installation.`,
    serviceSummary: (label: string) =>
      `Al Arabia Carpets provides ${label} in Doha and across Qatar, with a free site survey and quotation.`,
    guideSummary: "This guide is written by Al Arabia Carpets, a home furnishing and flooring showroom on Al Mansoura St in Doha, Qatar.",
    whereTitle: (name: string) => `Where to get ${name} in Qatar`,
    whereText:
      "Al Arabia Carpets has a showroom on Al Mansoura St in Doha, open every day from 8:00 AM to 10:00 PM. You can see samples in person, or ask us to bring them to you. We deliver and install free of charge in Doha, Al Rayyan, Al Wakra, Al Khor, Lusail and the rest of Qatar, and measurement and quotation are free.",
    whereContact: (phone: string, email: string) => `WhatsApp ${phone} or email ${email}.`,
    whereTrack:
      "We have more than 10 years of experience and over 1000 customers in Qatar. To order, send us your room sizes and a few photos on WhatsApp, or ask us to visit and measure.",
  },
  home: {
    faqTitle: "Questions about Al Arabia Carpets",
    aboutTitle: "Carpets, flooring, curtains and furniture in Qatar",
    aboutIntro:
      "Al Arabia Carpets is a home furnishing and flooring company in Doha, with a showroom on Al Mansoura St. For more than 10 years we have supplied and installed the products below for villas, majlis, offices, mosques and shops across Qatar, with free delivery and installation.",
    aboutItems: (prices: Record<string, string>) => [
      { slug: "carpet", text: `Wall-to-wall carpet, rugs, stair carpet and mosque carpet for every room. ${prices.carpet}.` },
      { slug: "barkia", text: `Waterproof barkia, PVC and SPC flooring for villas, kitchens and busy family rooms. ${prices.barkia}.` },
      { slug: "curtain", text: `Made-to-measure curtains and roller blinds, with fabrics you can see in our showroom. ${prices.curtain}.` },
      { slug: "majlis-sofa", text: `Custom majlis seating and sofas, made to the room's measurements. ${prices["majlis-sofa"]}.` },
      { slug: "interior", text: "Interior fit-out including gypsum work, cabinets, wall panels and TV units, quoted free after a site survey." },
    ],
    faqs: (carpetPrice: string, barkiaPrice: string) => [
      {
        q: "Where can I buy carpets and flooring in Doha?",
        a: "Al Arabia Carpets has a showroom on Al Mansoura St in Doha, open every day from 8:00 AM to 10:00 PM. We supply carpets, barkia and PVC flooring, curtains, majlis sofas and interior fit-out across Qatar.",
      },
      {
        q: "Does Al Arabia Carpets offer free delivery and installation?",
        a: "Yes. Delivery and installation are free across Qatar, including Doha, Al Rayyan, Al Wakra, Al Khor and Lusail. Consultation, measurement and quotation are free as well.",
      },
      {
        q: "How much do carpets and barkia cost in Qatar?",
        a: `At Al Arabia Carpets, carpets start ${carpetPrice.charAt(0).toLowerCase()}${carpetPrice.slice(1)} and barkia starts ${barkiaPrice.charAt(0).toLowerCase()}${barkiaPrice.slice(1)}. The final price depends on the material and the area, and we quote it free after measuring.`,
      },
      {
        q: "How do I get a quote from Al Arabia Carpets?",
        a: "Message us on WhatsApp at +974 5551 2858 with your room sizes and a few photos, or visit the showroom. If you are unsure of the sizes, we visit, measure on site and recommend the right material.",
      },
      {
        q: "Can I see samples before I decide?",
        a: "Yes. You can compare carpet, barkia and SPC flooring samples, curtain fabrics and majlis upholstery in person at our showroom in Doha, or we can bring samples to you when we visit to measure.",
      },
      {
        q: "Does Al Arabia Carpets work with offices, mosques and businesses?",
        a: "Yes. As well as homes and villas, we supply and fit carpet, flooring and curtains for offices, mosques, shops and event spaces across Qatar.",
      },
    ],
  },
};

export type Dict = typeof en;
