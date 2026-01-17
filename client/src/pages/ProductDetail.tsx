import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { ProductPage } from "@/components/ProductPage";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", params.slug],
    enabled: !!params.slug,
  });

  return (
    <div className="min-h-screen bg-background" data-testid="product-detail-page">
      <Header />
      <main>
        {isLoading ? (
          <div className="min-h-screen pt-20 pb-20">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
              <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
            </div>
          </div>
        ) : product ? (
          <ProductPage product={product} />
        ) : null}
      </main>
      <TrustBar />
      <Footer />
    </div>
  );
}
