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

const generateInvoices = () => {
  return [
    {
      id: "INV001",
      invoiceNumber: "INV-2023-001",
      poNumber: "PO-2023-001",
      vendorName: "Agmatic Technologies",
      invoiceDate: "2023-01-15",
      dueDate: "2023-02-15",
      amount: 50000,
      status: "paid",
      items: [
        { description: "Gateway module", quantity: 5, unitPrice: 5000 },
        { description: "PC and Accessories", quantity: 1, unitPrice: 25000 }
      ]
    },
    {
      id: "INV002",
      invoiceNumber: "INV-2023-002",
      poNumber: "PO-2023-002",
      vendorName: "Ligths Technologies",
      invoiceDate: "2023-02-01",
      dueDate: "2023-03-01",
      amount: 25000,
      status: "pending",
      items: [
        { description: "Lithium Ion Battery (24VDC)", quantity: 10, unitPrice: 2500 }
      ]
    },
    {
      id: "INV003",
      invoiceNumber: "INV-2023-003",
      poNumber: "PO-2023-003",
      vendorName: "BMP SYSTEMS",
      invoiceDate: "2023-02-15",
      dueDate: "2023-03-15",
      amount: 12000,
      status: "paid",
      items: [
        { description: "Control Valve for Sample Testing", quantity: 3, unitPrice: 4000 }
      ]
    },
    {
      id: "INV004",
      invoiceNumber: "INV-2023-004",
      poNumber: "PO-2023-004",
      vendorName: "P.R.S ENTERPRISE",
      invoiceDate: "2023-03-01",
      dueDate: "2023-03-31",
      amount: 36000,
      status: "overdue",
      items: [
        { description: "Panel Internal Instruments", quantity: 8, unitPrice: 4500 }
      ]
    },
    {
      id: "INV005",
      invoiceNumber: "INV-2023-005",
      poNumber: "PO-2023-005",
      vendorName: "King Longkai",
      invoiceDate: "2023-03-15",
      dueDate: "2023-04-15",
      amount: 7500,
      status: "draft",
      items: [
        { description: "Marxian's Equipment Return", quantity: 1, unitPrice: 7500 }
      ]
    }
  ];
};

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const allInvoices = generateInvoices();
    setInvoices(allInvoices);
    filterInvoices(allInvoices);
  }, [searchQuery, statusFilter]);

  const filterInvoices = (invoices: any[]) => {
    let result = [...invoices];
    
    if (statusFilter !== "all") {
      result = result.filter(invoice => invoice.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.vendorName.toLowerCase().includes(query) ||
        invoice.poNumber.toLowerCase().includes(query)
      );
    }
    
    setFilteredInvoices(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge colorScheme="green">Paid</Badge>;
      case "pending":
        return <Badge colorScheme="yellow">Pending</Badge>;
      case "overdue":
        return <Badge colorScheme="red">Overdue</Badge>;
      case "draft":
        return <Badge colorScheme="gray">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    toast.success(`Viewing invoice ${invoiceId}`);
  };

  const handleEditInvoice = (invoiceId: string) => {
    toast.success(`Editing invoice ${invoiceId}`);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    toast.success(`Deleting invoice ${invoiceId}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
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
            placeholder="Search by invoice number, vendor, or PO number..."
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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
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
              <TableHead>Invoice #</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead textAlign="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell fontWeight="medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.poNumber}</TableCell>
                <TableCell>{invoice.vendorName}</TableCell>
                <TableCell>{invoice.invoiceDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell textAlign="right">
                  <Flex gap={1} justify="flex-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewInvoice(invoice.id)}
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditInvoice(invoice.id)}
                    >
                      <Edit style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteInvoice(invoice.id)}
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

export default InvoiceManagement;
