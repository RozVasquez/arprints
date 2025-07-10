import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BlobImage from './BlobImage';
import StorageMonitor from './StorageMonitor';
import CardLayoutView from './CardLayoutView';
import galleryData from '../data/galleryData';

function DesignGallery({ initialCategory = null }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [autoHoverIndex, setAutoHoverIndex] = useState(0);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const navigate = useNavigate();
  const cardLayoutRef = useRef(null);

  // Product categories with their details (moved up to avoid initialization error)
  const productCategories = [
    {
      id: 'photocard',
      title: 'Photo Cards',
      description: 'High-quality printed photo cards',
      categoryImage: galleryData.photocard.categoryImage
    },
    {
      id: 'instax',
      title: 'Instax',
      description: 'Instant camera style prints',
      categoryImage: galleryData.instax.categoryImage
    },
    {
      id: 'strips',
      title: 'Photo Strips',
      description: 'Classic photo strip designs',
      categoryImage: galleryData.strips.categoryImage
    }
  ];
  
  // Set initial category when component mounts or initialCategory changes
  useEffect(() => {
    if (initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Scroll to center the card layout when a category is selected
  useEffect(() => {
    if (selectedCategory && cardLayoutRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const cardElement = cardLayoutRef.current;
        const elementRect = cardElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll position to center the card layout
        const elementTop = window.scrollY + elementRect.top;
        const elementHeight = elementRect.height;
        const scrollToPosition = elementTop - (viewportHeight / 2) + (elementHeight / 2);
        
        // Smooth scroll to the calculated position
        window.scrollTo({
          top: Math.max(0, scrollToPosition), // Ensure we don't scroll above the page
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [selectedCategory]);

  // Auto-hover animation for category cards
  useEffect(() => {
    if (!selectedCategory && !isUserHovering) {
      const interval = setInterval(() => {
        setAutoHoverIndex((prevIndex) => 
          (prevIndex + 1) % productCategories.length
        );
      }, 2000); // Change every 2 seconds

      return () => clearInterval(interval);
    }
  }, [selectedCategory, isUserHovering, productCategories.length]);

  // Mobile zoom and drag states
  const [imageTransform, setImageTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const imageRef = useRef(null);

  // Reset image transform when modal opens/closes
  useEffect(() => {
    if (modalOpen) {
      setImageTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [modalOpen, selectedImage]);

  // Helper function to get distance between two touches
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper function to get center point between two touches
  const getTouchCenter = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  // Touch event handlers for mobile zoom and drag
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom start
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && imageTransform.scale > 1) {
      // Single touch drag when zoomed
      e.preventDefault();
    }
  }, [imageTransform.scale]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (lastTouchDistance > 0) {
        const scaleFactor = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(imageTransform.scale * scaleFactor, 0.5), 4);
        
        setImageTransform(prev => ({
          ...prev,
          scale: newScale
        }));
      }
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && imageTransform.scale > 1) {
      // Single finger drag when zoomed
      e.preventDefault();
      const touch = e.touches[0];
      
      // Calculate drag sensitivity based on scale
      const sensitivity = 1 / imageTransform.scale;
      
      setImageTransform(prev => ({
        ...prev,
        x: prev.x + (touch.clientX - (touch.pageX || touch.clientX)) * sensitivity,
        y: prev.y + (touch.clientY - (touch.pageY || touch.clientY)) * sensitivity
      }));
    }
  }, [lastTouchDistance, imageTransform.scale]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(0);
    }
    
    // Reset zoom if scale is too small
    if (imageTransform.scale < 0.8) {
      setImageTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [imageTransform.scale]);

  // Double tap to zoom
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    if (imageTransform.scale === 1) {
      setImageTransform({ scale: 2, x: 0, y: 0 });
    } else {
      setImageTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [imageTransform.scale]);



  // Function to handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Update URL based on category
    const categoryMapping = {
      'photocard': 'photo-cards',
      'instax': 'instax',
      'strips': 'photo-strips'
    };
    
    const categorySlug = categoryMapping[categoryId];
    if (categorySlug) {
      navigate(`/products/${categorySlug}`, { replace: true });
    }
  };

  // Function to go back to category selection
  const goBackToCategories = () => {
    setSelectedCategory(null);
    navigate('/products', { replace: true });
  };

  // Get current items to display based on selected category
  const getCurrentItems = useCallback(() => {
    if (!selectedCategory) return [];
    
    // For categories with card layout, we'll handle items differently
    if (galleryData[selectedCategory]?.useCardLayout) {
      // Combine all items from all subtypes for modal navigation
      let allItems = [];
      Object.keys(galleryData[selectedCategory].subtypes).forEach(subtype => {
        allItems = [...allItems, ...galleryData[selectedCategory].subtypes[subtype].items];
      });
      return allItems;
    }
    
    return galleryData[selectedCategory]?.items || [];
  }, [selectedCategory]);

  // Preload adjacent images for better navigation experience
  const preloadAdjacentImages = useCallback((currentIndex, items) => {
    const preloadImage = (src) => {
      if (!src) return;
      const img = new Image();
      img.src = src.startsWith('/') ? process.env.PUBLIC_URL + src : src;
    };

    // Preload previous image
    if (currentIndex > 0) {
      preloadImage(items[currentIndex - 1].path);
    }
    
    // Preload next image
    if (currentIndex < items.length - 1) {
      preloadImage(items[currentIndex + 1].path);
    }
    
    // Preload the one after next for smoother experience
    if (currentIndex < items.length - 2) {
      preloadImage(items[currentIndex + 2].path);
    }
  }, []);

  // Function to open modal when image is clicked
  const openModal = (imagePath, imageIndex) => {
    setSelectedImage(imagePath);
    setSelectedImageIndex(imageIndex);
    setModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Preload adjacent images for smooth navigation
    const currentItems = getCurrentItems();
    preloadAdjacentImages(imageIndex, currentItems);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setSelectedImageIndex(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  // Navigation functions for modal
  const navigateToNext = useCallback(() => {
    const currentItems = getCurrentItems();
    if (selectedImageIndex !== null && selectedImageIndex < currentItems.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      setSelectedImage(currentItems[nextIndex].path);
      setSelectedImageIndex(nextIndex);
      // Preload images around the new position
      preloadAdjacentImages(nextIndex, currentItems);
    }
  }, [selectedImageIndex, getCurrentItems, preloadAdjacentImages]);

  const navigateToPrevious = useCallback(() => {
    const currentItems = getCurrentItems();
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      setSelectedImage(currentItems[prevIndex].path);
      setSelectedImageIndex(prevIndex);
      // Preload images around the new position
      preloadAdjacentImages(prevIndex, currentItems);
    }
  }, [selectedImageIndex, getCurrentItems, preloadAdjacentImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!modalOpen) return;
      
      if (e.key === 'ArrowRight') {
        navigateToNext();
      } else if (e.key === 'ArrowLeft') {
        navigateToPrevious();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, navigateToNext, navigateToPrevious]);

  return (
    <section id="gallery" className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        {!selectedCategory && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            AR Products
          </h2>
        )}
        
        {/* Product Category Selection */}
        {!selectedCategory && (
          <div>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose a product category to view our available designs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {productCategories.map((category, index) => (
                <div 
                  key={category.id}
                  className={`group cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                    autoHoverIndex === index && !isUserHovering ? '-translate-y-2 scale-105' : ''
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                  onMouseEnter={() => setIsUserHovering(true)}
                  onMouseLeave={() => setIsUserHovering(false)}
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-xl">
                      <BlobImage
                        src={category.categoryImage}
                        alt={category.title}
                        className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                        priority={true}
                      />
                      {/* Overlay */}
                      <div className={`absolute inset-0 bg-pink-600 transition-all duration-500 rounded-t-xl ${
                        autoHoverIndex === index && !isUserHovering ? 'bg-opacity-20' : 'bg-opacity-0 group-hover:bg-opacity-20'
                      }`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 rounded-b-xl">
                      <h3 className="text-2xl font-bold text-gray-800">{category.title}</h3>
                      <p className="text-gray-600 mt-2">{category.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Selected Category Gallery */}
        {selectedCategory && (
          <div>
            {/* Desktop Sticky Back Button */}
            <button
              onClick={goBackToCategories}
              className="hidden md:flex fixed top-20 left-10 z-20 items-center px-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full text-pink-600 hover:bg-opacity-100 hover:text-pink-700 font-medium transition-all duration-200 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </button>

            {/* Mobile Sticky Back Button */}
            <button 
              onClick={goBackToCategories}
              className="md:hidden fixed top-20 left-1 z-20 w-12 h-12 rounded-full bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center text-pink-600 hover:bg-opacity-100 transition-all shadow-sm"
              style={{ margin: '16px' }} // Ensure proper padding from screen edges
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Conditional Layout based on useCardLayout flag */}
            {galleryData[selectedCategory]?.useCardLayout ? (
              // Card Layout for Instax and Strips
              <div ref={cardLayoutRef} className="pt-8">
                <CardLayoutView 
                  categoryData={galleryData[selectedCategory]}
                  onImageClick={openModal}
                  selectedCategory={selectedCategory}
                />
              </div>
            ) : (
              // Original Grid Layout for Photo Cards
              <div ref={cardLayoutRef}>
                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  {getCurrentItems().map((image, index) => (
                    <div 
                      key={index}
                      className="overflow-hidden rounded-lg shadow-sm transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white"
                      onClick={() => openModal(image.path, index)}
                    >
                      <div className="w-full aspect-[4/3] relative">
                        <BlobImage
                          src={image.path}
                          alt={`Design ${index + 1}`}
                          className="w-full h-full object-cover object-center"
                          priority={index < 4} // Priority load for first 4 images
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
            )}
          </div>
        )}
        
        {/* Enhanced Modal for enlarged image view with navigation */}
        {modalOpen && selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm" 
            onClick={closeModal}
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'none', // Disable bounce on mobile
              WebkitUserSelect: 'none'
            }}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
            >
              {/* Close button - moved to upper right */}
              <button 
                className="fixed top-4 right-4 z-20 w-12 h-12 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                onClick={closeModal}
                style={{ margin: '16px' }} // Ensure proper padding from screen edges
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation buttons */}
              {selectedImageIndex > 0 && (
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                  onClick={navigateToPrevious}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {selectedImageIndex < getCurrentItems().length - 1 && (
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                  onClick={navigateToNext}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image counter - moved to upper left */}
              <div className="fixed top-4 left-4 z-10 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm" style={{ margin: '16px' }}>
                {selectedImageIndex + 1} / {getCurrentItems().length}
              </div>

              {/* Zoom indicator - shown when zoomed */}
              {imageTransform.scale > 1 && (
                <div className="fixed bottom-4 right-4 z-10 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm" style={{ margin: '16px' }}>
                  {Math.round(imageTransform.scale * 100)}%
                </div>
              )}

              {/* Instructions for mobile users */}
              {imageTransform.scale === 1 && (
                <div className="fixed bottom-4 left-4 z-10 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs md:hidden" style={{ margin: '16px' }}>
                  Pinch to zoom • Double tap
                </div>
              )}
              
              {/* Image container with zoom and drag functionality */}
              <div
                ref={imageRef}
                className="max-w-[95vw] max-h-[95vh]"
                style={{
                  transform: `scale(${imageTransform.scale}) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
                  transition: imageTransform.scale === 1 ? 'transform 0.3s ease-out' : 'none',
                  transformOrigin: 'center center',
                  touchAction: 'none', // Disable default touch behaviors
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={handleDoubleClick}
              >
                <BlobImage
                  src={selectedImage}
                  alt="Selected design"
                  className="w-full h-full shadow"
                  priority={true} // Always priority load modal images
                  highQuality={true} // Use high quality for modal display
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Storage monitor - hidden */}
        {/* <StorageMonitor /> */}
      </div>
    </section>
  );
}

export default DesignGallery; 