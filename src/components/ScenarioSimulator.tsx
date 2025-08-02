import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Route, Truck, Building2, TrendingDown, TrendingUp, Clock, DollarSign } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  carbon_impact: number;
  cost_impact: number;
  time_impact: number;
  created_at: string;
}

const ScenarioSimulator = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    routeType: "",
    freightType: "",
    supplierScore: "",
    distance: "",
    weight: "",
  });

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScenarios(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch scenarios",
        variant: "destructive",
      });
    }
  };

  const calculateImpacts = () => {
    const distance = parseFloat(formData.distance) || 0;
    const weight = parseFloat(formData.weight) || 0;
    
    // Base calculations (simplified for demo)
    let carbonBase = distance * weight * 0.1;
    let costBase = distance * 0.5 + weight * 0.2;
    let timeBase = distance * 0.02;

    // Route type modifiers
    const routeModifiers: Record<string, { carbon: number; cost: number; time: number }> = {
      "direct": { carbon: 1.0, cost: 1.2, time: 1.0 },
      "optimized": { carbon: 0.7, cost: 0.9, time: 0.85 },
      "eco-friendly": { carbon: 0.6, cost: 1.1, time: 1.1 },
      "express": { carbon: 1.3, cost: 1.5, time: 0.7 },
    };

    // Freight type modifiers
    const freightModifiers: Record<string, { carbon: number; cost: number; time: number }> = {
      "truck": { carbon: 1.0, cost: 1.0, time: 1.0 },
      "rail": { carbon: 0.4, cost: 0.8, time: 1.5 },
      "ship": { carbon: 0.3, cost: 0.6, time: 3.0 },
      "air": { carbon: 2.5, cost: 3.0, time: 0.3 },
    };

    // Supplier score modifiers
    const supplierModifiers: Record<string, { carbon: number; cost: number; time: number }> = {
      "excellent": { carbon: 0.8, cost: 1.1, time: 0.9 },
      "good": { carbon: 0.9, cost: 1.0, time: 1.0 },
      "average": { carbon: 1.0, cost: 1.0, time: 1.1 },
      "poor": { carbon: 1.2, cost: 0.9, time: 1.3 },
    };

    const routeMod = routeModifiers[formData.routeType] || { carbon: 1, cost: 1, time: 1 };
    const freightMod = freightModifiers[formData.freightType] || { carbon: 1, cost: 1, time: 1 };
    const supplierMod = supplierModifiers[formData.supplierScore] || { carbon: 1, cost: 1, time: 1 };

    return {
      carbon: carbonBase * routeMod.carbon * freightMod.carbon * supplierMod.carbon,
      cost: costBase * routeMod.cost * freightMod.cost * supplierMod.cost,
      time: timeBase * routeMod.time * freightMod.time * supplierMod.time,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const impacts = calculateImpacts();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("scenarios").insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        route_data: {
          type: formData.routeType,
          distance: formData.distance,
        },
        freight_data: {
          type: formData.freightType,
          weight: formData.weight,
        },
        supplier_data: {
          score: formData.supplierScore,
        },
        carbon_impact: impacts.carbon,
        cost_impact: impacts.cost,
        time_impact: impacts.time,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario created successfully!",
      });

      setFormData({
        name: "",
        description: "",
        routeType: "",
        freightType: "",
        supplierScore: "",
        distance: "",
        weight: "",
      });
      setShowCreateForm(false);
      fetchScenarios();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: number, type: 'carbon' | 'cost' | 'time') => {
    if (type === 'carbon') {
      return impact < 50 ? "text-success" : impact < 100 ? "text-warning" : "text-destructive";
    }
    return impact < 100 ? "text-success" : impact < 200 ? "text-warning" : "text-destructive";
  };

  const getImpactIcon = (impact: number, type: 'carbon' | 'cost' | 'time') => {
    const isGood = type === 'carbon' ? impact < 50 : impact < 100;
    return isGood ? TrendingDown : TrendingUp;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scenario Simulator</h1>
          <p className="text-muted-foreground mt-2">
            Analyze the carbon impact of different logistics decisions
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Scenario
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Scenario</CardTitle>
            <CardDescription>
              Define parameters to analyze carbon impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Scenario Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routeType">Route Type</Label>
                  <Select value={formData.routeType} onValueChange={(value) => setFormData({ ...formData, routeType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct Route</SelectItem>
                      <SelectItem value="optimized">AI-Optimized Route</SelectItem>
                      <SelectItem value="eco-friendly">Eco-Friendly Route</SelectItem>
                      <SelectItem value="express">Express Route</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freightType">Freight Type</Label>
                  <Select value={formData.freightType} onValueChange={(value) => setFormData({ ...formData, freightType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select freight type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                      <SelectItem value="ship">Ship</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierScore">Supplier Score</Label>
                  <Select value={formData.supplierScore} onValueChange={(value) => setFormData({ ...formData, supplierScore: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (90-100)</SelectItem>
                      <SelectItem value="good">Good (70-89)</SelectItem>
                      <SelectItem value="average">Average (50-69)</SelectItem>
                      <SelectItem value="poor">Poor (0-49)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (tons)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Scenario"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {scenarios.map((scenario) => {
          const CarbonIcon = getImpactIcon(scenario.carbon_impact, 'carbon');
          const CostIcon = getImpactIcon(scenario.cost_impact, 'cost');
          const TimeIcon = getImpactIcon(scenario.time_impact, 'time');

          return (
            <Card key={scenario.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    {scenario.name}
                  </CardTitle>
                  <Badge variant="outline">
                    {new Date(scenario.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                {scenario.description && (
                  <CardDescription>{scenario.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <CarbonIcon className={`h-8 w-8 ${getImpactColor(scenario.carbon_impact, 'carbon')}`} />
                    <div>
                      <p className="text-sm text-muted-foreground">Carbon Impact</p>
                      <p className={`text-2xl font-bold ${getImpactColor(scenario.carbon_impact, 'carbon')}`}>
                        {scenario.carbon_impact.toFixed(1)} kg CO₂
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <DollarSign className={`h-8 w-8 ${getImpactColor(scenario.cost_impact, 'cost')}`} />
                    <div>
                      <p className="text-sm text-muted-foreground">Cost Impact</p>
                      <p className={`text-2xl font-bold ${getImpactColor(scenario.cost_impact, 'cost')}`}>
                        ${scenario.cost_impact.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <Clock className={`h-8 w-8 ${getImpactColor(scenario.time_impact, 'time')}`} />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Impact</p>
                      <p className={`text-2xl font-bold ${getImpactColor(scenario.time_impact, 'time')}`}>
                        {scenario.time_impact.toFixed(1)} hrs
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {scenarios.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Route className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Scenarios Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first scenario to start analyzing carbon impacts
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScenarioSimulator;