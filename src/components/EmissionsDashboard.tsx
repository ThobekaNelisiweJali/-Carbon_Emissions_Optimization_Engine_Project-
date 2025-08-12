import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  TrendingDown, 
  TrendingUp, 
  Truck, 
  Leaf, 
  Target,
  BarChart3,
  MapPin,
  Clock,
  Trash2,
  HelpCircle,
  RotateCcw
} from "lucide-react";

const EmissionsDashboard = () => {
  const carbonData = {
    totalEmissions: 2456,
    reducedEmissions: 987,
    targetReduction: 40,
    currentReduction: 28.5,
    monthlyTrend: -12.3,
    optimizedRoutes: 847,
    carbonCredits: 156
  };

  const recentOptimizations = [
    { route: "LA → NYC", savings: "15.2 tons CO₂", efficiency: 92 },
    { route: "Chicago → Miami", savings: "8.7 tons CO₂", efficiency: 88 },
    { route: "Seattle → Denver", savings: "12.1 tons CO₂", efficiency: 95 }
  ];

  const handleClearData = () => {
    toast.success("Dashboard data cleared successfully");
  };

  const handleResetTargets = () => {
    toast.success("Emission targets reset to default values");
  };

  const showHelp = () => {
    toast.info("Dashboard shows real-time emissions data, reduction targets, and recent optimizations. Use the clear data button to reset metrics.");
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Emissions Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={showHelp}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetTargets}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Targets
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearData}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carbonData.totalEmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">tons CO₂ this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emissions Saved</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{carbonData.reducedEmissions}</div>
            <p className="text-xs text-muted-foreground">tons CO₂ reduced</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimized Routes</CardTitle>
            <MapPin className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carbonData.optimizedRoutes}</div>
            <p className="text-xs text-muted-foreground">routes optimized</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Credits</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carbonData.carbonCredits}</div>
            <p className="text-xs text-muted-foreground">credits earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Emission Reduction Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress</span>
                <span className="font-semibold">{carbonData.currentReduction}%</span>
              </div>
              <Progress value={carbonData.currentReduction} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {carbonData.targetReduction}%</span>
                <span>Remaining: {carbonData.targetReduction - carbonData.currentReduction}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t">
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-sm text-success font-medium">
                {Math.abs(carbonData.monthlyTrend)}% improvement this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Recent Optimizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOptimizations.map((opt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{opt.route}</div>
                    <div className="text-sm text-success font-medium">{opt.savings}</div>
                  </div>
                  <Badge variant={opt.efficiency > 90 ? "default" : "secondary"}>
                    {opt.efficiency}% efficient
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <Card className="shadow-card bg-gradient-sky border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">AI Optimization Status</h3>
              <p className="text-white/80">Real-time carbon emission monitoring and route optimization</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmissionsDashboard;