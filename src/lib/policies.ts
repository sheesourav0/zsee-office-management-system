
import { UserRole, RolePermission, permissions, hasPermission } from './roles';

export interface Policy {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPolicyAssignment {
  userId: string;
  policyId: string;
  assignedAt: string;
  assignedBy: string;
}

// Default policies based on existing roles
export const defaultPolicies: Record<string, Policy> = {
  "admin-policy": {
    id: "admin-policy",
    name: "Administrator Policy",
    description: "Full administrative access with most permissions",
    permissions: [
      "read:users",
      "update:users",
      "create:projects",
      "read:projects",
      "update:projects",
      "delete:projects",
      "create:payments",
      "read:payments",
      "update:payments",
      "delete:payments",
      "read:reports",
      "create:vendors",
      "read:vendors",
      "update:vendors",
      "delete:vendors",
      "import:users",
      "export:users",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "manager-policy": {
    id: "manager-policy",
    name: "Manager Policy",
    description: "Project and team management capabilities",
    permissions: [
      "read:users",
      "create:projects",
      "read:projects",
      "update:projects",
      "create:payments",
      "read:payments",
      "update:payments",
      "read:reports",
      "create:vendors",
      "read:vendors",
      "update:vendors",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "viewer-policy": {
    id: "viewer-policy",
    name: "Viewer Policy",
    description: "Read-only access to most system data",
    permissions: [
      "read:users",
      "read:projects",
      "read:payments",
      "read:reports",
      "read:vendors",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Helper functions for policy management
export const getPoliciesFromStorage = (): Policy[] => {
  const stored = localStorage.getItem('user_policies');
  if (!stored) {
    // Initialize with default policies
    const policies = Object.values(defaultPolicies);
    localStorage.setItem('user_policies', JSON.stringify(policies));
    return policies;
  }
  return JSON.parse(stored);
};

export const savePolicyToStorage = (policy: Policy): void => {
  const policies = getPoliciesFromStorage();
  const existingIndex = policies.findIndex(p => p.id === policy.id);
  
  if (existingIndex >= 0) {
    policies[existingIndex] = { ...policy, updatedAt: new Date().toISOString() };
  } else {
    policies.push(policy);
  }
  
  localStorage.setItem('user_policies', JSON.stringify(policies));
};

export const deletePolicyFromStorage = (policyId: string): void => {
  const policies = getPoliciesFromStorage();
  const filtered = policies.filter(p => p.id !== policyId);
  localStorage.setItem('user_policies', JSON.stringify(filtered));
};

// User policy assignments
export const getUserPolicyAssignments = (): UserPolicyAssignment[] => {
  const stored = localStorage.getItem('user_policy_assignments');
  return stored ? JSON.parse(stored) : [];
};

export const saveUserPolicyAssignment = (assignment: UserPolicyAssignment): void => {
  const assignments = getUserPolicyAssignments();
  const existingIndex = assignments.findIndex(
    a => a.userId === assignment.userId && a.policyId === assignment.policyId
  );
  
  if (existingIndex >= 0) {
    assignments[existingIndex] = assignment;
  } else {
    assignments.push(assignment);
  }
  
  localStorage.setItem('user_policy_assignments', JSON.stringify(assignments));
};

export const removeUserPolicyAssignment = (userId: string, policyId: string): void => {
  const assignments = getUserPolicyAssignments();
  const filtered = assignments.filter(
    a => !(a.userId === userId && a.policyId === policyId)
  );
  localStorage.setItem('user_policy_assignments', JSON.stringify(filtered));
};

export const getUserPolicies = (userId: string): Policy[] => {
  const assignments = getUserPolicyAssignments();
  const policies = getPoliciesFromStorage();
  const userAssignments = assignments.filter(a => a.userId === userId);
  
  return userAssignments.map(assignment => 
    policies.find(p => p.id === assignment.policyId)
  ).filter(Boolean) as Policy[];
};

export const getUserPermissions = (userId: string): string[] => {
  const userPolicies = getUserPolicies(userId);
  const allPermissions = new Set<string>();
  
  userPolicies.forEach(policy => {
    policy.permissions.forEach(permission => {
      allPermissions.add(permission);
    });
  });
  
  return Array.from(allPermissions);
};

// Permission checking functions
export const userHasPolicyPermission = (userId: string, permissionId: string): boolean => {
  const userPermissions = getUserPermissions(userId);
  return userPermissions.includes(permissionId);
};

export const checkUserPermission = (user: { id: string, role?: UserRole }, permissionId: string): boolean => {
  // First check policy-based permissions
  if (userHasPolicyPermission(user.id, permissionId)) {
    return true;
  }
  
  // Fallback to role-based permissions for backward compatibility
  if (user.role) {
    return hasPermission(user.role, permissionId);
  }
  
  return false;
};
