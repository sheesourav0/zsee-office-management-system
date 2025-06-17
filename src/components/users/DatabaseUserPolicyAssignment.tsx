
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Shield, User, Building2 } from "lucide-react";
import { toast } from "sonner";
import { profileService, policyService, departmentService, userPolicyService } from "@/lib/supabase-services";

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

const DatabaseUserPolicyAssignment = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, policiesData, departmentsData] = await Promise.all([
        profileService.getAll(),
        policyService.getAll(),
        departmentService.getAll()
      ]);
      
      setUsers(usersData || []);
      setPolicies(policiesData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "Global";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const getAvailablePolicies = () => {
    if (!selectedUser) return [];
    
    // Filter policies based on selected department and user type compatibility
    return policies.filter(policy => {
      // If no department selected, show global policies only
      if (!selectedDepartment) {
        return !policy.department_id;
      }
      
      // Show policies for the selected department or global policies
      return !policy.department_id || policy.department_id === selectedDepartment;
    });
  };

  const handleAssignPolicies = async () => {
    if (!selectedUser || selectedPolicies.length === 0) {
      toast.error("Please select a user and at least one policy");
      return;
    }

    try {
      setLoading(true);
      
      for (const policyId of selectedPolicies) {
        const assignment = {
          user_id: selectedUser,
          policy_id: policyId,
          department_id: selectedDepartment || null,
        };
        await userPolicyService.assignPolicy(assignment);
      }

      loadData();
      setIsAssignDialogOpen(false);
      setSelectedUser("");
      setSelectedPolicies([]);
      setSelectedDepartment("");
      toast.success("Policies assigned successfully");
    } catch (error) {
      console.error("Error assigning policies:", error);
      toast.error("An error occurred while assigning policies");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (userId: string, policyId: string) => {
    try {
      await userPolicyService.removeAssignment(userId, policyId);
      loadData();
      toast.success("Policy assignment removed");
    } catch (error) {
      console.error("Error removing assignment:", error);
      toast.error("An error occurred while removing the assignment");
    }
  };

  const togglePolicySelection = (policyId: string) => {
    setSelectedPolicies(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      } else {
        return [...prev, policyId];
      }
    });
  };

  const getUserAssignments = async (userId: string) => {
    try {
      const userPolicies = await userPolicyService.getUserPolicies(userId);
      return userPolicies || [];
    } catch (error) {
      console.error('Error fetching user policies:', error);
      return [];
    }
  };

  const availablePolicies = getAvailablePolicies();

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Database User Policy Assignments</h3>
          <p className="text-sm text-muted-foreground">
            Assign department-specific or global policies to users for granular permission control
          </p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Policies
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.departments ? (
                      <Badge variant="outline">
                        {user.departments.code} - {user.departments.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No Department</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setSelectedPolicies([]);
                        setSelectedDepartment("");
                        setIsAssignDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assign Database-Stored Policies to User</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Department Context (Optional)</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department for department-specific policies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Global (No specific department)</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Policies</label>
              <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-3">
                {availablePolicies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedUser ? "No policies available for the selected department context" : "Please select a user first"}
                  </p>
                ) : (
                  availablePolicies.map((policy) => {
                    const userTypeInfo = userTypes[policy.user_type as keyof typeof userTypes];
                    return (
                      <div key={policy.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={policy.id}
                          checked={selectedPolicies.includes(policy.id)}
                          onCheckedChange={() => togglePolicySelection(policy.id)}
                        />
                        <div className="space-y-1 leading-none">
                          <label htmlFor={policy.id} className="text-sm font-medium">
                            {policy.name}
                          </label>
                          <p className="text-xs text-muted-foreground">{policy.description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {policy.permissions.length} permissions
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {userTypeInfo?.name}
                            </Badge>
                            {policy.department_id && (
                              <Badge variant="outline" className="text-xs">
                                <Building2 className="h-3 w-3 mr-1" />
                                {getDepartmentName(policy.department_id)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPolicies} disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Policies'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseUserPolicyAssignment;
