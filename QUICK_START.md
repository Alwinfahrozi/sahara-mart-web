# 🚀 QUICK START - Sahara Mart

**Panduan super cepat untuk launch Sahara Mart dalam 15 menit!**

---

## ⚡ STEP 1: Setup Supabase Storage (5 menit)

### Mengapa perlu?
Agar admin bisa upload gambar produk.

### Langkah:

1. **Buka Supabase Dashboard:**
   - URL: https://drlbfzwuluxhkkltcjpk.supabase.co
   - Login dengan akun Supabase

2. **Buat Bucket:**
   - Klik **Storage** (sidebar kiri)
   - Klik **New bucket**
   - Name: `product-images`
   - ✅ **CENTANG "Public bucket"** (PENTING!)
   - Klik **Create bucket**

3. **Setup Policies:**
   - Klik bucket **product-images**
   - Klik tab **Policies**
   - Klik **New policy** → **Create policy from template**
   - Pilih **"Allow public read access"**
   - Klik **Review** → **Save policy**

4. **Test Upload:**
   - Klik **Upload file**
   - Upload 1 gambar test (JPG/PNG)
   - Klik gambar → Copy URL
   - Paste URL di browser baru
   - Jika gambar muncul = ✅ BERHASIL!

---

## ⚡ STEP 2: Run Analytics SQL (5 menit)

### Mengapa perlu?
Agar dashboard admin menampilkan stats revenue/profit yang benar (hanya dari order "delivered").

### Langkah:

1. **Buka File SQL:**
   - Location: `database/DEPLOY_ANALYTICS_DELIVERED_ONLY.sql`
   - Select all (Ctrl+A) → Copy (Ctrl+C)

2. **Run di Supabase:**
   - Buka Supabase Dashboard
   - Klik **SQL Editor** (sidebar kiri)
   - Paste SQL code
   - Klik **RUN** (tombol hijau besar)
   - Tunggu sampai muncul "Success. No rows returned"

3. **Reload Schema:**
   - Klik **Settings** (gear icon, bawah sidebar)
   - Klik **API**
   - Scroll kebawah, klik **Reload schema**
   - Tunggu beberapa detik

4. **Verifikasi:**
   - Buka website lokal: http://localhost:3000/admin
   - Login sebagai admin
   - Dashboard harus menampilkan stats yang benar
   - ✅ BERHASIL!

---

## ⚡ STEP 3: Deploy ke Vercel (5 menit + 5 menit waiting)

### Prerequisites:
- ✅ Step 1 & 2 sudah selesai
- ✅ Punya akun GitHub
- ✅ Punya akun Vercel (gratis)

### Langkah:

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Production ready - ready to deploy"
   git push origin master
   ```

2. **Deploy di Vercel:**
   - Login ke https://vercel.com
   - Klik **Add New Project**
   - Klik **Import Git Repository**
   - Pilih repository **sahara-mart-web**
   - Klik **Import**

3. **Configure Environment Variables:**
   - Klik **Environment Variables** (expand)
   - Tambahkan 3 variables:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://drlbfzwuluxhkkltcjpk.supabase.co

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: sb_publishable_LXlvXTP8k3hbZxbRJFoCDA_65ae0yux

   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [copy dari .env.local]
   ```

4. **Deploy:**
   - Klik **Deploy**
   - Tunggu 3-5 menit
   - ✅ BERHASIL! Website live!

5. **Get URL:**
   - Copy URL production (contoh: sahara-mart.vercel.app)
   - Buka di browser
   - Test website berfungsi

---

## ✅ VERIFICATION CHECKLIST

Test semua fitur ini di production:

### Public Website:
- [ ] Homepage loading
- [ ] Katalog menampilkan semua produk
- [ ] Search produk berfungsi
- [ ] Filter by category berfungsi
- [ ] Product detail page berfungsi
- [ ] Add to cart berfungsi
- [ ] Cart page menampilkan items dengan benar
- [ ] Checkout via WhatsApp generate message yang benar
- [ ] Legal pages bisa diakses (Privacy, Terms, FAQ)
- [ ] Responsive di mobile (test di HP)

### Admin Panel:
- [ ] Login di `/admin/login` berfungsi
- [ ] Dashboard menampilkan stats yang benar
- [ ] Products page menampilkan semua produk
- [ ] Add product berfungsi
- [ ] **Upload image berfungsi** (test ini!)
- [ ] Edit product berfungsi
- [ ] Delete product berfungsi
- [ ] Orders page menampilkan orders
- [ ] Update order status berfungsi
- [ ] Bulk upload CSV berfungsi

---

## 🎉 SELESAI!

Website Sahara Mart sudah LIVE dan siap digunakan!

### Next Steps (Optional):

1. **Custom Domain:**
   - Beli domain di Namecheap/GoDaddy/Cloudflare
   - Add di Vercel: Settings → Domains
   - Update DNS records
   - Tunggu 15-60 menit untuk propagasi

2. **Setup Google Analytics:**
   - Daftar di https://analytics.google.com
   - Buat property baru
   - Copy Measurement ID (G-XXXXXXXXXX)
   - Add environment variable di Vercel:
     ```
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
     ```
   - Redeploy

3. **Monitoring:**
   - Cek Vercel Analytics (free)
   - Cek Google Analytics (setelah setup)
   - Cek Supabase Dashboard → Database → Logs

---

## 🆘 TROUBLESHOOTING

### Problem: Image upload error "Bucket not found"
**Solution:** Ulangi Step 1, pastikan bucket name: `product-images` (exact!)

### Problem: Dashboard stats Rp 0
**Solution:** Ulangi Step 2, pastikan SQL berhasil run

### Problem: Build error di Vercel
**Solution:**
- Cek Vercel Dashboard → Deployments → Log
- Pastikan semua environment variables ada
- Cek apakah ada typo di env variable names

### Problem: 404 di production
**Solution:**
- Clear browser cache
- Tunggu 1-2 menit untuk deployment selesai
- Cek Vercel Dashboard → Domains (pastikan domain active)

---

## 📞 BUTUH BANTUAN?

**Dokumentasi Lengkap:**
- `TINGGAL_APA_LAGI.md` - Daftar lengkap apa yang belum dikerjakan
- `DEPLOYMENT_CHECKLIST.md` - Checklist deployment detail
- `TESTING_GUIDE.md` - Panduan testing lengkap
- `HANDOVER_FINAL_V6.md` - Dokumentasi teknis lengkap

**Status Project:**
- Development: ✅ 100% Complete
- SEO: ✅ 100% Complete
- Documentation: ✅ 100% Complete
- **Ready to Launch:** ✅ YES!

---

**Total waktu dari 0 ke LIVE: 15 menit!** ⚡

Good luck! 🚀