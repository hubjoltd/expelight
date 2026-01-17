import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Lightbulb, Target, Zap } from "lucide-react";

export function ScienceOfLight() {
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="science-of-light-section"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a0a] to-background" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            data-testid="science-headline"
          >
            Why Your <span className="text-gradient-red">"Bright" Lights</span> Are Dangerous
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Most aftermarket LEDs rely on raw wattage. They spray light everywhere—blinding oncoming traffic and reflecting off fog back into your eyes. That's not performance; that's glare.
          </p>
        </motion.div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
          {/* Left - Comparison Slider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/30"
              data-testid="comparison-slider"
            >
              {/* Stock lights (dark road) */}
              <div
                className="absolute inset-0 bg-[#080808]"
                style={{
                  clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-4 border border-muted/20">
                      <div className="w-10 h-10 rounded-full bg-yellow-900/30" />
                    </div>
                    <span className="text-sm uppercase tracking-wider text-muted-foreground/60">Stock Lights</span>
                    <p className="text-xs text-muted-foreground/40 mt-1">Scattered & Dim</p>
                  </div>
                </div>
                {/* Dim scattered light effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-t from-yellow-900/15 via-yellow-900/5 to-transparent rounded-full blur-2xl" />
              </div>

              {/* Diode lights (illuminated road) */}
              <div
                className="absolute inset-0 bg-[#0f0f0f]"
                style={{
                  clipPath: `inset(0 0 0 ${sliderValue[0]}%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4 border border-primary/30 glow-red">
                      <div className="w-10 h-10 rounded-full bg-primary/50" />
                    </div>
                    <span className="text-sm uppercase tracking-wider text-primary">Diode Dynamics</span>
                    <p className="text-xs text-primary/60 mt-1">Focused & Bright</p>
                  </div>
                </div>
                {/* Focused beam effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-t-full" />
              </div>

              {/* Slider line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_15px_rgba(229,57,53,0.5)]"
                style={{ left: `${sliderValue[0]}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-ew-resize glow-red">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
                    <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Slider control */}
            <div className="mt-8 px-4">
              <p className="text-sm text-muted-foreground text-center mb-4 uppercase tracking-wider">Slide to Upgrade</p>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
                data-testid="slider-control"
              />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Not Just Brighter. <span className="text-primary">Smarter.</span>
            </h3>

            <p className="text-muted-foreground mb-10 leading-relaxed">
              Expelight brings Diode Dynamics (USA) to India. We use TIR (Total Internal Reflection) optics to capture 100% of the light and shoot it exactly where you need it: On the road, not in their eyes.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5" data-testid="tir-feature-1">
                <div className="flex-shrink-0 w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-lg">TIR Optics Technology</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Custom-molded optics capture 100% of LED output with laser precision
                  </p>
                </div>
              </div>

              <div className="flex gap-5" data-testid="tir-feature-2">
                <div className="flex-shrink-0 w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-lg">Razor-Sharp Cut-Off</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    SAE-compliant beam patterns prevent blinding oncoming traffic
                  </p>
                </div>
              </div>

              <div className="flex gap-5" data-testid="tir-feature-3">
                <div className="flex-shrink-0 w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-lg">95%+ Efficiency</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Less power consumption, more usable light on the road
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
