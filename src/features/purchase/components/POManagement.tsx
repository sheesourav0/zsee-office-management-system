
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
      department: "Engineering",
      requestedBy: "John Doe",
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
      department: "Operations",
      requestedBy: "Jane Smith",
      vendorName: "P.R.S ENTERPRISE",
      description: "Panel Internal Instruments",
      quantity: "8 units",
      unitPrice: 27500,
      totalAmount: 220000,
      poDate: "2024-01-20",
      deliveryDate: "2024-02-20",
      status: "active",
      paymentStatus: "hold",
      transportationStatus: "in-transit"
    },
    {
      id: "PO003",
      poNumber: "PO-2024-003",
      projectName: "Sample Testing",
      department: "Quality Control",
      requestedBy: "Mike Johnson",
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
    },
    {
      id: "PO004",
      poNumber: "PO-2024-004",
      projectName: "Maintenance Work",
      department: "Maintenance",
      requestedBy: "Sarah Wilson",
      vendorName: "Tech Solutions Ltd",
      description: "Equipment Maintenance Tools",
      quantity: "10 units",
      unitPrice: 8000,
      totalAmount: 80000,
      poDate: "2024-01-25",
      deliveryDate: "2024-02-10",
      status: "cancelled",
      paymentStatus: "cancelled",
      transportationStatus: "cancelled"
    }
  ];
};

interface POManagementProps {
  filterType: string;
}

const POManagement = ({ filterType }: POManagementProps) => {
  const [pos, setPOs] = useState<any[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allPOs = generatePOData();
    setPOs(allPOs);
    applyFilters(allPOs, filterType);
  }, [filterType, searchQuery]);

  const applyFilters = (pos: any[], filterType: string) => {
    let filtered = [...pos];

    // Apply filter type
    switch (filterType) {
      case "project":
        // Group by project - for now showing all, could add specific project filtering
        break;
      case "department":
        // Group by department - for now showing all, could add specific department filtering
        break;
      case "requested-by":
        // Group by requested by - for now showing all, could add specific person filtering
        break;
      case "paid":
        filtered = filtered.filter(po => po.paymentStatus === "paid");
        break;
      case "pending":
        filtered = filtered.filter(po => po.paymentStatus === "pending" || po.paymentStatus === "hold");
        break;
      case "all":
      default:
        // Show all
        break;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(po => 
        po.poNumber.toLowerCase().includes(query) ||
        po.projectName.toLowerCase().includes(query) ||
        po.vendorName.toLowerCase().includes(query) ||
        po.description.toLowerCase().includes(query) ||
        po.requestedBy.toLowerCase().includes(query) ||
        po.department.toLowerCase().includes(query)
      );
    }
    
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
      case "hold":
        return <Badge className="bg-orange-100 text-orange-800">Hold</Badge>;
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
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
            placeholder="Search by PO number, project, vendor, department, requested by..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Vendor</TableHead>
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
                <TableCell>{po.department}</TableCell>
                <TableCell>{po.requestedBy}</TableCell>
                <TableCell>{po.vendorName}</TableCell>
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
      
      {filteredPOs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No purchase orders found matching the current filter criteria.
        </div>
      )}
    </div>
  );
};

export default POManagement;
