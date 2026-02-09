import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { cartItems, cartCount, isLoading, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variantPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 25000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleRemove = async (id: string) => {
    await removeItem(id);
    toast({ title: "Item removed from cart" });
  };

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="cart-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your <span className="text-zinc-500">Cart</span>
            </h1>
            {cartCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </motion.div>

          {isLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-[#0a0a0a] border-zinc-800/30 p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-zinc-800 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-zinc-800 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />
                        <div className="h-6 bg-zinc-800 rounded w-24 animate-pulse" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="relative inline-block mb-6">
                <ShoppingBag className="w-20 h-20 text-zinc-700" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(229, 57, 53, 0)",
                      "0 0 30px rgba(229, 57, 53, 0.3)",
                      "0 0 0 rgba(229, 57, 53, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                Explore our premium lighting products and find the perfect upgrade for your vehicle.
              </p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-[#0a0a0a] border-zinc-800/30 p-4 hover:border-zinc-700/50 transition-colors">
                      <div className="flex gap-4">
                        {/* Product image with glow effect */}
                        <div className="w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover relative z-10"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center relative z-10">
                              <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse" />
                            </div>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-4">
                            <div>
                              <Badge
                                variant="outline"
                                className="text-xs mb-2 text-zinc-400 border-zinc-700"
                              >
                                {item.product?.series} Series
                              </Badge>
                              <h3 className="font-medium text-white line-clamp-2">
                                {item.product?.name}
                              </h3>
                              {item.variantName && (
                                <p className="text-xs text-zinc-500 mt-1">
                                  {item.variantName} {item.variantSku && `(${item.variantSku})`}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-zinc-500 hover:text-red-500 flex-shrink-0"
                              onClick={() => handleRemove(item.id)}
                              data-testid={`remove-item-${item.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-zinc-700 bg-zinc-900"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-white font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-zinc-700 bg-zinc-900"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <p className="text-lg font-bold text-white">
                              ₹{((item.variantPrice || item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-[#0a0a0a] border-zinc-800/30 p-6 sticky top-24 relative overflow-hidden">
                    {/* Subtle glow effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    
                    <h2 className="text-xl font-bold text-white mb-6 relative z-10">Order Summary</h2>

                    <div className="space-y-4 mb-6 relative z-10">
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal ({cartCount} items)</span>
                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-emerald-400" : ""}>
                          {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                          <p className="text-xs text-zinc-400">
                            Add <span className="text-primary font-semibold">₹{(25000 - subtotal).toLocaleString("en-IN")}</span> more for free shipping
                          </p>
                        </div>
                      )}
                      <div className="border-t border-zinc-800 pt-4">
                        <div className="flex justify-between text-white font-bold text-lg">
                          <span>Total</span>
                          <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Inclusive of all taxes</p>
                      </div>
                    </div>

                    {isAuthenticated ? (
                      <Link href="/checkout">
                        <Button className="w-full bg-primary hover:bg-primary/90 h-12 relative z-10" data-testid="checkout-button">
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full bg-primary hover:bg-primary/90 h-12 relative z-10" data-testid="login-to-checkout">
                          Login to Checkout
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}

                    <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 relative z-10">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout powered by Razorpay</span>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
