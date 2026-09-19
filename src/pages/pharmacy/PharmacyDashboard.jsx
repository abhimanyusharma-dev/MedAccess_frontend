import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCartOutline, IoCheckmarkCircle, IoTimeOutline, IoCloseCircleOutline,
  IoCashOutline, IoTrendingUp, IoTrendingDown, IoPeopleOutline,
  IoMedicalOutline, IoWarningOutline, IoBagRemoveOutline, IoStar,
  IoDownloadOutline, IoPrintOutline, IoFilterOutline, IoAddCircleOutline,
  IoRefreshOutline, IoArrowForwardOutline, IoCalendarOutline, IoNotificationsOutline,
  IoAnalyticsOutline, IoHeart, IoEllipsisVertical, IoSearchOutline, IoWalletOutline,
  IoStorefrontOutline, IoDocumentTextOutline, IoBusinessOutline
} from 'react-icons/io5';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const SALES_DATA = [
  { date: '14 May', revenue: 15000, orders: 45 },
  { date: '15 May', revenue: 28000, orders: 82 },
  { date: '16 May', revenue: 32450, orders: 95 },
  { date: '17 May', revenue: 29000, orders: 88 },
  { date: '18 May', revenue: 45000, orders: 120 },
  { date: '19 May', revenue: 52000, orders: 145 },
  { date: '20 May', revenue: 48000, orders: 132 },
];

const RECENT_ORDERS = [
  { id: 'ORD12345', customer: 'John Doe', medicine: 'Paracetamol 650mg', time: '2 mins ago', amount: 285, status: 'Pending' },
  { id: 'ORD12344', customer: 'Sarah Smith', medicine: 'Amoxicillin 500mg', time: '15 mins ago', amount: 645, status: 'Pending' },
  { id: 'ORD12343', customer: 'Mike Johnson', medicine: 'Azithromycin 500mg', time: '30 mins ago', amount: 945, status: 'Confirmed' },
  { id: 'ORD12342', customer: 'Emily Brown', medicine: 'Cetirizine 10mg', time: '45 mins ago', amount: 200, status: 'Processing' },
  { id: 'ORD12341', customer: 'Robert Wilson', medicine: 'Vitamin D3 60K', time: '1 hour ago', amount: 150, status: 'Delivered' },
];

const RECENT_RESERVATIONS = [
  { id: 'RES8839', customer: 'Priya Sharma', pharmacy: 'HealthPlus Pharmacy', time: 'Today, 05:00 PM', amount: 450, status: 'Ready for Pickup' },
  { id: 'RES8838', customer: 'Rahul Mehta', pharmacy: 'HealthPlus Pharmacy', time: 'Today, 06:30 PM', amount: 1200, status: 'Confirmed' },
];

const UPCOMING_PICKUPS = [
  { customer: 'Amit Kumar', time: 'In 30 mins', id: 'RES8837', status: 'Packed' },
  { customer: 'Neha Singh', time: 'In 1 hour', id: 'RES8836', status: 'Packing' },
];

const TOP_SELLING = [
  { name: 'Paracetamol 650mg', sold: '1,245', revenue: '₹24,850', trend: '+12%', category: 'Fever' },
  { name: 'Vitamin C 500mg', sold: '980', revenue: '₹15,600', trend: '+8%', category: 'Vitamins' },
  { name: 'Amoxicillin 500mg', sold: '850', revenue: '₹42,500', trend: '-2%', category: 'Antibiotic' },
  { name: 'Cetirizine 10mg', sold: '720', revenue: '₹7,200', trend: '+15%', category: 'Allergy' },
  { name: 'Dolo 650mg', sold: '690', revenue: '₹20,700', trend: '+5%', category: 'Fever' },
];

const LOW_STOCK = [
  { name: 'Amoxicillin 500mg', left: 18, min: 50 },
  { name: 'Azithromycin 500mg', left: 12, min: 30 },
  { name: 'Pantoprazole 40mg', left: 24, min: 100 },
];

const OUT_OF_STOCK = [
  { name: 'Dolo 650mg', supplier: 'Sun Pharma', expected: 'Tomorrow' },
  { name: 'Cough Syrup (Benadryl)', supplier: 'J&J', expected: '24 May' },
];

const TOP_CUSTOMERS = [
  { name: 'Vikram Singh', orders: 45, spent: '₹12,450', status: 'Platinum' },
  { name: 'Anita Desai', orders: 32, spent: '₹8,900', status: 'Gold' },
  { name: 'Rajesh Kumar', orders: 28, spent: '₹6,750', status: 'Gold' },
];

const REVIEWS = [
  { name: 'Anjali P.', rating: 5, comment: 'Very fast service and original medicines.', order: 'ORD12300' },
  { name: 'Karan M.', rating: 4, comment: 'Good stock availability, but billing took time.', order: 'ORD12295' },
];

const NOTIFICATIONS = [
  { title: 'New Order Received', desc: 'ORD12345 from John Doe', time: '2 mins ago', type: 'order' },
  { title: 'Low Stock Alert', desc: 'Azithromycin is below minimum limit', time: '1 hour ago', type: 'alert' },
  { title: 'Payment Received', desc: '₹1,200 from Rahul Mehta', time: '2 hours ago', type: 'payment' },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

const getStatusBadge = (status) => {
  const s = status.toLowerCase();
  if (s.includes('delivered') || s.includes('picked up')) return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
  if (s.includes('pending')) return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
  if (s.includes('confirmed') || s.includes('processing')) return 'bg-electric-blue/10 text-electric-blue border-electric-blue/20';
  if (s.includes('ready') || s.includes('packed')) return 'bg-neon-green/10 text-neon-green border-neon-green/20';
  if (s.includes('cancelled')) return 'bg-red-500/10 text-red-500 border-red-500/20';
  return 'bg-white/5 text-muted-text border-white/10';
};

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-dark-bg/30 rounded-xl border border-dark-border/40">
    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
      <Icon className="text-2xl text-muted-text" />
    </div>
    <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
    <p className="text-[10px] text-muted-text max-w-[200px]">{desc}</p>
  </div>
);

// ── COMPONENTS ────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="glass-panel rounded-2xl p-5 border border-dark-border/40 relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-${color}-500/5 blur-2xl group-hover:bg-${color}-500/10 transition-all`} />
    <div className="flex justify-between items-start mb-2">
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
        <Icon className={`text-xl text-${color}-500`} />
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'text-emerald-green bg-emerald-green/10' : 'text-red-400 bg-red-400/10'}`}>
          {trend.startsWith('+') ? <IoTrendingUp /> : <IoTrendingDown />} {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-xs text-muted-text mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────

export const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // orders, reservations, pickups
  const [timeFilter, setTimeFilter] = useState('This Week');
  const [search, setSearch] = useState('');

  const handleExport = (type) => {
    toast.success(`Exporting report as ${type}...`, { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' } });
  };

  return (
    <div className="space-y-6 pb-10 text-left font-poppins">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <IoStorefrontOutline className="text-electric-blue" /> Pharmacy Dashboard
          </h2>
          <p className="text-sm text-muted-text mt-1">Overview of store performance, orders, and inventory.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              type="text"
              placeholder="Search orders, medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
            />
          </div>
          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-dark-bg/50 border border-dark-border/60 text-xs text-white cursor-pointer hover:border-white/20">
            <IoCalendarOutline className="text-muted-text" />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option className="bg-dark-bg">Today</option>
              <option className="bg-dark-bg">This Week</option>
              <option className="bg-dark-bg">This Month</option>
              <option className="bg-dark-bg">This Year</option>
            </select>
          </div>
          {/* Exports */}
          <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60 hover:border-white/20" onClick={() => handleExport('PDF')}>
            <IoDownloadOutline className="mr-1.5" /> Export PDF
          </Button>
          <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60 hover:border-white/20" onClick={() => handleExport('Excel')}>
            <IoPrintOutline className="mr-1.5" /> Print
          </Button>
        </div>
      </div>

      {/* ── ROW 1: STATS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard title="Total Orders" value="320" icon={IoCartOutline} trend="+12%" color="blue" />
        <StatCard title="Pending Orders" value="45" icon={IoTimeOutline} trend="+8%" color="amber" />
        <StatCard title="Completed Orders" value="275" icon={IoCheckmarkCircle} trend="+15%" color="emerald" />
        <StatCard title="Total Revenue" value="₹2,45,680" icon={IoCashOutline} trend="+18%" color="emerald" />
        <StatCard title="Total Customers" value="1,204" icon={IoPeopleOutline} trend="+5%" color="blue" />
        <StatCard title="Total Medicines" value="4,500" icon={IoMedicalOutline} color="emerald" />
        
        {/* Additional smaller metrics row hidden on very small screens */}
        <div className="col-span-2 md:col-span-4 lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          <div className="glass-panel p-3 rounded-xl border border-dark-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-text">Today's Revenue</span>
            <span className="text-sm font-bold text-white">₹12,450</span>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-dark-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-text">Active Reservations</span>
            <span className="text-sm font-bold text-electric-blue">24</span>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
            <span className="text-xs text-red-400">Low Stock</span>
            <span className="text-sm font-bold text-red-400 flex items-center gap-1"><IoWarningOutline /> 18</span>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
            <span className="text-xs text-red-400">Out of Stock</span>
            <span className="text-sm font-bold text-red-400 flex items-center gap-1"><IoBagRemoveOutline /> 5</span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: ANALYTICS & INSIGHTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Chart */}
        <div className="lg:col-span-8 glass-panel rounded-2xl border border-dark-border/40 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Sales Overview</h3>
              <p className="text-xs text-muted-text mt-0.5">Revenue & Order trends over {timeFilter.toLowerCase()}</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-electric-blue"><span className="w-2 h-2 rounded-full bg-electric-blue" /> Revenue</span>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00B0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ background: '#0B1728', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#FFF' }}
                  itemStyle={{ color: '#00B0FF' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00B0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: AI Insights & Revenue Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Insights */}
          <div className="glass-panel rounded-2xl border border-electric-blue/30 bg-electric-blue/5 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-electric-blue/10 blur-3xl pointer-events-none" />
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <IoAnalyticsOutline className="text-electric-blue text-lg" /> AI Business Insights
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-dark-bg/40 rounded-xl border border-dark-border/40">
                <p className="text-[10px] text-muted-text uppercase tracking-wider mb-1">Peak Sales Time</p>
                <p className="text-xs text-white font-semibold">05:00 PM - 08:00 PM</p>
              </div>
              <div className="p-3 bg-dark-bg/40 rounded-xl border border-dark-border/40">
                <p className="text-[10px] text-muted-text uppercase tracking-wider mb-1">Revenue Forecast</p>
                <p className="text-xs text-emerald-green font-semibold">Expected +12% growth next week</p>
              </div>
              <div className="p-3 bg-dark-bg/40 rounded-xl border border-dark-border/40">
                <p className="text-[10px] text-muted-text uppercase tracking-wider mb-1">Inventory Recommendation</p>
                <p className="text-xs text-white">Stock up on <span className="font-bold text-amber-400">Allergy</span> meds. Demand rising.</p>
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Revenue Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                <span className="text-xs text-muted-text">Gross Earnings</span>
                <span className="text-sm font-bold text-white">₹3,15,400</span>
              </div>
              <div className="flex justify-between items-center border-b border-dark-border/40 pb-2">
                <span className="text-xs text-muted-text">Expenses</span>
                <span className="text-sm font-bold text-red-400">- ₹85,200</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-white">Net Profit</span>
                <span className="text-lg font-black text-emerald-green">₹2,30,200</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── ROW 3: ORDERS & NOTIFICATIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Orders Tabbed Section */}
        <div className="lg:col-span-8 glass-panel rounded-2xl border border-dark-border/40 overflow-hidden flex flex-col">
          <div className="flex items-center gap-6 px-5 py-3 border-b border-dark-border/40 bg-dark-bg/30">
            <button 
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-electric-blue text-white' : 'border-transparent text-muted-text hover:text-white'}`}
              onClick={() => setActiveTab('orders')}
            >
              Recent Orders
            </button>
            <button 
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'reservations' ? 'border-electric-blue text-white' : 'border-transparent text-muted-text hover:text-white'}`}
              onClick={() => setActiveTab('reservations')}
            >
              Recent Reservations
            </button>
            <button 
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'pickups' ? 'border-electric-blue text-white' : 'border-transparent text-muted-text hover:text-white'}`}
              onClick={() => setActiveTab('pickups')}
            >
              Upcoming Pickups
            </button>
            <div className="flex-1" />
            <button className="text-xs text-electric-blue hover:underline font-semibold flex items-center gap-1">
              View All <IoArrowForwardOutline />
            </button>
          </div>

          <div className="p-0 overflow-x-auto">
            {activeTab === 'orders' && (
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-dark-bg/60 text-muted-text uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Medicine</th>
                    <th className="p-4 font-semibold">Time</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40">
                  {RECENT_ORDERS.length > 0 ? RECENT_ORDERS.map((order, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{order.id}</td>
                      <td className="p-4 text-white">{order.customer}</td>
                      <td className="p-4 text-muted-text">{order.medicine}</td>
                      <td className="p-4 text-muted-text">{order.time}</td>
                      <td className="p-4 font-bold text-white">₹{order.amount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-muted-text hover:text-white bg-dark-bg/50 border border-dark-border/60 rounded" title="View Details">
                          <IoDocumentTextOutline />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7"><EmptyState icon={IoCartOutline} title="No Recent Orders" desc="New orders will appear here automatically." /></td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'reservations' && (
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-dark-bg/60 text-muted-text uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 font-semibold">Res ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Pickup Time</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40">
                  {RECENT_RESERVATIONS.length > 0 ? RECENT_RESERVATIONS.map((res, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{res.id}</td>
                      <td className="p-4 text-white">{res.customer}</td>
                      <td className="p-4 text-muted-text flex items-center gap-1.5"><IoTimeOutline /> {res.time}</td>
                      <td className="p-4 font-bold text-white">₹{res.amount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(res.status)}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 text-[10px] font-bold bg-emerald-green/10 text-emerald-green border border-emerald-green/20 rounded hover:bg-emerald-green hover:text-dark-bg transition-colors">
                          Accept
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6"><EmptyState icon={IoTimeOutline} title="No Reservations" desc="No active reservations right now." /></td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'pickups' && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {UPCOMING_PICKUPS.length > 0 ? UPCOMING_PICKUPS.map((pickup, i) => (
                  <div key={i} className="p-4 rounded-xl border border-electric-blue/30 bg-electric-blue/5 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{pickup.customer}</p>
                      <p className="text-[10px] text-muted-text font-mono mt-0.5">{pickup.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-electric-blue">{pickup.time}</p>
                      <p className="text-[10px] text-muted-text">{pickup.status}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full"><EmptyState icon={IoBagRemoveOutline} title="No Pickups" desc="No upcoming pickups scheduled." /></div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="flex flex-col items-center justify-center py-4 border-dark-border/40 hover:border-electric-blue/40 hover:text-electric-blue gap-2 h-auto text-xs">
                <IoAddCircleOutline className="text-xl" /> Add Medicine
              </Button>
              <Button variant="secondary" className="flex flex-col items-center justify-center py-4 border-dark-border/40 hover:border-emerald-green/40 hover:text-emerald-green gap-2 h-auto text-xs">
                <IoRefreshOutline className="text-xl" /> Update Stock
              </Button>
              <Button variant="secondary" className="flex flex-col items-center justify-center py-4 border-dark-border/40 hover:text-white gap-2 h-auto text-xs">
                <IoDocumentTextOutline className="text-xl" /> Generate Report
              </Button>
              <Button variant="secondary" className="flex flex-col items-center justify-center py-4 border-dark-border/40 hover:text-white gap-2 h-auto text-xs">
                <IoPrintOutline className="text-xl" /> Print Invoices
              </Button>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-5 h-[240px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <IoNotificationsOutline className="text-electric-blue" /> Notifications
              </h3>
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">3 New</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-2">
              {NOTIFICATIONS.length > 0 ? NOTIFICATIONS.map((notif, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-dark-border/40 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'order' ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20' :
                    notif.type === 'alert' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-emerald-green/10 text-emerald-green border border-emerald-green/20'
                  }`}>
                    {notif.type === 'order' ? <IoCartOutline size={14} /> : notif.type === 'alert' ? <IoWarningOutline size={14} /> : <IoCashOutline size={14} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{notif.title}</p>
                    <p className="text-[10px] text-muted-text mt-0.5 leading-snug">{notif.desc}</p>
                    <p className="text-[9px] text-muted-text/70 mt-1">{notif.time}</p>
                  </div>
                </div>
              )) : (
                <EmptyState icon={IoNotificationsOutline} title="All Caught Up!" desc="No new notifications." />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── ROW 4: INVENTORY & STOCK ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Selling Medicines */}
        <div className="lg:col-span-6 glass-panel rounded-2xl border border-dark-border/40 overflow-hidden flex flex-col h-[350px]">
          <div className="flex items-center justify-between p-5 border-b border-dark-border/40 bg-dark-bg/30">
            <h3 className="text-base font-bold text-white">Top Selling Medicines</h3>
            <button className="text-xs text-electric-blue hover:underline font-semibold">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {TOP_SELLING.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-bg/60 text-muted-text uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 pl-5 font-semibold">Medicine Name</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold text-right">Units Sold</th>
                    <th className="p-3 pr-5 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40">
                  {TOP_SELLING.map((med, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-5 font-semibold text-white">{med.name}</td>
                      <td className="p-3 text-muted-text">{med.category}</td>
                      <td className="p-3 text-right text-white">{med.sold}</td>
                      <td className="p-3 pr-5 text-right font-bold text-emerald-green">
                        {med.revenue}
                        <span className={`block text-[9px] font-normal mt-0.5 ${med.trend.startsWith('+') ? 'text-emerald-green' : 'text-red-400'}`}>
                          {med.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon={IoMedicalOutline} title="No Data" desc="Not enough sales data to determine top sellers yet." />
            )}
          </div>
        </div>

        {/* Stock Alerts (Low & Out) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl border border-dark-border/40 flex flex-col h-[350px] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-dark-border/40 bg-dark-bg/30">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <IoWarningOutline className="text-amber-400" /> Stock Alerts
            </h3>
            <button className="text-xs text-electric-blue hover:underline font-semibold">Inventory</button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Out of stock */}
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <IoCloseCircleOutline /> Out of Stock ({OUT_OF_STOCK.length})
              </h4>
              <div className="space-y-3">
                {OUT_OF_STOCK.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-red-300 mt-0.5">Supplier: {item.supplier} · Expected: {item.expected}</p>
                    </div>
                    <Button variant="primary" className="py-1.5 px-3 text-[10px] font-bold bg-red-500 border border-red-400 text-white hover:bg-red-600">
                      Order Stock
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <IoWarningOutline /> Low Stock ({LOW_STOCK.length})
              </h4>
              <div className="space-y-3">
                {LOW_STOCK.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl border border-amber-400/30 bg-amber-400/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border/60">
                          <div className="h-full bg-amber-400" style={{ width: `${(item.left / item.min) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-amber-300">Left: {item.left} (Min: {item.min})</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="py-1.5 px-3 text-[10px] border-amber-400/40 text-amber-400 hover:bg-amber-400/10">
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* ── ROW 5: CUSTOMERS & PERFORMANCE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Customers */}
        <div className="lg:col-span-6 glass-panel rounded-2xl border border-dark-border/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <IoPeopleOutline className="text-electric-blue" /> Top Customers
            </h3>
            <button className="text-xs text-electric-blue hover:underline font-semibold">View All</button>
          </div>
          <div className="space-y-3">
            {TOP_CUSTOMERS.length > 0 ? TOP_CUSTOMERS.map((cust, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-dark-border/40 bg-dark-bg/30 hover:border-electric-blue/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center text-electric-blue font-bold">
                    {cust.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{cust.name}</p>
                    <p className="text-[10px] text-muted-text">{cust.orders} Total Orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-green">{cust.spent}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded border ${cust.status === 'Platinum' ? 'bg-slate-300/10 text-slate-300 border-slate-300/30' : 'bg-amber-400/10 text-amber-400 border-amber-400/30'}`}>
                    {cust.status} Member
                  </span>
                </div>
              </div>
            )) : (
              <EmptyState icon={IoPeopleOutline} title="No Customers" desc="Customer data will populate here." />
            )}
          </div>
        </div>

        {/* Store Performance & Reviews */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 text-center">
              <IoStar className="text-amber-400 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-black text-white">4.8</p>
              <p className="text-[10px] text-muted-text uppercase tracking-wider">Avg Rating</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 text-center">
              <IoCheckmarkCircle className="text-emerald-green text-2xl mx-auto mb-2" />
              <p className="text-2xl font-black text-white">98%</p>
              <p className="text-[10px] text-muted-text uppercase tracking-wider">Order Success</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 text-center">
              <IoWalletOutline className="text-electric-blue text-2xl mx-auto mb-2" />
              <p className="text-2xl font-black text-white">85%</p>
              <p className="text-[10px] text-muted-text uppercase tracking-wider">Online Paid</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Recent Reviews</h3>
            <div className="space-y-4">
              {REVIEWS.map((review, i) => (
                <div key={i} className="pb-4 border-b border-dark-border/40 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-white">{review.name}</p>
                    <div className="flex text-amber-400 text-[10px]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <IoStar key={idx} className={idx < review.rating ? 'opacity-100' : 'opacity-30'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-text italic leading-relaxed">"{review.comment}"</p>
                  <p className="text-[9px] text-dark-border/80 mt-1 font-mono">Ref: {review.order}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PharmacyDashboard;
