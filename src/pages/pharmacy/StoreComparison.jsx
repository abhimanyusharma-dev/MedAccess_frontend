import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoMedalOutline, IoStorefrontOutline, IoTrophyOutline, IoStatsChartOutline,
  IoLocationOutline, IoCalendarOutline, IoFilterOutline, IoChevronBack,
  IoChevronForward, IoStar, IoClose, IoBulbOutline, IoArrowForwardOutline
} from 'react-icons/io5';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { Button } from '../../components/ui/Button';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_STORES = [
  {
    id: 'str_1',
    name: 'HealthPlus Pharmacy',
    isUser: false,
    verified: true,
    overallScore: 95,
    stockAvailability: 98,
    pricing: 91,
    timelyResponse: 96,
    prescriptionMatch: 94,
    rating: 4.7,
    reviews: 128,
    metrics: [
      { subject: 'Stock Availability', userScore: 94, compScore: 98 },
      { subject: 'Pricing (Competitive)', userScore: 93, compScore: 91 },
      { subject: 'Timely Response', userScore: 93, compScore: 96 },
      { subject: 'Match Rate', userScore: 92, compScore: 94 },
      { subject: 'Feedback', userScore: 92, compScore: 94 },
    ]
  },
  {
    id: 'str_me',
    name: 'Good Health Pharmacy',
    isUser: true,
    verified: true,
    overallScore: 92,
    stockAvailability: 94,
    pricing: 93,
    timelyResponse: 93,
    prescriptionMatch: 92,
    rating: 4.6,
    reviews: 112,
    // Metrics handled dynamically below
  },
  {
    id: 'str_3',
    name: 'CareMed Pharmacy',
    isUser: false,
    verified: true,
    overallScore: 89,
    stockAvailability: 91,
    pricing: 88,
    timelyResponse: 90,
    prescriptionMatch: 89,
    rating: 4.4,
    reviews: 98,
    metrics: [
      { subject: 'Stock Availability', userScore: 94, compScore: 91 },
      { subject: 'Pricing (Competitive)', userScore: 93, compScore: 88 },
      { subject: 'Timely Response', userScore: 93, compScore: 90 },
      { subject: 'Match Rate', userScore: 92, compScore: 89 },
      { subject: 'Feedback', userScore: 92, compScore: 88 },
    ]
  },
  {
    id: 'str_4',
    name: 'MediSave Pharmacy',
    isUser: false,
    verified: false,
    overallScore: 85,
    stockAvailability: 87,
    pricing: 84,
    timelyResponse: 88,
    prescriptionMatch: 86,
    rating: 4.3,
    reviews: 76,
    metrics: [
      { subject: 'Stock Availability', userScore: 94, compScore: 87 },
      { subject: 'Pricing (Competitive)', userScore: 93, compScore: 84 },
      { subject: 'Timely Response', userScore: 93, compScore: 88 },
      { subject: 'Match Rate', userScore: 92, compScore: 86 },
      { subject: 'Feedback', userScore: 92, compScore: 86 },
    ]
  },
  {
    id: 'str_5',
    name: 'WellCare Pharmacy',
    isUser: false,
    verified: true,
    overallScore: 81,
    stockAvailability: 82,
    pricing: 85,
    timelyResponse: 78,
    prescriptionMatch: 83,
    rating: 4.2,
    reviews: 64,
    metrics: [
      { subject: 'Stock Availability', userScore: 94, compScore: 82 },
      { subject: 'Pricing (Competitive)', userScore: 93, compScore: 85 },
      { subject: 'Timely Response', userScore: 93, compScore: 78 },
      { subject: 'Match Rate', userScore: 92, compScore: 83 },
      { subject: 'Feedback', userScore: 92, compScore: 84 },
    ]
  },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

const getScoreColor = (score) => {
  if (score >= 90) return 'emerald-green';
  if (score >= 80) return 'electric-blue';
  if (score >= 70) return 'amber-400';
  return 'red-400';
};

const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Average';
  return 'Poor';
};

// ── COMPONENTS ────────────────────────────────────────────────────────────

const MetricBar = ({ value, label }) => {
  const color = getScoreColor(value);
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-dark-bg border border-dark-border/60 rounded-full overflow-hidden">
        <div className={`h-full bg-${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <p className={`text-[9px] mt-1 font-bold text-${color}`}>{label}</p>
    </div>
  );
};

const ComparisonProgressBar = ({ title, userScore, compScore }) => {
  const userColor = getScoreColor(userScore);
  const compColor = getScoreColor(compScore);
  
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-white">{title}</span>
        <span className="text-xs text-white font-mono">{compScore}%</span>
      </div>
      <div className="relative h-2 w-full bg-dark-bg border border-dark-border/60 rounded-full overflow-hidden mb-1">
         {/* Background competitor bar */}
         <div className={`absolute top-0 left-0 h-full bg-${compColor}/40`} style={{ width: `${compScore}%` }} />
         {/* Foreground user bar (thinner, centered) */}
         <div className={`absolute top-[2px] left-0 h-1 bg-emerald-green rounded-full shadow-[0_0_8px_rgba(0,230,118,0.8)]`} style={{ width: `${userScore}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted-text">
        <span>You: {userScore}%</span>
        <span>Competitor</span>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const StoreComparison = () => {
  const [stores] = useState(MOCK_STORES);
  const [selectedStore, setSelectedStore] = useState(MOCK_STORES[0]);
  const userStore = MOCK_STORES.find(s => s.isUser);
  const [activeTab, setActiveTab] = useState('overall');

  const openDetails = (store) => {
    if (store.isUser) return; // Don't compare with self
    setSelectedStore(store);
  };

  return (
    <div className="relative h-full flex flex-col space-y-6 text-left font-poppins pb-10">
      
      {/* ── HEADER ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Store Comparison</h2>
        <p className="text-sm text-muted-text">Compare your store performance with all pharmacies in your area.</p>
      </div>

      {/* ── TABS & FILTERS ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
          {['Overall Ranking', 'Stock Availability', 'Pricing', 'Timely Response', 'Prescription Match', 'User Feedback'].map(tab => {
            const val = tab.split(' ')[0].toLowerCase();
            return (
              <button 
                key={val}
                onClick={() => setActiveTab(val)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                  activeTab === val 
                  ? 'bg-emerald-green/10 text-emerald-green border-emerald-green/30' 
                  : 'bg-dark-bg/50 text-muted-text border-dark-border/40 hover:text-white hover:border-white/20'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-dark-bg/50 border border-dark-border/60 text-xs text-white">
            <IoLocationOutline className="text-muted-text" /> Within 10 KM
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-dark-bg/50 border border-dark-border/60 text-xs text-white">
            <IoCalendarOutline className="text-muted-text" /> 14 May - 20 May
          </div>
          <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60 hover:border-white/20">
            <IoFilterOutline className="mr-1.5" /> Filters
          </Button>
        </div>
      </div>

      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-dark-border/40 flex flex-col justify-between">
          <p className="text-xs text-muted-text mb-2">Total Stores</p>
          <div>
            <h3 className="text-3xl font-black text-white">18</h3>
            <p className="text-[10px] text-muted-text mt-1">In your area</p>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-border/40 flex flex-col justify-between">
          <p className="text-xs text-muted-text mb-2">Your Rank</p>
          <div>
            <h3 className="text-3xl font-black text-emerald-green">#2</h3>
            <p className="text-[10px] text-muted-text mt-1">Out of 18 stores</p>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-border/40 flex flex-col justify-between">
          <p className="text-xs text-muted-text mb-2">Your Score</p>
          <div>
            <h3 className="text-3xl font-black text-white">92 <span className="text-sm text-muted-text font-normal">/100</span></h3>
            <p className="text-[10px] font-bold text-emerald-green mt-1">Excellent</p>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-border/40 flex flex-col justify-between">
          <p className="text-xs text-muted-text mb-2">Top Performer</p>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5"><IoTrophyOutline className="text-amber-400" /> HealthPlus</h3>
            <p className="text-[10px] text-muted-text mt-1">Score: 95 /100</p>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT (DUAL PANE) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Ranking Table */}
        <div className="xl:col-span-8 flex flex-col glass-panel rounded-2xl border border-dark-border/40 overflow-hidden">
          <div className="p-4 border-b border-dark-border/40 bg-dark-bg/30">
            <h3 className="text-sm font-bold text-white">All Stores in Your Area</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-dark-bg/60 text-muted-text uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 font-semibold text-center w-12">Rank</th>
                  <th className="p-4 font-semibold">Store Name</th>
                  <th className="p-4 font-semibold">Overall Score</th>
                  <th className="p-4 font-semibold">Stock Avail.</th>
                  <th className="p-4 font-semibold">Pricing</th>
                  <th className="p-4 font-semibold">Response</th>
                  <th className="p-4 font-semibold">Match</th>
                  <th className="p-4 font-semibold">Feedback</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40">
                {stores.map((store, i) => (
                  <tr key={i} className={`transition-colors ${store.isUser ? 'bg-emerald-green/5 border-emerald-green/20' : 'hover:bg-white/5'}`}>
                    <td className="p-4 text-center font-black text-lg">
                      {i === 0 ? <IoMedalOutline className="mx-auto text-amber-400 text-2xl" /> : i + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${store.isUser ? 'bg-emerald-green text-dark-bg' : 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20'}`}>
                          {store.isUser ? <IoStorefrontOutline /> : <IoStorefrontOutline />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {store.name} {store.isUser && <span className="text-[9px] bg-emerald-green/20 text-emerald-green px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>}
                          </p>
                          <p className="text-[9px] text-muted-text mt-0.5">{i === 0 ? 'Top Performer' : store.verified ? 'Verified Store' : 'Unverified'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold text-${getScoreColor(store.overallScore)}`}>{store.overallScore}</span>
                        <div className="w-16 h-1 bg-dark-bg rounded-full overflow-hidden border border-dark-border/40">
                          <div className={`h-full bg-${getScoreColor(store.overallScore)}`} style={{ width: `${store.overallScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><MetricBar value={store.stockAvailability} label={getScoreLabel(store.stockAvailability)} /></td>
                    <td className="p-4"><MetricBar value={store.pricing} label={getScoreLabel(store.pricing)} /></td>
                    <td className="p-4"><MetricBar value={store.timelyResponse} label={getScoreLabel(store.timelyResponse)} /></td>
                    <td className="p-4"><MetricBar value={store.prescriptionMatch} label={getScoreLabel(store.prescriptionMatch)} /></td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-white flex items-center gap-1">{store.rating} <IoStar className="text-amber-400 text-[10px]" /></p>
                      <p className="text-[9px] text-muted-text">({store.reviews})</p>
                    </td>
                    <td className="p-4 text-right">
                      {!store.isUser && (
                        <Button variant="secondary" className="px-3 py-1.5 text-[10px] border-dark-border/60 hover:text-white" onClick={() => openDetails(store)}>
                          Compare
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-dark-border/40 bg-dark-bg/30 flex items-center justify-between text-[11px] text-muted-text">
            <p>Showing 1 to 5 of 18 stores</p>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronBack /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded bg-electric-blue/20 text-electric-blue font-bold border border-electric-blue/30">1</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">2</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">3</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronForward /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison Details Panel */}
        <div className="xl:col-span-4 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedStore && (
              <motion.div 
                key={selectedStore.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel rounded-2xl border border-dark-border/40 p-6 flex-1 flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white">Head-to-Head</h3>
                  <button className="text-muted-text hover:text-white" onClick={() => setSelectedStore(null)}><IoClose /></button>
                </div>

                {/* Versus Header */}
                <div className="flex items-center justify-between bg-dark-bg/40 p-4 rounded-xl border border-dark-border/40 mb-6">
                  <div className="text-center w-2/5">
                    <div className="w-10 h-10 mx-auto rounded bg-emerald-green text-dark-bg flex items-center justify-center font-bold mb-2 shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                      <IoStorefrontOutline />
                    </div>
                    <p className="text-[10px] font-bold text-white leading-tight">Good Health</p>
                    <p className="text-[9px] text-emerald-green font-bold">You</p>
                  </div>
                  <div className="text-xs font-black text-muted-text italic">VS</div>
                  <div className="text-center w-2/5">
                    <div className="w-10 h-10 mx-auto rounded bg-electric-blue/10 text-electric-blue border border-electric-blue/30 flex items-center justify-center font-bold mb-2">
                      <IoStorefrontOutline />
                    </div>
                    <p className="text-[10px] font-bold text-white leading-tight">{selectedStore.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-muted-text">Competitor</p>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="mb-6">
                  <h4 className="text-[11px] uppercase tracking-wider text-muted-text font-bold mb-2">Performance Radar</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selectedStore.metrics}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#0B1728', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF' }} />
                        <Radar name="You" dataKey="userScore" stroke="#00E676" fill="#00E676" fillOpacity={0.3} />
                        <Radar name={selectedStore.name} dataKey="compScore" stroke="#00B0FF" fill="#00B0FF" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 text-[9px] mt-2">
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-green"/> You</span>
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-electric-blue"/> {selectedStore.name.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="mb-6 space-y-4">
                  <h4 className="text-[11px] uppercase tracking-wider text-muted-text font-bold mb-2">Metric Breakdown</h4>
                  {selectedStore.metrics.map(metric => (
                    <ComparisonProgressBar 
                      key={metric.subject}
                      title={metric.subject}
                      userScore={metric.userScore}
                      compScore={metric.compScore}
                    />
                  ))}
                </div>

                {/* AI Improvement Suggestions */}
                <div className="mt-auto p-4 rounded-xl border border-electric-blue/30 bg-electric-blue/5">
                  <h4 className="text-[10px] uppercase tracking-wider text-electric-blue font-bold mb-2 flex items-center gap-1.5">
                    <IoBulbOutline /> What You Can Improve
                  </h4>
                  <ul className="text-[10px] text-white space-y-2">
                    {selectedStore.metrics.find(m => m.compScore > m.userScore) ? (
                      selectedStore.metrics.filter(m => m.compScore > m.userScore).slice(0, 2).map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <IoArrowForwardOutline className="text-electric-blue shrink-0 mt-0.5" />
                          <span>Improve your <span className="font-bold">{m.subject}</span>. {selectedStore.name.split(' ')[0]} is outperforming you here.</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-1.5 text-emerald-green">
                        <IoCheckmarkCircleOutline className="text-xl shrink-0" />
                        <span>You are outperforming this competitor across all metrics. Keep up the good work!</span>
                      </li>
                    )}
                  </ul>
                  <button className="text-[10px] text-electric-blue hover:underline font-bold mt-3 block w-full text-center">View Action Plan</button>
                </div>

              </motion.div>
            )}
            
            {!selectedStore && (
              <div className="glass-panel rounded-2xl border border-dark-border/40 p-6 flex-1 flex flex-col items-center justify-center text-center">
                <IoStatsChartOutline className="text-4xl text-muted-text/30 mb-3" />
                <p className="text-sm font-bold text-white mb-1">No Store Selected</p>
                <p className="text-[10px] text-muted-text max-w-[200px]">Click 'Compare' on a store from the list to see a head-to-head analysis.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default StoreComparison;
