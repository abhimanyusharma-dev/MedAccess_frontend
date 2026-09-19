import api, { USE_MOCK, simulateNetworkLatency } from './api';
import { mockPrescriptions, mockPharmacies, mockAnalyticsData, mockMedicines } from '../data/mockData/db';

export const pharmacyApi = {
  getPrescriptionRequests: async (pharmacyId) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(450);
      return mockPrescriptions.filter((p) => p.pharmacyId === pharmacyId);
    }
    const response = await api.get(`/pharmacies/${pharmacyId}/prescriptions`);
    return response.data;
  },

  updatePrescriptionStatus: async (rxId, status, items = []) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(500);
      const rxIndex = mockPrescriptions.findIndex((p) => p.id === rxId);
      if (rxIndex === -1) throw new Error("Prescription request not found");
      
      mockPrescriptions[rxIndex].status = status;
      if (items.length > 0) {
        mockPrescriptions[rxIndex].items = items;
      }
      return mockPrescriptions[rxIndex];
    }
    const response = await api.patch(`/prescriptions/${rxId}/status`, { status, items });
    return response.data;
  },

  getInventory: async (pharmacyId) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(400);
      const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
      if (!pharmacy) return [];
      
      // Map inventory containing only medicineId to include name, type, and total catalog stock
      return pharmacy.inventory.map(item => {
        const medDetail = mockMedicines.find(m => m.id === item.medicineId);
        return {
          medicineId: item.medicineId,
          name: medDetail?.name || "Unknown Medicine",
          type: medDetail?.type || "General",
          price: item.price,
          stock: item.stock,
          requiresPrescription: medDetail?.requiresPrescription || false
        };
      });
    }
    const response = await api.get(`/pharmacies/${pharmacyId}/inventory`);
    return response.data;
  },

  updateInventoryStock: async (pharmacyId, medicineId, newStock, newPrice) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(300);
      const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
      if (!pharmacy) throw new Error("Pharmacy not found");
      
      const invItemIndex = pharmacy.inventory.findIndex(i => i.medicineId === medicineId);
      if (invItemIndex !== -1) {
        pharmacy.inventory[invItemIndex].stock = parseInt(newStock);
        pharmacy.inventory[invItemIndex].price = parseFloat(newPrice);
        return pharmacy.inventory[invItemIndex];
      } else {
        const newItem = { medicineId, price: parseFloat(newPrice), stock: parseInt(newStock) };
        pharmacy.inventory.push(newItem);
        return newItem;
      }
    }
    const response = await api.post(`/pharmacies/${pharmacyId}/inventory/update`, { medicineId, stock: newStock, price: newPrice });
    return response.data;
  },

  getPharmacyAnalytics: async (pharmacyId) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(600);
      return mockAnalyticsData.pharmacyMonthlyRevenue;
    }
    const response = await api.get(`/pharmacies/${pharmacyId}/analytics`);
    return response.data;
  },

  getStoreComparison: async () => {
    if (USE_MOCK) {
      await simulateNetworkLatency(400);
      return mockAnalyticsData.storeComparison;
    }
    const response = await api.get('/pharmacies/comparison-metrics');
    return response.data;
  }
};
