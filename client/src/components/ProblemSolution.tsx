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
      
      {/* Animated light beams background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Scattered light effect for "Problem" side */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96"
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-radial from-red-500/20 via-red-500/5 to-transparent rounded-full blur-3xl" />
        </motion.div>
        
        {/* Multiple scattered rays */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`scatter-${i}`}
            className="absolute left-20 top-1/2"
            style={{
              transform: `rotate(${-30 + i * 15}deg)`,
              transformOrigin: "left center",
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            <div className="w-64 h-1 bg-gradient-to-r from-red-400/30 to-transparent rounded-full blur-sm" />
          </motion.div>
        ))}
        
        {/* Focused beam for "Solution" side */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-32"
          animate={{
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-l from-emerald-400/20 via-emerald-400/10 to-transparent rounded-l-full blur-2xl" />
        </motion.div>
        
        {/* Single focused ray */}
        <motion.div
          className="absolute right-20 top-1/2 -translate-y-1/2"
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scaleX: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-80 h-2 bg-gradient-to-l from-emerald-400/40 to-transparent rounded-full blur-sm" />
        </motion.div>
      </div>

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
            initial={{ opacity: 0, x: -50, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div
              className="p-8 rounded-xl bg-[#111] border border-zinc-800/50 h-full relative overflow-hidden"
              style={{
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Animated scattered glow inside card */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40"
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full bg-red-500/30 rounded-full blur-3xl" />
              </motion.div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20"
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(239, 68, 68, 0)",
                        "0 0 20px rgba(239, 68, 68, 0.3)",
                        "0 0 0 rgba(239, 68, 68, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-red-400">The Problem</h3>
                </div>

                <p className="text-zinc-400 leading-relaxed">
                  Most aftermarket LEDs rely on raw wattage. They spray light
                  everywhere—blinding oncoming traffic and reflecting off fog back
                  into your eyes. That's not performance; that's{" "}
                  <span className="text-white font-medium">glare</span>.
                </p>

                {/* Animated scattered light indicator */}
                <div className="mt-8 pt-6 border-t border-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative h-2 rounded-full overflow-hidden bg-zinc-900">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-red-400/60 to-red-500/30"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      Scattered Light
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
            className="relative"
          >
            <div
              className="p-8 rounded-xl bg-[#111] border border-zinc-700/50 h-full relative overflow-hidden"
              style={{
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 255, 255, 0.02)",
              }}
            >
              {/* Animated focused glow inside card */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32"
                animate={{
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full bg-emerald-400/30 rounded-full blur-3xl" />
              </motion.div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(52, 211, 153, 0)",
                        "0 0 20px rgba(52, 211, 153, 0.3)",
                        "0 0 0 rgba(52, 211, 153, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Target className="w-6 h-6 text-emerald-400" />
                  </motion.div>
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

                {/* Animated focused beam indicator */}
                <div className="mt-8 pt-6 border-t border-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative h-2 rounded-full overflow-hidden bg-zinc-900">
                      <motion.div
                        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      Focused Beam
                    </span>
                  </div>
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
