import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
  Layers
} from "lucide-react";
import { toast } from "sonner";

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

const AppLayout = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        navigate("/login", { replace: true });
      }
    };
    
    checkAuth();
    
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/projects") return "Projects";
    if (path === "/department-projects") return "Department Projects";
    if (path === "/payments") return "Payments";
    if (path === "/transportation") return "Transportation";
    if (path === "/vendors") return "Vendors";
    if (path === "/reports") return "Reports";
    if (path === "/settings") return "Settings";
    if (path === "/user-management") return "User Management";
    return "";
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <MainNav />
        <div className="flex-1 overflow-auto">
          <div className="h-16 border-b flex items-center px-6">
            <SidebarTrigger />
            <h2 className="text-lg font-medium ml-4">
              {getPageTitle()}
            </h2>
          </div>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
