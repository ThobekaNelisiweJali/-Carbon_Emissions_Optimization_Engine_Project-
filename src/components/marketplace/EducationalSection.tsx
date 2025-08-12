import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EducationalSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Carbon Offsets</CardTitle>
        <CardDescription>
          Understanding high-quality carbon offset projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Quality Standards</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Additionality:</strong> Projects wouldn't happen without offset funding</li>
              <li>• <strong>Permanence:</strong> Carbon reductions are long-lasting</li>
              <li>• <strong>Verification:</strong> Third-party audited and certified</li>
              <li>• <strong>No Double Counting:</strong> Credits used only once</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Certification Bodies</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Gold Standard:</strong> Premium projects with co-benefits</li>
              <li>• <strong>Verra VCS:</strong> World's most used voluntary standard</li>
              <li>• <strong>CDM:</strong> UN-supervised clean development projects</li>
              <li>• <strong>Plan Vivo:</strong> Community-led projects in developing countries</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalSection;