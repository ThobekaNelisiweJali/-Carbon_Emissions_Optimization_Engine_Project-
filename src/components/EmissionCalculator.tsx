import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Truck, 
  Plane, 
  Ship, 
  MapPin,
  Leaf,
  TrendingDown,
  BarChart3
} from "lucide-react";

const EmissionCalculator = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    distance: "",
    weight: "",
    transportMode: "",
    fuelType: ""
  });

  const [result, setResult] = useState<{
    emissions: number;
    optimizedEmissions: number;
    savings: number;
  } | null>(null);

  const transportModes = [
    { value: "truck", label: "Truck", icon: Truck, factor: 0.234 },
    { value: "plane", label: "Air Freight", icon: Plane, factor: 0.602 },
    { value: "ship", label: "Sea Freight", icon: Ship, factor: 0.015 },
    { value: "rail", label: "Rail", icon: Truck, factor: 0.041 }
  ];

  const fuelTypes = [
    { value: "diesel", label: "Diesel", factor: 1.0 },
    { value: "electric", label: "Electric", factor: 0.3 },
    { value: "hybrid", label: "Hybrid", factor: 0.7 },
    { value: "hydrogen", label: "Hydrogen", factor: 0.2 }
  ];

  const calculateEmissions = () => {
    const distance = parseFloat(formData.distance);
    const weight = parseFloat(formData.weight);
    
    if (!distance || !weight || !formData.transportMode || !formData.fuelType) {
      return;
    }

    const transportMode = transportModes.find(mode => mode.value === formData.transportMode);
    const fuelType = fuelTypes.find(fuel => fuel.value === formData.fuelType);
    
    if (!transportMode || !fuelType) return;

    // Calculate base emissions (kg CO₂)
    const baseEmissions = distance * weight * transportMode.factor * fuelType.factor;
    
    // Calculate optimized emissions (assuming 25-40% reduction)
    const optimizationFactor = 0.65; // 35% reduction
    const optimizedEmissions = baseEmissions * optimizationFactor;
    
    const savings = ((baseEmissions - optimizedEmissions) / baseEmissions) * 100;

    setResult({
      emissions: baseEmissions,
      optimizedEmissions: optimizedEmissions,
      savings: savings
    });
  };

  const resetCalculator = () => {
    setFormData({
      origin: "",
      destination: "",
      distance: "",
      weight: "",
      transportMode: "",
      fuelType: ""
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Emission Calculator</h2>
        <Button variant="carbon" onClick={resetCalculator}>
          <Calculator className="w-4 h-4 mr-2" />
          Reset Calculator
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Calculate Shipment Emissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="origin"
                    placeholder="e.g., Los Angeles"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="e.g., New York"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="2500"
                  value={formData.distance}
                  onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (tons)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="25"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transport Mode</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, transportMode: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div className="flex items-center gap-2">
                          <mode.icon className="h-4 w-4" />
                          {mode.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={calculateEmissions} 
              variant="hero" 
              className="w-full"
              disabled={!formData.distance || !formData.weight || !formData.transportMode || !formData.fuelType}
            >
              Calculate Emissions
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-success" />
              Emission Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="text-2xl font-bold text-destructive">
                        {result.emissions.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">kg CO₂ (Current)</div>
                    </div>
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success">
                        {result.optimizedEmissions.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">kg CO₂ (Optimized)</div>
                    </div>
                  </div>

                  <Card className="bg-gradient-earth border-0">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingDown className="h-6 w-6 text-white" />
                        <span className="text-2xl font-bold text-white">
                          {result.savings.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-white/80 text-sm">Potential Emission Reduction</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Optimization Recommendations:</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start p-3">
                      🚛 Use electric or hybrid vehicles when available
                    </Badge>
                    <Badge variant="outline" className="w-full justify-start p-3">
                      📍 Optimize route planning to reduce distance
                    </Badge>
                    <Badge variant="outline" className="w-full justify-start p-3">
                      📦 Consolidate shipments to maximize load efficiency
                    </Badge>
                    <Badge variant="outline" className="w-full justify-start p-3">
                      🌱 Consider alternative transport modes
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter shipment details to calculate emissions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmissionCalculator;