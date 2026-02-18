import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ArrowLeft } from "lucide-react";
import type { Category, Product } from "@shared/schema";

interface ProductWithCategories extends Product {
  categoryIds?: string[];
}

const HOVER_IMAGES: Record<string, string> = {
  "led-light-bars": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Stage_Series_LED_Light_Bars-hover-category.jpg?v=1746201178",
  "led-pods": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Pods-hover-category.jpg?v=1746201354",
  "brackets-kits": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Brackets_Kits-hover-category.jpg?v=1746201422",
  "switch-panel": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/D_-_Switch-hover-category.jpg?v=1746201460",
  "hitch-mount": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/HitchMount-hover-category.jpg?v=1746201556",
  "rock-lights": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Rock_Lights-hover-category.jpg?v=1746201590",
  "accessories": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Accessories-hover-category.jpg?v=1746201615",
  "headlights": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Headlights-hover-category.jpg?v=1746202249",
  "sidemarkers": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Sidemarkers-hover-category.jpg?v=1746202296",
  "turn-signals": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Turn_Signals-hover-category.jpg?v=1746202350",
  "fog-lamps": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Fog_Lamps-hover-category.jpg?v=1746202380",
  "controllers": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Controllers-hover-category.jpg?v=1746203008",
  "led-wiring-and-installation": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/LED_Wiring_and_Installation-hover-category.jpg?v=1750059004",
  "anti-flicker-modules": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Anti-Flicker_Modules-hover-category.jpg?v=1746203041",
  "flashers-and-resistors": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Flashers_and_Resistors-hover-category.jpg?v=1746203061",
  "power-dimmers-and-drivers": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Power_Dimmers_and_Drivers-hover-category.jpg?v=1750058936",
  "ssc1-led-pods": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SSC1-Standard-hover-category.jpg?v=1746425784",
  "ssc2-led-pods": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SSC2_LED_Light_Pods-hover-category.jpg?v=1746425784",
  "ss3-led-pods": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS3-Standard-hover-category.jpg?v=1746425784",
  "ss5-led-pods": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS5_LED_Light_Pods-hover-category.jpg?v=1746425784",
  "stage-series-light-bars": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Stage_Series_LED_Light_Bars-hover-category.jpg?v=1746201178",
  "ss5-crosslink-light-bars": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/SS5-LED-hover-category.jpg?v=1746684675",
  "bezels": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Bezels-hover-category.jpg?v=1746424735",
  "brackets-mounts": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Brackets_Kits-hover-category_c9621e6d-8222-40a1-9025-074c319012e6.jpg?v=1746424735",
  "covers": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Covers-hover-category.jpg?v=1746424735",
  "hardware-kits": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Hardware_Kits-hover-category.jpg?v=1746424735",
  "replacement-lenses": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Replacement_Lenses-hover-category.jpg?v=1746424735",
  "wiring-harnesses": "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/Wiring_harness-hover-category.jpg?v=1746424735",
};

const BANNER_IMAGES: Record<string, { desktop: string; mobile?: string }> = {
  "off-road": {
    desktop: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/offroad-banner.jpg?v=1746169190",
    mobile: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/offroad-mobile-banner.jpg?v=1746170128",
  },
  "lamps": {
    desktop: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/lamp-banner.jpg?v=1746188637",
    mobile: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/lamp-mobile-banner.jpg?v=1746188632",
  },
  "extras": {
    desktop: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/extra-banner.jpg?v=1746188640",
    mobile: "https://cdn.shopify.com/s/files/1/0928/3295/6702/files/extra-mobile-banner.jpg?v=1746188629",
  },
};

function SubcategoryCard({ category, index }: { category: Category; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverImage = HOVER_IMAGES[category.slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
    >
      <Link href={`/category/${category.slug}`} data-testid={`link-category-${category.slug}`}>
        <div
          className="group relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-testid={`category-card-${category.slug}`}
        >
          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={category.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && hoverImage ? "opacity-0" : "opacity-100"}`}
            />
          )}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={`${category.name} hover`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
            />
          )}
          {!category.imageUrl && !hoverImage && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
              {category.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function getBannerForCategory(category: Category, parentCategory: Category | null, grandparentCategory: Category | null): { desktop: string; mobile?: string } | null {
  if (BANNER_IMAGES[category.slug]) return BANNER_IMAGES[category.slug];
  if (parentCategory && BANNER_IMAGES[parentCategory.slug]) return BANNER_IMAGES[parentCategory.slug];
  if (grandparentCategory && BANNER_IMAGES[grandparentCategory.slug]) return BANNER_IMAGES[grandparentCategory.slug];
  if (category.imageUrl) return { desktop: category.imageUrl };
  if (parentCategory?.imageUrl) return { desktop: parentCategory.imageUrl };
  return null;
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithCategories[]>({
    queryKey: ["/api/products"],
  });

  const currentCategory = categories.find(c => c.slug === slug);
  const subcategories = categories.filter(c => c.parentId === currentCategory?.id);
  const parentCategory = currentCategory?.parentId 
    ? categories.find(c => c.id === currentCategory.parentId)
    : null;
  const grandparentCategory = parentCategory?.parentId
    ? categories.find(c => c.id === parentCategory.parentId)
    : null;

  const hasSubcategories = subcategories.length > 0;

  const getCategoryProducts = (categoryId: string) => {
    const childIds = categories.filter(c => c.parentId === categoryId).map(c => c.id);
    const grandchildIds = categories.filter(c => childIds.includes(c.parentId || "")).map(c => c.id);
    const allIds = [categoryId, ...childIds, ...grandchildIds];
    return products.filter(p => 
      p.categoryIds?.some(cId => allIds.includes(cId))
    );
  };

  const categoryProducts = currentCategory ? getCategoryProducts(currentCategory.id) : [];

  const isLoading = categoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <main className="pt-24 pb-20">
          <Skeleton className="w-full h-[400px] bg-zinc-800 mb-8" />
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] bg-zinc-800 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4" data-testid="text-category-not-found">Category Not Found</h1>
            <Link href="/products" className="text-primary hover:underline" data-testid="link-browse-products">
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const banner = getBannerForCategory(currentCategory, parentCategory ?? null, grandparentCategory ?? null);

  if (hasSubcategories) {
    return (
      <div className="min-h-screen bg-[#050505]" data-testid="category-landing-page">
        <Header />
        <main className="pt-24 pb-20">
          <div className="relative w-full overflow-hidden">
            {banner?.mobile && (
              <img
                src={banner.mobile}
                alt={currentCategory.name}
                className="w-full md:hidden"
              />
            )}
            {banner?.desktop && (
              <img
                src={banner.desktop}
                alt={currentCategory.name}
                className={`w-full ${banner.mobile ? "hidden md:block" : ""}`}
              />
            )}
            {!banner && (
              <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-zinc-900 to-[#050505]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            <div className="absolute bottom-6 md:bottom-10 left-0 right-0">
              <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                {parentCategory && (
                  <Link
                    href={`/category/${parentCategory.slug}`}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white mb-3 transition-colors text-sm"
                    data-testid="link-back-parent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {parentCategory.name}
                  </Link>
                )}
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  data-testid="text-category-title"
                >
                  {currentCategory.name}
                </motion.h1>
              </div>
            </div>
          </div>

          <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-8 md:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {subcategories.map((sub, index) => (
                <SubcategoryCard key={sub.id} category={sub} index={index} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="category-products-page">
      <Header />
      <main className="pt-24 pb-20">
        <div className="relative w-full overflow-hidden">
          {banner?.mobile && (
            <img
              src={banner.mobile}
              alt={currentCategory.name}
              className="w-full md:hidden"
            />
          )}
          {banner?.desktop && (
            <img
              src={banner.desktop}
              alt={currentCategory.name}
              className={`w-full ${banner.mobile ? "hidden md:block" : ""}`}
            />
          )}
          {!banner && (
            <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-zinc-900 to-[#050505]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute bottom-6 md:bottom-10 left-0 right-0">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
              {parentCategory && (
                <Link
                  href={`/category/${parentCategory.slug}`}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white mb-3 transition-colors text-sm"
                  data-testid="link-back-parent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {parentCategory.name}
                </Link>
              )}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                data-testid="text-category-title"
              >
                {currentCategory.name}
              </motion.h1>
              <motion.p
                className="text-zinc-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {categoryProducts.length} products
              </motion.p>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.05 * index, 0.5) }}
              >
                <Link href={`/product/${product.slug}`} data-testid={`link-product-${product.slug}`}>
                  <Card className="group h-full bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-600/50 cursor-pointer overflow-hidden transition-all duration-300">
                    <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                          <div className="w-16 h-16 rounded-full bg-primary/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white" data-testid={`text-product-price-${product.id}`}>
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {product.sku && (
                        <p className="text-xs text-zinc-600">SKU: {product.sku}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
