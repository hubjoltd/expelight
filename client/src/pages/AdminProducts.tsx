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

  const ProductForm = ({ product, onSubmit, onCancel, fullProduct }: { 
    product?: Product | null; 
    fullProduct?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: fullProduct?.name || product?.name || "",
      slug: fullProduct?.slug || product?.slug || "",
      sku: fullProduct?.sku || product?.sku || "",
      series: fullProduct?.series || product?.series || "Sport",
      price: fullProduct?.price || product?.price || 0,
      originalPrice: fullProduct?.originalPrice || product?.originalPrice || 0,
      isActive: fullProduct?.isActive !== false && product?.isActive !== false,
      isPopular: fullProduct?.isPopular || product?.isPopular || false,
      tagline: fullProduct?.tagline || "",
      shortDescription: fullProduct?.shortDescription || "",
      fullDescription: fullProduct?.fullDescription || "",
      beamPatterns: fullProduct?.beamPatterns?.join(", ") || "",
      colors: fullProduct?.colors?.join(", ") || "",
      features: fullProduct?.features?.join("\n") || "",
      specs: fullProduct?.specs?.join("\n") || "",
      whatsInBox: fullProduct?.whatsInBox?.join("\n") || "",
      warrantyYears: fullProduct?.warrantyYears || 8,
      images: fullProduct?.images?.join("\n") || "",
      compatibleVehicles: fullProduct?.compatibleVehicles?.join(", ") || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku: formData.sku || null,
        series: formData.series,
        price: formData.price,
        originalPrice: formData.originalPrice || null,
        isActive: formData.isActive,
        isPopular: formData.isPopular,
        tagline: formData.tagline || formData.name,
        shortDescription: formData.shortDescription || formData.tagline || formData.name,
        fullDescription: formData.fullDescription || formData.shortDescription || "",
        beamPatterns: formData.beamPatterns ? formData.beamPatterns.split(",").map(s => s.trim()).filter(Boolean) : ["Spot"],
        colors: formData.colors ? formData.colors.split(",").map(s => s.trim()).filter(Boolean) : ["White"],
        features: formData.features ? formData.features.split("\n").map(s => s.trim()).filter(Boolean) : [],
        specs: formData.specs ? formData.specs.split("\n").map(s => s.trim()).filter(Boolean) : [],
        whatsInBox: formData.whatsInBox ? formData.whatsInBox.split("\n").map(s => s.trim()).filter(Boolean) : [],
        warrantyYears: formData.warrantyYears,
        images: formData.images ? formData.images.split("\n").map(s => s.trim()).filter(Boolean) : [],
        compatibleVehicles: formData.compatibleVehicles ? formData.compatibleVehicles.split(",").map(s => s.trim()).filter(Boolean) : [],
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-product-name"
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU / Part Number</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g., DD5014S"
              data-testid="input-product-sku"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-name"
            data-testid="input-product-slug"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (INR) *</Label>
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
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              id="originalPrice"
              type="number"
              value={formData.originalPrice || ""}
              onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
              data-testid="input-product-original-price"
            />
          </div>
          <div>
            <Label htmlFor="warrantyYears">Warranty (Years)</Label>
            <Input
              id="warrantyYears"
              type="number"
              value={formData.warrantyYears}
              onChange={(e) => setFormData({ ...formData, warrantyYears: parseInt(e.target.value) || 8 })}
              data-testid="input-product-warranty"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="series">Series *</Label>
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
          <div className="flex items-end gap-6 pb-2">
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
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Premium LED lighting for your vehicle"
            data-testid="input-product-tagline"
          />
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={2}
            data-testid="input-product-short-desc"
          />
        </div>

        <div>
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            id="fullDescription"
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            rows={4}
            data-testid="input-product-full-desc"
          />
        </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beamPatterns">Beam Patterns (comma separated)</Label>
              <Input
                id="beamPatterns"
                value={formData.beamPatterns}
                onChange={(e) => setFormData({ ...formData, beamPatterns: e.target.value })}
                placeholder="Spot, Flood, Driving"
                data-testid="input-product-beam"
              />
            </div>
            <div>
              <Label htmlFor="colors">Colors (comma separated)</Label>
              <Input
                id="colors"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="White, Yellow, Amber"
                data-testid="input-product-colors"
              />
            </div>
          </div>

          <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-white mb-4">Product Variants (Price Management)</h3>
            <p className="text-xs text-zinc-400 mb-4">Set prices for specific beam pattern and color combinations.</p>
            <div className="space-y-4">
              {formData.beamPatterns.split(",").map(b => b.trim()).filter(Boolean).map(beam => (
                formData.colors.split(",").map(c => c.trim()).filter(Boolean).map(color => {
                  const variantKey = `${beam}-${color}`;
                  return (
                    <div key={variantKey} className="grid grid-cols-3 gap-4 items-end p-3 border border-zinc-800 rounded-md bg-zinc-900">
                      <div className="text-sm font-medium text-zinc-300">
                        {beam} / {color}
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-500">Price (INR)</Label>
                        <Input 
                          type="number" 
                          placeholder={formData.price.toString()}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-500">Orig. Price</Label>
                        <Input 
                          type="number" 
                          placeholder={formData.originalPrice?.toString()}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          </div>

        <div>
          <Label htmlFor="features">Features (one per line)</Label>
          <Textarea
            id="features"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={3}
            placeholder="IP68 Rated&#10;Made in USA&#10;SAE/DOT Compliant"
            data-testid="input-product-features"
          />
        </div>

        <div>
          <Label htmlFor="specs">Specifications (one per line)</Label>
          <Textarea
            id="specs"
            value={formData.specs}
            onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
            rows={3}
            placeholder="Power: 20W&#10;Voltage: 9-16V DC"
            data-testid="input-product-specs"
          />
        </div>

        <div>
          <Label htmlFor="whatsInBox">What's In Box (one per line)</Label>
          <Textarea
            id="whatsInBox"
            value={formData.whatsInBox}
            onChange={(e) => setFormData({ ...formData, whatsInBox: e.target.value })}
            rows={3}
            placeholder="LED Pod(s)&#10;Mounting Hardware&#10;Wiring"
            data-testid="input-product-box"
          />
        </div>

        <div>
          <Label htmlFor="images">Image URLs (one per line)</Label>
          <Textarea
            id="images"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            rows={3}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            data-testid="input-product-images"
          />
        </div>

        <div>
          <Label htmlFor="compatibleVehicles">Compatible Vehicles (comma separated)</Label>
          <Input
            id="compatibleVehicles"
            value={formData.compatibleVehicles}
            onChange={(e) => setFormData({ ...formData, compatibleVehicles: e.target.value })}
            placeholder="Mahindra Thar, Scorpio-N, Maruti Jimny"
            data-testid="input-product-vehicles"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-background py-4 border-t">
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
            <DialogContent className="max-w-3xl max-h-[90vh]">
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
                        <DialogContent className="max-w-3xl max-h-[90vh]">
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
