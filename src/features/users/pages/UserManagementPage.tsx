
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddUserForm from "@/components/users/AddUserForm";
import UsersList from "@/components/users/UsersList";
import RolesManagement from "@/components/users/RolesManagement";
import ImportUsers from "@/components/users/ImportUsers";

const UserManagementPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles and permissions</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="import">Import Users</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>View and manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user with specified role and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <AddUserForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Create and manage roles with specific permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <RolesManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Users</CardTitle>
              <CardDescription>Import multiple users from Excel spreadsheet</CardDescription>
            </CardHeader>
            <CardContent>
              <ImportUsers />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
