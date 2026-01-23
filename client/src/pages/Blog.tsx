import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

function BlogList() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Stay updated with the latest news, guides, and tips about automotive LED lighting
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-zinc-400">Loading posts...</div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors h-full cursor-pointer" data-testid={`card-blog-${post.slug}`}>
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-400">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-zinc-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Post Not Found</h2>
              <p className="text-zinc-400 mb-4">The blog post you're looking for doesn't exist.</p>
              <Link href="/blog">
                <Button variant="outline">Back to Blog</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2 mb-8" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>

          {post.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-xl mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <Badge variant="outline">{post.category}</Badge>
              )}
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div 
              className="text-zinc-300 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}

export default function Blog() {
  const { slug } = useParams<{ slug?: string }>();
  
  if (slug) {
    return <BlogPostView />;
  }
  
  return <BlogList />;
}
