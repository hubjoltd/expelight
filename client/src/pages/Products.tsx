import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
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
import { Star, ArrowRight, Filter, Shield, Truck, Zap } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const seriesFromUrl = searchParams.get("series");
  
  const [selectedSeries, setSelectedSeries] = useState<string>(seriesFromUrl || "all");
  const [sortBy, setSortBy] = useState<string>("popular");

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
        return "text-zinc-400 border-zinc-700 bg-zinc-800/30";
      case "pro":
        return "text-white border-zinc-500 bg-zinc-700/30";
      case "max":
        return "text-primary border-primary/30 bg-primary/10";
      default:
        return "text-muted-foreground";
    }
  };

  const getSeriesGlow = (series: string) => {
    switch (series.toLowerCase()) {
      case "max":
        return "group-hover:shadow-[0_0_40px_rgba(229,57,53,0.15)]";
      case "pro":
        return "group-hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="products-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Featured <span className="text-zinc-500">Products</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              From compact pods to full-size light bars. Find the perfect gear for every build.
            </p>
          </motion.div>

          {/* Trust highlights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-zinc-800/50"
          >
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Shield className="w-4 h-4 text-zinc-400" />
              <span>8-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Truck className="w-4 h-4 text-zinc-400" />
              <span>Free Shipping over ₹25,000</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Zap className="w-4 h-4 text-zinc-400" />
              <span>Plug & Play Installation</span>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8" data-testid="product-filters">
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
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-[#0a0a0a] border-zinc-800/30 overflow-hidden">
                  <Skeleton className="aspect-square bg-zinc-900" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-20 bg-zinc-800" />
                    <Skeleton className="h-6 w-full bg-zinc-800" />
                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                    <Skeleton className="h-8 w-24 bg-zinc-800" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/product/${product.slug}`}>
                    <Card
                      className={`group h-full bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-700/50 cursor-pointer overflow-hidden transition-all duration-300 ${getSeriesGlow(product.series)}`}
                      data-testid={`product-card-${product.id}`}
                    >
                      {/* Product image */}
                      <div className="aspect-square bg-[#080808] relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-zinc-800/50 border border-zinc-700/30" />
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

                        {product.isPopular && (
                          <Badge
                            className="absolute top-4 left-4 bg-primary text-primary-foreground"
                            data-testid={`popular-badge-${product.id}`}
                          >
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Popular
                          </Badge>
                        )}

                        {product.originalPrice && (
                          <Badge
                            className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          >
                            Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                          </Badge>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="p-5">
                        <Badge
                          variant="outline"
                          className={`mb-3 ${getSeriesColor(product.series)}`}
                        >
                          {product.series} Series
                        </Badge>

                        <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-zinc-300 transition-colors line-clamp-2 min-h-[56px]">
                          {product.name}
                        </h3>

                        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 min-h-[40px]">
                          {product.shortDescription}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                          <div>
                            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">M.R.P.</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-white">
                                ₹{product.price.toLocaleString("en-IN")}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-zinc-600 line-through">
                                  ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-zinc-400 group-hover:text-white transition-colors"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-4">No products found in this category.</p>
              <Button
                variant="outline"
                onClick={() => setSelectedSeries("all")}
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
