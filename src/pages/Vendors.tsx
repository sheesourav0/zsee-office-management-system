import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@/components/chakra/Tabs";
import { Input } from "@/components/chakra/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
        return <Badge colorScheme="green">Active</Badge>;
      case "inactive":
        return <Badge colorScheme="gray">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "supplier":
        return <Badge colorScheme="blue">Supplier</Badge>;
      case "contractor":
        return <Badge colorScheme="purple">Contractor</Badge>;
      case "consultant":
        return <Badge colorScheme="yellow">Consultant</Badge>;
      case "service-provider":
        return <Badge colorScheme="cyan">Service Provider</Badge>;
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
    <Box gap={6}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        align={{ md: "center" }} 
        justify={{ md: "space-between" }} 
        gap={4}
        mb={6}
      >
        <Heading size="lg">Vendors</Heading>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus style={{ marginRight: '8px', width: '16px', height: '16px' }} />
          Add Vendor
        </Button>
      </Flex>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>View and manage all vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <Box gap={6}>
            <Flex 
              direction={{ base: "column", md: "row" }} 
              align={{ md: "center" }} 
              justify={{ md: "space-between" }} 
              gap={4}
            >
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabList>
                  <Tab value="all">All</Tab>
                  <Tab value="active">Active</Tab>
                  <Tab value="inactive">Inactive</Tab>
                </TabList>
              </Tabs>
              
              <Box position="relative" w={{ base: "full", md: "64" }}>
                <Search style={{ position: 'absolute', left: '8px', top: '10px', width: '16px', height: '16px', color: '#A0AEC0' }} />
                <Input
                  placeholder="Search vendors..."
                  paddingLeft="32px"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
            </Flex>
            
            <Box borderWidth={1} borderRadius="md">
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
                      <TableCell fontWeight="medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.contactPerson}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{getCategoryBadge(vendor.category)}</TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                      <TableCell>₹{vendor.totalPayments.toLocaleString()}</TableCell>
                      <TableCell color={vendor.pendingPayments > 0 ? "red.600" : "green.600"} fontWeight={vendor.pendingPayments > 0 ? "medium" : "normal"}>
                        {vendor.pendingPayments > 0 
                          ? `₹${vendor.pendingPayments.toLocaleString()}`
                          : "Nil"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent maxW="700px" maxH="90vh" overflowY="auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <AddVendorForm 
            onSubmit={handleAddVendorSuccess} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Vendors;
