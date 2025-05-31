import React, { useState, useEffect, useRef } from 'react';
import productData from '../data/products';

function ProductTabs() {
  const [activeTab, setActiveTab] = useState('photocards');
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeInstaxSubtype, setActiveInstaxSubtype] = useState('instax-classic');
  const productRefs = useRef({});
  const tabsContainerRef = useRef(null);

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

  // Function to scroll tabs to the right
  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Product Prices</h2>
        
        {/* Mobile-friendly tab navigation with horizontal scroll */}
        <div className="relative mb-8 sticky top-[65px] z-40 bg-pink-50 py-5 rounded-lg border border-pink-200">
          <div 
            ref={tabsContainerRef}
            className="flex overflow-x-auto no-scrollbar gap-3 px-4 py-2 pr-12 md:pr-4 md:justify-center"
          >
            {Object.keys(productData).map((tabId) => (
              <button
                key={tabId}
                className={`tab-button flex-shrink-0 relative border-2 transition-all duration-300 ${
                  activeTab === tabId 
                    ? 'bg-pink-500 text-white font-bold border-pink-500' 
                    : 'bg-white text-pink-700 border-pink-300 hover:bg-pink-100'
                } text-base md:text-lg px-5 py-3 md:px-6 md:py-3 rounded-lg transform hover:scale-105 focus:outline-none whitespace-nowrap`}
                onClick={() => handleTabClick(tabId)}
              >
                <div className="flex items-center">
                  {productData[tabId].title}
                </div>
                {activeTab === tabId && (
                  <>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-500"></div>
                  </>
                )}
              </button>
            ))}
          </div>
          
          {/* Next button for mobile */}
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-pink-500 border-2 border-pink-300 rounded-full p-2.5 md:hidden focus:outline-none hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300"
            onClick={scrollTabsRight}
            aria-label="Scroll tabs right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Instax subtabs - only show when instax tab is active */}
        {activeTab === 'instax' && (
          <div className="flex flex-wrap justify-center gap-4 mb-8 mt-4">
            {productData.instax.items.map(product => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className={`px-5 py-3 rounded-md relative transition-all duration-200 ${
                  activeProduct === product.id
                    ? 'bg-white text-pink-700 font-bold' 
                    : 'bg-white text-pink-700 hover:bg-pink-100'
                } mb-1`}
              >
                {product.name.split(' ').slice(-2).join(' ')}
                {activeProduct === product.id && (
                  <span className="absolute bottom-0 left-0 w-full h-1.5 bg-pink-500 rounded-b-md"></span>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Product selection buttons - only show for non-instax tabs */}
        {activeTab !== 'instax' && productData[activeTab].items.length > 1 && (
          <div className="flex flex-wrap gap-4 mb-8 mt-4 justify-center">
            {productData[activeTab].items.map(product => (
              <button
                key={product.id}
                ref={el => productRefs.current[product.id] = el}
                onClick={() => handleProductClick(product.id)}
                className={`px-5 py-3 rounded-lg relative transition-all duration-300 ${
                  activeProduct === product.id
                    ? 'bg-white text-pink-700 font-bold'
                    : 'bg-white text-pink-700 hover:bg-pink-100'
                } mb-1`}
              >
                {product.name}
                {activeProduct === product.id && (
                  <span className="absolute bottom-0 left-0 w-full h-1.5 bg-pink-500 rounded-b-md"></span>
                )}
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
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-black">{product.name}</h3>
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