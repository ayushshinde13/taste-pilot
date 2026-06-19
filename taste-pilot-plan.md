# 🍽️ Taste Pilot — Full Project Plan
> A feature-rich Swiggy clone with AI capabilities, admin dashboard, and real-time order tracking.

---

## 📐 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Payment | Razorpay |
| AI Features | Anthropic Claude API |
| State Management | Redux Toolkit |
| Real-time | Socket.IO (order tracking) |
| File Uploads | Cloudinary / Multer |

---

## 🗂️ Project Folder Structure

```
taste-pilot/
├── client/                          # React Frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Loader.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── StarRating.jsx
│       │   ├── restaurant/
│       │   │   ├── RestaurantCard.jsx
│       │   │   ├── RestaurantList.jsx
│       │   │   ├── MenuCategory.jsx
│       │   │   ├── MenuItem.jsx
│       │   │   └── ReviewCard.jsx
│       │   ├── cart/
│       │   │   ├── CartItem.jsx
│       │   │   └── CartSummary.jsx
│       │   ├── order/
│       │   │   ├── OrderCard.jsx
│       │   │   └── OrderTracker.jsx
│       │   ├── ai/
│       │   │   ├── FoodConcierge.jsx
│       │   │   └── MealPlanner.jsx
│       │   └── admin/
│       │       ├── RestaurantForm.jsx
│       │       ├── MenuItemForm.jsx
│       │       ├── OrderTable.jsx
│       │       └── AnalyticsCard.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── RestaurantDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── PaymentSuccess.jsx
│       │   ├── PaymentFailure.jsx
│       │   ├── OrderHistory.jsx
│       │   ├── OrderTracking.jsx
│       │   └── admin/
│       │       ├── Dashboard.jsx
│       │       ├── ManageRestaurants.jsx
│       │       ├── ManageMenuItems.jsx
│       │       └── ManageOrders.jsx
│       ├── redux/
│       │   ├── store.js
│       │   └── slices/
│       │       ├── authSlice.js
│       │       ├── cartSlice.js
│       │       ├── restaurantSlice.js
│       │       └── orderSlice.js
│       ├── services/
│       │   ├── api.js                # Axios instance
│       │   ├── authService.js
│       │   ├── restaurantService.js
│       │   ├── orderService.js
│       │   └── aiService.js
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useCart.js
│       │   └── useSocket.js
│       ├── utils/
│       │   ├── formatCurrency.js
│       │   └── validateForm.js
│       ├── App.jsx
│       └── main.jsx
│
├── server/                          # Express Backend
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   ├── adminController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── adminRoutes.js
│   │   └── aiRoutes.js
│   ├── socket/
│   │   └── orderSocket.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .env.example
│   └── index.js
│
├── .gitignore
└── README.md
```

---

## 🗃️ MongoDB Data Models

### User
```js
{ name, email, password (hashed), role: ['user','admin'], address[], createdAt }
```

### Restaurant
```js
{ name, description, cuisine[], image, address, isVeg, rating (avg), reviewCount,
  isActive, openingHours, createdAt }
```

### MenuItem
```js
{ restaurant (ref), name, description, price, category, image,
  isVeg, isAvailable, isTrending }
```

### Order
```js
{ user (ref), restaurant (ref), items[{ menuItem, name, price, quantity }],
  totalAmount, status: ['Placed','Preparing','Out for Delivery','Delivered','Cancelled'],
  paymentId, paymentStatus, deliveryAddress, createdAt }
```

### Review
```js
{ user (ref), restaurant (ref), rating (1-5), comment, createdAt }
```

### Payment
```js
{ order (ref), user (ref), razorpayOrderId, razorpayPaymentId, amount, status, createdAt }
```

---

## 🔌 REST API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Restaurants
```
GET    /api/restaurants              # List + search + filter
GET    /api/restaurants/:id          # Details + menu
GET    /api/restaurants/:id/menu     # Menu items
```

### Cart (client-side Redux, no server needed)

### Orders
```
POST   /api/orders                   # Place order
GET    /api/orders/my                # Order history
GET    /api/orders/:id               # Order detail + status
```

### Payments
```
POST   /api/payment/create-order     # Razorpay order
POST   /api/payment/verify           # Verify signature
```

### Reviews
```
POST   /api/reviews/:restaurantId    # Post review
GET    /api/reviews/:restaurantId    # Get reviews
```

### AI
```
POST   /api/ai/concierge             # Food concierge (budget + preference)
POST   /api/ai/meal-planner          # Meal plan generator
```

### Admin
```
GET    /api/admin/restaurants        # List all
POST   /api/admin/restaurants        # Add restaurant
PUT    /api/admin/restaurants/:id    # Edit restaurant
DELETE /api/admin/restaurants/:id    # Delete restaurant

POST   /api/admin/menu              # Add menu item
PUT    /api/admin/menu/:id          # Edit menu item
DELETE /api/admin/menu/:id          # Delete menu item

GET    /api/admin/orders            # All orders
PUT    /api/admin/orders/:id/status # Update order status

GET    /api/admin/analytics         # Users, orders, revenue, trending
```

---

## 🚀 Development Phases

---

## Phase 1 — Foundation & Auth (Week 1–2)

**Goal:** Project setup, authentication, and base UI.

### Backend Tasks
- [ ] Initialize Express server with MongoDB connection
- [ ] Create `User` model with bcrypt password hashing
- [ ] Build `authController` — register, login, getMe
- [ ] JWT token generation + `authMiddleware`
- [ ] Error handler middleware

### Frontend Tasks
- [ ] Scaffold React app with Vite + Tailwind
- [ ] Setup Redux store with `authSlice`
- [ ] Build `Register.jsx` and `Login.jsx` pages
- [ ] Axios service with JWT interceptor (`api.js`)
- [ ] `ProtectedRoute.jsx` and `adminMiddleware` wrapper
- [ ] `Navbar.jsx` with login/logout state
- [ ] `.env` setup for both client and server

### Deliverables
```
✅ User can register, login, and access protected routes
✅ JWT stored in localStorage / httpOnly cookie
✅ Role-based route guard (user vs admin)
```

---

## Phase 2 — Core User Features (Week 3–5)

**Goal:** Restaurant discovery, menu, cart, checkout, and payment.

### Backend Tasks
- [ ] `Restaurant` + `MenuItem` models
- [ ] Restaurant CRUD routes (admin-protected)
- [ ] Menu item routes with veg/non-veg filter
- [ ] Search restaurants by name/cuisine (MongoDB text index)
- [ ] `Order` model + `orderController` (place, list, detail)
- [ ] Razorpay integration — create order + verify payment
- [ ] `Review` model + `reviewController` — post & fetch
- [ ] Auto-update restaurant avg rating on review submit

### Frontend Tasks
- [ ] `Home.jsx` — restaurant listing with search bar
- [ ] `RestaurantCard.jsx` with rating badge
- [ ] `RestaurantDetail.jsx` — menu grouped by category
- [ ] Veg/Non-Veg toggle filter on menu
- [ ] Redux `cartSlice` — add, update quantity, remove, clear
- [ ] `Cart.jsx` — cart items + summary + proceed to checkout
- [ ] `Checkout.jsx` — address input + order summary
- [ ] Razorpay payment button integration
- [ ] `PaymentSuccess.jsx` / `PaymentFailure.jsx`
- [ ] `OrderHistory.jsx` — list of past orders
- [ ] `OrderTracking.jsx` — status stepper UI
- [ ] `ReviewCard.jsx` + star rating submit form

### Socket.IO (Order Tracking)
- [ ] Server emits `order-status-update` on status change
- [ ] Client subscribes per `orderId` and updates UI live

### Deliverables
```
✅ User can browse, search, filter restaurants
✅ Add items to cart, checkout, pay via Razorpay
✅ View order history and live order status
✅ Rate and review restaurants
```

---

## Phase 3 — AI Features (Week 6)

**Goal:** Integrate Claude AI for smart food suggestions and meal planning.

### AI Feature 1 — Food Concierge
- User inputs: budget (₹), dietary preference (veg/non-veg), cuisine mood
- Claude suggests matching dishes from the platform
- Backend: `POST /api/ai/concierge` calls Anthropic API with context
- Frontend: `FoodConcierge.jsx` — chat-style UI with suggestions linking to restaurants

### AI Feature 2 — Meal Planner
- User inputs: occasion ("dinner for 2"), budget (₹500), dietary type
- Claude generates a complete meal combination (starter + main + dessert)
- Each suggested item maps to available menu items
- Frontend: `MealPlanner.jsx` — structured card output with "Add all to cart" button

### Backend Tasks
- [ ] `aiController.js` — prompt engineering for both features
- [ ] Pass available restaurants + menu as context to Claude
- [ ] Rate limit AI endpoints (e.g., 5 requests/min per user)

### Frontend Tasks
- [ ] `FoodConcierge.jsx` — budget + preference form → AI response
- [ ] `MealPlanner.jsx` — occasion form → meal combo output
- [ ] AI pages linked from Navbar under "Explore AI"

### Deliverables
```
✅ AI Food Concierge returns personalized dish suggestions
✅ AI Meal Planner builds a full meal combo within budget
✅ Suggestions clickable — link directly to restaurant/menu
```

---

## Phase 4 — Admin Dashboard & Polish (Week 7–8)

**Goal:** Full admin control, analytics, and production-ready polish.

### Admin Dashboard Tasks

#### Restaurant & Menu Management
- [ ] `ManageRestaurants.jsx` — table with add/edit/delete + image upload
- [ ] `ManageMenuItems.jsx` — scoped to selected restaurant
- [ ] `RestaurantForm.jsx` + `MenuItemForm.jsx` with validation
- [ ] Cloudinary image upload for restaurant and menu images

#### Order Management
- [ ] `ManageOrders.jsx` — all orders table with filters (date, status)
- [ ] Status dropdown per order → PATCH to `/api/admin/orders/:id/status`
- [ ] Socket emit on status change → triggers live update on user side

#### Analytics Dashboard
- [ ] `Dashboard.jsx` with cards: Total Users, Total Orders, Total Revenue
- [ ] Trending Foods — top 5 most ordered menu items
- [ ] Revenue chart (daily/weekly) using Recharts
- [ ] Recent orders table

### Final Polish Tasks
- [ ] Loading skeletons on restaurant listing + detail pages
- [ ] Toast notifications (react-hot-toast) for cart, order, errors
- [ ] Empty states for cart, order history, search results
- [ ] Mobile responsive layout (Tailwind breakpoints)
- [ ] Form validation (client + server)
- [ ] 404 page
- [ ] README with setup instructions

### Deliverables
```
✅ Admin can manage restaurants, menus, and orders
✅ Analytics with live data and trending food tracking
✅ Production-ready UI with responsive design and error handling
```

---

## 📦 Environment Variables

### Server `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

ANTHROPIC_API_KEY=sk-ant-...
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 📅 Timeline Summary

| Phase | Focus | Duration |
|---|---|---|
| Phase 1 | Foundation, Auth, Project Setup | Day- 1-2 |
| Phase 2 | Restaurant, Cart, Payment, Orders, Reviews | Day- 2–3 |
| Phase 3 | AI Food Concierge + AI Meal Planner | Day- 3-4  |
| Phase 4 | Admin Dashboard, Analytics, Polish | Day- 4-5 |

**Total Estimated Duration: 8 Weeks**

---

## ✅ Feature Completion Checklist

### User
- [ ] Register / Login / JWT Auth
- [ ] Restaurant Listing + Search
- [ ] Restaurant Detail + Menu
- [ ] Veg / Non-Veg Filter
- [ ] Cart (Add / Update / Remove)
- [ ] Checkout + Razorpay Payment
- [ ] Order History + Status Tracking
- [ ] Ratings & Reviews

### AI
- [ ] AI Food Concierge (budget + preference)
- [ ] AI Meal Planner (occasion + budget)

### Admin
- [ ] Manage Restaurants (CRUD)
- [ ] Manage Menu Items (CRUD)
- [ ] View & Update Orders
- [ ] Analytics Dashboard (Users, Orders, Revenue)
- [ ] Trending Foods

---

