import React, { useState, useEffect, useRef } from 'react';
import productData from '../data/products';

function ProductTabs() {
  const [activeTab, setActiveTab] = useState('photocards');
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeInstaxSubtype, setActiveInstaxSubtype] = useState('instax-classic');
  const productRefs = useRef({});

  // Set initial active product based on the active tab
  useEffect(() => {
    if (productData[activeTab] && productData[activeTab].items.length > 0) {
      if (activeTab === 'instax') {
        // For instax tab, set the active product based on the active subtype
        setActiveProduct(activeInstaxSubtype);
      } else {
        setActiveProduct(productData[activeTab].items[0].id);
      }
    }
  }, [activeTab, activeInstaxSubtype]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Reset the active product when switching tabs
    if (productData[tab] && productData[tab].items.length > 0) {
      if (tab === 'instax') {
        // For instax tab, keep the current instax subtype
        setActiveProduct(activeInstaxSubtype);
      } else {
        setActiveProduct(productData[tab].items[0].id);
      }
    }
  };

  const handleProductClick = (productId) => {
    setActiveProduct(productId);
    // If this is an instax product, update the active instax subtype
    if (activeTab === 'instax') {
      setActiveInstaxSubtype(productId);
    }
  };

  // Get color class based on product color
  const getColorClass = (color) => {
    const colorMap = {
      pink: 'bg-pink-100 hover:bg-pink-200 text-pink-800',
      blue: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      green: 'bg-green-100 hover:bg-green-200 text-green-800',
      orange: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
      violet: 'bg-violet-100 hover:bg-violet-200 text-violet-800',
      red: 'bg-red-100 hover:bg-red-200 text-red-800',
      yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
      indigo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
    };
    return colorMap[color] || colorMap.pink;
  };

  // Get border color class based on product color
  const getBorderColorClass = (color) => {
    const colorMap = {
      pink: 'border-pink-500',
      blue: 'border-blue-500',
      green: 'border-green-500',
      orange: 'border-orange-500',
      violet: 'border-violet-500',
      red: 'border-red-500',
      yellow: 'border-yellow-500',
      indigo: 'border-indigo-500',
    };
    return colorMap[color] || colorMap.pink;
  };

  // Get button color class based on product color
  const getButtonColorClass = (color) => {
    const colorMap = {
      pink: 'bg-pink-600 hover:bg-pink-700',
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
      violet: 'bg-violet-600 hover:bg-violet-700',
      red: 'bg-red-600 hover:bg-red-700',
      yellow: 'bg-yellow-600 hover:bg-yellow-700',
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
    };
    return colorMap[color] || colorMap.pink;
  };

  // Function to render table based on product type
  const renderProductTable = (product) => {
    if (!product) return null;

    // Handle different table structures based on product type
    if (activeTab === 'instax') {
      return (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Details</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
            </tr>
          </thead>
          <tbody>
            {product.options.map((option, index) => (
              <tr 
                key={index} 
                className={`${index < product.options.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-200`}
              >
                <td className="py-4 px-4">{option.type}</td>
                <td className="py-4 px-4">{option.quantity}</td>
                <td className="py-4 px-4">{option.details || ''}</td>
                <td className="py-4 px-4 font-semibold">{option.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    
    // Default table for other product types
    return (
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
            <th className="py-3 px-4 font-semibold text-gray-700">Details</th>
            <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
          </tr>
        </thead>
        <tbody>
          {product.options.map((option, index) => (
            <tr 
              key={index} 
              className={`${index < product.options.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-200`}
            >
              <td className="py-4 px-4">{option.quantity}</td>
              <td className="py-4 px-4">{option.details || ''}</td>
              <td className="py-4 px-4 font-semibold">{option.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <section id="pricing" className="py-16 md:py-20 bg-pink-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Product Prices</h2>
        
        {/* Mobile-friendly tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sticky top-16 z-30 bg-pink-50 py-4 shadow-sm rounded-lg">
          {Object.keys(productData).map((tabId) => (
            <button
              key={tabId}
              className={`tab-button relative ${
                activeTab === tabId 
                  ? 'bg-pink-500 text-white font-bold shadow-md' 
                  : 'bg-pink-100 text-pink-700'
              } text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none`}
              onClick={() => handleTabClick(tabId)}
            >
              {productData[tabId].title}
              {activeTab === tabId && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
        
        {/* Instax subtabs - only show when instax tab is active */}
        {activeTab === 'instax' && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {productData.instax.items.map(product => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className={`px-5 py-2 rounded-md transition-all duration-200 ${
                  activeProduct === product.id
                    ? `${getColorClass(product.color)} font-bold border-2 ${getBorderColorClass(product.color)}`
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {product.name.split(' ').slice(-2).join(' ')}
              </button>
            ))}
          </div>
        )}
        
        {/* Product selection buttons - only show for non-instax tabs */}
        {activeTab !== 'instax' && productData[activeTab].items.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {productData[activeTab].items.map(product => (
              <button
                key={product.id}
                ref={el => productRefs.current[product.id] = el}
                onClick={() => handleProductClick(product.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeProduct === product.id
                    ? `${getColorClass(product.color)} border-2 ${getBorderColorClass(product.color)}`
                    : `${getColorClass(product.color)} border-2 border-transparent`
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>
        )}
        
        <div id="tab-content" className="max-w-4xl mx-auto transition-all duration-500">
          {activeProduct && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
              {/* Get active product details */}
              {(() => {
                let product;
                
                if (activeTab === 'instax') {
                  // For instax tab, find the product by the active instax subtype
                  product = productData.instax.items.find(item => item.id === activeProduct);
                } else {
                  // For other tabs, find the product by the active product id
                  product = productData[activeTab].items.find(item => item.id === activeProduct);
                }
                
                if (!product) return null;
                
                return (
                  <>
                    <h3 className={`text-xl md:text-2xl font-bold mb-2 text-${product.color}-600`}>{product.name}</h3>
                    {product.description && <p className="text-gray-600 mb-4">{product.description}</p>}
                    <div className="overflow-x-auto">
                      {renderProductTable(product)}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="https://www.facebook.com/profile.php?id=61576666357859"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            Order Now on Facebook
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProductTabs; 