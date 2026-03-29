import React from 'react';

const ComplaintCard = ({ complaint }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
    default: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const status = complaint?.status?.toLowerCase() || 'pending';
  const priority = complaint?.priority?.toLowerCase() || 'medium';

  const truncate = (text, maxLength = 100) => {
    if (text?.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 pr-2 flex-1">
          {complaint?.title || 'Untitled Complaint'}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
          statusColors[status] || statusColors.default
        }`}>
          {complaint?.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
        </span>
      </div>

      {/* Priority Badge */}
      {priority && (
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorityColors[priority] || priorityColors.default
          }`}>
            {priority.toUpperCase()}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {truncate(complaint?.description, 100)}
      </p>

      {/* Image */}
      {complaint?.imageUrl && (
        <div className="mb-4">
          <img 
            src={complaint.imageUrl} 
          alt="Complaint" // eslint-disable-line jsx-a11y/img-redundant-alt 
            className="w-full h-48 object-cover rounded-lg shadow-sm"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
        <span>
          By {complaint?.user?.email || 'Unknown User'}
        </span>
        <span className="font-medium">
          {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Unknown Date'}
        </span>
      </div>

      {/* Complaint ID */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
          ID: {complaint?.id?.slice(0, 8) || 'N/A'}...
        </span>
      </div>
    </div>
  );
};

export default ComplaintCard;

