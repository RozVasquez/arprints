import React, { useState, useEffect } from 'react';
import { ImageService } from '../services/imageService';
import { generateUniqueFilename, compressImage, cleanupPreviewUrl } from '../utils/imageUtils';
import ImageUploadSection from './admin/ImageUploadSection';
import ImageGallery from './admin/ImageGallery';

const ProductImageUploader = ({ productName, typeName, onImageUploaded, heading = null }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadResults, setUploadResults] = useState(null);

  // Load images for this product/type
  useEffect(() => {
    if (productName && typeName) {
      loadImages();
    }
    return () => {
      previewUrls.forEach(url => cleanupPreviewUrl(url));
    };
    // eslint-disable-next-line
  }, [productName, typeName]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const result = await ImageService.getProductImages(productName, typeName);
      if (result.success) {
        setImages(result.images);
      } else {
        console.error('Failed to load images:', result.error);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (validFiles, newPreviewUrls) => {
    setSelectedFiles(validFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const handleClearSelection = () => {
    previewUrls.forEach(url => cleanupPreviewUrl(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleUpload = async () => {
    if (!productName || !typeName) {
      alert('Product name and type are required.');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    setUploading(true);
    setUploadResults(null);
    try {
      const compressedFiles = await Promise.all(
        selectedFiles.map(file => compressImage(file, 0.8))
      );
      const filesWithNames = compressedFiles.map((file, index) => {
        const originalName = selectedFiles[index].name;
        const uniqueName = generateUniqueFilename(originalName);
        return new File([file], uniqueName, { type: file.type });
      });
      const result = await ImageService.bulkUploadImages(filesWithNames, productName, typeName);
      if (result.success) {
        setUploadResults(result);
        handleClearSelection();
        loadImages();
        if (onImageUploaded) {
          onImageUploaded(result);
        }
      } else {
        console.error('Upload failed:', result.error);
        alert('Upload failed. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Upload error. Please check the console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      // image.path is the full path (productName/typeName/filename)
      const filename = image.name;
      const result = await ImageService.deleteProductImage(productName, typeName, filename);
      if (result.success) {
        loadImages();
      } else {
        console.error('Delete failed:', result.error);
        alert('Failed to delete image. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Delete error. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{heading || `Product Images - ${productName} / ${typeName}`}</h2>
      <ImageUploadSection
        selectedFiles={selectedFiles}
        previewUrls={previewUrls}
        uploading={uploading}
        uploadResults={uploadResults}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        onClearSelection={handleClearSelection}
      />
      <ImageGallery
        images={images}
        loading={loading}
        category={productName + '/' + typeName}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
};

export default ProductImageUploader; 