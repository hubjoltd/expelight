import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingBag, Shield, Truck, Check, Minus, Plus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  const [selectedBeamPattern, setSelectedBeamPattern] = useState(product.beamPatterns[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div
      className="min-h-screen pt-20 pb-20"
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
              className="aspect-square bg-card rounded-lg overflow-hidden border border-border/50"
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card via-muted/20 to-card">
                <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center glow-amber">
                  <div className="w-32 h-32 rounded-full bg-primary/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/60" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  className={`aspect-square bg-card rounded-md border transition-all ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-border/50 hover:border-border"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  data-testid={`thumbnail-${index}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6" data-testid="product-info">
            {/* Series badge */}
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/10"
            >
              {product.series} Series
            </Badge>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="product-title">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3" data-testid="product-price">
              <span className="text-4xl font-bold">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-muted-foreground">
              {product.shortDescription}
            </p>

            {/* Beam Pattern Selector */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Beam Pattern
              </label>
              <div className="flex flex-wrap gap-2">
                {product.beamPatterns.map((pattern) => (
                  <button
                    key={pattern}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedBeamPattern === pattern
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
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
              <label className="text-sm font-medium mb-3 block">
                Color Temperature
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
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
              <label className="text-sm font-medium mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="quantity-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="quantity-value">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
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
              className="w-full bg-primary text-primary-foreground glow-amber text-base py-6"
              data-testid="add-to-cart"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Secure Your Build
            </Button>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>{product.warrantyYears}-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free Shipping</span>
              </div>
            </div>

            {/* Accordion sections */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="features">
                <AccordionTrigger data-testid="accordion-features">
                  Features
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specs">
                <AccordionTrigger data-testid="accordion-specs">
                  Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {spec}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="whatsInBox">
                <AccordionTrigger data-testid="accordion-whats-in-box">
                  What's in the Box
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.whatsInBox.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty">
                <AccordionTrigger data-testid="accordion-warranty">
                  Warranty ({product.warrantyYears} Years)
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
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
