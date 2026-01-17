import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { VehicleFit } from "@/components/VehicleFit";
import { motion } from "framer-motion";

export default function VehicleFitPage() {
  return (
    <div className="min-h-screen bg-background" data-testid="vehicle-fit-page">
      <Header />

      <main className="pt-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find Your <span className="text-gradient-amber">Perfect Fit</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select your vehicle to see all compatible lighting upgrades. Every kit includes vehicle-specific hardware for a perfect installation.
            </p>
          </motion.div>
        </div>

        <VehicleFit />
      </main>

      <TrustBar />
      <Footer />
    </div>
  );
}
