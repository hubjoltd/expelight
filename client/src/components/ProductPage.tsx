import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ShoppingBag, Shield, Truck, Check, Minus, Plus, Loader2, CheckCircle, 
  Play, FileText, Wrench, HelpCircle, Box, Star, ChevronRight
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  const [selectedBeamPattern, setSelectedBeamPattern] = useState(product.beamPatterns[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: variants = [] } = useQuery<any[]>({
    queryKey: ["/api/products", product.id, "variants"],
    enabled: !!product.id,
  });

  const selectedVariant = variants.find(v => {
    if (v.beamPattern && v.color) {
      return v.beamPattern === selectedBeamPattern && v.color === selectedColor;
    }
    if (v.beamPattern) {
      return v.beamPattern === selectedBeamPattern;
    }
    if (v.name) {
      return v.name.toLowerCase().includes(selectedBeamPattern?.toLowerCase() || '') ||
             v.name.toLowerCase().includes(selectedColor?.toLowerCase() || '');
    }
    return false;
  }) || variants[0];

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setJustAdded(true);
      toast({ title: `${product.name} added to cart!` });
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
    setIsAdding(false);
  };

  const faqItems = [
    {
      question: "Is this product compatible with my vehicle?",
      answer: "Please use our Vehicle Fit Finder tool to check compatibility with your specific vehicle make and model. Most of our products are designed to be universal-fit with included mounting hardware."
    },
    {
      question: "What is the warranty coverage?",
      answer: `This product comes with a comprehensive ${product.warrantyYears}-year warranty covering all manufacturing defects. Our warranty demonstrates our confidence in the quality and durability of Diode Dynamics products.`
    },
    {
      question: "How difficult is the installation?",
      answer: "Most Diode Dynamics products are designed for plug-and-play installation. Basic automotive electrical knowledge is helpful but not required. Detailed installation guides are included with every product."
    },
    {
      question: "What beam pattern should I choose?",
      answer: "Spot patterns provide focused long-range illumination, ideal for off-road driving. Flood patterns offer wide coverage for work areas and peripheral vision. Combo patterns combine both for versatile lighting."
    },
    {
      question: "Are these products street legal?",
      answer: "Our SAE-compliant products are designed to meet regulations. However, auxiliary lighting laws vary by region. Check your local regulations before use on public roads."
    }
  ];

  const installationSteps = [
    { step: 1, title: "Unpack & Inspect", description: "Carefully unpack all components and verify contents match the included parts list." },
    { step: 2, title: "Plan Mounting Location", description: "Determine optimal mounting position considering visibility, clearance, and wiring access." },
    { step: 3, title: "Mount the Light", description: "Use included hardware to secure the light fixture. Ensure stable, vibration-resistant mounting." },
    { step: 4, title: "Route Wiring", description: "Run wiring harness through firewall or along existing wire channels. Avoid heat sources and moving parts." },
    { step: 5, title: "Connect Power", description: "Connect to vehicle battery or auxiliary power. Follow included wiring diagram for proper connections." },
    { step: 6, title: "Test & Adjust", description: "Verify operation and adjust beam angle as needed for optimal illumination." }
  ];

  const specifications = [
    { label: "SKU / Part Number", value: product.sku || "N/A" },
    { label: "Series", value: product.series + " Series" },
    { label: "Warranty", value: `${product.warrantyYears} Years` },
    { label: "Available Colors", value: product.colors.join(", ") },
    { label: "Beam Patterns", value: product.beamPatterns.join(", ") },
    ...product.specs.map((spec, i) => {
      const parts = spec.split(":");
      return {
        label: parts[0]?.trim() || `Spec ${i + 1}`,
        value: parts[1]?.trim() || spec
      };
    })
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-[#050505]" data-testid="product-page">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4" data-testid="product-images">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-[#0a0a0a] rounded-lg overflow-hidden border border-zinc-800/50 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              </div>
              
              {showVideo ? (
                <div className="w-full h-full relative z-10 bg-black flex items-center justify-center">
                  <div className="text-center text-zinc-500">
                    <Play className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p>Product video coming soon</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setShowVideo(false)}
                    >
                      View Images
                    </Button>
                  </div>
                </div>
              ) : product.images && product.images[currentImageIndex] ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover relative z-10"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800/20 to-zinc-900 relative z-10">
                  <motion.div 
                    className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(229, 57, 53, 0.3)",
                        "0 0 60px rgba(229, 57, 53, 0.5)",
                        "0 0 20px rgba(229, 57, 53, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 rounded-full bg-primary/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/60" />
                    </div>
                  </motion.div>
                </div>
              )}

              {!showVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  data-testid="play-video-button"
                >
                  <Play className="w-4 h-4" />
                  Watch Video
                </button>
              )}
            </motion.div>

            <div className="grid grid-cols-5 gap-3">
              {(product.images && product.images.length > 0
                ? product.images.slice(0, 5)
                : [0, 1, 2, 3, 4]
              ).map((item, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-[#0a0a0a] rounded-md border transition-all overflow-hidden ${
                    currentImageIndex === index && !showVideo
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-zinc-800/50 hover:border-zinc-600"
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setShowVideo(false);
                  }}
                  data-testid={`thumbnail-${index}`}
                >
                  {typeof item === "string" ? (
                    <img
                      src={item}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-6" data-testid="product-info">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900/50">
                {product.series} Series
              </Badge>
            </div>
            
            {(selectedVariant?.sku || product.sku) && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-sm">SKU:</span>
                <span className="text-white font-bold text-lg font-mono tracking-wide">
                  {selectedVariant?.sku || product.sku}
                </span>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="product-title">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3" data-testid="product-price">
              <span className="text-4xl font-bold text-white">
                ₹{(selectedVariant?.price || product.price).toLocaleString("en-IN")}
              </span>
              {(selectedVariant?.compareAtPrice || product.originalPrice) && (
                <span className="text-xl text-zinc-500 line-through">
                  ₹{(selectedVariant?.compareAtPrice || product.originalPrice || 0).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-zinc-400">{product.shortDescription}</p>

            <div>
              <label className="text-sm font-medium mb-3 block text-zinc-300">Beam Pattern</label>
              <div className="flex flex-wrap gap-2">
                {product.beamPatterns.map((pattern) => (
                  <button
                    key={pattern}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedBeamPattern === pattern
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                    onClick={() => setSelectedBeamPattern(pattern)}
                    data-testid={`beam-pattern-${pattern.toLowerCase()}`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block text-zinc-300">Color Temperature</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                    onClick={() => setSelectedColor(color)}
                    data-testid={`color-${color.toLowerCase()}`}
                  >
                    <span className={`w-3 h-3 rounded-full ${color === "White" ? "bg-white" : "bg-yellow-400"}`} />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block text-zinc-300">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-700 rounded-md bg-zinc-900">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-zinc-400 hover:text-white"
                    data-testid="quantity-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-white" data-testid="quantity-value">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-400 hover:text-white"
                    data-testid="quantity-increase"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className={`w-full text-base py-6 transition-all ${
                justAdded ? "bg-emerald-600 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"
              }`}
              onClick={handleAddToCart}
              disabled={isAdding}
              data-testid="add-to-cart"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : justAdded ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Shield className="w-4 h-4 text-primary" />
                <span>{product.warrantyYears}-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-zinc-800 rounded-none pb-0 mb-8 flex-wrap h-auto gap-2">
              <TabsTrigger 
                value="description" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-zinc-400 data-[state=active]:text-white pb-4"
              >
                <FileText className="w-4 h-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-zinc-400 data-[state=active]:text-white pb-4"
              >
                <Box className="w-4 h-4 mr-2" />
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="installation" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-zinc-400 data-[state=active]:text-white pb-4"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Installation
              </TabsTrigger>
              <TabsTrigger 
                value="qa" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-zinc-400 data-[state=active]:text-white pb-4"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Q&A
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4">Overview</h3>
                  <div className="text-zinc-400 leading-relaxed space-y-4 whitespace-pre-line">
                    {product.fullDescription?.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    )) || <p>{product.shortDescription}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-zinc-400">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-primary" />
                  What's in the Box
                </h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {product.whatsInBox.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-zinc-400">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-white mb-6">Technical Specifications</h3>
                <div className="bg-zinc-900/30 rounded-lg border border-zinc-800 overflow-hidden">
                  {specifications.map((spec, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center px-6 py-4 ${
                        index !== specifications.length - 1 ? "border-b border-zinc-800" : ""
                      }`}
                    >
                      <span className="text-zinc-500 font-medium">{spec.label}</span>
                      <span className="text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="installation" className="mt-0">
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Installation Guide</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {installationSteps.map((step) => (
                    <div 
                      key={step.step} 
                      className="bg-zinc-900/30 rounded-lg border border-zinc-800 p-6 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {step.step}
                        </div>
                        <h4 className="font-semibold text-white">{step.title}</h4>
                      </div>
                      <p className="text-zinc-400 text-sm">{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/30">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Pro Installation Tips
                  </h4>
                  <ul className="space-y-2 text-zinc-400">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1" />
                      Always disconnect the battery before starting installation
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1" />
                      Use dielectric grease on all electrical connections to prevent corrosion
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1" />
                      Secure all wiring with zip ties to prevent rattling and damage
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1" />
                      Test all functions before final assembly
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-0">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-zinc-800">
                      <AccordionTrigger className="text-left text-zinc-300 hover:text-white">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-400">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-8 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <h4 className="text-lg font-semibold text-white mb-2">Have more questions?</h4>
                  <p className="text-zinc-400 mb-4">
                    Our team is here to help. Contact us via WhatsApp or email for quick assistance.
                  </p>
                  <Button variant="outline" className="border-zinc-700">
                    Contact Support
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
