import React from 'react';
import { ANIMATION } from '../../../constants';

const BUTTON_VARIANTS = {
  primary: 'bg-pink-500 hover:bg-pink-600 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  outline: 'border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'
};

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2';
  const variantClasses = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeClasses = BUTTON_SIZES[size] || BUTTON_SIZES.md;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 