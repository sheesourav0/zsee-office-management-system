
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Plus, Pencil, Trash, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { permissions, RolePermission } from "@/lib/roles";
import { 
  Policy, 
  getPoliciesFromStorage, 
  savePolicyToStorage, 
  deletePolicyFromStorage,
  getUserPolicyAssignments 
} from "@/lib/policies";

const PolicyManagement = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isNewPolicy, setIsNewPolicy] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [policyDescription, setPolicyDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = () => {
    const storedPolicies = getPoliciesFromStorage();
    setPolicies(storedPolicies);
  };

  const handleEditPolicy = (policy: Policy) => {
    setCurrentPolicy(policy);
    setPolicyName(policy.name);
    setPolicyDescription(policy.description);
    setSelectedPermissions([...policy.permissions]);
    setIsNewPolicy(false);
    setIsPolicyDialogOpen(true);
  };

  const handleAddNewPolicy = () => {
    setCurrentPolicy(null);
    setPolicyName("");
    setPolicyDescription("");
    setSelectedPermissions([]);
    setIsNewPolicy(true);
    setIsPolicyDialogOpen(true);
  };

  const handleSavePolicy = () => {
    try {
      if (!policyName || !policyDescription) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (selectedPermissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      if (isNewPolicy) {
        const policyId = policyName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        const newPolicy: Policy = {
          id: policyId,
          name: policyName,
          description: policyDescription,
          permissions: selectedPermissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        savePolicyToStorage(newPolicy);
        toast.success("Policy created successfully");
      } else if (currentPolicy) {
        const updatedPolicy: Policy = {
          ...currentPolicy,
          name: policyName,
          description: policyDescription,
          permissions: selectedPermissions,
          updatedAt: new Date().toISOString(),
        };

        savePolicyToStorage(updatedPolicy);
        toast.success("Policy updated successfully");
      }

      loadPolicies();
      setIsPolicyDialogOpen(false);
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error("An error occurred while saving the policy");
    }
  };

  const handleDeletePolicy = (policyId: string) => {
    try {
      // Check if policy is in use
      const assignments = getUserPolicyAssignments();
      const isInUse = assignments.some(a => a.policyId === policyId);
      
      if (isInUse) {
        toast.error("Cannot delete policy that is assigned to users");
        return;
      }

      // Check if it's a default policy
      if (policyId.includes('admin-policy') || policyId.includes('manager-policy') || policyId.includes('viewer-policy')) {
        toast.error("Default policies cannot be deleted");
        return;
      }

      deletePolicyFromStorage(policyId);
      loadPolicies();
      toast.success("Policy deleted successfully");
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast.error("An error occurred while deleting the policy");
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

  const getAssignedUsersCount = (policyId: string) => {
    const assignments = getUserPolicyAssignments();
    return assignments.filter(a => a.policyId === policyId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Policy-Based Permission System</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage policies with specific permissions that can be assigned to users
          </p>
        </div>
        <Button onClick={handleAddNewPolicy}>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map((policy) => {
          const assignedUsers = getAssignedUsersCount(policy.id);
          return (
            <Card key={policy.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{policy.name}</CardTitle>
                    <CardDescription className="text-sm">{policy.description}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditPolicy(policy)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeletePolicy(policy.id)}
                      disabled={policy.id.includes('admin-policy') || policy.id.includes('manager-policy') || policy.id.includes('viewer-policy')}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    {policy.permissions.length} permissions
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Users className="h-3 w-3 mr-1" />
                    {assignedUsers} users
                  </Badge>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {policy.permissions.slice(0, 3).map((permId) => (
                    <div key={permId} className="text-xs text-muted-foreground">
                      • {permissions[permId]?.name}
                    </div>
                  ))}
                  {policy.permissions.length > 3 && (
                    <div className="text-xs text-muted-foreground font-medium">
                      ... and {policy.permissions.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewPolicy ? "Create New Policy" : "Edit Policy"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input 
                  id="policy-name" 
                  value={policyName} 
                  onChange={(e) => setPolicyName(e.target.value)} 
                  placeholder="e.g. Project Manager Policy"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="policy-description">Description</Label>
                <Textarea 
                  id="policy-description" 
                  value={policyDescription} 
                  onChange={(e) => setPolicyDescription(e.target.value)} 
                  placeholder="Brief description of this policy's purpose and scope"
                  rows={3}
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
            <Button variant="outline" onClick={() => setIsPolicyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePolicy}>
              {isNewPolicy ? "Create Policy" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PolicyManagement;
