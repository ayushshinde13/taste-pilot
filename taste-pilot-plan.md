# 🍽️ Taste Pilot — Project Plan & Architecture

> A high-performance food delivery platform (similar to Swiggy/Zomato) featuring real-time order tracking, AI-powered meal planning via Google Gemini, coupon integration, and comprehensive admin analytics.

---

## 📐 Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | Next.js (v16.2.6) | React 19, TypeScript, App Router architecture |
| **Styling & UI** | Tailwind CSS (v4.2.0) + PostCSS | Base UI primitives, Framer Motion animations, Lucide Icons |
| **State Management** | React Context API | Lightweight context providers for Authentication and Cart state |
| **Backend API** | Node.js + Express.js | Modern ES Modules (`import`/`export`) structure |
| **Database** | MongoDB + Mongoose | Schema validation, indices, relationships, and custom queries |
| **Real-time Communications** | Socket.IO (v4) | Real-time order tracking rooms and instant notification streams |
| **Payment Gateway** | Razorpay | Orders verification, signature validation, and secure checkout integration |
| **AI Meal Planner** | Google Gemini API | Meal suggestions matching occasions and budgets via `gemini-2.5-flash` |
| **Request Validation** | Express Validator | Middleware validation for request bodies, query params, and parameters |
| **End-to-End Testing** | Playwright | Full integration and E2E regression tests |

---

## 🗂️ Project Folder Structure

### Root Directory
```
taste-pilot/
├── client/                           # Frontend application (Next.js)
├── server/                           # Backend application (Express & Node)
├── README.md                         # Detailed project description and setup guide
└── taste-pilot-plan.md               # Project architecture and implementation plan
```

### Frontend (`client/`)
```
client/
├── app/                              # Next.js App Router (pages & layouts)
│   ├── about/                        # About page
│   ├── admin/                        # Admin Dashboard page
│   ├── auth/                         # Authentication pages
│   │   ├── login/                    # Login page
│   │   └── register/                 # Registration page
│   ├── blog/                         # Blog pages
│   ├── careers/                      # Careers page
│   ├── cart/                         # Cart page
│   ├── contact/                      # Contact support page
│   ├── help-center/                  # Help Center pages
│   ├── meal-planner/                 # AI Meal Planner view
│   │   ├── page.tsx                  # Page route
│   │   ├── layout.tsx                # Page layout wrapper
│   │   └── MealPlannerClient.tsx     # Client controller & UI component
│   ├── orders/                       # Order history and tracking pages
│   │   ├── page.tsx                  # Order history list
│   │   └── [id]/                     # Real-time Order Tracking detail page
│   ├── press/                        # Press releases page
│   ├── privacy-policy/               # Privacy policy page
│   ├── profile/                      # User profile settings dashboard
│   ├── restaurant/                   # Restaurant Details pages
│   │   └── [id]/                     # Detailed menu & reviews page
│   ├── restaurants/                  # Search, filter & discover restaurants
│   │   ├── page.tsx                  # Discover restaurants entry route
│   │   ├── loading.tsx               # Skeleton loading view
│   │   └── RestaurantsClient.tsx     # Restaurants discovery page controller
│   ├── terms/                        # Terms of service page
│   ├── wishlist/                     # Saved/favorite restaurants listing
│   ├── globals.css                   # Global styling containing Tailwind setup
│   ├── layout.tsx                    # Top-level Root Layout
│   └── page.tsx                      # Landing Home page
├── components/                       # Shared React Components
│   ├── ui/                           # Base design tokens
│   │   └── button.tsx                # Reusable shadcn/ui-styled button component
│   ├── ClientProviders.tsx           # Context wrapper component for Next.js
│   ├── GoogleSelectorModal.tsx       # Selection modal for simulation and checkout modes
│   ├── categories.tsx                # Food category listing component
│   ├── category-nav.tsx              # Quick category sub-navigation
│   ├── features.tsx                  # Landing page value-prop cards
│   ├── food-card.tsx                 # Restaurant menu item card
│   ├── footer.tsx                    # Shared page footer component
│   ├── hero.tsx                      # Dynamic landing hero section
│   ├── menu-search.tsx               # Menu items search query engine
│   ├── navbar.tsx                    # Main navigation bar (responsive layout)
│   ├── order-statistics.tsx          # Statistics analytics for orders
│   ├── profile-info.tsx              # Account profile updates form
│   ├── profile-sidebar.tsx           # Quick navigation sidebar for profile settings
│   ├── recent-orders.tsx             # List of recent order snapshots
│   ├── restaurant-card.tsx           # Main restaurant card preview
│   ├── restaurant-filters.tsx        # Veg/Rating/Delivery-Fee filter component
│   ├── restaurant-skeleton.tsx       # Loading skeleton placeholders
│   ├── restaurants.tsx               # Grid listing for restaurants
│   ├── saved-addresses.tsx           # Address management component
│   └── sticky-cart.tsx               # Float cart pill for easy checkout
├── context/                          # State Management Contexts
│   ├── AuthContext.tsx               # User logins, session, and role state
│   └── CartContext.tsx               # Shopping cart items, counts, and pricing
├── lib/                              # Client-side utility functions
│   ├── auth.ts                       # Authenticated fetch handler (`apiCall`)
│   ├── foodImages.ts                 # Map dish names to local/remote avif assets
│   ├── mock-menu-data.ts             # Temporary fallback menu details
│   └── utils.ts                      # Client helper functions (e.g. cn class merger)
├── public/                           # Static assets, fonts, and icons
├── tests/                            # Playwright automated test scripts
│   ├── all-categories-search.spec.ts # Tests category searching and selections
│   ├── full-user-flow.spec.ts        # E2E main checkout flow (simulated and Razorpay)
│   ├── restaurant-rendering.spec.ts  # Verifies restaurant cards render correctly
│   └── restaurant-search.spec.ts     # Tests restaurant query filter fields
├── components.json                   # shadcn/ui components configuration file
├── playwright.config.ts              # Playwright E2E testing framework configurations
├── postcss.config.mjs                # PostCSS styling configurations
├── next.config.mjs                   # Next.js configurations
├── package.json                      # Frontend library metadata and scripts
└── tsconfig.json                     # TypeScript configurations
```

### Backend (`server/`)
```
server/
├── config/                           # Database & infrastructure setup
│   ├── db.js                         # Mongoose MongoDB connection builder
│   └── razorpay.js                   # Razorpay payment gateway API client
├── controllers/                      # Request handling & controller logic
│   ├── adminController.js            # Platform dashboard analytics & admin configs
│   ├── aiController.js               # Gemini Meal Planner controller
│   ├── authController.js             # User login, registration, & profiles
│   ├── categoryController.js         # Food categories lists & categories CRUD
│   ├── couponController.js           # Discount coupons configurations & checks
│   ├── menuController.js             # Restaurant menu item operations
│   ├── orderController.js            # Order previews, placements, and history
│   ├── paymentController.js          # Razorpay orders and validation hooks
│   ├── restaurantController.js       # Restaurant listings, filters, and details
│   ├── reviewController.js           # User reviews and restaurant average ratings
│   ├── trendingFoodController.js     # Top-trending items calculations
│   └── wishlistController.js         # Favorite restaurant listings
├── data/                             # Initial JSON files for database seeding
│   ├── categories.json
│   ├── coupons.json
│   ├── menu-items.json
│   ├── restaurants.json
│   ├── reviews.json
│   └── trending-foods.json
├── middleware/                       # Global & route-specific middleware
│   ├── adminMiddleware.js            # Admin privilege validator
│   ├── authMiddleware.js             # JWT verification and route guard
│   ├── errorHandler.js               # Universal API error formatter
│   └── validateMiddleware.js         # Express Validator formatting collector
├── models/                           # MongoDB Schemas & Mongoose Models
│   ├── Category.js
│   ├── Coupon.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Restaurant.js
│   ├── Review.js
│   ├── TrendingFood.js
│   ├── User.js
│   └── Wishlist.js
├── routes/                           # Router configurations
│   ├── adminRoutes.js
│   ├── aiRoutes.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── couponRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── restaurantRoutes.js
│   ├── reviewRoutes.js
│   ├── trendingFoodRoutes.js
│   └── wishlistRoutes.js
├── services/                         # Business logic services
│   ├── analyticsService.js           # Analytics dashboard reports builder
│   ├── geminiService.js              # Gemini-based occasion & budget planner
│   ├── orderService.js               # Order placement & database actions
│   ├── paymentService.js             # Razorpay signature check service
│   └── reviewService.js              # Average rating calculations helper
├── socket/                           # WebSockets handlers
│   └── orderSocket.js                # Socket.IO order room listeners
├── utils/                            # Shared utilities
│   ├── ApiError.js                   # Structured error subclass
│   ├── asyncHandler.js               # Express route controller async try-catch wrapper
│   └── generateToken.js              # JWT signer
├── validations/                      # Request body checks (Express Validator)
│   ├── aiValidation.js
│   ├── authValidation.js
│   ├── categoryValidation.js
│   ├── couponValidation.js
│   ├── menuValidation.js
│   ├── orderValidation.js
│   ├── paymentValidation.js
│   ├── restaurantValidation.js
│   ├── reviewValidation.js
│   └── trendingFoodValidation.js
├── scripts/                          # DB maintenance & diagnostic tasks
│   ├── generate-dataset.js           # Seeding dataset simulation generators
│   ├── simulate-order.js             # WebSocket status tracking simulator
│   └── test-db.js                    # Simple DB ping verify
├── public/                           # Static assets containing dish image files (.avif)
├── .env.example                      # Server environment template variables
├── nodemon.json                      # Nodemon development auto-restart configurations
├── postman_collection.json           # Postman API tests configuration collection
├── seed.js                           # Main database seeder script
├── index.js                          # Express app entry & server starter
├── package.json                      # Node project configuration
└── API_DOCUMENTATION.md              # Backend routes specification manual
```

---

## 🗃️ MongoDB Data Models

### User Schema (`models/User.js`)
* Manages user registration, profiles, active logins, and saved locations.
```js
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '/avatars/male_1.png' },
  phone: { type: String, default: '' },
  dob: { type: Date },
  addresses: [{
    label: { type: String, default: 'Home' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    locality: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
  }]
}
```

### Restaurant Schema (`models/Restaurant.js`)
* Stores restaurant attributes, geo-coordinates, cuisine tags, and aggregate ratings.
```js
{
  name: { type: String, required: true },
  description: { type: String, required: true },
  cuisine: [{ type: String, enum: ['Biryani', 'Beverages', 'Desserts', 'Momos', 'Pizza', 'Burger', 'Chinese', 'Rice', 'North Indian', 'South Indian', 'veg', 'Fast Food'] }],
  image: { type: String, default: '/images/default-restaurant.jpg' },
  bannerImage: { type: String, default: '/images/default-restaurant.jpg' },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  city: { type: String, required: true },
  locality: { type: String, required: true },
  pincode: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  serviceRadiusKm: { type: Number, default: 5 },
  isVeg: { type: Boolean, default: false },
  isPureVeg: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  deliveryTime: { type: Number, default: 30 },
  deliveryFee: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  openingHours: [{
    day: { type: String, required: true },
    open: { type: String, required: true },
    close: { type: String, required: true },
    isClosed: { type: Boolean, default: false }
  }]
}
```

### MenuItem Schema (`models/MenuItem.js`)
* Menu items containing comprehensive health, dietary, and popularity scores.
```js
{
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  image: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: false },
  orderCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  preparationTime: { type: Number, default: 15 },
  spicyLevel: { type: Number, default: 0 },
  dietaryType: { type: [String], default: ['Vegetarian'] },
  mealType: { type: String, default: 'Anytime' },
  proteinLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  healthScore: { type: Number, default: 50 },
  cuisineType: { type: String, default: '' },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  ingredients: { type: [String], default: [] },
  allergens: { type: [String], default: [] },
  popularityScore: { type: Number, default: 0 }
}
```

### Order Schema (`models/Order.js`)
* Stores purchase item lists, calculated taxes, coupon applications, and fulfillment stages.
```js
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  discountAmount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Placed' },
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  notes: { type: String }
}
```

### Review Schema (`models/Review.js`)
* User ratings and comments per restaurant.
```js
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}
```

### Payment Schema (`models/Payment.js`)
* Details of payment verification.
```js
{
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['Created', 'Captured', 'Failed'], default: 'Created' },
  paymentMethod: { type: String }
}
```

---

## 🔌 API Endpoints

### 🔑 Authentication
```
POST /api/auth/register    # Register a new user
POST /api/auth/login       # Login a user
GET  /api/auth/me          # Retrieve authenticated profile (Requires Auth)
```

### 🏪 Restaurants
```
GET  /api/restaurants               # Search, filter, page listings
GET  /api/restaurants/:id           # Restaurant detailed profile + menu
GET  /api/restaurants/:id/menu      # Menu listing filtered by veg/trending
```

### 🍽️ Menu Operations
```
GET  /api/menu/trending             # Retrieve popular dishes
GET  /api/menu/restaurant/:resId    # Detailed items listing
```

### 🛒 Cart & Orders (Requires Auth)
```
POST /api/orders/preview            # Preview tax, fee calculations and apply coupon
POST /api/orders                    # Create a new order
GET  /api/orders/my                 # List order history
GET  /api/orders/:id                # Specific order details & tracker
PUT  /api/orders/:id/cancel         # Cancel order (if not yet dispatched)
```

### 💳 Payments (Razorpay) (Requires Auth)
```
POST /api/payment/create-order      # Create Razorpay order transaction
POST /api/payment/verify            # Confirm signature verification hash
```

### 💬 Reviews & Ratings
```
GET  /api/reviews/:restaurantId     # Retrieve reviews for a restaurant
POST /api/reviews/:restaurantId     # Post a rating + review (Requires Auth)
```

### 🤖 AI Meal Planner (Requires Auth)
```
POST /api/ai/meal-planner           # Generate Gemini-structured occasion meals
```

### 🏷️ Categories & Coupons
```
GET  /api/categories                # Retrieve available food classifications
GET  /api/coupons                   # Retrieve active discount coupons
```

### 🏢 Wishlist (Requires Auth)
```
GET  /api/wishlist                  # Fetch user favorited restaurants
POST /api/wishlist                  # Add/Remove restaurant from wishlist
```

### 🛡️ Admin Dashboard Operations (Requires Admin Role)
```
GET    /api/admin/analytics         # Fetch total users, sales, and order stats
GET    /api/admin/restaurants       # Listing of all active/inactive restaurants
POST   /api/admin/restaurants       # Register restaurant (with image config)
PUT    /api/admin/restaurants/:id   # Edit restaurant details
DELETE /api/admin/restaurants/:id   # Soft delete/deactivate restaurant
POST   /api/admin/menu              # Add item to a restaurant menu
PUT    /api/admin/menu/:id          # Update item availability/pricing
DELETE /api/admin/menu/:id          # Remove menu item
GET    /api/admin/orders            # Fetch orders placed on the platform
PUT    /api/admin/orders/:id/status # Update order status state
```

---

## ⚡ Socket.IO Event Map

| Event Name | Sender | Recipient | Payload | Purpose |
|---|---|---|---|---|
| `join-order` | Client | Server | `orderId` | Subscribes client to specific order updates room |
| `leave-order` | Client | Server | `orderId` | Unsubscribes client from specific order room |
| `join-user` | Client | Server | `userId` | Subscribes user to generic notifications room |
| `order-created` | Server | Client | `Order object` | Emitted when order registration completes |
| `order-status-updated` | Server | Client | `Order object` | Live updates client on status stepper stage changes |
| `joined-order` | Server | Client | `{ orderId, message }` | Confirms WebSocket room subscription success |

---

## ✅ Implementation Status & Checklist

### 1. Foundation & Authentication
- [x] Configure Express backend + MongoDB database link
- [x] Configure TypeScript Next.js layout configuration & routing
- [x] Establish backend schema models (`User`, `Restaurant`, `MenuItem`)
- [x] Implement JWT token-based cookies/header verification middleware
- [x] Build front-end Login, Registration, and authenticated route guards
- [x] Implement global Toast notification handlers and error display wrappers

### 2. Customer Discovery & Search
- [x] Implement restaurants index page with text indices search features
- [x] Set up vegetarian toggling, delivery-fees, and rating score filters
- [x] Implement detailed restaurant view with categories grouped menu cards
- [x] Set up React Context cart state (persisting selections in `localStorage`)
- [x] Implement Add/Remove items, quantity updates, and cart item validation

### 3. Orders & Payments Integration
- [x] Implement checkout page containing dynamic address selectors
- [x] Build order preview route checking active discount coupons codes
- [x] Implement Razorpay Checkout integrations for Indian currency transactions
- [x] Build backend verification API verifying signature hashes
- [x] Implement wishlist support to favorite/unfavorite restaurants
- [x] Implement reviews and star rating submission handlers

### 4. AI Features (Google Gemini)
- [x] Build backend `geminiService` loading local menu contexts
- [x] Formulate meal recommendation prompting structures for occasion/budget limits
- [x] Implement fallback logic trying lighter models (`gemini-2.5-flash` / `gemini-2.0-flash`)
- [x] Build frontend Meal Planner interface with direct Add to Cart inputs

### 5. Live Tracking & Administration
- [x] Implement Socket.IO configurations updating order status live
- [x] Build live order tracking stepper page visually representing delivery status
- [x] Integrate background script `simulate-order.js` to simulate steps for testing
- [x] Build basic Admin Dashboard overview page layout
- [x] Build backend admin analytics aggregator counting sales, users, and top orders
- [x] Configure Playwright E2E suites for validation of ordering flows
