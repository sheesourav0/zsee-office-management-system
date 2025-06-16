
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
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Getting permissions for user:', user.id, user.email);

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

      console.log('User policy assignments:', assignments);

      if (!assignments || assignments.length === 0) {
        console.log('No policy assignments found, creating default profile...');
        
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          // Create a basic profile for the user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: user.user_metadata?.name || user.email || 'Unknown User',
              email: user.email || '',
              department_id: null,
              is_active: true
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          } else {
            console.log('Created basic profile for user');
          }
        }

        // Return basic viewer permissions
        return {
          permissions: ['read:basic', 'read:projects', 'read:payments'],
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

      console.log('Final user permissions:', this.userPermissions);
      return this.userPermissions;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return null;
    }
  }

  static async hasPermission(permission: string): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    const hasPermission = userPermissions?.permissions.includes(permission) || false;
    console.log(`Checking permission ${permission}: ${hasPermission}`);
    return hasPermission;
  }

  static async hasAnyPermission(permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getCurrentUserPermissions();
    if (!userPermissions) return false;
    
    const hasAny = permissions.some(permission => 
      userPermissions.permissions.includes(permission)
    );
    console.log(`Checking any permission from ${permissions}: ${hasAny}`);
    return hasAny;
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
  if (!userPermissions) {
    console.log('No user permissions, returning basic menu');
    return [{ title: 'Dashboard', path: '/dashboard', icon: 'Home' }];
  }

  console.log('Building menu for permissions:', userPermissions.permissions);

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

  console.log('Final menu items:', menuItems);
  return menuItems;
};
