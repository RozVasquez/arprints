# Supabase Storage Setup for AR Prints Product Images

## Overview

We'll move your product images from local storage to Supabase Storage while keeping other images (Hero, logos, etc.) local.

### What We're Moving:
- ✅ `public/images/ProductCollection/` → Supabase Storage
- ✅ `public/images/designs/` → Supabase Storage
- ❌ `public/images/Hero.png` → Keep Local
- ❌ `public/images/favicon.png` → Keep Local
- ❌ `public/AR-01.png` → Keep Local

## 1. Supabase Project Setup

### Create Supabase Account
```bash
1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project: "arprints"
4. Wait for database setup (2-3 minutes)
```

### Get Project Credentials
```javascript
// Save these from your Supabase dashboard
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'
```

## 2. Storage Bucket Structure

### Create Buckets in Supabase Dashboard:

```
Storage > Create Bucket:

📁 product-images (Public)
  ├── 📁 instax/
  │   ├── designs/
  │   └── plain/
  ├── 📁 strips/
  │   ├── designs/
  │   ├── plain/
  │   ├── camera/
  │   └── cat/
  ├── 📁 photocards/
  │   ├── covers/
  │   └── designs/
  └── 📁 covers/
      ├── cards.png
      ├── instax.png
      └── strips.png
```

### Bucket Policies (Make Public):
```sql
-- In Supabase SQL Editor, run this:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Set policy to allow public access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

## 3. Install Supabase in Your React App

```bash
cd your-react-app
npm install @supabase/supabase-js
```

### Create Supabase Client (`src/lib/supabase.js`):
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get public URL for images
export const getImageUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}
```

### Environment Variables (`.env.local`):
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Upload Your Existing Images

### Option A: Manual Upload (Supabase Dashboard)
```
1. Go to Storage > product-images
2. Create folders: instax/, strips/, photocards/, covers/
3. Upload your images maintaining the folder structure
```

### Option B: Bulk Upload Script (Recommended)
Create `scripts/upload-images.js`:
```javascript
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'your-supabase-url',
  'your-service-role-key' // Use service role key for uploads
)

async function uploadImages() {
  const imageDir = './public/images/ProductCollection'
  
  // Upload InstaxDesign folder
  const instaxDir = path.join(imageDir, 'InstaxDesign')
  const instaxFiles = fs.readdirSync(instaxDir)
  
  for (const file of instaxFiles) {
    const filePath = path.join(instaxDir, file)
    const fileBuffer = fs.readFileSync(filePath)
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`instax/designs/${file}`, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      })
    
    if (error) {
      console.error('Upload failed:', error)
    } else {
      console.log('Uploaded:', file)
    }
  }
  
  // Repeat for other folders...
}

uploadImages()
```

## 5. Update Your Gallery Data

### Before (Local Images):
```javascript
// src/data/galleryData.js
export default {
  instax: {
    categoryImage: '/images/designs/photocards/Matte.jpg',
    subtypes: {
      designs: {
        items: [
          {
            id: 1,
            src: '/images/ProductCollection/InstaxDesign/InstaxDesign1.png',
            alt: 'Instax Design 1'
          }
        ]
      }
    }
  }
}
```

### After (Supabase Images):
```javascript
// src/data/galleryData.js
import { getImageUrl } from '../lib/supabase'

const createImageUrl = (path) => getImageUrl('product-images', path)

export default {
  instax: {
    categoryImage: createImageUrl('covers/instax.png'),
    subtypes: {
      designs: {
        items: [
          {
            id: 1,
            src: createImageUrl('instax/designs/InstaxDesign1.png'),
            alt: 'Instax Design 1'
          }
        ]
      }
    }
  }
}
```

## 6. Create Image Management Utilities

### Image Helper (`src/utils/imageUtils.js`):
```javascript
import { getImageUrl } from '../lib/supabase'

// Product image paths
export const PRODUCT_PATHS = {
  instax: {
    designs: 'instax/designs/',
    plain: 'instax/plain/'
  },
  strips: {
    designs: 'strips/designs/',
    plain: 'strips/plain/',
    camera: 'strips/camera/',
    cat: 'strips/cat/'
  },
  photocards: {
    covers: 'photocards/covers/',
    designs: 'photocards/designs/'
  },
  covers: 'covers/'
}

// Get product image URL
export const getProductImageUrl = (category, type, filename) => {
  const basePath = PRODUCT_PATHS[category][type] || PRODUCT_PATHS[category]
  return getImageUrl('product-images', `${basePath}${filename}`)
}

// For cover images
export const getCoverImageUrl = (filename) => {
  return getImageUrl('product-images', `covers/${filename}`)
}
```

## 7. Update Components to Use Supabase Images

### Updated Gallery Component:
```javascript
// src/components/DesignGallery.js
import { getProductImageUrl, getCoverImageUrl } from '../utils/imageUtils'

const productCategories = [
  {
    id: 'photocard',
    title: 'Photo Cards',
    categoryImage: getCoverImageUrl('cards.png') // From Supabase
  },
  {
    id: 'instax',
    title: 'Instax',
    categoryImage: getCoverImageUrl('instax.png') // From Supabase
  },
  {
    id: 'strips',
    title: 'Photo Strips',
    categoryImage: getCoverImageUrl('strips.png') // From Supabase
  }
]
```

### Dynamic Image Loading:
```javascript
// src/components/ProductCard.js
import { useState, useEffect } from 'react'
import { getProductImageUrl } from '../utils/imageUtils'

function ProductCard({ category, type, filename, alt }) {
  const [imageUrl, setImageUrl] = useState('')
  
  useEffect(() => {
    const url = getProductImageUrl(category, type, filename)
    setImageUrl(url)
  }, [category, type, filename])
  
  return (
    <img 
      src={imageUrl} 
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  )
}
```

## 8. Image Upload Component (For Admin)

### Add New Products Component:
```javascript
// src/components/admin/ImageUpload.js
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function ImageUpload() {
  const [uploading, setUploading] = useState(false)
  
  const uploadImage = async (event) => {
    try {
      setUploading(true)
      
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `instax/designs/${fileName}`
      
      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)
      
      if (error) throw error
      
      alert('Image uploaded successfully!')
    } catch (error) {
      alert('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  )
}
```

## 9. Performance Optimizations

### Image Caching:
```javascript
// src/hooks/useImageCache.js
import { useState, useEffect } from 'react'

export function useImageCache(imageUrl) {
  const [cachedUrl, setCachedUrl] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onload = () => {
        setCachedUrl(imageUrl)
        setLoading(false)
      }
      img.src = imageUrl
    }
  }, [imageUrl])
  
  return { cachedUrl, loading }
}
```

### Lazy Loading with Intersection Observer:
```javascript
// src/components/LazyImage.js
import { useState, useRef, useEffect } from 'react'

function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef()
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}
```

## 10. Migration Checklist

- [ ] Create Supabase project
- [ ] Set up storage buckets with public access
- [ ] Install @supabase/supabase-js
- [ ] Upload existing product images
- [ ] Update galleryData.js to use Supabase URLs
- [ ] Update components to fetch from Supabase
- [ ] Test image loading on all pages
- [ ] Add loading states and error handling
- [ ] Implement lazy loading for performance
- [ ] Remove old images from public folder (after testing)

## Benefits After Migration:

✅ **CDN Performance**: Faster image loading worldwide  
✅ **Easy Management**: Upload new products via dashboard  
✅ **Automatic Optimization**: Supabase optimizes images  
✅ **Scalable Storage**: No size limits on your hosting  
✅ **Version Control**: Keep image history and backups  

This setup gives you professional image management while keeping your site fast and maintainable! 