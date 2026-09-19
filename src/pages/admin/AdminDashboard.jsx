import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoPeople, IoStorefront, IoShieldCheckmark, IoChatbubbleEllipses,
  IoMedkit, IoWarning, IoSearchOutline, IoLocationOutline, IoChevronDownOutline,
  IoCheckmark, IoClose, IoStar, IoMedalOutline, IoChatboxOutline
} from 'react-icons/io5';
import {
  LineChart, Line, ResponsiveContainer, YAxis
} from 'recharts';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const SPARK_DATA_UP = [{v: 10}, {v: 12}, {v: 15}, {v: 14}, {v: 20}, {v: 22}, {v: 25}];
const SPARK_DATA_DOWN = [{v: 25}, {v: 22}, {v: 24}, {v: 18}, {v: 15}, {v: 12}, {v: 10}];
const SPARK_DATA_NEUTRAL = [{v: 15}, {v: 14}, {v: 16}, {v: 15}, {v: 17}, {v: 15}, {v: 16}];

const AREA_STORES = [
  { name: 'Good Health Pharmacy', area: 'Kolar Road, Bhopal, MP', verified: true, rating: 4.6, reviews: 128 },
  { name: 'CareMed Pharmacy', area: 'Bittan Market, Bhopal, MP', verified: true, rating: 4.3, reviews: 98 },
  { name: 'MediLife Pharmacy', area: 'Mp Nagar, Bhopal, MP', verified: false, rating: 4.1, reviews: 76 },
  { name: 'LifeCare Pharmacy', area: 'Arera Colony, Bhopal, MP', verified: true, rating: 4.5, reviews: 54 },
  { name: 'HealthPlus Pharmacy', area: 'Hoshangabad Road, Bhopal, MP', verified: true, rating: 4.2, reviews: 43 },
];

const PENDING_STORES = [
  { name: 'NewLife Pharmacy', owner: 'Amit Sharma', address: 'Kolar Road, Bhopal, MP', date: '20 May 2024' },
  { name: 'Sai Medical Store', owner: 'Rahul Verma', address: 'Indrapuri, Bhopal, MP', date: '19 May 2024' },
  { name: 'Royal Pharmacy', owner: 'Neha Kumari', address: 'MP Nagar, Bhopal, MP', date: '19 May 2024' },
  { name: 'WellCare Pharmacy', owner: 'Vikram Singh', address: 'Bairagarh, Bhopal, MP', date: '18 May 2024' },
  { name: 'Shivam Medical Store', owner: 'Suresh Patel', address: 'Mandi Road, Bhopal, MP', date: '18 May 2024' },
];

const RECENT_FEEDBACK = [
  { store: 'Good Health Pharmacy', author: 'Rajesh Kumar', rating: 5, sentiment: 'Positive', text: 'Very good service and staff behavior. Got my medicines on time.', date: '20 May 2024' },
  { store: 'CareMed Pharmacy', author: 'Priya Sharma', rating: 4, sentiment: 'Positive', text: 'Good experience. Medicine was available and price was reasonable.', date: '19 May 2024' },
  { store: 'MediSave Pharmacy', author: 'Ankit Verma', rating: 3, sentiment: 'Neutral', text: 'Some medicines were not available.', date: '19 May 2024' },
  { store: 'HealthPlus Pharmacy', author: 'Suman Rathi', rating: 1, sentiment: 'Negative', text: 'Very late response and rude behavior.', date: '18 May 2024' },
];


// ── COMPONENTS ────────────────────────────────────────────────────────────

const SparkLine = ({ data, color }) => (
  <div className="h-8 w-full mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <YAxis domain={['dataMin', 'dataMax']} hide />
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={{ r: 2, fill: color, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass, sparkColor, sparkData, actionLabel }) => (
  <div className="glass-panel p-4 rounded-xl border border-dark-border/40 relative overflow-hidden flex flex-col justify-between group hover:border-white/10 transition-colors">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] text-muted-text mb-1 whitespace-nowrap">{title}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
      </div>
      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="text-lg" />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-1">
      <span className={`text-[9px] font-bold ${trendUp ? 'text-emerald-green' : 'text-red-400'}`}>{trend}</span>
      <span className="text-[9px] text-muted-text">vs last week</span>
    </div>
    <SparkLine data={sparkData} color={sparkColor} />
    {actionLabel && (
      <div className="mt-3 pt-3 border-t border-dark-border/40 text-center">
        <button className="text-[9px] text-muted-text hover:text-white transition-colors">{actionLabel}</button>
      </div>
    )}
  </div>
);

const StoreActionRow = ({ store, onApprove, onReject }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/40 border border-dark-border/40 hover:bg-white/5 transition-colors group">
    <div className="flex items-center gap-3 overflow-hidden">
       <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-muted-text overflow-hidden shrink-0">
          <IoStorefront className="text-xl" />
       </div>
       <div className="min-w-0">
         <h4 className="text-sm font-bold text-white truncate">{store.name}</h4>
         <p className="text-[10px] text-muted-text truncate">{store.address}</p>
         <p className="text-[9px] text-muted-text mt-0.5">Owner: <span className="text-white">{store.owner}</span> • Registered: {store.date}</p>
       </div>
    </div>
    <div className="flex items-center gap-2 shrink-0 ml-2">
      <button 
        onClick={() => onApprove(store)}
        className="w-8 h-8 rounded border border-emerald-green/30 text-emerald-green hover:bg-emerald-green/10 flex items-center justify-center transition-colors"
      >
        <IoCheckmark />
      </button>
      <button 
        onClick={() => onReject(store)}
        className="w-8 h-8 rounded border border-red-500/30 text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors"
      >
        <IoClose />
      </button>
    </div>
  </div>
);

const FeedbackCard = ({ feedback }) => {
  const isPos = feedback.sentiment === 'Positive';
  const isNeu = feedback.sentiment === 'Neutral';
  const sentimentColor = isPos ? 'text-emerald-green border-emerald-green/30' : isNeu ? 'text-amber-400 border-amber-400/30' : 'text-red-400 border-red-400/30';
  
  return (
    <div className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30 flex items-center justify-center shrink-0 text-xs font-bold">
            {feedback.author.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{feedback.store}</h4>
            <div className="flex text-[10px] text-amber-400">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} className={i < feedback.rating ? 'opacity-100' : 'opacity-20'} />
              ))}
            </div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border shrink-0 ${sentimentColor}`}>
          {feedback.sentiment}
        </span>
      </div>
      <p className="text-[11px] text-muted-text italic leading-relaxed">"{feedback.text}"</p>
      <div className="flex justify-between items-center pt-2 border-t border-dark-border/40">
        <p className="text-[9px] text-muted-text">— {feedback.author}</p>
        <p className="text-[9px] text-muted-text">{feedback.date}</p>
      </div>
    </div>
  );
};


// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const AdminDashboard = () => {
  
  const handleApprove = (store) => toast.success(`${store.name} approved!`);
  const handleReject = (store) => toast.error(`${store.name} rejected.`);

  return (
    <div className="relative flex flex-col space-y-6 text-left font-poppins pb-10">
      
      {/* ── HEADER & SEARCH ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            Admin Dashboard <span className="text-emerald-green"><IoMedkit/></span>
          </h2>
          <p className="text-sm text-muted-text">Welcome back, Super Admin! Here's what's happening today.</p>
        </div>
        
        <div className="relative w-full md:w-96 shrink-0">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 pl-9 pr-12 text-sm text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-text bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Ctrl K</div>
        </div>
      </div>

      {/* ── ROW 1: STAT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Users" value="12,458" icon={IoPeople} trend="↑ 12.5%" trendUp={true} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" sparkColor="#00B0FF" sparkData={SPARK_DATA_UP} />
        <StatCard title="Registered Stores" value="1,248" icon={IoStorefront} trend="↑ 8.3%" trendUp={true} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" sparkColor="#00E676" sparkData={SPARK_DATA_UP} />
        <StatCard title="Pending Verifications" value="18" icon={IoShieldCheckmark} trend="Requires Action" trendUp={false} colorClass="bg-amber-400/10 text-amber-400 border-amber-400/20" sparkColor="#FFC107" sparkData={SPARK_DATA_NEUTRAL} actionLabel="View all pending" />
        <StatCard title="User Feedback" value="2,341" icon={IoChatbubbleEllipses} trend="↑ 15.2%" trendUp={true} colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20" sparkColor="#A855F7" sparkData={SPARK_DATA_UP} />
        <StatCard title="Total Medicines" value="24,850" icon={IoMedkit} trend="↑ 7.8%" trendUp={true} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" sparkColor="#00B0FF" sparkData={SPARK_DATA_UP} />
        <StatCard title="Low Stock Alerts" value="256" icon={IoWarning} trend="Critical" trendUp={false} colorClass="bg-red-500/10 text-red-500 border-red-500/20" sparkColor="#EF4444" sparkData={SPARK_DATA_DOWN} actionLabel="View all alerts" />
      </div>

      {/* ── ROW 2: MAIN GRID (3 COLUMNS) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Col 1: Area-wise Store Monitoring */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">Area-wise Store Monitoring</h3>
            <p className="text-[10px] text-muted-text">Select an area on the map to view registered stores.</p>
          </div>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text text-sm" />
              <input type="text" placeholder="Search area..." className="w-full bg-dark-bg/50 border border-dark-border/60 rounded py-1.5 pl-8 pr-3 text-xs text-white outline-none" />
            </div>
            <select className="bg-dark-bg/50 border border-dark-border/60 rounded px-2 py-1 outline-none text-xs text-white max-w-[120px]">
              <option>Bhopal, MP</option>
            </select>
          </div>

          {/* Map Simulation */}
          <div className="w-full h-48 bg-dark-bg border border-dark-border/60 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center shrink-0">
            {/* Map lines simulation */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            {/* Center Area highlight */}
            <div className="absolute w-24 h-24 rounded-full bg-emerald-green/10 border border-emerald-green/20 animate-pulse flex items-center justify-center">
               <div className="w-8 h-8 rounded-full bg-emerald-green flex items-center justify-center text-dark-bg shadow-[0_0_15px_rgba(0,230,118,0.5)]">
                 <IoStorefront className="text-lg" />
               </div>
            </div>
            <p className="absolute bottom-1/2 translate-y-14 text-xs font-bold text-emerald-green">Bhopal</p>

            {/* Other pins */}
            <IoLocationOutline className="absolute top-1/4 left-1/4 text-emerald-green text-xl opacity-60" />
            <IoLocationOutline className="absolute top-1/3 right-1/4 text-emerald-green text-xl opacity-60" />
            <IoLocationOutline className="absolute bottom-1/4 left-1/3 text-emerald-green text-xl opacity-60" />
            <IoLocationOutline className="absolute bottom-1/3 right-1/3 text-amber-400 text-xl opacity-60" />
          </div>

          <div className="flex justify-between items-center mb-2 shrink-0">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Stores in Selected Area</h4>
            <button className="text-[10px] text-electric-blue hover:underline">View All</button>
          </div>

          <div className="space-y-2 mt-2">
            {AREA_STORES.map((store, i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-muted-text">
                    <IoStorefront className="text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{store.name}</p>
                    <p className="text-[9px] text-muted-text truncate">{store.area}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className={`text-[9px] font-bold ${store.verified ? 'text-emerald-green' : 'text-amber-400'}`}>
                    {store.verified ? 'Verified' : 'Pending'}
                  </span>
                  <span className="text-[10px] text-white flex items-center gap-0.5">
                    {store.rating} <IoStar className="text-amber-400 text-[8px]" /> <span className="text-muted-text">({store.reviews})</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Pending Store Approvals */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Pending Store Approvals</h3>
              <p className="text-[10px] text-emerald-green font-bold">18 Pending</p>
            </div>
            <button className="text-[10px] text-electric-blue hover:underline">View All</button>
          </div>
          
          <div className="space-y-3 mt-2">
            {PENDING_STORES.map((store, i) => (
              <StoreActionRow key={i} store={store} onApprove={handleApprove} onReject={handleReject} />
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-dark-border/40 text-center shrink-0">
            <button className="text-[10px] text-muted-text hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
              View All Pending Stores →
            </button>
          </div>
        </div>

        {/* Col 3: Recent User Feedback */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Recent User Feedback</h3>
            <button className="text-[10px] text-electric-blue hover:underline">View All</button>
          </div>
          
          <div className="space-y-3 mt-2">
            {RECENT_FEEDBACK.map((fb, i) => (
              <FeedbackCard key={i} feedback={fb} />
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-dark-border/40 text-center shrink-0">
            <button className="text-[10px] text-muted-text hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
              View All Feedback →
            </button>
          </div>
        </div>

      </div>

      {/* ── ROW 3: BOTTOM QUICK INFO ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
        <div className="glass-panel p-4 rounded-xl border border-dark-border/40 flex items-center gap-4 group hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
            <IoMedalOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] text-muted-text mb-0.5">Top Performing Store</p>
            <h4 className="text-sm font-bold text-white">Good Health</h4>
            <p className="text-[10px] text-muted-text flex items-center gap-1"><span className="text-white">4.6 <IoStar className="inline text-amber-400 mb-0.5"/></span> (128 reviews)</p>
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-xl border border-dark-border/40 flex items-center gap-4 group hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-electric-blue/10 text-electric-blue border border-electric-blue/20 flex items-center justify-center shrink-0">
            <IoLocationOutline className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] text-muted-text mb-0.5">Most Registered Area</p>
            <h4 className="text-sm font-bold text-white">Bhopal, MP</h4>
            <p className="text-[10px] text-muted-text"><span className="text-white">248 Stores</span> Registered</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-dark-border/40 flex items-center gap-4 group hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <IoChatboxOutline className="text-2xl" />
          </div>
          <div className="w-full">
            <p className="text-[10px] text-muted-text mb-0.5">Total Feedback This Week</p>
            <h4 className="text-lg font-bold text-white">2,341</h4>
            <SparkLine data={SPARK_DATA_UP} color="#A855F7" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-dark-border/40 flex items-center gap-4 group hover:border-white/10 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-emerald-green/10 text-emerald-green border border-emerald-green/20 flex items-center justify-center shrink-0">
            <IoStorefront className="text-2xl" />
          </div>
          <div className="w-full">
            <p className="text-[10px] text-muted-text mb-0.5">Active Stores</p>
            <h4 className="text-lg font-bold text-white">1,102</h4>
            <SparkLine data={SPARK_DATA_UP} color="#00E676" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
