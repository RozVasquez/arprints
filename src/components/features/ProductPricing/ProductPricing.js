import React from 'react';
import { usePricing } from '../../../hooks';
import { Button } from '../../ui';
import { CONTACT } from '../../../constants';
import { formatPrice } from '../../../utils';

const ProductPricing = ({ selectedCategory, activeSubtype, onViewPricing }) => {
  const { compactPricing } = usePricing(selectedCategory, activeSubtype);

  if (compactPricing.length === 0) return null;

  return (
    <div className="mt-2 lg:mt-3 py-3 lg:py-4">
      <h6 className="text-sm font-medium text-gray-700 mb-2 lg:mb-3">{selectedCategory === 'photocards' ? 'Photocard Starting Prices' : 'Starting Prices'}</h6>
      <div className="bg-white rounded-lg p-3 lg:p-4 shadow-md">
        {compactPricing.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center py-1.5 lg:py-2">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-600">{item.quantity ? `Starting at ${item.quantity}` : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-pink-600">{item.price}</p>
              </div>
            </div>
            {index < compactPricing.length - 1 && (
              <div className="border-b border-gray-200 my-1.5 lg:my-2"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* View All Prices Button */}
      <div className="mt-3 lg:mt-4">
        <button 
          onClick={onViewPricing}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-transparent text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-colors duration-200"
        >
          View All Prices
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Separator between View All Prices and Take a screenshot */}
      <div className="mt-4 mb-2">
        <div className="border-b border-gray-200"></div>
      </div>
    </div>
  );
};

export default ProductPricing; 