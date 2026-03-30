import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';



const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false
  });

  useEffect(() => {
    // API interceptor handles token
  }, []);

  const login = async (email, password) => {
    try {
      // POST /api/auth/login (base URL is configured in authAPI)
      const res = await authAPI.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      return res.data;
    } catch (error) {
      // Always re-throw a plain string so callers can safely render it.
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed';
      throw message;
    }
  };



  const register = async (email, password, role = 'user') => {
    try {
      // POST /api/auth/register
      const res = await authAPI.post('/auth/register', { email, password, role });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      return res.data;
    } catch (error) {
      // Always re-throw a plain string so callers can safely render it.
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed';
      throw message;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

