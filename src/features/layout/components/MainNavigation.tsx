
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Folder, 
  FileText, 
  Truck, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  UserPlus,
  Layers,
  Receipt
} from "lucide-react";
import { toast } from "sonner";

interface MainNavigationProps {
  user: any;
}

const MainNavigation = ({ user }: MainNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Folder, label: "Projects", path: "/projects" },
    { icon: Layers, label: "Department Projects", path: "/department-projects" },
    { icon: FileText, label: "Payments", path: "/payments" },
    { icon: Receipt, label: "Purchase & Billing", path: "/purchase-billing" },
    { icon: Truck, label: "Transportation", path: "/transportation" },
    { icon: Users, label: "Vendors", path: "/vendors" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isSuperAdmin = user && (user.role === "superadmin" || user.role === "admin");

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-primary">ZSEE Management</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          
          {isSuperAdmin && (
            <Link to="/user-management">
              <Button
                variant={location.pathname === "/user-management" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                User Management
              </Button>
            </Link>
          )}
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2">
              <Avatar>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
                {user.role && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 mt-1">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainNavigation;
