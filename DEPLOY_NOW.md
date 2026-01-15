# 🚀 DEPLOY NOW - Panduan Deploy ke Vercel

**Status:** ✅ Code Ready - Commit Done
**Next Step:** Push to GitHub → Deploy to Vercel

---

## 📋 Prerequisites

✅ Code sudah di-commit
✅ Build successful (tested)
✅ Stock management working
✅ SEO optimized

**Yang perlu:**
- Akun GitHub (gratis)
- Akun Vercel (gratis)
- 15-20 menit waktu

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### STEP 1: Setup GitHub Repository (5 menit)

#### 1.1 Buat Repository Baru di GitHub

1. **Buka GitHub:**
   - Go to: https://github.com
   - Login ke akun GitHub

2. **Create New Repository:**
   - Klik tombol **"New"** (hijau, di kiri atas)
   - Atau: https://github.com/new

3. **Repository Settings:**
   ```
   Repository name: sahara-mart-web
   Description: Minimarket Online - E-Commerce Platform
   Visibility: ○ Public  atau  ● Private (pilih salah satu)

   ❌ JANGAN centang:
      - Add a README file
      - Add .gitignore
      - Choose a license
   ```

4. **Klik: Create repository**

#### 1.2 Connect Local to GitHub

Setelah repository dibuat, GitHub akan tampilkan instruksi. Kita akan gunakan **"push an existing repository from the command line"**:

1. **Copy repository URL** (ada 2 pilihan):
   - HTTPS: `https://github.com/USERNAME/sahara-mart-web.git`
   - SSH: `git@github.com:USERNAME/sahara-mart-web.git`

   *Ganti USERNAME dengan username GitHub kamu*

2. **Jalankan command berikut** di terminal (di folder project ini):

**Windows Command Prompt / PowerShell:**
```bash
# Add remote (ganti USERNAME!)
git remote add origin https://github.com/USERNAME/sahara-mart-web.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Jika diminta login:**
- Username: [GitHub username kamu]
- Password: [Personal Access Token - bukan password biasa!]

**Cara buat Personal Access Token:**
1. GitHub → Settings (klik profile photo, kanan atas)
2. Developer settings (paling bawah sidebar kiri)
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Note: "Sahara Mart Deploy"
6. Expiration: 90 days
7. Select scopes: ✅ repo (centang semua di bawah repo)
8. Generate token
9. **COPY TOKEN** (hanya muncul sekali!)
10. Paste sebagai password saat git push

#### 1.3 Verify Push

1. Refresh halaman GitHub repository
2. Semua file & folder harus muncul
3. Lihat commit message: "Production ready: Stock management..."
4. ✅ SUCCESS! Repository ready

---

### STEP 2: Deploy ke Vercel (5 menit)

#### 2.1 Login Vercel

1. **Buka Vercel:**
   - Go to: https://vercel.com
   - Klik **"Sign Up"** (pojok kanan atas)

2. **Sign Up dengan GitHub:**
   - Klik **"Continue with GitHub"**
   - Authorize Vercel (klik "Authorize Vercel")
   - ✅ Login success!

#### 2.2 Import Project

1. **Dari Vercel Dashboard:**
   - Klik **"Add New..."** → **"Project"**
   - Atau langsung: https://vercel.com/new

2. **Import Git Repository:**
   - Section: **"Import Git Repository"**
   - Cari repository: `sahara-mart-web`
   - Klik **"Import"**

3. **Jika repository tidak muncul:**
   - Klik **"Adjust GitHub App Permissions"**
   - Select repositories → Pilih `sahara-mart-web`
   - Save
   - Kembali ke Vercel, refresh
   - Repository harus muncul

#### 2.3 Configure Project

**Configure Project Settings:**

1. **Project Name:**
   ```
   sahara-mart-web
   ```
   (atau nama lain sesuai keinginan)

2. **Framework Preset:**
   ```
   Next.js  (auto-detected ✅)
   ```

3. **Root Directory:**
   ```
   ./  (default, jangan diubah)
   ```

4. **Build Settings:**
   ```
   Build Command: npm run build  (auto-filled ✅)
   Output Directory: .next  (auto-filled ✅)
   Install Command: npm install  (auto-filled ✅)
   ```

5. **Environment Variables:**
   **PENTING! Klik "Environment Variables" untuk expand**

   Add 3 environment variables:

   **Variable 1:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://drlbfzwuluxhkkltcjpk.supabase.co
   ```

   **Variable 2:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: sb_publishable_LXlvXTP8k3hbZxbRJFoCDA_65ae0yux
   ```

   **Variable 3:**
   ```
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: [Buka .env.local, copy value SUPABASE_SERVICE_ROLE_KEY]
   ```

   **Cara copy dari .env.local:**
   - Buka file: `C:\Users\HP\sahara-mart-web\.env.local`
   - Cari baris: `SUPABASE_SERVICE_ROLE_KEY=...`
   - Copy semua text setelah `=` (panjang ~200 karakter)
   - Paste ke Vercel

   **Environment untuk:**
   - ✅ Production
   - ✅ Preview (optional, bisa dicentang)
   - ✅ Development (optional, bisa dicentang)

6. **Klik: Deploy** (tombol biru besar)

#### 2.4 Wait for Deployment (3-5 menit)

Vercel akan:
1. ✅ Clone repository dari GitHub
2. ✅ Install dependencies (npm install)
3. ✅ Build project (npm run build)
4. ✅ Deploy ke production

**Progress indicators:**
```
⏳ Initializing...
⏳ Building...
⏳ Deploying...
✅ Deployment Ready!
```

**Jika build sukses:**
- 🎉 Congratulations screen muncul
- URL production muncul (e.g., `sahara-mart-web.vercel.app`)
- Screenshot preview website

**Jika build gagal:**
- Lihat error logs (klik "View Build Logs")
- Common issues:
  - Environment variables salah/kurang
  - Supabase keys tidak valid
  - Build error (unlikely, karena kita sudah test build)

---

### STEP 3: Verify Deployment (5 menit)

#### 3.1 Get Production URL

Setelah deploy success, copy production URL:
```
https://sahara-mart-web.vercel.app
```
(atau URL custom jika kamu setup domain)

#### 3.2 Test Website

Buka URL production di browser dan test:

**Public Pages:**
- [ ] Homepage loading ✅
- [ ] Katalog menampilkan products ✅
- [ ] Product detail page berfungsi ✅
- [ ] Add to cart berfungsi ✅
- [ ] Checkout WhatsApp generate message ✅
- [ ] Legal pages (Privacy, Terms, FAQ) accessible ✅

**Admin Panel:**
- [ ] Login `/admin/login` berfungsi ✅
- [ ] Dashboard menampilkan stats ✅
- [ ] Products management berfungsi ✅
- [ ] Orders management berfungsi ✅

**Critical Test - Stock Management:**
1. Cek stok produk di admin (misal: 100)
2. Buat order dari public site (quantity: 5)
3. Refresh admin products page
4. Stok harus berkurang jadi 95 ✅

Jika semua test ✅ → **DEPLOYMENT SUCCESS!** 🎉

---

## 🌐 OPTIONAL: Custom Domain (Bonus)

### Setup Custom Domain (jika punya domain):

1. **Beli Domain:**
   - Dari Namecheap, GoDaddy, atau Cloudflare
   - Contoh: `saharamart.com`

2. **Add Domain di Vercel:**
   - Vercel Dashboard → Project → Settings → Domains
   - Klik **"Add"**
   - Enter domain: `saharamart.com`
   - Klik **"Add"**

3. **Configure DNS:**
   Vercel akan kasih DNS records untuk di-add ke domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Update DNS di Domain Registrar:**
   - Login ke Namecheap/GoDaddy/Cloudflare
   - Advanced DNS / DNS Management
   - Add records dari Vercel
   - Save

5. **Wait for Propagation:**
   - DNS propagation: 15 minutes - 48 hours
   - Check: https://dnschecker.org
   - Enter domain → Verify A record points to Vercel

6. **Verify in Vercel:**
   - Vercel akan auto-verify DNS
   - Status berubah jadi "Valid Configuration" ✅
   - SSL certificate auto-issued (HTTPS) 🔒

---

## 📊 Post-Deployment Checklist

### Immediate Tasks (Harus Dilakukan):

- [ ] **Run Analytics SQL** (5 min)
  - File: `database/DEPLOY_ANALYTICS_DELIVERED_ONLY.sql`
  - Buka Supabase Dashboard → SQL Editor
  - Copy-paste SQL → Run
  - Reload schema
  - Verify dashboard stats muncul

- [ ] **Setup Supabase Storage** (5 min)
  - File: `SUPABASE_STORAGE_SETUP.md` (follow guide)
  - Create bucket `product-images` (public)
  - Add 2 RLS policies
  - Test upload image
  - Verify image upload berfungsi di admin

### Optional Tasks (Nanti):

- [ ] **Setup Google Analytics**
  - Daftar Google Analytics: https://analytics.google.com
  - Create property
  - Copy Measurement ID (G-XXXXXXXXXX)
  - Add env var di Vercel: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
  - Redeploy

- [ ] **Monitor Performance**
  - Vercel Analytics (free): Auto-enabled
  - Google Search Console: Add sitemap
  - PageSpeed Insights: Test performance

- [ ] **SEO Setup**
  - Submit sitemap: `https://yourdomain.com/sitemap.xml`
  - Google Search Console: Add property
  - Verify ownership
  - Submit URL for indexing

---

## 🐛 Troubleshooting

### Problem: Build Failed

**Error: "Module not found"**
```
Solution:
1. Check package.json dependencies
2. Run: npm install
3. Commit package-lock.json
4. Push to GitHub
5. Vercel will auto-redeploy
```

**Error: "Environment variable not found"**
```
Solution:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all 3 variables ada & benar
3. Redeploy (Deployments → ... → Redeploy)
```

### Problem: Website Loading But Features Not Working

**Products not showing:**
```
Solution:
1. Check Supabase connection
2. Verify NEXT_PUBLIC_SUPABASE_URL benar
3. Check Supabase Dashboard → Products table ada data
```

**Admin can't login:**
```
Solution:
1. Supabase Dashboard → Authentication → Users
2. Verify admin user exists
3. Try reset password
```

**Stock not reducing:**
```
Solution:
1. Check console.log di browser DevTools
2. Verify network request ke /api/orders success
3. Check Supabase RLS policies
```

### Problem: 404 on Refresh

**Description:** Page works, tapi refresh = 404

```
Solution:
This should NOT happen with Vercel + Next.js
If happens:
1. Check vercel.json (should not exist with Next.js)
2. Verify Next.js version (should be 16.1.1)
3. Contact Vercel support
```

---

## 📈 Monitoring & Analytics

### Vercel Dashboard

**Access:**
- https://vercel.com/dashboard
- Select project: `sahara-mart-web`

**Available Metrics:**
- Deployment history
- Build logs
- Runtime logs
- Analytics (visitors, page views)
- Performance metrics
- Error tracking

### Supabase Dashboard

**Access:**
- https://drlbfzwuluxhkkltcjpk.supabase.co

**Monitor:**
- Database → Table Editor → Check data
- Database → SQL Editor → Run queries
- Logs → Check API requests
- Auth → Monitor user logins

---

## 🎉 DEPLOYMENT COMPLETE!

### What You've Accomplished:

✅ Code pushed to GitHub
✅ Deployed to Vercel
✅ Website LIVE on internet
✅ Automatic CI/CD setup (push → auto-deploy)
✅ Free hosting & SSL
✅ Global CDN (fast loading worldwide)

### Next Steps:

1. ✅ Run Analytics SQL (5 min)
2. ✅ Setup Supabase Storage (5 min)
3. ✅ Test all features
4. 🎉 Share website dengan users!

### Your Website URLs:

**Production:**
- Vercel: `https://sahara-mart-web.vercel.app`
- Admin: `https://sahara-mart-web.vercel.app/admin/login`

**Admin Login:**
- Email: [your admin email]
- Password: [your admin password]

---

## 📞 Need Help?

**Resources:**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

**Project Docs:**
- `START_HERE.md` - Overview
- `QUICK_START.md` - Quick launch guide
- `DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `TESTING_GUIDE.md` - Testing guide
- `STOCK_MANAGEMENT.md` - Stock feature docs

---

## 🔄 Future Deployments

**Automatic Deployments:**

Setiap kali push ke GitHub main branch:
1. Vercel auto-detect push
2. Build automatically
3. Deploy automatically
4. ✅ Website updated!

**Manual Redeploy:**
1. Vercel Dashboard → Project
2. Deployments tab
3. Klik "..." → Redeploy

**Rollback:**
1. Vercel Dashboard → Deployments
2. Select previous deployment
3. Klik "..." → Promote to Production

---

**🎊 CONGRATULATIONS! Website Sahara Mart sudah LIVE! 🎊**

**URL:** https://sahara-mart-web.vercel.app (sesuaikan dengan URL kamu)

**Share link ke customer dan mulai jualan! 🛒💰**

---

*Last Updated: 15 Januari 2026, 23:30 WIB*
*Status: PRODUCTION READY ✅*