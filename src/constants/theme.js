export const theme = {
  colors: {
    bg: '#050B14',
    card: '#091321',
    primary: '#00E676',
    secondary: '#00B0FF',
    text: '#FFFFFF',
    muted: '#94A3B8',
    border: 'rgba(255,255,255,0.08)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)',
    greenGlow: 'linear-gradient(180deg, rgba(0, 230, 118, 0.15) 0%, rgba(0, 230, 118, 0) 100%)',
    blueGlow: 'linear-gradient(180deg, rgba(0, 176, 255, 0.15) 0%, rgba(0, 176, 255, 0) 100%)',
  },
  styles: {
    glassCard: 'glass-panel rounded-2xl p-6 shadow-glass',
    glassCardInteractive: 'glass-panel-interactive rounded-2xl p-6 shadow-glass',
    inputField: 'w-full bg-dark-card border border-dark-border focus:border-electric-blue focus:ring-1 focus:ring-electric-blue rounded-xl px-4 py-3 text-white placeholder-muted-text outline-none transition-all duration-200',
    buttonPrimary: 'px-6 py-3 bg-neon-green text-dark-bg font-semibold rounded-xl hover:bg-[#00c867] active:scale-98 shadow-glow-green transition-all duration-200 flex items-center justify-center gap-2',
    buttonSecondary: 'px-6 py-3 bg-electric-blue text-dark-bg font-semibold rounded-xl hover:bg-[#009bdf] active:scale-98 shadow-glow-blue transition-all duration-200 flex items-center justify-center gap-2',
    buttonGlass: 'px-6 py-3 glass-panel text-white hover:bg-white/5 active:scale-98 border border-white/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-2',
    badgeGreen: 'px-3 py-1 text-xs font-semibold rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 shadow-glow-green/5',
    badgeBlue: 'px-3 py-1 text-xs font-semibold rounded-full bg-electric-blue/10 text-electric-blue border border-electric-blue/20 shadow-glow-blue/5',
    badgeMuted: 'px-3 py-1 text-xs font-semibold rounded-full bg-white/5 text-muted-text border border-white/10',
    badgeRed: 'px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20',
  }
}
