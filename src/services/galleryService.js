import { supabase, STORAGE_BUCKET, getPublicUrl } from './supabase';

// Helper function to get public URL for an image
const getImageUrl = (path) => {
  return getPublicUrl(path);
};

// Helper function to get local cover image URL
const getLocalCoverUrl = (categoryName) => {
  const coverMappings = {
    'instax': '/images/designs/Covers/Instax.png',
    'strips': '/images/designs/Covers/Strips.png',
    'photocards': '/images/designs/Covers/Cards.png',
    'photocard': '/images/designs/Covers/Cards.png'
  };
  
  return coverMappings[categoryName.toLowerCase()] || null;
};

// Helper function to check if a file is an image
const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const lowerFilename = filename.toLowerCase();
  return imageExtensions.some(ext => lowerFilename.endsWith(ext));
};

// Helper function to check if a path is feedback-related
const isFeedbackPath = (path) => {
  const lowerPath = path.toLowerCase();
  return lowerPath.includes('feedback') || 
         lowerPath.includes('feedbacks') || 
         lowerPath.includes('testimonial') ||
         lowerPath.includes('review');
};

// Helper function to get folder structure recursively
const getFolderStructure = async (basePath = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(basePath, {
        limit: 1000,
        offset: 0
      });

    if (error) {
      console.error('Error listing folder contents:', error);
      return { folders: [], files: [] };
    }

    const folders = [];
    const files = [];

    for (const item of data || []) {
      const itemPath = basePath ? `${basePath}/${item.name}` : item.name;
      
      // Skip .folder files (our placeholder files)
      if (item.name === '.folder') continue;
      
      // Skip feedback-related paths
      if (isFeedbackPath(itemPath)) continue;
      
      if (!item.name.includes('.') || item.name.endsWith('/')) {
        // This is a folder, get its contents recursively
        const subStructure = await getFolderStructure(itemPath);
        folders.push({
          name: item.name,
          path: itemPath,
          contents: subStructure
        });
      } else if (isImageFile(item.name)) {
        // This is an image file
        files.push({
          name: item.name,
          path: itemPath,
          url: getImageUrl(itemPath)
        });
      }
    }

    return { folders, files };
  } catch (error) {
    console.error('Error getting folder structure:', error);
    return { folders: [], files: [] };
  }
};

// Helper function to build gallery data from folder structure
const buildGalleryData = (structure) => {
  const galleryData = {};

  // Use local cover images instead of Supabase
  const coverImages = {
    'instax': getLocalCoverUrl('instax'),
    'strips': getLocalCoverUrl('strips'),
    'photocards': getLocalCoverUrl('photocards'),
    'photocard': getLocalCoverUrl('photocard')
  };

  for (const folder of structure.folders) {
    const folderName = folder.name.toLowerCase();
    
    // Handle main categories - support any folder with images or subfolders
    const hasImages = folder.contents.files.length > 0;
    const hasSubfolders = folder.contents.folders.length > 0;
    const isKnownCategory = ['instax', 'strips', 'photocards', 'photocard'].includes(folderName);
    
    // Include folder if it has images, subfolders, or is a known category
    if (hasImages || hasSubfolders || isKnownCategory) {
      const categoryData = {
        title: folderName.charAt(0).toUpperCase() + folderName.slice(1) + ' Designs',
        categoryImage: null, // Will be set later
        useCardLayout: folderName === 'instax' || folderName === 'strips' || folderName === 'photocard' || folderName === 'photocards',
        subtypes: {}
      };

      // Use local cover images
      if (coverImages[folderName]) {
        categoryData.categoryImage = coverImages[folderName];
      }

      // Process subfolders if they exist
      if (hasSubfolders) {
        
        // Create an ordered array to maintain FIFO order
        const orderedSubtypes = [];
        
        for (const subfolder of folder.contents.folders) {
          const subfolderName = subfolder.name.toLowerCase();
          
          // Generate a better title from the folder name
          const generateSubtypeTitle = (folderName) => {
            // Remove common file extensions and special characters
            let cleanName = folderName.replace(/[._-]/g, ' ').trim();
            
            // Handle common naming patterns
            if (cleanName.includes('design')) {
              return 'Designed';
            } else if (cleanName.includes('plain')) {
              return 'Plain';
            } else if (cleanName.includes('color') || cleanName.includes('colored')) {
              return 'Colored';
            } else if (cleanName.includes('camera')) {
              return 'Camera Strips';
            } else if (cleanName.includes('cat')) {
              return 'Cat Strips';
            } else if (cleanName.includes('mini')) {
              return 'Mini';
            } else if (cleanName.includes('wide')) {
              return 'Wide';
            } else if (cleanName.includes('square') || cleanName.includes('sq')) {
              return 'Square';
            } else {
              // Capitalize first letter of each word
              return cleanName.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
          };
          
          const subtypeTitle = generateSubtypeTitle(subfolderName);
          
          // Filter out cover images from product listings
          const productImages = subfolder.contents.files.filter(file => {
            const fileName = file.name.toLowerCase();
            const isCoverImage = fileName.includes('cover') || 
                               fileName.includes('banner') || 
                               fileName.includes('main') ||
                               fileName.includes('header') ||
                               fileName.includes('category');
            
            if (isCoverImage) {
              // Filtered out cover image
            }
            
            return !isCoverImage;
          });
          
          // Add to ordered array to maintain creation order
          orderedSubtypes.push({
            key: subfolderName,
            title: subtypeTitle,
            items: productImages.map(file => ({
              path: file.url
            }))
          });
          

        }
        
        // Create subtypes object with ordered keys
        categoryData.subtypes = {};
        orderedSubtypes.forEach((subtype, index) => {
          categoryData.subtypes[subtype.key] = {
            title: subtype.title,
            items: subtype.items
          };
        });
        
        // Add ordered keys array for UI to maintain order
        categoryData.subtypeOrder = orderedSubtypes.map(subtype => subtype.key);
        

      }

      // If no subtypes but has files, create a default subtype with all files
      if (Object.keys(categoryData.subtypes).length === 0 && hasImages) {
        // Filter out cover images from product listings
        const productImages = folder.contents.files.filter(file => {
          const fileName = file.name.toLowerCase();
          const isCoverImage = fileName.includes('cover') || 
                             fileName.includes('banner') || 
                             fileName.includes('main') ||
                             fileName.includes('header') ||
                             fileName.includes('category');
          
          if (isCoverImage) {
            // Filtered out cover image
          }
          
          return !isCoverImage;
        });
        

        categoryData.subtypes.default = {
          title: 'All',
          items: productImages.map(file => ({
            path: file.url
          }))
        };
        
        // For single-folder categories, also create a direct items array for backward compatibility
        categoryData.items = productImages.map(file => ({
          path: file.url
        }));
        

      }

      galleryData[folderName] = categoryData;
      // Alias photocard and photocards to the same data
      if (folderName === 'photocard') {
        galleryData['photocards'] = categoryData;
      } else if (folderName === 'photocards') {
        galleryData['photocard'] = categoryData;
      }
    } else {
      // Skipping folder (no images or subfolders)
    }
  }

  // Remove the merging logic for 'photocard' and 'photocards'. Only use the 'photocards' folder for the gallery display.
  return galleryData;
};

// Main function to get dynamic gallery data
export const getDynamicGalleryData = async () => {
  try {
    const structure = await getFolderStructure();
    const galleryData = buildGalleryData(structure);
    return galleryData;
  } catch (error) {
    return {};
  }
};

// Helper function to get images from a specific folder
export const getImagesFromFolder = async (folderPath) => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath, {
        limit: 1000,
        offset: 0
      });

    if (error) {
      console.error('Error listing folder images:', error);
      return [];
    }

    const images = [];
    for (const item of data || []) {
      if (isImageFile(item.name)) {
        // Filter out cover images
        const fileName = item.name.toLowerCase();
        const isCoverImage = fileName.includes('cover') || 
                           fileName.includes('banner') || 
                           fileName.includes('main') ||
                           fileName.includes('header') ||
                           fileName.includes('category');
        
        if (!isCoverImage) {
          const itemPath = `${folderPath}/${item.name}`;
          images.push({
            name: item.name,
            path: itemPath,
            url: getImageUrl(itemPath)
          });
        }
      }
    }

    return images;
  } catch (error) {
    console.error('Error getting images from folder:', error);
    return [];
  }
};

// Helper function to get folder structure for a specific path
export const getFolderStructureForPath = async (path = '') => {
  return await getFolderStructure(path);
}; 

// List folders in the 'product-images' bucket under 'ProductCollection/'
export async function listProductFolders() {
  const { data, error } = await supabase.storage
    .from('product-images')
    .list('ProductCollection', { limit: 100, offset: 0 });
  if (error) throw error;
  // Only return folders (type === 'folder')
  return data.filter(item => item.type === 'folder').map(item => item.name);
} 