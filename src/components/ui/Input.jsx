import React, { forwardRef } from 'react';
import { theme } from '../../constants/theme';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder = '',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-muted-text pl-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`${theme.styles.inputField} ${
          error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 font-medium pl-1 animate-pulse">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
