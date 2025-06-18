
import { useState } from "react";
import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { Plus, Package, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MaterialLogistics from "@/features/transportation/components/MaterialLogistics";
import VehicleTransportation from "@/features/transportation/components/VehicleTransportation";

const Transportation = () => {
  const [activeTab, setActiveTab] = useState("0");

  const handleAddMaterialShipment = () => {
    toast({ title: "Add material shipment functionality will be implemented here" });
  };

  const handleAddVehicleRequest = () => {
    toast({ title: "Add vehicle request functionality will be implemented here" });
  };

  return (
    <Box gap={6}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        align={{ md: "center" }} 
        justify={{ md: "space-between" }} 
        gap={4}
        mb={6}
      >
        <Box>
          <Heading size="lg" mb={2}>Transportation Management</Heading>
          <Text color="gray.600">Manage material logistics and vehicle transportation</Text>
        </Box>
      </Flex>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabList>
          <Tab value="0">
            <Flex align="center" gap={2}>
              <Icon as={Package} boxSize={4} />
              Material Logistics
            </Flex>
          </Tab>
          <Tab value="1">
            <Flex align="center" gap={2}>
              <Icon as={Truck} boxSize={4} />
              Vehicle Transportation
            </Flex>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel value="0" p={0} pt={4}>
            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Box>
                    <CardTitle>Material Logistics</CardTitle>
                    <CardDescription>Track and manage material shipments and deliveries</CardDescription>
                  </Box>
                  <Button onClick={handleAddMaterialShipment}>
                    <Plus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    Add Shipment
                  </Button>
                </Flex>
              </CardHeader>
              <CardContent>
                <MaterialLogistics />
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel value="1" p={0} pt={4}>
            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Box>
                    <CardTitle>Vehicle Transportation</CardTitle>
                    <CardDescription>Manage vehicle requests and assignments</CardDescription>
                  </Box>
                  <Button onClick={handleAddVehicleRequest}>
                    <Plus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    Add Vehicle Request
                  </Button>
                </Flex>
              </CardHeader>
              <CardContent>
                <VehicleTransportation />
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Transportation;
