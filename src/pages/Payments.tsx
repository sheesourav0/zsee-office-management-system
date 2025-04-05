
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentFilterBar from "@/components/payments/PaymentFilterBar";
import RecentPaymentsTable from "@/components/dashboard/RecentPaymentsTable";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// Simulated data - in a real app, this would come from an API
const generateMockData = () => {
  const payments = [
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
    },
    {
      id: "6",
      projectName: "Amni WTP",
      companyName: "DIVYANSHU AUTOMATION",
      amount: 284286,
      payableAmount: 284286,
      paymentStatus: "unpaid",
      transportStatus: "pending",
      date: "2023-04-02"
    },
    {
      id: "7",
      projectName: "Amni WTP",
      companyName: "MEA",
      amount: 495111,
      payableAmount: 495111,
      paymentStatus: "unpaid",
      transportStatus: "pending",
      date: "2023-03-30"
    },
    {
      id: "8",
      projectName: "Amni WTP",
      companyName: "Ligths Technologies",
      amount: 142955,
      payableAmount: 38591,
      paymentStatus: "partial",
      transportStatus: "in-transit",
      date: "2023-03-28"
    }
  ];

  return payments;
};

const Payments = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const allPayments = generateMockData();
    setPayments(allPayments);
    filterPayments(allPayments, currentTab, filters);
  }, [currentTab, filters]);

  const filterPayments = (payments: any[], tab: string, filters: any) => {
    // First filter by tab
    let result = [...payments];
    
    if (tab !== "all") {
      result = result.filter(payment => payment.paymentStatus === tab);
    }
    
    // Then apply additional filters
    if (filters.project) {
      result = result.filter(payment => payment.projectName === filters.project);
    }
    
    if (filters.vendor) {
      result = result.filter(payment => payment.companyName.includes(filters.vendor));
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(payment => new Date(payment.date) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(payment => new Date(payment.date) <= toDate);
    }
    
    setFilteredPayments(result);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleAddPayment = () => {
    toast.info("Add payment functionality will be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button onClick={handleAddPayment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>Manage and track all project payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="hold">On Hold</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <PaymentFilterBar onFilterChange={handleFilterChange} />
          
          <RecentPaymentsTable payments={filteredPayments} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
