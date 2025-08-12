import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Leaf, MapPin, ShoppingCart } from "lucide-react";

interface CarbonOffset {
  id: string;
  provider_name: string;
  offset_type: string;
  price_per_ton: number;
  available_tons: number;
  certification: string;
  project_description: string;
  is_available: boolean;
}

interface OffsetCardProps {
  offset: CarbonOffset;
  onPurchase: (offset: CarbonOffset) => void;
}

const getCertificationColor = (certification: string) => {
  switch (certification) {
    case "Gold Standard": return "bg-yellow-100 text-yellow-800";
    case "Verra VCS": return "bg-green-100 text-green-800";
    case "CDM": return "bg-blue-100 text-blue-800";
    case "Plan Vivo": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getOffsetTypeIcon = (type: string) => {
  switch (type) {
    case "Forestry": return "🌲";
    case "Renewable Energy": return "⚡";
    case "Waste Management": return "♻️";
    case "Blue Carbon": return "🌊";
    case "Direct Air Capture": return "🏭";
    default: return "🌱";
  }
};

const OffsetCard = ({ offset, onPurchase }: OffsetCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getOffsetTypeIcon(offset.offset_type)}</div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {offset.provider_name}
                <Badge className={getCertificationColor(offset.certification)}>
                  <Award className="h-3 w-3 mr-1" />
                  {offset.certification}
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Leaf className="h-4 w-4" />
                {offset.offset_type}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ${offset.price_per_ton.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">per ton CO₂</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{offset.project_description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {offset.available_tons.toLocaleString()} tons available
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Verified Project
            </div>
          </div>
          <Button onClick={() => onPurchase(offset)} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Purchase Offsets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OffsetCard;