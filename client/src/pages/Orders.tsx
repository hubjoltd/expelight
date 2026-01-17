import { motion } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Loader2, ArrowLeft, CheckCircle, Truck, Clock } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  phone: string;
  email: string;
  createdAt: string;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-400", label: "Processing" },
  confirmed: { icon: CheckCircle, color: "text-blue-400", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-purple-400", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-emerald-400", label: "Delivered" },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Orders() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505]" data-testid="orders-page-unauthorized">
        <Header />
        <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
          <Card className="bg-[#0a0a0a] border-zinc-800/30 p-12 text-center max-w-md">
            <Package className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign in to View Orders</h2>
            <p className="text-zinc-500 mb-8">
              Please sign in to view your order history.
            </p>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90" data-testid="button-login">
                Sign In
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="orders-page">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">My Orders</h1>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <Card className="bg-[#0a0a0a] border-zinc-800/30 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">No Orders Yet</h2>
                <p className="text-zinc-500 mb-8">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90" data-testid="button-shop">
                    Browse Products
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => {
                  const items: OrderItem[] = JSON.parse(order.items);
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-[#0a0a0a] border-zinc-800/30 overflow-hidden" data-testid={`order-card-${order.id}`}>
                        <div className="p-6 border-b border-zinc-800/50">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">Order ID</p>
                              <p className="text-white font-mono text-sm">{order.id.slice(0, 8)}...</p>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">Date</p>
                              <p className="text-white text-sm">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">Total</p>
                              <p className="text-white font-bold">{formatPrice(order.totalAmount)}</p>
                            </div>
                            <div className={`flex items-center gap-2 ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{status.label}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-xs text-zinc-500 mb-3">Items</p>
                          <div className="space-y-3">
                            {items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                                    {item.quantity}x
                                  </div>
                                  <span className="text-white">{item.name}</span>
                                </div>
                                <span className="text-zinc-400">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 bg-zinc-900/30 border-t border-zinc-800/50">
                          <p className="text-xs text-zinc-500 mb-2">Shipping to</p>
                          <p className="text-zinc-300 text-sm">{order.shippingAddress}</p>
                          <p className="text-zinc-400 text-xs mt-1">{order.phone}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
