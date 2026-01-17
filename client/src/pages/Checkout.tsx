import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CheckCircle, Truck } from "lucide-react";
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

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: "",
    shippingAddress: "",
  });

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setOrderPlaced(true);
      toast({ title: "Order placed successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to place order", variant: "destructive" });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal >= 25000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.shippingAddress) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.product?.name,
        quantity: item.quantity,
        price: item.product?.price,
      })),
      totalAmount: total,
      email: formData.email || user?.email || "",
      phone: formData.phone,
      shippingAddress: formData.shippingAddress,
    };

    createOrderMutation.mutate(orderData);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505]" data-testid="checkout-page">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[800px] mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-4">Sign in to checkout</h1>
            <p className="text-zinc-500 mb-8">Login to complete your order.</p>
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#050505]" data-testid="checkout-page">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[600px] mx-auto px-4 text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
              <p className="text-zinc-400 mb-8">
                Thank you for your order. We'll send you a confirmation email with tracking details.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/orders">
                  <Button variant="outline" className="border-zinc-700">
                    View Orders
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505]" data-testid="checkout-page">
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-[800px] mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-zinc-500 mb-8">Add some products before checking out.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="checkout-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-8"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-[#0a0a0a] border-zinc-800/30 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-zinc-400">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || user?.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1.5 bg-zinc-900 border-zinc-800 text-white"
                          placeholder="your@email.com"
                          data-testid="email-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-1.5 bg-zinc-900 border-zinc-800 text-white"
                          placeholder="+91 98765 43210"
                          required
                          data-testid="phone-input"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-zinc-400">Shipping Address</Label>
                      <Textarea
                        id="address"
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        className="mt-1.5 bg-zinc-900 border-zinc-800 text-white min-h-[100px]"
                        placeholder="Full address including city, state, and PIN code"
                        required
                        data-testid="address-input"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-lg">
                      <Truck className="w-5 h-5 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Express Air Shipping</p>
                        <p className="text-xs text-zinc-500">Delivery within 5-7 business days</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 h-12"
                      disabled={createOrderMutation.isPending}
                      data-testid="place-order-button"
                    >
                      {createOrderMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          Place Order - ₹{total.toLocaleString("en-IN")}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                      <Shield className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </form>
                </Card>
              </motion.div>
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

                  {/* Cart items summary */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-zinc-800" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white line-clamp-2">{item.product?.name}</p>
                          <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-white">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-4 space-y-3">
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-emerald-400" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-800">
                      <span>Total</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>8-Year Manufacturer Warranty</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
