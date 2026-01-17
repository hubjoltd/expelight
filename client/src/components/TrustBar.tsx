import { motion } from "framer-motion";
import { Plug, Flag, Shield, MessageCircle } from "lucide-react";

const trustPillars = [
  {
    icon: Plug,
    title: "NO CUTTING",
    description: "100% Plug & Play. No warranty void.",
  },
  {
    icon: Flag,
    title: "USA ENGINEERING",
    description: "Designed in St. Louis. Not generic Chinese LEDs.",
  },
  {
    icon: Shield,
    title: "STREET LEGAL",
    description: "SAE Compliant Patterns. Cop-magnet free.",
  },
  {
    icon: MessageCircle,
    title: "INSTANT SUPPORT",
    description: "WhatsApp us directly. Real humans.",
  },
];

export function TrustBar() {
  return (
    <section
      className="py-16 border-y border-border/20 bg-[#080808]"
      data-testid="trust-bar"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {trustPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
              data-testid={`trust-pillar-${index}`}
            >
              <div className="w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <pillar.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                {pillar.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
