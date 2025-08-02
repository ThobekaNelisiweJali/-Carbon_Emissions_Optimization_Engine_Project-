import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import HeroSection from "@/components/HeroSection";
import AuthPage from "@/components/AuthPage";
import Navigation from "@/components/Navigation";
import EmissionsDashboard from "@/components/EmissionsDashboard";
import RouteOptimizer from "@/components/RouteOptimizer";
import SupplierScoring from "@/components/SupplierScoring";
import EmissionCalculator from "@/components/EmissionCalculator";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import AuditReports from "@/components/AuditReports";
import APIIntegrations from "@/components/APIIntegrations";
import CarbonOffsetMarketplace from "@/components/CarbonOffsetMarketplace";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHero, setShowHero] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setShowAuth(false);
          setShowHero(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuth(false);
        setShowHero(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      case "scenarios":
        return <ScenarioSimulator />;
      case "reports":
        return <AuditReports />;
      case "integrations":
        return <APIIntegrations />;
      case "marketplace":
        return <CarbonOffsetMarketplace />;
      default:
        return <EmissionsDashboard />;
    }
  };

  if (showAuth) {
    return <AuthPage onAuthSuccess={() => setShowAuth(false)} />;
  }

  if (showHero) {
    return (
      <div className="min-h-screen">
        <HeroSection />
        <div className="container mx-auto px-6 py-16 text-center">
          <button
            onClick={() => setShowAuth(true)}
            className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Start Optimizing
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
