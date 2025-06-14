
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye } from "lucide-react";
import { toast } from "sonner";

const generatePOData = () => {
  return [
    {
      id: "PO001",
      poNumber: "PO-2024-001",
      projectName: "Amni WTP",
      vendorName: "Agmatic Technologies",
      description: "Gateway module, PC and Accessories",
      quantity: "5 units",
      unitPrice: 50000,
      totalAmount: 250000,
      poDate: "2024-01-15",
      deliveryDate: "2024-02-15",
      status: "active",
      paymentStatus: "pending",
      transportationStatus: "pending"
    },
    {
      id: "PO002",
      poNumber: "PO-2024-002",
      projectName: "YACHULI",
      vendorName: "P.R.S ENTERPRISE",
      description: "Panel Internal Instruments",
      quantity: "8 units",
      unitPrice: 27500,
      totalAmount: 220000,
      poDate: "2024-01-20",
      deliveryDate: "2024-02-20",
      status: "active",
      paymentStatus: "partial",
      transportationStatus: "in-transit"
    },
    {
      id: "PO003",
      poNumber: "PO-2024-003",
      projectName: "Sample Testing",
      vendorName: "BMP SYSTEMS",
      description: "Control Valve for Sample Testing",
      quantity: "3 units",
      unitPrice: 15000,
      totalAmount: 45000,
      poDate: "2024-01-10",
      deliveryDate: "2024-01-25",
      status: "completed",
      paymentStatus: "paid",
      transportationStatus: "delivered"
    }
  ];
};

const POManagement = () => {
  const [pos, setPOs] = useState<any[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allPOs = generatePOData();
    setPOs(allPOs);
    filterPOs(allPOs);
  }, [searchQuery]);

  const filterPOs = (pos: any[]) => {
    if (!searchQuery) {
      setFilteredPOs(pos);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = pos.filter(po => 
      po.poNumber.toLowerCase().includes(query) ||
      po.projectName.toLowerCase().includes(query) ||
      po.vendorName.toLowerCase().includes(query) ||
      po.description.toLowerCase().includes(query)
    );
    
    setFilteredPOs(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewDetails = (poId: string) => {
    toast.info(`Viewing details for PO ${poId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by PO number, project, vendor..."
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
              <TableHead>PO Number</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>PO Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">{po.poNumber}</TableCell>
                <TableCell>{po.projectName}</TableCell>
                <TableCell>{po.vendorName}</TableCell>
                <TableCell>{po.description}</TableCell>
                <TableCell>₹{po.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{po.poDate}</TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(po.paymentStatus)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(po.id)}
                  >
                    <Eye className="h-4 w-4" />
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

export default POManagement;
