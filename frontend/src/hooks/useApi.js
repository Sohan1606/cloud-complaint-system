import { useState, useCallback } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError('');
    
    try {
      const config = data ? { data } : {};
      const response = await api[method.toLowerCase()](url, config);
      return response.data;
    } catch (err) {
      setError(err.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};

