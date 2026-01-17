import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return reviews.length - 1;
      if (next >= reviews.length) return 0;
      return next;
    });
  };

  // Book-opening animation variants
  const bookVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      transformOrigin: direction > 0 ? "left center" : "right center",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: "center center",
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      transformOrigin: direction < 0 ? "left center" : "right center",
    }),
  };

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      style={{ perspective: "1200px" }}
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
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
              data-testid="scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(1)}
              className="w-12 h-12 rounded-full border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
              data-testid="scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Book-opening testimonial carousel */}
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-[500px] w-full max-w-4xl rounded-xl bg-zinc-900" />
          </div>
        ) : (
          <div 
            className="relative min-h-[520px] flex items-center justify-center"
            data-testid="reviews-carousel"
          >
            <AnimatePresence mode="wait" custom={direction}>
              {reviews.length > 0 && (
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={bookVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5,
                  }}
                  className="w-full max-w-4xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card
                    className="overflow-hidden bg-[#0a0a0a] border-0 rounded-2xl"
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255,255,255,0.02)",
                    }}
                    data-testid={`review-card-${reviews[currentIndex].id}`}
                  >
                    <div className="grid md:grid-cols-2">
                      {/* Large car night shot */}
                      <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
                        <motion.img
                          key={currentIndex}
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.6 }}
                          src={carNightImages[currentIndex % carNightImages.length]}
                          alt={`${reviews[currentIndex].vehicleOwned} night shot`}
                          className="w-full h-full object-cover"
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] md:block hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:hidden" />
                        
                        {/* Verified Owner Badge - Prominent */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute top-4 left-4"
                        >
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider shadow-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified Owner
                          </div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        {/* Stars */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-1 mb-6"
                        >
                          {Array.from({ length: reviews[currentIndex].rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-white text-white"
                            />
                          ))}
                        </motion.div>

                        {/* Quote icon */}
                        <Quote className="w-10 h-10 text-zinc-800 mb-4 rotate-180" />
                        
                        {/* Review text - High contrast white */}
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-white text-xl md:text-2xl leading-relaxed mb-8 font-light"
                        >
                          {reviews[currentIndex].text}
                        </motion.p>

                        {/* Author info */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center justify-between pt-6 border-t border-zinc-900"
                        >
                          <div>
                            <p className="text-white font-semibold text-lg">
                              {reviews[currentIndex].authorName}
                            </p>
                            <p className="text-zinc-600 text-sm">
                              {reviews[currentIndex].authorLocation}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-zinc-500 text-xs uppercase tracking-wider">
                              Vehicle
                            </p>
                            <p className="text-white text-sm font-medium">
                              {reviews[currentIndex].vehicleOwned}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-6" 
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
              data-testid={`pagination-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
