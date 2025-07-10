import React, { useState, useCallback } from 'react';
import productData from '../data/products';
import { CONTACT } from '../constants';
import { Button } from './ui';

function PricingCardLayout() {
  const [selectedCategory, setSelectedCategory] = useState('photocards');
  const [selectedItem, setSelectedItem] = useState(null);

  // Get categories for the left sidebar
  const categories = Object.entries(productData).map(([key, category]) => ({
    id: key,
    title: category.title,
    itemCount: category.items.length
  }));

  // Get current category data
  const getCurrentCategoryData = useCallback(() => {
    return productData[selectedCategory] || null;
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedItem(null); // Reset selected item when changing category
  };

  // Handle item selection for detailed view
  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  // Group options by type (Classic, Colored, Designed)
  const groupOptionsByType = (options) => {
    const groups = {};
    
    options.forEach((option) => {
      let groupKey = 'Standard'; // Default group
      
      if (option.type) {
        const lowerType = option.type.toLowerCase();
        
        // Special handling for document printing - group by size instead of type
        if (selectedCategory === 'documentPrinting') {
          const lowerQuantity = option.quantity.toLowerCase();
          if (lowerQuantity.includes('short')) {
            groupKey = 'Short Size';
          } else if (lowerQuantity.includes('a4')) {
            groupKey = 'A4 Size';
          } else if (lowerQuantity.includes('long')) {
            groupKey = 'Long Size';
          } else {
            groupKey = option.quantity; // Use quantity as-is if it doesn't match patterns
          }
        } else {
          // Original grouping logic for other categories
          // Check for specific combinations first
          if (lowerType.includes('classic colored')) {
            groupKey = 'Classic Colored';
          } else if (lowerType.includes('classic white') || lowerType.includes('classic colors') || (lowerType.includes('classic') && !lowerType.includes('colored'))) {
            groupKey = 'Classic';
          } else if (lowerType.includes('colored') || lowerType.includes('full colored') || lowerType.includes('partially colored')) {
            groupKey = 'Colored';
          } else if (lowerType.includes('design')) {
            groupKey = 'Designed';
          } else if (lowerType.includes('black and white')) {
            groupKey = 'Black & White';
          } else {
            groupKey = option.type; // Use the type as-is if it doesn't match patterns
          }
        }
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(option);
    });
    
    return groups;
  };

  // Get color class based on item color
  const getColorClasses = (color) => {
    const colorMap = {
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      violet: 'bg-violet-50 border-violet-200 text-violet-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      gray: 'bg-gray-50 border-gray-200 text-gray-700'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const currentCategoryData = getCurrentCategoryData();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent and affordable pricing for all your printing needs. Choose from our variety of services.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Sidebar - Categories */}
            <div className="lg:w-1/4 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Service Categories
                </h3>
                
                {/* Category Menu */}
                <div className="flex flex-row lg:flex-col gap-2 lg:space-y-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex-shrink-0 lg:flex-shrink lg:w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap lg:whitespace-normal flex items-center justify-between group ${
                        selectedCategory === category.id
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-transparent'
                      }`}
                    >
                      <div>
                        <span className="block">{category.title}</span>
                        <span className="text-xs text-gray-500">
                          {category.itemCount} service{category.itemCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        {selectedCategory === category.id ? (
                          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        ) : (
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
              </div>
            </div>

            {/* Right Content - Pricing Items */}
            <div className="lg:w-3/4 p-4 lg:p-6">
              {currentCategoryData && (
                <>
                  <div className="mb-6">
                    <h4 className="text-2xl font-semibold text-gray-800">
                      {currentCategoryData.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {currentCategoryData.items.length} service{currentCategoryData.items.length !== 1 ? 's' : ''} available
                    </p>
                  </div>

                  {/* Pricing Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {currentCategoryData.items.map((item) => {
                      const isExpanded = selectedItem?.id === item.id;
                      const optionsToShow = isExpanded ? item.options : item.options.slice(0, 3);
                      const groupedOptions = groupOptionsByType(optionsToShow);
                      const groupKeys = Object.keys(groupedOptions);

                      return (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md border-gray-200 hover:border-gray-300`}
                          onClick={() => handleItemClick(item)}
                        >
                          {/* Item Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 text-left">
                              <h5 className="text-lg font-bold text-gray-800 text-left">
                                {item.name}
                              </h5>
                              <p className="text-sm text-gray-600 text-left">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center ml-4">
                              <span className="text-xs font-medium text-gray-500">
                                {item.options.length} option{item.options.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>

                          {/* Pricing Options */}
                          <div className="space-y-2">
                            {(() => {
                              const groupedOptions = groupOptionsByType(optionsToShow);
                              const groupKeys = Object.keys(groupedOptions);
                              
                              return groupKeys.map((groupKey, groupIndex) => (
                                <div key={groupKey}>
                                  {/* Options in this group */}
                                  {groupedOptions[groupKey].map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                      <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-700">
                                          {option.type || 'Standard'}
                                        </p>
                                        <p className="text-xs text-gray-600">{option.quantity}</p>
                                      </div>
                                      <div className="text-right ml-4">
                                        <p className="text-sm font-semibold text-pink-600">{option.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Separator line between groups (except for last group) */}
                                  {groupIndex < groupKeys.length - 1 && (
                                    <div className="my-3 border-t border-gray-300"></div>
                                  )}
                                </div>
                              ));
                            })()}
                          </div>
                          
                          {/* Show More/Less Button */}
                          {item.options.length > 3 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item);
                              }}
                              className="w-full text-center py-2 mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium"
                            >
                              {isExpanded ? 'Show Less' : 'Show More'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Call to Action */}
                  <div className="mt-8 text-center p-6 bg-pink-50 rounded-lg border border-pink-200">
                    <h6 className="text-lg font-semibold text-gray-800 mb-2">
                      Ready to Order?
                    </h6>
                    <p className="text-gray-600 mb-4">
                      Contact us with your requirements and we'll get started on your order right away.
                    </p>
                    <Button variant="primary" size="lg">
                      {CONTACT.MESSAGE_CTA}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingCardLayout; 