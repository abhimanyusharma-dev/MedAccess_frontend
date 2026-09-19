import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoChatbubblesOutline, IoCallOutline, IoMailOutline, IoLogoWhatsapp,
  IoWarningOutline, IoPeopleOutline, IoSearchOutline, IoTicketOutline,
  IoChevronDownOutline, IoChevronUpOutline, IoCloudUploadOutline,
  IoSendOutline, IoHappyOutline, IoAttachOutline, IoMicOutline,
  IoCheckmarkCircle, IoTimeOutline, IoShieldCheckmarkOutline,
  IoHeartOutline, IoDocumentTextOutline, IoDownloadOutline,
  IoLocationOutline, IoMedicalOutline, IoCallSharp, IoAlertCircleOutline,
  IoCloseOutline, IoAddOutline, IoStar, IoStarOutline,
  IoInformationCircleOutline, IoRefreshOutline, IoEyeOutline,
  IoPulseOutline, IoPhonePortraitOutline, IoGlobeOutline,
  IoBusinessOutline, IoFitnessOutline
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } }
};

// ── Mock Data ────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'How do I upload a prescription?', a: 'Go to Upload Prescription from the sidebar or dashboard. Click the upload zone or drag & drop your prescription image (JPG, PNG, PDF up to 5MB). Our AI will auto-detect medicines for you within seconds.' },
  { q: 'How do I reserve medicines at a pharmacy?', a: 'Browse Nearby Pharmacies, click on a pharmacy card and hit "Reserve Medicines". Choose pickup time, confirm the reservation and you\'ll receive a confirmation with a Reservation ID.' },
  { q: 'How do I cancel a reservation?', a: 'Go to Medicine Reservations in the sidebar. Find your active reservation and click "Cancel". Cancellations are free if done more than 2 hours before scheduled pickup.' },
  { q: 'How do I contact a pharmacy directly?', a: 'On the Nearby Pharmacies page, click any pharmacy card to open its detail view. You\'ll find their phone, WhatsApp, and email in the Contact Info section on the right.' },
  { q: 'How is AI medicine detection done?', a: 'Our AI uses advanced OCR (Optical Character Recognition) combined with a proprietary medical language model trained on millions of prescriptions to identify medicine names, dosages and frequencies from uploaded images.' },
  { q: 'How is my health data protected?', a: 'All your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are HIPAA-compliant and never share your data with third parties without explicit consent. You can request data deletion anytime from Settings.' },
  { q: 'How do I download my prescriptions?', a: 'Navigate to My Prescriptions from the sidebar. Click the download icon (↓) next to any prescription to save it as a PDF. You can also view it in-browser first.' },
  { q: 'How do I change my account password?', a: 'Go to Settings > Security > Change Password. Enter your current password, then set a new one. A confirmation email will be sent to your registered address.' },
  { q: 'How do I update my profile information?', a: 'Go to Settings > Profile. Edit your name, phone number, address, or emergency contact details and click "Save Changes".' },
  { q: 'How do I save a pharmacy for quick access?', a: 'On the Nearby Pharmacies page, click the heart icon (♡) on any pharmacy card. Saved pharmacies appear under Saved Pharmacies in the sidebar.' },
];

const CATEGORIES = [
  { label: 'Prescription Issues', icon: IoDocumentTextOutline },
  { label: 'Medicine Reservation', icon: IoTicketOutline },
  { label: 'Nearby Pharmacy', icon: IoLocationOutline },
  { label: 'Payment Problems', icon: IoMedicalOutline },
  { label: 'Order Tracking', icon: IoRefreshOutline },
  { label: 'Account & Login', icon: IoPeopleOutline },
  { label: 'Health Records', icon: IoPulseOutline },
  { label: 'Privacy & Security', icon: IoShieldCheckmarkOutline },
  { label: 'AI Assistant', icon: IoChatbubblesOutline },
  { label: 'Technical Problems', icon: IoAlertCircleOutline },
  { label: 'Notifications', icon: IoPhonePortraitOutline },
  { label: 'Other Issues', icon: IoInformationCircleOutline },
];

const MOCK_TICKETS = [
  { id: 'TKT-2341', issue: 'Prescription upload failing for PDF', date: '2 Jul 2026', assigned: 'Riya Sharma', priority: 'High', status: 'In Review', updated: '3 hrs ago' },
  { id: 'TKT-2289', issue: 'Medicine not showing in search', date: '28 Jun 2026', assigned: 'Amit Verma', priority: 'Medium', status: 'Resolved', updated: '1 day ago' },
  { id: 'TKT-2201', issue: 'Unable to cancel reservation', date: '20 Jun 2026', assigned: 'Support Bot', priority: 'Low', status: 'Closed', updated: '5 days ago' },
];

const CHAT_HISTORY = [
  { from: 'agent', text: 'Hello! Welcome to MedAccess Support. How can I help you today?', time: '10:02 AM' },
  { from: 'user', text: 'Hi, I am having trouble uploading my prescription.', time: '10:03 AM' },
  { from: 'agent', text: 'I understand. Could you tell me what file format you are trying to upload? We support JPG, PNG, and PDF up to 5MB.', time: '10:03 AM' },
  { from: 'user', text: 'It is a JPG file but the page just shows an error.', time: '10:04 AM' },
  { from: 'agent', text: 'Got it! This sometimes happens due to browser cache. Please try clearing your browser cache or use a different browser. If the issue persists, I will escalate it to our tech team right away.', time: '10:05 AM' },
];

const ARTICLES = [
  { title: 'Uploading a Prescription', desc: 'Step-by-step guide to upload and get AI analysis of your prescription.', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' },
  { title: 'Medicine Reservation Guide', desc: 'How to reserve medicines at nearby pharmacies and track your reservation.', img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop' },
  { title: 'Using the AI Scanner', desc: 'Understand how MedAccess AI detects medicines from your prescriptions.', img: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=400&auto=format&fit=crop' },
  { title: 'Finding Nearby Pharmacies', desc: 'How to search, filter, and save pharmacies near your location.', img: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=400&auto=format&fit=crop' },
  { title: 'Payment & Billing', desc: 'Understand how pricing works and how to manage payment settings.', img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400&auto=format&fit=crop' },
  { title: 'Privacy & Data Security', desc: 'Learn how your health data is stored securely and kept private.', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=400&auto=format&fit=crop' },
];

const STATUS_COLORS = {
  'Pending':   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'In Review': 'bg-electric-blue/15 text-electric-blue border-electric-blue/30',
  'Resolved':  'bg-emerald-green/15 text-emerald-green border-emerald-green/30',
  'Closed':    'bg-white/10 text-muted-text border-white/10',
  'Cancelled': 'bg-red-500/15 text-red-400 border-red-500/30',
};
const PRIORITY_COLORS = {
  'Low':       'text-emerald-green',
  'Medium':    'text-yellow-400',
  'High':      'text-orange-400',
  'Emergency': 'text-red-400',
};

// ── Component ────────────────────────────────────────────────────────────────
export const HelpSupport = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // FAQ
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');

  // Ticket form
  const [ticketForm, setTicketForm] = useState({ category: '', priority: 'Medium', subject: '', description: '', contact: 'email' });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [viewTicket, setViewTicket] = useState(null);

  // Chat
  const [chatMessages, setChatMessages] = useState(CHAT_HISTORY);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Feedback
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Global search
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const id = `TKT-${Math.floor(2400 + Math.random() * 100)}`;
    setGeneratedTicketId(id);
    const newTicket = {
      id, issue: ticketForm.subject, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      assigned: 'Support Team', priority: ticketForm.priority, status: 'Pending', updated: 'Just now'
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketSubmitted(true);
    toast.success(`Ticket ${id} raised successfully!`, { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0,230,118,0.2)' } });
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const msg = { from: 'user', text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        from: 'agent',
        text: 'Thank you for your message. Our support agent will review your query and respond shortly. You can also raise a ticket for priority support.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleFeedback = () => {
    if (!rating) { toast.error('Please select a rating first.', { style: { background: '#0B1728', color: '#FFF' } }); return; }
    setFeedbackSubmitted(true);
    toast.success('Feedback submitted. Thank you!', { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0,230,118,0.2)' } });
  };

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes((faqSearch || globalSearch).toLowerCase()) ||
    f.a.toLowerCase().includes((faqSearch || globalSearch).toLowerCase())
  );

  return (
    <motion.div
      className="text-left font-poppins pb-12 space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-green/15 border border-emerald-green/25 flex items-center justify-center">
              <IoHappyOutline className="text-emerald-green text-xl" />
            </span>
            Help &amp; Support
          </h1>
          <p className="text-sm text-muted-text mt-1 ml-1">We&apos;re here to help you anytime. Find answers, contact support, or report an issue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              type="text"
              placeholder="Search Help..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="bg-dark-bg/50 border border-dark-border/60 text-sm text-white placeholder:text-muted-text rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-emerald-green/50 transition-all w-52"
            />
          </div>
          <a href="tel:112" className="px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2 hover:bg-red-500/25 transition-colors">
            <IoAlertCircleOutline /> Emergency Contact
          </a>
          <button
            onClick={() => document.getElementById('raise-ticket').scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2.5 rounded-xl btn-premium text-xs font-bold flex items-center gap-2"
          >
            <IoAddOutline /> Raise Ticket
          </button>
        </div>
      </motion.div>

      {/* ── QUICK ACTION CARDS ────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-bold text-muted-text uppercase tracking-wider mb-4">Quick Support</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Chat with AI', sub: 'Instant AI answers', icon: IoChatbubblesOutline, color: 'emerald-green', action: () => navigate(ROUTES.PATIENT.AI_ASSISTANT) },
            { label: 'Live Support', sub: 'Agent online', icon: IoPeopleOutline, color: 'electric-blue', badge: 'Online', action: () => document.getElementById('live-chat').scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Call Support', sub: '+91 98765 00000', icon: IoCallOutline, color: 'purple-500', action: () => { window.location.href = 'tel:+919876500000'; } },
            { label: 'Email Support', sub: 'support@medaccess.in', icon: IoMailOutline, color: 'yellow-500', action: () => { window.location.href = 'mailto:support@medaccess.in'; } },
            { label: 'WhatsApp', sub: 'Chat instantly', icon: IoLogoWhatsapp, color: 'emerald-green', action: () => { window.open('https://wa.me/919876500000', '_blank'); } },
            { label: 'Report Issue', sub: 'Medical emergency', icon: IoWarningOutline, color: 'red-400', action: () => document.getElementById('emergency').scrollIntoView({ behavior: 'smooth' }) },
          ].map((c, i) => (
            <div
              key={i}
              onClick={c.action}
              className="glass-panel-interactive rounded-2xl p-4 text-center flex flex-col items-center gap-2 cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-16 h-16 bg-${c.color}/5 rounded-full blur-2xl group-hover:bg-${c.color}/10 transition-all duration-500`} />
              {c.badge && (
                <span className="absolute top-2 right-2 text-[9px] bg-emerald-green/20 text-emerald-green px-1.5 py-0.5 rounded-full border border-emerald-green/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse inline-block" />{c.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-${c.color}/10 border border-${c.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <c.icon className={`text-${c.color} text-2xl`} />
              </div>
              <span className="text-xs font-bold text-white leading-tight">{c.label}</span>
              <span className="text-[10px] text-muted-text">{c.sub}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── HELP CATEGORIES ───────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-bold text-muted-text uppercase tracking-wider mb-4">Help Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <div
              key={i}
              className="glass-panel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer group hover:border-emerald-green/30 border border-transparent transition-all duration-300 text-center"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-green/10 flex items-center justify-center group-hover:bg-emerald-green/20 transition-colors">
                <cat.icon className="text-emerald-green text-lg" />
              </div>
              <span className="text-[11px] font-semibold text-white leading-tight">{cat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="text-sm font-bold text-muted-text uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text text-sm" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
              className="bg-dark-bg/50 border border-dark-border/60 text-xs text-white placeholder:text-muted-text rounded-xl py-2 pl-8 pr-4 focus:outline-none focus:border-emerald-green/50 transition-all w-52"
            />
          </div>
        </div>
        <div className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <p className="text-sm text-muted-text text-center py-6">No FAQs match your search.</p>
          ) : filteredFaqs.map((faq, i) => (
            <div key={i} className="glass-panel rounded-xl border border-dark-border/30 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-semibold text-white group-hover:text-emerald-green transition-colors pr-4">{faq.q}</span>
                <span className="flex-shrink-0 text-muted-text">
                  {openFaq === i ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-muted-text leading-relaxed border-t border-dark-border/20 pt-3">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── RAISE TICKET + MY TICKETS ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="raise-ticket">
        {/* Ticket Form */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border border-dark-border/40">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <IoTicketOutline className="text-emerald-green" /> Raise a Support Ticket
          </h2>
          <p className="text-xs text-muted-text mb-5">Our team will respond within 2–4 hours.</p>

          <AnimatePresence mode="wait">
            {ticketSubmitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-green/15 border border-emerald-green/30 flex items-center justify-center">
                  <IoCheckmarkCircle className="text-emerald-green text-4xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Ticket Raised!</h3>
                  <p className="text-muted-text text-sm mt-1">Your ticket ID is <span className="text-emerald-green font-bold">{generatedTicketId}</span></p>
                  <p className="text-muted-text text-xs mt-1">We will reach out on your preferred contact method.</p>
                </div>
                <button onClick={() => { setTicketSubmitted(false); setTicketForm({ category: '', priority: 'Medium', subject: '', description: '', contact: 'email' }); }} className="text-xs text-emerald-green hover:underline">
                  Raise Another Ticket
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-text mb-1 block">Issue Category</label>
                    <select required value={ticketForm.category} onChange={e => setTicketForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-dark-bg/60 border border-dark-border/60 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-green/50 transition-all">
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-text mb-1 block">Priority</label>
                    <div className="flex gap-1">
                      {['Low', 'Medium', 'High', 'Emergency'].map(p => (
                        <button type="button" key={p}
                          onClick={() => setTicketForm(prev => ({ ...prev, priority: p }))}
                          className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${ticketForm.priority === p ? 'bg-emerald-green/15 border-emerald-green/40 text-emerald-green' : 'border-dark-border/40 text-muted-text hover:border-white/20'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-text mb-1 block">Subject</label>
                  <input required type="text" placeholder="Brief description of your issue" value={ticketForm.subject}
                    onChange={e => setTicketForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full bg-dark-bg/60 border border-dark-border/60 rounded-xl py-2 px-3 text-sm text-white placeholder:text-muted-text/60 focus:outline-none focus:border-emerald-green/50 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-text mb-1 block">Description</label>
                  <textarea required rows={3} placeholder="Explain your issue in detail..." value={ticketForm.description}
                    onChange={e => setTicketForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-dark-bg/60 border border-dark-border/60 rounded-xl py-2 px-3 text-sm text-white placeholder:text-muted-text/60 focus:outline-none focus:border-emerald-green/50 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 border border-dashed border-dark-border/60 rounded-xl py-3 text-xs text-muted-text cursor-pointer hover:border-emerald-green/40 transition-colors">
                    <IoCloudUploadOutline className="text-emerald-green" /> Upload Screenshot
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <label className="flex items-center justify-center gap-2 border border-dashed border-dark-border/60 rounded-xl py-3 text-xs text-muted-text cursor-pointer hover:border-emerald-green/40 transition-colors">
                    <IoDocumentTextOutline className="text-emerald-green" /> Upload Prescription
                    <input type="file" className="hidden" accept=".pdf,image/*" />
                  </label>
                </div>
                <div>
                  <label className="text-xs text-muted-text mb-2 block">Preferred Contact</label>
                  <div className="flex gap-2">
                    {['email', 'phone', 'whatsapp'].map(m => (
                      <button type="button" key={m}
                        onClick={() => setTicketForm(p => ({ ...p, contact: m }))}
                        className={`px-3 py-1.5 rounded-lg text-[11px] capitalize border transition-all ${ticketForm.contact === m ? 'bg-emerald-green/15 border-emerald-green/40 text-emerald-green font-bold' : 'border-dark-border/40 text-muted-text'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl btn-premium text-sm font-bold flex items-center justify-center gap-2">
                  <IoTicketOutline /> Submit Ticket
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* My Tickets */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border border-dark-border/40 overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <IoDocumentTextOutline className="text-emerald-green" /> My Support Tickets
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-[440px] pr-1">
            {tickets.map((t, i) => (
              <div key={i} className="p-3 rounded-xl bg-dark-bg/40 border border-white/5 hover:border-emerald-green/20 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono text-emerald-green font-bold">{t.id}</span>
                    <p className="text-sm text-white font-semibold mt-0.5 leading-tight">{t.issue}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-muted-text">
                    <span>{t.date}</span>
                    <span className={`font-bold ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                    <span>↻ {t.updated}</span>
                  </div>
                  <button onClick={() => setViewTicket(t)} className="text-[10px] text-emerald-green hover:underline flex items-center gap-1">
                    <IoEyeOutline /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── LIVE CHAT ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants} id="live-chat" className="glass-panel rounded-2xl border border-dark-border/40 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border/30 bg-dark-bg/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-green/15 flex items-center justify-center">
              <IoPeopleOutline className="text-emerald-green" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Live Customer Support</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse" />
                <span className="text-[10px] text-emerald-green font-semibold">Agent Online · Riya Sharma</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-muted-text">Avg. response: 2 min</span>
        </div>

        <div className="h-72 overflow-y-auto p-5 space-y-3 bg-dark-bg/10">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === 'user' ? 'bg-emerald-green text-dark-bg font-medium rounded-br-sm' : 'bg-dark-bg/60 border border-dark-border/40 text-white rounded-bl-sm'}`}>
                {msg.text}
                <div className={`text-[9px] mt-1 ${msg.from === 'user' ? 'text-dark-bg/60 text-right' : 'text-muted-text'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-dark-bg/60 border border-dark-border/40 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                {[0, 150, 300].map(d => (
                  <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-text"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d / 1000 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-5 py-3 border-t border-dark-border/30 flex items-center gap-3">
          <button className="p-2 rounded-xl text-muted-text hover:text-white hover:bg-white/5 transition-colors"><IoHappyOutline size={18} /></button>
          <button className="p-2 rounded-xl text-muted-text hover:text-white hover:bg-white/5 transition-colors"><IoAttachOutline size={18} /></button>
          <button className="p-2 rounded-xl text-muted-text hover:text-white hover:bg-white/5 transition-colors"><IoMicOutline size={18} /></button>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleChatSend()}
            placeholder="Type a message..."
            className="flex-1 bg-dark-bg/50 border border-dark-border/60 rounded-xl py-2 px-4 text-sm text-white placeholder:text-muted-text/60 focus:outline-none focus:border-emerald-green/50 transition-all"
          />
          <button onClick={handleChatSend} className="w-9 h-9 rounded-xl bg-emerald-green flex items-center justify-center text-dark-bg hover:bg-emerald-green/80 transition-colors flex-shrink-0">
            <IoSendOutline size={16} />
          </button>
        </div>
      </motion.div>

      {/* ── EMERGENCY HELP ────────────────────────────────────── */}
      <motion.div variants={itemVariants} id="emergency">
        <div className="flex items-center gap-2 mb-4">
          <IoAlertCircleOutline className="text-red-400 text-xl" />
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider">Emergency Help</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Ambulance', num: '108', icon: IoCallSharp, color: 'red' },
            { label: 'Nearest Hospital', num: '104', icon: IoMedicalOutline, color: 'orange' },
            { label: 'Emergency Pharmacy', num: '1800-180-1104', icon: IoFitnessOutline, color: 'yellow' },
            { label: 'Poison Helpline', num: '1800-116-117', icon: IoWarningOutline, color: 'red' },
            { label: 'Blood Bank', num: '1910', icon: IoHeartOutline, color: 'red' },
            { label: 'Call Doctor', num: '104', icon: IoPulseOutline, color: 'emerald' },
          ].map((em, i) => (
            <a key={i} href={`tel:${em.num}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center cursor-pointer transition-all
                ${em.color === 'red' ? 'bg-red-500/10 border-red-500/25 hover:bg-red-500/20 hover:border-red-500/40' :
                  em.color === 'orange' ? 'bg-orange-500/10 border-orange-500/25 hover:bg-orange-500/20' :
                  em.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/25 hover:bg-yellow-500/20' :
                  'bg-emerald-green/10 border-emerald-green/25 hover:bg-emerald-green/20'}`}>
              <em.icon className={`text-2xl ${em.color === 'red' ? 'text-red-400' : em.color === 'orange' ? 'text-orange-400' : em.color === 'yellow' ? 'text-yellow-400' : 'text-emerald-green'}`} />
              <span className="text-xs font-bold text-white">{em.label}</span>
              <span className="text-[10px] text-muted-text">{em.num}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* ── CONTACT INFORMATION ───────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-bold text-muted-text uppercase tracking-wider mb-4">Contact Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Phone', value: '+91 98765 00000', icon: IoCallOutline, color: 'emerald-green' },
            { label: 'Email', value: 'support@medaccess.in', icon: IoMailOutline, color: 'electric-blue' },
            { label: 'WhatsApp', value: '+91 98765 00000', icon: IoLogoWhatsapp, color: 'emerald-green' },
            { label: 'Office', value: 'Data Colony, Bhopal', icon: IoBusinessOutline, color: 'purple-500' },
            { label: 'Working Hours', value: '9 AM – 9 PM Daily', icon: IoTimeOutline, color: 'yellow-500' },
            { label: 'Response Time', value: '< 2 hours', icon: IoRefreshOutline, color: 'emerald-green' },
          ].map((c, i) => (
            <div key={i} className="glass-panel rounded-xl p-4 flex flex-col items-center gap-2 text-center border border-dark-border/30 group hover:border-emerald-green/25 transition-all">
              <div className={`w-9 h-9 rounded-xl bg-${c.color}/10 flex items-center justify-center`}>
                <c.icon className={`text-${c.color}`} />
              </div>
              <span className="text-[10px] text-muted-text uppercase tracking-wider">{c.label}</span>
              <span className="text-xs text-white font-semibold">{c.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── FEEDBACK ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-dark-border/40">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <IoStar className="text-yellow-400" /> Rate Your Support Experience
          </h2>
          <p className="text-xs text-muted-text mb-5">Your feedback helps us improve.</p>
          {feedbackSubmitted ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <IoCheckmarkCircle className="text-emerald-green text-4xl" />
              <p className="text-white font-bold">Thank you for your feedback!</p>
              <p className="text-xs text-muted-text">Rated {rating} out of 5 stars.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)}>
                    {s <= (hoverRating || rating)
                      ? <IoStar className="text-yellow-400 text-3xl hover:scale-110 transition-transform" />
                      : <IoStarOutline className="text-muted-text text-3xl hover:scale-110 transition-transform" />}
                  </button>
                ))}
                {rating > 0 && <span className="text-xs text-yellow-400 font-bold ml-2">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</span>}
              </div>
              <textarea rows={3} placeholder="Tell us what we can improve..." value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                className="w-full bg-dark-bg/60 border border-dark-border/60 rounded-xl py-2 px-3 text-sm text-white placeholder:text-muted-text/60 focus:outline-none focus:border-emerald-green/50 transition-all resize-none" />
              <button onClick={handleFeedback} className="w-full py-2.5 rounded-xl btn-premium text-sm font-bold">Submit Feedback</button>
            </div>
          )}
        </div>

        {/* Help Articles */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-border/40">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <IoDocumentTextOutline className="text-emerald-green" /> Help Articles
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-72">
            {ARTICLES.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/40 border border-white/5 hover:border-emerald-green/20 transition-all group cursor-pointer">
                <img src={a.img} alt={a.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                  <p className="text-[10px] text-muted-text leading-tight mt-0.5 line-clamp-1">{a.desc}</p>
                </div>
                <span className="text-[10px] text-emerald-green font-semibold flex-shrink-0 group-hover:underline">Read →</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── DOWNLOADS ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-sm font-bold text-muted-text uppercase tracking-wider mb-4">Downloads</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'User Guide (PDF)', icon: IoDocumentTextOutline },
            { label: 'FAQ PDF', icon: IoDownloadOutline },
            { label: 'Terms & Conditions', icon: IoDocumentTextOutline },
            { label: 'Privacy Policy', icon: IoShieldCheckmarkOutline },
          ].map((d, i) => (
            <button key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-bg/50 border border-dark-border/50 text-sm text-white hover:border-emerald-green/40 hover:text-emerald-green transition-all">
              <d.icon /> {d.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── BOTTOM METRICS ────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: '24×7 Support', sub: 'Always available', icon: IoTimeOutline },
            { label: '99% Resolution', sub: 'Rate guaranteed', icon: IoCheckmarkCircle },
            { label: '< 2 hrs', sub: 'Avg. response time', icon: IoRefreshOutline },
            { label: 'Verified Team', sub: 'Medically trained staff', icon: IoShieldCheckmarkOutline },
            { label: 'Secure Chat', sub: 'End-to-end encrypted', icon: IoGlobeOutline },
          ].map((m, i) => (
            <div key={i} className="glass-panel rounded-xl p-4 flex items-center gap-3 border border-dark-border/30 group hover:border-emerald-green/25 transition-all">
              <div className="w-10 h-10 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                <m.icon className="text-emerald-green text-xl" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">{m.label}</div>
                <div className="text-[10px] text-muted-text">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── TICKET DETAIL MODAL ───────────────────────────────── */}
      <AnimatePresence>
        {viewTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/80 backdrop-blur-sm"
            onClick={() => setViewTicket(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-panel w-full max-w-md rounded-2xl border border-dark-border/60 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-dark-border/30">
                <div>
                  <span className="text-xs font-mono text-emerald-green font-bold">{viewTicket.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{viewTicket.issue}</h3>
                </div>
                <button onClick={() => setViewTicket(null)} className="text-muted-text hover:text-white"><IoCloseOutline size={22} /></button>
              </div>
              <div className="p-5 space-y-3 text-sm">
                {[
                  { label: 'Status', value: <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${STATUS_COLORS[viewTicket.status]}`}>{viewTicket.status}</span> },
                  { label: 'Priority', value: <span className={`font-bold ${PRIORITY_COLORS[viewTicket.priority]}`}>{viewTicket.priority}</span> },
                  { label: 'Assigned To', value: viewTicket.assigned },
                  { label: 'Created On', value: viewTicket.date },
                  { label: 'Last Updated', value: viewTicket.updated },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border/20 last:border-0">
                    <span className="text-muted-text text-xs">{row.label}</span>
                    <span className="text-white text-xs">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <button onClick={() => setViewTicket(null)} className="w-full py-2.5 rounded-xl btn-premium text-sm font-bold">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default HelpSupport;
