import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
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
  Play, FileText, Wrench, HelpCircle, Box, Star, ChevronRight, ChevronLeft, Clock,
  ZoomIn, ZoomOut
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const COLOR_MAP: Record<string, string> = {
  "white": "#ffffff",
  "white, diffused": "#f0f0f0",
  "amber": "#ffbf00",
  "yellow": "#ffd700",
  "orange": "#ff8c00",
  "red": "#ef4444",
  "green": "#22c55e",
  "blue": "#3b82f6",
  "clear": "#e0e0e0",
};

function getColorHex(color: string): string {
  return COLOR_MAP[color.toLowerCase()] || "#a1a1aa";
}

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  const searchString = useSearch();
  const skuParam = new URLSearchParams(searchString).get("sku");
  const [selectedBeamPattern, setSelectedBeamPattern] = useState(product.beamPatterns[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [skuInitialized, setSkuInitialized] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: allVariants = [] } = useQuery<any[]>({
    queryKey: ["/api/products", product.id, "variants"],
    enabled: !!product.id,
  });

  const variants = useMemo(() => 
    allVariants.filter((v: any) => v.isAvailable !== false),
    [allVariants]
  );

  const isPlaceholder = (val: string) => {
    const lower = val.trim().toLowerCase();
    return lower === "default title" || lower === "default" || lower === "";
  };

  const availableBeamPatterns = useMemo(() => {
    if (variants.length === 0) return [];
    const variantBeams = [...new Set(variants.map((v: any) => v.beamPattern).filter((b: string | null) => b && !isPlaceholder(b)))];
    return variantBeams;
  }, [variants]);

  const availableColors = useMemo(() => {
    if (variants.length === 0) return [];
    const variantColors = [...new Set(variants.map((v: any) => v.color).filter((c: string | null) => c && !isPlaceholder(c)))];
    return variantColors;
  }, [variants]);

  const modelVariants = useMemo(() => {
    if (variants.length <= 1) return [];
    const hasMultipleBeams = availableBeamPatterns.length > 1;
    const hasMultipleColors = availableColors.length > 1;
    const matching = variants.filter((v: any) => {
      const beamMatch = !hasMultipleBeams || !v.beamPattern || v.beamPattern === selectedBeamPattern;
      const colorMatch = !hasMultipleColors || !v.color || v.color === selectedColor;
      return beamMatch && colorMatch;
    });
    if (matching.length <= 1) return [];
    return matching;
  }, [variants, availableBeamPatterns, availableColors, selectedBeamPattern, selectedColor]);

  const [selectedModelIndex, setSelectedModelIndex] = useState(0);

  const displayImages = useMemo(() => {
    const baseImages = product.images || [];
    if (variants.length === 0) return baseImages;
    const variantImgUrls = variants
      .map((v: any) => v.imageUrl)
      .filter((url: string | null) => url && !baseImages.includes(url));
    const uniqueVariantImgs = Array.from(new Set(variantImgUrls)) as string[];
    return [...baseImages, ...uniqueVariantImgs];
  }, [product.images, variants]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  }, [zoomLevel, panPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (zoomLevel <= 1 && e.deltaY > 0) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else {
      const newZoom = Math.max(zoomLevel - 0.25, 1);
      setZoomLevel(newZoom);
      if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);

  const totalSlides = (displayImages.length || 0) + (product.videoUrl ? 1 : 0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setSwipeOffset(0);
  }, [zoomLevel]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (zoomLevel > 1 || touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    setSwipeOffset(currentTouch - touchStart);
  }, [zoomLevel, touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (zoomLevel > 1 || touchStart === null || touchEnd === null) {
      setIsSwiping(false);
      setSwipeOffset(0);
      return;
    }
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    const imageCount = displayImages.length || 0;

    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) {
        if (showVideo) {
          // already at end
        } else if (currentImageIndex < imageCount - 1) {
          setCurrentImageIndex(prev => prev + 1);
        } else if (product.videoUrl) {
          setShowVideo(true);
        }
      } else {
        if (showVideo) {
          setShowVideo(false);
          setCurrentImageIndex(imageCount - 1);
        } else if (currentImageIndex > 0) {
          setCurrentImageIndex(prev => prev - 1);
        }
      }
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
    setSwipeOffset(0);
  }, [touchStart, touchEnd, currentImageIndex, showVideo, displayImages, product.videoUrl, zoomLevel]);

  const goToPrevImage = () => {
    if (showVideo) {
      setShowVideo(false);
      setCurrentImageIndex((displayImages.length || 1) - 1);
    } else if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const goToNextImage = () => {
    const imageCount = displayImages.length || 0;
    if (!showVideo && currentImageIndex < imageCount - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (!showVideo && product.videoUrl) {
      setShowVideo(true);
    }
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const currentSlideIndex = showVideo ? displayImages.length : currentImageIndex;

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const currentProductFromList = allProducts.find(p => p.id === product.id);
  const currentCategoryIds: string[] = (currentProductFromList as any)?.categoryIds || [];

  const similarProducts = allProducts
    .filter(p => {
      if (p.id === product.id) return false;
      if (currentCategoryIds.length > 0) {
        const pCats: string[] = (p as any).categoryIds || [];
        const hasSharedCategory = pCats.some((c: string) => currentCategoryIds.includes(c));
        if (hasSharedCategory) return true;
      }
      return p.series === product.series;
    })
    .slice(0, 4);

  const [skuModelSynced, setSkuModelSynced] = useState(false);

  useEffect(() => {
    if (variants.length > 0 && !skuInitialized) {
      if (skuParam) {
        const matchIdx = variants.findIndex((v: any) => v.sku?.toLowerCase() === skuParam.toLowerCase());
        if (matchIdx >= 0) {
          setSelectedVariantIndex(matchIdx);
          const matched = variants[matchIdx];
          if (matched.beamPattern) setSelectedBeamPattern(matched.beamPattern);
          if (matched.color) setSelectedColor(matched.color);
          setSkuModelSynced(false);
          setSkuInitialized(true);
          return;
        }
      }
      const first = variants[0];
      if (first.beamPattern && !availableBeamPatterns.includes(selectedBeamPattern)) {
        setSelectedBeamPattern(first.beamPattern);
      }
      if (first.color && !availableColors.includes(selectedColor)) {
        setSelectedColor(first.color);
      }
      setSkuInitialized(true);
    }
  }, [skuParam, variants, skuInitialized, availableBeamPatterns, availableColors, selectedBeamPattern, selectedColor]);

  useEffect(() => {
    if (skuParam && skuInitialized && !skuModelSynced && modelVariants.length > 0) {
      const matched = variants[selectedVariantIndex];
      if (matched) {
        const modelIdx = modelVariants.indexOf(matched);
        if (modelIdx >= 0) {
          setSelectedModelIndex(modelIdx);
        }
      }
      setSkuModelSynced(true);
    }
  }, [skuParam, skuInitialized, skuModelSynced, modelVariants, variants, selectedVariantIndex]);

  const switchToVariantImage = useCallback((variant: any) => {
    if (!variant?.imageUrl) return;
    const imgIdx = displayImages.indexOf(variant.imageUrl);
    if (imgIdx >= 0) {
      setCurrentImageIndex(imgIdx);
      setShowVideo(false);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [displayImages]);

  useEffect(() => {
    setSelectedModelIndex(0);
  }, [selectedBeamPattern, selectedColor]);

  useEffect(() => {
    if (variants.length > 0) {
      if (modelVariants.length > 0) {
        const picked = modelVariants[selectedModelIndex] || modelVariants[0];
        const idx = variants.indexOf(picked);
        if (idx >= 0) {
          setSelectedVariantIndex(idx);
          switchToVariantImage(picked);
        }
      } else {
        const match = variants.find((v: any) => {
          const beamMatch = !v.beamPattern || v.beamPattern === selectedBeamPattern;
          const colorMatch = !v.color || v.color === selectedColor;
          return beamMatch && colorMatch;
        });
        if (match) {
          const idx = variants.indexOf(match);
          if (idx >= 0) {
            setSelectedVariantIndex(idx);
            switchToVariantImage(match);
          }
        }
      }
    }
  }, [selectedBeamPattern, selectedColor, selectedModelIndex, modelVariants, variants, switchToVariantImage]);

  useEffect(() => {
    if (variants.length > 0 && variants[selectedVariantIndex] && displayImages.length > 0) {
      switchToVariantImage(variants[selectedVariantIndex]);
    }
  }, [selectedVariantIndex, variants, displayImages, switchToVariantImage]);

  const selectedVariant = variants[selectedVariantIndex] || variants[0];

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const variantInfo = selectedVariant ? {
        variantSku: selectedVariant.sku,
        variantPrice: selectedVariant.price,
        variantName: selectedVariant.name || selectedVariant.sku,
      } : undefined;
      await addToCart(product.id, quantity, variantInfo);
      setJustAdded(true);
      toast({ title: `${product.name} added to cart!` });
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
    setIsAdding(false);
  };

  // Use dynamic Q&A content from database if available, otherwise use defaults
  const faqItems = (product as any).qaContent 
    ? JSON.parse((product as any).qaContent)
    : [
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
        }
      ];

  // Use dynamic installation steps from database if available
  const installGuide = (product as any).installationGuide ? JSON.parse((product as any).installationGuide) : null;
  const installationSteps = installGuide?.steps 
    ? installGuide.steps.map((step: string, idx: number) => ({
        step: idx + 1,
        title: `Step ${idx + 1}`,
        description: step
      }))
    : [
        { step: 1, title: "Unpack & Inspect", description: "Carefully unpack all components and verify contents match the included parts list." },
        { step: 2, title: "Plan Mounting Location", description: "Determine optimal mounting position considering visibility, clearance, and wiring access." },
        { step: 3, title: "Mount the Light", description: "Use included hardware to secure the light fixture. Ensure stable, vibration-resistant mounting." },
        { step: 4, title: "Route Wiring", description: "Run wiring harness through firewall or along existing wire channels. Avoid heat sources and moving parts." },
        { step: 5, title: "Connect Power", description: "Connect to vehicle battery or auxiliary power. Follow included wiring diagram for proper connections." },
        { step: 6, title: "Test & Adjust", description: "Verify operation and adjust beam angle as needed for optimal illumination." }
      ];

  const specifications = [
    { label: "SKU / Part Number", value: selectedVariant?.sku || product.sku || "N/A" },
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
              ref={imageContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              </div>
              
              {showVideo && (product as any).videoUrl ? (
                <div className="w-full h-full relative z-10 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${((product as any).videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/) || [])[1] || ''}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-4 right-4 bg-black/50"
                    onClick={() => setShowVideo(false)}
                  >
                    View Images
                  </Button>
                </div>
              ) : displayImages && displayImages[currentImageIndex] ? (
                <img
                  src={displayImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain relative z-10 select-none"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)${isSwiping && zoomLevel <= 1 ? ` translateX(${swipeOffset * 0.3}px)` : ''}`,
                    transition: isDragging || isSwiping ? 'none' : 'transform 0.3s ease',
                  }}
                  draggable={false}
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
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    className="bg-black/70 text-white"
                    data-testid="zoom-in-button"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    className="bg-black/70 text-white"
                    data-testid="zoom-out-button"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </Button>
                  {zoomLevel > 1 && (
                    <Badge variant="secondary" className="bg-black/70 text-white text-xs justify-center" data-testid="zoom-level-display">
                      {Math.round(zoomLevel * 100)}%
                    </Badge>
                  )}
                </div>
              )}

              {!showVideo && currentSlideIndex > 0 && (
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:bg-black/80 transition-colors"
                  data-testid="prev-image-button"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {!showVideo && currentSlideIndex < totalSlides - 1 && (
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:bg-black/80 transition-colors"
                  data-testid="next-image-button"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              {showVideo && (
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:bg-black/80 transition-colors"
                  data-testid="prev-image-button-video"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {totalSlides > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 md:hidden">
                  {Array.from({ length: Math.min(totalSlides, 10) }).map((_, i) => {
                    const isVideoSlide = i === displayImages.length;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (isVideoSlide) {
                            setShowVideo(true);
                          } else {
                            setShowVideo(false);
                            setCurrentImageIndex(i);
                          }
                          setZoomLevel(1);
                          setPanPosition({ x: 0, y: 0 });
                        }}
                        className={`rounded-full transition-all ${
                          currentSlideIndex === i
                            ? "w-6 h-2 bg-white"
                            : "w-2 h-2 bg-white/40"
                        }`}
                        data-testid={`dot-indicator-${i}`}
                      />
                    );
                  })}
                  {totalSlides > 10 && (
                    <span className="text-white/50 text-[10px] ml-1">+{totalSlides - 10}</span>
                  )}
                </div>
              )}

              {totalSlides > 1 && (
                <div className="absolute top-3 left-3 z-20 md:hidden">
                  <span className="bg-black/60 text-white/80 text-xs px-2 py-1 rounded-full">
                    {currentSlideIndex + 1} / {totalSlides}
                  </span>
                </div>
              )}

            </motion.div>

            <div className="relative flex items-center gap-1">
              <button
                onClick={() => {
                  if (thumbContainerRef.current) {
                    const thumbWidth = thumbContainerRef.current.querySelector('button')?.offsetWidth || 80;
                    thumbContainerRef.current.scrollBy({ left: -(thumbWidth + 8) * 4, behavior: 'smooth' });
                  }
                }}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800/80 flex items-center justify-center text-white/70 hover:bg-zinc-700 transition-colors"
                data-testid="thumb-scroll-left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div
                ref={thumbContainerRef}
                className="flex gap-2 overflow-x-hidden scroll-smooth"
              >
                {(displayImages.length > 0
                  ? displayImages
                  : []
                ).map((item, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 bg-[#0a0a0a] rounded-md border transition-all overflow-hidden ${
                      currentImageIndex === index && !showVideo
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-zinc-800/50 hover:border-zinc-600"
                    }`}
                    style={{ width: 'calc((100% - 24px) / 4)', aspectRatio: '1' }}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowVideo(false);
                      setZoomLevel(1);
                      setPanPosition({ x: 0, y: 0 });
                    }}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={item}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
                {product.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`flex-shrink-0 bg-[#0a0a0a] rounded-md border transition-all flex flex-col items-center justify-center gap-1 hover-elevate ${
                      showVideo
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-zinc-800/50"
                    }`}
                    style={{ width: 'calc((100% - 24px) / 4)', aspectRatio: '1' }}
                    data-testid="play-video-button"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary ml-0.5" />
                    </div>
                    <span className="text-[10px] text-zinc-400">Video</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  if (thumbContainerRef.current) {
                    const thumbWidth = thumbContainerRef.current.querySelector('button')?.offsetWidth || 80;
                    thumbContainerRef.current.scrollBy({ left: (thumbWidth + 8) * 4, behavior: 'smooth' });
                  }
                }}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800/80 flex items-center justify-center text-white/70 hover:bg-zinc-700 transition-colors"
                data-testid="thumb-scroll-right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-6" data-testid="product-info">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900/50">
                {product.series} Series
              </Badge>
              {product.isPreOrder && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Pre-Order
                </Badge>
              )}
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
              
            </div>

            <p className="text-zinc-400 text-justify">{product.shortDescription}</p>

            {!(availableBeamPatterns?.length > 1) && !(availableColors?.length > 1) && modelVariants.length === 0 && variants.length > 1 && (
              <div>
                <label className="text-sm font-medium mb-3 block text-zinc-300">Option</label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant: any, idx: number) => (
                    <button
                      key={variant.id}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedVariantIndex === idx
                          ? "bg-primary text-primary-foreground"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        switchToVariantImage(variant);
                      }}
                      data-testid={`variant-${idx}`}
                    >
                      {variant.model || variant.name || variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableBeamPatterns && availableBeamPatterns.length >= 1 && (
              <div>
                <label className="text-sm font-medium mb-3 block text-zinc-300">Beam Pattern</label>
                <div className="flex flex-wrap gap-2">
                  {availableBeamPatterns.map((pattern) => (
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
            )}

            {availableColors && availableColors.length >= 1 && (
              <div>
                <label className="text-sm font-medium mb-3 block text-zinc-300">Color Temperature</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
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
                      <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getColorHex(color) }} />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modelVariants.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block text-zinc-300">Model</label>
                <div className="flex flex-wrap gap-2">
                  {modelVariants.map((variant: any, idx: number) => (
                    <button
                      key={variant.id}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedModelIndex === idx
                          ? "bg-primary text-primary-foreground"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                      onClick={() => {
                        setSelectedModelIndex(idx);
                      }}
                      data-testid={`model-${idx}`}
                    >
                      {variant.model || variant.name || variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modelVariants.length === 0 && variants.length === 1 && variants[0]?.model && (
              <div>
                <label className="text-sm font-medium mb-3 block text-zinc-300">Model</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground" data-testid="model-single">
                    {variants[0].model}
                  </span>
                </div>
              </div>
            )}

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
                justAdded 
                  ? "bg-emerald-600 hover:bg-emerald-600" 
                  : product.isPreOrder 
                    ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold" 
                    : "bg-primary hover:bg-primary/90"
              }`}
              onClick={handleAddToCart}
              disabled={isAdding}
              data-testid="add-to-cart"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {product.isPreOrder ? "Pre-Ordering..." : "Adding..."}
                </>
              ) : justAdded ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {product.isPreOrder ? "Pre-Order Placed!" : "Added to Cart!"}
                </>
              ) : product.isPreOrder ? (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  Pre-Order Now
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            {product.isPreOrder && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg" data-testid="pre-order-notice">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-400">Pre-Order Item</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {product.preOrderMessage || "This is a pre-order item. Expected delivery: 6-8 weeks. In-stock items in your order will be shipped together with pre-order items."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Shield className="w-4 h-4 text-primary" />
                <span>{product.warrantyYears}-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Truck className="w-4 h-4 text-primary" />
                <span>{product.isPreOrder ? "6-8 Weeks Delivery" : "Free Shipping"}</span>
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
                value="partnumbers" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-zinc-400 data-[state=active]:text-white pb-4"
              >
                <FileText className="w-4 h-4 mr-2" />
                Part Numbers
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
                  <div className="relative">
                    <div 
                      className={`prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-4 text-justify overflow-hidden transition-all duration-300 ${
                        !descriptionExpanded ? 'max-h-[500px]' : 'max-h-none'
                      }`}
                      dangerouslySetInnerHTML={{ __html: product.fullDescription || product.shortDescription }}
                    />
                    {((product.fullDescription?.length || 0) > 600) && (
                      <>
                        {!descriptionExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                        )}
                        <button
                          onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                          className="mt-3 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                          data-testid="button-read-more"
                        >
                          {descriptionExpanded ? 'Show less' : 'Read more...'}
                        </button>
                      </>
                    )}
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
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                <p className="text-sm text-zinc-500 mb-6">NOTE: Specifications listed here are for each individual pod.</p>

                {specifications.length > 0 && (
                  <div className="space-y-1 mb-8">
                    {specifications.map((spec, index) => (
                      <div
                        key={`basic-spec-${index}`}
                        className={`flex items-start gap-2 py-2.5 px-3 rounded ${index % 2 === 0 ? 'bg-zinc-900/50' : ''}`}
                      >
                        <span className="text-sm font-medium text-zinc-300 min-w-[180px]">{spec.label}</span>
                        <span className="text-sm text-zinc-400">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Specifications from advlust.com */}
                {(product as any).specificationsTable && (() => {
                    try {
                      const specTable = JSON.parse((product as any).specificationsTable);
                      const { variantSpecs, ...regularSpecs } = specTable;
                      
                      return (
                        <>
                          {/* Variant Comparison Table */}
                          {variantSpecs && variantSpecs.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold text-white mb-4">Variant Comparison</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-zinc-700">
                                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Variant</th>
                                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Peak Beam Intensity</th>
                                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Illuminance @ 10m</th>
                                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Measured Output</th>
                                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Raw Output</th>
                                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Output Color</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {variantSpecs.map((spec: any, idx: number) => (
                                      <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                        <td className="py-3 px-4 text-zinc-300 font-medium">{spec.name}</td>
                                        <td className="py-3 px-4 text-zinc-400">{spec.peakIntensity}</td>
                                        <td className="py-3 px-4 text-zinc-400">{spec.illuminance}</td>
                                        <td className="py-3 px-4 text-zinc-400">{spec.measuredOutput}</td>
                                        <td className="py-3 px-4 text-zinc-400">{spec.rawOutput}</td>
                                        <td className="py-3 px-4 text-zinc-400">{spec.outputColor}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          {/* Regular Specifications */}
                          <div className="space-y-3">
                            <h4 className="text-lg font-semibold text-white mb-4">Technical Specifications</h4>
                            {Object.entries(regularSpecs).map(([key, value], index) => (
                              <div key={`spec-${index}`} className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-zinc-300 min-w-[200px]">{key}:</span>
                                <span className="text-sm text-zinc-400">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    } catch { return null; }
                  })()}

                {/* What's Included Section */}
                {(product as any).whatsInBox && (product as any).whatsInBox.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-white mb-4">What's Included</h4>
                    <p className="text-sm text-zinc-400">100% Satisfaction Guarantee</p>
                    <ul className="mt-3 space-y-2">
                      {(product as any).whatsInBox.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="installation" className="mt-0">
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Installation Guide</h3>
                
                {installGuide && (
                  <div className="bg-zinc-900/30 rounded-lg border border-zinc-800 p-6 mb-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {installGuide.installationTime && (
                        <div>
                          <span className="text-zinc-500 font-medium">Installation Time:</span>
                          <span className="text-white ml-2">{installGuide.installationTime}</span>
                        </div>
                      )}
                      {installGuide.difficulty && (
                        <div>
                          <span className="text-zinc-500 font-medium">Difficulty:</span>
                          <span className="text-white ml-2">{installGuide.difficulty}</span>
                        </div>
                      )}
                      {installGuide.toolsNeeded && (
                        <div className="sm:col-span-2 lg:col-span-1">
                          <span className="text-zinc-500 font-medium">Tools Needed:</span>
                          <span className="text-white ml-2">{installGuide.toolsNeeded}</span>
                        </div>
                      )}
                    </div>
                    {installGuide.notes && installGuide.notes.length > 0 && (
                      <div className="border-t border-zinc-800 pt-4 mt-4">
                        <h5 className="text-sm font-medium text-zinc-400 mb-2">Important Notes:</h5>
                        <ul className="space-y-1">
                          {installGuide.notes.map((note: string, idx: number) => (
                            <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {installationSteps.map((step: any) => (
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

            <TabsContent value="partnumbers" className="mt-0">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Part Numbers</h3>
                <p className="text-sm text-zinc-500 mb-6">The following part numbers are included with this listing:</p>
                
                {variants.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-zinc-900/50 border-b border-zinc-800">
                          <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">SKU</th>
                          <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Name</th>
                          <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Price</th>
                          {variants.some((v: any) => v.beamPattern) && (
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Beam Pattern</th>
                          )}
                          {variants.some((v: any) => v.color) && (
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Color</th>
                          )}
                          {variants.some((v: any) => v.size) && (
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Size</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant: any, index: number) => (
                          <tr 
                            key={variant.id} 
                            className={`border-b border-zinc-800 ${
                              selectedVariant?.id === variant.id 
                                ? "bg-primary/10" 
                                : "hover:bg-zinc-900/30"
                            }`}
                          >
                            <td className="px-3 py-2 text-white font-mono text-xs">{variant.sku}</td>
                            <td className="px-3 py-2 text-zinc-300 text-xs">{variant.name || '-'}</td>
                            <td className="px-3 py-2 text-primary text-xs">₹{variant.price?.toLocaleString('en-IN')}</td>
                            {variants.some((v: any) => v.beamPattern) && (
                              <td className="px-3 py-2 text-zinc-400 text-xs">{variant.beamPattern || '-'}</td>
                            )}
                            {variants.some((v: any) => v.color) && (
                              <td className="px-3 py-2 text-zinc-400 text-xs">{variant.color || '-'}</td>
                            )}
                            {variants.some((v: any) => v.size) && (
                              <td className="px-3 py-2 text-zinc-400 text-xs">{variant.size || '-'}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-zinc-900/50 border-b border-zinc-800">
                          <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">SKU</th>
                          <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Name</th>
                          <th className="text-left px-3 py-2 text-zinc-400 font-medium text-xs">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="px-3 py-2 text-white font-mono text-xs">{product.sku}</td>
                          <td className="px-3 py-2 text-zinc-300 text-xs">{product.name}</td>
                          <td className="px-3 py-2 text-primary text-xs">₹{product.price?.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-0">
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((faq: any, index: number) => (
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

        {similarProducts.length > 0 && (
          <div className="mt-16" data-testid="similar-products">
            <h2 className="text-2xl font-bold text-white mb-8">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-colors"
                >
                  <div className="aspect-square bg-zinc-900 overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-zinc-300 line-clamp-2 group-hover:text-white transition-colors mb-2">
                      {p.name}
                    </p>
                    <p className="text-primary font-semibold">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
