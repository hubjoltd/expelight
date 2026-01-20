import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, Phone } from "lucide-react";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="track-order-page">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-[800px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Track Your <span className="text-primary">Order</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enter your order details to see the current status of your shipment.
            </p>
          </div>

          <Card className="border-border/30 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Order Number</label>
                  <Input
                    placeholder="e.g., EXP-2025-12345"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="h-12"
                    data-testid="input-order-number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Email used for the order"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    data-testid="input-email"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary text-primary-foreground"
                  data-testid="button-track"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Track Order
                </Button>
              </form>
            </CardContent>
          </Card>

          {showResult && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Order In Transit</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order is on its way to you!
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">Jan 18, 2025 - 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="ml-5 border-l-2 border-green-500/30 h-6" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Shipped</p>
                      <p className="text-xs text-muted-foreground">Jan 19, 2025 - 2:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="ml-5 border-l-2 border-primary/30 h-6" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary">In Transit</p>
                      <p className="text-xs text-muted-foreground">Estimated delivery: Jan 22-23, 2025</p>
                    </div>
                  </div>
                  
                  <div className="ml-5 border-l-2 border-border/30 h-6" />
                  
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Out for Delivery</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  
                  <div className="ml-5 border-l-2 border-border/30 h-6" />
                  
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Delivered</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background/50 rounded-md p-4 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong className="text-foreground">Carrier:</strong> Blue Dart Express
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Tracking ID:</strong> BD123456789IN
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Can't find your order? Need help?
            </p>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Phone className="w-4 h-4" />
              Contact Support via WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
