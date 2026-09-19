// In-memory mock database for MedAccess SaaS

export const mockUsers = [
  {
    id: "usr_pat_01",
    email: "patient@medaccess.com",
    password: "password123",
    name: "Alex Rivera",
    role: "patient",
    details: {
      age: 29,
      gender: "Male",
      bloodGroup: "O+",
      allergies: ["Penicillin", "Peanuts"],
      chronicConditions: ["None"],
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
    }
  },
  {
    id: "usr_phr_02",
    email: "pharmacy@medaccess.com",
    password: "password123",
    name: "Dr. Sarah Jenkins",
    role: "pharmacy",
    details: {
      storeName: "Apex BioCare Pharmacy",
      address: "412 Futuristic Parkway, Sector 9",
      licenseNumber: "PH-2026-99182",
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
    }
  },
  {
    id: "usr_adm_03",
    email: "admin@medaccess.com",
    password: "password123",
    name: "System Director",
    role: "admin",
    details: {
      clearanceLevel: "SuperAdmin",
      department: "Global Platform Audits",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
    }
  }
];

export const mockMedicines = [
  { id: "med_01", name: "Amoxicillin 500mg", type: "Antibiotic", price: 12.50, stock: 120, requiresPrescription: true },
  { id: "med_02", name: "Atorvastatin 20mg", type: "Cardiovascular", price: 24.99, stock: 85, requiresPrescription: true },
  { id: "med_03", name: "Metformin 1000mg", type: "Antidiabetic", price: 15.00, stock: 200, requiresPrescription: true },
  { id: "med_04", name: "Ibuprofen 400mg", type: "Analgesic", price: 5.75, stock: 450, requiresPrescription: false },
  { id: "med_05", name: "Cetirizine 10mg", type: "Antihistamine", price: 8.20, stock: 300, requiresPrescription: false },
  { id: "med_06", name: "Lisinopril 10mg", type: "ACE Inhibitor", price: 18.00, stock: 90, requiresPrescription: true },
  { id: "med_07", name: "Albuterol HFA Inhaler", type: "Bronchodilator", price: 35.50, stock: 40, requiresPrescription: true }
];

export const mockPharmacies = [
  {
    id: "phr_01",
    name: "Apex BioCare Pharmacy",
    distance: "0.8 miles",
    address: "412 Futuristic Parkway, Sector 9",
    phone: "(555) 102-3928",
    verified: true,
    rating: 4.8,
    lat: 40.7128,
    lng: -74.0060,
    inventory: [
      { medicineId: "med_01", price: 12.00, stock: 50 },
      { medicineId: "med_02", price: 23.50, stock: 30 },
      { medicineId: "med_04", price: 5.50, stock: 100 },
      { medicineId: "med_07", price: 34.00, stock: 15 }
    ]
  },
  {
    id: "phr_02",
    name: "Nova Health Wellness",
    distance: "1.4 miles",
    address: "788 Cybernetic Ave, Suite B",
    phone: "(555) 983-1122",
    verified: true,
    rating: 4.5,
    lat: 40.7258,
    lng: -74.0180,
    inventory: [
      { medicineId: "med_01", price: 13.00, stock: 80 },
      { medicineId: "med_03", price: 14.80, stock: 60 },
      { medicineId: "med_04", price: 6.00, stock: 200 },
      { medicineId: "med_05", price: 7.90, stock: 150 }
    ]
  },
  {
    id: "phr_03",
    name: "Helix Gen-Rx Store",
    distance: "2.3 miles",
    address: "109 Horizon Boulevard",
    phone: "(555) 441-9032",
    verified: false,
    rating: 4.1,
    lat: 40.6998,
    lng: -73.9880,
    inventory: [
      { medicineId: "med_02", price: 26.00, stock: 40 },
      { medicineId: "med_03", price: 16.00, stock: 120 },
      { medicineId: "med_06", price: 19.50, stock: 75 }
    ]
  }
];

export const mockPrescriptions = [
  {
    id: "rx_1001",
    patientId: "usr_pat_01",
    patientName: "Alex Rivera",
    pharmacyId: "phr_01",
    pharmacyName: "Apex BioCare Pharmacy",
    uploadedAt: "2026-06-12T10:30:00Z",
    status: "approved", // pending, approved, rejected, completed
    fileUrl: "prescription_scan_rivera.pdf",
    instructions: "Take 1 capsule of Amoxicillin every 8 hours for 7 days.",
    items: [
      { medicineId: "med_01", name: "Amoxicillin 500mg", quantity: 21, price: 12.00 }
    ]
  },
  {
    id: "rx_1002",
    patientId: "usr_pat_01",
    patientName: "Alex Rivera",
    pharmacyId: "phr_02",
    pharmacyName: "Nova Health Wellness",
    uploadedAt: "2026-06-14T14:15:00Z",
    status: "pending",
    fileUrl: "lipids_prescription_rev.jpg",
    instructions: "1 tablet of Atorvastatin 20mg at bedtime daily.",
    items: [
      { medicineId: "med_02", name: "Atorvastatin 20mg", quantity: 30, price: 23.50 }
    ]
  }
];

export const mockReservations = [
  {
    id: "res_9801",
    prescriptionId: "rx_1001",
    patientId: "usr_pat_01",
    pharmacyId: "phr_01",
    pharmacyName: "Apex BioCare Pharmacy",
    reservedAt: "2026-06-12T12:00:00Z",
    pickupBy: "2026-06-19",
    status: "ready", // pending, ready, picked_up, expired
    totalAmount: 252.00, // 21 * 12.00
    items: [
      { medicineId: "med_01", name: "Amoxicillin 500mg", quantity: 21, price: 12.00 }
    ]
  }
];

export const mockAnalyticsData = {
  pharmacyMonthlyRevenue: [
    { month: "Jan", revenue: 4500, orders: 120 },
    { month: "Feb", revenue: 5200, orders: 145 },
    { month: "Mar", revenue: 6100, orders: 170 },
    { month: "Apr", revenue: 5800, orders: 160 },
    { month: "May", revenue: 7200, orders: 195 },
    { month: "Jun", revenue: 8500, orders: 230 }
  ],
  adminSystemGrowth: [
    { month: "Jan", patients: 800, pharmacies: 45 },
    { month: "Feb", patients: 1100, pharmacies: 52 },
    { month: "Mar", patients: 1500, pharmacies: 60 },
    { month: "Apr", patients: 1900, pharmacies: 72 },
    { month: "May", patients: 2400, pharmacies: 85 },
    { month: "Jun", patients: 3100, pharmacies: 98 }
  ],
  storeComparison: [
    { name: "Apex BioCare", rating: 4.8, filledRequests: 1420, stockLevel: 94 },
    { name: "Nova Health", rating: 4.5, filledRequests: 980, stockLevel: 88 },
    { name: "Helix Gen-Rx", rating: 4.1, filledRequests: 430, stockLevel: 72 }
  ]
};

export const mockFeedback = [
  { id: "fb_01", userName: "Sarah Conner", userRole: "patient", message: "Love the instant prescription scanning! Saved me a lot of hassle.", rating: 5, date: "2026-06-10" },
  { id: "fb_02", userName: "BioCare Pharmacy Owner", userRole: "pharmacy", message: "Inventory stock API would be better with real-time CSV import.", rating: 4, date: "2026-06-12" }
];
