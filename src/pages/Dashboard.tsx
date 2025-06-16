import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { CircleDollarSign, CreditCard, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PaymentStatusCard from "@/components/dashboard/PaymentStatusCard";
import RecentPaymentsTable from "@/components/dashboard/RecentPaymentsTable";
import ProjectStatusCard from "@/components/dashboard/ProjectStatusCard";
import { BillingProject, ProjectPayment } from "@/features/billing/types/billingTypes";

const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeframe, setTimeframe] = useState("10d");
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);

  useEffect(() => {
    loadData();
  }, [timeframe, startDate, endDate]);

  const loadData = () => {
    // Load actual data from Project Billing system
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    const storedPayments = JSON.parse(localStorage.getItem('billing_payments') || '[]');
    setProjects(storedProjects);
    setPayments(storedPayments);
  };

  // Calculate comprehensive payment statistics from actual project data
  const calculatePaymentStats = () => {
    const totalAmount = projects.reduce((sum, project) => sum + project.totalCost, 0);
    const totalReceived = projects.reduce((sum, project) => sum + project.totalReceived, 0);
    const totalPending = projects.reduce((sum, project) => sum + project.totalPending, 0);
    
    // Calculate partial payments (projects with some payment but not fully paid)
    const partialAmount = projects
      .filter(project => project.totalReceived > 0 && project.totalPending > 0)
      .reduce((sum, project) => sum + project.totalReceived, 0);
    
    // Calculate unpaid (projects with no payments)
    const unpaidAmount = projects
      .filter(project => project.totalReceived === 0)
      .reduce((sum, project) => sum + project.totalCost, 0);
    
    // Calculate fully paid
    const paidAmount = projects
      .filter(project => project.totalPending === 0 && project.totalReceived > 0)
      .reduce((sum, project) => sum + project.totalReceived, 0);

    // Calculate due soon (projects with high completion but pending payments)
    const dueSoonAmount = projects
      .filter(project => {
        const progress = project.totalCost > 0 ? (project.totalReceived / project.totalCost) * 100 : 0;
        return progress >= 50 && project.totalPending > 0;
      })
      .reduce((sum, project) => sum + project.totalPending, 0);

    return {
      totalAmount,
      paidAmount,
      partialAmount,
      unpaidAmount,
      dueSoonAmount,
      totalReceived,
      totalPending
    };
  };

  const stats = calculatePaymentStats();

  // Convert projects to recent payments format for table
  const getRecentPayments = () => {
    return projects.map((project, index) => {
      // Ensure paymentStatus matches the expected union type
      let paymentStatus: "paid" | "partial" | "unpaid" | "hold";
      if (project.totalPending === 0) {
        paymentStatus = "paid";
      } else if (project.totalReceived > 0) {
        paymentStatus = "partial";
      } else {
        paymentStatus = "unpaid";
      }

      // Ensure transportStatus matches the expected union type
      let transportStatus: "pending" | "in-transit" | "delivered" | "not-applicable";
      if (project.status === "completed") {
        transportStatus = "delivered";
      } else if (project.status === "active") {
        transportStatus = "in-transit";
      } else {
        transportStatus = "pending";
      }

      return {
        id: project.id,
        projectName: project.name,
        companyName: project.projectOwnerDetails || project.projectOwner,
        amount: project.totalCost,
        payableAmount: project.totalPending,
        paymentStatus,
        transportStatus,
        date: new Date(project.createdAt).toISOString().split('T')[0]
      };
    });
  };

  const recentPayments = getRecentPayments();

  // Calculate percentages
  const paidPercent = stats.totalAmount > 0 ? Math.round((stats.paidAmount / stats.totalAmount) * 100) : 0;
  const partialPercent = stats.totalAmount > 0 ? Math.round((stats.partialAmount / stats.totalAmount) * 100) : 0;
  const unpaidPercent = stats.totalAmount > 0 ? Math.round((stats.unpaidAmount / stats.totalAmount) * 100) : 0;
  const dueSoonPercent = stats.totalAmount > 0 ? Math.round((stats.dueSoonAmount / stats.totalAmount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Management Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive overview of all projects, payments, and activities</p>
        </div>
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
        <Link to="/project-billing?tab=payments">
          <PaymentStatusCard 
            title="Total Paid" 
            amount={stats.paidAmount} 
            total={stats.totalAmount}
            percent={paidPercent}
            variant="paid" 
            icon={<CircleDollarSign className="h-4 w-4" />} 
          />
        </Link>
        <Link to="/project-billing?tab=payments">
          <PaymentStatusCard 
            title="Partially Paid" 
            amount={stats.partialAmount} 
            total={stats.totalAmount}
            percent={partialPercent}
            variant="partial" 
            icon={<CreditCard className="h-4 w-4" />} 
          />
        </Link>
        <Link to="/project-billing?tab=payments">
          <PaymentStatusCard 
            title="Unpaid" 
            amount={stats.unpaidAmount} 
            total={stats.totalAmount}
            percent={unpaidPercent}
            variant="unpaid" 
            icon={<Clock className="h-4 w-4" />} 
          />
        </Link>
        <Link to="/project-billing?tab=payments">
          <PaymentStatusCard 
            title="Payments Due Soon" 
            amount={stats.dueSoonAmount} 
            total={stats.totalAmount}
            percent={dueSoonPercent}
            variant="pending" 
            icon={<AlertCircle className="h-4 w-4" />} 
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Project Activities</CardTitle>
              <CardDescription>Overview of the latest project payment activities</CardDescription>
            </div>
            <Link to="/payments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Payments →
            </Link>
          </CardHeader>
          <CardContent>
            <RecentPaymentsTable payments={recentPayments.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Project Status Overview</h2>
          <Link to="/project-billing" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Manage Projects →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {projects.slice(0, 4).map((project) => {
            const completionPercentage = project.totalCost > 0 ? 
              Math.round(((project.totalCost - project.totalPending) / project.totalCost) * 100) : 0;
            
            return (
              <Link key={project.id} to={`/project-billing?project=${project.id}`}>
                <ProjectStatusCard 
                  name={project.name}
                  completionPercentage={completionPercentage}
                  totalPayments={project.totalCost}
                  pendingPayments={project.totalPending}
                />
              </Link>
            );
          })}
        </div>
        {projects.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No projects found. Start by creating your first project.</p>
            <Link to="/project-billing">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create Project
              </button>
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/project-billing">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Project Billing</CardTitle>
              <CardDescription>Manage projects, payments, and billing</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/payments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Payment Management</CardTitle>
              <CardDescription>Track and manage all payments</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
