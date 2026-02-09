import { useState, useEffect } from "react";
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
import { ArrowLeft, Shield, CheckCircle, Truck, CreditCard, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  variantSku?: string;
  variantPrice?: number;
  variantName?: string;
  product: Product;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: "",
    shippingAddress: "",
  });

  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const { data: razorpayKeyData } = useQuery<{ key: string }>({
    queryKey: ["/api/razorpay/key"],
  });

  const createRazorpayOrder = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/razorpay/create-order", orderData);
      return res.json();
    },
  });

  const verifyPayment = useMutation({
    mutationFn: async (paymentData: any) => {
      const res = await apiRequest("POST", "/api/razorpay/verify-payment", paymentData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setOrderPlaced(true);
      toast({ title: "Payment successful! Order confirmed." });
    },
    onError: () => {
      toast({ title: "Payment verification failed. Please contact support.", variant: "destructive" });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variantPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 25000 ? 0 : 500;
  const total = subtotal + shipping;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !formData.shippingAddress) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      toast({ title: "Payment system is loading. Please try again.", variant: "destructive" });
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.product?.name,
          quantity: item.quantity,
          price: item.variantPrice || item.product?.price,
          variantSku: item.variantSku,
          variantName: item.variantName,
        })),
        totalAmount: total,
        email: formData.email || user?.email || "",
        phone: formData.phone,
        shippingAddress: formData.shippingAddress,
      };

      const razorpayOrder = await createRazorpayOrder.mutateAsync(orderData);

      const options = {
        key: razorpayKeyData?.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Expelight",
        description: "Premium Automotive LED Lighting",
        order_id: razorpayOrder.razorpayOrderId,
        handler: function (response: any) {
          verifyPayment.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: razorpayOrder.orderId,
          });
        },
        prefill: {
          name: user?.username || "",
          email: formData.email || user?.email || "",
          contact: formData.phone,
        },
        theme: {
          color: "#E53935",
          backdrop_color: "rgba(5, 5, 5, 0.85)",
        },
        modal: {
          ondismiss: function () {
            toast({ title: "Payment cancelled", variant: "destructive" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast({
          title: "Payment failed",
          description: response.error?.description || "Please try again",
          variant: "destructive",
        });
      });
      rzp.open();
    } catch (error) {
      toast({ title: "Failed to initiate payment", variant: "destructive" });
    }
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
              <Button>
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
              <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
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
                  <Button>
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
              <Button>Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isProcessing = createRazorpayOrder.isPending || verifyPayment.isPending;

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
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-[#0a0a0a] border-zinc-800/30 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>

                  <form onSubmit={handlePayment} className="space-y-6">
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
                          data-testid="input-email"
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
                          data-testid="input-phone"
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
                        data-testid="input-address"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md">
                      <Truck className="w-5 h-5 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Express Air Shipping</p>
                        <p className="text-xs text-zinc-500">Delivery within 5-7 business days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-white">Pay with Razorpay</p>
                        <p className="text-xs text-zinc-500">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary"
                      size="lg"
                      disabled={isProcessing}
                      data-testid="button-pay-now"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Pay Now - {"\u20B9"}{total.toLocaleString("en-IN")}
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                      <Shield className="w-4 h-4" />
                      <span>Secured by Razorpay. 100% safe and encrypted payments.</span>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-[#0a0a0a] border-zinc-800/30 p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-zinc-900 rounded-md overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              data-testid={`img-cart-item-${item.id}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-zinc-800" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white line-clamp-2">{item.product?.name}</p>
                          {item.variantName && (
                            <p className="text-xs text-zinc-500">{item.variantName}</p>
                          )}
                          <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-white">
                          {"\u20B9"}{((item.variantPrice || item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-4 space-y-3">
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Subtotal</span>
                      <span>{"\u20B9"}{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-emerald-400" : ""}>
                        {shipping === 0 ? "FREE" : `\u20B9${shipping.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-800">
                      <span>Total</span>
                      <span>{"\u20B9"}{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-500/10 rounded-md">
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
