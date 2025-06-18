
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { Plus, FileText, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { toast } from "@/hooks/use-toast";
import POManagement from "@/features/purchase/components/POManagement";
import InvoiceManagement from "@/features/purchase/components/InvoiceManagement";
import AddPOForm from "@/features/purchase/components/AddPOForm";
import AddInvoiceForm from "@/features/purchase/components/AddInvoiceForm";

const PurchaseBilling = () => {
  const [activeTab, setActiveTab] = useState("po");
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [poFilterTab, setPOFilterTab] = useState("all");
  const [invoiceFilterTab, setInvoiceFilterTab] = useState("all");

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
        <TabList className="grid w-full grid-cols-2">
          <Tab value="po" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Purchase Orders
          </Tab>
          <Tab value="invoice" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoice Management
          </Tab>
        </TabList>
        
        <TabPanel value="po" className="space-y-4">
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
            <CardContent className="space-y-4">
              <Tabs value={poFilterTab} onValueChange={setPOFilterTab} className="w-full">
                <TabList className="grid w-full grid-cols-6">
                  <Tab value="all">All</Tab>
                  <Tab value="project">As per Project</Tab>
                  <Tab value="department">Department</Tab>
                  <Tab value="requested-by">Requested By</Tab>
                  <Tab value="paid">Paid</Tab>
                  <Tab value="pending">Pending</Tab>
                </TabList>
                <div className="mt-4">
                  <POManagement filterType={poFilterTab} />
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabPanel>
        
        <TabPanel value="invoice" className="space-y-4">
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
            <CardContent className="space-y-4">
              <Tabs value={invoiceFilterTab} onValueChange={setInvoiceFilterTab} className="w-full">
                <TabList className="grid w-full grid-cols-6">
                  <Tab value="all">All</Tab>
                  <Tab value="project">As per Project</Tab>
                  <Tab value="department">Department</Tab>
                  <Tab value="requested-by">Requested By</Tab>
                  <Tab value="paid">Paid</Tab>
                  <Tab value="pending">Pending</Tab>
                </TabList>
                <div className="mt-4">
                  <InvoiceManagement filterType={invoiceFilterTab} />
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabPanel>
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
