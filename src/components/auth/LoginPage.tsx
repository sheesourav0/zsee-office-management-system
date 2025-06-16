
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserCircle, Mail, Lock, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const demoUsers = [
    { email: 'admin@demo.com', role: 'System Administrator', description: 'Full system access' },
    { email: 'phed@demo.com', role: 'PHED Manager', description: 'PHED department management' },
    { email: 'project@demo.com', role: 'Project Manager', description: 'Project management access' },
    { email: 'accountant@demo.com', role: 'Accountant', description: 'Financial management' },
    { email: 'payment@demo.com', role: 'Payment Manager', description: 'Payment processing' },
    { email: 'pwd@demo.com', role: 'PWD Manager', description: 'PWD department management' }
  ];

  const handleDemoLogin = async (email: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log(`Attempting demo login for: ${email}`);
      
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'demo123'
      });

      if (signInError && signInError.message !== 'Invalid login credentials') {
        throw signInError;
      }

      if (signInData?.user) {
        console.log('Demo login successful:', signInData.user.email);
        toast.success(`Logged in as ${email}`);
        navigate('/dashboard');
        return;
      }

      // If sign in failed, try to create the account
      console.log('Creating demo account for:', email);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'demo123',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: demoUsers.find(u => u.email === email)?.role || 'Demo User'
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          // User exists but email not confirmed, try signing in again
          const { error: retrySignInError } = await supabase.auth.signInWithPassword({
            email,
            password: 'demo123'
          });
          
          if (retrySignInError) {
            throw new Error('Demo account exists but login failed. Please check console for details.');
          }
          
          toast.success(`Logged in as ${email}`);
          navigate('/dashboard');
          return;
        }
        throw signUpError;
      }

      if (signUpData?.user) {
        toast.success(`Demo account created and logged in as ${email}`);
        navigate('/dashboard');
      }

    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err.message || 'Demo login failed');
      toast.error('Demo login failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, mode: 'signin' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              name: formData.name
            }
          }
        });
        if (error) throw error;
        toast.success('Account created successfully! Please check your email for verification.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ZSEE Office Management</h1>
          <p className="text-gray-600">Comprehensive project and payment management system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Login Section */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Demo Access
              </CardTitle>
              <CardDescription>
                Quick access with pre-configured demo accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoUsers.map((user) => (
                <Button
                  key={user.email}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleDemoLogin(user.email)}
                  disabled={isLoading}
                >
                  <div className="text-left">
                    <div className="font-medium">{user.role}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">{user.description}</div>
                  </div>
                </Button>
              ))}
              
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Setting up demo account...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Regular Login/Signup Section */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password (min. 6 characters)"
                          className="pl-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Demo users have password: <strong>demo123</strong>
          </p>
          <p className="mt-2">
            All demo accounts include sample data to explore the system functionality
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
