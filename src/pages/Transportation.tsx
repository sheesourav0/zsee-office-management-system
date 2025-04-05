
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";

// Simulated data - in a real app, this would come from an API
const generateMockShipments = () => {
  return [
    {
      id: "TR001",
      projectName: "Amni WTP",
      vendorName: "Agmatic Technologies",
      materials: "Gateway module, PC and Accessories",
      paymentId: "5",
      carrier: "Blue Dart Express",
      trackingNo: "BD123456789",
      estimatedDelivery: "2023-04-15",
      status: "in-transit"
    },
    {
      id: "TR002",
      projectName: "Amni WTP",
      vendorName: "Ligths Technologies",
      materials: "Lithium Ion Battery (24VDC)",
      paymentId: "8",
      carrier: "DTDC",
      trackingNo: "DTDC987654321",
      estimatedDelivery: "2023-04-10",
      status: "in-transit"
    },
    {
      id: "TR003",
      projectName: "Sample Testing",
      vendorName: "BMP SYSTEMS",
      materials: "Control Valve for Sample Testing",
      paymentId: "2",
      carrier: "FedEx",
      trackingNo: "FX123789456",
      estimatedDelivery: "2023-03-25",
      status: "delivered"
    },
    {
      id: "TR004",
      projectName: "YACHULI",
      vendorName: "P.R.S ENTERPRISE",
      materials: "Panel Internal Instruments",
      paymentId: "3",
      carrier: "DHL",
      trackingNo: "DHL456123789",
      estimatedDelivery: "2023-03-20",
      status: "delivered"
    },
    {
      id: "TR005",
      projectName: "Piyong IoT",
      vendorName: "King Longkai",
      materials: "Maintain Marxian's amount return",
      paymentId: "1",
      carrier: "",
      trackingNo: "",
      estimatedDelivery: "",
      status: "pending"
    }
  ];
};

const Transportation = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allShipments = generateMockShipments();
    setShipments(allShipments);
    filterShipments(allShipments);
  }, [searchQuery]);

  const filterShipments = (shipments: any[]) => {
    if (!searchQuery) {
      setFilteredShipments(shipments);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = shipments.filter(shipment => 
      shipment.projectName.toLowerCase().includes(query) ||
      shipment.vendorName.toLowerCase().includes(query) ||
      shipment.materials.toLowerCase().includes(query) ||
      shipment.trackingNo.toLowerCase().includes(query)
    );
    
    setFilteredShipments(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="transport-delivered">Delivered</Badge>;
      case "in-transit":
        return <Badge className="transport-in-transit">In Transit</Badge>;
      case "pending":
        return <Badge className="transport-pending">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddShipment = () => {
    toast.info("Add shipment functionality will be implemented here");
  };
  
  const handleTrackShipment = (trackingNo: string) => {
    if (!trackingNo) {
      toast.error("No tracking number available");
      return;
    }
    toast.info(`Tracking information for ${trackingNo} will be shown here`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Transportation</h1>
        <Button onClick={handleAddShipment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Tracking</CardTitle>
          <CardDescription>Monitor all material shipments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by project, vendor, materials or tracking number..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Materials</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking No</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.projectName}</TableCell>
                    <TableCell>{shipment.vendorName}</TableCell>
                    <TableCell>{shipment.materials}</TableCell>
                    <TableCell>{shipment.carrier || "Not assigned"}</TableCell>
                    <TableCell>{shipment.trackingNo || "N/A"}</TableCell>
                    <TableCell>{shipment.estimatedDelivery || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={!shipment.trackingNo}
                        onClick={() => handleTrackShipment(shipment.trackingNo)}
                      >
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transportation;
