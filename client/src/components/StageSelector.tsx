import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import { useLocation } from "wouter";

interface SeriesCard {
  id: string;
  series: string;
  tagline: string;
  description: string;
  startingPrice: number;
  accentColor: string;
  borderColor: string;
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
    borderColor: "border-zinc-700",
    features: ["2x Stock Brightness", "SAE Compliant", "Plug & Play"],
  },
  {
    id: "pro",
    series: "Pro Series",
    tagline: "The Weekend Warrior",
    description: "4x Brighter. Maximum intensity for dark highways and sudden trails. The #1 choice for Mahindra Thar owners.",
    startingPrice: 30000,
    accentColor: "text-white",
    borderColor: "border-zinc-500",
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
    borderColor: "border-primary/50",
    features: ["Maximum Output", "Rally Proven", "10+ Year Life"],
  },
];

export function StageSelector() {
  const [, setLocation] = useLocation();

  return (
    <section
      id="stage-selector"
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="stage-selector-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your <span className="text-gradient-red">Stage</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From daily commutes to competition-grade performance, find the perfect lighting system for your driving style.
          </p>
        </motion.div>

        {/* Cards Grid - Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0">
          {seriesData.map((series, index) => (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[300px] md:min-w-0 snap-center"
            >
              <Card
                className={`relative h-full p-8 bg-[#0a0a0a] border ${series.borderColor} card-premium ${
                  series.isPopular ? "ring-1 ring-primary/30" : ""
                }`}
                data-testid={`series-card-${series.id}`}
              >
                {series.isPopular && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground glow-red"
                    data-testid="popular-badge"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                )}

                {/* Series indicator */}
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      series.id === "sport"
                        ? "bg-zinc-400"
                        : series.id === "pro"
                        ? "bg-white"
                        : "bg-primary glow-red"
                    }`}
                  />
                  <span className={`text-sm uppercase tracking-wider ${series.accentColor}`}>
                    {series.series}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-bold text-foreground mb-2">{series.tagline}</p>
                </div>

                <p className="text-muted-foreground text-sm mb-8 leading-relaxed min-h-[72px]">
                  {series.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {series.features.map((feature, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-md text-xs bg-muted/30 ${series.accentColor}`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="mt-auto pt-6 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Starting from</p>
                  <p className="text-3xl font-bold mb-6">
                    ₹{series.startingPrice.toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => setLocation(`/products?series=${series.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${
                      series.isPopular
                        ? "bg-primary text-primary-foreground glow-red"
                        : series.id === "max"
                        ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                    data-testid={`cta-${series.id}`}
                  >
                    View {series.series}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
