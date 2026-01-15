# 🚀 DEPLOYMENT CHECKLIST - Sahara Mart

**Before you deploy to production, complete ALL items in this checklist!**

---

## ⚡ CRITICAL - MUST DO BEFORE LAUNCH

### 1. Database Setup (10 minutes)

- [ ] **Run Analytics SQL**
  ```bash
  # File: database/DEPLOY_ANALYTICS_DELIVERED_ONLY.sql
  # Location: Supabase Dashboard → SQL Editor
  ```
  - Copy entire SQL file
  - Paste in Supabase SQL Editor
  - Click "Run"
  - Settings → API → "Reload schema"
  - Verify: Dashboard shows correct stats

- [ ] **Setup Supabase Storage**
  ```bash
  # Guide: SUPABASE_STORAGE_SETUP.md
  ```
  - Create bucket: `product-images` (PUBLIC)
  - Add Policy 1: Public Read
  - Add Policy 2: Authenticated Upload/Delete
  - Test manual upload
  - Verify URL accessible

---

## 🔐 SECURITY CHECKLIST

- [ ] **Environment Variables**
  - `.env.local` NOT in git
  - Supabase keys secure
  - No sensitive data in code
  - Production keys ready

- [ ] **Supabase RLS Policies**
  - Products table policies active
  - Categories table policies active
  - Orders table policies active
  - Storage bucket policies configured

- [ ] **Authentication**
  - Admin login working
  - Session management secure
  - Password encryption enabled
  - Protected routes verified

---

## 🧪 TESTING CHECKLIST

### Public Website

- [ ] **Homepage**
  - Hero slider works
  - Featured products load
  - Categories display
  - All links work

- [ ] **Product Catalog**
  - Products load
  - Search works
  - Filters work (category, price)
  - Pagination works
  - "Load More" works

- [ ] **Product Detail**
  - Product info displays
  - Add to cart works
  - Quantity controls work
  - Stock limits enforced

- [ ] **Shopping Cart**
  - Add items works
  - Update quantity works
  - Remove items works
  - Persists after refresh
  - Subtotal calculates correctly

- [ ] **Checkout**
  - WhatsApp opens
  - Message pre-filled correctly
  - Order created in database
  - Cart cleared after checkout

- [ ] **Order Tracking**
  - Search by order number works
  - Order details display
  - Status badge correct

- [ ] **Legal Pages**
  - Privacy Policy loads
  - Terms & Conditions loads
  - FAQ loads and works
  - FAQ search works

### Admin Panel

- [ ] **Login**
  - Login works
  - Wrong password fails
  - Redirect after login
  - Protected routes work

- [ ] **Dashboard**
  - Today's sales correct
  - Week's sales correct
  - Month's sales correct
  - Top products display
  - Charts render

- [ ] **Product Management**
  - List displays all products
  - Search works
  - Filter works
  - Add product works
  - Edit product works
  - Delete product works (soft delete)
  - Image upload works
  - Image delete works

- [ ] **Order Management**
  - Orders list displays
  - Order details show
  - Status update works
  - Delete works (soft delete)

- [ ] **Bulk Upload**
  - CSV upload works
  - Validation works
  - Import success
  - Error handling works

---

## 📱 RESPONSIVE TESTING

Test on:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet Portrait (768x1024)
- [ ] Tablet Landscape (1024x768)
- [ ] Mobile (375x667 - iPhone SE)
- [ ] Mobile (414x896 - iPhone XR)
- [ ] Mobile (360x640 - Android)

Check:
- [ ] Layout adapts correctly
- [ ] Text readable
- [ ] Buttons clickable (not too small)
- [ ] Images scale properly
- [ ] Navigation accessible
- [ ] Forms usable

---

## 🌐 BROWSER COMPATIBILITY

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari iOS

---

## 🎨 SEO CHECKLIST

- [ ] **Meta Tags**
  - Title tags unique per page
  - Meta descriptions present
  - Keywords relevant
  - Viewport meta tag set

- [ ] **Open Graph**
  - OG title, description, image
  - Twitter cards configured
  - Social preview working

- [ ] **Structured Data**
  - Organization schema
  - Website schema
  - Local Business schema
  - Product schema (on product pages)
  - Breadcrumb schema

- [ ] **Sitemap & Robots**
  - `/sitemap.xml` accessible
  - `/robots.txt` accessible
  - Sitemap submitted to Google
  - Google Search Console configured

- [ ] **Performance**
  - Lighthouse score > 85
  - First Load < 3s
  - Images optimized
  - Lazy loading enabled

---

## 📊 ANALYTICS SETUP

- [ ] **Google Analytics**
  - GA4 property created
  - Measurement ID added to `.env.local`
  - Tracking code verified
  - Test event fired

- [ ] **Facebook Pixel** (Optional)
  - Pixel ID obtained
  - Pixel code added
  - Test PageView event

- [ ] **Search Console**
  - Site verified
  - Sitemap submitted
  - No errors reported

---

## 🚀 DEPLOYMENT TO VERCEL

### Step 1: Prepare Repository

- [ ] Push latest code to GitHub
  ```bash
  git add .
  git commit -m "Production ready - v1.0"
  git push origin main
  ```

- [ ] Verify `.gitignore` includes:
  - `.env.local`
  - `node_modules/`
  - `.next/`
  - `.archive/`

### Step 2: Deploy to Vercel

- [ ] Login to Vercel
- [ ] Create new project
- [ ] Import from GitHub
- [ ] Select `sahara-mart-web` repository

### Step 3: Configure Environment

- [ ] Add environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  NEXT_PUBLIC_GA_ID=your_ga_id (optional)
  ```

- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

- [ ] Click "Deploy"

### Step 4: Post-Deployment

- [ ] Wait for deployment (2-5 minutes)
- [ ] Visit production URL
- [ ] Test all critical features
- [ ] Check browser console for errors
- [ ] Verify API calls work

### Step 5: Custom Domain (Optional)

- [ ] Buy domain (Namecheap, GoDaddy, etc.)
- [ ] Add domain in Vercel dashboard
- [ ] Update DNS records:
  ```
  Type: A
  Name: @
  Value: 76.76.21.21

  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```
- [ ] Wait for DNS propagation (1-48 hours)
- [ ] Verify SSL certificate issued
- [ ] Update all URLs in code to custom domain

---

## 🔍 POST-LAUNCH MONITORING

### Day 1

- [ ] Check error logs (Vercel Dashboard)
- [ ] Monitor performance
- [ ] Test checkout flow
- [ ] Verify analytics tracking
- [ ] Check email notifications (if configured)

### Week 1

- [ ] Review user feedback
- [ ] Monitor database size
- [ ] Check Supabase usage
- [ ] Verify backups working
- [ ] Review Google Analytics

### Month 1

- [ ] Performance audit
- [ ] Security audit
- [ ] Database optimization
- [ ] Content updates
- [ ] Feature planning

---

## 📈 PERFORMANCE TARGETS

- [ ] **Lighthouse Scores**
  - Performance: > 85
  - Accessibility: > 95
  - Best Practices: > 95
  - SEO: > 95

- [ ] **Page Load Times**
  - Homepage: < 2s
  - Catalog: < 3s
  - Product Detail: < 2s
  - Admin Dashboard: < 3s

- [ ] **API Response Times**
  - Products API: < 500ms
  - Orders API: < 300ms
  - Analytics API: < 1s

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

### Image Upload
- **Status:** Requires Supabase Storage setup
- **Workaround:** Use external image URLs
- **Fix:** Follow `SUPABASE_STORAGE_SETUP.md`

### Analytics Dashboard
- **Status:** Must run SQL fix
- **Workaround:** None
- **Fix:** Run `DEPLOY_ANALYTICS_DELIVERED_ONLY.sql`

---

## ✅ FINAL VERIFICATION

Before marking as "LAUNCHED":

- [ ] All critical features work
- [ ] No console errors
- [ ] No broken links
- [ ] All forms work
- [ ] Payments work (if implemented)
- [ ] Emails work (if implemented)
- [ ] Mobile experience good
- [ ] SEO optimized
- [ ] Analytics tracking
- [ ] Security verified
- [ ] Performance acceptable
- [ ] Team trained (if applicable)
- [ ] Documentation complete
- [ ] Support ready

---

## 🎊 LAUNCH DAY

- [ ] **Announce Launch**
  - Social media posts
  - Email to customers (if list exists)
  - WhatsApp broadcast
  - Local marketing

- [ ] **Monitor Closely**
  - Check errors every hour
  - Respond to customer issues
  - Fix critical bugs immediately

- [ ] **Celebrate!** 🎉
  - Take screenshot
  - Document learnings
  - Thank the team

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Next.js Discord: https://discord.gg/nextjs

**Business Issues:**
- Review documentation: `HANDOVER_FINAL_V6.md`
- Check troubleshooting: `TESTING_GUIDE.md`

---

## 📝 DEPLOYMENT LOG

| Date | Version | Changes | Status |
|------|---------|---------|--------|
| DD/MM/YYYY | 1.0.0 | Initial launch | Deployed |
| | | | |

---

**Last Updated:** 14 Januari 2026
**Status:** Ready for Deployment
**Estimated Time:** 30-60 minutes

---

**🚀 GOOD LUCK WITH YOUR LAUNCH!**

Remember: Test everything twice, deploy once!
