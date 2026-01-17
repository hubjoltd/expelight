import { Button } from "@/components/ui/button";
import { Play, ChevronDown, Shield, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";
import heroVideo from "@assets/generated_videos/suv_headlights_cutting_through_fog.mp4";

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById("stage-selector")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Full-screen looped video background */}
      <div className="absolute inset-0 bg-[#050505]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="hero-video"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Gradient overlays for premium look */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, transparent 30%, transparent 70%, rgba(5,5,5,0.9) 100%),
              radial-gradient(ellipse at 50% 100%, rgba(26, 26, 26, 0.6) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Fog/mist effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-primary/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-primary font-medium">
              Official India Partner - Diode Dynamics USA
            </span>
          </motion.div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg"
            data-testid="hero-headline"
          >
            <span className="text-white">See What You've</span>{" "}
            <br />
            <span className="text-gradient-red">Been Missing.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 drop-shadow-md"
            data-testid="hero-subheadline"
          >
            Engineering-grade lighting systems for the modern Indian explorer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Primary CTA - Ghost button with glowing border */}
            <Button
              size="lg"
              variant="outline"
              className="relative px-8 py-6 text-base font-semibold border-primary/60 text-white hover:bg-primary/20 hover:border-primary group backdrop-blur-sm"
              onClick={scrollToProducts}
              data-testid="cta-explore"
              style={{
                boxShadow: "0 0 25px rgba(229, 57, 53, 0.3), inset 0 0 20px rgba(229, 57, 53, 0.1)",
              }}
            >
              <span className="relative z-10">Explore Systems</span>
              <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{ boxShadow: "0 0 40px rgba(229, 57, 53, 0.5)" }} 
              />
            </Button>

            {/* Secondary CTA - Watch the Difference */}
            <Button
              variant="ghost"
              size="lg"
              className="text-white/80 hover:text-white px-8 py-6 text-base group backdrop-blur-sm"
              data-testid="cta-watch"
            >
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center mr-3 group-hover:border-primary/60 group-hover:bg-primary/20 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              Watch the Difference
            </Button>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            data-testid="trust-badges"
          >
            <div className="flex items-center gap-2 text-white/50">
              <Award className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">USA Engineered</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <Shield className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">8-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <Zap className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">Plug & Play</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </section>
  );
}
