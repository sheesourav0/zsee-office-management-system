
import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { Box, VStack, HStack, Flex, Text } from "@chakra-ui/react";
import { Button } from "@/components/chakra/Button";
import { Avatar, AvatarFallback } from "@/components/chakra/Avatar";
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
  Menu
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        w={sidebarOpen ? "250px" : "60px"}
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        transition="width 0.2s"
      >
        <VStack gap={0} h="full">
          {/* Header */}
          <Box p={4} borderBottom="1px solid" borderColor="gray.200" w="full">
            <Flex align="center" justify="center">
              {sidebarOpen && (
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  ZSEE Management
                </Text>
              )}
            </Flex>
          </Box>
          
          {/* Navigation */}
          <Box p={2} flex={1} w="full">
            <VStack gap={1}>
              {navItems.map((item) => (
                <Link to={item.path} key={item.path} style={{ width: '100%' }}>
                  <Button
                    variant={location.pathname === item.path ? "solid" : "ghost"}
                    w="full"
                    justifyContent={sidebarOpen ? "flex-start" : "center"}
                    leftIcon={sidebarOpen ? <item.icon size={16} /> : undefined}
                  >
                    {!sidebarOpen && <item.icon size={16} />}
                    {sidebarOpen && item.label}
                  </Button>
                </Link>
              ))}
              
              {isSuperAdmin && (
                <Link to="/user-management" style={{ width: '100%' }}>
                  <Button
                    variant={location.pathname === "/user-management" ? "solid" : "ghost"}
                    w="full"
                    justifyContent={sidebarOpen ? "flex-start" : "center"}
                    leftIcon={sidebarOpen ? <UserPlus size={16} /> : undefined}
                  >
                    {!sidebarOpen && <UserPlus size={16} />}
                    {sidebarOpen && "User Management"}
                  </Button>
                </Link>
              )}
            </VStack>
          </Box>
          
          {/* Footer */}
          {user && (
            <Box p={4} borderTop="1px solid" borderColor="gray.200" w="full">
              <VStack gap={2}>
                {sidebarOpen && (
                  <HStack gap={2} p={2} w="full">
                    <Avatar>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium">{user.name}</Text>
                      <Text fontSize="xs" color="gray.500">{user.email}</Text>
                      {user.role && (
                        <Text fontSize="xs" bg="blue.100" color="blue.700" rounded="full" px={2} py={0.5} mt={1}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout} 
                  w="full"
                  leftIcon={sidebarOpen ? <LogOut size={16} /> : undefined}
                >
                  {!sidebarOpen && <LogOut size={16} />}
                  {sidebarOpen && "Logout"}
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} overflow="auto">
        <Box h={16} borderBottom="1px solid" borderColor="gray.200" px={6} display="flex" alignItems="center">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={16} />
          </Button>
          <Text fontSize="lg" fontWeight="medium" ml={4}>
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/projects" && "Projects"}
            {location.pathname === "/department-projects" && "Department Projects"}
            {location.pathname === "/payments" && "Payments"}
            {location.pathname === "/transportation" && "Transportation"}
            {location.pathname === "/vendors" && "Vendors"}
            {location.pathname === "/reports" && "Reports"}
            {location.pathname === "/settings" && "Settings"}
            {location.pathname === "/user-management" && "User Management"}
          </Text>
        </Box>
        <Box p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

const AppLayout = () => {
  const [user, setUser] = useState<any>(null);
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

  return <MainNav />;
};

export default AppLayout;
