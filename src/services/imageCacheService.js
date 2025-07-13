import { getDynamicGalleryData } from './galleryService';
import { getPreviewUrl, getThumbnailUrl } from './supabase';

// Check if we're in development/local environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Global cache for preloaded images (only in development)
const preloadedImageCache = new Map();
const imageLoadPromises = new Map();
const previewCache = new Map();
let isPreloading = false;
let preloadProgress = { loaded: 0, total: 0 };

// Helper function to get all image URLs from gallery data
const extractAllImageUrls = (galleryData) => {
  const imageUrls = new Set();
  
  Object.values(galleryData).forEach(category => {
    // Add category cover image
    if (category.categoryImage) {
      imageUrls.add(category.categoryImage);
    }
    
    // Add images from subtypes
    if (category.subtypes) {
      Object.values(category.subtypes).forEach(subtype => {
        if (subtype.items) {
          subtype.items.forEach(item => {
            if (item.path) {
              imageUrls.add(item.path);
            }
          });
        }
      });
    }
    
    // Add direct items if they exist
    if (category.items) {
      category.items.forEach(item => {
        if (item.path) {
          imageUrls.add(item.path);
        }
      });
    }
  });
  
  return Array.from(imageUrls);
};

// Helper function to extract home page images (hero + featured)
const extractHomeImages = (galleryData) => {
  const imageUrls = new Set();
  
  // Add hero images (first few images from each category)
  Object.values(galleryData).forEach(category => {
    // Add category cover image
    if (category.categoryImage) {
      imageUrls.add(category.categoryImage);
    }
    
    // Add first 2-3 images from each category for home page
    if (category.subtypes) {
      Object.values(category.subtypes).forEach(subtype => {
        if (subtype.items && subtype.items.length > 0) {
          // Take only first 2 images from each subtype
          subtype.items.slice(0, 2).forEach(item => {
            if (item.path) {
              imageUrls.add(item.path);
            }
          });
        }
      });
    }
    
    // Add first few direct items if they exist
    if (category.items && category.items.length > 0) {
      category.items.slice(0, 3).forEach(item => {
        if (item.path) {
          imageUrls.add(item.path);
        }
      });
    }
  });
  
  return Array.from(imageUrls);
};

// Helper function to extract product images for specific category
const extractProductImages = (galleryData, category = null) => {
  const imageUrls = new Set();
  
  if (category) {
    // Cache only the specific category
    const targetCategory = galleryData[category];
    if (targetCategory) {
      // Don't include category cover images for products page
      // if (targetCategory.categoryImage) {
      //   imageUrls.add(targetCategory.categoryImage);
      // }
      
      if (targetCategory.subtypes) {
        Object.values(targetCategory.subtypes).forEach(subtype => {
          if (subtype.items) {
            subtype.items.forEach(item => {
              if (item.path) {
                imageUrls.add(item.path);
              }
            });
          }
        });
      }
      
      if (targetCategory.items) {
        targetCategory.items.forEach(item => {
          if (item.path) {
            imageUrls.add(item.path);
          }
        });
      }
    }
  } else {
    // Cache all product images
    Object.values(galleryData).forEach(category => {
      // Don't include category cover images for products page
      // if (category.categoryImage) {
      //   imageUrls.add(category.categoryImage);
      // }
      
      if (category.subtypes) {
        Object.values(category.subtypes).forEach(subtype => {
          if (subtype.items) {
            subtype.items.forEach(item => {
              if (item.path) {
                imageUrls.add(item.path);
              }
            });
          }
        });
      }
      
      if (category.items) {
        category.items.forEach(item => {
          if (item.path) {
            imageUrls.add(item.path);
          }
        });
      }
    });
  }
  
  return Array.from(imageUrls);
};

// Helper function to extract pricing page images
const extractPricingImages = (galleryData) => {
  const imageUrls = new Set();
  
  // For pricing page, cache only category cover images
  Object.values(galleryData).forEach(category => {
    if (category.categoryImage) {
      imageUrls.add(category.categoryImage);
    }
  });
  
  return Array.from(imageUrls);
};

// Helper function to preload preview images (faster loading)
const preloadPreviewImage = async (imageUrl) => {
  if (previewCache.has(imageUrl)) {
    return previewCache.get(imageUrl);
  }
  
  try {
    // Get preview URL for Supabase images with lower resolution
    const isSupabaseUrl = imageUrl.includes('supabase.co');
    let previewUrl = imageUrl;
    
    if (isSupabaseUrl) {
      const urlParts = imageUrl.split('/');
      const path = urlParts.slice(-2).join('/');
      // Use even smaller preview (32px instead of 64px)
      previewUrl = getPreviewUrl(path, 32);
    }
    
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = previewUrl;
    });
    
    previewCache.set(imageUrl, {
      url: previewUrl,
      width: img.naturalWidth,
      height: img.naturalHeight,
      loaded: true,
      timestamp: Date.now()
    });
    
    return previewCache.get(imageUrl);
  } catch (error) {
    console.warn(`Failed to preload preview for ${imageUrl}:`, error);
    return null;
  }
};

// Helper function to preload a single image
const preloadImage = async (imageUrl) => {
  if (preloadedImageCache.has(imageUrl)) {
    return preloadedImageCache.get(imageUrl);
  }
  
  if (imageLoadPromises.has(imageUrl)) {
    return imageLoadPromises.get(imageUrl);
  }
  
  const loadPromise = new Promise(async (resolve, reject) => {
    try {
      // Create a new Image object
      const img = new Image();
      
      img.onload = () => {
        // Store the loaded image in cache
        preloadedImageCache.set(imageUrl, {
          url: imageUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          loaded: true,
          timestamp: Date.now()
        });
        
        preloadProgress.loaded++;
        console.log(`✅ Preloaded image: ${imageUrl} (${preloadProgress.loaded}/${preloadProgress.total})`);
        
        // Clean up the promise
        imageLoadPromises.delete(imageUrl);
        resolve(imageUrl);
      };
      
      img.onerror = () => {
        console.warn(`⚠️ Failed to preload image: ${imageUrl}`);
        preloadProgress.loaded++;
        imageLoadPromises.delete(imageUrl);
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };
      
      // Start loading the image
      img.src = imageUrl;
      
    } catch (error) {
      console.error(`❌ Error preloading image ${imageUrl}:`, error);
      preloadProgress.loaded++;
      imageLoadPromises.delete(imageUrl);
      reject(error);
    }
  });
  
  imageLoadPromises.set(imageUrl, loadPromise);
  return loadPromise;
};

// Main function to preload all images with progressive loading
export const preloadAllImages = async (onProgress) => {
  // Only enable caching in development/local environment
  if (!isDevelopment) {
    console.log('🚫 Image preloading disabled in production');
    return;
  }
  
  if (isPreloading) {
    console.log('🔄 Image preloading already in progress...');
    return;
  }
  
  try {
    isPreloading = true;
    console.log('🚀 Starting progressive image preloading (development only)...');
    
    // Get gallery data
    const galleryData = await getDynamicGalleryData();
    
    // Extract all image URLs
    const imageUrls = extractAllImageUrls(galleryData);
    
    if (imageUrls.length === 0) {
      console.log('ℹ️ No images found to preload');
      return;
    }
    
    // Reset progress
    preloadProgress = { loaded: 0, total: imageUrls.length };
    
    console.log(`📸 Found ${imageUrls.length} images to preload`);
    
    // Phase 1: Preload preview images (fast)
    console.log('📱 Phase 1: Preloading preview images...');
    const previewPromises = imageUrls.map(url => preloadPreviewImage(url));
    await Promise.allSettled(previewPromises);
    
    if (onProgress) {
      onProgress({
        loaded: Math.min(preloadProgress.loaded, preloadProgress.total),
        total: preloadProgress.total,
        percentage: Math.round((Math.min(preloadProgress.loaded, preloadProgress.total) / preloadProgress.total) * 100),
        phase: 'preview'
      });
    }
    
    // Phase 2: Preload full images in batches
    console.log('🖼️ Phase 2: Preloading full images...');
    const batchSize = 3; // Reduced batch size for better performance
    const batches = [];
    
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      batches.push(imageUrls.slice(i, i + batchSize));
    }
    
    // Process batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Load all images in the current batch concurrently
      const batchPromises = batch.map(url => preloadImage(url));
      
      try {
        await Promise.allSettled(batchPromises);
        
        // Report progress
        if (onProgress) {
          onProgress({
            loaded: preloadProgress.loaded,
            total: preloadProgress.total,
            percentage: Math.round((preloadProgress.loaded / preloadProgress.total) * 100),
            batch: i + 1,
            totalBatches: batches.length,
            phase: 'full'
          });
        }
        
        // Small delay between batches to prevent browser freezing
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error);
      }
    }
    
    console.log(`✅ Progressive preloading completed! Loaded ${preloadProgress.loaded}/${preloadProgress.total} images`);
    
  } catch (error) {
    console.error('❌ Error during image preloading:', error);
  } finally {
    isPreloading = false;
  }
};

// New function to preload images for specific page/category
export const preloadPageImages = async (pageType, category = null, onProgress) => {
  // Only enable caching in development/local environment
  if (!isDevelopment) {
    console.log('🚫 Image preloading disabled in production');
    return;
  }
  
  if (isPreloading) {
    console.log('🔄 Image preloading already in progress...');
    return;
  }
  
  try {
    isPreloading = true;
    console.log(`🚀 Starting page-specific preloading for: ${pageType}${category ? ` - ${category}` : ''}`);
    
    // Get gallery data
    const galleryData = await getDynamicGalleryData();
    
    // Extract images based on page type
    let imageUrls = [];
    
    switch (pageType) {
      case 'home':
        // Cache only hero images and featured products
        imageUrls = extractHomeImages(galleryData);
        break;
      case 'products':
        // Cache only the specific category or all products
        imageUrls = extractProductImages(galleryData, category);
        break;
      case 'pricing':
        // Cache only pricing-related images
        imageUrls = extractPricingImages(galleryData);
        break;
      default:
        console.log('ℹ️ Unknown page type, no images to preload');
        return;
    }
    
    if (imageUrls.length === 0) {
      console.log('ℹ️ No images found to preload for this page');
      return;
    }
    
    // Reset progress
    preloadProgress = { loaded: 0, total: imageUrls.length };
    
    console.log(`📸 Found ${imageUrls.length} images to preload for ${pageType}`);
    
    // Only preload preview images (no full images to save memory)
    console.log('📱 Preloading preview images only...');
    const previewPromises = imageUrls.map(url => preloadPreviewImage(url));
    await Promise.allSettled(previewPromises);
    
    if (onProgress) {
      onProgress({
        loaded: preloadProgress.loaded,
        total: preloadProgress.total,
        percentage: Math.round((preloadProgress.loaded / preloadProgress.total) * 100),
        phase: 'preview',
        pageType,
        category
      });
    }
    
    console.log(`✅ Page-specific preloading completed! Loaded ${preloadProgress.loaded}/${preloadProgress.total} preview images`);
    
  } catch (error) {
    console.error('❌ Error during page-specific image preloading:', error);
  } finally {
    isPreloading = false;
  }
};

// Function to check if an image is preloaded
export const isImagePreloaded = (imageUrl) => {
  if (!isDevelopment) return false;
  return preloadedImageCache.has(imageUrl);
};

// Function to check if a preview is preloaded
export const isPreviewPreloaded = (imageUrl) => {
  if (!isDevelopment) return false;
  return previewCache.has(imageUrl);
};

// Function to get preloaded image data
export const getPreloadedImage = (imageUrl) => {
  if (!isDevelopment) return null;
  return preloadedImageCache.get(imageUrl);
};

// Function to get preloaded preview data
export const getPreloadedPreview = (imageUrl) => {
  if (!isDevelopment) return null;
  return previewCache.get(imageUrl);
};

// Function to clear the preload cache
export const clearPreloadCache = () => {
  if (!isDevelopment) {
    console.log('🚫 Cache clearing disabled in production');
    return;
  }
  preloadedImageCache.clear();
  previewCache.clear();
  imageLoadPromises.clear();
  preloadProgress = { loaded: 0, total: 0 };
  isPreloading = false;
  console.log('🗑️ Preload cache cleared');
};

// Function to get cache statistics
export const getCacheStats = () => {
  if (!isDevelopment) {
    return {
      preloadedCount: 0,
      previewCount: 0,
      pendingCount: 0,
      isPreloading: false,
      progress: { loaded: 0, total: 0 },
      disabled: true
    };
  }
  return {
    preloadedCount: preloadedImageCache.size,
    previewCount: previewCache.size,
    pendingCount: imageLoadPromises.size,
    isPreloading,
    progress: { ...preloadProgress }
  };
};

// Function to get memory usage estimate
export const getMemoryUsage = () => {
  if (!isDevelopment) {
    return {
      totalSize: 0,
      imageCount: 0,
      averageSize: 0,
      formattedSize: '0 Bytes',
      disabled: true
    };
  }
  
  let totalSize = 0;
  let imageCount = 0;
  
  // Estimate memory usage from cached images
  preloadedImageCache.forEach((data) => {
    // Rough estimate: width * height * 4 bytes per pixel
    const estimatedSize = data.width * data.height * 4;
    totalSize += estimatedSize;
    imageCount++;
  });
  
  return {
    totalSize,
    imageCount,
    averageSize: imageCount > 0 ? totalSize / imageCount : 0,
    formattedSize: formatFileSize(totalSize)
  };
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Expose to window for debugging (development only)
if (typeof window !== 'undefined' && isDevelopment) {
  window.preloadAllImages = preloadAllImages;
  window.preloadPageImages = preloadPageImages;
  window.isImagePreloaded = isImagePreloaded;
  window.getPreloadedImage = getPreloadedImage;
  window.clearPreloadCache = clearPreloadCache;
  window.getCacheStats = getCacheStats;
  window.preloadedImageCache = preloadedImageCache;
} 