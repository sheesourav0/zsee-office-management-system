
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

// Simulated data - in a real app, this would come from an API
const generateMockVendors = () => {
  return [
    {
      id: "1",
      name: "King Longkai",
      contactPerson: "Xiaoming Zhang",
      email: "contact@kinglongkai.com",
      phone: "+86 10 1234 5678",
      address: "123 Beijing Road, Beijing, China",
      accountNo: "11822669748",
      ifscCode: "SBIN0013311",
      bank: "SBI/Namsai",
      gst: "29ABCDE1234F1ZB"
    },
    {
      id: "2",
      name: "A-TEL TECH COMMUNICATION SOLUTIONS",
      contactPerson: "Rajesh Kumar",
      email: "info@ateltech.in",
      phone: "+91 98765 43210",
      address: "456 Tech Park, Bangalore, India",
      accountNo: "42977648834",
      ifscCode: "SBIN0011264",
      bank: "STATE BANK OF INDIA",
      gst: "27FGHTJ5678K2ZC"
    },
    {
      id: "3",
      name: "BMP SYSTEMS",
      contactPerson: "Suresh Patel",
      email: "contact@bmpsystems.com",
      phone: "+91 94302 12345",
      address: "789 Industrial Area, Mumbai, India",
      accountNo: "50206006302325",
      ifscCode: "HDFC0001923",
      bank: "HDFC BANK LTD",
      gst: "24LMNOP7890Q3ZD"
    },
    {
      id: "4",
      name: "P.R.S ENTERPRISE",
      contactPerson: "Prakash Singh",
      email: "info@prsenterprise.com",
      phone: "+91 85214 96307",
      address: "101 Market Street, Kolkata, India",
      accountNo: "10190001090015",
      ifscCode: "ESFB0001240",
      bank: "KOLKATA G.C. AVENUE",
      gst: "19QRSTU1234R4ZE"
    },
    {
      id: "5",
      name: "SKY MARKETING",
      contactPerson: "Sanjay Kumar",
      email: "sanjay@skymarketing.com",
      phone: "+91 98765 12345",
      address: "202 Sky Tower, Delhi, India",
      accountNo: "31382020020488",
      ifscCode: "BARBOGBROAD",
      bank: "BANK OF BARODA",
      gst: "07VWXYZ5678S5ZF"
    },
    {
      id: "6",
      name: "Agmatic Technologies Pvt Ltd",
      contactPerson: "Amit Gupta",
      email: "info@agmatic.com",
      phone: "+91 99887 76655",
      address: "303 Tech Hub, Hyderabad, India",
      accountNo: "71690500000518",
      ifscCode: "BARB0DBMAKA",
      bank: "Makarjura",
      gst: "36ABCDE5678T6ZG"
    },
    {
      id: "7",
      name: "Ligths Technologies",
      contactPerson: "Preeti Sharma",
      email: "contact@lightstechnologies.com",
      phone: "+91 98123 45678",
      address: "404 Electronics Zone, Pune, India",
      accountNo: "92103001261573",
      ifscCode: "UTIB000871",
      bank: "Aundh Pune",
      gst: "27FGHIJ1234U7ZH"
    }
  ];
};

const Vendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allVendors = generateMockVendors();
    setVendors(allVendors);
    filterVendors(allVendors);
  }, [searchQuery]);

  const filterVendors = (vendors: any[]) => {
    if (!searchQuery) {
      setFilteredVendors(vendors);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = vendors.filter(vendor => 
      vendor.name.toLowerCase().includes(query) ||
      vendor.contactPerson.toLowerCase().includes(query) ||
      vendor.email.toLowerCase().includes(query) ||
      vendor.phone.includes(query) ||
      vendor.gst.toLowerCase().includes(query)
    );
    
    setFilteredVendors(filtered);
  };

  const handleAddVendor = () => {
    toast.info("Add vendor functionality will be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <Button onClick={handleAddVendor}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>Manage all vendor information and banking details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>IFSC Code</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>GST Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.contactPerson}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>{vendor.accountNo}</TableCell>
                    <TableCell>{vendor.ifscCode}</TableCell>
                    <TableCell>{vendor.bank}</TableCell>
                    <TableCell>{vendor.gst}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendors;
