import { useState } from "react";
import { Button } from "@/components/chakra/Button";
import { Input } from "@/components/chakra/Input";
import { Label } from "@/components/chakra/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/chakra/Table";
import { Badge } from "@/components/chakra/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra/Card";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, Shield } from "lucide-react";
import { roles, permissions, Role, UserRole, RolePermission } from "@/lib/roles";

const RolesManagement = () => {
  const [systemRoles, setSystemRoles] = useState<Record<string, Role>>(roles);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isNewRole, setIsNewRole] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setSelectedPermissions([...role.permissions]);
    setIsNewRole(false);
    setIsRoleDialogOpen(true);
  };

  const handleAddNewRole = () => {
    setCurrentRole(null);
    setRoleName("");
    setRoleDescription("");
    setSelectedPermissions([]);
    setIsNewRole(true);
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    try {
      // Validate form
      if (!roleName || !roleDescription) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (selectedPermissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      if (isNewRole) {
        // Create role ID from name (lowercase, no spaces)
        const roleId = roleName.toLowerCase().replace(/\s+/g, '') as UserRole;
        
        // Check if role already exists
        if (systemRoles[roleId]) {
          toast.error("A role with this name already exists");
          return;
        }

        // Create new role
        const newRole: Role = {
          id: roleId,
          name: roleName,
          description: roleDescription,
          permissions: selectedPermissions,
        };

        // Add to roles
        setSystemRoles({ ...systemRoles, [roleId]: newRole });
        toast.success("Role created successfully");
      } else if (currentRole) {
        // Update existing role
        const updatedRole: Role = {
          ...currentRole,
          name: roleName,
          description: roleDescription,
          permissions: selectedPermissions,
        };

        // Update roles
        setSystemRoles({ 
          ...systemRoles, 
          [currentRole.id]: updatedRole 
        });
        toast.success("Role updated successfully");
      }

      // Close dialog
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("An error occurred while saving the role");
    }
  };

  const handleDeleteRole = (roleId: string) => {
    // Check if it's a default role
    if (roleId === "superadmin" || roleId === "admin" || roleId === "manager" || roleId === "viewer") {
      toast.error("Default roles cannot be deleted");
      return;
    }

    try {
      // Create a copy of roles without the deleted role
      const { [roleId]: deletedRole, ...remainingRoles } = systemRoles;
      setSystemRoles(remainingRoles);
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("An error occurred while deleting the role");
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prevPermissions => {
      if (prevPermissions.includes(permissionId)) {
        return prevPermissions.filter(id => id !== permissionId);
      } else {
        return [...prevPermissions, permissionId];
      }
    });
  };

  const groupPermissionsByCategory = () => {
    const categories: Record<string, RolePermission[]> = {};
    
    Object.values(permissions).forEach(permission => {
      const category = permission.id.split(':')[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(permission);
    });
    
    return categories;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">System Roles</h3>
        <Button onClick={handleAddNewRole}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(systemRoles).map((role) => (
          <Card key={role.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={role.id === "superadmin" || role.id === "admin" || role.id === "manager" || role.id === "viewer"}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex flex-wrap gap-1 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  {role.permissions.length} permissions
                </Badge>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {role.permissions.map((permId) => (
                  <div key={permId} className="text-xs text-muted-foreground">
                    {permissions[permId]?.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewRole ? "Create New Role" : "Edit Role"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input 
                  id="role-name" 
                  value={roleName} 
                  onChange={(e) => setRoleName(e.target.value)} 
                  placeholder="e.g. Project Manager"
                  disabled={!isNewRole && (
                    currentRole?.id === "superadmin" || 
                    currentRole?.id === "admin" || 
                    currentRole?.id === "manager" || 
                    currentRole?.id === "viewer"
                  )}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role-description">Description</Label>
                <Input 
                  id="role-description" 
                  value={roleDescription} 
                  onChange={(e) => setRoleDescription(e.target.value)} 
                  placeholder="Brief description of this role's responsibilities"
                />
              </div>

              <div>
                <Label className="mb-2 block">Permissions</Label>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  {Object.entries(groupPermissionsByCategory()).map(([category, perms]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <h4 className="text-sm font-semibold capitalize mb-3">{category} Permissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perms.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={permission.id}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                              disabled={
                                !isNewRole && 
                                currentRole?.id === "superadmin" && 
                                permission.id.includes("system")
                              }
                            />
                            <div className="space-y-1 leading-none">
                              <label 
                                htmlFor={permission.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.name}
                              </label>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {isNewRole ? "Create Role" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesManagement;
