import { useState, useCallback } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const request = useCallback(
    async (method, url, data = null, params = null) => {
      setLoading(true);
      setError('');

      try {
        let response;

        switch (method.toLowerCase()) {
          case 'get':
          case 'delete':
            response = await api[method](url, { params });
            break;

          case 'post':
          case 'put':
          case 'patch':
            response = await api[method](url, data, { params });
            break;

          default:
            throw new Error('Invalid HTTP method');
        }

        return response.data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Request failed';

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, request };
};