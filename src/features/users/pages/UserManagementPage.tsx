
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseAddUserForm from "@/components/users/DatabaseAddUserForm";
import DatabaseUsersList from "@/components/users/DatabaseUsersList";
import DatabasePolicyManagement from "@/components/users/DatabasePolicyManagement";
import ImportUsers from "@/components/users/ImportUsers";
import DatabaseUserPolicyAssignment from "@/components/users/DatabaseUserPolicyAssignment";

const UserManagementPage = () => {
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
          <DatabaseUsersList />
        </TabsContent>
        <TabsContent value="add">
          <DatabaseAddUserForm />
        </TabsContent>
        <TabsContent value="policies">
          <DatabasePolicyManagement />
        </TabsContent>
        <TabsContent value="assignments">
          <DatabaseUserPolicyAssignment />
        </TabsContent>
        <TabsContent value="import">
          <ImportUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
