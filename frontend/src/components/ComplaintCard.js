import React from 'react';

const statusConfig = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
};

const priorityConfig = {
  LOW: { label: 'Low', bg: 'bg-gray-100', text: 'text-gray-600' },
  MEDIUM: { label: 'Medium', bg: 'bg-orange-100', text: 'text-orange-700' },
  HIGH: { label: 'High', bg: 'bg-red-100', text: 'text-red-700' },
  URGENT: { label: 'Urgent', bg: 'bg-purple-100', text: 'text-purple-800' },
};

const ComplaintCard = ({ complaint }) => {
  // 🚨 HARD GUARD
  if (!complaint || typeof complaint !== 'object') {
    return <div className="text-red-500 text-sm">Invalid complaint data</div>;
  }

  const status = complaint.status || 'PENDING';
  const priority = complaint.priority || 'MEDIUM';

  const statusInfo = statusConfig[status] || statusConfig.PENDING;
  const priorityInfo = priorityConfig[priority] || priorityConfig.MEDIUM;

  const userEmail =
    typeof complaint?.user?.email === 'string'
      ? complaint.user.email
      : 'unknown@example.com';

  const userName =
    complaint?.user?.username ||
    complaint?.user?.name ||
    (userEmail.includes('@') ? userEmail.split('@')[0] : 'User');

  const createdDate = complaint?.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Just now';

  const shortId =
    typeof complaint?.id === 'string'
      ? complaint.id.slice(0, 8)
      : '--------';

  // ✅ FIXED IMAGE LOGIC (supports both new + old)
  let imageUrl = null;

  if (typeof complaint?.imageUrl === 'string') {
    imageUrl = complaint.imageUrl.startsWith('http')
      ? complaint.imageUrl
      : `http://localhost:5000/${complaint.imageUrl}`;
  } else if (typeof complaint?.image === 'string') {
    // fallback for old data (optional safety)
    imageUrl = complaint.image.startsWith('http')
      ? complaint.image
      : `http://localhost:5000/${complaint.image}`;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Image */}
      {imageUrl && (
        <div className="rounded-lg overflow-hidden h-36 bg-gray-100">
          <img
            src={imageUrl}
            alt="Complaint evidence"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
        {typeof complaint.title === 'string'
          ? complaint.title
          : 'Untitled Complaint'}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2">
        {typeof complaint.description === 'string'
          ? complaint.description
          : 'No description provided.'}
      </p>

      {/* Status + Priority */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
          {statusInfo.label}
        </span>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityInfo.bg} ${priorityInfo.text}`}
        >
          {priorityInfo.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
        <span className="truncate max-w-[60%]" title={userEmail}>
          👤 {userName}
        </span>
        <span>{createdDate}</span>
      </div>

      {/* ID */}
      <div className="text-xs text-gray-300 font-mono">
        #{shortId}...
      </div>
    </div>
  );
};

export default ComplaintCard;