import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Products & Technology",
    question: "Which is better: White or Yellow fog lights?",
    answer: "It depends on your driving conditions. 6000K Cool White looks modern and matches factory LED headlights, making it great for general visibility. 3000K Selective Yellow is superior for bad weather (rain, fog, snow) because yellow light scatters less than white light, reducing glare back into the driver's eyes."
  },
  {
    category: "Products & Technology",
    question: "Are these brighter than 100W Chinese LEDs?",
    answer: "Wattage is a measure of power consumption, not brightness. A generic 100W light often wastes 60W as heat. Diode Dynamics lights may consume less power (e.g., 40W) but produce more usable light (Candela) on the road because of our efficient TIR optics. Brighter isn't always better; focused is better."
  },
  {
    category: "Products & Technology",
    question: "What is TIR Optics and why does it matter?",
    answer: "TIR (Total Internal Reflection) optics is an advanced lens technology that captures nearly 100% of the LED's light output and directs it precisely where it's needed on the road. Unlike reflector-based designs that scatter light in all directions, TIR optics create a controlled, focused beam pattern. This means better visibility for you without blinding oncoming traffic."
  },
  {
    category: "Products & Technology",
    question: "What is the difference between Sport and Pro variants?",
    answer: "Sport variants typically consume 40W and are ideal for daily driving with excellent beam output. Pro variants consume 90W and deliver significantly higher candela ratings, making them suitable for serious off-road use and enthusiasts who need maximum performance. Both use the same TIR optics technology."
  },
  {
    category: "Installation & Warranty",
    question: "Will installing these lights void my car's warranty?",
    answer: "No. Expelight kits are designed as \"Plug-and-Play.\" We use factory-style connectors that plug directly into your car's existing wiring harness. There is no wire cutting or splicing required, meaning your vehicle's electrical warranty remains intact."
  },
  {
    category: "Installation & Warranty",
    question: "How difficult is the installation?",
    answer: "Most of our products are designed for simple plug-and-play installation that can be completed in 15-30 minutes with basic tools. Each product comes with detailed installation instructions, and we also have video guides available on our product pages. For more complex setups like light bars, we recommend professional installation."
  },
  {
    category: "Installation & Warranty",
    question: "What warranty do Diode Dynamics products carry?",
    answer: "All Diode Dynamics products come with an industry-leading warranty. Stage Series products carry a limited lifetime warranty against defects in materials and workmanship. This reflects the confidence in the quality and durability of these engineering-grade products."
  },
  {
    category: "Ordering & Shipping",
    question: "Do you ship all over India?",
    answer: "Yes, we ship to all serviceable pin codes across India. Orders are typically processed within 1-2 business days, and delivery takes 5-7 business days depending on your location. We use trusted courier partners to ensure safe delivery of your products."
  },
  {
    category: "Ordering & Shipping",
    question: "What are pre-order items and how long do they take?",
    answer: "Pre-order items are products that are currently being sourced from Diode Dynamics USA. When you pre-order, you secure your item at the current price. Pre-order items typically take 6-8 weeks for delivery. Please note that in-stock items ordered along with pre-order items will ship together once the pre-order arrives."
  },
  {
    category: "Ordering & Shipping",
    question: "What payment methods do you accept?",
    answer: "We accept all major payment methods through Razorpay, including UPI, Credit Cards, Debit Cards, Net Banking, and popular wallets like Paytm, PhonePe, and Google Pay. All transactions are secured with industry-standard encryption."
  },
  {
    category: "Ordering & Shipping",
    question: "Can I return or exchange a product?",
    answer: "We have a strict no-returns policy for change of mind. However, if you receive a defective or damaged product, please contact our support team within 48 hours of delivery with photos and your order number. We will arrange for a replacement or repair under warranty. Please refer to our Returns & Warranty policy for full details."
  },
  {
    category: "Vehicle Compatibility",
    question: "How do I know if a product fits my vehicle?",
    answer: "Use our Vehicle Fit Finder tool on the homepage to select your vehicle make and model. It will show you all compatible products. If your vehicle isn't listed, contact us on WhatsApp and our team will help you find the right fit."
  },
];

const categories = Array.from(new Set(faqs.map(f => f.category)));

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
              <a href="/" className="transition-colors hover:text-foreground" data-testid="breadcrumb-home">Home</a>
              <span>/</span>
              <span className="text-foreground">FAQs</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="faq-page-title">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-zinc-400 text-lg" data-testid="faq-page-subtitle">
              Everything you need to know about our products, shipping, and support
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
          <div className="flex flex-wrap gap-2 mb-10" data-testid="faq-category-filters">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover-elevate"
              }`}
              data-testid="faq-filter-all"
            >
              All Questions
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover-elevate"
                }`}
                data-testid={`faq-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={`${faq.category}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative rounded-md overflow-hidden transition-all duration-300 ${
                  openFAQ === index
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
                    : "bg-[#0a0a0a] border border-zinc-800/50"
                }`}
              >
                {openFAQ === index && (
                  <motion.div
                    className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-md blur-xl opacity-50"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="relative z-10 w-full p-6 text-left flex items-center gap-4"
                  data-testid={`faq-toggle-${index}`}
                >
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                    openFAQ === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <span className={`text-base font-medium transition-colors block ${
                      openFAQ === index ? "text-white" : "text-zinc-300"
                    }`}>
                      {faq.question}
                    </span>
                    <span className="text-xs text-zinc-600 mt-1 block">{faq.category}</span>
                  </div>
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

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-zinc-500" data-testid="faq-empty-state">
              No questions found in this category.
            </div>
          )}

          <div className="mt-16 text-center p-8 rounded-md border border-zinc-800/50 bg-[#0a0a0a]" data-testid="faq-contact-section">
            <h3 className="text-xl font-semibold text-white mb-3">Still have questions?</h3>
            <p className="text-zinc-400 mb-6">
              Our team is happy to help. Reach out to us anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#25D366] text-white font-medium transition-all hover-elevate"
                data-testid="faq-whatsapp-link"
              >
                Chat on WhatsApp
              </a>
              <a
                href="mailto:support@expelight.in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-zinc-700 text-zinc-300 font-medium transition-all hover-elevate"
                data-testid="faq-email-link"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}