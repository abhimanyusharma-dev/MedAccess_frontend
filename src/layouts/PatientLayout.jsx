import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';
import { motion } from 'framer-motion';
import { 
  IoNotificationsOutline, 
  IoSearchOutline, 
  IoLocationOutline, 
  IoChevronDownOutline,
  IoMenuOutline,
  IoCloseOutline
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/SidebarContext';
import patientBg from '../assets/temp/final_patient_bg.png';

export const PatientLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar } = useSidebar();
  
  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  const showCloseIcon = window.innerWidth < 1024 ? isMobileOpen : !isCollapsed;
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-white pt-16 lg:pt-0 font-poppins">
      <Sidebar role="patient" />

      {/* Main area - above overlay */}
      <div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
        style={{
          backgroundImage: `url(${patientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Content wrapper with z-index to stay above background */}
        <div className="flex flex-col h-full w-full relative z-10">

        {/* Premium Top Navbar */}
        <header className="h-20 border-b border-dark-border/40 flex items-center justify-between px-6 lg:px-8 glass-panel flex-shrink-0 sticky top-0" style={{ zIndex: 20 }}>
          
          {/* Left: Hamburger & Search Bar */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) toggleMobileSidebar();
                else toggleSidebar();
              }}
              className="p-2 rounded-xl bg-dark-bg/50 border border-dark-border/60 text-muted-text hover:text-white hover:border-emerald-green/50 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-emerald-green/50 group"
            >
              {!isCollapsed && window.innerWidth >= 1024 ? (
                <IoCloseOutline size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <IoMenuOutline size={24} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>

            <div className="hidden md:flex items-center w-full max-w-md relative group">
            <IoSearchOutline className="absolute left-4 text-muted-text group-focus-within:text-emerald-green transition-colors duration-300 text-lg" />
            <input 
              type="text" 
              placeholder="Search medicines, symptoms, or pharmacies..." 
              className="w-full bg-dark-bg/50 border border-dark-border/60 text-sm text-white placeholder:text-muted-text/70 rounded-full py-2.5 pl-11 pr-16 focus:outline-none focus:border-emerald-green/50 focus:bg-dark-bg/80 transition-all duration-300 shadow-inner"
            />
            <div className="absolute right-3 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-muted-text flex items-center gap-1 group-hover:bg-white/10 transition-colors">
              <span>Ctrl</span><span>+</span><span>K</span>
            </div>
          </div>
          </div>

          {/* Center: Location Card */}
          <div className="hidden lg:flex flex-1 justify-center">
            <button className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-dark-bg/40 border border-dark-border/40 hover:bg-dark-bg/70 hover:border-emerald-green/30 transition-all duration-300 group">
              <div className="w-8 h-8 rounded-full bg-emerald-green/10 flex items-center justify-center">
                <IoLocationOutline className="text-emerald-green text-lg group-hover:animate-bounce" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-white tracking-wide">Data Colony, Bhopal</span>
                <span className="text-[10px] text-muted-text">Current Location</span>
              </div>
              <IoChevronDownOutline className="text-muted-text ml-2 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-5 lg:gap-6 flex-1 justify-end">
            
            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-full bg-dark-bg/50 border border-dark-border/50 text-muted-text hover:text-white hover:border-neon-cyan/30 transition-all duration-300 group">
              <IoNotificationsOutline size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            </button>
            
            <div className="h-8 w-px bg-dark-border/50 hidden sm:block" />

            {/* Profile Card */}
            <button className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-full transition-colors duration-300">
              <img 
                src={user?.details?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Patient"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-dark-border/80 object-cover shadow-sm"
              />
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-bold text-white leading-tight">{user?.name || 'Aayezah'}</span>
                <span className="text-[11px] text-emerald-green font-medium">Patient</span>
              </div>
              <IoChevronDownOutline className="text-muted-text hidden sm:block ml-1" size={14} />
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 patient-portal-cards">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full max-w-[1600px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
        </div>
      </div>
    </div>
  );
};
export default PatientLayout;
