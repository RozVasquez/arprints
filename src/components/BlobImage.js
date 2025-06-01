import React, { useState, useEffect, useCallback } from 'react';

// Global storage tracking
let totalStorageUsed = 0;
const imageStorageMap = new Map();

// Expose to window for the StorageMonitor component
if (typeof window !== 'undefined') {
  window.totalStorageUsed = totalStorageUsed;
  window.imageStorageMap = imageStorageMap;
}

// Helper function to get the correct path for images
const getPublicPath = (src) => {
  if (!src) return '';
  
  // If it's already an absolute URL, return it as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path starting with "/", make it relative to the public folder
  if (src.startsWith('/')) {
    return process.env.PUBLIC_URL + src;
  }
  
  // Otherwise return as is
  return src;
};

function BlobImage({ src, alt, className, onClick }) {
  const [blobUrl, setBlobUrl] = useState('');
  const [directUrl, setDirectUrl] = useState(''); // Add direct URL for fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [blobSize, setBlobSize] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [useFallback, setUseFallback] = useState(false); // Add fallback state

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Log storage information - wrapped in useCallback to use in dependency array
  const logStorageInfo = useCallback((blob, path, width, height) => {
    const size = blob.size;
    setBlobSize(size);
    setDimensions({ width, height });
    
    // Remove previous size for this image if it exists
    if (imageStorageMap.has(path)) {
      totalStorageUsed -= imageStorageMap.get(path);
    }
    
    // Update storage tracking
    imageStorageMap.set(path, size);
    totalStorageUsed += size;
    
    // Update window variables for StorageMonitor
    if (typeof window !== 'undefined') {
      window.totalStorageUsed = totalStorageUsed;
    }
    
    // Log individual image size
    console.log(`Image: ${path}`);
    console.log(`Size: ${formatFileSize(size)}`);
    console.log(`Dimensions: ${width}x${height}`);
    
    // Log total storage used
    console.log(`Total gallery storage: ${formatFileSize(totalStorageUsed)}`);
    console.log(`Number of images loaded: ${imageStorageMap.size}`);
    console.log('-----------------------------------');
  }, []);

  useEffect(() => {
    const resolvedSrc = getPublicPath(src);
    console.log(`Attempting to load image: ${resolvedSrc} (original: ${src})`);
    
    // Set the direct URL immediately as a fallback option
    setDirectUrl(resolvedSrc);
    
    let isMounted = true;
    let currentBlobUrl = '';
    
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        setErrorMessage('');
        setUseFallback(false);
        
        // Check if src is valid
        if (!resolvedSrc) {
          throw new Error('Image source is empty or undefined');
        }
        
        console.log(`Fetching image: ${resolvedSrc}`);
        // Fetch the image
        const response = await fetch(resolvedSrc).catch(e => {
          console.error(`Fetch error for ${resolvedSrc}:`, e);
          throw new Error(`Failed to fetch: ${e.message}`);
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        
        // Convert to blob
        const blob = await response.blob().catch(e => {
          console.error(`Blob conversion error for ${resolvedSrc}:`, e);
          throw new Error(`Failed to convert to blob: ${e.message}`);
        });
        
        console.log(`Image fetched, optimizing: ${resolvedSrc}`);
        // Optimize the image
        const { blobUrl, resultBlob, width, height } = await optimizeImage(blob).catch(e => {
          console.error(`Optimization error for ${resolvedSrc}:`, e);
          throw new Error(`Failed to optimize image: ${e.message}`);
        });
        
        if (isMounted) {
          console.log(`Image loaded successfully: ${resolvedSrc}`);
          currentBlobUrl = blobUrl;
          setBlobUrl(blobUrl);
          setLoading(false);
          
          // Log storage consumption
          logStorageInfo(resultBlob, resolvedSrc, width, height);
        }
      } catch (error) {
        console.error(`Error loading image ${resolvedSrc}:`, error);
        if (isMounted) {
          setError(true);
          setErrorMessage(error.message || 'Unknown error');
          setLoading(false);
          
          // Try using the direct URL as fallback
          console.log(`Trying fallback direct display for: ${resolvedSrc}`);
          setUseFallback(true);
        }
      }
    };
    
    loadImage();
    
    // Cleanup function to revoke object URL and prevent memory leaks
    return () => {
      isMounted = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        
        // Update storage tracking on unmount
        if (imageStorageMap.has(resolvedSrc)) {
          totalStorageUsed -= imageStorageMap.get(resolvedSrc);
          imageStorageMap.delete(resolvedSrc);
          console.log(`Image unloaded: ${resolvedSrc}`);
          console.log(`Updated total storage: ${formatFileSize(totalStorageUsed)}`);
          
          // Update window variable
          if (typeof window !== 'undefined') {
            window.totalStorageUsed = totalStorageUsed;
          }
        }
      }
    };
  }, [src, logStorageInfo]);

  // Function to optimize and compress image while preserving aspect ratio
  const optimizeImage = async (blob) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onerror = () => {
          reject(new Error('FileReader error while reading image'));
        };
        
        reader.onload = (event) => {
          try {
            const img = new Image();
            
            img.onerror = () => {
              reject(new Error('Error loading image data'));
            };
            
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas');
                
                // Get original dimensions and aspect ratio
                let originalWidth = img.width;
                let originalHeight = img.height;
                const originalAspectRatio = originalWidth / originalHeight;
                
                console.log(`Original image dimensions: ${originalWidth}x${originalHeight}`);
                
                // Target dimensions - maintain 3:2 container (landscape)
                const TARGET_WIDTH = 1200; // Reduced for better performance
                const TARGET_HEIGHT = 800; // 3:2 ratio
                
                // Calculate dimensions to fit the entire image within the canvas
                // without cropping, maintaining the original aspect ratio
                let drawWidth, drawHeight;
                let offsetX = 0, offsetY = 0;
                
                if (originalAspectRatio > 3/2) {
                  // If image is wider than 3:2, fit to width
                  drawWidth = TARGET_WIDTH;
                  drawHeight = TARGET_WIDTH / originalAspectRatio;
                  offsetY = (TARGET_HEIGHT - drawHeight) / 2; // Center vertically
                } else {
                  // If image is taller than 3:2, fit to height
                  drawHeight = TARGET_HEIGHT;
                  drawWidth = TARGET_HEIGHT * originalAspectRatio;
                  offsetX = (TARGET_WIDTH - drawWidth) / 2; // Center horizontally
                }
                
                // Set canvas dimensions - always 3:2 ratio (landscape)
                canvas.width = TARGET_WIDTH;
                canvas.height = TARGET_HEIGHT;
                
                // Use high quality image rendering
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Fill background with white
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
                
                // Draw image centered within canvas
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                
                // Convert to blob with high quality compression
                canvas.toBlob((resultBlob) => {
                  if (!resultBlob) {
                    reject(new Error('Failed to create blob from canvas'));
                    return;
                  }
                  
                  const blobUrl = URL.createObjectURL(resultBlob);
                  resolve({ 
                    blobUrl, 
                    resultBlob, 
                    width: TARGET_WIDTH, 
                    height: TARGET_HEIGHT 
                  });
                }, 'image/jpeg', 0.9); // Slightly reduced quality for better performance
              } catch (err) {
                reject(new Error(`Canvas operation error: ${err.message}`));
              }
            };
            
            img.src = event.target.result;
          } catch (err) {
            reject(new Error(`Image creation error: ${err.message}`));
          }
        };
        
        reader.readAsDataURL(blob);
      } catch (err) {
        reject(new Error(`General optimization error: ${err.message}`));
      }
    });
  };

  if (loading && !useFallback) {
    return (
      <div className={`flex justify-center items-center bg-gray-100 ${className}`}>
        <div className="animate-pulse w-8 h-8 rounded-full bg-pink-300"></div>
      </div>
    );
  }

  if (error && !useFallback) {
    console.error(`Error display for ${src}: ${errorMessage}`);
    return (
      <div className={`flex flex-col justify-center items-center bg-gray-100 ${className}`}>
        <span className="text-gray-500 text-center px-2">Image not available</span>
        {process.env.NODE_ENV === 'development' && (
          <span className="text-red-500 text-xs text-center px-2 mt-1">{errorMessage}</span>
        )}
      </div>
    );
  }

  // Use direct URL as fallback if blob URL processing fails
  if (useFallback) {
    return (
      <div className="relative w-full h-full">
        <img 
          src={directUrl} 
          alt={alt || "Image"}
          className={className} 
          onClick={onClick}
          loading="lazy"
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          onError={(e) => {
            console.error(`Fallback image render error for ${src}`);
            setError(true);
            setUseFallback(false); // Show error state instead
          }}
        />
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
            Using direct URL (fallback)
          </div>
        )}
      </div>
    );
  }

  // Default blob URL display
  return (
    <div className="relative w-full h-full">
      <img 
        src={blobUrl} 
        alt={alt || "Image"} 
        className={className}
        onClick={onClick}
        loading="lazy"
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        onError={(e) => {
          console.error(`Image render error for ${src}`);
          // If blob URL fails, try direct URL instead
          setUseFallback(true);
        }}
      />
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
          {formatFileSize(blobSize)} • {dimensions.width}×{dimensions.height}
        </div>
      )}
    </div>
  );
}

export default BlobImage; 