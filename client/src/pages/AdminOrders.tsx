import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, AlertCircle, MapPin, Phone, Mail, FileText, Download, Loader2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  pdfUrl: string | null;
  status: string;
  sentViaWhatsapp: boolean | null;
}

export default function AdminOrders() {
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  const { data: invoicesData } = useQuery<Invoice[]>({
    queryKey: ["/api/admin/invoices"],
  });

  const invoicesByOrderId = new Map(
    invoicesData?.map(inv => [inv.orderId, inv]) || []
  );

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Order status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update order", variant: "destructive" });
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await apiRequest("POST", `/api/admin/orders/${orderId}/generate-invoice`, {
        isInterstate: false,
      });
    },
    onSuccess: (data: { success: boolean; invoice: Invoice; pdfUrl?: string }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoices"] });
      toast({ title: "Invoice generated successfully" });
      if (data.pdfUrl) {
        window.open(data.pdfUrl, "_blank");
      }
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to generate invoice", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle className="w-6 h-6" />
              <span className="font-semibold">Access Denied</span>
            </div>
            <Link href="/">
              <Button variant="outline" data-testid="link-home">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "shipped": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  const parseItems = (itemsStr: string) => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Orders</h1>
            <p className="text-zinc-400">Manage customer orders and update status</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-zinc-400">Loading orders...</div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => {
              const items = parseItems(order.items);
              return (
                <Card key={order.id} className="bg-zinc-900 border-zinc-800" data-testid={`card-order-${order.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-sm text-zinc-400">{items.length} item(s)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-start gap-2 text-zinc-400">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{order.shippingAddress || "No address"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Phone className="w-4 h-4" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Mail className="w-4 h-4" />
                        <span>{order.email}</span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {items.slice(0, 3).map((item: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-zinc-300">
                              <Package className="w-3 h-3 mr-1" />
                              {item.name || `Product`} x{item.quantity || 1}
                            </Badge>
                          ))}
                          {items.length > 3 && (
                            <Badge variant="secondary">+{items.length - 3} more</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {invoicesByOrderId.has(order.id) ? (
                            <a 
                              href={invoicesByOrderId.get(order.id)?.pdfUrl || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-2"
                                data-testid={`download-invoice-${order.id}`}
                              >
                                <Download className="w-4 h-4" />
                                Invoice
                              </Button>
                            </a>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => generateInvoiceMutation.mutate(order.id)}
                              disabled={generateInvoiceMutation.isPending}
                              data-testid={`generate-invoice-${order.id}`}
                            >
                              {generateInvoiceMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              Generate Invoice
                            </Button>
                          )}
                          <span className="text-sm text-zinc-400">Status:</span>
                          <Select 
                            value={order.status}
                            onValueChange={(status) => updateMutation.mutate({ id: order.id, status })}
                          >
                            <SelectTrigger className="w-40" data-testid={`select-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {(!orders || orders.length === 0) && (
              <div className="text-center py-12 text-zinc-400">
                No orders found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
