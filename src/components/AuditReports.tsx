import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { FileText, Download, Plus, Calendar, BarChart3 } from "lucide-react";

interface AuditReport {
  id: string;
  report_name: string;
  report_type: string;
  period_start: string;
  period_end: string;
  total_emissions: number;
  total_shipments: number;
  generated_at: string;
}

const AuditReports = () => {
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportName: "",
    reportType: "",
    periodStart: "",
    periodEnd: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_reports")
        .select("*")
        .order("generated_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      });
    }
  };

  const generateMockReportData = () => {
    // Generate mock data for demonstration
    const shipments = Math.floor(Math.random() * 1000) + 100;
    const emissions = shipments * (Math.random() * 2 + 0.5); // 0.5-2.5 tons per shipment
    
    return {
      total_shipments: shipments,
      total_emissions: emissions,
      report_data: {
        summary: {
          total_shipments: shipments,
          total_emissions: emissions,
          average_emissions_per_shipment: emissions / shipments,
          carbon_intensity: emissions / shipments,
        },
        breakdown: {
          by_transport_mode: {
            truck: { shipments: Math.floor(shipments * 0.6), emissions: emissions * 0.65 },
            rail: { shipments: Math.floor(shipments * 0.2), emissions: emissions * 0.15 },
            ship: { shipments: Math.floor(shipments * 0.15), emissions: emissions * 0.12 },
            air: { shipments: Math.floor(shipments * 0.05), emissions: emissions * 0.08 },
          },
          by_distance: {
            "0-100km": { shipments: Math.floor(shipments * 0.3), emissions: emissions * 0.15 },
            "100-500km": { shipments: Math.floor(shipments * 0.4), emissions: emissions * 0.35 },
            "500-1000km": { shipments: Math.floor(shipments * 0.2), emissions: emissions * 0.3 },
            "1000km+": { shipments: Math.floor(shipments * 0.1), emissions: emissions * 0.2 },
          },
        },
        recommendations: [
          "Consider rail transport for long-distance shipments to reduce emissions",
          "Optimize route planning to reduce total distance traveled",
          "Evaluate supplier locations for shorter transport distances",
          "Investigate electric vehicle options for short-distance deliveries",
        ],
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const reportData = generateMockReportData();

      const { error } = await supabase.from("audit_reports").insert({
        user_id: user.id,
        report_name: formData.reportName,
        report_type: formData.reportType,
        period_start: formData.periodStart,
        period_end: formData.periodEnd,
        total_emissions: reportData.total_emissions,
        total_shipments: reportData.total_shipments,
        report_data: reportData.report_data,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Audit report generated successfully!",
      });

      setFormData({
        reportName: "",
        reportType: "",
        periodStart: "",
        periodEnd: "",
      });
      setShowCreateForm(false);
      fetchReports();
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

  const downloadReport = (report: AuditReport) => {
    // Generate a simple CSV for demonstration
    const csvContent = [
      ["Report Name", report.report_name],
      ["Report Type", report.report_type],
      ["Period", `${report.period_start} to ${report.period_end}`],
      ["Total Shipments", report.total_shipments.toString()],
      ["Total Emissions (tons CO₂)", report.total_emissions.toFixed(2)],
      ["Average Emissions per Shipment (kg CO₂)", (report.total_emissions * 1000 / report.total_shipments).toFixed(2)],
      [""],
      ["Generated on", new Date(report.generated_at).toLocaleString()],
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.report_name.replace(/\s+/g, "_")}_audit_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Report downloaded successfully!",
    });
  };

  const getReportTypeBadgeColor = (type: string) => {
    switch (type) {
      case "annual": return "bg-blue-100 text-blue-800";
      case "quarterly": return "bg-green-100 text-green-800";
      case "monthly": return "bg-purple-100 text-purple-800";
      case "scope3": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emission Audit Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate comprehensive carbon emission reports for compliance and disclosure
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New Audit Report</CardTitle>
            <CardDescription>
              Create detailed emission reports for sustainability disclosure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={formData.reportName}
                    onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                    placeholder="Q1 2024 Emissions Report"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={formData.reportType} onValueChange={(value) => setFormData({ ...formData, reportType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Report</SelectItem>
                      <SelectItem value="quarterly">Quarterly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="scope3">Scope 3 Report</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodStart">Period Start</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodEnd">Period End</Label>
                  <Input
                    id="periodEnd"
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating..." : "Generate Report"}
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
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {report.report_name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getReportTypeBadgeColor(report.report_type)}>
                    {report.report_type}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                </span>
                <span>Generated: {new Date(report.generated_at).toLocaleDateString()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Shipments</p>
                    <p className="text-2xl font-bold">{report.total_shipments.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-destructive font-bold">CO₂</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Emissions</p>
                    <p className="text-2xl font-bold text-destructive">
                      {report.total_emissions.toFixed(1)} tons
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <span className="text-warning font-bold">Avg</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg per Shipment</p>
                    <p className="text-2xl font-bold text-warning">
                      {(report.total_emissions * 1000 / report.total_shipments).toFixed(0)} kg
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Reports Generated</h3>
            <p className="text-muted-foreground text-center mb-4">
              Generate your first audit report for compliance and sustainability disclosure
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditReports;