import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getOptimizedImageUrl, getPreviewUrl, getThumbnailUrl } from '../services/supabase';
import LoadingSpinner from './ui/LoadingSpinner';

// Global cache for optimized images (simplified)
const optimizedImageCache = new Map();

// Helper function to get the correct path for images
const getPublicPath = (src) => {
  if (!src) return null;
  
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
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Function to clear image cache
const clearImageCache = () => {
  optimizedImageCache.clear();

};

function BlobImage({ src, alt, className, onClick, priority = false, highQuality = false, size = 'medium' }) {
  const [blobUrl, setBlobUrl] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [blobSize, setBlobSize] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [useFallback, setUseFallback] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority); // Load immediately if priority
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [currentQuality, setCurrentQuality] = useState('preview');
  
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

  // Get optimized URLs based on size and quality
  const getOptimizedUrls = useCallback((resolvedSrc) => {
    if (!resolvedSrc) return {};
    
    // Check if it's a Supabase URL
    const isSupabaseUrl = resolvedSrc.includes('supabase.co');
    
    if (isSupabaseUrl) {
      // Extract path from Supabase URL for transformations
      const urlParts = resolvedSrc.split('/');
      const path = urlParts.slice(-2).join('/'); // Get last two parts as path
      
      return {
        preview: getPreviewUrl(path, 64),
        thumbnail: getThumbnailUrl(path, size === 'small' ? 150 : 200),
        medium: getOptimizedImageUrl(path, { width: 800, quality: 85 }),
        high: getOptimizedImageUrl(path, { width: 1200, quality: 90 }),
        original: resolvedSrc
      };
    }
    
    // For non-Supabase URLs, return original
    return {
      preview: resolvedSrc,
      thumbnail: resolvedSrc,
      medium: resolvedSrc,
      high: resolvedSrc,
      original: resolvedSrc
    };
  }, [size]);

    // Progressive loading: preview → thumbnail → medium → high
  const loadNextQuality = useCallback(async (resolvedSrc, targetQuality = 'medium') => {
    const urls = getOptimizedUrls(resolvedSrc);
    const qualityOrder = ['preview', 'thumbnail', 'medium', 'high', 'original'];
    const currentIndex = qualityOrder.indexOf(currentQuality);
    const targetIndex = qualityOrder.indexOf(targetQuality);
    
    // Since all URLs are the same now (no transformations), just load the original
    const url = urls.original || resolvedSrc;
    
    if (!url) return;
    
    try {
      // Try to load with CORS first
      let response;
      try {
        response = await fetch(url, {
          mode: 'cors',
          credentials: 'omit'
        });
      } catch (corsError) {
        // If CORS fails, try without CORS mode (for same-origin requests)
        response = await fetch(url);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
      }
    
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      setBlobUrl(blobUrl);
      setCurrentQuality('original');
      setBlobSize(blob.size);
      
      // Get dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = blobUrl;
      });
      
      setDimensions({ width: img.width, height: img.height });
      
      // Hide preview when we have the image
      setShowPreview(false);
      
      // Cache the result
      const cacheKey = `${resolvedSrc}_original`;
      optimizedImageCache.set(cacheKey, {
        blobUrl,
        size: blob.size,
        width: img.width,
        height: img.height,
        quality: 'original'
      });
      
    } catch (error) {
      console.error('Error loading image:', error);
      // If blob loading fails, fall back to direct URL
      setUseFallback(true);
      throw error;
    }
  }, [currentQuality, getOptimizedUrls]);

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
        rootMargin: '100px', // Increased margin for earlier loading
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

  // Log image information
  const logImageInfo = useCallback((blob, path, width, height) => {
    const size = blob.size;
    setBlobSize(size);
    setDimensions({ width, height });
    

  }, []);

  // Initialize preview URL
  useEffect(() => {
    const resolvedSrc = getPublicPath(src);
    if (resolvedSrc) {
      const urls = getOptimizedUrls(resolvedSrc);
      // Since all URLs are the same now, use the original
      setPreviewUrl(urls.original || resolvedSrc);
    }
  }, [src, getOptimizedUrls]);

  // Main image loading effect
  useEffect(() => {
    if (!isIntersecting) return;

    const resolvedSrc = getPublicPath(src);

    
    // Set the direct URL immediately as a fallback option
    setDirectUrl(resolvedSrc);
    
    let isMounted = true;
    
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
        

        
        // Start progressive loading
        const targetQuality = highQuality ? 'high' : 'medium';
        await loadNextQuality(resolvedSrc, targetQuality);
          
          if (isMounted) {
          setLoading(false);
        }
        
      } catch (error) {

        if (isMounted) {
          setError(true);
          setErrorMessage(error.message || 'Unknown error');
          setLoading(false);
          setShowPreview(false);
          setUseFallback(true);
        }
      }
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [src, isIntersecting, highQuality, loadNextQuality]);

  // Don't render anything if src is null or empty
  if (!src) {
    return (
      <div ref={imgRef} className={`bg-gray-100 ${className}`}>
        <div className="flex items-center justify-center h-full text-gray-400">
          <span className="text-sm">No image</span>
        </div>
      </div>
    );
  }

  // Show preview while loading
  if (showPreview && previewUrl && loading) {
    return (
      <div ref={imgRef} className="relative w-full h-full">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={alt || "Loading..."}
            className={`${className} object-contain blur-sm`} 
            onClick={onClick}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-sm">No image</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
          <LoadingSpinner color="gray" />
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
            Preview
          </div>
        )}
      </div>
    );
  }

  if (!isIntersecting && !priority) {
    return (
      <div ref={imgRef} className={`bg-gray-100 ${className}`}>
        <LoadingSpinner className="w-full h-full" />
      </div>
    );
  }

  if (loading && !useFallback && !showPreview) {
    return (
      <div ref={imgRef} className={`bg-gray-100 ${className}`}>
        <LoadingSpinner className="w-full h-full" />
      </div>
    );
  }

  if (error && !useFallback && !showPreview) {
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

  // Use direct URL as fallback if blob URL processing fails
  if (useFallback) {
    return (
      <div ref={imgRef} className="relative w-full h-full">
        {directUrl ? (
          <img 
            src={directUrl} 
            alt={alt || "Image"}
            className={`${className} object-contain`} 
            onClick={onClick}
            loading="lazy"
            crossOrigin="anonymous"
            onError={(e) => {
      
              setError(true);
              setUseFallback(false);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-sm">No image</span>
          </div>
        )}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
            Fallback
          </div>
        )}
      </div>
    );
  }

  // Default blob URL display
  return (
    <div ref={imgRef} className="relative w-full h-full">
      {blobUrl ? (
        <img 
          src={blobUrl} 
          alt={alt || "Image"} 
          className={`${className} object-contain`}
          onClick={onClick}
          loading="lazy"
          crossOrigin="anonymous"
          onError={(e) => {
            console.error(`Image render error for ${src}`);
            setUseFallback(true);
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          <span className="text-sm">No image</span>
        </div>
      )}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-tl">
          {formatFileSize(blobSize)} • {dimensions.width}×{dimensions.height} • {currentQuality}
        </div>
      )}
    </div>
  );
}

export default BlobImage; 