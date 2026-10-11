/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('user_data');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, [logout]);

  const login = async (credentials) => {
    const endpoint = import.meta.env.VITE_AUTH_ENDPOINT?.trim() || '/auth/login';
    const response = await api.post(endpoint, credentials);
    const data = response.data;
    const token = data?.access_token;
    const userData = data?.user;

    if (!token || !userData) {
      throw new Error('The login response did not contain a token and user.');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
