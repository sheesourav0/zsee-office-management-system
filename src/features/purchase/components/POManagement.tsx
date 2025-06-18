import { useState, useEffect } from "react";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Search, Filter, Eye, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PO {
  id: string;
  vendorName: string;
  projectName: string;
  poDate: string;
  deliveryDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  approvedBy: string;
  approvalDate: string;
  description: string;
  quantity: string;
  unitPrice: number;
  currency: string;
  paymentTerms: string;
  deliveryAddress: string;
}

const generatePOs = () => {
  return [
    {
      id: "PO-2023-001",
      vendorName: "Agmatic Technologies",
      projectName: "Amni WTP",
      poDate: "2023-03-15",
      deliveryDate: "2023-04-15",
      amount: 125000,
      taxAmount: 22500,
      totalAmount: 147500,
      status: "approved",
      approvedBy: "John Doe",
      approvalDate: "2023-03-16",
      description: "Gateway module, PC and Accessories",
      quantity: "5 units",
      unitPrice: 25000,
      currency: "INR",
      paymentTerms: "Net 30",
      deliveryAddress: "Amni WTP Site, Itanagar"
    },
    {
      id: "PO-2023-002",
      vendorName: "Ligths Technologies",
      projectName: "Amni WTP",
      poDate: "2023-03-20",
      deliveryDate: "2023-04-20",
      amount: 75000,
      taxAmount: 13500,
      totalAmount: 88500,
      status: "pending",
      approvedBy: "",
      approvalDate: "",
      description: "Lithium Ion Battery (24VDC)",
      quantity: "10 units",
      unitPrice: 7500,
      currency: "INR",
      paymentTerms: "Net 30",
      deliveryAddress: "Amni WTP Site, Naharlagun"
    },
    {
      id: "PO-2023-003",
      vendorName: "BMP SYSTEMS",
      projectName: "Sample Testing",
      poDate: "2023-02-28",
      deliveryDate: "2023-03-28",
      amount: 45000,
      taxAmount: 8100,
      totalAmount: 53100,
      status: "delivered",
      approvedBy: "Jane Smith",
      approvalDate: "2023-03-01",
      description: "Control Valve for Sample Testing",
      quantity: "3 units",
      unitPrice: 15000,
      currency: "INR",
      paymentTerms: "Net 30",
      deliveryAddress: "Testing Lab, Itanagar"
    },
    {
      id: "PO-2023-004",
      vendorName: "P.R.S ENTERPRISE",
      projectName: "YACHULI",
      poDate: "2023-02-15",
      deliveryDate: "2023-03-15",
      amount: 85000,
      taxAmount: 15300,
      totalAmount: 100300,
      status: "delivered",
      approvedBy: "Mike Johnson",
      approvalDate: "2023-02-16",
      description: "Panel Internal Instruments",
      quantity: "8 units",
      unitPrice: 10625,
      currency: "INR",
      paymentTerms: "Net 30",
      deliveryAddress: "Yachuli Site Office"
    },
    {
      id: "PO-2023-005",
      vendorName: "King Longkai",
      projectName: "Piyong IoT",
      poDate: "2023-04-01",
      deliveryDate: "2023-05-01",
      amount: 35000,
      taxAmount: 6300,
      totalAmount: 41300,
      status: "draft",
      approvedBy: "",
      approvalDate: "",
      description: "IoT Sensors and Controllers",
      quantity: "12 units",
      unitPrice: 2917,
      currency: "INR",
      paymentTerms: "Net 30",
      deliveryAddress: "Piyong Site, Arunachal Pradesh"
    }
  ];
};

const POManagement = () => {
  const [pos, setPOs] = useState<any[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const allPOs = generatePOs();
    setPOs(allPOs);
    filterPOs(allPOs);
  }, [searchQuery, statusFilter]);

  const filterPOs = (pos: any[]) => {
    let filtered = pos;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(po => 
        po.id.toLowerCase().includes(query) ||
        po.vendorName.toLowerCase().includes(query) ||
        po.projectName.toLowerCase().includes(query) ||
        po.description.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(po => po.status === statusFilter);
    }
    
    setFilteredPOs(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge colorScheme="green">Approved</Badge>;
      case "pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      case "delivered":
        return <Badge colorScheme="blue">Delivered</Badge>;
      case "draft":
        return <Badge colorScheme="gray">Draft</Badge>;
      case "rejected":
        return <Badge colorScheme="red">Rejected</Badge>;
      default:
        return <Badge colorScheme="gray">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleViewPO = (poId: string) => {
    toast({ title: `Viewing PO ${poId}` });
  };

  const handleDownloadPO = (poId: string) => {
    toast({ title: `Downloading PO ${poId}` });
  };

  const handleApprovePO = (poId: string) => {
    toast({ title: `Approving PO ${poId}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by PO ID, vendor, project, or description..."
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
              <TableHead>PO ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>PO Date</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">{po.id}</TableCell>
                <TableCell>{po.vendorName}</TableCell>
                <TableCell>{po.projectName}</TableCell>
                <TableCell>{po.description}</TableCell>
                <TableCell>{new Date(po.poDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(po.deliveryDate).toLocaleDateString()}</TableCell>
                <TableCell>{formatCurrency(po.amount)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(po.totalAmount)}</TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewPO(po.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadPO(po.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {po.status === "pending" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApprovePO(po.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredPOs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No purchase orders found</p>
        </div>
      )}
    </div>
  );
};

export default POManagement;
