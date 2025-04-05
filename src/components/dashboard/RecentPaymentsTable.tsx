
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Payment {
  id: string;
  projectName: string;
  companyName: string;
  amount: number;
  payableAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid" | "hold";
  transportStatus: "pending" | "in-transit" | "delivered" | "not-applicable";
  date: string;
}

interface RecentPaymentsTableProps {
  payments: Payment[];
}

const RecentPaymentsTable = ({ payments }: RecentPaymentsTableProps) => {
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="status-paid">Paid</Badge>;
      case "partial":
        return <Badge className="status-partial">Partial</Badge>;
      case "unpaid":
        return <Badge className="status-unpaid">Unpaid</Badge>;
      case "hold":
        return <Badge className="status-hold">Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTransportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="transport-pending">Pending</Badge>;
      case "in-transit":
        return <Badge className="transport-in-transit">In Transit</Badge>;
      case "delivered":
        return <Badge className="transport-delivered">Delivered</Badge>;
      case "not-applicable":
        return <Badge variant="outline">N/A</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Payable</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Transport Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.projectName}</TableCell>
              <TableCell>{payment.companyName}</TableCell>
              <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{payment.payableAmount.toLocaleString()}</TableCell>
              <TableCell>{getPaymentStatusBadge(payment.paymentStatus)}</TableCell>
              <TableCell>{getTransportStatusBadge(payment.transportStatus)}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell className="text-right">
                <Link to={`/payments/${payment.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentPaymentsTable;
