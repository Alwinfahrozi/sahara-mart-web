# 📸 Supabase Storage Setup Guide
**For**: Product Image Upload Feature

---

## 🎯 What You Need to Do

Setup Supabase Storage bucket untuk menyimpan gambar produk.

---

## 📋 Step-by-Step Setup (5 menit)

### Step 1: Login ke Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Login dengan akun Anda
3. Select project: **Sahara Mart** (atau nama project Anda)

---

### Step 2: Create Storage Bucket
1. Di sidebar, klik **"Storage"**
2. Klik button **"New bucket"** (hijau, top right)
3. Fill form:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **CHECK THIS** (important!)
   - **File size limit**: 2 MB (2097152 bytes)
   - **Allowed MIME types**: Leave empty (we'll validate in code)
4. Klik **"Create bucket"**

---

### Step 3: Set Storage Policy (Security)
Bucket sudah dibuat, sekarang set policy agar:
- ✅ Public dapat READ images (untuk display di website)
- ✅ Authenticated users dapat UPLOAD/DELETE (admin only)

#### 3.1 Enable Public Read
1. Di Storage page, klik bucket **"product-images"**
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Choose **"Get started quickly"** → **"Enable read access for all users"**
5. Review policy:
   ```sql
   Policy name: Public Read Access
   Allowed operation: SELECT
   Target roles: public
   ```
6. Klik **"Review"** → **"Save policy"**

#### 3.2 Enable Authenticated Upload/Delete
1. Still di Policies tab, klik **"New policy"** again
2. Choose **"Create a custom policy"**
3. Fill form:
   - **Policy name**: `Authenticated Users Upload/Delete`
   - **Allowed operation**:
     - ✅ INSERT
     - ✅ UPDATE
     - ✅ DELETE
   - **Target roles**: `authenticated`
   - **USING expression**: `true` (allow all authenticated)
   - **WITH CHECK expression**: `true`
4. Klik **"Review"** → **"Save policy"**

---

### Step 4: Verify Setup
1. Di Storage bucket **"product-images"**, try upload test image manually:
   - Klik **"Upload file"**
   - Select any image
   - Upload
2. After upload, klik image → **"Get URL"**
3. Copy URL (should look like):
   ```
   https://YOUR_PROJECT.supabase.co/storage/v1/object/public/product-images/FILENAME.jpg
   ```
4. Open URL di new tab → image should display ✅

---

## ✅ Verification Checklist

- [ ] Bucket `product-images` created
- [ ] Bucket is **PUBLIC** (important!)
- [ ] Policy "Public Read Access" active
- [ ] Policy "Authenticated Users Upload/Delete" active
- [ ] Test upload works
- [ ] Test URL accessible dari browser

---

## 🔧 Troubleshooting

### Problem: "Policy violation" saat upload
**Solution**: Make sure Authenticated Upload/Delete policy exists dengan:
- INSERT, UPDATE, DELETE checked
- Target roles: `authenticated`
- USING: `true`

### Problem: Image URL tidak bisa dibuka
**Solution**: Make sure bucket is **PUBLIC** dan policy "Public Read Access" active

### Problem: Bucket tidak muncul
**Solution**: Refresh page, atau check project connection di settings

---

## 🎉 Done!

Setelah setup complete, lanjut ke implementasi upload feature di admin panel!

Next: Image upload component akan automatically upload ke bucket ini.
