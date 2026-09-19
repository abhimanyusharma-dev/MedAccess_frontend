import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoDocumentTextOutline, IoCloudUploadOutline, IoSearchOutline,
  IoDownloadOutline, IoTrashOutline, IoEyeOutline, IoCheckmarkCircle,
  IoTimeOutline, IoStorefrontOutline, IoReceiptOutline, IoHardwareChip,
  IoFilterOutline, IoCloseOutline, IoWarningOutline, IoRefreshOutline,
  IoCalendarOutline, IoMedicalOutline, IoQrCodeOutline, IoCallOutline, IoLocationOutline, IoCheckmarkDoneCircleOutline,
  IoCartOutline
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { usePatientData } from '../../context/PatientDataContext';
import { ROUTES } from '../../constants/routes';

const FILTERS = ['All', 'Scanned', 'Ordered', 'Completed', 'Pending'];

const getAvailabilityBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': 
    case 'delivered':
    case 'picked up': return { label: status, cls: 'bg-emerald-green/10 text-emerald-green border-emerald-green/20' };
    case 'pending':   return { label: 'Pending', cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20' };
    case 'ready for pickup': return { label: 'Ready for Pickup', cls: 'bg-electric-blue/10 text-electric-blue border-electric-blue/20' };
    case 'cancelled': return { label: 'Cancelled', cls: 'bg-red-500/10 text-red-500 border-red-500/20' };
    default:          return { label: status || 'Unknown', cls: 'bg-white/5 text-muted-text border-white/10' };
  }
};

export const MyPrescriptions = () => {
  const { prescriptions, deletePrescription } = usePatientData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [previewPrescription, setPreviewPrescription] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = prescriptions.filter(p => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Scanned' && p.type === 'scanned') ||
      (activeFilter === 'Ordered' && p.type === 'ordered') ||
      (activeFilter === 'Completed' && p.status === 'completed') ||
      (activeFilter === 'Pending' && p.status === 'pending');

    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      p.doctorName?.toLowerCase().includes(query) ||
      p.hospitalName?.toLowerCase().includes(query) ||
      p.pharmacyName?.toLowerCase().includes(query) ||
      p.title?.toLowerCase().includes(query) ||
      p.uploadDate?.includes(query);

    return matchesFilter && matchesSearch;
  });

  const scanned = filtered.filter(p => p.type === 'scanned');
  const ordered = filtered.filter(p => p.type === 'ordered');

  const handleDelete = (id) => {
    deletePrescription(id);
    toast.success('Prescription removed.', {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
    });
  };

  const handleDownload = (p) => {
    toast.success(`Downloading ${p.title}...`, {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
    });
  };

  return (
    <div className="text-left font-poppins pb-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <IoDocumentTextOutline className="text-emerald-green" /> My Prescriptions
          </h2>
          <p className="text-sm text-muted-text mt-1">
            Manage all your scanned and ordered prescriptions in one place.
          </p>
        </div>
        <Link to={ROUTES.PATIENT.UPLOAD_PRESCRIPTION}>
          <Button variant="primary-green" className="px-5 py-2.5 text-sm font-bold">
            <IoCloudUploadOutline className="mr-2" /> Upload New Prescription
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-emerald-green text-dark-bg border-emerald-green shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-dark-bg/50 text-muted-text border-dark-border/60 hover:text-white hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by doctor, pharmacy, date…"
            className="w-full bg-dark-bg/50 border border-dark-border/60 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder:text-muted-text/70 focus:outline-none focus:border-emerald-green/50"
          />
        </div>
      </div>

      {/* ---- Empty State ---- */}
      {filtered.length === 0 && (
        <div className="glass-panel rounded-2xl p-16 border border-dark-border/40 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-green/10 border border-emerald-green/20 flex items-center justify-center mb-4">
            <IoDocumentTextOutline className="text-4xl text-emerald-green" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Prescriptions Found</h3>
          <p className="text-sm text-muted-text max-w-sm mb-6">
            Upload your first prescription to get started. Our AI will scan it and automatically detect medicines.
          </p>
          <Link to={ROUTES.PATIENT.UPLOAD_PRESCRIPTION}>
            <Button variant="primary-green" className="px-6 py-3 font-bold">
              <IoCloudUploadOutline className="mr-2" /> Upload First Prescription
            </Button>
          </Link>
        </div>
      )}

      {/* ---- Section 1: Scanned Prescriptions ---- */}
      {scanned.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <IoHardwareChip className="text-electric-blue text-lg" />
              <h3 className="text-base font-bold text-white">Scanned Prescriptions</h3>
              <span className="text-xs text-muted-text bg-dark-bg/50 border border-dark-border/60 px-2 py-0.5 rounded-full">{scanned.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scanned.map(p => {
              const badge = getAvailabilityBadge(p.status);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-2xl border border-dark-border/40 hover:border-emerald-green/30 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Preview Image */}
                  <div
                    className="h-36 relative overflow-hidden cursor-pointer bg-dark-bg/50"
                    onClick={() => setPreviewPrescription(p)}
                  >
                    <img src={p.previewUrl} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1525] to-transparent" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-emerald-green/90 flex items-center justify-center shadow-lg">
                        <IoEyeOutline className="text-dark-bg text-xl" />
                      </div>
                    </button>
                    <div className="absolute bottom-2 left-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>{badge.label}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{p.title}</h4>
                    <div className="space-y-1.5 text-[11px] text-muted-text mb-3">
                      <p className="flex items-center gap-1.5"><IoMedicalOutline className="text-emerald-green" /> {p.doctorName}</p>
                      <p className="flex items-center gap-1.5"><IoStorefrontOutline className="opacity-60" /> {p.hospitalName}</p>
                      <p className="flex items-center gap-1.5"><IoCalendarOutline className="opacity-60" /> {p.uploadDate}</p>
                    </div>

                    {/* AI Status Row */}
                    <div className="flex items-center gap-3 mb-4 p-2.5 rounded-lg bg-dark-bg/40 border border-dark-border/40">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <IoHardwareChip className="text-electric-blue" />
                        <span className="text-white">AI: <span className="text-electric-blue font-bold">{p.aiStatus}</span></span>
                      </div>
                      <div className="w-px h-3 bg-dark-border/60" />
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <IoCheckmarkCircle className="text-emerald-green" />
                        <span className="text-white">Scan: <span className="text-emerald-green font-bold">{p.scanStatus}</span></span>
                      </div>
                      <div className="w-px h-3 bg-dark-border/60" />
                      <div className="text-[10px] text-white">
                        <span className="text-emerald-green font-bold">{p.medicineCount}</span> Meds
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Button variant="secondary" className="flex-1 py-2 text-[11px] border-dark-border/40 hover:border-emerald-green/30" onClick={() => setPreviewPrescription(p)}>
                        <IoEyeOutline className="mr-1" /> View
                      </Button>
                      <Button variant="secondary" className="flex-1 py-2 text-[11px] border-dark-border/40" onClick={() => handleDownload(p)}>
                        <IoDownloadOutline className="mr-1" /> Download
                      </Button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-xl border border-dark-border/40 text-muted-text hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 transition-colors"
                      >
                        <IoTrashOutline size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---- Section 2: Ordered Prescriptions ---- */}
      {(activeFilter === 'All' || activeFilter === 'Ordered' || activeFilter === 'Completed' || activeFilter === 'Pending') && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <IoReceiptOutline className="text-electric-blue text-lg" />
            <h3 className="text-base font-bold text-white">Ordered Prescriptions</h3>
            <span className="text-xs text-muted-text bg-dark-bg/50 border border-dark-border/60 px-2 py-0.5 rounded-full">{ordered.length}</span>
          </div>

          {ordered.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 border border-dark-border/40 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center mb-4">
                <IoCartOutline className="text-3xl text-electric-blue" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No ordered prescriptions yet</h3>
              <p className="text-xs text-muted-text max-w-sm mb-6">
                Reserve medicines from the Find Medicines page using your uploaded prescriptions to see them here.
              </p>
              <Link to={ROUTES.PATIENT.FIND_MEDICINES}>
                <Button variant="primary" className="px-6 py-2.5 text-sm font-bold bg-dark-bg border border-electric-blue/40 text-electric-blue hover:bg-electric-blue/10">
                  <IoSearchOutline className="mr-2" /> Go to Find Medicines
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ordered.map(p => {
                const badge = getAvailabilityBadge(p.status);
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-2xl border border-dark-border/40 hover:border-electric-blue/30 transition-all duration-300 flex flex-col md:flex-row overflow-hidden group"
                  >
                    {/* Preview Image Column */}
                    <div className="w-full md:w-56 flex flex-col border-r border-dark-border/40 flex-shrink-0">
                      <div
                        className="w-full h-32 md:h-40 relative cursor-pointer bg-dark-bg"
                        onClick={() => setPreviewPrescription(p)}
                      >
                        <img src={p.previewUrl} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1525] to-transparent" />
                        <div className="absolute bottom-2 left-3 flex flex-col">
                          <span className="text-xs font-bold text-white shadow-sm">{p.title}</span>
                          <span className="text-[10px] text-emerald-green font-semibold">View Prescription</span>
                        </div>
                      </div>
                      
                      {p.pharmacyImage && (
                        <div className="flex items-center gap-2 p-3 bg-dark-bg/40">
                          <img src={p.pharmacyImage} alt={p.pharmacyName} className="w-8 h-8 rounded-full border border-dark-border object-cover" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-white truncate">{p.pharmacyName}</span>
                            <span className="text-[10px] text-muted-text truncate">{p.pickupAddress}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        {/* Top row: Order info & Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1 text-xs text-muted-text">
                              <span>Order ID: <strong className="text-white">{p.reservationId}</strong></span>
                              <span className="text-dark-border/60">|</span>
                              <span className="flex items-center gap-1"><IoCalendarOutline /> {p.orderDate}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-text">
                              <span className="flex items-center gap-1"><IoMedicalOutline className="text-emerald-green" /> {p.doctorName}</span>
                              <span className="flex items-center gap-1"><IoStorefrontOutline /> {p.hospitalName}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wide ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Middle row: Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-dark-bg/40 border border-dark-border/40 mb-4">
                          <div>
                            <p className="text-[9px] text-muted-text uppercase">Total Medicines</p>
                            <p className="text-sm font-bold text-white">{p.totalMedicines}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-text uppercase">Total Quantity</p>
                            <p className="text-sm font-bold text-white">{p.totalQuantity}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-text uppercase">Payment Status</p>
                            <p className="text-xs font-bold text-emerald-green">{p.paymentStatus}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-text uppercase">Total Price</p>
                            <p className="text-sm font-black text-white">₹{p.totalAmount?.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Est Time & QR */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-electric-blue">
                            <IoTimeOutline size={14} />
                            <span>Estimated Pickup: <strong className="text-white">{p.estimatedPickupTime}</strong></span>
                          </div>
                          {p.qrCode && (
                            <div className="flex items-center gap-1.5 text-muted-text border border-dark-border/60 px-2 py-1 rounded bg-dark-bg/50">
                              <IoQrCodeOutline size={14} />
                              <span>Code: <strong className="text-white tracking-widest">{p.qrCode}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-dark-border/40">
                        <Button variant="primary-green" className="py-2 text-[11px] px-4 font-semibold" onClick={() => setSelectedOrder(p)}>
                          <IoEyeOutline className="mr-1.5" /> View Order Details
                        </Button>
                        <Button variant="secondary" className="py-2 text-[11px] px-3 border-dark-border/40" onClick={() => handleDownload(p)}>
                          <IoDownloadOutline className="mr-1.5" /> Invoice
                        </Button>
                        <Button variant="secondary" className="py-2 text-[11px] px-3 border-dark-border/40" onClick={() => setPreviewPrescription(p)}>
                          <IoDocumentTextOutline className="mr-1.5" /> Prescription
                        </Button>
                        <Button variant="secondary" className="py-2 text-[11px] px-3 border-electric-blue/30 text-electric-blue">
                          <IoRefreshOutline className="mr-1.5" /> Reorder
                        </Button>
                        
                        <div className="flex-1" /> {/* Spacer */}
                        
                        <button className="p-2 text-muted-text hover:text-white transition-colors" title="Contact Pharmacy">
                          <IoCallOutline size={16} />
                        </button>
                        {(p.status === 'pending' || p.status === 'Ready for Pickup') && (
                          <button className="text-[11px] text-red-400 hover:text-red-300 underline ml-2 transition-colors">
                            Cancel Reservation
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ---- Preview Modal ---- */}
      <AnimatePresence>
        {previewPrescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-sm"
            onClick={() => setPreviewPrescription(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel rounded-2xl border border-dark-border/60 shadow-2xl overflow-hidden max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-dark-border/40">
                <h3 className="font-bold text-white">{previewPrescription.title}</h3>
                <button onClick={() => setPreviewPrescription(null)} className="text-muted-text hover:text-white p-1">
                  <IoCloseOutline size={22} />
                </button>
              </div>
              <img
                src={previewPrescription.previewUrl}
                alt={previewPrescription.title}
                className="w-full object-contain max-h-[60vh]"
              />
              <div className="p-4 border-t border-dark-border/40 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setPreviewPrescription(null)}>Close</Button>
                <Button variant="primary-green" className="flex-1" onClick={() => handleDownload(previewPrescription)}>
                  <IoDownloadOutline className="mr-2" /> Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Order Details Modal ---- */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel rounded-2xl border border-dark-border/60 shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b border-dark-border/40 bg-dark-bg/30">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <IoReceiptOutline className="text-electric-blue" /> Order Details
                </h3>
                <button onClick={() => setSelectedOrder(null)} className="text-muted-text hover:text-white p-1">
                  <IoCloseOutline size={22} />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto space-y-6">
                
                {/* Pharmacy Info & QR */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-dark-bg/40 rounded-xl border border-dark-border/40">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-white">{selectedOrder.pharmacyName}</h4>
                    <p className="text-xs text-muted-text flex items-center gap-1"><IoLocationOutline /> {selectedOrder.pickupAddress}</p>
                    <div className="mt-2 text-[11px] text-white">
                      <p>Reservation ID: <span className="font-bold">{selectedOrder.reservationId}</span></p>
                      <p>Order Date: {selectedOrder.orderDate}</p>
                    </div>
                  </div>
                  {selectedOrder.qrCode && (
                    <div className="w-24 flex flex-col items-center justify-center p-2 border border-dark-border rounded-lg bg-white/5">
                      <IoQrCodeOutline className="text-4xl text-white mb-1" />
                      <span className="text-[9px] font-mono text-muted-text">{selectedOrder.qrCode}</span>
                    </div>
                  )}
                </div>

                {/* Pickup & Payment Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-emerald-green/5 border border-emerald-green/20 rounded-xl">
                    <p className="text-[10px] text-emerald-green uppercase tracking-wider mb-1">Pickup Info</p>
                    <p className="text-xs text-white font-bold">{selectedOrder.estimatedPickupTime}</p>
                    <p className="text-[10px] text-muted-text mt-1">Status: {selectedOrder.pickupStatus}</p>
                  </div>
                  <div className="p-3 bg-electric-blue/5 border border-electric-blue/20 rounded-xl">
                    <p className="text-[10px] text-electric-blue uppercase tracking-wider mb-1">Payment</p>
                    <p className="text-xs text-white font-bold">{selectedOrder.paymentStatus}</p>
                    <p className="text-[10px] text-muted-text mt-1">Method: Pay at Store</p>
                  </div>
                </div>

                {/* Medicines List */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">Ordered Medicines</h4>
                  <div className="border border-dark-border/40 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-dark-bg/60 text-muted-text">
                        <tr>
                          <th className="p-3 font-semibold">Medicine</th>
                          <th className="p-3 font-semibold">Dosage</th>
                          <th className="p-3 font-semibold">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/40">
                        {selectedOrder.orderedMedicines?.map((med, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-3 font-medium text-white">{med.name}</td>
                            <td className="p-3 text-muted-text">{med.dosage}</td>
                            <td className="p-3 text-white">{med.quantity}</td>
                          </tr>
                        )) || (
                          <tr><td colSpan="3" className="p-3 text-muted-text text-center">No medicines listed</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Totals */}
                <div className="p-4 bg-dark-bg/40 rounded-xl border border-dark-border/40 flex flex-col items-end gap-1 text-sm">
                  <div className="flex justify-between w-full max-w-xs text-muted-text">
                    <span>Subtotal:</span>
                    <span>₹{(selectedOrder.totalAmount - (selectedOrder.taxes || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-muted-text">
                    <span>Taxes:</span>
                    <span>₹{selectedOrder.taxes?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-white font-bold mt-2 pt-2 border-t border-dark-border/40">
                    <span>Total Cost:</span>
                    <span className="text-emerald-green text-lg">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-dark-border/40 flex gap-3 bg-dark-bg/30">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedOrder(null)}>Close</Button>
                <Button variant="primary-green" className="flex-1" onClick={() => handleDownload(selectedOrder)}>
                  <IoDownloadOutline className="mr-2" /> Download Invoice
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPrescriptions;
