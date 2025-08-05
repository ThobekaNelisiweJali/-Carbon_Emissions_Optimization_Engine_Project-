import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Route, 
  Building, 
  Calculator, 
  Leaf,
  Menu,
  X,
  FlaskConical,
  FileText,
  Plug,
  Home
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showHomeButton?: boolean;
}

const Navigation = ({ activeTab, onTabChange, showHomeButton = true }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "routes", label: "Route Optimizer", icon: Route },
    { id: "suppliers", label: "Supplier Scoring", icon: Building },
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "scenarios", label: "Scenarios", icon: FlaskConical },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "marketplace", label: "Offsets", icon: Leaf },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CEOE</h1>
              <p className="text-xs text-muted-foreground">Carbon Emissions Optimization Engine</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {showHomeButton && activeTab !== "dashboard" && (
              <Button
                variant="outline"
                onClick={() => onTabChange("dashboard")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <Badge variant="default" className="bg-success text-success-foreground">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              AI Active
            </Badge>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-2">
              {showHomeButton && activeTab !== "dashboard" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onTabChange("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              <div className="pt-2">
                <Badge variant="default" className="bg-success text-success-foreground">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  AI Active
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;