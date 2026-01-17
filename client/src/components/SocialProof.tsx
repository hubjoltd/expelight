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

export function SocialProof() {
  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden bg-[#080808]"
      data-testid="social-proof-section"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Built by <span className="text-gradient-red">Enthusiasts</span>.
            <br className="hidden md:block" />
            Tested in India.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of off-road enthusiasts who upgraded their night driving experience.
          </p>
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
              className={`relative group cursor-pointer ${
                index === 0 || index === 5 ? "md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative bg-[#0a0a0a] border border-border/20 rounded-lg overflow-hidden ${
                  index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                {/* Placeholder for customer photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-[#0a0a0a] to-muted/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20" />
                  </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(photo.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{photo.vehicle}</p>
                  <p className="text-xs text-muted-foreground">{photo.username}</p>
                </div>

                {/* Verified badge */}
                <Badge
                  className="absolute top-3 right-3 bg-green-500/20 text-green-400 border-green-500/30"
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
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
