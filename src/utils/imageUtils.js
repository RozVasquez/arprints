/**
 * Image optimization and handling utilities with Supabase integration
 */

import { ImageService } from '../services/imageService';

export const IMAGE_FORMATS = {
  WEBP: 'webp',
  JPEG: 'jpeg'
};

export const QUALITY_LEVELS = {
  LOW: 0.3,
  MEDIUM: 0.8,
  HIGH: 0.95
};

/**
 * Check if browser supports WebP format
 */
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Generate optimized image URLs based on quality requirements
 * Now integrates with Supabase for remote images
 */
export const getOptimizedImageUrl = (originalPath, quality = QUALITY_LEVELS.MEDIUM) => {
  if (!originalPath) return null;
  
  // Use Supabase image service for URL generation
  const imageUrl = ImageService.getImageUrl(originalPath);
  
  // For future optimization, we can add query parameters to Supabase URLs
  // Currently returns the Supabase URL or original path
  return imageUrl;
};

/**
 * Get product image URL with fallback support
 * Handles both local and Supabase-hosted images
 */
export const getProductImageUrl = (imagePath, fallbackPath = null) => {
  try {
    return ImageService.getImageUrl(imagePath, fallbackPath);
  } catch (error) {
    console.error('Error getting product image URL:', error);
    return fallbackPath;
  }
};

/**
 * Preload image for better performance
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = async (imageUrls) => {
  try {
    const promises = imageUrls.map(url => preloadImage(url));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error preloading images:', error);
    return [];
  }
};

/**
 * Create blob URL from canvas for image optimization
 */
export const createBlobFromCanvas = (canvas, quality = QUALITY_LEVELS.MEDIUM, format = IMAGE_FORMATS.WEBP) => {
  return new Promise((resolve) => {
    const mimeType = format === IMAGE_FORMATS.WEBP ? 'image/webp' : 'image/jpeg';
    canvas.toBlob(resolve, mimeType, quality);
  });
};

/**
 * Get responsive image dimensions based on container size
 */
export const getResponsiveDimensions = (containerWidth, aspectRatio = 4/3) => {
  const width = Math.min(containerWidth, 1200); // Max width
  const height = width / aspectRatio;
  return { width: Math.round(width), height: Math.round(height) };
}; 

/**
 * Validate image file before upload
 */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }
  
  return { valid: true };
};

/**
 * Generate a unique filename for uploaded images
 */
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

/**
 * Compress image before upload
 */
export const compressImage = (file, quality = QUALITY_LEVELS.MEDIUM) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create image preview URL
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Clean up preview URL
 */
export const cleanupPreviewUrl = (url) => {
  URL.revokeObjectURL(url);
};

// Export ImageService for direct access
export { ImageService }; 