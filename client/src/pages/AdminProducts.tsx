import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Pencil, Trash2, Package, Search, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  series: string;
  price: number;
  originalPrice: number | null;
  isActive: boolean | null;
  isPopular: boolean;
  images: string[];
  createdAt: string | null;
}

export default function AdminProducts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      return await apiRequest("POST", "/api/admin/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateOpen(false);
      toast({ title: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      return await apiRequest("PATCH", `/api/admin/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setEditProduct(null);
      toast({ title: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Product disabled successfully" });
    },
    onError: () => {
      toast({ title: "Failed to disable product", variant: "destructive" });
    },
  });

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle className="w-6 h-6" />
              <span className="font-semibold">Access Denied</span>
            </div>
            <Link href="/">
              <Button variant="outline" data-testid="link-home">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const ProductForm = ({ product, onSubmit, onCancel }: { 
    product?: Product | null; 
    onSubmit: (data: Partial<Product>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || "",
      slug: product?.slug || "",
      sku: product?.sku || "",
      series: product?.series || "Sport",
      price: product?.price || 0,
      originalPrice: product?.originalPrice || 0,
      isActive: product?.isActive !== false,
      isPopular: product?.isPopular || false,
      tagline: "",
      shortDescription: "",
      fullDescription: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        originalPrice: formData.originalPrice || null,
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-product-name"
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              data-testid="input-product-sku"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (INR)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              required
              data-testid="input-product-price"
            />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price (optional)</Label>
            <Input
              id="originalPrice"
              type="number"
              value={formData.originalPrice || ""}
              onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
              data-testid="input-product-original-price"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="series">Series</Label>
          <Select value={formData.series} onValueChange={(v) => setFormData({ ...formData, series: v })}>
            <SelectTrigger data-testid="select-product-series">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sport">Sport</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Max">Max</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
              data-testid="switch-product-active"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="isPopular"
              checked={formData.isPopular}
              onCheckedChange={(c) => setFormData({ ...formData, isPopular: c })}
              data-testid="switch-product-popular"
            />
            <Label htmlFor="isPopular">Popular</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="button-save-product">
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <p className="text-zinc-400">Manage your product catalog</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-product">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <ProductForm 
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12 text-zinc-400">Loading products...</div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-zinc-900 border-zinc-800" data-testid={`card-product-${product.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{product.name}</h3>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {product.isPopular && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Popular</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span>SKU: {product.sku || "N/A"}</span>
                        <span>Series: {product.series}</span>
                        <span className="text-white font-medium">{formatCurrency(product.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={editProduct?.id === product.id} onOpenChange={(open) => !open && setEditProduct(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setEditProduct(product)} data-testid={`button-edit-product-${product.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <ProductForm 
                            product={editProduct}
                            onSubmit={(data) => updateMutation.mutate({ id: product.id, data })}
                            onCancel={() => setEditProduct(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to disable this product?")) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        data-testid={`button-delete-product-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                {searchTerm ? "No products match your search" : "No products found"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
