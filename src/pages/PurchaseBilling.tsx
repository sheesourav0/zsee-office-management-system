
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/chakra/Tabs";
import { Button } from "@/components/chakra/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Plus, FileText, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import POManagement from "@/features/purchase/components/POManagement";
import InvoiceManagement from "@/features/purchase/components/InvoiceManagement";
import AddPOForm from "@/features/purchase/components/AddPOForm";
import AddInvoiceForm from "@/features/purchase/components/AddInvoiceForm";

const PurchaseBilling = () => {
  const [activeTab, setActiveTab] = useState("purchase-orders");
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddPOSuccess = () => {
    setIsPODialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Purchase Order added successfully!");
  };

  const handleAddInvoiceSuccess = () => {
    setIsInvoiceDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Invoice added successfully!");
  };

  const getButtonText = () => {
    return activeTab === "purchase-orders" ? "Add Purchase Order" : "Add Invoice";
  };

  const handleAddClick = () => {
    if (activeTab === "purchase-orders") {
      setIsPODialogOpen(true);
    } else {
      setIsInvoiceDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase & Billing</h1>
          <p className="text-muted-foreground">Manage purchase orders and invoices</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          {getButtonText()}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase-orders" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-orders">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders Management</CardTitle>
              <CardDescription>Create and manage purchase orders for vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <POManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Track and manage vendor invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Purchase Order</DialogTitle>
          </DialogHeader>
          <AddPOForm onSuccess={handleAddPOSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Invoice</DialogTitle>
          </DialogHeader>
          <AddInvoiceForm onSuccess={handleAddInvoiceSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseBilling;
