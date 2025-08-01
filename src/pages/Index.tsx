import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import EmissionsDashboard from "@/components/EmissionsDashboard";
import RouteOptimizer from "@/components/RouteOptimizer";
import SupplierScoring from "@/components/SupplierScoring";
import EmissionCalculator from "@/components/EmissionCalculator";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHero, setShowHero] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <EmissionsDashboard />;
      case "routes":
        return <RouteOptimizer />;
      case "suppliers":
        return <SupplierScoring />;
      case "calculator":
        return <EmissionCalculator />;
      default:
        return <EmissionsDashboard />;
    }
  };

  if (showHero) {
    return (
      <div className="min-h-screen">
        <HeroSection />
        <div className="container mx-auto px-6 py-16 text-center">
          <button
            onClick={() => setShowHero(false)}
            className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Enter CEOE Platform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
