import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoPersonOutline, IoStorefrontOutline, IoSearchOutline, IoFilterOutline,
  IoClose, IoStar, IoEyeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline,
  IoFlagOutline, IoTrashOutline, IoRefreshOutline, IoWarningOutline,
  IoChatbubbleEllipsesOutline, IoSparklesOutline, IoTrendingUpOutline,
  IoTrendingDownOutline, IoShieldCheckmarkOutline, IoAlertCircleOutline,
  IoMailOutline, IoCallOutline, IoLocationOutline, IoBagOutline
} from 'react-icons/io5';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_PENDING_FEEDBACK = [
  {
    id: 'FB-3001', userId: 'USR-9021', userName: 'Rajesh Kumar', patientId: 'PAT-1234',
    userEmail: 'rajesh@example.com', userPhone: '+91 98765 43210', userCity: 'Bhopal',
    userRegistered: '12 Jan 2024', avatar: 'https://i.pravatar.cc/150?u=raj',
    storeId: 'PHR-1011', storeName: 'Good Health Pharmacy', storeOwner: 'Amit Sharma',
    storeRating: 4.8, storeAddress: 'Kolar Road, Bhopal',
    orderId: 'ORD-8821', prescriptionId: 'RX-4421',
    medicines: ['Paracetamol 500mg', 'Vitamin C 1000mg'],
    orderDate: '18 May 2024', deliveryDate: '18 May 2024', paymentStatus: 'Paid',
    date: '20 May 2024', time: '10:30 AM',
    overallRating: 5,
    categoryRatings: { medicineAvailability: 5, staffBehaviour: 5, delivery: 4, cleanliness: 5, serviceQuality: 5 },
    reviewText: 'Very good service and staff behavior. Got my medicines on time. Highly recommended!',
    sentiment: 'Positive',
    storeImage: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'FB-3002', userId: 'USR-9022', userName: 'Priya Sharma', patientId: 'PAT-1235',
    userEmail: 'priya@example.com', userPhone: '+91 98765 43211', userCity: 'Indore',
    userRegistered: '15 Feb 2024', avatar: 'https://i.pravatar.cc/150?u=pri',
    storeId: 'PHR-1012', storeName: 'CareMed Pharmacy', storeOwner: 'Rahul Verma',
    storeRating: 4.3, storeAddress: 'Indrapuri, Bhopal',
    orderId: 'ORD-8822', prescriptionId: null,
    medicines: ['Azithromycin 500mg'],
    orderDate: '17 May 2024', deliveryDate: '17 May 2024', paymentStatus: 'Paid',
    date: '19 May 2024', time: '3:15 PM',
    overallRating: 3,
    categoryRatings: { medicineAvailability: 3, staffBehaviour: 4, delivery: 3, cleanliness: 3, serviceQuality: 3 },
    reviewText: 'Average experience. Some medicines were not available and had to order from elsewhere.',
    sentiment: 'Neutral',
    storeImage: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'FB-3003', userId: 'USR-9024', userName: 'Suman Rathi', patientId: 'PAT-1238',
    userEmail: 'suman@example.com', userPhone: '+91 98765 43213', userCity: 'Gwalior',
    userRegistered: '10 Nov 2023', avatar: 'https://i.pravatar.cc/150?u=sum',
    storeId: 'PHR-1014', storeName: 'MediLife Store', storeOwner: 'Neha Kumari',
    storeRating: 3.2, storeAddress: 'MP Nagar, Bhopal',
    orderId: 'ORD-8823', prescriptionId: 'RX-4422',
    medicines: ['Metformin 500mg', 'Lisinopril 10mg', 'Atorvastatin 20mg'],
    orderDate: '16 May 2024', deliveryDate: 'Delayed', paymentStatus: 'Paid',
    date: '18 May 2024', time: '9:00 AM',
    overallRating: 1,
    categoryRatings: { medicineAvailability: 1, staffBehaviour: 1, delivery: 1, cleanliness: 2, serviceQuality: 1 },
    reviewText: 'Very poor experience. Late delivery, rude staff, and 2 medicines were missing from the order.',
    sentiment: 'Negative',
    storeImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300&q=60',
  },
];

const MOCK_REVIEWED_FEEDBACK = [
  {
    id: 'FB-2901', userName: 'Ankit Verma', avatar: 'https://i.pravatar.cc/150?u=ank',
    storeName: 'Good Health Pharmacy', storeImage: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=300&q=60',
    overallRating: 4, reviewText: 'Good experience. Medicine was available and price was reasonable.', sentiment: 'Positive',
    date: '19 May 2024', adminStatus: 'Approved',
  },
  {
    id: 'FB-2902', userName: 'Kavita Singh', avatar: 'https://i.pravatar.cc/150?u=kav',
    storeName: 'CareMed Pharmacy', storeImage: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=300&q=60',
    overallRating: 2, reviewText: 'Some medicines expired. Very disappointing. Will not visit again.',
    sentiment: 'Negative', date: '18 May 2024', adminStatus: 'Flagged',
  },
];

const QUICK_FILTERS = ['All Feedback', 'Pending', 'Reviewed', 'Approved', 'Rejected', 'Positive', 'Neutral', 'Negative', '1 Star', '2 Star', '3 Star', '4 Star', '5 Star'];

const AI_INSIGHTS = [
  { label: 'Most Common Complaint', value: 'Medicine Not Available', icon: IoAlertCircleOutline, color: 'text-red-400' },
  { label: 'Most Appreciated Store', value: 'Good Health Pharmacy', icon: IoShieldCheckmarkOutline, color: 'text-emerald-green' },
  { label: 'Avg Customer Satisfaction', value: '4.1 / 5.0', icon: IoSparklesOutline, color: 'text-amber-400' },
  { label: 'Most Reported Issue', value: 'Late Delivery', icon: IoWarningOutline, color: 'text-amber-400' },
  { label: 'Overall Platform Rating', value: '4.2 ★', icon: IoStar, color: 'text-electric-blue' },
  { label: 'Monthly Rating Trend', value: '↑ 0.3 this month', icon: IoTrendingUpOutline, color: 'text-emerald-green' },
];

const STORE_RANKINGS = [
  { label: 'Top Rated', store: 'Good Health Pharmacy', value: '4.8 ★', color: 'text-emerald-green' },
  { label: 'Lowest Rated', store: 'MediLife Store', value: '3.2 ★', color: 'text-red-400' },
  { label: 'Most Reviewed', store: 'CareMed Pharmacy', value: '1,234 reviews', color: 'text-electric-blue' },
  { label: 'Highest Complaints', store: 'MediLife Store', value: '45 complaints', color: 'text-red-400' },
  { label: 'Most Improved', store: 'HealthPlus Pharmacy', value: '+1.2 this month', color: 'text-emerald-green' },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

const getSentimentStyle = (sentiment) => {
  if (sentiment === 'Positive') return 'text-emerald-green border-emerald-green/30 bg-emerald-green/10';
  if (sentiment === 'Neutral') return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
  return 'text-red-400 border-red-400/30 bg-red-500/10';
};

const getAdminStatusStyle = (status) => {
  if (status === 'Approved') return 'text-emerald-green border-emerald-green/30 bg-emerald-green/10';
  if (status === 'Rejected') return 'text-red-400 border-red-400/30 bg-red-500/10';
  return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
};

const StarDisplay = ({ rating, max = 5, size = 'text-xs' }) => (
  <div className={`flex items-center gap-0.5 ${size}`}>
    {[...Array(max)].map((_, i) => (
      <IoStar key={i} className={i < rating ? 'text-amber-400' : 'text-white/10'} />
    ))}
  </div>
);

const CategoryBar = ({ label, value }) => (
  <div className="flex items-center gap-3 text-[10px]">
    <span className="text-muted-text w-36 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-green rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
    </div>
    <span className="text-white font-bold w-4 shrink-0">{value}</span>
  </div>
);

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 flex items-center justify-between hover:border-white/10 transition-colors">
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

export const FeedbackManagement = () => {
  const [activeFilter, setActiveFilter] = useState('All Feedback');
  const [search, setSearch] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [pendingFeedback, setPendingFeedback] = useState(MOCK_PENDING_FEEDBACK);
  const [reviewedFeedback, setReviewedFeedback] = useState(MOCK_REVIEWED_FEEDBACK);

  const moveFeedback = (fb, status) => {
    setPendingFeedback(p => p.filter(f => f.id !== fb.id));
    setReviewedFeedback(r => [{ ...fb, adminStatus: status }, ...r]);
    setSelectedFeedback(null);
    const msgs = { Approved: `Feedback from ${fb.userName} approved.`, Rejected: `Feedback from ${fb.userName} rejected.`, Flagged: `Feedback from ${fb.userName} flagged for review.` };
    toast(msgs[status] || 'Done', { icon: status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : '🚩', style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' } });
  };

  const deleteReviewed = (id) => {
    setReviewedFeedback(r => r.filter(f => f.id !== id));
    toast('Feedback deleted.', { icon: '🗑️' });
  };

  return (
    <div className="relative flex flex-col space-y-8 text-left font-poppins pb-10">

      {/* ── HEADER ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">User Feedback Audits</h2>
        <p className="text-sm text-muted-text">Monitor, moderate, and act on all user-submitted pharmacy feedback across the platform.</p>
      </div>

      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        <StatCard title="Total Feedback" value="3,241" icon={IoChatbubbleEllipsesOutline} colorClass="bg-electric-blue/10 text-electric-blue border-electric-blue/20" />
        <StatCard title="Pending Review" value={pendingFeedback.length} icon={IoAlertCircleOutline} colorClass="bg-amber-400/10 text-amber-400 border-amber-400/20" />
        <StatCard title="Approved" value="2,890" icon={IoCheckmarkCircleOutline} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" />
        <StatCard title="Rejected" value="142" icon={IoCloseCircleOutline} colorClass="bg-red-500/10 text-red-500 border-red-500/20" />
        <StatCard title="Avg Rating" value="4.1 ★" icon={IoStar} colorClass="bg-amber-400/10 text-amber-400 border-amber-400/20" />
        <StatCard title="Positive Reviews" value="2,341" icon={IoTrendingUpOutline} colorClass="bg-emerald-green/10 text-emerald-green border-emerald-green/20" />
        <StatCard title="Negative Reviews" value="256" icon={IoTrendingDownOutline} colorClass="bg-red-500/10 text-red-500 border-red-500/20" />
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input type="text" placeholder="Search by User Name, Store, Order ID, City..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50" />
          </div>
          <div className="flex gap-2 shrink-0">
            <select className="bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2.5 px-3 text-xs text-white outline-none">
              <option>All Stores</option>
              <option>Good Health Pharmacy</option>
            </select>
            <button className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold text-muted-text bg-dark-bg/50 border border-dark-border/60 rounded-xl hover:text-white transition-colors">
              <IoFilterOutline /> More Filters
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {QUICK_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors border ${activeFilter === f ? 'bg-electric-blue text-dark-bg border-electric-blue' : 'bg-dark-bg/50 text-muted-text border-dark-border/60 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── ANALYTICS PANELS: AI INSIGHTS + STORE RANKINGS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <IoSparklesOutline className="text-electric-blue" /> AI Insights Panel
          </h3>
          <div className="space-y-3">
            {AI_INSIGHTS.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border/40 last:border-0">
                <div className="flex items-center gap-2">
                  <item.icon className={`text-base shrink-0 ${item.color}`} />
                  <p className="text-[10px] text-muted-text">{item.label}</p>
                </div>
                <p className={`text-[11px] font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Store Rankings */}
        <div className="glass-panel rounded-2xl border border-dark-border/40 p-5">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <IoTrendingUpOutline className="text-emerald-green" /> Store Performance Summary
          </h3>
          <div className="space-y-3">
            {STORE_RANKINGS.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border/40 last:border-0">
                <div>
                  <p className="text-[10px] text-muted-text">{item.label}</p>
                  <p className="text-xs font-bold text-white mt-0.5">{item.store}</p>
                </div>
                <p className={`text-[11px] font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════════
          CATEGORY 1 : PENDING FEEDBACK
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Pending Feedback Review</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">{pendingFeedback.length} AWAITING</span>
          <div className="h-px flex-1 bg-dark-border/40" />
        </div>

        {pendingFeedback.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-16 text-center">
            <IoCheckmarkCircleOutline className="text-5xl text-emerald-green mx-auto mb-4" />
            <h4 className="text-white font-bold">All caught up!</h4>
            <p className="text-muted-text text-sm mt-1">No pending feedback awaiting review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {pendingFeedback.map(fb => (
              <div key={fb.id} className="glass-panel rounded-2xl border border-amber-400/20 flex flex-col hover:border-amber-400/40 transition-all group">
                {/* Store Banner */}
                <div className="relative h-20 rounded-t-2xl overflow-hidden">
                  <img src={fb.storeImage} alt="" className="w-full h-full object-cover opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-card/90" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30 backdrop-blur">PENDING REVIEW</span>
                </div>

                <div className="p-5 flex flex-col flex-1 space-y-4">
                  {/* User + Store Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={fb.avatar} alt="" className="w-10 h-10 rounded-full border border-dark-border/60 object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{fb.userName}</p>
                        <p className="text-[9px] text-muted-text font-mono">{fb.userId} · {fb.patientId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border shrink-0 ${getSentimentStyle(fb.sentiment)}`}>
                      {fb.sentiment}
                    </span>
                  </div>

                  {/* Store + Ratings */}
                  <div className="bg-dark-bg/40 rounded-xl p-3 border border-dark-border/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white">{fb.storeName}</p>
                      <StarDisplay rating={fb.overallRating} />
                    </div>
                    <p className="text-[9px] text-muted-text">Order: <span className="text-white">{fb.orderId}</span> · {fb.date} {fb.time}</p>
                    <p className="text-[10px] text-muted-text italic leading-relaxed">"{fb.reviewText.substring(0, 80)}{fb.reviewText.length > 80 ? '...' : ''}"</p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button onClick={() => setSelectedFeedback(fb)}
                      className="col-span-2 flex items-center justify-center gap-1.5 bg-dark-bg/40 text-muted-text border border-dark-border/60 text-[10px] font-bold rounded-xl py-2 hover:text-white transition-colors">
                      <IoEyeOutline /> View Details
                    </button>
                    <button onClick={() => moveFeedback(fb, 'Approved')}
                      className="flex items-center justify-center gap-1 bg-emerald-green/10 text-emerald-green border border-emerald-green/30 text-[10px] font-bold rounded-xl py-2 hover:bg-emerald-green/20 transition-colors">
                      ✔ Approve
                    </button>
                    <button onClick={() => moveFeedback(fb, 'Rejected')}
                      className="flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-xl py-2 hover:bg-red-500/20 transition-colors">
                      ✘ Reject
                    </button>
                    <button onClick={() => moveFeedback(fb, 'Flagged')}
                      className="col-span-2 flex items-center justify-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-bold rounded-xl py-2 hover:bg-amber-400/20 transition-colors">
                      <IoFlagOutline /> Flag for Manual Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* ══════════════════════════════════════════════════════════════════
          CATEGORY 2 : REVIEWED FEEDBACK
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-green" />
            <h3 className="text-base font-bold text-white">Reviewed Feedback</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-green/10 text-emerald-green border border-emerald-green/30">{reviewedFeedback.length} REVIEWED</span>
          <div className="h-px flex-1 bg-dark-border/40" />
        </div>

        {reviewedFeedback.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-16 text-center">
            <IoChatbubbleEllipsesOutline className="text-5xl text-muted-text mx-auto mb-4" />
            <p className="text-muted-text text-sm">No reviewed feedback yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {reviewedFeedback.map(fb => (
              <div key={fb.id} className="glass-panel rounded-2xl border border-dark-border/40 flex flex-col hover:border-white/10 transition-all">
                {/* Store Banner */}
                <div className="relative h-16 rounded-t-2xl overflow-hidden">
                  <img src={fb.storeImage} alt="" className="w-full h-full object-cover opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-card/90" />
                </div>

                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={fb.avatar} alt="" className="w-9 h-9 rounded-full border border-dark-border/60 object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{fb.userName}</p>
                        <p className="text-[9px] text-muted-text">{fb.storeName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border shrink-0 ${getAdminStatusStyle(fb.adminStatus)}`}>
                      {fb.adminStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarDisplay rating={fb.overallRating} />
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getSentimentStyle(fb.sentiment)}`}>{fb.sentiment}</span>
                  </div>

                  <p className="text-[10px] text-muted-text italic leading-relaxed">"{fb.reviewText.substring(0, 100)}{fb.reviewText.length > 100 ? '...' : ''}"</p>
                  <p className="text-[9px] text-muted-text">{fb.date}</p>

                  <div className="mt-auto pt-3 border-t border-dark-border/40 grid grid-cols-2 gap-2">
                    <button onClick={() => setSelectedFeedback({ ...fb, adminStatus: fb.adminStatus })}
                      className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-text border border-dark-border/60 rounded-xl py-1.5 hover:text-white transition-colors">
                      <IoEyeOutline /> Details
                    </button>
                    <button
                      className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-text border border-dark-border/60 rounded-xl py-1.5 hover:text-white transition-colors">
                      <IoRefreshOutline /> Restore
                    </button>
                    <button
                      className="flex items-center justify-center gap-1 text-[10px] font-bold text-electric-blue border border-electric-blue/30 rounded-xl py-1.5 hover:bg-electric-blue/10 transition-colors">
                      Edit Status
                    </button>
                    <button onClick={() => deleteReviewed(fb.id)}
                      className="flex items-center justify-center gap-1 text-[10px] font-bold text-red-400 border border-red-500/30 rounded-xl py-1.5 hover:bg-red-500/10 transition-colors">
                      <IoTrashOutline /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* ══════════════════════════════════════════════════════════════════
          DETAIL DRAWER
      ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedFeedback && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40"
              onClick={() => setSelectedFeedback(null)} />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              <div className="sticky top-0 z-10 bg-dark-card/95 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Feedback Details</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedFeedback.id}</p>
                </div>
                <button onClick={() => setSelectedFeedback(null)} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">

                {/* User Details */}
                <section>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoPersonOutline className="text-electric-blue" /> User Details</h4>
                  <div className="flex items-center gap-4 mb-3">
                    <img src={selectedFeedback.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-dark-border/60 object-cover" />
                    <div>
                      <p className="text-sm font-bold text-white">{selectedFeedback.userName}</p>
                      <p className="text-[10px] text-muted-text">{selectedFeedback.userId} · {selectedFeedback.patientId}</p>
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-xl border border-dark-border/40 space-y-2 text-[10px]">
                    {[
                      [IoMailOutline, 'Email', selectedFeedback.userEmail || '—'],
                      [IoCallOutline, 'Phone', selectedFeedback.userPhone || '—'],
                      [IoLocationOutline, 'City', selectedFeedback.userCity || '—'],
                      [IoPersonOutline, 'Registered', selectedFeedback.userRegistered || '—'],
                    ].map(([Icon, lbl, val]) => (
                      <p key={lbl} className="text-muted-text flex items-center gap-2">
                        <Icon className="text-electric-blue text-xs shrink-0" />
                        <span className="font-bold w-20 shrink-0">{lbl}</span>
                        <span className="text-white">{val}</span>
                      </p>
                    ))}
                  </div>
                </section>

                {/* Store Details */}
                <section>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoStorefrontOutline className="text-emerald-green" /> Store Details</h4>
                  <div className="glass-panel p-3 rounded-xl border border-dark-border/40 space-y-2 text-[10px]">
                    {[
                      ['Pharmacy', selectedFeedback.storeName || '—'],
                      ['Store ID', selectedFeedback.storeId || '—'],
                      ['Owner', selectedFeedback.storeOwner || '—'],
                      ['Store Rating', selectedFeedback.storeRating ? `${selectedFeedback.storeRating} ★` : '—'],
                      ['Address', selectedFeedback.storeAddress || '—'],
                    ].map(([lbl, val]) => (
                      <p key={lbl} className="text-muted-text flex justify-between gap-2">
                        <span className="font-bold w-24 shrink-0">{lbl}</span>
                        <span className="text-white text-right">{val}</span>
                      </p>
                    ))}
                  </div>
                </section>

                {/* Order Details */}
                {selectedFeedback.orderId && (
                  <section>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoBagOutline className="text-purple-400" /> Order Details</h4>
                    <div className="glass-panel p-3 rounded-xl border border-dark-border/40 space-y-2 text-[10px]">
                      {[
                        ['Order ID', selectedFeedback.orderId],
                        ['Prescription', selectedFeedback.prescriptionId || 'N/A'],
                        ['Medicines', selectedFeedback.medicines?.join(', ') || '—'],
                        ['Order Date', selectedFeedback.orderDate || '—'],
                        ['Delivery Date', selectedFeedback.deliveryDate || '—'],
                        ['Payment', selectedFeedback.paymentStatus || '—'],
                      ].map(([lbl, val]) => (
                        <p key={lbl} className="text-muted-text flex justify-between gap-2">
                          <span className="font-bold w-24 shrink-0">{lbl}</span>
                          <span className="text-white text-right">{val}</span>
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {/* Feedback Details */}
                <section>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2"><IoChatbubbleEllipsesOutline className="text-amber-400" /> Feedback Details</h4>
                  <div className="glass-panel p-4 rounded-xl border border-dark-border/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <StarDisplay rating={selectedFeedback.overallRating || 0} size="text-sm" />
                        <span className="text-white text-sm font-bold">{selectedFeedback.overallRating || '—'}/5</span>
                      </div>
                    </div>
                    {selectedFeedback.categoryRatings && (
                      <div className="space-y-2">
                        <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mb-2">Category Ratings</p>
                        <CategoryBar label="Medicine Availability" value={selectedFeedback.categoryRatings.medicineAvailability} />
                        <CategoryBar label="Staff Behaviour" value={selectedFeedback.categoryRatings.staffBehaviour} />
                        <CategoryBar label="Delivery Experience" value={selectedFeedback.categoryRatings.delivery} />
                        <CategoryBar label="Store Cleanliness" value={selectedFeedback.categoryRatings.cleanliness} />
                        <CategoryBar label="Service Quality" value={selectedFeedback.categoryRatings.serviceQuality} />
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider mb-2">Review</p>
                      <p className="text-xs text-white leading-relaxed bg-dark-bg/40 p-3 rounded-lg border border-dark-border/40 italic">"{selectedFeedback.reviewText}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Sentiment</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getSentimentStyle(selectedFeedback.sentiment)}`}>{selectedFeedback.sentiment}</span>
                    </div>
                  </div>
                </section>

                {/* Admin Actions */}
                <section className="pt-2 border-t border-dark-border/40">
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">Admin Actions</h4>
                  {!selectedFeedback.adminStatus ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => moveFeedback(selectedFeedback, 'Approved')}
                        className="col-span-2 bg-emerald-green text-dark-bg font-bold text-xs py-2.5 rounded-xl hover:bg-emerald-green/90 transition-colors">
                        ✔ Approve Feedback
                      </button>
                      <button onClick={() => moveFeedback(selectedFeedback, 'Rejected')}
                        className="bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-xs py-2.5 rounded-xl hover:bg-red-500/20 transition-colors">
                        Reject Feedback
                      </button>
                      <button onClick={() => moveFeedback(selectedFeedback, 'Flagged')}
                        className="bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-400/20 transition-colors">
                        Flag for Review
                      </button>
                      <button className="col-span-2 bg-dark-bg/40 text-muted-text border border-dark-border/60 font-bold text-xs py-2.5 rounded-xl hover:text-white transition-colors">
                        Send Warning to Store
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button className="col-span-2 bg-dark-bg/40 text-muted-text border border-dark-border/60 font-bold text-xs py-2.5 rounded-xl hover:text-white transition-colors">
                        <IoRefreshOutline className="inline mr-1" /> Restore to Pending
                      </button>
                      <button className="bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-xs py-2.5 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1">
                        <IoTrashOutline /> Delete
                      </button>
                      <button className="bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-400/20 transition-colors">
                        Flag Fake Review
                      </button>
                    </div>
                  )}
                </section>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FeedbackManagement;
