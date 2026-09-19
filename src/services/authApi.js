import api, { USE_MOCK, simulateNetworkLatency } from './api';
import { mockUsers } from '../data/mockData/db';

export const authApi = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(600);
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) {
        throw new Error('Invalid email or password.');
      }
      return {
        token: `mock_jwt_token_${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          details: user.details
        }
      };
    }
    
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (registerData) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(800);
      const emailExists = mockUsers.some(
        (u) => u.email.toLowerCase() === registerData.email.toLowerCase()
      );
      if (emailExists) {
        throw new Error('Email address already registered.');
      }
      
      const newUser = {
        id: `usr_${registerData.role === 'pharmacy' ? 'phr' : 'pat'}_${Date.now()}`,
        email: registerData.email,
        name: registerData.name,
        role: registerData.role || 'patient',
        details: registerData.role === 'pharmacy' ? {
          storeName: registerData.storeName || 'New Pharmacy Store',
          address: registerData.address || 'Pending Location',
          licenseNumber: registerData.licenseNumber || 'PENDING-LIC-99',
          rating: 5.0,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${registerData.name}`
        } : {
          age: parseInt(registerData.age) || 30,
          gender: registerData.gender || 'Not Specified',
          bloodGroup: registerData.bloodGroup || 'O+',
          allergies: [],
          chronicConditions: [],
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${registerData.name}`
        }
      };
      
      return {
        token: `mock_jwt_token_${newUser.id}`,
        user: newUser
      };
    }
    
    const response = await api.post('/auth/register', registerData);
    return response.data;
  },

  sendPhoneOTP: async (phone) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(800);
      return { success: true, message: 'OTP sent to ' + phone };
    }
    const response = await api.post('/auth/send-phone-otp', { phone });
    return response.data;
  },

  verifyPhoneOTP: async (phone, otp) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(1000);
      if (otp === '123456') return { success: true };
      throw new Error('Invalid OTP code.');
    }
    const response = await api.post('/auth/verify-phone-otp', { phone, otp });
    return response.data;
  },

  sendEmailOTP: async (email) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(800);
      return { success: true, message: 'OTP sent to ' + email };
    }
    const response = await api.post('/auth/send-email-otp', { email });
    return response.data;
  },

  verifyEmailOTP: async (email, otp) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(1000);
      if (otp === '123456') return { success: true };
      throw new Error('Invalid OTP code.');
    }
    const response = await api.post('/auth/verify-email-otp', { email, otp });
    return response.data;
  },


  getCurrentUser: async () => {
    if (USE_MOCK) {
      await simulateNetworkLatency(300);
      const token = localStorage.getItem('medaccess_token');
      if (!token) throw new Error('Unauthenticated');
      
      const userId = token.replace('mock_jwt_token_', '');
      const user = mockUsers.find((u) => u.id === userId);
      
      if (!user) {
        throw new Error('Session expired or invalid token.');
      }
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          details: user.details
        }
      };
    }
    
    const response = await api.get('/auth/me');
    return response.data;
  }
};
