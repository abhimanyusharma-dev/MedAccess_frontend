import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ProtectedRoute } from './ProtectedRoute';

// Layout wrappers
import PatientLayout from '../layouts/PatientLayout';
import PharmacyLayout from '../layouts/PharmacyLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Patient Subpages
import PatientDashboard from '../pages/patient/PatientDashboard';
import UploadPrescription from '../pages/patient/UploadPrescription';
import FindMedicines from '../pages/patient/FindMedicines';
import NearbyPharmacies from '../pages/patient/NearbyPharmacies';
import Reservations from '../pages/patient/Reservations';
import HealthRecords from '../pages/patient/HealthRecords';
import Settings from '../pages/patient/Settings';
import MyPrescriptions from '../pages/patient/MyPrescriptions';
import SavedPharmacies from '../pages/patient/SavedPharmacies';
import AIHealthAssistant from '../pages/patient/AIHealthAssistant';
import HelpSupport from '../pages/patient/HelpSupport';

// Pharmacy Subpages
import PharmacyDashboard from '../pages/pharmacy/PharmacyDashboard';
import PrescriptionRequests from '../pages/pharmacy/PrescriptionRequests';
import InventoryStock from '../pages/pharmacy/InventoryStock';
import PharmacyAnalytics from '../pages/pharmacy/PharmacyAnalytics';
import StoreComparison from '../pages/pharmacy/StoreComparison';
import Notifications from '../pages/pharmacy/Notifications';

// Admin Subpages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import StoresManagement from '../pages/admin/StoresManagement';
import StoreVerification from '../pages/admin/StoreVerification';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import FeedbackManagement from '../pages/admin/FeedbackManagement';
import ReportsManagement from '../pages/admin/ReportsManagement';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LANDING} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Patient Secured Routes */}
      <Route 
        path={ROUTES.PATIENT.ROOT} 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.PATIENT.DASHBOARD} replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="upload-prescription" element={<UploadPrescription />} />
        <Route path="find-medicines" element={<FindMedicines />} />
        <Route path="nearby-pharmacies" element={<NearbyPharmacies />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="my-prescriptions" element={<MyPrescriptions />} />
        <Route path="saved-pharmacies" element={<SavedPharmacies />} />
        <Route path="ai-assistant" element={<AIHealthAssistant />} />
        <Route path="health-records" element={<HealthRecords />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<HelpSupport />} />
      </Route>

      {/* Pharmacy Secured Routes */}
      <Route 
        path={ROUTES.PHARMACY.ROOT} 
        element={
          <ProtectedRoute allowedRoles={['pharmacy']}>
            <PharmacyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.PHARMACY.DASHBOARD} replace />} />
        <Route path="dashboard" element={<PharmacyDashboard />} />
        <Route path="prescription-requests" element={<PrescriptionRequests />} />
        <Route path="inventory-stock" element={<InventoryStock />} />
        <Route path="analytics" element={<PharmacyAnalytics />} />
        <Route path="store-comparison" element={<StoreComparison />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Admin Secured Routes */}
      <Route 
        path={ROUTES.ADMIN.ROOT} 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="stores" element={<StoresManagement />} />
        <Route path="store-verification" element={<StoreVerification />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="feedback" element={<FeedbackManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
};
export default AppRoutes;
