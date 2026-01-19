# 🎨 CURSOR AI - TASK ASSIGNMENT
## Frontend & UI Specialist

**AI Role:** UI/UX Specialist & Frontend Developer
**Branch Pattern:** `feature/cursor-*`
**Responsibility:** User interface, components, styling, responsiveness

---

## 🎯 PRIMARY RESPONSIBILITIES

### 1. UI Component Development
- React component creation
- Component styling with Tailwind
- Responsive design implementation
- Interactive UI elements
- Loading states & skeletons

### 2. User Experience
- Smooth animations & transitions
- User-friendly forms
- Error messages & feedback
- Touch-friendly interfaces
- Accessibility improvements

### 3. Visual Design
- Layout consistency
- Color scheme adherence
- Typography implementation
- Icon usage
- Image optimization (UI side)

### 4. Frontend State Management
- Local component state (useState)
- UI-specific effects (useEffect)
- Form state handling
- Client-side validation (UI feedback)

---

## 📋 TASK LIST (Priority Order)

### 🔴 SPRINT 1: Email & Invoice UI (Days 1-2)

#### Task 1.1: Email Notification UI Components
**Branch:** `feature/cursor-email-ui`
**Priority:** HIGH
**Estimated Time:** 2 hours
**Dependencies:** Wait for `feature/claude-email-system` to merge

**Implementation Details:**
```typescript
Files to Create:
├── components/admin/EmailNotificationBadge.tsx
├── components/admin/EmailSettings.tsx
└── components/admin/EmailHistory.tsx
```

**Task 1.1.1: Email Notification Badge**
Create a notification badge for admin showing email status.

```tsx
// components/admin/EmailNotificationBadge.tsx
'use client'

import { Mail, Check, X, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EmailStatus {
  sent: number
  failed: number
  pending: number
}

export default function EmailNotificationBadge() {
  const [status, setStatus] = useState<EmailStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch email status from API
    // This will be integrated by Copilot
  }, [])

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
      <Mail className="h-5 w-5 text-blue-600" />

      <div className="flex gap-3 text-sm">
        <div className="flex items-center gap-1">
          <Check className="h-4 w-4 text-green-600" />
          <span className="font-medium">{status?.sent || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <X className="h-4 w-4 text-red-600" />
          <span className="font-medium">{status?.failed || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-orange-600" />
          <span className="font-medium">{status?.pending || 0}</span>
        </div>
      </div>
    </div>
  )
}
```

**Task 1.1.2: Email Settings Panel**
Admin panel for email configuration preferences.

```tsx
// components/admin/EmailSettings.tsx
'use client'

import { Switch } from '@/components/ui/switch'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    orderConfirmation: true,
    lowStockAlert: true,
    newCustomer: false,
    dailyReport: false
  })

  const handleSave = async () => {
    // API call will be handled by Copilot
    toast.success('Email settings updated!')
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Email Notifications</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Order Confirmation</label>
          <Switch
            checked={settings.orderConfirmation}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, orderConfirmation: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Low Stock Alerts</label>
          <Switch
            checked={settings.lowStockAlert}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, lowStockAlert: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">New Customer Welcome</label>
          <Switch
            checked={settings.newCustomer}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, newCustomer: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Daily Reports</label>
          <Switch
            checked={settings.dailyReport}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, dailyReport: checked }))
            }
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
      >
        <Save className="h-4 w-4" />
        Save Settings
      </button>
    </div>
  )
}
```

**Success Criteria:**
- ✅ Email badge shows real-time status
- ✅ Settings panel fully functional
- ✅ Smooth animations on interactions
- ✅ Toast notifications for user feedback
- ✅ Responsive on mobile devices
- ✅ Loading states implemented

**Files NOT to Touch (SAYA's territory):**
- ❌ Email sending logic
- ❌ Email templates
- ❌ API endpoints
- ❌ Database operations

---

#### Task 1.2: Invoice PDF UI Components
**Branch:** `feature/cursor-invoice-ui`
**Priority:** HIGH
**Estimated Time:** 1.5 hours
**Dependencies:** Wait for `feature/claude-invoice-pdf` to merge

**Implementation Details:**
```typescript
Files to Create:
├── components/admin/InvoiceDownloadButton.tsx
└── components/admin/InvoicePreview.tsx
```

**Task 1.2.1: Invoice Download Button**
Button component for downloading invoice PDFs.

```tsx
// components/admin/InvoiceDownloadButton.tsx
'use client'

import { Download, Loader2, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface InvoiceDownloadButtonProps {
  orderId: string
  orderNumber: string
}

export default function InvoiceDownloadButton({
  orderId,
  orderNumber
}: InvoiceDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)

    try {
      // API call will be handled by Copilot
      // const response = await fetch(`/api/invoice/${orderId}`)
      // ... download logic

      setDownloaded(true)
      toast.success('Invoice downloaded!')

      setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      toast.error('Failed to download invoice')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2
                 text-sm font-medium transition-all
                 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : downloaded ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          Downloaded
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download Invoice
        </>
      )}
    </button>
  )
}
```

**Task 1.2.2: Invoice Preview Modal**
Preview invoice before downloading.

```tsx
// components/admin/InvoicePreview.tsx
'use client'

import { X, Download, Mail } from 'lucide-react'
import { useState } from 'react'

interface InvoicePreviewProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
}

export default function InvoicePreview({
  orderId,
  isOpen,
  onClose
}: InvoicePreviewProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Invoice Preview</h2>

          <div className="flex items-center gap-2">
            <button className="rounded p-2 hover:bg-gray-100 transition">
              <Download className="h-5 w-5" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 transition">
              <Mail className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="rounded p-2 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="aspect-[8.5/11] rounded border bg-white shadow-sm">
            {/* Invoice preview will be rendered here */}
            <div className="p-8">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">INVOICE</h1>
                <p className="mt-2 text-gray-600">Order #{orderId}</p>
              </div>

              {/* Company details */}
              <div className="mb-8">
                <h3 className="font-semibold">Sahara Mart</h3>
                <p className="text-sm text-gray-600">
                  Hapesong Baru, Batang Toru
                  <br />
                  Tapanuli Selatan
                  <br />
                  +62 822-6756-7946
                </p>
              </div>

              {/* Items table placeholder */}
              <div className="rounded border">
                <div className="grid grid-cols-4 gap-4 border-b bg-gray-50 p-4 font-semibold">
                  <div>Item</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Total</div>
                </div>
                {/* Items will be mapped here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Success Criteria:**
- ✅ Download button with loading states
- ✅ Success/error feedback with toasts
- ✅ Preview modal functional
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Accessible (keyboard navigation)

---

### 🟡 SPRINT 2: Mobile Optimization (Days 3-4)

#### Task 2.1: Admin Panel Mobile Responsive
**Branch:** `feature/cursor-mobile-admin`
**Priority:** HIGH
**Estimated Time:** 3 hours

**Files to Modify:**
```
├── app/admin/page.tsx
├── app/admin/products/page.tsx
├── app/admin/orders/page.tsx
├── app/admin/stock/page.tsx
└── components/admin/*
```

**Task 2.1.1: Responsive Dashboard**
Make admin dashboard mobile-friendly.

**Changes to `app/admin/page.tsx`:**
```tsx
// Make stats cards stack on mobile
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Stats cards */}
</div>

// Make charts responsive
<div className="grid gap-6 lg:grid-cols-2">
  <div className="rounded-lg border bg-white p-4 sm:p-6">
    {/* Chart */}
  </div>
</div>

// Add mobile-friendly table
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

**Task 2.1.2: Mobile Navigation**
Create collapsible mobile menu for admin.

```tsx
// components/admin/MobileNav.tsx
'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 bg-white border-b shadow-lg">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/admin" className="px-4 py-2 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
            <Link href="/admin/products" className="px-4 py-2 hover:bg-gray-100 rounded">
              Products
            </Link>
            <Link href="/admin/orders" className="px-4 py-2 hover:bg-gray-100 rounded">
              Orders
            </Link>
            <Link href="/admin/stock" className="px-4 py-2 hover:bg-gray-100 rounded">
              Stock
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
```

**Task 2.1.3: Touch-Friendly UI**
Increase touch targets and improve mobile interactions.

- Increase button sizes to min 44x44px
- Add spacing between interactive elements
- Improve form input sizing
- Add mobile-friendly date/time pickers
- Optimize table displays for mobile

**Success Criteria:**
- ✅ All admin pages responsive
- ✅ Mobile navigation functional
- ✅ Touch targets meet accessibility standards (44px min)
- ✅ Tables scrollable on mobile
- ✅ Forms easy to use on mobile
- ✅ Tested on iOS and Android

---

#### Task 2.2: Loading States & Skeletons
**Branch:** `feature/cursor-loading-states`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Files to Create:**
```
components/skeletons/
├── DashboardSkeleton.tsx
├── ProductListSkeleton.tsx
├── OrderListSkeleton.tsx
└── StockListSkeleton.tsx
```

**Implementation:**
```tsx
// components/skeletons/DashboardSkeleton.tsx
export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-white p-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
```

Apply loading skeletons to:
- Dashboard page while loading stats
- Product list while fetching
- Order list while fetching
- Stock page while fetching

**Success Criteria:**
- ✅ Skeleton screens for all major pages
- ✅ Smooth loading experience
- ✅ Skeletons match final layout
- ✅ No layout shift when content loads

---

### 🟢 SPRINT 3: User Account UI (Days 5-6)

#### Task 3.1: Registration & Login Forms
**Branch:** `feature/cursor-user-auth-ui`
**Priority:** MEDIUM
**Estimated Time:** 2.5 hours
**Dependencies:** Wait for `feature/claude-user-accounts` to merge

**Files to Create:**
```
├── app/(public)/register/page.tsx
├── app/(public)/login/page.tsx
├── components/auth/RegisterForm.tsx
└── components/auth/LoginForm.tsx
```

**Task 3.1.1: Registration Form**
```tsx
// components/auth/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { Mail, Lock, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    setLoading(true)

    try {
      // API call will be handled by Copilot
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full rounded-lg border pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-lg border pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="+62 812-3456-7890"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-lg border pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full rounded-lg border pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium
                   hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
```

**Success Criteria:**
- ✅ Beautiful registration form
- ✅ Client-side validation
- ✅ Password strength indicator
- ✅ Loading states
- ✅ Error handling
- ✅ Mobile responsive

---

#### Task 3.2: User Profile & Dashboard
**Branch:** `feature/cursor-user-profile`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Files to Create:**
```
├── app/(public)/profile/page.tsx
├── components/profile/ProfileCard.tsx
├── components/profile/OrderHistory.tsx
└── components/profile/AddressBook.tsx
```

**Implementation:** Create user profile page with:
- Profile information card
- Order history list
- Saved addresses management
- Account settings

**Success Criteria:**
- ✅ Profile page functional
- ✅ Edit profile form
- ✅ Order history display
- ✅ Address CRUD interface
- ✅ Responsive design

---

### 🔵 SPRINT 4: Polish & Refinement (Day 7)

#### Task 4.1: UI/UX Polish
**Branch:** `feature/cursor-final-polish`
**Priority:** MEDIUM
**Estimated Time:** 3 hours

**Tasks:**
1. **Consistent Spacing**
   - Review all pages for spacing consistency
   - Apply uniform padding/margins
   - Fix alignment issues

2. **Button States**
   - Ensure all buttons have hover states
   - Add focus states for accessibility
   - Consistent disabled states

3. **Form Improvements**
   - Add floating labels
   - Improve error message display
   - Better success feedback

4. **Animation Polish**
   - Add smooth page transitions
   - Loading animations
   - Hover effects
   - Micro-interactions

5. **Mobile Final Touches**
   - Test on real devices
   - Fix any mobile-specific issues
   - Optimize touch interactions

**Success Criteria:**
- ✅ Consistent design across all pages
- ✅ Smooth animations
- ✅ No visual glitches
- ✅ Perfect mobile experience

---

## 🚫 BOUNDARIES - DO NOT TOUCH

### SAYA's Territory (Backend)
- ❌ Any files in `app/api/`
- ❌ Database files
- ❌ Server-side utilities in `lib/`
- ❌ Authentication logic (Supabase client setup)
- ❌ Email sending logic
- ❌ PDF generation logic
- ❌ CSRF protection
- ❌ Rate limiting

### Copilot's Territory (Integration)
- ❌ API fetch calls (let Copilot add these)
- ❌ Type definitions for API responses
- ❌ Server-side validation
- ❌ Error handling for API errors (Copilot adds)
- ❌ Data transformation logic

### Your Safe Zone (Frontend/UI)
- ✅ All component files in `components/`
- ✅ Page layouts in `app/`
- ✅ CSS/Tailwind styling
- ✅ UI state (useState)
- ✅ UI effects (useEffect for UI only)
- ✅ Loading skeletons
- ✅ Toast notifications
- ✅ Modal components
- ✅ Form UI (not submission logic)
- ✅ Icons and images
- ✅ Animations
- ✅ Responsive design

---

## 📝 GIT WORKFLOW

### Branch Naming
```
feature/cursor-{feature-name}

Examples:
✅ feature/cursor-email-ui
✅ feature/cursor-invoice-ui
✅ feature/cursor-mobile-admin
✅ feature/cursor-user-profile
```

### Commit Messages
```
feat(ui): Add email notification badge
fix(mobile): Resolve responsive layout issue
style(admin): Improve dashboard card styling
refactor(components): Simplify modal component
```

---

## 🎨 DESIGN GUIDELINES

### Colors (Tailwind)
- **Primary:** blue-600, blue-700
- **Success:** green-600, green-700
- **Error:** red-600, red-700
- **Warning:** orange-600, orange-700
- **Neutral:** gray-100 to gray-900

### Typography
- **Headings:** font-bold, font-semibold
- **Body:** font-normal
- **Small:** text-sm, text-xs

### Spacing
- **Consistent gaps:** gap-2, gap-4, gap-6
- **Padding:** p-2, p-4, p-6, p-8
- **Margins:** m-2, m-4, m-6, m-8

### Borders
- **Radius:** rounded-lg (default), rounded-full (pills)
- **Width:** border (1px default)
- **Color:** border-gray-200 (default)

---

## ✅ QUALITY CHECKLIST

Before committing:
- [ ] Component renders without errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] No console errors/warnings
- [ ] Consistent with design system
- [ ] Icons properly imported
- [ ] Images optimized

---

**Last Updated:** 2026-01-20
**Assigned To:** Cursor AI
**Status:** 🟢 Active
**Next Review:** Daily Standup

---

**🎨 This task list was generated specifically for Cursor AI - Frontend & UI Specialist**
