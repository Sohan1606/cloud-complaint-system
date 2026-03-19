import React from 'react';
import { Home, Plus, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
    },
    {
      path: '/create-complaint',
      icon: Plus,
      label: 'Create',
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border-t border-slate-200/50 dark:border-slate-700/50 z-50 md:hidden">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={clsx(
              'flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 group',
              {
                'text-blue-600 shadow-lg bg-blue-50 dark:bg-blue-900/20': location.pathname === path,
                'text-slate-600 hover:text-blue-600 dark:text-slate-300 hover:dark:text-blue-400 hover:shadow-md': location.pathname !== path,
              }
            )}
          >
            <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

