import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/chakra/Select";
import { Search, Filter, Plus, Eye, Edit, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const generateMaterialShipments = () => {
  return [
    {
      id: "S001",
      shipmentNumber: "SH-2023-001",
      material: "Cement",
      quantity: 50,
      unit: "bags",
      source: "Factory A",
      destination: "Site B",
      status: "in-transit",
      expectedDelivery: "2023-03-15",
      actualDelivery: "2023-03-16",
      vehicleNumber: "KA-01-AB-1234",
      driverName: "John Doe",
    },
    {
      id: "S002",
      shipmentNumber: "SH-2023-002",
      material: "Steel",
      quantity: 20,
      unit: "tons",
      source: "Factory C",
      destination: "Site D",
      status: "delivered",
      expectedDelivery: "2023-03-20",
      actualDelivery: "2023-03-19",
      vehicleNumber: "KA-02-CD-5678",
      driverName: "Jane Smith",
    },
    {
      id: "S003",
      shipmentNumber: "SH-2023-003",
      material: "Bricks",
      quantity: 10000,
      unit: "pieces",
      source: "Factory E",
      destination: "Site F",
      status: "pending",
      expectedDelivery: "2023-03-25",
      actualDelivery: null,
      vehicleNumber: null,
      driverName: null,
    },
    {
      id: "S004",
      shipmentNumber: "SH-2023-004",
      material: "Sand",
      quantity: 30,
      unit: "cubic meters",
      source: "Quarry G",
      destination: "Site H",
      status: "cancelled",
      expectedDelivery: "2023-03-30",
      actualDelivery: null,
      vehicleNumber: null,
      driverName: null,
    },
    {
      id: "S005",
      shipmentNumber: "SH-2023-005",
      material: "Gravel",
      quantity: 40,
      unit: "cubic meters",
      source: "Quarry I",
      destination: "Site J",
      status: "in-transit",
      expectedDelivery: "2023-04-05",
      actualDelivery: null,
      vehicleNumber: "KA-03-EF-9012",
      driverName: "Robert Jones",
    },
  ];
};

const MaterialLogistics = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const allShipments = generateMaterialShipments();
    setShipments(allShipments);
    filterShipments(allShipments);
  }, [searchQuery, statusFilter]);

  const filterShipments = (shipments: any[]) => {
    let result = [...shipments];
    
    if (statusFilter !== "all") {
      result = result.filter(shipment => shipment.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(shipment => 
        shipment.shipmentNumber.toLowerCase().includes(query) ||
        shipment.material.toLowerCase().includes(query) ||
        shipment.source.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query)
      );
    }
    
    setFilteredShipments(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      case "in-transit":
        return <Badge colorScheme="blue">In Transit</Badge>;
      case "delivered":
        return <Badge colorScheme="green">Delivered</Badge>;
      case "cancelled":
        return <Badge colorScheme="red">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddShipment = () => {
    toast.info("Add shipment functionality will be implemented here");
  };

  const handleViewShipment = (shipmentId: string) => {
    toast.info(`Viewing shipment ${shipmentId}`);
  };

  const handleEditShipment = (shipmentId: string) => {
    toast.info(`Editing shipment ${shipmentId}`);
  };

  const handleTrackShipment = (shipmentId: string) => {
    toast.info(`Tracking shipment ${shipmentId}`);
  };

  return (
    <Box gap={6}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={4}
        mb={4}
      >
        <Box position="relative" flex={1}>
          <Search style={{ position: 'absolute', left: '8px', top: '10px', width: '16px', height: '16px', color: '#A0AEC0' }} />
          <Input
            placeholder="Search by shipment number, material, source, or destination..."
            paddingLeft="32px"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger w="200px">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
          
        </Select>
        <Button variant="outline">
          <Filter style={{ marginRight: '8px', width: '16px', height: '16px' }} />
          More Filters
        </Button>
      </Flex>
      
      <Box borderWidth={1} borderRadius="md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment Number</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Actual Delivery</TableHead>
              <TableHead textAlign="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell fontWeight="medium">{shipment.shipmentNumber}</TableCell>
                <TableCell>{shipment.material}</TableCell>
                <TableCell>{shipment.quantity} {shipment.unit}</TableCell>
                <TableCell>{shipment.source}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                <TableCell>{shipment.expectedDelivery}</TableCell>
                <TableCell>{shipment.actualDelivery || "N/A"}</TableCell>
                <TableCell textAlign="right">
                  <Flex gap={1} justify="flex-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewShipment(shipment.id)}
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditShipment(shipment.id)}
                    >
                      <Edit style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTrackShipment(shipment.id)}
                    >
                      <Truck style={{ width: '16px', height: '16px' }} />
                    </Button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default MaterialLogistics;
