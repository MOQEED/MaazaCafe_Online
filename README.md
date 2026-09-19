# ☕ Maaza Cafe — Online Restaurant & Food Ordering System

> An authentic, full-stack online food ordering and restaurant management platform for **Maaza Cafe**, crafted with **Django REST Framework** (Backend) and **React + Vite** (Frontend).

![Maaza Cafe Logo](frontend/public/maaza-cafe-logo.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Food Categories & Menu](#-food-categories--menu)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Default Demo Credentials](#-default-demo-credentials)
- [Local Installation & Setup Guide](#-local-installation--setup-guide)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Backend Setup (Django REST Framework)](#2-backend-setup-django-rest-framework)
  - [3. Frontend Setup (React + Vite)](#3-frontend-setup-react--vite)
- [Testing the Entire Lifecycle](#-testing-the-entire-lifecycle)
- [100% Free Production Deployment Guide](#-100-free-production-deployment-guide)
  - [Deploy Backend to Render.com](#step-a-deploy-backend-to-rendercom-free)
  - [Deploy Frontend to Vercel](#step-b-deploy-frontend-to-vercel-free)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌟 Overview

**Maaza Cafe** is a full-featured e-commerce platform converted into a modern restaurant web application. It delivers a rich, responsive dining and ordering experience:
- **For Food Lovers (Customers):** Browse an appetizing menu across 9 categories, search dishes, filter by dietary preferences and ratings, customize quantities, add items to a persistent cart, checkout with Cash on Delivery (COD) or Card, and track order histories.
- **For Restaurant Owners & Chefs (Sellers):** Manage dish inventory, add new delicacies with custom photos and categories, mark Chef's Specials (Prime Deals), review sales analytics, and manage live customer orders from preparation to dispatch.

---

## 🍽️ Key Features

### 1. Customer Experience
- **Interactive Menu:** 9 curated categories covering traditional and contemporary culinary specialties.
- **Live Search & Filters:** Instant search by dish title or ingredient; filter by category, star ratings (4★ & up, etc.), and price sorting (Low to High, High to Low).
- **Today's Chef Specials & Prime Deals:** Exclusive discounted delicacies prominently highlighted on a dedicated promotional banner.
- **Detailed Dish Pages:** High-resolution food photography, ingredient descriptions, ratings, review counts, and live quantity counters.
- **Persistent Cart:** Fully synchronized with backend database via REST API.
- **Checkout Flow:** Seamless address input, payment method selection (Cash on Delivery or Card), and immediate order generation.
- **Order History & Tracking:** View placed orders, itemized receipts, delivery status badges, and cancel active orders before dispatch.

### 2. Restaurant Owner / Seller Portal
- **Overview Dashboard:** Live KPI cards tracking Total Revenue, Orders Received, Total Units Sold, Active Dishes, and Pending Dispatches.
- **7-Day Revenue Trends:** Automated daily earnings chart.
- **Dish Management (CRUD):**
  - Add new dishes with name, kitchen brand, category, price, image URL, rating, availability status, and description.
  - Edit existing dish prices, details, and stock availability.
  - Delete dishes safely with cascading integrity.
- **Order Fulfillment:** Real-time customer orders feed displaying customer name, contact phone, delivery address, ordered items, and order totals.
- **Status Progression:** Move customer order items through fulfillment stages: `Placed` → `Shipped` → `Delivered`.

---

## 🛠️ Tech Stack

### Frontend
- **Library/Framework:** React (Vite-powered SPA)
- **Routing:** React Router v7
- **Styling:** Vanilla CSS3 (Custom Design System with warm culinary palette: `#c2410c`, `#7c2d12`, `#fff7ed`, `#16a34a`)
- **Typography:** Google Fonts (*Outfit*, *Roboto*, *Open Sans*)
- **Icons & Loaders:** React Icons (`react-icons/bs`), React Spinners (`react-spinners/BeatLoader`)
- **State & Storage:** React Context API (`CartContext`, `UserContext`), Cookies (`js-cookie`)

### Backend
- **Framework:** Python 3, Django 5.x
- **API Engine:** Django REST Framework (DRF)
- **Authentication:** JSON Web Tokens (`rest_framework_simplejwt`)
- **Database:** SQLite (Default for local development) / PostgreSQL ready
- **CORS Handling:** `django-cors-headers`
- **Filtering & Search:** `django-filter` + DRF Search & Ordering filters
- **Production WSGI & Static Assets:** `gunicorn`, `whitenoise`

---

## 📁 Project Architecture & Directory Structure

```text
MaazaCafe_Online/
├── backend/
│   ├── manage.py                     # Django CLI utility
│   ├── requirements.txt              # Python dependencies
│   ├── seed_maaza_cafe.py            # Automated 42-dish restaurant database seeder
│   ├── build.sh                      # Production build script for deployment
│   ├── .gitignore                    # Backend gitignore (excludes env/, __pycache__/)
│   ├── db.sqlite3                    # Local SQLite database
│   ├── myproject/                    # Core Django project configuration
│   │   ├── settings.py               # App settings, CORS, Whitenoise, JWT config
│   │   ├── urls.py                   # Master URL routing table
│   │   └── wsgi.py                   # WSGI application entry point
│   ├── users/                        # User authentication app (Customer/Seller)
│   │   ├── models.py                 # Custom User model with user_type
│   │   ├── serializers.py            # Register & Profile serializers
│   │   └── views.py                  # Register, Login, Profile & Logout views
│   ├── products/                     # Food catalog app
│   │   ├── models.py                 # Product model (dishes, prices, images, ratings)
│   │   ├── serializers.py            # ProductSerializer (snake_case + camelCase mirror)
│   │   ├── views.py                  # Public listing, detail, and seller create views
│   │   ├── filters.py                # Category, rating & prime filters
│   │   └── permissions.py            # IsSellerOrReadOnly permission lock
│   ├── cart/                         # Shopping cart app
│   │   ├── models.py                 # Cart & CartItem models
│   │   ├── serializers.py            # Cart serialization
│   │   └── views.py                  # Add to cart, update quantity, delete cart item
│   ├── orders/                       # Customer orders app
│   │   ├── models.py                 # Order, OrderItem, and Address models
│   │   ├── serializers.py            # CreateOrder & OrderDetail serializers
│   │   └── views.py                  # Place order, list orders, cancel order
│   └── seller/                       # Restaurant owner management app
│       ├── serializers.py            # Seller metrics & status serializers
│       ├── views.py                  # Summary KPI view, seller orders & status PATCH
│       └── pagination.py             # Custom pagination for seller tables
│
├── frontend/
│   ├── package.json                  # NPM scripts and dependencies
│   ├── vite.config.js                # Vite build & dev server config (port 3000)
│   ├── vercel.json                   # SPA rewrite rules for Vercel deployment
│   ├── index.html                    # HTML entry point with Maaza Cafe branding & fonts
│   ├── .env                          # Environment variables (VITE_API_BASE_URL)
│   ├── public/                       # Static public assets
│   │   ├── maaza-cafe-logo.svg       # Custom vector logo for Maaza Cafe
│   │   ├── cafe-icon.svg             # Steaming teacup favicon
│   │   ├── empty-cart-cafe.svg       # Empty dining plate graphic
│   │   ├── no-food-found.svg         # "No dishes found" graphic
│   │   ├── chef-specials-banner.svg  # Chef's Specials promotional banner
│   │   └── _redirects                # Netlify SPA routing rules
│   └── src/
│       ├── main.jsx                  # React DOM root
│       ├── App.jsx                   # Central routing & context provider
│       ├── api.js                    # Universal apiFetch wrapper with JWT handling
│       ├── format.js                 # Currency & date formatting helpers
│       ├── context/                  # React Contexts (CartContext, UserContext)
│       └── components/               # Modular UI components
│           ├── Header/               # Top navigation bar with logo, cart count & role links
│           ├── Home/                 # Hero landing page with culinary visuals
│           ├── LoginForm/            # JWT authentication form
│           ├── RegisterForm/         # Customer & Seller signup form
│           ├── Products/             # Main menu container
│           ├── AllProductsSection/   # Food cards grid, filters, and pagination
│           ├── FiltersGroup/         # 9 category chips, search input & rating filters
│           ├── PrimeDealsSection/    # Chef's Specials banner and featured list
│           ├── ProductCard/          # Individual dish card with rating badge & price
│           ├── ProductItemDetails/   # Dish overview, description & Add-to-Cart
│           ├── Cart/                 # Cart list view or empty plate view
│           ├── CartSummary/          # Total bill summary and Proceed to Checkout
│           ├── Checkout/             # Address form & payment options (COD/Card)
│           ├── MyOrders/             # Customer order history
│           ├── OrderDetails/         # Order receipt & cancellation button
│           ├── SellerLayout/         # Navigation frame for seller portal
│           ├── SellerDashboard/      # Restaurant KPI overview & charts
│           ├── MyProducts/           # Seller dishes inventory table
│           ├── ProductForm/          # Add/Edit dish form with all 9 categories
│           └── SellerOrders/         # Incoming customer orders management
│
├── .gitignore                        # Root gitignore
└── README.md                         # Comprehensive project documentation
```

---

## 🍲 Food Categories & Menu

The platform comes pre-seeded with **42 authentic, mouth-watering dishes** covering all 9 categories:

| Category | Sample Dishes Included | Price Range |
| :--- | :--- | :--- |
| **Tiffins** | Butter Masala Dosa, Ghee Podi Idli, Medu Vada, Puri Bhaji, Rava Upma | ₹60 – ₹85 |
| **Chinese / Fastfood** | Chicken Schezwan Fried Rice, Veg Hakka Noodles, Manchurian, Chilli Chicken | ₹140 – ₹210 |
| **Biryani** | Hyderabadi Chicken Dum Biryani, Mutton Dum Biryani, Royal Veg Biryani | ₹190 – ₹340 |
| **Meals** | South Indian Thali, Deluxe North Indian Executive Thali, Curd Rice | ₹100 – ₹220 |
| **Irani Tea** | Special Irani Dum Chai, Osmania Biscuits with Chai, Zafrani Malai Chai | ₹30 – ₹70 |
| **Shawarma** | Classic Chicken Shawarma, Rumali Shawarma, Jumbo Cheese Shawarma | ₹120 – ₹190 |
| **Chat Bandi** | Hyderabadi Pani Puri, Bombay Pav Bhaji, Sev Puri, Samosa Chaat | ₹50 – ₹120 |
| **Juice Center** | Alphonso Mango Shake, Fresh Mosambi Juice, Cold Coffee with Ice Cream | ₹50 – ₹95 |
| **Sweets / Desserts** | Hot Gulab Jamun with Rabdi, Double Ka Meetha, Royal Rasmalai, Qubani Ka Meetha | ₹75 – ₹120 |

---

## 🔌 API Endpoints Reference

All endpoints are prefixed with `/api/`.

### 1. Authentication & Users (`/api/users/`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register/` | Register new account (`user_type`: `customer` or `seller`) | Public |
| `POST` | `/api/users/login/` | Obtain JWT token pair (`access` + `refresh`) | Public |
| `POST` | `/api/users/login/refresh/` | Refresh expired access token | Public |
| `GET` | `/api/users/profile/` | Fetch current user's profile (`username`, `email`, `user_type`) | Authenticated |
| `POST` | `/api/users/logout/` | Blacklist refresh token & terminate session | Authenticated |

### 2. Menu & Dishes (`/api/products/`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/` | List dishes with pagination, search & filters | Public (Excludes prime dishes unless logged in) |
| `GET` | `/api/products/?category=<CategoryName>` | Filter dishes by category | Public |
| `GET` | `/api/products/?search=<Query>` | Search dishes by title or brand | Public |
| `GET` | `/api/products/?ordering=-price` | Sort dishes by price (asc/desc) or rating | Public |
| `GET` | `/api/products/?is_prime=true` | Get Chef's Specials / Prime Deals | Authenticated |
| `POST` | `/api/products/` | Add a new dish to the restaurant menu | **Sellers Only** |
| `GET` | `/api/products/<id>/` | View dish detail | Public |
| `PATCH`| `/api/products/<id>/` | Update dish details | **Owner Seller Only** |
| `DELETE`| `/api/products/<id>/` | Delete dish from menu | **Owner Seller Only** |

### 3. Shopping Cart (`/api/cart/`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart/` | Get current customer's cart items | Authenticated |
| `POST` | `/api/cart/add/` | Add dish to cart (`{"product": <id>, "quantity": <n>}`) | Authenticated |
| `PATCH`| `/api/cart/items/<id>/` | Update quantity of cart item | Authenticated |
| `DELETE`| `/api/cart/items/<id>/` | Remove item from cart | Authenticated |

### 4. Orders & Checkout (`/api/orders/`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders/` | Get all orders placed by the customer | Authenticated |
| `POST` | `/api/orders/` | Convert cart into confirmed order with address | Authenticated |
| `GET` | `/api/orders/<id>/` | Get detailed receipt of an order | Authenticated |
| `POST` | `/api/orders/<id>/cancel/` | Cancel an active order | Authenticated |

### 5. Seller Management & Dashboard (`/api/seller/`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/seller/summary/` | Get revenue metrics, order totals & 7-day chart | **Sellers Only** |
| `GET` | `/api/seller/products/` | List all dishes owned by the logged-in seller | **Sellers Only** |
| `GET` | `/api/seller/orders/` | List incoming orders containing seller's dishes | **Sellers Only** |
| `PATCH`| `/api/seller/orders/items/<id>/` | Update item fulfillment (`status`: `shipped` / `delivered`) | **Sellers Only** |

---

## 🔑 Default Demo Credentials

The database comes pre-configured with accounts for instant testing:

| Role | Username | Password | Email | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Seller (Owner)** | `Moqeed` | `Moqeed@123` | `moqeed@maazacafe.com` | Manages all 42 dishes, adds new items, views sales analytics and customer orders |
| **Customer** | `admin` | *(Set your own or register)* | `customer@example.com` | Explores menu, places orders, tests cart & checkout |

> 💡 *You can also create as many new customer or seller accounts as you wish via the Register screen (`/register`).*

---

## 💻 Local Installation & Setup Guide

### 1. Prerequisites
- **Python:** 3.10 or higher (`python --version`)
- **Node.js:** v18 or higher (`node -v`)
- **NPM:** v9 or higher (`npm -v`)
- **Git**

---

### 2. Backend Setup (Django REST Framework)

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd MaazaCafe_Online/backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv env
     .\env\Scriptsctivate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv env
     source env/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

5. Seed the 42 delicious dishes and default seller:
   ```bash
   python seed_maaza_cafe.py
   ```
   *Output: `Successfully seeded 42 delicious dishes for Maaza Cafe!`*

6. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   *The backend API is now running at:* **`http://127.0.0.1:8000/`**

---

### 3. Frontend Setup (React + Vite)

1. Open a **second terminal** and navigate to the `frontend` folder:
   ```bash
   cd MaazaCafe_Online/frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Check or create the `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application is now live at:* **`http://localhost:3000/`**

---

## 🔄 Testing the Entire Lifecycle

You can test the complete restaurant flow in your browser in under 3 minutes:

1. **Seller Login & Inventory:**
   - Go to `http://localhost:3000/login`
   - Log in with `Moqeed` / `Moqeed@123`
   - Click **Dashboard** in the top navigation bar.
   - Go to **My Products** → click **+ Add Dish**.
   - Fill in a new dish (e.g. *Special Hyderabadi Haleem*, ₹240, Category: *Meals*).
   - Click **Add Dish to Menu**. The dish is now immediately live!

2. **Customer Ordering:**
   - Log out (or open an Incognito window).
   - Register or log in as a customer.
   - Go to **Products** (`/products`).
   - Find the newly added dish or search for it.
   - Click the dish, select quantity (e.g. 2), and click **ADD TO CART**.
   - Go to **Cart** (`/cart`) → click **Checkout**.
   - Enter your delivery address and choose payment method (COD or Card).
   - Click **Confirm Order**.

3. **Seller Order Processing:**
   - Log back in as `Moqeed`.
   - Go to **Dashboard** → **Orders** tab (`/dashboard/orders`).
   - You will see the incoming order with the customer's delivery address, phone, and items!

---

## 🚀 100% Free Production Deployment Guide

Deploy your full-stack restaurant application online without paying anything or entering a credit card:

### Step A: Deploy Backend to Render.com (Free)
1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Maaza Cafe"
   git branch -M main
   git remote add origin https://github.com/<your-username>/MaazaCafe_Online.git
   git push -u origin main
   ```
2. Log in to [render.com](https://render.com/) and click **New +** → **Web Service**.
3. Connect your `MaazaCafe_Online` repository.
4. Set the configuration:
   - **Name:** `maaza-cafe-api`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate && python seed_maaza_cafe.py
     ```
   - **Start Command:**
     ```bash
     gunicorn myproject.wsgi:application
     ```
   - **Plan:** Select **Free**.
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://maaza-cafe-api.onrender.com`).

---

### Step B: Deploy Frontend to Vercel (Free)
1. Log in to [vercel.com](https://vercel.com/) and click **Add New...** → **Project**.
2. Select your `MaazaCafe_Online` repository and click **Import**.
3. Configure settings:
   - **Root Directory:** Click Edit and choose `frontend`.
   - **Framework Preset:** Vite.
   - **Environment Variables:**
     - Key: `VITE_API_BASE_URL`
     - Value: `https://maaza-cafe-api.onrender.com` *(paste your Render backend URL with no trailing slash)*.
4. Click **Deploy**.
   - *Vercel will provide your live restaurant website URL (e.g. `https://maaza-cafe.vercel.app`) with free global SSL!*
   - *The included `vercel.json` and `_redirects` ensure page refreshes on subroutes like `/products` and `/dashboard` never produce 404s.*

---

## ❓ Troubleshooting & FAQ

#### 1. Port 3000 or 8000 already in use?
- If backend port 8000 is occupied: `python manage.py runserver 8001`, and update `VITE_API_BASE_URL=http://localhost:8001` in `frontend/.env`.
- If frontend port 3000 is occupied: edit `port` in `frontend/vite.config.js`.

#### 2. CORS Error when calling API?
- `backend/myproject/settings.py` is configured with `CORS_ALLOW_ALL_ORIGINS = True`. Make sure `corsheaders.middleware.CorsMiddleware` remains at the top of `MIDDLEWARE`.

#### 3. Refreshing on a deployed frontend gives 404?
- The project includes `frontend/vercel.json` and `frontend/public/_redirects` which automatically route all client requests to `/index.html`. Ensure these files are committed to your git repository.

---

## 📜 License & Credits
Developed with ❤️ for **Maaza Cafe**. Feel free to use and customize this codebase for your restaurant or cafe business!
