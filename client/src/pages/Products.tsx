import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearch, useLocation } from "wouter";
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
import { Filter, Shield, Truck, Zap, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Product, Category } from "@shared/schema";

interface ProductWithCategories extends Product {
  categoryIds?: string[];
}

const PRODUCTS_PER_PAGE = 12;

export default function Products() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  
  const seriesFromUrl = searchParams.get("series");
  const categoryFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search");
  const pageFromUrl = parseInt(searchParams.get("page") || "1");
  const vehicleFromUrl = searchParams.get("vehicle");
  const minPriceFromUrl = searchParams.get("minPrice");
  const maxPriceFromUrl = searchParams.get("maxPrice");
  
  const [selectedSeries, setSelectedSeries] = useState<string>(seriesFromUrl || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || "all");
  const [searchText, setSearchText] = useState<string>(searchFromUrl || "");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicleFromUrl || "");
  const [minPrice, setMinPrice] = useState<number | null>(minPriceFromUrl ? parseInt(minPriceFromUrl) : null);
  const [maxPrice, setMaxPrice] = useState<number | null>(maxPriceFromUrl ? parseInt(maxPriceFromUrl) : null);

  const { data: products = [], isLoading } = useQuery<ProductWithCategories[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create a map of category names to IDs for filtering
  const categoryNameToId = new Map(categories.map(c => [c.name, c.id]));
  
  // Create a map of parent category ID to all child category IDs (for hierarchical filtering)
  const parentToChildCategoryIds = new Map<string, string[]>();
  categories.filter(c => c.level === 0).forEach(parent => {
    const childIds = categories
      .filter(c => c.parentId === parent.id)
      .map(c => c.id);
    parentToChildCategoryIds.set(parent.id, childIds);
  });

  useEffect(() => {
    if (seriesFromUrl) setSelectedSeries(seriesFromUrl);
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (searchFromUrl) setSearchText(searchFromUrl);
    if (pageFromUrl) setCurrentPage(pageFromUrl);
    if (vehicleFromUrl) setSelectedVehicle(vehicleFromUrl);
    if (minPriceFromUrl) setMinPrice(parseInt(minPriceFromUrl));
    if (maxPriceFromUrl) setMaxPrice(parseInt(maxPriceFromUrl));
  }, [seriesFromUrl, categoryFromUrl, searchFromUrl, pageFromUrl, vehicleFromUrl, minPriceFromUrl, maxPriceFromUrl]);

  const updateUrl = (params: {
    series?: string;
    category?: string;
    page?: number;
    search?: string;
    vehicle?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
  }) => {
    const urlParams = new URLSearchParams();
    const newSeries = params.series ?? selectedSeries;
    const newCategory = params.category ?? selectedCategory;
    const newPage = params.page ?? currentPage;
    const newSearch = params.search ?? searchText;
    const newVehicle = params.vehicle ?? selectedVehicle;
    const newMinPrice = params.minPrice !== undefined ? params.minPrice : minPrice;
    const newMaxPrice = params.maxPrice !== undefined ? params.maxPrice : maxPrice;
    
    if (newSeries !== "all") urlParams.set("series", newSeries);
    if (newCategory !== "all") urlParams.set("category", newCategory);
    if (newSearch) urlParams.set("search", newSearch);
    if (newPage > 1) urlParams.set("page", String(newPage));
    if (newVehicle) urlParams.set("vehicle", newVehicle);
    if (newMinPrice) urlParams.set("minPrice", String(newMinPrice));
    if (newMaxPrice) urlParams.set("maxPrice", String(newMaxPrice));
    
    const newUrl = urlParams.toString() ? `/products?${urlParams}` : "/products";
    setLocation(newUrl);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSeries = selectedSeries === "all" || product.series.toLowerCase() === selectedSeries.toLowerCase();
    
    // Filter by actual category ID (including hierarchical matching)
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory && product.categoryIds) {
      const selectedCategoryId = categoryNameToId.get(selectedCategory);
      if (selectedCategoryId) {
        // Check if product is in the selected category directly
        matchesCategory = product.categoryIds.includes(selectedCategoryId);
        
        // If not found and this is a parent category, also check its child categories
        if (!matchesCategory) {
          const childCategoryIds = parentToChildCategoryIds.get(selectedCategoryId);
          if (childCategoryIds && childCategoryIds.length > 0) {
            matchesCategory = product.categoryIds.some(pcId => childCategoryIds.includes(pcId));
          }
        }
      }
    }
    
    // Filter by search text (name, SKU, or description)
    let matchesSearch = !searchText;
    if (searchText) {
      const query = searchText.toLowerCase();
      matchesSearch = (
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    const matchesMinPrice = !minPrice || product.price >= minPrice;
    const matchesMaxPrice = !maxPrice || product.price <= maxPrice;
    
    // Filter by vehicle (check compatible vehicles array)
    const matchesVehicle = !selectedVehicle || (product.compatibleVehicles && product.compatibleVehicles.some(v => 
      v.toLowerCase().includes(selectedVehicle.toLowerCase())
    ));
    
    return matchesSeries && matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesVehicle;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-az":
        return a.name.localeCompare(b.name);
      case "name-za":
        return b.name.localeCompare(a.name);
      case "newest":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleSeriesChange = (value: string) => {
    setSelectedSeries(value);
    setCurrentPage(1);
    updateUrl({ series: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    updateUrl({ category: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);
    setCurrentPage(1);
    updateUrl({ vehicle: value, page: 1 });
  };

  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
    updateUrl({ minPrice: min, maxPrice: max, page: 1 });
  };

  const clearFilters = () => {
    setSelectedSeries("all");
    setSelectedCategory("all");
    setSearchText("");
    setSelectedVehicle("");
    setMinPrice(null);
    setMaxPrice(null);
    setCurrentPage(1);
    setLocation("/products");
  };

  const hasActiveFilters = selectedSeries !== "all" || selectedCategory !== "all" || !!searchText || !!selectedVehicle || !!minPrice || !!maxPrice;

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              All <span className="text-zinc-500">Products</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Browse our complete collection of premium LED lighting systems from Diode Dynamics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-zinc-800/50"
          >
            {[
              { icon: Shield, text: "8-Year Warranty" },
              { icon: Truck, text: "Free Shipping over ₹25,000" },
              { icon: Zap, text: "Plug & Play Installation" },
            ].map((item, i) => (
              <div key={item.text} className="flex items-center gap-2 text-zinc-500 text-sm">
                <item.icon className="w-4 h-4 text-zinc-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div 
            className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-500">Filters:</span>
              </div>

              <Select value={selectedSeries} onValueChange={handleSeriesChange}>
                <SelectTrigger className="w-[150px] bg-[#0a0a0a] border-zinc-800/50 text-zinc-300" data-testid="filter-series">
                  <SelectValue placeholder="All Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Series</SelectItem>
                  <SelectItem value="sport">Sport Series</SelectItem>
                  <SelectItem value="pro">Pro Series</SelectItem>
                  <SelectItem value="max">Max Series</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px] bg-[#0a0a0a] border-zinc-800/50 text-zinc-300" data-testid="filter-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-[#0a0a0a] border-zinc-800/50 text-zinc-300" data-testid="filter-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-az">Name: A to Z</SelectItem>
                  <SelectItem value="name-za">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={minPrice && maxPrice ? `${minPrice}-${maxPrice}` : "all"} 
                onValueChange={(value) => {
                  if (value === "all") {
                    handlePriceRangeChange(null, null);
                  } else {
                    const [min, max] = value.split("-").map(Number);
                    handlePriceRangeChange(min, max);
                  }
                }}
              >
                <SelectTrigger className="w-[160px] bg-[#0a0a0a] border-zinc-800/50 text-zinc-300" data-testid="filter-price">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-10000">Under ₹10,000</SelectItem>
                  <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                  <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                  <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100000-999999">Above ₹1,00,000</SelectItem>
                </SelectContent>
              </Select>

              {searchText && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Search: "{searchText}"
                  <button 
                    onClick={() => {
                      setSearchText("");
                      setCurrentPage(1);
                      updateUrl({ search: "", page: 1 });
                    }}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {selectedVehicle && (
                <Badge variant="secondary" className="gap-1 text-xs bg-primary/20 border-primary/30">
                  Vehicle: {selectedVehicle}
                  <button 
                    onClick={() => {
                      setSelectedVehicle("");
                      setCurrentPage(1);
                      updateUrl({ vehicle: "", page: 1 });
                    }}
                    className="ml-1 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="text-sm text-zinc-500">
              Showing {paginatedProducts.length} of {sortedProducts.length} products
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
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
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-4">No products found matching your filters.</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <motion.div 
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: Math.min(index * 0.03, 0.3),
                        type: "spring",
                        stiffness: 200
                      }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <Link href={`/product/${product.slug}`}>
                        <Card
                          className="group h-full bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-600/50 cursor-pointer overflow-hidden transition-all duration-300"
                          data-testid={`product-card-${product.id}`}
                        >
                          <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <motion.img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                animate={{
                                  scale: hoveredProduct === product.id ? 1.05 : 1
                                }}
                                transition={{ duration: 0.4 }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                <div className="w-16 h-16 rounded-full bg-primary/20" />
                              </div>
                            )}

                            

                            <Badge className={`absolute bottom-3 left-3 ${getSeriesColor(product.series)}`}>
                              {product.series} Series
                            </Badge>
                          </div>

                          <div className="p-4 space-y-2">
                            <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-white">
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
                </AnimatePresence>
              </motion.div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-transparent border-zinc-700 text-zinc-400 hover:text-white"
                    data-testid="pagination-prev"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === currentPage;
                      const isNearCurrent = Math.abs(page - currentPage) <= 2;
                      const isFirst = page === 1;
                      const isLast = page === totalPages;

                      if (!isNearCurrent && !isFirst && !isLast) {
                        if (page === 2 || page === totalPages - 1) {
                          return <span key={page} className="px-2 text-zinc-600">...</span>;
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={isCurrentPage ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={isCurrentPage 
                            ? "bg-primary text-white" 
                            : "text-zinc-400 hover:text-white"
                          }
                          data-testid={`pagination-page-${page}`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-transparent border-zinc-700 text-zinc-400 hover:text-white"
                    data-testid="pagination-next"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
