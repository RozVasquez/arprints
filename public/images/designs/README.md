# Design Gallery Images

## Adding Images to the Gallery

To add your own design samples to the gallery, follow these steps:

1. Prepare your images:
   - Images will be displayed within a 3:2 (width:height) landscape container
   - **Use high-resolution images** - recommended minimum 1200px × 800px
   - For best results, ensure your images are sharp and clear before uploading
   - **Avoid resizing small images to be larger** as this can cause blurriness
   - Use JPG format with minimal compression (90-100% quality setting)
   - Any image size/ratio is acceptable - the system will adjust automatically

2. Add images to this directory (`/public/images/designs/`)
   - For Instax designs, place them in their respective subdirectories:
     - Mini: `/instaxmini/`
     - Square: `/instaxsq/`
     - Wide: `/instaxwide/`

3. Update the gallery data:
   - Open `/src/data/galleryData.js`
   - Add or modify the image entries under the appropriate category
   - Each image only needs a path property:
     ```javascript
     { path: "/images/designs/your-image-name.jpg" }
     ```

## Image Optimization

The gallery now uses higher quality settings:
- Converts images to blob format using 95% quality (minimal compression)
- Uses higher resolution (1200px × 800px) for better clarity
- Applies high-quality image smoothing algorithms
- Preserves the entire image without cropping
- Displays a loading placeholder until the image is ready

## Troubleshooting Image Quality Issues

If your images appear blurry:
1. **Check source image quality** - use high-resolution originals
2. **Verify file size** - larger files (1-2MB) typically have better quality
3. **Use proper image formats** - JPG or PNG are recommended
4. **Avoid multiple compressions** - each save with compression reduces quality

## Storage Optimization

The gallery automatically:
- Converts all images to efficient blob format
- Resizes images to fit within standardized dimensions (900px × 600px landscape container)
- Preserves the entire image without cropping
- Adds white background padding to maintain 3:2 container ratio
- Applies 85% JPEG compression for good balance of quality and file size
- Displays a loading placeholder until the image is ready

## Layout

- Desktop: 2 images per row
- Mobile: 1 image per row
- Clicking an image opens a modal view showing the full image without cropping 