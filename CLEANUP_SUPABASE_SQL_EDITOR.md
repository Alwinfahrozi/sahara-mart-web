# 🧹 Cleanup Supabase SQL Editor

**Tujuan:** Hapus query-query lama yang sudah tidak terpakai di Supabase SQL Editor

**Waktu:** 2-3 menit

---

## 📋 **Yang Saya Lihat di Screenshot:**

Di sidebar kiri SQL Editor Anda, ada BANYAK query tersimpan:
- Stock Logs
- Add Barcode Field to Products
- Untitled query
- Deploy Analytics Functions and ...
- Order Items column migration
- Orders & Order Items Schema S...
- Orders Table Quick Fix & Order ...
- Total Products Count
- Products Bulk Seed for Inventory
- Table Row Counts Summary
- List public tables
- Order Items Table
- Migration 004 — Orders Table
- Customers table creation
- Categories Schema with Seed D...
- Categories table migration
- Untitled query

**Total:** ~17+ queries tersimpan

---

## ⚠️ **Apakah Ini Normal?**

**YA, ini normal!** Setiap kali Anda:
- Run SQL script
- Test query
- Create table

Supabase otomatis save query tersebut di "PRIVATE" section.

**TAPI** untuk clean workspace, lebih baik hapus yang sudah tidak terpakai.

---

## 🗑️ **Cara Cleanup (Opsional)**

### **Opsi 1: Hapus Satu Per Satu**

1. **Hover** mouse ke query yang mau dihapus
2. **Klik kanan** pada query
3. **Pilih "Delete"** atau **klik icon delete (trash)**
4. **Confirm** deletion

**Ulangi** untuk semua query yang tidak terpakai.

---

### **Opsi 2: Hapus Banyak Sekaligus (Tidak Ada Bulk Delete)**

Sayangnya Supabase **TIDAK** punya fitur bulk delete untuk queries.

Jadi harus **satu per satu** manual 😔

---

## 📌 **Query Mana Yang Boleh Dihapus?**

### ✅ **AMAN UNTUK DIHAPUS** (Query yang sudah tidak terpakai):

- [ ] **Untitled query** (query testing yang tidak diberi nama)
- [ ] **Categories table migration** (sudah selesai run)
- [ ] **Customers table creation** (sudah selesai run)
- [ ] **Migration 004 — Orders Table** (sudah selesai run)
- [ ] **Order Items column migration** (sudah selesai run)
- [ ] **Orders Table Quick Fix & Order ...** (sudah selesai run)
- [ ] **Table Row Counts Summary** (testing query)
- [ ] **List public tables** (testing query)
- [ ] **Total Products Count** (testing query)
- [ ] Semua query dengan nama **"migration"** (sudah selesai)

**RULE:** Jika query sudah pernah di-run dan berhasil, **AMAN DIHAPUS**.

---

### ⚠️ **JANGAN HAPUS** (Query yang mungkin masih berguna):

- [ ] **Stock Logs** (baru dibuat, mungkin masih dipakai)
- [ ] **Deploy Analytics Functions** (jika belum run)
- [ ] **Products Bulk Seed for Inventory** (jika masih perlu bulk upload)
- [ ] **Categories Schema with Seed Data** (jika perlu re-run)

**RULE:** Jika query mungkin masih perlu di-run lagi, **SIMPAN**.

---

## 💡 **Rekomendasi Saya:**

### **Step 1: Hapus Untitled Queries**
Hapus semua **"Untitled query"** karena itu biasanya testing random.

### **Step 2: Hapus Migration Queries**
Hapus semua query dengan kata **"migration"** atau **"table creation"** karena sudah selesai run.

### **Step 3: Simpan Query Penting**
Jika ada query yang sering dipakai, **rename** dengan nama yang jelas:
- Contoh: `Check Low Stock Products`
- Contoh: `Daily Sales Report`

### **Step 4: Gunakan SHARED Folder**
Untuk query yang penting dan sering dipakai:
1. Klik query
2. Click "..." menu
3. Pilih "Move to Shared"
4. Query akan masuk folder **SHARED** dan bisa diakses team

---

## 🎯 **Target After Cleanup:**

**Before:** 17+ queries (screenshot Anda)
**After:** 3-5 queries saja (yang penting)

**Hasilnya:**
- ✅ Sidebar lebih bersih
- ✅ Lebih mudah cari query
- ✅ Workspace lebih organized

---

## 📝 **Quick Cleanup Checklist:**

Cetak ini dan check off saat hapus:

```
HAPUS:
[ ] Untitled query
[ ] Untitled query (yang kedua, jika ada)
[ ] Categories table migration
[ ] Customers table creation
[ ] Migration 004 — Orders Table
[ ] Order Items column migration
[ ] Orders Table Quick Fix
[ ] Table Row Counts Summary
[ ] List public tables
[ ] Total Products Count

SIMPAN (untuk sementara):
[ ] Stock Logs (baru saja dibuat)
[ ] Deploy Analytics Functions
[ ] Products Bulk Seed for Inventory
[ ] Categories Schema with Seed Data
```

---

## ⏱️ **Kapan Waktu Terbaik Cleanup?**

**SEKARANG atau NANTI?**

**Pilihan 1: SEKARANG** (2-3 menit)
- Workspace langsung bersih
- Lebih fokus saat testing

**Pilihan 2: NANTI** (setelah semua testing selesai)
- Fokus deploy dulu
- Cleanup belakangan

**Rekomendasi:** Cleanup **NANTI** saja, setelah semua testing selesai dan website sudah live. Tidak urgent. 👍

---

## 🚫 **JANGAN Khawatir!**

**Q: Kalau saya hapus query, apakah table di database ikut terhapus?**
**A:** TIDAK! Hapus query hanya hapus **text editor** saja. Table di database **AMAN**.

**Q: Kalau saya salah hapus query penting?**
**A:** Tidak masalah! Query cuma berisi SQL text. Anda bisa:
- Copy ulang dari file di project (`database/*.sql`)
- Tulis ulang query nya (query biasanya simpel)
- Tidak ada data yang hilang

**Q: Apakah cleanup wajib?**
**A:** TIDAK wajib! Ini hanya untuk **kenyamanan** workspace Anda. Tidak affect website atau database.

---

**Status:** 🟢 OPTIONAL - Nice to have, tidak urgent

**Priority:** LOW - Bisa dilakukan kapan saja

---

*Last Updated: 17 Januari 2026*
