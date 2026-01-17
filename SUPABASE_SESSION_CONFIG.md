# 🔐 Supabase Session Configuration

**Problem:** Admin session expires setelah 1 jam → harus login berulang kali

**Solution:** Update session timeout di Supabase Dashboard

---

## 📋 Setup (2 menit)

### Step 1: Update Session Timeout

1. **Login Supabase Dashboard:** https://drlbfzwuluxhkkltcjpk.supabase.co
2. **Settings → Authentication**
3. **Scroll ke "Session Settings"**
4. **Update nilai:**
   - **JWT Expiry:** `604800` (7 days = 604800 seconds)
   - **Refresh Token Expiry:** `2592000` (30 days = 2592000 seconds)
5. **Save**

---

## ✅ Setelah Setup

**Client-side config sudah di-update:**
- `persistSession: true` → Session tersimpan di localStorage
- `autoRefreshToken: true` → Token auto-refresh sebelum expire
- Session bertahan **7 hari** (atau sampai user logout manual)

**Result:**
- ✅ Admin tidak perlu login berulang kali
- ✅ Session auto-refresh sebelum expire
- ✅ Tetap aman dengan JWT expiry

---

## 🧪 Test

1. **Login admin panel**
2. **Tutup browser**
3. **Buka lagi → Harusnya tetap login** ✅
4. **Wait 1 jam → Harusnya tetap login** ✅

---

## ⚠️ Security Notes

- Session expire setelah **7 hari tanpa activity**
- Logout manual tetap berfungsi
- Token di-refresh otomatis setiap **~55 menit** (sebelum JWT expire)
- Session tersimpan di localStorage (browser-specific)

---

**Status:** Code updated, perlu update Supabase Dashboard settings
**Priority:** Medium - Admin UX improvement
**Estimated Time:** 2 menit

---

*Last Updated: 17 Januari 2026*
