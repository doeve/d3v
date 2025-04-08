import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import authApi from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  
  const login = useCallback(async (key) => {
    try {
      setLoading(true);
      const response = await authApi.login(key);
      
      const { token, data } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);
  
  const checkAuth = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return false;
    }
    
    try {
      const response = await authApi.getProfile();
      setUser(response.data.user);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
      setLoading(false);
      return false;
    }
  }, [token, logout]);
  
  const createUser = useCallback(async (key) => {
    try {
      const response = await authApi.createUser({ key });
      toast.success('User created successfully');
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
      throw error;
    }
  }, []);
  
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    checkAuth,
    createUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};