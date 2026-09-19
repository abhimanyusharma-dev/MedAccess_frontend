import React, { createContext, useState, useContext, useCallback } from 'react';

const PatientDataContext = createContext(null);

const INITIAL_PRESCRIPTIONS = [
  {
    id: 'rx-001',
    type: 'scanned',
    title: 'Prescription - Viral Fever',
    previewUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop',
    uploadDate: '2026-07-03',
    doctorName: 'Dr. Priya Sharma',
    hospitalName: 'Apollo Hospital, Bhopal',
    aiStatus: 'Analyzed',
    scanStatus: 'Complete',
    medicineCount: 4,
    status: 'pending',
  },
  {
    id: 'rx-002',
    type: 'scanned',
    title: 'Prescription - Allergy',
    previewUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=400&auto=format&fit=crop',
    uploadDate: '2026-06-28',
    doctorName: 'Dr. Rahul Mehta',
    hospitalName: 'City Care Clinic',
    aiStatus: 'Analyzed',
    scanStatus: 'Complete',
    medicineCount: 2,
    status: 'pending',
  },
  {
    id: 'rx-003',
    type: 'ordered',
    title: 'Prescription - Diabetes',
    previewUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop',
    uploadDate: '2026-06-15',
    doctorName: 'Dr. S. Verma',
    hospitalName: 'Govt. Medical College',
    pharmacyName: 'HealthPlus Pharmacy',
    pharmacyImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
    orderDate: '2026-06-16',
    reservationId: 'RES-883921',
    reservationStatus: 'Confirmed',
    pickupStatus: 'Ready for Pickup',
    paymentStatus: 'Pending (Pay at Store)',
    estimatedPickupTime: 'Today, 05:00 PM',
    pickupAddress: 'Shop 12, Data Colony, Bhopal',
    qrCode: 'QR-883921',
    totalMedicines: 5,
    totalQuantity: 12,
    totalAmount: 312.50,
    taxes: 15.50,
    aiStatus: 'Analyzed',
    scanStatus: 'Complete',
    medicineCount: 5,
    status: 'Ready for Pickup',
    orderedMedicines: [
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily', quantity: 2 },
      { name: 'Glimepiride 1mg', dosage: '1 tablet before breakfast', quantity: 1 }
    ]
  },
];

export const PatientDataProvider = ({ children }) => {
  // ── Prescriptions ─────────────────────────────────────────────────────────
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);

  const addPrescription = useCallback((prescription) => {
    setPrescriptions(prev => [
      {
        id: `rx-${Date.now()}`,
        type: 'scanned',
        uploadDate: new Date().toISOString().split('T')[0],
        aiStatus: 'Pending',
        scanStatus: 'Processing',
        status: 'pending',
        ...prescription,
      },
      ...prev,
    ]);
  }, []);

  const deletePrescription = useCallback((id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  }, []);

  // ── Saved Pharmacies ───────────────────────────────────────────────────────
  const [savedPharmacies, setSavedPharmacies] = useState([]);

  const toggleSavePharmacy = useCallback((pharmacy) => {
    setSavedPharmacies(prev => {
      const exists = prev.find(p => p.id === pharmacy.id);
      if (exists) {
        return prev.filter(p => p.id !== pharmacy.id);
      } else {
        return [...prev, pharmacy];
      }
    });
  }, []);

  const isPharmacySaved = useCallback((id) => {
    return savedPharmacies.some(p => p.id === id);
  }, [savedPharmacies]);

  const removePharmacy = useCallback((id) => {
    setSavedPharmacies(prev => prev.filter(p => p.id !== id));
  }, []);

  const value = {
    // Prescriptions
    prescriptions,
    addPrescription,
    deletePrescription,
    // Saved Pharmacies
    savedPharmacies,
    toggleSavePharmacy,
    isPharmacySaved,
    removePharmacy,
  };

  return (
    <PatientDataContext.Provider value={value}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const ctx = useContext(PatientDataContext);
  if (!ctx) throw new Error('usePatientData must be used inside PatientDataProvider');
  return ctx;
};
