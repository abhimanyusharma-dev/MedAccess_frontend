import api, { USE_MOCK, simulateNetworkLatency } from './api';
import { mockMedicines, mockPharmacies, mockReservations, mockPrescriptions } from '../data/mockData/db';

export const medicineApi = {
  getMedicines: async (search = "") => {
    if (USE_MOCK) {
      await simulateNetworkLatency(400);
      if (!search) return mockMedicines;
      return mockMedicines.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.type.toLowerCase().includes(search.toLowerCase())
      );
    }
    const response = await api.get('/medicines', { params: { search } });
    return response.data;
  },

  getNearbyPharmacies: async (zipCode = "") => {
    if (USE_MOCK) {
      await simulateNetworkLatency(500);
      return mockPharmacies; // Return all mock pharmacies in local zone
    }
    const response = await api.get('/pharmacies/nearby', { params: { zipCode } });
    return response.data;
  },

  uploadPrescription: async (formData) => {
    // formData contains file, instructions, pharmacyId, patientId, etc.
    if (USE_MOCK) {
      await simulateNetworkLatency(1000);
      const newRx = {
        id: `rx_${Date.now().toString().slice(-4)}`,
        patientId: formData.patientId || "usr_pat_01",
        patientName: formData.patientName || "Alex Rivera",
        pharmacyId: formData.pharmacyId || "phr_01",
        pharmacyName: mockPharmacies.find(p => p.id === formData.pharmacyId)?.name || "Apex BioCare Pharmacy",
        uploadedAt: new Date().toISOString(),
        status: "pending",
        fileUrl: formData.file?.name || "uploaded_prescription.pdf",
        instructions: formData.instructions || "Dispense as prescribed.",
        items: []
      };
      
      mockPrescriptions.unshift(newRx);
      return newRx;
    }
    const response = await api.post('/prescriptions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getReservations: async (patientId) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(300);
      return mockReservations.filter((r) => r.patientId === patientId);
    }
    const response = await api.get(`/reservations/patient/${patientId}`);
    return response.data;
  },

  createReservation: async (reservationData) => {
    if (USE_MOCK) {
      await simulateNetworkLatency(600);
      const newRes = {
        id: `res_${Date.now().toString().slice(-4)}`,
        prescriptionId: reservationData.prescriptionId || null,
        patientId: reservationData.patientId || "usr_pat_01",
        pharmacyId: reservationData.pharmacyId,
        pharmacyName: mockPharmacies.find(p => p.id === reservationData.pharmacyId)?.name || "Pharmacy Store",
        reservedAt: new Date().toISOString(),
        pickupBy: reservationData.pickupBy || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        totalAmount: reservationData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: reservationData.items
      };
      mockReservations.unshift(newRes);
      return newRes;
    }
    const response = await api.post('/reservations', reservationData);
    return response.data;
  }
};
