import { getDynamicGalleryData } from '../services/galleryService';

// Test function to debug gallery service
export const testGalleryService = async () => {
  console.log('🧪 Testing Gallery Service...');
  
  try {
    const galleryData = await getDynamicGalleryData();
    console.log('📊 Gallery Data Result:', galleryData);
    
    // Check photocard category specifically
    if (galleryData.photocard) {
      console.log('📸 Photocard category found:', {
        title: galleryData.photocard.title,
        categoryImage: galleryData.photocard.categoryImage,
        useCardLayout: galleryData.photocard.useCardLayout,
        subtypes: Object.keys(galleryData.photocard.subtypes || {})
      });
    } else {
      console.log('❌ Photocard category not found');
    }
    
    // Check photocards category (plural)
    if (galleryData.photocards) {
      console.log('📸 Photocards category found:', {
        title: galleryData.photocards.title,
        categoryImage: galleryData.photocards.categoryImage,
        useCardLayout: galleryData.photocards.useCardLayout,
        subtypes: Object.keys(galleryData.photocards.subtypes || {})
      });
    } else {
      console.log('❌ Photocards category not found');
    }
    
    // List all available categories
    console.log('📋 All available categories:', Object.keys(galleryData));
    
  } catch (error) {
    console.error('❌ Error testing gallery service:', error);
  }
};

// Expose to window for testing
if (typeof window !== 'undefined') {
  window.testGalleryService = testGalleryService;
} 