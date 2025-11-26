
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, Check, ImageIcon } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  category: string;
  price: string;
  whatsappLink: string;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Simulated data fetch - in a real app, fetch from an API
    const allProducts = [
      {
        id: "premium-barkia",
        name: "Premium Barkia",
        description: "High-quality Barkia panels for elegant room separation and decoration. Our premium Barkia panels are crafted from the finest materials and designed to add a touch of elegance to any space. Perfect for home or office, these panels offer both aesthetic appeal and functionality.",
        imageSrc: "/barkia&pvc/barkia.webp",
        category: "barkia",
        price: "Starting from 350 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Premium%20Barkia"
      },
      {
        id: "pvc-barkia",
        name: "PVC Barkia",
        description: "Durable and water-resistant PVC Barkia perfect for high-moisture areas. These innovative panels combine the beauty of traditional Barkia with the practicality of PVC, making them ideal for bathrooms, kitchens, and other areas exposed to moisture or humidity.",
        imageSrc: "/pvc-barkia.webp",
        category: "barkia",
        price: "Starting from 250 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20PVC%20Barkia"
      },
      {
        id: "al-wakra-white-spc",
        name: "Al Wakra White SPC",
        description: "Ultra-modern waterproof SPC flooring with a clean white finish. This premium flooring solution is perfect for contemporary spaces, offering exceptional durability and a sleek aesthetic. Ideal for living rooms, bedrooms, and commercial areas seeking a bright, modern look.",
        imageSrc: "/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp",
        category: "barkia",
        price: "Starting from 280 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Al%20Wakra%20White%20SPC%20Flooring"
      },
      {
        id: "arabian-night-espresso-spc",
        name: "Arabian Night Espresso SPC",
        description: "High-end waterproof SPC flooring with rich espresso tones that add warmth and elegance to any room. This luxurious flooring option combines the beauty of dark wood with the practical benefits of waterproof SPC technology. Perfect for creating sophisticated, inviting interiors.",
        imageSrc: "/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp",
        category: "barkia",
        price: "Starting from 320 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Arabian%20Night%20Espresso%20SPC"
      },
      {
        id: "desert-walnut-classic-spc",
        name: "Desert Walnut Classic SPC",
        description: "Luxury SPC flooring featuring timeless walnut patterns that bring natural beauty to your Doha home. The classic walnut grain provides an elegant foundation for any interior design scheme. Waterproof, durable, and perfect for Qatar's climate.",
        imageSrc: "/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp",
        category: "barkia",
        price: "Starting from 300 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Desert%20Walnut%20Classic%20SPC"
      },
      {
        id: "doha-coastal-grey-spc",
        name: "Doha Coastal Grey SPC",
        description: "Premium rigid core SPC vinyl with sophisticated grey tones inspired by Qatar's beautiful coastal scenery. This elegant flooring offers superior stability and waterproof performance, making it ideal for any room in your home or office.",
        imageSrc: "/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp",
        category: "barkia",
        price: "Starting from 290 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Doha%20Coastal%20Grey%20SPC"
      },
      {
        id: "pearl-grey-herringbone-spc",
        name: "Pearl Grey Herringbone SPC",
        description: "100% waterproof SPC flooring with an elegant herringbone pattern in sophisticated pearl grey. This distinctive design adds architectural interest and timeless style to any space. A premium choice for discerning homeowners in Qatar.",
        imageSrc: "/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp",
        category: "barkia",
        price: "Starting from 350 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Pearl%20Grey%20Herringbone%20SPC"
      },
      {
        id: "qatar-breeze-oak-spc",
        name: "Qatar Breeze Oak SPC",
        description: "Bright and waterproof SPC flooring with a refreshing oak finish that creates an airy, open atmosphere. Perfect for those seeking to maximize natural light and create spacious-feeling interiors. Combines beauty with exceptional durability.",
        imageSrc: "/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp",
        category: "barkia",
        price: "Starting from 275 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Qatar%20Breeze%20Oak%20SPC"
      },
      {
        id: "qatar-sand-oak-spc",
        name: "Qatar Sand Oak SPC",
        description: "Luxury waterproof SPC flooring inspired by Qatar's majestic desert landscapes. The warm sand-toned oak finish creates a welcoming atmosphere while providing the practical benefits of modern SPC technology. Perfect for creating cozy, elegant spaces.",
        imageSrc: "/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp",
        category: "barkia",
        price: "Starting from 285 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Qatar%20Sand%20Oak%20SPC"
      },
      {
        id: "royal-mahogany-spc",
        name: "Royal Mahogany SPC",
        description: "Luxury waterproof vinyl SPC with a rich mahogany finish that exudes royal elegance and sophistication. This premium flooring option transforms any space into a showcase of refined taste. The deep, warm tones create an atmosphere of luxury and comfort.",
        imageSrc: "/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp",
        category: "barkia",
        price: "Starting from 340 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Royal%20Mahogany%20SPC"
      },
      {
        id: "scandinavian-white-oak-spc",
        name: "Scandinavian White Oak SPC",
        description: "Modern waterproof SPC flooring with minimalist Scandinavian design. Clean lines and a bright finish create a fresh, contemporary look that complements any modern interior. Perfect for those who appreciate understated elegance and functional beauty.",
        imageSrc: "/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp",
        category: "barkia",
        price: "Starting from 295 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Scandinavian%20White%20Oak%20SPC"
      },
      {
        id: "sunset-teak-gold-spc",
        name: "Sunset Teak Gold SPC",
        description: "Elegant SPC vinyl flooring with warm golden teak tones that capture the beauty of Qatar sunsets. This stunning flooring option adds warmth and character to any space. The rich golden hues create an inviting atmosphere perfect for family gatherings.",
        imageSrc: "/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp",
        category: "barkia",
        price: "Starting from 310 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Sunset%20Teak%20Gold%20SPC"
      },
      {
        id: "luxury-carpets",
        name: "Luxury Carpets",
        description: "Soft, durable carpets that add comfort and style to any room. Our luxury carpets are made from premium materials that provide exceptional comfort underfoot while enhancing your interior décor. Available in various designs, colors, and textures to suit your preferences.",
        imageSrc: "/carpet.webp",
        category: "carpet",
        price: "Starting from 120 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20Carpets"
      },
      {
        id: "grass-carpet",
        name: "Grass Carpet",
        description: "Natural-looking grass carpets ideal for outdoor areas and balconies. These synthetic grass carpets offer the lush appearance of natural grass without the maintenance. Perfect for balconies, patios, and play areas, they're UV-resistant and designed to withstand Qatar's climate.",
        imageSrc: "/grass-carpet.webp",
        category: "carpet",
        price: "Starting from 80 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Grass%20Carpet"
      },
      {
        id: "roller-blinds",
        name: "Roller Blinds",
        description: "Modern roller blinds providing privacy and light control. Our roller blinds combine functionality with style, offering precise control over light and privacy. Available in various fabrics and opacity levels, they're a sleek, contemporary solution for any window.",
        imageSrc: "/roller.webp",
        category: "curtains",
        price: "Starting from 180 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Roller%20Blinds"
      },
      {
        id: "elegant-curtains",
        name: "Elegant Curtains",
        description: "Beautiful curtains to enhance the ambiance of your living spaces. Our selection includes a variety of fabrics, patterns, and designs that can transform any room. From sheer voiles to blackout options, we have curtains to suit every need and décor style.",
        imageSrc: "/curtain.webp",
        category: "curtains",
        price: "Starting from 150 QAR/sqm",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Elegant%20Curtains"
      },
      {
        id: "modern-sofas",
        name: "Modern Sofas",
        description: "Contemporary sofas designed for comfort and style. Our modern sofas combine sleek design with exceptional comfort, creating the perfect centerpiece for your living space. Available in various sizes, configurations, and upholstery options to complement your interior design.",
        imageSrc: "/sofa.webp",
        category: "furniture",
        price: "Starting from 1800 QAR",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Modern%20Sofas"
      },
      {
        id: "majlis-sets",
        name: "Majlis Sets",
        description: "Traditional yet modern majlis sets perfect for Qatari homes. Our majlis sets honor cultural traditions while incorporating contemporary comfort and style. Each set is carefully crafted with attention to detail, providing a welcoming space for family gatherings and entertaining guests.",
        imageSrc: "/majlis-sofa.webp",
        category: "furniture",
        price: "Starting from 4500 QAR",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Majlis%20Sets"
      },
      {
        id: "luxury-interior-design",
        name: "Luxury Interior Design",
        description: "Complete interior design service tailored to your preferences and lifestyle. Our expert designers work closely with you to create bespoke interiors that reflect your personality and enhance your living experience. From concept to completion, we handle every aspect of the design process.",
        imageSrc: "/interior.webp",
        category: "interior",
        price: "Starting from 10000 QAR",
        whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20Interior%20Design%20Services"
      }
    ];

    setTimeout(() => {
      const foundProduct = allProducts.find(p => p.id === productId);
      setProduct(foundProduct || null);
      setLoading(false);
    }, 300); // Simulate loading
  }, [productId]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse font-poppins text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center flex-col p-4">
          <h2 className="font-playfair text-2xl mb-4">Product Not Found</h2>
          <p className="font-poppins mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Product Details Section */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => navigate('/products')}
              >
                <ChevronLeft size={16} />
                Back to Products
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product Image */}
              <div className="h-[300px] md:h-[500px] relative overflow-hidden bg-gray-100">
                {/* Loading state */}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Error state */}
                {imageError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-gray-500 text-center p-6">
                      <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
                      <div className="text-lg font-medium mb-2">Image not available</div>
                      <div className="text-sm text-gray-400">{product?.name}</div>
                    </div>
                  </div>
                )}
                
                {/* Main image */}
                <img 
                  src={product?.imageSrc} 
                  alt={product?.name} 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                  style={{ display: imageError ? 'none' : 'block' }}
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
                    <p className="font-poppins font-medium text-lg text-primary">{product.price}</p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">Description</h2>
                    <p className="font-poppins text-muted-foreground">{product.description}</p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="font-playfair text-xl font-semibold mb-3">Features</h2>
                    <ul className="font-poppins space-y-2">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-primary" />
                        Free installation across Qatar
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-primary" />
                        Free delivery to your location
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-primary" />
                        Expert consultation included
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-primary" />
                        Premium quality materials
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full bg-primary hover:bg-accent text-white flex items-center justify-center gap-2"
                  >
                    <a 
                      href={product.whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ShoppingCart size={18} />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8">
              Our team is ready to assist you in finding the perfect product for your home. Contact us directly!
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <a 
                href="https://wa.me/+97455512858" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ShoppingCart size={16} />
                <span>Contact Us on WhatsApp</span>
              </a>
            </Button>
          </div>
        </section>
      </main>
  <Footer />
    </div>
  );
};

export default ProductDetail;
