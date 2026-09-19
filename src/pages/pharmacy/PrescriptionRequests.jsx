import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoDocumentTextOutline, IoCheckmarkCircleOutline, IoWarningOutline,
  IoCloseCircleOutline, IoTimeOutline, IoCheckmarkDoneCircleOutline,
  IoSearchOutline, IoFilterOutline, IoDownloadOutline, IoPrintOutline,
  IoEllipsisVertical, IoClose, IoChevronBack, IoChevronForward,
  IoPersonOutline, IoLocationOutline, IoCallOutline, IoChatbubbleEllipsesOutline,
  IoStarOutline
} from 'react-icons/io5';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_REQUESTS = [
  {
    id: 'PRQ-2024-0892',
    patient: {
      name: 'Abhimanyu Singh',
      initials: 'AS',
      age: 32,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'abhimanyu.s@email.com',
      address: 'Bhopal, Madhya Pradesh',
      bloodGroup: 'B+',
    },
    prescription: {
      date: '14 May 2024',
      time: '11:30 AM',
      relativeTime: '2 Hours Ago',
      doctor: 'Dr. R.K. Sharma',
      hospital: 'City Hospital',
      thumbnail: 'https://via.placeholder.com/150', // Replace with real asset if available
      image: 'https://via.placeholder.com/600x800',
    },
    medicines: [
      { name: 'Paracetamol 650mg', required: 20, available: 120, status: 'Available', dosage: '1-1-1', duration: '5 Days' },
      { name: 'Cetirizine 10mg', required: 10, available: 25, status: 'Available', dosage: '0-0-1', duration: '10 Days' },
      { name: 'Vitamin D3 60K', required: 4, available: 50, status: 'Available', dosage: '1/week', duration: '4 Weeks' },
    ],
    status: 'Pending Review',
    matchStatus: 'Full Match',
    matchPercentage: 100,
    availabilityText: 'All medicines available',
    timeline: [
      { step: 'Uploaded', time: '14 May, 11:30 AM', status: 'completed' },
      { step: 'AI Processed', time: '14 May, 11:31 AM', status: 'completed' },
      { step: 'Reviewed', time: '-', status: 'pending' },
      { step: 'Reserved', time: '-', status: 'pending' },
      { step: 'Completed', time: '-', status: 'pending' },
    ]
  },
  {
    id: 'PRQ-2024-0891',
    patient: {
      name: 'Rahul Sharma',
      initials: 'RS',
      age: 28,
      gender: 'Male',
      phone: '+91 87654 32109',
      email: 'rahul.sharma@email.com',
      address: 'Indore, Madhya Pradesh',
      bloodGroup: 'O+',
    },
    prescription: {
      date: '14 May 2024',
      time: '10:15 AM',
      relativeTime: '3 Hours Ago',
      doctor: 'Dr. Anil Kumar',
      hospital: 'Apollo Clinic',
      thumbnail: 'https://via.placeholder.com/150',
      image: 'https://via.placeholder.com/600x800',
    },
    medicines: [
      { name: 'Azithromycin 500mg', required: 3, available: 30, status: 'Available', dosage: '1-0-0', duration: '3 Days' },
      { name: 'Dolo 650mg', required: 15, available: 200, status: 'Available', dosage: '1-1-1', duration: '5 Days' },
      { name: 'Vitamin B12', required: 10, available: 0, status: 'Out of Stock', dosage: '1-0-0', duration: '10 Days' },
    ],
    status: 'Pending Review',
    matchStatus: 'Partial Match',
    matchPercentage: 67,
    availabilityText: '2 of 3 medicines available',
    timeline: [
      { step: 'Uploaded', time: '14 May, 10:15 AM', status: 'completed' },
      { step: 'AI Processed', time: '14 May, 10:16 AM', status: 'completed' },
      { step: 'Reviewed', time: '-', status: 'pending' },
      { step: 'Reserved', time: '-', status: 'pending' },
      { step: 'Completed', time: '-', status: 'pending' },
    ]
  },
  {
    id: 'PRQ-2024-0890',
    patient: {
      name: 'Neha Kumari',
      initials: 'NK',
      age: 25,
      gender: 'Female',
      phone: '+91 76543 21098',
      email: 'neha.k@email.com',
      address: 'Gwalior, Madhya Pradesh',
      bloodGroup: 'A+',
    },
    prescription: {
      date: '14 May 2024',
      time: '09:45 AM',
      relativeTime: '4 Hours Ago',
      doctor: 'Dr. Smita Verma',
      hospital: 'Care Hospital',
      thumbnail: 'https://via.placeholder.com/150',
      image: 'https://via.placeholder.com/600x800',
    },
    medicines: [
      { name: 'Amoxicillin 500mg', required: 15, available: 0, status: 'Out of Stock', dosage: '1-1-1', duration: '5 Days' },
      { name: 'Paracetamol 650mg', required: 10, available: 0, status: 'Out of Stock', dosage: '1-0-1', duration: '5 Days' },
    ],
    status: 'Reviewed',
    matchStatus: 'Not Matched',
    matchPercentage: 0,
    availabilityText: '0 of 2 medicines available',
    timeline: [
      { step: 'Uploaded', time: '14 May, 09:45 AM', status: 'completed' },
      { step: 'AI Processed', time: '14 May, 09:46 AM', status: 'completed' },
      { step: 'Reviewed', time: '14 May, 10:00 AM', status: 'completed' },
      { step: 'Reserved', time: '-', status: 'pending' },
      { step: 'Completed', time: '-', status: 'pending' },
    ]
  }
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

const getMatchBadge = (match) => {
  if (match === 'Full Match') return 'text-emerald-green border-emerald-green/30 bg-emerald-green/10';
  if (match === 'Partial Match') return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
  return 'text-red-400 border-red-400/30 bg-red-500/10';
};

const getMatchIcon = (match) => {
  if (match === 'Full Match') return <IoCheckmarkCircleOutline />;
  if (match === 'Partial Match') return <IoWarningOutline />;
  return <IoCloseCircleOutline />;
};

// ── COMPONENTS ────────────────────────────────────────────────────────────

const SummaryCard = ({ title, count, percentage, icon: Icon, colorClass }) => (
  <div className={`glass-panel p-4 rounded-xl border border-dark-border/40 flex items-center justify-between group hover:border-white/10 transition-colors`}>
    <div>
      <p className="text-xs text-muted-text mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-xl font-bold text-white">{count}</h3>
        {percentage && <span className="text-[10px] text-muted-text">{percentage}%</span>}
      </div>
    </div>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon className="text-xl" />
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const PrescriptionRequests = () => {
  const [requests] = useState(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [matchFilter, setMatchFilter] = useState('All');

  const openDetails = (req) => setSelectedRequest(req);
  const closeDetails = () => setSelectedRequest(null);

  const handleAction = (action, reqId) => {
    toast.success(`${action} applied successfully!`, { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' } });
  };

  return (
    <div className="relative h-full flex flex-col space-y-6 text-left font-poppins pb-10">
      
      {/* ── HEADER & SUMMARY ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Prescription Requests</h2>
        <p className="text-sm text-muted-text">Review and respond to AI-processed prescription uploads.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <SummaryCard title="All Requests" count="25" percentage="100" icon={IoDocumentTextOutline} colorClass="bg-white/5 text-white border border-white/10" />
        <SummaryCard title="Full Match" count="16" percentage="64" icon={IoCheckmarkCircleOutline} colorClass="bg-emerald-green/10 text-emerald-green border border-emerald-green/20" />
        <SummaryCard title="Partial Match" count="7" percentage="28" icon={IoWarningOutline} colorClass="bg-amber-400/10 text-amber-400 border border-amber-400/20" />
        <SummaryCard title="Not Matched" count="2" percentage="8" icon={IoCloseCircleOutline} colorClass="bg-red-500/10 text-red-500 border border-red-500/20" />
        <SummaryCard title="Pending Review" count="8" percentage="32" icon={IoTimeOutline} colorClass="bg-electric-blue/10 text-electric-blue border border-electric-blue/20" />
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            type="text"
            placeholder="Search by patient name, medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-full py-2.5 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select className="bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 px-4 text-xs text-white outline-none">
            <option>All Status</option>
            <option>Pending</option>
            <option>Reviewed</option>
            <option>Reserved</option>
          </select>
          <select className="bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 px-4 text-xs text-white outline-none">
            <option>All Matches</option>
            <option>Full Match</option>
            <option>Partial Match</option>
            <option>Not Matched</option>
          </select>
          <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60 hover:border-white/20">
            <IoFilterOutline className="mr-1.5" /> Filters
          </Button>
          <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60 hover:border-white/20">
            <IoDownloadOutline className="mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-dark-bg/60 text-muted-text uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 font-semibold">Patient Details</th>
                <th className="p-4 font-semibold">Prescription Summary</th>
                <th className="p-4 font-semibold">Match Status</th>
                <th className="p-4 font-semibold">Requested On</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/40">
              {requests.map((req, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${req.matchPercentage === 100 ? 'bg-emerald-green/10 text-emerald-green' : req.matchPercentage > 0 ? 'bg-electric-blue/10 text-electric-blue' : 'bg-purple-500/10 text-purple-500'}`}>
                        {req.patient.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{req.patient.name}</p>
                        <p className="text-[10px] text-muted-text">{req.patient.age} yrs • {req.patient.gender}</p>
                        <p className="text-[10px] text-muted-text mt-0.5">{req.patient.phone}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-white">Medicines ({req.medicines.length})</p>
                      <ul className="text-[10px] text-muted-text space-y-0.5">
                        {req.medicines.slice(0,3).map((m, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-dark-border" /> {m.name}
                          </li>
                        ))}
                        {req.medicines.length > 3 && <li>...</li>}
                      </ul>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1.5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold border ${getMatchBadge(req.matchStatus)}`}>
                        {getMatchIcon(req.matchStatus)} {req.matchStatus}
                      </div>
                      <p className="text-[11px] font-bold text-white">{req.matchPercentage}%</p>
                      <p className="text-[10px] text-muted-text">{req.availabilityText}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{req.prescription.date}</p>
                      <p className="text-[10px] text-muted-text">{req.prescription.time}</p>
                      <p className="text-[9px] text-dark-border/80 uppercase tracking-wider">{req.prescription.relativeTime}</p>
                    </div>
                  </td>

                  <td className="p-4 text-right space-y-2">
                    <Button variant="primary" className="w-full py-2 text-[11px] bg-emerald-green text-dark-bg hover:bg-emerald-green/90 font-bold" onClick={() => openDetails(req)}>
                      View Details
                    </Button>
                    <div className="flex gap-2 justify-end">
                      {req.matchStatus === 'Full Match' && (
                        <Button variant="secondary" className="flex-1 py-1.5 text-[10px] border-dark-border/60 hover:text-white" onClick={() => handleAction('Reserve', req.id)}>
                          Reserve
                        </Button>
                      )}
                      {req.matchStatus === 'Partial Match' && (
                        <Button variant="secondary" className="flex-1 py-1.5 text-[10px] border-dark-border/60 hover:text-white" onClick={() => handleAction('Review Stock', req.id)}>
                          Review Stock
                        </Button>
                      )}
                      {req.matchStatus === 'Not Matched' && (
                        <Button variant="secondary" className="flex-1 py-1.5 text-[10px] border-dark-border/60 hover:text-white" onClick={() => handleAction('Suggest Alternatives', req.id)}>
                          Suggest Alts
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-dark-border/40 bg-dark-bg/30 flex items-center justify-between text-[11px] text-muted-text">
          <p>Showing 1 to {requests.length} of {requests.length} requests</p>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronBack /></button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-electric-blue/20 text-electric-blue font-bold border border-electric-blue/30">1</button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">2</button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">3</button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronForward /></button>
          </div>
        </div>
      </div>

      {/* ── DETAILS PANEL (MODAL / SLIDEOUT) ── */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40"
              onClick={closeDetails}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Request Details</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedRequest.id}</p>
                </div>
                <button onClick={closeDetails} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="p-6 space-y-8 flex-1">
                
                {/* Patient Info */}
                <div className="glass-panel p-5 rounded-2xl border border-dark-border/40 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-electric-blue/10 text-electric-blue border border-electric-blue/20 flex items-center justify-center font-bold text-xl">
                    {selectedRequest.patient.initials}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-white">{selectedRequest.patient.name}</h4>
                    <p className="text-xs text-muted-text mb-3">{selectedRequest.patient.age} yrs • {selectedRequest.patient.gender} • Blood: {selectedRequest.patient.bloodGroup}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs text-white">
                      <div className="flex items-center gap-2"><IoCallOutline className="text-electric-blue" /> {selectedRequest.patient.phone}</div>
                      <div className="flex items-center gap-2"><IoLocationOutline className="text-electric-blue" /> {selectedRequest.patient.address}</div>
                    </div>
                  </div>
                </div>

                {/* Match Summary & AI Insight */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-2xl border border-dark-border/40">
                    <h5 className="text-[10px] uppercase tracking-wider text-muted-text mb-2 font-bold">Match Summary</h5>
                    <div className="flex items-end gap-3">
                      <span className={`text-3xl font-black ${selectedRequest.matchPercentage === 100 ? 'text-emerald-green' : selectedRequest.matchPercentage > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {selectedRequest.matchPercentage}%
                      </span>
                      <span className="text-sm font-bold text-white mb-1.5">{selectedRequest.matchStatus}</span>
                    </div>
                    <p className="text-xs text-muted-text mt-2">{selectedRequest.availabilityText}</p>
                  </div>
                  
                  <div className="glass-panel p-5 rounded-2xl border border-electric-blue/30 bg-electric-blue/5">
                    <h5 className="text-[10px] uppercase tracking-wider text-electric-blue mb-2 font-bold flex items-center gap-1.5">
                      <IoStarOutline /> AI Recommendation
                    </h5>
                    <p className="text-xs text-white font-medium leading-relaxed">
                      {selectedRequest.matchPercentage === 100 ? 'All medicines are available in your stock. Proceed to reserve them.' : 
                       selectedRequest.matchPercentage > 0 ? 'Partial stock available. Suggest alternatives for missing items or reserve available stock.' : 
                       'No medicines available. Contact patient to suggest alternatives.'}
                    </p>
                  </div>
                </div>

                {/* Detected Medicines */}
                <div>
                  <h5 className="text-sm font-bold text-white mb-3">Detected Medicines ({selectedRequest.medicines.length})</h5>
                  <div className="border border-dark-border/40 rounded-xl overflow-hidden bg-dark-bg/20">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-dark-bg/60 text-muted-text">
                        <tr>
                          <th className="p-3 font-semibold">Medicine</th>
                          <th className="p-3 font-semibold">Required</th>
                          <th className="p-3 font-semibold">In Stock</th>
                          <th className="p-3 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/40">
                        {selectedRequest.medicines.map((med, i) => (
                          <tr key={i}>
                            <td className="p-3 font-semibold text-white">
                              {med.name}
                              <span className="block text-[10px] text-muted-text font-normal mt-0.5">{med.dosage} • {med.duration}</span>
                            </td>
                            <td className="p-3 text-white">{med.required} Units</td>
                            <td className="p-3 text-white">{med.available} Units</td>
                            <td className="p-3 text-right">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${med.status === 'Available' ? 'text-emerald-green' : 'text-red-400'}`}>
                                {med.status === 'Available' ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                                {med.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Prescription Preview (Mocked Box) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-bold text-white">Prescription Preview</h5>
                    <button className="text-xs text-electric-blue hover:underline font-semibold">View Full Size</button>
                  </div>
                  <div className="aspect-video w-full rounded-xl border border-dark-border/60 bg-dark-bg/50 flex flex-col items-center justify-center relative overflow-hidden group">
                    <IoDocumentTextOutline className="text-4xl text-muted-text/30 mb-2" />
                    <p className="text-xs text-muted-text">Original Scan Preview</p>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <Button variant="secondary" className="border-white/20 hover:border-white/40 bg-dark-bg/80 backdrop-blur"><IoSearchOutline className="mr-2"/> Zoom</Button>
                       <Button variant="secondary" className="border-white/20 hover:border-white/40 bg-dark-bg/80 backdrop-blur"><IoDownloadOutline className="mr-2"/> Download</Button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-dark-border/40 bg-dark-bg/80 backdrop-blur">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" className="flex-1 py-3 text-sm bg-emerald-green text-dark-bg hover:bg-emerald-green/90 font-bold">
                    Reserve {selectedRequest.matchPercentage === 100 ? 'All Medicines' : 'Available Stock'}
                  </Button>
                  <Button variant="secondary" className="flex-1 py-3 text-sm border-dark-border/60 hover:border-white/20">
                    <IoChatbubbleEllipsesOutline className="mr-2" /> Contact Patient
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PrescriptionRequests;
