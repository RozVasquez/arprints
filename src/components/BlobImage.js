import React, { useState, useEffect, useCallback, useRef } from 'react';

// Global storage tracking
let totalStorageUsed = 0;
const imageStorageMap = new Map();

// Global cache for optimized images
const optimizedImageCache = new Map();

// Expose to window for the StorageMonitor component
if (typeof window !== 'undefined') {
  window.totalStorageUsed = totalStorageUsed;
  window.imageStorageMap = imageStorageMap;
  window.optimizedImageCache = optimizedImageCache;
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

// Helper function to check WebP support
const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('webp') > -1;
};

// Helper function to clear the image cache
const clearImageCache = () => {
  optimizedImageCache.forEach((cachedData) => {
    URL.revokeObjectURL(cachedData.blobUrl);
  });
  optimizedImageCache.clear();
  console.log('Image cache cleared');
};

// Expose cache management to window for debugging
if (typeof window !== 'undefined') {
  window.clearImageCache = clearImageCache;
}

function BlobImage({ src, alt, className, onClick, priority = false, highQuality = false }) {
  const [blobUrl, setBlobUrl] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [blobSize, setBlobSize] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [useFallback, setUseFallback] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority); // Load immediately if priority
  const [lowQualityUrl, setLowQualityUrl] = useState('');
  const [showLowQuality, setShowLowQuality] = useState(true);
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate low-quality placeholder
  const generateLowQualityPlaceholder = useCallback(async (resolvedSrc) => {
    try {
      const response = await fetch(resolvedSrc);
      if (!response.ok) return '';
      
      const blob = await response.blob();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          // Create very small placeholder maintaining aspect ratio
          const aspectRatio = img.width / img.height;
          let placeholderWidth, placeholderHeight;
          
          if (aspectRatio > 1) {
            // Landscape
            placeholderWidth = 64;
            placeholderHeight = 64 / aspectRatio;
          } else {
            // Portrait or square
            placeholderHeight = 64;
            placeholderWidth = 64 * aspectRatio;
          }
          
          canvas.width = placeholderWidth;
          canvas.height = placeholderHeight;
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, placeholderWidth, placeholderHeight);
          ctx.filter = 'blur(2px)';
          ctx.drawImage(img, 0, 0, placeholderWidth, placeholderHeight);
          resolve(canvas.toDataURL('image/jpeg', 0.1));
        };
        img.onerror = () => resolve('');
        img.src = URL.createObjectURL(blob);
      });
    } catch (err) {
      console.log('Failed to generate low-quality placeholder:', err);
      return '';
    }
  }, []);

  // Set up Intersection Observer
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

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

  // Generate low-quality placeholder when component mounts
  useEffect(() => {
    const resolvedSrc = getPublicPath(src);
    if (resolvedSrc && priority) {
      generateLowQualityPlaceholder(resolvedSrc).then(placeholder => {
        if (placeholder) setLowQualityUrl(placeholder);
      });
    }
  }, [src, priority, generateLowQualityPlaceholder]);

  useEffect(() => {
    if (!isIntersecting) return;

    const resolvedSrc = getPublicPath(src);
    console.log(`Attempting to load image: ${resolvedSrc} (original: ${src})`);
    
    // Set the direct URL immediately as a fallback option
    setDirectUrl(resolvedSrc);
    
    // Generate low-quality placeholder if not already done
    if (!lowQualityUrl && resolvedSrc) {
      generateLowQualityPlaceholder(resolvedSrc).then(placeholder => {
        if (placeholder) setLowQualityUrl(placeholder);
      });
    }
    
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
        
        // Create cache key that includes quality setting
        const cacheKey = `${resolvedSrc}_${highQuality ? 'hq' : 'std'}`;
        
        // Check if image is already cached
        if (optimizedImageCache.has(cacheKey)) {
          console.log(`Using cached image: ${resolvedSrc} (${highQuality ? 'high quality' : 'standard'})`);
          const cachedData = optimizedImageCache.get(cacheKey);
          
          if (isMounted) {
            currentBlobUrl = cachedData.blobUrl;
            setBlobUrl(cachedData.blobUrl);
            setLoading(false);
            setShowLowQuality(false);
            setBlobSize(cachedData.size);
            setDimensions({ width: cachedData.width, height: cachedData.height });
            
            // Update storage tracking for this instance
            if (!imageStorageMap.has(cacheKey)) {
              imageStorageMap.set(cacheKey, cachedData.size);
              totalStorageUsed += cachedData.size;
              
              if (typeof window !== 'undefined') {
                window.totalStorageUsed = totalStorageUsed;
              }
            }
          }
          return;
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
        
        if (highQuality) {
          console.log(`Using original image without compression: ${resolvedSrc}`);
          // For high quality, use original image without any processing
          const blobUrl = URL.createObjectURL(blob);
          
          // Get original dimensions
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = blobUrl;
          });
          
          if (isMounted) {
            console.log(`Original image loaded: ${resolvedSrc}`);
            currentBlobUrl = blobUrl;
            setBlobUrl(blobUrl);
            setLoading(false);
            setShowLowQuality(false);
            
            // Cache the original image
            optimizedImageCache.set(cacheKey, {
              blobUrl,
              size: blob.size,
              width: img.width,
              height: img.height
            });
            
            // Log storage consumption  
            logStorageInfo(blob, cacheKey, img.width, img.height);
          }
        } else {
          console.log(`Image fetched, optimizing: ${resolvedSrc} (standard quality)`);
          // Optimize the image for gallery thumbnails
          const { blobUrl, resultBlob, width, height } = await optimizeImage(blob, highQuality).catch(e => {
            console.error(`Optimization error for ${resolvedSrc}:`, e);
            throw new Error(`Failed to optimize image: ${e.message}`);
          });
          
          if (isMounted) {
            console.log(`Image loaded successfully: ${resolvedSrc}`);
            currentBlobUrl = blobUrl;
            setBlobUrl(blobUrl);
            setLoading(false);
            setShowLowQuality(false); // Hide low-quality placeholder
            
            // Cache the optimized image for future use
            optimizedImageCache.set(cacheKey, {
              blobUrl,
              size: resultBlob.size,
              width,
              height
            });
            
            // Log storage consumption  
            logStorageInfo(resultBlob, cacheKey, width, height);
                     }
         }
      } catch (error) {
        console.error(`Error loading image ${resolvedSrc}:`, error);
        if (isMounted) {
          setError(true);
          setErrorMessage(error.message || 'Unknown error');
          setLoading(false);
          setShowLowQuality(false);
          
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
      // Note: We don't revoke cached blob URLs as they may be used by other instances
      // The cache will manage URL lifecycle globally
    };
  }, [src, isIntersecting, logStorageInfo, lowQualityUrl, generateLowQualityPlaceholder]);

  // Function to optimize and compress image while preserving aspect ratio
  const optimizeImage = async (blob, highQuality = false) => {
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
                
                // Target dimensions based on quality setting
                const TARGET_WIDTH = highQuality ? 2400 : 1200;  // Double resolution for high quality
                const TARGET_HEIGHT = highQuality ? 1600 : 800;
                
                // Calculate optimal dimensions while maintaining aspect ratio
                // Fit to the larger dimension to avoid upscaling small images
                let canvasWidth, canvasHeight;
                
                if (originalWidth > originalHeight) {
                  // Landscape or square image
                  canvasWidth = Math.min(originalWidth, TARGET_WIDTH);
                  canvasHeight = canvasWidth / originalAspectRatio;
                } else {
                  // Portrait image
                  canvasHeight = Math.min(originalHeight, TARGET_HEIGHT);
                  canvasWidth = canvasHeight * originalAspectRatio;
                }
                
                // Set canvas dimensions to match the optimized image size
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                
                // Use high quality image rendering
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Draw image to fill the entire canvas (no background needed)
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                
                // This optimization only runs for standard quality (gallery thumbnails)
                // High quality images use the original file without processing
                const format = supportsWebP() ? 'image/webp' : 'image/jpeg';
                const quality = format === 'image/webp' ? 0.8 : 0.9;
                
                console.log(`Converting to ${format} format with ${Math.round(quality * 100)}% quality`);
                
                // Convert to blob with appropriate format and quality
                canvas.toBlob((resultBlob) => {
                  if (!resultBlob) {
                    reject(new Error('Failed to create blob from canvas'));
                    return;
                  }
                  
                  const blobUrl = URL.createObjectURL(resultBlob);
                  resolve({ 
                    blobUrl, 
                    resultBlob, 
                    width: canvasWidth, 
                    height: canvasHeight 
                  });
                }, format, quality);
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

  if (!isIntersecting && !priority) {
    return (
      <div ref={imgRef} className={`flex justify-center items-center bg-gray-100 ${className}`}>
        <div className="animate-pulse w-8 h-8 rounded-full bg-pink-300"></div>
      </div>
    );
  }

  if (loading && !useFallback && !showLowQuality) {
    return (
      <div ref={imgRef} className={`flex justify-center items-center bg-gray-100 ${className}`}>
        <div className="animate-pulse w-8 h-8 rounded-full bg-pink-300"></div>
      </div>
    );
  }

  if (error && !useFallback && !showLowQuality) {
    console.error(`Error display for ${src}: ${errorMessage}`);
    return (
      <div ref={imgRef} className={`flex flex-col justify-center items-center bg-gray-100 ${className}`}>
        <span className="text-gray-500 text-center px-2">Image not available</span>
        {process.env.NODE_ENV === 'development' && (
          <span className="text-red-500 text-xs text-center px-2 mt-1">{errorMessage}</span>
        )}
      </div>
    );
  }

  // Show low-quality placeholder while loading
  if (showLowQuality && lowQualityUrl && loading) {
    return (
      <div ref={imgRef} className="relative w-full h-full">
        <img 
          src={lowQualityUrl} 
          alt={alt || "Loading..."}
          className={`${className} object-contain`} 
          onClick={onClick}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse w-8 h-8 rounded-full bg-pink-300 bg-opacity-75"></div>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
            Loading...
          </div>
        )}
      </div>
    );
  }

  // Use direct URL as fallback if blob URL processing fails
  if (useFallback) {
    return (
      <div ref={imgRef} className="relative w-full h-full">
        <img 
          src={directUrl} 
          alt={alt || "Image"}
          className={`${className} object-contain`} 
          onClick={onClick}
          loading="lazy"
          onError={(e) => {
            console.error(`Fallback image render error for ${src}`);
            setError(true);
            setUseFallback(false);
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
    <div ref={imgRef} className="relative w-full h-full">
      <img 
        src={blobUrl} 
        alt={alt || "Image"} 
        className={`${className} object-contain`}
        onClick={onClick}
        loading="lazy"
        onError={(e) => {
          console.error(`Image render error for ${src}`);
          setUseFallback(true);
        }}
      />
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
          {formatFileSize(blobSize)} • {dimensions.width}×{dimensions.height} • {supportsWebP() ? 'WebP' : 'JPEG'}
        </div>
      )}
    </div>
  );
}

export default BlobImage; 