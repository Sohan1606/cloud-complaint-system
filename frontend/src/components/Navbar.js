import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check localStorage for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    ...(isAuthenticated ? [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/create-complaint', label: 'New Complaint', icon: '➕' },
      { path: '/profile', label: 'Profile', icon: '👤' },
      ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : [])
    ] : [
      { path: '/login', label: 'Login', icon: '🔐' },
      { path: '/register', label: 'Register', icon: '✍️' }
    ])
  ];

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              ComplaintCloud
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated && (
              <div className="flex items-center space-x-4 mr-4">
                <span className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
            )}
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2',
                  {
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow-md': location.pathname === path,
                    'text-slate-700 hover:text-blue-600 dark:text-slate-300 hover:dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800': location.pathname !== path,
                  }
                )}
              >
                <span className="text-sm">{label}</span>
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <span className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-700 dark:text-slate-300">
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'px-4 py-3 rounded-xl font-medium transition-all flex items-center space-x-3',
                    {
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 shadow-md': location.pathname === path,
                      'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800': location.pathname !== path,
                    }
                  )}
                >
                  <span>{label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all shadow-md w-full text-left flex items-center space-x-3"
                >
                  <span>Logout</span>
                </button>
              )}
              <div className="px-2 pt-2">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center space-x-2 w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  <span>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

