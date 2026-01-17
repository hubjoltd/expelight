import { Button } from "@/components/ui/button";
import { Play, ChevronDown, Shield, Plane } from "lucide-react";
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
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          data-testid="hero-video"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Gradient overlays for premium look */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(5,5,5,0.5) 0%, transparent 30%, transparent 60%, rgba(5,5,5,0.95) 100%),
              radial-gradient(ellipse at 50% 100%, rgba(26, 26, 26, 0.8) 0%, transparent 50%)
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
          {/* Main Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg"
            data-testid="hero-headline"
          >
            <span className="text-white">See What You've</span>{" "}
            <br />
            <span className="text-white">Been Missing.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 drop-shadow-md"
            data-testid="hero-subheadline"
          >
            Engineering-grade lighting systems for the modern Indian explorer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {/* Primary CTA - Ghost button with glowing border */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(229, 57, 53, 0.3)",
                  "0 0 40px rgba(229, 57, 53, 0.5)",
                  "0 0 20px rgba(229, 57, 53, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-md"
            >
              <Button
                size="lg"
                variant="outline"
                className="relative px-10 py-6 text-base font-semibold bg-transparent border-2 border-primary text-white hover:bg-primary/10"
                onClick={scrollToProducts}
                data-testid="cta-explore"
              >
                Explore Systems
              </Button>
            </motion.div>

            {/* Secondary CTA - Watch the Difference */}
            <Button
              variant="ghost"
              size="lg"
              className="text-white/80 hover:text-white px-8 py-6 text-base group backdrop-blur-sm"
              data-testid="cta-watch"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center mr-3 group-hover:border-white/70 group-hover:bg-white/10 transition-all">
                <Play className="w-5 h-5 ml-0.5 fill-white/80" />
              </div>
              Watch the Difference
            </Button>
          </div>

          {/* Official Partner Badge Strip - Monochromatic 50% opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
            data-testid="partner-badges"
          >
            {/* Diode Dynamics Logo + Text */}
            <div className="flex items-center gap-3 opacity-50 hover:opacity-70 transition-opacity">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-xs">DD</span>
              </div>
              <span className="text-xs text-white uppercase tracking-wider">
                Official India Partner
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/20" />

            {/* 8-Year Warranty */}
            <div className="flex items-center gap-2 opacity-50 hover:opacity-70 transition-opacity">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-xs text-white uppercase tracking-wider">
                8-Year Warranty
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/20" />

            {/* Express Air Shipping */}
            <div className="flex items-center gap-2 opacity-50 hover:opacity-70 transition-opacity">
              <Plane className="w-5 h-5 text-white" />
              <span className="text-xs text-white uppercase tracking-wider">
                Express Air Shipping
              </span>
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
