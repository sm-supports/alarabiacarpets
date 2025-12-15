
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, Check, ImageIcon, Video } from "lucide-react";
import { products, Product } from "@/data/products";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Simulated data fetch
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
      setLoading(false);
    }, 300); 
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
                
                {/* Main Media */}
                {product?.media && product.media.length > 0 && product.media[0].type === 'video' ? (
                  <video 
                    src={product.media[0].src} 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    poster={product.imageSrc.endsWith('.mp4') ? undefined : product.imageSrc}
                  />
                ) : (
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
                )}
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
