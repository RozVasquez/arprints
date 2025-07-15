import React, { useState, useMemo } from 'react';
import productData from '../data/products';
import { formatPrice } from '../utils';

function PricingCard() {
  const [selectedCategory, setSelectedCategory] = useState('photocards');
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Get all categories from products.js
  const categories = useMemo(() => {
    return Object.entries(productData).map(([key, category]) => ({
      id: key,
      title: category.title
    }));
  }, []);

  // Get current category data
  const currentCategoryData = productData[selectedCategory] || null;

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getLowestPriceForType = (options) => {
    if (!options || options.length === 0) return 'Price not available';
    
    // Find the lowest price option
    const lowestPriceOption = options.reduce((lowest, current) => {
      const currentPrice = parseFloat(current.price.replace('₱', '').replace(',', ''));
      const lowestPrice = parseFloat(lowest.price.replace('₱', '').replace(',', ''));
      return currentPrice < lowestPrice ? current : lowest;
    });
    
    return formatPrice(lowestPriceOption.price);
  };

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent and affordable pricing for all your printing needs. Choose from our variety of services.
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        {currentCategoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategoryData.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      )}
                      {item.size && (
                        <p className="text-gray-500 text-xs">Size: {item.size}</p>
                      )}
                    </div>
                    {item.color && (
                      <div 
                        className="w-4 h-4 rounded-full ml-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    )}
                  </div>

                  {/* Starting Price */}
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                      Starting at {getLowestPriceForType(item.options)}
                    </span>
                  </div>
                </div>

                {/* Pricing Options */}
                <div className="p-6">
                  <div className="space-y-3">
                    {item.options.slice(0, 3).map((option, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {option.type || 'Standard'}
                          </p>
                          <p className="text-xs text-gray-600">{option.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-pink-600">
                            {formatPrice(option.price)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Show More/Less */}
                    {item.options.length > 3 && (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="w-full text-center py-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
                        >
                          {expandedItems.has(item.id) ? 'Show Less' : `Show ${item.options.length - 3} More`}
                        </button>

                        {expandedItems.has(item.id) && (
                          <div className="space-y-3 mt-3">
                            {item.options.slice(3).map((option, index) => (
                              <div key={index + 3} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {option.type || 'Standard'}
                                  </p>
                                  <p className="text-xs text-gray-600">{option.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-pink-600">
                                    {formatPrice(option.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  <a
                    href="https://www.facebook.com/arprintservices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-pink-600 text-white text-center py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 block"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Order?</h2>
            <p className="text-gray-600 mb-6">
              Contact us with your order details and we'll get started on your order right away.
            </p>
            <a
              href="https://www.facebook.com/arprintservices/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingCard; 