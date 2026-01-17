import { useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@shared/schema";

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Proven on <span className="text-gradient-amber">Indian Roads</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Built by enthusiasts. Tested in India. Hear from real owners who made the switch.
            </p>
          </div>

          {/* Navigation arrows - Desktop only */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              data-testid="scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              data-testid="scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Reviews carousel */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="min-w-[320px] md:min-w-[400px] p-6 bg-card border-border/50">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
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
                className="min-w-[320px] md:min-w-[400px] snap-center"
              >
                <Card
                  className="h-full glass-dark p-6 hover-elevate transition-all duration-300"
                  data-testid={`review-card-${review.id}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>

                    {/* Verified badge */}
                    {review.isVerified && (
                      <Badge
                        variant="outline"
                        className="text-green-500 border-green-500/30 bg-green-500/10"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Review text */}
                  <p className="text-foreground mb-6 text-sm leading-relaxed">
                    "{review.text}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {review.authorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        — {review.authorName}, {review.authorLocation}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
