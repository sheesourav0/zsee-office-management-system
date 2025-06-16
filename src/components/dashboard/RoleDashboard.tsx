
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { PermissionService } from '@/lib/permissions';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { 
  Users, 
  FolderOpen, 
  CreditCard, 
  Building, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const RoleDashboard = () => {
  const { user, userPermissions } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    projects: { total: 0, active: 0, completed: 0 },
    payments: { total: 0, pending: 0, approved: 0 },
    users: { total: 0, active: 0 },
    vendors: { total: 0, active: 0 }
  });

  useEffect(() => {
    // Mock dashboard data - in real app, fetch from API based on user permissions
    setDashboardData({
      projects: { total: 12, active: 8, completed: 4 },
      payments: { total: 45, pending: 12, approved: 33 },
      users: { total: 25, active: 23 },
      vendors: { total: 18, active: 16 }
    });
  }, []);

  const getWelcomeMessage = () => {
    if (!userPermissions) return "Welcome to the Office Management System";
    
    switch (userPermissions.userType) {
      case 'global-admin':
        return "Welcome, System Administrator";
      case 'department-manager':
        return "Welcome, Department Manager";
      case 'department-supervisor':
        return "Welcome, Project Manager";
      case 'accountant':
        return "Welcome, Finance Team";
      case 'hr-manager':
        return "Welcome, HR Manager";
      default:
        return "Welcome to your Dashboard";
    }
  };

  const getDepartmentContext = () => {
    if (userPermissions?.departmentId) {
      return `Managing ${userPermissions.departmentId.toUpperCase()} Department`;
    }
    if (userPermissions?.permissions.includes('read:all-departments')) {
      return "Cross-Department Access";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
        <p className="text-blue-100 mt-1">{user?.email}</p>
        {getDepartmentContext() && (
          <p className="text-blue-200 text-sm mt-2">{getDepartmentContext()}</p>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PermissionGuard permission="read:projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.projects.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.projects.active} active, {dashboardData.projects.completed} completed
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="read:payments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.payments.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.payments.pending} pending approval
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="read:users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.users.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.users.active} active users
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="read:vendors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendors</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.vendors.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.vendors.active} active vendors
              </p>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Role-specific Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Manager Section */}
        <PermissionGuard permissions={['read:projects', 'update:projects']}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                My Projects
              </CardTitle>
              <CardDescription>Projects under your management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Water Pipeline Phase 1</span>
                  </div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Road Construction</span>
                  </div>
                  <span className="text-sm text-yellow-600">Planning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Payment Manager Section */}
        <PermissionGuard permission="approve:payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Payments awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">₹2,50,000</span>
                  </div>
                  <span className="text-sm text-red-600">High Priority</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">₹1,75,000</span>
                  </div>
                  <span className="text-sm text-orange-600">Regular</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Department Manager Section */}
        <PermissionGuard permissions={['manage:team', 'read:users']}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Overview
              </CardTitle>
              <CardDescription>Your department performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Team Members</span>
                  <span className="text-sm">12 Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Projects</span>
                  <span className="text-sm">8 In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Budget Utilization</span>
                  <span className="text-sm text-green-600">68%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Reports Section */}
        <PermissionGuard permission="read:reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Project Completion Rate</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-sm text-green-600">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Budget Efficiency</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-sm text-green-600">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Team Productivity</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-sm text-blue-600">78%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default RoleDashboard;
