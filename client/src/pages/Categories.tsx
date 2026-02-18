import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import type { Category, Product } from "@shared/schema";

interface ProductWithCategories extends Product {
  categoryIds?: string[];
}

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
  productCount: number;
}

export default function Categories() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithCategories[]>({
    queryKey: ["/api/products"],
  });

  const isLoading = categoriesLoading || productsLoading;

  const getAllDescendantIds = (categoryId: string): string[] => {
    const children = categories.filter(c => c.parentId === categoryId);
    const childIds = children.map(c => c.id);
    const grandchildIds = children.flatMap(c => getAllDescendantIds(c.id));
    return [...childIds, ...grandchildIds];
  };

  const getProductCount = (categoryId: string): number => {
    const allIds = [categoryId, ...getAllDescendantIds(categoryId)];
    return products.filter(p =>
      p.categoryIds?.some(cId => allIds.includes(cId))
    ).length;
  };

  const parentCategories = categories
    .filter(c => c.level === 0 && c.isActive)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const buildHierarchy = (parent: Category): CategoryWithChildren => {
    const children = categories
      .filter(c => c.parentId === parent.id && c.isActive)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(child => buildHierarchy(child));

    return {
      ...parent,
      children,
      productCount: getProductCount(parent.id),
    };
  };

  const categoryTree = parentCategories.map(p => buildHierarchy(p));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <Skeleton className="h-12 w-64 bg-zinc-800 mb-4" />
            <Skeleton className="h-6 w-96 bg-zinc-800/50 mb-12" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-12">
                <Skeleton className="h-8 w-48 bg-zinc-800 mb-6" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-24 bg-zinc-800/50 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="categories-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white" data-testid="text-categories-title">
              All <span className="text-zinc-500">Categories</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Browse our complete range of premium LED lighting products organized by category.
            </p>
          </motion.div>

          <div className="space-y-12">
            {categoryTree.map((parent, groupIndex) => (
              <motion.div
                key={parent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.15, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <Link href={`/category/${parent.slug}`} data-testid={`link-parent-${parent.slug}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-white hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                      {parent.name}
                      <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </h2>
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {parent.productCount} products
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {parent.children.map((child, childIndex) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.15 + childIndex * 0.05, duration: 0.4 }}
                    >
                      <Link href={`/category/${child.slug}`} data-testid={`link-category-${child.slug}`}>
                        <Card className="group bg-[#0a0a0a] border-zinc-800/30 hover:border-zinc-600/50 cursor-pointer transition-all duration-300 overflow-hidden">
                          <div className="flex items-start gap-4 p-4">
                            {child.imageUrl ? (
                              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-[#080808]">
                                <img
                                  src={child.imageUrl}
                                  alt={child.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-md flex-shrink-0 bg-zinc-900 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-primary/20" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white text-sm group-hover:text-primary transition-colors truncate" data-testid={`text-category-name-${child.slug}`}>
                                {child.name}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                {child.productCount} products
                              </p>
                              {child.children.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {child.children.slice(0, 3).map(sub => (
                                    <span key={sub.id} className="text-[10px] text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded">
                                      {sub.name}
                                    </span>
                                  ))}
                                  {child.children.length > 3 && (
                                    <span className="text-[10px] text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded">
                                      +{child.children.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {groupIndex < categoryTree.length - 1 && (
                  <div className="border-b border-zinc-800/30 mt-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
