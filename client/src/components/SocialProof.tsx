import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    title: "Stage Series LED Light Bar Overview",
    thumbnail: "https://img.youtube.com/vi/2fxVeAVl2I8/maxresdefault.jpg",
    youtubeId: "2fxVeAVl2I8",
    duration: "2:45",
    category: "Product Showcase"
  },
  {
    id: "2",
    title: "SS3 LED Pod Installation Guide",
    thumbnail: "https://img.youtube.com/vi/hXKZr_OALDU/maxresdefault.jpg",
    youtubeId: "hXKZr_OALDU",
    duration: "5:30",
    category: "Installation"
  },
  {
    id: "3",
    title: "TIR Optics Technology Explained",
    thumbnail: "https://img.youtube.com/vi/T7xJJ9gv-ys/maxresdefault.jpg",
    youtubeId: "T7xJJ9gv-ys",
    duration: "3:15",
    category: "Technology"
  },
  {
    id: "4",
    title: "SS5 CrossLink Light Bar Review",
    thumbnail: "https://img.youtube.com/vi/o8B5OZSo4K8/maxresdefault.jpg",
    youtubeId: "o8B5OZSo4K8",
    duration: "4:20",
    category: "Product Review"
  },
  {
    id: "5",
    title: "Off-Road Night Driving Test",
    thumbnail: "https://img.youtube.com/vi/kB9Vh6cAD7E/maxresdefault.jpg",
    youtubeId: "kB9Vh6cAD7E",
    duration: "6:10",
    category: "Real World Test"
  },
  {
    id: "6",
    title: "Rock Lights Installation Tutorial",
    thumbnail: "https://img.youtube.com/vi/6mMFJZXgB0U/maxresdefault.jpg",
    youtubeId: "6mMFJZXgB0U",
    duration: "4:45",
    category: "Installation"
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
