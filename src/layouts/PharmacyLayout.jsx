import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';
import { motion } from 'framer-motion';
import { IoNotificationsOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { useSidebar } from '../context/SidebarContext';
import pharmacyPortalBg from '../assets/temp/pharmacyportal_bg.png';

export const PharmacyLayout = () => {
  const location = useLocation();
  const { isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar } = useSidebar();
  
  const getHeaderTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard' || path === 'pharmacy') return 'Overview';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-white pt-16 lg:pt-0">
      <Sidebar role="pharmacy" />
      
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
        style={{
          backgroundImage: `url(${pharmacyPortalBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Content wrapper sits above background */}
        <div className="flex flex-col h-full w-full relative z-10">
        {/* Header bar */}
        <header className="h-20 border-b border-dark-border/60 flex items-center justify-between px-8 bg-dark-card/25 backdrop-blur-xs flex-shrink-0">
          <div className="flex items-center gap-4 text-left">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) toggleMobileSidebar();
                else toggleSidebar();
              }}
              className="p-2 flex-shrink-0 rounded-xl bg-dark-bg/50 border border-dark-border/60 text-muted-text hover:text-white hover:border-electric-blue/50 transition-all duration-300 focus:outline-none group"
            >
              <div className="lg:hidden">
                <IoMenuOutline size={24} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="hidden lg:block">
                {!isCollapsed ? (
                  <IoCloseOutline size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <IoMenuOutline size={24} className="group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
            </button>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide m-0">{getHeaderTitle()}</h2>
              <p className="text-xs text-muted-text mt-0.5">Pharmacy Management & Prescription Audits</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-dark-card border border-dark-border text-muted-text hover:text-white transition-all duration-200">
              <IoNotificationsOutline size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-electric-blue shadow-glow-blue" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-electric-blue/10 text-electric-blue border border-electric-blue/20 text-xs font-semibold">
              Pharmacy Panel
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </main>
        </div>
      </div>
    </div>
  );
};
export default PharmacyLayout;
