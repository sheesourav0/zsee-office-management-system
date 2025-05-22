
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import PaymentFilterBar from "@/features/payments/components/PaymentFilterBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const Payments = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage and track all payments to vendors
          </p>
        </div>
        <Button asChild>
          <Link to="/payments/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Link>
        </Button>
      </div>

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
    </div>
  );
};

export default Payments;
