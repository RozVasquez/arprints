import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full h-full w-full border-2 border-red-200 border-t-red-600"></div>
    </div>
  );
};

export default LoadingSpinner; 