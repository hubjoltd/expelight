import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { Card } from "@/components/ui/card";
import { Lightbulb, Zap, Shield, Eye, ThermometerSun, Timer } from "lucide-react";

export default function Science() {
  return (
    <div className="min-h-screen bg-background" data-testid="science-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What is <span className="text-gradient-amber">TIR Optics?</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Total Internal Reflection - The technology that makes our lights perform better than anything else on the market.
            </p>
          </motion.div>

          {/* Definition section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-card border-border/50">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">The Definition</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Traditional LEDs use a reflector (like a torch) or a projector lens (like a magnifying glass). Both lose light efficiency. 
                  </p>
                  <p className="text-foreground leading-relaxed">
                    <span className="text-primary font-semibold">TIR (Total Internal Reflection)</span> is a custom-molded optic that acts as both. It captures 100% of the LED's output and focuses it with laser precision.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                    <div className="absolute inset-4 rounded-full bg-primary/20" />
                    <div className="absolute inset-12 rounded-full bg-primary/30 flex items-center justify-center">
                      <Lightbulb className="w-16 h-16 text-primary" />
                    </div>
                    {/* Light rays */}
                    <div className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform -translate-y-1/2 origin-left rotate-0" />
                    <div className="absolute top-1/2 left-1/2 w-28 h-0.5 bg-gradient-to-r from-primary/40 to-transparent transform -translate-y-1/2 origin-left rotate-12" />
                    <div className="absolute top-1/2 left-1/2 w-28 h-0.5 bg-gradient-to-r from-primary/40 to-transparent transform -translate-y-1/2 origin-left -rotate-12" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              How We Compare
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full" data-testid="comparison-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">Feature</th>
                    <th className="text-center py-4 px-4 text-muted-foreground font-medium">Generic LED</th>
                    <th className="text-center py-4 px-4 text-muted-foreground font-medium">Projector HID</th>
                    <th className="text-center py-4 px-4 text-primary font-medium">Diode Dynamics (TIR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium">Efficiency</td>
                    <td className="py-4 px-4 text-center text-red-400">&lt; 50%</td>
                    <td className="py-4 px-4 text-center text-yellow-400">~70%</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">&gt; 95%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium">Glare</td>
                    <td className="py-4 px-4 text-center text-red-400">High</td>
                    <td className="py-4 px-4 text-center text-yellow-400">Low</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">Zero (SAE)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium">Durability</td>
                    <td className="py-4 px-4 text-center text-red-400">1-2 years</td>
                    <td className="py-4 px-4 text-center text-yellow-400">3-5 years</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">10+ years</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium">Heat Management</td>
                    <td className="py-4 px-4 text-center text-red-400">Poor</td>
                    <td className="py-4 px-4 text-center text-yellow-400">Average</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">Advanced</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Warranty</td>
                    <td className="py-4 px-4 text-center text-red-400">None</td>
                    <td className="py-4 px-4 text-center text-yellow-400">1 year</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">8 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Key advantages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Why TIR Technology Matters
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Maximum Efficiency",
                  description: "Captures 100% of LED output vs 50% in generic LEDs",
                },
                {
                  icon: Eye,
                  title: "Zero Glare",
                  description: "SAE-compliant beam patterns prevent blinding oncoming traffic",
                },
                {
                  icon: Shield,
                  title: "Built to Last",
                  description: "Solid-state design with no moving parts - rated for 50,000+ hours",
                },
                {
                  icon: ThermometerSun,
                  title: "Advanced Cooling",
                  description: "CNC-machined aluminum housing dissipates heat effectively",
                },
                {
                  icon: Lightbulb,
                  title: "Focused Output",
                  description: "Every lumen is directed exactly where you need it",
                },
                {
                  icon: Timer,
                  title: "Instant On",
                  description: "Full brightness instantly, no warm-up time required",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-6 bg-card border-border/50 h-full hover-elevate"
                    data-testid={`advantage-${index}`}
                  >
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
