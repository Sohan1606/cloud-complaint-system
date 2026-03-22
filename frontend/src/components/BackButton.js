import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
// import clsx from 'clsx';

const BackButton = ({ navigate }) => {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Home</span>
      </button>
    </div>
  );
};

export default BackButton;

