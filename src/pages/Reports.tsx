
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@/components/chakra/Tabs";
import { toast } from "@/hooks/use-toast";
import { FileText, BarChart, Download } from "lucide-react";
import ReportsPage from "@/features/reports/pages/ReportsPage";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportReport = (type: string) => {
    toast.success(`Exporting ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and view comprehensive reports</p>
        </div>
        <Button onClick={() => handleExportReport("summary")}>
          <Download className="mr-2 h-4 w-4" />
          Export Summary
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabList className="grid w-full grid-cols-3">
          <Tab value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </Tab>
          <Tab value="detailed" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Detailed Reports
          </Tab>
          <Tab value="custom" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Custom Reports
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="overview">
            <ReportsPage />
          </TabPanel>

          <TabPanel value="detailed">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Reports</CardTitle>
                <CardDescription>Comprehensive analysis of all operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Detailed reports functionality coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>Create personalized reports based on your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Custom reports functionality coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Reports;
