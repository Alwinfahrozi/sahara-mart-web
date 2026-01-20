# Supabase Storage Setup Guide

## Overview
Sahara Mart uses Supabase Storage for product images. This guide walks you through setting up the storage bucket and configuring proper security policies.

## Prerequisites
- Supabase account
- Project created (Sahara Mart project)
- Admin access to Supabase dashboard
- Project URL: `https://drlbfzwuluxhkkltcjpk.supabase.co`

---

## Setup Steps

### 1. Create Storage Bucket

1. **Navigate to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login with your account
   - Select the Sahara Mart project

2. **Go to Storage**
   - Click "Storage" in the left sidebar
   - You'll see a list of existing buckets (if any)

3. **Create New Bucket**
   - Click the "New Bucket" button
   - Fill in the configuration:
     - **Bucket name:** `product-images` (EXACTLY this name - case sensitive!)
     - **Public bucket:** ✅ YES (check this box)
     - **File size limit:** 2MB (2097152 bytes)
     - **Allowed MIME types:** `image/jpeg, image/png, image/webp`
   - Click "Create bucket"

4. **Verify Bucket Creation**
   - You should see `product-images` in the buckets list
   - Status should show "Public"

---

### 2. Configure RLS Policies

**IMPORTANT:** These policies control who can upload, read, update, and delete images.

1. **Navigate to Policies**
   - Click on the `product-images` bucket
   - Click the "Policies" tab
   - You'll see an empty list (if this is the first time)

2. **Run SQL Commands (Recommended)**

   Go to: **SQL Editor** (left sidebar) → **New Query**

   Copy and paste ALL of the following SQL commands:

   ```sql
   -- Policy 1: Allow public reads
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'product-images');

   -- Policy 2: Allow authenticated uploads
   CREATE POLICY "Authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'product-images');

   -- Policy 3: Allow authenticated updates
   CREATE POLICY "Authenticated updates"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'product-images');

   -- Policy 4: Allow authenticated deletes
   CREATE POLICY "Authenticated deletes"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'product-images');
   ```

   - Click "Run" or press `Ctrl+Enter`
   - You should see: "Success. No rows returned"

3. **Verify Policies**
   - Go back to: Storage → product-images → Policies
   - You should see 4 policies listed:
     - ✅ Public Access (SELECT)
     - ✅ Authenticated uploads (INSERT)
     - ✅ Authenticated updates (UPDATE)
     - ✅ Authenticated deletes (DELETE)
   - All should have status: "Enabled"

---

### 3. Verify Setup

1. **Check Bucket Exists**
   - Storage → Buckets list
   - `product-images` should be visible
   - Public status: ✅ Yes

2. **Check Policies Active**
   - Storage → product-images → Policies
   - 4 policies should be enabled
   - No errors or warnings

3. **Test Upload (Local Development)**

   Start your dev server:
   ```bash
   npm run dev
   ```

   Then:
   - Navigate to: http://localhost:3000/admin/login
   - Login with admin credentials
   - Go to: http://localhost:3000/admin/products/new
   - Try uploading a test image (JPG, < 2MB)
   - Verify:
     - ✅ Loading indicator appears
     - ✅ Success message shows
     - ✅ Image preview displays
     - ✅ Image URL is generated

4. **Test Public URL**
   - Upload a test image via admin panel
   - Copy the generated public URL
   - Open in new browser tab
   - Image should display without authentication

---

## Troubleshooting

### Issue: Upload fails with "Bucket not found"

**Symptoms:**
- Error message: "Bucket 'product-images' does not exist"
- Upload fails immediately

**Solution:**
1. Verify bucket name is EXACTLY `product-images` (case sensitive)
2. Check bucket exists in Supabase Dashboard → Storage
3. Verify environment variables in `.env.local`

---

### Issue: Upload fails with "Permission denied"

**Symptoms:**
- Error: "new row violates row-level security policy"
- Upload fails during save

**Solution:**
1. Check RLS policies are enabled (all 4 policies)
2. Verify you're logged in as admin
3. Re-run the RLS policy SQL commands

---

### Issue: Image URL not accessible

**Symptoms:**
- Image URL generated but returns 404
- Public URL doesn't work

**Solution:**
1. Verify bucket is set to **Public**
2. Check the "Public Access" policy exists and is enabled
3. Verify URL format: `https://[project].supabase.co/storage/v1/object/public/product-images/{filename}`

---

### Issue: Large files rejected

**Symptoms:**
- Error: "File size exceeds maximum"
- Upload fails for files > 2MB

**Solution:**
1. Maximum file size: **2MB**
2. Compress image before uploading (use TinyPNG, Squoosh.app)
3. Recommended specs: JPG/WebP, < 500KB, 800x800px max

---

## API Usage

### Upload Image

```typescript
import { uploadProductImage } from '@/lib/supabase/storage'

const file = event.target.files[0] // From file input
const publicUrl = await uploadProductImage(file)
// Save publicUrl to database
```

### Delete Image

```typescript
import { deleteProductImage } from '@/lib/supabase/storage'

const imageUrl = 'https://..../product-images/example.jpg'
await deleteProductImage(imageUrl)
```

---

## Security Notes

- **Public users:** Can ONLY read/view images (GET)
- **Authenticated admin users:** Can upload, update, delete
- **Anonymous users:** Cannot upload or delete
- **Maximum file size:** 2MB per file
- **Allowed types:** JPG, PNG, WebP only

---

## Testing Checklist

- [ ] Bucket exists and is public
- [ ] 4 RLS policies active (all enabled)
- [ ] Can upload JPG (< 2MB)
- [ ] Can upload PNG (< 2MB)
- [ ] Can upload WebP (< 2MB)
- [ ] Rejects large files (> 2MB)
- [ ] Rejects invalid types (.pdf, .txt)
- [ ] Image displays in admin preview
- [ ] Public URL accessible
- [ ] Can delete images

---

## Quick Reference

### Bucket Configuration

| Setting | Value |
|---------|-------|
| Bucket name | `product-images` |
| Public | ✅ Yes |
| Max file size | 2MB |
| Allowed types | image/jpeg, image/png, image/webp |

### RLS Policies

| Policy Name | Operation | Target Role |
|-------------|-----------|-------------|
| Public Access | SELECT | public |
| Authenticated uploads | INSERT | authenticated |
| Authenticated updates | UPDATE | authenticated |
| Authenticated deletes | DELETE | authenticated |

---

**Setup Guide Version:** 1.0
**Last Updated:** 2026-01-21
**Maintained By:** Claude Code (SAYA)
