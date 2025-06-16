
import { UserRole, RolePermission, permissions, hasPermission } from './roles';

export interface Policy {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  departmentId?: string; // null for global policies
  userType: 'department-staff' | 'department-manager' | 'global-admin' | 'global-staff';
  createdAt: string;
  updatedAt: string;
}

export interface UserPolicyAssignment {
  userId: string;
  policyId: string;
  departmentId?: string; // For department-specific assignments
  assignedAt: string;
  assignedBy: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// User types and their descriptions
export const userTypes = {
  'department-staff': {
    name: 'Department Staff',
    description: 'Regular employees working within a specific department',
    departmentSpecific: true
  },
  'department-manager': {
    name: 'Department Manager',
    description: 'Managers overseeing a specific department',
    departmentSpecific: true
  },
  'global-admin': {
    name: 'Global Administrator',
    description: 'System administrators with cross-department access',
    departmentSpecific: false
  },
  'global-staff': {
    name: 'Global Staff',
    description: 'Support staff like HR, Accountant with cross-department access',
    departmentSpecific: false
  }
};

// Default departments
export const defaultDepartments: Department[] = [
  {
    id: "phed",
    name: "Public Health Engineering Department",
    code: "PHED",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pwd",
    name: "Public Works Department",
    code: "PWD",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "it",
    name: "Information Technology",
    code: "IT",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "finance",
    name: "Finance Department",
    code: "FIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Default department-based policies
export const defaultPolicies: Record<string, Policy> = {
  // Department Staff Policies
  "phed-staff-policy": {
    id: "phed-staff-policy",
    name: "PHED Staff Policy",
    description: "Standard permissions for PHED department staff",
    permissions: [
      "read:projects",
      "read:payments",
      "read:vendors",
      "read:reports"
    ],
    departmentId: "phed",
    userType: "department-staff",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "pwd-staff-policy": {
    id: "pwd-staff-policy",
    name: "PWD Staff Policy",
    description: "Standard permissions for PWD department staff",
    permissions: [
      "read:projects",
      "read:payments",
      "read:vendors",
      "read:reports"
    ],
    departmentId: "pwd",
    userType: "department-staff",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Department Manager Policies
  "phed-manager-policy": {
    id: "phed-manager-policy",
    name: "PHED Manager Policy",
    description: "Management permissions for PHED department",
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
    departmentId: "phed",
    userType: "department-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "pwd-manager-policy": {
    id: "pwd-manager-policy",
    name: "PWD Manager Policy",
    description: "Management permissions for PWD department",
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
    departmentId: "pwd",
    userType: "department-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Global Policies
  "global-admin-policy": {
    id: "global-admin-policy",
    name: "Global Administrator Policy",
    description: "Full system access across all departments",
    permissions: [
      "create:users",
      "read:users",
      "update:users",
      "delete:users",
      "manage:roles",
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
      "system:settings",
      "import:users",
      "export:users",
    ],
    userType: "global-admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "accountant-policy": {
    id: "accountant-policy",
    name: "Accountant Policy",
    description: "Financial access across all departments",
    permissions: [
      "read:projects",
      "create:payments",
      "read:payments",
      "update:payments",
      "read:reports",
      "read:vendors",
    ],
    userType: "global-staff",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "hr-policy": {
    id: "hr-policy",
    name: "HR Policy",
    description: "Human resources access across all departments",
    permissions: [
      "create:users",
      "read:users",
      "update:users",
      "read:reports",
      "import:users",
      "export:users",
    ],
    userType: "global-staff",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Helper functions for department management
export const getDepartmentsFromStorage = (): Department[] => {
  const stored = localStorage.getItem('departments');
  if (!stored) {
    localStorage.setItem('departments', JSON.stringify(defaultDepartments));
    return defaultDepartments;
  }
  return JSON.parse(stored);
};

export const saveDepartmentToStorage = (department: Department): void => {
  const departments = getDepartmentsFromStorage();
  const existingIndex = departments.findIndex(d => d.id === department.id);
  
  if (existingIndex >= 0) {
    departments[existingIndex] = { ...department, updatedAt: new Date().toISOString() };
  } else {
    departments.push(department);
  }
  
  localStorage.setItem('departments', JSON.stringify(departments));
};

// Enhanced policy functions
export const getPoliciesFromStorage = (): Policy[] => {
  const stored = localStorage.getItem('user_policies');
  if (!stored) {
    const policies = Object.values(defaultPolicies);
    localStorage.setItem('user_policies', JSON.stringify(policies));
    return policies;
  }
  return JSON.parse(stored);
};

export const getPoliciesByDepartment = (departmentId: string): Policy[] => {
  const policies = getPoliciesFromStorage();
  return policies.filter(p => p.departmentId === departmentId);
};

export const getGlobalPolicies = (): Policy[] => {
  const policies = getPoliciesFromStorage();
  return policies.filter(p => !p.departmentId);
};

export const getPoliciesByUserType = (userType: string): Policy[] => {
  const policies = getPoliciesFromStorage();
  return policies.filter(p => p.userType === userType);
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

// User policy assignments with department context
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

export const getUserPolicies = (userId: string, departmentId?: string): Policy[] => {
  const assignments = getUserPolicyAssignments();
  const policies = getPoliciesFromStorage();
  
  let userAssignments = assignments.filter(a => a.userId === userId);
  
  // Filter by department if specified
  if (departmentId) {
    userAssignments = userAssignments.filter(a => 
      !a.departmentId || a.departmentId === departmentId
    );
  }
  
  return userAssignments.map(assignment => 
    policies.find(p => p.id === assignment.policyId)
  ).filter(Boolean) as Policy[];
};

export const getUserPermissions = (userId: string, departmentId?: string): string[] => {
  const userPolicies = getUserPolicies(userId, departmentId);
  const allPermissions = new Set<string>();
  
  userPolicies.forEach(policy => {
    // Only include permissions if policy matches user's department context
    if (!departmentId || !policy.departmentId || policy.departmentId === departmentId) {
      policy.permissions.forEach(permission => {
        allPermissions.add(permission);
      });
    }
  });
  
  return Array.from(allPermissions);
};

// Enhanced permission checking with department context
export const userHasPolicyPermission = (userId: string, permissionId: string, departmentId?: string): boolean => {
  const userPermissions = getUserPermissions(userId, departmentId);
  return userPermissions.includes(permissionId);
};

export const checkUserPermission = (
  user: { id: string, role?: UserRole, departmentId?: string }, 
  permissionId: string
): boolean => {
  // Check policy-based permissions with department context
  if (userHasPolicyPermission(user.id, permissionId, user.departmentId)) {
    return true;
  }
  
  // Fallback to role-based permissions for backward compatibility
  if (user.role) {
    return hasPermission(user.role, permissionId);
  }
  
  return false;
};

// Department access validation
export const canUserAccessDepartment = (userId: string, departmentId: string): boolean => {
  const assignments = getUserPolicyAssignments().filter(a => a.userId === userId);
  const policies = getPoliciesFromStorage();
  
  const userPolicies = assignments.map(a => 
    policies.find(p => p.id === a.policyId)
  ).filter(Boolean) as Policy[];
  
  // Check if user has global access or specific department access
  return userPolicies.some(policy => 
    !policy.departmentId || policy.departmentId === departmentId
  );
};

export const getUserAccessibleDepartments = (userId: string): string[] => {
  const assignments = getUserPolicyAssignments().filter(a => a.userId === userId);
  const policies = getPoliciesFromStorage();
  const departments = getDepartmentsFromStorage();
  
  const userPolicies = assignments.map(a => 
    policies.find(p => p.id === a.policyId)
  ).filter(Boolean) as Policy[];
  
  const accessibleDepartments = new Set<string>();
  
  userPolicies.forEach(policy => {
    if (!policy.departmentId) {
      // Global policy - add all departments
      departments.forEach(dept => accessibleDepartments.add(dept.id));
    } else {
      // Department-specific policy
      accessibleDepartments.add(policy.departmentId);
    }
  });
  
  return Array.from(accessibleDepartments);
};
