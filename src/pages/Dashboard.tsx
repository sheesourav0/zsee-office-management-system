
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { CircleDollarSign, CreditCard, Clock, AlertCircle } from "lucide-react";
import PaymentStatusCard from "@/components/dashboard/PaymentStatusCard";
import RecentPaymentsTable from "@/components/dashboard/RecentPaymentsTable";
import ProjectStatusCard from "@/components/dashboard/ProjectStatusCard";

// Simulated data - in a real app, this would come from an API
const generateMockData = () => {
  const recentPayments = [
    {
      id: "1",
      projectName: "Piyong IoT(Namsal)",
      companyName: "King Longkai",
      amount: 300000,
      payableAmount: 300000,
      paymentStatus: "unpaid",
      transportStatus: "pending",
      date: "2023-04-15"
    },
    {
      id: "2",
      projectName: "Sample Testing",
      companyName: "BMP SYSTEMS",
      amount: 81410,
      payableAmount: 81410,
      paymentStatus: "paid",
      transportStatus: "delivered",
      date: "2023-04-12"
    },
    {
      id: "3",
      projectName: "YACHULI",
      companyName: "P.R.S ENTERPRISE",
      amount: 76591,
      payableAmount: 76591,
      paymentStatus: "paid",
      transportStatus: "delivered",
      date: "2023-04-10"
    },
    {
      id: "4",
      projectName: "YACHULI",
      companyName: "SKY MARKETING",
      amount: 248355,
      payableAmount: 248355,
      paymentStatus: "unpaid",
      transportStatus: "not-applicable",
      date: "2023-04-08"
    },
    {
      id: "5",
      projectName: "Amni WTP",
      companyName: "Agmatic Technologies",
      amount: 2542324,
      payableAmount: 1406679,
      paymentStatus: "partial",
      transportStatus: "in-transit",
      date: "2023-04-05"
    }
  ];

  const projectStatus = [
    {
      name: "Amni WTP",
      completionPercentage: 65,
      totalPayments: 7500000,
      pendingPayments: 2625000
    },
    {
      name: "YACHULI",
      completionPercentage: 80,
      totalPayments: 3500000,
      pendingPayments: 700000
    },
    {
      name: "Sample Testing",
      completionPercentage: 100,
      totalPayments: 450000,
      pendingPayments: 0
    },
    {
      name: "Piyong IoT",
      completionPercentage: 30,
      totalPayments: 1200000,
      pendingPayments: 840000
    }
  ];

  return { recentPayments, projectStatus };
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeframe, setTimeframe] = useState("10d");
  const [data, setData] = useState<any>(generateMockData());

  useEffect(() => {
    // In a real app, this would fetch data from API based on the timeframe
    setData(generateMockData());
  }, [timeframe, startDate, endDate]);

  // Calculate payment statistics
  const totalPayments = data.recentPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
  const paidAmount = data.recentPayments
    .filter((p: any) => p.paymentStatus === "paid")
    .reduce((sum: number, payment: any) => sum + payment.amount, 0);
  const partialAmount = data.recentPayments
    .filter((p: any) => p.paymentStatus === "partial")
    .reduce((sum: number, payment: any) => sum + payment.payableAmount, 0);
  const unpaidAmount = data.recentPayments
    .filter((p: any) => p.paymentStatus === "unpaid")
    .reduce((sum: number, payment: any) => sum + payment.amount, 0);

  const paidPercent = Math.round((paidAmount / totalPayments) * 100);
  const partialPercent = Math.round((partialAmount / totalPayments) * 100);
  const unpaidPercent = Math.round((unpaidAmount / totalPayments) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="10d" value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="10d">10 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="custom" className="mt-2">
              <div className="flex gap-2">
                <DatePicker date={startDate} setDate={setStartDate} placeholder="Start date" />
                <DatePicker date={endDate} setDate={setEndDate} placeholder="End date" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PaymentStatusCard 
          title="Total Paid" 
          amount={paidAmount} 
          total={totalPayments}
          percent={paidPercent}
          variant="paid" 
          icon={<CircleDollarSign className="h-4 w-4" />} 
        />
        <PaymentStatusCard 
          title="Partially Paid" 
          amount={partialAmount} 
          total={totalPayments}
          percent={partialPercent}
          variant="partial" 
          icon={<CreditCard className="h-4 w-4" />} 
        />
        <PaymentStatusCard 
          title="Unpaid" 
          amount={unpaidAmount} 
          total={totalPayments}
          percent={unpaidPercent}
          variant="unpaid" 
          icon={<Clock className="h-4 w-4" />} 
        />
        <PaymentStatusCard 
          title="Payments Due Soon" 
          amount={450000} 
          total={1000000}
          percent={45}
          variant="pending" 
          icon={<AlertCircle className="h-4 w-4" />} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Overview of the latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPaymentsTable payments={data.recentPayments} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Project Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.projectStatus.map((project: any, index: number) => (
            <ProjectStatusCard 
              key={index}
              name={project.name}
              completionPercentage={project.completionPercentage}
              totalPayments={project.totalPayments}
              pendingPayments={project.pendingPayments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
