import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import BackButton from './BackButton';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Show back button except on home/login/register
  const showBackButton = !['/', '/login', '/register'].includes(location.pathname);
  
  // Show bottom nav only on authenticated dashboard pages
  const showBottomNav = location.pathname.includes('/dashboard') || location.pathname === '/create-complaint';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="pt-4 pb-20 px-4 max-w-7xl mx-auto">
        {showBackButton && (
          <BackButton navigate={navigate} />
        )}
        <div className="mb-6">
          {children}
        </div>
      </main>
      
      {showBottomNav && <BottomNav />}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          },
        }}
      />
    </div>
  );
};

export default AppLayout;

