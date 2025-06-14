
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";
import { toast } from "sonner";

const generateInvoiceData = () => {
  return [
    {
      id: "INV001",
      invoiceNumber: "INV-2024-001",
      poNumber: "PO-2024-001",
      vendorName: "Agmatic Technologies",
      projectName: "Amni WTP",
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
      invoiceDate: "2024-01-25",
      dueDate: "2024-02-25",
      amount: 220000,
      taxAmount: 39600,
      totalAmount: 259600,
      status: "sent",
      paymentStatus: "partial"
    },
    {
      id: "INV003",
      invoiceNumber: "INV-2024-003",
      poNumber: "PO-2024-003",
      vendorName: "BMP SYSTEMS",
      projectName: "Sample Testing",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 45000,
      taxAmount: 8100,
      totalAmount: 53100,
      status: "paid",
      paymentStatus: "paid"
    }
  ];
};

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allInvoices = generateInvoiceData();
    setInvoices(allInvoices);
    filterInvoices(allInvoices);
  }, [searchQuery]);

  const filterInvoices = (invoices: any[]) => {
    if (!searchQuery) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = invoices.filter(invoice => 
      invoice.invoiceNumber.toLowerCase().includes(query) ||
      invoice.poNumber.toLowerCase().includes(query) ||
      invoice.vendorName.toLowerCase().includes(query) ||
      invoice.projectName.toLowerCase().includes(query)
    );
    
    setFilteredInvoices(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.info(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number, PO, vendor..."
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
              <TableHead>Invoice Number</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.poNumber}</TableCell>
                <TableCell>{invoice.vendorName}</TableCell>
                <TableCell>{invoice.projectName}</TableCell>
                <TableCell>{invoice.invoiceDate}</TableCell>
                <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
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

export default InvoiceManagement;
