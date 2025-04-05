
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
  LogOut 
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
    { icon: FileText, label: "Payments", path: "/payments" },
    { icon: Truck, label: "Transportation", path: "/transportation" },
    { icon: Users, label: "Vendors", path: "/vendors" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-primary">ConstructTrack</h1>
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
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate]);

  // If no user found and not already on login page, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <MainNav />
        <div className="flex-1 overflow-auto">
          <div className="h-16 border-b flex items-center px-6">
            <SidebarTrigger />
            <h2 className="text-lg font-medium ml-4">
              {location.pathname === "/dashboard" && "Dashboard"}
              {location.pathname === "/projects" && "Projects"}
              {location.pathname === "/payments" && "Payments"}
              {location.pathname === "/transportation" && "Transportation"}
              {location.pathname === "/vendors" && "Vendors"}
              {location.pathname === "/reports" && "Reports"}
              {location.pathname === "/settings" && "Settings"}
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
