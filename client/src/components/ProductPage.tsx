import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingBag, Shield, Truck, Check, Minus, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  const [selectedBeamPattern, setSelectedBeamPattern] = useState(product.beamPatterns[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({ title: `${product.name} added to cart!` });
    },
    onError: () => {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    addToCartMutation.mutate();
  };

  return (
    <div
      className="min-h-screen pt-20 pb-20 bg-[#050505]"
      data-testid="product-page"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Images (Scrollable) */}
          <div className="space-y-4" data-testid="product-images">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-[#0a0a0a] rounded-lg overflow-hidden border border-zinc-800/50"
            >
              {product.images && product.images[currentImageIndex] ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800/20 to-zinc-900">
                  <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/60" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-3">
              {(product.images && product.images.length > 0
                ? product.images.slice(0, 4)
                : [0, 1, 2, 3]
              ).map((item, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-[#0a0a0a] rounded-md border transition-all overflow-hidden ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-zinc-800/50 hover:border-zinc-600"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
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

          {/* Right Column - Product Info (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6" data-testid="product-info">
            {/* Series badge */}
            <Badge
              variant="outline"
              className="text-zinc-400 border-zinc-700 bg-zinc-900/50"
            >
              {product.series} Series
            </Badge>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="product-title">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3" data-testid="product-price">
              <span className="text-4xl font-bold text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-zinc-500 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-zinc-400">
              {product.shortDescription}
            </p>

            {/* Beam Pattern Selector */}
            <div>
              <label className="text-sm font-medium mb-3 block text-zinc-300">
                Beam Pattern
              </label>
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

            {/* Color Selector */}
            <div>
              <label className="text-sm font-medium mb-3 block text-zinc-300">
                Color Temperature
              </label>
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
                    <span
                      className={`w-3 h-3 rounded-full ${
                        color === "White" ? "bg-white" : "bg-yellow-400"
                      }`}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-3 block text-zinc-300">
                Quantity
              </label>
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

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              data-testid="add-to-cart"
            >
              {addToCartMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            {/* Trust highlights */}
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

            {/* Accordion sections */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="features" className="border-zinc-800">
                <AccordionTrigger data-testid="accordion-features" className="text-zinc-300 hover:text-white">
                  Features
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specs" className="border-zinc-800">
                <AccordionTrigger data-testid="accordion-specs" className="text-zinc-300 hover:text-white">
                  Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="text-sm text-zinc-400">
                        {spec}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="whatsInBox" className="border-zinc-800">
                <AccordionTrigger data-testid="accordion-whats-in-box" className="text-zinc-300 hover:text-white">
                  What's in the Box
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.whatsInBox.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty" className="border-zinc-800">
                <AccordionTrigger data-testid="accordion-warranty" className="text-zinc-300 hover:text-white">
                  Warranty ({product.warrantyYears} Years)
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-zinc-400">
                    This product comes with a comprehensive {product.warrantyYears}-year warranty covering all manufacturing defects. Our warranty demonstrates our confidence in the quality and durability of Diode Dynamics products.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
