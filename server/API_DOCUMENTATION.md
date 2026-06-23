# Taste Pilot API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Server health status |

---

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/me` | Yes | Get current user profile |

### Register
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## Restaurants

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/restaurants` | No | List restaurants with search, filter, pagination |
| GET | `/restaurants/:id` | No | Restaurant details with menu |
| GET | `/restaurants/:id/menu` | No | Menu items for restaurant |

### Query Parameters (List)
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `search` — text search by name/cuisine
- `cuisine` — filter by cuisine type
- `isVeg` — `true` or `false`

### Query Parameters (Menu)
- `isVeg` — `true` or `false`
- `category` — filter by category
- `trending` — `true` for trending items only

---

## Menu

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/menu/trending` | No | Get trending menu items |
| GET | `/menu/restaurant/:restaurantId` | No | Get menu by restaurant (admin view includes unavailable) |

---

## Orders & Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders/preview` | Yes | Validate cart and calculate totals |
| POST | `/orders` | Yes | Place order |
| GET | `/orders/my` | Yes | Order history |
| GET | `/orders/:id` | Yes | Order details |
| PUT | `/orders/:id/cancel` | Yes | Cancel order |

### Cart Preview / Place Order Body
```json
{
  "restaurantId": "64abc123...",
  "items": [
    { "menuItemId": "64def456...", "quantity": 2 }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "label": "Home"
  }
}
```

### Order Statuses
`Placed` → `Preparing` → `Out for Delivery` → `Delivered`

Cancellation allowed from `Placed` or `Preparing`.

---

## Payments (Razorpay)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payment/create-order` | Yes | Create Razorpay order |
| POST | `/payment/verify` | Yes | Verify payment signature |

### Create Payment Order
```json
POST /payment/create-order
{
  "orderId": "64order123..."
}
```

### Verify Payment
```json
POST /payment/verify
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

---

## Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/:restaurantId` | No | Get restaurant reviews |
| POST | `/reviews/:restaurantId` | Yes | Add review (one per user per restaurant) |

### Add Review
```json
POST /reviews/:restaurantId
{
  "rating": 5,
  "comment": "Amazing food!"
}
```

---

## AI (Google Gemini)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/meal-planner` | Yes | AI meal plan generator |

Rate limit: 5 requests per minute per user.

### Meal Planner
```json
POST /ai/meal-planner
{
  "occasion": "Dinner for 2",
  "budget": 800,
  "dietaryPreference": "non-veg"
}
```

---

## Admin (Requires admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/analytics` | Dashboard analytics |
| GET | `/admin/restaurants` | List all restaurants |
| POST | `/admin/restaurants` | Create restaurant (multipart/form-data) |
| PUT | `/admin/restaurants/:id` | Update restaurant |
| DELETE | `/admin/restaurants/:id` | Soft delete restaurant |
| POST | `/admin/menu` | Add menu item |
| PUT | `/admin/menu/:id` | Update menu item |
| DELETE | `/admin/menu/:id` | Soft delete menu item |
| GET | `/admin/orders` | All orders |
| PUT | `/admin/orders/:id/status` | Update order status |

### Analytics Response
```json
{
  "totalUsers": 150,
  "totalOrders": 320,
  "totalRevenue": 125000,
  "topRestaurants": [...],
  "trendingFoods": [...],
  "recentOrders": [...],
  "ordersByStatus": { "Placed": 10, "Delivered": 200 }
}
```

### Update Order Status
```json
PUT /admin/orders/:id/status
{
  "status": "Preparing"
}
```

### Restaurant Create (multipart/form-data)
Fields:
- `name`, `description`, `isVeg`, `isActive`
- `cuisine` — JSON string array: `["Indian","Chinese"]`
- `address` — JSON string: `{"street":"...","city":"...","state":"...","pincode":"..."}`
- `openingHours` — JSON string array (optional)
- `image` — file upload

---

## Socket.IO Events

Connect to: `http://localhost:5000`

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-order` | `orderId` | Subscribe to order room |
| `leave-order` | `orderId` | Unsubscribe from order room |
| `join-user` | `userId` | Subscribe to user order notifications |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `order-created` | Order object | New order placed |
| `order-status-updated` | Order object | Order status changed |
| `joined-order` | `{ orderId, message }` | Subscription confirmed |

---

## Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Response Format
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... },
  "pagination": { "page": 1, "limit": 10, "total": 50, "pages": 5 }
}
```

---

## Setup

```bash
cd server
cp .env.example .env
# Fill in environment variables
npm install
npm run dev
```

## Creating an Admin User

Register normally, then update role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```
