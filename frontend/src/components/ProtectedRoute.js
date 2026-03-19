import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, token } = useAuth();


  useEffect(() => {
    if (isAuthenticated && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [isAuthenticated, token]);


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

