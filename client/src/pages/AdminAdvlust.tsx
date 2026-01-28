import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, RefreshCw, Check, AlertCircle, ExternalLink, Package } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdvlustProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  images: Array<{ id: number; src: string; alt: string | null }>;
  variants: Array<{
    id: number;
    title: string;
    sku: string;
    price: string;
    compare_at_price: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    inventory_quantity?: number;
  }>;
  options: Array<{ name: string; values: string[] }>;
  tags: string;
}

interface Category {
  id: string;
  name: string;
  level: number;
}

interface Product {
  id: string;
  advlustProductId: string | null;
}

export default function AdminAdvlust() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState<Record<number, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<Record<number, string>>({});

  const { data: advlustProducts, isLoading, refetch, isFetching } = useQuery<AdvlustProduct[]>({
    queryKey: ["/api/admin/advlust/products", page],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: existingProducts } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const importedIds = new Set(
    existingProducts?.map(p => p.advlustProductId).filter(Boolean) || []
  );

  const importAllMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/advlust/import-all");
    },
    onSuccess: async (response) => {
      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ 
        title: "Bulk import complete",
        description: `Imported ${result.imported} products, skipped ${result.skipped} already existing.`
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Import failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: async ({ 
      advlustProduct, 
      series, 
      categoryId 
    }: { 
      advlustProduct: AdvlustProduct; 
      series: string; 
      categoryId?: string;
    }) => {
      return await apiRequest("POST", "/api/admin/advlust/import", {
        advlustProduct,
        series,
        categoryId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Product imported successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Import failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 150);
  };

  const isImported = (productId: number) => importedIds.has(productId.toString());

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="back-to-admin">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Advlust Product Import</h1>
              <p className="text-zinc-400">Browse and import products from Advlust.com</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => importAllMutation.mutate()}
              disabled={importAllMutation.isPending}
              data-testid="import-all-advlust"
            >
              <Download className={`h-4 w-4 mr-2 ${importAllMutation.isPending ? 'animate-spin' : ''}`} />
              {importAllMutation.isPending ? "Importing All..." : "Import All Products"}
            </Button>
            <Button 
              onClick={() => refetch()} 
              disabled={isFetching}
              variant="outline"
              data-testid="refresh-advlust"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800 animate-pulse">
                <div className="h-48 bg-zinc-800 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : advlustProducts && advlustProducts.length > 0 ? (
          <>
            <div className="mb-4 text-zinc-400">
              Found {advlustProducts.length} products from Advlust.com (Page {page})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advlustProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`bg-zinc-900/50 border-zinc-800 overflow-hidden ${
                    isImported(product.id) ? 'opacity-60' : ''
                  }`}
                  data-testid={`advlust-product-${product.id}`}
                >
                  <div className="relative aspect-[4/3] bg-zinc-800">
                    {product.images[0] && (
                      <img 
                        src={product.images[0].src} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {isImported(product.id) && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Imported
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-black/50">
                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {stripHtml(product.body_html) || "No description"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.variants[0]?.price || "0")}
                      </span>
                      <a 
                        href={`https://advlust.com/products/${product.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    {product.options?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.options.slice(0, 2).map((opt) => (
                          <Badge key={opt.name} variant="secondary" className="text-xs">
                            {opt.name}: {opt.values.slice(0, 3).join(", ")}
                            {opt.values.length > 3 && `... +${opt.values.length - 3}`}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {!isImported(product.id) && (
                      <div className="space-y-2">
                        <Select
                          value={selectedSeries[product.id] || "Pro"}
                          onValueChange={(v) => setSelectedSeries({ ...selectedSeries, [product.id]: v })}
                        >
                          <SelectTrigger className="h-8" data-testid={`select-series-${product.id}`}>
                            <SelectValue placeholder="Select series" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sport">Sport Series</SelectItem>
                            <SelectItem value="Pro">Pro Series</SelectItem>
                            <SelectItem value="Max">Max Series</SelectItem>
                          </SelectContent>
                        </Select>

                        {categories && categories.length > 0 && (
                          <Select
                            value={selectedCategory[product.id] || "none"}
                            onValueChange={(v) => setSelectedCategory({ ...selectedCategory, [product.id]: v })}
                          >
                            <SelectTrigger className="h-8" data-testid={`select-category-${product.id}`}>
                              <SelectValue placeholder="Select category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No category</SelectItem>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {"  ".repeat(cat.level)}{cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    {isImported(product.id) ? (
                      <Button 
                        variant="secondary" 
                        className="w-full" 
                        disabled
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Already Imported
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => importMutation.mutate({
                          advlustProduct: product,
                          series: selectedSeries[product.id] || "Pro",
                          categoryId: selectedCategory[product.id] !== "none" 
                            ? selectedCategory[product.id] 
                            : undefined,
                        })}
                        disabled={importMutation.isPending}
                        data-testid={`import-product-${product.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {importMutation.isPending ? "Importing..." : "Import Product"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                data-testid="prev-page"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={advlustProducts.length < 50}
                data-testid="next-page"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No Products Found</h2>
              <p className="text-zinc-400 mb-4">
                Unable to fetch products from Advlust.com. Please try again later.
              </p>
              <Button onClick={() => refetch()} data-testid="retry-fetch">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
