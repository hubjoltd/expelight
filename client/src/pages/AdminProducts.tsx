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
import { ArrowLeft, Plus, Pencil, Trash2, Package, Search, AlertCircle, Eye, EyeOff, Loader2, ImageIcon } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadInput, MultiImageUploadInput } from "@/components/ImageUploadInput";

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
  tagline: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  beamPatterns: string[] | null;
  colors: string[] | null;
  features: string[] | null;
  specs: string[] | null;
  whatsInBox: string[] | null;
  warrantyYears: number | null;
  compatibleVehicles: string[] | null;
  videoUrl: string | null;
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
    onSuccess: async (newProduct: Product) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateOpen(false);
      setEditProduct(newProduct);
      toast({ title: "Product created! Add variants below." });
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

  const VariantManager = ({ productId }: { productId: string }) => {
    const { data: variants = [], isLoading } = useQuery<any[]>({
      queryKey: ["/api/admin/products", productId, "variants"],
      enabled: !!productId,
    });

    const [editingVariant, setEditingVariant] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Record<string, any>>({});
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVariant, setNewVariant] = useState({
      name: "", sku: "", price: 0, beamPattern: "", color: "", model: "", imageUrl: "", compareAtPrice: 0,
    });

    const toggleMutation = useMutation({
      mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
        setTogglingId(id);
        return await apiRequest("PATCH", `/api/admin/variants/${id}`, { isAvailable });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/products", productId, "variants"] });
        queryClient.invalidateQueries({ queryKey: ["/api/products", productId, "variants"] });
        setTogglingId(null);
        toast({ title: "Variant updated" });
      },
      onError: () => {
        setTogglingId(null);
        toast({ title: "Failed to update variant", variant: "destructive" });
      },
    });

    const updateVariantMutation = useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        return await apiRequest("PATCH", `/api/admin/variants/${id}`, data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/products", productId, "variants"] });
        queryClient.invalidateQueries({ queryKey: ["/api/products", productId, "variants"] });
        setEditingVariant(null);
        toast({ title: "Variant saved" });
      },
      onError: () => {
        toast({ title: "Failed to save variant", variant: "destructive" });
      },
    });

    const createVariantMutation = useMutation({
      mutationFn: async (data: any) => {
        return await apiRequest("POST", `/api/admin/products/${productId}/variants`, data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/products", productId, "variants"] });
        queryClient.invalidateQueries({ queryKey: ["/api/products", productId, "variants"] });
        setShowAddForm(false);
        setNewVariant({ name: "", sku: "", price: 0, beamPattern: "", color: "", model: "", imageUrl: "", compareAtPrice: 0 });
        toast({ title: "Variant created" });
      },
      onError: () => {
        toast({ title: "Failed to create variant", variant: "destructive" });
      },
    });

    const deleteVariantMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest("DELETE", `/api/admin/variants/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/products", productId, "variants"] });
        queryClient.invalidateQueries({ queryKey: ["/api/products", productId, "variants"] });
        toast({ title: "Variant deleted" });
      },
      onError: () => {
        toast({ title: "Failed to delete variant", variant: "destructive" });
      },
    });

    const toggleAll = (enable: boolean) => {
      variants.forEach((v: any) => {
        if (v.isAvailable !== enable) {
          toggleMutation.mutate({ id: v.id, isAvailable: enable });
        }
      });
    };

    const handleCreateVariant = () => {
      if (!newVariant.name || !newVariant.sku || !newVariant.price) {
        toast({ title: "Name, SKU, and Price are required", variant: "destructive" });
        return;
      }
      createVariantMutation.mutate({
        name: newVariant.name,
        sku: newVariant.sku,
        price: newVariant.price,
        beamPattern: newVariant.beamPattern || null,
        color: newVariant.color || null,
        model: newVariant.model || null,
        imageUrl: newVariant.imageUrl || null,
        compareAtPrice: newVariant.compareAtPrice || null,
        isAvailable: true,
      });
    };

    if (isLoading) {
      return (
        <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading variants...
          </div>
        </div>
      );
    }

    const enabledCount = variants.filter((v: any) => v.isAvailable !== false).length;

    return (
      <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Variants ({variants.length})</h3>
            {variants.length > 0 && (
              <p className="text-xs text-zinc-400">
                {enabledCount} enabled, {variants.length - enabledCount} disabled
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {variants.length > 0 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleAll(true)}
                  data-testid="button-enable-all-variants"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Enable All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleAll(false)}
                  data-testid="button-disable-all-variants"
                >
                  <EyeOff className="w-3 h-3 mr-1" />
                  Disable All
                </Button>
              </>
            )}
            <Button
              type="button"
              size="sm"
              className="h-7 text-xs bg-red-600 hover:bg-red-700"
              onClick={() => setShowAddForm(!showAddForm)}
              data-testid="button-add-variant"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Variant
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-4 p-3 border border-red-900/50 rounded-md bg-zinc-900 space-y-2">
            <h4 className="text-xs font-semibold text-red-400 mb-2">New Variant</h4>
            <p className="text-[10px] text-zinc-500 -mt-1 mb-1">Beam Pattern, Color, and Model drive the product page selectors. Model is optional — only needed when beam + color don't uniquely identify a variant.</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-zinc-400">SKU *</Label>
                <Input
                  value={newVariant.sku}
                  onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="e.g. DD5014"
                  data-testid="input-new-variant-sku"
                />
              </div>
              <div>
                <Label className="text-[10px] text-zinc-400">Price (INR) *</Label>
                <Input
                  type="number"
                  value={newVariant.price || ""}
                  onChange={(e) => setNewVariant({ ...newVariant, price: parseInt(e.target.value) || 0 })}
                  className="h-7 text-xs"
                  placeholder="Price in INR"
                  data-testid="input-new-variant-price"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-zinc-400">Name *</Label>
                <Input
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="e.g. Combo / White"
                  data-testid="input-new-variant-name"
                />
              </div>
              <div>
                <Label className="text-[10px] text-zinc-400">Compare At Price</Label>
                <Input
                  type="number"
                  value={newVariant.compareAtPrice || ""}
                  onChange={(e) => setNewVariant({ ...newVariant, compareAtPrice: parseInt(e.target.value) || 0 })}
                  className="h-7 text-xs"
                  placeholder="Original price"
                  data-testid="input-new-variant-compare-price"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-[10px] text-zinc-400">Beam Pattern</Label>
                <Input
                  value={newVariant.beamPattern}
                  onChange={(e) => setNewVariant({ ...newVariant, beamPattern: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="e.g. Spot, Driving"
                  data-testid="input-new-variant-beam"
                />
              </div>
              <div>
                <Label className="text-[10px] text-zinc-400">Color</Label>
                <Input
                  value={newVariant.color}
                  onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="e.g. White, Amber"
                  data-testid="input-new-variant-color"
                />
              </div>
              <div>
                <Label className="text-[10px] text-zinc-400">Model</Label>
                <Input
                  value={newVariant.model}
                  onChange={(e) => setNewVariant({ ...newVariant, model: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="e.g. Sport, Pro, Max"
                  data-testid="input-new-variant-model"
                />
              </div>
            </div>
            <ImageUploadInput
              label="Variant Image"
              value={newVariant.imageUrl}
              onChange={(url) => setNewVariant({ ...newVariant, imageUrl: url })}
              testId="input-new-variant-image"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowAddForm(false)}
                data-testid="button-cancel-new-variant"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs bg-red-600 hover:bg-red-700"
                onClick={handleCreateVariant}
                disabled={createVariantMutation.isPending}
                data-testid="button-save-new-variant"
              >
                {createVariantMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <Plus className="w-3 h-3 mr-1" />
                )}
                Create Variant
              </Button>
            </div>
          </div>
        )}

        {variants.length === 0 && !showAddForm && (
          <p className="text-sm text-zinc-400">No variants yet. Click "Add Variant" to create one.</p>
        )}

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {variants.map((variant: any) => {
            const isEditing = editingVariant === variant.id;
            return (
              <div
                key={variant.id}
                className={`p-3 rounded-md border transition-all ${
                  variant.isAvailable === false
                    ? "border-zinc-800 bg-zinc-900/50 opacity-60"
                    : "border-zinc-700 bg-zinc-800/50"
                }`}
                data-testid={`variant-row-${variant.sku}`}
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-[10px] text-zinc-400">SKU</Label>
                        <Input
                          value={editValues.sku || ""}
                          onChange={(e) => setEditValues({ ...editValues, sku: e.target.value })}
                          className="h-7 text-xs"
                          placeholder="SKU"
                          data-testid={`input-variant-sku-${variant.sku}`}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400">Price (INR)</Label>
                        <Input
                          type="number"
                          value={editValues.price || ""}
                          onChange={(e) => setEditValues({ ...editValues, price: parseInt(e.target.value) || 0 })}
                          className="h-7 text-xs"
                          placeholder="Price"
                          data-testid={`input-variant-price-${variant.sku}`}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400">Compare Price</Label>
                        <Input
                          type="number"
                          value={editValues.compareAtPrice || ""}
                          onChange={(e) => setEditValues({ ...editValues, compareAtPrice: parseInt(e.target.value) || 0 })}
                          className="h-7 text-xs"
                          placeholder="Original price"
                          data-testid={`input-variant-compare-${variant.sku}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-[10px] text-zinc-400">Beam Pattern</Label>
                        <Input
                          value={editValues.beamPattern || ""}
                          onChange={(e) => setEditValues({ ...editValues, beamPattern: e.target.value })}
                          className="h-7 text-xs"
                          placeholder="e.g. Spot, Driving"
                          data-testid={`input-variant-beam-${variant.sku}`}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400">Color</Label>
                        <Input
                          value={editValues.color || ""}
                          onChange={(e) => setEditValues({ ...editValues, color: e.target.value })}
                          className="h-7 text-xs"
                          placeholder="e.g. White, Amber"
                          data-testid={`input-variant-color-${variant.sku}`}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400">Model</Label>
                        <Input
                          value={editValues.model || ""}
                          onChange={(e) => setEditValues({ ...editValues, model: e.target.value })}
                          className="h-7 text-xs"
                          placeholder="e.g. Sport, Pro, Max"
                          data-testid={`input-variant-model-${variant.sku}`}
                        />
                      </div>
                    </div>
                    <ImageUploadInput
                      label="Variant Image"
                      value={editValues.imageUrl || ""}
                      onChange={(url) => setEditValues({ ...editValues, imageUrl: url })}
                      testId={`input-variant-image-${variant.sku}`}
                    />
                    <div className="flex justify-end gap-1 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={() => setEditingVariant(null)}
                        data-testid={`button-cancel-variant-${variant.sku}`}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={() =>
                          updateVariantMutation.mutate({
                            id: variant.id,
                            data: {
                              name: editValues.name,
                              sku: editValues.sku,
                              price: editValues.price,
                              compareAtPrice: editValues.compareAtPrice || null,
                              beamPattern: editValues.beamPattern || null,
                              color: editValues.color || null,
                              model: editValues.model || null,
                              imageUrl: editValues.imageUrl || null,
                            },
                          })
                        }
                        disabled={updateVariantMutation.isPending}
                        data-testid={`button-save-variant-${variant.sku}`}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={variant.isAvailable !== false}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: variant.id, isAvailable: checked })
                      }
                      disabled={togglingId === variant.id}
                      data-testid={`switch-variant-${variant.sku}`}
                    />
                    {variant.imageUrl && (
                      <img
                        src={variant.imageUrl}
                        alt={variant.name}
                        className="w-8 h-8 rounded border border-zinc-700 object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        data-testid={`img-variant-${variant.sku}`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-400">{variant.sku}</span>
                        {variant.beamPattern && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1">
                            {variant.beamPattern}
                          </Badge>
                        )}
                        {variant.color && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1 border-zinc-600">
                            {variant.color}
                          </Badge>
                        )}
                        {variant.model && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1 border-blue-700 text-blue-400">
                            {variant.model}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 truncate mt-0.5">{variant.name}</p>
                    </div>
                    <span className="text-xs font-medium text-white whitespace-nowrap">
                      ₹{variant.price?.toLocaleString("en-IN")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setEditingVariant(variant.id);
                          setEditValues({
                            name: variant.name,
                            sku: variant.sku,
                            price: variant.price,
                            compareAtPrice: variant.compareAtPrice || 0,
                            beamPattern: variant.beamPattern || "",
                            color: variant.color || "",
                            model: variant.model || "",
                            imageUrl: variant.imageUrl || "",
                          });
                        }}
                        data-testid={`button-edit-variant-${variant.sku}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-400"
                        onClick={() => {
                          if (confirm(`Delete variant ${variant.sku} - ${variant.name}?`)) {
                            deleteVariantMutation.mutate(variant.id);
                          }
                        }}
                        data-testid={`button-delete-variant-${variant.sku}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ProductForm = ({ product, onSubmit, onCancel }: { 
    product?: Product | null; 
    onSubmit: (data: any) => void;
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
      tagline: product?.tagline || "",
      shortDescription: product?.shortDescription || "",
      fullDescription: product?.fullDescription || "",
      beamPatterns: product?.beamPatterns?.join(", ") || "",
      colors: product?.colors?.join(", ") || "",
      features: product?.features?.join("\n") || "",
      specs: product?.specs?.join("\n") || "",
      whatsInBox: product?.whatsInBox?.join("\n") || "",
      warrantyYears: product?.warrantyYears || 8,
      images: product?.images?.join("\n") || "",
      compatibleVehicles: product?.compatibleVehicles?.join(", ") || "",
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

          {product?.id && <VariantManager productId={product.id} />}

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

        <MultiImageUploadInput
          label="Product Images"
          value={formData.images}
          onChange={(val) => setFormData({ ...formData, images: val })}
          testId="input-product-images"
        />

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
