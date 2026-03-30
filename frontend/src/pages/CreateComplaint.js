import React, { useState } from 'react';
// import { complaintsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 'default-category-id' // Default - replace with API fetch later
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  const token = localStorage.getItem('token');
  console.log('🔑 TOKEN:', token ? 'EXISTS' : 'MISSING'); // DEBUG
  
  if (!token) {
    setError('❌ Please login first');
    setLoading(false);
    return;
  }

  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('categoryId', formData.categoryId);
  if (image) {
    data.append('image', image);
  }

  try {
    // 🔥 DIRECT BACKEND URL + TOKEN = 201!
    const res = await fetch('http://localhost:5000/api/complaints', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`  // TOKEN HEADER!
      },
      body: data
    });

    if (res.ok) {
      setSuccess('✅ Complaint created!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      const errorText = await res.text();
      setError(`Error ${res.status}: ${errorText}`);
    }
  } catch (err) {
    setError('Network error');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create New Complaint</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 p-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 p-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description *
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category ID *
          </label>
          <input
            type="text"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            placeholder="default-category-id"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 focus:ring-4 focus:ring-green-300 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Submit Complaint'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Test:</h3>
        <p className="text-sm text-blue-800">
          Use categoryId: <code className="bg-blue-200 px-2 py-1 rounded font-mono text-xs">default-category-id</code>
        </p>
      </div>
    </div>
  );
};

export default CreateComplaint;

