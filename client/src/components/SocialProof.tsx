import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    name: "Mercedes-Benz", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/200px-Mercedes-Logo.svg.png",
    fallback: "MERCEDES"
  },
  { 
    name: "BMW", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png",
    fallback: "BMW"
  },
  { 
    name: "Audi", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/200px-Audi-Logo_2016.svg.png",
    fallback: "AUDI"
  },
  { 
    name: "Land Rover", 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Land_Rover_wordmark_logo.svg/200px-Land_Rover_wordmark_logo.svg.png",
    fallback: "LAND ROVER"
  },
  { 
    name: "Jeep", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jeep_logo.svg/200px-Jeep_logo.svg.png",
    fallback: "JEEP"
  },
];

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
  duration: string;
  category: string;
}

const featuredVideos: VideoItem[] = [
  {
    id: "1",
    title: "SS5 LED Pod - The Brightest 5\" Pod on Earth",
    thumbnail: "https://img.youtube.com/vi/DjWQAadoHmU/maxresdefault.jpg",
    youtubeId: "DjWQAadoHmU",
    duration: "3:45",
    category: "Product Showcase"
  },
  {
    id: "2",
    title: "Stage Series 2\" LED Pod - SS2 Sport Overview",
    thumbnail: "https://img.youtube.com/vi/1xNRyNBwjHk/maxresdefault.jpg",
    youtubeId: "1xNRyNBwjHk",
    duration: "2:30",
    category: "Product Showcase"
  },
  {
    id: "3",
    title: "Stage Series LED Light Bars - Complete Overview",
    thumbnail: "https://img.youtube.com/vi/P_L940KOrqE/maxresdefault.jpg",
    youtubeId: "P_L940KOrqE",
    duration: "4:15",
    category: "Product Showcase"
  },
  {
    id: "4",
    title: "SS3 LED Pod - The Original Stage Series Pod",
    thumbnail: "https://img.youtube.com/vi/xXFi2jKEeA0/maxresdefault.jpg",
    youtubeId: "xXFi2jKEeA0",
    duration: "3:20",
    category: "Product Showcase"
  },
  {
    id: "5",
    title: "SSC1 LED Pod - Ultra Compact Auxiliary Light",
    thumbnail: "https://img.youtube.com/vi/wXHkJJw-EKE/maxresdefault.jpg",
    youtubeId: "wXHkJJw-EKE",
    duration: "2:55",
    category: "Product Showcase"
  },
  {
    id: "6",
    title: "Total Internal Reflection (TIR) Optics Explained",
    thumbnail: "https://img.youtube.com/vi/T7xJJ9gv-ys/maxresdefault.jpg",
    youtubeId: "T7xJJ9gv-ys",
    duration: "3:15",
    category: "Technology"
  },
  {
    id: "7",
    title: "Stage Series Rock Lights - RGBW LED",
    thumbnail: "https://img.youtube.com/vi/6OfntJRqsUU/maxresdefault.jpg",
    youtubeId: "6OfntJRqsUU",
    duration: "2:40",
    category: "Product Showcase"
  },
  {
    id: "8",
    title: "SS5 CrossLink LED Light Bar System",
    thumbnail: "https://img.youtube.com/vi/o8B5OZSo4K8/maxresdefault.jpg",
    youtubeId: "o8B5OZSo4K8",
    duration: "4:20",
    category: "Product Showcase"
  },
];

function VideoCard({ video, index }: { video: VideoItem; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      data-testid={`video-card-${video.id}`}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/50">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <motion.button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid={`play-button-${video.id}`}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/20"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(229, 57, 53, 0.2)",
                    "0 0 30px rgba(229, 57, 53, 0.4)",
                    "0 0 0 rgba(229, 57, 53, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </motion.div>
            </motion.button>

            <Badge
              className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border-zinc-700/50 text-zinc-300"
            >
              {video.category}
            </Badge>

            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
              {video.duration}
            </div>
          </>
        )}
      </div>

      <div className="mt-3">
        <h4 className="text-white font-medium text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h4>
      </div>
    </motion.div>
  );
}

export function SocialProof() {
  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden bg-[#080808]"
      data-testid="social-proof-section"
    >
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

        {/* Trusted by owners - Brand logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 text-center mb-10">
            Trusted by owners of
          </p>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 py-6">
              {brandLogos.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className="group cursor-pointer"
                >
                  <div className="h-10 md:h-14 flex items-center justify-center px-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-full w-auto object-contain max-w-[100px] md:max-w-[130px] invert"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const textEl = document.createElement('span');
                          textEl.className = 'text-sm md:text-base font-bold tracking-wider text-zinc-500';
                          textEl.textContent = brand.fallback;
                          parent.appendChild(textEl);
                        }
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div id="video-gallery" className="flex items-center justify-between mb-8 scroll-mt-24">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 mb-2">
                Featured Content
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Video Gallery
              </h3>
            </div>
            <a
              href="https://www.youtube.com/@DiodeDynamics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-primary transition-colors flex items-center gap-2"
              data-testid="youtube-channel-link"
            >
              View all videos
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        </motion.div>

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
