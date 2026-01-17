import { Button } from "@/components/ui/button";
import { Play, ChevronDown, Shield, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById("stage-selector")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Video/Dark Background with fog effect */}
      <div className="absolute inset-0 bg-[#050505]">
        {/* Simulated fog/mist overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 100%, rgba(26, 26, 26, 0.8) 0%, transparent 50%),
              radial-gradient(ellipse at 30% 50%, rgba(229, 57, 53, 0.05) 0%, transparent 40%),
              radial-gradient(ellipse at 70% 50%, rgba(229, 57, 53, 0.05) 0%, transparent 40%)
            `,
          }}
        />
        
        {/* Light beam effects - simulating headlights cutting through fog */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Left beam */}
            <div
              className="absolute w-[200px] md:w-[400px] h-[300px] md:h-[500px] origin-top"
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 30%, transparent 100%)`,
                transform: "rotate(-15deg) translateX(-100%)",
                clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              }}
            />
            {/* Right beam */}
            <div
              className="absolute w-[200px] md:w-[400px] h-[300px] md:h-[500px] origin-top"
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 30%, transparent 100%)`,
                transform: "rotate(15deg)",
                clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              }}
            />
            {/* Center glow */}
            <div
              className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full -translate-x-1/2"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(229,57,53,0.3) 50%, transparent 70%)",
                boxShadow: "0 0 60px 30px rgba(255,255,255,0.2), 0 0 100px 60px rgba(229,57,53,0.1)",
              }}
            />
          </motion.div>
        </div>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-primary font-medium">
              Official India Partner - Diode Dynamics USA
            </span>
          </motion.div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            data-testid="hero-headline"
          >
            <span className="text-foreground">See What You've</span>
            <br />
            <span className="text-gradient-red">Been Missing.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            data-testid="hero-subheadline"
          >
            Engineering-grade lighting systems for the modern Indian explorer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Primary CTA - Ghost button with glowing border */}
            <Button
              size="lg"
              variant="outline"
              className="relative px-8 py-6 text-base font-semibold border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group"
              onClick={scrollToProducts}
              data-testid="cta-explore"
              style={{
                boxShadow: "0 0 20px rgba(229, 57, 53, 0.2), inset 0 0 20px rgba(229, 57, 53, 0.05)",
              }}
            >
              <span className="relative z-10">Explore Systems</span>
              <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{ boxShadow: "0 0 30px rgba(229, 57, 53, 0.4)" }} 
              />
            </Button>

            {/* Secondary CTA - Watch the Difference */}
            <Button
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground px-8 py-6 text-base group"
              data-testid="cta-watch"
            >
              <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center mr-3 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
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
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Award className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">USA Engineered</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Shield className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider">8-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
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
        <ChevronDown className="w-6 h-6 text-muted-foreground/40" />
      </motion.div>
    </section>
  );
}
