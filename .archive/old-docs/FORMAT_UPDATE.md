# 📝 Update Format Template - Disesuaikan dengan Data Existing

**Date:** 2026-01-13
**Status:** ✅ Complete

---

## 🎯 Perubahan yang Dilakukan

Template Excel bulk upload telah **disesuaikan dengan format data existing** yang Anda miliki.

---

## 📊 Format Baru (Sesuai Screenshot)

### **Kolom Excel:**

| No | Nama Kolom | Tipe | Required | Contoh | Mapping ke Database |
|----|------------|------|----------|--------|---------------------|
| 1 | **Kode Item** | Text/Number | ✅ Ya | "0001", "A001" | → SKU |
| 2 | **Barcode** | Text/Number | ⚪ Optional | "0001" | → SKU (jika Kode kosong) |
| 3 | **Nama Item** | Text | ✅ Ya | "SEL PANCING" | → name |
| 4 | **Jenis** | Text | ⚪ Optional | "PRT" | → description |
| 5 | **Merek** | Text | ⚪ Optional | "PRT" | → description |
| 6 | **Rak** | Text | ⚪ Optional | "INV" | → description |
| 7 | **Tipe Item** | Text | ⚪ Optional | "INV" | → description |
| 8 | **Harga Pokok** | Number | ⚪ Optional | 900 | → original_price |
| 9 | **Harga Jual** | Number | ✅ Ya | 70000 | → price |
| 10 | **Satuan** | Text | ⚪ Optional | "PCS" | → weight |
| 11 | **Keterangan** | Text | ⚪ Optional | "" | → description |

---

## 🔄 Mapping Logic

### **1. Required Fields (Wajib):**
```
Nama Item → name (nama produk)
Harga Jual → price (harga jual ke customer)
```

### **2. Optional Fields (Opsional):**
```
Kode Item → sku (kode unik produk)
Barcode → sku (alternatif jika Kode Item kosong)
Harga Pokok → original_price (harga modal/beli)
Satuan → weight (satuan produk: PCS, BOX, KG, dll)
```

### **3. Description Builder:**
Kolom berikut digabung menjadi `description`:
```
Jenis: [value] | Merek: [value] | Rak: [value] | Tipe: [value] | [Keterangan]

Contoh:
- Jenis: PRT | Merek: PRT | Rak: INV | Tipe: INV
- Merek: Indomie | Rak: A1 | Kategori FOOD
```

### **4. Default Values:**
```
category_id: 6 (Lainnya) - bisa edit manual nanti
stock: 0 - update manual setelah upload
is_active: true
is_featured: false
image_url: null
```

---

## 📋 Contoh Data (Dari Screenshot)

### **Row 1:**
```
Kode Item: 0001
Barcode: 0001
Nama Item: SEL PANCING
Jenis: PRT
Merek: PRT
Rak: INV
Tipe Item: INV
Harga Pokok: 900
Harga Jual: 70000
Satuan: PCS
Keterangan: (kosong)
```

**Hasil Mapping:**
```javascript
{
  name: "SEL PANCING",
  sku: "0001",
  price: 70000,
  original_price: 900,
  weight: "PCS",
  description: "Jenis: PRT | Merek: PRT | Rak: INV | Tipe: INV",
  category_id: 6,
  stock: 0,
  is_active: true,
  is_featured: false
}
```

### **Row 2:**
```
Kode Item: 0002
Barcode: 0002
Nama Item: CUPS MINUM TRANSPARAN
Harga Jual: 18000
Harga Pokok: 13600
Satuan: PCS
```

**Hasil Mapping:**
```javascript
{
  name: "CUPS MINUM TRANSPARAN",
  sku: "0002",
  price: 18000,
  original_price: 13600,
  weight: "PCS",
  description: "Jenis: PRT | Merek: PRT | Rak: INV | Tipe: INV",
  category_id: 6,
  stock: 0
}
```

---

## ✅ Cara Menggunakan

### **Step 1: Download Template Baru**
1. Go to: http://localhost:3000/admin/products/bulk-upload
2. Klik **"Download Template Excel"**
3. Template sekarang sudah format sesuai screenshot Anda

### **Step 2: Copy-Paste Data Existing**
Anda bisa **langsung copy-paste** dari file Excel existing Anda:

```
1. Buka file existing (yang di screenshot)
2. Select semua data (Ctrl+A atau select range)
3. Copy (Ctrl+C)
4. Buka template yang baru didownload
5. Paste di sheet "Products" mulai baris 2
6. Hapus contoh data (baris 2-4)
7. Save file
```

### **Step 3: Upload**
1. Upload file ke sistem
2. Sistem akan auto-mapping kolom
3. Validasi akan cek Nama Item & Harga Jual
4. Upload ke database

### **Step 4: Update Stock & Kategori (Manual)**
Setelah upload berhasil:
1. Go to Admin Panel → Produk
2. Edit produk satu per satu atau batch
3. Update:
   - Stock (dari 0 ke jumlah sebenarnya)
   - Category (dari "Lainnya" ke kategori yang tepat)
   - Upload image jika ada

---

## 🔍 Validasi

### **Required Validation:**
✅ **Nama Item** - wajib diisi, tidak boleh kosong
✅ **Harga Jual** - wajib diisi, harus angka positif

### **Optional Validation:**
⚪ **Harga Pokok** - jika diisi, harus angka positif
⚪ **Kode Item** - jika kosong, akan pakai Barcode
⚪ **Barcode** - jika kosong, SKU akan auto-generate
⚪ **Kolom lain** - boleh kosong

---

## 💡 Tips Upload Data Existing

### **Jika Punya 10,000 Produk:**

**Option 1: Copy-Paste Langsung (Recommended)**
```
1. Download template baru
2. Open file existing Anda
3. Copy ALL data (10,000 rows)
4. Paste ke template baru
5. Split jadi 10 files @ 1000 rows
6. Upload satu per satu
```

**Option 2: Export-Import**
```
1. Export data existing ke Excel
2. Pastikan header match dengan template
3. Upload langsung (jika sudah format sama)
```

### **Handling Missing Columns:**
Jika Excel existing tidak punya kolom tertentu:
- **Kode Item kosong** → System pakai Barcode
- **Barcode kosong** → System auto-generate SKU
- **Harga Pokok kosong** → Tidak ada diskon (original_price = null)
- **Jenis/Merek/Rak kosong** → Description akan kosong

---

## 🎯 Workflow Lengkap

### **Phase 1: Persiapan (10 menit)**
```
1. ✅ Download template baru
2. ✅ Buka file existing (screenshot)
3. ✅ Check kolom match
4. ✅ Copy-paste data ke template
```

### **Phase 2: Split Data (15 menit)**
```
Jika 10,000 produk:
1. ✅ File 1: Row 1-1000
2. ✅ File 2: Row 1001-2000
3. ✅ ... (total 10 files)
```

### **Phase 3: Test Upload (10 menit)**
```
1. ✅ Upload File 1 (100 rows only - test)
2. ✅ Verify data di admin panel
3. ✅ Check mapping benar
4. ✅ Fix jika ada error
```

### **Phase 4: Full Upload (2-3 hours)**
```
1. ✅ Upload all 10 files
2. ✅ Monitor progress
3. ✅ Verify 10,000 produk masuk
```

### **Phase 5: Post-Upload (1-2 hours)**
```
1. ✅ Update stock (bulk atau manual)
2. ✅ Update kategori (bulk atau manual)
3. ✅ Upload images (optional)
4. ✅ Set featured products (8-10 produk)
```

**Total Time:** 4-6 hours untuk 10,000 produk complete

---

## 📊 Comparison: Before vs After

### **Before (Format Lama):**
```
Columns:
- name, category_id, price, original_price, stock,
  weight, sku, description, image_url, is_active, is_featured

Problems:
❌ Tidak match dengan data existing Anda
❌ Harus manual mapping setiap field
❌ Butuh category_id (harus lookup)
❌ Harus isi stock manual
```

### **After (Format Baru):**
```
Columns:
- Kode Item, Barcode, Nama Item, Jenis, Merek, Rak,
  Tipe Item, Harga Pokok, Harga Jual, Satuan, Keterangan

Benefits:
✅ Exact match dengan data Anda
✅ Auto-mapping semua field
✅ Default category (edit nanti)
✅ Default stock 0 (update nanti)
✅ Copy-paste langsung dari Excel existing
```

---

## 🎨 Template Preview

### **Sheet 1: Products**
```
| Kode Item | Barcode | Nama Item          | Jenis | Merek | ... |
|-----------|---------|-------------------|-------|-------|-----|
| 0001      | 0001    | SEL PANCING       | PRT   | PRT   | ... |
| 0002      | 0002    | CUPS MINUM...     | PRT   | PRT   | ... |
| 0004      | 0004    | PENERUS 3,5/5...  | PRT   | PRT   | ... |
```

### **Sheet 2: Instruksi**
```
INSTRUKSI PENGGUNAAN TEMPLATE BULK UPLOAD PRODUK - SAHARA MART

FORMAT KOLOM EXCEL:

1. KOLOM WAJIB DIISI (Required):
   - Kode Item: Kode unik produk
   - Nama Item: Nama produk
   - Harga Jual: Harga jual ke customer

2. KOLOM OPSIONAL (Optional - boleh dikosongkan):
   - Barcode, Jenis, Merek, Rak, Tipe Item,
     Harga Pokok, Satuan, Keterangan

3. MAPPING KE DATABASE:
   - Auto-mapping ke format sistem
   - Jenis/Merek/Rak → Digabung ke description
   - Default category: Lainnya (edit manual nanti)
```

---

## ✅ Testing Checklist

### **Test 1: Download Template (1 min)**
- [ ] Go to bulk upload page
- [ ] Download template
- [ ] Open in Excel
- [ ] Verify kolom match screenshot

### **Test 2: Copy-Paste Data (5 min)**
- [ ] Copy 10 rows dari Excel existing
- [ ] Paste ke template baru
- [ ] Save file
- [ ] Upload
- [ ] Verify mapping benar

### **Test 3: Full Upload (10 min)**
- [ ] Upload 100 produk
- [ ] Check di admin panel
- [ ] Verify semua field correct:
  - Name = Nama Item ✅
  - SKU = Kode Item ✅
  - Price = Harga Jual ✅
  - Original Price = Harga Pokok ✅
  - Weight = Satuan ✅
  - Description = Jenis|Merek|Rak ✅

---

## 🆘 Troubleshooting

### **Problem: Kolom tidak ketemu**
**Solution:** Pastikan header Excel EXACT match:
```
✅ "Nama Item" (ada spasi)
❌ "NamaItem" (tanpa spasi)
❌ "Nama_Item" (pakai underscore)
```

### **Problem: Harga tidak ter-parse**
**Solution:** Pastikan format number di Excel:
```
✅ 70000 (plain number)
❌ "70.000" (text dengan titik)
❌ "Rp 70.000" (text dengan Rp)
```

### **Problem: Data tidak masuk**
**Solution:** Check validation errors:
- Nama Item wajib diisi
- Harga Jual wajib diisi & harus angka

---

## 🎉 Summary

### **Yang Berubah:**
1. ✅ Template Excel format baru (match screenshot)
2. ✅ Auto-mapping dari format Anda ke database
3. ✅ Validasi lebih simple (2 kolom wajib only)
4. ✅ Support copy-paste langsung dari Excel existing

### **Yang Tidak Berubah:**
1. ✅ Batch upload (100 per batch)
2. ✅ Progress tracking
3. ✅ Error handling
4. ✅ Upload API endpoint

### **Next Steps:**
1. Download template baru
2. Copy-paste data existing Anda
3. Upload & verify
4. Update stock & category manual

---

**Status:** ✅ Ready to Use!

**Estimated Time untuk 10,000 Produk:**
- Copy-paste: 30 min
- Split files: 15 min
- Upload: 2.5 hours
- **Total: ~3 hours** 🚀

---

**Updated by:** Claude Sonnet 4.5
**Date:** 2026-01-13
**Build Status:** ✅ Success
