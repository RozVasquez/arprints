import { supabase, STORAGE_BUCKET, STORAGE_FOLDERS, getPublicUrl, uploadImage, deleteImage, listImages } from './supabase'

// Image management service with Supabase integration
export class ImageService {
  
  // Upload a new product image to product-catalog bucket
  static async uploadProductImage(file, productName, typeName, filename) {
    try {
      const bucket = 'product-catalog'
      const path = `${productName}/${typeName}/${filename}`
      const result = await uploadImage(file, path, bucket)
      if (result.success) {
        return {
          success: true,
          url: getPublicUrl(path, bucket),
          path: path
        }
      }
      return result
    } catch (error) {
      console.error('Error uploading product image:', error)
      return { success: false, error }
    }
  }
  
  // Get all images for a specific product/type in product-catalog bucket
  static async getProductImages(productName, typeName) {
    try {
      const bucket = 'product-catalog'
      const folder = `${productName}/${typeName}`
      const result = await listImages(folder, bucket)
      if (result.success) {
        const images = result.data.map(file => ({
          name: file.name,
          url: getPublicUrl(`${folder}/${file.name}`, bucket),
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
  
  // Delete a product image from product-catalog bucket
  static async deleteProductImage(productName, typeName, filename) {
    try {
      const bucket = 'product-catalog'
      const path = `${productName}/${typeName}/${filename}`
      return await deleteImage(path, bucket)
    } catch (error) {
      console.error('Error deleting product image:', error)
      return { success: false, error }
    }
  }
  
  // Bulk upload images for a product/type in product-catalog bucket
  static async bulkUploadImages(files, productName, typeName) {
    try {
      const bucket = 'product-catalog'
      const uploadPromises = files.map(async (file) => {
        const path = `${productName}/${typeName}/${file.name}`
        const result = await uploadImage(file, path, bucket)
        if (result.success) {
          return {
            success: true,
            filename: file.name,
            url: getPublicUrl(path, bucket),
            path: path
          }
        } else {
          return {
            success: false,
            filename: file.name,
            error: result.error
          }
        }
      })
      const results = await Promise.all(uploadPromises)
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
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