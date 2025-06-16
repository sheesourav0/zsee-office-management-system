
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PermissionService, UserPermissions } from '@/lib/permissions';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userPermissions: UserPermissions | null;
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
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPermissions = async () => {
    if (user) {
      const permissions = await PermissionService.getCurrentUserPermissions();
      setUserPermissions(permissions);
    } else {
      setUserPermissions(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Refresh permissions when auth state changes
        if (session?.user) {
          setTimeout(async () => {
            const permissions = await PermissionService.getCurrentUserPermissions();
            setUserPermissions(permissions);
          }, 0);
        } else {
          setUserPermissions(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load permissions when user is available
  useEffect(() => {
    if (user && !userPermissions) {
      refreshPermissions();
    }
  }, [user, userPermissions]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserPermissions(null);
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
