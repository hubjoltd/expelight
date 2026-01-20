import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Plane, Clock, MapPin, Package, RefreshCw } from "lucide-react";

const shippingOptions = [
  {
    icon: Plane,
    title: "Express Air Shipping",
    duration: "3-5 Business Days",
    description: "Fast delivery via air freight for urgent orders. Available for all major cities.",
    price: "Calculated at checkout"
  },
  {
    icon: Truck,
    title: "Standard Shipping",
    duration: "7-10 Business Days",
    description: "Reliable ground shipping for all India deliveries. Tracking included.",
    price: "Free on orders above Rs. 10,000"
  }
];

const deliveryZones = [
  { zone: "Metro Cities", cities: "Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata", time: "3-5 days" },
  { zone: "Tier 1 Cities", cities: "Pune, Ahmedabad, Jaipur, Lucknow, Kochi, Chandigarh", time: "5-7 days" },
  { zone: "Tier 2 Cities", cities: "Most district headquarters and major towns", time: "7-10 days" },
  { zone: "Remote Areas", cities: "Hill stations, rural areas, special zones", time: "10-15 days" }
];

const faqs = [
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within India. We're working on expanding to other countries soon."
  },
  {
    question: "Can I change my shipping address after ordering?",
    answer: "Address changes can only be made before the order is shipped. Contact us immediately if you need to update your address."
  },
  {
    question: "What if my package is damaged during shipping?",
    answer: "Please document any damage with photos and contact us within 24 hours of delivery. We'll work with you to resolve the issue."
  },
  {
    question: "Do you offer COD (Cash on Delivery)?",
    answer: "COD is available for orders under Rs. 25,000 in select cities. A nominal COD fee applies."
  }
];

export default function Shipping() {
  return (
    <div className="min-h-screen bg-background" data-testid="shipping-page">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shipping & <span className="text-primary">Returns</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fast, reliable delivery across India with full tracking on every order.
            </p>
          </div>

          {/* Shipping Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {shippingOptions.map((option, index) => (
              <Card key={index} className="border-border/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <option.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                      <p className="text-primary font-medium text-sm mb-2">{option.duration}</p>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      <p className="text-sm font-medium text-foreground">{option.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Delivery Zones */}
          <Card className="mb-16 border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                Delivery Timeframes by Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 px-4 text-sm font-semibold">Zone</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Coverage</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Est. Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone, index) => (
                      <tr key={index} className="border-b border-border/20">
                        <td className="py-3 px-4 font-medium">{zone.zone}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{zone.cities}</td>
                        <td className="py-3 px-4 text-sm text-primary font-medium">{zone.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Order Processing */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Orders placed before 2 PM are processed same day. Weekend orders ship Monday.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <Package className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure Packaging</h3>
                <p className="text-sm text-muted-foreground">
                  All products are carefully packed with protective materials to ensure safe delivery.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-6 text-center">
                <RefreshCw className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">
                  Defective products covered under warranty. See our warranty policy for details.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="pb-6 border-b border-border/20 last:border-0 last:pb-0">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
