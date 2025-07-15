import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BlobImage from './BlobImage';
import { getStartingOption, formatPrice } from '../utils';

function CardLayoutView({ categoryData, onImageClick, selectedCategory }) {
  // Use ordered subtype keys if available, otherwise fall back to alphabetical
  const orderedSubtypeKeys = categoryData.subtypeOrder || Object.keys(categoryData.subtypes);
  const [activeSubtype, setActiveSubtype] = useState(orderedSubtypeKeys[0]);
  const [showAllImages, setShowAllImages] = useState(false);
  const navigate = useNavigate();

  // Get current images based on selected subtype
  const getCurrentImages = useCallback(() => {
    return categoryData.subtypes[activeSubtype]?.items || [];
  }, [categoryData, activeSubtype]);

  // Handle subtype selection
  const handleSubtypeClick = (subtypeKey) => {
    setActiveSubtype(subtypeKey);
    setShowAllImages(false); // Reset to grid view when switching subtypes
  };

  // Handle view all toggle
  const handleViewAllToggle = () => {
    setShowAllImages(!showAllImages);
  };

  // Handle navigation to pricing page
  const handleViewPricing = () => {
    // Map gallery categories to pricing categories
    const categoryMapping = {
      'instax': 'instaxInspired',
      'strips': 'photoStrips',
      'photocard': 'photocards',
      'photocards': 'photocards'
    };
    
    const pricingCategory = categoryMapping[selectedCategory] || 'photocards';
    
    navigate('/pricing', { 
      state: { 
        initialCategory: pricingCategory 
      } 
    });
  };

  const currentImages = getCurrentImages();

  return (
    <div className="w-full max-w-6xl">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[600px]">
          {/* Left Menu - Responsive */}
          <div className="lg:w-1/4 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 lg:p-6 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                {categoryData.title}
              </h3>
              
              {/* Mobile: Horizontal menu, Desktop: Vertical menu */}
              <div className="flex flex-row lg:flex-col gap-2 lg:space-y-3 lg:gap-0 overflow-x-auto lg:overflow-x-visible mb-6">
                {orderedSubtypeKeys.map((key) => {
                  const subtype = categoryData.subtypes[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleSubtypeClick(key)}
                      className={`flex-shrink-0 lg:flex-shrink lg:w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap lg:whitespace-normal flex items-center justify-between group ${
                        activeSubtype === key
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'text-gray-600 hover:bg-white hover:text-gray-800 border border-transparent'
                      }`}
                    >
                      <span>{subtype.title}</span>
                      {/* Removed color circle */}
                    </button>
                  );
                })}
              </div>

              {/* Separator above starting prices */}
              <div className="my-4 border-b border-gray-200"></div>

              {/* Starting Prices Section */}
              <div className="mb-6">
                <h5 className="text-base font-semibold text-pink-600 mb-3">Starting Prices</h5>
                <ul className="flex flex-col gap-4">
                  {(() => {
                    const categoryMap = {
                      'photocard': 'photocards',
                      'photocards': 'photocards',
                      'instax': 'instaxInspired',
                      'strips': 'photoStrips',
                    };
                    const productsKey = categoryMap[selectedCategory?.toLowerCase?.()] || 'photocards';
                    try {
                      const productData = require('../data/products').default || require('../data/products');
                      const items = productData[productsKey]?.items || [];
                      return items.map((item) => {
                        const startingOption = getStartingOption(item.options);
                        return (
                          <li key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between border border-gray-100">
                            <div className="flex-1 text-left">
                              <span className="block text-sm font-medium text-gray-700">{item.name}</span>
                            </div>
                            <div className="text-right ml-4">
                              <span className="text-lg font-bold text-pink-600">{startingOption ? formatPrice(startingOption.price) : 'N/A'}</span>
                            </div>
                          </li>
                        );
                      });
                    } catch (e) {
                      return <li className="text-gray-500">Unable to load prices.</li>;
                    }
                  })()}
                </ul>
                <button
                  className="mt-4 w-full flex items-center justify-between text-pink-600 font-medium hover:text-pink-700 transition-colors duration-200 text-sm px-2 py-2 rounded"
                  type="button"
                  onClick={() => { /* TODO: Implement view all prices action */ }}
                >
                  <span>View All Prices</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Separator below starting prices */}
              <div className="mb-6 border-b border-gray-200"></div>

              {/* Desktop: push Order Now to bottom, Mobile: keep after prices */}
              <div className="mt-auto pt-4 hidden lg:block">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-3">
                    Take a screenshot of your preferred design and place your order by clicking the button below
                  </p>
                  <a 
                    href="https://www.facebook.com/arprintservices/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                  >
                    Order Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            {/* Mobile: Order Now after prices */}
            <div className="block lg:hidden px-4 pb-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">
                  Take a screenshot of your preferred design and place your order by clicking the button below
                </p>
                <a 
                  href="https://www.facebook.com/arprintservices/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  Order Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Grid - Responsive */}
          <div className="lg:w-3/4 p-4 lg:p-6">
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-gray-800">
                {categoryData.subtypes[activeSubtype]?.title} 
              </h4>
            </div>

            {/* Image Grid - Responsive */}
            {showAllImages ? (
              // Expanded view - show all images
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCurrentImages().map((image, index) => {
                  // Find the matching product item for this subtype (by name or id)
                  const subtype = categoryData.subtypes[activeSubtype];
                  const productItem = subtype && subtype.productItem;
                  let startingPrice = '';
                  if (productItem && productItem.options) {
                    const option = getStartingOption(productItem.options);
                    if (option) startingPrice = formatPrice(option.price);
                  }
                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-lg shadow-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-md group"
                      style={{ aspectRatio: '4/3' }}
                      onClick={() => onImageClick(image.path, index)}
                    >
                      <BlobImage
                        src={image.path}
                        alt={`${categoryData.subtypes[activeSubtype]?.title} Design ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                        priority={index < 6}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              // Compact 4-image grid - Responsive with proper aspect ratios
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {getCurrentImages().slice(0, 4).map((image, index) => {
                  // Remove starting price badge from image cards
                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-lg shadow-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-md group"
                      style={{ aspectRatio: '4/3' }}
                      onClick={() => onImageClick(image.path, index)}
                    >
                      <BlobImage
                        src={image.path}
                        alt={`${categoryData.subtypes[activeSubtype]?.title} Design ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                        priority={index < 2}
                      />
                      {/* Removed starting price badge */}
                    </div>
                  );
                })}
                
                {/* Empty slots if less than 4 images in compact view */}
                {!showAllImages && currentImages.length < 4 && Array.from({ length: 4 - currentImages.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                    style={{ aspectRatio: '4/3' }} // Match image aspect ratio
                  >
                    <div className="text-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm">Coming Soon</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile/Tablet Pricing Section - Show below images on smaller screens */}
            <div className="lg:hidden mt-6">
              {/* Separator before pricing on mobile/tablet */}
              <div className="mb-2">
                <div className="border-b border-gray-200"></div>
              </div>
              {/* Removed duplicate instruction and Order Now button from below images on mobile */}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3 justify-center">
              {/* Toggle View Button - Only show if more than 4 images */}
              {currentImages.length > 4 && (
                <button 
                  onClick={handleViewAllToggle}
                  className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  {showAllImages ? (
                    <>
                      Show Less
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      View All Images
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardLayoutView; 