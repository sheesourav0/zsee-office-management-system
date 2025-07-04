
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/features/layout/components/MainLayout";
import LoginPage from "@/features/auth/components/LoginPage";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import DepartmentProjects from "@/pages/DepartmentProjects";
import Payments from "@/pages/Payments";
import ProjectBilling from "@/pages/ProjectBilling";
import PurchaseBilling from "@/pages/PurchaseBilling";
import Transportation from "@/pages/Transportation";
import Vendors from "@/pages/Vendors";
import Expenses from "@/pages/Expenses";
import Billing from "@/pages/Billing";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import Settings from "@/pages/Settings";
import UserManagementPage from "@/features/users/pages/UserManagementPage";
import PaymentDetailView from "@/features/payments/components/PaymentDetailView";
import TeamManagement from "@/pages/TeamManagement";
import NotFound from "@/pages/NotFound";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const PaymentDetailWrapper = () => {
  const navigate = useNavigate();
  // Get payment ID from URL params in a real implementation
  const paymentId = "1"; // Placeholder
  
  return (
    <PaymentDetailView 
      paymentId={paymentId} 
      onBack={() => navigate("/payments")} 
    />
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="department-projects" element={<DepartmentProjects />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/:id" element={<PaymentDetailWrapper />} />
            <Route path="project-billing" element={<ProjectBilling />} />
            <Route path="purchase-billing" element={<PurchaseBilling />} />
            <Route path="transportation" element={<Transportation />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="billing" element={<Billing />} />
            <Route path="team-management" element={<TeamManagement />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="user-management" element={<UserManagementPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
