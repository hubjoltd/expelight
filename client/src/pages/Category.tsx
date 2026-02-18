import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
import { Filter, Shield, Truck, Zap, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Category, Product } from "@shared/schema";

interface ProductWithCategories extends Product {
  categoryIds?: string[];
}

const PRODUCTS_PER_PAGE = 12;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithCategories[]>({
    queryKey: ["/api/products"],
  });

  const currentCategory = categories.find(c => c.slug === slug);
  const subcategories = categories
    .filter(c => c.parentId === currentCategory?.id && c.isActive)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const parentCategory = currentCategory?.parentId
    ? categories.find(c => c.id === currentCategory.parentId)
    : null;
  const grandparentCategory = parentCategory?.parentId
    ? categories.find(c => c.id === parentCategory.parentId)
    : null;

  const getAllDescendantIds = (categoryId: string): string[] => {
    const children = categories.filter(c => c.parentId === categoryId);
    const childIds = children.map(c => c.id);
    const grandchildIds = children.flatMap(c => getAllDescendantIds(c.id));
    return [...childIds, ...grandchildIds];
  };

  const getCategoryProducts = (categoryId: string) => {
    const allIds = [categoryId, ...getAllDescendantIds(categoryId)];
    return products.filter(p =>
      p.categoryIds?.some(cId => allIds.includes(cId))
    );
  };

  const categoryProducts = currentCategory ? getCategoryProducts(currentCategory.id) : [];

  const filteredProducts = categoryProducts.filter((product) => {
    const matchesSeries = selectedSeries === "all" || product.series.toLowerCase() === selectedSeries.toLowerCase();
    const matchesMinPrice = !minPrice || product.price >= minPrice;
    const matchesMaxPrice = !maxPrice || product.price <= maxPrice;

    let matchesSubcategory = !activeSubcategory;
    if (activeSubcategory) {
      const subIds = [activeSubcategory, ...getAllDescendantIds(activeSubcategory)];
      matchesSubcategory = product.categoryIds?.some(cId => subIds.includes(cId)) ?? false;
    }

    return matchesSeries && matchesMinPrice && matchesMaxPrice && matchesSubcategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "name-az": return a.name.localeCompare(b.name);
      case "name-za": return b.name.localeCompare(a.name);
      default: return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSeries("all");
    setSortBy("newest");
    setMinPrice(null);
    setMaxPrice(null);
    setActiveSubcategory(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedSeries !== "all" || !!minPrice || !!maxPrice || !!activeSubcategory;

  const getSeriesColor = (series: string) => {
    switch (series.toLowerCase()) {
      case "sport": return "text-zinc-400 border-zinc-700 bg-zinc-900/50";
      case "pro": return "text-white border-zinc-500 bg-zinc-800/50";
      case "max": return "text-primary border-primary/30 bg-primary/10";
      default: return "text-muted-foreground";
    }
  };

  const isLoading = categoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <Skeleton className="h-12 w-64 bg-zinc-800 mb-4" />
            <Skeleton className="h-6 w-96 bg-zinc-800/50 mb-8" />
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

  const breadcrumbs: { name: string; slug: string }[] = [];
  if (grandparentCategory) breadcrumbs.push({ name: grandparentCategory.name, slug: grandparentCategory.slug });
  if (parentCategory) breadcrumbs.push({ name: parentCategory.name, slug: parentCategory.slug });

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="category-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {breadcrumbs.length > 0 && (
            <motion.div
              className="flex items-center gap-2 text-sm text-zinc-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-testid="breadcrumbs"
            >
              <Link href="/products" className="hover:text-zinc-300 transition-colors">
                All Products
              </Link>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.slug} className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  <Link href={`/category/${crumb.slug}`} className="hover:text-zinc-300 transition-colors">
                    {crumb.name}
                  </Link>
                </span>
              ))}
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-300">{currentCategory.name}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white" data-testid="text-category-title">
              {currentCategory.name}
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              {categoryProducts.length > 0
                ? `Browse ${categoryProducts.length} premium ${currentCategory.name.toLowerCase()} products from Diode Dynamics.`
                : `Explore our ${currentCategory.name.toLowerCase()} collection.`}
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
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-zinc-500 text-sm">
                <item.icon className="w-4 h-4 text-zinc-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-sm text-zinc-500 mr-1">Browse:</span>
              <Button
                variant={!activeSubcategory ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveSubcategory(null); setCurrentPage(1); }}
                className={!activeSubcategory
                  ? "bg-primary text-white"
                  : "bg-transparent border-zinc-700 text-zinc-400"
                }
                data-testid="filter-subcategory-all"
              >
                All {currentCategory.name}
              </Button>
              {subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant={activeSubcategory === sub.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setActiveSubcategory(activeSubcategory === sub.id ? null : sub.id); setCurrentPage(1); }}
                  className={activeSubcategory === sub.id
                    ? "bg-primary text-white"
                    : "bg-transparent border-zinc-700 text-zinc-400"
                  }
                  data-testid={`filter-subcategory-${sub.slug}`}
                >
                  {sub.name}
                </Button>
              ))}
            </motion.div>
          )}

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

              <Select value={selectedSeries} onValueChange={(v) => { setSelectedSeries(v); setCurrentPage(1); }}>
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

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-zinc-400"
                  data-testid="button-clear-filters"
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

          {paginatedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-4">No products found matching your filters.</p>
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-empty">Clear Filters</Button>
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
                      <Link href={`/product/${product.slug}`} data-testid={`link-product-${product.slug}`}>
                        <Card
                          className="group h-full bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-600/50 cursor-pointer overflow-hidden transition-all duration-300"
                          data-testid={`product-card-${product.id}`}
                        >
                          <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <motion.img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                                animate={{
                                  scale: hoveredProduct === product.id ? 1.08 : 1
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

                            {product.isPreOrder && (
                              <Badge className="absolute top-3 right-3 bg-amber-600/90 text-white border-amber-500/50">
                                Pre-Order
                              </Badge>
                            )}

                            <Badge className={`absolute bottom-3 left-3 ${getSeriesColor(product.series)}`}>
                              {product.series} Series
                            </Badge>
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
                </AnimatePresence>
              </motion.div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-transparent border-zinc-700 text-zinc-400"
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
                            : "text-zinc-400"
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
                    className="bg-transparent border-zinc-700 text-zinc-400"
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
