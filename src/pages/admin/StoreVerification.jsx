import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoShieldCheckmarkOutline, IoStorefrontOutline, IoCloseCircleOutline, IoBanOutline,
  IoSearchOutline, IoFilterOutline, IoCheckmarkCircle, IoClose, IoDocumentTextOutline,
  IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline, IoStar,
  IoWarningOutline, IoEyeOutline, IoDownloadOutline, IoCheckmark, IoPeopleOutline,
  IoTrendingUpOutline, IoAlertCircleOutline, IoInformationCircleOutline
} from 'react-icons/io5';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_PENDING = [
  {
    id: 'PHR-P001', name: 'NewLife Pharmacy', ownerName: 'Amit Sharma',
    phone: '+91 98765 43210', email: 'amit@newlife.com', license: 'MP-BHO-2024-101',
    gst: '23AABCN1234H1Z5', address: '12 Kolar Road, Bhopal', city: 'Bhopal', state: 'MP', pincode: '462042',
    registeredDate: '20 May 2024', uploadTime: '2 hours ago', medicines: 120, categories: 14,
    ownerQual: 'B.Pharm', ownerExp: '5 Years', licenseValid: 'Jan 2027',
    logo: 'https://via.placeholder.com/150/00E676/0B1728?text=NL',
    banner: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=60',
    docs: ['Drug License', 'Pharmacy Reg. Certificate', 'GST Certificate', 'Owner Aadhaar', 'Shop Registration']
  },
  {
    id: 'PHR-P002', name: 'Sai Medical Store', ownerName: 'Rahul Verma',
    phone: '+91 98765 43211', email: 'rahul@saimedical.com', license: 'MP-BHO-2024-102',
    gst: '23AABCS9876J1Z2', address: '45 Indrapuri, Bhopal', city: 'Bhopal', state: 'MP', pincode: '462023',
    registeredDate: '19 May 2024', uploadTime: '5 hours ago', medicines: 88, categories: 9,
    ownerQual: 'D.Pharm', ownerExp: '3 Years', licenseValid: 'Dec 2026',
    logo: 'https://via.placeholder.com/150/00B0FF/0B1728?text=SM',
    banner: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=60',
    docs: ['Drug License', 'Pharmacy Reg. Certificate', 'GST Certificate', 'Owner PAN', 'Shop Registration']
  },
  {
    id: 'PHR-P003', name: 'Royal Pharmacy', ownerName: 'Neha Kumari',
    phone: '+91 98765 43212', email: 'neha@royalpharm.com', license: 'MP-BHO-2024-103',
    gst: '23AABCR4567K1Z8', address: '99 MP Nagar, Bhopal', city: 'Bhopal', state: 'MP', pincode: '462001',
    registeredDate: '19 May 2024', uploadTime: '1 day ago', medicines: 205, categories: 18,
    ownerQual: 'M.Pharm', ownerExp: '8 Years', licenseValid: 'Mar 2028',
    logo: 'https://via.placeholder.com/150/A855F7/0B1728?text=RP',
    banner: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=60',
    docs: ['Drug License', 'Pharmacy Reg. Certificate', 'GST Certificate', 'Owner Aadhaar', 'Shop Registration', 'Additional Docs']
  },
];

const MOCK_VERIFIED = [
  {
    id: 'PHR-V001', name: 'Good Health Pharmacy', ownerName: 'Suman Rathi',
    rating: 4.8, trustScore: 96, totalOrders: 1240, totalMedicines: 1542,
    reviews: 128, revenue: '₹4.2L', registeredDate: '05 Jan 2024',
    completedOrders: 1200, cancelledOrders: 40, complaints: 2, avgDelivery: '18 min',
    medicineAvail: 98, responseTime: '< 5 min', status: 'Active',
    logo: 'https://via.placeholder.com/150/00E676/0B1728?text=GH',
    banner: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=60',
    warning: false
  },
  {
    id: 'PHR-V002', name: 'MediLife Store', ownerName: 'Vikram Singh',
    rating: 3.2, trustScore: 54, totalOrders: 850, totalMedicines: 320,
    reviews: 45, revenue: '₹1.8L', registeredDate: '20 Aug 2022',
    completedOrders: 810, cancelledOrders: 120, complaints: 18, avgDelivery: '42 min',
    medicineAvail: 71, responseTime: '> 20 min', status: 'Warning',
    logo: 'https://via.placeholder.com/150/EF4444/0B1728?text=ML',
    banner: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=60',
    warning: true
  },
];

const QUICK_FILTERS = ['All Stores', 'Pending', 'Verified', 'Rejected', 'Suspended', 'High Rated', 'New Stores'];
const REJECT_REASONS = ['Poor Customer Rating', 'Fake Medicines', 'Expired License', 'Policy Violation', 'Repeated Complaints', 'Manual Review', 'Other'];

// ── UTILITIES ─────────────────────────────────────────────────────────────
const confirm = (msg, onConfirm) => {
  toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} glass-panel max-w-sm w-full shadow-lg rounded-2xl border border-dark-border/60 p-5 font-poppins text-left`}>
      <div className="flex items-start gap-3 mb-4">
        <IoAlertCircleOutline className="text-amber-400 text-2xl shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white">Confirm Action</p>
          <p className="text-xs text-muted-text mt-1">{msg}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => { toast.dismiss(t.id); onConfirm(); }}
          className="flex-1 bg-emerald-green text-dark-bg font-bold text-xs py-2 rounded-lg hover:bg-emerald-green/90 transition-colors"
        >Confirm</button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-1 bg-dark-bg text-muted-text font-bold text-xs py-2 rounded-lg border border-dark-border/60 hover:text-white transition-colors"
        >Cancel</button>
      </div>
    </div>
  ), { duration: 10000 });
};

// ── STATS CARD ────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`glass-panel p-4 rounded-2xl border border-dark-border/40 flex items-center justify-between group hover:border-white/10 transition-colors`}>
    <div>
      <p className="text-[10px] text-muted-text uppercase tracking-wider font-bold mb-1">{title}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
      <Icon className="text-xl" />
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export const StoreVerification = () => {
  const [activeFilter, setActiveFilter] = useState('All Stores');
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [drawerMode, setDrawerMode] = useState('pending'); // 'pending' | 'verified'
  const [showRevokModal, setShowRevokModal] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');

  const [pendingStores, setPendingStores] = useState(MOCK_PENDING);
  const [verifiedStores, setVerifiedStores] = useState(MOCK_VERIFIED);

  const openDrawer = (store, mode) => {
    setSelectedStore(store);
    setDrawerMode(mode);
  };

  const handleApprove = (store) => {
    confirm(`Approve "${store.name}" and grant Verified status on the platform?`, () => {
      setPendingStores(p => p.filter(s => s.id !== store.id));
      setVerifiedStores(v => [{
        ...store, rating: 0, trustScore: 100, totalOrders: 0, totalMedicines: store.medicines,
        reviews: 0, revenue: '₹0', completedOrders: 0, cancelledOrders: 0, complaints: 0,
        avgDelivery: 'N/A', medicineAvail: 100, responseTime: 'N/A', status: 'Active', warning: false
      }, ...v]);
      setSelectedStore(null);
      toast.success(`${store.name} approved successfully!`);
    });
  };

  const handleReject = (store) => {
    confirm(`Reject "${store.name}"? The pharmacy owner will be notified.`, () => {
      setPendingStores(p => p.filter(s => s.id !== store.id));
      setSelectedStore(null);
      toast.error(`${store.name} has been rejected.`);
    });
  };

  const handleRevokeVerification = (store) => {
    if (!revokeReason) { toast.error('Please select a reason.'); return; }
    setVerifiedStores(v => v.filter(s => s.id !== store.id));
    setShowRevokModal(null);
    setRevokeReason('');
    toast(`Verification removed for ${store.name} — Reason: ${revokeReason}`, { icon: '🔴' });
  };

  return (
    <div className="relative flex flex-col space-y-8 text-left font-poppins pb-10">

      {/* ── HEADER ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">License Verification Audit</h2>
        <p className="text-sm text-muted-text">Approve, verify, or revoke pharmacy credentials and business licenses on MedAccess.</p>
      </div>

      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Pending Verification" value={pendingStores.length} icon={IoTimeOutline} colorClass="bg-amber-400/10 text-amber-400 border-amber-400/20" />
        <StatCard title="Verified Stores" value={verifiedStores.length} icon={IoShieldCheckmarkOutline} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" />
        <StatCard title="Rejected Stores" value="12" icon={IoCloseCircleOutline} colorClass="bg-red-500/10 text-red-500 border-red-500/20" />
        <StatCard title="Suspended Stores" value="7" icon={IoBanOutline} colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20" />
        <StatCard title="Verification Cancelled" value="3" icon={IoAlertCircleOutline} colorClass="bg-red-500/10 text-red-400 border-red-500/20" />
        <StatCard title="Avg Approval Time" value="~6h" icon={IoTimeOutline} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" />
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              type="text"
              placeholder="Search by Store Name, Owner, License Number, City..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <select className="bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 px-3 text-xs text-white outline-none">
              <option>All States</option>
              <option>Madhya Pradesh</option>
            </select>
            <Button variant="secondary" className="py-2.5 px-4 text-xs border-dark-border/60 shrink-0">
              <IoFilterOutline className="mr-1.5" /> More Filters
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {QUICK_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors border ${activeFilter === f ? 'bg-electric-blue text-dark-bg border-electric-blue' : 'bg-dark-bg/50 text-muted-text border-dark-border/60 hover:text-white'}`}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 : PENDING STORE VERIFICATIONS
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Pending Store Verifications</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">{pendingStores.length} AWAITING</span>
          <div className="h-px flex-1 bg-dark-border/40" />
        </div>

        {pendingStores.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-16 text-center">
            <IoCheckmarkCircle className="text-5xl text-emerald-green mx-auto mb-4" />
            <h4 className="text-white font-bold text-base">All caught up!</h4>
            <p className="text-muted-text text-sm mt-1">No pending verification requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {pendingStores.map(store => (
              <div key={store.id} className="glass-panel rounded-2xl border border-amber-400/20 overflow-hidden flex flex-col group hover:border-amber-400/40 transition-all">
                <div className="relative h-28">
                  <img src={store.banner} alt="Banner" className="w-full h-full object-cover opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-card/80" />
                  <img src={store.logo} alt="Logo" className="absolute -bottom-6 left-4 w-14 h-14 rounded-xl border-2 border-dark-card object-cover bg-dark-bg" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30 backdrop-blur">PENDING REVIEW</span>
                </div>

                <div className="pt-8 px-5 pb-5 flex flex-col flex-1 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{store.name}</h4>
                    <p className="text-xs text-electric-blue font-bold">{store.ownerName}</p>
                    <p className="text-[10px] text-muted-text font-mono">{store.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 text-[10px]">
                    <p className="text-muted-text flex items-center gap-1"><IoDocumentTextOutline className="text-electric-blue" /> <span className="text-white font-mono">{store.license}</span></p>
                    <p className="text-muted-text flex items-center gap-1"><IoCallOutline className="text-electric-blue" /> <span className="text-white">{store.phone}</span></p>
                    <p className="text-muted-text flex items-center gap-1 col-span-2 truncate"><IoLocationOutline className="text-electric-blue shrink-0" /> <span className="text-white truncate">{store.address}</span></p>
                    <p className="text-muted-text col-span-2">Registered: <span className="text-white">{store.registeredDate}</span> · Uploaded: <span className="text-amber-400">{store.uploadTime}</span></p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-dark-border/40 flex gap-2">
                    <Button variant="secondary" className="flex-1 text-[10px] justify-center border-dark-border/60 hover:text-white" onClick={() => openDrawer(store, 'pending')}>
                      <IoEyeOutline className="mr-1" /> View Details
                    </Button>
                    <button
                      onClick={() => handleApprove(store)}
                      className="flex-1 bg-emerald-green/10 text-emerald-green border border-emerald-green/30 text-[10px] font-bold rounded-xl hover:bg-emerald-green/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <IoCheckmark /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(store)}
                      className="flex-1 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <IoClose /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 : VERIFIED PHARMACY STORES
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-green" />
            <h3 className="text-base font-bold text-white">Verified Pharmacy Stores</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-green/10 text-emerald-green border border-emerald-green/30">{verifiedStores.length} VERIFIED</span>
          <div className="h-px flex-1 bg-dark-border/40" />
        </div>

        {verifiedStores.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-16 text-center">
            <IoStorefrontOutline className="text-5xl text-muted-text mx-auto mb-4" />
            <p className="text-muted-text text-sm">No verified stores yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {verifiedStores.map(store => (
              <div key={store.id} className={`glass-panel rounded-2xl border overflow-hidden flex flex-col group transition-all ${store.warning ? 'border-red-500/30 hover:border-red-500/50' : 'border-dark-border/40 hover:border-emerald-green/30'}`}>
                <div className="relative h-28">
                  <img src={store.banner} alt="Banner" className="w-full h-full object-cover opacity-25" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-card/80" />
                  <img src={store.logo} alt="Logo" className="absolute -bottom-6 left-4 w-14 h-14 rounded-xl border-2 border-dark-card object-cover bg-dark-bg" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {store.warning && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur flex items-center gap-1"><IoWarningOutline /> WARNING</span>}
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-green/20 text-emerald-green border border-emerald-green/30 backdrop-blur flex items-center gap-1"><IoShieldCheckmarkOutline /> VERIFIED</span>
                  </div>
                </div>

                <div className="pt-8 px-5 pb-5 flex flex-col flex-1 space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{store.name}</h4>
                    <p className="text-xs text-electric-blue font-bold">{store.ownerName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-bg/40 rounded-xl p-3 text-center border border-dark-border/40">
                      <p className="text-[9px] text-muted-text mb-1">Rating</p>
                      <p className="text-sm font-bold text-white flex items-center justify-center gap-1">
                        {store.rating > 0 ? store.rating : 'New'} <IoStar className="text-amber-400 text-xs" />
                      </p>
                    </div>
                    <div className="bg-dark-bg/40 rounded-xl p-3 text-center border border-dark-border/40">
                      <p className="text-[9px] text-muted-text mb-1">Trust Score</p>
                      <p className={`text-sm font-bold ${store.trustScore >= 80 ? 'text-emerald-green' : store.trustScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{store.trustScore}/100</p>
                    </div>
                    <div className="bg-dark-bg/40 rounded-xl p-3 text-center border border-dark-border/40">
                      <p className="text-[9px] text-muted-text mb-1">Total Orders</p>
                      <p className="text-sm font-bold text-white">{store.totalOrders}</p>
                    </div>
                    <div className="bg-dark-bg/40 rounded-xl p-3 text-center border border-dark-border/40">
                      <p className="text-[9px] text-muted-text mb-1">Complaints</p>
                      <p className={`text-sm font-bold ${store.complaints > 10 ? 'text-red-400' : 'text-white'}`}>{store.complaints}</p>
                    </div>
                  </div>

                  {store.warning && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <IoWarningOutline className="text-red-400 text-base shrink-0 mt-0.5" />
                      <p className="text-[10px] text-red-300">Rating below threshold or excess complaints detected. Immediate admin review recommended.</p>
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-dark-border/40 grid grid-cols-2 gap-2">
                    <Button variant="secondary" className="text-[10px] justify-center border-dark-border/60 hover:text-white" onClick={() => openDrawer(store, 'verified')}>
                      <IoEyeOutline className="mr-1" /> View Details
                    </Button>
                    <Button variant="secondary" className="text-[10px] justify-center border-dark-border/60 hover:text-white">
                      <IoTrendingUpOutline className="mr-1" /> Performance
                    </Button>
                    <button
                      onClick={() => setShowRevokModal(store)}
                      className="col-span-2 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-xl py-2 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <IoCloseCircleOutline /> Remove Verification
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* ══════════════════════════════════════════════════════════════════
          STORE DETAILS DRAWER
      ══════════════════════════════════════════════════════════════════ */}
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
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{drawerMode === 'pending' ? 'Pending Verification Details' : 'Verified Store Details'}</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedStore.id}</p>
                </div>
                <button onClick={() => setSelectedStore(null)} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="flex-1">
                {/* Banner & Logo */}
                <div className="h-36 bg-dark-bg relative">
                  <img src={selectedStore.banner} alt="Banner" className="w-full h-full object-cover opacity-40" />
                  <img src={selectedStore.logo} alt="Logo" className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-2 border-dark-card object-cover bg-dark-bg shadow-xl" />
                </div>

                <div className="pt-12 px-6 pb-6 space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedStore.name}</h4>
                    <p className="text-xs text-electric-blue font-bold mt-1">{selectedStore.ownerName}</p>
                  </div>

                  {/* Store Details */}
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoStorefrontOutline className="text-electric-blue" /> Store Details</h5>
                    <div className="glass-panel p-4 rounded-xl border border-dark-border/40 space-y-2.5 text-xs">
                      {[
                        ['Phone', selectedStore.phone || '-'], ['Email', selectedStore.email || '-'],
                        ['Address', selectedStore.address || '-'], ['City', selectedStore.city || '-'],
                        ['State', selectedStore.state || '-'], ['Pincode', selectedStore.pincode || '-'],
                        ['Registered', selectedStore.registeredDate || '-'],
                        ...(drawerMode === 'pending' ? [
                          ['License No.', selectedStore.license || '-'],
                          ['GST No.', selectedStore.gst || '-'],
                          ['Owner Qualification', selectedStore.ownerQual || '-'],
                          ['Experience', selectedStore.ownerExp || '-'],
                          ['License Valid Till', selectedStore.licenseValid || '-'],
                        ] : [
                          ['Total Orders', String(selectedStore.totalOrders || 0)],
                          ['Revenue', selectedStore.revenue || '-'],
                          ['Medicine Availability', `${selectedStore.medicineAvail}%`],
                          ['Avg Delivery Time', selectedStore.avgDelivery || '-'],
                          ['Response Time', selectedStore.responseTime || '-'],
                        ])
                      ].map(([label, val]) => (
                        <p key={label} className="text-muted-text flex justify-between gap-2"><span className="font-bold uppercase tracking-wider text-[10px] shrink-0">{label}</span> <span className="text-white text-right">{val}</span></p>
                      ))}
                    </div>
                  </div>

                  {/* License Documents */}
                  {drawerMode === 'pending' && selectedStore.docs && (
                    <div className="space-y-2">
                      <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoDocumentTextOutline className="text-electric-blue" /> License Documents</h5>
                      <div className="space-y-2">
                        {selectedStore.docs.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-dark-bg/40 rounded-xl border border-dark-border/40">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-electric-blue/10 text-electric-blue border border-electric-blue/20 flex items-center justify-center"><IoDocumentTextOutline /></div>
                              <p className="text-xs font-bold text-white">{doc}</p>
                            </div>
                            <div className="flex gap-2 text-muted-text">
                              <button className="hover:text-white transition-colors text-sm"><IoEyeOutline /></button>
                              <button className="hover:text-white transition-colors text-sm"><IoDownloadOutline /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inventory Preview */}
                  {drawerMode === 'pending' && selectedStore.medicines != null && (
                    <div>
                      <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoPeopleOutline className="text-electric-blue" /> Inventory Preview</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-dark-bg/40 rounded-xl p-3 border border-dark-border/40 text-center">
                          <p className="text-[9px] text-muted-text mb-1">Total Medicines</p>
                          <p className="text-lg font-bold text-white">{selectedStore.medicines}</p>
                        </div>
                        <div className="bg-dark-bg/40 rounded-xl p-3 border border-dark-border/40 text-center">
                          <p className="text-[9px] text-muted-text mb-1">Categories</p>
                          <p className="text-lg font-bold text-white">{selectedStore.categories}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Section for Verified */}
                  {drawerMode === 'verified' && (
                    <div>
                      <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoTrendingUpOutline className="text-electric-blue" /> Store Performance</h5>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ['Completed Orders', selectedStore.completedOrders, 'text-emerald-green'],
                          ['Cancelled Orders', selectedStore.cancelledOrders, 'text-red-400'],
                          ['Complaint Count', selectedStore.complaints, selectedStore.complaints > 10 ? 'text-red-400' : 'text-white'],
                          ['Trust Score', `${selectedStore.trustScore}/100`, selectedStore.trustScore >= 80 ? 'text-emerald-green' : 'text-amber-400'],
                        ].map(([label, val, color]) => (
                          <div key={label} className="bg-dark-bg/40 rounded-xl p-3 border border-dark-border/40 text-center">
                            <p className="text-[9px] text-muted-text mb-1">{label}</p>
                            <p className={`text-base font-bold ${color}`}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-dark-border/40 space-y-2">
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">Admin Actions</h5>
                    {drawerMode === 'pending' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleApprove(selectedStore)} className="col-span-2 bg-emerald-green text-dark-bg font-bold text-sm py-2.5 rounded-xl hover:bg-emerald-green/90 transition-colors flex items-center justify-center gap-2">
                          <IoCheckmark /> Approve Store
                        </button>
                        <button onClick={() => handleReject(selectedStore)} className="bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-xs py-2.5 rounded-xl hover:bg-red-500/20 transition-colors">Reject Store</button>
                        <button className="bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-400/20 transition-colors">Request Docs</button>
                        <button className="col-span-2 bg-dark-bg/40 text-muted-text border border-dark-border/60 font-bold text-xs py-2.5 rounded-xl hover:text-white transition-colors">Suspend Verification</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button className="bg-dark-bg/40 text-muted-text border border-dark-border/60 font-bold text-xs py-2.5 rounded-xl hover:text-white transition-colors">View Analytics</button>
                        <button className="bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-400/20 transition-colors">Suspend Store</button>
                        <button onClick={() => { setSelectedStore(null); setShowRevokModal(selectedStore); }} className="col-span-2 bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-xs py-2.5 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                          <IoCloseCircleOutline /> Remove Verification
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* ══════════════════════════════════════════════════════════════════
          REVOKE VERIFICATION MODAL
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showRevokModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-panel w-full max-w-md rounded-2xl border border-red-500/30 p-6 font-poppins text-left">
                <div className="flex items-start gap-3 mb-6">
                  <IoAlertCircleOutline className="text-red-400 text-2xl shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-white">Remove Verification</h3>
                    <p className="text-xs text-muted-text mt-1">You are about to revoke the Verified badge from <span className="text-white font-bold">{showRevokModal.name}</span>. This action will notify the pharmacy owner.</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">Select Reason</p>
                  <div className="space-y-2">
                    {REJECT_REASONS.map(reason => (
                      <label key={reason} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${revokeReason === reason ? 'border-red-500/50 bg-red-500/10' : 'border-dark-border/40 bg-dark-bg/40 hover:border-dark-border/60'}`}>
                        <input type="radio" name="reason" value={reason} checked={revokeReason === reason} onChange={e => setRevokeReason(e.target.value)} className="accent-red-400" />
                        <span className="text-xs text-white">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleRevokeVerification(showRevokModal)}
                    className="flex-1 bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-sm py-2.5 rounded-xl hover:bg-red-500/20 transition-colors"
                  >Remove Verification</button>
                  <button
                    onClick={() => { setShowRevokModal(null); setRevokeReason(''); }}
                    className="flex-1 bg-dark-bg/40 text-muted-text border border-dark-border/60 font-bold text-sm py-2.5 rounded-xl hover:text-white transition-colors"
                  >Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StoreVerification;
