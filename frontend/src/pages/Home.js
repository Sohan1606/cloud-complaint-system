import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Cloud Complaint
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto">
          File complaints instantly. Track status in real-time. 
          <span className="text-blue-600 font-semibold"> Resolution guaranteed.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Login
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Complaints Resolved</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">99.8%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">24h</div>
            <div className="text-gray-600">Avg Response</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-20 text-gray-800">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Secure</h3>
            <p className="text-gray-600">JWT authenticated, end-to-end encrypted complaints.</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time</h3>
            <p className="text-gray-600">Live status updates. Never miss complaint progress.</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all">
            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart</h3>
            <p className="text-gray-600">AI-powered categorization and priority routing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

