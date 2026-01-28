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

  const getCategoryProducts = (categoryId: string) => {
    const childIds = categories.filter(c => c.parentId === categoryId).map(c => c.id);
    return products.filter(p => 
      p.categoryIds?.includes(categoryId) || 
      p.categoryIds?.some(cId => childIds.includes(cId))
    );
  };

  const categoryProducts = currentCategory ? getCategoryProducts(currentCategory.id) : [];

  const isLoading = categoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <Skeleton className="h-12 w-64 bg-zinc-800 mb-8" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square bg-zinc-800 rounded-lg" />
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
            <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
            <Link href="/products" className="text-primary hover:underline">
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="category-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mb-8">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: currentCategory.imageUrl 
                ? `url(${currentCategory.imageUrl})`
                : "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end max-w-[1440px] mx-auto px-4 md:px-8 pb-8">
            {parentCategory && (
              <Link 
                href={`/category/${parentCategory.slug}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {parentCategory.name}
              </Link>
            )}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentCategory.name}
            </motion.h1>
            <motion.p 
              className="text-zinc-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {subcategories.length > 0 
                ? `${subcategories.length} subcategories available`
                : `${categoryProducts.length} products available`
              }
            </motion.p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {subcategories.length > 0 ? (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {subcategories.map((sub, index) => {
                const subProducts = getCategoryProducts(sub.id);
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href={`/category/${sub.slug}`}>
                      <Card className="group relative aspect-square overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-600 cursor-pointer transition-all duration-300">
                        {sub.imageUrl ? (
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                            {sub.name}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-zinc-400">
                              {subProducts.length} products
                            </span>
                            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {categoryProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.05 * index, 0.5) }}
                >
                  <Link href={`/product/${product.slug}`}>
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
                        <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-white">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-zinc-500 line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        {product.sku && (
                          <p className="text-xs text-zinc-600">SKU: {product.sku}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {subcategories.length > 0 && categoryProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">All {currentCategory.name}</h2>
                <Link 
                  href={`/products?category=${encodeURIComponent(currentCategory.name)}`}
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View all products
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categoryProducts.slice(0, 5).map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <Card className="group bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-600/50 cursor-pointer overflow-hidden transition-all">
                      <div className="aspect-square bg-[#080808] overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                            <div className="w-8 h-8 rounded-full bg-primary/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs text-zinc-300 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm font-bold text-white mt-1">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
