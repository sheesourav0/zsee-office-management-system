import { useState, useEffect } from "react";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Search, Filter, Eye, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  poNumber: string;
  vendorName: string;
  projectName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  paymentDate: string;
  paymentMethod: string;
  description: string;
  currency: string;
  paymentTerms: string;
}

const generateInvoices = () => {
  return [
    {
      id: "INV-2023-001",
      poNumber: "PO-2023-001",
      vendorName: "Agmatic Technologies",
      projectName: "Amni WTP",
      invoiceDate: "2023-04-01",
      dueDate: "2023-04-30",
      amount: 125000,
      taxAmount: 22500,
      totalAmount: 147500,
      status: "paid",
      paymentDate: "2023-04-28",
      paymentMethod: "Bank Transfer",
      description: "Gateway module, PC and Accessories",
      currency: "INR",
      paymentTerms: "Net 30"
    },
    {
      id: "INV-2023-002",
      poNumber: "PO-2023-002",
      vendorName: "Ligths Technologies",
      projectName: "Amni WTP",
      invoiceDate: "2023-04-05",
      dueDate: "2023-05-05",
      amount: 75000,
      taxAmount: 13500,
      totalAmount: 88500,
      status: "pending",
      paymentDate: "",
      paymentMethod: "",
      description: "Lithium Ion Battery (24VDC)",
      currency: "INR",
      paymentTerms: "Net 30"
    },
    {
      id: "INV-2023-003",
      poNumber: "PO-2023-003",
      vendorName: "BMP SYSTEMS",
      projectName: "Sample Testing",
      invoiceDate: "2023-03-15",
      dueDate: "2023-04-14",
      amount: 45000,
      taxAmount: 8100,
      totalAmount: 53100,
      status: "overdue",
      paymentDate: "",
      paymentMethod: "",
      description: "Control Valve for Sample Testing",
      currency: "INR",
      paymentTerms: "Net 30"
    },
    {
      id: "INV-2023-004",
      poNumber: "PO-2023-004",
      vendorName: "P.R.S ENTERPRISE",
      projectName: "YACHULI",
      invoiceDate: "2023-03-10",
      dueDate: "2023-04-09",
      amount: 85000,
      taxAmount: 15300,
      totalAmount: 100300,
      status: "paid",
      paymentDate: "2023-04-07",
      paymentMethod: "Cheque",
      description: "Panel Internal Instruments",
      currency: "INR",
      paymentTerms: "Net 30"
    },
    {
      id: "INV-2023-005",
      poNumber: "PO-2023-005",
      vendorName: "King Longkai",
      projectName: "Piyong IoT",
      invoiceDate: "2023-04-12",
      dueDate: "2023-05-12",
      amount: 35000,
      taxAmount: 6300,
      totalAmount: 41300,
      status: "draft",
      paymentDate: "",
      paymentMethod: "",
      description: "IoT Sensors and Controllers",
      currency: "INR",
      paymentTerms: "Net 30"
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
    let filtered = invoices;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.id.toLowerCase().includes(query) ||
        invoice.poNumber.toLowerCase().includes(query) ||
        invoice.vendorName.toLowerCase().includes(query) ||
        invoice.projectName.toLowerCase().includes(query) ||
        invoice.description.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    setFilteredInvoices(filtered);
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
        return <Badge colorScheme="gray">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleViewInvoice = (invoiceId: string) => {
    toast({ title: `Viewing invoice ${invoiceId}` });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({ title: `Downloading invoice ${invoiceId}` });
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    toast({ title: `Marking invoice ${invoiceId} as paid` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice ID, PO number, vendor, or project..."
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
              <TableHead>Invoice ID</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.poNumber}</TableCell>
                <TableCell>{invoice.vendorName}</TableCell>
                <TableCell>{invoice.projectName}</TableCell>
                <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{formatCurrency(invoice.taxAmount)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewInvoice(invoice.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {invoice.status === "pending" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkAsPaid(invoice.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No invoices found</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
