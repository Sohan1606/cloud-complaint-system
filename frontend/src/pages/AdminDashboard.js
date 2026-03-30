import React, { useState, useEffect } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import axios from 'axios';  // 🔥 DIRECT!

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No auth token! Login first.');
        setLoading(false);
        return;
      }
      
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const res = await axios.get(`${apiUrl}/complaints/debug`, {  // 🔥 /debug shows ALL + valid IDs
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 🔥 Filter VALID complaints with proper IDs
      console.log('DEBUG RAW:', res.data);
      const rawData = res.data;
      let validComplaints = [];
      
      if (Array.isArray(rawData)) {
        validComplaints = rawData.filter(c => c && c.id);
      } else if (rawData.recent && Array.isArray(rawData.recent)) {
        validComplaints = rawData.recent.filter(c => c && c.id);
      }
      
      console.log('LOADED RAW:', validComplaints.length, 'complaints');
      setComplaints(validComplaints);
      console.log(`✅ Loaded ${validComplaints.length} VALID complaints`);
    } catch (err) {
      console.error('Fetch error:', err.response?.status, err.message);
      setError(`Failed to fetch: ${err.response?.status || 'Network'}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    console.log('🔥 UPDATE:', id?.slice(0,8), '→', status);
    
    if (!id || typeof id !== 'string' || id.trim() === '') {
      alert('❌ Invalid complaint ID!');
      return;
    }

    // 🔥 OPTIMISTIC UPDATE
    const originalComplaints = [...complaints];
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
    ));

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const response = await axios.put(
        `${apiUrl}/complaints/${encodeURIComponent(id.trim())}`,  // 🔥 URL encode ID
        { status },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000  // 🔥 5s timeout
        }
      );
      
      console.log('✅ SUCCESS:', response.status, response.data);
      
    } catch (err) {
      console.error('❌ ERROR:', err.response?.status, err.message);
      
      // 🔥 REVERT on error
      setComplaints(originalComplaints);
      
      if (err.response?.status === 404) {
        alert(`❌ Complaint ${id.slice(0,8)}... NOT FOUND!\n💡 1. Check /api/complaints/debug\n💡 2. File NEW complaint first`);
      } else if (err.response?.status === 401) {
        alert('❌ UNAUTHORIZED! Login again: admin@example.com / admin123');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (err.code === 'ECONNABORTED') {
        alert('❌ Backend timeout! Is localhost:5000 running?');
      } else {
        alert(`❌ Error ${err.response?.status || err.code}\n${err.message.slice(0,50)}`);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg">Loading complaints...</div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12 text-red-600">
      <div>{error}</div>
      <button 
        onClick={fetchComplaints}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        🔄 Retry
      </button>
    </div>
  );

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Valid: {complaints.length} complaints
        </div>
      </div>
      
      {complaints.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl p-8">
          <p className="text-xl mb-4">📭 No valid complaints yet</p>
          <p>Students need to file complaints first</p>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-800 mb-1">Debug:</p>
            <p>Open DevTools → Console → Check Network tab</p>
            <p>Backend endpoint: <code>http://localhost:5000/api/complaints/debug</code></p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={fetchComplaints}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
            <button
onClick={() => window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/complaints/debug`, '_blank')} 
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔍 Debug API
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border">
                <div className="mb-3">
                  <ComplaintCard complaint={complaint} />
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status: <span className="font-bold text-lg capitalize">{complaint.status}</span>
                  </label>
                  <select 
                    value={complaint.status} 
                    onChange={(e) => updateStatus(complaint.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {complaint.id.slice(0,8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;