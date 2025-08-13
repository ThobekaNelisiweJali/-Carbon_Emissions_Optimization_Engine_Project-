import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Route, 
  Navigation, 
  Zap, 
  Clock, 
  DollarSign,
  Leaf,
  MapPin,
  ArrowRight,
  Edit3,
  Trash2,
  HelpCircle
} from "lucide-react";

const RouteOptimizer = () => {
  const routeData = {
    originalRoute: {
      distance: "2,847 km",
      emissions: "187.2 tons CO₂",
      cost: "$4,250",
      duration: "3.2 days"
    },
    optimizedRoute: {
      distance: "2,691 km",
      emissions: "142.8 tons CO₂",
      cost: "$3,890",
      duration: "2.9 days"
    },
    savings: {
      emissions: 23.7,
      cost: 8.5,
      time: 9.4
    }
  };

  const routeSteps = [
    { city: "Los Angeles", status: "completed", emissions: 0 },
    { city: "Phoenix", status: "completed", emissions: 12.4 },
    { city: "Dallas", status: "current", emissions: 8.7 },
    { city: "Memphis", status: "pending", emissions: 0 },
    { city: "New York", status: "pending", emissions: 0 }
  ];

  const handleEditRoute = () => {
    toast.success("Route editing mode activated. You can now modify waypoints and settings.");
  };

  const handleDeleteRoute = () => {
    toast.success("Route has been deleted from your optimization list.");
  };

  const handleOptimizeNewRoute = () => {
    toast.success("Route optimization started! Analyzing current routes and generating optimized alternatives...");
  };

  const showHelp = () => {
    toast.info("Compare original vs AI-optimized routes. Use edit to modify route parameters or delete to remove saved routes.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Route Optimization</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={showHelp}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <Button variant="outline" size="sm" onClick={handleEditRoute}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Route
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteRoute}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Route
          </Button>
          <Button variant="carbon" onClick={handleOptimizeNewRoute}>
            <Zap className="w-4 h-4 mr-2" />
            Optimize New Route
          </Button>
        </div>
      </div>

      {/* Route Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-muted-foreground" />
              Original Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Distance</div>
                <div className="text-lg font-semibold">{routeData.originalRoute.distance}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-lg font-semibold">{routeData.originalRoute.duration}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Emissions</div>
                <div className="text-lg font-semibold text-destructive">{routeData.originalRoute.emissions}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Cost</div>
                <div className="text-lg font-semibold">{routeData.originalRoute.cost}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-success" />
              AI-Optimized Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Distance</div>
                <div className="text-lg font-semibold">{routeData.optimizedRoute.distance}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-lg font-semibold">{routeData.optimizedRoute.duration}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Emissions</div>
                <div className="text-lg font-semibold text-success">{routeData.optimizedRoute.emissions}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Cost</div>
                <div className="text-lg font-semibold">{routeData.optimizedRoute.cost}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Summary */}
      <Card className="shadow-elevation bg-gradient-earth border-0">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Optimization Savings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Leaf className="h-8 w-8 text-accent mx-auto" />
                <div className="text-2xl font-bold text-white">{routeData.savings.emissions}%</div>
                <div className="text-white/80">Emissions Reduced</div>
              </div>
              <div className="space-y-2">
                <DollarSign className="h-8 w-8 text-warning mx-auto" />
                <div className="text-2xl font-bold text-white">{routeData.savings.cost}%</div>
                <div className="text-white/80">Cost Savings</div>
              </div>
              <div className="space-y-2">
                <Clock className="h-8 w-8 text-primary-glow mx-auto" />
                <div className="text-2xl font-bold text-white">{routeData.savings.time}%</div>
                <div className="text-white/80">Time Saved</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Current Route Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={40} className="h-2" />
            <div className="space-y-3">
              {routeSteps.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      step.status === 'completed' ? 'bg-success' :
                      step.status === 'current' ? 'bg-warning animate-pulse' :
                      'bg-muted'
                    }`}></div>
                    <span className="font-medium">{step.city}</span>
                    {index < routeSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {step.emissions > 0 && (
                      <Badge variant="secondary">{step.emissions} tons CO₂</Badge>
                    )}
                    <Badge variant={
                      step.status === 'completed' ? 'default' :
                      step.status === 'current' ? 'secondary' :
                      'outline'
                    }>
                      {step.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteOptimizer;