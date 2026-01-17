import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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
import { Star, ArrowRight, Filter } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Products() {
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

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

  return (
    <div className="min-h-screen bg-background" data-testid="products-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              All <span className="text-gradient-red">Products</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Engineering-grade lighting systems designed in the USA, perfected for Indian roads.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8" data-testid="product-filters">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
            </div>

            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-border/30" data-testid="filter-series">
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
              <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-border/30" data-testid="filter-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              {sortedProducts.length} products
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-[#0a0a0a] border-border/30 overflow-hidden">
                  <Skeleton className="aspect-square bg-muted/20" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-20 bg-muted/20" />
                    <Skeleton className="h-6 w-full bg-muted/20" />
                    <Skeleton className="h-4 w-3/4 bg-muted/20" />
                    <Skeleton className="h-8 w-24 bg-muted/20" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/product/${product.slug}`}>
                    <Card
                      className="group h-full bg-[#0a0a0a] border-border/30 card-premium cursor-pointer overflow-hidden"
                      data-testid={`product-card-${product.id}`}
                    >
                      {/* Product image */}
                      <div className="aspect-square bg-gradient-to-br from-muted/10 via-[#0a0a0a] to-muted/5 flex items-center justify-center relative">
                        <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <div className="w-20 h-20 rounded-full bg-primary/20" />
                        </div>

                        {product.isPopular && (
                          <Badge
                            className="absolute top-4 left-4 bg-primary text-primary-foreground"
                            data-testid={`popular-badge-${product.id}`}
                          >
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Popular
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

                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.shortDescription}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary"
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
        </div>
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
