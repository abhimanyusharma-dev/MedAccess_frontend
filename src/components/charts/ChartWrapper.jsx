import React from 'react';

export const ChartWrapper = ({ title, subtitle, children, height = 280, loading = false }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col h-full text-left relative overflow-hidden">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h5 className="text-sm font-bold text-white tracking-wider uppercase">{title}</h5>}
          {subtitle && <p className="text-xs text-muted-text mt-0.5">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative w-full flex-1 flex items-center justify-center" style={{ minHeight: height }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-card/40 backdrop-blur-xs rounded-xl z-10">
            <div className="w-8 h-8 border-3 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin"></div>
          </div>
        )}
        <div className="w-full h-full min-h-[220px]">
          {children}
        </div>
      </div>
    </div>
  );
};
