
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
import { policyService, departmentService, userPolicyService } from "@/lib/supabase-services";

const userTypes = {
  'department-staff': {
    name: 'Department Staff',
    description: 'Regular employees working within a specific department',
    departmentSpecific: true,
    level: 'basic'
  },
  'department-manager': {
    name: 'Department Manager',
    description: 'Managers overseeing a specific department',
    departmentSpecific: true,
    level: 'manager'
  },
  'department-supervisor': {
    name: 'Department Supervisor',
    description: 'Senior staff with supervisory roles within a department',
    departmentSpecific: true,
    level: 'supervisor'
  },
  'global-admin': {
    name: 'Global Administrator',
    description: 'System administrators with cross-department access',
    departmentSpecific: false,
    level: 'admin'
  },
  'accountant': {
    name: 'Accountant',
    description: 'Financial specialist with cross-department financial access',
    departmentSpecific: false,
    level: 'specialist'
  },
  'hr-manager': {
    name: 'HR Manager',
    description: 'Human resources manager with user management access',
    departmentSpecific: false,
    level: 'specialist'
  },
  'viewer': {
    name: 'Viewer',
    description: 'Read-only access user for reports and monitoring',
    departmentSpecific: false,
    level: 'viewer'
  }
};

const DatabasePolicyManagement = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<any | null>(null);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isNewPolicy, setIsNewPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [policyDescription, setPolicyDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [policiesData, departmentsData] = await Promise.all([
        policyService.getAll(),
        departmentService.getAll()
      ]);
      setPolicies(policiesData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPolicy = (policy: any) => {
    setCurrentPolicy(policy);
    setPolicyName(policy.name);
    setPolicyDescription(policy.description);
    setSelectedPermissions([...policy.permissions]);
    setSelectedDepartment(policy.department_id || "");
    setSelectedUserType(policy.user_type);
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

  const handleSavePolicy = async () => {
    try {
      if (!policyName || !policyDescription || !selectedUserType) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (selectedPermissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      const userTypeInfo = userTypes[selectedUserType as keyof typeof userTypes];
      if (userTypeInfo?.departmentSpecific && !selectedDepartment) {
        toast.error("Please select a department for this user type");
        return;
      }

      setLoading(true);

      if (isNewPolicy) {
        const policyId = policyName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        const newPolicy = {
          id: policyId,
          name: policyName,
          description: policyDescription,
          permissions: selectedPermissions,
          department_id: userTypeInfo?.departmentSpecific ? selectedDepartment : null,
          user_type: selectedUserType,
        };

        await policyService.create(newPolicy);
        toast.success("Policy created successfully");
      } else if (currentPolicy) {
        const updatedPolicy = {
          name: policyName,
          description: policyDescription,
          permissions: selectedPermissions,
          department_id: userTypeInfo?.departmentSpecific ? selectedDepartment : null,
          user_type: selectedUserType,
        };

        await policyService.update(currentPolicy.id, updatedPolicy);
        toast.success("Policy updated successfully");
      }

      loadData();
      setIsPolicyDialogOpen(false);
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error("An error occurred while saving the policy");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    try {
      await policyService.delete(policyId);
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

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "Global";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const groupedPolicies = policies.reduce((acc, policy) => {
    const key = policy.department_id || 'global';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(policy);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading policies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Database Policy Management</h3>
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
              const userTypeInfo = userTypes[policy.user_type as keyof typeof userTypes];
              
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
                      <Badge variant="secondary">
                        {userTypeInfo?.name}
                      </Badge>
                    </div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {policy.permissions.slice(0, 3).map((permId: string) => (
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
            <Button onClick={handleSavePolicy} disabled={loading}>
              {loading ? 'Saving...' : (isNewPolicy ? "Create Policy" : "Save Changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabasePolicyManagement;
