
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseAddUserForm from "@/components/users/DatabaseAddUserForm";
import DatabaseUsersList from "@/components/users/DatabaseUsersList";
import DatabasePolicyManagement from "@/components/users/DatabasePolicyManagement";
import ImportUsers from "@/components/users/ImportUsers";
import UserPolicyAssignment from "@/components/users/UserPolicyAssignment";
import { useState, useEffect } from "react";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // This is now handled by the database components
    setUsers([]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users, department-based policies and permissions with Supabase</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
          <TabsTrigger value="policies">Policy Management</TabsTrigger>
          <TabsTrigger value="assignments">Policy Assignments</TabsTrigger>
          <TabsTrigger value="import">Import Users</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>View and manage all users in the system with database integration</CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseUsersList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user with Supabase authentication and department assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseAddUserForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Database Policy Management</CardTitle>
              <CardDescription>Create and manage policies stored in Supabase with department-specific permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <DatabasePolicyManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>User Policy Assignments</CardTitle>
              <CardDescription>Assign database-stored policies to users for complete permission control</CardDescription>
            </CardHeader>
            <CardContent>
              <UserPolicyAssignment users={users} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Users</CardTitle>
              <CardDescription>Import multiple users from Excel spreadsheet with department assignments</CardDescription>
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
