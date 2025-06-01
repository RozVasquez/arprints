import React, { useState, useEffect, useCallback } from 'react';

// Global storage tracking
let totalStorageUsed = 0;
const imageStorageMap = new Map();

// Expose to window for the StorageMonitor component
if (typeof window !== 'undefined') {
  window.totalStorageUsed = totalStorageUsed;
  window.imageStorageMap = imageStorageMap;
}

function BlobImage({ src, alt, className, onClick }) {
  const [blobUrl, setBlobUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [blobSize, setBlobSize] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    let isMounted = true;
    let currentBlobUrl = '';
    
    const loadImage = async () => {
      try {
        setLoading(true);
        
        // Fetch the image
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${src}`);
        }
        
        // Convert to blob
        const blob = await response.blob();
        
        // Optimize the image
        const { blobUrl, resultBlob, width, height } = await optimizeImage(blob);
        
        if (isMounted) {
          currentBlobUrl = blobUrl;
          setBlobUrl(blobUrl);
          setLoading(false);
          
          // Log storage consumption
          logStorageInfo(resultBlob, src, width, height);
        }
      } catch (error) {
        console.error(`Error loading image ${src}:`, error);
        if (isMounted) {
          setError(true);
          setLoading(false);
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
        if (imageStorageMap.has(src)) {
          totalStorageUsed -= imageStorageMap.get(src);
          imageStorageMap.delete(src);
          console.log(`Image unloaded: ${src}`);
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
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Get original dimensions and aspect ratio
          let originalWidth = img.width;
          let originalHeight = img.height;
          const originalAspectRatio = originalWidth / originalHeight;
          
          // Target dimensions - maintain 3:2 container (landscape)
          // Using higher resolution for better image quality
          const TARGET_WIDTH = 3000;
          const TARGET_HEIGHT = 2000; // 3:2 ratio
          
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
            const blobUrl = URL.createObjectURL(resultBlob);
            resolve({ 
              blobUrl, 
              resultBlob, 
              width: TARGET_WIDTH, 
              height: TARGET_HEIGHT 
            });
          }, 'image/jpeg', 0.95); // 95% quality for maximum image fidelity
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(blob);
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center bg-gray-100 ${className}`} style={{ aspectRatio: '3/2' }}>
        <div className="animate-pulse w-8 h-8 rounded-full bg-pink-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center bg-gray-100 ${className}`} style={{ aspectRatio: '3/2' }}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={blobUrl} 
        alt={alt || "Image"} 
        className={className}
        onClick={onClick}
        loading="lazy"
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