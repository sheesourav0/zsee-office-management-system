
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/chakra/Card";
import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@/components/chakra/Tabs";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Badge } from "@/components/chakra/Badge";
import { Plus, Search, UserPlus, Shield, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { toast } from "@/hooks/use-toast";
import UserManagementPage from "@/features/users/pages/UserManagementPage";
import AddUserForm from "@/components/users/AddUserForm";
import UsersList from "@/components/users/UsersList";
import RolesManagement from "@/components/users/RolesManagement";
import PolicyManagement from "@/components/users/PolicyManagement";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@company.com",
      role: "Administrator",
      department: "IT",
      status: "active",
      joinDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "Project Manager",
      department: "Engineering",
      status: "active",
      joinDate: "2023-02-20"
    }
  ]);

  const handleAddUser = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleUserAdded = () => {
    setIsAddUserDialogOpen(false);
    toast.success("User added successfully!");
  };

  const handleEditUser = (user: User) => {
    toast.info("Edit user functionality coming soon!");
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("User deleted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabList className="grid w-full grid-cols-4">
          <Tab value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </Tab>
          <Tab value="database" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Database Users
          </Tab>
          <Tab value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </Tab>
          <Tab value="policies" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Policies
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="users">
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
                <CardDescription>Manage application users and their access</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersList 
                  users={users}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="database">
            <UserManagementPage />
          </TabPanel>

          <TabPanel value="roles">
            <RolesManagement />
          </TabPanel>

          <TabPanel value="policies">
            <PolicyManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <AddUserForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
