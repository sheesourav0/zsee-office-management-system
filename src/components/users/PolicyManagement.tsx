
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Plus, Pencil, Trash, Shield, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import { permissions, RolePermission } from "@/lib/roles";
import { 
  Policy, 
  Department,
  getPoliciesFromStorage, 
  savePolicyToStorage, 
  deletePolicyFromStorage,
  getUserPolicyAssignments,
  getDepartmentsFromStorage,
  userTypes 
} from "@/lib/policies";

const PolicyManagement = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isNewPolicy, setIsNewPolicy] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [policyDescription, setPolicyDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPolicies(getPoliciesFromStorage());
    setDepartments(getDepartmentsFromStorage());
  };

  const handleEditPolicy = (policy: Policy) => {
    setCurrentPolicy(policy);
    setPolicyName(policy.name);
    setPolicyDescription(policy.description);
    setSelectedPermissions([...policy.permissions]);
    setSelectedDepartment(policy.departmentId || "");
    setSelectedUserType(policy.userType);
    setIsNewPolicy(false);
    setIsPolicyDialogOpen(true);
  };

  const handleAddNewPolicy = () => {
    setCurrentPolicy(null);
    setPolicyName("");
    setPolicyDescription("");
    setSelectedPermissions([]);
    setSelectedDepartment("");
    setSelectedUserType("");
    setIsNewPolicy(true);
    setIsPolicyDialogOpen(true);
  };

  const handleSavePolicy = () => {
    try {
      if (!policyName || !policyDescription || !selectedUserType) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (selectedPermissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      // Validate department selection for department-specific user types
      const userTypeInfo = userTypes[selectedUserType as keyof typeof userTypes];
      if (userTypeInfo?.departmentSpecific && !selectedDepartment) {
        toast.error("Please select a department for this user type");
        return;
      }

      if (isNewPolicy) {
        const policyId = policyName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        const newPolicy: Policy = {
          id: policyId,
          name: policyName,
          description: policyDescription,
          permissions: selectedPermissions,
          departmentId: userTypeInfo?.departmentSpecific ? selectedDepartment : undefined,
          userType: selectedUserType as Policy['userType'],
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
          departmentId: userTypeInfo?.departmentSpecific ? selectedDepartment : undefined,
          userType: selectedUserType as Policy['userType'],
          updatedAt: new Date().toISOString(),
        };

        savePolicyToStorage(updatedPolicy);
        toast.success("Policy updated successfully");
      }

      loadData();
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

      deletePolicyFromStorage(policyId);
      loadData();
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

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "Global";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const groupedPolicies = policies.reduce((acc, policy) => {
    const key = policy.departmentId || 'global';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(policy);
    return acc;
  }, {} as Record<string, Policy[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Department-Based Policy Management</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage policies with department-specific or global permissions
          </p>
        </div>
        <Button onClick={handleAddNewPolicy}>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      {Object.entries(groupedPolicies).map(([groupKey, groupPolicies]) => (
        <div key={groupKey} className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h4 className="text-md font-medium">
              {groupKey === 'global' ? 'Global Policies' : getDepartmentName(groupKey)}
            </h4>
            <Badge variant="outline">{groupPolicies.length} policies</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupPolicies.map((policy) => {
              const assignedUsers = getAssignedUsersCount(policy.id);
              const userTypeInfo = userTypes[policy.userType];
              
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
                      <Badge variant="secondary">
                        {userTypeInfo?.name}
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
        </div>
      ))}

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
                  placeholder="e.g. PHED Manager Policy"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">User Type</Label>
                  <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(userTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUserType && userTypes[selectedUserType as keyof typeof userTypes]?.departmentSpecific && (
                  <div>
                    <Label className="mb-2 block">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
