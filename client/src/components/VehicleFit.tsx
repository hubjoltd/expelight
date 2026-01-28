import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Search, ArrowRight, CheckCircle2 } from "lucide-react";

const vehicleData = {
  makes: ["Mahindra", "Toyota", "Maruti Suzuki", "Force", "Isuzu", "Mercedes-Benz", "BMW", "Audi", "Land Rover", "Porsche", "Jeep"],
  models: {
    Mahindra: ["Thar (2020+)", "Scorpio-N", "Scorpio Classic", "XUV700", "Bolero"],
    Toyota: ["Hilux", "Fortuner", "Land Cruiser", "Land Cruiser Prado"],
    "Maruti Suzuki": ["Jimny", "Gypsy"],
    Force: ["Gurkha"],
    Isuzu: ["V-Cross", "MU-X"],
    "Mercedes-Benz": ["G-Class", "GLE", "GLS", "GLC", "AMG GT"],
    BMW: ["X5", "X6", "X7", "7 Series", "M Series"],
    Audi: ["Q7", "Q8", "RS Q8", "e-tron GT", "A8"],
    "Land Rover": ["Defender", "Range Rover", "Range Rover Sport", "Discovery"],
    Porsche: ["Cayenne", "Macan", "Panamera", "911"],
    Jeep: ["Wrangler", "Grand Cherokee", "Compass", "Meridian"],
  } as Record<string, string[]>,
};

export function VehicleFit() {
  const [, setLocation] = useLocation();
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (selectedMake && selectedModel) {
      setShowResults(true);
    }
  };

  const resetSearch = () => {
    setSelectedMake("");
    setSelectedModel("");
    setShowResults(false);
  };

  return (
    <section
      className="py-24 md:py-36 relative overflow-hidden"
      data-testid="vehicle-fit-section"
    >
      {/* Dark garage background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-background to-background" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 100%, rgba(229, 57, 53, 0.15) 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Fit Your <span className="text-gradient-red">Vehicle</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect lighting upgrade designed specifically for your vehicle. 100% plug-and-play installation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {!showResults ? (
            <div
              className="bg-[#0a0a0a] border border-border/30 rounded-lg p-8 md:p-10"
              data-testid="vehicle-selector"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Car className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Select Your Vehicle</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll show you compatible upgrades
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium mb-3 block text-muted-foreground uppercase tracking-wider">
                    Select Make
                  </label>
                  <Select
                    value={selectedMake}
                    onValueChange={(value) => {
                      setSelectedMake(value);
                      setSelectedModel("");
                    }}
                  >
                    <SelectTrigger className="h-12 bg-background border-border/50" data-testid="select-make">
                      <SelectValue placeholder="Choose manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleData.makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block text-muted-foreground uppercase tracking-wider">
                    Select Model
                  </label>
                  <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                    disabled={!selectedMake}
                  >
                    <SelectTrigger className="h-12 bg-background border-border/50" data-testid="select-model">
                      <SelectValue placeholder={selectedMake ? "Choose model" : "Select make first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMake &&
                        vehicleData.models[selectedMake]?.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-primary text-primary-foreground glow-red-hover text-base"
                disabled={!selectedMake || !selectedModel}
                onClick={handleSearch}
                data-testid="search-vehicle"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Compatible Upgrades
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-primary/30 rounded-lg p-8 md:p-10"
              data-testid="vehicle-results"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">
                    Perfect Match Found!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMake} {selectedModel}
                  </p>
                </div>
              </div>

              <div className="bg-background/50 rounded-md p-6 mb-8 border border-border/30">
                <p className="text-primary font-semibold text-xl mb-2">
                  We found 4 upgrades for your {selectedMake} {selectedModel}
                </p>
                <p className="text-sm text-muted-foreground">
                  All kits include vehicle-specific mounting hardware and wiring harness.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/20 rounded-md p-5 text-center border border-border/20">
                  <p className="text-3xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Plug & Play</p>
                </div>
                <div className="bg-muted/20 rounded-md p-5 text-center border border-border/20">
                  <p className="text-3xl font-bold text-foreground">30 min</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Install Time</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 border-border/50"
                  onClick={resetSearch}
                  data-testid="reset-search"
                >
                  Search Again
                </Button>
                <Button
                  className="flex-1 h-12 bg-primary text-primary-foreground glow-red"
                  data-testid="view-upgrades"
                  onClick={() => setLocation(`/products?vehicle=${encodeURIComponent(selectedMake + ' ' + selectedModel)}`)}
                >
                  View Upgrades
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
