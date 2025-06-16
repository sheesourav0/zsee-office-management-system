
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { UserCircle, Mail, Lock, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Hardcoded demo users for immediate testing
  const demoUsers = [
    { email: 'admin@demo.com', password: 'admin123', role: 'System Administrator', description: 'Full system access' },
    { email: 'phed@demo.com', password: 'phed123', role: 'PHED Manager', description: 'PHED department management' },
    { email: 'project@demo.com', password: 'project123', role: 'Project Manager', description: 'Project management access' },
    { email: 'accountant@demo.com', password: 'account123', role: 'Accountant', description: 'Financial management' },
    { email: 'payment@demo.com', password: 'payment123', role: 'Payment Manager', description: 'Payment processing' },
    { email: 'pwd@demo.com', password: 'pwd123', role: 'PWD Manager', description: 'PWD department management' }
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log(`Demo login attempt for: ${email}`);
      
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock user session
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: {
          name: demoUsers.find(u => u.email === email)?.role || 'Demo User'
        }
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_session', JSON.stringify({
        user: mockUser,
        access_token: 'demo_token_' + Date.now()
      }));
      
      toast.success(`Logged in as ${email}`);
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if credentials match any demo user
      const user = demoUsers.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        await handleDemoLogin(user.email, user.password);
      } else {
        setError('Invalid email or password. Use demo credentials from the quick access buttons.');
        toast.error('Invalid credentials');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      toast.error('Login failed');
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
                Quick Demo Access
              </CardTitle>
              <CardDescription>
                Click any button below for instant access (no registration required)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoUsers.map((user) => (
                <Button
                  key={user.email}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleDemoLogin(user.email, user.password)}
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
                  <span>Logging in...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Login Section */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Login</CardTitle>
              <CardDescription>
                Enter demo credentials manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@demo.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="admin123"
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

              {error && (
                <Alert className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p className="mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto text-xs">
            {demoUsers.slice(0, 4).map((user) => (
              <div key={user.email} className="bg-white p-2 rounded">
                {user.email} / {user.password}
              </div>
            ))}
          </div>
          <p className="mt-4">
            All accounts include sample data to explore system functionality
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
