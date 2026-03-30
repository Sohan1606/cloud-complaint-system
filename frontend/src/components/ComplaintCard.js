import React from 'react';

const ComplaintCard = ({ complaint, updateStatus }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-300',
    RESOLVED: 'bg-green-100 text-green-800 border-green-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300'
  };

  const getStatusColor = (status) => statusColors[status.toUpperCase()] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{complaint.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)} border`}>
          {complaint.status.replace('_', ' ').replace('-', ' ').toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{complaint.description}</p>
      
{complaint.imageUrl && (
        <img 
          src={complaint.imageUrl.startsWith('http') ? complaint.imageUrl : `http://localhost:5000${complaint.imageUrl}`}
          alt="Complaint" 
          className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
          onError={(e) => {
            console.log('Image load failed:', complaint.imageUrl);
            e.target.style.display = 'none';
          }}
        />
      )}
      
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
        <span>👤 {complaint.user?.email || 'Unknown'}</span>
        <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
        <span>🏷️ Priority: {complaint.priority || 'LOW'}</span>
        <span>🆔 {complaint.id.slice(0,8)}...</span>
      </div>

      {updateStatus && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Update Status:
          </label>
          <select 
            value={complaint.status} 
            onChange={(e) => updateStatus(complaint.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gradient-to-r from-white to-blue-50 text-sm font-medium"
          >
            <option value="PENDING">⏳ PENDING</option>
            <option value="IN_PROGRESS">⚙️ IN PROGRESS</option>
            <option value="RESOLVED">✅ RESOLVED</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;

