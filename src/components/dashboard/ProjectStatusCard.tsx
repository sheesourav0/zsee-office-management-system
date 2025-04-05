
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectStatusCardProps {
  name: string;
  completionPercentage: number;
  totalPayments: number;
  pendingPayments: number;
}

const ProjectStatusCard = ({
  name,
  completionPercentage,
  totalPayments,
  pendingPayments,
}: ProjectStatusCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">Completion</span>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2 mb-4" />
        
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">₹{totalPayments.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Pending</p>
            <p className="font-medium">₹{pendingPayments.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
