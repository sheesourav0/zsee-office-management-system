
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
  };
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userPermissions: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userPermissions, setUserPermissions] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPermissions = async () => {
    if (user) {
      console.log('Refreshing permissions for user:', user.id);
      // Mock permissions for demo - using the structure expected by RoleDashboard
      const mockPermissions = {
        permissions: [
          'read:basic', 
          'read:projects', 
          'read:payments', 
          'read:users', 
          'read:vendors', 
          'read:reports',
          ...(user.email.includes('admin') ? [
            'write:projects', 'write:payments', 'write:users', 'write:vendors', 
            'manage:team', 'approve:payments', 'system:settings', 'read:all-departments'
          ] : []),
          ...(user.email.includes('phed') || user.email.includes('pwd') || user.email.includes('project') ? [
            'write:projects', 'write:payments', 'manage:team'
          ] : []),
          ...(user.email.includes('accountant') || user.email.includes('payment') ? [
            'approve:payments', 'write:payments'
          ] : [])
        ],
        departmentId: user.email.includes('phed') ? 'phed' : user.email.includes('pwd') ? 'pwd' : undefined,
        userType: user.email.includes('admin') ? 'global-admin' : 
                 user.email.includes('phed') || user.email.includes('pwd') ? 'department-manager' :
                 user.email.includes('project') ? 'department-supervisor' :
                 user.email.includes('accountant') || user.email.includes('payment') ? 'accountant' : 'viewer'
      };
      console.log('Loaded permissions:', mockPermissions);
      setUserPermissions(mockPermissions);
    } else {
      setUserPermissions(null);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Check for existing demo session
    const checkDemoSession = () => {
      try {
        const demoSession = localStorage.getItem('demo_session');
        const demoUser = localStorage.getItem('demo_user');
        
        if (demoSession && demoUser) {
          const sessionData = JSON.parse(demoSession);
          const userData = JSON.parse(demoUser);
          
          console.log('Found existing demo session:', userData.email);
          setSession(sessionData);
          setUser(userData);
          
          // Set mock permissions immediately with correct structure
          const mockPermissions = {
            permissions: [
              'read:basic', 
              'read:projects', 
              'read:payments', 
              'read:users', 
              'read:vendors', 
              'read:reports',
              ...(userData.email.includes('admin') ? [
                'write:projects', 'write:payments', 'write:users', 'write:vendors', 
                'manage:team', 'approve:payments', 'system:settings', 'read:all-departments'
              ] : []),
              ...(userData.email.includes('phed') || userData.email.includes('pwd') || userData.email.includes('project') ? [
                'write:projects', 'write:payments', 'manage:team'
              ] : []),
              ...(userData.email.includes('accountant') || userData.email.includes('payment') ? [
                'approve:payments', 'write:payments'
              ] : [])
            ],
            departmentId: userData.email.includes('phed') ? 'phed' : userData.email.includes('pwd') ? 'pwd' : undefined,
            userType: userData.email.includes('admin') ? 'global-admin' : 
                     userData.email.includes('phed') || userData.email.includes('pwd') ? 'department-manager' :
                     userData.email.includes('project') ? 'department-supervisor' :
                     userData.email.includes('accountant') || userData.email.includes('payment') ? 'accountant' : 'viewer'
          };
          setUserPermissions(mockPermissions);
        } else {
          console.log('No demo session found');
        }
      } catch (error) {
        console.error('Error checking demo session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkDemoSession();
  }, []);

  const signOut = async () => {
    console.log('Signing out user');
    localStorage.removeItem('demo_session');
    localStorage.removeItem('demo_user');
    setUser(null);
    setSession(null);
    setUserPermissions(null);
    
    // Redirect to login
    window.location.href = '/auth';
  };

  const value = {
    user,
    session,
    userPermissions,
    loading,
    signOut,
    refreshPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
