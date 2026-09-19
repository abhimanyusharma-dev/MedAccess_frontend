import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { medicineApi } from '../../services/medicineApi';
import { motion } from 'framer-motion';
import { 
  IoCloudUploadOutline, 
  IoSearchOutline, 
  IoLocationOutline, 
  IoNotificationsOutline, 
  IoChatbubblesOutline,
  IoStar,
  IoNavigateOutline,
  IoCheckmarkCircleOutline,
  IoShieldCheckmarkOutline,
  IoCashOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoCloudDownloadOutline,
  IoEyeOutline,
  IoCameraOutline,
  IoImageOutline,
  IoSendOutline,
  IoStorefrontOutline,
  IoAddOutline,
  IoArrowForwardOutline,
  IoReceiptOutline
} from 'react-icons/io5';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  }
};

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resList = await medicineApi.getReservations(user.id);
        setReservations(resList);
      } catch (err) {
        console.error('Failed to load reservations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  return (
    <motion.div 
      className="space-y-8 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="text-left">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hello, <span className="text-emerald-green">{user?.name || 'Aayezah'}</span> <span className="inline-block origin-bottom-right hover:animate-wave">👋</span>
        </h1>
        <p className="text-muted-text text-sm">What would you like to do today?</p>
      </motion.div>

      {/* Quick Action Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Upload Prescription", desc: "Upload and get AI analysis instantly", icon: IoCloudUploadOutline, action: "Upload Now", color: "emerald-green", path: "/patient/upload-prescription" },
          { title: "Find Medicines", desc: "Search medicines & compare prices", icon: IoSearchOutline, action: "Search Now", color: "electric-blue", path: "/patient/find-medicines" },
          { title: "Nearby Pharmacies", desc: "Find trusted pharmacies near you", icon: IoLocationOutline, action: "View Nearby", color: "purple-500", path: "/patient/nearby-pharmacies" },
          { title: "Medicine Reservations", desc: "View and manage your reservations", icon: IoNotificationsOutline, action: "View Reservations", color: "yellow-500", path: "/patient/reservations" },
          { title: "Saved Pharmacies", desc: "Your favorite pharmacies", icon: IoStar, action: "View Saved", color: "emerald-green", path: "/patient/saved-pharmacies" },
        ].map((card, i) => (
          <div 
            key={i} 
            onClick={() => navigate(card.path)}
            className="glass-panel-interactive rounded-2xl p-4 text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}/5 rounded-full blur-2xl group-hover:bg-${card.color}/10 transition-all duration-500`} />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center border border-${card.color}/20 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`text-${card.color} text-xl`} />
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">{card.title}</h3>
              </div>
              <p className="text-xs text-muted-text mb-4 leading-relaxed">{card.desc}</p>
            </div>
            <button className={`w-full py-2 rounded-xl btn-premium text-xs flex items-center justify-center gap-2`}>
              {card.action} <IoArrowForwardOutline />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Current Location Bar */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-4 flex items-center justify-between border-emerald-green/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-green/10 flex items-center justify-center shadow-glow-green/20">
            <IoLocationOutline className="text-emerald-green text-xl" />
          </div>
          <div className="text-left">
            <div className="text-xs text-muted-text flex items-center gap-2">Current Location: <span className="text-white font-bold text-base">Data Colony, Bhopal</span></div>
            <div className="text-xs text-muted-text">We will find nearby pharmacies based on this location</div>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl btn-premium text-xs flex items-center gap-2">
          <IoSearchOutline /> Change Location
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Prescription Scanner */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border-neon-cyan/20 relative overflow-hidden text-left flex flex-col justify-between">
          <div className="absolute top-0 right-0 px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold rounded-bl-xl border-b border-l border-neon-cyan/20">NEW</div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">AI Prescription Scanner <IoCheckmarkCircleOutline className="text-neon-cyan" /></h3>
            <p className="text-xs text-muted-text">Upload your prescription and let our AI detect medicines for you.</p>
          </div>
          
          <div className="border-2 border-dashed border-dark-border hover:border-emerald-green/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer transition-colors duration-300 bg-dark-bg/30 mb-4 flex-1">
            <IoCloudUploadOutline className="text-4xl text-emerald-green mb-3 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-white mb-1">Click to upload or drag & drop</span>
            <span className="text-xs text-muted-text">JPG, PNG, PDF (Max 5MB)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="py-2.5 rounded-xl bg-dark-bg border border-dark-border hover:border-white/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
              <IoCameraOutline size={16} /> Camera Capture
            </button>
            <button className="py-2.5 rounded-xl bg-dark-bg border border-dark-border hover:border-white/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
              <IoImageOutline size={16} /> From Gallery
            </button>
          </div>
        </motion.div>

        {/* AI Detected Medicines (Mock) */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border-emerald-green/20 relative overflow-hidden text-left">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <IoDocumentTextOutline size={200} className="text-emerald-green" />
          </div>
          <h3 className="text-lg font-bold text-white mb-4">AI Detected Medicines</h3>
          <div className="space-y-3 mb-6 relative z-10">
            {[
              { name: "Paracetamol 650mg", type: "Tablet", dosage: "1-0-1" },
              { name: "Azithromycin 500mg", type: "Tablet", dosage: "1-0-1" },
              { name: "Cetirizine 10mg", type: "Tablet", dosage: "0-1-0" },
              { name: "Vitamin D3 60K", type: "Capsule", dosage: "0-0-1" }
            ].map((med, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-white/5 hover:border-emerald-green/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <IoCheckmarkCircleOutline className="text-emerald-green text-lg" />
                  <div>
                    <div className="text-sm font-bold text-white">{med.name}</div>
                    <div className="text-[10px] text-muted-text">{med.type}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-emerald-green bg-emerald-green/10 px-2 py-1 rounded">{med.dosage}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <button className="flex-1 py-3 rounded-xl btn-premium text-sm">
              Find Medicines
            </button>
            <button className="px-4 py-3 rounded-xl bg-dark-bg border border-dark-border hover:border-white/20 text-muted-text hover:text-white transition-colors">
              <IoEyeOutline size={20} />
            </button>
            <button className="px-4 py-3 rounded-xl bg-dark-bg border border-dark-border hover:border-white/20 text-muted-text hover:text-white transition-colors">
              <IoCloudDownloadOutline size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nearby Pharmacies (Mock) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Nearby Pharmacies</h3>
            <span className="text-xs text-emerald-green cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-4">
            {[
              { name: "HealthPlus Pharmacy", rating: 4.6, reviews: 256, dist: "0.4", time: "10-15", stock: "In Stock", stockColor: "text-emerald-green" },
              { name: "Care Pharmacy", rating: 4.4, reviews: 189, dist: "0.6", time: "15-20", stock: "In Stock", stockColor: "text-emerald-green" },
              { name: "MediPlus Pharmacy", rating: 4.3, reviews: 132, dist: "0.8", time: "20-25", stock: "Low Stock", stockColor: "text-yellow-500" }
            ].map((store, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-dark-bg/40 border border-white/5 hover:border-emerald-green/20 transition-all group">
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-green/10 flex items-center justify-center font-bold text-emerald-green text-sm">{i+1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{store.name}</span>
                      <span className="text-[9px] bg-emerald-green/20 text-emerald-green px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">Verified</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-text mt-1">
                      <span className="flex items-center gap-1 text-yellow-500"><IoStar /> {store.rating} ({store.reviews})</span>
                      <span className="flex items-center gap-1"><IoLocationOutline /> {store.dist} km</span>
                      <span className="flex items-center gap-1"><IoTimeOutline /> {store.time} mins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
                  <span className={`text-xs font-bold ${store.stockColor}`}>{store.stock}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-green/10 text-emerald-green text-xs font-semibold hover:bg-emerald-green/20 transition-colors">View Store</button>
                    <button className="px-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border text-white text-xs hover:border-white/20 transition-colors flex items-center gap-1"><IoNavigateOutline /> Navigate</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-xs text-emerald-green hover:underline flex items-center justify-center gap-1 w-full"><IoArrowForwardOutline /> View All Pharmacies</button>
          </div>
        </motion.div>

        <div className="space-y-6 flex flex-col">
          {/* Smart Pharmacy Ranking */}
          <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 text-left flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Smart Pharmacy Ranking</h3>
              <span className="text-[10px] text-emerald-green cursor-pointer">How it works?</span>
            </div>
            <p className="text-[10px] text-muted-text mb-4">AI ranks pharmacies based on distance, stock, price & trust</p>
            
            <div className="space-y-4 mb-5">
              {[
                { name: "HealthPlus", score: 95, color: "emerald-green", w: "95%" },
                { name: "Care Pharmacy", score: 90, color: "electric-blue", w: "90%" },
                { name: "MediStore", score: 87, color: "yellow-500", w: "87%" }
              ].map((rank, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-muted-text">{i+1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">{rank.name}</span>
                      <span className="text-muted-text">Score <span className="text-white font-bold">{rank.score}</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-bg rounded-full overflow-hidden">
                      <div className={`h-full bg-${rank.color} rounded-full`} style={{ width: rank.w }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5">
              <div className="text-center"><div className="text-emerald-green flex justify-center mb-1"><IoLocationOutline /></div><div className="text-[9px] text-muted-text leading-tight">Distance<br/>25%</div></div>
              <div className="text-center"><div className="text-emerald-green flex justify-center mb-1"><IoStorefrontOutline /></div><div className="text-[9px] text-muted-text leading-tight">Stock<br/>30%</div></div>
              <div className="text-center"><div className="text-emerald-green flex justify-center mb-1"><IoCashOutline /></div><div className="text-[9px] text-muted-text leading-tight">Price<br/>20%</div></div>
              <div className="text-center"><div className="text-emerald-green flex justify-center mb-1"><IoShieldCheckmarkOutline /></div><div className="text-[9px] text-muted-text leading-tight">Trust Score<br/>25%</div></div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Medicine Reservations (Real Data / Enhanced UI) */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Medicine Reservations</h3>
            <span className="text-xs text-emerald-green cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-sm text-muted-text py-4">Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="text-center text-sm text-muted-text py-4 border border-dashed border-dark-border rounded-xl">No active reservations.</div>
            ) : (
              reservations.slice(0,3).map((res) => (
                <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-dark-bg/40 border border-white/5 hover:border-emerald-green/20 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-green/30">
                      <IoReceiptOutline className="text-white group-hover:text-emerald-green" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white truncate max-w-[150px]">{res.pharmacyName}</div>
                      <div className="text-[10px] text-muted-text">Total: ${res.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 sm:mt-0 sm:gap-4">
                    <div className="text-right">
                      <div className={`text-xs font-bold ${res.status === 'ready' ? 'text-neon-cyan' : 'text-emerald-green'}`}>
                        {res.status === 'ready' ? 'Ready for Pickup' : 'Reserved'}
                      </div>
                      <div className="text-[10px] text-muted-text">{new Date(res.reservedAt).toLocaleDateString()}</div>
                    </div>
                    <IoArrowForwardOutline className="text-muted-text group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
            <button className="w-full py-2.5 mt-2 rounded-xl bg-dark-bg border border-dark-border border-dashed hover:border-emerald-green/50 text-emerald-green text-xs font-semibold flex items-center justify-center gap-2 transition-all">
              <IoAddOutline /> New Reservation
            </button>
          </div>
        </motion.div>

        {/* My Prescriptions */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">My Prescriptions</h3>
            <span className="text-xs text-emerald-green cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-2">
            {[
              { name: "Prescription_May_2024", date: "14 May 2024" },
              { name: "Prescription_Apr_2024", date: "28 Apr 2024" },
              { name: "Prescription_Mar_2024", date: "15 Mar 2024" },
              { name: "Prescription_Feb_2024", date: "18 Feb 2024" }
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-bg/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <IoDocumentTextOutline className="text-muted-text group-hover:text-emerald-green" />
                  <span className="text-sm text-white group-hover:font-semibold transition-all">{doc.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-text hidden sm:block">{doc.date}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-muted-text hover:text-white rounded-lg hover:bg-white/10 transition-colors"><IoEyeOutline /></button>
                    <button className="p-1.5 text-muted-text hover:text-white rounded-lg hover:bg-white/10 transition-colors"><IoCloudDownloadOutline /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom Information Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "100% Secure", desc: "Your data is safe with us", icon: IoShieldCheckmarkOutline },
          { title: "Verified Pharmacies", desc: "Only trusted & verified stores", icon: IoCheckmarkCircleOutline },
          { title: "Best Price Guarantee", desc: "We help you save more", icon: IoCashOutline },
          { title: "Fast & Easy", desc: "Find medicines in minutes", icon: IoTimeOutline },
        ].map((info, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 flex items-center gap-4 border border-white/5 hover:border-emerald-green/30 transition-all group">
            <div className="w-10 h-10 rounded-full bg-emerald-green/10 flex items-center justify-center group-hover:bg-emerald-green/20 transition-colors shadow-glow-green/10">
              <info.icon className="text-emerald-green text-lg" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white mb-0.5">{info.title}</div>
              <div className="text-[10px] text-muted-text">{info.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

    </motion.div>
  );
};
export default PatientDashboard;
