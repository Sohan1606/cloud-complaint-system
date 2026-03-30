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
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="text-red-600 text-sm font-medium">Invalid complaint data</div>
      </div>
    );
  }

  const status = complaint.status || 'PENDING';
  const priority = complaint.priority || 'MEDIUM';

  const statusInfo = statusConfig[status] || statusConfig.PENDING;
  const priorityInfo = priorityConfig[priority] || priorityConfig.MEDIUM;

  const userEmail =
    typeof complaint?.user?.email === 'string'
      ? complaint.user.email
      : 'unknown@example.com';

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

  // Image URL (supports both new + old fields) and works in prod.
  let imageUrl = null;
  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');

  if (typeof complaint?.imageUrl === 'string') {
    imageUrl = complaint.imageUrl.startsWith('http')
      ? complaint.imageUrl
      : `${backendOrigin}/${complaint.imageUrl.replace(/^\//, '')}`;
  } else if (typeof complaint?.image === 'string') {
    // fallback for old data (optional safety)
    imageUrl = complaint.image.startsWith('http')
      ? complaint.image
      : `${backendOrigin}/${complaint.image.replace(/^\//, '')}`;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2">
            {typeof complaint.title === 'string'
              ? complaint.title
              : 'Untitled Complaint'}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
            title={statusInfo.label}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityInfo.bg} ${priorityInfo.text}`}
          >
            {priorityInfo.label}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
          {typeof complaint.description === 'string'
            ? complaint.description
            : 'No description provided.'}
        </p>

        {imageUrl && (
          <div className="mt-4 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
            <img
              src={imageUrl}
              alt="Complaint evidence"
              className="w-full h-44 object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between gap-3">
        <span className="truncate" title={userEmail}>
          By {userEmail}
        </span>
        <span className="shrink-0">{createdDate}</span>
      </div>

      <div className="px-4 pb-4 text-[11px] text-slate-400 font-mono">
        ID: {shortId}...
      </div>
    </div>
  );
};

export default ComplaintCard;