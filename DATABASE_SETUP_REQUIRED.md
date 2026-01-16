# 🔴 CRITICAL: Database Setup Required

## ⚠️ IMPORTANT NOTICE

Untuk memperbaiki **Bug #8: Log aktivitas stok tidak tercatat**, Anda HARUS menjalankan SQL script berikut di Supabase Dashboard!

---

## 📝 SQL Scripts Yang Harus Dijalankan

### 1. ✅ WAJIB: Create Stock Logs Table

**File:** `database/create_stock_logs_table_FIXED.sql` ⭐ **USE THIS (FIXED VERSION)**

**Kapan:** SEBELUM menggunakan fitur stock management

**⚠️ IMPORTANT:** Gunakan file `create_stock_logs_table_FIXED.sql` (bukan yang lama) karena sudah compatible dengan products table yang menggunakan INTEGER ID.

**Cara:**
1. Login ke Supabase Dashboard: https://drlbfzwuluxhkkltcjpk.supabase.co
2. Klik "SQL Editor" di sidebar kiri
3. Klik "New query"
4. Buka file `database/create_stock_logs_table_FIXED.sql` ⭐
5. Copy SEMUA isi file
6. Paste ke SQL Editor
7. Klik "RUN" (tombol hijau)
8. Tunggu sampai muncul: "stock_logs table created successfully!"

**Apa yang akan dibuat:**
- ✅ Table `stock_logs` untuk menyimpan history perubahan stok
- ✅ 3 Indexes untuk performance
- ✅ 2 RLS Policies untuk security
- ✅ 3 Views: `low_stock_products`, `out_of_stock_products`, `stock_movement_summary`

---

### 2. ✅ WAJIB: Analytics Delivered Only

**File:** `database/DEPLOY_ANALYTICS_DELIVERED_ONLY.sql`

**Kapan:** Agar dashboard stats hanya count delivered orders (bukan pending/cancelled)

**Cara:** Sama seperti di atas, run SQL script ini

---

## 🔍 Cara Cek Apakah Sudah Berhasil

### Cek Table Stock Logs:
1. Supabase Dashboard → Table Editor
2. Cari table `stock_logs`
3. Jika ada, berarti sudah berhasil ✅

### Cek View:
1. Supabase Dashboard → SQL Editor
2. Run query: `SELECT * FROM stock_logs LIMIT 10;`
3. Jika tidak error, berarti sudah berhasil ✅

### Test Stock Management:
1. Login admin panel
2. Go to Stock page
3. Click "Restock" pada produk yang habis
4. Add stock (misal: 100 units)
5. Refresh page
6. Cek section "Riwayat Perubahan Stok Terbaru"
7. Harusnya muncul log aktivitas ✅

---

## 🐛 Troubleshooting

### Error: "foreign key constraint ... incompatible types: uuid and integer"
**Penyebab:** File SQL lama menggunakan UUID tapi products table pakai INTEGER
**Solusi:** Gunakan file FIXED version: `database/create_stock_logs_table_FIXED.sql` ⭐

### Error: "relation stock_logs does not exist"
**Solusi:** Belum run SQL script. Run `database/create_stock_logs_table_FIXED.sql`

### Error: "permission denied for table stock_logs"
**Solusi:** RLS policies belum di-setup. Re-run SQL script lengkap.

### Log aktivitas masih kosong setelah add stock
**Solusi:**
1. Buka browser console (F12)
2. Check Network tab
3. Cari request ke `/api/stock/add`
4. Lihat response - harusnya ada `log: {...}`
5. Jika ada error, screenshot dan report

---

## 📋 Checklist Setup Database

Cetak ini dan check saat selesai:

```
[ ] 1. Run SQL: create_stock_logs_table.sql
[ ] 2. Run SQL: DEPLOY_ANALYTICS_DELIVERED_ONLY.sql
[ ] 3. Verify table stock_logs exists
[ ] 4. Test stock management (add stock)
[ ] 5. Verify log aktivitas muncul
[ ] 6. Setup Supabase Storage (product-images bucket)
[ ] 7. Test image upload
```

---

## 🚀 After Setup Complete

Setelah semua SQL script dijalankan:
1. ✅ Bug #8 akan teratasi (log aktivitas akan tercatat)
2. ✅ Dashboard stats akan akurat (hanya count delivered orders)
3. ✅ Stock management akan fully functional
4. ✅ Admin bisa track semua perubahan stok

---

**Status:** 🔴 PENDING - User action required
**Priority:** CRITICAL - Harus dilakukan sebelum deploy production!
**Estimated Time:** 5 menit

---

*Last Updated: 17 Januari 2026*
