// PricingCardLayoutStatic.js
import React, { useState, useMemo } from 'react';
import productData from '../data/products';
import { formatPrice, getStartingOption } from '../utils';

function PricingCardLayoutStatic({ initialCategory = 'photocards' }) {
  // Get all categories from products.js
  const categories = useMemo(() => {
    return Object.entries(productData).map(([key, category]) => ({
      id: key,
      title: category.title
    }));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortValue, setSortValue] = useState('');

  // Get current category data
  const currentCategoryData = productData[selectedCategory] || null;

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
      let groupKey = option.type || 'Standard';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(option);
    });
    return groups;
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = currentCategoryData?.items || [];
    // Filter by search text
    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      items = items.filter(item => {
        if (item.name.toLowerCase().includes(search)) return true;
        // Check options for match
        return item.options.some(opt =>
          (opt.type && opt.type.toLowerCase().includes(search)) ||
          (opt.quantity && opt.quantity.toLowerCase().includes(search))
        );
      });
    }
    // Sort
    if (sortValue === 'price-asc') {
      items = [...items].sort((a, b) => {
        const aPrice = getStartingOption(a.options)?.price || 0;
        const bPrice = getStartingOption(b.options)?.price || 0;
        return aPrice - bPrice;
      });
    } else if (sortValue === 'price-desc') {
      items = [...items].sort((a, b) => {
        const aPrice = getStartingOption(a.options)?.price || 0;
        const bPrice = getStartingOption(b.options)?.price || 0;
        return bPrice - aPrice;
      });
    } else if (sortValue === 'name-asc') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'name-desc') {
      items = [...items].sort((a, b) => b.name.localeCompare(a.name));
    }
    return items;
  }, [currentCategoryData, searchText, sortValue]);

  if (!currentCategoryData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No pricing information available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pricing</h1>
          {/* Removed lorem ipsum description */}
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-1/4 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Select a product
                </h3>
                {/* Category Menu */}
                <div className="flex flex-row lg:flex-col gap-2 lg:space-y-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex-shrink-0 lg:flex-shrink lg:w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap lg:whitespace-normal flex items-center justify-between group ${
                        selectedCategory === category.id
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-transparent'
                      }`}
                    >
                      <div>
                        <span className="block">{category.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Pricing Items */}
            <div className="flex-1 p-6">
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h4 className="text-2xl font-semibold text-gray-800">
                  {currentCategoryData.title}
                </h4>
                {/* Search and Dropdown UI */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto md:ml-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                  />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-40"
                    value={sortValue}
                    onChange={e => setSortValue(e.target.value)}
                  >
                    <option value="">Sort by</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                  </select>
                </div>
              </div>

              {/* Pricing Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {filteredAndSortedItems.map((item) => {
                  const isExpanded = selectedItem?.id === item.id;
                  const optionsToShow = isExpanded ? item.options : item.options.slice(0, 3);
                  const groupedOptions = groupOptionsByType(optionsToShow);
                  const groupKeys = Object.keys(groupedOptions);
                  // Use getStartingOption to always get the lowest price option
                  const startingOption = getStartingOption(item.options);

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
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-xs font-medium text-gray-500">
                            {item.options.length} option{item.options.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      {groupKeys.map((groupKey, groupIndex) => (
                        <div key={`${item.id}-${groupKey}-${groupIndex}`}>
                          {/* Options in this group */}
                          {groupedOptions[groupKey].map((option, optionIndex) => (
                            <div key={`${item.id}-${groupKey}-${optionIndex}-${option.quantity}-${option.type}`} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-700">
                                  {option.type || 'Standard'}
                                </p>
                                <p className="text-xs text-gray-600">{option.quantity}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm font-semibold text-red-600">{formatPrice(option.price)}</p>
                              </div>
                            </div>
                          ))}
                          {/* Separator line between groups (except for last group) */}
                          {groupIndex < groupKeys.length - 1 && (
                            <div className="my-3 border-t border-gray-300"></div>
                          )}
                        </div>
                      ))}

                      {/* Show More/Less Button */}
                      {item.options.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(item);
                          }}
                          className="w-full text-center py-2 mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          {isExpanded ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div className="mt-8 text-center p-6 bg-red-50 rounded-lg border border-red-200">
                <h6 className="text-lg font-semibold text-gray-800 mb-2">
                  Ready to Order?
                </h6>
                <p className="text-gray-600 mb-4">
                  Contact us with your order details and we'll get started on your order right away.
                </p>
                <a
                  href="https://www.facebook.com/arprintservices/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingCardLayoutStatic; 