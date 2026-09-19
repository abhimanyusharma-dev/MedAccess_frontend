import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoLocationOutline, IoCheckmarkCircle, 
  IoCalendarOutline, IoHardwareChip, IoInformationCircleOutline, 
  IoCartOutline, IoTrashOutline, IoShieldCheckmark, 
  IoDocumentTextOutline, 
  IoWarningOutline, IoOptionsOutline, 
  IoSwapVerticalOutline, IoCloseOutline, IoSearchOutline,
  IoWaterOutline, IoWineOutline
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';

// ---------------------------------------------------------
// Mock Data
// ---------------------------------------------------------
const INITIAL_MEDS = [
  {
    id: 1,
    name: "Paracetamol 650mg",
    type: "Tablet",
    desc: "Pain reliever and fever reducer",
    dosage: "1-0-1",
    frequencyText: "3 times a day (After meal)",
    frequency: 3, 
    stripSize: 10,
    stripType: "Tablets per strip",
    unitPrice: 15.50, 
    available: true,
    requiresPrescription: false,
    stock: 150
  },
  {
    id: 2,
    name: "Azithromycin 500mg",
    type: "Tablet",
    desc: "Antibiotic",
    dosage: "1-0-1",
    frequencyText: "3 times a day (After meal)",
    frequency: 3,
    stripSize: 3,
    stripType: "Tablets per strip",
    unitPrice: 62.80,
    available: true,
    requiresPrescription: true,
    stock: 45
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    type: "Tablet",
    desc: "Antihistamine",
    dosage: "0-0-1",
    frequencyText: "Once a day (At night)",
    frequency: 1,
    stripSize: 10,
    stripType: "Tablets per strip",
    unitPrice: 24.60,
    available: true,
    requiresPrescription: false,
    stock: 200
  },
  {
    id: 4,
    name: "Vitamin D3 60K",
    type: "Capsule",
    desc: "Nutritional Supplement",
    dosage: "0-0-1",
    frequencyText: "Once a day (At night)",
    frequency: 1,
    stripSize: 4,
    stripType: "Capsules per strip",
    unitPrice: 18.90,
    available: true,
    requiresPrescription: false,
    stock: 80
  }
];

export const FindMedicines = () => {
  const [duration, setDuration] = useState(7);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedMedInfo, setSelectedMedInfo] = useState(null);
  
  const [medicines, setMedicines] = useState(INITIAL_MEDS);

  // Recalculate if duration changes
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      setIsCalculating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [duration]);

  // Derived calculations
  const calculatedMeds = useMemo(() => {
    return medicines.map(med => {
      const totalUnits = med.frequency * duration;
      const stripsRequired = Math.ceil(totalUnits / med.stripSize);
      const totalPrice = stripsRequired * med.unitPrice;
      return { ...med, totalUnits, stripsRequired, totalPrice };
    });
  }, [medicines, duration]);

  const totals = useMemo(() => {
    return calculatedMeds.reduce((acc, med) => {
      acc.totalMeds += 1;
      acc.totalStrips += med.stripsRequired;
      acc.totalUnits += med.totalUnits;
      acc.totalAmount += med.totalPrice;
      return acc;
    }, { totalMeds: 0, totalStrips: 0, totalUnits: 0, totalAmount: 0 });
  }, [calculatedMeds]);

  const handleDurationClick = (days) => {
    setShowCustom(false);
    setDuration(days);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customDuration && !isNaN(customDuration) && parseInt(customDuration) > 0) {
      setDuration(parseInt(customDuration));
      setShowCustom(false);
    }
  };

  const handleReserve = () => {
    toast.success(`Successfully reserved ${totals.totalMeds} medicines!`, {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
    });
  };

  const handleDelete = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 text-left pb-10 font-poppins">
      
      {/* ----------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* ----------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button className="text-muted-text hover:text-white transition-colors">
              <IoSearchOutline />
            </button>
            <h3 className="text-xl font-bold text-white">Find Medicines</h3>
          </div>
          <p className="text-sm text-muted-text">We have found all medicines from your prescription</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="px-4 py-2 text-sm border-white/10 hover:border-white/20">
            <IoDocumentTextOutline className="mr-2" /> View Prescription
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* PRESCRIPTION MATCH SUMMARY */}
      {/* ----------------------------------------------------- */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-border/40 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-dark-border/40">
        
        {/* Match Stats */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-green/10 flex items-center justify-center border border-emerald-green/20">
            <IoDocumentTextOutline className="text-emerald-green text-2xl" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Prescription Match</h4>
            <p className="text-xs text-muted-text mt-0.5 mb-1">All medicines from your prescription</p>
            <span className="text-xs font-bold text-emerald-green tracking-wide">4 / 4 Available</span>
          </div>
        </div>

        {/* 100% Match */}
        <div className="flex items-center gap-4 md:pl-6 pt-4 md:pt-0">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-green flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <IoCheckmarkCircle className="text-emerald-green text-2xl" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">100% Match</h4>
            <p className="text-xs text-muted-text mt-0.5">Great! All medicines are available</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between md:pl-6 pt-4 md:pt-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-dark-bg/50 border border-dark-border/40 flex items-center justify-center">
              <IoLocationOutline className="text-muted-text text-lg" />
            </div>
            <div>
              <p className="text-[10px] text-muted-text uppercase tracking-wider">Search Location</p>
              <h4 className="text-sm font-bold text-white leading-tight">Data Colony, Bhopal</h4>
              <p className="text-[10px] text-muted-text mt-0.5">Within 10 KM Radius</p>
            </div>
          </div>
          <button className="text-[11px] px-3 py-1.5 rounded-lg border border-dark-border/60 hover:bg-white/5 transition-colors text-white flex items-center gap-1.5">
            <IoOptionsOutline /> Change Location
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* 1. SELECT REQUIRED DURATION & AI ANALYSIS */}
      {/* ----------------------------------------------------- */}
      <div className="space-y-4">
        <div className="glass-panel rounded-2xl p-6 border border-dark-border/40">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-green flex items-center justify-center text-dark-bg font-black text-sm">1</div>
              <div>
                <h3 className="text-base font-bold text-white">Select Required Duration</h3>
                <p className="text-[11px] text-muted-text max-w-sm mt-0.5">AI will calculate the required quantity based on the dosage written by your doctor in the prescription.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[3, 5, 7, 10, 15, 30].map(days => (
                <button
                  key={days}
                  onClick={() => handleDurationClick(days)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                    duration === days && !showCustom
                      ? 'bg-emerald-green text-dark-bg border-emerald-green shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-dark-bg/50 text-muted-text border-dark-border/60 hover:border-emerald-green/50 hover:text-white'
                  }`}
                >
                  {days} Days
                </button>
              ))}
              
              {!showCustom ? (
                <button 
                  onClick={() => setShowCustom(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border bg-dark-bg/50 text-muted-text border-dark-border/60 hover:border-emerald-green/50 hover:text-white flex items-center gap-1.5`}
                >
                  <IoCalendarOutline /> Custom
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Days"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-20 px-3 py-2 text-xs bg-dark-bg/80 border border-electric-blue/50 text-white rounded-xl focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="px-3 py-2 bg-electric-blue text-dark-bg font-bold rounded-xl text-xs hover:bg-electric-blue/90">Set</button>
                  <button type="button" onClick={() => setShowCustom(false)} className="p-2 text-muted-text hover:text-red-400"><IoCloseOutline size={18}/></button>
                </form>
              )}
            </div>
          </div>

          {/* AI Analysis Box */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#091422] border border-[#142945]">
            <div className="w-10 h-10 rounded-lg bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center flex-shrink-0">
              <span className="text-electric-blue font-black text-sm tracking-wider">AI</span>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white mb-1">AI Analysis</h5>
              <p className="text-xs text-muted-text">
                We have detected dosage instructions from your prescription and calculated the required quantity for {duration} days.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* SMART FILTERS & SEARCH */}
      {/* ----------------------------------------------------- */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
          <Button variant="secondary" className="px-3 py-1.5 text-[11px] rounded-full bg-dark-bg/60 border-dark-border/40 whitespace-nowrap"><IoOptionsOutline className="mr-1.5" /> Filters</Button>
          <span className="px-3 py-1.5 text-[11px] rounded-full bg-white/5 border border-white/10 text-white whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">Tablet</span>
          <span className="px-3 py-1.5 text-[11px] rounded-full bg-white/5 border border-white/10 text-white whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">Capsule</span>
          <span className="px-3 py-1.5 text-[11px] rounded-full bg-emerald-green/10 border border-emerald-green/20 text-emerald-green whitespace-nowrap cursor-pointer">In Stock</span>
          <span className="px-3 py-1.5 text-[11px] rounded-full bg-white/5 border border-white/10 text-white whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">Lowest Price</span>
        </div>
        <div className="relative w-full md:w-64">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input type="text" placeholder="Search or add medicine..." className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted-text/70 focus:outline-none focus:border-electric-blue/50" />
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* 2. MEDICINES & QUANTITY TABLE */}
      {/* ----------------------------------------------------- */}
      <div className="glass-panel rounded-2xl border border-dark-border/40 overflow-hidden">
        
        <div className="p-6 border-b border-dark-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-green flex items-center justify-center text-dark-bg font-black text-sm">2</div>
            <h3 className="text-base font-bold text-white">Medicines & Quantity <span className="text-muted-text font-normal text-xs ml-2">(Auto Calculated)</span></h3>
          </div>
          <div className="flex gap-2">
             <button className="text-[11px] px-3 py-1.5 rounded-lg bg-dark-bg/60 border border-dark-border/60 hover:bg-white/5 transition-colors text-white flex items-center gap-1.5">
              <IoSwapVerticalOutline /> Compare Medicines
            </button>
          </div>
        </div>

        {/* Loading State Overlay */}
        <div className="relative">
          <AnimatePresence>
            {isCalculating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-dark-bg/60 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <div className="w-8 h-8 border-2 border-emerald-green/30 border-t-emerald-green rounded-full animate-spin mb-3"></div>
                <span className="text-xs text-emerald-green font-medium animate-pulse">AI Re-calculating quantities...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Table */}
          <div className="overflow-x-auto">
            {medicines.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <IoWarningOutline className="text-4xl text-muted-text mb-3" />
                <h4 className="text-white font-semibold mb-1">No medicines in list</h4>
                <p className="text-xs text-muted-text">Search and add medicines to calculate requirements.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-dark-bg/40 border-b border-dark-border/40 text-[10px] uppercase tracking-wider text-muted-text">
                    <th className="p-4 pl-6 font-semibold w-1/4">Medicine Details</th>
                    <th className="p-4 font-semibold text-center">Dosage</th>
                    <th className="p-4 font-semibold text-center">Frequency</th>
                    <th className="p-4 font-semibold text-center">Duration</th>
                    <th className="p-4 font-semibold text-center bg-dark-bg/20">Total Tablets Required</th>
                    <th className="p-4 font-semibold text-center">Strip Size</th>
                    <th className="p-4 font-semibold text-center bg-emerald-green/5 text-emerald-green/70">Strips Required</th>
                    <th className="p-4 font-semibold text-center">Estimated Price</th>
                    <th className="p-4 font-semibold text-center bg-dark-bg/20">Total Price</th>
                    <th className="p-4 font-semibold text-center pr-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/20">
                  {calculatedMeds.map((med) => (
                    <tr key={med.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* Medicine Details */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl bg-dark-bg border border-dark-border/60 flex items-center justify-center shadow-sm cursor-pointer hover:border-emerald-green/50 transition-colors"
                            onClick={() => setSelectedMedInfo(med)}
                          >
                            <IoHardwareChip className="text-muted-text text-xl" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h5 
                                className="text-sm font-bold text-white hover:text-emerald-green cursor-pointer transition-colors"
                                onClick={() => setSelectedMedInfo(med)}
                              >
                                {med.name}
                              </h5>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded bg-emerald-green/10 text-emerald-green border border-emerald-green/20">
                                {med.type}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-text mt-1">{med.desc}</p>
                          </div>
                        </div>
                      </td>

                      {/* Dosage */}
                      <td className="p-4 text-center">
                        <span className="text-xs font-mono font-semibold text-white tracking-widest">{med.dosage}</span>
                      </td>

                      {/* Frequency */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-white">{med.frequency} times a day</span>
                          <span className="text-[10px] text-muted-text">{med.frequencyText.split('(')[1]?.replace(')', '') || 'As prescribed'}</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="p-4 text-center">
                        <span className="text-xs text-white">{duration} Days</span>
                      </td>

                      {/* Total Tablets Required */}
                      <td className="p-4 text-center bg-dark-bg/20">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-white">{med.totalUnits}</span>
                          <span className="text-[9px] text-muted-text uppercase">{med.type}s</span>
                        </div>
                      </td>

                      {/* Strip Size */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-white">{med.stripSize} {med.type}s</span>
                          <span className="text-[9px] text-muted-text">per strip</span>
                        </div>
                      </td>

                      {/* Strips Required */}
                      <td className="p-4 text-center bg-emerald-green/5">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-emerald-green drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{med.stripsRequired}</span>
                          <span className="text-[10px] text-emerald-green/80 font-bold uppercase tracking-wider">Strip{med.stripsRequired > 1 ? 's' : ''}</span>
                        </div>
                      </td>

                      {/* Estimated Price */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-semibold text-white">₹{med.unitPrice.toFixed(2)}</span>
                          <span className="text-[9px] text-muted-text">per strip</span>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="p-4 text-center bg-dark-bg/20">
                        <span className="text-sm font-bold text-white tracking-wide">₹{med.totalPrice.toFixed(2)}</span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center pr-6">
                        <button 
                          onClick={() => handleDelete(med.id)}
                          className="p-2 rounded-lg text-muted-text hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <IoTrashOutline size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Auto Calculation Note */}
        <div className="p-4 bg-dark-bg/40 border-t border-dark-border/40 flex items-start gap-3">
          <div className="mt-0.5 text-electric-blue/70">
            <IoInformationCircleOutline size={16} />
          </div>
          <p className="text-[11px] text-muted-text">
            <strong className="text-white/80 font-semibold">Note:</strong> The quantity is auto-calculated based on the dosage and duration mentioned in your prescription. If any medicine or dosage looks incorrect, please confirm with your doctor.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* 3. ORDER SUMMARY */}
      {/* ----------------------------------------------------- */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-border/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-emerald-green flex items-center justify-center text-dark-bg font-black text-sm">3</div>
          <h3 className="text-base font-bold text-white">Order Summary</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] text-muted-text mb-1 uppercase tracking-widest font-semibold">Total Medicines</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{totals.totalMeds}</span>
              <span className="text-[10px] text-muted-text">Medicines</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] text-muted-text mb-1 uppercase tracking-widest font-semibold">Total Strips</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{totals.totalStrips}</span>
              <span className="text-[10px] text-muted-text">Strips</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 flex items-center justify-center gap-4">
             <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
               <IoDocumentTextOutline className="text-white text-xl" />
             </div>
             <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted-text mb-0.5 uppercase tracking-wider font-semibold">Total Tablets/Caps</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">{totals.totalUnits}</span>
                  <span className="text-[10px] text-muted-text">Units</span>
                </div>
             </div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-green/5 border border-emerald-green/20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-[11px] text-emerald-green/80 mb-1 uppercase tracking-widest font-semibold relative z-10">Total Amount</span>
            <span className="text-2xl font-black text-emerald-green drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] relative z-10">₹{totals.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-4 rounded-xl bg-[#091712] border border-emerald-green/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-green/20 flex items-center justify-center border border-emerald-green/30">
              <IoCartOutline className="text-emerald-green text-xl" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-green">All medicines are available in nearby pharmacies.</h4>
              <p className="text-xs text-emerald-green/70 mt-0.5">You can now reserve and pickup or get it delivered.</p>
            </div>
          </div>
          <Button 
            variant="primary-green" 
            className="w-full md:w-auto px-6 py-3 whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all font-bold group"
            onClick={handleReserve}
            disabled={medicines.length === 0}
          >
            View Pharmacies with These Medicines
            <IoCheckmarkCircle className="ml-2 group-hover:scale-110 transition-transform" size={18} />
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* AI ASSISTANT BANNER */}
      {/* ----------------------------------------------------- */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-border/40 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-dark-card to-electric-blue/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B1525] border border-electric-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,195,255,0.2)]">
            <IoHardwareChip className="text-electric-blue text-2xl animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Need Help?</h4>
            <p className="text-xs text-muted-text mt-0.5">Ask our AI Health Assistant for any medication or health related queries.</p>
          </div>
        </div>
        <button className="w-full md:w-auto px-6 py-2.5 rounded-xl border border-electric-blue/30 bg-electric-blue/10 text-electric-blue text-sm font-semibold hover:bg-electric-blue hover:text-dark-bg transition-all duration-300 flex items-center justify-center gap-2">
          Ask AI Assistant
        </button>
      </div>

      {/* ----------------------------------------------------- */}
      {/* SECURITY FOOTER BADGES */}
      {/* ----------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-emerald-green/30 flex items-center justify-center text-emerald-green">
            <IoShieldCheckmark />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">100% Secure</p>
            <p className="text-[9px] text-muted-text">Your data is safe with us</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-emerald-green/30 flex items-center justify-center text-emerald-green">
            <IoCheckmarkCircle />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">Verified Pharmacies</p>
            <p className="text-[9px] text-muted-text">Only trusted & verified stores</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-emerald-green/30 flex items-center justify-center text-emerald-green">
            <IoDocumentTextOutline />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">Best Price Guarantee</p>
            <p className="text-[9px] text-muted-text">We help you save more</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-emerald-green/30 flex items-center justify-center text-emerald-green">
            <IoHardwareChip />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">Fast & Easy</p>
            <p className="text-[9px] text-muted-text">Find medicines in minutes</p>
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-muted-text/50 mt-4">Prices may vary by pharmacy and are subject to availability.</p>

      {/* ----------------------------------------------------- */}
      {/* MODALS / POPUPS */}
      {/* ----------------------------------------------------- */}
      <AnimatePresence>
        {selectedMedInfo && (
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
              className="glass-panel w-full max-w-lg rounded-2xl border border-dark-border/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-start p-6 border-b border-dark-border/40 bg-dark-card/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center">
                     <IoHardwareChip className="text-muted-text text-2xl" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white leading-tight">{selectedMedInfo.name}</h3>
                     <span className="text-[10px] uppercase font-bold text-emerald-green tracking-wider">{selectedMedInfo.type}</span>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedMedInfo(null)}
                  className="p-1.5 text-muted-text hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                
                <div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-muted-text">Overview</h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {selectedMedInfo.desc}. Used for temporary relief of minor aches and pains, and to reduce fever.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 rounded-xl bg-dark-bg/40 border border-dark-border/40">
                     <span className="text-[10px] text-muted-text block mb-1">Manufacturer</span>
                     <span className="text-sm font-semibold text-white">GSK Pharmaceuticals</span>
                   </div>
                   <div className="p-3 rounded-xl bg-dark-bg/40 border border-dark-border/40">
                     <span className="text-[10px] text-muted-text block mb-1">Prescription Requirement</span>
                     <span className={`text-sm font-semibold ${selectedMedInfo.requiresPrescription ? 'text-red-400' : 'text-emerald-green'}`}>
                       {selectedMedInfo.requiresPrescription ? 'Rx Required' : 'Over the Counter (OTC)'}
                     </span>
                   </div>
                </div>

                {/* AI Recommendations */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-electric-blue flex items-center gap-1.5">
                    <IoHardwareChip /> AI Recommendations
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-white/80">
                      <IoCheckmarkCircle className="text-emerald-green mt-0.5 flex-shrink-0" /> Take medicine after meal to avoid gastric irritation.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white/80">
                      <IoWaterOutline className="text-electric-blue mt-0.5 flex-shrink-0" /> Drink plenty of water throughout the day.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white/80">
                      <IoWarningOutline className="text-amber-400 mt-0.5 flex-shrink-0" /> Do not exceed {selectedMedInfo.frequency * 2} tablets in 24 hours.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white/80">
                      <IoWineOutline className="text-red-400 mt-0.5 flex-shrink-0" /> Avoid alcohol consumption while on this medication.
                    </li>
                  </ul>
                </div>

                {/* Alternative Medicines */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-muted-text flex items-center gap-1.5">
                    <IoSwapVerticalOutline /> Alternative Medicines (Cheaper)
                  </h4>
                  <div className="p-3 rounded-xl border border-dark-border/40 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                    <div>
                      <span className="text-sm font-semibold text-white block">Crocin 650mg</span>
                      <span className="text-[10px] text-emerald-green">Save 15%</span>
                    </div>
                    <span className="text-sm font-bold text-white">₹13.20</span>
                  </div>
                </div>

              </div>
              <div className="p-4 border-t border-dark-border/40 bg-dark-card/50 flex gap-3">
                 <Button variant="secondary" className="flex-1" onClick={() => setSelectedMedInfo(null)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FindMedicines;
