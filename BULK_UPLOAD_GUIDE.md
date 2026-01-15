# 📦 Bulk Upload Guide - Upload 10,000+ Produk via Excel

**Feature:** Bulk Upload Produk menggunakan file Excel (.xlsx)
**Created:** 2026-01-13
**Status:** ✅ Ready to Use

---

## 🎯 Overview

Fitur Bulk Upload memungkinkan Anda mengupload **ribuan produk sekaligus** menggunakan file Excel. Perfect untuk:
- Initial data migration (10,000+ produk)
- Update stok massal
- Import dari inventory system lain
- Batch product creation

---

## ⚡ Quick Start (5 Menit)

### Step 1: Akses Halaman Bulk Upload
1. Login ke Admin Panel: http://localhost:3000/admin/login
2. Klik menu **"Bulk Upload"** di sidebar
   - Atau dari **Daftar Produk** → klik button **"Bulk Upload"** (biru)

### Step 2: Download Template
1. Klik button **"Download Template Excel"**
2. File `Template_Bulk_Upload_Produk_Sahara_Mart.xlsx` akan terdownload
3. Buka file dengan Excel atau Google Sheets

### Step 3: Isi Data Produk
1. Buka sheet **"Products"** (bukan "Instruksi")
2. Hapus baris contoh (baris 2-3)
3. Isi data produk Anda mulai dari baris 2
4. Pastikan format data benar (lihat template)

### Step 4: Upload File
1. Kembali ke halaman Bulk Upload
2. Klik **"Pilih File Excel"** atau drag & drop file
3. Tunggu validasi selesai
4. Jika ada error → perbaiki file → upload ulang
5. Jika semua valid → klik **"Upload X Produk"**
6. Tunggu proses selesai (progress bar akan muncul)

---

## 📋 Format Data Excel

### Kolom WAJIB DIISI (Required):

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| **name** | Text | "Minyak Goreng Bimoli 1L" | Nama produk |
| **category_id** | Number | 1 | ID kategori (1-6, lihat daftar di bawah) |
| **price** | Number | 25000 | Harga jual (angka saja, tanpa Rp/titik/koma) |
| **stock** | Number | 100 | Jumlah stok (angka bulat) |

### Kolom OPSIONAL (Optional):

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| **original_price** | Number | 30000 | Harga asli/coret (untuk diskon). Kosongkan jika tidak ada diskon |
| **weight** | Text | "1000ml" | Berat/ukuran produk |
| **sku** | Text | "MG-BIM-1L" | Kode SKU (unique). Kosongkan untuk auto-generate |
| **description** | Text | "Minyak goreng premium..." | Deskripsi produk |
| **image_url** | Text | "https://..." | URL gambar produk. Kosongkan jika belum ada |
| **is_active** | Boolean | true | Status aktif (true/false). Default: true |
| **is_featured** | Boolean | false | Produk unggulan (true/false). Default: false |

---

## 🏷️ Daftar Kategori (Category ID)

| ID | Nama Kategori |
|----|---------------|
| 1  | Makanan & Minuman |
| 2  | Susu & Bayi |
| 3  | Sembako |
| 4  | Rumah Tangga |
| 5  | Kesehatan & Kecantikan |
| 6  | Lainnya |

**PENTING:** Gunakan angka ID, bukan nama kategori!

---

## ✅ Contoh Data Valid

```
name                      | category_id | price | original_price | stock | weight | sku        | description                        | image_url | is_active | is_featured
Minyak Goreng Bimoli 1L  | 1          | 25000 | 30000         | 100   | 1000ml | MG-BIM-1L  | Minyak goreng premium             | (kosong)  | true      | false
Susu UHT Indomilk 1L     | 2          | 18000 | (kosong)      | 50    | 1000ml | SUSU-IND-1L| Susu UHT rasa original            | (kosong)  | true      | true
Beras Premium 5kg        | 3          | 65000 | 70000         | 200   | 5kg    | BERAS-PRM  | Beras premium kualitas terbaik    | (kosong)  | true      | false
```

**Key Points:**
- Harga: Angka saja (25000, BUKAN "Rp 25.000" atau "25,000")
- Boolean: Gunakan `true` atau `false` (huruf kecil)
- Kosong: Biarkan cell kosong atau blank (jangan tulis "null" atau "-")

---

## 🚀 Best Practices untuk Upload 10,000+ Produk

### 1. **Split File (RECOMMENDED)**
Untuk performa optimal:
- **Recommended:** 500-1000 produk per file
- **Maximum:** 1000 produk per file
- Contoh untuk 10,000 produk:
  - File 1: Produk 1-1000
  - File 2: Produk 1001-2000
  - File 3: Produk 2001-3000
  - ... dst

**Why?** Upload bertahap lebih stable, mudah troubleshoot jika ada error.

### 2. **Backup Data**
- Simpan backup file Excel original
- Jangan edit langsung di sistem, edit di Excel dulu

### 3. **Upload di Waktu Traffic Rendah**
- Best time: Malam hari (21:00 - 06:00)
- Hindari saat jam sibuk toko

### 4. **Koneksi Internet Stabil**
- Pastikan WiFi/internet stabil
- Jangan close browser saat upload sedang berjalan

### 5. **Validasi Dulu di Excel**
Sebelum upload, cek di Excel:
- ✅ Tidak ada baris kosong di tengah data
- ✅ Semua kolom required terisi
- ✅ Category ID valid (1-6)
- ✅ Harga dan stok berupa angka
- ✅ Tidak ada karakter aneh (emoji, simbol)

---

## 🔍 Validasi & Error Handling

### Sistem Validasi 2 Tahap:

#### **Tahap 1: Client-Side Validation (Browser)**
Saat file diupload, sistem akan cek:
- ✅ Format file (.xlsx/.xls)
- ✅ Ukuran file (max 10MB)
- ✅ Kolom required terisi
- ✅ Tipe data benar (angka vs teks)
- ✅ Category ID valid (1-6)

**Jika ada error:**
- Ditampilkan detail error per baris
- File TIDAK akan diupload
- **Action:** Perbaiki error di Excel → save → upload ulang

#### **Tahap 2: Server-Side Validation (Database)**
Saat upload ke database, sistem akan cek:
- ✅ Slug uniqueness
- ✅ Database constraints
- ✅ Duplicate SKU (jika diisi)

**Jika ada error:**
- Produk yang valid tetap terupload
- Produk yang error ditampilkan detailnya
- **Action:** Lihat error log → perbaiki produk yang error → upload lagi

---

## 📊 Monitoring Progress

### Progress Indicator:
```
Mengupload... 243 / 1000
[████████░░░░░░░░░░] 24%
```

### Batch Processing:
- Upload dilakukan per batch 100 produk
- Total 1000 produk = 10 batches
- Delay 500ms antar batch (untuk stabilitas)

### Upload Result:
```
┌─────────────────────┐
│ Total:     1000     │
│ Berhasil:   987     │
│ Gagal:       13     │
└─────────────────────┘

Detail Error:
Baris 45: Harga harus angka positif
Baris 123: Category ID tidak valid
...
```

---

## 🐛 Common Errors & Solutions

### Error 1: "Nama produk wajib diisi"
**Cause:** Cell `name` kosong atau blank
**Solution:** Isi nama produk di kolom A

### Error 2: "Category ID harus angka 1-6"
**Cause:** Category ID salah atau bukan angka
**Solution:**
- ✅ Gunakan: 1, 2, 3, 4, 5, atau 6
- ❌ Jangan gunakan: "Makanan", "Sembako", 0, 7, dst

### Error 3: "Harga harus angka positif"
**Cause:** Harga berisi teks atau negatif
**Solution:**
- ✅ Gunakan: 25000 (angka saja)
- ❌ Jangan gunakan: "Rp 25.000", "25000,-", -1000

### Error 4: "Format file harus .xlsx atau .xls"
**Cause:** File bukan Excel format
**Solution:** Save as `.xlsx` dari Excel

### Error 5: "Ukuran file maksimal 10MB"
**Cause:** File terlalu besar
**Solution:**
- Split file menjadi beberapa bagian
- Remove images dari Excel (use image_url instead)

### Error 6: Upload stuck/timeout
**Cause:** Koneksi internet lemah atau file terlalu besar
**Solution:**
- Cek koneksi internet
- Split file menjadi lebih kecil (max 500 produk)
- Coba upload ulang

---

## 💡 Tips & Tricks

### 1. Auto-generate SKU
Jika kolom `sku` dikosongkan, sistem akan auto-generate:
```
Format: {slug}-{timestamp}
Contoh: minyak-goreng-bimoli-1l-1736726400000
```

### 2. Auto-generate Slug
Sistem auto-generate slug dari nama produk:
```
"Minyak Goreng Bimoli 1L" → "minyak-goreng-bimoli-1l-1736726400000"
```

### 3. Bulk Update Existing Products
Untuk update produk existing:
- Upload file baru dengan nama produk yang sama
- Sistem akan create duplicate (BUKAN update)
- **Rekomendasi:** Edit manual via admin panel untuk update

### 4. Image Upload Nanti
- Upload produk dulu tanpa image_url
- Upload images nanti via admin panel (satu per satu)
- Atau gunakan external CDN (upload ke Cloudinary/ImgBB → paste URL)

### 5. Test dengan Sample Kecil
Sebelum upload 10,000 produk:
1. Upload 10-50 produk dulu (test)
2. Verify data benar di database
3. Jika OK → lanjut upload semua

---

## 🔄 Workflow untuk 10,000 Produk

### Phase 1: Preparation (30-60 menit)
1. ✅ Collect data produk (dari inventory system/manual)
2. ✅ Download template Excel
3. ✅ Format data sesuai template
4. ✅ Validasi data di Excel (cek duplikat, format, dll)
5. ✅ Split menjadi 10 file @ 1000 produk

### Phase 2: Test Upload (15 menit)
1. ✅ Upload file pertama (100 produk saja sebagai test)
2. ✅ Verify data muncul di katalog
3. ✅ Verify harga, stok, kategori benar
4. ✅ Jika ada error → fix template → test ulang

### Phase 3: Bulk Upload (2-3 jam)
1. ✅ Upload file 1 (1000 produk) → tunggu selesai
2. ✅ Verify berhasil → upload file 2
3. ✅ Repeat untuk file 3-10
4. ✅ Total time: ~15-20 menit per 1000 produk

### Phase 4: Verification (30 menit)
1. ✅ Check total produk di admin panel
2. ✅ Spot check random produk (cek detail benar)
3. ✅ Test search di katalog
4. ✅ Test filter by category

### Phase 5: Image Upload (Optional - 5-10 jam)
1. ✅ Upload images via admin panel (manual)
2. ✅ Atau update image_url via bulk update (future feature)

**Total Time Estimate:** 3-5 jam untuk 10,000 produk (excluding image upload)

---

## 📁 File Structure

```
app/
└── admin/
    └── products/
        └── bulk-upload/
            └── page.tsx          # Main bulk upload page

app/api/
└── products/
    └── bulk/
        └── route.ts              # Bulk upload API endpoint

components/
└── (no new components)           # Upload UI inline di page.tsx

public/
└── (no files)                    # Template generated dynamically

node_modules/
└── xlsx/                         # Excel parser library
```

---

## 🔧 Technical Details

### Dependencies:
```json
{
  "xlsx": "^0.18.5"  // Excel file parser
}
```

### API Endpoint:
```
POST /api/products/bulk
Body: { products: Product[] }
Response: {
  message: string,
  summary: { total, successful, failed },
  successful: Product[],
  errors: Error[]
}
```

### Batch Processing:
- Batch size: 100 produk
- Delay between batches: 500ms
- Total time per 1000 produk: ~15 menit

### File Validation:
- Max file size: 10MB
- Allowed formats: .xlsx, .xls
- Max recommended rows: 1000 per file

---

## 🎯 Next Steps After Bulk Upload

### 1. Verify Data
- Go to Admin Panel → Daftar Produk
- Check total produk count
- Spot check random produk

### 2. Upload Images (Optional)
- Go to each product → Edit
- Upload image via Image Upload component
- Or use image_url from external CDN

### 3. Set Featured Products
- Mark 8-10 produk sebagai "Produk Unggulan"
- These will appear on homepage

### 4. Test Public Site
- Go to: http://localhost:3000
- Test katalog, search, cart
- Verify all products visible

### 5. Launch!
- Deploy to Vercel
- Announce to customers
- Start accepting orders

---

## 📊 Performance Metrics

### Expected Performance:
- **100 produk:** ~1.5 menit
- **500 produk:** ~7-8 menit
- **1000 produk:** ~15 menit
- **10,000 produk:** ~2.5 jam (10 files @ 1000 each)

### Optimization:
- ✅ Batch processing (100 per batch)
- ✅ Delay between batches (500ms)
- ✅ Client-side validation (reduce server load)
- ✅ Continue on error (resilient)

---

## 🆘 Troubleshooting

### Problem: Upload stuck at 0%
**Solution:**
1. Check browser console for errors (F12)
2. Check internet connection
3. Try smaller file (100 produk)
4. Clear browser cache
5. Try different browser

### Problem: All products failed
**Solution:**
1. Check template format match
2. Verify category IDs (1-6)
3. Check for special characters
4. Try upload 1 product first (test)

### Problem: Some products failed
**Solution:**
1. Read error messages carefully
2. Fix errors in Excel
3. Upload ONLY failed products again
4. Successful products won't duplicate

### Problem: Can't download template
**Solution:**
1. Check browser allows downloads
2. Try right-click → Save As
3. Clear browser cache
4. Try different browser

---

## 📞 Support

### If You Need Help:
1. Check this guide first
2. Check error messages carefully
3. Test with small file first (10-50 produk)
4. Contact developer with:
   - Screenshot of error
   - Sample Excel file (5-10 baris)
   - Browser console log (F12 → Console tab)

---

## 🎉 Success Checklist

Before marking bulk upload as complete:

- [ ] Downloaded template Excel
- [ ] Filled data produk (10,000 rows)
- [ ] Split into 10 files @ 1000 produk
- [ ] Test upload with 100 produk first
- [ ] Verified test data in database
- [ ] Uploaded all 10 files successfully
- [ ] Total produk count matches expected
- [ ] Spot checked random produk (data correct)
- [ ] All categories have products
- [ ] Search & filter works
- [ ] No console errors
- [ ] Ready to launch!

---

## 📝 Changelog

### v1.0 - 2026-01-13
- ✅ Initial release
- ✅ Excel template with instructions
- ✅ Client-side validation
- ✅ Batch processing (100 per batch)
- ✅ Progress tracking UI
- ✅ Error handling & reporting
- ✅ Support for 10,000+ products

---

**Status: READY FOR USE** ✅

**Estimated Time to Upload 10,000 Products:** 3-5 hours

**Recommendation:** Start with 100 produk test, then scale up!

Good luck! 🚀
