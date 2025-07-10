import React, { useState, useCallback } from 'react';
import BlobImage from './BlobImage';
import { ProductPricing } from './features';

function CardLayoutView({ categoryData, onImageClick, selectedCategory }) {
  const [activeSubtype, setActiveSubtype] = useState(Object.keys(categoryData.subtypes)[0]);
  const [showAllImages, setShowAllImages] = useState(false);

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

  const currentImages = getCurrentImages();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[600px]">
          {/* Left Menu - Responsive */}
          <div className="lg:w-1/4 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {categoryData.title}
              </h3>
              
              {/* Mobile: Horizontal menu, Desktop: Vertical menu */}
              <div className="flex flex-row lg:flex-col gap-2 lg:space-y-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
                {Object.entries(categoryData.subtypes).map(([key, subtype]) => (
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
                    <div className="w-6 h-6 flex items-center justify-center">
                      {activeSubtype === key ? (
                        // Selected: Small pink circle
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      ) : (
                        // Unselected: Arrow on hover, nothing by default
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 text-pink-500 transition-opacity duration-200 opacity-0 group-hover:opacity-100" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Pricing Component */}
              <ProductPricing 
                selectedCategory={selectedCategory} 
                activeSubtype={activeSubtype} 
              />
            </div>
          </div>

          {/* Right Grid - Responsive */}
          <div className="lg:w-3/4 p-4 lg:p-6">
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-gray-800">
                {categoryData.subtypes[activeSubtype]?.title} 
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                {currentImages.length} design{currentImages.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Image Grid - Responsive */}
            {showAllImages ? (
              // Expanded view - show all images
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-md group"
                    style={{ aspectRatio: '4/3' }} // More flexible aspect ratio
                    onClick={() => onImageClick(image.path, index)}
                  >
                    <BlobImage
                      src={image.path}
                      alt={`${categoryData.subtypes[activeSubtype]?.title} Design ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                      priority={index < 6} // Priority load for first 6 images
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Compact 4-image grid - Responsive with proper aspect ratios
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {currentImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-md group"
                    style={{ aspectRatio: '4/3' }} // Consistent aspect ratio
                    onClick={() => onImageClick(image.path, index)}
                  >
                    <BlobImage
                      src={image.path}
                      alt={`${categoryData.subtypes[activeSubtype]?.title} Design ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                      priority={index < 2} // Priority load for first 2 images
                    />
                  </div>
                ))}
                
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

            {/* Toggle View Button */}
            {currentImages.length > 4 && (
              <div className="mt-6 text-center">
                <button 
                  onClick={handleViewAllToggle}
                  className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  {showAllImages ? (
                    <>
                      Show Less
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      View All {currentImages.length} Designs
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardLayoutView; 