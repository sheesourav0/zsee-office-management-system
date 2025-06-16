
import { supabase } from "@/integrations/supabase/client";

export interface UserPermissions {
  permissions: string[];
  departmentId?: string;
  userType: string;
}

// Permission checking service
export class PermissionService {
  private static userPermissions: UserPermissions | null = null;

  static async getCurrentUserPermissions(): Promise<UserPermissions | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user's policy assignments
      const { data: assignments, error } = await supabase
        .from('user_policy_assignments')
        .select(`
          *,
          policies(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user permissions:', error);
        return null;
      }

      if (!assignments || assignments.length === 0) {
        return {
          permissions: ['read:basic'],
          userType: 'viewer'
        };
      }

      // Combine all permissions from assigned policies
      const allPermissions = new Set<string>();
      let userType = 'viewer';
      let departmentId: string | undefined;

      assignments.forEach(assignment => {
        if (assignment.policies) {
          assignment.policies.permissions?.forEach(permission => {
            allPermissions.add(permission);
          });
          userType = assignment.policies.user_type;
          if (assignment.department_id) {
            departmentId = assignment.department_id;
          }
        }
      });

      this.userPermissions = {
        permissions: Array.from(allPermissions),
        departmentId,
        userType
      };

      return this.userPermissions;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return null;
    }
  }

  static async hasPermission(permission: string): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    return userPermissions?.permissions.includes(permission) || false;
  }

  static async hasAnyPermission(permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    if (!userPermissions) return false;
    
    return permissions.some(permission => 
      userPermissions.permissions.includes(permission)
    );
  }

  static async canAccessDepartment(departmentId: string): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    if (!userPermissions) return false;

    // Global access permissions
    if (userPermissions.permissions.includes('read:all-departments')) {
      return true;
    }

    // Department-specific access
    return userPermissions.departmentId === departmentId;
  }

  static async isAdmin(): Promise<boolean> {
    return this.hasPermission('system:settings');
  }

  static async isDepartmentManager(): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    return userPermissions?.userType === 'department-manager' || false;
  }

  static async isProjectManager(): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    return userPermissions?.userType === 'department-supervisor' || 
           userPermissions?.userType === 'department-manager' || false;
  }

  static async isAccountant(): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    return userPermissions?.userType === 'accountant' || false;
  }

  static async canApprovePayments(): Promise<boolean> {
    return this.hasPermission('approve:payments');
  }
}

// Role-based menu items
export const getMenuItemsForUser = async () => {
  const userPermissions = await PermissionService.getCurrentUserPermissions();
  if (!userPermissions) return [];

  const menuItems: Array<{
    title: string;
    path: string;
    permission?: string;
    icon?: string;
  }> = [];

  // Dashboard - always visible for authenticated users
  menuItems.push({ title: 'Dashboard', path: '/dashboard', icon: 'Home' });

  // User Management
  if (userPermissions.permissions.includes('read:users')) {
    menuItems.push({ title: 'User Management', path: '/users', permission: 'read:users', icon: 'Users' });
  }

  // Project Management
  if (userPermissions.permissions.includes('read:projects')) {
    menuItems.push({ title: 'Projects', path: '/projects', permission: 'read:projects', icon: 'FolderOpen' });
  }

  // Payment Management
  if (userPermissions.permissions.includes('read:payments')) {
    menuItems.push({ title: 'Payments', path: '/payments', permission: 'read:payments', icon: 'CreditCard' });
  }

  // Vendor Management
  if (userPermissions.permissions.includes('read:vendors')) {
    menuItems.push({ title: 'Vendors', path: '/vendors', permission: 'read:vendors', icon: 'Building' });
  }

  // Reports
  if (userPermissions.permissions.includes('read:reports')) {
    menuItems.push({ title: 'Reports', path: '/reports', permission: 'read:reports', icon: 'BarChart' });
  }

  // Team Management
  if (userPermissions.permissions.includes('manage:team')) {
    menuItems.push({ title: 'Team', path: '/team', permission: 'manage:team', icon: 'Users' });
  }

  return menuItems;
};
