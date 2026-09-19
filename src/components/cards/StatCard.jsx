import React from 'react';
import { IoArrowUpOutline, IoArrowDownOutline } from 'react-icons/io5';

export const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up', color = 'green' }) => {
  const isGreen = color === 'green';
  const glowBorder = isGreen 
    ? 'border-neon-green/20 hover:border-neon-green/40 shadow-glow-green/5' 
    : 'border-electric-blue/20 hover:border-electric-blue/40 shadow-glow-blue/5';
  
  return (
    <div className={`glass-panel rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.015] flex flex-col justify-between h-36 ${glowBorder}`}>
      <div className="flex items-start justify-between">
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-text">{title}</p>
          <h4 className="text-3xl font-extrabold text-white mt-2 font-sans">{value}</h4>
        </div>
        <div className={`p-2.5 rounded-xl ${isGreen ? 'bg-neon-green/10 text-neon-green' : 'bg-electric-blue/10 text-electric-blue'}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`flex items-center text-xs font-bold ${trendType === 'up' ? 'text-neon-green' : 'text-red-400'}`}>
            {trendType === 'up' ? <IoArrowUpOutline size={13} className="mr-0.5" /> : <IoArrowDownOutline size={13} className="mr-0.5" />}
            {trend}
          </span>
          <span className="text-[10px] uppercase font-semibold text-muted-text">vs last period</span>
        </div>
      )}
    </div>
  );
};
