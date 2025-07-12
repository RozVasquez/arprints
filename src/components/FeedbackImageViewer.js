import React, { useState, useEffect, useRef, useCallback } from 'react';
import BlobImage from './BlobImage';

function FeedbackImageViewer({ selectedImage, onClose }) {
  // Zoom and drag states (copied from DesignGallery)
  const [imageTransform, setImageTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });
  const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Reset image transform when modal opens/closes
  useEffect(() => {
    if (selectedImage) {
      setImageTransform({ scale: 1, x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [selectedImage]);

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

  // Helper function to constrain pan within boundaries
  const constrainPan = useCallback((x, y, scale) => {
    if (scale <= 1) return { x: 0, y: 0 };
    
    // Calculate maximum pan distance based on scale
    const maxPanX = (window.innerWidth * (scale - 1)) / (2 * scale);
    const maxPanY = (window.innerHeight * (scale - 1)) / (2 * scale);
    
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y))
    };
  }, []);

  // Touch event handlers for mobile zoom and drag
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom start
      e.preventDefault();
      e.stopPropagation();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    } else if (e.touches.length === 1) {
      // Single touch - prepare for drag if zoomed
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      setLastPointerPosition({ x: touch.clientX, y: touch.clientY });
      if (imageTransform.scale > 1) {
        setIsDragging(true);
        setDragStartPos({ x: touch.clientX, y: touch.clientY });
      }
    }
  }, [imageTransform.scale]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom
      e.preventDefault();
      e.stopPropagation();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (lastTouchDistance > 0) {
        const scaleFactor = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(imageTransform.scale * scaleFactor, 0.5), 4);
        
        // Calculate pan adjustment to keep zoom centered on pinch point
        const centerDx = center.x - lastTouchCenter.x;
        const centerDy = center.y - lastTouchCenter.y;
        
        const constrainedPan = constrainPan(
          imageTransform.x + centerDx * 0.1,
          imageTransform.y + centerDy * 0.1,
          newScale
        );
        
        setImageTransform({
          scale: newScale,
          x: constrainedPan.x,
          y: constrainedPan.y
        });
      }
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    } else if (e.touches.length === 1 && isDragging && imageTransform.scale > 1) {
      // Single finger drag when zoomed
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      
      const deltaX = touch.clientX - lastPointerPosition.x;
      const deltaY = touch.clientY - lastPointerPosition.y;
      
      const constrainedPan = constrainPan(
        imageTransform.x + deltaX * 0.8,
        imageTransform.y + deltaY * 0.8,
        imageTransform.scale
      );
      
      setImageTransform(prev => ({
        ...prev,
        x: constrainedPan.x,
        y: constrainedPan.y
      }));
      
      setLastPointerPosition({ x: touch.clientX, y: touch.clientY });
    }
  }, [lastTouchDistance, lastTouchCenter, lastPointerPosition, isDragging, imageTransform, constrainPan]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(0);
    }
    
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
    
    // Reset zoom if scale is too small
    if (imageTransform.scale < 0.8) {
      setImageTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [imageTransform.scale]);

  // Mouse event handlers for desktop zoom and drag
  const handleMouseDown = useCallback((e) => {
    if (imageTransform.scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setLastPointerPosition({ x: e.clientX, y: e.clientY });
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  }, [imageTransform.scale]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && imageTransform.scale > 1) {
      e.preventDefault();
      
      const deltaX = e.clientX - lastPointerPosition.x;
      const deltaY = e.clientY - lastPointerPosition.y;
      
      const constrainedPan = constrainPan(
        imageTransform.x + deltaX,
        imageTransform.y + deltaY,
        imageTransform.scale
      );
      
      setImageTransform(prev => ({
        ...prev,
        x: constrainedPan.x,
        y: constrainedPan.y
      }));
      
      setLastPointerPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, lastPointerPosition, imageTransform, constrainPan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse wheel zoom for desktop
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(imageTransform.scale * delta, 0.5), 4);
    
    // Get mouse position relative to image for zoom center
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate offset from center
    const offsetX = (mouseX - centerX) * 0.1;
    const offsetY = (mouseY - centerY) * 0.1;
    
    const constrainedPan = constrainPan(
      imageTransform.x + offsetX * (delta - 1),
      imageTransform.y + offsetY * (delta - 1),
      newScale
    );
    
    setImageTransform({
      scale: newScale,
      x: constrainedPan.x,
      y: constrainedPan.y
    });
    
    // Reset to center if scale returns to 1
    if (newScale <= 1) {
      setImageTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [imageTransform, constrainPan]);

  // Double tap/click to zoom
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    if (imageTransform.scale === 1) {
      setImageTransform({ scale: 2, x: 0, y: 0 });
    } else {
      setImageTransform({ scale: 1, x: 0, y: 0 });
    }
  }, [imageTransform.scale]);

  // Add global mouse event listeners for desktop drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset zoom and position
  const resetView = () => {
    setImageTransform({ scale: 1, x: 0, y: 0 });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    let scrollY = 0;
    
    if (selectedImage) {
      // Save current scroll position
      scrollY = window.scrollY;
      
      // Disable all scroll behaviors
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollTop = parseInt(document.body.style.top || '0', 10);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position
      if (scrollTop < 0) {
        window.scrollTo(0, -scrollTop);
      }
    }
    
    return () => {
      // Cleanup on unmount
      const scrollTop = parseInt(document.body.style.top || '0', 10);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position
      if (scrollTop < 0) {
        window.scrollTo(0, -scrollTop);
      }
    };
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      style={{
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg">
        <button
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setImageTransform(prev => {
              const newScale = Math.min(prev.scale + 0.2, 4);
              return { ...prev, scale: newScale };
            });
          }}
          title="Zoom In (+)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <button
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setImageTransform(prev => {
              const newScale = Math.max(prev.scale - 0.2, 0.5);
              return { ...prev, scale: newScale };
            });
          }}
          title="Zoom Out (-)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <button
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            resetView();
          }}
          title="Reset View (0)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white bg-opacity-90 flex items-center justify-center text-gray-800 hover:bg-opacity-100 transition-all shadow-lg"
        onClick={onClose}
        title="Close (Esc)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom indicator - shown when zoomed */}
      {imageTransform.scale > 1 && (
        <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {Math.round(imageTransform.scale * 100)}%
        </div>
      )}

      {/* Instructions for users */}
      {imageTransform.scale === 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          <span className="md:hidden">Pinch to zoom • Double tap</span>
          <span className="hidden md:inline">Mouse wheel to zoom • Drag to pan • Double click</span>
        </div>
      )}

      {/* Pan instructions when zoomed */}
      {imageTransform.scale > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          <span className="md:hidden">Drag to move around • ESC to close</span>
          <span className="hidden md:inline">Drag to pan • Wheel to zoom</span>
        </div>
      )}

      {/* Image Container */}
      <div
        ref={imageRef}
        className="flex items-center justify-center"
        style={{
          width: 'min(90vw, 90vh * 1.193)', // Constrain by aspect ratio and screen
          height: 'min(90vh, 90vw * 0.838)', // 1717/2048 = 0.838
          maxWidth: '90vw',
          maxHeight: '90vh',
          transform: `scale(${imageTransform.scale}) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
          transition: imageTransform.scale === 1 && !isDragging ? 'transform 0.3s ease-out' : 'none',
          transformOrigin: 'center center',
          touchAction: 'none', // Disable default touch behaviors
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: imageTransform.scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleTouchStart(e);
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          handleTouchMove(e);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handleTouchEnd(e);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e);
        }}
        onWheel={(e) => {
          e.stopPropagation();
          handleWheel(e);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleDoubleClick(e);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <BlobImage
          src={selectedImage}
          alt="Feedback"
          className="w-full h-full object-contain shadow-2xl rounded-lg"
          priority={true}
          highQuality={true}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default FeedbackImageViewer; 