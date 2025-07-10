/**
 * Image optimization and handling utilities
 */

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
 */
export const getOptimizedImageUrl = (originalPath, quality = QUALITY_LEVELS.MEDIUM) => {
  if (!originalPath) return null;
  
  const useWebP = supportsWebP();
  const extension = useWebP ? '.webp' : '.jpg';
  const qualityString = quality === QUALITY_LEVELS.HIGH ? 'high' : 'medium';
  
  // For now, return original path as we don't have actual optimization service
  // In production, this would generate URLs like:
  // `/optimized/${qualityString}/${originalPath.replace(/\.[^/.]+$/, extension)}`
  return originalPath;
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