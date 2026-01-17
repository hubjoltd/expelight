import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Lightbulb, Target, Zap, ChevronRight } from "lucide-react";

export function ScienceOfLight() {
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="science-of-light-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* First Block - Hero style intro like reference */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          {/* Left - Speedometer/Lux Graph */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Speedometer background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-border/20" />
              
              {/* Outer ring */}
              <div className="absolute inset-4 rounded-full border-2 border-border/30" />
              
              {/* Lux markings */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                {/* Arc background */}
                <path
                  d="M 30 150 A 70 70 0 0 1 170 150"
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Stock halogen level (low) */}
                <path
                  d="M 30 150 A 70 70 0 0 1 60 85"
                  fill="none"
                  stroke="#666"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Diode Dynamics level (high) */}
                <path
                  d="M 60 85 A 70 70 0 0 1 170 150"
                  fill="none"
                  stroke="url(#redGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E53935" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#E53935" />
                  </linearGradient>
                </defs>
                
                {/* Tick marks and labels */}
                <text x="25" y="165" fill="#666" fontSize="8" textAnchor="middle">0</text>
                <text x="50" y="100" fill="#666" fontSize="8" textAnchor="middle">200</text>
                <text x="100" y="65" fill="#666" fontSize="8" textAnchor="middle">400</text>
                <text x="150" y="100" fill="#E53935" fontSize="8" textAnchor="middle">600</text>
                <text x="175" y="165" fill="#E53935" fontSize="8" textAnchor="middle">800+</text>
                
                {/* Center text */}
                <text x="100" y="115" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">850</text>
                <text x="100" y="130" fill="#E53935" fontSize="10" textAnchor="middle">LUX</text>
                <text x="100" y="145" fill="#666" fontSize="7" textAnchor="middle">@ 25 meters</text>
              </svg>
              
              {/* Needle */}
              <div 
                className="absolute top-1/2 left-1/2 w-1 h-24 origin-bottom bg-gradient-to-t from-primary to-white rounded-full"
                style={{ 
                  transform: "translate(-50%, -100%) rotate(55deg)",
                  boxShadow: "0 0 20px rgba(229, 57, 53, 0.5)"
                }}
              />
              
              {/* Center cap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-primary/50" />
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <span className="text-xs text-muted-foreground">Stock Halogen (~120 Lux)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary glow-red" />
                <span className="text-xs text-primary">Diode Dynamics (~850 Lux)</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-wider text-primary mb-4">WHY DO YOU NEED IT?</p>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              What is TIR Optics and<br />
              <span className="text-gradient-red">Why Do You Want It?</span>
            </h2>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              TIR (Total Internal Reflection) optics capture 100% of the light from an LED and focus it precisely where you need it. Unlike cheap LEDs that spray light everywhere, TIR creates a controlled, SAE-compliant beam pattern.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">100% Light Capture</h4>
                  <p className="text-sm text-muted-foreground">
                    Custom-molded optics capture every photon and direct it forward
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Razor-Sharp Cut-Off</h4>
                  <p className="text-sm text-muted-foreground">
                    SAE-compliant patterns prevent blinding oncoming drivers
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">7x More Efficient</h4>
                  <p className="text-sm text-muted-foreground">
                    Same power draw, dramatically more usable light on the road
                  </p>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 mt-8 text-primary hover:gap-3 transition-all group">
              <span className="text-sm font-medium">Explore the Technology</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Second Block - Comparison Slider */}
        <div className="border-t border-border/20 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-wider text-primary mb-4">ADVANTAGES</p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              What Can I Expect<br />
              <span className="text-gradient-red">from the Upgrade?</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the dramatic difference between stock lighting and Diode Dynamics TIR optics.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Comparison Slider */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
                      <div className="w-24 h-24 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-4 border border-muted/20">
                        <div className="w-12 h-12 rounded-full bg-yellow-900/30" />
                      </div>
                      <span className="text-sm uppercase tracking-wider text-muted-foreground/60">Stock Lights</span>
                      <p className="text-xs text-muted-foreground/40 mt-1">Scattered & Dim</p>
                    </div>
                  </div>
                  {/* Dim scattered light effect */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-t from-yellow-900/15 via-yellow-900/5 to-transparent rounded-full blur-2xl" />
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
                      <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4 border border-primary/30 glow-red">
                        <div className="w-12 h-12 rounded-full bg-primary/50" />
                      </div>
                      <span className="text-sm uppercase tracking-wider text-primary">Diode Dynamics</span>
                      <p className="text-xs text-primary/60 mt-1">Focused & Bright</p>
                    </div>
                  </div>
                  {/* Focused beam effect */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-40 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-t-full" />
                </div>

                {/* Slider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_15px_rgba(229,57,53,0.5)]"
                  style={{ left: `${sliderValue[0]}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center cursor-ew-resize glow-red">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-5 bg-primary-foreground rounded-full" />
                      <div className="w-0.5 h-5 bg-primary-foreground rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider control */}
              <div className="mt-8 px-4">
                <p className="text-sm text-muted-foreground text-center mb-4 uppercase tracking-wider">
                  Slide to Upgrade
                </p>
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

            {/* Right - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-border/20 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-2">7x</p>
                  <p className="text-sm text-muted-foreground">Brighter than stock halogens</p>
                </div>
                <div className="bg-[#0a0a0a] border border-border/20 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</p>
                  <p className="text-sm text-muted-foreground">Plug & Play installation</p>
                </div>
                <div className="bg-[#0a0a0a] border border-border/20 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">SAE</p>
                  <p className="text-sm text-muted-foreground">Street legal beam patterns</p>
                </div>
                <div className="bg-[#0a0a0a] border border-border/20 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">8 Yr</p>
                  <p className="text-sm text-muted-foreground">Industry-leading warranty</p>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                Every Diode Dynamics light undergoes rigorous testing for thermal management, 
                vibration resistance, and optical precision. This is why professional rally 
                teams and serious off-roaders trust only Diode Dynamics.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
