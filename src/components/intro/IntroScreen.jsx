/**
 * IntroScreen.jsx  —  MedAccess Cinematic Splash (Asset-Based)
 *
 * Layout (top → bottom):
 *   [intro.bg.png]  — full-screen background, clearly visible
 *   [particles]     — floating glowing particles canvas (z=1)
 *   [ECG canvas]    — heartbeat only on left & right of logo (z=3)
 *   [intro-logo]    — large 3-D emerge from darkness
 *   [intro-text]    — MedAccess 3-D slide-up
 *   [intro-tagline] — CARE·ACCESS·TRUST 3-D fade-rise
 *   [waterripple-bg + ripple canvas]  — bottom water-ring effect
 *
 * Timing (ms):
 *   0     bg fades in
 *   600   particles appear
 *   1200  ECG starts animating
 *   1800  logo emerges (3-D scale + y)
 *   3600  text slides up
 *   5200  tagline rises
 *   6800  everything at full glow
 *   8500  fade-out begins
 *   10000 onFinish() called
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import introBg      from '../../assets/intro.bg.png';
import introLogo    from '../../assets/intro-logo.png';
import introText    from '../../assets/intro-text.png';
import introTagline from '../../assets/intro-tagline.png';

import './IntroScreen.css';

/* ════════════════════════════════════════════════════════════
   CANVAS — floating particles
   ════════════════════════════════════════════════════════════ */
function ParticlesCanvas({ visible }) {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');

    const resize = () => {
      cv.width  = window.innerWidth;
      cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = Math.min(140, Math.floor(window.innerWidth * 0.09));
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * cv.width,
      y:  Math.random() * cv.height,
      r:  Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.22,
      a:  Math.random() * 0.5 + 0.1,
      ad: Math.random() > 0.5 ? 1 : -1,
      hue: Math.random() > 0.5 ? 150 : 195,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.a += p.ad * 0.004;
        if (p.a > 0.75) p.ad = -1;
        if (p.a < 0.06) p.ad =  1;
        if (p.x < 0) p.x = cv.width;
        if (p.x > cv.width) p.x = 0;
        if (p.y < 0) p.y = cv.height;
        if (p.y > cv.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,65%,${p.a})`;
        ctx.shadowBlur  = 14;
        ctx.shadowColor = p.hue === 150
          ? `rgba(0,230,118,${p.a * 0.5})`
          : `rgba(0,176,255,${p.a * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="intro-particles"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.5s' }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   CANVAS — ECG heartbeat  (only left & right of logo)
   Draws two separate lines that start from screen edges and
   stop ~half-way, leaving the centre clear for the logo.
   ════════════════════════════════════════════════════════════ */
function EcgCanvas({ visible, logoY, logoH }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const off = useRef(0);

  // ECG waveform value for position x
  const ecgVal = (x) => {
    const period = 200;
    const t = ((x % period) + period) % period;
    const n = t / period;
    if (n >= 0.05 && n < 0.12) return Math.sin((n-0.05)/0.07*Math.PI)*10;
    if (n >= 0.18 && n < 0.20) return -(n-0.18)/0.02*22;
    if (n >= 0.20 && n < 0.24) return -22+(n-0.20)/0.04*96;
    if (n >= 0.24 && n < 0.28) return 74-(n-0.24)/0.04*98;
    if (n >= 0.28 && n < 0.32) return -24+(n-0.28)/0.04*24;
    if (n >= 0.38 && n < 0.50) return Math.sin((n-0.38)/0.12*Math.PI)*16;
    return 0;
  };

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');

    const resize = () => {
      cv.width  = window.innerWidth;
      cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (!visible) { raf.current = requestAnimationFrame(tick); return; }

      off.current += 1.4;
      const midY   = logoY + logoH / 2;          // ECG runs at logo midpoint
      const half   = cv.width / 2;
      const gap    = 160;                          // clear zone around logo centre

      // helper: draw one segment
      const seg = (fromX, toX, color, glowColor) => {
        ctx.beginPath();
        for (let x = fromX; x <= toX; x++) {
          const y = midY - ecgVal(x + off.current);
          if (x === fromX) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1.8;
        ctx.shadowBlur  = 22;
        ctx.shadowColor = glowColor;
        ctx.lineJoin    = 'round';
        ctx.lineCap     = 'round';
        ctx.stroke();
        // second pass — brighter core
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur  = 45;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur  = 0;
      };

      // LEFT  — green ECG, from left edge to (half - gap)
      seg(0, half - gap, '#00e676', 'rgba(0,230,118,0.7)');
      // RIGHT — cyan ECG, from (half + gap) to right edge
      seg(half + gap, cv.width, '#00b0ff', 'rgba(0,176,255,0.7)');

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, logoY, logoH]);

  return (
    <canvas
      ref={ref}
      className="intro-ecg"
      style={{
        top: 0,
        height: '100%',
        opacity: visible ? 0.85 : 0,
        transition: 'opacity 1.2s ease',
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   CANVAS — Dense Neon Water Ripple  (pure canvas, no image)
   ════════════════════════════════════════════════════════════ */
function RippleCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  const t   = useRef(0);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');

    // Size canvas to match CSS box
    const resize = () => {
      cv.width  = cv.offsetWidth  || window.innerWidth;
      cv.height = cv.offsetHeight || 320;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => cv.width;
    const H = () => cv.height;

    /* ── Expanding ring pool ──────────────────────────────
       Each ring spawns at r=0, grows outward, fades out.  */
    const POOL = 14;        // concurrent rings at any time
    const rings = Array.from({ length: POOL }, (_, i) => ({
      r:      (i / POOL) * 520,   // stagger start radii
      speed:  28 + Math.random() * 14,
      maxR:   560 + Math.random() * 80,
      lw:     1.4 + Math.random() * 1.2,
      hue:    i % 3 === 0 ? 195 : 150,  // cyan or green
      phase:  Math.random() * Math.PI * 2,
    }));

    /* ── Shimmer particles (stationary, pulsing) ─────────── */
    const SPARKS = 80;
    const sparks = Array.from({ length: SPARKS }, (_, i) => {
      const ang = (i / SPARKS) * Math.PI * 2;
      const d   = 60 + Math.random() * 460;
      return {
        ang, d,
        phase: Math.random() * Math.PI * 2,
        hue:   Math.random() > 0.5 ? 150 : 195,
        size:  0.8 + Math.random() * 1.8,
      };
    });

    const tick = () => {
      ctx.clearRect(0, 0, W(), H());
      t.current += 0.012;
      const T  = t.current;
      const cx = W() / 2;
      const cy = H() * 0.18;   // ripple origin at upper area
      const ry = 0.28;          // ellipse y-squish factor

      /* ── Draw central radial glow burst ─────────────────── */
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
      grd.addColorStop(0,   `rgba(0,255,140,${0.22 + Math.sin(T*1.8)*0.08})`);
      grd.addColorStop(0.4, `rgba(0,200,120,${0.10})`);
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.ellipse(cx, cy, 120, 120 * ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* ── Draw expanding rings ────────────────────────────── */
      rings.forEach(ring => {
        ring.r += ring.speed * 0.016;
        if (ring.r > ring.maxR) {
          ring.r     = 0;
          ring.speed = 28 + Math.random() * 14;
          ring.maxR  = 520 + Math.random() * 100;
        }

        const progress = ring.r / ring.maxR;          // 0 → 1
        const alpha    = (1 - progress) * (1 - progress) * 0.85; // quad fade
        if (alpha < 0.01) return;

        const color = ring.hue === 150
          ? `rgba(0,230,118,${alpha})`
          : `rgba(0,176,255,${alpha})`;
        const glow  = ring.hue === 150
          ? `rgba(0,230,118,${alpha * 0.5})`
          : `rgba(0,176,255,${alpha * 0.5})`;

        ctx.beginPath();
        ctx.ellipse(cx, cy, ring.r, ring.r * ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth   = ring.lw * (1 - progress * 0.5);
        ctx.shadowBlur  = 28 + progress * 10;
        ctx.shadowColor = glow;
        ctx.stroke();

        // inner bright core of each ring
        ctx.globalAlpha = alpha * 0.45;
        ctx.shadowBlur  = 55;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur  = 0;
      });

      /* ── Draw shimmer particles on ring arcs ─────────────── */
      sparks.forEach(sp => {
        const pulse = 0.35 + Math.sin(T * 2.2 + sp.phase) * 0.25;
        // wiggle the radial distance so they seem to ripple outward
        const d = sp.d + Math.sin(T * 1.4 + sp.phase) * 22;
        const sx = cx + Math.cos(sp.ang + T * 0.04) * d;
        const sy = cy + Math.sin(sp.ang + T * 0.04) * d * ry;

        const col = sp.hue === 150
          ? `rgba(0,255,140,${pulse})`
          : `rgba(0,200,255,${pulse})`;

        ctx.beginPath();
        ctx.arc(sx, sy, sp.size, 0, Math.PI * 2);
        ctx.fillStyle   = col;
        ctx.shadowBlur  = 14;
        ctx.shadowColor = col;
        ctx.fill();
        ctx.shadowBlur  = 0;
      });

      /* ── Dense inner ring cluster (small tight rings near centre) */
      for (let i = 1; i <= 6; i++) {
        const r     = i * 38 + Math.sin(T * 0.9 + i) * 8;
        const alph  = (0.55 - i * 0.07) * (0.8 + 0.2 * Math.sin(T * 1.5 + i));
        if (alph <= 0) continue;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,160,${alph})`;
        ctx.lineWidth   = 2.5 - i * 0.2;
        ctx.shadowBlur  = 22;
        ctx.shadowColor = `rgba(0,230,118,${alph * 0.7})`;
        ctx.stroke();
        ctx.shadowBlur  = 0;
      }

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="intro-ripple-canvas" />;
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function IntroScreen({ onFinish }) {
  const [step,      setStep]      = useState(0); // 0..5
  const [fadingOut, setFadingOut] = useState(false);

  // ref to measure logo position for ECG alignment
  const logoRef  = useRef(null);
  const [logoY,  setLogoY]  = useState(300);
  const [logoH,  setLogoH]  = useState(200);

  /* --- timeline --- */
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),    // particles
      setTimeout(() => setStep(2), 1200),   // ECG
      setTimeout(() => setStep(3), 1800),   // logo
      setTimeout(() => setStep(4), 3600),   // text
      setTimeout(() => setStep(5), 5200),   // tagline
      setTimeout(() => setFadingOut(true), 8500),
      setTimeout(() => onFinish?.(), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  /* --- measure logo position after it renders --- */
  useEffect(() => {
    if (step >= 3 && logoRef.current) {
      const r = logoRef.current.getBoundingClientRect();
      setLogoY(r.top);
      setLogoH(r.height);
    }
  }, [step]);

  /* ---- Framer Motion variants ---- */

  // 3-D emerge: start far (scale small, slight Z-perspective, dark)
  const logoVariant = {
    hidden: { opacity: 0, scale: 0.55, y: 60,  rotateX: 18, filter: 'brightness(0)' },
    show:   {
      opacity: 1, scale: 1, y: 0, rotateX: 0,
      filter: 'brightness(1)',
      transition: { duration: 1.8, ease: [0.12, 0.9, 0.28, 1] },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, scale: 0.72, y: 50, rotateX: 12, filter: 'brightness(0.3)' },
    show:   {
      opacity: 1, scale: 1, y: 0, rotateX: 0,
      filter: 'brightness(1)',
      transition: { duration: 1.5, ease: [0.12, 0.9, 0.28, 1] },
    },
  };

  const taglineVariant = {
    hidden: { opacity: 0, y: 32, scale: 0.85, filter: 'brightness(0.2)' },
    show:   {
      opacity: 1, y: 0, scale: 1,
      filter: 'brightness(1)',
      transition: { duration: 1.3, ease: [0.12, 0.9, 0.28, 1] },
    },
  };

  const rippleVariant = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { duration: 1.5, ease: 'easeOut' } },
  };

  return (
    <div className={`intro-wrap${fadingOut ? ' intro-fadeout' : ''}`}>

      {/* ── Background ─────────────────────────────────── */}
      <motion.div
        className="intro-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      {/* ── Floating Particles ─────────────────────────── */}
      <ParticlesCanvas visible={step >= 1} />

      {/* ── ECG lines (left & right only) ─────────────── */}
      <EcgCanvas visible={step >= 2} logoY={logoY} logoH={logoH} />

      {/* ── Centre stage: logo → text → tagline ────────── */}
      <div className="intro-stage">

        {/* Logo */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.img
              ref={logoRef}
              src={introLogo}
              alt="MedAccess logo"
              className="intro-logo"
              variants={logoVariant}
              initial="hidden"
              animate="show"
              /* continuous pulse once fully in */
              style={step >= 5 ? {
                animation: 'logoPulse 2.6s ease-in-out infinite',
              } : undefined}
            />
          )}
        </AnimatePresence>

        {/* MedAccess text image */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.img
              src={introText}
              alt="MedAccess"
              className="intro-text-img"
              variants={textVariant}
              initial="hidden"
              animate="show"
            />
          )}
        </AnimatePresence>

        {/* Tagline image */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.img
              src={introTagline}
              alt="Care • Access • Trust"
              className="intro-tagline-img"
              variants={taglineVariant}
              initial="hidden"
              animate="show"
            />
          )}
        </AnimatePresence>

      </div>{/* /intro-stage */}

      {/* ── Dense Neon Water Ripple — bottom ───────────── */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div
            className="intro-ripple-wrap"
            variants={rippleVariant}
            initial="hidden"
            animate="show"
          >
            <RippleCanvas />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
