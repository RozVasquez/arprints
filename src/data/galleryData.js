import { getDynamicGalleryData } from '../services/galleryService';

// Default fallback data in case dynamic loading fails
const fallbackGalleryData = {
  // photocard: {
  //   title: "Photocard Designs",
  //   categoryImage: null,
  //   useCardLayout: true,
  //   subtypes: {}
  // },
  instax: {
    title: "Instax Designs",
    categoryImage: null,
    useCardLayout: true,
    subtypes: {}
  },
  strips: {
    title: "Photo Strip Designs",
    categoryImage: null,
    useCardLayout: true,
    subtypes: {}
  },
  photocards: {
    title: "Photo Cards Designs",
    categoryImage: null,
    useCardLayout: true,
    subtypes: {}
  }
};

// Function to get gallery data dynamically
export const getGalleryData = async () => {
  try {
    const dynamicData = await getDynamicGalleryData();
    
    // If dynamic data is empty, return fallback
    if (!dynamicData || Object.keys(dynamicData).length === 0) {
      console.warn('⚠️ No dynamic gallery data found, using fallback');
      return fallbackGalleryData;
    }
    
    return dynamicData;
  } catch (error) {
    console.error('❌ Error loading gallery data:', error);
    return fallbackGalleryData;
  }
};

// Export fallback data for components that need immediate access
export default fallbackGalleryData; 