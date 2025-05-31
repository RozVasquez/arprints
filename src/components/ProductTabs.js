import React, { useState } from 'react';

function ProductTabs() {
  const [activeTab, setActiveTab] = useState('photocards');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <section id="pricing" className="py-20 bg-pink-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Product Prices</h2>

        <div id="tabs-container" className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          <button
            data-tab="photocards"
            className={`tab-button ${activeTab === 'photocards' ? 'tab-active' : 'tab-inactive'} text-base md:text-lg font-semibold px-6 py-3 rounded-lg border-2 transition duration-300`}
            onClick={() => handleTabClick('photocards')}
          >
            Photocards
          </button>
          <button
            data-tab="instax"
            className={`tab-button ${activeTab === 'instax' ? 'tab-active' : 'tab-inactive'} text-base md:text-lg font-semibold px-6 py-3 rounded-lg border-2 transition duration-300`}
            onClick={() => handleTabClick('instax')}
          >
            Instax
          </button>
          <button
            data-tab="strips"
            className={`tab-button ${activeTab === 'strips' ? 'tab-active' : 'tab-inactive'} text-base md:text-lg font-semibold px-6 py-3 rounded-lg border-2 transition duration-300`}
            onClick={() => handleTabClick('strips')}
          >
            Strips
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div id="photocards" className={`tab-content ${activeTab !== 'photocards' ? 'hidden' : ''} space-y-8`}>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-pink-700">🟣 Photo Cards – Matte & Glossy Finish</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">18 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱100</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">9 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱60</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-green-600">🟢 Photo Cards – Glittered Finish</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">18 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱120</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">9 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱70</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="instax" className={`tab-content ${activeTab !== 'instax' ? 'hidden' : ''}`}>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">🟠 Instax-Style Prints</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">Mini</td>
                      <td className="py-4 px-4">10 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱60</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">Square</td>
                      <td className="py-4 px-4">8 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱80</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">Wide</td>
                      <td className="py-4 px-4">6 pcs</td>
                      <td className="py-4 px-4 font-semibold">₱90</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="strips" className={`tab-content ${activeTab !== 'strips' ? 'hidden' : ''} space-y-8`}>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">🔵 Photo Strips (Classic)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">2 strips</td>
                      <td className="py-4 px-4 font-semibold">₱30</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">5 strips</td>
                      <td className="py-4 px-4 font-semibold">₱50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-violet-600">🟣 Photo Strips (with Design)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">2 strips</td>
                      <td className="py-4 px-4 font-semibold">₱40</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">5 strips</td>
                      <td className="py-4 px-4 font-semibold">₱60</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.facebook.com/profile.php?id=61576666357859"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-violet-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-violet-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            Order Now on Facebook
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProductTabs; 