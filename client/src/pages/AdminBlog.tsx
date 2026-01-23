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
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Search, AlertCircle, Eye, Calendar } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  author: string;
  category: string | null;
  tags: string[] | null;
  isPublished: boolean | null;
  publishedAt: string | null;
  createdAt: string | null;
}

export default function AdminBlog() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
  });

  const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<BlogPost>) => {
      return await apiRequest("POST", "/api/admin/blog", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setIsCreateOpen(false);
      toast({ title: "Blog post created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create blog post", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
      return await apiRequest("PATCH", `/api/admin/blog/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setEditPost(null);
      toast({ title: "Blog post updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update blog post", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Blog post deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete blog post", variant: "destructive" });
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

  const filteredPosts = posts?.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not published";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const BlogPostForm = ({ post, onSubmit, onCancel }: {
    post?: BlogPost | null;
    onSubmit: (data: Partial<BlogPost>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      featuredImage: post?.featuredImage || "",
      author: post?.author || "Expelight Team",
      category: post?.category || "",
      tags: post?.tags?.join(", ") || "",
      isPublished: post?.isPublished || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            data-testid="input-blog-title"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-title"
            data-testid="input-blog-slug"
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            required
            data-testid="input-blog-excerpt"
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            required
            data-testid="input-blog-content"
          />
        </div>

        <div>
          <Label htmlFor="featuredImage">Featured Image URL</Label>
          <Input
            id="featuredImage"
            value={formData.featuredImage}
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            placeholder="https://..."
            data-testid="input-blog-image"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              data-testid="input-blog-author"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger data-testid="select-blog-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Guides">Guides</SelectItem>
                <SelectItem value="Reviews">Reviews</SelectItem>
                <SelectItem value="Tips">Tips</SelectItem>
                <SelectItem value="Announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="LED, Lighting, Thar, etc."
            data-testid="input-blog-tags"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isPublished"
            checked={formData.isPublished}
            onCheckedChange={(c) => setFormData({ ...formData, isPublished: c })}
            data-testid="switch-blog-published"
          />
          <Label htmlFor="isPublished">Publish immediately</Label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="button-save-blog">
            {post ? "Update Post" : "Create Post"}
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
            <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
            <p className="text-zinc-400">Create and manage blog content</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-blog">
                <Plus className="w-4 h-4" />
                Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Blog Post</DialogTitle>
              </DialogHeader>
              <BlogPostForm
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-blog"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-zinc-400">Loading blog posts...</div>
        ) : (
          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-zinc-900 border-zinc-800" data-testid={`card-blog-${post.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white truncate">{post.title}</h3>
                        {post.isPublished ? (
                          <Badge className="bg-green-500/20 text-green-400">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        {post.category && (
                          <Badge variant="outline">{post.category}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span>By {post.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.isPublished && (
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="icon" data-testid={`view-blog-${post.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <Dialog open={editPost?.id === post.id} onOpenChange={(open) => !open && setEditPost(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setEditPost(post)} data-testid={`edit-blog-${post.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Blog Post</DialogTitle>
                          </DialogHeader>
                          <BlogPostForm
                            post={post}
                            onSubmit={(data) => updateMutation.mutate({ id: post.id, data })}
                            onCancel={() => setEditPost(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this post?")) {
                            deleteMutation.mutate(post.id);
                          }
                        }}
                        data-testid={`delete-blog-${post.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No blog posts found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
