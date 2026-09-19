import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoFolderOpenOutline, IoWarningOutline, IoCloseCircleOutline,
  IoScanOutline, IoMicOutline, IoCloudUploadOutline, IoSearchOutline,
  IoFilterOutline, IoPushOutline, IoEllipsisVertical, IoClose, IoAddOutline,
  IoChevronBack, IoChevronForward, IoPencilOutline, IoCheckmarkCircleOutline,
  IoDownloadOutline, IoTimeOutline
} from 'react-icons/io5';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// ── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_INVENTORY = [
  {
    id: 'MED-001',
    name: 'Paracetamol 650mg',
    brand: 'Dolo 650',
    generic: 'Paracetamol',
    category: 'Pain Relief',
    available: 120,
    minStock: 50,
    unit: 'Tablets',
    expiry: 'Dec 2027',
    status: 'In Stock',
    purchasePrice: 15,
    sellingPrice: 30,
    margin: '50%',
    supplier: 'Sun Pharma',
    batch: 'B-88392',
    image: 'https://via.placeholder.com/100?text=P',
    description: 'Used to treat mild to moderate pain and reduce fever.',
  },
  {
    id: 'MED-002',
    name: 'Cetirizine 10mg',
    brand: 'Zyrtec',
    generic: 'Cetirizine',
    category: 'Antihistamine',
    available: 8,
    minStock: 20,
    unit: 'Tablets',
    expiry: 'Oct 2025',
    status: 'Low Stock',
    purchasePrice: 10,
    sellingPrice: 22,
    margin: '54%',
    supplier: 'Dr Reddy',
    batch: 'B-88311',
    image: 'https://via.placeholder.com/100?text=C',
    description: 'Relieves allergy symptoms such as watery eyes and sneezing.',
  },
  {
    id: 'MED-003',
    name: 'Azithromycin 500mg',
    brand: 'Azee 500',
    generic: 'Azithromycin',
    category: 'Antibiotic',
    available: 25,
    minStock: 20,
    unit: 'Tablets',
    expiry: 'Aug 2026',
    status: 'In Stock',
    purchasePrice: 40,
    sellingPrice: 75,
    margin: '46%',
    supplier: 'Cipla',
    batch: 'B-88344',
    image: 'https://via.placeholder.com/100?text=A',
    description: 'Antibiotic used to treat many different types of infections.',
  },
  {
    id: 'MED-004',
    name: 'Vitamin D3 60K',
    brand: 'D-Rise 60K',
    generic: 'Cholecalciferol',
    category: 'Supplement',
    available: 0,
    minStock: 30,
    unit: 'Capsules',
    expiry: 'Jan 2026',
    status: 'Out of Stock',
    purchasePrice: 60,
    sellingPrice: 110,
    margin: '45%',
    supplier: 'USV',
    batch: 'B-88399',
    image: 'https://via.placeholder.com/100?text=V',
    description: 'Helps your body absorb calcium and phosphorus.',
  },
  {
    id: 'MED-005',
    name: 'Amoxicillin 500mg',
    brand: 'Moxikind 500',
    generic: 'Amoxicillin',
    category: 'Antibiotic',
    available: 15,
    minStock: 40,
    unit: 'Capsules',
    expiry: 'Sep 2026',
    status: 'Low Stock',
    purchasePrice: 35,
    sellingPrice: 65,
    margin: '46%',
    supplier: 'Mankind',
    batch: 'B-88371',
    image: 'https://via.placeholder.com/100?text=A',
    description: 'Penicillin antibiotic used to treat bacterial infections.',
  },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────

const getStatusBadge = (status) => {
  if (status === 'In Stock') return 'text-emerald-green border-emerald-green/30 bg-emerald-green/10';
  if (status === 'Low Stock') return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
  return 'text-red-400 border-red-400/30 bg-red-500/10';
};

// ── COMPONENTS ────────────────────────────────────────────────────────────

const SummaryCard = ({ title, value, percentage, icon: Icon, colorClass, subtitle }) => (
  <div className={`glass-panel p-5 rounded-2xl border border-dark-border/40 relative overflow-hidden group hover:border-white/10 transition-colors`}>
    <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon className="text-xl" />
    </div>
    <p className="text-xs text-muted-text mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-black text-white">{value}</h3>
    </div>
    {percentage && <p className="text-[10px] text-muted-text mt-2">{percentage} of total items</p>}
    {subtitle && <p className="text-[10px] text-muted-text mt-2">{subtitle}</p>}
  </div>
);

const ActionCard = ({ title, subtitle, icon: Icon, onClick }) => (
  <button onClick={onClick} className="glass-panel p-4 rounded-xl border border-dark-border/40 flex items-center gap-4 hover:border-electric-blue/50 hover:bg-white/5 transition-all w-full text-left">
    <div className="w-10 h-10 rounded-lg bg-electric-blue/10 text-electric-blue border border-electric-blue/20 flex items-center justify-center shrink-0">
      <Icon className="text-lg" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="text-[10px] text-muted-text mt-0.5">{subtitle}</p>
    </div>
  </button>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export const InventoryStock = () => {
  const [inventory] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  
  // Voice Panel States
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);

  const openDetails = (med) => setSelectedMed(med);
  const closeDetails = () => setSelectedMed(null);

  const simulateVoiceUpdate = () => {
    if (isListening) return;
    setIsListening(true);
    setVoiceResult(null);
    
    // Simulate API delay for parsing command
    setTimeout(() => {
      setIsListening(false);
      setVoiceResult({
        raw: "Add 50 tablets of Paracetamol 650mg",
        confidence: "95%",
        medName: "Paracetamol 650mg",
        action: "Add Stock",
        qty: "50 Tablets",
        current: 120,
        new: 170
      });
      toast.success("Voice command recognized!", { style: { background: '#0B1728', color: '#FFF' } });
    }, 3000);
  };

  const confirmVoiceUpdate = () => {
    toast.success("Inventory updated successfully!", { style: { background: '#0B1728', color: '#FFF' } });
    setVoiceResult(null);
  };

  return (
    <div className="relative h-full flex flex-col space-y-6 text-left font-poppins pb-10">
      
      {/* ── HEADER ── */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Inventory & Stock</h2>
        <p className="text-sm text-muted-text">Manage and update your pharmacy inventory in real-time.</p>
      </div>

      {/* ── ROW 1: SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Medicines" value="1,248" subtitle="All items in inventory" icon={IoFolderOpenOutline} colorClass="bg-white/5 text-white border border-white/10" />
        <SummaryCard title="In Stock" value="950" percentage="76%" icon={IoSearchOutline} colorClass="bg-electric-blue/10 text-electric-blue border border-electric-blue/20" />
        <SummaryCard title="Low Stock" value="188" percentage="15%" icon={IoWarningOutline} colorClass="bg-amber-400/10 text-amber-400 border border-amber-400/20" />
        <SummaryCard title="Out of Stock" value="110" percentage="9%" icon={IoCloseCircleOutline} colorClass="bg-red-500/10 text-red-500 border border-red-500/20" />
      </div>

      {/* ── ROW 2: QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard title="Add New Medicine" subtitle="Manually add medicine" icon={IoAddOutline} onClick={() => toast("Add medicine modal opens")} />
        <ActionCard title="Scan Barcode" subtitle="Scan and add medicine" icon={IoScanOutline} onClick={() => toast("Camera scanner opens")} />
        <ActionCard title="Voice Stock Update" subtitle="Update stock with voice" icon={IoMicOutline} onClick={simulateVoiceUpdate} />
        <ActionCard title="Import Inventory" subtitle="Upload inventory file" icon={IoCloudUploadOutline} onClick={() => toast("File picker opens")} />
      </div>

      {/* ── ROW 3: MAIN CONTENT SPLIT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Table & Filters */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-4">
          
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-dark-border/40 flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="relative w-full xl:w-96">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
              <input
                type="text"
                placeholder="Search medicine by name, brand or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted-text focus:outline-none focus:border-electric-blue/50"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <select className="bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 px-4 text-xs text-white outline-none">
                <option>All Categories</option>
                <option>Pain Relief</option>
                <option>Antibiotic</option>
                <option>Supplement</option>
              </select>
              <select className="bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 px-4 text-xs text-white outline-none">
                <option>All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <Button variant="secondary" className="py-2 px-3 text-xs border-dark-border/60 hover:border-white/20">
                <IoPushOutline className="mr-1.5" /> Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-dark-bg/60 text-muted-text uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 font-semibold">Medicine Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold text-right">Available Stock</th>
                    <th className="p-4 font-semibold">Unit</th>
                    <th className="p-4 font-semibold">Expiry Date</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40">
                  {inventory.map((med, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => openDetails(med)}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-muted-text overflow-hidden">
                             {med.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{med.name}</p>
                            <p className="text-[10px] text-muted-text">{med.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-text">{med.category}</td>
                      <td className="p-4 text-right font-bold text-white">{med.available}</td>
                      <td className="p-4 text-muted-text">{med.unit}</td>
                      <td className="p-4 text-muted-text">{med.expiry}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(med.status)}`}>
                          {med.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="w-7 h-7 flex items-center justify-center rounded border border-dark-border/60 hover:bg-white/5 text-muted-text" onClick={(e) => { e.stopPropagation(); openDetails(med); }}>
                            <IoPencilOutline />
                          </button>
                          <button className="w-7 h-7 flex items-center justify-center rounded border border-dark-border/60 hover:bg-white/5 text-muted-text" onClick={(e) => { e.stopPropagation(); toast('Menu opened'); }}>
                            <IoEllipsisVertical />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-dark-border/40 bg-dark-bg/30 flex items-center justify-between text-[11px] text-muted-text">
              <p>Showing 1 to 5 of 1,248 items</p>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronBack /></button>
                <button className="w-6 h-6 flex items-center justify-center rounded bg-electric-blue/20 text-electric-blue font-bold border border-electric-blue/30">1</button>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">2</button>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">3</button>
                <span className="w-6 h-6 flex items-center justify-center">...</span>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5">156</button>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5"><IoChevronForward /></button>
              </div>
              <select className="bg-dark-bg/50 border border-dark-border/60 rounded px-2 py-1 outline-none">
                <option>10 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Voice Stock Update Panel */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-6 h-full flex flex-col relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className={`absolute top-20 right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${isListening ? 'bg-electric-blue/20 animate-pulse' : 'bg-electric-blue/5'}`} />

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Voice Stock Update
                </h3>
                <p className="text-[10px] text-muted-text mt-1 leading-relaxed">Update your inventory by speaking the medicine name and quantity.</p>
              </div>
              <IoMicOutline className={`text-2xl ${isListening ? 'text-electric-blue animate-pulse' : 'text-muted-text'}`} />
            </div>

            {/* Microphone Button Area */}
            <div className="flex flex-col items-center justify-center py-6">
              <button 
                onClick={simulateVoiceUpdate}
                className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all relative z-10 ${
                  isListening 
                    ? 'border-emerald-green bg-emerald-green/10 text-emerald-green' 
                    : 'border-electric-blue/50 bg-electric-blue/5 text-electric-blue hover:bg-electric-blue/10 hover:border-electric-blue'
                }`}
              >
                <IoMicOutline className="text-4xl" />
                
                {/* Ripple Effect when listening */}
                {isListening && (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-emerald-green/40 animate-ping" />
                    <span className="absolute inset-[-10px] rounded-full border-2 border-emerald-green/20 animate-pulse" />
                  </>
                )}
              </button>
              <p className={`mt-4 text-sm font-bold ${isListening ? 'text-emerald-green animate-pulse' : 'text-electric-blue'}`}>
                {isListening ? 'Listening...' : 'Tap to Speak'}
              </p>
            </div>

            {/* Results Area */}
            <div className="flex-1 mt-4">
              <AnimatePresence mode="wait">
                {voiceResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <p className="text-[10px] text-muted-text uppercase tracking-wider">Detected Command</p>
                        <span className="text-[9px] font-bold text-emerald-green bg-emerald-green/10 px-1.5 py-0.5 rounded">Confidence: {voiceResult.confidence}</span>
                      </div>
                      <p className="text-xs text-white italic bg-dark-bg/50 p-2 rounded border border-dark-border/40">"{voiceResult.raw}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-[10px] text-muted-text">Medicine Name</p>
                        <p className="text-sm font-bold text-white">{voiceResult.medName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-text">Quantity</p>
                        <p className="text-sm font-bold text-white">{voiceResult.qty}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-muted-text">Action</p>
                        <p className="text-sm font-bold text-emerald-green">{voiceResult.action}</p>
                      </div>
                    </div>

                    {/* Stock Preview */}
                    <div className="mt-4 p-4 rounded-xl border border-electric-blue/30 bg-electric-blue/5 flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-muted-text">Current Stock</p>
                        <p className="text-sm font-bold text-white">{voiceResult.current} {voiceResult.qty.split(' ')[1]}</p>
                      </div>
                      <IoChevronForward className="text-muted-text" />
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-electric-blue font-bold">New Stock</p>
                        <p className="text-lg font-black text-electric-blue">{voiceResult.new} {voiceResult.qty.split(' ')[1]}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button variant="primary" className="bg-emerald-green text-dark-bg hover:bg-emerald-green/90 font-bold" onClick={confirmVoiceUpdate}>
                        <IoCheckmarkCircleOutline className="mr-1.5 text-lg" /> Confirm Update
                      </Button>
                      <Button variant="secondary" className="border-dark-border/60 hover:text-white" onClick={() => setVoiceResult(null)}>
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Example Commands */}
            {!voiceResult && (
              <div className="mt-auto pt-6 border-t border-dark-border/40 text-[10px] text-muted-text space-y-1.5">
                <p className="font-bold mb-2 flex items-center gap-1.5"><IoMicOutline/> Example Commands</p>
                <p>• "Add 50 tablets Paracetamol 650"</p>
                <p>• "Reduce 10 strips Cetirizine"</p>
                <p>• "Show stock of Azithromycin"</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── DETAILS PANEL (MODAL / SLIDEOUT) ── */}
      <AnimatePresence>
        {selectedMed && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40"
              onClick={closeDetails}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-dark-border/60 shadow-2xl z-50 overflow-y-auto flex flex-col font-poppins"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur border-b border-dark-border/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Medicine Details</h3>
                  <p className="text-[10px] text-muted-text mt-0.5">ID: {selectedMed.id}</p>
                </div>
                <button onClick={closeDetails} className="p-2 text-muted-text hover:text-white bg-dark-bg/50 rounded-full border border-dark-border/40">
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                
                {/* Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-2xl text-electric-blue overflow-hidden shrink-0">
                    {selectedMed.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight mb-1">{selectedMed.name}</h4>
                    <p className="text-xs text-muted-text">{selectedMed.generic} • {selectedMed.category}</p>
                    <span className={`inline-flex mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusBadge(selectedMed.status)}`}>
                      {selectedMed.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-text italic leading-relaxed">
                  "{selectedMed.description}"
                </p>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 glass-panel rounded-xl border border-dark-border/40">
                    <p className="text-[10px] text-muted-text">Available Stock</p>
                    <p className="text-xl font-bold text-white mt-1">{selectedMed.available}</p>
                    <p className="text-[10px] text-muted-text mt-0.5">Min Required: {selectedMed.minStock}</p>
                  </div>
                  <div className="p-4 glass-panel rounded-xl border border-dark-border/40">
                    <p className="text-[10px] text-muted-text">Purchase Price</p>
                    <p className="text-xl font-bold text-white mt-1">₹{selectedMed.purchasePrice}</p>
                    <p className="text-[10px] text-emerald-green mt-0.5 font-bold">Margin: {selectedMed.margin}</p>
                  </div>
                  <div className="p-4 glass-panel rounded-xl border border-dark-border/40">
                    <p className="text-[10px] text-muted-text">Selling Price</p>
                    <p className="text-xl font-bold text-white mt-1">₹{selectedMed.sellingPrice}</p>
                  </div>
                  <div className="p-4 glass-panel rounded-xl border border-dark-border/40">
                    <p className="text-[10px] text-muted-text">Expiry Date</p>
                    <p className="text-sm font-bold text-white mt-1">{selectedMed.expiry}</p>
                    <p className="text-[10px] text-muted-text mt-0.5 font-mono">Batch: {selectedMed.batch}</p>
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="p-4 glass-panel rounded-xl border border-dark-border/40">
                  <p className="text-[10px] text-muted-text uppercase tracking-wider font-bold mb-2">Supplier Details</p>
                  <p className="text-sm font-bold text-white">{selectedMed.supplier}</p>
                  <p className="text-[10px] text-muted-text mt-1">Authorized Distributor</p>
                </div>
                
                {/* Timeline */}
                <div>
                  <p className="text-[10px] text-muted-text uppercase tracking-wider font-bold mb-3">Recent Stock Timeline</p>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-dark-border/60 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-green bg-dark-bg text-emerald-green shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <IoAddOutline className="text-[10px]" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-dark-border/40 bg-dark-bg/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs">Stock Added</span>
                          <span className="font-mono text-[9px] text-muted-text">14 May</span>
                        </div>
                        <p className="text-[10px] text-muted-text">+50 Units via Invoice #INV992</p>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-amber-400 bg-dark-bg text-amber-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <IoWarningOutline className="text-[10px]" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-dark-border/40 bg-dark-bg/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs">Low Stock Alert</span>
                          <span className="font-mono text-[9px] text-muted-text">12 May</span>
                        </div>
                        <p className="text-[10px] text-muted-text">Stock reached below 50</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-dark-border/40 bg-dark-bg/80 backdrop-blur flex gap-3">
                <Button variant="primary" className="flex-1 text-xs">Edit Details</Button>
                <Button variant="secondary" className="flex-1 text-xs border-dark-border/60 hover:text-white">Print Barcode</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InventoryStock;
