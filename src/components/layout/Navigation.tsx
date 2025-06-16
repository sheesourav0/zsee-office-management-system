
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { getMenuItemsForUser } from '@/lib/permissions';
import { 
  Home, 
  Users, 
  FolderOpen, 
  CreditCard, 
  Building, 
  BarChart, 
  LogOut,
  Menu,
  X 
} from 'lucide-react';

const iconMap = {
  Home,
  Users,
  FolderOpen,
  CreditCard,
  Building,
  BarChart,
};

const Navigation = () => {
  const { user, userPermissions, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadMenuItems = async () => {
      if (user && userPermissions) {
        const items = await getMenuItemsForUser();
        setMenuItems(items);
      }
    };

    loadMenuItems();
  }, [user, userPermissions]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Office Management
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || Home;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Welcome, {user.email}
              </span>
              {userPermissions && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {userPermissions.userType}
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Home;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-3" />
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4">
              <div className="text-base font-medium text-gray-800">{user.email}</div>
              {userPermissions && (
                <div className="text-sm text-gray-500">{userPermissions.userType}</div>
              )}
            </div>
            <div className="mt-3 px-4">
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
