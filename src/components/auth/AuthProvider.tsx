
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
      // Mock permissions for demo
      const mockPermissions = {
        canViewDashboard: true,
        canManageUsers: user.email.includes('admin'),
        canManageProjects: true,
        canManagePayments: true,
        canViewReports: true,
        departments: user.email.includes('phed') ? ['phed'] : user.email.includes('pwd') ? ['pwd'] : ['all']
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
          
          // Set mock permissions immediately
          const mockPermissions = {
            canViewDashboard: true,
            canManageUsers: userData.email.includes('admin'),
            canManageProjects: true,
            canManagePayments: true,
            canViewReports: true,
            departments: userData.email.includes('phed') ? ['phed'] : userData.email.includes('pwd') ? ['pwd'] : ['all']
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
