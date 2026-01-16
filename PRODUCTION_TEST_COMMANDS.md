# 🧪 Production Testing Commands

## Production URL
```
https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app
```

---

## 📋 Option 1: Run Script Files (Recommended)

### Windows CMD (Command Prompt):
```cmd
cd C:\Users\HP\sahara-mart-web
test-all-production.bat
```

### PowerShell:
```powershell
cd C:\Users\HP\sahara-mart-web
.\test-all-production.ps1
```

---

## 📋 Option 2: Single Commands (Copy-Paste)

### PowerShell - ALL TESTS (One Command):
```powershell
cd C:\Users\HP\sahara-mart-web; $env:NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app"; Write-Host "`n[1/3] E2E TESTS`n" -ForegroundColor Green; node scripts/test-e2e.js; Write-Host "`n[2/3] LOAD TESTS`n" -ForegroundColor Green; node scripts/test-load.js; Write-Host "`n[3/3] SECURITY TESTS`n" -ForegroundColor Green; node scripts/test-security.js
```

### PowerShell - E2E Only (Quick Test):
```powershell
cd C:\Users\HP\sahara-mart-web; $env:NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app"; node scripts/test-e2e.js
```

### PowerShell - Load Tests Only:
```powershell
cd C:\Users\HP\sahara-mart-web; $env:NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app"; node scripts/test-load.js
```

### PowerShell - Security Tests Only:
```powershell
cd C:\Users\HP\sahara-mart-web; $env:NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app"; node scripts/test-security.js
```

---

## 📋 Option 3: Git Bash / Linux / Mac

### ALL TESTS:
```bash
cd C:/Users/HP/sahara-mart-web
NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app" node scripts/test-e2e.js
NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app" node scripts/test-load.js
NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app" node scripts/test-security.js
```

### E2E Only:
```bash
cd C:/Users/HP/sahara-mart-web
NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app" node scripts/test-e2e.js
```

---

## ✅ Expected Results:

### E2E Tests (Most Important):
```
Total Tests:   28
✓ Passed:      27 (96.4%)
✗ Failed:      1
Duration:      15-30s

✅ TEST SUITE PASSED (>= 95% pass rate)
```

### Load Tests:
```
Average Response Time: < 2s
95th Percentile: < 2s
Success Rate: >= 95%

✅ LOAD TEST PASSED
```

### Security Tests:
```
Security Score: >= 9.0/10
Critical Vulnerabilities: 0
High Vulnerabilities: <= 3

✅ SECURITY TEST PASSED
```

---

## ⚠️ IMPORTANT: Fix Vercel Protection First!

Before running tests, make sure to **DISABLE Vercel Protection**:

1. Go to: https://vercel.com/dashboard
2. Click project: `sahara-mart-web`
3. Go to **Settings** → **Deployment Protection**
4. Set to: **"Disabled"** or **"None"**
5. Redeploy if needed

**Current Issue:** All requests return `401 Unauthorized` because Vercel Protection is enabled.

---

## 🎯 Quick Test (After Fixing Protection):

### Check if website is accessible:
Open in browser: https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app

**Expected:** Homepage loads (200 OK)
**Current:** 401 Unauthorized (Protection enabled)

### Run quick E2E test:
```powershell
cd C:\Users\HP\sahara-mart-web; $env:NEXT_PUBLIC_BASE_URL="https://sahara-mart-m70tr3apr-alwins-projects-0de9a76e.vercel.app"; node scripts/test-e2e.js
```

---

## 📊 Files Created:

1. **test-all-production.bat** - Windows CMD script (no pause between tests)
2. **test-all-production.ps1** - PowerShell script with colors
3. **test-production.bat** - Windows CMD script (with pause between tests)
4. **PRODUCTION_TEST_COMMANDS.md** - This file

Choose the method that works best for you!
