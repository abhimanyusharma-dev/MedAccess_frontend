import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';
import logo from '../../assets/finallogo.png';
import landingBg from '../../assets/landing_finalbg.png';
import findMedicineBg from '../../assets/fm_bg.png';
import pharmacyBg from '../../assets/GYP_bg.png';

// ── Animated Counter ─────────────────────────────────────────────────────────
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(val) { node.textContent = Math.floor(val).toLocaleString() + suffix; }
    });
    return () => controls.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

// ── Reusable Section Heading ──────────────────────────────────────────────────
const SectionHeading = ({ tag, title, subtitle }) => (
  <div className="text-center mb-16">
    {tag && (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E676]/10 border border-[#00E676]/25 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
        <span className="text-[11px] font-bold text-[#00E676] tracking-[0.2em] uppercase">{tag}</span>
      </div>
    )}
    <h2 className="text-[38px] md:text-[46px] font-black text-white leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">{title}</h2>
    {subtitle && <p className="text-[16px] text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">{subtitle}</p>}
  </div>
);

const FeatureRow = ({ icon, title, desc, activeColor, glowColor }) => (
  <div className={`flex items-center gap-4 p-3.5 rounded-xl bg-[#0B1F3A]/40 border border-white/5 hover:bg-[#0B1F3A]/70 transition-all duration-300 group hover:border-${activeColor}/40 cursor-default shadow-sm hover:shadow-[0_4px_15px_${glowColor}] backdrop-blur-[2px]`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-${activeColor}/20 text-${activeColor} transition-all duration-300 group-hover:shadow-[0_0_15px_${glowColor}] border border-${activeColor}/30`}>
      {icon}
    </div>
    <div>
      <div className="text-[14.5px] font-bold text-white tracking-wide drop-shadow-md">{title}</div>
      <div className="text-[12px] text-gray-200 mt-0.5 font-medium drop-shadow-md">{desc}</div>
    </div>
  </div>
);

// ── Nav sections for scroll ───────────────────────────────────────────────────
const NAV_SECTIONS = ['home', 'how-it-works', 'features', 'for-pharmacies', 'about-us', 'contact'];
const NAV_LABELS   = ['Home', 'How It Works', 'Features', 'For Pharmacies', 'About Us', 'Contact'];

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  // Intersection observer to highlight active nav
  useEffect(() => {
    const observers = [];
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveNav(id);
      }, { threshold: 0.3 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContact = (e) => {
    e.preventDefault();
    setContactSent(true);
  };

  // Stagger variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } })
  };

  return (
    <div className="min-h-screen font-sans text-white overflow-x-hidden relative bg-[#061322]">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-100" style={{ backgroundImage: `url(${landingBg})` }} />
        <div className="absolute inset-0 bg-[#061322]/25 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#061322_110%)] opacity-95" />
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,191,255,0.08)_0%,transparent_70%)] blur-[80px] mix-blend-screen" />
        <div className="absolute top-[15%] right-[-5%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(0,230,118,0.06)_0%,transparent_70%)] blur-[100px] mix-blend-screen" />
      </div>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-[#061322]/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1600px] mx-auto px-8 h-[88px] flex items-center justify-between">
          <div onClick={() => scrollTo('home')} className="cursor-pointer flex items-center">
            <img src={logo} alt="MedAccess" className="h-[55px] drop-shadow-[0_0_15px_rgba(0,230,118,0.25)]" />
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_SECTIONS.map((id, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-[15px] font-semibold transition-all relative pb-1 ${activeNav === id ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                {NAV_LABELS[i]}
                {activeNav === id && (
                  <div className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.6)] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1F3A]/60 border border-white/10 text-white text-[15px] font-bold hover:bg-[#0B1F3A] transition-all shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Login
            </button>
            <button onClick={() => navigate('/register')} className="px-7 py-2.5 rounded-xl bg-[#00E676] text-[#061322] text-[15px] font-extrabold hover:bg-[#12F28A] hover:shadow-[0_0_25px_rgba(0,230,118,0.4)] hover:-translate-y-0.5 transition-all duration-300">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="home" className="relative z-10 max-w-[1600px] mx-auto px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr_1fr] gap-8 items-stretch min-h-[640px]">

          {/* LEFT PATIENT CARD */}
          <div className="relative rounded-[32px] overflow-hidden bg-[#061322] border border-[#00E676]/30 shadow-[0_15px_50px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(0,230,118,0.05)] group hover:shadow-[0_15px_60px_rgba(0,230,118,0.15)] transition-all duration-500">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${findMedicineBg}")` }} />
            <div className="absolute inset-0 bg-[#061322]/10" />
            <div className="relative z-10 p-10 flex flex-col h-full">
              <div className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full bg-[#00E676]/20 border border-[#00E676]/40 mb-8 shadow-[0_0_20px_rgba(0,230,118,0.25)] backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#00E676] shadow-[0_0_10px_#00E676] animate-pulse" />
                <span className="text-[11px] font-bold text-[#00E676] tracking-[0.2em] drop-shadow-md">FOR PATIENTS</span>
              </div>
              <h2 className="text-[38px] font-black leading-[1.15] mb-8 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                Find Medicines.<br />Save Time.<br /><span className="text-[#00E676] drop-shadow-[0_0_20px_rgba(0,230,118,0.5)]">Stay Healthy.</span>
              </h2>
              <div className="flex flex-col gap-3.5 flex-1">
                <FeatureRow activeColor="[#00E676]" glowColor="rgba(0,230,118,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>} title="Upload Prescription" desc="Upload clear image of your prescription" />
                <FeatureRow activeColor="[#00E676]" glowColor="rgba(0,230,118,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} title="Find Medicines" desc="AI detects medicines and finds nearby stores" />
                <FeatureRow activeColor="[#00E676]" glowColor="rgba(0,230,118,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>} title="Reserve Medicines" desc="Reserve your medicines in advance" />
                <FeatureRow activeColor="[#00E676]" glowColor="rgba(0,230,118,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>} title="Navigate to Store" desc="Get directions and pick up your medicines" />
              </div>
              <button onClick={() => navigate('/register')} className="mt-8 w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-[#00E676] text-[#061322] text-[16px] font-extrabold hover:bg-[#12F28A] hover:shadow-[0_8px_30px_rgba(0,230,118,0.4)] hover:-translate-y-1 transition-all duration-300 border border-[#00E676]">
                <span>I'm a Patient</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>

          {/* CENTER ORBITAL HUB */}
          <div className="flex flex-col items-center justify-center relative py-6 w-full z-20">
            <div className="relative flex items-center justify-center" style={{ width: '560px', height: '560px' }}>
              <div className="absolute w-[500px] h-[500px] rounded-full border-[1.5px] border-dashed border-[#00BFFF]/20 shadow-[0_0_40px_rgba(0,191,255,0.05)]" />
              <svg className="absolute w-[500px] h-[500px] pointer-events-none opacity-40 z-0" viewBox="0 0 500 500">
                <circle cx="250" cy="250" r="180" fill="none" stroke="#00E676" strokeWidth="1" strokeDasharray="4,12" opacity="0.3" />
                <circle cx="250" cy="250" r="120" fill="none" stroke="#00BFFF" strokeWidth="1" strokeDasharray="2,8" opacity="0.4" />
                <line x1="250" y1="250" x2="70" y2="70" stroke="url(#cyan-grad2)" strokeWidth="2" opacity="0.6" />
                <line x1="250" y1="250" x2="430" y2="70" stroke="url(#green-grad2)" strokeWidth="2" opacity="0.6" />
                <line x1="250" y1="250" x2="70" y2="430" stroke="url(#green-grad2)" strokeWidth="2" opacity="0.6" />
                <line x1="250" y1="250" x2="430" y2="430" stroke="url(#cyan-grad2)" strokeWidth="2" opacity="0.6" />
                <defs>
                  <linearGradient id="cyan-grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                  <linearGradient id="green-grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E676" stopOpacity="0.8" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                </defs>
              </svg>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[500px] h-[500px] rounded-full z-10">
                <div className="absolute top-[38px] left-[74px] -translate-x-1/2 -translate-y-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex flex-col items-center gap-3">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-[#0B1F3A]/80 backdrop-blur-xl border-[1.5px] border-[#00E676]/50 shadow-[0_8px_30px_rgba(0,230,118,0.25),inset_0_0_20px_rgba(0,230,118,0.15)] flex items-center justify-center relative overflow-hidden cursor-default">
                      <div className="absolute inset-0 bg-[#00E676]/10 animate-pulse" />
                      <svg className="relative z-10" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
                    </div>
                    <span className="text-[13px] font-extrabold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">AI Powered</span>
                  </motion.div>
                </div>
                <div className="absolute top-[38px] right-[74px] translate-x-1/2 -translate-y-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex flex-col items-center gap-3">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-[#0B1F3A]/80 backdrop-blur-xl border-[1.5px] border-[#00BFFF]/50 shadow-[0_8px_30px_rgba(0,191,255,0.25),inset_0_0_20px_rgba(0,191,255,0.15)] flex items-center justify-center relative overflow-hidden cursor-default">
                      <div className="absolute inset-0 bg-[#00BFFF]/10 animate-pulse" style={{ animationDelay: '1s' }} />
                      <svg className="relative z-10" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="#00BFFF" stroke="none"/></svg>
                    </div>
                    <span className="text-[13px] font-extrabold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">Smart Match</span>
                  </motion.div>
                </div>
                <div className="absolute bottom-[38px] left-[74px] -translate-x-1/2 translate-y-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex flex-col items-center gap-3">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-[#0B1F3A]/80 backdrop-blur-xl border-[1.5px] border-[#00E676]/50 shadow-[0_8px_30px_rgba(0,230,118,0.25),inset_0_0_20px_rgba(0,230,118,0.15)] flex items-center justify-center relative overflow-hidden cursor-default">
                      <div className="absolute inset-0 bg-[#00E676]/10 animate-pulse" style={{ animationDelay: '2s' }} />
                      <svg className="relative z-10" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[13px] font-extrabold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">Trusted Net</span>
                  </motion.div>
                </div>
                <div className="absolute bottom-[38px] right-[74px] translate-x-1/2 translate-y-1/2">
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex flex-col items-center gap-3">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-[#0B1F3A]/80 backdrop-blur-xl border-[1.5px] border-[#00BFFF]/50 shadow-[0_8px_30px_rgba(0,191,255,0.25),inset_0_0_20px_rgba(0,191,255,0.15)] flex items-center justify-center relative overflow-hidden cursor-default">
                      <div className="absolute inset-0 bg-[#00BFFF]/10 animate-pulse" style={{ animationDelay: '3s' }} />
                      <svg className="relative z-10" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </div>
                    <span className="text-[13px] font-extrabold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">Healthcare</span>
                  </motion.div>
                </div>
              </motion.div>
              <div className="absolute z-30 flex items-center justify-center">
                <div className="absolute w-[460px] h-[460px] rounded-full z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 40% 35%, rgba(0,80,160,0.45) 0%, rgba(5,20,55,0.82) 55%, rgba(2,10,35,0.92) 100%)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1.5px solid rgba(0,191,255,0.45)', boxShadow: '0 0 60px rgba(0,150,255,0.30), 0 0 120px rgba(0,100,220,0.18), inset 0 0 60px rgba(0,100,200,0.20), inset 0 0 20px rgba(0,191,255,0.10)' }}>
                  <div className="absolute top-[10%] left-[15%] w-[55%] h-[28%] rounded-full opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(150,210,255,0.55) 0%, transparent 70%)' }} />
                </div>
                <div className="absolute w-[490px] h-[490px] rounded-full pointer-events-none z-0" style={{ boxShadow: '0 0 80px rgba(0,180,255,0.18), 0 0 30px rgba(0,191,255,0.12)' }} />
                <img src={logo} alt="MedAccess" className="relative z-10 w-[550px] max-w-full object-contain drop-shadow-[0_0_35px_rgba(0,230,118,0.65)] hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="mt-5 text-center px-4 relative z-20">
              <div className="text-[22px] font-black text-white leading-tight tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Connecting Patients and Pharmacies</div>
              <div className="mt-2 text-[13px] text-[#00BFFF] leading-relaxed font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">One Platform • Smarter Healthcare</div>
            </div>
            <div className="mt-8 text-center w-full relative z-20">
              <div className="flex items-center justify-center gap-6">
                <span className="flex items-center gap-2.5 text-[14.5px] font-bold text-white bg-[#0B1F3A]/90 backdrop-blur-xl px-5 py-2.5 rounded-xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Secure</span>
                <span className="flex items-center gap-2.5 text-[14.5px] font-bold text-white bg-[#0B1F3A]/90 backdrop-blur-xl px-5 py-2.5 rounded-xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>Reliable</span>
                <span className="flex items-center gap-2.5 text-[14.5px] font-bold text-white bg-[#0B1F3A]/90 backdrop-blur-xl px-5 py-2.5 rounded-xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Trusted Network</span>
              </div>
            </div>
          </div>

          {/* RIGHT PHARMACY CARD */}
          <div className="relative rounded-[32px] overflow-hidden bg-[#061322] border border-[#00BFFF]/30 shadow-[0_15px_50px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(0,191,255,0.05)] group hover:shadow-[0_15px_60px_rgba(0,191,255,0.15)] transition-all duration-500">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${pharmacyBg}")` }} />
            <div className="absolute inset-0 bg-[#061322]/10" />
            <div className="relative z-10 p-10 flex flex-col h-full">
              <div className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full bg-[#00BFFF]/20 border border-[#00BFFF]/40 mb-8 shadow-[0_0_20px_rgba(0,191,255,0.25)] backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#00BFFF] shadow-[0_0_10px_#00BFFF] animate-pulse" />
                <span className="text-[11px] font-bold text-[#00BFFF] tracking-[0.2em] drop-shadow-md">FOR PHARMACY OWNERS</span>
              </div>
              <h2 className="text-[38px] font-black leading-[1.15] mb-8 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                Grow Your Pharmacy.<br />Serve More.<br /><span className="text-[#00BFFF] drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">Increase Trust.</span>
              </h2>
              <div className="mb-6 rounded-2xl overflow-hidden bg-[#0B1F3A]/80 backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,191,255,0.2)]">
                <div className="bg-[#061322]/90 px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                  <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F56]" /><div className="w-3 h-3 rounded-full bg-[#FFBD2E]" /><div className="w-3 h-3 rounded-full bg-[#27C93F]" /></div>
                  <span className="text-[11px] text-gray-300 font-bold tracking-widest uppercase">Dashboard</span>
                </div>
                <div className="p-5 grid grid-cols-3 gap-3.5">
                  <div className="bg-[#0B1F3A] rounded-xl p-3.5 border border-white/5"><div className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Orders</div><div className="text-[20px] font-black text-white">320 <span className="text-[#00E676] text-[11px] ml-1">+12%</span></div></div>
                  <div className="bg-[#0B1F3A] rounded-xl p-3.5 border border-white/5"><div className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Customers</div><div className="text-[20px] font-black text-white">1,245 <span className="text-[#00E676] text-[11px] ml-1">+8%</span></div></div>
                  <div className="bg-[#0B1F3A] rounded-xl p-3.5 border border-white/5"><div className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Revenue</div><div className="text-[20px] font-black text-[#00E676]">₹ 24,580</div></div>
                  <div className="col-span-3 h-[50px] flex items-end gap-2 mt-3">
                    {[30,50,40,70,45,90,60,85,55,100].map((h,i)=>(
                      <div key={i} className={`flex-1 rounded-t-sm transition-all duration-500 hover:h-full ${i===5||i===9?'bg-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.6)]':'bg-[#00BFFF]/25'}`} style={{height:`${h}%`}} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3.5 flex-1">
                <FeatureRow activeColor="[#00BFFF]" glowColor="rgba(0,191,255,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>} title="Manage Inventory" desc="Add, update and manage medicines easily" />
                <FeatureRow activeColor="[#00BFFF]" glowColor="rgba(0,191,255,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>} title="Voice Stock Update" desc="Update stock using voice in seconds" />
                <FeatureRow activeColor="[#00BFFF]" glowColor="rgba(0,191,255,0.3)" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} title="Get More Customers" desc="Reach more customers in your area" />
              </div>
              <button onClick={() => navigate('/register')} className="mt-8 w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-[#00BFFF] text-[#061322] text-[16px] font-extrabold hover:bg-[#1EA7FF] hover:shadow-[0_8px_30px_rgba(0,191,255,0.4)] hover:-translate-y-1 transition-all duration-300 border border-[#00BFFF]">
                <span>I'm a Pharmacy Owner</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-8 py-6">
        <div className="grid grid-cols-4 bg-[#0B1F3A]/80 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] divide-x divide-white/10">
          {[
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#00E676', num: '10K+', label: 'Happy Users', sub: 'Trust us for better healthcare' },
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, color: '#00BFFF', num: '2000+', label: 'Verified Pharmacies', sub: 'Across 100+ Cities' },
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>, color: '#00E676', num: '50K+', label: 'Medicines Available', sub: 'Find all your medicines' },
            { icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, color: '#00BFFF', num: '24/7', label: 'Customer Support', sub: "We're here to help you" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-5 p-10 group">
              <div className="w-[64px] h-[64px] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.15)] border border-white/10 transition-transform group-hover:scale-110" style={{ background: `${s.color}15`, borderColor: `${s.color}30` }}>{s.icon}</div>
              <div>
                <div className="text-[34px] font-black text-white leading-tight">{s.num}</div>
                <div className="text-[15px] font-bold text-gray-100 mt-1">{s.label}</div>
                <div className="text-[12.5px] text-gray-400 mt-0.5 font-medium">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 max-w-[1600px] mx-auto px-8 py-24">
        <SectionHeading tag="Simple Process" title="How MedAccess Works" subtitle="From prescription upload to medicine pickup in just a few simple steps." />

        <div className="relative">
          {/* Vertical line connector */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00E676]/40 via-[#00BFFF]/40 to-transparent -translate-x-1/2" />

          <div className="space-y-8">
            {[
              { n: '01', title: 'Upload Prescription', desc: 'Take a photo or upload a PDF of your prescription instantly using your phone or computer.', color: '#00E676', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>, align: 'left' },
              { n: '02', title: 'AI Prescription Analysis', desc: 'Our AI instantly scans and extracts medicine names, dosages, and frequencies from your prescription.', color: '#00BFFF', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/></svg>, align: 'right' },
              { n: '03', title: 'Find Nearby Pharmacies', desc: 'The system searches verified pharmacies near your location and checks real-time medicine stock.', color: '#00E676', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, align: 'left' },
              { n: '04', title: 'Compare Stores', desc: 'Compare pharmacies by price, stock availability, trust score, ratings, and distance — all in one view.', color: '#00BFFF', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, align: 'right' },
              { n: '05', title: 'Reserve Medicines', desc: 'Reserve your medicines at the best pharmacy instantly. Get a confirmed Reservation ID.', color: '#00E676', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>, align: 'left' },
              { n: '06', title: 'Pickup or Delivery', desc: 'Walk in with your confirmation code to collect medicines, or request home delivery from supported stores.', color: '#00BFFF', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>, align: 'right' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: step.align === 'left' ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
                className={`flex items-center gap-8 ${step.align === 'right' ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 lg:max-w-[46%]">
                  <div className="group p-7 rounded-[24px] bg-[#0B1F3A]/80 backdrop-blur-xl border border-white/8 hover:border-opacity-60 transition-all duration-400 shadow-[0_10px_40px_rgba(0,0,0,0.35)] cursor-default relative overflow-hidden"
                    style={{ borderColor: `${step.color}18` }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${step.color}50`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = `${step.color}18`}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${step.color}08` }} />
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ background: `${step.color}15`, borderColor: `${step.color}30`, color: step.color }}>
                        {step.icon}
                      </div>
                      <span className="text-[48px] font-black leading-none" style={{ color: `${step.color}15` }}>{step.n}</span>
                    </div>
                    <h3 className="text-[20px] font-black text-white mb-2">{step.title}</h3>
                    <p className="text-[14px] text-gray-300 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
                {/* Center dot */}
                <div className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-black shadow-lg" style={{ background: `${step.color}15`, borderColor: step.color, color: step.color, boxShadow: `0 0 20px ${step.color}40` }}>
                    {i + 1}
                  </div>
                </div>
                <div className="hidden lg:block flex-1 lg:max-w-[46%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 max-w-[1600px] mx-auto px-8 py-24 border-t border-white/5">
        <SectionHeading tag="Platform Capabilities" title={<>Everything You Need In<br />One Healthcare Platform</>} subtitle="MedAccess brings together AI, real-time data, and a verified pharmacy network so you never struggle to find medicines again." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[
            { title: 'AI Prescription Scanner', desc: 'Upload any prescription and let AI extract all medicine details in seconds.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/></svg>, color: '#00E676' },
            { title: 'Medicine Detection', desc: 'AI reads medicine names, dosages, and schedules from handwritten or printed prescriptions.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, color: '#00BFFF' },
            { title: 'Nearby Pharmacy Finder', desc: 'Locate verified pharmacies near you with real-time stock and distance info.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, color: '#00E676' },
            { title: 'Medicine Reservation', desc: 'Reserve medicines in advance and get a guaranteed pickup confirmation.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, color: '#00BFFF' },
            { title: 'Smart Pharmacy Ranking', desc: 'AI ranks pharmacies by distance, stock, price, and trust score intelligently.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, color: '#00E676' },
            { title: 'AI Health Assistant', desc: 'Get instant AI-powered answers to medicine and healthcare queries anytime.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, color: '#00BFFF' },
            { title: 'Health Records', desc: 'Securely store and access all your prescriptions and health documents in one place.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: '#00E676' },
            { title: 'Secure Authentication', desc: 'Enterprise-grade security with encrypted login and data protection.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, color: '#00BFFF' },
            { title: 'Real-time Inventory', desc: 'Pharmacy stock is updated live so you never reach a store for an unavailable medicine.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/></svg>, color: '#00E676' },
            { title: 'Verified Pharmacies', desc: 'Every pharmacy on MedAccess is verified, trust-scored, and owner-authenticated.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>, color: '#00BFFF' },
            { title: 'Smart Notifications', desc: 'Get reminders for medicine pickups, reservation expiry, and health alerts.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, color: '#00E676' },
            { title: 'Digital Prescriptions', desc: 'Store, view, share, and download your prescriptions digitally anytime.', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, color: '#00BFFF' },
          ].map((f, i) => (
            <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              className="group p-6 rounded-[20px] bg-[#0B1F3A]/70 backdrop-blur-xl border border-white/6 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] transition-all duration-400 cursor-default relative overflow-hidden"
              style={{ borderColor: `${f.color}12` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}40`; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${f.color}12`; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${f.color}08` }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform duration-300" style={{ background: `${f.color}15`, borderColor: `${f.color}30`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: FOR PHARMACIES
      ══════════════════════════════════════════════════════════ */}
      <section id="for-pharmacies" className="relative z-10 max-w-[1600px] mx-auto px-8 py-24 border-t border-white/5">
        <SectionHeading tag="Pharmacy Partners" title="Grow Your Pharmacy with MedAccess" subtitle="Join our verified pharmacy network and serve more customers with smarter tools and real-time insights." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Benefits Grid */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: 'Receive Verified Orders', desc: 'Get pre-verified medicine reservations from patients nearby.', color: '#00BFFF' },
                { title: 'Manage Inventory', desc: 'Add, update and manage your entire medicine stock digitally.', color: '#00E676' },
                { title: 'AI Stock Management', desc: 'AI predicts demand and alerts you before stock runs out.', color: '#00BFFF' },
                { title: 'Voice Stock Update', desc: 'Update stock hands-free using voice commands in seconds.', color: '#00E676' },
                { title: 'Analytics Dashboard', desc: 'See orders, revenue, and customer trends in real time.', color: '#00BFFF' },
                { title: 'Customer Insights', desc: 'Understand your customers\' needs and buying patterns.', color: '#00E676' },
                { title: 'Smart Inventory Alerts', desc: 'Get notified when critical medicines are running low.', color: '#00BFFF' },
                { title: 'Store Ranking', desc: 'Rise in MedAccess rankings based on trust and performance.', color: '#00E676' },
                { title: 'Sales Reports', desc: 'Detailed daily, weekly, and monthly sales breakdowns.', color: '#00BFFF' },
                { title: 'Customer Feedback', desc: 'Collect and manage customer reviews to improve service.', color: '#00E676' },
                { title: 'Pharmacy Verification', desc: 'Get a verified badge to build instant patient trust.', color: '#00BFFF' },
                { title: 'Revenue Tracking', desc: 'Track earnings and growth with precision financial tools.', color: '#00E676' },
              ].map((b, i) => (
                <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#0B1F3A]/60 border border-white/5 hover:border-opacity-50 transition-all duration-300 group cursor-default"
                  style={{ borderColor: `${b.color}12` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${b.color}35`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${b.color}12`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${b.color}15`, color: b.color }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-white">{b.title}</div>
                    <div className="text-[12px] text-gray-400 mt-0.5">{b.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/register')} className="px-8 py-3.5 rounded-xl bg-[#00BFFF] text-[#061322] font-extrabold hover:bg-[#1EA7FF] hover:shadow-[0_8px_30px_rgba(0,191,255,0.4)] hover:-translate-y-0.5 transition-all duration-300">Register Your Pharmacy</button>
              <button className="px-8 py-3.5 rounded-xl bg-[#0B1F3A]/60 border border-[#00BFFF]/30 text-white font-bold hover:border-[#00BFFF]/60 transition-all">Become Verified →</button>
              <button className="px-8 py-3.5 rounded-xl border border-white/15 text-gray-300 font-semibold hover:text-white hover:border-white/30 transition-all">Learn More</button>
            </div>
          </div>

          {/* Dashboard Illustration */}
          <div className="rounded-[28px] overflow-hidden bg-[#0B1F3A]/80 backdrop-blur-xl border border-[#00BFFF]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,191,255,0.1)]">
            <div className="bg-[#061322]/90 px-5 py-3.5 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F56]" /><div className="w-3 h-3 rounded-full bg-[#FFBD2E]" /><div className="w-3 h-3 rounded-full bg-[#27C93F]" /></div>
              <span className="text-[12px] text-[#00BFFF] font-bold tracking-widest uppercase">Pharmacy Dashboard</span>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" /><span className="text-[11px] text-[#00E676] font-semibold">Live</span></div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[{l:'Orders Today',v:'87',c:'#00E676',d:'+14%'},{l:'Revenue',v:'₹18,240',c:'#00BFFF',d:'+9%'},{l:'Trust Score',v:'96',c:'#00E676',d:'+2'}].map((m,i)=>(
                  <div key={i} className="bg-[#061322]/80 rounded-xl p-4 border border-white/5">
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wide mb-1">{m.l}</div>
                    <div className="text-[22px] font-black text-white">{m.v}</div>
                    <div className="text-[11px] font-bold mt-0.5" style={{color:m.c}}>{m.d}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#061322]/80 rounded-xl p-4 border border-white/5">
                <div className="text-[12px] font-bold text-white mb-3">Weekly Revenue</div>
                <div className="h-[80px] flex items-end gap-2">
                  {[45,60,40,80,55,95,70].map((h,i)=>(
                    <div key={i} className="flex-1 rounded-t-md transition-all duration-300 hover:opacity-80" style={{height:`${h}%`,background:i===5?'linear-gradient(to top, #00BFFF, #00E676)':'rgba(0,191,255,0.2)'}} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><span key={d}>{d}</span>)}
                </div>
              </div>
              <div className="bg-[#061322]/80 rounded-xl p-4 border border-white/5">
                <div className="text-[12px] font-bold text-white mb-3">Recent Reservations</div>
                {[{name:'Paracetamol 650mg',status:'Ready',t:'2m ago'},{name:'Azithromycin 500mg',status:'Pending',t:'5m ago'},{name:'Vitamin D3 60K',status:'Confirmed',t:'8m ago'}].map((r,i)=>(
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-[13px] text-white font-medium">{r.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500">{r.t}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:r.status==='Ready'?'rgba(0,230,118,0.15)':r.status==='Confirmed'?'rgba(0,191,255,0.15)':'rgba(255,189,46,0.15)',color:r.status==='Ready'?'#00E676':r.status==='Confirmed'?'#00BFFF':'#FFBD2E'}}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: ABOUT US
      ══════════════════════════════════════════════════════════ */}
      <section id="about-us" className="relative z-10 max-w-[1600px] mx-auto px-8 py-24 border-t border-white/5">
        <SectionHeading tag="Our Story" title="About MedAccess" subtitle="We are building the future of pharmacy access — where every patient can find their medicines instantly, and every pharmacy can grow with technology." />

        {/* Mission + Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Our Mission', title: 'Patient First, Always', body: 'To make essential medicines accessible to every patient — no matter where they are — by connecting them with verified pharmacies through intelligent technology.', color: '#00E676', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
            { label: 'Our Vision', title: 'Smarter Healthcare for Bharat', body: 'A future where every prescription is processed by AI, every pharmacy is digitally connected, and patients spend less time searching and more time healing.', color: '#00BFFF', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
            { label: 'Why We Built This', title: 'The Problem We Solve', body: 'Millions of patients waste hours visiting multiple pharmacies only to find medicines out of stock. MedAccess eliminates this with real-time inventory search and instant reservation.', color: '#00E676', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
          ].map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="p-7 rounded-[24px] bg-[#0B1F3A]/70 backdrop-blur-xl border border-white/6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default"
              style={{ borderColor: `${v.color}18` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `${v.color}10` }} />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}>
                <div style={{ color: v.color }}>{v.icon}</div>
                <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: v.color }}>{v.label}</span>
              </div>
              <h3 className="text-[20px] font-black text-white mb-3">{v.title}</h3>
              <p className="text-[14px] text-gray-300 leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <h3 className="text-[22px] font-black text-white text-center mb-8">Our Core Values</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {['Patient First','AI Powered','Trusted Pharmacies','Secure Platform','Healthcare Innovation'].map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#0B1F3A]/60 border border-white/6 hover:border-[#00E676]/30 transition-all group cursor-default text-center">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 border border-[#00E676]/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-[13px] font-bold text-white">{val}</span>
            </div>
          ))}
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Verified Pharmacies', to: 2000, suffix: '+' },
            { label: 'Registered Users', to: 10000, suffix: '+' },
            { label: 'Medicines Reserved', to: 50000, suffix: '+' },
            { label: 'Cities Covered', to: 100, suffix: '+' },
            { label: 'Daily Active Users', to: 3500, suffix: '+' },
            { label: 'Customer Satisfaction', to: 98, suffix: '%' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-5 rounded-2xl bg-[#0B1F3A]/60 border border-white/5 hover:border-[#00E676]/25 transition-all text-center">
              <div className="text-[30px] font-black" style={{ color: i % 2 === 0 ? '#00E676' : '#00BFFF' }}>
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-[12px] text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: CONTACT
      ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative z-10 max-w-[1600px] mx-auto px-8 py-24 border-t border-white/5">
        <SectionHeading tag="Get In Touch" title="Contact Us" subtitle="We're always here to help. Reach out anytime and we'll respond within 2 hours." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info + Map */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Phone', val: '+91 98765 00000', sub: 'Mon–Sun, 9AM–9PM', color: '#00E676', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                { label: 'Email', val: 'support@medaccess.in', sub: 'Quick response guaranteed', color: '#00BFFF', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
                { label: 'WhatsApp', val: '+91 98765 00000', sub: 'Instant chat support', color: '#00E676', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
                { label: 'Office', val: 'Data Colony, Bhopal', sub: 'Madhya Pradesh, India', color: '#00BFFF', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
                { label: 'Working Hours', val: '9 AM – 9 PM', sub: 'Monday to Sunday', color: '#00E676', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { label: 'Emergency', val: '24 × 7 Support', sub: 'Medical emergencies only', color: '#00BFFF', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#0B1F3A]/60 border border-white/5 hover:border-opacity-50 transition-all cursor-default group"
                  style={{ borderColor: `${c.color}12` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${c.color}35`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${c.color}12`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15`, color: c.color }}>{c.icon}</div>
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">{c.label}</div>
                    <div className="text-[14px] font-bold text-white mt-0.5">{c.val}</div>
                    <div className="text-[11px] text-gray-400">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="h-52 rounded-2xl bg-[#0B1F3A]/60 border border-[#00E676]/15 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-sm font-bold text-white">Data Colony, Bhopal</span>
                <span className="text-xs text-gray-400">Madhya Pradesh, India</span>
              </div>
              <div className="absolute inset-0 bg-[#061322]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-xl bg-[#00E676] text-[#061322] font-bold text-sm hover:bg-[#12F28A] transition-colors">Open in Google Maps →</a>
              </div>
            </div>

            {/* Social + FAQ links */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {['Twitter','LinkedIn','Instagram','YouTube'].map((s, i) => (
                  <a key={s} href="#" className="w-9 h-9 rounded-xl bg-[#0B1F3A]/60 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00E676]/40 transition-all text-[10px] font-bold">
                    {s[0]}
                  </a>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => scrollTo('how-it-works')} className="text-[12px] text-[#00E676] hover:underline">FAQ →</button>
                <button onClick={() => navigate('/patient/support')} className="text-[12px] text-[#00BFFF] hover:underline">Support Ticket →</button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-[24px] bg-[#0B1F3A]/70 backdrop-blur-xl border border-white/8 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <h3 className="text-[22px] font-black text-white mb-1">Send Us a Message</h3>
            <p className="text-[13px] text-gray-400 mb-6">We'll get back to you within 2 hours.</p>
            {contactSent ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-16 h-16 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h4 className="text-white font-black text-lg">Message Sent!</h4>
                <p className="text-gray-400 text-sm text-center">Thank you for reaching out. Our team will respond shortly.</p>
                <button onClick={() => setContactSent(false)} className="text-[#00E676] text-sm hover:underline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-gray-400 mb-1 block font-semibold">Full Name</label>
                    <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} type="text" placeholder="Your full name" className="w-full bg-[#061322]/60 border border-white/8 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E676]/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[12px] text-gray-400 mb-1 block font-semibold">Email Address</label>
                    <input required value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="you@example.com" className="w-full bg-[#061322]/60 border border-white/8 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E676]/50 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-gray-400 mb-1 block font-semibold">Phone Number</label>
                    <input value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-[#061322]/60 border border-white/8 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E676]/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[12px] text-gray-400 mb-1 block font-semibold">Subject</label>
                    <input required value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))} type="text" placeholder="How can we help?" className="w-full bg-[#061322]/60 border border-white/8 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E676]/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 mb-1 block font-semibold">Message</label>
                  <textarea required rows={5} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us more about your query..." className="w-full bg-[#061322]/60 border border-white/8 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E676]/50 transition-all resize-none" />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl bg-[#00E676] text-[#061322] font-extrabold text-[15px] hover:bg-[#12F28A] hover:shadow-[0_8px_30px_rgba(0,230,118,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                  Send Message →
                </button>
                <p className="text-[11px] text-gray-500 text-center">⚡ Average response time: <span className="text-[#00E676] font-bold">under 2 hours</span></p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-8 pt-6 pb-20">
        <div className="bg-[#0B1F3A]/90 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#00E676]/10 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00BFFF]/10 to-transparent pointer-events-none" />
          <div className="flex-1 flex items-center gap-8 p-12 relative z-10">
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-[28px] bg-[#061322] border border-[#00E676]/40 shadow-[0_10px_30px_rgba(0,230,118,0.2)] flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 60 60" fill="none"><path d="M30 5 L50 14 L50 30 C50 42 30 52 30 52 C30 52 10 42 10 30 L10 14 Z" fill="rgba(0,230,118,0.15)" stroke="#00E676" strokeWidth="3" strokeLinejoin="round" /><rect x="22" y="34" width="16" height="13" rx="3" stroke="#00E676" strokeWidth="2.5" /><path d="M26 34V29C26 23 34 23 34 29V34" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" /><circle cx="30" cy="40" r="2.5" fill="#00E676" /></svg>
              </div>
              <div className="absolute -top-3 -right-3 w-[44px] h-[44px] rounded-xl bg-[#061322] border border-[#00BFFF]/40 shadow-[0_5px_20px_rgba(0,191,255,0.25)] flex items-center justify-center animate-bounce">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-[28px] font-black text-white leading-tight mb-2">Your Health.<br/>Our Priority.</h3>
              <p className="text-[14px] text-gray-300 leading-relaxed font-medium">Experience the future of pharmacy with MedAccess.<br/>Upload, Search, Reserve &amp; Collect – All in one place.</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-l border-r border-white/10 relative z-10 bg-[#061322]/40 backdrop-blur-md">
            <h3 className="text-[34px] font-black text-white mb-3">Get Started Now</h3>
            <p className="text-[15px] text-gray-300 mb-8 max-w-sm font-medium">Join MedAccess and simplify the way you get medicines today.</p>
            <div className="flex gap-5">
              <button onClick={() => navigate('/login')} className="px-8 py-3.5 rounded-xl bg-[#061322] border border-white/20 text-white text-[16px] font-bold hover:bg-[#0B1F3A] transition-all shadow-md">Login</button>
              <button onClick={() => navigate('/register')} className="px-8 py-3.5 rounded-xl bg-[#00E676] text-[#061322] text-[16px] font-extrabold hover:bg-[#12F28A] hover:shadow-[0_8px_30px_rgba(0,230,118,0.4)] hover:-translate-y-0.5 transition-all duration-300 border border-[#00E676]">Register</button>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-8 z-10">
            <img src="/pharmacy_building.png" alt="Pharmacy Building" className="h-[220px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-500" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="text-center py-8 text-gray-500 text-[13px] font-bold border-t border-white/5 bg-[#061322] uppercase tracking-widest">
        &copy; {new Date().getFullYear()} MedAccess Healthcare Network • Secure Medical Platform
      </footer>
    </div>
  );
};

export default LandingPage;
