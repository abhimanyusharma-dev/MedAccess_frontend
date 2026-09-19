import React from 'react';
import { theme } from '../../constants/theme';

export const Button = ({
  children,
  variant = 'primary-green',
  isLoading = false,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary-green':
        return theme.styles.buttonPrimary;
      case 'secondary-blue':
        return theme.styles.buttonSecondary;
      case 'glass':
        return theme.styles.buttonGlass;
      case 'danger':
        return 'px-6 py-3 bg-red-600/20 text-red-400 font-semibold rounded-xl hover:bg-red-600/30 border border-red-500/30 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2';
      default:
        return theme.styles.buttonPrimary;
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`${getVariantClass()} ${isDisabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
