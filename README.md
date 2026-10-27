# Maaza Cafe Online

Maaza Cafe Online is a restaurant ordering application with a React single-page frontend and a Django REST API. Customers can browse dishes, manage a cart, place and review orders. Seller accounts can manage their own products, review sales summaries, and update the fulfillment status of their order items.

This guide describes the project as it exists in this repository. It includes local setup, how the folders and files fit together, the API routes, tests, and deployment notes.

## Contents

- [Features and technology](#features-and-technology)
- [Repository map](#repository-map)
- [Local setup](#local-setup)
- [Run the application](#run-the-application)
- [Test and build](#test-and-build)
- [How the application works](#how-the-application-works)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Important limitations and security notes](#important-limitations-and-security-notes)
- [Troubleshooting](#troubleshooting)

## Features and technology

### Customer features

- Register and sign in with JWT authentication.
- Browse and search the menu; filter by category, brand, rating, or Chef's Specials; sort by price or rating.
- Open dish details and add dishes to a server-backed cart.
- Submit a delivery address and place an order.
- Review order history and details, and cancel an order while it is still cancellable.

### Seller features

- View sales and order summary information.
- List, create, update, and delete products, with seller ownership enforced by the API.
- Review order items that contain the seller's products and update item fulfillment status.

### Technology

| Area | Technology |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 6, JavaScript, CSS |
| API | Python, Django, Django REST Framework |
| Authentication | Simple JWT access and refresh tokens |
| Database | SQLite, configured in `backend/myproject/settings.py` |
| Filtering | `django-filter`, DRF search and ordering backends |
| Static files | WhiteNoise and Django `collectstatic` |
| Frontend hosting configuration | Vercel SPA rewrite in `frontend/vercel.json` |

## Repository map

The descriptions below cover the tracked source, configuration, migration, and asset files. Installed packages, local virtual environments, caches, and generated build output are not source files and are intentionally excluded.

### Root

| Path | Purpose |
| --- | --- |
| `.gitignore` | Excludes local environments, dependencies, generated builds, caches, and database journal files from Git. |
| `README.md` | This complete project and setup guide. |

### Backend

| Path | Purpose |
| --- | --- |
| `backend/manage.py` | Django command-line entry point for migrations, tests, checks, and the development server. |
| `backend/requirements.txt` | Python packages required by the API and production server. |
| `backend/build.sh` | Render-style build helper: installs requirements and collects static files. It does not run migrations or seed data. |
| `backend/seed_maaza_cafe.py` | Development data seeder. It creates/resets the demo seller and **deletes all existing products** before inserting its menu. See the warning below before running it. |
| `backend/db.sqlite3` | SQLite database file currently present in this checkout. Local changes to this file are database data, not source code. |
| `backend/.gitignore` | Backend-specific ignore rules for local Python and generated files. |
| `backend/readme.md` | Backend quick-reference pointer to this root README. |

#### `backend/myproject/` - Django project configuration

| File | Purpose |
| --- | --- |
| `__init__.py` | Marks the directory as a Python package. |
| `settings.py` | Installed apps, middleware, SQLite configuration, JWT, pagination, static files, CORS, and environment-based settings. |
| `urls.py` | Mounts the admin site and the users, products, cart, orders, and seller API routes under `/api/`. |
| `wsgi.py` | WSGI entry point used by Gunicorn in a conventional synchronous deployment. |
| `asgi.py` | ASGI entry point for servers that support ASGI. |

#### `backend/users/` - accounts and authentication

| File or folder | Purpose |
| --- | --- |
| `__init__.py` | Python package marker. |
| `admin.py` | Django admin registration/configuration for users. |
| `apps.py` | Django app metadata. |
| `models.py` | Custom user model with `customer` and `seller` account types. |
| `serializers.py` | Validates registration input and creates accounts. |
| `views.py` | Registration, current-profile, and logout endpoints. JWT login and refresh use Simple JWT views. |
| `urls.py` | Routes registration, profile, login, refresh, and logout requests. |
| `migrations/__init__.py` | Python package marker for migrations. |
| `migrations/0001_initial.py` | Creates the custom user model and its initial database structure. |

#### `backend/products/` - menu and product management

| File or folder | Purpose |
| --- | --- |
| `__init__.py` | Python package marker. |
| `admin.py` | Django admin registration/configuration for products. |
| `apps.py` | Django app metadata. |
| `models.py` | Product fields, including seller, category, price, image URL, rating, availability, description, reviews, and special flag. |
| `serializers.py` | Converts product records to and from API JSON. |
| `views.py` | Product list/create and detail/update/delete API behavior, including visibility and permissions. |
| `urls.py` | Product collection and product-detail routes. |
| `filters.py` | Category, brand, Chef's Special, and minimum-rating filters. |
| `pagination.py` | Product-list pagination behavior. |
| `permissions.py` | Allows public reads where applicable and restricts product changes to sellers/owners. |
| `migrations/__init__.py` | Python package marker for migrations. |
| `migrations/0001_initial.py` | Initial product table. |
| `migrations/0002_product_is_prime.py` | Adds the special/prime product flag. |
| `migrations/0003_product_seller.py` | Adds the product-to-seller relationship. |
| `migrations/0004_remove_product_is_prime_remove_product_seller.py` | Removes the two fields named in this migration. It is part of the recorded migration history and should not be deleted. |
| `migrations/0005_product_is_prime.py` | Adds the special/prime flag again after the preceding migration. |
| `migrations/0006_product_seller.py` | Adds the seller relationship again after the preceding migration. |
| `migrations/0007_product_availability_product_description_and_more.py` | Adds the current product detail fields, including availability and description. |

#### `backend/cart/` - server-side cart

| File or folder | Purpose |
| --- | --- |
| `__init__.py` | Python package marker. |
| `admin.py` | Django admin registration/configuration for cart records. |
| `apps.py` | Django app metadata. |
| `models.py` | Cart and cart-item database records, with item count and total helpers. |
| `serializers.py` | Cart output and add/update request validation. |
| `views.py` | Reads a user's cart and handles adding, changing, or deleting cart items. |
| `urls.py` | Cart, add-item, and cart-item routes. |
| `tests.py` | Placeholder Django test module; the main current API tests are in `backend/orders/tests.py`. |
| `migrations/__init__.py` | Python package marker for migrations. |
| `migrations/0001_initial.py` | Creates the cart and cart-item tables. |

#### `backend/orders/` - checkout, order history, and order detail

| File or folder | Purpose |
| --- | --- |
| `__init__.py` | Python package marker. |
| `admin.py` | Configures how orders appear in Django admin. |
| `apps.py` | Django app metadata. |
| `models.py` | Order, order item, and delivery address records, including status and cancellation rules. |
| `serializers.py` | Validates delivery details and serializes order list/detail responses. |
| `views.py` | Creates orders from the user's cart, returns only the user's orders, and handles cancellation. |
| `urls.py` | Order list/create, order detail, and cancel routes. |
| `tests.py` | API tests for seller permissions, product ownership, checkout, order visibility, cancellation, and seller order flows. |
| `migrations/__init__.py` | Python package marker for migrations. |
| `migrations/0001_initial.py` | Creates the order, order-item, and address tables. |

#### `backend/seller/` - seller dashboard APIs

| File or folder | Purpose |
| --- | --- |
| `__init__.py` | Python package marker. |
| `apps.py` | Django app metadata. Seller endpoints reuse product and order models, so this app has no separate model or migration file. |
| `views.py` | Seller summary, seller-owned products, seller order list, and order-item status updates. |
| `serializers.py` | Formats seller product/order data and validates fulfillment status changes. |
| `pagination.py` | Pagination format for seller product tables. |
| `urls.py` | Routes seller summary, products, orders, and order-item updates. |

### Frontend

| Path | Purpose |
| --- | --- |
| `frontend/package.json` | Frontend dependencies and the `dev`, `build`, `lint`, and `preview` scripts. |
| `frontend/package-lock.json` | Exact dependency resolution used by `npm ci`. |
| `frontend/.nvmrc` | Selects Node.js `20.9.0` when using a Node version manager. |
| `frontend/.gitignore` | Ignores `node_modules`, build output, local env files, logs, and editor files. |
| `frontend/.prettierrc` | Prettier formatting configuration used by ESLint. |
| `frontend/eslint.config.js` | ESLint rules for JavaScript and React. |
| `frontend/index.html` | Browser HTML shell, page metadata, and the element where React mounts. |
| `frontend/vite.config.js` | Vite React plugin, development host/port, and build output settings. |
| `frontend/vercel.json` | Rewrites frontend routes to `index.html` so client-side routes work on refresh. |
| `frontend/.env.production` | Production API base URL currently set to `https://maaza-cafe-api.onrender.com`. Vite embeds `VITE_` variables in the built frontend. |
| `frontend/public/` | Static files copied to the build output without import processing. See the asset list below. |
| `frontend/src/` | React application source, API helper, contexts, formatting helpers, and UI components. |

#### `frontend/public/` - static assets

| File | Purpose |
| --- | --- |
| `cafe-icon.svg` | Cafe favicon/icon. |
| `chef-specials-banner.svg` | Banner artwork used for Chef's Specials. |
| `empty-cart-cafe.svg` | Illustration shown for an empty cart. |
| `maaza-cafe-logo.svg` | Maaza Cafe logo. |
| `no-food-found.svg` | Illustration for an empty product search/result state. |
| `vite.svg` | Default Vite starter asset; not part of the cafe's core experience. |
| `_redirects` | Netlify-style SPA fallback rule. Vercel routing is configured separately in `vercel.json`. |

#### `frontend/src/` - application entry and shared logic

| File | Purpose |
| --- | --- |
| `main.jsx` | Creates the React root, loads global CSS, and renders `App`. |
| `App.jsx` | Defines routes, providers, startup profile/cart loading, and shared cart operations. |
| `App.css` | App-level layout and shared application styles. |
| `index.css` | Global box sizing, body margin, and base typography. |
| `api.js` | Reads the configured API URL, adds the access token to requests, and saves/clears JWT cookies. |
| `format.js` | Shared currency/date formatting helpers. |
| `context/CartContext.js` | Default React context shape for cart state and cart actions. |
| `context/UserContext.js` | Default React context shape for the signed-in user and loading state. |

#### `frontend/src/components/` - screen and reusable component files

Each listed component folder contains `index.jsx` (the React UI/behavior) and `index.css` (styles for that component), except `ProtectedRoute`, which has only `index.jsx`.

| Component folder and files | Purpose |
| --- | --- |
| `AllProductsSection/index.jsx`, `index.css` | Product grid, pagination, and product-list states. |
| `Cart/index.jsx`, `index.css` | Cart page and its loading/empty/list states. |
| `CartItem/index.jsx`, `index.css` | One cart row, quantity controls, and removal action. |
| `CartListView/index.jsx`, `index.css` | Renders the list of cart items. |
| `CartSummary/index.jsx`, `index.css` | Cart totals and the action to continue to checkout. |
| `Checkout/index.jsx`, `index.css` | Delivery-address form and order submission/payment-method selection. |
| `EmptyCartView/index.jsx`, `index.css` | Empty-cart view. |
| `FiltersGroup/index.jsx`, `index.css` | Product category, rating, and other filter controls. |
| `Header/index.jsx`, `index.css` | Main navigation, account-aware links, and logout action. |
| `Home/index.jsx`, `index.css` | Home screen and featured menu presentation. |
| `LoginForm/index.jsx`, `index.css` | Login form and token handling. |
| `MyOrders/index.jsx`, `index.css` | Customer order-history list. |
| `MyProducts/index.jsx`, `index.css` | Seller's product inventory view. |
| `NotFound/index.jsx`, `index.css` | Unknown-route screen. |
| `OrderDetails/index.jsx`, `index.css` | Detailed order receipt and cancellation action. |
| `PrimeDealsSection/index.jsx`, `index.css` | Chef's Specials/prime product section. |
| `ProductCard/index.jsx`, `index.css` | Reusable product card. |
| `ProductForm/index.jsx`, `index.css` | Seller create/edit product form. |
| `ProductItemDetails/index.jsx`, `index.css` | Product details and add-to-cart quantity selection. |
| `Products/index.jsx`, `index.css` | Product browsing page composition and data loading. |
| `ProductsHeader/index.jsx`, `index.css` | Product-page heading and summary. |
| `Profile/index.jsx`, `index.css` | Signed-in user's profile screen. |
| `ProtectedRoute/index.jsx` | Redirects unauthenticated users to the login flow. |
| `RegisterForm/index.jsx`, `index.css` | Customer/seller registration form. |
| `SellerDashboard/index.jsx`, `index.css` | Seller summary, metrics, and dashboard sections. |
| `SellerLayout/index.jsx`, `index.css` | Shared seller navigation and page layout. |
| `SellerOrders/index.jsx`, `index.css` | Seller's order list and fulfillment actions. |
| `SellerProductsBar/index.jsx`, `index.css` | Seller product-list controls such as search/filtering. |
| `SimilarProductItem/index.jsx`, `index.css` | Related product item shown alongside product details. |

## Local setup

### Requirements

- Python 3.10 or later.
- Node.js 20.9.0 (the version recorded in `frontend/.nvmrc`) and npm.
- Git, if you are cloning the repository.

### 1. Get the code

If you already have this project folder, open a terminal in it. Otherwise clone the repository:

```bash
git clone https://github.com/MOQEED/MaazaCafe_Online.git
cd MaazaCafe_Online
```

### 2. Set up the backend

Open a terminal in the project root and run:

```powershell
cd backend
python -m venv env
.\env\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
```

On macOS/Linux, activate the environment with:

```bash
source env/bin/activate
```

#### Optional: load the sample menu

For a fresh local database, load the development menu and demo seller:

```bash
python seed_maaza_cafe.py
```

**Warning:** this script deletes every existing product before it inserts the sample menu. It also creates or resets the `Moqeed` seller password to `Moqeed@123`. Do not run it on a database with products or accounts you need to preserve, and never run it as a routine production deploy step. New customer accounts can be registered in the app.

### 3. Configure and install the frontend

Open a second terminal at the project root:

```powershell
cd frontend
npm ci
```

The local `frontend/.env` file is ignored by Git. Create it for local development with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

`frontend/.env.production` is the production-mode configuration. In Vercel, configure `VITE_API_BASE_URL` as a project environment variable when you need to use a different backend URL. Do not put secret keys in frontend environment variables; values prefixed with `VITE_` are visible to website visitors.

## Run the application

Keep the backend and frontend running in separate terminals.

**Terminal 1 - backend** (from `backend/`, with its virtual environment activated):

```bash
python manage.py runserver 8000
```

The API is at `http://127.0.0.1:8000/`. The browsable Django REST API root may not have a page at `/`; use one of the `/api/...` endpoints.

**Terminal 2 - frontend** (from `frontend/`):

```bash
npm run dev
```

Vite serves the frontend at `http://localhost:3000/`. Start at `/login` or `/register`; protected screens require an account. To use the seller demo locally after running the seeder, sign in with username `Moqeed` and password `Moqeed@123`. Change or remove these demo credentials before any public deployment.

## Test and build

Run backend checks from `backend/` with the virtual environment active:

```bash
python manage.py check
python manage.py test
```

Run frontend checks from `frontend/`:

```bash
npm run lint
npm run build
```

The production frontend files are written to `frontend/dist/`. The `preview` script serves that build locally:

```bash
npm run preview
```

## How the application works

1. The browser loads the React app and `App.jsx` installs the user and cart contexts.
2. `api.js` builds API requests using `VITE_API_URL` if set, then `VITE_API_BASE_URL`, then `http://localhost:8000` as its fallback. It adds the saved JWT access token to authenticated requests.
3. Django routes each `/api/...` request to the corresponding app. Models store users, products, carts, and orders in SQLite; serializers validate request/response data; views enforce ownership and perform database operations.
4. Checkout creates order and order-item records from the server-side cart, saves an address, and empties the cart. The server uses stored product prices rather than totals submitted by the browser.
5. Sellers see only their own products and their own order items in the seller endpoints.

## API reference

All API endpoints are mounted beneath `/api/`. Authentication uses a JWT bearer access token for protected endpoints.

| Method | Endpoint | Purpose and access |
| --- | --- | --- |
| `POST` | `/api/users/register/` | Create a customer or seller account. Public. |
| `POST` | `/api/users/login/` | Obtain JWT access and refresh tokens. Public. |
| `POST` | `/api/users/login/refresh/` | Refresh an access token. Public with a valid refresh token. |
| `GET` | `/api/users/profile/` | Return the authenticated user's profile. |
| `POST` | `/api/users/logout/` | Blacklist the submitted refresh token. Authenticated. |
| `GET`, `POST` | `/api/products/` | List/search/filter products, or create one as an authenticated seller. |
| `GET`, `PATCH`, `DELETE` | `/api/products/<id>/` | Read a product; only its owning seller can edit/delete it. |
| `GET` | `/api/cart/` | Read the authenticated user's cart. |
| `POST` | `/api/cart/add/` | Add or increase a cart item. Body: `{"product": 1, "quantity": 2}`. |
| `PATCH`, `DELETE` | `/api/cart/items/<id>/` | Set an item's quantity or remove the cart row. PATCH body: `{"quantity": 2}`. The ID is the cart-item ID. |
| `GET`, `POST` | `/api/orders/` | List the current user's orders, or create an order from their non-empty cart. |
| `GET` | `/api/orders/<id>/` | Read the current user's order details. |
| `POST` | `/api/orders/<id>/cancel/` | Cancel an order if its current status allows cancellation. |
| `GET` | `/api/seller/summary/` | Seller dashboard summary. Sellers only. |
| `GET` | `/api/seller/products/` | List the authenticated seller's products. Sellers only. |
| `GET` | `/api/seller/orders/` | List order items belonging to the authenticated seller. Sellers only. |
| `PATCH` | `/api/seller/orders/items/<id>/` | Advance fulfillment status for an owned order item. Sellers only. |

Product list query parameters include `category`, `brand`, `rating` (minimum rating), `is_prime`, `search` (title or brand), `ordering` (`price`, `-price`, `rating`, or `-rating`), and `page`. A request for `is_prime=true` requires authentication; anonymous product listings exclude prime products.

## Deployment

The frontend is configured for Vercel and the backend has a Render-oriented build script. These are separate deployments; the frontend must point at the deployed API.

### Backend on Render

1. Push the repository to GitHub and create a Render **Web Service** connected to it.
2. Set the service root directory to `backend` and select the Python runtime.
3. Use a build command such as:

   ```bash
   pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input
   ```

4. Use this start command:

   ```bash
   gunicorn myproject.wsgi:application
   ```

5. Set environment variables before exposing the service: `DEBUG=False` and a newly generated, private `SECRET_KEY`. Configure persistent storage for SQLite or move the project to a managed database before relying on production orders. Do not run `seed_maaza_cafe.py` on each deploy because it deletes products.
6. Copy the service's public `https://...onrender.com` URL for the frontend configuration.

`backend/build.sh` installs packages and collects static files only; it does not migrate or seed the database. Choose a single clear build command in the host configuration and make migrations an explicit deploy step.

### Frontend on Vercel

1. Import the same GitHub repository as a Vercel project.
2. Set the project root directory to `frontend` and framework to Vite.
3. Set `VITE_API_BASE_URL` to the Render API origin, with no trailing slash, for example `https://your-service.onrender.com`.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Deploy. The Vercel URL shown for the project is the public website URL. `frontend/vercel.json` provides SPA fallback behavior for direct route loads and refreshes.

### URLs currently configured in this checkout

- Website: [https://maaza-cafe-online.vercel.app](https://maaza-cafe-online.vercel.app)
- API base URL: [https://maaza-cafe-api.onrender.com](https://maaza-cafe-api.onrender.com)

On October 27, 2026, the website responded with HTTP 200, but `/api/products/` on the API returned HTTP 503. The frontend is reachable; the backend needs attention in the Render dashboard/logs before the full ordering workflow can be considered live.

## Important limitations and security notes

- **Card payments are not integrated.** The current order logic records `CARD` orders as paid; it does not contact a payment provider or charge a card. Treat this as a demo selection only.
- **SQLite persistence depends on the host.** Render's ordinary ephemeral filesystem can lose database changes when an instance is replaced. Use a persistent disk configured with `SQLITE_DIR` or migrate to a managed database for real customer data.
- **Set production secrets.** `settings.py` contains a development fallback secret and defaults `DEBUG` to `True`. Set `SECRET_KEY` and `DEBUG=False` in production and update the application to use a production-safe, restricted CORS allowlist before launch. The current settings allow all CORS origins.
- **Demo credentials are public in source.** The seeder resets the seller password to `Moqeed@123`. Never use that credential for a live store.
- **Images are URL-based.** Product images are external URLs; this repository does not include an upload/storage service for user-submitted image files.
- **The frontend is not a trusted security boundary.** Authentication, ownership, validation, and totals must continue to be enforced by the API.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Frontend cannot reach the API | Confirm Django is running on port 8000 and `frontend/.env` has the correct `VITE_API_BASE_URL`; restart Vite after changing env files. |
| Login works but product requests fail | Check the backend service status and browser network response. In production, confirm the frontend API environment variable points to the Render origin. |
| Products do not appear in a new local database | Run `python manage.py migrate`, then run the sample seeder only if it is safe to replace the current products. |
| A seller cannot edit a product | Confirm the signed-in account has `user_type=seller` and owns that product. |
| Refreshing a Vercel sub-route returns 404 | Confirm `frontend/vercel.json` is present and the Vercel project root is `frontend`. |
| Database rows disappear after deployment | The host filesystem may be ephemeral; configure persistent storage or use a managed database. |
