import { useState, useEffect } from "react";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Table } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { VStack, HStack, Box } from "@chakra-ui/react";
import { Search, Filter, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const generateInvoiceData = () => {
  return [
    {
      id: "INV001",
      invoiceNumber: "INV-2024-001",
      poNumber: "PO-2024-001",
      vendorName: "Agmatic Technologies",
      projectName: "Amni WTP",
      department: "Engineering",
      requestedBy: "John Doe",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 250000,
      taxAmount: 45000,
      totalAmount: 295000,
      status: "sent",
      paymentStatus: "pending"
    },
    {
      id: "INV002",
      invoiceNumber: "INV-2024-002",
      poNumber: "PO-2024-002",
      vendorName: "P.R.S ENTERPRISE",
      projectName: "YACHULI",
      department: "Operations",
      requestedBy: "Jane Smith",
      invoiceDate: "2024-01-25",
      dueDate: "2024-02-25",
      amount: 220000,
      taxAmount: 39600,
      totalAmount: 259600,
      status: "sent",
      paymentStatus: "hold"
    },
    {
      id: "INV003",
      invoiceNumber: "INV-2024-003",
      poNumber: "PO-2024-003",
      vendorName: "BMP SYSTEMS",
      projectName: "Sample Testing",
      department: "Quality Control",
      requestedBy: "Mike Johnson",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 45000,
      taxAmount: 8100,
      totalAmount: 53100,
      status: "paid",
      paymentStatus: "paid"
    },
    {
      id: "INV004",
      invoiceNumber: "INV-2024-004",
      poNumber: "PO-2024-004",
      vendorName: "Tech Solutions Ltd",
      projectName: "Maintenance Work",
      department: "Maintenance",
      requestedBy: "Sarah Wilson",
      invoiceDate: "2024-01-30",
      dueDate: "2024-02-28",
      amount: 80000,
      taxAmount: 14400,
      totalAmount: 94400,
      status: "cancelled",
      paymentStatus: "cancelled"
    }
  ];
};

interface InvoiceManagementProps {
  filterType: string;
}

const InvoiceManagement = ({ filterType }: InvoiceManagementProps) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allInvoices = generateInvoiceData();
    setInvoices(allInvoices);
    applyFilters(allInvoices, filterType);
  }, [filterType, searchQuery]);

  const applyFilters = (invoices: any[], filterType: string) => {
    let filtered = [...invoices];

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
        filtered = filtered.filter(invoice => invoice.paymentStatus === "paid");
        break;
      case "pending":
        filtered = filtered.filter(invoice => invoice.paymentStatus === "pending" || invoice.paymentStatus === "hold");
        break;
      case "all":
      default:
        // Show all
        break;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.poNumber.toLowerCase().includes(query) ||
        invoice.vendorName.toLowerCase().includes(query) ||
        invoice.projectName.toLowerCase().includes(query) ||
        invoice.requestedBy.toLowerCase().includes(query) ||
        invoice.department.toLowerCase().includes(query)
      );
    }
    
    setFilteredInvoices(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge>Draft</Badge>;
      case "sent":
        return <Badge colorScheme="blue">Sent</Badge>;
      case "paid":
        return <Badge colorScheme="green">Paid</Badge>;
      case "overdue":
        return <Badge colorScheme="red">Overdue</Badge>;
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

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.info(`Downloading invoice ${invoiceId}`);
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        <Box position="relative" flex={1}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice number, PO, vendor, project, department, requested by..."
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
              <Table.ColumnHeader>Invoice Number</Table.ColumnHeader>
              <Table.ColumnHeader>PO Number</Table.ColumnHeader>
              <Table.ColumnHeader>Vendor</Table.ColumnHeader>
              <Table.ColumnHeader>Project</Table.ColumnHeader>
              <Table.ColumnHeader>Department</Table.ColumnHeader>
              <Table.ColumnHeader>Requested By</Table.ColumnHeader>
              <Table.ColumnHeader>Invoice Date</Table.ColumnHeader>
              <Table.ColumnHeader>Total Amount</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Payment Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredInvoices.map((invoice) => (
              <Table.Row key={invoice.id}>
                <Table.Cell fontWeight="medium">{invoice.invoiceNumber}</Table.Cell>
                <Table.Cell>{invoice.poNumber}</Table.Cell>
                <Table.Cell>{invoice.vendorName}</Table.Cell>
                <Table.Cell>{invoice.projectName}</Table.Cell>
                <Table.Cell>{invoice.department}</Table.Cell>
                <Table.Cell>{invoice.requestedBy}</Table.Cell>
                <Table.Cell>{invoice.invoiceDate}</Table.Cell>
                <Table.Cell>₹{invoice.totalAmount.toLocaleString()}</Table.Cell>
                <Table.Cell>{getStatusBadge(invoice.status)}</Table.Cell>
                <Table.Cell>{getPaymentStatusBadge(invoice.paymentStatus)}</Table.Cell>
                <Table.Cell textAlign="right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      
      {filteredInvoices.length === 0 && (
        <Box textAlign="center" py={8} color="gray.500">
          No invoices found matching the current filter criteria.
        </Box>
      )}
    </VStack>
  );
};

export default InvoiceManagement;
