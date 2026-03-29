import { User, FileText, Calendar, Plus, Shield, Mail } from "lucide-react";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    resolved: 0 
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      if (!user) return;

      const res = await api.get('/stats'); // ✅ correct endpoint
      setStats(res.data);

    } catch (error) {
      addNotification('Failed to load stats', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, addNotification]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl">
            <User className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-2">
            {user?.email}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-8">
            <Shield className="w-4 h-4" />
            <span>{user?.role?.toUpperCase()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Total Complaints</h3>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.total}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pending</h3>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.pending} {/* ✅ fixed */}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Mail className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resolved</h3>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.resolved}
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
            Account Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-slate-700 rounded-2xl hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-600"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                View My Complaints
              </span>
            </button>

            <button
              onClick={() => navigate('/create-complaint')}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create New Complaint</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;