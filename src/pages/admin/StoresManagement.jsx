import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoStorefrontOutline, IoWarningOutline, IoBanOutline, IoSearchOutline, IoFilterOutline,
  IoLocationOutline, IoCheckmarkCircleOutline, IoEllipsisVertical, IoClose, IoCallOutline,
  IoMailOutline, IoDocumentTextOutline, IoStar, IoTimeOutline, IoCheckmarkCircle, IoCheckmarkDoneOutline,
  IoMapOutline, IoMedkitOutline, IoCubeOutline, IoTrendingUpOutline, IoAddCircleOutline
} from 'react-icons/io5';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const TOP_STATS = [
  { title: 'Total Registered Stores', value: '1,248', trend: '↑ 12%', color: 'bg-electric-blue/10 text-electric-blue border-electric-blue/20' },
  { title: 'Active Stores', value: '1,102', trend: '↑ 5%', color: 'bg-emerald-green/10 text-emerald-green border-emerald-green/20' },
  { title: 'Inactive Stores', value: '84', trend: '↓ 2%', color: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  { title: 'Pending Verification', value: '45', trend: 'Action Req', color: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  { title: 'Suspended Stores', value: '17', trend: 'Critical', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { title: 'Newly Registered (Week)', value: '15', trend: '↑ 20%', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
];

const QUICK_FILTERS = ['All Stores', 'Verified', 'Pending', 'Open Now', 'Closed', 'Inactive', 'Suspended', 'Top Rated', 'New Stores'];

const MOCK_STORES = [
  {
    id: 'PHR-1011', name: 'Good Health Pharmacy', ownerName: 'Amit Sharma', state: 'Madhya Pradesh', city: 'Bhopal', area: 'Kolar Road',
    email: 'contact@goodhealth.com', phone: '+91 91234 56780', license: 'MP-BHO-2023-45', gst: '23AABCG1234H1Z5', address: '12 Kolar Road',
    registeredDate: '05 Jan 2024', verificationStatus: 'Verified', status: 'Active',
    totalMedicines: 1542, inventoryHealth: 'Optimal', pendingOrders: 40, completedOrders: 1200, rating: 4.8, totalReviews: 128, lastActivity: '10 Mins Ago',
    logo: 'https://via.placeholder.com/150/00E676/0B1728?text=GH', banner: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'PHR-1012', name: 'CareMed Pharmacy', ownerName: 'Rahul Verma', state: 'Madhya Pradesh', city: 'Bhopal', area: 'Kolar Road',
    email: 'info@caremed.com', phone: '+91 91234 56781', license: 'MP-BHO-2023-88', gst: '23AABCC9876J1Z2', address: '45 Near SBI, Kolar Road',
    registeredDate: '12 Mar 2024', verificationStatus: 'Pending', status: 'Temporarily Closed',
    totalMedicines: 45, inventoryHealth: 'Low Stock', pendingOrders: 2, completedOrders: 0, rating: 0, totalReviews: 0, lastActivity: '2 Days Ago',
    logo: 'https://via.placeholder.com/150/00B0FF/0B1728?text=CM', banner: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'PHR-1014', name: 'LifeCare Pharmacy', ownerName: 'Suman Rathi', state: 'Madhya Pradesh', city: 'Bhopal', area: 'Arera Colony',
    email: 'hello@lifecare.com', phone: '+91 91234 56783', license: 'MP-BHO-2021-12', gst: '23AABCC9876J1Z4', address: 'E-7, Arera Colony',
    registeredDate: '10 Jun 2021', verificationStatus: 'Verified', status: 'Suspended',
    totalMedicines: 890, inventoryHealth: 'Critical', pendingOrders: 0, completedOrders: 540, rating: 3.2, totalReviews: 45, lastActivity: '1 Week Ago',
    logo: 'https://via.placeholder.com/150/EF4444/0B1728?text=LC', banner: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'PHR-1013', name: 'MediLife Store', ownerName: 'Neha Kumari', state: 'Madhya Pradesh', city: 'Indore', area: 'Vijay Nagar',
    email: 'support@medilife.com', phone: '+91 91234 56782', license: 'MP-IND-2022-12', gst: '23AABCM4567K1Z8', address: '99 MG Road',
    registeredDate: '20 Aug 2022', verificationStatus: 'Verified', status: 'Active',
    totalMedicines: 320, inventoryHealth: 'Optimal', pendingOrders: 15, completedOrders: 810, rating: 4.5, totalReviews: 210, lastActivity: '1 Hr Ago',
    logo: 'https://via.placeholder.com/150/A855F7/0B1728?text=ML', banner: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80'
  }
];


// ── UTILITIES ─────────────────────────────────────────────────────────────

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'text-emerald-green border-emerald-green/30 bg-emerald-green/10';
    case 'Temporarily Closed': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    case 'Inactive': return 'text-red-400 border-red-400/30 bg-red-400/10';
    case 'Suspended': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
    default: return 'text-white border-white/30 bg-white/10';
  }
};

const getInventoryColor = (health) => {
  if (health === 'Optimal') return 'text-emerald-green';
  if (health === 'Low Stock') return 'text-amber-400';
  return 'text-red-500';
};

// Organize data into State > City > Area
const organizeStores = (stores) => {
  const grouped = {};
  stores.forEach(store => {
    if (!grouped[store.state]) grouped[store.state] = {};
    if (!grouped[store.state][store.city]) grouped[store.state][store.city] = {};
    if (!grouped[store.state][store.city][store.area]) grouped[store.state][store.city][store.area] = [];
    grouped[store.state][store.city][store.area].push(store);
  });
  return grouped;
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const StoresManagement = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Stores');
  const [selectedStore, setSelectedStore] = useState(null);

  const groupedStores = organizeStores(MOCK_STORES);

  const handleAction = (msg) => {
    toast(msg, { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' } });
  };

  return (
    <div className="relative flex flex-col space-y-6 text-left font-poppins pb-10">
      
      {/* ── HEADER ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Store Register</h2>
        <p className="text-sm text-muted-text">Comprehensive registry of all partner pharmacies across regions.</p>
      </div>

      {/* ── TOP SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {TOP_STATS.map((stat, idx) => (
          <div key={idx} className={`glass-panel p-4 rounded-2xl border border-dark-border/40 relative overflow-hidden flex flex-col justify-between group hover:border-white/10 transition-colors`}>
            <p className="text-[10px] text-muted-text uppercase tracking-wider font-bold mb-1">{stat.title}</p>
            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
            <span className={`text-[9px] mt-2 font-bold ${stat.color.split(' ')[0].replace('bg-', 'text-').replace('/10', '')}`}>{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* ── SEARCH, FILTERS & CHIPS ── */}
      <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              type="text"
              placeholder="Search by Store Name, Owner, ID, or License..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <select className="bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 px-3 text-xs text-white outline-none w-full md:w-auto">
              <option>All States</option>
              <option>Madhya Pradesh</option>
            </select>
            <select className="bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 px-3 text-xs text-white outline-none w-full md:w-auto">
              <option>All Cities</option>
              <option>Bhopal</option>
              <option>Indore</option>
            </select>
            <Button variant="secondary" className="py-2.5 px-4 text-xs border-dark-border/60 shrink-0">
              <IoFilterOutline className="mr-1.5" /> Filters
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {QUICK_FILTERS.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors border ${activeFilter === filter ? 'bg-electric-blue text-dark-bg border-electric-blue' : 'bg-dark-bg/50 text-muted-text border-dark-border/60 hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAP & ANALYTICS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-dark-border/40 p-4 h-64 relative overflow-hidden flex flex-col justify-end">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <IoLocationOutline className="absolute top-1/4 left-1/4 text-emerald-green text-3xl opacity-80 drop-shadow-[0_0_8px_rgba(0,230,118,0.8)] animate-pulse" />
          <IoLocationOutline className="absolute top-1/2 right-1/4 text-amber-400 text-2xl opacity-60" />
          <IoLocationOutline className="absolute bottom-1/4 left-1/3 text-emerald-green text-xl opacity-60" />
          <IoLocationOutline className="absolute bottom-1/3 right-1/3 text-red-500 text-2xl opacity-80" />
          <div className="relative z-10 bg-dark-bg/80 backdrop-blur p-3 rounded-xl border border-dark-border/60 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2"><IoMapOutline className="text-electric-blue"/> Area-wise Store Map</h4>
            <p className="text-[10px] text-muted-text">Showing 1,248 active locations</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5 space-y-4">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2">Store Analytics</h3>
          <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
            <p className="text-[10px] text-muted-text">Top Performing Store</p>
            <p className="text-[11px] font-bold text-emerald-green">Good Health Pharmacy</p>
          </div>
          <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
            <p className="text-[10px] text-muted-text">Most Ordered Store</p>
            <p className="text-[11px] font-bold text-white">MediLife Store</p>
          </div>
          <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
            <p className="text-[10px] text-muted-text">Highest Rated Store</p>
            <p className="text-[11px] font-bold text-amber-400">CarePlus (4.9 ★)</p>
          </div>
          <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
            <p className="text-[10px] text-muted-text">Area with Max Stores</p>
            <p className="text-[11px] font-bold text-white">Kolar Road (42)</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-muted-text">Area with Least Stores</p>
            <p className="text-[11px] font-bold text-red-400">Awadhpuri (2)</p>
          </div>
        </div>
      </div>


      {/* ── HIERARCHICAL STORE RENDERING ── */}
      <div className="space-y-8">
        {Object.entries(groupedStores).map(([state, cities]) => (
          <div key={state} className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">{state}</h3>
              <div className="h-px flex-1 bg-dark-border/40" />
            </div>

            {Object.entries(cities).map(([city, areas]) => (
              <div key={city} className="space-y-4 pl-4 border-l border-dark-border/40">
                <h4 className="text-sm font-bold text-electric-blue">{city}</h4>

                {Object.entries(areas).map(([area, stores]) => (
                  <div key={area} className="space-y-4 pl-4 border-l border-dark-border/40">
                    <h5 className="text-[11px] font-bold text-muted-text uppercase tracking-wider">{area} <span className="lowercase bg-white/10 px-1.5 py-0.5 rounded text-white ml-2">{stores.length} stores</span></h5>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {stores.map(store => (
                        <div key={store.id} className="glass-panel rounded-2xl border border-dark-border/40 overflow-hidden flex flex-col group hover:border-white/20 transition-all hover:shadow-[0_8px_30px_rgb(255,255,255,0.05)]">
                          
                          {/* Card Banner & Basic Info */}
                          <div className="relative h-24 bg-dark-bg/80">
                            <img src={store.banner} alt="Banner" className="w-full h-full object-cover opacity-30" />
                            <div className="absolute top-3 right-3 flex gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-dark-bg/80 backdrop-blur ${getStatusColor(store.status)}`}>
                                {store.status}
                              </span>
                              {store.verificationStatus === 'Verified' && (
                                <span className="bg-emerald-green text-dark-bg px-1.5 py-0.5 rounded flex items-center text-[9px] font-bold">
                                  <IoCheckmarkCircle className="mr-0.5" /> VERIFIED
                                </span>
                              )}
                            </div>
                            <img src={store.logo} alt="Logo" className="absolute -bottom-6 left-4 w-16 h-16 rounded-xl border-2 border-dark-card object-cover bg-dark-bg" />
                          </div>

                          <div className="pt-8 px-5 pb-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-base font-bold text-white flex items-center gap-2">
                                  {store.name} 
                                  <span className="text-[10px] text-muted-text font-normal font-mono">{store.id}</span>
                                </h4>
                                <p className="text-xs text-electric-blue font-bold">{store.ownerName}</p>
                              </div>
                              <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                                <span className="text-xs font-bold text-white">{store.rating}</span>
                                <IoStar className="text-amber-400 text-xs" />
                                <span className="text-[9px] text-muted-text">({store.totalReviews})</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] mb-4">
                              <p className="text-muted-text flex items-center gap-1.5"><IoDocumentTextOutline className="text-electric-blue text-xs"/> Lic: <span className="text-white font-mono">{store.license}</span></p>
                              <p className="text-muted-text flex items-center gap-1.5 truncate"><IoLocationOutline className="text-electric-blue text-xs"/> <span className="text-white truncate">{store.address}</span></p>
                              <p className="text-muted-text flex items-center gap-1.5"><IoCallOutline className="text-electric-blue text-xs"/> <span className="text-white">{store.phone}</span></p>
                              <p className="text-muted-text flex items-center gap-1.5 truncate"><IoMailOutline className="text-electric-blue text-xs"/> <span className="text-white truncate">{store.email}</span></p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-3 border-y border-dark-border/40 mb-4 text-center">
                              <div>
                                <p className="text-[9px] text-muted-text mb-1"><IoCubeOutline className="inline mr-0.5"/> Total Meds</p>
                                <p className="text-xs font-bold text-white">{store.totalMedicines}</p>
                              </div>
                              <div className="border-x border-dark-border/40">
                                <p className="text-[9px] text-muted-text mb-1"><IoMedkitOutline className="inline mr-0.5"/> Health</p>
                                <p className={`text-xs font-bold ${getInventoryColor(store.inventoryHealth)}`}>{store.inventoryHealth}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-muted-text mb-1"><IoTrendingUpOutline className="inline mr-0.5"/> Orders</p>
                                <p className="text-xs font-bold text-emerald-green">{store.completedOrders} <span className="text-[9px] text-muted-text font-normal">({store.pendingOrders} P)</span></p>
                              </div>
                            </div>

                            <div className="mt-auto flex flex-wrap gap-2">
                              <Button variant="secondary" className="flex-1 text-[10px] justify-center bg-electric-blue/10 text-electric-blue border-electric-blue/30 hover:bg-electric-blue/20" onClick={() => setSelectedStore(store)}>
                                View Store
                              </Button>
                              <Button variant="secondary" className="flex-1 text-[10px] border-dark-border/60 hover:text-white justify-center">
                                View Orders
                              </Button>
                              <Button variant="secondary" className="w-8 p-0 flex items-center justify-center border-dark-border/60 hover:text-white">
                                <IoEllipsisVertical />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>


      {/* ── PAGINATION ── */}
      <div className="p-4 rounded-xl border border-dark-border/40 bg-dark-bg/30 flex items-center justify-between text-[11px] text-muted-text mt-6">
        <p>Showing 1 to {MOCK_STORES.length} of 1,248 stores</p>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 font-bold">&lt;</button>
          <button className="w-6 h-6 flex items-center justify-center rounded bg-electric-blue/20 text-electric-blue font-bold border border-electric-blue/30">1</button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">2</button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">3</button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 font-bold">&gt;</button>
        </div>
      </div>


      {/* ── STORE DETAILS DRAWER ── */}
      <AnimatePresence>
        {selectedStore && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedStore(null)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Store Profile</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedStore.id}</p>
                </div>
                <button onClick={() => setSelectedStore(null)} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="h-32 bg-dark-bg relative">
                  <img src={selectedStore.banner} alt="Banner" className="w-full h-full object-cover opacity-40" />
                  <img src={selectedStore.logo} alt="Logo" className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-2 border-dark-card object-cover bg-dark-bg shadow-xl" />
                </div>

                <div className="pt-10 px-6 pb-6 space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white leading-tight">{selectedStore.name}</h4>
                    <p className="text-xs text-electric-blue font-bold mt-1">Owner: {selectedStore.ownerName}</p>
                    <div className="flex gap-2 mt-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(selectedStore.status)}`}>{selectedStore.status}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${selectedStore.verificationStatus === 'Verified' ? 'text-emerald-green border-emerald-green/30 bg-emerald-green/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>{selectedStore.verificationStatus}</span>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-dark-border/40 space-y-3 text-xs">
                    <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">License</span> <span className="text-white font-mono">{selectedStore.license}</span></p>
                    <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">GST No.</span> <span className="text-white font-mono">{selectedStore.gst}</span></p>
                    <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Email</span> <span className="text-white">{selectedStore.email}</span></p>
                    <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Phone</span> <span className="text-white">{selectedStore.phone}</span></p>
                    <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Registered</span> <span className="text-white">{selectedStore.registeredDate}</span></p>
                    <p className="text-muted-text flex justify-between"><span className="font-bold uppercase tracking-wider text-[10px]">Last Activity</span> <span className="text-white">{selectedStore.lastActivity}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-3 rounded-xl border border-dark-border/40 text-center">
                       <p className="text-[10px] text-muted-text mb-1">Total Medicines</p>
                       <p className="text-lg font-bold text-white">{selectedStore.totalMedicines}</p>
                    </div>
                    <div className="glass-panel p-3 rounded-xl border border-dark-border/40 text-center">
                       <p className="text-[10px] text-muted-text mb-1">Total Orders</p>
                       <p className="text-lg font-bold text-emerald-green">{selectedStore.completedOrders}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">Admin Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center"><IoCubeOutline className="mr-1.5 text-sm"/> View Inventory</Button>
                      <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center"><IoTrendingUpOutline className="mr-1.5 text-sm"/> View Analytics</Button>
                      <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center text-amber-400 hover:text-amber-300"><IoBanOutline className="mr-1.5 text-sm"/> Suspend Store</Button>
                      <Button variant="secondary" className="text-[10px] border-dark-border/60 hover:text-white justify-center text-red-500 hover:text-red-400"><IoClose className="mr-1.5 text-sm"/> Delete Store</Button>
                    </div>
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

export default StoresManagement;
