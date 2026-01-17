import { useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Review } from "@shared/schema";

const carNightImages = [
  "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
];

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="reviews-section"
    >
      {/* Premium dark background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(30,30,30,0.5) 0%, transparent 60%)"
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Premium header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 mb-4">
              Owner Experiences
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Verified Owners
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
              data-testid="scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
              data-testid="scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Premium testimonial slider */}
        {isLoading ? (
          <div className="flex gap-8 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[450px] md:min-w-[520px]">
                <Skeleton className="h-[400px] w-full rounded-xl bg-zinc-900" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
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
                className="min-w-[450px] md:min-w-[520px] snap-center group"
              >
                <Card
                  className="h-full overflow-hidden bg-[#0a0a0a] border-0 rounded-xl"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  data-testid={`review-card-${review.id}`}
                >
                  {/* Large car night shot */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={carNightImages[index % carNightImages.length]}
                      alt={`${review.vehicleOwned} night shot`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                    
                    {/* Verified Owner Badge - Prominent */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified Owner
                      </div>
                    </div>

                    {/* Stars overlay */}
                    <div className="absolute bottom-4 left-6 flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-white text-white"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-zinc-800 mb-4 rotate-180" />
                    
                    {/* Review text - High contrast white */}
                    <p className="text-white text-lg leading-relaxed mb-8 font-light">
                      {review.text}
                    </p>

                    {/* Author info */}
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                      <div>
                        <p className="text-white font-semibold text-base">
                          {review.authorName}
                        </p>
                        <p className="text-zinc-600 text-sm">
                          {review.authorLocation}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">
                          Vehicle
                        </p>
                        <p className="text-white text-sm font-medium">
                          {review.vehicleOwned}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.slice(0, 4).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === 0 ? "bg-white" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
