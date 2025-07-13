# Feedback Image Storage Setup

## Overview

Feedback images are now stored in a separate Supabase storage bucket to keep them isolated from product images. This prevents feedback images from appearing in the product gallery.

## Setup Instructions

### 1. Create Feedback Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **Create a new bucket**
4. Set bucket name: `feedback-images`
5. Make it **public** (for image access)
6. Click **Create bucket**

### 2. Configure Storage Policies

In your Supabase SQL Editor, run these policies for the feedback bucket:

```sql
-- Allow public read access to feedback images
CREATE POLICY "Public read access to feedback images" ON storage.objects
FOR SELECT USING (bucket_id = 'feedback-images');

-- Allow authenticated users to upload feedback images
CREATE POLICY "Authenticated upload feedback images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'feedback-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete feedback images
CREATE POLICY "Authenticated delete feedback images" ON storage.objects
FOR DELETE USING (bucket_id = 'feedback-images' AND auth.role() = 'authenticated');
```

### 3. Update Existing Feedback Data

If you have existing feedback with images in the `product-images` bucket, you can migrate them:

1. **Option A: Manual Migration**
   - Download feedback images from `product-images` bucket
   - Upload them to `feedback-images` bucket
   - Update the `image_path` in your feedbacks table

2. **Option B: Update Database Paths**
   - Update the `image_path` column in your feedbacks table
   - Change paths from `product-images/feedback/` to `feedback-images/`

### 4. Test the Setup

1. Upload a test feedback image to the `feedback-images` bucket
2. Add a test feedback record with the image path
3. Verify the image appears in the feedback section
4. Verify the image does NOT appear in the product gallery

## File Structure

```
feedback-images/
├── feedback1.jpg
├── feedback2.png
└── feedback3.webp
```

## Benefits

- ✅ **Separation of Concerns**: Product and feedback images are completely separate
- ✅ **Clean Gallery**: Product gallery only shows actual product images
- ✅ **Better Organization**: Feedback images have their own dedicated storage
- ✅ **Easier Management**: Can manage feedback images independently

## Troubleshooting

### Images Not Loading
- Check that the `feedback-images` bucket exists
- Verify storage policies are correctly set
- Ensure image paths in database are correct

### Images Still Appearing in Gallery
- Clear browser cache
- Check that feedback paths are being excluded in `galleryService.js`
- Verify no feedback images are in the `product-images` bucket

### Upload Issues
- Check that you're authenticated when uploading
- Verify bucket permissions
- Ensure file size is within limits

## Code Changes Made

1. **`src/services/supabase.js`**: Added `FEEDBACK_STORAGE_BUCKET` constant
2. **`src/services/feedbackService.js`**: Added feedback image URL helper
3. **`src/components/FeedbackSection.js`**: Updated to use new helper function
4. **`src/services/galleryService.js`**: Added feedback path exclusion

## Migration Checklist

- [ ] Create `feedback-images` bucket in Supabase
- [ ] Set up storage policies
- [ ] Migrate existing feedback images (if any)
- [ ] Test feedback image display
- [ ] Verify product gallery is clean
- [ ] Update any admin tools to use correct bucket 

## Temporary Anonymous Upload Setup

### 1. Enable Anonymous Upload for Product Images

Run this in your Supabase SQL Editor:

```sql
-- Temporarily allow anonymous uploads to product-images bucket
CREATE POLICY "Temporary anonymous upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Temporarily allow anonymous uploads to feedback-images bucket (if you created it)
CREATE POLICY "Temporary anonymous feedback upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'feedback-images');
```

### 2. Enable Anonymous Upload for Feedbacks Table

```sql
-- Temporarily allow anonymous inserts to feedbacks table
CREATE POLICY "Temporary anonymous feedback insert" ON feedbacks
FOR INSERT WITH CHECK (true);
```

### 3. Complete Anonymous Access (For Testing Only)

If you want full anonymous access for testing:

```sql
-- Allow all anonymous operations on product-images bucket
CREATE POLICY "Temporary anonymous all operations" ON storage.objects
FOR ALL USING (bucket_id = 'product-images');

-- Allow all anonymous operations on feedback-images bucket
CREATE POLICY "Temporary anonymous feedback all operations" ON storage.objects
FOR ALL USING (bucket_id = 'feedback-images');

-- Allow all anonymous operations on feedbacks table
CREATE POLICY "Temporary anonymous all feedback operations" ON feedbacks
FOR ALL USING (true);
```

## ⚠️ **IMPORTANT SECURITY WARNING**

**These policies are for testing only!** They allow anyone to upload files and insert data. Remember to:

### 4. Remove Anonymous Access After Testing

```sql
-- Remove temporary anonymous policies
DROP POLICY IF EXISTS "Temporary anonymous upload" ON storage.objects;
DROP POLICY IF EXISTS "Temporary anonymous feedback upload" ON storage.objects;
DROP POLICY IF EXISTS "Temporary anonymous all operations" ON storage.objects;
DROP POLICY IF EXISTS "Temporary anonymous feedback all operations" ON storage.objects;
DROP POLICY IF EXISTS "Temporary anonymous feedback insert" ON feedbacks;
DROP POLICY IF EXISTS "Temporary anonymous all feedback operations" ON feedbacks;
```

### 5. Restore Secure Policies

After testing, restore the secure policies:

```sql
-- Restore secure product image policies
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Restore secure feedback policies
CREATE POLICY "Public read access to feedback images" ON storage.objects
FOR SELECT USING (bucket_id = 'feedback-images');

CREATE POLICY "Authenticated upload feedback images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'feedback-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete feedback images" ON storage.objects
FOR DELETE USING (bucket_id = 'feedback-images' AND auth.role() = 'authenticated');

-- Restore secure feedback table policies
CREATE POLICY "Allow public read access" ON feedbacks
FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON feedbacks
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access" ON feedbacks
FOR ALL USING (auth.role() = 'authenticated');
```

## Quick Test Script

If you want to test anonymous uploads quickly, run this complete script:

```sql
-- TEMPORARY ANONYMOUS ACCESS FOR TESTING
-- ⚠️ REMOVE AFTER TESTING ⚠️

-- Allow anonymous uploads to both buckets
CREATE POLICY "Temporary anonymous upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Temporary anonymous feedback upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'feedback-images');

-- Allow anonymous inserts to feedbacks table
CREATE POLICY "Temporary anonymous feedback insert" ON feedbacks
FOR INSERT WITH CHECK (true);

-- Allow anonymous reads
CREATE POLICY "Temporary anonymous read" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images' OR bucket_id = 'feedback-images');

CREATE POLICY "Temporary anonymous feedback read" ON feedbacks
FOR SELECT USING (true);
```

## Testing Your Anonymous Upload

After running the policies, you can test by:

1. **Upload images** through your admin panel without authentication
2. **Insert feedback** directly in the SQL Editor:
   ```sql
   INSERT INTO feedbacks (name, hearts, text, image_path) VALUES
   ('Test User', 5, 'Anonymous upload test!', 'test-image.jpg');
   ```

## Remember to Clean Up!

**Always remove the temporary policies after testing** to prevent security issues. The anonymous access allows anyone to upload files and insert data, which could be exploited maliciously.

Let me know if you need help with any specific testing scenarios! 