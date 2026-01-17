import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#22c55e]",
      url: "https://wa.me/919876543210",
    },
    {
      name: "Telegram",
      icon: SiTelegram,
      color: "bg-[#0088cc]",
      hoverColor: "hover:bg-[#0077b5]",
      url: "https://t.me/expelight",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" data-testid="floating-contact">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
          >
            {contactOptions.map((option, index) => (
              <motion.a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full ${option.color} ${option.hoverColor} text-white shadow-lg transition-all group`}
                data-testid={`contact-${option.name.toLowerCase()}`}
              >
                <option.icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {option.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button with blink animation */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="contact-toggle"
      >
        {/* Pulse/blink effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
