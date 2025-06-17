
import { useState } from "react";
import { Box, Flex, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Icon } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Plus, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import MaterialLogistics from "@/features/transportation/components/MaterialLogistics";
import VehicleTransportation from "@/features/transportation/components/VehicleTransportation";

const Transportation = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleAddMaterialShipment = () => {
    toast.info("Add material shipment functionality will be implemented here");
  };

  const handleAddVehicleRequest = () => {
    toast.info("Add vehicle request functionality will be implemented here");
  };

  return (
    <Box spacing={6}>
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

      <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
        <TabList>
          <Tab>
            <Flex align="center" gap={2}>
              <Icon as={Package} boxSize={4} />
              Material Logistics
            </Flex>
          </Tab>
          <Tab>
            <Flex align="center" gap={2}>
              <Icon as={Truck} boxSize={4} />
              Vehicle Transportation
            </Flex>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0} pt={4}>
            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Box>
                    <CardTitle>Material Logistics</CardTitle>
                    <CardDescription>Track and manage material shipments and deliveries</CardDescription>
                  </Box>
                  <Button leftIcon={<Plus />} onClick={handleAddMaterialShipment}>
                    Add Shipment
                  </Button>
                </Flex>
              </CardHeader>
              <CardContent>
                <MaterialLogistics />
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel p={0} pt={4}>
            <Card>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Box>
                    <CardTitle>Vehicle Transportation</CardTitle>
                    <CardDescription>Manage vehicle requests and assignments</CardDescription>
                  </Box>
                  <Button leftIcon={<Plus />} onClick={handleAddVehicleRequest}>
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
