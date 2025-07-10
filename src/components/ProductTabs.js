import React, { useState, useEffect, useRef } from 'react';
import productData from '../data/products';

function ProductTabs() {
  const [activeTab, setActiveTab] = useState('photos');
  const [activeProduct, setActiveProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const productRefs = useRef({});
  const tabsContainerRef = useRef(null);
  const productTabsRef = useRef(null);
  const dropdownRef = useRef(null);

  // Set initial active product based on the active tab
  useEffect(() => {
    if (productData[activeTab] && productData[activeTab].items.length > 0) {
        setActiveProduct(productData[activeTab].items[0].id);
      }
  }, [activeTab]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // Reset the active product when switching tabs
    if (productData[tab] && productData[tab].items.length > 0) {
        setActiveProduct(productData[tab].items[0].id);
    }
  };

  const handleProductClick = (productId) => {
    setActiveProduct(productId);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to scroll tabs to the right
  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  // Function to scroll tabs to the left
  const scrollTabsLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  // Function to scroll product tabs
  const scrollProductTabsRight = () => {
    if (productTabsRef.current) {
      productTabsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  // Function to scroll product tabs to the left
  const scrollProductTabsLeft = () => {
    if (productTabsRef.current) {
      productTabsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  // Function to render table based on product type
  const renderProductTable = (product) => {
    if (!product) return null;

    // Check if this is a document printing product
    const isDocumentPrinting = activeTab === 'documentPrinting';
    
    // Check if the product options have a 'type' field
    const hasTypeField = product.options && product.options.length > 0 && 'type' in product.options[0];

    if (hasTypeField) {
      // Group options by type
      const groupedOptions = product.options.reduce((acc, option) => {
        if (!acc[option.type]) {
          acc[option.type] = [];
        }
        acc[option.type].push(option);
        return acc;
      }, {});

      const typeGroups = Object.keys(groupedOptions);

      return (
        <div className="space-y-8">
          {typeGroups.map((type, groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
              <h4 className="text-lg font-bold text-gray-800 px-5 py-3 bg-white border-b border-gray-100 text-left w-full" style={{textAlign: 'left'}}>{type}</h4>
              <div className="p-4 bg-white">
                <table className="w-full text-left bg-white">
                  <thead className="bg-white">
                    <tr className="border-b-2 border-gray-200 bg-white">
                      <th className="py-3 px-4 font-semibold text-gray-700 text-left bg-white">
                        {isDocumentPrinting ? "Paper Size" : "Quantity"}
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-700 text-right bg-white w-1/3">Price</th>
            </tr>
          </thead>
                  <tbody className="bg-white">
                    {groupedOptions[type].map((option, index) => (
              <tr 
                key={index} 
                        className={`${index < groupedOptions[type].length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-200 bg-white`}
              >
                        <td className="py-4 px-4 text-left bg-white">{option.quantity}</td>
                        <td className="py-4 px-4 font-semibold text-right bg-white">{option.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Default table for products without type field
    return (
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left bg-white">
          <thead className="bg-white">
            <tr className="border-b-2 border-gray-200 bg-white">
              <th className="py-3 px-4 font-semibold text-gray-700 text-left bg-white">
                {isDocumentPrinting ? "Paper Size" : "Quantity"}
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-right bg-white w-1/3">Price</th>
          </tr>
        </thead>
          <tbody className="bg-white">
          {product.options.map((option, index) => (
            <tr 
              key={index} 
                className={`${index < product.options.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-200 bg-white`}
            >
                <td className="py-4 px-4 text-left bg-white">{option.quantity}</td>
                <td className="py-4 px-4 font-semibold text-right bg-white">{option.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };

  // Group the products by category (improves UI/UX)
  const groupedCategories = {
    prints: ['photocards', 'instaxInspired', 'photoStrips', 'photoPrints'],
    services: ['rushID', 'documentPrinting']
  };

  // Use pink for all tabs
  const activeTabColor = 'bg-pink-500';

  return (
    <section id="pricing" className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Product Prices</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          We offer high-quality printing services. 
          <br />
          All products are carefully printed on premium materials.
        </p>
        
        {/* Main pricing container with shadow and border */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Mobile-optimized category selector (dropdown style) */}
          <div className="block md:hidden bg-white border-b border-gray-200">
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={toggleMobileMenu}
                className="flex items-center justify-between w-full py-4 px-4 text-left text-base font-medium text-gray-800 bg-white border-b border-gray-200 focus:outline-none"
              >
                <span className="flex items-center">
                  <span className="mr-2 w-3 h-3 rounded-full bg-pink-500"></span>
                  {productData[activeTab].title}
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute z-50 w-full bg-white border-b border-gray-200 shadow-lg">
                  {Object.keys(productData).map((tabId) => (
                    <button
                      key={tabId}
                      className={`w-full py-3 px-4 text-left ${activeTab === tabId ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => handleTabClick(tabId)}
                    >
                      {productData[tabId].title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Desktop tabs */}
          <div className="hidden md:block bg-white border-b border-gray-200 relative">
          <div 
            ref={tabsContainerRef}
              className="flex overflow-x-auto no-scrollbar px-8 md:px-0"
          >
            {Object.keys(productData).map((tabId) => (
              <button
                key={tabId}
                  className={`py-4 px-6 text-base font-medium transition-colors duration-200 relative whitespace-nowrap ${
                  activeTab === tabId 
                      ? 'text-pink-600 border-b-2 border-pink-500' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                onClick={() => handleTabClick(tabId)}
              >
                  {productData[tabId].title}
              </button>
            ))}
            </div>
          </div>
          
          {/* Second level tabs - product options */}
          {productData[activeTab].items.length > 1 && (
            <div className="bg-white border-b border-gray-200 px-4 relative">
              {/* Left scroll button for product tabs */}
          <button 
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white text-pink-500 border border-gray-200 rounded-full p-1.5 md:hidden focus:outline-none hover:bg-pink-500 hover:text-white transition-all duration-200 z-10"
                onClick={scrollProductTabsLeft}
                aria-label="Scroll product tabs left"
          >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
              </button>
              
              <div 
                ref={productTabsRef}
                className="flex overflow-x-auto no-scrollbar gap-1 px-8 md:px-0"
              >
            {productData[activeTab].items.map(product => (
              <button
                key={product.id}
                ref={el => productRefs.current[product.id] = el}
                onClick={() => handleProductClick(product.id)}
                    className={`py-3 px-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeProduct === product.id
                        ? 'text-pink-600 border-b-2 border-pink-500' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
              >
                {product.name}
              </button>
            ))}
              </div>
              
              {/* Right scroll button for product tabs */}
              <button 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-pink-500 border border-gray-200 rounded-full p-1.5 md:hidden focus:outline-none hover:bg-pink-500 hover:text-white transition-all duration-200 z-10"
                onClick={scrollProductTabsRight}
                aria-label="Scroll product tabs right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
          </div>
        )}
        
          {/* Content area */}
          <div className="p-6">
          {activeProduct && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 bg-white">
                  <div className="text-left w-full bg-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 text-left bg-white">{productData[activeTab].items.find(item => item.id === activeProduct).name}</h3>
                    {productData[activeTab].items.find(item => item.id === activeProduct).description && (
                      <div className="flex items-center text-gray-600 mb-2 text-left bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="font-medium">{productData[activeTab].items.find(item => item.id === activeProduct).description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-visible bg-white">
                  {renderProductTable(productData[activeTab].items.find(item => item.id === activeProduct))}
                </div>

                {/* Additional information or notes */}
                <div className="mt-6 text-sm text-gray-500 text-left bg-white">
                  <p>* Prices may vary slightly based on specific requirements or designs.</p>
                  <p>* Please contact us for bulk orders or custom requirements.</p>
                    </div>
                  </>
            )}
            </div>
        </div>
        
        <div className="text-center mt-10 bg-white">
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