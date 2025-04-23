
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import AddVendorForm from "@/components/vendors/AddVendorForm";

// Mock vendor data
const vendors = [
  {
    id: "1",
    name: "King Longkai",
    contactPerson: "John Zhang",
    email: "john@kinglongkai.com",
    phone: "+91 98765 43210",
    category: "supplier",
    status: "active",
    totalPayments: 450000,
    pendingPayments: 300000
  },
  {
    id: "2",
    name: "BMP SYSTEMS",
    contactPerson: "Mike Johnson",
    email: "mike@bmpsystems.com",
    phone: "+91 97654 32109",
    category: "contractor",
    status: "active",
    totalPayments: 81410,
    pendingPayments: 0
  },
  {
    id: "3",
    name: "P.R.S ENTERPRISE",
    contactPerson: "Sarah Singh",
    email: "sarah@prsenterprise.com",
    phone: "+91 87654 32109",
    category: "supplier",
    status: "active",
    totalPayments: 356591,
    pendingPayments: 0
  },
  {
    id: "4",
    name: "SKY MARKETING",
    contactPerson: "Robert Lee",
    email: "robert@skymarketing.com",
    phone: "+91 76543 21098",
    category: "service-provider",
    status: "inactive",
    totalPayments: 248355,
    pendingPayments: 248355
  },
  {
    id: "5",
    name: "Agmatic Technologies",
    contactPerson: "David Wang",
    email: "david@agmatictech.com",
    phone: "+91 65432 10987",
    category: "consultant",
    status: "active",
    totalPayments: 2542324,
    pendingPayments: 1406679
  },
  {
    id: "6",
    name: "DIVYANSHU AUTOMATION",
    contactPerson: "Priya Patel",
    email: "priya@divyanshuauto.com",
    phone: "+91 54321 09876",
    category: "supplier",
    status: "active",
    totalPayments: 584286,
    pendingPayments: 284286
  }
];

const Vendors = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    filterVendors();
  }, [statusFilter, searchQuery]);

  const filterVendors = () => {
    let result = [...vendors];
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(vendor => vendor.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(vendor => 
        vendor.name.toLowerCase().includes(query) ||
        vendor.contactPerson.toLowerCase().includes(query) ||
        vendor.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredVendors(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "supplier":
        return <Badge className="bg-blue-100 text-blue-800">Supplier</Badge>;
      case "contractor":
        return <Badge className="bg-purple-100 text-purple-800">Contractor</Badge>;
      case "consultant":
        return <Badge className="bg-yellow-100 text-yellow-800">Consultant</Badge>;
      case "service-provider":
        return <Badge className="bg-indigo-100 text-indigo-800">Service Provider</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const handleAddVendorSuccess = () => {
    setIsAddDialogOpen(false);
    toast.success("Vendor added successfully!");
    // In a real app, we would refresh vendors from the API
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>View and manage all vendors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Payments</TableHead>
                  <TableHead>Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.contactPerson}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>{getCategoryBadge(vendor.category)}</TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell>₹{vendor.totalPayments.toLocaleString()}</TableCell>
                    <TableCell className={vendor.pendingPayments > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                      {vendor.pendingPayments > 0 
                        ? `₹${vendor.pendingPayments.toLocaleString()}`
                        : "Nil"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <AddVendorForm onSuccess={handleAddVendorSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;
