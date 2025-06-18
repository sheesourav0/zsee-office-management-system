import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/chakra/Select";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const generatePurchaseOrders = () => {
  return [
    {
      id: "PO001",
      poNumber: "PO-2023-001",
      vendorName: "Agmatic Technologies",
      projectName: "Amni WTP",
      poDate: "2023-01-15",
      expectedDelivery: "2023-03-01",
      amount: 75000,
      status: "approved",
      items: [
        { name: "Gateway module", quantity: 5, unitPrice: 5000 },
        { name: "PC", quantity: 1, unitPrice: 25000 },
      ],
    },
    {
      id: "PO002",
      poNumber: "PO-2023-002",
      vendorName: "Ligths Technologies",
      projectName: "Amni WTP",
      poDate: "2023-01-20",
      expectedDelivery: "2023-03-05",
      amount: 42000,
      status: "pending",
      items: [
        { name: "Lithium Ion Battery (24VDC)", quantity: 10, unitPrice: 4200 },
      ],
    },
    {
      id: "PO003",
      poNumber: "PO-2023-003",
      vendorName: "BMP SYSTEMS",
      projectName: "Sample Testing",
      poDate: "2023-02-01",
      expectedDelivery: "2023-03-10",
      amount: 18000,
      status: "delivered",
      items: [
        { name: "Control Valve for Sample Testing", quantity: 3, unitPrice: 6000 },
      ],
    },
    {
      id: "PO004",
      poNumber: "PO-2023-004",
      vendorName: "P.R.S ENTERPRISE",
      projectName: "YACHULI",
      poDate: "2023-02-05",
      expectedDelivery: "2023-03-15",
      amount: 28000,
      status: "cancelled",
      items: [
        { name: "Panel Internal Instruments", quantity: 8, unitPrice: 3500 },
      ],
    },
    {
      id: "PO005",
      poNumber: "PO-2023-005",
      vendorName: "King Longkai",
      projectName: "Piyong IoT",
      poDate: "2023-02-10",
      expectedDelivery: "2023-03-20",
      amount: 9500,
      status: "draft",
      items: [
        { name: "Marxian's Equipment Return", quantity: 1, unitPrice: 9500 },
      ],
    },
  ];
};

const POManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const allPOs = generatePurchaseOrders();
    setPurchaseOrders(allPOs);
    filterPOs(allPOs);
  }, [searchQuery, statusFilter]);

  const filterPOs = (pos: any[]) => {
    let result = [...pos];
    
    if (statusFilter !== "all") {
      result = result.filter(po => po.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(po => 
        po.poNumber.toLowerCase().includes(query) ||
        po.vendorName.toLowerCase().includes(query) ||
        po.projectName.toLowerCase().includes(query)
      );
    }
    
    setFilteredPOs(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge colorScheme="green">Approved</Badge>;
      case "pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      case "delivered":
        return <Badge colorScheme="blue">Delivered</Badge>;
      case "cancelled":
        return <Badge colorScheme="red">Cancelled</Badge>;
      case "draft":
        return <Badge colorScheme="gray">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewPO = (poId: string) => {
    toast.success(`Viewing PO ${poId}`);
  };

  const handleEditPO = (poId: string) => {
    toast.success(`Editing PO ${poId}`);
  };

  const handleDeletePO = (poId: string) => {
    toast.success(`Deleting PO ${poId}`);
  };

  const handleDownloadPO = (poId: string) => {
    toast.success(`Downloading PO ${poId}`);
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
            placeholder="Search by PO number, vendor, or project..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
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
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead textAlign="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po.id}>
                <TableCell fontWeight="medium">{po.poNumber}</TableCell>
                <TableCell>{po.vendorName}</TableCell>
                <TableCell>{po.projectName}</TableCell>
                <TableCell>{po.poDate}</TableCell>
                <TableCell>{po.expectedDelivery}</TableCell>
                <TableCell>₹{po.amount.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
                <TableCell textAlign="right">
                  <Flex gap={1} justify="flex-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewPO(po.id)}
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadPO(po.id)}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditPO(po.id)}
                    >
                      <Edit style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePO(po.id)}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
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

export default POManagement;
