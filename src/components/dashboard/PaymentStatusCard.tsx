
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PaymentStatusCardProps {
  title: string;
  amount: number;
  total: number;
  percent: number;
  variant: "paid" | "partial" | "unpaid" | "pending";
  icon: React.ReactNode;
}

const PaymentStatusCard = ({ 
  title, 
  amount, 
  total,
  percent, 
  variant, 
  icon 
}: PaymentStatusCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "paid":
        return "text-green-700 bg-green-50";
      case "partial":
        return "text-yellow-700 bg-yellow-50";
      case "unpaid":
        return "text-red-700 bg-red-50";
      case "pending":
        return "text-blue-700 bg-blue-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getProgressColor = () => {
    switch (variant) {
      case "paid":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "unpaid":
        return "bg-red-500";
      case "pending":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className={`p-2 rounded-full ${getVariantStyles()}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{amount.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {percent}% of ₹{total.toLocaleString()}
        </div>
        <Progress 
          value={percent} 
          className="h-2 mt-2" 
          indicatorClassName={getProgressColor()} 
        />
      </CardContent>
    </Card>
  );
};

export default PaymentStatusCard;
