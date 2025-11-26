import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const categories = {
    all: { label: "All Products" },
    barkia: { label: "Barkia & PVC" },
    carpet: { label: "Carpets" },
    furniture: { label: "Furniture" },
    curtains: { label: "Curtains" },
    interior: { label: "Interior Design" }
  };

  const allProducts = [
    {
      id: "premium-barkia",
      name: "Premium Barkia",
      description: "High-quality Barkia panels for elegant room separation and decoration.",
      imageSrc: "/barkia&pvc/barkia.webp",
      category: "barkia",
      price: "Starting from 350 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Premium%20Barkia"
    },
    {
      id: "pvc-barkia",
      name: "PVC Barkia",
      description: "Durable and water-resistant PVC Barkia perfect for high-moisture areas.",
      imageSrc: "/pvc-barkia.webp",
      category: "barkia",
      price: "Starting from 250 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20PVC%20Barkia"
    },
    {
      id: "al-wakra-white-spc",
      name: "Al Wakra White SPC",
      description: "Ultra-modern waterproof SPC flooring with a clean white finish. Perfect for contemporary spaces.",
      imageSrc: "/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp",
      category: "barkia",
      price: "Starting from 280 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Al%20Wakra%20White%20SPC%20Flooring"
    },
    {
      id: "arabian-night-espresso-spc",
      name: "Arabian Night Espresso SPC",
      description: "High-end waterproof SPC flooring with rich espresso tones. Adds warmth and elegance to any room.",
      imageSrc: "/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp",
      category: "barkia",
      price: "Starting from 320 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Arabian%20Night%20Espresso%20SPC"
    },
    {
      id: "desert-walnut-classic-spc",
      name: "Desert Walnut Classic SPC",
      description: "Luxury SPC flooring featuring timeless walnut patterns. Brings natural beauty to your Doha home.",
      imageSrc: "/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp",
      category: "barkia",
      price: "Starting from 300 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Desert%20Walnut%20Classic%20SPC"
    },
    {
      id: "doha-coastal-grey-spc",
      name: "Doha Coastal Grey SPC",
      description: "Premium rigid core SPC vinyl with sophisticated grey tones. Inspired by Qatar's coastal beauty.",
      imageSrc: "/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp",
      category: "barkia",
      price: "Starting from 290 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Doha%20Coastal%20Grey%20SPC"
    },
    {
      id: "pearl-grey-herringbone-spc",
      name: "Pearl Grey Herringbone SPC",
      description: "100% waterproof SPC flooring with elegant herringbone pattern. A sophisticated choice for Qatar homes.",
      imageSrc: "/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp",
      category: "barkia",
      price: "Starting from 350 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Pearl%20Grey%20Herringbone%20SPC"
    },
    {
      id: "qatar-breeze-oak-spc",
      name: "Qatar Breeze Oak SPC",
      description: "Bright and waterproof SPC flooring with refreshing oak finish. Creates an airy, open atmosphere.",
      imageSrc: "/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp",
      category: "barkia",
      price: "Starting from 275 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Qatar%20Breeze%20Oak%20SPC"
    },
    {
      id: "qatar-sand-oak-spc",
      name: "Qatar Sand Oak SPC",
      description: "Luxury waterproof SPC flooring inspired by Qatar's desert landscapes. Warm sand-toned oak finish.",
      imageSrc: "/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp",
      category: "barkia",
      price: "Starting from 285 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Qatar%20Sand%20Oak%20SPC"
    },
    {
      id: "royal-mahogany-spc",
      name: "Royal Mahogany SPC",
      description: "Luxury waterproof vinyl SPC with rich mahogany finish. Exudes royal elegance and sophistication.",
      imageSrc: "/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp",
      category: "barkia",
      price: "Starting from 340 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Royal%20Mahogany%20SPC"
    },
    {
      id: "scandinavian-white-oak-spc",
      name: "Scandinavian White Oak SPC",
      description: "Modern waterproof SPC flooring with minimalist Scandinavian design. Clean lines, bright finish.",
      imageSrc: "/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp",
      category: "barkia",
      price: "Starting from 295 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Scandinavian%20White%20Oak%20SPC"
    },
    {
      id: "sunset-teak-gold-spc",
      name: "Sunset Teak Gold SPC",
      description: "Elegant SPC vinyl flooring with warm golden teak tones. Captures the beauty of Qatar sunsets.",
      imageSrc: "/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp",
      category: "barkia",
      price: "Starting from 310 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Sunset%20Teak%20Gold%20SPC"
    },
    {
      id: "luxury-carpets",
      name: "Luxury Carpets",
      description: "Soft, durable carpets that add comfort and style to any room.",
      imageSrc: "/carpet.webp",
      category: "carpet",
      price: "Starting from 120 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20Carpets"
    },
    {
      id: "grass-carpet",
      name: "Grass Carpet",
      description: "Natural-looking grass carpets ideal for outdoor areas and balconies.",
      imageSrc: "/grass-carpet.webp",
      category: "carpet",
      price: "Starting from 80 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Grass%20Carpet"
    },
    {
      id: "roller-blinds",
      name: "Roller Blinds",
      description: "Modern roller blinds providing privacy and light control.",
      imageSrc: "/roller.webp",
      category: "curtains",
      price: "Starting from 180 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Roller%20Blinds"
    },
    {
      id: "elegant-curtains",
      name: "Elegant Curtains",
      description: "Beautiful curtains to enhance the ambiance of your living spaces.",
      imageSrc: "/curtain.webp",
      category: "curtains",
      price: "Starting from 150 QAR/sqm",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Elegant%20Curtains"
    },
    {
      id: "modern-sofas",
      name: "Modern Sofas",
      description: "Contemporary sofas designed for comfort and style.",
      imageSrc: "/sofa.webp",
      category: "furniture",
      price: "Starting from 1,800 QAR",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Modern%20Sofas"
    },
    {
      id: "majlis-sets",
      name: "Majlis Sets",
      description: "Traditional yet modern majlis sets perfect for Qatari homes.",
      imageSrc: "/majlis-sofa.webp",
      category: "furniture",
      price: "Starting from 4,500 QAR",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Majlis%20Sets"
    },
    {
      id: "luxury-interior-design",
      name: "Luxury Interior Design",
      description: "Complete interior design service tailored to your preferences and lifestyle.",
      imageSrc: "/interior.webp",
      category: "interior",
      price: "Starting from 10,000 QAR",
      whatsappLink: "https://wa.me/+97455512858?text=I'm%20interested%20in%20Luxury%20Interior%20Design%20Services"
    }
  ];

  const filteredProducts =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter(product => product.category === activeCategory);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setDialogOpen(false);
  };

  const renderCategoryTabs = () => (
    <TabsList className="bg-white p-1 w-full justify-center">
      {Object.entries(categories).map(([key, { label }]) => (
        <TabsTrigger
          key={key}
          value={key}
          className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-bold whitespace-nowrap"
        >
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
            <p className="font-poppins max-w-2xl mx-auto">
              Browse our complete collection of premium home furnishings and décor products.
              All products come with free installation and delivery in Qatar.
            </p>
          </div>
        </div>

        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            {isMobile ? (
              <div className="mb-8 flex justify-center">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2.5 border border-primary/30 shadow-md bg-white py-3.5 px-5 rounded-xl"
                    >
                      <Filter size={18} className="text-accent" />
                      <span className="font-medium text-base text-primary">{categories[activeCategory].label}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white p-0 max-w-[95%] rounded-xl border-2 border-accent/20 shadow-lg">
                    <DialogHeader className="border-b border-accent/10 py-4 bg-secondary/50">
                      <DialogTitle className="text-center text-xl font-bold text-primary">
                        Choose Category
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(categories).map(([key, { label }]) => (
                          <Button
                            key={key}
                            variant={activeCategory === key ? "default" : "outline"}
                            className={`w-full justify-center py-3 text-sm font-medium transition-all
                              ${activeCategory === key 
                                ? "bg-primary hover:bg-accent text-white shadow-md" 
                                : "bg-white text-primary hover:bg-secondary border-accent/20 hover:border-accent/40"
                              } 
                              border rounded-lg`}
                            onClick={() => handleCategorySelect(key)}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
                <div className="flex justify-center">
                  {renderCategoryTabs()}
                </div>
              </Tabs>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    description={product.description}
                    imageSrc={product.imageSrc}
                    whatsappLink={product.whatsappLink}
                    onClick={() => handleProductClick(product.id)}
                    priority={index < 4} // Load first 4 images immediately
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="font-poppins text-lg">No products found in this category.</p>
                <Button onClick={() => setActiveCategory("all")} className="mt-4 bg-primary hover:bg-accent text-white">
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8">
              Contact us directly through WhatsApp and our team will help you find the perfect solution for your home.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <a href="https://wa.me/+97455512858" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <Phone size={16} />
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

export default Products;
