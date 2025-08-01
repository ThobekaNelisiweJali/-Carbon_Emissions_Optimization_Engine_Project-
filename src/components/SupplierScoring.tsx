import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Star, 
  Leaf, 
  TrendingUp, 
  Award,
  MapPin,
  Truck,
  Shield
} from "lucide-react";

const SupplierScoring = () => {
  const suppliers = [
    {
      id: 1,
      name: "GreenLogistics Corp",
      carbonScore: 95,
      reliabilityScore: 92,
      costEfficiency: 88,
      location: "Portland, OR",
      certifications: ["ISO 14001", "SmartWay"],
      emissionRate: "2.1 kg CO₂/km",
      status: "verified"
    },
    {
      id: 2,
      name: "EcoTransport Solutions",
      carbonScore: 89,
      reliabilityScore: 94,
      costEfficiency: 85,
      location: "Denver, CO",
      certifications: ["EPA SmartWay", "Carbon Neutral"],
      emissionRate: "2.4 kg CO₂/km",
      status: "verified"
    },
    {
      id: 3,
      name: "SustainableFreight Ltd",
      carbonScore: 91,
      reliabilityScore: 87,
      costEfficiency: 90,
      location: "Austin, TX",
      certifications: ["Green Fleet"],
      emissionRate: "2.2 kg CO₂/km",
      status: "pending"
    },
    {
      id: 4,
      name: "CleanHaul Logistics",
      carbonScore: 76,
      reliabilityScore: 89,
      costEfficiency: 92,
      location: "Chicago, IL",
      certifications: ["ISO 14001"],
      emissionRate: "3.1 kg CO₂/km",
      status: "verified"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Supplier Carbon Scoring</h2>
        <Button variant="earth">
          <Building className="w-4 h-4 mr-2" />
          Add New Supplier
        </Button>
      </div>

      {/* Scoring Overview */}
      <Card className="shadow-elevation bg-gradient-sky border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-white mx-auto" />
              <div className="text-2xl font-bold text-white">{suppliers.filter(s => s.status === 'verified').length}</div>
              <div className="text-white/80">Verified Suppliers</div>
            </div>
            <div className="space-y-2">
              <Leaf className="h-8 w-8 text-accent mx-auto" />
              <div className="text-2xl font-bold text-white">
                {Math.round(suppliers.reduce((acc, s) => acc + s.carbonScore, 0) / suppliers.length)}
              </div>
              <div className="text-white/80">Avg Carbon Score</div>
            </div>
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-primary-glow mx-auto" />
              <div className="text-2xl font-bold text-white">
                {Math.round(suppliers.reduce((acc, s) => acc + s.reliabilityScore, 0) / suppliers.length)}
              </div>
              <div className="text-white/80">Avg Reliability</div>
            </div>
            <div className="space-y-2">
              <Award className="h-8 w-8 text-warning mx-auto" />
              <div className="text-2xl font-bold text-white">
                {suppliers.reduce((acc, s) => acc + s.certifications.length, 0)}
              </div>
              <div className="text-white/80">Total Certifications</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier List */}
      <div className="grid grid-cols-1 gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="shadow-card hover:shadow-elevation transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{supplier.name}</h3>
                    </div>
                    <Badge variant={supplier.status === 'verified' ? 'default' : 'secondary'}>
                      {supplier.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {supplier.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      {supplier.emissionRate}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 lg:min-w-[300px]">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-1">
                      <div className="text-xs text-muted-foreground">Carbon Score</div>
                      <div className={`text-lg font-bold ${getScoreColor(supplier.carbonScore)}`}>
                        {supplier.carbonScore}
                      </div>
                      <Progress value={supplier.carbonScore} className="h-2" />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-xs text-muted-foreground">Reliability</div>
                      <div className={`text-lg font-bold ${getScoreColor(supplier.reliabilityScore)}`}>
                        {supplier.reliabilityScore}
                      </div>
                      <Progress value={supplier.reliabilityScore} className="h-2" />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-xs text-muted-foreground">Cost Efficiency</div>
                      <div className={`text-lg font-bold ${getScoreColor(supplier.costEfficiency)}`}>
                        {supplier.costEfficiency}
                      </div>
                      <Progress value={supplier.costEfficiency} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant={getScoreBadge(supplier.carbonScore)} size="sm" className="flex-1">
                      Select Supplier
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scoring Criteria */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-warning" />
            Scoring Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-success">Carbon Score (40%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Emission rates per km</li>
                <li>• Fleet efficiency</li>
                <li>• Alternative fuel usage</li>
                <li>• Carbon offset programs</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Reliability Score (35%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• On-time delivery rate</li>
                <li>• Service availability</li>
                <li>• Customer satisfaction</li>
                <li>• Track record</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-warning">Cost Efficiency (25%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Competitive pricing</li>
                <li>• Hidden fees</li>
                <li>• Value-added services</li>
                <li>• Payment terms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierScoring;