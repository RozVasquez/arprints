# 🔧 Configuration Guide - AR Prints Supabase Setup

## 1. Environment Variables (.env file)

I've created a `.env` file in your project root. **You need to update it with your actual Supabase credentials:**

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### How to get these values:

1. **Go to Supabase Dashboard**: https://app.supabase.com/
2. **Create a new project** (or select existing one)
3. **Go to Settings → API**
4. **Copy these values**:
   - **Project URL** → Replace `your-supabase-project-url`
   - **anon public key** → Replace `your-supabase-anon-key`

### Example of what it should look like:
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzQ5ODk5OSwiZXhwIjoxOTYzMDc0OTk5fQ.1234567890abcdefghijklmnopqrstuvwxyz
```

## 2. Supabase Project Setup

### Create Storage Bucket:
1. In Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. **Name**: `product-images`
4. **Make it public** ✅ (check the public checkbox)
5. Click **"Create bucket"**

### Create Folder Structure:
After creating the bucket, create these folders inside `product-images`:
- `instax/`
- `strips/`
- `photocards/`
- `covers/`
- `designs/`

## 3. Storage Security Policies

In your Supabase Dashboard → **SQL Editor**, run this query:

```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated upload (for admin)
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated delete (for admin)
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

## 4. Admin Panel Configuration

### Change Admin Password:
Edit `src/pages/Admin.js` and update this line:

```javascript
// Change this password to something secure
if (password === 'arprints2024') {
```

**Replace `arprints2024` with your own secure password.**

## 5. Test Configuration

### Start Development Server:
```bash
npm start
```

### Test Admin Panel:
1. Go to `http://localhost:3000/admin`
2. Login with your password
3. Try uploading a test image

## 6. .gitignore Configuration

Make sure your `.gitignore` file includes `.env` to keep your credentials secure:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 7. Production Deployment (Vercel)

### Add Environment Variables to Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add these variables:
   - `REACT_APP_SUPABASE_URL` = your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key

## 8. Optional: Update Existing Components

### To use Supabase images in your components:

```javascript
// Before:
import productImage from '../images/product.jpg';

// After:
import { getProductImageUrl } from '../utils/imageUtils';

// In your component:
const imageUrl = getProductImageUrl('instax/product.jpg', '/images/product.jpg');
```

## 🚨 Important Security Notes

1. **Never commit `.env` to Git** - It's already in your `.gitignore`
2. **Change the admin password** from the default `arprints2024`
3. **Keep your Supabase keys secure** - Don't share them publicly
4. **Use environment variables in production** - Don't hardcode keys

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Updated `.env` with real credentials
- [ ] Created `product-images` bucket (public)
- [ ] Created folder structure in bucket
- [ ] Added security policies via SQL
- [ ] Changed admin password
- [ ] Tested admin panel upload
- [ ] Added environment variables to Vercel

## 🆘 Troubleshooting

**Problem**: Images not loading
**Solution**: Check that your `.env` has the correct URL and key

**Problem**: Can't upload images
**Solution**: Verify bucket is public and policies are set

**Problem**: Admin login not working
**Solution**: Check password in `src/pages/Admin.js`

**Problem**: Build errors
**Solution**: Make sure `.env` file exists and has correct format

That's it! Once you complete these steps, your Supabase integration will be fully functional. 🎉 