import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  IoTrendingUpOutline, IoStorefrontOutline, IoPeopleOutline, IoMedkitOutline,
  IoCardOutline, IoStarOutline, IoSparklesOutline, IoDownloadOutline,
  IoCalendarOutline, IoFilterOutline, IoPrintOutline, IoDocumentTextOutline,
  IoBarChartOutline, IoAlertCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline
} from 'react-icons/io5';

// ── THEME COLORS ──────────────────────────────────────────────────────────
const C = {
  green: '#00E676', blue: '#00B0FF', purple: '#A855F7',
  amber: '#FFC107', red: '#EF4444', teal: '#14B8A6',
  indigo: '#6366F1', pink: '#EC4899', bg: '#0B1728', border: 'rgba(255,255,255,0.06)'
};

const CHART_TOOLTIP = {
  contentStyle: { background: '#0B1728', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 10, color: '#FFF', fontSize: 11 }
};

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MONTHLY_SALES = [
  { month: 'Jan', sales: 42000, orders: 840, users: 1200, revenue: 210000 },
  { month: 'Feb', sales: 51000, orders: 1020, users: 1380, revenue: 255000 },
  { month: 'Mar', sales: 48000, orders: 960, users: 1500, revenue: 240000 },
  { month: 'Apr', sales: 63000, orders: 1260, users: 1820, revenue: 315000 },
  { month: 'May', sales: 75000, orders: 1500, users: 2100, revenue: 375000 },
  { month: 'Jun', sales: 82000, orders: 1640, users: 2450, revenue: 410000 },
  { month: 'Jul', sales: 91000, orders: 1820, users: 2800, revenue: 455000 },
];

const TOP_MEDICINES = [
  { name: 'Paracetamol 500mg', units: 12400, revenue: 62000 },
  { name: 'Azithromycin 500mg', units: 8900, revenue: 89000 },
  { name: 'Metformin 500mg', units: 7800, revenue: 54600 },
  { name: 'Vitamin C 1000mg', units: 6500, revenue: 32500 },
  { name: 'Omeprazole 20mg', units: 5900, revenue: 47200 },
  { name: 'Lisinopril 10mg', units: 4800, revenue: 57600 },
  { name: 'Atorvastatin 20mg', units: 4200, revenue: 63000 },
];

const MEDICINE_PREF = [
  { name: 'Antibiotics', value: 28 }, { name: 'Painkillers', value: 22 },
  { name: 'Vitamins', value: 18 }, { name: 'Diabetes', value: 16 },
  { name: 'Cardiac', value: 10 }, { name: 'Others', value: 6 },
];

const TOP_STORES = [
  { name: 'Good Health Pharmacy', orders: 1240, rating: 4.8, revenue: 420000, trust: 96 },
  { name: 'MediLife Store', orders: 980, rating: 4.5, revenue: 310000, trust: 89 },
  { name: 'CareMed Pharmacy', orders: 830, rating: 4.3, revenue: 250000, trust: 82 },
  { name: 'HealthPlus Store', orders: 720, rating: 4.1, revenue: 198000, trust: 74 },
  { name: 'LifeCare Pharmacy', orders: 610, rating: 3.9, revenue: 172000, trust: 68 },
];

const INVENTORY_DATA = [
  { category: 'Antibiotics', available: 1240, low: 180, critical: 45, outOfStock: 12 },
  { category: 'Painkillers', available: 2100, low: 220, critical: 30, outOfStock: 5 },
  { category: 'Vitamins', available: 980, low: 140, critical: 60, outOfStock: 18 },
  { category: 'Diabetes', available: 560, low: 95, critical: 40, outOfStock: 8 },
  { category: 'Cardiac', available: 420, low: 110, critical: 55, outOfStock: 22 },
];

const FEEDBACK_DIST = [
  { name: 'Positive', value: 68 }, { name: 'Neutral', value: 22 }, { name: 'Negative', value: 10 },
];

const AREA_SALES = [
  { area: 'Kolar Road', orders: 420, revenue: 168000 },
  { area: 'MP Nagar', orders: 380, revenue: 152000 },
  { area: 'Vijay Nagar', orders: 310, revenue: 124000 },
  { area: 'Arera Colony', orders: 280, revenue: 112000 },
  { area: 'Bairagarh', orders: 240, revenue: 96000 },
  { area: 'Shahpura', orders: 190, revenue: 76000 },
];

const USER_ACTIVITY = [
  { day: 'Mon', active: 3420, searches: 8200, prescriptions: 420, orders: 680 },
  { day: 'Tue', active: 3800, searches: 9100, prescriptions: 510, orders: 740 },
  { day: 'Wed', active: 4100, searches: 9800, prescriptions: 580, orders: 820 },
  { day: 'Thu', active: 3900, searches: 8900, prescriptions: 490, orders: 760 },
  { day: 'Fri', active: 4500, searches: 10200, prescriptions: 640, orders: 910 },
  { day: 'Sat', active: 5200, searches: 11800, prescriptions: 720, orders: 1020 },
  { day: 'Sun', active: 4800, searches: 10800, prescriptions: 680, orders: 980 },
];

const STORE_RADAR = [
  { subject: 'Rating', A: 92, B: 74, fullMark: 100 },
  { subject: 'Orders', A: 88, B: 65, fullMark: 100 },
  { subject: 'Availability', A: 95, B: 58, fullMark: 100 },
  { subject: 'Delivery', A: 84, B: 72, fullMark: 100 },
  { subject: 'Satisfaction', A: 90, B: 61, fullMark: 100 },
];

const PIE_COLORS = [C.green, C.blue, C.amber, C.purple, C.teal, C.red];

const AI_INSIGHTS = [
  { icon: IoMedkitOutline, label: 'Best Selling Medicine', value: 'Paracetamol 500mg', color: 'text-emerald-green' },
  { icon: IoTrendingUpOutline, label: 'Fastest Growing Store', value: 'Good Health Pharmacy', color: 'text-electric-blue' },
  { icon: IoWarningOutline, label: 'Lowest Performing Store', value: 'LifeCare Pharmacy', color: 'text-red-400' },
  { icon: IoStarOutline, label: 'Highest Rated Pharmacy', value: 'Good Health (4.8 ★)', color: 'text-amber-400' },
  { icon: IoAlertCircleOutline, label: 'Lowest Rated Pharmacy', value: 'LifeCare (3.2 ★)', color: 'text-red-400' },
  { icon: IoStorefrontOutline, label: 'Area Max Sales', value: 'Kolar Road, Bhopal', color: 'text-emerald-green' },
  { icon: IoStorefrontOutline, label: 'Area Lowest Sales', value: 'Awadhpuri, Bhopal', color: 'text-red-400' },
  { icon: IoPeopleOutline, label: 'Area Max Users', value: 'MP Nagar, Bhopal', color: 'text-electric-blue' },
  { icon: IoCheckmarkCircleOutline, label: 'Highest Store Density', value: 'Kolar Road (42 stores)', color: 'text-purple-400' },
  { icon: IoSparklesOutline, label: 'Predicted Next Week Demand', value: '↑ 18% — Antibiotics', color: 'text-amber-400' },
  { icon: IoAlertCircleOutline, label: 'Stock Refill Alert', value: 'Azithromycin — 45 Stores', color: 'text-red-400' },
];

// ── REUSABLE COMPONENTS ────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, icon: Icon, color = 'text-electric-blue' }) => (
  <div className="flex items-start justify-between mb-5">
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-xl bg-dark-bg border border-dark-border/60 flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="text-lg" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="text-[10px] text-muted-text mt-0.5">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const ChartCard = ({ children, title, subtitle, icon, color, span = 1 }) => (
  <div className={`glass-panel rounded-2xl border border-dark-border/40 p-5 ${span === 2 ? 'lg:col-span-2' : ''}`}>
    <SectionHeader title={title} subtitle={subtitle} icon={icon || IoBarChartOutline} color={color} />
    {children}
  </div>
);

const KpiCard = ({ title, value, sub, icon: Icon, colorClass, trend }) => (
  <div className={`glass-panel p-4 rounded-2xl border border-dark-border/40 flex flex-col justify-between group hover:border-white/10 transition-colors`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>
        <Icon className="text-lg" />
      </div>
      {trend && <span className={`text-[10px] font-bold ${trend.startsWith('↑') ? 'text-emerald-green' : 'text-red-400'}`}>{trend}</span>}
    </div>
    <div>
      <p className="text-[10px] text-muted-text uppercase tracking-wider font-bold mb-1">{title}</p>
      <h3 className="text-xl font-black text-white leading-none">{value}</h3>
      {sub && <p className="text-[9px] text-muted-text mt-1">{sub}</p>}
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('Monthly');
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="relative flex flex-col space-y-8 text-left font-poppins pb-12">

      {/* ── PAGE HEADER + EXPORT ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            System SaaS Analytics <span className="text-electric-blue"><IoBarChartOutline /></span>
          </h2>
          <p className="text-sm text-muted-text">Enterprise-level Business Intelligence for the MedAccess Platform.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="flex bg-dark-bg/50 border border-dark-border/60 rounded-xl p-1 text-[10px] font-bold">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(d => (
              <button key={d} onClick={() => setDateRange(d)} className={`px-3 py-1.5 rounded-lg transition-colors ${dateRange === d ? 'bg-electric-blue text-dark-bg' : 'text-muted-text hover:text-white'}`}>{d}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-muted-text bg-dark-bg/50 border border-dark-border/60 rounded-xl hover:text-white transition-colors">
            <IoFilterOutline /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-muted-text bg-dark-bg/50 border border-dark-border/60 rounded-xl hover:text-white transition-colors">
            <IoDownloadOutline /> Export PDF
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-muted-text bg-dark-bg/50 border border-dark-border/60 rounded-xl hover:text-white transition-colors">
            <IoPrintOutline /> Print
          </button>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          TOP KPI SUMMARY CARDS
      ═══════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard title="Total Revenue" value="₹42.8L" sub="Platform lifetime" icon={IoCardOutline} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" trend="↑ 18%" />
        <KpiCard title="Total Orders" value="1,24,850" sub="All time orders" icon={IoPeopleOutline} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" trend="↑ 12%" />
        <KpiCard title="Registered Users" value="13,706" sub="Patients + Owners" icon={IoPeopleOutline} colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20" trend="↑ 9%" />
        <KpiCard title="Registered Stores" value="1,248" sub="Across all areas" icon={IoStorefrontOutline} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" trend="↑ 6%" />
        <KpiCard title="Medicines Sold" value="89,400" sub="Total units" icon={IoMedkitOutline} colorClass="bg-amber-400/10 text-amber-400 border-amber-400/20" trend="↑ 14%" />
        <KpiCard title="Total Transactions" value="₹28.4L" sub="This month" icon={IoCardOutline} colorClass="bg-teal-500/10 text-teal-400 border-teal-500/20" trend="↑ 22%" />
        <KpiCard title="Active Users Today" value="4,892" sub="Currently online" icon={IoPeopleOutline} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" trend="↑ 5%" />
        <KpiCard title="Active Stores" value="1,102" sub="Open right now" icon={IoStorefrontOutline} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" />
        <KpiCard title="Avg Customer Rating" value="4.2 ★" sub="Platform average" icon={IoStarOutline} colorClass="bg-amber-400/10 text-amber-400 border-amber-400/20" trend="↑ 0.3" />
        <KpiCard title="Monthly Growth" value="+18.4%" sub="vs last month" icon={IoTrendingUpOutline} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" trend="↑ 18.4%" />
      </div>


      {/* ═══════════════════════════════════════
          1. MEDICINE SALES ANALYTICS
      ═══════════════════════════════════════ */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 p-5 space-y-5">
        <SectionHeader title="Medicine Sales Performance" subtitle="Monthly sales, revenue & order volume trends" icon={IoMedkitOutline} color="text-emerald-green" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Large Area Chart */}
          <div className="lg:col-span-2">
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mb-3">Revenue & Orders Trend</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY_SALES} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#94A3B8' }} />
                <Area type="monotone" dataKey="revenue" stroke={C.green} strokeWidth={2.5} fillOpacity={1} fill="url(#gRevenue)" name="Revenue (₹)" />
                <Area type="monotone" dataKey="orders" stroke={C.blue} strokeWidth={2} fillOpacity={1} fill="url(#gOrders)" name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Medicines Bar */}
          <div>
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mb-3">Top 7 Medicines by Units Sold</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={TOP_MEDICINES} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} width={90} />
                <Tooltip {...CHART_TOOLTIP} />
                <Bar dataKey="units" fill={C.green} radius={[0, 4, 4, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          2. MEDICINE PREFERENCE + 3. TOP STORES
      ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Chart — Medicine Categories */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <SectionHeader title="Most Preferred Medicines by Users" subtitle="Category-wise demand distribution" icon={IoMedkitOutline} color="text-purple-400" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={MEDICINE_PREF} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {MEDICINE_PREF.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {MEDICINE_PREF.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-text">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pharmacy Stores */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <SectionHeader title="Top Performing Pharmacy Stores" subtitle="Ranked by orders, revenue & rating" icon={IoStorefrontOutline} color="text-amber-400" />
          <div className="space-y-3">
            {TOP_STORES.map((store, i) => (
              <div key={store.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? 'bg-amber-400/20 text-amber-400' : i === 1 ? 'bg-white/10 text-white' : 'bg-dark-bg/60 text-muted-text'}`}>#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{store.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-green rounded-full" style={{ width: `${(store.orders / 1240) * 100}%` }} />
                    </div>
                    <span className="text-[9px] text-muted-text shrink-0">{store.orders} orders</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-amber-400 font-bold">{store.rating} ★</p>
                  <p className="text-[9px] text-muted-text">Trust: {store.trust}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          4. INVENTORY & STOCK ANALYTICS
      ═══════════════════════════════════════ */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
        <SectionHeader title="Inventory Health" subtitle="Stock availability across all categories and stores" icon={IoMedkitOutline} color="text-amber-400" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stacked Bar */}
          <div>
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mb-3">Category-wise Stock Status</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={INVENTORY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
                <XAxis dataKey="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Legend wrapperStyle={{ fontSize: 9, color: '#94A3B8' }} />
                <Bar dataKey="available" stackId="a" fill={C.green} name="Available" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" stackId="a" fill={C.amber} name="Low Stock" />
                <Bar dataKey="critical" stackId="a" fill="#F97316" name="Critical" />
                <Bar dataKey="outOfStock" stackId="a" fill={C.red} name="Out of Stock" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Bars per category */}
          <div>
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mb-4">Availability Health Indicator</p>
            <div className="space-y-4">
              {INVENTORY_DATA.map(item => {
                const total = item.available + item.low + item.critical + item.outOfStock;
                const pct = Math.round((item.available / total) * 100);
                return (
                  <div key={item.category}>
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-white font-bold">{item.category}</span>
                      <span className={`font-bold ${pct > 80 ? 'text-emerald-green' : pct > 60 ? 'text-amber-400' : 'text-red-400'}`}>{pct}% Available</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? C.green : pct > 60 ? C.amber : C.red }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          5. STORE PERFORMANCE RADAR + FEEDBACK PIE
      ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <SectionHeader title="Store Performance & Satisfaction" subtitle="Best vs. lowest store — multi-axis comparison" icon={IoStarOutline} color="text-emerald-green" />
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={STORE_RADAR}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
              <Radar name="Best Store" dataKey="A" stroke={C.green} fill={C.green} fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Lowest Store" dataKey="B" stroke={C.red} fill={C.red} fillOpacity={0.1} strokeWidth={1.5} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#94A3B8' }} />
              <Tooltip {...CHART_TOOLTIP} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Pie */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <SectionHeader title="Feedback Insights" subtitle="Overall sentiment distribution across the platform" icon={IoSparklesOutline} color="text-purple-400" />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={FEEDBACK_DIST} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  <Cell fill={C.green} />
                  <Cell fill={C.amber} />
                  <Cell fill={C.red} />
                </Pie>
                <Tooltip {...CHART_TOOLTIP} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {FEEDBACK_DIST.map((item, i) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: [C.green, C.amber, C.red][i] }} />
                      <span className="text-muted-text">{item.name}</span>
                    </div>
                    <span className="text-white font-bold">{item.value}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: [C.green, C.amber, C.red][i] }} />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-dark-border/40 text-[10px] text-muted-text space-y-1">
                <p>Most Complained: <span className="text-red-400 font-bold">MediLife Store</span></p>
                <p>Most Appreciated: <span className="text-emerald-green font-bold">Good Health Pharmacy</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          6. AREA-WISE SALES + 7. AREA-WISE STORES
      ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area-wise Sales Bar */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <SectionHeader title="Area-wise Medicine Sales" subtitle="Orders & revenue by locality across Bhopal" icon={IoBarChartOutline} color="text-electric-blue" />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={AREA_SALES} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
              <XAxis dataKey="area" stroke="#94A3B8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 9, color: '#94A3B8' }} />
              <Bar dataKey="orders" fill={C.blue} name="Orders" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill={C.purple} name="Revenue (₹)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area-wise Registered Stores + Users */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5 space-y-4">
          <SectionHeader title="Registered Pharmacy Stores" subtitle="Area-wise verified vs pending vs inactive distribution" icon={IoStorefrontOutline} color="text-teal-400" />
          <div className="space-y-3">
            {[
              { area: 'Kolar Road', verified: 42, pending: 8, inactive: 3 },
              { area: 'MP Nagar', verified: 38, pending: 5, inactive: 4 },
              { area: 'Arera Colony', verified: 31, pending: 6, inactive: 2 },
              { area: 'Vijay Nagar', verified: 28, pending: 4, inactive: 5 },
              { area: 'Bairagarh', verified: 22, pending: 9, inactive: 6 },
            ].map(row => {
              const total = row.verified + row.pending + row.inactive;
              return (
                <div key={row.area}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-white font-bold">{row.area}</span>
                    <span className="text-muted-text">{total} total stores</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden gap-px">
                    <div className="bg-emerald-green" style={{ width: `${(row.verified / total) * 100}%` }} title={`Verified: ${row.verified}`} />
                    <div className="bg-amber-400" style={{ width: `${(row.pending / total) * 100}%` }} title={`Pending: ${row.pending}`} />
                    <div className="bg-red-400" style={{ width: `${(row.inactive / total) * 100}%` }} title={`Inactive: ${row.inactive}`} />
                  </div>
                  <div className="flex gap-3 mt-1 text-[8px] text-muted-text">
                    <span className="text-emerald-green">✓ {row.verified} Verified</span>
                    <span className="text-amber-400">⏳ {row.pending} Pending</span>
                    <span className="text-red-400">✗ {row.inactive} Inactive</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          10. REVENUE ANALYTICS
      ═══════════════════════════════════════ */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
        <SectionHeader title="Business Revenue Analytics" subtitle="Daily, weekly and monthly platform revenue trends" icon={IoCardOutline} color="text-emerald-green" />
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={MONTHLY_SALES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSales2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.purple} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
            <Tooltip {...CHART_TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 10, color: '#94A3B8' }} />
            <Area type="monotone" dataKey="revenue" stroke={C.green} strokeWidth={2.5} fillOpacity={1} fill="url(#gRev2)" name="Revenue (₹)" />
            <Area type="monotone" dataKey="sales" stroke={C.purple} strokeWidth={2} fillOpacity={1} fill="url(#gSales2)" name="Units Sold" />
          </AreaChart>
        </ResponsiveContainer>
      </div>


      {/* ═══════════════════════════════════════
          11. USER ACTIVITY ANALYTICS
      ═══════════════════════════════════════ */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
        <SectionHeader title="User Activity Analytics" subtitle="Daily active users, searches, prescriptions and orders" icon={IoPeopleOutline} color="text-electric-blue" />
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={USER_ACTIVITY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
            <Tooltip {...CHART_TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 10, color: '#94A3B8' }} />
            <Line type="monotone" dataKey="active" stroke={C.green} strokeWidth={2.5} dot={{ r: 3, fill: C.green }} name="Active Users" />
            <Line type="monotone" dataKey="searches" stroke={C.blue} strokeWidth={2} dot={false} name="Medicine Searches" />
            <Line type="monotone" dataKey="orders" stroke={C.purple} strokeWidth={2} dot={{ r: 2, fill: C.purple }} name="Orders Placed" />
            <Line type="monotone" dataKey="prescriptions" stroke={C.amber} strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Prescriptions Uploaded" />
          </LineChart>
        </ResponsiveContainer>
      </div>


      {/* ═══════════════════════════════════════
          12. AI INSIGHTS PANEL
      ═══════════════════════════════════════ */}
      <div className="glass-panel rounded-2xl border border-purple-500/20 p-5">
        <SectionHeader title="AI Insights Panel" subtitle="Smart platform intelligence and predictive recommendations" icon={IoSparklesOutline} color="text-purple-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {AI_INSIGHTS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-dark-bg/40 rounded-xl border border-dark-border/40 hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-dark-bg border border-dark-border/60 flex items-center justify-center shrink-0">
                <item.icon className={`text-base ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-muted-text uppercase tracking-wider font-bold">{item.label}</p>
                <p className={`text-xs font-bold mt-0.5 ${item.color}`}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ═══════════════════════════════════════
          8. AREA-WISE USER DISTRIBUTION
      ═══════════════════════════════════════ */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
        <SectionHeader title="Registered Users Distribution" subtitle="State, city and area-wise user demographics" icon={IoPeopleOutline} color="text-teal-400" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { area: 'Kolar Road', male: 1200, female: 980, senior: 220 },
              { area: 'MP Nagar', male: 1050, female: 870, senior: 180 },
              { area: 'Arera Colony', male: 900, female: 760, senior: 155 },
              { area: 'Vijay Nagar', male: 780, female: 640, senior: 140 },
              { area: 'Bairagarh', male: 620, female: 510, senior: 120 },
            ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
              <XAxis dataKey="area" stroke="#94A3B8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 9, color: '#94A3B8' }} />
              <Bar dataKey="male" fill={C.blue} name="Male" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" fill={C.pink} name="Female" radius={[4, 4, 0, 0]} />
              <Bar dataKey="senior" fill={C.amber} name="Senior Citizens" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Gender & Activity Distribution</p>
            {[
              { label: 'Male Users', value: 55, color: C.blue },
              { label: 'Female Users', value: 42, color: '#EC4899' },
              { label: 'Senior Citizens', value: 18, color: C.amber },
              { label: 'Active Users', value: 72, color: C.green },
              { label: 'Inactive Users', value: 28, color: C.red },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-text">{item.label}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
export default AdminAnalytics;
