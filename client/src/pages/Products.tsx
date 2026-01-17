import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { Star, ArrowRight, Filter, Shield, Truck, Zap, ChevronRight } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const seriesFromUrl = searchParams.get("series");
  
  const [selectedSeries, setSelectedSeries] = useState<string>(seriesFromUrl || "all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    if (seriesFromUrl) {
      setSelectedSeries(seriesFromUrl);
    }
  }, [seriesFromUrl]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products.filter(
    (product) => selectedSeries === "all" || product.series.toLowerCase() === selectedSeries
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
      default:
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    }
  });

  const getSeriesColor = (series: string) => {
    switch (series.toLowerCase()) {
      case "sport":
        return "text-zinc-400 border-zinc-700 bg-zinc-900/50";
      case "pro":
        return "text-white border-zinc-500 bg-zinc-800/50";
      case "max":
        return "text-primary border-primary/30 bg-primary/10";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="products-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Page header with animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Featured <span className="text-zinc-500">Products</span>
            </motion.h1>
            <motion.p 
              className="text-zinc-500 text-lg max-w-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              From compact pods to full-size light bars. Find the perfect gear for every build.
            </motion.p>
          </motion.div>

          {/* Trust highlights with stagger animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-zinc-800/50"
          >
            {[
              { icon: Shield, text: "8-Year Warranty" },
              { icon: Truck, text: "Free Shipping over ₹25,000" },
              { icon: Zap, text: "Plug & Play Installation" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 text-zinc-500 text-sm"
              >
                <item.icon className="w-4 h-4 text-zinc-400" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters with animation */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            data-testid="product-filters"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">Filter:</span>
            </div>

            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-zinc-800/50 text-zinc-300" data-testid="filter-series">
                <SelectValue placeholder="All Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Series</SelectItem>
                <SelectItem value="sport">Sport Series</SelectItem>
                <SelectItem value="pro">Pro Series</SelectItem>
                <SelectItem value="max">Max Series</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-zinc-800/50 text-zinc-300" data-testid="filter-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-zinc-500">
              {sortedProducts.length} products
            </div>
          </motion.div>

          {/* Products Grid - Car Configurator Style */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-[#0a0a0a] border-zinc-800/30 overflow-hidden">
                  <Skeleton className="aspect-[4/3] bg-zinc-900" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-20 bg-zinc-800" />
                    <Skeleton className="h-6 w-full bg-zinc-800" />
                    <Skeleton className="h-8 w-24 bg-zinc-800" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 100
                    }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <Link href={`/product/${product.slug}`}>
                      <Card
                        className="group h-full bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-600/50 cursor-pointer overflow-hidden transition-all duration-500"
                        style={{
                          boxShadow: hoveredProduct === product.id 
                            ? product.series.toLowerCase() === 'max'
                              ? '0 0 60px rgba(229, 57, 53, 0.15)'
                              : '0 0 40px rgba(255, 255, 255, 0.05)'
                            : 'none'
                        }}
                        data-testid={`product-card-${product.id}`}
                      >
                        {/* Product image with hover zoom */}
                        <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <motion.img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              animate={{
                                scale: hoveredProduct === product.id ? 1.1 : 1
                              }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                              <motion.div 
                                className="w-24 h-24 rounded-full bg-zinc-800/50 border border-zinc-700/30"
                                animate={{
                                  boxShadow: [
                                    "0 0 0 rgba(255,255,255,0)",
                                    "0 0 30px rgba(255,255,255,0.1)",
                                    "0 0 0 rgba(255,255,255,0)"
                                  ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              />
                            </div>
                          )}

                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                          
                          {/* Animated hover overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between">
                            {product.isPopular && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Badge
                                  className="bg-primary text-primary-foreground shadow-lg"
                                  data-testid={`popular-badge-${product.id}`}
                                >
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Popular
                                </Badge>
                              </motion.div>
                            )}
                            {product.originalPrice && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="ml-auto"
                              >
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                  Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                                </Badge>
                              </motion.div>
                            )}
                          </div>

                          {/* Floating series badge */}
                          <motion.div
                            className="absolute bottom-4 left-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Badge
                              variant="outline"
                              className={`backdrop-blur-sm ${getSeriesColor(product.series)}`}
                            >
                              {product.series} Series
                            </Badge>
                          </motion.div>
                        </div>

                        {/* Product info */}
                        <div className="p-5">
                          <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-zinc-300 transition-colors line-clamp-2 min-h-[56px]">
                            {product.name}
                          </h3>

                          <p className="text-sm text-zinc-500 mb-4 line-clamp-2 min-h-[40px]">
                            {product.shortDescription}
                          </p>

                          {/* Specs preview */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.beamPatterns.slice(0, 3).map((pattern, i) => (
                              <motion.span
                                key={pattern}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-1 rounded"
                              >
                                {pattern}
                              </motion.span>
                            ))}
                          </div>

                          {/* Price section with animation */}
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                            <div>
                              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">M.R.P.</p>
                              <motion.div 
                                className="flex items-baseline gap-2"
                                animate={{
                                  scale: hoveredProduct === product.id ? 1.05 : 1
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <span className="text-xl font-bold text-white">
                                  ₹{product.price.toLocaleString("en-IN")}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-zinc-600 line-through">
                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                  </span>
                                )}
                              </motion.div>
                            </div>

                            <motion.div
                              animate={{
                                x: hoveredProduct === product.id ? 5 : 0
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-zinc-400 group-hover:text-primary transition-colors"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && sortedProducts.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-zinc-500 text-lg mb-4">No products found in this category.</p>
              <Button
                variant="outline"
                onClick={() => setSelectedSeries("all")}
              >
                View All Products
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
