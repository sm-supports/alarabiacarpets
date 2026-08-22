import { useState } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { products } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(product => product.category === activeCategory);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setDialogOpen(false);
  };

  const renderCategoryTabs = () => (
    <TabsList className="bg-white/80 backdrop-blur-sm p-1.5 w-full justify-center rounded-xl shadow-sm border border-neutral-100">
      {Object.entries(categories).map(([key, { label }]) => (
        <TabsTrigger
          key={key}
          value={key}
          className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md whitespace-nowrap rounded-lg transition-all duration-300 text-sm px-4 py-2"
        >
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Products"
        description="Browse premium carpets, Barkia, PVC flooring, curtains, furniture & interior design products at Al Arabia Carpets. Free installation & delivery across Qatar."
        path="/products"
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Header */}
        <div className="bg-primary text-white py-14 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Our Products</h1>
            <p className="font-poppins max-w-2xl mx-auto text-white/80 text-sm md:text-base">
              Browse our complete collection of premium home furnishings and decor products.
              All products come with free installation and delivery in Qatar.
            </p>
          </div>
        </div>

        {/* Products Section */}
        <section className="py-10 md:py-14 bg-neutral-50">
          <div className="container mx-auto px-4">
            {/* Category Filter */}
            {isMobile ? (
              <div className="mb-8 flex justify-center">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2.5 border border-primary/20 shadow-sm bg-white py-3.5 px-5 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <Filter size={18} className="text-accent" />
                      <span className="font-medium text-base text-primary">{categories[activeCategory].label}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white p-0 max-w-[95%] rounded-2xl border border-neutral-200 shadow-xl">
                    <DialogHeader className="border-b border-neutral-100 py-4 bg-neutral-50/50">
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
                            className={`w-full justify-center py-3 text-sm font-medium transition-all duration-300
                              ${activeCategory === key
                                ? "bg-primary hover:bg-primary/90 text-white shadow-md"
                                : "bg-white text-primary hover:bg-neutral-50 border-neutral-200 hover:border-primary/30"
                              }
                              border rounded-xl`}
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
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-10">
                <div className="flex justify-center">
                  {renderCategoryTabs()}
                </div>
              </Tabs>
            )}

            {/* Product Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="font-poppins text-sm text-neutral-500">
                Showing <span className="font-semibold text-neutral-700">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    imageSrc={product.imageSrc}
                    media={product.media}
                    whatsappLink={product.whatsappLink}
                    onClick={() => handleProductClick(product.id)}
                    priority={index < 4}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={32} className="text-neutral-400" />
                </div>
                <p className="font-poppins text-lg text-neutral-600 mb-2">No products found</p>
                <p className="font-poppins text-sm text-neutral-400 mb-6">Try selecting a different category</p>
                <Button onClick={() => setActiveCategory("all")} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-4 text-neutral-900">Can't Find What You're Looking For?</h2>
            <p className="font-poppins max-w-2xl mx-auto mb-8 text-neutral-500">
              Contact us directly through WhatsApp and our team will help you find the perfect solution for your home.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <a href="https://wa.me/+97455512858" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick("products_page")} className="flex items-center space-x-2">
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
