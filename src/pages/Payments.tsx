import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PaymentFilterBar from "@/features/payments/components/PaymentFilterBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BillingProject } from "@/features/billing/types/billingTypes";
import AddProjectForm from "@/features/billing/components/AddProjectForm";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Existing payments data
  const [payments, setPayments] = useState([
    {
      id: "1",
      slNo: 1,
      description: "Maintain Marxian's amount return",
      projectName: "Piyong IoT(Namsal)",
      companyName: "King Longkai (Account Holder Name)",
      poReference: "PO123456",
      poDate: "2023-04-15",
      accountNo: "11822669748",
      ifscCode: "SBIN0013311",
      branchBank: "SBI/Namsai",
      totalAmount: 300000,
      paid: 0,
      payDate: "",
      payableAmount: 300000,
      priority: "High",
      remarks: "",
      transportationStatus: "pending",
      paymentStatus: "unpaid",
    },
    {
      id: "2",
      slNo: 2,
      description: "Supply of Man Power",
      projectName: "YACHULI",
      companyName: "A-TEL TECH",
      poReference: "PO789012",
      poDate: "2023-05-20",
      accountNo: "9876543210",
      ifscCode: "ICIC0004567",
      branchBank: "ICICI/Itanagar",
      totalAmount: 150000,
      paid: 75000,
      payDate: "2023-06-10",
      payableAmount: 75000,
      priority: "Medium",
      remarks: "Partial payment made",
      transportationStatus: "in-transit",
      paymentStatus: "partial",
    },
    {
      id: "3",
      slNo: 3,
      description: "Supply of Juniper make 48 port switch",
      projectName: "Amni WTP",
      companyName: "BMP SYSTEMS",
      poReference: "PO345678",
      poDate: "2023-06-25",
      accountNo: "2468135790",
      ifscCode: "HDFC0007890",
      branchBank: "HDFC/Naharlagun",
      totalAmount: 80000,
      paid: 80000,
      payDate: "2023-07-01",
      payableAmount: 0,
      priority: "High",
      remarks: "Full payment completed",
      transportationStatus: "delivered",
      paymentStatus: "paid",
    },
    {
      id: "4",
      slNo: 4,
      description: "Supply & Installation of 500KVA",
      projectName: "Machuika",
      companyName: "P.R.S ENTERPRISE",
      poReference: "PO901234",
      poDate: "2023-07-10",
      accountNo: "1357924680",
      ifscCode: "UTIB0002345",
      branchBank: "Axis/Banderdewa",
      totalAmount: 220000,
      paid: 0,
      payDate: "",
      payableAmount: 220000,
      priority: "Normal",
      remarks: "Payment pending",
      transportationStatus: "not-applicable",
      paymentStatus: "unpaid",
    },
  ]);
  const [filteredPayments, setFilteredPayments] = useState(payments);

  useEffect(() => {
    loadProjects();
  }, [refreshTrigger]);

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    setProjects(storedProjects);
  };

  const handleAddProjectSuccess = () => {
    setIsProjectDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Project added successfully!");
  };

  const handleFilterChange = (filters: any) => {
    let newFilteredPayments = [...payments];

    if (filters.project) {
      newFilteredPayments = newFilteredPayments.filter(
        (payment) =>
          payment.projectName &&
          payment.projectName.toLowerCase().includes(filters.project.toLowerCase())
      );
    }

    if (filters.vendor) {
      newFilteredPayments = newFilteredPayments.filter(
        (payment) =>
          payment.companyName &&
          payment.companyName.toLowerCase().includes(filters.vendor.toLowerCase())
      );
    }

    if (filters.paymentStatus) {
      newFilteredPayments = newFilteredPayments.filter(
        (payment) =>
          payment.paymentStatus &&
          payment.paymentStatus.toLowerCase() === filters.paymentStatus.toLowerCase()
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      newFilteredPayments = newFilteredPayments.filter(
        (payment) =>
          payment.poDate && new Date(payment.poDate) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      newFilteredPayments = newFilteredPayments.filter(
        (payment) =>
          payment.poDate && new Date(payment.poDate) <= toDate
      );
    }

    setFilteredPayments(newFilteredPayments);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-800">Planning</Badge>;
      case "on-hold":
        return <Badge className="bg-orange-100 text-orange-800">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectOwner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "In Progress" && project.status === "active") ||
      (statusFilter === "Completed" && project.status === "completed") ||
      (statusFilter === "On Hold" && project.status === "on-hold");
    return matchesSearch && matchesStatus;
  });

  const calculateProgress = (project: BillingProject) => {
    if (project.totalCost === 0) return 0;
    return Math.round(((project.totalCost - project.totalPending) / project.totalCost) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Comprehensive project management with payment tracking
          </p>
        </div>
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Project Management</CardTitle>
              <p className="text-sm text-muted-foreground">Manage all construction projects</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <div className="flex gap-1">
                {["All", "In Progress", "Completed", "On Hold"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payments</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No projects found. Add your first project to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => {
                    const progress = calculateProgress(project);
                    const spent = project.totalReceived;
                    const remaining = project.totalPending;
                    const pendingPayments = project.paymentTerms.filter(term => 
                      term.percentage * project.totalCost / 100 > project.totalReceived
                    ).length;
                    
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>₹{project.totalCost.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-600">₹{spent.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">₹{remaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 w-20" />
                            <span className="text-sm">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {project.paymentTerms.length} 
                            {pendingPayments > 0 && (
                              <span className="text-red-600"> ({pendingPayments} pending)</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>{project.startDate || "N/A"}</TableCell>
                        <TableCell>{project.expectedEndDate || "N/A"}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardContent>
              <PaymentFilterBar onFilterChange={handleFilterChange} />
            </CardContent>
          </Card>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">SL No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payable Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.slNo}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{payment.projectName}</TableCell>
                    <TableCell>{payment.companyName}</TableCell>
                    <TableCell>{payment.poReference}</TableCell>
                    <TableCell>₹{payment.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{payment.payableAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/payments/${payment.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <AddProjectForm onSuccess={handleAddProjectSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
