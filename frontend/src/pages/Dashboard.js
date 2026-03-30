import React, { useState, useEffect } from 'react';
import { complaintsAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';


const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
      try {
        const res = await complaintsAPI.get('/complaints');
        setComplaints(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl shadow-sm border border-red-100 p-6 text-center">
          <p className="text-red-600 mb-3 text-sm font-medium">{error}</p>
          <p className="text-xs text-slate-500">
            Please try refreshing the page. If the problem continues, contact an admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Complaints</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track everything you have reported in one clean place.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total complaints
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm px-4 py-2 text-sm font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {complaints.length}
            </span>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200">
            <p className="text-lg font-medium text-slate-800 mb-2">No complaints yet</p>
            <p className="text-sm text-slate-500 mb-6 max-w-md text-center">
              When you create a complaint, it will appear here with its status and details.
            </p>
            <a
              href="/create-complaint"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-6 py-2.5 text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
            >
              <span>+ Create your first complaint</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint?.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

