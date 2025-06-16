
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { policyService, departmentService } from "@/lib/supabase-services";
import { permissions } from "@/lib/roles";

const DatabasePolicyManagement = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    permissions: [] as string[],
    department_id: "",
    user_type: ""
  });

  const userTypes = [
    { value: "department-staff", label: "Department Staff" },
    { value: "department-supervisor", label: "Department Supervisor" },
    { value: "department-manager", label: "Department Manager" },
    { value: "global-admin", label: "Global Administrator" },
    { value: "accountant", label: "Accountant" },
    { value: "hr-manager", label: "HR Manager" },
    { value: "viewer", label: "Viewer" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [policiesData, deptData] = await Promise.all([
        policyService.getAll(),
        departmentService.getAll()
      ]);
      
      setPolicies(policiesData || []);
      setDepartments(deptData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const policyData = {
        ...formData,
        department_id: formData.department_id || null,
        id: formData.id || `${formData.user_type}-${formData.department_id || 'global'}-${Date.now()}`
      };

      if (editingPolicy) {
        await policyService.update(editingPolicy.id, policyData);
        toast.success('Policy updated successfully');
      } else {
        await policyService.create(policyData);
        toast.success('Policy created successfully');
      }

      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving policy:', error);
      toast.error(error.message || 'Failed to save policy');
    }
  };

  const handleDelete = async (policyId: string) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;
    
    try {
      await policyService.delete(policyId);
      toast.success('Policy deleted successfully');
      loadData();
    } catch (error: any) {
      console.error('Error deleting policy:', error);
      toast.error(error.message || 'Failed to delete policy');
    }
  };

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setFormData({
      id: policy.id,
      name: policy.name,
      description: policy.description || "",
      permissions: policy.permissions || [],
      department_id: policy.department_id || "",
      user_type: policy.user_type
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      permissions: [],
      department_id: "",
      user_type: ""
    });
    setEditingPolicy(null);
    setShowAddForm(false);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading policies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Policy Management</h3>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Policy
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPolicy ? 'Edit Policy' : 'Create New Policy'}</CardTitle>
            <CardDescription>
              Define permissions and access levels for user types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Policy Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_type">User Type</Label>
                  <Select 
                    value={formData.user_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, user_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select 
                    value={formData.department_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department (leave empty for global)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Global Policy</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {Object.entries(permissions).map(([key, description]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData.permissions.includes(key)}
                        onCheckedChange={(checked) => handlePermissionChange(key, checked as boolean)}
                      />
                      <Label htmlFor={key} className="text-sm">
                        {key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPolicy ? 'Update Policy' : 'Create Policy'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No policies found. Create your first policy to get started.
                </TableCell>
              </TableRow>
            ) : (
              policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{policy.user_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {policy.departments ? (
                      <Badge variant="secondary">
                        {policy.departments.code}
                      </Badge>
                    ) : (
                      <Badge variant="default">Global</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {policy.permissions?.length || 0} permissions
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(policy)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(policy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DatabasePolicyManagement;
