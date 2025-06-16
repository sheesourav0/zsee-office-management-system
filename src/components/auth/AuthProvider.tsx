
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PermissionService, UserPermissions } from '@/lib/permissions';
import { createDemoData } from '@/lib/demo-data';

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
      console.log('Refreshing permissions for user:', user.id);
      const permissions = await PermissionService.getCurrentUserPermissions();
      console.log('Loaded permissions:', permissions);
      setUserPermissions(permissions);
    } else {
      setUserPermissions(null);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
      }
      console.log('Initial session:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear permissions first to avoid stale data
        setUserPermissions(null);
        
        // Handle successful sign in
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, creating demo data...');
          // Create demo data in the background
          setTimeout(async () => {
            await createDemoData();
            // Refresh permissions after demo data is created
            const permissions = await PermissionService.getCurrentUserPermissions();
            console.log('Post-signin permissions:', permissions);
            setUserPermissions(permissions);
          }, 100);
        } else if (session?.user) {
          // Refresh permissions for existing sessions
          setTimeout(async () => {
            console.log('Loading permissions after auth change...');
            const permissions = await PermissionService.getCurrentUserPermissions();
            console.log('Auth change - loaded permissions:', permissions);
            setUserPermissions(permissions);
          }, 100);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Load permissions when user is available and permissions are not yet loaded
  useEffect(() => {
    if (user && !userPermissions && !loading) {
      console.log('Loading permissions for authenticated user:', user.email);
      refreshPermissions();
    }
  }, [user, userPermissions, loading]);

  const signOut = async () => {
    console.log('Signing out user');
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
