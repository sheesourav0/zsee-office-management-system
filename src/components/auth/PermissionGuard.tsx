
import { useState, useEffect } from 'react';
import { PermissionService } from '@/lib/permissions';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

const PermissionGuard = ({ 
  permission, 
  permissions = [], 
  children, 
  fallback = null,
  requireAll = false 
}: PermissionGuardProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        let result = false;

        if (permission) {
          result = await PermissionService.hasPermission(permission);
        } else if (permissions.length > 0) {
          if (requireAll) {
            // Check if user has all permissions
            const checks = await Promise.all(
              permissions.map(p => PermissionService.hasPermission(p))
            );
            result = checks.every(check => check);
          } else {
            // Check if user has any of the permissions
            result = await PermissionService.hasAnyPermission(permissions);
          }
        } else {
          result = true; // No permission required
        }

        setHasAccess(result);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasAccess(false);
      }
    };

    checkPermissions();
  }, [permission, permissions, requireAll]);

  if (hasAccess === null) {
    return <div className="animate-pulse bg-gray-200 h-4 rounded"></div>;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
