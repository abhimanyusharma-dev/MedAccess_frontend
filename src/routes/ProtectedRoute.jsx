import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center flex-col gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-electric-blue/20 border-t-neon-green rounded-full animate-spin"></div>
          <div className="absolute w-6 h-6 border-4 border-neon-green/20 border-t-electric-blue rounded-full animate-spin animate-reverse"></div>
        </div>
        <p className="text-muted-text text-xs font-semibold tracking-wider uppercase animate-pulse">
          Securing Access Tunnel...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'patient') return <Navigate to={ROUTES.PATIENT.DASHBOARD} replace />;
    if (role === 'pharmacy') return <Navigate to={ROUTES.PHARMACY.DASHBOARD} replace />;
    if (role === 'admin') return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    return <Navigate to={ROUTES.LANDING} replace />;
  }

  return children;
};
