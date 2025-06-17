import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Button } from "@/components/chakra/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Select } from "@/components/chakra/Select";
import { Input } from "@/components/chakra/Input";
import { Badge } from "@/components/chakra/Badge";
import { FileText, Download, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BillingProject } from "../types/billingTypes";

interface InvoiceGenerationProps {
  refreshTrigger: number;
}

interface Invoice {
  id: string;
  projectId: string;
  projectName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
}

const InvoiceGeneration = ({ refreshTrigger }: InvoiceGenerationProps) => {
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    const storedInvoices = JSON.parse(localStorage.getItem('billing_invoices') || '[]');
    setProjects(storedProjects);
    setInvoices(storedInvoices);
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const generateInvoice = () => {
    if (!selectedProject || !invoiceAmount || !dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const project = projects.find(p => p.id === selectedProject);
    if (!project) {
      toast.error("Selected project not found");
      return;
    }

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      projectId: selectedProject,
      projectName: project.name,
      invoiceNumber: generateInvoiceNumber(),
      amount: parseFloat(invoiceAmount),
      dueDate,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    const updatedInvoices = [...invoices, newInvoice];
    localStorage.setItem('billing_invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    
    // Reset form
    setSelectedProject("");
    setInvoiceAmount("");
    setDueDate("");
    
    toast.success(`Invoice ${newInvoice.invoiceNumber} generated successfully!`);
  };

  const updateInvoiceStatus = (invoiceId: string, status: 'draft' | 'sent' | 'paid') => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === invoiceId ? { ...invoice, status } : invoice
    );
    localStorage.setItem('billing_invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    toast.success("Invoice status updated");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    // In a real application, this would generate and download a PDF
    toast.info(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate New Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Invoice Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={generateInvoice} className="w-full">
                Generate Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invoices generated yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.projectName}</TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select
                            value={invoice.status}
                            onValueChange={(status: 'draft' | 'sent' | 'paid') => 
                              updateInvoiceStatus(invoice.id, status)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGeneration;
