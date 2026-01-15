# 📚 API DOCUMENTATION - Sahara Mart

**Version:** 1.0
**Base URL:** `https://your-domain.vercel.app/api`
**Last Updated:** 16 Januari 2026

---

## 📋 TABLE OF CONTENTS

1. [Authentication](#authentication)
2. [Products API](#products-api)
3. [Categories API](#categories-api)
4. [Orders API](#orders-api)
5. [Analytics API](#analytics-api)
6. [Stock API](#stock-api)
7. [Error Codes](#error-codes)
8. [Rate Limiting](#rate-limiting)

---

## 🔐 AUTHENTICATION

### Admin Authentication
Most endpoints require authentication via Supabase Auth.

**Headers:**
```http
Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
```

**Get Token:**
```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## 🛍️ PRODUCTS API

### 1. GET /api/products
Get list of products with pagination and filters.

**Request:**
```http
GET /api/products?page=1&limit=20&category=sembako&search=indomie&featured=true
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page (max 100) |
| `category` | string | No | - | Category slug |
| `search` | string | No | - | Search in name, SKU, barcode, description |
| `featured` | boolean | No | false | Filter featured products |

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Indomie Goreng",
      "slug": "indomie-goreng",
      "category_id": 1,
      "price": 3000,
      "original_price": 2500,
      "stock": 100,
      "weight": "85g",
      "sku": "IM001",
      "barcode": "8992761112003",
      "description": "Mie instan rasa goreng",
      "image_url": "https://...",
      "is_active": true,
      "is_featured": false,
      "views_count": 150,
      "created_at": "2026-01-15T10:00:00Z",
      "categories": {
        "id": 1,
        "name": "Sembako",
        "slug": "sembako",
        "icon": "🌾"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 2. GET /api/products/[id]
Get single product by ID.

**Request:**
```http
GET /api/products/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Indomie Goreng",
    // ... (same as above)
  }
}
```

**Errors:**
- `400` - Invalid product ID
- `404` - Product not found
- `500` - Internal server error

---

### 3. POST /api/products
Create new product. **Requires authentication.**

**Request:**
```http
POST /api/products
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Indomie Goreng",
  "category_id": 1,
  "price": 3000,
  "original_price": 2500,
  "stock": 100,
  "weight": "85g",
  "sku": "IM001",
  "barcode": "8992761112003",
  "description": "Mie instan rasa goreng",
  "image_url": "https://...",
  "is_active": true,
  "is_featured": false
}
```

**Required Fields:**
- `name` (string)
- `category_id` (number)
- `price` (number, >= 0)
- `stock` (number, >= 0)

**Response:**
```json
{
  "data": { /* product object */ },
  "message": "Produk berhasil ditambahkan"
}
```

**Errors:**
- `400` - Missing required fields / Invalid data
- `500` - Internal server error

---

### 4. PUT /api/products/[id]
Update product. **Requires authentication.**

**Request:**
```http
PUT /api/products/1
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Indomie Goreng Updated",
  "price": 3500,
  "stock": 150
  // ... other fields
}
```

**Response:**
```json
{
  "message": "Produk berhasil diperbarui",
  "data": { /* updated product */ }
}
```

---

### 5. DELETE /api/products/[id]
Soft delete product (set is_active = false). **Requires authentication.**

**Request:**
```http
DELETE /api/products/1
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Produk berhasil dinonaktifkan (Soft Delete)"
}
```

**Note:** Products are never hard-deleted to preserve order history.

---

## 📁 CATEGORIES API

### 1. GET /api/categories
Get all categories.

**Request:**
```http
GET /api/categories?include_inactive=false
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `include_inactive` | boolean | false | Include inactive categories |

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Sembako",
      "slug": "sembako",
      "icon": "🌾",
      "description": "Kebutuhan pokok sehari-hari",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. GET /api/categories/[id]
Get single category by ID.

**Request:**
```http
GET /api/categories/1
```

**Response:**
```json
{
  "category": {
    "id": 1,
    "name": "Sembako",
    // ...
  }
}
```

---

### 3. POST /api/categories
Create new category. **Requires authentication.**

**Request:**
```http
POST /api/categories
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Minuman",
  "icon": "🥤",
  "description": "Minuman segar",
  "is_active": true
}
```

**Required Fields:**
- `name` (string)

**Auto-generated:**
- `slug` - From name (lowercase, hyphenated)

**Response:**
```json
{
  "message": "Category created successfully",
  "category": { /* category object */ }
}
```

**Errors:**
- `400` - Missing name
- `409` - Category with this name already exists
- `500` - Internal server error

---

### 4. PUT /api/categories/[id]
Update category. **Requires authentication.**

**Request:**
```http
PUT /api/categories/1
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Sembako Updated",
  "icon": "🌾",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "message": "Category updated successfully",
  "category": { /* updated category */ }
}
```

---

### 5. DELETE /api/categories/[id]
Delete category. **Requires authentication.**

**Behavior:**
- If category has products: **Soft delete** (set is_active = false)
- If category has no products: **Hard delete** (remove from database)

**Request:**
```http
DELETE /api/categories/1
Authorization: Bearer TOKEN
```

**Response (Soft Delete):**
```json
{
  "message": "Category deactivated (has products)",
  "categoryName": "Sembako",
  "type": "soft_delete"
}
```

**Response (Hard Delete):**
```json
{
  "message": "Category deleted successfully",
  "categoryName": "Empty Category",
  "type": "hard_delete"
}
```

---

## 🛒 ORDERS API

### 1. GET /api/orders
Get all orders with pagination. **Requires authentication.**

**Request:**
```http
GET /api/orders?page=1&limit=20&status=pending
Authorization: Bearer TOKEN
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | - | Filter by status: pending, processing, completed, cancelled, delivered |

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260116-001",
      "customer_name": "John Doe",
      "customer_phone": "081234567890",
      "customer_address": "Jl. Example No. 123",
      "total_amount": 50000,
      "status": "pending",
      "payment_method": "whatsapp",
      "notes": "Kirim sore ya",
      "created_at": "2026-01-16T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### 2. GET /api/orders/[id]
Get single order by ID.

**Request:**
```http
GET /api/orders/1
Authorization: Bearer TOKEN (for admin) OR order_number match (for customer)
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "order_number": "ORD-20260116-001",
    "customer_name": "John Doe",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Indomie Goreng",
        "quantity": 5,
        "price": 3000,
        "subtotal": 15000
      }
    ],
    // ... other fields
  }
}
```

---

### 3. POST /api/orders
Create new order.

**Request:**
```http
POST /api/orders
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "081234567890",
  "customer_address": "Jl. Example No. 123",
  "items": [
    {
      "product_id": 1,
      "quantity": 5,
      "price": 3000
    }
  ],
  "total_amount": 15000,
  "payment_method": "whatsapp",
  "notes": "Kirim sore"
}
```

**Stock Management:**
- Automatically reduces product stock
- Validates sufficient stock before order creation
- Returns error if insufficient stock

**Response:**
```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "order": { /* order object */ },
    "order_number": "ORD-20260116-001",
    "whatsapp_url": "https://wa.me/628123456789?text=..."
  }
}
```

**Errors:**
- `400` - Missing required fields / Invalid data
- `400` - Insufficient stock for product X
- `500` - Internal server error

---

### 4. PUT /api/orders/[id]
Update order status. **Requires authentication.**

**Request:**
```http
PUT /api/orders/1
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "delivered"
}
```

**Valid Status Transitions:**
- `pending` → `processing` → `completed` → `delivered`
- Any → `cancelled`

**Response:**
```json
{
  "message": "Status order berhasil diupdate",
  "data": { /* updated order */ }
}
```

---

### 5. DELETE /api/orders/[id]
Delete order. **Requires authentication.**

**Behavior:**
- Restores product stock automatically
- Prevents double restoration

**Request:**
```http
DELETE /api/orders/1
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "Order berhasil dihapus dan stok dikembalikan"
}
```

---

## 📊 ANALYTICS API

### 1. GET /api/analytics/today
Get today's sales statistics. **Requires authentication.**

**Request:**
```http
GET /api/analytics/today
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "stats": {
    "totalOrders": 25,
    "totalRevenue": 500000,
    "totalProfit": 125000,
    "itemsSold": 150
  }
}
```

---

### 2. GET /api/analytics/weekly
Get weekly sales statistics. **Requires authentication.**

**Request:**
```http
GET /api/analytics/weekly
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "stats": {
    "totalOrders": 175,
    "totalRevenue": 3500000,
    "totalProfit": 875000,
    "itemsSold": 1050
  },
  "trend": [
    { "date": "2026-01-10", "revenue": 450000 },
    { "date": "2026-01-11", "revenue": 520000 },
    // ... 7 days
  ]
}
```

---

### 3. GET /api/analytics/monthly
Get monthly sales statistics. **Requires authentication.**

**Request:**
```http
GET /api/analytics/monthly
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "stats": {
    "totalOrders": 750,
    "totalRevenue": 15000000,
    "totalProfit": 3750000,
    "itemsSold": 4500
  },
  "trend": [
    { "date": "2026-01-01", "revenue": 450000 },
    // ... 30 days
  ]
}
```

---

### 4. GET /api/analytics/top-products
Get top selling products. **Requires authentication.**

**Request:**
```http
GET /api/analytics/top-products?limit=10&period=month
Authorization: Bearer TOKEN
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of products |
| `period` | string | month | Period: week, month, year |

**Response:**
```json
{
  "products": [
    {
      "product_id": 1,
      "product_name": "Indomie Goreng",
      "total_sold": 500,
      "total_revenue": 1500000,
      "category": "Sembako"
    }
  ]
}
```

---

## 📦 STOCK API

### 1. GET /api/stock/notifications
Get low stock and out of stock products. **Requires authentication.**

**Request:**
```http
GET /api/stock/notifications
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lowStockProducts": [
      {
        "id": 5,
        "name": "Gula Pasir",
        "stock": 3,
        "category": { "name": "Sembako" }
      }
    ],
    "outOfStockProducts": [
      {
        "id": 12,
        "name": "Minyak Goreng",
        "stock": 0
      }
    ],
    "summary": {
      "totalLowStock": 5,
      "totalOutOfStock": 2,
      "totalCritical": 7
    }
  }
}
```

---

### 2. POST /api/stock/add
Add stock to product. **Requires authentication.**

**Request:**
```http
POST /api/stock/add
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "productId": "123",
  "quantityToAdd": 50,
  "reason": "Restocking",
  "notes": "Supplier delivery"
}
```

**Required Fields:**
- `productId` (string UUID)
- `quantityToAdd` (number > 0)
- `reason` (string)

**Response:**
```json
{
  "success": true,
  "message": "Successfully added 50 units to Indomie Goreng",
  "data": {
    "product": {
      "id": "123",
      "name": "Indomie Goreng",
      "quantityBefore": 100,
      "quantityAdded": 50,
      "quantityAfter": 150
    },
    "log": { /* stock log entry */ }
  }
}
```

---

### 3. GET /api/stock/logs
Get stock movement logs. **Requires authentication.**

**Request:**
```http
GET /api/stock/logs?productId=123&type=addition&limit=50&offset=0
Authorization: Bearer TOKEN
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `productId` | string | - | Filter by product UUID |
| `type` | string | - | Filter by type: addition, reduction, adjustment, order, return |
| `limit` | number | 50 | Items per page (max 200) |
| `offset` | number | 0 | Pagination offset |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "addition",
      "quantity_before": 100,
      "quantity_change": 50,
      "quantity_after": 150,
      "reason": "Restocking",
      "notes": "Supplier delivery",
      "created_at": "2026-01-16T10:00:00Z",
      "products": {
        "id": "123",
        "name": "Indomie Goreng",
        "sku": "IM001"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## ❌ ERROR CODES

| Code | Description |
|------|-------------|
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing/invalid auth token |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Duplicate entry |
| `500` | Internal Server Error |

**Error Response Format:**
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

---

## 🚦 RATE LIMITING

**Status:** ⚠️ Not Yet Implemented (Week 1 Priority)

**Planned Limits:**
- Public endpoints: 100 requests/minute
- Order creation: 10 requests/minute
- Admin endpoints: 200 requests/minute

**Headers (Future):**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642320000
```

---

## 📝 NOTES

### Authentication
- All admin endpoints require Supabase JWT token
- Token expires after session timeout (1 hour inactivity)
- Use `Authorization: Bearer TOKEN` header

### Pagination
- Default page size: 20 items
- Maximum page size: 100 items
- Use `page` and `limit` query parameters

### Search
- Products search: name, SKU, barcode, description
- Case-insensitive partial matching (ILIKE)

### Stock Management
- Order creation automatically reduces stock
- Order cancellation/deletion restores stock
- Stock logs track all changes
- Low stock threshold: 5 units

### Soft Delete
- Products: Never hard-deleted (preserve order history)
- Categories: Soft-deleted if has products, hard-deleted if empty
- Orders: Can be deleted (stock restored)

---

## 🔧 TESTING

**Base URL (Development):**
```
http://localhost:3000/api
```

**Base URL (Production):**
```
https://your-domain.vercel.app/api
```

**Example with cURL:**
```bash
# Get products
curl https://your-domain.vercel.app/api/products

# Create product (requires auth)
curl -X POST https://your-domain.vercel.app/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","category_id":1,"price":5000,"stock":100}'
```

**Example with JavaScript:**
```javascript
// Get products
const response = await fetch('https://your-domain.vercel.app/api/products');
const data = await response.json();

// Create product (with auth)
const response = await fetch('https://your-domain.vercel.app/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Test Product',
    category_id: 1,
    price: 5000,
    stock: 100
  })
});
```

---

**Last Updated:** 16 Januari 2026
**Version:** 1.0
**Status:** ✅ Complete

**For questions or issues, refer to:**
- `HANDOVER_FINAL_V7.md` - Technical details
- `SECURITY_AUDIT_REPORT.md` - Security info
- `TODO_URGENT.md` - Roadmap priorities
