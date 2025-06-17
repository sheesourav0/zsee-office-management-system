
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Pencil, Trash, Shield, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { departmentService } from "@/lib/supabase-services";
import { permissions, RolePermission } from "@/lib/roles";
import { usePolicies, useCreatePolicy, useUpdatePolicy, useDeletePolicy } from "@/hooks/usePolicies";
import { CreatePolicy, UpdatePolicy, CreatePolicySchema, UpdatePolicySchema } from "@/lib/schemas/policy";

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
  const { data: policies = [], isLoading: policiesLoading } = usePolicies();
  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createPolicyMutation = useCreatePolicy();
  const updatePolicyMutation = useUpdatePolicy();
  const deletePolicyMutation = useDeletePolicy();

  const [currentPolicy, setCurrentPolicy] = useState<any | null>(null);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isNewPolicy, setIsNewPolicy] = useState(false);

  const form = useForm<CreatePolicy | UpdatePolicy>({
    resolver: zodResolver(isNewPolicy ? CreatePolicySchema : UpdatePolicySchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      permissions: [],
      department_id: null,
      user_type: 'department-staff',
    },
  });

  const handleEditPolicy = (policy: any) => {
    setCurrentPolicy(policy);
    form.reset({
      id: policy.id,
      name: policy.name,
      description: policy.description,
      permissions: Array.isArray(policy.permissions) ? policy.permissions : [],
      department_id: policy.department_id,
      user_type: policy.user_type,
    });
    setIsNewPolicy(false);
    setIsPolicyDialogOpen(true);
  };

  const handleAddNewPolicy = () => {
    setCurrentPolicy(null);
    form.reset({
      id: "",
      name: "",
      description: "",
      permissions: [],
      department_id: null,
      user_type: 'department-staff',
    });
    setIsNewPolicy(true);
    setIsPolicyDialogOpen(true);
  };

  const onSubmit = (values: CreatePolicy | UpdatePolicy) => {
    if (isNewPolicy) {
      const policyId = values.name?.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const createData = { ...values, id: policyId } as CreatePolicy;
      createPolicyMutation.mutate(createData, {
        onSuccess: () => {
          setIsPolicyDialogOpen(false);
          form.reset();
        },
      });
    } else if (currentPolicy) {
      const updateData = { ...values, id: currentPolicy.id };
      updatePolicyMutation.mutate(updateData, {
        onSuccess: () => {
          setIsPolicyDialogOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleDeletePolicy = (policyId: string) => {
    deletePolicyMutation.mutate(policyId);
  };

  const togglePermission = (permissionId: string) => {
    const currentPermissions = form.getValues("permissions") || [];
    const updatedPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];
    
    form.setValue("permissions", updatedPermissions);
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

  if (policiesLoading || departmentsLoading) {
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
              const policyPermissions = Array.isArray(policy.permissions) ? policy.permissions : [];
              
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
                          disabled={deletePolicyMutation.isPending}
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
                        {policyPermissions.length} permissions
                      </Badge>
                      <Badge variant="secondary">
                        {userTypeInfo?.name}
                      </Badge>
                    </div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {policyPermissions.slice(0, 3).map((permId: string) => (
                        <div key={permId} className="text-xs text-muted-foreground">
                          • {permissions[permId]?.name}
                        </div>
                      ))}
                      {policyPermissions.length > 3 && (
                        <div className="text-xs text-muted-foreground font-medium">
                          ... and {policyPermissions.length - 3} more
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isNewPolicy && (
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. phed-manager-policy" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. PHED Manager Policy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief description of this policy's purpose and scope"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="user_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(userTypes).map(([key, type]) => (
                            <SelectItem key={key} value={key}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Global (No specific department)</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="mb-2 block">Permissions</Label>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  {Object.entries(groupPermissionsByCategory()).map(([category, perms]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <h4 className="text-sm font-semibold capitalize mb-3">{category} Permissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perms.map((permission) => {
                          const currentPermissions = form.watch("permissions") || [];
                          return (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <Checkbox 
                                id={permission.id}
                                checked={currentPermissions.includes(permission.id)}
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
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsPolicyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPolicyMutation.isPending || updatePolicyMutation.isPending}
                >
                  {createPolicyMutation.isPending || updatePolicyMutation.isPending 
                    ? 'Saving...' 
                    : (isNewPolicy ? "Create Policy" : "Save Changes")
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabasePolicyManagement;
