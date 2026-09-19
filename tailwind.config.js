/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#07111C",
          bg2: "#081624",
          bg3: "#0B1828",
          card: "#0E1B2E",
          card2: "#112138",
          border: "rgba(255,255,255,0.08)",
          borderGlow: "rgba(0,230,118,0.3)",
        },
        emerald: {
          green: "#00E676",
          dark: "#00D97E",
        },
        neon: {
          cyan: "#00F0FF",
          blue: "#00C8FF",
          blueDark: "#33B5FF"
        },
        muted: {
          text: "#94A3B8",
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(0, 230, 118, 0.2), inset 0 0 10px rgba(0, 230, 118, 0.05)',
        'glow-green-strong': '0 0 25px rgba(0, 230, 118, 0.4), inset 0 0 15px rgba(0, 230, 118, 0.1)',
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.05)',
        'glow-blue': '0 0 15px rgba(0, 200, 255, 0.2), inset 0 0 10px rgba(0, 200, 255, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'lg': '20px',
      },
      animation: {
        'wave': 'wave 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(0.0deg)' },
          '50%': { transform: 'rotate(14.0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(0, 230, 118, 0.2)' },
          '50%': { opacity: .7, boxShadow: '0 0 25px rgba(0, 230, 118, 0.4)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(20px, -20px) rotate(5deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
