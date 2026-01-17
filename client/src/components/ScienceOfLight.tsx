import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [sliderValue, setSliderValue] = useState([50]);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="science-of-light-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            What is TIR Optics?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            (Total Internal Reflection)
          </p>
        </motion.div>

        {/* The Definition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-[#0a0a0a] border border-zinc-800/50 rounded-lg p-8 md:p-12">
            <h3 className="text-xl font-bold text-white mb-6">The Definition</h3>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Traditional LEDs use a <span className="text-zinc-300">reflector</span> (like a torch) 
              or a <span className="text-zinc-300">projector lens</span> (like a magnifying glass). 
              Both lose light efficiency. <span className="text-white font-semibold">TIR (Total Internal Reflection)</span> is 
              a custom-molded optic that acts as both. It captures{" "}
              <span className="text-white font-semibold">100% of the LED's output</span> and focuses it with laser precision.
            </p>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            Technology Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b border-zinc-800 text-zinc-500 font-medium">Feature</th>
                  <th className="text-center p-4 border-b border-zinc-800 text-zinc-500 font-medium">Generic Aftermarket LED</th>
                  <th className="text-center p-4 border-b border-zinc-800 text-zinc-500 font-medium">Projector HID/LED</th>
                  <th className="text-center p-4 border-b border-zinc-800 text-white font-semibold">Diode Dynamics (TIR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#0a0a0a]">
                  <td className="p-4 border-b border-zinc-800/50 text-zinc-400">Efficiency</td>
                  <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-500">{"< 50%"}<br /><span className="text-xs">(Light spills everywhere)</span></td>
                  <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-400">~70%<br /><span className="text-xs">(Loss in lens)</span></td>
                  <td className="p-4 border-b border-zinc-800/50 text-center text-white font-semibold">{"> 95%"}<br /><span className="text-xs text-zinc-400">(Direct Focus)</span></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-800/50 text-zinc-400">Glare</td>
                  <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-500">High<br /><span className="text-xs">(Blinds others)</span></td>
                  <td className="p-4 border-b border-zinc-800/50 text-center text-zinc-400">Low<br /><span className="text-xs">(Cut-off line)</span></td>
                  <td className="p-4 border-b border-zinc-800/50 text-center text-white font-semibold">Zero<br /><span className="text-xs text-zinc-400">(SAE Standard)</span></td>
                </tr>
                <tr className="bg-[#0a0a0a]">
                  <td className="p-4 text-zinc-400">Durability</td>
                  <td className="p-4 text-center text-zinc-500">Plastic/Glue<br /><span className="text-xs">(Fades in 1 yr)</span></td>
                  <td className="p-4 text-center text-zinc-400">Complex parts<br /><span className="text-xs">(Moving pieces)</span></td>
                  <td className="p-4 text-center text-white font-semibold">Solid State<br /><span className="text-xs text-zinc-400">(Lasts 10+ yrs)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Comparison Slider Section */}
        <div className="border-t border-zinc-800/50 pt-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              See the Difference
            </h3>
            <p className="text-zinc-500">
              Drag the slider to compare stock lighting vs Diode Dynamics TIR optics.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Comparison Slider */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800/30"
                data-testid="comparison-slider"
              >
                {/* Stock lights side - Dark with faint SUV silhouette */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)`,
                  }}
                >
                  {/* SUV background image - dim/dark */}
                  <img
                    src="https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80"
                    alt="SUV with stock lights"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
                  />
                  <div className="absolute inset-0 bg-[#050505]/80" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 rounded-full bg-yellow-900/20 flex items-center justify-center mx-auto mb-4 border border-yellow-900/30">
                        <div className="w-10 h-10 rounded-full bg-yellow-800/40 blur-sm" />
                      </div>
                      <span className="text-base uppercase tracking-widest text-zinc-600 font-medium">Stock</span>
                      <p className="text-xs text-zinc-700 mt-2">Dim & Scattered</p>
                    </div>
                  </div>
                  
                  {/* Weak scattered light */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-gradient-to-t from-yellow-900/10 via-yellow-900/5 to-transparent rounded-full blur-3xl" />
                </div>

                {/* Diode Dynamics side - Bright with visible SUV */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `inset(0 0 0 ${sliderValue[0]}%)`,
                  }}
                >
                  {/* SUV background image - bright/visible */}
                  <img
                    src="https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80"
                    alt="SUV with Diode Dynamics lights"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-[#0a0a0a]/60" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                        <div className="w-10 h-10 rounded-full bg-white/60" />
                      </div>
                      <span className="text-base uppercase tracking-widest text-white font-medium">Diode Dynamics</span>
                      <p className="text-xs text-zinc-400 mt-2">Focused & Bright</p>
                    </div>
                  </div>
                  
                  {/* Strong focused beam */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-48 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-t-full" />
                </div>

                {/* Slider divider line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  style={{ left: `${sliderValue[0]}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-ew-resize shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <div className="flex gap-1">
                      <div className="w-0.5 h-6 bg-zinc-800 rounded-full" />
                      <div className="w-0.5 h-6 bg-zinc-800 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider control */}
              <div className="mt-8 px-4">
                <p className="text-sm text-zinc-500 text-center mb-4 uppercase tracking-wider">
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

            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] border border-zinc-800/30 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">7x</p>
                  <p className="text-sm text-zinc-500">Brighter than stock halogens</p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800/30 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">100%</p>
                  <p className="text-sm text-zinc-500">Plug & Play installation</p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800/30 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-zinc-400 mb-2">SAE</p>
                  <p className="text-sm text-zinc-500">Street legal beam patterns</p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800/30 rounded-lg p-6">
                  <p className="text-3xl md:text-4xl font-bold text-zinc-400 mb-2">8 Yr</p>
                  <p className="text-sm text-zinc-500">Industry-leading warranty</p>
                </div>
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed">
                Every Diode Dynamics light undergoes rigorous testing for thermal management, 
                vibration resistance, and optical precision. This is why professional rally 
                teams and serious off-roaders trust only Diode Dynamics.
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section - Voice Search Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-zinc-800/50 pt-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border border-zinc-800/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-900/50 transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                  )}
                </button>
                
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
