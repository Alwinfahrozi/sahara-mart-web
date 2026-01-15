# 🚨 SETUP SUPABASE STORAGE SEKARANG!

**Error:** `Bucket not found`
**Solusi:** Setup Supabase Storage bucket (5 menit)

---

## ⚡ QUICK SETUP (Ikuti Step Ini)

### 1️⃣ Buka Supabase Dashboard
**Link:** https://supabase.com/dashboard

Pastikan Anda sudah login dan select project **Sahara Mart**

---

### 2️⃣ Create Bucket (2 menit)

1. **Klik "Storage"** di sidebar kiri
2. **Klik tombol "New bucket"** (hijau, kanan atas)
3. **Isi form:**
   ```
   Name: product-images
   Public bucket: ✅ CENTANG INI! (PENTING!)
   File size limit: 2097152 (2MB)
   ```
4. **Klik "Create bucket"**

---

### 3️⃣ Setup Policies (3 menit)

#### Policy 1: Public Read (Agar gambar bisa dilihat semua orang)

1. Klik bucket **"product-images"** yang baru dibuat
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Pilih **"Get started quickly"**
5. Pilih **"Enable read access for all users"**
6. Klik **"Review"** → **"Save policy"**

✅ Policy 1 selesai!

---

#### Policy 2: Authenticated Upload/Delete (Agar admin bisa upload/delete)

1. Masih di tab **"Policies"**, klik **"New policy"** lagi
2. Pilih **"Create a custom policy"**
3. Isi form:
   ```
   Policy name: Authenticated Upload Delete

   Allowed operations:
   ✅ INSERT
   ✅ UPDATE
   ✅ DELETE

   Target roles: authenticated

   Policy definition (USING expression): true

   WITH CHECK expression: true
   ```
4. Klik **"Review"** → **"Save policy"**

✅ Policy 2 selesai!

---

### 4️⃣ Test Setup (1 menit)

1. Di bucket **"product-images"**, klik **"Upload file"**
2. Select gambar apapun dari komputer
3. Klik **"Upload"**
4. Setelah upload, klik gambar → **"Get URL"**
5. Copy URL dan buka di browser baru
6. **Harusnya gambar muncul!** ✅

---

## 🎯 Checklist Setup

Centang ini untuk memastikan setup benar:

- [ ] ✅ Bucket `product-images` sudah dibuat
- [ ] ✅ Bucket setting **Public = YES** (centang)
- [ ] ✅ Policy "Public Read Access" aktif
- [ ] ✅ Policy "Authenticated Upload Delete" aktif
- [ ] ✅ Test upload berhasil
- [ ] ✅ URL gambar bisa dibuka di browser

---

## 🔄 Setelah Setup Selesai

1. **Kembali ke admin panel** (localhost:3000/admin/products/6291/edit)
2. **Refresh page** (F5 atau Ctrl+R)
3. **Coba upload gambar lagi**
4. **Seharusnya berhasil!** 🎉

---

## ❓ Troubleshooting

### Error: "Policy violation"
**Penyebab:** Policy 2 belum dibuat atau salah
**Solusi:** Pastikan Policy 2 punya INSERT, UPDATE, DELETE

### Error: "Bucket not found" masih muncul
**Penyebab:** Nama bucket salah atau bucket belum dibuat
**Solusi:** Pastikan nama bucket exactly `product-images` (huruf kecil, pakai dash)

### Image upload berhasil tapi tidak muncul
**Penyebab:** Policy 1 (Public Read) belum aktif
**Solusi:** Buat Policy 1 untuk public read access

---

## 📸 Struktur Bucket Setelah Setup

```
product-images/  ← Bucket (PUBLIC)
├── products/    ← Folder otomatis dibuat saat upload pertama
│   ├── 1737123456-abc123.jpg
│   ├── 1737123457-def456.png
│   └── ...
```

**URL Format:**
```
https://[YOUR_PROJECT].supabase.co/storage/v1/object/public/product-images/products/[FILENAME]
```

**Example:**
```
https://abcdefghijk.supabase.co/storage/v1/object/public/product-images/products/1737123456-abc123.jpg
```

---

## 🎊 SELESAI!

Setelah setup ini selesai:
- ✅ Image upload akan berfungsi
- ✅ Gambar akan otomatis tersimpan di Supabase
- ✅ URL gambar otomatis di-generate
- ✅ Gambar bisa dilihat di website (public access)

**Total waktu setup: 5 menit**

---

## 📞 Need Help?

Jika masih ada error, screenshot error dan tanyakan!

**Files untuk referensi:**
- `SUPABASE_STORAGE_SETUP.md` - Detailed guide
- `IMAGE_UPLOAD_COMPLETE.md` - Feature documentation
- `lib/supabase/storage.ts` - Upload code

---

**Status Error Saat Ini:** ❌ `Bucket not found`
**Setelah Setup:** ✅ Upload akan berfungsi normal

**Let's setup now!** 🚀
