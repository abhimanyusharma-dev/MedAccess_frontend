import api, { USE_MOCK, simulateNetworkLatency } from './api';
import { mockUsers, mockPharmacies, mockAnalyticsData, mockFeedback } from '../data/mockData/db';

export const adminApi = {
  getUsersList: async () => {
    if (USE_MOCK) {
      await simulateNetworkLatency(400);
      return mockUsers.map(({ password, ...u }) => u); // Exclude passwords
    }
    const response = await api.get('/admin/users');
    return response.data;
  },

  getStoresList: async () => {
    if (USE_MOCK) {
      await simulateNetworkLatency(450);
      return mockPharmacies;
    }
    const response = await api.get('/admin/stores');
    return response.data;
  },

  verifyStore: async (storeId, verifiedStatus) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(500);
      const storeIndex = mockPharmacies.findIndex((p) => p.id === storeId);
      if (storeIndex === -1) throw new Error("Store pharmacy not found");
      
      mockPharmacies[storeIndex].verified = verifiedStatus;
      return mockPharmacies[storeIndex];
    }
    const response = await api.patch(`/admin/stores/${storeId}/verify`, { verified: verifiedStatus });
    return response.data;
  },

  getPlatformAnalytics: async () => {
    if (USE_MOCK) {
      await simulateNetworkLatency(600);
      return {
        growthMetrics: mockAnalyticsData.adminSystemGrowth,
        summary: {
          totalPatients: 3120,
          totalPharmacies: 98,
          activePrescriptions: 1245,
          pendingVerifications: mockPharmacies.filter(p => !p.verified).length,
          revenueGrownPercentage: 14.5
        }
      };
    }
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getPlatformFeedback: async () => {
    if (USE_MOCK) {
      await simulateNetworkLatency(350);
      return mockFeedback;
    }
    const response = await api.get('/admin/feedback');
    return response.data;
  }
};
