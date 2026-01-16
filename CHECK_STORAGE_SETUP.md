# 🔍 Storage Setup Diagnostic

**Tujuan:** Cek kenapa image upload masih error

**Waktu:** 2 menit

---

## ✅ Checklist Verifikasi

### 1. Bucket Exists & Public
1. Supabase Dashboard → Storage
2. Cek apakah bucket **`product-images`** ada?
   - ☐ YES → Lanjut step 2
   - ☐ NO → Buat bucket dulu (SUPABASE_STORAGE_SETUP.md)

3. Klik bucket `product-images`
4. Cek di header bucket, ada label **"Public"**?
   - ☐ YES → Bucket sudah public ✅
   - ☐ NO → **MASALAH DI SINI!** Bucket harus public

**FIX jika bucket TIDAK public:**
1. Klik bucket `product-images`
2. Klik "..." menu (top right)
3. Pilih **"Edit bucket"**
4. Check ✅ **"Public bucket"**
5. Save

---

### 2. Policies Active
1. Masih di bucket `product-images`
2. Klik tab **"Policies"**
3. Cek apakah ada 2 policies:

**Policy 1: Public Read Access**
```
Name: Public Read Access (atau similar)
Operation: SELECT
Target roles: public
Status: ENABLED (hijau)
```
- ☐ YES → Policy 1 OK ✅
- ☐ NO → Buat policy (lihat bagian "Create Policies" di bawah)

**Policy 2: Authenticated Upload/Delete**
```
Name: Authenticated Users Upload/Delete (atau similar)
Operations: INSERT, UPDATE, DELETE
Target roles: authenticated
Status: ENABLED (hijau)
```
- ☐ YES → Policy 2 OK ✅
- ☐ NO → Buat policy (lihat bagian "Create Policies" di bawah)

---

### 3. Test Upload Manual
1. Masih di bucket `product-images`
2. Klik **"Upload file"**
3. Pilih gambar JPG/PNG (max 2MB)
4. Upload
5. **Result:**
   - ☐ Upload SUCCESS → Storage OK ✅
   - ☐ Upload GAGAL dengan error "Policy violation" → Policy salah
   - ☐ Upload GAGAL dengan error lain → Screenshot error

6. **Jika upload success:**
   - Klik file yang baru di-upload
   - Klik **"Get URL"**
   - Copy URL
   - Buka URL di new tab browser
   - **Result:**
     - ☐ Image muncul → Storage setup PERFECT ✅
     - ☐ Error 404/403 → Bucket tidak public atau policy salah

---

## 🛠️ Create Policies (Jika Belum Ada)

### Policy 1: Public Read Access
```sql
-- Di Policies tab → New policy → Create from template
-- Pilih: "Enable read access for all users"
-- Atau manual dengan SQL:

CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### Policy 2: Authenticated Upload/Delete
```sql
-- Di Policies tab → New policy → Create custom policy
-- Atau manual dengan SQL:

CREATE POLICY "Authenticated Users Upload/Delete"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated Users Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated Users Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

---

## 🧪 Test dari Admin Panel

Setelah storage setup OK:

1. Login admin panel: `https://sahara-mart-web.vercel.app/admin/login`
2. Go to **Products** → Klik produk → **Edit**
3. Di form Edit Product, scroll ke **"Gambar Produk"**
4. Klik area upload atau drag & drop gambar
5. **Expected:**
   - Loading spinner muncul
   - Toast hijau: "Gambar berhasil diupload!"
   - Preview gambar muncul

6. **Jika error:**
   - Buka browser console (F12)
   - Klik tab **Console**
   - Screenshot semua error merah
   - Report error message

---

## 🐛 Common Errors & Fixes

### Error: "Bucket 'product-images' does not exist"
**Fix:** Bucket belum dibuat. Buat bucket dulu.

### Error: "new row violates row-level security policy"
**Fix:** Policy INSERT/UPDATE/DELETE belum di-setup untuk authenticated users.

### Error: "The resource you are looking for could not be found"
**Fix:**
1. Bucket tidak public
2. Policy SELECT untuk public belum ada

### Error: "Failed to upload: 413 Payload Too Large"
**Fix:** File size > 2MB. Compress gambar atau pilih gambar lain.

### Upload success tapi preview tidak muncul
**Fix:**
1. Check browser console untuk error
2. Kemungkinan URL salah
3. Bucket tidak public

---

## 📊 Expected Result After Setup

### ✅ Storage Dashboard
```
Buckets:
  └── product-images (Public) 🟢
      ├── Policies (2 active)
      │   ├── Public Read Access ✅
      │   └── Authenticated Upload/Delete ✅
      └── Files: (uploaded images)
```

### ✅ Admin Panel Upload
1. Upload gambar → Success toast
2. Preview muncul
3. Save produk → Image URL tersimpan di database
4. Image tampil di halaman produk customer

---

## 📸 Screenshot Yang Perlu Dibuat (Jika Masih Error)

1. **Storage → Buckets list** (tunjukkan bucket product-images)
2. **Bucket product-images → Policies tab** (tunjukkan 2 policies)
3. **Browser Console** saat upload error (tab Console)
4. **Network tab** saat upload (tunjukkan request/response)

---

**Next:** Setelah setup OK, test upload dari admin panel dan report hasilnya!
