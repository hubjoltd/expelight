import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50" data-testid="floating-contact">
      <motion.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="whatsapp-button"
      >
        {/* Pulse/blink effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Second pulse ring for more visible effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        
        <SiWhatsapp className="w-7 h-7 relative z-10" />
      </motion.a>
    </div>
  );
}
