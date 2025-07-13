import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Check if we have valid credentials
const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-project-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key'

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  storage: {
    from: () => ({
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      remove: async () => ({ error: { message: 'Supabase not configured' } }),
      list: async () => ({ data: [], error: { message: 'Supabase not configured' } })
    })
  }
});

// Create Supabase client based on environment variables
let supabaseClient;

if (!hasValidCredentials) {
  // Use mock client
  supabaseClient = createMockClient();
} else {
  // Create real Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

// Export the client
export const supabase = supabaseClient;

// Storage bucket name for product images
export const STORAGE_BUCKET = 'product-images'

// Storage folders structure
export const STORAGE_FOLDERS = {
  INSTAX: 'instax',
  STRIPS: 'strips', 
  PHOTOCARDS: 'photocards',
  COVERS: 'covers',
  DESIGNS: 'designs'
}

// Helper function to get public URL for an image
export const getPublicUrl = (path) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Helper function to upload image
export const uploadImage = async (file, path) => {
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { 
      success: false, 
      error: { message: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` }
    }
  }
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      })
    
    if (error) {
      return { success: false, error }
    }
    
    // Get the public URL
    const publicUrl = getPublicUrl(path)
    
    return { 
      success: true, 
      data: {
        ...data,
        publicUrl: publicUrl
      }
    }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to delete image
export const deleteImage = async (path) => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])
    
    if (error) {
      return { success: false, error }
    }
    
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to list images in a folder
export const listImages = async (folder = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder)
    
    if (error) {
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to create a folder (by uploading a placeholder file)
export const createFolder = async (folderPath) => {
  try {
    // Create a placeholder file to establish the folder
    const placeholderContent = 'This is a placeholder file to create the folder structure.'
    const placeholderBlob = new Blob([placeholderContent], { type: 'text/plain' })
    const placeholderFile = new File([placeholderBlob], '.folder', { type: 'text/plain' })
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(`${folderPath}/.folder`, placeholderFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to test delete permissions
export const testDeletePermissions = async () => {
  try {
    // Try to list storage contents to test permissions
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', { limit: 1 })
    
    if (error) {
      return { success: false, error }
    }
    
    // Try to delete a non-existent file to test delete permissions
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(['test-delete-permissions-file-that-does-not-exist'])
    
    // If we get here, delete permissions are working (file not found is expected)
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to delete a folder and all its contents
export const deleteFolder = async (folderPath) => {
  try {
    // First, list all files in the folder
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath)
    
    if (listError) {
      return { success: false, error: listError }
    }
    
    if (!files || files.length === 0) {
      return { success: true, message: 'Folder is empty' }
    }
    
    // Extract file paths to delete
    const filesToDelete = files
      .filter(item => !item.name.endsWith('/')) // Only files, not folders
      .map(item => `${folderPath}/${item.name}`)
    
    if (filesToDelete.length === 0) {
      return { success: true, message: 'No files to delete' }
    }
    
    // Delete all files in the folder
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filesToDelete)
    
    if (deleteError) {
      return { success: false, error: deleteError }
    }
    
    return { success: true, deletedCount: filesToDelete.length }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to list folder contents with detailed structure
export const listFolderContents = async (folder = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      return { success: false, error }
    }
    
    // Separate folders and files
    const folders = [];
    const files = [];
    
    for (const item of data || []) {
      const isFolder = !item.name.includes('.') || item.name.endsWith('/');
      const isFile = item.name.includes('.') && !item.name.endsWith('/');
      
      if (isFolder) {
        folders.push({
          name: item.name,
          path: folder ? `${folder}/${item.name}` : item.name
        });
      } else if (isFile) {
        files.push({
          name: item.name,
          path: folder ? `${folder}/${item.name}` : item.name,
          size: item.metadata?.size || 0,
          lastModified: item.updated_at
        });
      }
    }
    
    return { 
      success: true, 
      data: {
        folders,
        files,
        totalItems: (folders.length + files.length)
      }
    }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper function to get optimized image URL with Supabase transformations
export const getOptimizedImageUrl = (path, options = {}) => {
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'auto',
    fit = 'cover',
    focus = 'auto'
  } = options;

  const baseUrl = getPublicUrl(path);
  
  // For now, return the base URL without transformations
  // Supabase image transformations might not be enabled or configured
  return baseUrl;
};

// Helper function to get responsive image URLs
export const getResponsiveImageUrls = (path, sizes = [400, 800, 1200]) => {
  // For now, return the same URL for all sizes
  return sizes.map(size => ({
    size,
    url: getPublicUrl(path)
  }));
};

// Helper function to get thumbnail URL
export const getThumbnailUrl = (path, size = 200) => {
  // For now, return the base URL without transformations
  return getPublicUrl(path);
};

// Helper function to get preview URL (low quality for placeholders)
export const getPreviewUrl = (path, size = 64) => {
  // For now, return the base URL without transformations
  return getPublicUrl(path);
}; 