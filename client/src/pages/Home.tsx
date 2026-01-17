import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ScienceOfLight } from "@/components/ScienceOfLight";
import { StageSelector } from "@/components/StageSelector";
import { VehicleFit } from "@/components/VehicleFit";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SocialProof } from "@/components/SocialProof";
import { TrustBar } from "@/components/TrustBar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <Header />
      <main>
        <HeroSection />
        <ScienceOfLight />
        <StageSelector />
        <VehicleFit />
        <ReviewsSection />
        <SocialProof />
        <TrustBar />
      </main>
      <Footer />
    </div>
  );
}
