import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { Receipt, TrendingUp, Diamond, Sparkles, Warehouse, Newspaper, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/invoice', label: 'Invoice', icon: Receipt },
    { path: '/sales', label: 'Sales', icon: TrendingUp },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-50">
        <div className="px-4 sm:px-8 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-sm opacity-75"></div>
                <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 sm:p-3 rounded-xl">
                  <Diamond className="size-6 sm:size-7 text-slate-900" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  Luxe Jewelry
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/60 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Premium Point of Sale
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation & User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex gap-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/news');
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative group
                        ${isActive 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/30' 
                          : 'text-amber-100/80 hover:text-amber-100 hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <Icon className="size-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Menu Desktop */}
              <div className="flex items-center gap-3 pl-4 border-l border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-200/80">
                  <User className="size-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  <LogOut className="size-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-amber-100 hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-amber-500/20">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/news');
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/30' 
                          : 'text-amber-100/80 hover:text-amber-100 hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <Icon className="size-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {/* User Menu Mobile */}
                <div className="mt-2 pt-2 border-t border-amber-500/20">
                  <div className="flex items-center gap-2 px-4 py-2 text-amber-200/80 text-sm">
                    <User className="size-4" />
                    <span>{user?.name}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 mt-2"
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}