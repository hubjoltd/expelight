import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Clock, CheckCircle2, XCircle, Phone, Mail } from "lucide-react";

const warrantyPeriods = [
  {
    title: "Limited Lifetime Warranty",
    products: ["SSC1 LED Pods", "SSC2 LED Pods", "SS3 LED Pods", "SS5 LED Pods", "Stage Series Rock Lights"],
    description: "Applies to select off-road products purchased on or after April 15, 2025."
  },
  {
    title: "8-Year Limited Warranty",
    products: ["All Stage Series Light Bars", "Elite Series Headlights", "Elite Series Fog Lights"],
    description: "Covers manufacturing defects for the full 8 years. Surface finish issues are not covered."
  },
  {
    title: "3-Year Replacement Warranty",
    products: ["LED Bulbs", "Accent Lights", "D-Switches", "Wiring Harnesses"],
    description: "Covers manufacturing defects or product failure for all other products."
  }
];

const covered = [
  "Manufacturing defects in materials",
  "Functional product failure under normal use",
  "Defects in workmanship",
  "LED failure during warranty period"
];

const notCovered = [
  "Damage from improper installation or misuse",
  "Damage from accidents, impacts, or road debris",
  "Incorrect voltage or improper wiring",
  "Normal wear and tear, cosmetic damage",
  "Products from unauthorized sellers",
  "Disassembly or unauthorized repairs"
];

const claimSteps = [
  {
    step: 1,
    title: "Contact Support",
    description: "Reach out via WhatsApp or email with your order number, product details, and clear evidence (photos/videos) of the issue."
  },
  {
    step: 2,
    title: "Request RMA",
    description: "Before sending any product, request a Return Merchandise Authorization (RMA). Products without valid RMA will not be accepted."
  },
  {
    step: 3,
    title: "Technical Review",
    description: "Our team will review your claim and may request additional diagnostic information or troubleshooting steps."
  },
  {
    step: 4,
    title: "Ship Product",
    description: "If covered, ship the defective product to our service center. Customer covers initial return shipping."
  },
  {
    step: 5,
    title: "Resolution",
    description: "Upon inspection, we will repair or replace the product and ship it back at no additional cost."
  }
];

export default function WarrantyClaims() {
  return (
    <div className="min-h-screen bg-background" data-testid="warranty-claims-page">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Warranty & <span className="text-primary">Returns Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We stand behind the quality of every Expelight product with industry-leading warranty coverage.
            </p>
          </div>

          {/* Important Notice */}
          <Card className="mb-12 border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-500">
                <AlertTriangle className="w-6 h-6" />
                No Returns / No Exchanges Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All sales are final. Due to the specialized nature of our high-performance automotive lighting products, 
                we do not accept returns or offer exchanges for products purchased due to change of mind, incorrect ordering, 
                or subjective dissatisfaction. We strongly advise thorough research before purchase.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Exception:</strong> This policy does NOT apply to defective or faulty products, 
                which are covered under warranty.
              </p>
            </CardContent>
          </Card>

          {/* Warranty Periods */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Warranty Coverage Periods
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {warrantyPeriods.map((period, index) => (
                <Card key={index} className="border-border/30">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{period.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{period.description}</p>
                    <ul className="space-y-1">
                      {period.products.map((product, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          {product}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What's Covered */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-500">
                  <CheckCircle2 className="w-6 h-6" />
                  What's Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {covered.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-500">
                  <XCircle className="w-6 h-6" />
                  What's NOT Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notCovered.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Claim Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              How to Make a Warranty Claim
            </h2>
            <div className="space-y-6">
              {claimSteps.map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6 text-center">Need to File a Claim?</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#25D366] hover:bg-[#22c55e] text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp: +91 98765 43210
                  </Button>
                </a>
                <a href="mailto:support@expelight.in">
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    support@expelight.in
                  </Button>
                </a>
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
