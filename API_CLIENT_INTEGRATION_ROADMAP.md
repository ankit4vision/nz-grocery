# API Integration Roadmap - NZ Grocery Client (Customer Portal)

## ✅ Completed Modules

### 1. Authentication Module 🔐 ✅ **COMPLETED**
**Why First**: Foundation for all other modules. Users must be able to register, login, and maintain session.

**APIs Integrated**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current authenticated user
- `PUT /users/change-password` - Change password

**Files Updated/Created**:
- `client/src/config/apiClient.js` ✅ Created
- `client/src/utils/errorHandler.js` ✅ Created
- `client/src/utils/responseHandler.js` ✅ Created
- `client/src/utils/constants.js` ✅ Updated (API endpoints)
- `client/src/services/api/auth.js` ✅ Updated
- `client/src/context/UserContext.jsx` ✅ Updated
- `client/src/components/ui/LoginModal.jsx` ✅ Updated
- `client/src/components/ui/SignupModal.jsx` ✅ Updated

**Features Implemented**:
- User registration with validation
- User login with token management
- Get current user profile (auto-verifies token on app load)
- Change password functionality
- Token storage in localStorage (`access_token` and `user`)
- Auto-redirect on 401 (only for authenticated requests, not login/register failures)
- Error handling without page reload
- Loading states during API calls
- Form validation
- Data transformation (frontend format ↔ API format: firstName ↔ first_name, mobile ↔ phone)

**Key Implementation Details**:
- API client configured with interceptors
- Smart 401 handling: Only redirects if request had token AND is not login/register endpoint
- Login/register errors display in modal without page reload
- UserContext returns error responses instead of throwing (prevents unhandled promise rejections)
- Auto token verification on app mount
- Token and user data stored in localStorage

**Time Taken**: Completed

---

### 2. Products & Categories Module 🛍️ ✅ **COMPLETED**
**Why Second**: Core functionality - users need to browse products and categories.

**APIs Integrated**:
- `GET /product-service/categories/` - List all categories ✅ Completed
- `GET /product-service/products/variants/filter` - Filter and list product variants (with pagination, filters: product_name, category_id) ✅ Completed
- `GET /product-service/products/{product_id}/full` - Get full product details ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/categories.js` ✅ Updated (uses apiClient pattern)
- `client/src/services/api/products.js` ✅ Updated (uses apiClient pattern)
- `client/src/pages/Home.jsx` ✅ Updated (fetches featured products from API)
- `client/src/pages/Products.jsx` ✅ Updated (fetches categories and products from API)
- `client/src/pages/ProductDetail.jsx` ✅ Updated (fetches product details and related products from API)
- `client/src/components/ui/AllCategories.jsx` ✅ Updated (category images integration)
- `client/src/components/layout/BrowseSidebar.jsx` ✅ Updated (category images integration)
- `client/src/components/ui/ProductGrid.jsx` ✅ Updated (removed mock data dependencies)

**Features Implemented**:
- ✅ List all categories (for navigation/sidebar)
- ✅ Filter products by category
- ✅ Search products by name (using product_name filter)
- ✅ Product variants list with pagination
- ✅ Product detail page with full information
- ✅ Product images gallery (from API response)
- ✅ Related products (based on category)
- ✅ Loading states and error handling
- ✅ Empty states
- ✅ Data transformation (API format ↔ component format)
- ✅ Pagination support (load more functionality)
- ✅ Category image URLs integration
- ✅ Responsive category thumbnails

**Key Implementation Details**:
- Services use apiClient pattern with error handling
- Data transformation functions convert API response to component format
- Pagination implemented with "Load More" functionality
- Loading and error states properly handled
- Category filtering works with URL parameters
- Related products fetched based on product category
- Category images displayed as responsive thumbnails
- Mock data dependencies removed from components
- All API integrations tested and working

**Time Taken**: Completed

---

### 2.1 Homepage Hero Banners 🎯 ✅ **COMPLETED**
**Why now**: Marketing banners highlight seasonal campaigns and must stay in sync with the admin CMS.

**APIs Integrated**:
- `GET /banners/?is_active=true` → Client-side filters `banner_type=homepage`

**Files Updated/Created**:
- `client/src/services/api/banners.js` ✅ Created (shared banner service)
- `client/src/pages/Home.jsx` ✅ Updated (hero slider pulls live homepage banners with graceful fallback)
- `client/src/components/ui/HeroSlider.jsx` ✅ Updated (renders banner_title/description + CTA)
- `client/src/styles/components/ui-elements/hero-slider.css` ✅ Updated (position-based alignment styles)

**Features Implemented**:
- ✅ Hero slider fetches active banners on mount
- ✅ Client filtering for `banner_type === 'homepage'`
- ✅ Dynamic alignment based on `position` (left, center, right; left default)
- ✅ CTA button opens banner link in new tab when provided
- ✅ Skeleton states, error handling, and fallback to mock slides

**Key Implementation Details**:
- Banner service reuses shared `apiClient`, standard error handling
- `Home.jsx` keeps legacy mock data for fallback when API returns empty/errored
- `HeroSlider` now renders marketing copy layer with responsive typography and animations
- Alignment handled purely via CSS utility classes for maintainability

**Time Taken**: Completed

---

### 3. Product Reviews Module ⭐ ✅ **COMPLETED**
**Why After Products**: Users need to view and submit product reviews after browsing products.

**APIs Integrated**:
- `GET /product-service/reviews/` - List product reviews (with filters: product_id, product_variant_id, is_approved, sort_by)
- `GET /product-service/reviews/{review_id}` - Get single review
- `POST /product-service/reviews/` - Create new product review
- `PUT /product-service/reviews/{review_id}` - Update review
- `DELETE /product-service/reviews/{review_id}` - Delete review

**Files Updated/Created**:
- `client/src/services/api/reviews.js` ✅ Created
- `client/src/utils/constants.js` ✅ Updated (Review endpoints added)
- `client/src/components/ui/CustomerReviews.jsx` ✅ Updated (API integration)
- `client/src/pages/ProductDetail.jsx` ✅ Updated (fetches reviews, calculates rating)
- `client/src/components/ui/ProductInfo.jsx` ✅ Updated (displays calculated rating)
- `client/src/services/api/index.js` ✅ Updated (ReviewsService export)

**Features Implemented**:
- ✅ View product reviews with ratings
- ✅ Sort reviews (Newest, Oldest, Highest/Lowest rating)
- ✅ Submit new reviews (requires authentication)
- ✅ Display verified purchase badges
- ✅ Show overall rating and review count
- ✅ Calculate average rating from reviews
- ✅ Display rating in ProductInfo component
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Review submission with validation
- ✅ Auto-refresh rating after review submission
- ✅ Responsive UI

**Key Implementation Details**:
- Reviews service uses apiClient pattern with error handling
- Reviews fetched in parallel with product details for better performance
- Average rating calculated from all approved reviews
- Rating and review count stored in state for variant changes
- Review submission requires user authentication
- Modal always rendered (even in "no reviews" state) for better UX
- Data transformation maps API fields to component format
- Rating updates automatically when new reviews are submitted

**Time Taken**: Completed

---

### 4. Shopping Cart Module 🛒 ✅ **COMPLETED**
**Why Third**: Essential for e-commerce - users need to add items to cart and manage cart.

**APIs Integrated**:
- `GET /shopping-cart/user/{user_id}/active` - Get active cart for user ✅ Completed
- `POST /shopping-cart/` - Create new cart ✅ Completed
- `POST /shopping-cart/items/` - Add item to cart ✅ Completed
- `GET /shopping-cart/{cart_id}/items/with-pricing` - Get cart items with pricing ✅ Completed
- `GET /shopping-cart/{cart_id}/summary` - Get cart summary (item count and total amount) ✅ Completed
- `PUT /shopping-cart/items/{cart_item_id}` - Update cart item quantity ✅ Completed
- `DELETE /shopping-cart/items/{cart_item_id}` - Remove item from cart ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/cart.js` ✅ Updated (all cart operations using apiClient)
- `client/src/context/CartContext.jsx` ✅ Updated (removed mock data, integrated with CartService)
- `client/src/components/ui/CartSidebar.jsx` ✅ Updated (displays real cart data, compact UI)
- `client/src/components/ui/ProductCard.jsx` ✅ Updated (add to cart with product_id and variant_id)
- `client/src/components/ui/ProductInfo.jsx` ✅ Updated (add to cart with product_id and variant_id)
- `client/src/components/layout/AppNavbar.jsx` ✅ Updated (cart badge with product count)
- `client/src/utils/constants.js` ✅ Updated (cart API endpoints)

**Features Implemented**:
- ✅ Get or create active cart for logged-in user
- ✅ Add product variant to cart (with product_id and variant_id)
- ✅ Update cart item quantity
- ✅ Remove item from cart
- ✅ Get cart items with pricing (including discounts, bulk pricing)
- ✅ Get cart summary (item count and total amount) for quick updates
- ✅ Cart totals calculation (subtotal, total amount)
- ✅ Cart persistence (sync with backend)
- ✅ Cart sidebar with items list (compact UI)
- ✅ Empty cart state
- ✅ Loading states during cart operations
- ✅ Error handling (authentication, cart operations)
- ✅ Product count display (unique products)
- ✅ Total price display per item (unit price and total price)
- ✅ Cart refresh after add/update/remove operations
- ✅ Duplicate add prevention (race condition handling)
- ✅ Optimized API calls (summary endpoint for totals, full items only when needed)

**Key Implementation Details**:
- Cart is user-specific (requires authentication)
- Cart ID stored in context after creation
- Cart items include both product_id and variant_id
- Pricing calculated server-side (bulk pricing, discounts)
- Cart syncs with backend on every change
- Uses summary endpoint for fast total updates
- Full items list fetched only when cart sidebar opens (lazy loading)
- Prevents duplicate API calls with ref guards
- Handles both item_count (unique products) and total_items (total quantity)
- Compact UI design with unit price and total price display
- Removed all mock data dependencies

**Time Taken**: Completed

---

## 📁 Project File Structure

This section provides a comprehensive overview of the client portal structure and all files used during API integration.

### Complete Directory Structure

```
nz-grocery/
├── client/                                    # Client (Customer) frontend application
│   ├── .env.local                            # Local environment variables (gitignored)
│   ├── .env.staging                           # Staging environment variables
│   ├── .env.production                        # Production environment variables
│   ├── package.json                           # Dependencies and scripts
│   │
│   └── src/
│       ├── 📁 config/                        # Configuration files
│       │   └── apiClient.js                   # ✅ Axios client configuration with interceptors
│       │
│       ├── 📁 constants/                      # Constants and configurations
│       │   ├── apiConstants.js                # Application constants (API endpoints in utils/constants.js)
│       │   ├── appConstants.js                # Application constants
│       │   └── uiConstants.js                 # UI constants
│       │
│       ├── 📁 services/                       # API service layer (CRUD operations)
│       │   ├── api/
│       │   │   ├── auth.js                    # ✅ Authentication service
│       │   │   ├── products.js                # ⏳ Products service (TO BE UPDATED)
│       │   │   ├── categories.js              # ⏳ Categories service (TO BE UPDATED)
│       │   │   ├── cart.js                    # ✅ Shopping cart service
│       │   │   ├── orders.js                  # ✅ Orders service
│       │   │   ├── users.js                   # ✅ User profile & addresses service
│       │   │   └── wishlist.js                # ✅ Wishlist service
│       │   └── index.js                        # Service exports
│       │
│       ├── 📁 utils/                          # Utility functions
│       │   ├── api.js                         # API utility functions (legacy fetch wrapper, services use apiClient)
│       │   ├── errorHandler.js                # ✅ Centralized error handling utility
│       │   ├── responseHandler.js            # ✅ Response formatting utility
│       │   ├── constants.js                   # Application constants
│       │   ├── formatters.js                  # Data formatting utilities
│       │   ├── helpers.js                     # Helper functions
│       │   └── validators.js                  # Form validation utilities
│       │
│       ├── 📁 context/                        # React context providers
│       │   ├── UserContext.jsx                # ✅ User authentication context
│       │   ├── CartContext.jsx                # ⏳ Shopping cart context (TO BE UPDATED)
│       │   ├── AppContext.jsx                 # Application context
│       │   └── ThemeContext.jsx               # Theme context
│       │
│       ├── 📁 components/                     # Reusable React components
│       │   ├── common/                        # Common/shared components
│       │   │   ├── Loader.jsx                 # Loading spinner
│       │   │   ├── AlertMessage.jsx           # Alert/Toast component
│       │   │   └── ...                        # Other common components
│       │   │
│       │   ├── ui/                            # UI components
│       │   │   ├── LoginModal.jsx              # ⏳ Login modal (TO BE UPDATED)
│       │   │   ├── SignupModal.jsx             # ⏳ Signup modal (TO BE UPDATED)
│       │   │   ├── ProductCard.jsx             # ⏳ Product card (TO BE UPDATED)
│       │   │   ├── ProductGrid.jsx             # ⏳ Product grid (TO BE UPDATED)
│       │   │   ├── CartSidebar.jsx             # ✅ Cart sidebar
│       │   │   ├── Wishlist.jsx                # ✅ Wishlist component
│       │   │   ├── MyOrders.jsx                # ✅ Orders list
│       │   │   ├── ProfileInformation.jsx      # ✅ Profile form
│       │   │   ├── AddressManagement.jsx      # ✅ Address management component
│       │   │   └── ...                         # Other UI components
│       │   │
│       │   └── layout/                         # Layout components
│       │       ├── AppNavbar.jsx               # Navigation bar
│       │       ├── AppFooter.jsx               # Footer
│       │       └── Layout.jsx                 # Main layout wrapper
│       │
│       ├── 📁 pages/                           # Page-level components
│       │   ├── Home.jsx                        # ⏳ Home page (TO BE UPDATED)
│       │   ├── Products.jsx                   # ⏳ Products listing page (TO BE UPDATED)
│       │   ├── ProductDetail.jsx               # ⏳ Product detail page (TO BE UPDATED)
│       │   ├── Checkout.jsx                    # ✅ Checkout page (API integrated)
│       │   ├── Payment.jsx                     # ✅ Payment page (Stripe integrated)
│       │   ├── PaymentSuccess.jsx              # ✅ Payment success page (Enhanced UI)
│       │   ├── UserDashboard.jsx               # ✅ User dashboard (API integrated)
│       │   ├── OrderDetails.jsx                # ✅ Order details page (API integrated, Enhanced UI)
│       │   └── About.jsx                       # About page
│       │
│       ├── 📁 hooks/                           # Custom React hooks
│       │   ├── useApi.js                       # API hook
│       │   ├── useCart.js                      # Cart hook
│       │   ├── useFavorites.js                 # Favorites/Wishlist hook
│       │   └── useLocalStorage.js              # LocalStorage hook
│       │
│       ├── App.jsx                             # Main app component (with routing)
│       └── main.jsx                            # Application entry point
│
├── openapi.json                                # ✅ OpenAPI specification for all APIs
├── admin-apis.json                             # ✅ Module-wise API list
├── API_INTEGRATION_ROADMAP.md                  # ✅ Admin API integration guide
└── API_CLIENT_INTEGRATION_ROADMAP.md           # ✅ This file - Client API integration guide
```

### Key Files for API Integration

#### 🔧 Configuration Files

**`client/src/config/apiClient.js`** ✅ **COMPLETED**
- **Purpose**: Axios instance with interceptors for all API calls
- **Features**: 
  - Base URL configuration
  - Request interceptors (adds auth tokens)
  - Response interceptors (handles 401 errors)
  - Development logging
- **Usage**: Import in all service files
  ```javascript
  import apiClient from '../config/apiClient'
  ```

#### 🛠️ Utility Files

**`client/src/utils/errorHandler.js`** ✅ **COMPLETED**
- **Purpose**: Centralized error handling
- **Returns**: Standardized error response `{ success: false, message, error }`
- **Usage**: Use in catch blocks
  ```javascript
  import { handleApiError } from '../utils/errorHandler'
  catch (error) {
    return handleApiError(error)
  }
  ```

**`client/src/utils/responseHandler.js`** ✅ **COMPLETED**
- **Purpose**: Standardize success responses
- **Returns**: Standardized response `{ success: true, data, message }`
- **Usage**: Format API responses

**`client/src/utils/api.js`** ⏳ **TO BE UPDATED**
- **Purpose**: API utility functions (currently uses fetch, needs to be updated to use apiClient)
- **Current**: Basic fetch wrapper
- **Target**: Should use apiClient from config

#### 📡 Service Files

**Service File Pattern** (`client/src/services/api/{module}.js`):
- **Purpose**: Encapsulate all API calls for a module
- **Structure**:
  - `getItems()` - List/Fetch all items
  - `getItemById(id)` - Get single item
  - `createItem(data)` - Create new item
  - `updateItem(id, data)` - Update existing item
  - `deleteItem(id)` - Delete item
- **Example**: `authService.js` ⏳

**Services to Update/Create**:
- ✅ `auth.js` - Authentication (register, login, get current user, change password)
- ✅ `products.js` - Product browsing and details
- ✅ `categories.js` - Category listing
- ✅ `reviews.js` - Product reviews (list, create, update, delete)
- ✅ `cart.js` - Shopping cart operations (all CRUD operations)
- ✅ `orders.js` - Order management (list, details, cancel, create)
- ✅ `users.js` - User profile and addresses
- ✅ `wishlist.js` - Wishlist management
- ✅ `stripe.js` - Stripe payment integration

#### 🎨 Component Files

**Common Components** (`client/src/components/common/`):
- ✅ **`Loader.jsx`** - Loading spinner
- ✅ **`AlertMessage.jsx`** - Alert/Toast component
- ⏳ Other components may need updates

**UI Components** (`client/src/components/ui/`):
- ✅ **`LoginModal.jsx`** - Login modal
- ✅ **`SignupModal.jsx`** - Signup modal
- ✅ **`ProductCard.jsx`** - Product card (API integrated)
- ✅ **`ProductGrid.jsx`** - Product grid (API integrated)
- ✅ **`CartSidebar.jsx`** - Cart sidebar (API integrated, compact UI)
- ⏳ **`Wishlist.jsx`** - Wishlist component (needs API integration)
- ⏳ **`MyOrders.jsx`** - Orders list (needs API integration)
- ⏳ **`ProfileInformation.jsx`** - Profile form (needs API integration)

#### 📄 Page Files

**Page Files** (`client/src/pages/`):
- ✅ **`Home.jsx`** - Home page (products/categories API integrated)
- ✅ **`Products.jsx`** - Products listing page (products API integrated)
- ✅ **`ProductDetail.jsx`** - Product detail page (product details API integrated)
- ✅ **`Checkout.jsx`** - Checkout page (API integrated, order creation ready)
- ✅ **`Payment.jsx`** - Payment page (Stripe integration ready)
- ✅ **`PaymentSuccess.jsx`** - Payment success page (ready)
- ⏳ **`UserDashboard.jsx`** - User dashboard (needs profile, orders APIs)
- ⏳ **`OrderDetails.jsx`** - Order details page (needs order details API)

#### 🔐 Context Files

**`client/src/context/UserContext.jsx`** ✅ **COMPLETED**
- **Purpose**: Global user authentication state management
- **Status**: Uses real API services (AuthService)
- **Features**: User state, login, logout, token management, auto token verification

**`client/src/context/CartContext.jsx`** ✅ **COMPLETED**
- **Purpose**: Global shopping cart state management
- **Status**: Integrated with real cart API service
- **Features**: Cart items, add/remove/update items, cart totals, product count, optimized API calls

### Environment Files

**`.env.local`** (Local Development) ✅ Created
```env
VITE_API_BASE_URL=http://3.106.58.15:8000
```

**`.env.staging`** (Staging Environment) ✅ Created
```env
VITE_API_BASE_URL=http://3.106.58.15:8000
```

**`.env.production`** (Production Environment) ✅ Created
```env
VITE_API_BASE_URL=http://3.106.58.15:8000
```

### File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Services | `{module}.js` | `auth.js`, `cart.js` |
| Components | `{ComponentName}.jsx` | `ProductCard.jsx` |
| Pages | `{PageName}.jsx` | `Products.jsx` |
| Utils | `{utilName}.js` | `errorHandler.js` |
| Config | `{configName}.js` | `apiClient.js` |
| Context | `{ContextName}Context.jsx` | `UserContext.jsx` |

---

## 🎯 Module Integration Order

### Priority 1: Authentication Module 🔐
**Why First**: Foundation for all other modules. Users must be able to register, login, and maintain session.

**APIs to Integrate**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current authenticated user
- `PUT /users/change-password` - Change password

**Files Updated/Created**:
- `client/src/config/apiClient.js` ✅ Created
- `client/src/utils/errorHandler.js` ✅ Created
- `client/src/utils/responseHandler.js` ✅ Created
- `client/src/utils/constants.js` ✅ Updated (API endpoints)
- `client/src/services/api/auth.js` ✅ Updated
- `client/src/context/UserContext.jsx` ✅ Updated
- `client/src/components/ui/LoginModal.jsx` ✅ Updated
- `client/src/components/ui/SignupModal.jsx` ✅ Updated

**Features Implemented**:
- ✅ User registration with validation
- ✅ User login with token management
- ✅ Get current user profile (auto-verifies token on app load)
- ✅ Change password functionality
- ✅ Token storage in localStorage (`access_token` and `user`)
- ✅ Auto-redirect on 401 (only for authenticated requests, not login/register failures)
- ✅ Error handling without page reload
- ✅ Loading states during API calls
- ✅ Form validation
- ✅ Data transformation (frontend format ↔ API format)

**Key Implementation Details**:
- API client configured with interceptors
- Smart 401 handling: Only redirects if request had token AND is not login/register endpoint
- Login/register errors display in modal without page reload
- UserContext returns error responses instead of throwing (prevents unhandled promise rejections)
- Auto token verification on app mount
- Token and user data stored in localStorage

**Time Taken**: Completed

---

### Priority 2: Products & Categories Module 🛍️ ✅ **COMPLETED**
**Why Second**: Core functionality - users need to browse products and categories.

**APIs Integrated**:
- `GET /product-service/categories/` - List all categories ✅ Completed
- `GET /product-service/products/variants/filter` - Filter and list product variants (with pagination, filters: product_name, category_id) ✅ Completed
- `GET /product-service/products/{product_id}/full` - Get full product details ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/categories.js` ✅ Updated (uses apiClient pattern)
- `client/src/services/api/products.js` ✅ Updated (uses apiClient pattern)
- `client/src/pages/Home.jsx` ✅ Updated (fetches featured products from API)
- `client/src/pages/Products.jsx` ✅ Updated (fetches categories and products from API)
- `client/src/pages/ProductDetail.jsx` ✅ Updated (fetches product details and related products from API)
- `client/src/components/ui/AllCategories.jsx` ✅ Updated (category images integration)
- `client/src/components/layout/BrowseSidebar.jsx` ✅ Updated (category images integration)
- `client/src/components/ui/ProductGrid.jsx` ✅ Updated (removed mock data dependencies)

**Features Implemented**:
- ✅ List all categories (for navigation/sidebar)
- ✅ Filter products by category
- ✅ Search products by name (using product_name filter)
- ✅ Product variants list with pagination
- ✅ Product detail page with full information
- ✅ Product images gallery (from API response)
- ✅ Related products (based on category)
- ✅ Loading states and error handling
- ✅ Empty states
- ✅ Data transformation (API format ↔ component format)
- ✅ Pagination support (load more functionality)
- ✅ Category image URLs integration
- ✅ Responsive category thumbnails

**Key Implementation Details**:
- Services use apiClient pattern with error handling
- Data transformation functions convert API response to component format
- Pagination implemented with "Load More" functionality
- Loading and error states properly handled
- Category filtering works with URL parameters
- Related products fetched based on product category
- Category images displayed as responsive thumbnails
- Mock data dependencies removed from components
- All API integrations tested and working

**Time Taken**: Completed

---

### Priority 2.5: Product Reviews Module ⭐ ✅ **COMPLETED**
**Why After Products**: Users need to view and submit product reviews after browsing products.

**APIs Integrated**:
- `GET /product-service/reviews/` - List product reviews (with filters: product_id, product_variant_id, is_approved, sort_by) ✅ Completed
- `GET /product-service/reviews/{review_id}` - Get single review ✅ Completed
- `POST /product-service/reviews/` - Create new product review ✅ Completed
- `PUT /product-service/reviews/{review_id}` - Update review ✅ Completed
- `DELETE /product-service/reviews/{review_id}` - Delete review ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/reviews.js` ✅ Created
- `client/src/utils/constants.js` ✅ Updated (Review endpoints added)
- `client/src/components/ui/CustomerReviews.jsx` ✅ Updated (API integration)
- `client/src/pages/ProductDetail.jsx` ✅ Updated (fetches reviews, calculates rating)
- `client/src/components/ui/ProductInfo.jsx` ✅ Updated (displays calculated rating)
- `client/src/services/api/index.js` ✅ Updated (ReviewsService export)

**Features Implemented**:
- ✅ View product reviews with ratings
- ✅ Sort reviews (Newest, Oldest, Highest/Lowest rating)
- ✅ Submit new reviews (requires authentication)
- ✅ Display verified purchase badges
- ✅ Show overall rating and review count
- ✅ Calculate average rating from reviews
- ✅ Display rating in ProductInfo component
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Review submission with validation
- ✅ Auto-refresh rating after review submission
- ✅ Responsive UI

**Key Implementation Details**:
- Reviews service uses apiClient pattern with error handling
- Reviews fetched in parallel with product details for better performance
- Average rating calculated from all approved reviews
- Rating and review count stored in state for variant changes
- Review submission requires user authentication
- Modal always rendered (even in "no reviews" state) for better UX
- Data transformation maps API fields to component format
- Rating updates automatically when new reviews are submitted

**Time Taken**: Completed

---

### Priority 3: Shopping Cart Module 🛒 ✅ **COMPLETED**
**Why Third**: Essential for e-commerce - users need to add items to cart and manage cart.

**APIs Integrated**:
- `GET /shopping-cart/user/{user_id}/active` - Get active cart for user ✅ Completed
- `POST /shopping-cart/` - Create new cart ✅ Completed
- `POST /shopping-cart/items/` - Add item to cart ✅ Completed
- `GET /shopping-cart/{cart_id}/items/with-pricing` - Get cart items with pricing ✅ Completed
- `GET /shopping-cart/{cart_id}/summary` - Get cart summary (item count and total amount) ✅ Completed
- `PUT /shopping-cart/items/{cart_item_id}` - Update cart item quantity ✅ Completed
- `DELETE /shopping-cart/items/{cart_item_id}` - Remove item from cart ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/cart.js` ✅ Updated (all cart operations using apiClient)
- `client/src/context/CartContext.jsx` ✅ Updated (removed mock data, integrated with CartService)
- `client/src/components/ui/CartSidebar.jsx` ✅ Updated (displays real cart data, compact UI)
- `client/src/components/ui/ProductCard.jsx` ✅ Updated (add to cart with product_id and variant_id)
- `client/src/components/ui/ProductInfo.jsx` ✅ Updated (add to cart with product_id and variant_id)
- `client/src/components/layout/AppNavbar.jsx` ✅ Updated (cart badge with product count)
- `client/src/utils/constants.js` ✅ Updated (cart API endpoints)

**Features Implemented**:
- ✅ Get or create active cart for logged-in user
- ✅ Add product variant to cart (with product_id and variant_id)
- ✅ Update cart item quantity
- ✅ Remove item from cart
- ✅ Get cart items with pricing (including discounts, bulk pricing)
- ✅ Get cart summary (item count and total amount) for quick updates
- ✅ Cart totals calculation (subtotal, total amount)
- ✅ Cart persistence (sync with backend)
- ✅ Cart sidebar with items list (compact UI)
- ✅ Empty cart state
- ✅ Loading states during cart operations
- ✅ Error handling (authentication, cart operations)
- ✅ Product count display (unique products)
- ✅ Total price display per item (unit price and total price)
- ✅ Cart refresh after add/update/remove operations
- ✅ Duplicate add prevention (race condition handling)
- ✅ Optimized API calls (summary endpoint for totals, full items only when needed)

**Key Implementation Details**:
- Cart is user-specific (requires authentication)
- Cart ID stored in context after creation
- Cart items include both product_id and variant_id
- Pricing calculated server-side (bulk pricing, discounts)
- Cart syncs with backend on every change
- Uses summary endpoint for fast total updates
- Full items list fetched only when cart sidebar opens (lazy loading)
- Prevents duplicate API calls with ref guards
- Handles both item_count (unique products) and total_items (total quantity)
- Compact UI design with unit price and total price display
- Removed all mock data dependencies

**Time Taken**: Completed

---

### 4. User Profile & Addresses Module 👤 ✅ **COMPLETED**
**Why Fourth**: Users need to manage their profile and delivery addresses.

**APIs Integrated**:
- `GET /users/profile` - Get user profile ✅ Completed
- `PUT /users/profile` - Update user profile ✅ Completed
- `PUT /users/profile/image` - Upload profile image ✅ Completed
- `PUT /users/change-password` - Change password ✅ Completed
- `GET /users/addresses` - List user addresses ✅ Completed
- `GET /users/addresses/{address_id}` - Get address details ✅ Completed
- `POST /users/addresses` - Add new address ✅ Completed
- `PUT /users/addresses/{address_id}` - Update address ✅ Completed
- `DELETE /users/addresses/{address_id}` - Delete address ✅ Completed
- `PUT /users/addresses/{address_id}/set-default` - Set default address ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/users.js` ✅ Updated (all user profile and address APIs using apiClient)
- `client/src/pages/UserDashboard.jsx` ✅ Updated (profile image, address management tab)
- `client/src/components/ui/ProfileInformation.jsx` ✅ Updated (API integration, profile image upload)
- `client/src/components/ui/ChangePassword.jsx` ✅ Updated (API integration)
- `client/src/components/ui/AddressManagement.jsx` ✅ Created (full CRUD for addresses)
- `client/src/styles/components/ui-components/address-management.css` ✅ Created

**Features Implemented**:
- ✅ Get user profile information
- ✅ Update profile (name, phone, date of birth, gender)
- ✅ Upload profile image (multipart/form-data)
- ✅ Change password functionality
- ✅ List user addresses
- ✅ Add new address with validation
- ✅ Update existing address
- ✅ Delete address
- ✅ Set default address
- ✅ Address cards display
- ✅ Address form modals
- ✅ Profile image display in dashboard
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Form validation
- ✅ Success notifications

**Key Implementation Details**:
- All user profile and address operations use apiClient pattern
- Profile image upload uses apiClient.upload for multipart/form-data
- Address management component with full CRUD operations
- Default address cannot be deleted (handled in UI)
- Address cards show default badge
- Profile image displayed in UserDashboard header
- All mock data dependencies removed

**Time Taken**: Completed

---

### 5. Orders Module 📦 ✅ **COMPLETED**
**Why Fifth**: Users need to place orders and view order history.

**APIs Integrated**:
- `GET /orders/` - List user orders (with pagination, filters: status, date range) ✅ Completed
- `GET /orders/{order_id}` - Get order details ✅ Completed
- `GET /orders/{order_id}/details` - Get order details with items ✅ Completed
- `PUT /orders/{order_id}/cancel` - Cancel order (with cancellation_reason as query param) ✅ Completed
- `POST /orders/` - Create new order (API ready, UI pending)

**Files Updated/Created**:
- `client/src/services/api/orders.js` ✅ Updated (all order APIs using apiClient)
- `client/src/pages/UserDashboard.jsx` ✅ Updated (orders tab)
- `client/src/components/ui/MyOrders.jsx` ✅ Updated (API integration, order listing, categorization, enhanced UI)
- `client/src/pages/OrderDetails.jsx` ✅ Updated (API integration, enhanced UI with status tracking, progress steps)
- `client/src/components/ui/OrderStatus.jsx` ✅ Updated (order status badges, payment status display, progress tracking)
- `client/src/components/ui/OrderItems.jsx` ✅ Updated (variant name display, product name as subtitle)
- `client/src/components/ui/OrderSummaryBreakdown.jsx` ✅ Updated (enhanced UI, "Tax" instead of "GST")
- `client/src/styles/components/ui-components/my-orders.css` ✅ Updated
- `client/src/styles/components/ui-components/order-status.css` ✅ Updated (cancelled/refunded states)
- `client/src/styles/components/ui-components/order-summary-breakdown.css` ✅ Updated (modern card design)
- `client/src/pages/OrderDetails.css` ✅ Updated (enhanced order information section)

**Features Implemented**:
- ✅ List user orders with pagination
- ✅ Categorize orders into "Current" and "Past" based on status
- ✅ Order details display (order number, total amount, status, payment status)
- ✅ Order status tracking (pending, confirmed, processing, ready_for_pickup, out_for_delivery, delivered, cancelled, refunded)
- ✅ Payment status display (pending, paid, failed, refunded)
- ✅ Order type display (delivery, pickup)
- ✅ Estimated delivery time display
- ✅ Cancel order functionality (with cancellation reason as query parameter)
- ✅ Order date formatting
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Empty states
- ✅ Order status badges
- ✅ Order date display
- ✅ **Order Details Page**: Full API integration with order details, items, delivery address
- ✅ **Order Details UI**: Enhanced design with gradient headers, modern cards, progress tracking
- ✅ **Status Handling**: Visual indicators for cancelled, refunded, ready_for_pickup statuses
- ✅ **Progress Steps**: Dynamic progress tracking based on order status and type
- ✅ **Order Information**: Enhanced card layout with improved typography and spacing
- ✅ **Total Amount Section**: Modern card design with "Tax" label (instead of "GST")
- ✅ **My Orders UI**: Enhanced display with discount amounts, delivery dates, cancellation reasons

**Key Implementation Details**:
- Orders service uses apiClient pattern with error handling
- Orders categorized into "Current" (active) and "Past" (completed/cancelled)
- Cancel order uses PUT method with cancellation_reason as query parameter (per OpenAPI spec)
- Order status and payment status displayed with badges
- Order dates formatted for display
- All mock data dependencies removed
- Order creation API ready (UI integration pending)
- **Order Details Page**: Fetches order details with items, delivery address, and all order information
- **Status Mapping**: Full support for all order statuses (pending, confirmed, processing, ready_for_pickup, out_for_delivery, delivered, cancelled, refunded)
- **Progress Tracking**: Dynamic progress steps based on order status and type (delivery vs pickup)
- **UI Enhancements**: Modern card designs with gradient headers, improved typography (Inter font), better spacing
- **Variant Display**: Order items show variant_name as primary, product_name as secondary
- **Responsive Design**: All components fully responsive with mobile optimizations

**Time Taken**: Completed

---

### 6. Wishlist Module ❤️ ✅ **COMPLETED**
**Why Sixth**: Additional feature - users can save products for later.

**APIs Integrated**:
- `GET /wishlists/` - Get all wishlists for user ✅ Completed
- `GET /wishlists/default` - Get default wishlist ✅ Completed
- `GET /wishlists/{wishlist_id}` - Get wishlist by ID ✅ Completed
- `GET /wishlists/{wishlist_id}/details` - Get wishlist details with items ✅ Completed
- `GET /wishlists/{wishlist_id}/items` - Get wishlist items ✅ Completed
- `POST /wishlists/` - Create new wishlist ✅ Completed
- `PUT /wishlists/{wishlist_id}` - Update wishlist name ✅ Completed
- `DELETE /wishlists/{wishlist_id}` - Delete wishlist ✅ Completed
- `POST /wishlists/items` - Add item to wishlist ✅ Completed
- `DELETE /wishlists/items/{item_id}` - Remove item from wishlist ✅ Completed

**Files Updated/Created**:
- `client/src/services/api/wishlist.js` ✅ Created (all wishlist APIs using apiClient)
- `client/src/components/ui/Wishlist.jsx` ✅ Updated (full CRUD, multiple wishlists, tabbed UI)
- `client/src/components/ui/ProductCard.jsx` ✅ Updated (wishlist integration, skipWishlistCheck prop)
- `client/src/pages/ProductDetail.jsx` ✅ Updated (wishlist API integration)
- `client/src/components/ui/ProductInfo.jsx` ✅ Updated (wishlist state management)
- `client/src/pages/UserDashboard.jsx` ✅ Updated (wishlist tab)
- `client/src/utils/constants.js` ✅ Updated (wishlist endpoints)
- `client/src/services/api/index.js` ✅ Updated (WishlistService export)
- `client/src/styles/components/ui-components/wishlist.css` ✅ Updated (tabbed UI styling)

**Features Implemented**:
- ✅ Get or create default wishlist
- ✅ Get all wishlists for user
- ✅ Multiple wishlists support with tabbed UI
- ✅ Create new wishlist
- ✅ Update wishlist name and visibility
- ✅ Delete wishlist (default wishlist protected)
- ✅ Add product variant to wishlist
- ✅ Remove item from wishlist
- ✅ List wishlist items with product details
- ✅ Move wishlist item to cart
- ✅ Wishlist status check on product cards
- ✅ Wishlist integration in Product Detail page
- ✅ Default wishlist protection (cannot edit/delete)
- ✅ Optimized API calls (prevent duplicate calls)
- ✅ Product name and variant name display (variant as main, product as secondary)
- ✅ Correct price display (discounted_sale_price, sale_price logic)
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Empty wishlist state
- ✅ Success notifications
- ✅ Responsive UI with horizontal tabs
- ✅ Product grid layout (3 per row on large screens)

**Key Implementation Details**:
- Wishlist service uses apiClient pattern with error handling
- Multiple wishlists supported with tabbed navigation
- Default wishlist ("My Wishlist") cannot be edited or deleted
- ProductCard has skipWishlistCheck prop to prevent duplicate API calls in wishlist view
- Wishlist status checked on mount for authenticated users
- ProductDetail page checks and updates wishlist status
- Optimized API calls using refs to prevent duplicate requests
- Variant name displayed as main title, product name as secondary text
- Price logic matches Products page (discounted_sale_price > sale_price, originalPrice only on discount)
- All mock data dependencies removed
- UI rearranged with wishlist tabs at top, full-width product grid

**Time Taken**: Completed

---

### 7. Checkout & Payment Module 💳 ✅ **COMPLETED**
**Why Seventh**: Complete the order flow - users need to checkout and pay for orders.

**APIs Integrated**:
- `GET /shopping-cart/{cart_id}/items/with-pricing` - Get cart items with pricing (includes variant_name, variant_image_url, total_amount) ✅ Completed
- `GET /users/addresses` - List user addresses ✅ Completed
- `PUT /users/addresses/{address_id}/set-default` - Set default address ✅ Completed
- `POST /orders/` - Create new order ✅ Completed
- `POST /product-service/stripe/payment-intents` - Create payment intent ✅ Completed
- `GET /product-service/stripe/payment-intents/{id}` - Get payment intent ✅ Completed
- `POST /product-service/stripe/payment-intents/{id}/confirm` - Confirm payment intent ✅ Completed

**Files Updated/Created**:
- `client/src/pages/Checkout.jsx` ✅ Updated (API integration, order creation, simplified totals)
- `client/src/components/ui/DeliveryInfo.jsx` ✅ Updated (address selection from API)
- `client/src/components/ui/OrderSummary.jsx` ✅ Updated (variant_name as primary, images, simplified pricing)
- `client/src/services/api/cart.js` ✅ Updated (removed getCartSummary, using items-with-pricing only)
- `client/src/context/CartContext.jsx` ✅ Updated (removed summary API usage, using items-with-pricing for totals)
- `client/src/components/ui/CartSidebar.jsx` ✅ Updated (variant_image_url support)
- `client/src/services/api/stripe.js` ✅ Created (Stripe payment service)
- `client/src/components/stripe/StripeProvider.jsx` ✅ Created (Stripe Elements provider)
- `client/src/components/ui/PaymentForm.jsx` ✅ Created (Stripe payment form)
- `client/src/pages/Payment.jsx` ✅ Created (Payment processing page)
- `client/src/pages/PaymentSuccess.jsx` ✅ Created (Payment success page with enhanced UI)
- `client/src/pages/Payment.css` ✅ Created
- `client/src/pages/PaymentSuccess.css` ✅ Created (Enhanced design with gradient backgrounds, modern cards)
- `client/src/styles/components/ui-components/payment-form.css` ✅ Created
- `client/src/styles/components/ui-components/order-summary.css` ✅ Updated (item image and layout styles)
- `client/src/utils/constants.js` ✅ Updated (Stripe endpoints, removed cart summary endpoint)
- `client/src/App.jsx` ✅ Updated (payment routes)
- `client/.env.local` ✅ Updated (Stripe publishable key: VITE_STRIPE_PUBLISHABLE_KEY)

**Features Implemented**:
- ✅ Load cart items with variant_name, variant_image_url, and total_amount from API
- ✅ Simplified pricing: Use total_amount as both subtotal and total (no separate tax/shipping)
- ✅ Load user addresses from API
- ✅ Select and set default address
- ✅ Transform cart items to order items format (includes variant_name, variant_image_url)
- ✅ Transform delivery preferences to API format
- ✅ Create order via API with all required fields
- ✅ Handle order creation errors and loading states
- ✅ Redirect to payment page for card payments
- ✅ Redirect to order details for COD payments
- ✅ Create Stripe payment intent with order_id automatically on payment page load
- ✅ Display Stripe payment form with Elements (PaymentElement component)
- ✅ Process payment with Stripe (confirmPayment)
- ✅ Show payment success page with order details
- ✅ Clear cart after successful order creation
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Order items table shows variant_name as primary name with variant_image_url
- ✅ Product name shown as secondary text (if different from variant_name)
- ✅ Simplified order summary (Subtotal, Discount if any, Total only - no tax/shipping)
- ✅ **Payment Success Page**: Enhanced UI with gradient backgrounds, animated success icon, modern information cards
- ✅ **Payment Success Features**: Order information card, payment details card, support section with contact info, action buttons

**Key Implementation Details**:
- **Cart API Changes**: Removed dependency on `/shopping-cart/{cart_id}/summary` endpoint
- **Single Source of Truth**: All cart totals now come from `GET /shopping-cart/{cart_id}/items/with-pricing` response
- **Response Structure**: API now returns `variant_name` and `variant_image_url` in cart items
- **Pricing Logic**: Uses `total_amount` from API response as both subtotal and total (backend handles all calculations)
- **Order Summary UI**: 
  - Variant name displayed as primary text
  - Variant image displayed in table
  - Product name shown as secondary text (only if different from variant name)
  - Simplified pricing breakdown (Subtotal → Discount → Total)
- **Stripe Integration**:
  - Payment intent created automatically when `/payment` page loads
  - Uses `VITE_STRIPE_PUBLISHABLE_KEY` from environment variables
  - Stripe Elements renders PaymentElement for secure card input
  - Payment confirmation handled via `stripe.confirmPayment()`
  - Success redirects to `/payment-success` with order details
- **Order Creation Flow**:
  1. User fills checkout form (delivery info, payment method)
  2. Click "Place Order" → Creates order via `POST /orders/`
  3. For card payments → Redirects to `/payment` with orderId
  4. Payment page auto-creates Stripe payment intent
  5. User enters card details → Stripe confirms payment
  6. Redirects to `/payment-success` → Shows order confirmation
  7. Cart is cleared after successful order creation
- **Post-Payment Status Update**: 
  - Backend must update order status via `PUT /admin/orders/{order_id}/status` after Stripe confirms payment
  - This should be handled server-side (via webhook or order service), not from customer client
  - Customer client only confirms payment with Stripe; backend handles order status updates

**Environment Setup**:
- Required environment variable: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` in `.env.local`
- Must restart dev server after adding/updating environment variables
- Stripe publishable key is used to initialize Stripe.js in StripeProvider

**Time Taken**: Completed

---

## 📋 Integration Checklist

### Per Module Integration Steps:
1. [ ] Create/Update API client configuration
2. [ ] Create/Update error handler utility
3. [ ] Create/Update response handler utility
4. [ ] Update service file with real API endpoints
5. [ ] Remove mock data imports
6. [ ] Add error handling
7. [ ] Test API integration
8. [ ] Update components to handle API responses
9. [ ] Add loading states
10. [ ] Add toast notifications
11. [ ] Test all CRUD operations
12. [ ] Update context providers (if applicable)
13. [ ] Update documentation

---

## 🔧 Integration Template

For each module, follow this pattern:

```javascript
// Service File Template
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils'

const moduleService = {
  async getItems(params = {}) {
    try {
      const response = await apiClient.get('/module', { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getItemById(id) {
    try {
      const response = await apiClient.get(`/module/${id}`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  async createItem(data) {
    try {
      const response = await apiClient.post('/module', data)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateItem(id, data) {
    try {
      const response = await apiClient.put(`/module/${id}`, data)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  async deleteItem(id) {
    try {
      const response = await apiClient.delete(`/module/${id}`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
}

export default moduleService
```

---

## 🎯 Current Status

✅ **Completed**:
- Authentication Module (Priority 1) ✅
  - User Registration
  - User Login
  - Get Current User
  - Change Password
  - Token Management
  - Error Handling (no page reload on auth errors)
- Products & Categories Module (Priority 2) ✅
  - List Categories (API integrated and tested)
  - Filter Product Variants (API integrated and tested)
  - Get Product Full Details (API integrated and tested)
  - Featured Products (API integrated and tested)
  - Related Products (API integrated and tested)
  - Pagination Support (API integrated and tested)
  - Category Filtering (API integrated and tested)
  - Category Images Integration (API integrated, responsive thumbnails)
  - Loading & Error States (Fully implemented)
  - Mock Data Removal (All components updated)
- Product Reviews Module (Priority 2.5) ✅
  - List Product Reviews (with filters and sorting)
  - Submit New Reviews (with authentication)
  - Calculate and Display Average Rating
  - Review Rating Integration in ProductInfo
  - Review Submission with Validation
  - Auto-refresh Rating on New Review
- Shopping Cart Module (Priority 3) ✅
  - Get or Create Active Cart
  - Add Items to Cart (with product_id and variant_id)
  - Update Cart Item Quantity
  - Remove Items from Cart
  - Get Cart Items with Pricing
  - Get Cart Summary (item count and total amount)
  - Cart Sidebar with Compact UI
  - Product Count Display
  - Total Price Display (unit and total)
  - Cart Refresh After Operations
  - Duplicate Add Prevention
  - Optimized API Calls (summary endpoint)
  - All Mock Data Removed
- User Profile & Addresses Module (Priority 4) ✅
  - Get and Update User Profile
  - Upload Profile Image
  - Change Password
  - List User Addresses
  - Add, Update, Delete Addresses
  - Set Default Address
  - Address Management UI with CRUD
  - Profile Image Display
- Orders Module (Priority 5) ✅
  - List User Orders (with pagination)
  - Get Order Details
  - Categorize Orders (Current/Past)
  - Cancel Order (with cancellation reason)
  - Order Status Tracking
  - Payment Status Display
  - Order Type Display
  - Estimated Delivery Time
- Wishlist Module (Priority 6) ✅
  - Get All Wishlists
  - Get Default Wishlist
  - Create, Update, Delete Wishlists
  - Add/Remove Items from Wishlist
  - Multiple Wishlists Support (Tabbed UI)
  - Default Wishlist Protection
  - Wishlist Integration in Product Cards
  - Wishlist Integration in Product Detail Page
  - Optimized API Calls
  - Product Name/Variant Name Display
  - Correct Price Display
- Checkout & Payment Module (Priority 7) ✅
  - Load cart items with variant_name and variant_image_url
  - Simplified pricing (total_amount as subtotal/total)
  - Order creation with all required fields
  - Stripe payment intent creation
  - Stripe Elements payment form integration
  - Payment confirmation and success flow
  - Order summary with variant images and names
  - Cart cleared after successful order
  - Complete checkout → payment → success flow

📋 **Completed Modules**: All core modules integrated ✅

📋 **Future Enhancements**:
- Order Details Page Enhancement
- Additional payment methods (if needed)
- Real-time order status updates

---

## 📝 Notes

- All API integrations will use the established pattern from admin portal
- Error handling is standardized across all services
- Loading states should be implemented for better UX
- Test all integrations before moving to next module
- Update documentation after each integration
- Client portal uses same base URL as admin portal
- Authentication token stored in localStorage as `access_token`
- Cart is user-specific and requires authentication

---

## 🛠️ Development Guidelines

### Code Structure
- **Services**: All API calls should be in dedicated service files (`client/src/services/api/`)
- **Components**: Reusable components in `client/src/components/common/` or `client/src/components/ui/`
- **Pages**: Page-level components in `client/src/pages/`
- **Utils**: Helper functions in `client/src/utils/`
- **Config**: Configuration files in `client/src/config/`
- **Context**: Global state management in `client/src/context/`

### Service Layer Migration Pattern

**Before (Mock Data)**:
```javascript
import mockData from '../data/mockData'

const moduleService = {
  getItems: async () => {
    await delay(500)
    return { success: true, data: mockData }
  }
}
```

**After (Real API)**:
```javascript
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils'

const moduleService = {
  async getItems(params = {}) {
    try {
      const response = await apiClient.get('/module', { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
```

### Error Handling Pattern

**Error Handler Utility** (`client/src/utils/errorHandler.js`):
```javascript
export const handleApiError = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: 'network'
    }
  }

  const { status, data } = error.response

  switch (status) {
    case 401:
      // Unauthorized - token expired or invalid
      return {
        success: false,
        message: 'Unauthorized. Please login again.',
        error: 'unauthorized'
      }
    case 403:
      return {
        success: false,
        message: 'You do not have permission to perform this action.',
        error: 'forbidden'
      }
    case 404:
      return {
        success: false,
        message: 'Resource not found.',
        error: 'not_found'
      }
    case 422:
      // Validation error
      const errorMessage = data.detail?.[0]?.msg || 
                          data.message || 
                          'Validation error'
      return {
        success: false,
        message: errorMessage,
        errors: data.detail || [],
        error: 'validation'
      }
    case 500:
      return {
        success: false,
        message: 'Server error. Please try again later.',
        error: 'server'
      }
    default:
      return {
        success: false,
        message: data.message || 'An error occurred',
        error: 'unknown'
      }
  }
}
```

### Component Integration Pattern

**Example: Component with API Integration**:
```javascript
import React, { useState, useEffect } from 'react'
import { useUserContext } from '../context/UserContext'
import moduleService from '../services/api/module'
import { showToast } from '../utils/toast' // If toast utility exists

const ModuleComponent = () => {
  const { user, isAuthenticated } = useUserContext()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await moduleService.getItems()
      if (response.success) {
        setItems(response.data.items || response.data || [])
      } else {
        setError(response.message)
        showToast('error', response.message)
      }
    } catch (err) {
      setError('An error occurred while loading items')
      showToast('error', 'An error occurred while loading items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      const response = await moduleService.createItem(formData)
      if (response.success) {
        showToast('success', response.message || 'Item created successfully!')
        loadItems() // Refresh list
      } else {
        showToast('error', response.message || 'Failed to create item')
      }
    } catch (err) {
      showToast('error', 'An error occurred while creating item')
    }
  }

  if (loading) return <Loader />
  if (error) return <AlertMessage type="error" message={error} />

  // Component JSX...
}
```

### API Client Configuration

**File**: `client/src/config/apiClient.js`
```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://3.106.58.15:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.params || config.data)
    }
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  async (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data || error.message,
      })
    }
    // Handle 401 Unauthorized - token expired or invalid
    // Only redirect if:
    // 1. It's a 401 error
    // 2. The request had a token (authenticated request)
    // 3. It's NOT a login/register endpoint (those can fail with 401 for wrong credentials)
    if (error.response?.status === 401 && !error.config._retry) {
      const requestUrl = error.config?.url || ''
      const isAuthEndpoint = requestUrl.includes('/auth/login') || 
                            requestUrl.includes('/auth/register')
      const hadToken = error.config.headers?.Authorization
      
      // Only redirect if it was an authenticated request (had token) and not a login/register attempt
      if (hadToken && !isAuthEndpoint) {
        error.config._retry = true
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/'
        }
      }
      // For login/register 401 errors, just reject the promise (don't redirect)
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Environment Configuration

**File Structure**:
```
client/
├── .env.local          # Local development (gitignored)
├── .env.staging        # Staging environment
└── .env.production     # Production environment
```

**Example `.env.local`**:
```env
VITE_API_BASE_URL=http://3.106.58.15:8000
```

**Usage in Code**:
```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // ...
})
```

### File Naming Conventions
- **Services**: `{module}.js` (e.g., `auth.js`, `cart.js`)
- **Components**: `{ComponentName}.jsx` (PascalCase)
- **Pages**: `{PageName}.jsx` (PascalCase)
- **Utils**: `{utilName}.js` (camelCase)
- **Config**: `{configName}.js` (camelCase)

### State Management Best Practices

1. **Context State**:
   - Use React Context for global state (User, Cart)
   - Use local state for component-specific state
   - Clear state on logout/unmount
   - Reset form data after successful submission

2. **Loading States**:
   - Always show loading indicator during API calls
   - Use skeleton loaders for list views
   - Disable buttons during submission

3. **Error States**:
   - Handle errors gracefully
   - Show user-friendly error messages
   - Log detailed errors for debugging

### Testing Checklist

For each module integration:
- [ ] Test GET operations (list, by ID)
- [ ] Test CREATE operation
- [ ] Test UPDATE operation
- [ ] Test DELETE operation
- [ ] Test error handling (network, validation, server errors)
- [ ] Test loading states
- [ ] Test toast notifications
- [ ] Test form validation
- [ ] Test pagination (if applicable)
- [ ] Test search/filter (if applicable)
- [ ] Test authentication flow
- [ ] Test protected routes

---

## 📊 API Endpoints Reference

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PUT /users/change-password` - Change password

### Products & Categories
- `GET /product-service/categories/` - List categories
- `GET /product-service/products/variants/filter` - Filter product variants
- `GET /product-service/products/{product_id}/full` - Get full product details

### Product Reviews
- `GET /product-service/reviews/` - List product reviews (with filters)
- `GET /product-service/reviews/{review_id}` - Get single review
- `POST /product-service/reviews/` - Create new review
- `PUT /product-service/reviews/{review_id}` - Update review
- `DELETE /product-service/reviews/{review_id}` - Delete review

### Shopping Cart
- `GET /shopping-cart/user/{user_id}/active` - Get active cart ✅
- `POST /shopping-cart/` - Create cart ✅
- `POST /shopping-cart/items/` - Add item to cart ✅
- `GET /shopping-cart/{cart_id}/items/with-pricing` - Get cart items with pricing (includes variant_name, variant_image_url, total_amount) ✅
- `PUT /shopping-cart/items/{cart_item_id}` - Update cart item ✅
- `DELETE /shopping-cart/items/{cart_item_id}` - Remove cart item ✅

### User Profile & Addresses
- `GET /users/profile` - Get profile
- `PUT /users/profile` - Update profile
- `GET /users/addresses` - List addresses
- `POST /users/addresses` - Add address
- `GET /users/addresses/{address_id}` - Get address
- `PUT /users/addresses/{address_id}` - Update address
- `DELETE /users/addresses/{address_id}` - Delete address
- `PUT /users/addresses/{address_id}/set-default` - Set default address

### Orders
- `POST /orders/` - Create order ✅
- `GET /orders/` - List orders ✅
- `GET /orders/{order_id}` - Get order ✅
- `GET /orders/{order_id}/details` - Get order details with items ✅
- `PUT /orders/{order_id}/cancel` - Cancel order ✅

### Stripe Payments
- `POST /product-service/stripe/payment-intents` - Create payment intent ✅
- `GET /product-service/stripe/payment-intents/{id}` - Get payment intent ✅
- `POST /product-service/stripe/payment-intents/{id}/confirm` - Confirm payment intent ✅

### Wishlist
- `GET /wishlists/default` - Get default wishlist
- `GET /wishlists/{wishlist_id}/details` - Get wishlist details
- `GET /wishlists/{wishlist_id}/items` - Get wishlist items
- `POST /wishlists/` - Create wishlist
- `PUT /wishlists/{wishlist_id}` - Update wishlist
- `POST /wishlists/items` - Add item to wishlist
- `DELETE /wishlists/items/{item_id}` - Remove item from wishlist

---

**Last Updated**: 2025-01-28  
**Status**: 
- ✅ Authentication Module Completed
- ✅ Products & Categories Module Completed
- ✅ Product Reviews Module Completed
- ✅ Shopping Cart Module Completed (updated to use items-with-pricing only, removed summary endpoint)
- ✅ User Profile & Addresses Module Completed
- ✅ Orders Module Completed (Listing, Details, Enhanced UI)
- ✅ Wishlist Module Completed
- ✅ Checkout & Payment Module Completed (Enhanced UI)

**Current Status**: 
- ✅ All core modules fully integrated and tested
- ✅ Complete checkout → payment → success flow working
- ✅ Stripe payment integration complete with Elements
- ✅ Cart API updated to use items-with-pricing endpoint (includes variant_name, variant_image_url)
- ✅ Simplified pricing model (total_amount as subtotal/total, no separate tax/shipping)
- ✅ Order summary displays variant images and names
- ✅ Order Details page fully integrated with API and enhanced UI
- ✅ Payment Success page enhanced with modern design
- ✅ My Orders page enhanced with better information display
- ✅ Order status tracking with visual progress indicators
- ✅ Support for all order statuses (cancelled, refunded, ready_for_pickup, etc.)
- ✅ UI improvements: Modern card designs, gradient headers, improved typography
- ⚠️ Backend must handle order status updates after Stripe payment confirmation (via webhook or order service)

**UI Enhancements Completed**:
- ✅ Order Details page: Enhanced design with gradient headers, progress tracking, modern cards
- ✅ Payment Success page: Improved layout with information cards, better typography
- ✅ My Orders page: Enhanced display with discount amounts, delivery dates, status badges
- ✅ Order Summary Breakdown: Modern card design with "Tax" label
- ✅ Order Information section: Improved grid layout and typography
- ✅ Hidden sections: "Half Price Special" from home page, "Popular & Suggested" from browse sidebar

**Integration Complete**: All customer portal modules are now fully integrated with backend APIs and enhanced UI

