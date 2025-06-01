import React, { useState } from 'react';
import BlobImage from './BlobImage';
import StorageMonitor from './StorageMonitor';
import galleryData from '../data/galleryData';

function DesignGallery() {
  const [activeTab, setActiveTab] = useState('photocard');
  const [activeInstaxSubtype, setActiveInstaxSubtype] = useState('mini');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // If switching to instax, ensure a valid subtype is selected
    if (tab === 'instax' && !galleryData.instax.subtypes[activeInstaxSubtype]) {
      setActiveInstaxSubtype('mini');
    }
  };

  // Function to handle instax subtype click
  const handleInstaxSubtypeClick = (subtype) => {
    setActiveInstaxSubtype(subtype);
  };

  // Function to open modal when image is clicked
  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
    setModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  // Get current items to display based on active tab and subtype
  const getCurrentItems = () => {
    if (activeTab === 'instax') {
      return galleryData.instax.subtypes[activeInstaxSubtype]?.items || [];
    }
    return galleryData[activeTab]?.items || [];
  };

  return (
    <section id="gallery" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Design Gallery</h2>
        
        {/* Main tabs for different gallery categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.keys(galleryData).map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-lg relative transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-pink-500 text-white font-bold'
                  : 'bg-white text-pink-700 border-2 border-pink-300 hover:bg-pink-100'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {galleryData[tab].title}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-pink-300"></span>
              )}
            </button>
          ))}
        </div>
        
        {/* Instax subtabs - only show when instax tab is active */}
        {activeTab === 'instax' && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.keys(galleryData.instax.subtypes).map((subtype) => (
              <button
                key={subtype}
                className={`px-5 py-2 rounded-md relative transition-all duration-200 ${
                  activeInstaxSubtype === subtype
                    ? 'bg-white text-pink-700 font-bold border-2 border-pink-300' 
                    : 'bg-white text-pink-700 border border-pink-200 hover:bg-pink-50'
                }`}
                onClick={() => handleInstaxSubtypeClick(subtype)}
              >
                {galleryData.instax.subtypes[subtype].title}
                {activeInstaxSubtype === subtype && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-pink-400 rounded-b-md"></span>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Gallery grid - 2 columns on all screen sizes with Hero matching margins */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {getCurrentItems().map((image, index) => (
              <div 
                key={index}
                className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white"
                onClick={() => openModal(image.path)}
              >
                <div className="w-full aspect-[3/2] relative">
                  <BlobImage
                    src={image.path}
                    alt={`Design ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Show message if no items found */}
          {getCurrentItems().length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No designs available in this category yet.</p>
            </div>
          )}
        </div>
        
        {/* Modal for enlarged image view */}
        {modalOpen && selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={closeModal}>
            <div 
              className="relative max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
            >
              <button 
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center text-black hover:bg-opacity-100 transition-all"
                onClick={closeModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex justify-center items-center p-6">
                <BlobImage
                  src={selectedImage}
                  alt="Selected design"
                  className="max-h-[80vh] w-auto max-w-full object-contain shadow-md"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Storage monitor - only visible in development mode */}
        <StorageMonitor />
      </div>
    </section>
  );
}

export default DesignGallery; 