import React from 'react';
import { IoSearchOutline, IoCloseCircle } from 'react-icons/io5';

export const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <span className="absolute left-4 text-muted-text pointer-events-none">
        <IoSearchOutline size={18} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-card border border-dark-border focus:border-electric-blue focus:ring-1 focus:ring-electric-blue rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-muted-text outline-none transition-all duration-200"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-3.5 text-muted-text hover:text-white/80 transition-colors"
        >
          <IoCloseCircle size={18} />
        </button>
      )}
    </div>
  );
};
