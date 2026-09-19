export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  PATIENT: {
    ROOT: '/patient',
    DASHBOARD: '/patient/dashboard',
    UPLOAD_PRESCRIPTION: '/patient/upload-prescription',
    FIND_MEDICINES: '/patient/find-medicines',
    NEARBY_PHARMACIES: '/patient/nearby-pharmacies',
    RESERVATIONS: '/patient/reservations',
    MY_PRESCRIPTIONS: '/patient/my-prescriptions',
    SAVED_PHARMACIES: '/patient/saved-pharmacies',
    AI_ASSISTANT: '/patient/ai-assistant',
    HEALTH_RECORDS: '/patient/health-records',
    SETTINGS: '/patient/settings',
    SUPPORT: '/patient/support',
  },
  
  PHARMACY: {
    ROOT: '/pharmacy',
    DASHBOARD: '/pharmacy/dashboard',
    PRESCRIPTION_REQUESTS: '/pharmacy/prescription-requests',
    INVENTORY_STOCK: '/pharmacy/inventory-stock',
    ANALYTICS: '/pharmacy/analytics',
    STORE_COMPARISON: '/pharmacy/store-comparison',
    NOTIFICATIONS: '/pharmacy/notifications',
  },
  
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    STORES: '/admin/stores',
    STORE_VERIFICATION: '/admin/store-verification',
    ANALYTICS: '/admin/analytics',
    FEEDBACK: '/admin/feedback',
    REPORTS: '/admin/reports',
  }
};
