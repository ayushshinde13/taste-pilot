# 🍽️ Taste Pilot — High-Performance Food Delivery Platform

Taste Pilot is a feature-rich, high-performance food delivery platform designed to emulate real-world systems like Swiggy and Zomato. It features real-time order tracking via WebSockets, AI-powered meal planning using Google Gemini, secure online checkout via Razorpay, a comprehensive admin analytics dashboard, and dynamic rating systems.

🔗 **Live Hosted Project:** [taste-pilot-blond.vercel.app](https://taste-pilot-blond.vercel.app)

---

## ✨ Key Features

* **⚡ Real-Time Order Tracking**: Bi-directional status updates (Placed $\rightarrow$ Preparing $\rightarrow$ Out for Delivery $\rightarrow$ Delivered) using Socket.IO, with an interactive visual stepper.
* **🤖 AI Meal Planner**: Leverages the Google Gemini API (`gemini-2.5-flash`) to generate structured meal suggestions customized by occasion, health metrics, and budget limits. Suggestions can be added directly to the cart in one click.
* **💳 Secure Checkout (Razorpay)**: End-to-end payment creation, client checkout widget integration, and local server-side cryptographic signature verification (HMAC-SHA256). Features a checkout simulator mode for easy sandbox testing.
* **🔍 Search & Filter Discovery**: Fast queries supported by database text indices for restaurants and cuisines, with veggie toggling, rating scores, and free-delivery filters.
* **📊 Admin Analytics Dashboard**: Aggregates business-critical stats (total sales, users, orders) and supports CRUD management for restaurants, menus, and item availability.
* **👤 User Profile & Address Manager**: Supports profiles updates, saved address configurations (Home/Work), and past order history.
* **🔒 Password Recovery (OTP)**: Secure, verified password resets using dynamic 6-digit OTP codes.

---

## 📐 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | Next.js (v16.2.6) | React 19, TypeScript, App Router, Turbopack |
| **Styling** | Tailwind CSS v4 + PostCSS | Base design tokens, Lucide Icons, Framer Motion animations |
| **Backend** | Node.js + Express.js | Modern ES Modules import/export structure, Express Rate Limiter |
| **Database** | MongoDB + Mongoose ODM | Flexible schemas, compound indexing, population relations |
| **Real-time** | Socket.IO (v4) | WebSocket persistent rooms and event-driven updates |
| **Payments** | Razorpay SDK | Transactions order management and secure hashing |
| **AI Integration** | Google Gen AI SDK | Contextual prompting with model fallbacks |
| **E2E Testing** | Playwright | Full integration user-journey automated test suites |

---

## 📁 Project Structure

```
taste-pilot/
├── client/                     # Next.js Frontend Client
│   ├── app/                    # Pages, layouts, and app routing routes
│   │   ├── auth/               # Login & Register views (with password reset modal)
│   │   ├── cart/               # Checkout basket and payment modes modal
│   │   ├── orders/             # Order tracker with Live WebSockets stepper
│   │   └── meal-planner/       # Gemini AI meal planner interface
│   ├── components/             # Reusable global React components (Navbar, Sidebar)
│   ├── context/                # React Context providers (AuthContext, CartContext)
│   ├── lib/                    # Authentication helpers & API request wrappers
│   └── tests/                  # Playwright E2E test suites
└── server/                     # Node.js Express Backend API
    ├── config/                 # MongoDB Mongoose & Razorpay SDK configs
    ├── controllers/            # Endpoint handlers (auth, payment, orders, admin)
    ├── middleware/             # JWT protect, validators, and error handlers
    ├── models/                 # Mongoose Database schemas
    ├── routes/                 # Express router mapping
    ├── socket/                 # Socket.IO connection event room mappings
    └── validations/            # Request body schemas constraints checking
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
* [Node.js](https://nodejs.org) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) running locally or an Atlas URI

### 1. Database & Server Setup
Navigate to the `server/` directory and configure environment variables:
```bash
cd server
cp .env.example .env
```
Update `.env` with your parameters:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taste-pilot
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Install dependencies, seed the database, and start the development server:
```bash
npm install
npm run seed        # Seeds initial restaurants, categories, and menus
npm run dev         # Launches server on http://localhost:5000
```

### 2. Client Setup
Navigate to the `client/` directory and configure client variables:
```bash
cd ../client
```
Check/create a `.env.local` file:
```env
PORT=5173
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Install dependencies and start the development server:
```bash
npm install
npm run dev         # Launches client on http://localhost:5173
```

### 3. Run Automated E2E Tests
To run Playwright integration tests locally (ensure client builds, and both client and server are running):
```bash
# Build the production bundle
npm run build

# Start Next.js on port 3000
npm run start

# In a new terminal, run Playwright E2E tests
npx playwright test tests/full-user-flow.spec.ts
```

---

## ⚡ Socket.IO Connection Event Map

| Event Name | Sender | Recipient | Payload | Purpose |
|---|---|---|---|---|
| `join-order` | Client | Server | `orderId` | Subscribes client to specific order updates room |
| `leave-order` | Client | Server | `orderId` | Unsubscribes client from specific order room |
| `order-status-updated` | Server | Client | `Order object` | Live updates client on status stepper stage changes |
| `joined-order` | Server | Client | `{ orderId, message }` | Confirms WebSocket room subscription success |
