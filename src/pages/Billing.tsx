
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/chakra/Tabs";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { toast } from "@/hooks/use-toast";
import ProjectManagement from "@/features/billing/components/ProjectManagement";
import PaymentTracking from "@/features/billing/components/PaymentTracking";
import InvoiceGeneration from "@/features/billing/components/InvoiceGeneration";
import AddProjectForm from "@/features/billing/components/AddProjectForm";

const Billing = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddProjectSuccess = () => {
    setIsProjectDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Project added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing Management</h1>
          <p className="text-muted-foreground">
            Manage projects, track payments, and generate invoices
          </p>
        </div>
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Project Management</TabsTrigger>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Manage all construction projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectManagement refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
              <CardDescription>Track payments for all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTracking refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Generation</CardTitle>
              <CardDescription>Generate invoices for projects</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceGeneration refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <AddProjectForm onSuccess={handleAddProjectSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
