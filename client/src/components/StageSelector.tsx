import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface SeriesCard {
  id: string;
  series: string;
  tagline: string;
  description: string;
  startingPrice: number;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  features: string[];
  isPopular?: boolean;
}

const seriesData: SeriesCard[] = [
  {
    id: "sport",
    series: "Sport Series",
    tagline: "The Daily Driver",
    description: "2x Brighter than stock. Street-legal SAE patterns. The perfect plug-and-play upgrade for city and highway commutes.",
    startingPrice: 18000,
    accentColor: "text-zinc-400",
    borderColor: "border-zinc-600",
    glowColor: "rgba(161, 161, 170, 0.3)",
    features: ["2x Stock Brightness", "SAE Compliant", "Plug & Play"],
  },
  {
    id: "pro",
    series: "Pro Series",
    tagline: "The Weekend Warrior",
    description: "4x Brighter. Maximum intensity for dark highways and sudden trails. The #1 choice for Mahindra Thar owners.",
    startingPrice: 30000,
    accentColor: "text-white",
    borderColor: "border-zinc-400",
    glowColor: "rgba(255, 255, 255, 0.4)",
    features: ["4x Stock Brightness", "Highway Rated", "Weather Sealed"],
    isPopular: true,
  },
  {
    id: "max",
    series: "Max Series",
    tagline: "Competition Grade",
    description: "Unmatched distance. Used by professional rally teams. If you drive where roads don't exist, this is your light.",
    startingPrice: 50000,
    accentColor: "text-primary",
    borderColor: "border-primary",
    glowColor: "rgba(229, 57, 53, 0.5)",
    features: ["Maximum Output", "Rally Proven", "10+ Year Life"],
  },
];

export function StageSelector() {
  const [, setLocation] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardClick = (seriesId: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setActiveCard(seriesId);
    } else {
      setActiveCard(seriesId);
    }
  };

  const handleViewProducts = (seriesId: string) => {
    setLocation(`/products?series=${seriesId}`);
  };

  return (
    <section
      id="stage-selector"
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="stage-selector-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your <span className="text-gradient-red">Stage</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            From daily commutes to competition-grade performance, find the perfect lighting system for your driving style.
          </p>
          {!isExpanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-primary/80 flex items-center justify-center gap-2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsExpanded(true)}
            >
              <span>Tap to explore all stages</span>
              <ChevronRight className="w-4 h-4" />
            </motion.p>
          )}
        </motion.div>

        {/* Stacked Cards Gallery */}
        <div className="relative flex justify-center items-center min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              /* Stacked View - Cards behind each other */
              <motion.div
                key="stacked"
                className="relative w-full max-w-sm cursor-pointer"
                onClick={() => setIsExpanded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Back card (Sport - Silver) */}
                <motion.div
                  className="absolute top-0 left-1/2 w-full"
                  style={{ 
                    transform: "translateX(-50%) translateY(40px) scale(0.85)",
                    zIndex: 1 
                  }}
                  whileHover={{ y: 35 }}
                >
                  <Card className="p-6 bg-[#0a0a0a] border-zinc-700/50 opacity-60">
                    <div className="h-64" />
                  </Card>
                </motion.div>

                {/* Middle card (Pro - White) */}
                <motion.div
                  className="absolute top-0 left-1/2 w-full"
                  style={{ 
                    transform: "translateX(-50%) translateY(20px) scale(0.92)",
                    zIndex: 2 
                  }}
                  whileHover={{ y: 15 }}
                >
                  <Card className="p-6 bg-[#0a0a0a] border-zinc-500/50 opacity-80">
                    <div className="h-64" />
                  </Card>
                </motion.div>

                {/* Front card (Max - Red) - Full detail */}
                <motion.div
                  className="relative w-full"
                  style={{ zIndex: 3 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card 
                    className="p-8 bg-[#0a0a0a] border-primary/50 overflow-hidden"
                    style={{
                      boxShadow: "0 0 60px rgba(229, 57, 53, 0.2), 0 25px 50px rgba(0,0,0,0.5)"
                    }}
                  >
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: "radial-gradient(circle at 50% 0%, rgba(229, 57, 53, 0.3) 0%, transparent 60%)"
                      }}
                    />
                    
                    <div className="relative">
                      <Badge className="bg-primary text-primary-foreground mb-6">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                      
                      <p className="text-xs uppercase tracking-wider text-primary mb-2">All Stages Available</p>
                      <h3 className="text-2xl font-bold mb-4">Sport • Pro • Max</h3>
                      <p className="text-muted-foreground text-sm mb-8">
                        Click to explore our complete range of lighting systems from daily drivers to competition grade.
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-600 border-2 border-[#0a0a0a]" />
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0a0a0a]" />
                          <div className="w-8 h-8 rounded-full bg-primary border-2 border-[#0a0a0a]" />
                        </div>
                        <span className="text-sm text-muted-foreground">3 Stages Available</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              /* Expanded View - All cards in a row */
              <motion.div
                key="expanded"
                className="grid md:grid-cols-3 gap-6 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {seriesData.map((series, index) => (
                  <motion.div
                    key={series.id}
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      rotateY: 0,
                      scale: activeCard === series.id ? 1.02 : 1
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    onClick={() => handleCardClick(series.id)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`relative h-full p-8 bg-[#0a0a0a] border ${series.borderColor} overflow-hidden transition-all duration-300 ${
                        activeCard === series.id ? "ring-2 ring-offset-2 ring-offset-[#050505]" : ""
                      } ${activeCard === series.id ? (series.id === "max" ? "ring-primary" : series.id === "pro" ? "ring-white" : "ring-zinc-400") : ""}`}
                      style={{
                        boxShadow: activeCard === series.id 
                          ? `0 0 40px ${series.glowColor}, 0 20px 40px rgba(0,0,0,0.4)`
                          : "0 10px 30px rgba(0,0,0,0.3)"
                      }}
                      data-testid={`series-card-${series.id}`}
                    >
                      {/* Glow overlay */}
                      <div 
                        className={`absolute inset-0 transition-opacity duration-300 ${activeCard === series.id ? "opacity-30" : "opacity-10"}`}
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${series.glowColor} 0%, transparent 60%)`
                        }}
                      />

                      {series.isPopular && (
                        <Badge
                          className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground glow-red"
                          data-testid="popular-badge"
                        >
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Most Popular
                        </Badge>
                      )}

                      <div className="relative">
                        {/* Series indicator */}
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              series.id === "sport"
                                ? "bg-zinc-400"
                                : series.id === "pro"
                                ? "bg-white"
                                : "bg-primary glow-red"
                            }`}
                            style={{
                              boxShadow: series.id === "max" ? "0 0 15px rgba(229, 57, 53, 0.5)" : 
                                         series.id === "pro" ? "0 0 15px rgba(255, 255, 255, 0.3)" : "none"
                            }}
                          />
                          <span className={`text-sm uppercase tracking-wider font-medium ${series.accentColor}`}>
                            {series.series}
                          </span>
                        </div>

                        <div className="mb-6">
                          <p className={`text-3xl font-bold mb-2 ${series.accentColor}`}>{series.tagline}</p>
                        </div>

                        <p className="text-muted-foreground text-sm mb-8 leading-relaxed min-h-[72px]">
                          {series.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {series.features.map((feature, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1.5 rounded-md text-xs bg-muted/20 border border-border/30 ${series.accentColor}`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Price and CTA */}
                        <div className="pt-6 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Starting from</p>
                          <p className={`text-3xl font-bold mb-6 ${series.accentColor}`}>
                            ₹{series.startingPrice.toLocaleString("en-IN")}
                          </p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProducts(series.id);
                            }}
                            className={`w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-11 px-6 ${
                              series.id === "max"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : series.id === "pro"
                                ? "bg-white text-black hover:bg-white/90"
                                : "bg-zinc-700 text-white hover:bg-zinc-600"
                            }`}
                            style={{
                              boxShadow: series.id === "max" ? "0 0 20px rgba(229, 57, 53, 0.3)" :
                                         series.id === "pro" ? "0 0 20px rgba(255, 255, 255, 0.2)" : "none"
                            }}
                            data-testid={`cta-${series.id}`}
                          >
                            View {series.series}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse button when expanded */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => {
                setIsExpanded(false);
                setActiveCard(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Collapse view
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
