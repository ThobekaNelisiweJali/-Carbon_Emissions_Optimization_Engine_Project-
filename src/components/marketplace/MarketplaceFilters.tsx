import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface MarketplaceFiltersProps {
  filters: {
    offsetType: string;
    certification: string;
    priceRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

const MarketplaceFilters = ({ filters, onFiltersChange }: MarketplaceFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Offset Type</label>
            <Select value={filters.offsetType} onValueChange={(value) => onFiltersChange({ ...filters, offsetType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Forestry">Forestry</SelectItem>
                <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                <SelectItem value="Waste Management">Waste Management</SelectItem>
                <SelectItem value="Blue Carbon">Blue Carbon</SelectItem>
                <SelectItem value="Direct Air Capture">Direct Air Capture</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Certification</label>
            <Select value={filters.certification} onValueChange={(value) => onFiltersChange({ ...filters, certification: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All certifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Certifications</SelectItem>
                <SelectItem value="Gold Standard">Gold Standard</SelectItem>
                <SelectItem value="Verra VCS">Verra VCS</SelectItem>
                <SelectItem value="CDM">CDM</SelectItem>
                <SelectItem value="Plan Vivo">Plan Vivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range ($/ton)</label>
            <Select value={filters.priceRange} onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Prices</SelectItem>
                <SelectItem value="0-20">$0 - $20</SelectItem>
                <SelectItem value="20-50">$20 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100">$100+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceFilters;