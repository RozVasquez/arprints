import React from 'react';

function LoadingSpinner({ size = 'md', color = 'pink', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    pink: 'border-pink-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.pink;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <div className={`animate-spin rounded-full ${sizeClass} border-b-2 ${colorClass}`}></div>
        <div className={`absolute inset-0 rounded-full border-2 border-gray-200 ${sizeClass}`}></div>
      </div>
    </div>
  );
}

export default LoadingSpinner; 