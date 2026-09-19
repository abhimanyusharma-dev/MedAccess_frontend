import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('medaccess_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
        setRole(data.user.role);
      } catch (err) {
        console.error('Session initialization failed:', err.message);
        localStorage.removeItem('medaccess_token');
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('medaccess_token', data.token);
      setUser(data.user);
      setRole(data.user.role);
      toast.success(`Welcome back, ${data.user.name}!`, {
        style: {
          background: '#0B1728',
          color: '#FFFFFF',
          border: '1px solid rgba(0, 230, 118, 0.2)',
          boxShadow: '0 0 10px rgba(0, 230, 118, 0.1)'
        }
      });
      return data.user;
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.', {
        style: {
          background: '#0B1728',
          color: '#FFFFFF',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      const data = await authApi.register(registerData);
      localStorage.setItem('medaccess_token', data.token);
      setUser(data.user);
      setRole(data.user.role);
      toast.success('Registration successful!', {
        style: {
          background: '#0B1728',
          color: '#FFFFFF',
          border: '1px solid rgba(0, 230, 118, 0.2)'
        }
      });
      return data.user;
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.', {
        style: {
          background: '#0B1728',
          color: '#FFFFFF',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('medaccess_token');
    setUser(null);
    setRole(null);
    toast.success('Successfully logged out.', {
      style: {
        background: '#0B1728',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }
    });
  };

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
