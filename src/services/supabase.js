import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Enhanced debugging for environment variables
console.log('🔍 Environment Variables Debug:')
console.log('Supabase URL:', supabaseUrl ? 'FOUND' : 'MISSING')
console.log('Supabase Key:', supabaseAnonKey ? 'FOUND' : 'MISSING')
console.log('Full process.env check:', {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL ? 'FOUND' : 'MISSING',
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'FOUND' : 'MISSING'
})

// Check if we have valid credentials
const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-project-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key'

console.log('✅ Has valid credentials:', hasValidCredentials)

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
  console.warn('⚠️ Supabase environment variables are missing or invalid. Some features may not work.')
  console.warn('📋 Please create a .env.local file with your Supabase credentials:')
  console.warn('   REACT_APP_SUPABASE_URL=your-supabase-project-url')
  console.warn('   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key')
  
  // Use mock client
  supabaseClient = createMockClient();
  console.log('🔧 Using mock Supabase client')
} else {
  // Create real Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Using real Supabase client')
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

// Helper function to upload image with comprehensive logging
export const uploadImage = async (file, path) => {
  console.log('🚀 Starting image upload...')
  console.log('📁 File details:', {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified
  })
  console.log('📍 Upload path:', path)
  console.log('🪣 Storage bucket:', STORAGE_BUCKET)
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    console.error('❌ Invalid file type:', file.type)
    return { 
      success: false, 
      error: { message: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` }
    }
  }
  
  try {
    console.log('📤 Uploading to Supabase...')
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      })
    
    if (error) {
      console.error('❌ Upload error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      })
      
      // If unauthorized, suggest updating storage policies
      if (error.message?.includes('unauthorized') || error.message?.includes('row-level security')) {
        console.warn('⚠️ Unauthorized error. You need to update your Supabase storage policies to allow anonymous uploads.')
        console.warn('📋 Go to Supabase Dashboard → Storage → Policies and add:')
        console.warn('   CREATE POLICY "Anonymous upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = \'product-images\');')
      }
      
      return { success: false, error }
    }
    
    console.log('✅ Upload successful!')
    console.log('📊 Upload result:', data)
    
    // Get the public URL
    const publicUrl = getPublicUrl(path)
    console.log('🔗 Public URL:', publicUrl)
    
    return { 
      success: true, 
      data: {
        ...data,
        publicUrl: publicUrl
      }
    }
  } catch (error) {
    console.error('💥 Unexpected upload error:', error)
    console.error('💥 Error stack:', error.stack)
    return { success: false, error }
  }
}

// Helper function to delete image
export const deleteImage = async (path) => {
  console.log('🗑️ Deleting image:', path)
  
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])
    
    if (error) {
      console.error('❌ Error deleting image:', error)
      return { success: false, error }
    }
    
    console.log('✅ Image deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('💥 Delete error:', error)
    return { success: false, error }
  }
}

// Helper function to list images in a folder
export const listImages = async (folder = '') => {
  console.log('📋 Listing images in folder:', folder || 'root')
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder)
    
    if (error) {
      console.error('❌ Error listing images:', error)
      return { success: false, error }
    }
    
    console.log('✅ Found images:', data?.length || 0)
    console.log('📁 Image list:', data)
    
    return { success: true, data }
  } catch (error) {
    console.error('💥 List error:', error)
    return { success: false, error }
  }
}

// Helper function to create a folder (by uploading a placeholder file)
export const createFolder = async (folderPath) => {
  console.log('📁 Creating folder:', folderPath)
  
  try {
    // Create a placeholder file to establish the folder
    const placeholderContent = 'This is a placeholder file to create the folder structure.'
    const placeholderBlob = new Blob([placeholderContent], { type: 'text/plain' })
    const placeholderFile = new File([placeholderBlob], '.folder', { type: 'text/plain' })
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(`${folderPath}/.folder`, placeholderFile, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) {
      console.error('❌ Error creating folder:', error)
      return { success: false, error }
    }
    
    console.log('✅ Folder created successfully')
    return { success: true, data }
  } catch (error) {
    console.error('💥 Create folder error:', error)
    return { success: false, error }
  }
}

// Helper function to test delete permissions
export const testDeletePermissions = async () => {
  console.log('🧪 Testing delete permissions...')
  
  try {
    // Try to list storage contents to check basic access
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', { limit: 1 })
    
    if (error) {
      console.error('❌ Cannot list storage contents:', error)
      return { success: false, error, message: 'Cannot access storage - check RLS policies' }
    }
    
    console.log('✅ Can list storage contents')
    
    // Try to delete a non-existent file to test delete permissions
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(['test-delete-permission-file-that-does-not-exist.txt'])
    
    if (deleteError && deleteError.message?.includes('not found')) {
      console.log('✅ Delete permissions working (file not found is expected)')
      return { success: true, message: 'Delete permissions working' }
    } else if (deleteError) {
      console.error('❌ Delete permissions issue:', deleteError)
      return { success: false, error: deleteError, message: 'Delete permissions not working' }
    }
    
    return { success: true, message: 'Delete permissions working' }
  } catch (error) {
    console.error('💥 Test delete permissions error:', error)
    return { success: false, error, message: 'Error testing delete permissions' }
  }
}

// Helper function to delete a folder and all its contents
export const deleteFolder = async (folderPath) => {
  console.log('🗑️ Deleting folder:', folderPath)
  
  try {
    // First, list all contents in the folder
    const { data: folderContents, error: listError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath, {
        limit: 1000, // Get all contents
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (listError) {
      console.error('❌ Error listing folder contents for deletion:', listError)
      return { success: false, error: listError }
    }
    
    if (!folderContents || folderContents.length === 0) {
      console.log('📁 Folder is empty, nothing to delete')
      return { success: true }
    }
    
    // Build list of all files to delete (including subfolders)
    const filesToDelete = []
    
    const addFilesRecursively = async (path, contents) => {
      for (const item of contents) {
        const itemPath = path ? `${path}/${item.name}` : item.name
        
        if (!item.name.includes('.') || item.name.endsWith('/')) {
          // This is a folder, recursively get its contents
          const { data: subContents, error: subError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list(itemPath, {
              limit: 1000,
              offset: 0,
              sortBy: { column: 'name', order: 'asc' }
            })
          
          if (!subError && subContents) {
            await addFilesRecursively(itemPath, subContents)
          }
          
          // Also add the .folder file for this folder
          const folderPlaceholderPath = `${itemPath}/.folder`
          filesToDelete.push(folderPlaceholderPath)
        } else {
          // This is a file, add to deletion list
          filesToDelete.push(itemPath)
        }
      }
    }
    
    await addFilesRecursively(folderPath, folderContents)
    
    // Also add the .folder file for the main folder being deleted
    const mainFolderPlaceholderPath = `${folderPath}/.folder`
    filesToDelete.push(mainFolderPlaceholderPath)
    
    console.log(`🗑️ Found ${filesToDelete.length} files to delete in folder:`, folderPath)
    console.log('🗑️ Files to delete:', filesToDelete)
    
    if (filesToDelete.length === 0) {
      console.log('📁 No files to delete')
      return { success: true }
    }
    
    // Delete all files in the folder
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filesToDelete)
    
    if (deleteError) {
      console.error('❌ Error deleting folder contents:', deleteError)
      
      // Check if it's a permissions issue
      if (deleteError.message?.includes('unauthorized') || deleteError.message?.includes('row-level security')) {
        console.warn('⚠️ Unauthorized error. You need to update your Supabase storage policies to allow anonymous deletes.')
        console.warn('📋 Go to Supabase Dashboard → Storage → Policies and add:')
        console.warn('   CREATE POLICY "Anonymous delete" ON storage.objects FOR DELETE USING (bucket_id = \'product-images\');')
      }
      
      return { success: false, error: deleteError }
    }
    
    console.log('✅ Folder deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('💥 Delete folder error:', error)
    return { success: false, error }
  }
}

// Helper function to list folders and files separately
export const listFolderContents = async (folder = '') => {
  console.log('📋 Listing folder contents:', folder || 'root')
  
  try {
    // eslint-disable-next-line no-unused-vars
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      console.error('❌ Error listing folder contents:', error)
      return { success: false, error }
    }
    
    console.log('📊 Raw data from Supabase:', data)
    
    // Separate folders and files with better logic
    const folders = data?.filter(item => {
      // Check if it's a folder (no file extension or ends with /)
      const isFolder = !item.name.includes('.') || item.name.endsWith('/') || item.name === '.folder';
      console.log(`📁 Item "${item.name}" - isFolder: ${isFolder}`);
      return isFolder;
    }) || []
    
    const files = data?.filter(item => {
      // Check if it's a file (has file extension and not .folder)
      const isFile = item.name.includes('.') && !item.name.endsWith('/') && item.name !== '.folder';
      console.log(`📄 Item "${item.name}" - isFile: ${isFile}`);
      return isFile;
    }) || []
    
    console.log('📁 Found folders:', folders.length, folders.map(f => f.name))
    console.log('📄 Found files:', files.length, files.map(f => f.name))
    
    return { 
      success: true, 
      data: {
        folders,
        files,
        all: data
      }
    }
  } catch (error) {
    console.error('💥 List folder contents error:', error)
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
  
  // If no transformations needed, return base URL
  if (!width && !height && quality === 80 && format === 'auto') {
    return baseUrl;
  }

  // Build transformation query parameters
  const params = new URLSearchParams();
  
  if (width) params.append('width', width);
  if (height) params.append('height', height);
  if (quality !== 80) params.append('quality', quality);
  if (format !== 'auto') params.append('format', format);
  if (fit !== 'cover') params.append('fit', fit);
  if (focus !== 'auto') params.append('focus', focus);

  return `${baseUrl}?${params.toString()}`;
};

// Helper function to get responsive image URLs
export const getResponsiveImageUrls = (path, sizes = [400, 800, 1200]) => {
  return sizes.map(size => ({
    size,
    url: getOptimizedImageUrl(path, { width: size, quality: 85 })
  }));
};

// Helper function to get thumbnail URL
export const getThumbnailUrl = (path, size = 200) => {
  return getOptimizedImageUrl(path, { 
    width: size, 
    height: size, 
    quality: 70,
    fit: 'cover'
  });
};

// Helper function to get preview URL (low quality for placeholders)
export const getPreviewUrl = (path, size = 64) => {
  return getOptimizedImageUrl(path, { 
    width: size, 
    quality: 30,
    fit: 'cover'
  });
}; 