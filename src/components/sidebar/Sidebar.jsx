import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { ROUTES } from '../../constants/routes';
import { 
  IoGridOutline, 
  IoCloudUploadOutline, 
  IoSearchOutline, 
  IoLocationOutline, 
  IoReceiptOutline, 
  IoMedicalOutline, 
  IoSettingsOutline,
  IoDocumentTextOutline,
  IoFileTrayStackedOutline,
  IoBarChartOutline,
  IoGitCompareOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoShieldCheckmarkOutline,
  IoChatbubblesOutline,
  IoLogOutOutline,
  IoHelpCircleOutline
} from 'react-icons/io5';

import patientSidebarBg from '../../assets/temp/patientsidebar.png';
import pharmacySidebarBg from '../../assets/temp/pharmacysidebar.png';
import adminSidebarBg from '../../assets/temp/adminsidebar.png';

export const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  const getLinks = () => {
    switch (role) {
      case 'patient':
        return [
          { path: ROUTES.PATIENT.DASHBOARD, label: 'Dashboard', icon: IoGridOutline },
          { path: ROUTES.PATIENT.UPLOAD_PRESCRIPTION, label: 'Upload Prescription', icon: IoCloudUploadOutline },
          { path: ROUTES.PATIENT.FIND_MEDICINES, label: 'Find Medicines', icon: IoSearchOutline },
          { path: ROUTES.PATIENT.NEARBY_PHARMACIES, label: 'Nearby Pharmacies', icon: IoLocationOutline },
          { path: ROUTES.PATIENT.RESERVATIONS, label: 'Medicine Reservations', icon: IoReceiptOutline },
          { path: ROUTES.PATIENT.MY_PRESCRIPTIONS, label: 'My Prescriptions', icon: IoDocumentTextOutline },
          { path: ROUTES.PATIENT.SAVED_PHARMACIES, label: 'Saved Pharmacies', icon: IoStorefrontOutline },
          { path: ROUTES.PATIENT.AI_ASSISTANT, label: 'AI Health Assistant', icon: IoChatbubblesOutline },
          { path: ROUTES.PATIENT.HEALTH_RECORDS, label: 'Health Records', icon: IoMedicalOutline },
          { path: ROUTES.PATIENT.SETTINGS, label: 'Settings', icon: IoSettingsOutline },
          { path: '/patient/support', label: 'Help & Support', icon: IoHelpCircleOutline },
        ];
      case 'pharmacy':
        return [
          { path: ROUTES.PHARMACY.DASHBOARD, label: 'Dashboard', icon: IoGridOutline },
          { path: ROUTES.PHARMACY.PRESCRIPTION_REQUESTS, label: 'Prescriptions', icon: IoDocumentTextOutline },
          { path: ROUTES.PHARMACY.INVENTORY_STOCK, label: 'Inventory Stock', icon: IoFileTrayStackedOutline },
          { path: ROUTES.PHARMACY.ANALYTICS, label: 'Analytics', icon: IoBarChartOutline },
          { path: ROUTES.PHARMACY.STORE_COMPARISON, label: 'Market Compare', icon: IoGitCompareOutline },
          { path: ROUTES.PHARMACY.NOTIFICATIONS, label: 'Notifications', icon: IoNotificationsOutline },
        ];
      case 'admin':
        return [
          { path: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: IoGridOutline },
          { path: ROUTES.ADMIN.USERS, label: 'Users Control', icon: IoPeopleOutline },
          { path: ROUTES.ADMIN.STORES, label: 'Stores Register', icon: IoStorefrontOutline },
          { path: ROUTES.ADMIN.STORE_VERIFICATION, label: 'Verifications', icon: IoShieldCheckmarkOutline },
          { path: ROUTES.ADMIN.ANALYTICS, label: 'SaaS Analytics', icon: IoBarChartOutline },
          { path: ROUTES.ADMIN.FEEDBACK, label: 'User Feedback', icon: IoChatbubblesOutline },
          { path: ROUTES.ADMIN.REPORTS, label: 'System Reports', icon: IoDocumentTextOutline },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getSidebarBackground = () => {
    switch (role) {
      case 'patient': return patientSidebarBg;
      case 'pharmacy': return pharmacySidebarBg;
      case 'admin': return adminSidebarBg;
      default: return '';
    }
  };

  const getOverlayClass = () => {
    switch (role) {
      case 'patient':
        return 'bg-[#060F19]/40 shadow-[inset_0_0_80px_rgba(16,185,129,0.15)]';
      case 'pharmacy':
        return 'bg-[#060F19]/40 shadow-[inset_0_0_80px_rgba(6,182,212,0.15)]';
      case 'admin':
        return 'bg-[#060F19]/45 shadow-[inset_0_0_80px_rgba(139,92,246,0.15)]';
      default:
        return 'bg-[#060F19]/40';
    }
  };

  const links = getLinks();
  const activeBg = role === 'patient' 
    ? 'bg-gradient-to-r from-emerald-green/20 to-transparent text-emerald-green border-l-4 border-emerald-green shadow-glow-green backdrop-blur-md' 
    : 'bg-gradient-to-r from-electric-blue/20 to-transparent text-electric-blue border-l-4 border-electric-blue shadow-glow-blue backdrop-blur-md';

  return (
    <>
      {/* Sidebar Shell */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 glass-panel border-r border-dark-border/40 flex flex-col justify-between
        transform lg:transform-none lg:static transition-all duration-300 ease-in-out font-poppins
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-hidden
      `}>
        {/* Background Layers */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${getSidebarBackground()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'local',
            filter: 'contrast(1.05) saturate(1.05)'
          }}
        />
        <div className={`absolute inset-0 z-0 ${getOverlayClass()}`} />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full w-full justify-between">
          
        {/* Brand Header */}
        <div className={`hidden lg:flex items-center gap-3 py-7 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}>
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-emerald-green to-neon-cyan flex items-center justify-center font-black text-dark-bg text-lg shadow-glow-green">
            +
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left whitespace-nowrap overflow-hidden">
              <span className="font-extrabold text-white text-xl tracking-wide leading-none">MedAccess</span>
              <span className="text-[11px] text-muted-text mt-1">Your Health, Our Priority</span>
            </div>
          )}
        </div>
        
        {/* Mobile Header (only visible on mobile drawer) */}
        <div className="lg:hidden flex items-center gap-3 px-8 py-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-green to-neon-cyan flex items-center justify-center font-black text-dark-bg text-lg shadow-glow-green">
            +
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-white text-xl tracking-wide leading-none">MedAccess</span>
            <span className="text-[11px] text-muted-text mt-1">Your Health, Our Priority</span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 py-2 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.path} className="relative group/tooltip px-2">
                <NavLink
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 group
                    ${isCollapsed ? 'justify-center' : 'gap-4 px-5 rounded-r-xl rounded-l-none'}
                    ${isActive ? activeBg : 'text-muted-text hover:text-white hover:bg-white/5 border-l-4 border-transparent'}
                  `}
                >
                  <Icon size={isCollapsed ? 24 : 20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
                </NavLink>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-card border border-dark-border rounded-md text-xs text-white opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg">
                    {link.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Stay Healthy Card (Patient only) */}
        {role === 'patient' && !isCollapsed && (
          <div className="px-6 py-4 hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl glass-panel-interactive p-5 text-center flex flex-col items-center group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-green/20 rounded-full blur-2xl group-hover:bg-emerald-green/40 transition-all duration-500"></div>
              
              <div className="w-12 h-12 rounded-full bg-emerald-green/10 flex items-center justify-center mb-3 shadow-glow-green/30">
                <IoNotificationsOutline className="text-emerald-green text-2xl" />
              </div>
              
              <h4 className="text-white font-bold text-sm mb-1">Stay Healthy, Stay Updated</h4>
              <button className="w-full py-2.5 rounded-xl btn-premium text-xs">
                Enable Notifications
              </button>
            </div>
          </div>
        )}

        {/* Logout Footer */}
        <div className={`p-4 lg:p-6 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className={`flex items-center py-3 rounded-xl text-sm font-semibold text-muted-text hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 active:scale-98 transition-all duration-300 group
              ${isCollapsed ? 'justify-center w-12 h-12 px-0' : 'w-full gap-4 px-5'}
            `}
          >
            <IoLogOutOutline size={isCollapsed ? 24 : 22} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform duration-300" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
        </div>
      </aside>

      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-dark-bg/60 backdrop-blur-md z-30 lg:hidden"
        />
      )}
    </>
  );
};
