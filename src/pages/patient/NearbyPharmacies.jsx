import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoLocationOutline, IoCallOutline, IoCheckmarkCircle, 
  IoStar, IoTimeOutline, IoNavigateOutline, IoStorefrontOutline,
  IoShieldCheckmark, IoOptionsOutline, IoCloseOutline,
  IoLogoWhatsapp, IoGlobeOutline,
  IoHeartOutline, IoHeart,
  IoChevronDownOutline, IoWarningOutline
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { usePatientData } from '../../context/PatientDataContext';

// ---------------------------------------------------------
// Mock Data
// ---------------------------------------------------------
const MOCK_PHARMACIES = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    address: "12/A, Apollo Street, Data Colony",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "contact@healthplus.com",
    distance: 0.4,
    time: "10-15 mins",
    rating: 4.8,
    reviews: 256,
    trustScore: 95,
    verified: true,
    ownerVerified: true,
    isOpen: true,
    closingTime: "10:00 PM",
    availability: "all", // all, partial, none
    availabilityText: "All Medicines Available",
    availabilityPercent: 100,
    priceLevel: "₹₹",
    is24x7: false,
    homeDelivery: true,
    aiRecommended: true,
    lastUpdated: "5 mins ago",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
    services: ["Home Delivery", "Online Payment", "Prescription Accepted"]
  },
  {
    id: 2,
    name: "Care Pharmacy",
    address: "Shop No 4, City Center, Data Colony",
    phone: "+91 98765 67890",
    whatsapp: "+91 98765 67890",
    distance: 0.8,
    time: "15-20 mins",
    rating: 4.6,
    reviews: 189,
    trustScore: 90,
    verified: true,
    ownerVerified: true,
    isOpen: true,
    closingTime: "10:30 PM",
    availability: "partial",
    availabilityText: "95% Medicines Available",
    availabilityPercent: 95,
    priceLevel: "₹₹",
    is24x7: false,
    homeDelivery: true,
    aiRecommended: false,
    lastUpdated: "12 mins ago",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=2069&auto=format&fit=crop",
    services: ["Home Delivery", "Online Payment"]
  },
  {
    id: 3,
    name: "MediPlus Pharmacy",
    address: "Ground Floor, Metro Plaza, Data Colony",
    phone: "+91 98765 24680",
    distance: 1.2,
    time: "10-18 mins",
    rating: 4.5,
    reviews: 132,
    trustScore: 87,
    verified: true,
    ownerVerified: true,
    isOpen: true,
    closingTime: "10:00 PM",
    availability: "partial",
    availabilityText: "80% Medicines Available",
    availabilityPercent: 80,
    priceLevel: "₹",
    is24x7: false,
    homeDelivery: false,
    aiRecommended: false,
    lastUpdated: "1 hr ago",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop",
    services: ["Online Payment", "Prescription Accepted"]
  },
  {
    id: 4,
    name: "LifeCare Pharmacy",
    address: "Opp. General Hospital, Data Colony",
    phone: "+91 98765 11223",
    distance: 1.6,
    time: "20-25 mins",
    rating: 4.4,
    reviews: 98,
    trustScore: 82,
    verified: true,
    ownerVerified: true,
    isOpen: true,
    closingTime: "9:30 PM",
    availability: "partial",
    availabilityText: "70% Medicines Available",
    availabilityPercent: 70,
    priceLevel: "₹₹",
    is24x7: true,
    homeDelivery: true,
    aiRecommended: false,
    lastUpdated: "30 mins ago",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop",
    services: ["Home Delivery", "24x7 Open", "Emergency Medicines"]
  },
  {
    id: 5,
    name: "Shree Medical Store",
    address: "Near Bus Stand, Data Colony",
    phone: "+91 98765 55432",
    distance: 2.1,
    time: "25-30 mins",
    rating: 4.2,
    reviews: 76,
    trustScore: 78,
    verified: true,
    ownerVerified: false,
    isOpen: true,
    closingTime: "9:45 PM",
    availability: "partial",
    availabilityText: "65% Medicines Available",
    availabilityPercent: 65,
    priceLevel: "₹",
    is24x7: false,
    homeDelivery: false,
    aiRecommended: false,
    lastUpdated: "2 hrs ago",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
    services: ["Online Payment"]
  }
];

export const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState(10);
  const [selectedSort, setSelectedSort] = useState('AI Recommended');
  const { toggleSavePharmacy, isPharmacySaved } = usePatientData();
  
  // Modals
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    // Simulate API Fetch
    const fetchPharmacies = async () => {
      setLoading(true);
      setTimeout(() => {
        setPharmacies(MOCK_PHARMACIES);
        setLoading(false);
      }, 1200);
    };
    fetchPharmacies();
  }, []);

  const handleSave = (phr, e) => {
    e.stopPropagation();
    toggleSavePharmacy(phr);
    toast.success(isPharmacySaved(phr.id) ? 'Removed from saved pharmacies' : 'Pharmacy saved!', {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
    });
  };

  const handleReserve = (phr, e) => {
    e.stopPropagation();
    setSelectedPharmacy(phr);
    setShowReserveModal(true);
  };

  const confirmReservation = () => {
    setShowReserveModal(false);
    toast.success(`Medicines reserved at ${selectedPharmacy?.name}!`, {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
    });
  };

  const openDetails = (phr) => {
    setSelectedPharmacy(phr);
  };

  return (
    <div className="text-left font-poppins pb-10">
      
      {/* ----------------------------------------------------- */}
      {/* 1. PHARMACY STATISTICS HEADER */}
      {/* ----------------------------------------------------- */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          All Pharmacies Near You
        </h2>
        <p className="text-sm text-muted-text mt-1">Showing pharmacies within {radius} KM of Data Colony, Bhopal</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        
        {/* Stats Strip */}
        <div className="flex-1 glass-panel rounded-2xl p-4 border border-dark-border/40 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-dark-border/40 items-center">
          
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-[10px] text-muted-text uppercase tracking-wider mb-0.5">Total Pharmacies Found</p>
              <h3 className="text-2xl font-bold text-white leading-none">{pharmacies.length}</h3>
            </div>
            <IoStorefrontOutline className="text-2xl text-emerald-green opacity-50" />
          </div>
          
          <div className="flex items-center justify-between px-4">
            <div>
              <p className="text-[10px] text-muted-text uppercase tracking-wider mb-0.5">Search Radius</p>
              <h3 className="text-lg font-bold text-white leading-none">{radius} KM</h3>
            </div>
            <IoLocationOutline className="text-xl text-emerald-green opacity-50" />
          </div>

          <div className="px-4 col-span-2 md:col-span-2 flex items-center justify-between">
             <div>
               <p className="text-[10px] text-muted-text uppercase tracking-wider mb-0.5">Address</p>
               <h3 className="text-sm font-bold text-white">Data Colony, Bhopal</h3>
             </div>
             <button className="text-[11px] text-emerald-green hover:text-white transition-colors">Change</button>
          </div>
        </div>

        {/* Sort & Filter Actions */}
        <div className="flex items-center gap-3">
          <div className="glass-panel rounded-xl border border-dark-border/40 px-4 py-3 flex flex-col justify-center min-w-[180px]">
            <p className="text-[10px] text-muted-text mb-1">Sort By</p>
            <div className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-white">{selectedSort}</span>
              <IoChevronDownOutline className="text-muted-text" />
            </div>
          </div>
          <Button variant="secondary" className="h-full px-5 border-dark-border/40" onClick={() => setShowFiltersMobile(!showFiltersMobile)}>
            <IoOptionsOutline className="mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ----------------------------------------------------- */}
        {/* 2. ADVANCED FILTER PANEL (SIDEBAR) */}
        {/* ----------------------------------------------------- */}
        <div className={`w-full lg:w-64 flex-shrink-0 space-y-6 h-fit filter-panel-premium ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Filter Pharmacies</h3>
            <button className="text-[11px] text-emerald-green hover:text-white">Clear All</button>
          </div>

          {/* Sort Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Sort By</h4>
            <div className="space-y-2">
              {['AI Recommended', 'Nearest First', 'Highest Rating', 'Lowest Price', 'Most Trusted'].map(sort => (
                <label key={sort} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center custom-radio ${selectedSort === sort ? 'active' : ''}`}>
                    {selectedSort === sort && <div className="w-2 h-2 rounded-full active-dot" />}
                  </div>
                  <span className={`text-xs ${selectedSort === sort ? 'font-medium' : 'text-muted-text'}`}>{sort}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-dark-border/40" />

          {/* Availability */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Availability</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center custom-checkbox active"><IoCheckmarkCircle className="text-dark-bg text-xs"/></div>
                <span className="text-xs font-medium">All Medicines Available</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center custom-checkbox"></div>
                <span className="text-xs text-muted-text">Partial Availability</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center custom-checkbox"></div>
                <span className="text-xs text-muted-text">Low Stock</span>
              </label>
            </div>
          </div>

          <hr className="border-dark-border/40" />

          {/* Store Type */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Store Type</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center custom-checkbox active"><IoCheckmarkCircle className="text-dark-bg text-xs"/></div>
                <span className="text-xs font-medium">All Stores</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center custom-checkbox"></div>
                <span className="text-xs text-muted-text">Verified Stores</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center custom-checkbox"></div>
                <span className="text-xs text-muted-text">Premium Stores</span>
              </label>
            </div>
          </div>

          <hr className="border-dark-border/40" />

          {/* Distance Slider */}
          <div className="space-y-4">
             <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Distance</h4>
             <div className="px-1 mt-3">
               <div className="custom-slider-track w-full">
                 <div className="custom-slider-fill w-1/2"></div>
                 <div className="custom-slider-thumb" style={{ left: '50%' }}></div>
               </div>
               <div className="flex justify-between items-center mt-3 text-[10px] text-muted-text">
                 <span>0 KM</span>
                 <span>10 KM</span>
               </div>
             </div>
          </div>

          <Button variant="primary-green" className="w-full text-xs font-bold py-2.5 btn-primary-green">Apply Filters</Button>
        </div>

        {/* ----------------------------------------------------- */}
        {/* 3. PHARMACY CARDS LIST */}
        {/* ----------------------------------------------------- */}
        <div className="flex-1 space-y-4">
          
          {loading ? (
            // 24. Loading State Skeleton
            Array.from({length: 4}).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl p-4 border border-dark-border/40 flex gap-4 animate-pulse">
                <div className="w-32 h-32 bg-dark-bg/50 rounded-xl"></div>
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-5 bg-dark-bg/50 rounded w-1/3"></div>
                  <div className="h-3 bg-dark-bg/50 rounded w-1/4"></div>
                  <div className="h-3 bg-dark-bg/50 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : pharmacies.length === 0 ? (
            // 25. Empty State
            <div className="glass-panel rounded-2xl p-12 border border-dark-border/40 text-center flex flex-col items-center justify-center">
              <IoStorefrontOutline className="text-6xl text-muted-text/30 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No nearby pharmacies found</h3>
              <p className="text-sm text-muted-text max-w-md">Try expanding your search radius or modifying your filters to find available medicines.</p>
              <Button variant="secondary" className="mt-6">Clear All Filters</Button>
            </div>
          ) : (
            // Enhanced Pharmacy Cards
            pharmacies.map((phr, index) => (
              <div key={phr.id} className="glass-panel rounded-2xl border border-dark-border/40 hover:border-emerald-green/30 transition-all duration-300 overflow-hidden flex flex-col md:flex-row relative group cursor-pointer" onClick={() => openDetails(phr)}>
                
                {/* Number Badge */}
                <div className="absolute top-4 -left-3 md:-left-4 z-10 w-8 h-8 rounded-full bg-dark-card border border-dark-border/60 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {index + 1}
                </div>

                {/* Left: Image & Tags */}
                <div className="w-full md:w-48 h-48 md:h-auto relative flex-shrink-0 bg-dark-bg/50">
                  <img src={phr.image} alt={phr.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1525] via-transparent to-transparent"></div>
                  
                  {phr.aiRecommended && (
                    <div className="absolute top-2 left-6 bg-electric-blue text-dark-bg text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                      <IoStar /> Best Match
                    </div>
                  )}

                  <button 
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-bg/60 backdrop-blur border border-white/10 text-white hover:text-red-400 transition-colors z-10"
                    onClick={(e) => handleSave(phr, e)}
                  >
                    {isPharmacySaved(phr.id) ? <IoHeart className="text-red-400" /> : <IoHeartOutline />}
                  </button>
                </div>

                {/* Middle: Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {phr.name}
                          {phr.verified && <span className="text-emerald-green bg-emerald-green/10 text-[10px] px-1.5 py-0.5 rounded border border-emerald-green/20 uppercase tracking-wide flex items-center gap-1"><IoCheckmarkCircle/> Verified</span>}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-text">
                          <span className="flex items-center gap-1"><IoStar className="text-amber-400"/> <strong className="text-white">{phr.rating}</strong> ({phr.reviews})</span>
                          <span className="flex items-center gap-1"><IoLocationOutline /> {phr.distance} KM</span>
                          <span className="flex items-center gap-1"><IoTimeOutline /> {phr.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* 6. Medicine Availability Summary */}
                    <div className="mt-3 inline-block">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded border flex items-center gap-1.5
                        ${phr.availabilityPercent === 100 ? 'bg-emerald-green/10 text-emerald-green border-emerald-green/20' : 
                          phr.availabilityPercent > 70 ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/20' : 
                          'bg-amber-400/10 text-amber-400 border-amber-400/20'
                        }`}
                      >
                        {phr.availabilityPercent === 100 ? <IoCheckmarkCircle/> : <IoWarningOutline/>}
                        {phr.availabilityText}
                      </span>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] uppercase font-semibold text-muted-text tracking-wider">
                    {/* Trust Score */}
                    <div className="flex items-center gap-1.5">
                       <IoShieldCheckmark className="text-emerald-green text-sm" />
                       Trust Score <span className="text-white ml-1">{phr.trustScore}/100</span>
                    </div>
                    {/* Owner Verified */}
                    {phr.ownerVerified && (
                      <div className="flex items-center gap-1.5">
                        <IoCheckmarkCircle className="text-emerald-green text-sm" /> Owner Verified
                      </div>
                    )}
                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                       {phr.isOpen ? (
                         <>
                           <div className="w-2 h-2 rounded-full bg-emerald-green animate-pulse"></div> Open Now
                           <span className="text-muted-text/50 lowercase font-normal ml-1">Closes {phr.closingTime}</span>
                         </>
                       ) : (
                         <>
                           <div className="w-2 h-2 rounded-full bg-red-500"></div> Closed
                         </>
                       )}
                    </div>
                    {/* 10. Estimated Cost Indicator */}
                    <div className="flex items-center gap-1.5">
                       Est. Price <span className="text-white font-bold ml-1">{phr.priceLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full md:w-48 p-5 border-t md:border-t-0 md:border-l border-dark-border/40 bg-dark-bg/20 flex flex-col justify-center gap-2">
                   <div className="text-xs text-muted-text flex items-center justify-center gap-1.5 mb-2">
                     <IoCallOutline /> {phr.phone}
                   </div>
                   
                   <Button variant="secondary" className="w-full py-2 text-xs border-dark-border hover:bg-white/5" onClick={(e) => {e.stopPropagation(); openDetails(phr);}}>
                     View Details
                   </Button>
                   
                   <Button 
                     variant="primary" 
                     className="w-full py-2 text-xs bg-dark-bg border border-emerald-green/40 text-emerald-green hover:bg-emerald-green/10"
                     onClick={(e) => handleReserve(phr, e)}
                   >
                     <IoStorefrontOutline className="mr-1.5" /> Reserve Medicines
                   </Button>

                   <button className="w-full py-2 text-[11px] text-muted-text hover:text-white flex items-center justify-center gap-1.5 transition-colors" onClick={(e) => e.stopPropagation()}>
                     <IoNavigateOutline /> Navigate
                   </button>
                </div>

              </div>
            ))
          )}

          {/* 20. Pagination */}
          {!loading && pharmacies.length > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-dark-border/40">
              <div className="flex items-center gap-2">
                 <button className="w-8 h-8 rounded-lg border border-dark-border/60 flex items-center justify-center text-muted-text hover:bg-white/5">&lt;</button>
                 <button className="w-8 h-8 rounded-lg bg-emerald-green text-dark-bg font-bold flex items-center justify-center">1</button>
                 <button className="w-8 h-8 rounded-lg border border-dark-border/60 flex items-center justify-center text-muted-text hover:bg-white/5">2</button>
                 <button className="w-8 h-8 rounded-lg border border-dark-border/60 flex items-center justify-center text-muted-text hover:bg-white/5">3</button>
                 <span className="text-muted-text px-2">...</span>
                 <button className="w-8 h-8 rounded-lg border border-dark-border/60 flex items-center justify-center text-muted-text hover:bg-white/5">6</button>
                 <button className="w-8 h-8 rounded-lg border border-dark-border/60 flex items-center justify-center text-muted-text hover:bg-white/5">&gt;</button>
              </div>
              <p className="text-xs text-muted-text">Showing 1 to 5 of {pharmacies.length} pharmacies</p>
            </div>
          )}

        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* 17. PHARMACY DETAILS MODAL */}
      {/* ----------------------------------------------------- */}
      <AnimatePresence>
        {selectedPharmacy && !showReserveModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-3xl rounded-2xl border border-dark-border/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Cover Image */}
              <div className="h-48 relative w-full bg-dark-bg">
                <img src={selectedPharmacy.image} alt={selectedPharmacy.name} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1525] to-transparent"></div>
                <button 
                  onClick={() => setSelectedPharmacy(null)}
                  className="absolute top-4 right-4 p-2 bg-dark-bg/50 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <IoCloseOutline size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedPharmacy.name}
                    {selectedPharmacy.verified && <span className="text-emerald-green bg-emerald-green/20 backdrop-blur text-xs px-2 py-0.5 rounded border border-emerald-green/30 uppercase flex items-center gap-1"><IoCheckmarkCircle/> Verified</span>}
                  </h2>
                  <p className="text-sm text-white/80 mt-1 flex items-center gap-2"><IoLocationOutline /> {selectedPharmacy.address}</p>
                </div>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Content */}
                <div className="md:col-span-2 space-y-6">
                  
                  <div className="flex gap-4 p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40">
                    <div className="text-center px-4 border-r border-dark-border/40">
                      <span className="text-2xl font-bold text-white flex items-center justify-center gap-1">{selectedPharmacy.rating} <IoStar className="text-amber-400 text-lg"/></span>
                      <span className="text-[10px] text-muted-text uppercase">{selectedPharmacy.reviews} Reviews</span>
                    </div>
                    <div className="text-center px-4 border-r border-dark-border/40">
                      <span className="text-2xl font-bold text-emerald-green">{selectedPharmacy.trustScore}</span>
                      <span className="text-[10px] text-muted-text uppercase">Trust Score</span>
                    </div>
                    <div className="text-center px-4">
                      <span className="text-lg font-bold text-white mt-1 block">{selectedPharmacy.distance} KM</span>
                      <span className="text-[10px] text-muted-text uppercase">{selectedPharmacy.time}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">About Pharmacy</h4>
                    <p className="text-xs text-muted-text leading-relaxed">
                      {selectedPharmacy.name} is a verified partner of MedAccess ensuring highest quality of genuine medicines. With a trust score of {selectedPharmacy.trustScore}/100, they are recognized for fast service and reliable stock availability.
                    </p>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><IoShieldCheckmark className="text-emerald-green" /> Services Available</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPharmacy.services.map(srv => (
                        <span key={srv} className="px-3 py-1.5 text-[11px] rounded bg-white/5 border border-white/10 text-white/90">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="h-32 rounded-xl bg-dark-bg/50 border border-dark-border/40 flex items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                     <IoLocationOutline className="text-3xl text-emerald-green absolute" />
                     <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <Button variant="primary-green" className="text-xs"><IoNavigateOutline className="mr-1"/> Open in Google Maps</Button>
                     </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 space-y-4">
                     <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Contact Info</h4>
                     <div className="flex items-center gap-3 text-sm text-white/90">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><IoCallOutline /></div>
                       {selectedPharmacy.phone}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-white/90">
                       <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center"><IoLogoWhatsapp /></div>
                       {selectedPharmacy.whatsapp}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-white/90">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><IoGlobeOutline /></div>
                       Website
                     </div>
                   </div>

                   <div className="p-4 rounded-xl bg-emerald-green/5 border border-emerald-green/20">
                     <h4 className="text-xs font-bold text-emerald-green uppercase tracking-wider mb-2">Working Hours</h4>
                     <div className="text-xs text-white space-y-1.5">
                       <div className="flex justify-between"><span>Mon - Sat</span> <span>09:00 AM - 10:00 PM</span></div>
                       <div className="flex justify-between text-muted-text"><span>Sunday</span> <span>Closed</span></div>
                     </div>
                   </div>

                   <Button 
                     variant="primary-green" 
                     className="w-full py-3"
                     onClick={() => setShowReserveModal(true)}
                   >
                     Reserve Medicines Now
                   </Button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------- */}
      {/* 16. RESERVATION FLOW MODAL */}
      {/* ----------------------------------------------------- */}
      <AnimatePresence>
        {showReserveModal && selectedPharmacy && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark-bg/90 backdrop-blur-md"
           >
             <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="glass-panel w-full max-w-md rounded-2xl border border-emerald-green/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col"
             >
                <div className="p-5 border-b border-dark-border/40 flex justify-between items-center bg-[#091712]">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <IoStorefrontOutline className="text-emerald-green" /> Reserve Medicines
                  </h3>
                  <button onClick={() => setShowReserveModal(false)} className="text-muted-text hover:text-white"><IoCloseOutline size={24} /></button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border/60">
                    <p className="text-[10px] text-muted-text uppercase">Reserving at</p>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedPharmacy.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white mb-2">Select Pickup Time</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border border-emerald-green bg-emerald-green/10 text-center cursor-pointer">
                        <span className="text-sm font-bold text-white block">Today</span>
                        <span className="text-[10px] text-emerald-green">Within 2 hours</span>
                      </div>
                      <div className="p-3 rounded-xl border border-dark-border/60 hover:bg-white/5 text-center cursor-pointer">
                        <span className="text-sm font-bold text-white block">Tomorrow</span>
                        <span className="text-[10px] text-muted-text">Morning</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-start gap-3">
                    <IoInformationCircleOutline className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-400/90 leading-relaxed">
                      Please carry your original prescription when visiting the pharmacy for pickup. Reservation is valid for 24 hours.
                    </p>
                  </div>

                  <Button variant="primary-green" className="w-full py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]" onClick={confirmReservation}>
                    Confirm Reservation
                  </Button>
                </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default NearbyPharmacies;
