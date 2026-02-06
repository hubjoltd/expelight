import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb, Zap, Target, Shield, Plus, Check } from "lucide-react";

import tharLightsOn from "@assets/thar-lights-on.png";
import tharLightsOff from "@assets/thar-lights-off.png";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Which is better: White or Yellow fog lights?",
    answer: "It depends on your driving conditions. 6000K Cool White looks modern and matches factory LED headlights, making it great for general visibility. 3000K Selective Yellow is superior for bad weather (rain, fog, snow) because yellow light scatters less than white light, reducing glare back into the driver's eyes."
  },
  {
    question: "Will installing these lights void my car's warranty?",
    answer: "No. Expelight kits are designed as \"Plug-and-Play.\" We use factory-style connectors that plug directly into your car's existing wiring harness. There is no wire cutting or splicing required, meaning your vehicle's electrical warranty remains intact."
  },
  {
    question: "Are these brighter than 100W Chinese LEDs?",
    answer: "Wattage is a measure of power consumption, not brightness. A generic 100W light often wastes 60W as heat. Diode Dynamics lights may consume less power (e.g., 40W) but produce more usable light (Candela) on the road because of our efficient TIR optics. Brighter isn't always better; focused is better."
  }
];

export function ScienceOfLight() {
  const [sliderValue, setSliderValue] = useState(0);
  const [isAutoAnimating, setIsAutoAnimating] = useState(true);
  const [lightsOn, setLightsOn] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(comparisonRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView || !isAutoAnimating) return;

    const interval = setInterval(() => {
      setSliderValue((prev) => {
        if (prev >= 100) {
          setTimeout(() => setSliderValue(0), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isInView, isAutoAnimating]);

  const handleSliderInteraction = () => {
    setIsAutoAnimating(false);
  };

  const handleLightsToggle = () => {
    setLightsOn((prev) => !prev);
  };

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="science-of-light-section"
    >
      {/* Animated background with light rays */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Light beam rays */}
          <motion.div
            className="absolute top-0 left-1/4 w-1 h-96 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scaleY: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transform: "rotate(15deg)" }}
          />
          <motion.div
            className="absolute top-0 right-1/3 w-0.5 h-80 bg-gradient-to-b from-white/20 via-white/5 to-transparent"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleY: [1, 1.3, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            style={{ transform: "rotate(-10deg)" }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section Header with lighting effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white relative inline-block"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.1)",
                "0 0 40px rgba(255,255,255,0.2)",
                "0 0 20px rgba(255,255,255,0.1)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            What is TIR Optics?
            <motion.span
              className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            (Total Internal Reflection)
          </p>
        </motion.div>

        {/* TIR Optics Visual Card with lighting imagery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-24"
        >
          <div className="bg-[#0a0a0a] border border-zinc-800/50 rounded-2xl overflow-hidden relative">
            {/* Animated light beams in background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(229,57,53,0.15) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Mahindra Thar with TIR optics visualization */}
              <div className="relative overflow-hidden">
                {/* LED illuminated road */}
                <img 
                  src={tharLightsOn} 
                  alt="Mahindra Thar with TIR optic LED headlights on" 
                  className="w-full h-full object-cover min-h-[300px]"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                
                {/* TIR optic overlay visualization */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-transparent border border-white/30 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(255, 255, 255, 0.3)",
                          "0 0 40px rgba(255, 255, 255, 0.5)",
                          "0 0 20px rgba(255, 255, 255, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="w-8 h-8 rounded-full bg-white"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                    <div>
                      <p className="text-white font-semibold text-sm">TIR Optics Active</p>
                      <p className="text-zinc-400 text-xs">Focused beam, zero scatter</p>
                    </div>
                  </div>
                </div>

                {/* Animated light beams from headlights */}
                <motion.div
                  className="absolute top-1/2 left-1/4 w-2 h-48 bg-gradient-to-t from-white/40 via-white/20 to-transparent origin-bottom blur-sm"
                  animate={{ opacity: [0.4, 0.8, 0.4], scaleY: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transform: "rotate(15deg)" }}
                />
                <motion.div
                  className="absolute top-1/2 right-1/3 w-2 h-40 bg-gradient-to-t from-white/30 via-white/15 to-transparent origin-bottom blur-sm"
                  animate={{ opacity: [0.3, 0.6, 0.3], scaleY: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  style={{ transform: "rotate(-10deg)" }}
                />
              </div>

              {/* Right: Text content */}
              <div className="p-8 md:p-12 flex flex-col justify-center relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  The Definition
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg mb-8">
                  Traditional LEDs use a <span className="text-zinc-200 font-medium">reflector</span> (like a torch) 
                  or a <span className="text-zinc-200 font-medium">projector lens</span> (like a magnifying glass). 
                  Both lose light efficiency.
                </p>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  <span className="text-white font-semibold">TIR (Total Internal Reflection)</span> is 
                  a custom-molded optic that acts as both. It captures{" "}
                  <span className="text-primary font-bold">100% of the LED's output</span> and focuses it with laser precision.
                </p>

                {/* Key stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: Zap, label: "95%+ Efficiency", value: "vs ~50% generic" },
                    { icon: Target, label: "Zero Glare", value: "SAE Compliant" },
                    { icon: Shield, label: "10+ Years", value: "Solid State" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <p className="text-xs text-zinc-400 font-medium">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table - Opens from both sides */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-white text-center mb-10"
          >
            Technology Comparison
          </motion.h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px] relative">
              {/* Left side opening animation */}
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#0a0a0a] rounded-l-xl z-0"
              />
              {/* Right side opening animation */}
              <motion.div
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#0a0a0a] rounded-r-xl z-0"
              />
              
              <motion.table
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full border-collapse relative z-10"
              >
                <thead>
                  <motion.tr
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <th className="text-left p-4 border-b border-zinc-800 text-zinc-500 font-medium">Feature</th>
                    <th className="text-center p-4 border-b border-zinc-800 text-zinc-500 font-medium">Generic Aftermarket LED</th>
                    <th className="text-center p-4 border-b border-zinc-800 text-zinc-500 font-medium">Projector HID/LED</th>
                    <th className="text-center p-4 border-b border-zinc-800 text-white font-semibold">Diode Dynamics (TIR)</th>
                  </motion.tr>
                </thead>
                <tbody>
                  <motion.tr
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-[#0a0a0a]/50"
                  >
                    <td className="p-4 border-b border-zinc-800/50 text-zinc-400">Efficiency</td>
                    <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-500">{"< 50%"}<br /><span className="text-xs">(Light spills everywhere)</span></td>
                    <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-400">~70%<br /><span className="text-xs">(Loss in lens)</span></td>
                    <td className="p-4 border-b border-zinc-800/50 text-center text-white font-semibold">{"> 95%"}<br /><span className="text-xs text-zinc-400">(Direct Focus)</span></td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <td className="p-4 border-b border-zinc-800/50 text-zinc-400">Glare</td>
                    <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-500">High<br /><span className="text-xs">(Blinds others)</span></td>
                    <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-400">Low<br /><span className="text-xs">(Cut-off line)</span></td>
                    <td className="p-4 border-b border-zinc-800/50 text-center text-white font-semibold">Zero<br /><span className="text-xs text-zinc-400">(SAE Standard)</span></td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-[#0a0a0a]/50"
                  >
                    <td className="p-4 text-zinc-400">Durability</td>
                    <td className="p-4 text-center text-zinc-500">Plastic/Glue<br /><span className="text-xs">(Fades in 1 yr)</span></td>
                    <td className="p-4 text-center text-zinc-400">Complex parts<br /><span className="text-xs">(Moving pieces)</span></td>
                    <td className="p-4 text-center text-white font-semibold">Solid State<br /><span className="text-xs text-zinc-400">(Lasts 10+ yrs)</span></td>
                  </motion.tr>
                </tbody>
              </motion.table>
            </div>
          </div>
        </div>

        {/* Auto-animated Comparison Slider Section */}
        <div className="border-t border-zinc-800/50 pt-20 mb-24" ref={comparisonRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0)",
                  "0 0 30px rgba(255,255,255,0.3)",
                  "0 0 10px rgba(255,255,255,0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              See the Difference
            </motion.h3>
            <p className="text-zinc-500">Tap to turn on the lights or drag the slider to compare</p>
          </motion.div>

          {/* Tap to activate lights - Thar interactive */}
          <div className="max-w-4xl mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#0a0a0a] border border-zinc-800/50 cursor-pointer select-none"
              onClick={handleLightsToggle}
              data-testid="lights-toggle-area"
            >
              {/* Lights OFF - Thar in darkness */}
              <img 
                src={tharLightsOff} 
                alt="Mahindra Thar with lights off in darkness" 
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Lights ON - Thar with bright LEDs - fades in */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: lightsOn ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <img 
                  src={tharLightsOn} 
                  alt="Mahindra Thar with Diode Dynamics LED lights on" 
                  className="w-full h-full object-cover"
                />
                {/* Beam glow effects when lights are on */}
                <motion.div 
                  className="absolute bottom-0 left-1/4 w-40 h-96 bg-gradient-to-t from-white/30 via-white/10 to-transparent blur-xl"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-0 right-1/4 w-40 h-96 bg-gradient-to-t from-white/30 via-white/10 to-transparent blur-xl"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>

              {/* Label overlays */}
              <AnimatePresence mode="wait">
                {!lightsOn ? (
                  <motion.div
                    key="lights-off-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-10"
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mb-4"
                      animate={{
                        boxShadow: [
                          "0 0 15px rgba(255,255,255,0.1)",
                          "0 0 30px rgba(255,255,255,0.3)",
                          "0 0 15px rgba(255,255,255,0.1)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-8 h-8 text-white/60" />
                    </motion.div>
                    <p className="text-white/80 text-sm font-medium drop-shadow-lg">Tap to start vehicle lights</p>
                    <p className="text-zinc-500 text-xs mt-1">Experience the difference</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="lights-on-label"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute bottom-6 left-6 z-10"
                  >
                    <p className="text-white text-sm font-semibold drop-shadow-lg">Diode Dynamics TIR</p>
                    <p className="text-zinc-300 text-xs mt-1 drop-shadow-lg">Bright & Focused</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tap again hint when lights are on */}
              {lightsOn && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="absolute bottom-6 right-6 z-10"
                >
                  <p className="text-zinc-500 text-xs">Tap to turn off</p>
                </motion.div>
              )}
            </div>

            {/* Comparison slider below */}
            <div className="mt-8">
              <p className="text-zinc-500 text-sm text-center mb-4">Drag to compare or watch the auto-animation</p>
              <div
                className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#0a0a0a] border border-zinc-800/50 cursor-ew-resize"
                onMouseDown={handleSliderInteraction}
                onTouchStart={handleSliderInteraction}
              >
                {/* Stock side - Thar lights off */}
                <div className="absolute inset-0">
                  <img 
                    src={tharLightsOff} 
                    alt="Mahindra Thar with stock lights off" 
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-8 right-8 text-right z-10">
                    <p className="text-zinc-500 text-sm font-medium">Lights Off</p>
                    <p className="text-zinc-600 text-xs mt-1">Stock Setup</p>
                  </div>
                </div>

                {/* Diode Dynamics side - Thar lights on */}
                <motion.div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderValue}%` }}
                >
                  <div 
                    className="h-full relative"
                    style={{ width: `${100 * 100 / Math.max(sliderValue, 1)}%` }}
                  >
                    <img 
                      src={tharLightsOn} 
                      alt="Mahindra Thar with Diode Dynamics LED lights on" 
                      className="w-full h-full object-cover"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-1/4 w-40 h-96 bg-gradient-to-t from-white/25 via-white/10 to-transparent blur-xl"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute bottom-0 right-1/4 w-40 h-96 bg-gradient-to-t from-white/25 via-white/10 to-transparent blur-xl"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                    <div className="absolute bottom-8 left-8 z-10">
                      <p className="text-white text-sm font-medium drop-shadow-lg">Diode Dynamics TIR</p>
                      <p className="text-zinc-300 text-xs mt-1 drop-shadow-lg">Bright & Focused</p>
                    </div>
                  </div>
                </motion.div>

                {/* Slider handle */}
                <motion.div
                  className="absolute inset-y-0 w-1 bg-white/80 cursor-ew-resize z-20"
                  style={{ left: `${sliderValue}%` }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(255,255,255,0.8)",
                      "0 0 10px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-4 bg-zinc-400 rounded" />
                      <div className="w-0.5 h-4 bg-zinc-400 rounded" />
                    </div>
                  </div>
                </motion.div>

                {/* Interactive slider overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => {
                    setSliderValue(Number(e.target.value));
                    setIsAutoAnimating(false);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
            </div>

            {/* Explore button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsAutoAnimating(!isAutoAnimating)}
                className={`text-sm px-6 py-2.5 rounded-full transition-colors font-medium ${
                  isAutoAnimating 
                    ? "bg-primary text-white border border-primary shadow-lg shadow-primary/30" 
                    : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                }`}
              >
                Explore with Expelight
              </button>
            </div>
          </div>
        </div>

        {/* Modern FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0)",
                  "0 0 20px rgba(255,255,255,0.2)",
                  "0 0 10px rgba(255,255,255,0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Frequently Asked Questions
            </motion.h3>
            <p className="text-zinc-500">Everything you need to know about our lighting technology</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                  openFAQ === index 
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20" 
                    : "bg-[#0a0a0a] border border-zinc-800/50 hover:border-zinc-700/50"
                }`}
              >
                {/* Glow effect for open item */}
                {openFAQ === index && (
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-xl opacity-50"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="relative z-10 w-full p-6 text-left flex items-center gap-4"
                  data-testid={`faq-toggle-${index}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    openFAQ === index 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                  }`}>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <span className={`text-base font-medium transition-colors ${
                    openFAQ === index ? "text-white" : "text-zinc-300"
                  }`}>
                    {faq.question}
                  </span>
                </button>

                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-20">
                        <p className="text-zinc-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
