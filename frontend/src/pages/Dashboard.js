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
        const res = await complaintsAPI.getAll();
        setComplaints(res.data);
      } catch (err) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };


  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Total: {complaints.length} complaints
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint._id} complaint={complaint} />
        ))}
      </div>
      
      {complaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No complaints yet.</p>
          <a href="/create-complaint" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
            Create your first complaint
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

