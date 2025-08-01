import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, TrendingDown, Award } from "lucide-react";
import heroImage from "@/assets/hero-sustainable-logistics.jpg";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Sustainable Logistics" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/70"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Carbon Optimization</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Carbon Emissions
              <span className="block text-transparent bg-gradient-to-r from-accent to-primary-glow bg-clip-text">
                Optimization Engine
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Reduce your supply chain's carbon footprint by up to 40% with AI-driven 
              route optimization, intelligent freight selection, and comprehensive supplier scoring.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" className="group">
              Start Optimizing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="carbon" size="xl">
              View Demo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-full mx-auto mb-4">
                <TrendingDown className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">40%</h3>
              <p className="text-white/80">Average Carbon Reduction</p>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/20 rounded-full mx-auto mb-4">
                <Award className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
              <p className="text-white/80">Companies Trust CEOE</p>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mx-auto mb-4">
                <Leaf className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">2.5M</h3>
              <p className="text-white/80">Tons CO₂ Saved</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    </div>
  );
};

export default HeroSection;