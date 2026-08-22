import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { trackWhatsAppClick } from "@/lib/analytics";

// Showcase presentation config - resolved dynamically from products data
const showcaseConfig = [
  {
    preferredId: "carpet",
    category: "carpet",
    name: "Luxury Carpets",
    tagline: "Comfort Beneath Your Feet",
    description: "Soft, durable carpets crafted from premium materials. Transform any room with our extensive collection of patterns and textures.",
    features: ["Premium Materials", "Stain Resistant", "Custom Sizes"],
    color: "forest" as const,
  },
  {
    preferredId: "majlis-sofa",
    category: "furniture",
    name: "Majlis Sofas",
    tagline: "Where Tradition Meets Comfort",
    description: "Contemporary majlis seating that honors tradition while embracing modern comfort. Custom designs available.",
    features: ["Custom Designs", "Premium Fabrics", "Traditional Craftsmanship"],
    color: "gold" as const,
  },
  {
    preferredId: "barkia",
    category: "barkia",
    name: "Premium Barkia",
    tagline: "Elegant Room Dividers",
    description: "High-quality Barkia panels for elegant room separation and decoration. Perfect for creating distinct spaces with style.",
    features: ["Multiple Designs", "Easy Installation", "Durable Materials"],
    color: "teal" as const,
  },
];

// Build showcases dynamically from real product data
const productShowcases = showcaseConfig
  .map(config => {
    const product = products.find(p => p.id === config.preferredId)
      || products.find(p => p.category === config.category);
    if (!product) return null;
    return {
      id: product.id,
      imageSrc: product.imageSrc,
      whatsappLink: product.whatsappLink,
      name: config.name,
      tagline: config.tagline,
      description: config.description,
      features: config.features,
      color: config.color,
    };
  })
  .filter((item): item is NonNullable<typeof item> => item !== null);

// Additional products config - resolved dynamically
const additionalProductConfig = [
  { preferredId: "curtain", category: "curtains", displayName: "Curtains" },
  { preferredId: "roller", category: "curtains", displayName: "Roller Blinds" },
  { preferredId: "grass-carpet", category: "carpet", displayName: "Grass Carpet" },
  { preferredId: "sofa", category: "furniture", displayName: "Modern Sofas" },
];

const additionalProducts = additionalProductConfig
  .map(config => {
    const product = products.find(p => p.id === config.preferredId)
      || products.find(p => p.category === config.category);
    if (!product) return null;
    return {
      id: product.id,
      name: config.displayName,
      imageSrc: product.imageSrc,
      link: `/products/${product.id}`,
    };
  })
  .filter((item): item is NonNullable<typeof item> => item !== null)
  .filter((item, index, arr) => arr.findIndex(p => p.id === item.id) === index);

// Individual product showcase component
function ProductShowcase({ 
  product, 
  index, 
  isVisible 
}: { 
  product: typeof productShowcases[0]; 
  index: number;
  isVisible: boolean;
}) {
  const isReversed = index % 2 === 1;
  
  const colorClasses = {
    forest: {
      badge: 'bg-forest-100 text-forest-700',
      accent: 'text-forest-600',
      button: 'bg-forest-900 hover:bg-forest-700',
    },
    gold: {
      badge: 'bg-gold-100 text-gold-700',
      accent: 'text-gold-600',
      button: 'bg-gold-600 hover:bg-gold-500',
    },
    teal: {
      badge: 'bg-teal-100 text-teal-700',
      accent: 'text-teal-600',
      button: 'bg-teal-600 hover:bg-teal-500',
    },
  }[product.color];

  return (
    <div className={`py-12 sm:py-16 lg:py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center"
        >
          {/* Image - Shows first on mobile */}
          <div
            className={`order-1 ${isReversed ? 'lg:order-2' : 'lg:order-1'} transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-elevated sm:shadow-float group">
              <img
                src={product.imageSrc}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding={index === 0 ? "sync" : "async"}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Content */}
          <div
            className={`order-2 ${isReversed ? 'lg:order-1' : 'lg:order-2'} transition-all duration-1000 ease-out-expo ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: `${index * 100 + 150}ms` }}
          >
            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full ${colorClasses.badge}`}>
              {product.name}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-forest-900 mb-3 sm:mb-4 leading-tight">
              {product.tagline}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg">
              {product.description}
            </p>
            
            {/* Features - Horizontal scroll on mobile */}
            <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {product.features.map((feature) => (
                <span 
                  key={feature}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-700 whitespace-nowrap flex-shrink-0"
                >
                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClasses.accent} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </span>
              ))}
            </div>

            {/* CTAs - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to={`/products/${product.id}`}
                className={`group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3 text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-float active:scale-[0.98] ${colorClasses.button}`}
              >
                View Details
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={product.whatsappLink}
                onClick={() => trackWhatsAppClick(`showcase:${product.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3 bg-white text-forest-900 text-sm font-medium rounded-full border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
              >
                Get Quote
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '-30px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-index]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="relative">
      {/* Section Header */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-forest-900 mb-3 sm:mb-4">
            Our Collection
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Explore our curated selection of premium home furnishings, each piece 
            crafted to transform your living space.
          </p>
        </div>
        </div>
        
      {/* Product Showcases */}
      {productShowcases.map((product, index) => (
        <div key={product.id} data-index={index}>
          <ProductShowcase
            product={product}
            index={index}
            isVisible={visibleItems.has(index)}
          />
        </div>
      ))}

      {/* Additional Products Grid */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-forest-900 mb-3 sm:mb-4">
              More to Explore
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Discover our complete range of home furnishing solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {additionalProducts.map((product, index) => (
              <Link
                key={product.id}
                to={product.link}
                data-index={productShowcases.length + index}
                className={`group relative aspect-[4/5] sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-700 ease-out-expo hover:shadow-float active:scale-[0.98] ${
                  visibleItems.has(productShowcases.length + index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img
                  src={product.imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-3 sm:p-4 lg:p-5">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white text-sm sm:text-base font-medium">{product.name}</span>
                    <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group-hover:bg-white">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-forest-900" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        
          {/* View All CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-forest-900 text-white text-sm sm:text-base font-medium rounded-full transition-all duration-300 hover:bg-forest-700 hover:shadow-float active:scale-[0.98] w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
            >
              View All Products
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
