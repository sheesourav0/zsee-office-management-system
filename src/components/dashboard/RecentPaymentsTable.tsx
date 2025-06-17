
import { Table } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Button } from "@/components/chakra/Button";
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
        <thead>
          <tr>
            <th>Project</th>
            <th>Company</th>
            <th className="text-right">Amount</th>
            <th className="text-right">Payable</th>
            <th>Payment Status</th>
            <th>Transport Status</th>
            <th>Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="font-medium">{payment.projectName}</td>
              <td>{payment.companyName}</td>
              <td className="text-right">₹{payment.amount.toLocaleString()}</td>
              <td className="text-right">₹{payment.payableAmount.toLocaleString()}</td>
              <td>{getPaymentStatusBadge(payment.paymentStatus)}</td>
              <td>{getTransportStatusBadge(payment.transportStatus)}</td>
              <td>{payment.date}</td>
              <td className="text-right">
                <Link to={`/payments/${payment.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RecentPaymentsTable;
