# ⚡ GITHUB COPILOT - TASK ASSIGNMENT
## Integration & Polish Specialist

**AI Role:** Integration Specialist & Code Polish Expert
**Branch Pattern:** `feature/copilot-*`
**Responsibility:** Connect frontend to backend, type safety, polish

---

## 📊 PROJECT STATUS CHECK (Updated: 2026-01-20)

### ✅ ALREADY COMPLETED (85%) - DO NOT REBUILD!

**Existing Integrations (DONE):**
- ✅ Product CRUD integration - UI ↔ API fully connected
- ✅ Order management integration - Working end-to-end
- ✅ Stock operations integration - Add/export/logs connected
- ✅ Image upload integration - Drag & drop → Supabase Storage
- ✅ Cart integration - LocalStorage + WhatsApp checkout
- ✅ Analytics integration - Dashboard fetches real-time data
- ✅ Search integration - Basic search working
- ✅ Filter integration - Category + price filters active

**Type Safety (DONE):**
- ✅ Database types (`types/supabase.ts`) - Generated from Supabase
- ✅ Component prop types - All typed
- ✅ API response types - Defined in route handlers
- ✅ No critical `any` types in production code

**Error Handling (DONE):**
- ✅ API error responses - Standardized format
- ✅ Toast notifications - Success/error messages
- ✅ Loading states - Implemented across pages
- ✅ Global error boundary - Catches unhandled errors

**Utilities (DONE):**
- ✅ CSRF protection (`lib/csrf.ts` + `lib/csrfClient.ts`)
- ✅ Rate limiting (`lib/rateLimiter.ts`)
- ✅ Data utilities (`lib/data.ts`)
- ✅ Supabase clients (`lib/supabase/`)

### 🚧 REMAINING WORK (15%) - YOUR FOCUS!

**What You WILL Integrate (Not Connected Yet):**
1. ❌ Email notification integration - **SAYA builds API, CURSOR builds UI, YOU CONNECT**
2. ❌ Invoice PDF download - **SAYA builds generator, CURSOR builds button, YOU CONNECT**
3. ❌ Customer auth integration - **SAYA builds backend, CURSOR builds forms, YOU CONNECT**
4. ❌ Search autocomplete - **SAYA builds API, CURSOR builds dropdown, YOU CONNECT**
5. ❌ Advanced filters - **Needs state management + URL params**
6. ❌ Form validation schemas - **Client-side validation needed**

**CRITICAL VERIFICATION BEFORE INTEGRATING:**
```typescript
// Step 1: Check SAYA built the backend
await read('app/api/email/send/route.ts')
// ✅ If exists → Backend ready

// Step 2: Check CURSOR built the UI
await read('components/admin/EmailNotificationBadge.tsx')
// ✅ If exists → Frontend ready

// Step 3: Check integration not done yet
// Look for TODO comments or placeholder fetch calls
// ✅ If found TODO → Your job to integrate!
```

**If integration already exists:**
- 🔍 READ the existing code
- 🐛 FIX bugs if any
- ✨ ENHANCE with better error handling
- 🚫 DON'T rewrite working integrations

---

## ⚠️ CRITICAL: READ BEFORE STARTING ANY TASK

### 🔍 MANDATORY INTEGRATION ANALYSIS PROMPT

**BEFORE integrating ANY feature, you MUST run this analysis:**

```
STEP 1: UNDERSTAND BOTH SIDES
------------------------------
I am the BRIDGE between frontend (Cursor) and backend (SAYA).
Before connecting them, I must understand BOTH sides completely.

1. Read BACKEND code (SAYA's work):
   - What API endpoint was created?
   - What's the exact request format?
   - What's the exact response format?
   - What authentication is needed?
   - What error codes can be returned?

2. Read FRONTEND code (Cursor's work):
   - What component needs data?
   - What props/state are defined?
   - Where should I add the fetch call?
   - What loading states exist?
   - Where should errors be shown?

3. Map the connection:
   Frontend Component → My API Call → Backend Endpoint → Response → UI Update

STEP 2: TRACE DATA FLOW
------------------------
Follow data from user action to database and back:

USER ACTION:
- What triggers the API call? (button click, form submit, page load)
- Located in: [component file path]
- Function name: [handler function]

MY INTEGRATION POINT:
- Where I add: fetch() or api.get() call
- Parameters I pass: [from component state/props]
- Response I expect: [from backend API]

BACKEND PROCESSING (by SAYA):
- Endpoint: [API route path]
- Database: [tables read/written]
- Business logic: [what happens server-side]

RESPONSE HANDLING (my job):
- Success: Update component state, show toast
- Error: Catch error, show message, log
- Loading: Set loading state before/after

STEP 3: DETECT INTEGRATION REQUIREMENTS
----------------------------------------
Map EXACTLY what I need to connect:

Check AI_TASK_CLAUDE.md:
- What API did SAYA build?
- What parameters are required?
- What's returned on success?
- What errors can occur?

Check AI_TASK_CURSOR.md:
- What UI component exists?
- What state is defined?
- Where should I add fetch?
- What TODOs did Cursor leave for me?

Example Integration Map:
/*
Feature: Email Notification Badge

CURSOR CREATED:
- File: components/admin/EmailNotificationBadge.tsx
- State: status, loading, error
- TODO: "Fetch email status from API"
- useEffect: needs API call

SAYA CREATED:
- Endpoint: GET /api/email/status
- Response: { success: boolean, data: { sent, failed, pending } }
- Auth: Required (admin session)
- Errors: 401 (unauthorized), 500 (server error)

MY INTEGRATION:
1. Add fetch in useEffect
2. Define EmailStatusResponse type
3. Handle loading state
4. Handle error state
5. Update status state on success
6. Add auto-refresh (30s interval)
*/

STEP 4: CHECK DEPENDENCIES
---------------------------
Before integrating, verify all pieces exist:

Backend Check (SAYA's code):
- [ ] API endpoint file exists
- [ ] Endpoint is exported and functional
- [ ] Database connection works
- [ ] Authentication middleware applied

Frontend Check (Cursor's code):
- [ ] Component file exists
- [ ] State variables defined
- [ ] Event handlers created
- [ ] Loading/error UI in place

My Dependencies:
- [ ] Type definitions needed
- [ ] Error handler utility needed
- [ ] API client wrapper needed
- [ ] Validation schema needed

STEP 5: PLAN INTEGRATION STEPS
-------------------------------
Break down exactly what I'll add:

1. Type Definitions:
   ```typescript
   interface RequestType { ... }
   interface ResponseType { ... }
   interface ErrorType { ... }
   ```

2. API Integration:
   ```typescript
   const response = await api.get<ResponseType>(endpoint)
   ```

3. Error Handling:
   ```typescript
   try { ... } catch (error) {
     handleAPIError(error)
     // Show user-friendly message
   }
   ```

4. State Management:
   ```typescript
   setLoading(true)
   // ... fetch
   setData(response.data)
   setLoading(false)
   ```

5. Validation:
   ```typescript
   // Client-side validation before API call
   if (!validateInput(data)) return
   ```

STEP 6: VERIFY INTEGRATION COMPLETENESS
----------------------------------------
Before marking task complete, check:

✓ Does data flow from UI → API → DB → Response → UI?
✓ Are all error cases handled?
✓ Is loading state shown during requests?
✓ Are types properly defined (no `any`)?
✓ Is validation in place?
✓ Do success/error messages show to user?
✓ Is the integration tested locally?

If NO to any → INCOMPLETE! Keep working!
```

### 📖 HOW TO USE THIS PROMPT

**Example: Integrating Invoice Download**

```typescript
// WRONG APPROACH (Don't do this!):
// Blindly add fetch without understanding both sides

// RIGHT APPROACH:

// STEP 1: Read SAYA's backend code
/*
File: app/api/invoice/[orderId]/route.ts

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  // ... generates PDF
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${orderNumber}.pdf"`
    }
  })
}

UNDERSTAND:
- Takes orderId from URL params
- Returns PDF as blob
- No JSON response, direct file
- Auth required (middleware)
*/

// STEP 2: Read Cursor's frontend code
/*
File: components/admin/InvoiceDownloadButton.tsx

const [downloading, setDownloading] = useState(false)
const [downloaded, setDownloaded] = useState(false)

const handleDownload = async () => {
  // TODO: Copilot adds fetch to /api/invoice/[orderId]
}

UNDERSTAND:
- State already defined
- Loading states ready
- Need to implement handleDownload
- Has orderId and orderNumber props
*/

// STEP 3: Plan complete integration
/*
INTEGRATION PLAN:

1. Types needed:
   - None! Returns blob, not JSON

2. Fetch implementation:
   - GET /api/invoice/[orderId]
   - Handle blob response
   - Create download link
   - Trigger download

3. Error handling:
   - 404: Order not found
   - 500: PDF generation failed
   - Network error

4. User feedback:
   - Loading: "Generating..."
   - Success: "Downloaded" + toast
   - Error: Toast with message
*/

// STEP 4: Implement with full understanding
const handleDownload = async () => {
  setDownloading(true)

  try {
    // Fetch PDF from SAYA's endpoint
    const response = await fetch(`/api/invoice/${orderId}`)

    if (!response.ok) {
      // Handle backend errors
      if (response.status === 404) {
        throw new Error('Invoice not found')
      }
      throw new Error('Failed to generate invoice')
    }

    // Handle blob response (not JSON!)
    const blob = await response.blob()

    // Create download (browser API)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${orderNumber}.pdf`
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Update UI state
    setDownloaded(true)
    toast.success('Invoice downloaded!')

    // Reset after 3s
    setTimeout(() => setDownloaded(false), 3000)
  } catch (error) {
    // Error handling with user-friendly message
    console.error('Invoice download error:', error)
    toast.error(
      error instanceof Error
        ? error.message
        : 'Failed to download invoice'
    )
  } finally {
    setDownloading(false)
  }
}

// Complete integration:
// ✓ Connects Cursor UI to SAYA API
// ✓ Handles all states (loading, success, error)
// ✓ User feedback via toast
// ✓ Proper cleanup
// ✓ Error messages helpful
```

### 🎯 DETECTION CHECKLIST

Before integrating each feature, verify:

**Understanding Both Sides:**
- [ ] I've read SAYA's backend API code
- [ ] I've read Cursor's frontend component code
- [ ] I understand request/response formats
- [ ] I know all possible error scenarios

**Type Safety:**
- [ ] Request types defined
- [ ] Response types defined
- [ ] Error types defined
- [ ] No `any` types used

**Error Handling:**
- [ ] Try-catch around API calls
- [ ] Specific error messages for each error type
- [ ] User sees helpful error messages
- [ ] Errors logged for debugging

**State Management:**
- [ ] Loading state before request
- [ ] Success state after response
- [ ] Error state on failure
- [ ] Reset state as needed

**User Experience:**
- [ ] Loading indicator shows
- [ ] Success feedback (toast/message)
- [ ] Error feedback (toast/message)
- [ ] Smooth transitions

**Testing:**
- [ ] Tested success case
- [ ] Tested error cases
- [ ] Tested loading states
- [ ] Verified data flow

---

## 🎯 PRIMARY RESPONSIBILITIES

### 1. Frontend-Backend Integration
- Connect UI components to API endpoints
- Handle API fetch calls
- Manage response/error states
- Data transformation
- Loading state coordination

### 2. Type Safety & Validation
- TypeScript type definitions
- Interface creation for API responses
- Client-side validation (data level)
- Type guards
- Zod schemas (if needed)

### 3. Code Polish & Optimization
- Code cleanup
- Remove console.logs
- Fix TypeScript errors
- ESLint compliance
- Performance micro-optimizations

### 4. Error Handling
- Try-catch blocks for API calls
- User-friendly error messages
- Error logging
- Fallback states
- Retry logic

---

## 📋 TASK LIST (Priority Order)

### 🔴 SPRINT 1: Email & Invoice Integration (Days 1-2)

#### Task 1.1: Email UI Integration
**Branch:** `feature/copilot-email-integration`
**Priority:** HIGH
**Estimated Time:** 1.5 hours
**Dependencies:**
- `feature/claude-email-system` merged
- `feature/cursor-email-ui` merged

**Files to Modify:**
```
├── components/admin/EmailNotificationBadge.tsx
├── components/admin/EmailSettings.tsx
└── app/admin/page.tsx (add EmailNotificationBadge)
```

**Task 1.1.1: Connect EmailNotificationBadge to API**

**Current state (from Cursor):**
```tsx
// components/admin/EmailNotificationBadge.tsx
useEffect(() => {
  // TODO: Fetch email status from API
}, [])
```

**Your implementation:**
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

// Add proper type
interface EmailStatusResponse {
  success: boolean
  data: EmailStatus
}

export default function EmailNotificationBadge() {
  const [status, setStatus] = useState<EmailStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmailStatus() {
      try {
        const response = await fetch('/api/email/status')

        if (!response.ok) {
          throw new Error('Failed to fetch email status')
        }

        const result: EmailStatusResponse = await response.json()

        if (result.success) {
          setStatus(result.data)
        }
      } catch (err) {
        console.error('Email status fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEmailStatus()

    // Refresh every 30 seconds
    const interval = setInterval(fetchEmailStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm animate-pulse">
        <div className="h-5 w-5 bg-gray-200 rounded" />
        <div className="flex gap-3">
          <div className="h-4 w-8 bg-gray-200 rounded" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return null // Silent fail or show error icon
  }

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

**Task 1.1.2: Connect EmailSettings to API**

```tsx
// components/admin/EmailSettings.tsx
// Add API integration to handleSave function

const handleSave = async () => {
  setSaving(true)

  try {
    const response = await fetch('/api/email/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    })

    if (!response.ok) {
      throw new Error('Failed to save settings')
    }

    const result = await response.json()

    if (result.success) {
      toast.success('Email settings updated!')
    } else {
      throw new Error(result.message || 'Save failed')
    }
  } catch (error) {
    console.error('Save settings error:', error)
    toast.error('Failed to save settings')
  } finally {
    setSaving(false)
  }
}
```

**Task 1.1.3: Add Type Definitions**

Create proper types for email-related data:
```typescript
// types/email.ts
export interface EmailStatus {
  sent: number
  failed: number
  pending: number
  lastUpdated?: string
}

export interface EmailSettings {
  orderConfirmation: boolean
  lowStockAlert: boolean
  newCustomer: boolean
  dailyReport: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
}

export interface SendEmailRequest {
  to: string
  template: string
  data: Record<string, any>
}

export interface SendEmailResponse {
  success: boolean
  messageId?: string
  error?: string
}
```

**Success Criteria:**
- ✅ Email badge shows live data from API
- ✅ Settings save to backend successfully
- ✅ All TypeScript types defined
- ✅ Error handling comprehensive
- ✅ Loading states smooth
- ✅ No console errors

---

#### Task 1.2: Invoice PDF Integration
**Branch:** `feature/copilot-invoice-integration`
**Priority:** HIGH
**Estimated Time:** 1 hour
**Dependencies:**
- `feature/claude-invoice-pdf` merged
- `feature/cursor-invoice-ui` merged

**Files to Modify:**
```
├── components/admin/InvoiceDownloadButton.tsx
├── app/admin/orders/[id]/page.tsx
└── types/invoice.ts (create)
```

**Task 1.2.1: Implement PDF Download Logic**

```tsx
// components/admin/InvoiceDownloadButton.tsx
const handleDownload = async () => {
  setDownloading(true)

  try {
    const response = await fetch(`/api/invoice/${orderId}`)

    if (!response.ok) {
      throw new Error('Failed to generate invoice')
    }

    // Get the PDF blob
    const blob = await response.blob()

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${orderNumber}.pdf`
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    setDownloaded(true)
    toast.success('Invoice downloaded!')

    setTimeout(() => setDownloaded(false), 3000)
  } catch (error) {
    console.error('Invoice download error:', error)
    toast.error('Failed to download invoice')
  } finally {
    setDownloading(false)
  }
}
```

**Task 1.2.2: Add Invoice Types**

```typescript
// types/invoice.ts
export interface InvoiceData {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  orderDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: string
}

export interface InvoiceItem {
  name: string
  sku: string
  quantity: number
  price: number
  total: number
}
```

**Task 1.2.3: Integrate in Order Detail Page**

```tsx
// app/admin/orders/[id]/page.tsx
import InvoiceDownloadButton from '@/components/admin/InvoiceDownloadButton'

// Add to page (Cursor created the UI, you connect it)
<div className="flex items-center gap-2">
  <InvoiceDownloadButton
    orderId={order.id}
    orderNumber={order.order_number}
  />
  {/* Other action buttons */}
</div>
```

**Success Criteria:**
- ✅ PDF downloads correctly
- ✅ Filename includes order number
- ✅ Error handling for failed downloads
- ✅ Loading states work
- ✅ Types properly defined
- ✅ Works on all browsers

---

### 🟡 SPRINT 2: Form Validation & Error Handling (Days 3-4)

#### Task 2.1: Add Client-Side Validation
**Branch:** `feature/copilot-form-validation`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Files to Modify:**
```
├── components/auth/RegisterForm.tsx
├── components/auth/LoginForm.tsx
├── app/admin/products/new/page.tsx
└── app/admin/products/[id]/edit/page.tsx
```

**Task 2.1.1: Registration Form Validation**

Add comprehensive validation to registration form:

```tsx
// lib/validation.ts (create this file)
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Indonesian phone number format
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
```

**Integrate validation in RegisterForm:**

```tsx
// components/auth/RegisterForm.tsx
import { validateEmail, validatePhone, validatePassword } from '@/lib/validation'

const [errors, setErrors] = useState<Record<string, string>>({})

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  // Email validation
  if (!validateEmail(formData.email)) {
    newErrors.email = 'Invalid email address'
  }

  // Phone validation
  if (!validatePhone(formData.phone)) {
    newErrors.phone = 'Invalid phone number format'
  }

  // Password validation
  const passwordCheck = validatePassword(formData.password)
  if (!passwordCheck.isValid) {
    newErrors.password = passwordCheck.errors[0]
  }

  // Confirm password
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validate before submitting
  if (!validateForm()) {
    toast.error('Please fix validation errors')
    return
  }

  setLoading(true)

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result = await response.json()

    toast.success('Account created successfully!')
    // Redirect to login or auto-login
  } catch (error) {
    console.error('Registration error:', error)
    toast.error(error instanceof Error ? error.message : 'Registration failed')
  } finally {
    setLoading(false)
  }
}

// Show errors in UI
{errors.email && (
  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
)}
```

**Task 2.1.2: Product Form Validation**

Add validation to product creation/editing forms:

```tsx
// app/admin/products/new/page.tsx
const validateProductForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!product.name || product.name.trim().length < 3) {
    newErrors.name = 'Product name must be at least 3 characters'
  }

  if (!product.sku || product.sku.trim().length < 2) {
    newErrors.sku = 'SKU is required'
  }

  if (product.price <= 0) {
    newErrors.price = 'Price must be greater than 0'
  }

  if (product.stock < 0) {
    newErrors.stock = 'Stock cannot be negative'
  }

  if (!product.category_id) {
    newErrors.category = 'Please select a category'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

**Success Criteria:**
- ✅ All forms have client-side validation
- ✅ Error messages user-friendly
- ✅ Validation runs before API calls
- ✅ Real-time validation on blur
- ✅ No form submission with errors
- ✅ Helper text for complex fields

---

#### Task 2.2: Global Error Handling
**Branch:** `feature/copilot-error-handling`
**Priority:** MEDIUM
**Estimated Time:** 1.5 hours

**Files to Create/Modify:**
```
├── lib/api-client.ts (create)
├── lib/error-handler.ts (create)
└── components/ErrorToast.tsx (create)
```

**Task 2.2.1: Create API Client Wrapper**

```typescript
// lib/api-client.ts
interface FetchOptions extends RequestInit {
  timeout?: number
}

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function apiClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new APIError(
        response.status,
        error.message || `HTTP ${response.status}`,
        error
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new APIError(408, 'Request timeout')
    }

    throw new APIError(500, 'Network error')
  }
}

// Usage wrapper functions
export const api = {
  get: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data?: any, options?: FetchOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),
}
```

**Task 2.2.2: Implement Error Handler**

```typescript
// lib/error-handler.ts
import toast from 'react-hot-toast'
import { APIError } from './api-client'

export function handleAPIError(error: unknown): void {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        toast.error('Invalid request. Please check your input.')
        break
      case 401:
        toast.error('Please login to continue')
        // Redirect to login
        window.location.href = '/admin/login'
        break
      case 403:
        toast.error('You do not have permission to perform this action')
        break
      case 404:
        toast.error('Resource not found')
        break
      case 408:
        toast.error('Request timeout. Please try again.')
        break
      case 429:
        toast.error('Too many requests. Please slow down.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        toast.error(error.message || 'An error occurred')
    }
  } else if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error('An unexpected error occurred')
  }
}
```

**Task 2.2.3: Update All API Calls to Use New Client**

Example refactor:
```tsx
// Before
try {
  const response = await fetch('/api/products')
  const data = await response.json()
  setProducts(data)
} catch (error) {
  toast.error('Failed to load products')
}

// After
try {
  const data = await api.get<Product[]>('/api/products')
  setProducts(data)
} catch (error) {
  handleAPIError(error)
}
```

**Success Criteria:**
- ✅ Centralized API client
- ✅ Consistent error handling
- ✅ Timeout protection
- ✅ Proper error types
- ✅ User-friendly error messages
- ✅ All API calls updated

---

### 🟢 SPRINT 3: Type Safety & Optimization (Days 5-6)

#### Task 3.1: Complete Type Definitions
**Branch:** `feature/copilot-type-definitions`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Files to Create:**
```
types/
├── product.ts
├── order.ts
├── customer.ts
├── analytics.ts
└── api-responses.ts
```

**Task 3.1.1: Product Types**

```typescript
// types/product.ts
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  sku: string
  barcode: string | null
  category_id: string | null
  category?: Category
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  sku: string
  barcode?: string
  category_id: string
  image?: File
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

**Task 3.1.2: Order Types**

```typescript
// types/order.ts
export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  sku: string
  quantity: number
  price: number
  subtotal: number
}

export interface CreateOrderRequest {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: {
    product_id: string
    quantity: number
  }[]
  payment_method: string
  notes?: string
}

export interface OrderListResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
}
```

**Task 3.1.3: Analytics Types**

```typescript
// types/analytics.ts
export interface DashboardStats {
  today: {
    sales: number
    orders: number
    revenue: number
  }
  week: {
    sales: number
    orders: number
    revenue: number
  }
  month: {
    sales: number
    orders: number
    revenue: number
  }
}

export interface RevenueChartData {
  date: string
  revenue: number
  orders: number
}

export interface CategorySalesData {
  category: string
  sales: number
  percentage: number
}

export interface StockAlert {
  product_id: string
  product_name: string
  sku: string
  current_stock: number
  threshold: number
}
```

**Success Criteria:**
- ✅ All entities have TypeScript types
- ✅ API responses typed
- ✅ Form data typed
- ✅ No `any` types used
- ✅ Proper optional/required fields
- ✅ Documentation comments (JSDoc)

---

#### Task 3.2: Code Quality & Cleanup
**Branch:** `feature/copilot-code-cleanup`
**Priority:** MEDIUM
**Estimated Time:** 2 hours

**Tasks:**

1. **Remove Console Logs**
   - Remove all `console.log` statements
   - Keep only `console.error` for error logging
   - Add proper error logging service (optional)

2. **Fix ESLint Warnings**
   ```bash
   npm run lint --fix
   ```
   - Fix all auto-fixable issues
   - Manually fix remaining warnings

3. **Optimize Imports**
   - Remove unused imports
   - Group imports logically
   - Use named exports consistently

4. **Code Deduplication**
   - Extract repeated logic into utilities
   - Create reusable hooks
   - Simplify complex components

**Example Optimizations:**

```tsx
// Before - Repeated fetch logic
const fetchProducts = async () => {
  const response = await fetch('/api/products')
  const data = await response.json()
  setProducts(data)
}

const fetchOrders = async () => {
  const response = await fetch('/api/orders')
  const data = await response.json()
  setOrders(data)
}

// After - Reusable hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    api.get<T>(url)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}

// Usage
const { data: products } = useFetch<Product[]>('/api/products')
const { data: orders } = useFetch<Order[]>('/api/orders')
```

**Success Criteria:**
- ✅ Zero ESLint errors
- ✅ No console.log statements
- ✅ No unused imports
- ✅ Code is DRY
- ✅ Consistent code style
- ✅ Type safety at 100%

---

### 🔵 SPRINT 4: Final Integration & Testing (Day 7)

#### Task 4.1: End-to-End Integration Testing
**Branch:** `dev` (test on integration branch)
**Priority:** HIGH
**Estimated Time:** 3 hours

**Testing Checklist:**

**1. Email Flow:**
- [ ] Order confirmation email sends
- [ ] Email contains correct order details
- [ ] Low stock alert triggers
- [ ] Email settings save correctly
- [ ] Email status updates in real-time

**2. Invoice Flow:**
- [ ] PDF generates correctly
- [ ] PDF contains all order data
- [ ] Download works in all browsers
- [ ] PDF email attachment works
- [ ] Invoice preview displays correctly

**3. Forms:**
- [ ] Registration validates correctly
- [ ] Login authenticates successfully
- [ ] Product form saves data
- [ ] Order form creates orders
- [ ] All form errors display properly

**4. API Integration:**
- [ ] All API calls use api client
- [ ] Error handling works consistently
- [ ] Loading states show properly
- [ ] Timeout protection works
- [ ] Rate limiting respected

**5. Type Safety:**
- [ ] Build succeeds with no type errors
- [ ] All API responses properly typed
- [ ] No `any` types in codebase
- [ ] IntelliSense works everywhere

**Success Criteria:**
- ✅ All features work end-to-end
- ✅ No integration bugs
- ✅ Smooth user experience
- ✅ All errors handled gracefully
- ✅ Performance acceptable

---

#### Task 4.2: Performance Optimization
**Branch:** `feature/copilot-performance`
**Priority:** MEDIUM
**Estimated Time:** 1.5 hours

**Optimization Tasks:**

1. **Lazy Load Heavy Components**
```tsx
// Before
import Chart from '@/components/charts/RevenueChart'

// After
const Chart = dynamic(() => import('@/components/charts/RevenueChart'), {
  loading: () => <ChartSkeleton />
})
```

2. **Memoize Expensive Calculations**
```tsx
const expensiveCalculation = useMemo(() => {
  return complexOperation(data)
}, [data])
```

3. **Optimize Re-renders**
```tsx
const MemoizedComponent = memo(ExpensiveComponent, (prev, next) => {
  return prev.id === next.id
})
```

4. **Debounce Search Input**
```tsx
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    performSearch(value)
  }, 300),
  []
)
```

**Success Criteria:**
- ✅ Reduced bundle size
- ✅ Faster initial load
- ✅ Smooth interactions
- ✅ No unnecessary re-renders
- ✅ Lighthouse score improved

---

## 🚫 BOUNDARIES - DO NOT TOUCH

### SAYA's Territory:
- ❌ Backend API implementation
- ❌ Database operations
- ❌ Server-side logic
- ❌ Email sending
- ❌ PDF generation
- ❌ Authentication logic (Supabase setup)

### Cursor's Territory:
- ❌ UI component creation
- ❌ CSS styling
- ❌ Layout design
- ❌ Responsive breakpoints
- ❌ Animation design
- ❌ Icon selection

### Your Safe Zone:
- ✅ API fetch calls
- ✅ Type definitions
- ✅ Error handling
- ✅ Form validation (data level)
- ✅ Data transformation
- ✅ Integration logic
- ✅ Code cleanup
- ✅ Performance optimization
- ✅ Testing

---

## 📝 GIT WORKFLOW

### Branch Naming
```
feature/copilot-{feature-name}

Examples:
✅ feature/copilot-email-integration
✅ feature/copilot-form-validation
✅ feature/copilot-type-definitions
```

### Commit Messages
```
feat(integration): Connect email UI to backend
fix(validation): Add phone number format check
refactor(types): Improve product type definitions
perf(api): Optimize fetch calls with debounce
```

---

## ✅ QUALITY CHECKLIST

Before merging:
- [ ] All TypeScript errors resolved
- [ ] ESLint passes with no warnings
- [ ] No console.log statements
- [ ] All API calls use api client
- [ ] Error handling comprehensive
- [ ] Types properly defined
- [ ] Code is optimized
- [ ] No unused imports
- [ ] Documentation updated

---

**Last Updated:** 2026-01-20
**Assigned To:** GitHub Copilot (via User)
**Status:** 🟢 Active
**Next Review:** Daily Standup

---

**⚡ This task list was generated specifically for GitHub Copilot - Integration & Polish Specialist**
