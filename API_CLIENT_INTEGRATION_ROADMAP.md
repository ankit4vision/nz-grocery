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
│       │   │   ├── cart.js                    # ⏳ Shopping cart service (TO BE UPDATED)
│       │   │   ├── orders.js                  # ⏳ Orders service (TO BE UPDATED)
│       │   │   ├── users.js                   # ⏳ User profile & addresses service (TO BE UPDATED)
│       │   │   └── wishlist.js                # ⏳ Wishlist service (TO BE CREATED)
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
│       │   │   ├── CartSidebar.jsx             # ⏳ Cart sidebar (TO BE UPDATED)
│       │   │   ├── Wishlist.jsx                # ⏳ Wishlist component (TO BE UPDATED)
│       │   │   ├── MyOrders.jsx                # ⏳ Orders list (TO BE UPDATED)
│       │   │   ├── ProfileInformation.jsx      # ⏳ Profile form (TO BE UPDATED)
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
│       │   ├── Checkout.jsx                    # ⏳ Checkout page (TO BE UPDATED)
│       │   ├── UserDashboard.jsx               # ⏳ User dashboard (TO BE UPDATED)
│       │   ├── OrderDetails.jsx                # ⏳ Order details page (TO BE UPDATED)
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
- ⏳ `products.js` - Product browsing and details
- ⏳ `categories.js` - Category listing
- ⏳ `cart.js` - Shopping cart operations
- ⏳ `orders.js` - Order management (create, list, details, cancel)
- ⏳ `users.js` - User profile and addresses
- ⏳ `wishlist.js` - Wishlist management (TO BE CREATED)

#### 🎨 Component Files

**Common Components** (`client/src/components/common/`):
- ✅ **`Loader.jsx`** - Loading spinner
- ✅ **`AlertMessage.jsx`** - Alert/Toast component
- ⏳ Other components may need updates

**UI Components** (`client/src/components/ui/`):
- ✅ **`LoginModal.jsx`** - Login modal
- ✅ **`SignupModal.jsx`** - Signup modal
- ⏳ **`ProductCard.jsx`** - Product card (needs API integration)
- ⏳ **`ProductGrid.jsx`** - Product grid (needs API integration)
- ⏳ **`CartSidebar.jsx`** - Cart sidebar (needs API integration)
- ⏳ **`Wishlist.jsx`** - Wishlist component (needs API integration)
- ⏳ **`MyOrders.jsx`** - Orders list (needs API integration)
- ⏳ **`ProfileInformation.jsx`** - Profile form (needs API integration)

#### 📄 Page Files

**Page Files** (`client/src/pages/`):
- ⏳ **`Home.jsx`** - Home page (needs products/categories API)
- ⏳ **`Products.jsx`** - Products listing page (needs products API)
- ⏳ **`ProductDetail.jsx`** - Product detail page (needs product details API)
- ⏳ **`Checkout.jsx`** - Checkout page (needs cart and order APIs)
- ⏳ **`UserDashboard.jsx`** - User dashboard (needs profile, orders APIs)
- ⏳ **`OrderDetails.jsx`** - Order details page (needs order details API)

#### 🔐 Context Files

**`client/src/context/UserContext.jsx`** ✅ **COMPLETED**
- **Purpose**: Global user authentication state management
- **Status**: Uses real API services (AuthService)
- **Features**: User state, login, logout, token management, auto token verification

**`client/src/context/CartContext.jsx`** ⏳ **TO BE UPDATED**
- **Purpose**: Global shopping cart state management
- **Current**: Uses localStorage and mock data
- **Target**: Use real cart API service
- **Features**: Cart items, add/remove/update items, cart totals

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

### Priority 2: Products & Categories Module 🛍️
**Why Second**: Core functionality - users need to browse products and categories.

**APIs to Integrate**:
- `GET /product-service/categories/` - List all categories
- `GET /product-service/products/variants/filter` - Filter and list product variants (with pagination, filters: product_name, category_id)
- `GET /product-service/products/{product_id}/full` - Get full product details

**Files to Update**:
- `client/src/services/api/categories.js` ⏳ Update
- `client/src/services/api/products.js` ⏳ Update
- `client/src/pages/Home.jsx` ⏳ Update
- `client/src/pages/Products.jsx` ⏳ Update
- `client/src/pages/ProductDetail.jsx` ⏳ Update
- `client/src/components/ui/ProductCard.jsx` ⏳ Update
- `client/src/components/ui/ProductGrid.jsx` ⏳ Update
- `client/src/components/ui/FeaturedProducts.jsx` ⏳ Update
- `client/src/components/ui/CategoryOverview.jsx` ⏳ Update

**Features to Implement**:
- List all categories (for navigation/sidebar)
- Filter products by category
- Search products by name
- Product variants list with pagination
- Product detail page with full information
- Product images gallery
- Product attributes display
- Product variants selection
- Bulk pricing display
- Related products
- Loading states and error handling
- Empty states
- Toast notifications

**Estimated Time**: 6-8 hours

---

### Priority 3: Shopping Cart Module 🛒
**Why Third**: Essential for e-commerce - users need to add items to cart and manage cart.

**APIs to Integrate**:
- `GET /shopping-cart/user/{user_id}/active` - Get active cart for user
- `POST /shopping-cart/` - Create new cart
- `POST /shopping-cart/items/` - Add item to cart
- `GET /shopping-cart/{cart_id}/items/with-pricing` - Get cart items with pricing
- `PUT /shopping-cart/items/{cart_item_id}` - Update cart item quantity
- `DELETE /shopping-cart/items/{cart_item_id}` - Remove item from cart

**Files to Update**:
- `client/src/services/api/cart.js` ⏳ Update
- `client/src/context/CartContext.jsx` ⏳ Update
- `client/src/components/ui/CartSidebar.jsx` ⏳ Update
- `client/src/pages/Checkout.jsx` ⏳ Update (cart summary)
- `client/src/components/ui/ProductCard.jsx` ⏳ Update (add to cart button)

**Features to Implement**:
- Get or create active cart for logged-in user
- Add product variant to cart
- Update cart item quantity
- Remove item from cart
- Get cart items with pricing (including discounts, bulk pricing)
- Cart totals calculation (subtotal, tax, shipping, total)
- Cart persistence (sync with backend)
- Cart sidebar with items list
- Empty cart state
- Loading states during cart operations
- Toast notifications for add/update/remove
- Error handling (out of stock, invalid items)

**Key Implementation Details**:
- Cart is user-specific (requires authentication)
- Cart ID stored in context after creation
- Cart items include variant_id, quantity
- Pricing calculated server-side (bulk pricing, discounts)
- Cart syncs with backend on every change

**Estimated Time**: 5-6 hours

---

### Priority 4: User Profile & Addresses Module 👤
**Why Fourth**: Users need to manage their profile and delivery addresses.

**APIs to Integrate**:
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/addresses` - List user addresses (with optional only_active filter)
- `POST /users/addresses` - Add new address
- `GET /users/addresses/{address_id}` - Get address details
- `PUT /users/addresses/{address_id}` - Update address
- `DELETE /users/addresses/{address_id}` - Delete address
- `PUT /users/addresses/{address_id}/set-default` - Set default address

**Files to Update**:
- `client/src/services/api/users.js` ⏳ Update
- `client/src/pages/UserDashboard.jsx` ⏳ Update
- `client/src/components/ui/ProfileInformation.jsx` ⏳ Update
- `client/src/components/ui/ChangePassword.jsx` ⏳ Update
- `client/src/pages/Checkout.jsx` ⏳ Update (address selection)

**Features to Implement**:
- Get user profile information
- Update profile (name, phone, date of birth, gender)
- List user addresses
- Add new address
- Update existing address
- Delete address
- Set default address
- Address validation
- Address selection in checkout
- Profile image upload (if supported)
- Change password functionality
- Toast notifications
- Loading states
- Form validation

**Estimated Time**: 4-5 hours

---

### Priority 5: Orders Module 📦
**Why Fifth**: Users need to place orders and view order history.

**APIs to Integrate**:
- `POST /orders/` - Create new order
- `GET /orders/` - List user orders (with pagination, filters: status, date range)
- `GET /orders/{order_id}` - Get order details
- `GET /orders/{order_id}/details` - Get order details with items
- `PUT /orders/{order_id}/cancel` - Cancel order (with cancellation_reason)

**Files to Update**:
- `client/src/services/api/orders.js` ⏳ Update
- `client/src/pages/Checkout.jsx` ⏳ Update (order creation)
- `client/src/pages/UserDashboard.jsx` ⏳ Update (orders list)
- `client/src/pages/OrderDetails.jsx` ⏳ Update
- `client/src/components/ui/MyOrders.jsx` ⏳ Update
- `client/src/components/ui/OrderItems.jsx` ⏳ Update
- `client/src/components/ui/OrderStatus.jsx` ⏳ Update
- `client/src/components/ui/OrderSummary.jsx` ⏳ Update

**Features to Implement**:
- Create order from cart
- Order confirmation page
- List user orders with pagination
- Filter orders by status
- Order details page with complete information
- Order items display with images
- Order status tracking
- Order timeline/progress
- Cancel order functionality
- Order invoice/receipt
- Payment status display
- Shipping address display
- Order totals breakdown
- Toast notifications
- Loading states
- Error handling

**Key Implementation Details**:
- Order creation requires authenticated user
- Order includes cart items, shipping address, payment method
- Order status: pending, confirmed, processing, ready_for_pickup, out_for_delivery, delivered, cancelled, refunded
- Payment status: pending, paid, failed, refunded
- Order cancellation requires reason

**Estimated Time**: 6-7 hours

---

### Priority 6: Wishlist Module ❤️
**Why Sixth**: Additional feature - users can save products for later.

**APIs to Integrate**:
- `GET /wishlists/default` - Get default wishlist
- `GET /wishlists/{wishlist_id}/details` - Get wishlist details
- `GET /wishlists/{wishlist_id}/items` - Get wishlist items
- `POST /wishlists/` - Create new wishlist
- `PUT /wishlists/{wishlist_id}` - Update wishlist name
- `POST /wishlists/items` - Add item to wishlist
- `DELETE /wishlists/items/{item_id}` - Remove item from wishlist

**Files to Update/Create**:
- `client/src/services/api/wishlist.js` ⏳ Create
- `client/src/components/ui/Wishlist.jsx` ⏳ Update
- `client/src/components/ui/ProductCard.jsx` ⏳ Update (wishlist button)
- `client/src/pages/UserDashboard.jsx` ⏳ Update (wishlist section)
- `client/src/hooks/useFavorites.js` ⏳ Update

**Features to Implement**:
- Get or create default wishlist
- Add product variant to wishlist
- Remove item from wishlist
- List wishlist items
- Wishlist item count badge
- Move wishlist item to cart
- Wishlist management (create, rename, delete wishlists)
- Toast notifications
- Loading states
- Empty wishlist state

**Estimated Time**: 3-4 hours

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
- Authentication Module (Priority 1)
  - User Registration
  - User Login
  - Get Current User
  - Change Password
  - Token Management
  - Error Handling (no page reload on auth errors)

⏳ **In Progress**:
- None

📋 **Next Up**:
- Priority 2: Products & Categories Module
- Priority 3: Shopping Cart Module
- Priority 4: User Profile & Addresses Module
- Priority 5: Orders Module
- Priority 6: Wishlist Module

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

### Shopping Cart
- `GET /shopping-cart/user/{user_id}/active` - Get active cart
- `POST /shopping-cart/` - Create cart
- `POST /shopping-cart/items/` - Add item to cart
- `GET /shopping-cart/{cart_id}/items/with-pricing` - Get cart items with pricing
- `PUT /shopping-cart/items/{cart_item_id}` - Update cart item
- `DELETE /shopping-cart/items/{cart_item_id}` - Remove cart item

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
- `POST /orders/` - Create order
- `GET /orders/` - List orders
- `GET /orders/{order_id}` - Get order
- `GET /orders/{order_id}/details` - Get order details with items
- `PUT /orders/{order_id}/cancel` - Cancel order

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
**Status**: Authentication Module Completed - Ready for Products & Categories Module  
**Next Step**: Start Priority 2 - Products & Categories Module Integration

