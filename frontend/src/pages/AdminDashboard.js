import React, { useState, useEffect, useCallback } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StatusBadge = ({ count, label, color, dot }) => (
  <div className={`rounded-2xl p-4 ${color} flex flex-col gap-1 shadow-sm`}>
    <span className="text-3xl font-extrabold text-slate-900">
      {typeof count === 'number' ? count : 0}
    </span>
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">
      <span className={`w-2 h-2 rounded-full ${dot || 'bg-slate-300'}`} />
      {label}
    </span>
  </div>
);

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const filter = 'ALL';

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(''); // ✅ FIXED (no err here)

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Not logged in. Please login as admin first.');
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data;

      if (!Array.isArray(data)) {
        data = data?.complaints || data?.data || [];
      }

      const valid = Array.isArray(data)
        ? data.filter(c => c && typeof c === 'object' && c.id)
        : [];

      setComplaints(valid);

    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        setTimeout(() => (window.location.href = '/login'), 1500);
      } else {
        setError(
          typeof err?.message === 'string'
            ? `Failed to load complaints (${err.message})`
            : 'Failed to load complaints'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (id, status) => {
    if (!id) return;

    const prev = [...complaints];

    // Optimistic update
    setComplaints(list =>
      list.map(c =>
        c.id === id ? { ...c, status } : c
      )
    );

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_BASE}/complaints/${encodeURIComponent(id.trim())}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (err) {
      setComplaints(prev);

      const statusCode = err?.response?.status;

      if (statusCode === 404) {
        alert('❌ Complaint not found');
      } else if (statusCode === 401) {
        alert('❌ Session expired');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(
          typeof err?.message === 'string'
            ? err.message
            : 'Update failed'
        );
      }
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c?.status === 'PENDING').length,
    inProgress: complaints.filter(c => c?.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c?.status === 'RESOLVED').length,
  };

  const filtered =
    filter === 'ALL'
      ? complaints
      : complaints.filter(c => c?.status === filter);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error && typeof error === 'string') {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl shadow-sm border border-red-100 p-6 text-center">
          <p className="text-red-600 mb-3 text-sm font-medium">{error}</p>
          <button
            onClick={fetchComplaints}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor all complaints and update status in one click.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatusBadge count={stats.total} label="Total" color="bg-white border border-slate-100" dot="bg-slate-400" />
            <StatusBadge count={stats.pending} label="Pending" color="bg-amber-50 border border-amber-100" dot="bg-amber-500" />
            <StatusBadge count={stats.inProgress} label="In Progress" color="bg-blue-50 border border-blue-100" dot="bg-blue-500" />
            <StatusBadge count={stats.resolved} label="Resolved" color="bg-emerald-50 border border-emerald-100" dot="bg-emerald-500" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200">
            <p className="text-lg font-medium text-slate-800 mb-2">No complaints found</p>
            <p className="text-sm text-slate-500 max-w-md text-center">
              When users submit complaints, they will appear here for review.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((complaint, index) => (
              <div
                key={complaint?.id || index}
                className="flex flex-col gap-3"
              >
                <ComplaintCard complaint={complaint || {}} />

                <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Update status</span>
                  <select
                    value={complaint?.status || 'PENDING'}
                    onChange={e => updateStatus(complaint?.id, e.target.value)}
                    className="ml-auto text-xs rounded-full border border-slate-200 px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;