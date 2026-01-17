import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export default function Cart() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({ title: "Item removed from cart" });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal >= 25000 ? 0 : 500;
  const total = subtotal + shipping;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505]" data-testid="cart-page">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[800px] mx-auto px-4 text-center py-20">
            <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Sign in to view your cart</h1>
            <p className="text-zinc-500 mb-8">Login to add items to your cart and checkout.</p>
            <a href="/api/login">
              <Button className="bg-primary hover:bg-primary/90">
                Login / Sign Up
              </Button>
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="cart-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-8"
          >
            Your <span className="text-zinc-500">Cart</span>
          </motion.h1>

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
              <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-zinc-500 mb-8">Explore our products and find the perfect lighting upgrade.</p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90">
                  Browse Products
                  <ArrowRight className="w-4 h-4 ml-2" />
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-[#0a0a0a] border-zinc-800/30 p-4">
                      <div className="flex gap-4">
                        {/* Product image */}
                        <div className="w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-zinc-800" />
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
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-zinc-500 hover:text-red-500 flex-shrink-0"
                              onClick={() => removeItemMutation.mutate(item.id)}
                              disabled={removeItemMutation.isPending}
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
                                className="h-8 w-8 border-zinc-700"
                                onClick={() => updateQuantityMutation.mutate({
                                  id: item.id,
                                  quantity: Math.max(1, item.quantity - 1)
                                })}
                                disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-white font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-zinc-700"
                                onClick={() => updateQuantityMutation.mutate({
                                  id: item.id,
                                  quantity: item.quantity + 1
                                })}
                                disabled={updateQuantityMutation.isPending}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Price */}
                            <p className="text-lg font-bold text-white">
                              ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
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
                  <Card className="bg-[#0a0a0a] border-zinc-800/30 p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-emerald-400" : ""}>
                          {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-zinc-500">
                          Add ₹{(25000 - subtotal).toLocaleString("en-IN")} more for free shipping
                        </p>
                      )}
                      <div className="border-t border-zinc-800 pt-4">
                        <div className="flex justify-between text-white font-bold text-lg">
                          <span>Total</span>
                          <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Inclusive of all taxes</p>
                      </div>
                    </div>

                    <Link href="/checkout">
                      <Button className="w-full bg-primary hover:bg-primary/90 h-12" data-testid="checkout-button">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
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
