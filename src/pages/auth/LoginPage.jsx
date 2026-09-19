/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import demoVideo from '../../assets/medacess_demo.mp4';
import logoImg from '../../assets/finallogo.png';
import bgImg from '../../assets/login_register_bg.png';
import sceneImg from '../../assets/3d_scene.png';

// ─── Icons (inline SVG to avoid extra deps) ────────────────────────────────
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconCompare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </svg>
);
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconUsers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconPill = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
  </svg>
);
const IconHeadphones = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const IconShield = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconRx = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconBottle = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v3"/><path d="M14 2v3"/><rect x="8" y="5" width="8" height="4" rx="1"/><rect x="6" y="9" width="12" height="13" rx="2"/><path d="M12 13v4"/><path d="M10 15h4"/></svg>;
const IconCapsule = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.5 3.5a5 5 0 0 0-7 7l7 7a5 5 0 0 0 7-7l-7-7z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>;
const IconReport = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 13h4"/><path d="M14 17h4"/></svg>;
const IconBag = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/><path d="M12 12v6"/><path d="M9 15h6"/></svg>;
const IconStrip = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/></svg>;
const IconPin = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>;

// ─── Floating Particles ─────────────────────────────────────────────────────
const Particles = () => {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="lp-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="lp-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Feature Row ────────────────────────────────────────────────────────────
const FeatureRow = ({ icon: Icon, title, desc, delay = 0 }) => (
  <div className="lp-feature-row" style={{ animationDelay: `${delay}ms` }}>
    <div className="lp-feature-icon">
      <Icon />
    </div>
    <div>
      <p className="lp-feature-title">{title}</p>
      <p className="lp-feature-desc">{desc}</p>
    </div>
  </div>
);

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, sublabel }) => (
  <div className="lp-stat-card">
    <div className="lp-stat-icon"><Icon /></div>
    <div>
      <p className="lp-stat-value">{value}</p>
      <p className="lp-stat-label">{label}</p>
      <p className="lp-stat-sub">{sublabel}</p>
    </div>
  </div>
);

// ─── Main LoginPage ─────────────────────────────────────────────────────────
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const videoRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const from = location.state?.from?.pathname || '';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const loggedUser = await login(data.email, data.password);
      if (from) { navigate(from, { replace: true }); return; }
      if (loggedUser.role === 'patient') navigate(ROUTES.PATIENT.DASHBOARD);
      else if (loggedUser.role === 'pharmacy') navigate(ROUTES.PHARMACY.DASHBOARD);
      else if (loggedUser.role === 'admin') navigate(ROUTES.ADMIN.DASHBOARD);
      else navigate(ROUTES.LANDING);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ensure video autoplays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="lp-root">
      {/* ── CSS injected via style tag ── */}
      <style>{`
        /* ── Root & BG ── */
        .lp-root {
          min-height: 100vh;
          background: url(${bgImg}) center center / cover no-repeat;
          background-color: #020611;
          color: #fff;
          font-family: 'Outfit', 'Inter', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Particles ── */
        .lp-particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .lp-particle {
          position: absolute;
          background: radial-gradient(circle, rgba(0,230,120,0.9) 0%, rgba(0,160,255,0.6) 100%);
          border-radius: 50%;
          animation: lp-float linear infinite;
        }
        @keyframes lp-float {
          0%   { transform: translateY(0px) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-120vh) scale(0.5); opacity: 0; }
        }

        /* ── Navbar ── */
        .lp-navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem;
          height: 68px;
          background: rgba(2,9,23,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,230,120,0.08);
          box-shadow: 0 2px 30px rgba(0,0,0,0.4);
        }
        .lp-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .lp-logo-img { height: 38px; width: auto; filter: drop-shadow(0 0 8px rgba(0,230,120,0.4)); }
        .lp-logo-text { font-size: 1.2rem; font-weight: 800; letter-spacing: 0.02em;
          background: linear-gradient(90deg, #00E676, #00B0FF);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .lp-logo-sub { font-size: 0.65rem; color: #64748b; margin-top: -3px; letter-spacing: 0.04em; }
        .lp-nav-links { display: flex; align-items: center; gap: 0.25rem; }
        .lp-nav-link {
          padding: 0.4rem 0.85rem; font-size: 0.82rem; font-weight: 500;
          color: #94a3b8; text-decoration: none; border-radius: 8px;
          position: relative; transition: color 0.2s;
        }
        .lp-nav-link::after {
          content: ''; position: absolute; bottom: 2px; left: 50%; right: 50%;
          height: 2px; background: linear-gradient(90deg, #00E676, #00B0FF);
          border-radius: 2px; transition: all 0.25s ease; opacity: 0;
        }
        .lp-nav-link:hover { color: #fff; }
        .lp-nav-link:hover::after, .lp-nav-link.active::after { left: 10%; right: 10%; opacity: 1; }
        .lp-nav-link.active { color: #00E676; }
        .lp-nav-actions { display: flex; align-items: center; gap: 0.6rem; }
        .lp-btn-ghost {
          padding: 0.45rem 1.1rem; font-size: 0.82rem; font-weight: 600;
          background: rgba(0,230,120,0.05); border: 1px solid rgba(0,230,120,0.2);
          border-radius: 10px; color: #fff; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .lp-btn-ghost:hover { background: rgba(0,230,120,0.1); border-color: rgba(0,230,120,0.4); box-shadow: 0 0 16px rgba(0,230,120,0.15); }
        .lp-btn-solid {
          padding: 0.45rem 1.2rem; font-size: 0.82rem; font-weight: 700;
          background: linear-gradient(135deg, #00C853, #00B0FF);
          border: none; border-radius: 10px; color: #000; cursor: pointer;
          transition: all 0.25s; display: flex; align-items: center; gap: 6px;
          text-decoration: none; box-shadow: 0 0 18px rgba(0,200,83,0.25);
        }
        .lp-btn-solid:hover { transform: translateY(-1px); box-shadow: 0 4px 24px rgba(0,200,83,0.35); }

        /* ── Main layout ── */
        .lp-main {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1.05fr 0.95fr;
          gap: 1.5rem; padding: 1.8rem 2.5rem 1rem;
          min-height: calc(100vh - 68px);
          align-items: center;
        }
        @media (max-width: 1100px) {
          .lp-main { grid-template-columns: 1fr 1fr; gap: 1.2rem; padding: 1.5rem 1.5rem; }
          .lp-center-col { display: none; }
        }
        @media (max-width: 720px) {
          .lp-main { grid-template-columns: 1fr; padding: 1rem; }
          .lp-left-col { display: none; }
          .lp-navbar { padding: 0 1rem; }
          .lp-nav-links { display: none; }
        }

        /* ── LEFT COLUMN ── */
        .lp-left-col { display: flex; flex-direction: column; gap: 1.4rem; }
        .lp-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.3rem 0.9rem; border-radius: 99px; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: rgba(0,230,120,0.1); border: 1px solid rgba(0,230,120,0.3);
          color: #00E676; width: fit-content;
          box-shadow: 0 0 12px rgba(0,230,120,0.15);
        }
        .lp-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #00E676; animation: lp-pulse 2s ease-in-out infinite; }
        @keyframes lp-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(0,230,120,0.6); } 50% { box-shadow: 0 0 0 6px rgba(0,230,120,0); } }
        .lp-heading { font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 800; line-height: 1.18; letter-spacing: -0.02em; }
        .lp-heading-accent {
          background: linear-gradient(90deg, #00E676 0%, #00C9FF 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .lp-subtext { font-size: 0.87rem; color: #64748b; line-height: 1.65; max-width: 340px; }
        .lp-features { display: flex; flex-direction: column; gap: 0.7rem; }
        .lp-feature-row {
          display: flex; align-items: center; gap: 14px;
          padding: 0.75rem 1rem;
          background: rgba(9,19,33,0.65);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,230,120,0.1);
          border-radius: 14px;
          transition: all 0.25s ease;
          animation: lp-slide-in 0.5s ease both;
          cursor: default;
        }
        .lp-feature-row:hover {
          border-color: rgba(0,230,120,0.3);
          background: rgba(0,230,120,0.06);
          transform: translateX(5px);
          box-shadow: 0 0 20px rgba(0,230,120,0.1), inset 0 0 20px rgba(0,230,120,0.03);
        }
        @keyframes lp-slide-in { from { opacity:0; transform: translateX(-20px); } to { opacity:1; transform: translateX(0); } }
        .lp-feature-icon {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,230,120,0.1); color: #00E676;
          border: 1px solid rgba(0,230,120,0.2);
          box-shadow: 0 0 10px rgba(0,230,120,0.12);
        }
        .lp-feature-title { font-size: 0.88rem; font-weight: 700; color: #e2e8f0; margin-bottom: 2px; }
        .lp-feature-desc { font-size: 0.73rem; color: #64748b; line-height: 1.4; }

        /* ── CENTER COLUMN ── */
        .lp-center-col {
          display: flex; flex-direction: column; align-items: center; gap: 1.2rem;
          position: relative;
        }
        .lp-phone-scene {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: visible;
          width: 100%;
          min-height: 600px;
          background: url(${sceneImg}) center center / 120% no-repeat;
        }
        /* 3D Phone Mockup */
        .lp-phone-wrapper {
          position: relative; z-index: 2;
          margin: 1rem 0 2.5rem 0;
          transform: perspective(1200px) scale(0.6) translateY(-70px); /* Slightly larger, perfectly straight */
          filter: drop-shadow(0 40px 60px rgba(0,0,0,0.8));
          transition: transform 0.5s ease;
        }
        .lp-phone-wrapper:hover {
          transform: perspective(1200px) scale(0.61) translateY(-75px);
        }
        .lp-phone-outer {
          width: 360px;
          background: #000;
          border-radius: 58px;
          padding: 14px;
          border: 4px solid #1c1c1e;
          box-shadow:
            inset 0 0 0 2px #444,
            inset 0 0 0 6px #000,
            0 0 0 1px #000,
            0 40px 80px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
        }
        /* Side button accents */
        .lp-phone-outer::before {
          content: '';
          position: absolute; right: -7px; top: 120px;
          width: 4px; height: 60px; border-radius: 2px;
          background: #1f1f1f;
        }
        .lp-phone-outer::after {
          content: '';
          position: absolute; left: -7px; top: 100px;
          width: 4px; height: 110px;
          background: transparent;
          border-top: 45px solid #1f1f1f;
          border-bottom: 45px solid #1f1f1f;
          border-radius: 2px;
        }
        /* Notch / Dynamic Island */
        .lp-phone-notch {
          width: 110px; height: 32px;
          background: #000;
          border-radius: 24px;
          position: absolute;
          top: 22px; left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 10px;
        }
        .lp-phone-notch::before {
          content: ''; width: 12px; height: 12px; border-radius: 50%;
          background: #0b0b0b;
          box-shadow: inset 0 0 2px rgba(255,255,255,0.1);
        }
        .lp-phone-notch::after {
          content: ''; width: 12px; height: 12px; border-radius: 50%;
          background: #101010;
          box-shadow: inset 0 0 4px rgba(0,0,255,0.4);
        }
        /* Screen */
        .lp-phone-screen {
          border-radius: 46px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 9/19.5;
          position: relative;
        }
        .lp-phone-screen video {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        /* Screen glare reflection */
        .lp-phone-glare {
          position: absolute; top: 0; left: 0; right: 0; height: 45%;
          background: linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none; z-index: 5;
        }
        /* Bottom bar */
        .lp-phone-home { width: 50px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 3px; margin: 8px auto 0; }
        /* Floating elements removed */

        /* ── RIGHT COLUMN (Auth Card) ── */
        .lp-right-col { display: flex; flex-direction: column; gap: 0; }
        .lp-auth-card {
          background: rgba(7,14,28,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(0,230,120,0.15);
          border-radius: 24px;
          padding: 2rem 1.8rem 1.6rem;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(0,200,120,0.06), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: lp-card-in 0.6s ease both;
        }
        @keyframes lp-card-in { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .lp-auth-head { text-align: center; margin-bottom: 1.3rem; }
        .lp-auth-title { font-size: 1.65rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }
        .lp-auth-sub { font-size: 0.8rem; color: #64748b; line-height: 1.5; }
        /* Tabs */
        .lp-tabs { display: flex; gap: 0; background: rgba(5,11,20,0.8); border-radius: 14px; padding: 4px; margin-bottom: 1.4rem; border: 1px solid rgba(255,255,255,0.06); }
        .lp-tab {
          flex: 1; padding: 0.6rem; font-size: 0.85rem; font-weight: 700;
          border-radius: 10px; border: none; cursor: pointer;
          transition: all 0.25s; background: transparent; color: #64748b;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .lp-tab.active {
          background: linear-gradient(135deg, #00C853 0%, #00B0FF 100%);
          color: #000; box-shadow: 0 0 18px rgba(0,200,83,0.3);
        }
        .lp-tab:not(.active):hover { color: #fff; background: rgba(255,255,255,0.05); }
        /* Form fields */
        .lp-field { margin-bottom: 0.85rem; }
        .lp-field-label { display: block; font-size: 0.73rem; font-weight: 600; color: #94a3b8; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
        .lp-input-wrap { position: relative; }
        .lp-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; }
        .lp-input-icon-right { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #475569; cursor: pointer; transition: color 0.2s; background: none; border: none; padding: 0; }
        .lp-input-icon-right:hover { color: #00E676; }
        .lp-input {
          width: 100%; padding: 0.7rem 2.8rem 0.7rem 2.8rem;
          background: rgba(5,11,20,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: #fff; font-size: 0.88rem;
          font-family: 'Outfit', sans-serif;
          outline: none; transition: all 0.25s; box-sizing: border-box;
        }
        .lp-input::placeholder { color: #334155; }
        .lp-input:focus { border-color: rgba(0,230,120,0.4); box-shadow: 0 0 0 3px rgba(0,230,120,0.08), 0 0 16px rgba(0,230,120,0.08); background: rgba(0,230,120,0.02); }
        .lp-input.error { border-color: rgba(239,68,68,0.4); }
        .lp-error { font-size: 0.7rem; color: #f87171; margin-top: 4px; }
        /* Row */
        .lp-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.1rem; }
        .lp-check-wrap { display: flex; align-items: center; gap: 7px; cursor: pointer; }
        .lp-check { width: 16px; height: 16px; border-radius: 5px; border: 1px solid rgba(0,230,120,0.3); background: rgba(0,230,120,0.05); cursor: pointer; accent-color: #00E676; }
        .lp-check-label { font-size: 0.78rem; color: #64748b; }
        .lp-forgot { font-size: 0.78rem; color: #00E676; text-decoration: none; transition: opacity 0.2s; }
        .lp-forgot:hover { opacity: 0.75; }
        /* CTA Button */
        .lp-cta-btn {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg, #00C853 0%, #00B0FF 100%);
          border: none; border-radius: 14px; color: #000; font-size: 0.92rem; font-weight: 800;
          cursor: pointer; transition: all 0.25s; letter-spacing: 0.02em;
          box-shadow: 0 0 24px rgba(0,200,83,0.3), 0 4px 16px rgba(0,0,0,0.3);
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .lp-cta-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(0,200,83,0.45), 0 0 30px rgba(0,176,255,0.2); }
        .lp-cta-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        /* Loader dots */
        .lp-loader { display: flex; gap: 5px; align-items: center; }
        .lp-loader span { width: 7px; height: 7px; border-radius: 50%; background: #000; animation: lp-bounce 0.8s ease-in-out infinite; }
        .lp-loader span:nth-child(2) { animation-delay: 0.15s; }
        .lp-loader span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes lp-bounce { 0%,80%,100% { transform: scale(0.7); opacity:0.5; } 40% { transform: scale(1); opacity:1; } }
        /* Divider */
        .lp-divider { display: flex; align-items: center; gap: 10px; margin: 1rem 0; }
        .lp-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .lp-divider-text { font-size: 0.72rem; color: #334155; white-space: nowrap; }
        /* Social */
        .lp-socials { display: flex; gap: 0.6rem; }
        .lp-social-btn {
          flex: 1; padding: 0.6rem 0.8rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(5,11,20,0.8); color: #cbd5e1; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Outfit', sans-serif;
        }
        .lp-social-btn:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); transform: translateY(-1px); }
        /* Register link */
        .lp-switch-link { text-align: center; margin-top: 1rem; padding-top: 0.9rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .lp-switch-link p { font-size: 0.78rem; color: #475569; }
        .lp-switch-link a { color: #00E676; font-weight: 700; text-decoration: none; transition: opacity 0.2s; }
        .lp-switch-link a:hover { opacity: 0.75; }
        /* Demo creds */
        .lp-demo {
          margin-top: 0.85rem;
          padding: 0.8rem 1rem;
          background: rgba(0,176,255,0.04);
          border: 1px solid rgba(0,176,255,0.1);
          border-radius: 12px;
        }
        .lp-demo-title { font-size: 0.65rem; font-weight: 700; color: #00B0FF; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
        .lp-demo p { font-size: 0.7rem; color: #64748b; font-family: monospace; line-height: 1.7; }
        .lp-demo p span { color: #94a3b8; }

        /* ── Stats Section ── */
        .lp-stats-section { position: relative; z-index: 1; padding: 0 2.5rem 1rem; }
        .lp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; border: 1px solid rgba(0,230,120,0.1); box-shadow: 0 0 30px rgba(0,0,0,0.3); }
        @media (max-width: 900px) { .lp-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .lp-stats-grid { grid-template-columns: 1fr; } .lp-stats-section { padding: 0 1rem 1rem; } }
        .lp-stat-card {
          background: rgba(7,14,28,0.92);
          backdrop-filter: blur(12px);
          border-right: 1px solid rgba(255,255,255,0.05);
          padding: 1.4rem 1.6rem;
          display: flex; align-items: center; gap: 1rem;
          transition: all 0.25s; cursor: default;
        }
        .lp-stat-card:hover { background: rgba(0,230,120,0.06); transform: translateY(-2px); }
        .lp-stat-card:last-child { border-right: none; }
        .lp-stat-icon {
          width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,230,120,0.08); color: #00E676;
          border: 1px solid rgba(0,230,120,0.15);
          box-shadow: 0 0 16px rgba(0,230,120,0.1);
        }
        .lp-stat-value { font-size: 1.4rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1; margin-bottom: 2px; }
        .lp-stat-label { font-size: 0.82rem; font-weight: 700; color: #e2e8f0; }
        .lp-stat-sub { font-size: 0.7rem; color: #475569; margin-top: 1px; }

        /* ── Footer CTA ── */
        .lp-footer-cta {
          position: relative; z-index: 1;
          margin: 0 2.5rem 1.5rem;
          background: linear-gradient(135deg, rgba(0,120,60,0.25) 0%, rgba(0,80,160,0.2) 100%);
          border: 1px solid rgba(0,230,120,0.15);
          border-radius: 20px; padding: 1.5rem 2rem;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.5rem; align-items: center;
          backdrop-filter: blur(12px);
          overflow: hidden;
        }
        .lp-footer-cta::before {
          content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 200px;
          background: linear-gradient(135deg, transparent, rgba(0,230,120,0.05));
          pointer-events: none;
        }
        @media (max-width: 720px) { .lp-footer-cta { grid-template-columns: 1fr; margin: 0 1rem 1.5rem; } }
        .lp-footer-left { display: flex; align-items: center; gap: 1rem; }
        .lp-footer-shield { color: #00E676; flex-shrink: 0; filter: drop-shadow(0 0 12px rgba(0,230,120,0.4)); }
        .lp-footer-tagline { font-size: 1.1rem; font-weight: 800; color: #e2e8f0; line-height: 1.3; }
        .lp-footer-tagline span { color: #00E676; }
        .lp-footer-tagline-sub { font-size: 0.78rem; color: #475569; margin-top: 3px; }
        .lp-footer-right { display: flex; flex-direction: column; gap: 0.5rem; }
        .lp-footer-right-head { font-size: 1rem; font-weight: 700; color: #e2e8f0; }
        .lp-footer-right-sub { font-size: 0.78rem; color: #64748b; margin-bottom: 6px; }
        .lp-footer-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.6rem 1.3rem; font-size: 0.85rem; font-weight: 700;
          background: linear-gradient(135deg, #00C853, #00B0FF); color: #000;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 0 20px rgba(0,200,83,0.3); transition: all 0.25s;
          text-decoration: none; font-family: 'Outfit', sans-serif;
          width: fit-content;
        }
        .lp-footer-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,200,83,0.45); }
      `}</style>

      <Particles />

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav className="lp-navbar">
        <Link to="/" className="lp-logo">
          <img src={logoImg} alt="MedAccess" className="lp-logo-img" onError={e => { e.target.style.display='none'; }} />
          <div>
            <div className="lp-logo-text">MedAccess</div>
            <div className="lp-logo-sub">Your Medicines, Our Priority</div>
          </div>
        </Link>

        <div className="lp-nav-links">
          {[
            { label: 'Home',           id: 'home' },
            { label: 'How It Works',   id: 'how-it-works' },
            { label: 'Features',       id: 'features' },
            { label: 'For Pharmacies', id: 'for-pharmacies' },
            { label: 'About Us',       id: 'about-us' },
            { label: 'Contact',        id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              className="lp-nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                navigate('/');
                // After navigating to the landing page, scroll to the section
                setTimeout(() => {
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn-ghost"><IconUser /> Login</Link>
          <Link to="/register" className="lp-btn-solid"><IconPlus /> Register</Link>
        </div>
      </nav>

      {/* ══════════════════ MAIN 3-COLUMN ══════════════════ */}
      <div className="lp-main">

        {/* ── LEFT: Feature Showcase ── */}
        <div className="lp-left-col">
          <div className="lp-badge"><span className="lp-badge-dot" />For Patients</div>

          <div>
            <h1 className="lp-heading">
              Welcome to <span className="lp-heading-accent">MedAccess</span><br />
              Your Health, Our Priority
            </h1>
            <p className="lp-subtext" style={{ marginTop: '0.7rem' }}>
              Upload your prescription, find the best pharmacies near you,
              compare prices and reserve medicines in just a few clicks.
            </p>
          </div>

          <div className="lp-features">
            <FeatureRow icon={IconUpload} title="Upload Prescription" desc="Upload clear image of your prescription and let our AI read it instantly." delay={100} />
            <FeatureRow icon={IconSearch} title="Find Medicines" desc="Search medicines and get real-time availability in nearby pharmacies." delay={200} />
            <FeatureRow icon={IconCompare} title="Compare & Choose" desc="Compare prices, ratings and choose the best pharmacy." delay={300} />
            <FeatureRow icon={IconMap} title="Navigate & Pick Up" desc="Get directions with Google Maps and pick up your medicines easily." delay={400} />
          </div>
        </div>

        {/* ── CENTER: Phone Mockup ── */}
        <div className="lp-center-col">
          <div className="lp-phone-scene">
            {/* 3D Phone Mockup (Upright, Dominant) */}
            <div className="lp-phone-wrapper">
              <div className="lp-phone-outer">
                <div className="lp-phone-notch" />
                <div className="lp-phone-screen">
                  <video
                    ref={videoRef}
                    src={demoVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div className="lp-phone-glare" />
                </div>
                <div className="lp-phone-home" />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Auth Card ── */}
        <div className="lp-right-col">
          <div className="lp-auth-card">
            <div className="lp-auth-head">
              <h2 className="lp-auth-title">Get Started</h2>
              <p className="lp-auth-sub">Login to your account or create a new one to continue</p>
            </div>

            {/* Tabs */}
            <div className="lp-tabs">
              <button className={`lp-tab${activeTab === 'login' ? ' active' : ''}`} onClick={() => setActiveTab('login')}>
                <IconUser /> Login
              </button>
              <button className={`lp-tab${activeTab === 'register' ? ' active' : ''}`} onClick={() => navigate('/register')}>
                <IconPlus /> Register
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconMail /></span>
                    <input
                      className={`lp-input${errors.email ? ' error' : ''}`}
                      type="email"
                      placeholder="Enter your email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                      })}
                    />
                  </div>
                  {errors.email && <p className="lp-error">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconLock /></span>
                    <input
                      className={`lp-input${errors.password ? ' error' : ''}`}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min 6 characters' }
                      })}
                    />
                    <button type="button" className="lp-input-icon-right" onClick={() => setShowPass(p => !p)}>
                      <IconEye show={showPass} />
                    </button>
                  </div>
                  {errors.password && <p className="lp-error">{errors.password.message}</p>}
                </div>

                {/* Remember me / Forgot */}
                <div className="lp-row">
                  <label className="lp-check-wrap">
                    <input type="checkbox" className="lp-check" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                    <span className="lp-check-label">Remember me</span>
                  </label>
                  <a href="#" className="lp-forgot">Forgot Password?</a>
                </div>

                {/* CTA */}
                <button type="submit" className="lp-cta-btn" disabled={submitting}>
                  {submitting ? (
                    <div className="lp-loader">
                      <span /><span /><span />
                    </div>
                  ) : 'Login to Account'}
                </button>
              </form>
            )}

            {/* Register redirect */}
            {activeTab === 'register' && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Create a new account to access all MedAccess features.<br />
                  It only takes a minute!
                </p>
                <Link to="/register" className="lp-cta-btn" style={{ display: 'inline-flex', textDecoration: 'none', justifyContent: 'center' }}>
                  <IconPlus /> Create Account
                </Link>
              </div>
            )}

            {activeTab === 'login' && (
              <>
                {/* Social */}
                <div className="lp-divider">
                  <div className="lp-divider-line" />
                  <span className="lp-divider-text">or continue with</span>
                  <div className="lp-divider-line" />
                </div>
                <div className="lp-socials">
                  <button className="lp-social-btn"><IconGoogle /> Google</button>
                  <button className="lp-social-btn"><IconFacebook /> Facebook</button>
                </div>
              </>
            )}

            {/* Switch link */}
            <div className="lp-switch-link">
              <p>
                {activeTab === 'login'
                  ? <>Don't have an account? <Link to="/register">Register</Link></>
                  : <>Already have an account? <a href="#" onClick={e => { e.preventDefault(); setActiveTab('login'); }}>Login</a></>
                }
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="lp-demo">
            <p className="lp-demo-title">🧪 Test Credentials</p>
            <p><span>Patient:</span> patient@medaccess.com / password123</p>
            <p><span>Pharmacy:</span> pharmacy@medaccess.com / password123</p>
            <p><span>Admin:</span> admin@medaccess.com / password123</p>
          </div>
        </div>
      </div>

      {/* ══════════════════ STATS SECTION ══════════════════ */}
      <div className="lp-stats-section">
        <div className="lp-stats-grid">
          <StatCard icon={IconUsers}      value="10K+" label="Happy Users"          sublabel="Trust us for better healthcare" />
          <StatCard icon={IconBuilding}   value="2K+"  label="Verified Pharmacies"  sublabel="Across 100+ Cities" />
          <StatCard icon={IconPill}       value="50K+" label="Medicines Available"  sublabel="Find all your medicines" />
          <StatCard icon={IconHeadphones} value="24/7" label="Customer Support"     sublabel="We're here to help you" />
        </div>
      </div>

      {/* ══════════════════ FOOTER CTA ══════════════════ */}
      <div className="lp-footer-cta">
        <div className="lp-footer-left">
          <div className="lp-footer-shield"><IconShield /></div>
          <div>
            <div className="lp-footer-tagline">Your Health. Our <span>Priority.</span></div>
            <div className="lp-footer-tagline-sub">Experience the future of pharmacy with MedAccess. Safe. Smart. Simple.</div>
          </div>
        </div>
        <div className="lp-footer-right">
          <div className="lp-footer-right-head">New to MedAccess?</div>
          <div className="lp-footer-right-sub">Create an account and get started in minutes.</div>
          <Link to="/register" className="lp-footer-cta-btn"><IconPlus /> Create Account Now</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
