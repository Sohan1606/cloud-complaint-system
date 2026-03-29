import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, role = 'user') => api.post('/auth/register', { email, password, role }),
};

// Complaints API
export const complaintsAPI = {
  getAll: () => api.get('/complaints'),
  create: (data) => api.post('/complaints', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStatus: (id, status) => api.put(`/complaints/${id}`, { status }),
  getUser: () => api.get('/complaints'), // same as getAll for user
};

// Stats API
export const statsAPI = {
  getUserStats: () => api.get('/stats'),
  getAdminStats: () => api.get('/stats'),
};

export default api;

