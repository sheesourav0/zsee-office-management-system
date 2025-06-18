import { useState, useEffect } from "react";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Table } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { VStack, HStack, Box } from "@chakra-ui/react";
import { Search, Filter, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
        return <Badge colorScheme="blue">Active</Badge>;
      case "completed":
        return <Badge colorScheme="green">Completed</Badge>;
      case "cancelled":
        return <Badge colorScheme="red">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge colorScheme="green">Paid</Badge>;
      case "hold":
        return <Badge colorScheme="orange">Hold</Badge>;
      case "pending":
        return <Badge colorScheme="red">Pending</Badge>;
      case "cancelled":
        return <Badge colorScheme="red">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleViewDetails = (poId: string) => {
    toast.info(`Viewing details for PO ${poId}`);
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Box position="relative" flex={1}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by PO number, project, vendor, department, requested by..."
            pl={10}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </HStack>
      
      <Box overflowX="auto" borderWidth={1} borderRadius="md">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>PO Number</Table.ColumnHeader>
              <Table.ColumnHeader>Project</Table.ColumnHeader>
              <Table.ColumnHeader>Department</Table.ColumnHeader>
              <Table.ColumnHeader>Requested By</Table.ColumnHeader>
              <Table.ColumnHeader>Vendor</Table.ColumnHeader>
              <Table.ColumnHeader>Total Amount</Table.ColumnHeader>
              <Table.ColumnHeader>PO Date</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Payment Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPOs.map((po) => (
              <Table.Row key={po.id}>
                <Table.Cell fontWeight="medium">{po.poNumber}</Table.Cell>
                <Table.Cell>{po.projectName}</Table.Cell>
                <Table.Cell>{po.department}</Table.Cell>
                <Table.Cell>{po.requestedBy}</Table.Cell>
                <Table.Cell>{po.vendorName}</Table.Cell>
                <Table.Cell>₹{po.totalAmount.toLocaleString()}</Table.Cell>
                <Table.Cell>{po.poDate}</Table.Cell>
                <Table.Cell>{getStatusBadge(po.status)}</Table.Cell>
                <Table.Cell>{getPaymentStatusBadge(po.paymentStatus)}</Table.Cell>
                <Table.Cell textAlign="right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(po.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      
      {filteredPOs.length === 0 && (
        <Box textAlign="center" py={8} color="gray.500">
          No purchase orders found matching the current filter criteria.
        </Box>
      )}
    </VStack>
  );
};

export default POManagement;
