# Local Development Setup

This document explains the local-only features that are not deployed to production.

## 🏠 Local-Only Files

The following files and directories are **NOT** deployed to production and are kept local for development:

### Admin Panel
```
/src/components/admin/          # Admin components
/src/pages/Admin.js            # Admin page
/src/routes/AdminRoutes.js     # Admin routing
/src/config/development.js     # Development config
/src/utils/supabaseTest.js     # Connection testing
```

### Environment Files
```
.env.local                     # Local environment variables
.env.development.local         # Development environment
.env.test.local               # Test environment
.env.production.local         # Production environment
```

## 🚀 How to Use

### Development (Local)
```bash
npm start
# Access admin at: http://localhost:3000/admin
# Password: arprints2024!
```

### Production (Deployed)
- Admin panel is **NOT** available
- Only public features are deployed
- Images are fetched from Supabase Storage

## 📁 File Structure

```
src/
├── components/                # ✅ DEPLOYED - Public components
├── pages/                    # ✅ DEPLOYED - Public pages
├── services/                 # ✅ DEPLOYED - Supabase client
├── utils/                    # ✅ DEPLOYED - Public utilities
├── routes/                   # ✅ DEPLOYED - Public routing
├── config/                   # ✅ DEPLOYED - Public config
│
├── components/admin/          # ❌ LOCAL ONLY - Admin components
├── pages/Admin.js            # ❌ LOCAL ONLY - Admin page
├── routes/AdminRoutes.js     # ❌ LOCAL ONLY - Admin routing
├── config/development.js     # ❌ LOCAL ONLY - Dev config
└── utils/supabaseTest.js     # ❌ LOCAL ONLY - Testing utilities
```

## 🔒 Security

- Admin panel only works in development mode
- Password is stored in development config (local only)
- No admin code is included in production build
- Environment variables are kept local

## 🛠️ Development Features

### Available in Development:
- ✅ Admin panel (`/admin`)
- ✅ Connection testing
- ✅ Image upload/management
- ✅ Debug logging
- ✅ Development configuration

### Available in Production:
- ✅ Public website
- ✅ Product display
- ✅ Image viewing (from Supabase)
- ✅ Contact forms
- ✅ Responsive design

## 📝 Notes

- The `.gitignore` file ensures local-only files are not committed
- Admin routes are conditionally rendered based on `NODE_ENV`
- Production builds exclude all admin-related code
- Environment variables are properly separated

## 🔧 Troubleshooting

If admin panel is not working:
1. Check that `NODE_ENV=development`
2. Verify all admin files exist locally
3. Check browser console for errors
4. Ensure `.env.local` has Supabase credentials 