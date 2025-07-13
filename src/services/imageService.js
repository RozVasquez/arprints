import { supabase, STORAGE_BUCKET, STORAGE_FOLDERS, getPublicUrl, uploadImage, deleteImage, listImages } from './supabase'

// Image management service with Supabase integration
export class ImageService {
  
  // Upload a new product image
  static async uploadProductImage(file, category, filename) {
    try {
      const folder = STORAGE_FOLDERS[category.toUpperCase()]
      if (!folder) {
        throw new Error(`Invalid category: ${category}`)
      }
      
      const path = `${folder}/${filename}`
      const result = await uploadImage(file, path)
      
      if (result.success) {
        return {
          success: true,
          url: getPublicUrl(path),
          path: path
        }
      }
      
      return result
    } catch (error) {
      console.error('Error uploading product image:', error)
      return { success: false, error }
    }
  }
  
  // Get all images for a specific category
  static async getProductImages(category) {
    try {
      const folder = STORAGE_FOLDERS[category.toUpperCase()]
      if (!folder) {
        throw new Error(`Invalid category: ${category}`)
      }
      
      const result = await listImages(folder)
      
      if (result.success) {
        const images = result.data.map(file => ({
          name: file.name,
          url: getPublicUrl(`${folder}/${file.name}`),
          path: `${folder}/${file.name}`,
          metadata: file.metadata
        }))
        
        return { success: true, images }
      }
      
      return result
    } catch (error) {
      console.error('Error getting product images:', error)
      return { success: false, error }
    }
  }
  
  // Delete a product image
  static async deleteProductImage(path) {
    try {
      return await deleteImage(path)
    } catch (error) {
      console.error('Error deleting product image:', error)
      return { success: false, error }
    }
  }
  
  // Bulk upload images for a category
  static async bulkUploadImages(files, category) {
    console.log('🔄 Starting bulk upload...')
    console.log('📁 Files to upload:', files.length)
    console.log('📂 Category:', category)
    
    try {
      const folder = STORAGE_FOLDERS[category.toUpperCase()]
      if (!folder) {
        console.error('❌ Invalid category:', category)
        throw new Error(`Invalid category: ${category}`)
      }
      
      console.log('📂 Target folder:', folder)
      
      const uploadPromises = files.map(async (file, index) => {
        console.log(`📤 Uploading file ${index + 1}/${files.length}:`, file.name)
        
        const path = `${folder}/${file.name}`
        console.log('📍 Upload path:', path)
        
        const result = await uploadImage(file, path)
        
        if (result.success) {
          console.log(`✅ File ${index + 1} uploaded successfully:`, file.name)
          return {
            success: true,
            filename: file.name,
            url: getPublicUrl(path),
            path: path
          }
        } else {
          console.error(`❌ File ${index + 1} upload failed:`, file.name, result.error)
          return {
            success: false,
            filename: file.name,
            error: result.error
          }
        }
      })
      
      console.log('⏳ Waiting for all uploads to complete...')
      const results = await Promise.all(uploadPromises)
      
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      
      console.log('📊 Upload summary:', {
        total: files.length,
        successful: successful,
        failed: failed
      })
      
      return {
        success: true,
        results: results,
        successful: successful,
        failed: failed
      }
    } catch (error) {
      console.error('💥 Error in bulk upload:', error)
      return { success: false, error }
    }
  }
  
  // Get image URL with fallback to local storage
  static getImageUrl(imagePath, fallbackPath = null) {
    try {
      // If imagePath looks like a Supabase path, use Supabase
      if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
        return getPublicUrl(imagePath)
      }
      
      // Otherwise, use local path or fallback
      return imagePath || fallbackPath
    } catch (error) {
      console.error('Error getting image URL:', error)
      return fallbackPath
    }
  }
  
  // Migrate existing local images to Supabase
  static async migrateLocalImages(localImagePaths, category) {
    try {
      const folder = STORAGE_FOLDERS[category.toUpperCase()]
      if (!folder) {
        throw new Error(`Invalid category: ${category}`)
      }
      
      const migrationResults = []
      
      for (const localPath of localImagePaths) {
        try {
          // Fetch the local image
          const response = await fetch(localPath)
          const blob = await response.blob()
          
          // Extract filename from local path
          const filename = localPath.split('/').pop()
          const file = new File([blob], filename, { type: blob.type })
          
          // Upload to Supabase
          const uploadResult = await this.uploadProductImage(file, category, filename)
          
          migrationResults.push({
            localPath: localPath,
            success: uploadResult.success,
            newUrl: uploadResult.url,
            error: uploadResult.error
          })
        } catch (error) {
          migrationResults.push({
            localPath: localPath,
            success: false,
            error: error.message
          })
        }
      }
      
      return {
        success: true,
        results: migrationResults,
        successful: migrationResults.filter(r => r.success).length,
        failed: migrationResults.filter(r => !r.success).length
      }
    } catch (error) {
      console.error('Error migrating local images:', error)
      return { success: false, error }
    }
  }
}

// Hook for using image service in React components
export const useImageService = () => {
  return {
    uploadImage: ImageService.uploadProductImage,
    getImages: ImageService.getProductImages,
    deleteImage: ImageService.deleteProductImage,
    bulkUpload: ImageService.bulkUploadImages,
    getImageUrl: ImageService.getImageUrl,
    migrateImages: ImageService.migrateLocalImages
  }
} 