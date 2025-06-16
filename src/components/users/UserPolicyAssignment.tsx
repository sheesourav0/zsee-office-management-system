
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
import { User as UserType } from "./UsersList";
import { 
  Policy, 
  Department,
  UserPolicyAssignment, 
  getPoliciesFromStorage,
  getUserPolicyAssignments,
  saveUserPolicyAssignment,
  removeUserPolicyAssignment,
  getUserPolicies,
  getDepartmentsFromStorage,
  userTypes 
} from "@/lib/policies";

interface UserPolicyAssignmentProps {
  users: UserType[];
}

const UserPolicyAssignmentComponent = ({ users }: UserPolicyAssignmentProps) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [assignments, setAssignments] = useState<UserPolicyAssignment[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPolicies(getPoliciesFromStorage());
    setDepartments(getDepartmentsFromStorage());
    setAssignments(getUserPolicyAssignments());
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getPolicyName = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    return policy ? policy.name : 'Unknown Policy';
  };

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "Global";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const getAvailablePolicies = () => {
    if (!selectedUser) return [];
    
    const user = users.find(u => u.id === selectedUser);
    if (!user) return [];

    // Filter policies based on selected department and user type compatibility
    return policies.filter(policy => {
      // If no department selected, show global policies only
      if (!selectedDepartment) {
        return !policy.departmentId;
      }
      
      // Show policies for the selected department or global policies
      return !policy.departmentId || policy.departmentId === selectedDepartment;
    });
  };

  const handleAssignPolicies = () => {
    if (!selectedUser || selectedPolicies.length === 0) {
      toast.error("Please select a user and at least one policy");
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      selectedPolicies.forEach(policyId => {
        const assignment: UserPolicyAssignment = {
          userId: selectedUser,
          policyId: policyId,
          departmentId: selectedDepartment || undefined,
          assignedAt: new Date().toISOString(),
          assignedBy: currentUser.id || "system",
        };
        saveUserPolicyAssignment(assignment);
      });

      loadData();
      setIsAssignDialogOpen(false);
      setSelectedUser("");
      setSelectedPolicies([]);
      setSelectedDepartment("");
      toast.success("Policies assigned successfully");
    } catch (error) {
      console.error("Error assigning policies:", error);
      toast.error("An error occurred while assigning policies");
    }
  };

  const handleRemoveAssignment = (userId: string, policyId: string) => {
    try {
      removeUserPolicyAssignment(userId, policyId);
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

  const getUserAssignments = () => {
    const userAssignments: Record<string, UserPolicyAssignment[]> = {};
    
    assignments.forEach(assignment => {
      if (!userAssignments[assignment.userId]) {
        userAssignments[assignment.userId] = [];
      }
      userAssignments[assignment.userId].push(assignment);
    });
    
    return userAssignments;
  };

  const userAssignments = getUserAssignments();
  const availablePolicies = getAvailablePolicies();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Department-Based User Policy Assignments</h3>
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
              <TableHead>Assigned Policies</TableHead>
              <TableHead>Departments</TableHead>
              <TableHead>Total Permissions</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const userPolicyAssignments = userAssignments[user.id] || [];
                const userPolicies = getUserPolicies(user.id);
                const totalPermissions = new Set();
                userPolicies.forEach(policy => {
                  policy.permissions.forEach(perm => totalPermissions.add(perm));
                });

                // Get unique departments for this user
                const userDepartments = new Set();
                userPolicyAssignments.forEach(assignment => {
                  const policy = policies.find(p => p.id === assignment.policyId);
                  if (policy?.departmentId) {
                    userDepartments.add(policy.departmentId);
                  } else {
                    userDepartments.add('global');
                  }
                });

                return (
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
                      <div className="flex flex-wrap gap-1">
                        {userPolicyAssignments.length === 0 ? (
                          <span className="text-sm text-muted-foreground">No policies assigned</span>
                        ) : (
                          userPolicyAssignments.map((assignment) => {
                            const policy = policies.find(p => p.id === assignment.policyId);
                            const userTypeInfo = policy ? userTypes[policy.userType] : null;
                            
                            return (
                              <Badge key={assignment.policyId} variant="outline" className="text-xs">
                                {getPolicyName(assignment.policyId)}
                                {userTypeInfo && (
                                  <span className="ml-1 text-xs opacity-70">
                                    ({userTypeInfo.name})
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => handleRemoveAssignment(user.id, assignment.policyId)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </Badge>
                            );
                          })
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(userDepartments).map((deptId) => (
                          <Badge key={deptId} variant="secondary" className="text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            {getDepartmentName(deptId === 'global' ? undefined : deptId as string)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        {totalPermissions.size} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {userPolicyAssignments.length > 0 ? (
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            Math.max(...userPolicyAssignments.map(a => new Date(a.assignedAt).getTime()))
                          ).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assign Department-Based Policies to User</DialogTitle>
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
                    const userTypeInfo = userTypes[policy.userType];
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
                              {userTypeInfo.name}
                            </Badge>
                            {policy.departmentId && (
                              <Badge variant="outline" className="text-xs">
                                <Building2 className="h-3 w-3 mr-1" />
                                {getDepartmentName(policy.departmentId)}
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
            <Button onClick={handleAssignPolicies}>
              Assign Policies
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPolicyAssignmentComponent;
