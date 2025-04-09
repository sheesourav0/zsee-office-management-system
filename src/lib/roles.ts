
export type UserRole = "superadmin" | "admin" | "manager" | "viewer";

export interface RolePermission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
}

// Define all available permissions
export const permissions: Record<string, RolePermission> = {
  "create:users": {
    id: "create:users",
    name: "Create Users",
    description: "Create new users in the system",
  },
  "read:users": {
    id: "read:users",
    name: "View Users",
    description: "View users in the system",
  },
  "update:users": {
    id: "update:users",
    name: "Update Users",
    description: "Update existing users",
  },
  "delete:users": {
    id: "delete:users",
    name: "Delete Users",
    description: "Delete users from the system",
  },
  "manage:roles": {
    id: "manage:roles",
    name: "Manage Roles",
    description: "Assign and manage user roles",
  },
  "create:projects": {
    id: "create:projects",
    name: "Create Projects",
    description: "Create new projects",
  },
  "read:projects": {
    id: "read:projects",
    name: "View Projects",
    description: "View project details",
  },
  "update:projects": {
    id: "update:projects",
    name: "Update Projects",
    description: "Update existing projects",
  },
  "delete:projects": {
    id: "delete:projects",
    name: "Delete Projects",
    description: "Delete projects from the system",
  },
  "create:payments": {
    id: "create:payments",
    name: "Create Payments",
    description: "Create new payment records",
  },
  "read:payments": {
    id: "read:payments",
    name: "View Payments",
    description: "View payment details",
  },
  "update:payments": {
    id: "update:payments",
    name: "Update Payments",
    description: "Update existing payment records",
  },
  "delete:payments": {
    id: "delete:payments",
    name: "Delete Payments",
    description: "Delete payment records",
  },
  "read:reports": {
    id: "read:reports",
    name: "View Reports",
    description: "View system reports",
  },
  "create:vendors": {
    id: "create:vendors",
    name: "Create Vendors",
    description: "Create new vendor records",
  },
  "read:vendors": {
    id: "read:vendors",
    name: "View Vendors",
    description: "View vendor details",
  },
  "update:vendors": {
    id: "update:vendors",
    name: "Update Vendors",
    description: "Update existing vendor records",
  },
  "delete:vendors": {
    id: "delete:vendors",
    name: "Delete Vendors",
    description: "Delete vendor records",
  },
  "system:settings": {
    id: "system:settings",
    name: "System Settings",
    description: "Manage system settings",
  },
};

// Define roles with their permissions
export const roles: Record<UserRole, Role> = {
  superadmin: {
    id: "superadmin",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: Object.keys(permissions),
  },
  admin: {
    id: "admin",
    name: "Admin",
    description: "Administrative access with most permissions",
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
    ],
  },
  manager: {
    id: "manager",
    name: "Manager",
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
  },
  viewer: {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to most system data",
    permissions: [
      "read:users",
      "read:projects",
      "read:payments",
      "read:reports",
      "read:vendors",
    ],
  },
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole, permissionId: string): boolean => {
  if (!roles[role]) return false;
  return roles[role].permissions.includes(permissionId);
};

// Helper to get all permissions for a role
export const getPermissionsForRole = (role: UserRole): RolePermission[] => {
  if (!roles[role]) return [];
  return roles[role].permissions.map(permId => permissions[permId]);
};
