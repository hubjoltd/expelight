import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Pencil, Trash2, FolderTree, AlertCircle, ChevronRight } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadInput } from "@/components/ImageUploadInput";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  level: number;
  imageUrl: string | null;
  isActive: boolean | null;
  createdAt: string | null;
}

export default function AdminCategories() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      return await apiRequest("POST", "/api/admin/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateOpen(false);
      toast({ title: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      return await apiRequest("PATCH", `/api/admin/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      setEditCategory(null);
      toast({ title: "Category updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
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

  const CategoryForm = ({ category, onSubmit, onCancel }: { 
    category?: Category | null; 
    onSubmit: (data: Partial<Category>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<{
      name: string;
      slug: string;
      description: string;
      parentId: string | null;
      level: number;
      imageUrl: string;
      isActive: boolean;
    }>({
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      parentId: category?.parentId || null,
      level: category?.level || 1,
      imageUrl: category?.imageUrl || "",
      isActive: category?.isActive !== false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
      });
    };

    const parentCategories = categories?.filter(c => c.id !== category?.id && c.level < 3) || [];

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            data-testid="input-category-name"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-name"
            data-testid="input-category-slug"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            data-testid="input-category-description"
          />
        </div>

        <div>
          <Label htmlFor="parentId">Parent Category</Label>
          <Select 
            value={formData.parentId || "none"} 
            onValueChange={(v) => {
              const parentId = v === "none" ? null : v;
              const parentCategory = categories?.find(c => c.id === parentId);
              setFormData({ 
                ...formData, 
                parentId,
                level: parentCategory ? parentCategory.level + 1 : 1
              });
            }}
          >
            <SelectTrigger data-testid="select-category-parent">
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Parent (Top Level)</SelectItem>
              {parentCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {"  ".repeat(cat.level - 1)}{cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ImageUploadInput
          label="Category Image"
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          testId="input-category-image"
        />

        <div className="flex items-center gap-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
            data-testid="switch-category-active"
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="button-save-category">
            {category ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    );
  };

  const getCategoryPath = (cat: Category): string[] => {
    const path: string[] = [cat.name];
    if (cat.parentId) {
      const parent = categories?.find(c => c.id === cat.parentId);
      if (parent) {
        return [...getCategoryPath(parent), cat.name];
      }
    }
    return path;
  };

  const sortedCategories = categories?.slice().sort((a, b) => {
    const pathA = getCategoryPath(a).join(" > ");
    const pathB = getCategoryPath(b).join(" > ");
    return pathA.localeCompare(pathB);
  }) || [];

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
            <h1 className="text-3xl font-bold text-white">Categories</h1>
            <p className="text-zinc-400">Organize products with hierarchical categories</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-category">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm 
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-zinc-400">Loading categories...</div>
        ) : (
          <div className="space-y-3">
            {sortedCategories.map((category) => {
              const path = getCategoryPath(category);
              return (
                <Card key={category.id} className="bg-zinc-900 border-zinc-800" data-testid={`card-category-${category.id}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ marginLeft: `${(category.level - 1) * 24}px` }}
                      >
                        <FolderTree className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center text-sm text-zinc-500">
                            {path.slice(0, -1).map((p, i) => (
                              <span key={i} className="flex items-center">
                                {p}
                                <ChevronRight className="w-3 h-3 mx-1" />
                              </span>
                            ))}
                          </div>
                          <h3 className="font-semibold text-white">{category.name}</h3>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">Level {category.level}</Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-zinc-400 truncate">{category.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog open={editCategory?.id === category.id} onOpenChange={(open) => !open && setEditCategory(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setEditCategory(category)} data-testid={`button-edit-category-${category.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <CategoryForm 
                              category={editCategory}
                              onSubmit={(data) => updateMutation.mutate({ id: category.id, data })}
                              onCancel={() => setEditCategory(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this category?")) {
                              deleteMutation.mutate(category.id);
                            }
                          }}
                          data-testid={`button-delete-category-${category.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {sortedCategories.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                No categories found. Create your first category to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
