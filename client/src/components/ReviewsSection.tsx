import { useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@shared/schema";

const carImages = [
  "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
];

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 450;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="py-20 md:py-32 relative overflow-hidden"
      data-testid="reviews-section"
    >
      {/* Background - Dark mode proof */}
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Verified <span className="text-zinc-500">Performance</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Real owners. Real roads. Real results.
            </p>
          </div>

          {/* Navigation arrows - Desktop only */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              data-testid="scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              data-testid="scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Reviews carousel */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="min-w-[380px] md:min-w-[420px] p-0 bg-[#111] border-zinc-800/50">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            data-testid="reviews-carousel"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[380px] md:min-w-[420px] snap-center group"
              >
                <Card
                  className="h-full overflow-hidden bg-[#111] transition-all duration-300"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                  }}
                  data-testid={`review-card-${review.id}`}
                >
                  {/* Car Image - Zoom on hover */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={carImages[index % carImages.length]}
                      alt={`${review.vehicleOwned} with upgraded lights`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6">
                    {/* Header - Stars and Verified badge */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Gold glowing stars */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                            style={{
                              filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))"
                            }}
                          />
                        ))}
                      </div>

                      {/* Verified Purchase badge */}
                      {review.isVerified && (
                        <Badge
                          variant="outline"
                          className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    {/* Review text */}
                    <p className="text-zinc-300 mb-6 text-sm leading-relaxed min-h-[80px]">
                      "{review.text}"
                    </p>

                    {/* Author info */}
                    <div className="pt-4 border-t border-zinc-800/50">
                      <p className="text-white text-sm font-medium">
                        — {review.authorName}, {review.authorLocation}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {review.vehicleOwned}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
