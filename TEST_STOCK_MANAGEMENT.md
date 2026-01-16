# 🧪 TEST STOCK MANAGEMENT - Step by Step

**Tujuan:** Verifikasi bahwa stok otomatis tersimpan setelah tambah stok

**Waktu:** 10 menit

---

## ✅ **TEST 1: Tambah Stok & Auto-Save**

### **Langkah:**

1. **Login Admin**
   - URL: `https://sahara-mart-web.vercel.app/admin/login`
   - Login dengan akun admin Anda

2. **Buka Halaman Stok**
   - Klik menu "Stok" di sidebar
   - Atau URL: `/admin/stock`

3. **Catat Stok Awal**
   - Cari produk di section "Stok Habis" atau "Stok Menipis"
   - Misal: **INDOMIE GORENG** dengan stok = 5
   - **CATAT:** Stok awal = **5 units**

4. **Tambah Stok**
   - Klik tombol **"Restock"** pada produk tersebut
   - Modal "Tambah Stok" akan muncul
   - Isi form:
     - **Jumlah yang Ditambah:** 100
     - **Alasan:** Restock bulanan
     - **Catatan:** Test auto-save (optional)
   - Klik **"Simpan"**

5. **Verifikasi Toast Success**
   - Toast hijau muncul: ✅ "Successfully added 100 units to INDOMIE GORENG"
   - Modal tertutup otomatis

6. **Refresh Halaman**
   - Tekan **F5** untuk refresh
   - Tunggu halaman load

7. **Cek Stok Baru**
   - Cari produk yang sama (INDOMIE GORENG)
   - **EXPECTED:** Stok sekarang = **105 units** (5 + 100)
   - **ACTUAL:** _____ units (isi manual setelah test)

8. **Cek Log Aktivitas**
   - Scroll ke bawah ke section **"Riwayat Perubahan Stok Terbaru"**
   - **EXPECTED:** Ada log baru di posisi paling atas:
     ```
     INDOMIE GORENG
     5 → 105 units (+100)
     Restock bulanan
     Test auto-save
     [Timestamp hari ini]
     ```
   - **ACTUAL:** Log muncul? ☐ YA / ☐ TIDAK

---

## ✅ **TEST 2: Verifikasi di Database Supabase**

### **Langkah:**

1. **Login Supabase Dashboard**
   - URL: https://drlbfzwuluxhkkltcjpk.supabase.co
   - Login dengan akun Supabase Anda

2. **Buka Table Products**
   - Klik **"Table Editor"** di sidebar kiri
   - Pilih table **"products"**

3. **Cari Produk**
   - Use filter atau search
   - Cari produk: **INDOMIE GORENG**

4. **Cek Kolom Stock**
   - Lihat nilai di kolom **"stock"**
   - **EXPECTED:** 105
   - **ACTUAL:** _____ (isi manual)

5. **Buka Table Stock Logs**
   - Pilih table **"stock_logs"**
   - **EXPECTED:** Table ada (jika sudah run SQL script)
   - **ACTUAL:** Table ada? ☐ YA / ☐ TIDAK

6. **Cek Log Entry**
   - Sort by **"created_at"** DESC (terbaru di atas)
   - **EXPECTED:** Ada entry baru dengan:
     - `product_id` = ID INDOMIE GORENG
     - `type` = "addition"
     - `quantity_before` = 5
     - `quantity_change` = 100
     - `quantity_after` = 105
     - `reason` = "Restock bulanan"
   - **ACTUAL:** Log ada? ☐ YA / ☐ TIDAK

---

## ✅ **TEST 3: Test Multiple Products**

### **Langkah:**

1. **Tambah stok ke 3 produk berbeda**
   - Produk 1: +50 units
   - Produk 2: +75 units
   - Produk 3: +120 units

2. **Refresh halaman**

3. **Verifikasi:**
   - Semua 3 produk stoknya bertambah? ☐ YA / ☐ TIDAK
   - Log aktivitas ada 3 entry baru? ☐ YA / ☐ TIDAK

---

## ✅ **TEST 4: Test Stock Calculation**

### **Test Case:**

| Produk | Stok Awal | Tambah | Expected | Actual | Pass? |
|--------|-----------|--------|----------|--------|-------|
| Produk A | 0 | 50 | 50 | ___ | ☐ |
| Produk B | 5 | 100 | 105 | ___ | ☐ |
| Produk C | 15 | 25 | 40 | ___ | ☐ |

---

## 🐛 **TROUBLESHOOTING**

### **Problem 1: Stok tidak tersimpan (tetap sama setelah refresh)**

**Diagnosis:**
1. Buka browser console (F12)
2. Network tab
3. Klik "Restock" dan submit
4. Cari request ke `/api/stock/add`
5. Lihat response

**Kemungkinan:**
- Response status 500 → Database error
- Response status 400 → Validation error
- Response status 200 tapi data null → API issue

**Solusi:**
- Cek Supabase connection
- Cek environment variables (.env.local)
- Cek browser console untuk error messages

---

### **Problem 2: Log aktivitas kosong (stok tersimpan tapi log tidak)**

**Diagnosis:**
1. Supabase Dashboard → Table Editor
2. Cek apakah table **"stock_logs"** ada?

**Jika table TIDAK ada:**
✅ **SOLUSI:** Run SQL script!
1. Buka file: `database/create_stock_logs_table.sql`
2. Copy semua isi file
3. Supabase Dashboard → SQL Editor → New query
4. Paste → RUN
5. Tunggu success message
6. Test lagi tambah stok
7. Log seharusnya muncul

**Jika table ADA tapi kosong:**
- Kemungkinan RLS policy issue
- Re-run SQL script lengkap (include policies)

---

## ✅ **HASIL TEST**

### **Summary:**

| Test | Status | Notes |
|------|--------|-------|
| Tambah stok → Auto-save | ☐ PASS / ☐ FAIL | ___ |
| Log aktivitas tersimpan | ☐ PASS / ☐ FAIL | ___ |
| Database update correct | ☐ PASS / ☐ FAIL | ___ |
| Multiple products test | ☐ PASS / ☐ FAIL | ___ |

### **Conclusion:**

☐ **SEMUA TEST PASS** → Stock management berfungsi sempurna! ✅

☐ **ADA YANG FAIL** → Perlu fix:
- [ ] Database setup (run SQL scripts)
- [ ] API connection issue
- [ ] Environment variables issue

---

## 📝 **CATATAN PENTING**

**Q: Apakah saya perlu save manual setelah tambah stok?**
**A:** TIDAK! Semua otomatis tersimpan ke database saat klik "Simpan" di modal.

**Q: Kenapa log aktivitas kosong?**
**A:** Kemungkinan besar table `stock_logs` belum dibuat. Run SQL script di `DATABASE_SETUP_REQUIRED.md`

**Q: Apakah stok tersimpan permanen?**
**A:** YA! Tersimpan di database Supabase (PostgreSQL). Tidak akan hilang meskipun browser ditutup atau server restart.

**Q: Bagaimana kalau ada error?**
**A:** Cek browser console (F12) dan screenshot error nya. Toast merah akan muncul dengan error message.

---

**Test dilakukan oleh:** _______________

**Tanggal:** _______________

**Hasil:** ☐ PASS / ☐ FAIL

**Catatan tambahan:**
_______________________________________________________
_______________________________________________________
_______________________________________________________
