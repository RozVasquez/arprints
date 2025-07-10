import React from 'react';
import { usePricing } from '../../../hooks';
import { Button } from '../../ui';
import { CONTACT } from '../../../constants';

const ProductPricing = ({ selectedCategory, activeSubtype }) => {
  const { compactPricing } = usePricing(selectedCategory, activeSubtype);

  if (compactPricing.length === 0) return null;

  return (
    <div className="mt-3 lg:mt-6 py-8 lg:py-20">
      <h6 className="text-sm font-medium text-gray-700 mb-2 lg:mb-3">Starting Prices</h6>
      <div className="bg-white rounded-lg p-3 lg:p-4 shadow-md">
        {compactPricing.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center py-1.5 lg:py-2">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-600">{item.quantity}</p>
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
      
      {/* Instructions and Call-to-Action */}
      <div className="mt-3 lg:mt-4 text-center">
        <p className="text-xs text-gray-600 mb-2 lg:mb-3">
          Take a screenshot of your preferred design and send it to us by clicking the button below
        </p>
        <a 
          href="https://www.facebook.com/profile.php?id=61576666357859" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="md">
            {CONTACT.MESSAGE_CTA}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ProductPricing; 