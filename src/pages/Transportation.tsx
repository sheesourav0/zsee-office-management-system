
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@/components/chakra/Tabs";
import { Plus, Truck, Package, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { toast } from "@/hooks/use-toast";
import VehicleTransportation from "@/features/transportation/components/VehicleTransportation";
import MaterialLogistics from "@/features/transportation/components/MaterialLogistics";
import TransportationStatusTracker from "@/features/transportation/components/TransportationStatusTracker";

const Transportation = () => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTransportation = () => {
    setIsAddDialogOpen(true);
    toast.success("Add transportation functionality coming soon!");
  };

  const handleSuccess = () => {
    setIsAddDialogOpen(false);
    toast.success("Transportation record added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transportation Management</h1>
          <p className="text-muted-foreground">Manage vehicles, logistics, and transportation tracking</p>
        </div>
        <Button onClick={handleAddTransportation}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transportation
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabList className="grid w-full grid-cols-3">
          <Tab value="vehicles" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle Transportation
          </Tab>
          <Tab value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Material Logistics
          </Tab>
          <Tab value="tracking" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Status Tracking
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="vehicles">
            <VehicleTransportation />
          </TabPanel>

          <TabPanel value="materials">
            <MaterialLogistics />
          </TabPanel>

          <TabPanel value="tracking">
            <TransportationStatusTracker />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Transportation Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Add transportation form coming soon...</p>
            <Button onClick={handleSuccess}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transportation;
