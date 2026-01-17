import { motion } from "framer-motion";
import { AlertTriangle, Target } from "lucide-react";

export function ProblemSolution() {
  return (
    <section
      className="py-20 md:py-32 relative overflow-hidden"
      data-testid="problem-solution-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Why Your "Bright" Lights Are{" "}
            <span className="text-zinc-400">Dangerous</span>
          </h2>
        </motion.div>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="p-8 rounded-lg bg-[#111] border border-zinc-800/50 h-full"
              style={{
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-400">The Problem</h3>
              </div>

              <p className="text-zinc-400 leading-relaxed">
                Most aftermarket LEDs rely on raw wattage. They spray light
                everywhere—blinding oncoming traffic and reflecting off fog back
                into your eyes. That's not performance; that's{" "}
                <span className="text-white font-medium">glare</span>.
              </p>

              {/* Visual indicator */}
              <div className="mt-8 pt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-gradient-to-r from-red-500/40 via-red-400/60 to-red-500/40" />
                  </div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    Scattered Light
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div
              className="p-8 rounded-lg bg-[#111] border border-zinc-700/50 h-full"
              style={{
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 255, 255, 0.02)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400">The Solution</h3>
              </div>

              <p className="text-zinc-400 leading-relaxed">
                Expelight brings{" "}
                <span className="text-white font-medium">Diode Dynamics (USA)</span>{" "}
                to India. We use TIR (Total Internal Reflection) optics to
                capture 100% of the light and shoot it exactly where you need it:{" "}
                <span className="text-white font-medium">
                  On the road, not in their eyes
                </span>
                .
              </p>

              {/* Visual indicator */}
              <div className="mt-8 pt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                  </div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    Focused Beam
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-500 text-sm">
            TIR Optics: The same technology used in high-end camera lenses and medical equipment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
