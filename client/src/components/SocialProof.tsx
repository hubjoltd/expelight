import { motion } from "framer-motion";
import { Instagram, Star, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomerPhoto {
  id: string;
  imageUrl?: string;
  username: string;
  vehicle: string;
  rating: number;
}

const customerPhotos: CustomerPhoto[] = [
  { id: "1", username: "@thar_adventures", vehicle: "Mahindra Thar", rating: 5 },
  { id: "2", username: "@scorpio_trails", vehicle: "Scorpio-N", rating: 5 },
  { id: "3", username: "@jimny_india", vehicle: "Maruti Jimny", rating: 5 },
  { id: "4", username: "@hilux_offroad", vehicle: "Toyota Hilux", rating: 5 },
  { id: "5", username: "@gurkha_explorer", vehicle: "Force Gurkha", rating: 5 },
  { id: "6", username: "@xuv_rider", vehicle: "XUV700", rating: 5 },
];

// Brand logos with proper styling
const brandLogos = [
  { 
    name: "Mahindra", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mahindra-logo.svg/200px-Mahindra-logo.svg.png",
    fallback: "MAHINDRA"
  },
  { 
    name: "Maruti Suzuki", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Maruti_Suzuki_Logo.svg/200px-Maruti_Suzuki_Logo.svg.png",
    fallback: "MARUTI SUZUKI"
  },
  { 
    name: "Toyota", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/200px-Toyota.svg.png",
    fallback: "TOYOTA"
  },
  { 
    name: "Force Motors", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Force_Motors_logo.svg/200px-Force_Motors_logo.svg.png",
    fallback: "FORCE"
  },
  { 
    name: "Tata Motors", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png",
    fallback: "TATA"
  },
  { 
    name: "Jeep", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jeep_logo.svg/200px-Jeep_logo.svg.png",
    fallback: "JEEP"
  },
];

export function SocialProof() {
  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden bg-[#080808]"
      data-testid="social-proof-section"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Built by <span className="text-zinc-400">Enthusiasts</span>.
            <br className="hidden md:block" />
            Tested in India.
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Join thousands of off-road enthusiasts who upgraded their night driving experience.
          </p>
        </motion.div>

        {/* Brand logos with animations - Premium horizontal bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 text-center mb-10">
            Trusted by owners of
          </p>
          
          {/* Logo strip with premium styling */}
          <div className="relative">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
            
            <div className="flex justify-center items-center gap-8 md:gap-16 py-6 overflow-hidden">
              {brandLogos.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className="group cursor-pointer flex-shrink-0"
                >
                  <motion.div
                    className="h-12 md:h-16 flex items-center justify-center px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    animate={{
                      filter: [
                        "drop-shadow(0 0 0px rgba(255,255,255,0))",
                        "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
                        "drop-shadow(0 0 0px rgba(255,255,255,0))",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.7,
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-full w-auto object-contain max-w-[120px] md:max-w-[150px]"
                      onError={(e) => {
                        // Fallback to text if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const textEl = document.createElement('span');
                          textEl.className = 'text-lg md:text-xl font-bold text-zinc-500 tracking-wider';
                          textEl.textContent = brand.fallback;
                          parent.appendChild(textEl);
                        }
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Masonry-style Instagram grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {customerPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative group cursor-pointer ${
                index === 0 || index === 5 ? "md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative bg-[#0a0a0a] border border-zinc-800/30 rounded-xl overflow-hidden ${
                  index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                {/* Placeholder for customer photo with animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-[#0a0a0a] to-zinc-800/10 flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(255,255,255,0)",
                        "0 0 30px rgba(255,255,255,0.1)",
                        "0 0 0 rgba(255,255,255,0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                  </motion.div>
                </div>

                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4"
                  initial={false}
                >
                  <div className="flex gap-1 mb-2">
                    {[...Array(photo.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-white fill-white" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{photo.vehicle}</p>
                  <p className="text-xs text-zinc-400">{photo.username}</p>
                </motion.div>

                {/* Verified badge */}
                <Badge
                  className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com/expelight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            data-testid="instagram-link"
          >
            <Instagram className="w-5 h-5" />
            <span className="text-sm">Follow @expelight on Instagram</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
