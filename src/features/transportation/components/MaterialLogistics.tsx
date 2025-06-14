
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";

const generateMaterialShipments = () => {
  return [
    {
      id: "ML001",
      materialType: "Gateway module, PC and Accessories",
      projectName: "Amni WTP",
      vendorName: "Agmatic Technologies",
      quantity: "5 units",
      weight: "25 kg",
      dimensions: "60x40x30 cm",
      paymentId: "5",
      carrier: "Blue Dart Express",
      trackingNo: "BD123456789",
      originLocation: "Mumbai",
      destinationLocation: "Itanagar",
      estimatedDelivery: "2023-04-15",
      actualDelivery: "",
      status: "in-transit",
      priority: "High",
      specialInstructions: "Handle with care - Electronic equipment"
    },
    {
      id: "ML002",
      materialType: "Lithium Ion Battery (24VDC)",
      projectName: "Amni WTP",
      vendorName: "Ligths Technologies",
      quantity: "10 units",
      weight: "50 kg",
      dimensions: "40x30x20 cm",
      paymentId: "8",
      carrier: "DTDC",
      trackingNo: "DTDC987654321",
      originLocation: "Delhi",
      destinationLocation: "Naharlagun",
      estimatedDelivery: "2023-04-10",
      actualDelivery: "2023-04-09",
      status: "delivered",
      priority: "Medium",
      specialInstructions: "Hazardous material - Follow safety protocols"
    },
    {
      id: "ML003",
      materialType: "Control Valve for Sample Testing",
      projectName: "Sample Testing",
      vendorName: "BMP SYSTEMS",
      quantity: "3 units",
      weight: "15 kg",
      dimensions: "30x30x25 cm",
      paymentId: "2",
      carrier: "FedEx",
      trackingNo: "FX123789456",
      originLocation: "Bangalore",
      destinationLocation: "Itanagar",
      estimatedDelivery: "2023-03-25",
      actualDelivery: "2023-03-24",
      status: "delivered",
      priority: "Normal",
      specialInstructions: "Fragile - This side up"
    },
    {
      id: "ML004",
      materialType: "Panel Internal Instruments",
      projectName: "YACHULI",
      vendorName: "P.R.S ENTERPRISE",
      quantity: "8 units",
      weight: "35 kg",
      dimensions: "50x35x25 cm",
      paymentId: "3",
      carrier: "DHL",
      trackingNo: "DHL456123789",
      originLocation: "Chennai",
      destinationLocation: "Yachuli",
      estimatedDelivery: "2023-03-20",
      actualDelivery: "2023-03-19",
      status: "delivered",
      priority: "High",
      specialInstructions: "Temperature sensitive - Keep cool"
    },
    {
      id: "ML005",
      materialType: "Marxian's Equipment Return",
      projectName: "Piyong IoT",
      vendorName: "King Longkai",
      quantity: "1 unit",
      weight: "10 kg",
      dimensions: "25x20x15 cm",
      paymentId: "1",
      carrier: "",
      trackingNo: "",
      originLocation: "Piyong",
      destinationLocation: "Warehouse",
      estimatedDelivery: "",
      actualDelivery: "",
      status: "pending",
      priority: "Low",
      specialInstructions: "Return shipment - Inspect condition"
    }
  ];
};

const MaterialLogistics = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allShipments = generateMaterialShipments();
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
      shipment.materialType.toLowerCase().includes(query) ||
      shipment.projectName.toLowerCase().includes(query) ||
      shipment.vendorName.toLowerCase().includes(query) ||
      shipment.trackingNo.toLowerCase().includes(query) ||
      shipment.carrier.toLowerCase().includes(query)
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by material, project, vendor, or tracking number..."
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
              <TableHead>Material Type</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Origin → Destination</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>{shipment.materialType}</TableCell>
                <TableCell>{shipment.projectName}</TableCell>
                <TableCell>{shipment.vendorName}</TableCell>
                <TableCell>{shipment.quantity}</TableCell>
                <TableCell>{shipment.weight}</TableCell>
                <TableCell>{shipment.carrier || "Not assigned"}</TableCell>
                <TableCell>{shipment.originLocation} → {shipment.destinationLocation}</TableCell>
                <TableCell>{getPriorityBadge(shipment.priority)}</TableCell>
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
    </div>
  );
};

export default MaterialLogistics;
