import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ComplaintCard from '../components/ComplaintCard';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      fetchComplaints(); // Refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  const statusOptions = ['pending', 'in-progress', 'resolved'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Total: {complaints.length} complaints
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{complaints.map((complaint) => (
          <div key={complaint.id || complaint._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg">
            <ComplaintCard key={complaint.id || complaint._id} complaint={complaint} />
            <div className="mt-4 pt-4 border-t">
              <select
                value={complaint.status}
                onChange={(e) => updateStatus(complaint.id || complaint._id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

