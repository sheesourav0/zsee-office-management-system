
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import POManagement from "@/features/purchase/components/POManagement";
import InvoiceManagement from "@/features/purchase/components/InvoiceManagement";
import AddPOForm from "@/features/purchase/components/AddPOForm";
import AddInvoiceForm from "@/features/purchase/components/AddInvoiceForm";

const PurchaseBilling = () => {
  const [activeTab, setActiveTab] = useState("po");
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  const handleAddPOSuccess = () => {
    setIsPODialogOpen(false);
    toast.success("PO created successfully and added to payment transfer list");
  };

  const handleAddInvoiceSuccess = () => {
    setIsInvoiceDialogOpen(false);
    toast.success("Invoice generated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Purchase & Billing Department</h1>
          <p className="text-muted-foreground">Manage Purchase Orders and Invoice Generation</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="po" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoice Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="po" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Purchase Order Management</CardTitle>
                  <CardDescription>Create and manage purchase orders for all projects</CardDescription>
                </div>
                <Button onClick={() => setIsPODialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create PO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <POManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>Generate and manage invoices for vendors</CardDescription>
                </div>
                <Button onClick={() => setIsInvoiceDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <InvoiceManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>
          <AddPOForm onSuccess={handleAddPOSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate New Invoice</DialogTitle>
          </DialogHeader>
          <AddInvoiceForm onSuccess={handleAddInvoiceSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseBilling;
