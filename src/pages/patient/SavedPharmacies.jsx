import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoStorefrontOutline, IoHeartOutline, IoHeart, IoLocationOutline,
  IoCallOutline, IoStar, IoShieldCheckmark, IoCheckmarkCircle,
  IoNavigateOutline, IoTimeOutline, IoWarningOutline, IoCloseOutline,
  IoLogoWhatsapp, IoGlobeOutline, IoTrashOutline, IoInformationCircleOutline
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { usePatientData } from '../../context/PatientDataContext';
import { ROUTES } from '../../constants/routes';

export const SavedPharmacies = () => {
  const { savedPharmacies, removePharmacy, toggleSavePharmacy } = usePatientData();
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);

  const handleRemove = (phr) => {
    removePharmacy(phr.id);
    toast.success(`${phr.name} removed from saved.`, {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(239, 68, 68, 0.2)' }
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

  return (
    <div className="text-left font-poppins pb-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <IoHeart className="text-red-400" /> Saved Pharmacies
          </h2>
          <p className="text-sm text-muted-text mt-1">
            Your bookmarked pharmacies — quickly reserve or navigate anytime.
          </p>
        </div>
        <Link to={ROUTES.PATIENT.NEARBY_PHARMACIES}>
          <Button variant="secondary" className="px-5 py-2.5 text-sm border-dark-border/60">
            <IoStorefrontOutline className="mr-2" /> Find More Pharmacies
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {savedPharmacies.length === 0 && (
        <div className="glass-panel rounded-2xl p-16 border border-dark-border/40 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-4">
            <IoHeartOutline className="text-4xl text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Saved Pharmacies</h3>
          <p className="text-sm text-muted-text max-w-sm mb-6">
            Browse nearby pharmacies and tap the heart icon to save your favourites for quick access.
          </p>
          <Link to={ROUTES.PATIENT.NEARBY_PHARMACIES}>
            <Button variant="primary-green" className="px-6 py-3 font-bold">
              <IoLocationOutline className="mr-2" /> Explore Nearby Pharmacies
            </Button>
          </Link>
        </div>
      )}

      {/* Pharmacy Cards */}
      {savedPharmacies.length > 0 && (
        <div className="space-y-4">
          {savedPharmacies.map((phr) => (
            <motion.div
              key={phr.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass-panel rounded-2xl border border-dark-border/40 hover:border-emerald-green/30 transition-all duration-300 overflow-hidden flex flex-col md:flex-row group cursor-pointer"
              onClick={() => setSelectedPharmacy(phr)}
            >
              {/* Pharmacy Image */}
              <div className="w-full md:w-48 h-44 md:h-auto relative flex-shrink-0 bg-dark-bg/50">
                <img
                  src={phr.image}
                  alt={phr.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1525] via-transparent to-transparent" />
                {phr.aiRecommended && (
                  <div className="absolute top-2 left-2 bg-electric-blue text-dark-bg text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                    <IoStar size={10} /> AI Pick
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                        {phr.name}
                        {phr.verified && (
                          <span className="text-emerald-green bg-emerald-green/10 text-[10px] px-1.5 py-0.5 rounded border border-emerald-green/20 uppercase tracking-wide flex items-center gap-1">
                            <IoCheckmarkCircle size={10} /> Verified
                          </span>
                        )}
                        {phr.is24x7 && (
                          <span className="text-electric-blue bg-electric-blue/10 text-[10px] px-1.5 py-0.5 rounded border border-electric-blue/20 uppercase">24×7</span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-text">
                        <span className="flex items-center gap-1"><IoStar className="text-amber-400" /> <strong className="text-white">{phr.rating}</strong> ({phr.reviews} reviews)</span>
                        <span className="flex items-center gap-1"><IoLocationOutline /> {phr.distance} KM away</span>
                        <span className="flex items-center gap-1"><IoTimeOutline /> {phr.time}</span>
                      </div>
                      <p className="text-xs text-muted-text mt-1.5 flex items-center gap-1.5">
                        <IoLocationOutline size={12} /> {phr.address}
                      </p>
                    </div>
                    {/* Remove Heart */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(phr); }}
                      className="p-2 rounded-full text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                      title="Remove from saved"
                    >
                      <IoHeart size={18} />
                    </button>
                  </div>

                  {/* Availability Badge */}
                  <div className="inline-block mt-2">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded border flex items-center gap-1.5 ${
                      phr.availabilityPercent === 100
                        ? 'bg-emerald-green/10 text-emerald-green border-emerald-green/20'
                        : phr.availabilityPercent > 70
                          ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/20'
                          : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                    }`}>
                      {phr.availabilityPercent === 100 ? <IoCheckmarkCircle size={12} /> : <IoWarningOutline size={12} />}
                      {phr.availabilityText}
                    </span>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] uppercase font-semibold text-muted-text tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <IoShieldCheckmark className="text-emerald-green text-sm" />
                    Trust Score <span className="text-white ml-1">{phr.trustScore}/100</span>
                  </div>
                  {phr.ownerVerified && (
                    <div className="flex items-center gap-1.5">
                      <IoCheckmarkCircle className="text-emerald-green text-sm" /> Owner Verified
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    {phr.isOpen
                      ? <><div className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" /> Open Now <span className="text-muted-text/50 lowercase font-normal ml-1">· Closes {phr.closingTime}</span></>
                      : <><div className="w-2 h-2 rounded-full bg-red-500" /> Closed</>
                    }
                  </div>
                  <div className="flex items-center gap-1.5">Est. <span className="text-white font-bold ml-1">{phr.priceLevel}</span></div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="w-full md:w-44 p-5 border-t md:border-t-0 md:border-l border-dark-border/40 bg-dark-bg/20 flex flex-col justify-center gap-2">
                <div className="text-xs text-muted-text flex items-center justify-center gap-1.5 mb-1">
                  <IoCallOutline size={12} /> {phr.phone}
                </div>
                <Button
                  variant="secondary"
                  className="w-full py-2 text-xs border-dark-border hover:bg-white/5"
                  onClick={(e) => { e.stopPropagation(); setSelectedPharmacy(phr); }}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  className="w-full py-2 text-xs bg-dark-bg border border-emerald-green/40 text-emerald-green hover:bg-emerald-green/10"
                  onClick={(e) => handleReserve(phr, e)}
                >
                  <IoStorefrontOutline className="mr-1.5" /> Reserve
                </Button>
                <button
                  className="w-full py-2 text-[11px] text-muted-text hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  onClick={(e) => { e.stopPropagation(); window.open(`https://maps.google.com/?q=${encodeURIComponent(phr.address)}`, '_blank'); }}
                >
                  <IoNavigateOutline /> Navigate
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer badges */}
      {savedPharmacies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-dark-border/40">
          {[
            { icon: IoShieldCheckmark, label: 'Verified Pharmacies', sub: 'All stores are verified' },
            { icon: IoCheckmarkCircle, label: 'Secure Reservations', sub: 'Safe & encrypted' },
            { icon: IoStorefrontOutline, label: 'Trusted Partners', sub: 'Top-rated stores only' },
            { icon: IoTimeOutline, label: 'Fast Pickup', sub: 'Ready within 30 mins' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-emerald-green/30 flex items-center justify-center text-emerald-green flex-shrink-0">
                <item.icon size={16} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">{item.label}</p>
                <p className="text-[9px] text-muted-text">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PHARMACY DETAILS MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {selectedPharmacy && !showReserveModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-3xl rounded-2xl border border-dark-border/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Cover */}
              <div className="h-48 relative w-full bg-dark-bg">
                <img src={selectedPharmacy.image} alt={selectedPharmacy.name} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1525] to-transparent" />
                <button onClick={() => setSelectedPharmacy(null)} className="absolute top-4 right-4 p-2 bg-dark-bg/50 backdrop-blur rounded-full text-white hover:bg-white/20">
                  <IoCloseOutline size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                    {selectedPharmacy.name}
                    {selectedPharmacy.verified && (
                      <span className="text-emerald-green bg-emerald-green/20 backdrop-blur text-xs px-2 py-0.5 rounded border border-emerald-green/30 uppercase flex items-center gap-1">
                        <IoCheckmarkCircle size={11} /> Verified
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-white/80 mt-1 flex items-center gap-2"><IoLocationOutline /> {selectedPharmacy.address}</p>
                </div>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left */}
                <div className="md:col-span-2 space-y-6">
                  {/* Stats */}
                  <div className="flex gap-4 p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 flex-wrap">
                    <div className="text-center px-4 border-r border-dark-border/40">
                      <span className="text-2xl font-bold text-white flex items-center justify-center gap-1">{selectedPharmacy.rating} <IoStar className="text-amber-400 text-lg" /></span>
                      <span className="text-[10px] text-muted-text uppercase">{selectedPharmacy.reviews} Reviews</span>
                    </div>
                    <div className="text-center px-4 border-r border-dark-border/40">
                      <span className="text-2xl font-bold text-emerald-green">{selectedPharmacy.trustScore}</span>
                      <p className="text-[10px] text-muted-text uppercase">Trust Score</p>
                    </div>
                    <div className="text-center px-4">
                      <span className="text-lg font-bold text-white mt-1 block">{selectedPharmacy.distance} KM</span>
                      <span className="text-[10px] text-muted-text uppercase">{selectedPharmacy.time}</span>
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">About Pharmacy</h4>
                    <p className="text-xs text-muted-text leading-relaxed">
                      {selectedPharmacy.name} is a verified MedAccess partner with a trust score of {selectedPharmacy.trustScore}/100. Known for genuine medicines, fast service, and reliable stock availability.
                    </p>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><IoShieldCheckmark className="text-emerald-green" /> Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPharmacy.services?.map(srv => (
                        <span key={srv} className="px-3 py-1.5 text-[11px] rounded bg-white/5 border border-white/10 text-white/90">{srv}</span>
                      ))}
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="h-32 rounded-xl bg-dark-bg/50 border border-dark-border/40 flex items-center justify-center relative overflow-hidden group cursor-pointer"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedPharmacy.address)}`, '_blank')}
                  >
                    <IoLocationOutline className="text-3xl text-emerald-green" />
                    <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Button variant="primary-green" className="text-xs"><IoNavigateOutline className="mr-1" /> Open in Google Maps</Button>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-dark-bg/40 border border-dark-border/40 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Info</h4>
                    <div className="flex items-center gap-3 text-sm text-white/90">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"><IoCallOutline size={14} /></div>
                      {selectedPharmacy.phone}
                    </div>
                    {selectedPharmacy.whatsapp && (
                      <div className="flex items-center gap-3 text-sm text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0"><IoLogoWhatsapp size={14} /></div>
                        {selectedPharmacy.whatsapp}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-white/90">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"><IoGlobeOutline size={14} /></div>
                      Website
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-green/5 border border-emerald-green/20">
                    <h4 className="text-xs font-bold text-emerald-green uppercase tracking-wider mb-2">Working Hours</h4>
                    <div className="text-xs text-white space-y-1.5">
                      <div className="flex justify-between"><span>Mon – Sat</span><span>09:00 AM – {selectedPharmacy.closingTime}</span></div>
                      <div className="flex justify-between text-muted-text"><span>Sunday</span><span>Closed</span></div>
                    </div>
                  </div>

                  <Button variant="primary-green" className="w-full py-3" onClick={() => setShowReserveModal(true)}>
                    Reserve Medicines Now
                  </Button>
                  <button
                    onClick={() => handleRemove(selectedPharmacy)}
                    className="w-full py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl border border-red-400/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <IoTrashOutline /> Remove from Saved
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESERVATION MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {showReserveModal && selectedPharmacy && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark-bg/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="glass-panel w-full max-w-md rounded-2xl border border-emerald-green/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden"
            >
              <div className="p-5 border-b border-dark-border/40 flex justify-between items-center bg-[#091712]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <IoStorefrontOutline className="text-emerald-green" /> Reserve Medicines
                </h3>
                <button onClick={() => setShowReserveModal(false)} className="text-muted-text hover:text-white"><IoCloseOutline size={22} /></button>
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
                    Carry your original prescription. Reservation is valid for 24 hours.
                  </p>
                </div>
                <Button variant="primary-green" className="w-full py-3.5 text-sm font-bold" onClick={confirmReservation}>
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

export default SavedPharmacies;
