import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, Lightbulb } from "lucide-react";
import type { Review } from "@shared/schema";

// Vehicle lighting night shots - showcasing actual lit headlights
const vehicleLightingImages = [
  "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const navigate = (newDirection: number) => {
    setIsAutoPlaying(false); // Pause auto-play on manual navigation
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return reviews.length - 1;
      if (next >= reviews.length) return 0;
      return next;
    });
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Book-opening animation variants with enhanced effects
  const bookVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.85,
      x: direction > 0 ? 100 : -100,
      transformOrigin: direction > 0 ? "left center" : "right center",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      x: 0,
      transformOrigin: "center center",
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.85,
      x: direction < 0 ? 100 : -100,
      transformOrigin: direction < 0 ? "left center" : "right center",
    }),
  };

  // Image animation variants
  const imageVariants = {
    enter: { scale: 1.2, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      style={{ perspective: "1500px" }}
      data-testid="reviews-section"
    >
      {/* Premium dark background with animated glow */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Animated headlight glow effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl" />
      </motion.div>

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
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-zinc-600" />
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                Real Owners. Real Nights.
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Verified Owners
            </h2>
          </div>

          {/* Navigation arrows with glow effect */}
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
                className="w-14 h-14 rounded-full border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
                data-testid="scroll-left"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(1)}
                className="w-14 h-14 rounded-full border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
                data-testid="scroll-right"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Book-opening testimonial carousel */}
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-[500px] w-full max-w-5xl rounded-2xl bg-zinc-900" />
          </div>
        ) : (
          <div 
            className="relative min-h-[560px] flex items-center justify-center"
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
                    stiffness: 200,
                    damping: 25,
                    duration: 0.6,
                  }}
                  className="w-full max-w-5xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card
                    className="overflow-hidden bg-[#0a0a0a] border border-zinc-800/50 rounded-2xl"
                    style={{
                      boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 120px rgba(255,255,255,0.03)",
                    }}
                    data-testid={`review-card-${reviews[currentIndex].id}`}
                  >
                    <div className="grid md:grid-cols-2">
                      {/* Large vehicle lighting shot with animation */}
                      <div className="relative h-72 md:h-auto min-h-[350px] overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentIndex}
                            variants={imageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            src={vehicleLightingImages[currentIndex % vehicleLightingImages.length]}
                            alt={`${reviews[currentIndex].vehicleOwned} with upgraded lights`}
                            className="w-full h-full object-cover"
                          />
                        </AnimatePresence>
                        
                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] md:block hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:hidden" />
                        
                        {/* Light beam effect overlay */}
                        <motion.div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <div className="w-full h-full bg-gradient-to-t from-white/10 to-transparent rounded-t-full blur-2xl" />
                        </motion.div>
                        
                        {/* Verified Owner Badge - Prominent */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute top-4 left-4"
                        >
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider shadow-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified Owner
                          </div>
                        </motion.div>
                      </div>

                      {/* Content with staggered animations */}
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        {/* Stars with stagger */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-1.5 mb-6"
                        >
                          {Array.from({ length: reviews[currentIndex].rating }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <Star className="w-6 h-6 fill-white text-white" />
                            </motion.div>
                          ))}
                        </motion.div>

                        {/* Quote icon with glow */}
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                        >
                          <Quote className="w-12 h-12 text-zinc-800 mb-4 rotate-180" />
                        </motion.div>
                        
                        {/* Review text - High contrast white */}
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-white text-xl md:text-2xl leading-relaxed mb-8 font-light"
                        >
                          {reviews[currentIndex].text}
                        </motion.p>

                        {/* Author info with slide animation */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center justify-between pt-6 border-t border-zinc-800"
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
                            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
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

        {/* Progress bar and pagination dots */}
        <div className="flex flex-col items-center gap-4 mt-10">
          {/* Auto-play progress bar */}
          {isAutoPlaying && reviews.length > 0 && (
            <div className="w-32 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                key={currentIndex}
              />
            </div>
          )}
          
          {/* Pagination dots */}
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-white w-8" 
                    : "bg-zinc-800 w-2 hover:bg-zinc-700"
                }`}
                data-testid={`pagination-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
