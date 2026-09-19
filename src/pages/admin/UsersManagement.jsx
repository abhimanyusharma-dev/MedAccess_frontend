import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoPeople, IoPersonOutline, IoStorefrontOutline, IoCheckmarkCircleOutline,
  IoWarningOutline, IoBanOutline, IoSearchOutline, IoFilterOutline,
  IoEllipsisVertical, IoClose, IoLocationOutline, IoCallOutline, IoMailOutline,
  IoDocumentTextOutline, IoTimeOutline, IoChevronBack, IoChevronForward, IoBagOutline
} from 'react-icons/io5';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_PATIENTS = [
  {
    id: 'USR-9021', name: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '+91 98765 43210',
    gender: 'Male', age: 45, bloodGroup: 'O+', city: 'Bhopal', state: 'MP',
    registeredDate: '12 Jan 2024', lastLogin: '2 Hrs Ago',
    prescriptions: 14, orders: 22, activeReservations: 1, savedPharmacies: 3,
    status: 'Active', verified: true, avatar: 'https://i.pravatar.cc/150?u=raj'
  },
  {
    id: 'USR-9022', name: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 98765 43211',
    gender: 'Female', age: 32, bloodGroup: 'A+', city: 'Indore', state: 'MP',
    registeredDate: '15 Feb 2024', lastLogin: '1 Day Ago',
    prescriptions: 5, orders: 8, activeReservations: 0, savedPharmacies: 1,
    status: 'Active', verified: true, avatar: 'https://i.pravatar.cc/150?u=pri'
  },
  {
    id: 'USR-9023', name: 'Ankit Verma', email: 'ankit.v@example.com', phone: '+91 98765 43212',
    gender: 'Male', age: 28, bloodGroup: 'B+', city: 'Bhopal', state: 'MP',
    registeredDate: '01 Mar 2024', lastLogin: '5 Days Ago',
    prescriptions: 0, orders: 1, activeReservations: 0, savedPharmacies: 0,
    status: 'Inactive', verified: false, avatar: 'https://i.pravatar.cc/150?u=ank'
  },
  {
    id: 'USR-9024', name: 'Suman Rathi', email: 'suman.r@example.com', phone: '+91 98765 43213',
    gender: 'Female', age: 52, bloodGroup: 'O-', city: 'Gwalior', state: 'MP',
    registeredDate: '10 Nov 2023', lastLogin: 'Never',
    prescriptions: 2, orders: 0, activeReservations: 0, savedPharmacies: 0,
    status: 'Suspended', verified: true, avatar: 'https://i.pravatar.cc/150?u=sum'
  }
];

const MOCK_PHARMACIES = [
  {
    id: 'PHR-1011', name: 'Good Health Pharmacy', ownerName: 'Amit Sharma',
    email: 'contact@goodhealth.com', phone: '+91 91234 56780', license: 'MP-BHO-2023-45',
    gst: '23AABCG1234H1Z5', address: '12 Kolar Road', city: 'Bhopal', state: 'MP',
    registeredDate: '05 Jan 2024', verificationStatus: 'Verified', rating: 4.8,
    totalOrders: 1240, completedOrders: 1200, pendingOrders: 40,
    inventoryStatus: 'Optimal', storeStatus: 'Active', medicinesCount: 1542,
    logo: 'https://via.placeholder.com/150/00E676/0B1728?text=GH'
  },
  {
    id: 'PHR-1012', name: 'CareMed Pharmacy', ownerName: 'Rahul Verma',
    email: 'info@caremed.com', phone: '+91 91234 56781', license: 'MP-BHO-2023-88',
    gst: '23AABCC9876J1Z2', address: '45 Indrapuri', city: 'Bhopal', state: 'MP',
    registeredDate: '12 Mar 2024', verificationStatus: 'Pending Verification', rating: 0,
    totalOrders: 0, completedOrders: 0, pendingOrders: 0,
    inventoryStatus: 'Setting Up', storeStatus: 'Inactive', medicinesCount: 45,
    logo: 'https://via.placeholder.com/150/00B0FF/0B1728?text=CM'
  },
  {
    id: 'PHR-1013', name: 'MediLife Store', ownerName: 'Neha Kumari',
    email: 'support@medilife.com', phone: '+91 91234 56782', license: 'MP-IND-2022-12',
    gst: '23AABCM4567K1Z8', address: '99 MG Road', city: 'Indore', state: 'MP',
    registeredDate: '20 Aug 2022', verificationStatus: 'Verified', rating: 3.5,
    totalOrders: 850, completedOrders: 810, pendingOrders: 15,
    inventoryStatus: 'Low Stock', storeStatus: 'Suspended', medicinesCount: 320,
    logo: 'https://via.placeholder.com/150/EF4444/0B1728?text=ML'
  }
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

const getStatusColor = (status) => {
  if (status === 'Active' || status === 'Verified' || status === 'Optimal') return 'text-emerald-green border-emerald-green/30 bg-emerald-green/10';
  if (status === 'Inactive' || status === 'Pending Verification' || status === 'Low Stock' || status === 'Setting Up') return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
  return 'text-red-400 border-red-400/30 bg-red-500/10';
};

// ── COMPONENTS ────────────────────────────────────────────────────────────

const TopCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-panel p-5 rounded-2xl border border-dark-border/40 relative overflow-hidden flex items-center justify-between group hover:border-white/10 transition-colors">
    <div>
      <p className="text-[10px] text-muted-text mb-1 uppercase tracking-wider font-bold">{title}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
      <Icon className="text-2xl" />
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const UsersManagement = () => {
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' | 'pharmacies'
  const [search, setSearch] = useState('');
  
  // Drawer States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const handleAction = (msg) => {
    toast(msg, { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' } });
  };

  return (
    <div className="relative flex flex-col space-y-6 text-left font-poppins pb-10">
      
      {/* ── HEADER ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Users Access Control</h2>
        <p className="text-sm text-muted-text">Manage all registered patients and pharmacy partners from a central hub.</p>
      </div>

      {/* ── TOP SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <TopCard title="Total Users" value="13,706" icon={IoPeople} colorClass="bg-electric-blue/10 text-electric-blue border border-electric-blue/20" />
        <TopCard title="Total Patients" value="12,458" icon={IoPersonOutline} colorClass="bg-emerald-green/10 text-emerald-green border border-emerald-green/20" />
        <TopCard title="Pharmacy Owners" value="1,248" icon={IoStorefrontOutline} colorClass="bg-purple-500/10 text-purple-400 border border-purple-500/20" />
        <TopCard title="Active Accounts" value="12,900" icon={IoCheckmarkCircleOutline} colorClass="bg-emerald-green/10 text-emerald-green border border-emerald-green/20" />
        <TopCard title="Pending Verif." value="32" icon={IoWarningOutline} colorClass="bg-amber-400/10 text-amber-400 border border-amber-400/20" />
        <TopCard title="Suspended" value="45" icon={IoBanOutline} colorClass="bg-red-500/10 text-red-500 border border-red-500/20" />
      </div>

      {/* ── SEARCH, FILTERS & STATS LAYOUT ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Toolbar & Tabs */}
        <div className="xl:col-span-3 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 flex flex-col md:flex-row items-center gap-4">
            <div className="flex bg-dark-bg/50 p-1 rounded-xl border border-dark-border/60 shrink-0 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('patients')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'patients' ? 'bg-emerald-green text-dark-bg' : 'text-muted-text hover:text-white'}`}
              >
                Patients
              </button>
              <button 
                onClick={() => setActiveTab('pharmacies')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'pharmacies' ? 'bg-emerald-green text-dark-bg' : 'text-muted-text hover:text-white'}`}
              >
                Pharmacy Owners
              </button>
            </div>
            
            <div className="relative w-full">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
              <input
                type="text"
                placeholder="Search by Name, Email, Phone, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <select className="bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2 px-3 text-xs text-white outline-none w-full md:w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
              <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60">
                <IoFilterOutline className="mr-1.5" /> Filters
              </Button>
            </div>
          </div>

          {/* ── CARD GRIDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeTab === 'patients' && MOCK_PATIENTS.map((patient) => (
              <div key={patient.id} className="glass-panel p-5 rounded-2xl border border-dark-border/40 relative group hover:border-emerald-green/30 transition-all hover:shadow-[0_8px_30px_rgb(0,230,118,0.05)] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full border-2 border-dark-border/60 object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {patient.name} {patient.verified && <IoCheckmarkCircleOutline className="text-emerald-green text-xs" />}
                      </h4>
                      <p className="text-[10px] text-muted-text">{patient.id}</p>
                    </div>
                  </div>
                  <button className="text-muted-text hover:text-white" onClick={() => handleAction('Menu opened')}><IoEllipsisVertical/></button>
                </div>
                
                {/* Quick Details */}
                <div className="grid grid-cols-2 gap-2 text-[10px] mb-4">
                  <p className="text-muted-text"><IoMailOutline className="inline mr-1"/> <span className="text-white">{patient.email.substring(0,10)}...</span></p>
                  <p className="text-muted-text"><IoCallOutline className="inline mr-1"/> <span className="text-white">{patient.phone}</span></p>
                  <p className="text-muted-text"><IoPersonOutline className="inline mr-1"/> <span className="text-white">{patient.gender}, {patient.age}</span></p>
                  <p className="text-muted-text"><IoLocationOutline className="inline mr-1"/> <span className="text-white">{patient.city}</span></p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-dark-border/40 mb-4 text-center">
                  <div>
                    <p className="text-[9px] text-muted-text">Prescriptions</p>
                    <p className="text-sm font-bold text-white">{patient.prescriptions}</p>
                  </div>
                  <div className="border-x border-dark-border/40">
                    <p className="text-[9px] text-muted-text">Total Orders</p>
                    <p className="text-sm font-bold text-white">{patient.orders}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-text">Saved Stores</p>
                    <p className="text-sm font-bold text-white">{patient.savedPharmacies}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  <Button variant="secondary" className="px-3 py-1.5 text-[10px] border-dark-border/60 hover:text-white" onClick={() => setSelectedPatient(patient)}>
                    View Profile
                  </Button>
                </div>
              </div>
            ))}

            {activeTab === 'pharmacies' && MOCK_PHARMACIES.map((pharmacy) => (
              <div key={pharmacy.id} className="glass-panel p-5 rounded-2xl border border-dark-border/40 relative group hover:border-electric-blue/30 transition-all hover:shadow-[0_8px_30px_rgb(0,176,255,0.05)] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <img src={pharmacy.logo} alt={pharmacy.name} className="w-12 h-12 rounded-xl border border-dark-border/60 object-cover bg-white/5" />
                    <div>
                      <h4 className="text-sm font-bold text-white truncate max-w-[140px]">{pharmacy.name}</h4>
                      <p className="text-[10px] text-muted-text">{pharmacy.id}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shrink-0 ${getStatusColor(pharmacy.verificationStatus)}`}>
                    {pharmacy.verificationStatus === 'Verified' ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
                
                {/* Quick Details */}
                <div className="grid grid-cols-1 gap-2 text-[10px] mb-4">
                  <p className="text-muted-text"><IoPersonOutline className="inline mr-1 text-electric-blue"/> Owner: <span className="text-white">{pharmacy.ownerName}</span></p>
                  <p className="text-muted-text"><IoDocumentTextOutline className="inline mr-1 text-electric-blue"/> Lic: <span className="text-white font-mono">{pharmacy.license}</span></p>
                  <p className="text-muted-text truncate"><IoLocationOutline className="inline mr-1 text-electric-blue"/> <span className="text-white">{pharmacy.address}, {pharmacy.city}</span></p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-dark-border/40 mb-4 text-center">
                  <div className="border-r border-dark-border/40">
                    <p className="text-[9px] text-muted-text">Total Orders</p>
                    <p className="text-sm font-bold text-white">{pharmacy.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-text">Medicines Listed</p>
                    <p className="text-sm font-bold text-white">{pharmacy.medicinesCount}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(pharmacy.storeStatus)}`}>
                    {pharmacy.storeStatus}
                  </span>
                  <Button variant="secondary" className="px-3 py-1.5 text-[10px] border-dark-border/60 hover:text-white" onClick={() => setSelectedPharmacy(pharmacy)}>
                    View Store
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 rounded-xl border border-dark-border/40 bg-dark-bg/30 flex items-center justify-between text-[11px] text-muted-text mt-4">
            <p>Showing 1 to {activeTab === 'patients' ? MOCK_PATIENTS.length : MOCK_PHARMACIES.length} of 100 items</p>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronBack /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded bg-emerald-green/20 text-emerald-green font-bold border border-emerald-green/30">1</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">2</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">3</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronForward /></button>
            </div>
            <select className="bg-dark-bg/50 border border-dark-border/60 rounded px-2 py-1 outline-none">
              <option>20 per page</option>
            </select>
          </div>

        </div>

        {/* ── STATISTICS MINI PANEL ── */}
        <div className="xl:col-span-1 space-y-4">
           <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
             <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-[11px]">Quick Statistics</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                 <p className="text-xs text-muted-text">New Users (Week)</p>
                 <p className="text-sm font-bold text-emerald-green">+142</p>
               </div>
               <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                 <p className="text-xs text-muted-text">New Pharmacies (Month)</p>
                 <p className="text-sm font-bold text-electric-blue">+15</p>
               </div>
               <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                 <p className="text-xs text-muted-text">Active Users Today</p>
                 <p className="text-sm font-bold text-white">3,892</p>
               </div>
               <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                 <p className="text-xs text-muted-text">Verification Requests</p>
                 <p className="text-sm font-bold text-amber-400">32</p>
               </div>
               <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                 <p className="text-xs text-muted-text">Disabled Accounts</p>
                 <p className="text-sm font-bold text-red-400">45</p>
               </div>
               <div className="flex justify-between items-center">
                 <p className="text-xs text-muted-text">Deleted Accounts</p>
                 <p className="text-sm font-bold text-red-500">12</p>
               </div>
             </div>
           </div>
        </div>

      </div>


      {/* ── PATIENT DETAILS DRAWER ── */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedPatient(null)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Patient Profile</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedPatient.id}</p>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <img src={selectedPatient.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-emerald-green object-cover" />
                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedPatient.name}</h4>
                    <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status} Account
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-dark-border/40 space-y-3 text-xs">
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Email</span> <span className="text-white">{selectedPatient.email}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Phone</span> <span className="text-white">{selectedPatient.phone}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Blood Group</span> <span className="text-red-400 font-bold">{selectedPatient.bloodGroup}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Location</span> <span className="text-white">{selectedPatient.city}, {selectedPatient.state}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Registered</span> <span className="text-white">{selectedPatient.registeredDate}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Last Login</span> <span className="text-white">{selectedPatient.lastLogin}</span></p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center"><IoDocumentTextOutline className="mr-1.5 text-sm"/> Medical History</Button>
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center"><IoBagOutline className="mr-1.5 text-sm"/> View Orders</Button>
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center text-amber-400 hover:text-amber-300"><IoBanOutline className="mr-1.5 text-sm"/> Disable Account</Button>
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center text-red-500 hover:text-red-400"><IoClose className="mr-1.5 text-sm"/> Delete Account</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── PHARMACY DETAILS DRAWER ── */}
      <AnimatePresence>
        {selectedPharmacy && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedPharmacy(null)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Pharmacy Details</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedPharmacy.id}</p>
                </div>
                <button onClick={() => setSelectedPharmacy(null)} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <img src={selectedPharmacy.logo} alt="Logo" className="w-20 h-20 rounded-2xl border border-electric-blue/50 object-cover bg-white/5" />
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">{selectedPharmacy.name}</h4>
                    <p className="text-xs text-electric-blue mt-1 font-bold">{selectedPharmacy.ownerName}</p>
                    <span className={`inline-flex mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(selectedPharmacy.verificationStatus)}`}>
                      {selectedPharmacy.verificationStatus}
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-dark-border/40 space-y-3 text-xs">
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">License</span> <span className="text-white font-mono">{selectedPharmacy.license}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">GST No.</span> <span className="text-white font-mono">{selectedPharmacy.gst}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Email</span> <span className="text-white">{selectedPharmacy.email}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Phone</span> <span className="text-white">{selectedPharmacy.phone}</span></p>
                  <p className="text-muted-text flex justify-between border-t border-dark-border/40 pt-2"><span className="font-bold uppercase tracking-wider text-[10px]">Total Orders</span> <span className="text-emerald-green font-bold">{selectedPharmacy.totalOrders}</span></p>
                  <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Inventory Count</span> <span className="text-white">{selectedPharmacy.medicinesCount} Items</span></p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">Administrative Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="primary" className="text-[10px] justify-center bg-electric-blue text-dark-bg hover:bg-electric-blue/90"><IoCheckmarkCircleOutline className="mr-1.5 text-sm"/> Verify Store</Button>
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center"><IoDocumentTextOutline className="mr-1.5 text-sm"/> View Docs</Button>
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center text-amber-400 hover:text-amber-300"><IoBanOutline className="mr-1.5 text-sm"/> Suspend Store</Button>
                    <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center text-red-500 hover:text-red-400"><IoClose className="mr-1.5 text-sm"/> Delete Store</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UsersManagement;
