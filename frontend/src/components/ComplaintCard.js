import React from 'react';

const ComplaintCard = ({ complaint }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{complaint.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[complaint.status]}`}>
          {complaint.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">{complaint.description}</p>
      
      {complaint.image && (
        <img 
src={complaint.imageUrl} 
          alt="Complaint" 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By {complaint.user.email}</span>
        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ComplaintCard;

