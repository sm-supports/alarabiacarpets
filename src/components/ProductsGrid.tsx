"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import type { Product } from "@/data/products";
import { productImageAlt } from "@/lib/seo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CATEGORIES: Record<string, { label: string }> = {
  all: { label: "All Products" },
  barkia: { label: "Barkia & PVC" },
  carpet: { label: "Carpets" },
  furniture: { label: "Furniture" },
  curtains: { label: "Curtains" },
  interior: { label: "Interior Design" },
};

/**
 * Category filter + product grid.
 *
 * Client leaf of /products so the surrounding page can stay a server component
 * and export metadata. `products` crosses the boundary as plain serializable
 * JSON.
 *
 * Note both the mobile dialog and the desktop tabs are rendered and gated with
 * CSS rather than branched on useIsMobile(). That hook returns undefined on the
 * first render, so a JS branch would always prerender the desktop variant and
 * visibly swap after hydration on phones.
 */
export default function ProductsGrid({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setDialogOpen(false);
  };

  return (
    <>
      <h2 className="sr-only">Browse products by category</h2>

      {/* Mobile filter */}
      <div className="mb-8 flex justify-center md:hidden">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2.5 border border-primary/20 shadow-sm bg-white py-3.5 px-5 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <Filter size={18} className="text-accent" />
              <span className="font-medium text-base text-primary">
                {CATEGORIES[activeCategory].label}
              </span>
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
                {Object.entries(CATEGORIES).map(([key, { label }]) => (
                  <Button
                    key={key}
                    variant={activeCategory === key ? "default" : "outline"}
                    className={`w-full justify-center py-3 text-sm font-medium transition-all duration-300
                      ${
                        activeCategory === key
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

      {/* Desktop filter */}
      <Tabs
        defaultValue="all"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="mb-10 hidden md:block"
      >
        <div className="flex justify-center">
          <TabsList className="bg-white/80 backdrop-blur-sm p-1.5 w-full justify-center rounded-xl shadow-sm border border-neutral-100">
            {Object.entries(CATEGORIES).map(([key, { label }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md whitespace-nowrap rounded-lg transition-all duration-300 text-sm px-4 py-2"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="mb-6 flex items-center justify-between">
        <p className="font-poppins text-sm text-neutral-500">
          Showing{" "}
          <span className="font-semibold text-neutral-700">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

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
              href={`/products/${product.id}`}
              imageAlt={productImageAlt(product)}
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
          <p className="font-poppins text-sm text-neutral-400 mb-6">
            Try selecting a different category
          </p>
          <Button
            onClick={() => setActiveCategory("all")}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            View All Products
          </Button>
        </div>
      )}
    </>
  );
}
