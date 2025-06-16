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

// Enhanced default department-based policies
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
  "it-staff-policy": {
    id: "it-staff-policy",
    name: "IT Staff Policy",
    description: "Standard permissions for IT department staff",
    permissions: [
      "read:projects",
      "read:users",
      "read:reports",
      "system:settings"
    ],
    departmentId: "it",
    userType: "department-staff",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "finance-staff-policy": {
    id: "finance-staff-policy",
    name: "Finance Staff Policy",
    description: "Standard permissions for Finance department staff",
    permissions: [
      "read:projects",
      "read:payments",
      "read:vendors",
      "read:reports"
    ],
    departmentId: "finance",
    userType: "department-staff",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Department Supervisor Policies
  "phed-supervisor-policy": {
    id: "phed-supervisor-policy",
    name: "PHED Supervisor Policy",
    description: "Supervisory permissions for PHED department",
    permissions: [
      "read:users",
      "read:projects",
      "update:projects",
      "read:payments",
      "update:payments",
      "read:reports",
      "read:vendors",
      "update:vendors"
    ],
    departmentId: "phed",
    userType: "department-supervisor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "pwd-supervisor-policy": {
    id: "pwd-supervisor-policy",
    name: "PWD Supervisor Policy",
    description: "Supervisory permissions for PWD department",
    permissions: [
      "read:users",
      "read:projects",
      "update:projects",
      "read:payments",
      "update:payments",
      "read:reports",
      "read:vendors",
      "update:vendors"
    ],
    departmentId: "pwd",
    userType: "department-supervisor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Department Manager Policies
  "phed-manager-policy": {
    id: "phed-manager-policy",
    name: "PHED Manager Policy",
    description: "Full management permissions for PHED department",
    permissions: [
      "create:users",
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
      "delete:vendors"
    ],
    departmentId: "phed",
    userType: "department-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "pwd-manager-policy": {
    id: "pwd-manager-policy",
    name: "PWD Manager Policy",
    description: "Full management permissions for PWD department",
    permissions: [
      "create:users",
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
      "delete:vendors"
    ],
    departmentId: "pwd",
    userType: "department-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "it-manager-policy": {
    id: "it-manager-policy",
    name: "IT Manager Policy",
    description: "Full management permissions for IT department",
    permissions: [
      "create:users",
      "read:users",
      "update:users",
      "read:projects",
      "read:reports",
      "system:settings",
      "manage:roles"
    ],
    departmentId: "it",
    userType: "department-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "finance-manager-policy": {
    id: "finance-manager-policy",
    name: "Finance Manager Policy",
    description: "Full management permissions for Finance department",
    permissions: [
      "read:users",
      "read:projects",
      "create:payments",
      "read:payments",
      "update:payments",
      "delete:payments",
      "read:reports",
      "read:vendors",
      "update:vendors"
    ],
    departmentId: "finance",
    userType: "department-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Global Policies (Non-Department Specific)
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
      "export:users"
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
      "update:vendors"
    ],
    userType: "accountant",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "hr-manager-policy": {
    id: "hr-manager-policy",
    name: "HR Manager Policy",
    description: "Human resources management across all departments",
    permissions: [
      "create:users",
      "read:users",
      "update:users",
      "read:reports",
      "import:users",
      "export:users"
    ],
    userType: "hr-manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "viewer-policy": {
    id: "viewer-policy",
    name: "Global Viewer Policy",
    description: "Read-only access across all departments",
    permissions: [
      "read:projects",
      "read:payments",
      "read:reports",
      "read:vendors"
    ],
    userType: "viewer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
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
    // For department-specific policies, only include if user's department matches
    if (policy.departmentId && departmentId && policy.departmentId !== departmentId) {
      return; // Skip this policy
    }
    
    // For global policies or matching department policies, include all permissions
    policy.permissions.forEach(permission => {
      allPermissions.add(permission);
    });
  });
  
  return Array.from(allPermissions);
};

// Enhanced permission checking with strict department context
export const userHasPolicyPermission = (userId: string, permissionId: string, departmentId?: string): boolean => {
  const userPermissions = getUserPermissions(userId, departmentId);
  return userPermissions.includes(permissionId);
};

export const checkUserPermission = (
  user: { id: string, role?: UserRole, departmentId?: string }, 
  permissionId: string
): boolean => {
  // Primary check: policy-based permissions with department context
  if (userHasPolicyPermission(user.id, permissionId, user.departmentId)) {
    return true;
  }
  
  // Also check global permissions (for cross-department users like accountants, HR)
  if (user.departmentId && userHasPolicyPermission(user.id, permissionId)) {
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
  return userPolicies.some(policy => {
    // Global policies (accountant, HR, etc.) can access any department
    if (!policy.departmentId) return true;
    // Department-specific policies must match the requested department
    return policy.departmentId === departmentId;
  });
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
      // Global policy (accountant, HR, etc.) - add all departments
      departments.forEach(dept => accessibleDepartments.add(dept.id));
    } else {
      // Department-specific policy
      accessibleDepartments.add(policy.departmentId);
    }
  });
  
  return Array.from(accessibleDepartments);
};

// Get user's primary department (the department they belong to)
export const getUserPrimaryDepartment = (userId: string): string | null => {
  const assignments = getUserPolicyAssignments().filter(a => a.userId === userId);
  const policies = getPoliciesFromStorage();
  
  // Find the first department-specific policy assigned to the user
  for (const assignment of assignments) {
    const policy = policies.find(p => p.id === assignment.policyId);
    if (policy?.departmentId && policy.userType.startsWith('department-')) {
      return policy.departmentId;
    }
  }
  
  return null; // User has no primary department (global user)
};

// Check if user is a global user (accountant, HR, viewer, etc.)
export const isGlobalUser = (userId: string): boolean => {
  const assignments = getUserPolicyAssignments().filter(a => a.userId === userId);
  const policies = getPoliciesFromStorage();
  
  return assignments.some(assignment => {
    const policy = policies.find(p => p.id === assignment.policyId);
    return policy && !policy.departmentId;
  });
};
