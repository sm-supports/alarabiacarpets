/**
 * The interface strings client components read, kept apart from the rest of en.ts
 * so the browser only downloads these. en.ts spreads them back in, so server code
 * sees one dictionary. A client component that needs a string from outside this
 * file fails `tsc`: move the string's section here, in this file and in ar.client.ts.
 */
export const enClient = {
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
    /**
     * The CTA vocabulary (the plan's Component specs, held by scripts/check-consistency.mjs):
     * heroQuote in heroes and closing sections, nav.getFreeQuote on the bar, menu, footer
     * and product cards, statePanel.call wherever a button calls. Two exceptions:
     * askOnWhatsApp on guides only, because what a guide offers is advice, and nav.getQuote
     * on the desktop header button only (the owner's decision of 2026-11-09).
     */
    askOnWhatsApp: "Ask us on WhatsApp",
    breadcrumb: "Breadcrumb",
    /** Every product and service prefill, cards included. */
    quoteMessage: (label: string) => `Hi, I'd like a quote for ${label}.`,
    floatMessage: "Hi Al Arabia Carpets, I'd like a quote.",
    floatLabel: "Chat with Al Arabia Carpets on WhatsApp",
    heroQuote: "Get a free quote on WhatsApp",
    /** S16: what ImageFallback writes under the alt text of a catalog photo or video that failed. */
    imageUnavailable: "Image unavailable",
    videoUnavailable: "Video unavailable",
    notFound: {
      product: "Product Not Found",
      service: "Service Not Found",
      guide: "Guide Not Found",
    },
  },
  nav: {
    about: "About",
    contact: "Contact",
    /** The desktop header button only, md and up: the owner kept the old label on 2026-11-09
     *  so the desktop nav doesn't move. Phones, the menu and the footer use getFreeQuote. */
    getQuote: "Get Quote",
    getFreeQuote: "Get a Free Quote",
    freeDelivery: "Free delivery & installation in Qatar",
    toggleMenu: "Toggle menu",
    closeMenu: "Close menu",
    menu: "Menu",
    switchLabel: "العربية",
    switchShort: "ع",
    switchAria: "عرض الموقع بالعربية",
    /** The phone menu's Live chat row (S18 in the plan's state catalogue). */
    liveChat: "Live chat",
    chatOpening: "Opening chat…",
    chatFailed: "Chat didn't open. Use WhatsApp or call.",
  },
  /** The action bar's WhatsApp prefill: the quote line, then this line for the visitor to fill in, then the page. */
  bar: {
    size: "Size:",
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
    clients:
      "Clients include Ezdan Real Estate, Ezdan Mall, Doha Festival City, Al Muftah Group, Al Khalij Cement Company, Petro Guard Offshore Supplies, Enormous Trading and Contracting, Aquatech for Trading & Contracting, New Star Contracting, Asia Engineering & Services, Grade One, Inworth and Al Anaqh Event Planning.",
    stats: {
      customers: "Happy Customers",
      partners: "Trusted Partners",
      years: "Years Experience",
      satisfaction: "Satisfaction",
    },
  },
  contactSection: {
    titleTop: "Ready to Transform",
    titleBottom: "Your Space?",
    subtitle:
      "Get in touch with our team for personalized recommendations and a free quote. We're here to bring your vision to life.",
    getInTouch: "Get in Touch",
    whatsapp: "WhatsApp",
    email: "Email",
    location: "Location",
    locationValue: "Al Mansoura St, Doha, Qatar",
    quickLinks: "Quick Links",
    viewProducts: "View Products",
    aboutUs: "About Us",
    sendMessage: "Send a Message",
    name: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    message: "Message",
    messagePlaceholder: "Tell us about your project...",
    sending: "Sending...",
    stillSending: "Still sending. This can take a moment on a slow connection.",
    send: "Send Message",
  },
  /**
   * What the contact form says: the plan's state catalogue (S5 to S13, S19).
   * {name}, {email}, {ref} and {time} are filled in by ContactSection, inside <bdi>.
   */
  formStates: {
    sentBadge: "SENT",
    refLabel: "REF",
    notSentBadge: "NOT SENT",
    noReplyBadge: "NO REPLY",
    offlineBadge: "OFFLINE",
    draftSavedBadge: "DRAFT SAVED",
    kept: "Your text is still here.",
    open: "We're open every day, 8:00 AM to 10:00 PM.",
    calls: "Calls don't need internet.",
    checking: "Running a quick security check. Your message sends when it finishes.",
    challenge: "Tap the box below to finish the check.",
    sent: "We have your message, {name}.",
    sentReply: "We'll reply to {email}.",
    sentNext: "Next: send sizes and photos on WhatsApp.",
    refused: "Our email service didn't accept your message.",
    unreachable: "We couldn't reach the site.",
    noReply: "We didn't get a reply, so your message may have arrived.",
    noReplyNext: "Trying again won't send it twice.",
    checkDown: "We can't run the security check right now.",
    checkRejected: "The security check didn't pass.",
    checkRetry: "Press Send to retry.",
    offline: "Turn on Wi-Fi or mobile data, then press Send.",
    online: "You're back online.",
    onlineNext: "Press Send when ready.",
    restored: "Draft restored.",
    alreadySent: "Already sent at {time}.",
    addName: "Add your name.",
    addEmail: "Add the full email, like name@gmail.com.",
    addMessage: "Add your message.",
    longName: "Shorten your name to 100 characters.",
    longEmail: "Shorten the email to 254 characters.",
    longMessage: "Shorten your message to 5,000 characters.",
    shortened: "Message shortened; full text is here.",
    correct: "Correct and resend",
    continueOnWhatsApp: "Continue on WhatsApp",
    sendOnWhatsApp: "Send this on WhatsApp",
    tryAgain: "Try again",
    send: "Send",
    copy: "Copy",
    copied: "Copied",
    followUp: "Hi, I sent a message on your website, REF {ref}. Here are my sizes and photos.",
  },
  /**
   * After a WhatsApp or Call tap on a phone (S1 to S4 in the plan's state catalogue,
   * lib/feedback.ts). S3 adds formStates.open; Call, Close and Get a Free Quote are shared.
   */
  tapFeedback: {
    whatsAppOpened: "WhatsApp opened. Nothing is sent until you press send.",
    whatsAppOpenedNext: "Add sizes and photos so we can prepare your quote.",
    backToWhatsApp: "Back to WhatsApp",
    stillHere: "Still here? WhatsApp may not have opened.",
    callBack: "Couldn't get through?",
    offline: "You look offline. WhatsApp may not open.",
  },
  statePanel: {
    close: "Close",
    call: "Call",
    reload: "Reload",
    pageFailed: "This page didn't load.",
    draftSaved: "Your message is saved.",
  },
  productCard: {
    previous: "Previous image",
    next: "Next image",
    goToSlide: (n: number) => `Go to slide ${n}`,
    view: (n: number) => ` (view ${n})`,
    playVideo: "Play video",
  },
};

export type ClientDict = typeof enClient;
