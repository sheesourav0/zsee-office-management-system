
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import MaterialLogistics from "@/features/transportation/components/MaterialLogistics";
import VehicleTransportation from "@/features/transportation/components/VehicleTransportation";

const Transportation = () => {
  const [activeTab, setActiveTab] = useState("material");

  const handleAddMaterialShipment = () => {
    toast.info("Add material shipment functionality will be implemented here");
  };

  const handleAddVehicleRequest = () => {
    toast.info("Add vehicle request functionality will be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transportation Management</h1>
          <p className="text-muted-foreground">Manage material logistics and vehicle transportation</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="material" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Material Logistics
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle Transportation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="material" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Material Logistics</CardTitle>
                  <CardDescription>Track and manage material shipments and deliveries</CardDescription>
                </div>
                <Button onClick={handleAddMaterialShipment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Shipment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MaterialLogistics />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vehicle Transportation</CardTitle>
                  <CardDescription>Manage vehicle requests and assignments</CardDescription>
                </div>
                <Button onClick={handleAddVehicleRequest}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <VehicleTransportation />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transportation;
