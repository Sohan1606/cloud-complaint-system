import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 'default-category-id'
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

    if (!token) {
      setError('❌ Please login first');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    if (image) data.append('image', image);

    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      let result;

      // ✅ SAFE JSON PARSE (prevents crash)
      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (res.ok) {
        setSuccess('✅ Complaint created successfully!');

        setFormData({
          title: '',
          description: '',
          categoryId: 'default-category-id'
        });
        setImage(null);

        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        // ✅ FORCE STRING ONLY
        const message =
          typeof result?.message === 'string'
            ? result.message
            : `Error ${res.status}`;

        setError(message);
      }
    } catch (err) {
      // ✅ NEVER PASS OBJECT
      setError(
        typeof err?.message === 'string'
          ? err.message
          : '❌ Network error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          Create a complaint
        </h1>
        <p className="text-sm text-slate-500 mb-8 text-center max-w-md mx-auto">
          Provide clear details and, if possible, an image. This helps admins resolve issues faster.
        </p>

      {/* ✅ SAFE ERROR RENDER */}
      {error && typeof error === 'string' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* ✅ SAFE SUCCESS RENDER */}
      {success && typeof success === 'string' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description *
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category ID *
          </label>
          <input
            type="text"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            accept="image/*"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Submit Complaint'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          Default category in this demo is
          <code className="ml-1 bg-blue-200 px-2 py-0.5 rounded">
            default-category-id
          </code>
          . You can change this later when you add real categories.
        </p>
      </div>
      </div>
    </div>
  );
};

export default CreateComplaint;