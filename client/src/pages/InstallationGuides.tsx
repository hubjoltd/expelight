import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, AlertTriangle, CheckCircle2, Clock, Settings, Shield } from "lucide-react";

const installationSteps = [
  {
    step: 1,
    title: "Preparation",
    description: "Before starting, ensure your vehicle is parked on a level surface with the engine off. Disconnect the negative battery terminal to prevent any electrical issues during installation.",
    tips: ["Allow lights to cool if recently used", "Have all tools ready before starting", "Read all instructions completely first"]
  },
  {
    step: 2,
    title: "Remove Factory Lights",
    description: "Carefully remove your factory lights or access the mounting location. For fog light replacements, this typically involves removing a few screws or clips. For light bars, identify your mounting location.",
    tips: ["Take photos before removal for reference", "Keep all factory hardware in a safe place", "Note wire routing for reinstallation"]
  },
  {
    step: 3,
    title: "Mount New Lights",
    description: "Using the provided mounting brackets and hardware, secure your new LED lights in position. Ensure proper alignment and tighten all bolts securely but don't over-torque.",
    tips: ["Hand-tighten first, then final torque", "Check alignment before final tightening", "Use thread locker on vibration-prone mounts"]
  },
  {
    step: 4,
    title: "Wire Connection",
    description: "Connect the wiring harness following the included diagram. Most Expelight products are plug-and-play with OEM connectors. Route wires away from heat sources and moving parts.",
    tips: ["Use zip ties for secure wire routing", "Avoid sharp edges that could damage wires", "Test connections before final assembly"]
  },
  {
    step: 5,
    title: "Test & Adjust",
    description: "Reconnect the battery and test all light functions. Adjust aim if necessary to ensure proper beam pattern. SAE/DOT compliant products should be aimed according to legal requirements.",
    tips: ["Test all modes (high, low, flash if applicable)", "Verify proper cutoff line for street-legal lights", "Check for any warning lights on dashboard"]
  }
];

const safetyWarnings = [
  "Always disconnect the battery before any electrical work",
  "Do not look directly at LED lights when illuminated - they are extremely bright",
  "Allow sufficient cooling time before handling recently used lights",
  "Ensure all connections are weatherproof and properly sealed",
  "Follow local laws regarding auxiliary lighting use on public roads",
  "Professional installation recommended for complex wiring"
];

export default function InstallationGuides() {
  return (
    <div className="min-h-screen bg-background" data-testid="installation-guides-page">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Installation <span className="text-primary">Guidelines</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Step-by-step guides to help you install your Expelight products safely and correctly.
            </p>
          </div>

          {/* Safety Warnings */}
          <Card className="mb-12 border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-500">
                <AlertTriangle className="w-6 h-6" />
                Important Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {safetyWarnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Installation Steps */}
          <div className="space-y-8 mb-16">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Wrench className="w-6 h-6 text-primary" />
              General Installation Steps
            </h2>
            
            {installationSteps.map((item) => (
              <Card key={item.step} className="border-border/30">
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <div className="bg-muted/20 rounded-md p-4 border border-border/20">
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Pro Tips:
                        </p>
                        <ul className="space-y-1">
                          {item.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground pl-6">
                              - {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Average Installation Time</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>LED Pods (pair): 30-45 minutes</li>
                  <li>Light Bars (6-12"): 45-60 minutes</li>
                  <li>Light Bars (18"+): 60-90 minutes</li>
                  <li>Complete Fog Light Kit: 30-45 minutes</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Tools Required</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Basic socket and wrench set</li>
                  <li>Phillips and flathead screwdrivers</li>
                  <li>Wire strippers (for custom wiring)</li>
                  <li>Electrical tape and zip ties</li>
                  <li>Multimeter (optional but recommended)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-6 bg-muted/10 rounded-lg border border-border/30 text-center">
            <p className="text-muted-foreground mb-4">
              Need help with your installation? Our support team is here to help.
            </p>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
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
