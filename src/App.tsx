
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import LoginPage from '@/components/auth/LoginPage';
import Navigation from '@/components/layout/Navigation';
import RoleDashboard from '@/components/dashboard/RoleDashboard';
import UserManagementPage from '@/features/users/pages/UserManagementPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            } />

            <Route path="/payments" element={
              <ProtectedRoute>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold">Payments Module</h1>
                  <p className="text-gray-600 mt-2">Payment management features coming soon...</p>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold">Projects Module</h1>
                  <p className="text-gray-600 mt-2">Project management features coming soon...</p>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/vendors" element={
              <ProtectedRoute>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold">Vendors Module</h1>
                  <p className="text-gray-600 mt-2">Vendor management features coming soon...</p>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold">Reports Module</h1>
                  <p className="text-gray-600 mt-2">Reporting features coming soon...</p>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/team" element={
              <ProtectedRoute>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold">Team Management</h1>
                  <p className="text-gray-600 mt-2">Team management features coming soon...</p>
                </div>
              </ProtectedRoute>
            } />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
