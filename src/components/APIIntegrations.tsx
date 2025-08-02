import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Plug, RefreshCw, Settings, Truck, Package, Navigation } from "lucide-react";

interface APIIntegration {
  id: string;
  integration_type: string;
  integration_name: string;
  api_endpoint: string;
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
}

const APIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    integrationType: "",
    integrationName: "",
    apiEndpoint: "",
    apiKey: "",
  });

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from("api_integrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch integrations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // In a real implementation, you would encrypt the API key
      const { error } = await supabase.from("api_integrations").insert({
        user_id: user.id,
        integration_type: formData.integrationType,
        integration_name: formData.integrationName,
        api_endpoint: formData.apiEndpoint,
        api_key_encrypted: btoa(formData.apiKey), // Simple base64 encoding for demo
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API integration created successfully!",
      });

      setFormData({
        integrationType: "",
        integrationName: "",
        apiEndpoint: "",
        apiKey: "",
      });
      setShowCreateForm(false);
      fetchIntegrations();
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

  const toggleIntegration = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("api_integrations")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id 
            ? { ...integration, is_active: isActive }
            : integration
        )
      );

      toast({
        title: "Success",
        description: `Integration ${isActive ? "enabled" : "disabled"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const syncIntegration = async (id: string) => {
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error } = await supabase
        .from("api_integrations")
        .update({ last_sync: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id 
            ? { ...integration, last_sync: new Date().toISOString() }
            : integration
        )
      );

      toast({
        title: "Success",
        description: "Integration synced successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "tms": return Truck;
      case "erp": return Package;
      case "gps": return Navigation;
      default: return Plug;
    }
  };

  const getIntegrationColor = (type: string) => {
    switch (type) {
      case "tms": return "bg-blue-100 text-blue-800";
      case "erp": return "bg-green-100 text-green-800";
      case "gps": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect your existing systems for seamless data flow
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Integration</CardTitle>
            <CardDescription>
              Connect your TMS, ERP, or GPS systems to CEOE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="integrationType">Integration Type</Label>
                  <Select value={formData.integrationType} onValueChange={(value) => setFormData({ ...formData, integrationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select integration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tms">Transportation Management System (TMS)</SelectItem>
                      <SelectItem value="erp">Enterprise Resource Planning (ERP)</SelectItem>
                      <SelectItem value="gps">GPS Tracking System</SelectItem>
                      <SelectItem value="wms">Warehouse Management System (WMS)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="integrationName">Integration Name</Label>
                  <Input
                    id="integrationName"
                    value={formData.integrationName}
                    onChange={(e) => setFormData({ ...formData, integrationName: e.target.value })}
                    placeholder="SAP ERP Production"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input
                    id="apiEndpoint"
                    value={formData.apiEndpoint}
                    onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                    placeholder="https://api.yoursystem.com/v1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Your API key"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Integration"}
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
        {integrations.map((integration) => {
          const IconComponent = getIntegrationIcon(integration.integration_type);
          
          return (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {integration.integration_name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getIntegrationColor(integration.integration_type)}>
                      {integration.integration_type.toUpperCase()}
                    </Badge>
                    <Badge variant={integration.is_active ? "default" : "secondary"}>
                      {integration.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span>{integration.api_endpoint}</span>
                  {integration.last_sync && (
                    <span className="text-sm">
                      Last sync: {new Date(integration.last_sync).toLocaleString()}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={integration.is_active}
                        onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                      />
                      <span className="text-sm">
                        {integration.is_active ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncIntegration(integration.id)}
                      disabled={!integration.is_active}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {integrations.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Plug className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Integrations Configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your existing systems to unlock the full potential of CEOE
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Integration Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Templates</CardTitle>
          <CardDescription>
            Quick setup guides for popular systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">SAP TM</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connect SAP Transportation Management for shipment data
              </p>
              <Button variant="outline" size="sm">View Guide</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold">Oracle ERP</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Integrate Oracle ERP for supply chain visibility
              </p>
              <Button variant="outline" size="sm">View Guide</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-5 w-5 text-purple-500" />
                <h4 className="font-semibold">Geotab GPS</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time vehicle tracking and route optimization
              </p>
              <Button variant="outline" size="sm">View Guide</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIIntegrations;