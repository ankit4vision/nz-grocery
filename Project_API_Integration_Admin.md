# NZ Grocery Admin - API Integration Plan

## 📋 Overview

This document outlines the comprehensive API integration strategy for migrating from mock data to real API endpoints in the NZ Grocery Admin application.

---

## 🎯 Migration Strategy

### Current State
- **Service Layer**: Well-structured with consistent patterns across all services
- **Mock Data**: Comprehensive JSON files with realistic data structures
- **API Endpoints**: Already defined in `constants/api.js` with proper organization
- **Error Handling**: Basic error handling structure in place
- **Loading States**: Mock delays implemented for realistic UX

### Target State
- **Real API Integration**: All services connected to backend APIs
- **Comprehensive Error Handling**: Robust error management with user-friendly messages
- **Loading States**: Proper loading indicators throughout the application
- **Authentication**: JWT-based authentication with token refresh
- **Optimistic Updates**: Immediate UI feedback for better UX

---

## 📁 Project Structure Reference

```
admin/
├── src/
│   ├── 📁 constants/
│   │   └── api.js                    # API endpoint definitions
│   │
│   ├── 📁 services/                  # API service layer
│   │   ├── authService.js            # Authentication service
│   │   ├── userService.js           # User management service
│   │   ├── productService.js        # Product management service
│   │   ├── orderService.js          # Order management service
│   │   ├── customerService.js       # Customer management service
│   │   ├── inventoryService.js      # Inventory management service
│   │   ├── contentService.js        # Content management service
│   │   ├── categoryService.js       # Category management service
│   │   ├── subCategoryService.js    # Subcategory management service
│   │   ├── roleService.js           # Role management service
│   │   ├── settingsService.js       # Settings service
│   │   └── README.md                # Services documentation
│   │
│   ├── 📁 config/
│   │   └── apiClient.js             # Axios configuration (TO BE CREATED)
│   │
│   └── 📁 utils/
│       ├── errorHandler.js          # Error handling utilities (TO BE CREATED)
│       └── responseHandler.js       # Response handling utilities (TO BE CREATED)
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation Setup ⚙️

#### 1.1 API Client Configuration
**File**: `admin/src/config/apiClient.js`

**Purpose**: Set up Axios instance with interceptors for request/response handling

**Features**:
- Base URL configuration
- Request interceptors (add auth tokens, logging)
- Response interceptors (error handling, token refresh)
- Default headers
- Request timeout configuration
- Retry logic for failed requests

**Implementation**:
```javascript
import axios from 'axios'
import { API_ENDPOINTS, REQUEST_CONFIG } from '../constants/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: REQUEST_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // Implement token refresh logic
      const refreshed = await refreshToken()
      if (refreshed) {
        return apiClient(originalRequest)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
```

#### 1.2 Error Handler Utility
**File**: `admin/src/utils/errorHandler.js`

**Purpose**: Centralized error handling with user-friendly messages

**Features**:
- Error classification (Network, Validation, Auth, Server)
- Error message formatting
- Error logging
- Toast notification integration

**Implementation**:
```javascript
import { API_ERRORS } from '../constants/api'

export const handleApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      success: false,
      message: API_ERRORS.NETWORK_ERROR,
      error: 'network'
    }
  }
  
  const { status, data } = error.response
  
  switch (status) {
    case 401:
      return {
        success: false,
        message: API_ERRORS.UNAUTHORIZED,
        error: 'unauthorized'
      }
    case 403:
      return {
        success: false,
        message: API_ERRORS.FORBIDDEN,
        error: 'forbidden'
      }
    case 404:
      return {
        success: false,
        message: API_ERRORS.NOT_FOUND,
        error: 'not_found'
      }
    case 422:
      return {
        success: false,
        message: data.message || API_ERRORS.VALIDATION_ERROR,
        errors: data.errors,
        error: 'validation'
      }
    default:
      return {
        success: false,
        message: data.message || API_ERRORS.SERVER_ERROR,
        error: 'server'
      }
  }
}
```

#### 1.3 Response Handler Utility
**File**: `admin/src/utils/responseHandler.js`

**Purpose**: Standardized response formatting

**Implementation**:
```javascript
export const handleApiResponse = (response) => {
  return {
    success: true,
    data: response.data,
    message: response.data.message || 'Operation successful'
  }
}

export const formatErrorResponse = (error) => {
  return {
    success: false,
    data: null,
    message: error.message || 'An error occurred',
    errors: error.errors || []
  }
}
```

---

### Phase 2: Service Layer Migration 🔄

#### 2.1 Service Migration Pattern

**Before (Mock Data)**:
```javascript
import productsData from '../mock/products.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const productService = {
  getProducts: async () => {
    await delay(500)
    return { success: true, data: productsData }
  }
}
```

**After (Real API)**:
```javascript
import apiClient from '../config/apiClient'
import { API_ENDPOINTS } from '../constants/api'
import { handleApiError, handleApiResponse } from '../utils'

const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params })
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id))
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, productData)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
```

#### 2.2 Priority Order for Service Migration

1. **Authentication Service** (authService.js)
   - Login, Register, Logout
   - Token management and refresh
   - Password reset/forgot password

2. **User Management Service** (userService.js)
   - User CRUD operations
   - Profile management
   - User status management

3. **Product Management Service** (productService.js)
   - Product CRUD operations
   - Image upload handling
   - Product search and filtering

4. **Category Management Service** (categoryService.js)
   - Category CRUD operations
   - Subcategory management

5. **Order Management Service** (orderService.js)
   - Order CRUD operations
   - Order status management
   - Order filtering and search

6. **Customer Management Service** (customerService.js)
   - Customer CRUD operations
   - Customer profile management

7. **Inventory Management Service** (inventoryService.js)
   - Stock tracking
   - Inventory adjustments
   - Low stock alerts

8. **Content Management Service** (contentService.js)
   - Banners, FAQs, Notifications
   - Content CRUD operations

9. **Role Management Service** (roleService.js)
   - Role CRUD operations
   - Permission management

10. **Settings Service** (settingsService.js)
    - System settings
    - Configuration management

---

### Phase 3: Enhanced Features 🎨

#### 3.1 Global Loading State Management

**Implementation**: Redux store update for global loading states

```javascript
// store.jsx - Add loading state
const initialState = {
  sidebarShow: true,
  theme: getInitialTheme(),
  loading: {
    global: false,
    services: {}
  }
}
```

#### 3.2 Error Handling & User Feedback

**Toast Notification Integration**:
- Success messages for successful operations
- Error messages for failed operations
- Warning messages for validation issues
- Info messages for informational updates

#### 3.3 Loading States

**Types**:
- **Global Loading**: For app-wide operations
- **Component Loading**: For specific component operations
- **Skeleton Loaders**: For list views and data tables
- **Progress Bars**: For file uploads and bulk operations

---

## 📝 Migration Checklist

### Foundation Setup ✅
- [ ] Create `apiClient.js` with Axios configuration
- [ ] Create `errorHandler.js` utility
- [ ] Create `responseHandler.js` utility
- [ ] Set up environment variables for API endpoints
- [ ] Configure request/response interceptors
- [ ] Implement token refresh logic

### Service Layer Migration 📋
- [ ] **Authentication Service**
  - [ ] Login API integration
  - [ ] Register API integration
  - [ ] Logout API integration
  - [ ] Token refresh API integration
  - [ ] Forgot password API integration
  - [ ] Reset password API integration

- [ ] **User Management Service**
  - [ ] Get users API integration
  - [ ] Get user by ID API integration
  - [ ] Create user API integration
  - [ ] Update user API integration
  - [ ] Delete user API integration
  - [ ] Bulk operations API integration

- [ ] **Product Management Service**
  - [ ] Get products API integration
  - [ ] Get product by ID API integration
  - [ ] Create product API integration
  - [ ] Update product API integration
  - [ ] Delete product API integration
  - [ ] Image upload API integration

- [ ] **Category Management Service**
  - [ ] Get categories API integration
  - [ ] Create category API integration
  - [ ] Update category API integration
  - [ ] Delete category API integration

- [ ] **Order Management Service**
  - [ ] Get orders API integration
  - [ ] Get order by ID API integration
  - [ ] Update order status API integration
  - [ ] Search orders API integration

- [ ] **Customer Management Service**
  - [ ] Get customers API integration
  - [ ] Get customer by ID API integration
  - [ ] Update customer status API integration

- [ ] **Inventory Management Service**
  - [ ] Get inventory items API integration
  - [ ] Update stock API integration
  - [ ] Get inventory history API integration

- [ ] **Content Management Service**
  - [ ] Get banners API integration
  - [ ] Get FAQs API integration
  - [ ] Get notifications API integration
  - [ ] CRUD operations for content

- [ ] **Role Management Service**
  - [ ] Get roles API integration
  - [ ] CRUD operations for roles

- [ ] **Settings Service**
  - [ ] Get settings API integration
  - [ ] Update settings API integration

### Enhanced Features 🎨
- [ ] Implement global loading state management
- [ ] Add skeleton loaders for list views
- [ ] Add progress bars for file uploads
- [ ] Implement optimistic updates
- [ ] Add error boundary for API errors
- [ ] Set up toast notification system
- [ ] Implement retry logic for failed requests
- [ ] Add offline support detection

### Testing & Validation ✅
- [ ] Test authentication flow
- [ ] Test all CRUD operations for each service
- [ ] Test error handling for all scenarios
- [ ] Test loading states throughout the application
- [ ] Test token refresh logic
- [ ] Test file upload functionality
- [ ] Test search and filtering
- [ ] Test bulk operations
- [ ] Test pagination
- [ ] Cross-browser testing

---

## 🔧 Environment Configuration

### Environment Variables

**File**: `.env.example` (already exists)

Update with:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Environment
VITE_ENV=development

# Feature Flags
VITE_ENABLE_MOCK_API=false
```

### Environment-Specific Configuration

**Files to update**:
- `.env.local` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

---

## 📊 API Response Format Standards

### Success Response Format
```javascript
{
  success: true,
  data: {
    // Response data
  },
  message: "Operation successful",
  pagination: {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10
  }
}
```

### Error Response Format
```javascript
{
  success: false,
  data: null,
  message: "Error message",
  errors: [
    {
      field: "fieldName",
      message: "Error message for field"
    }
  ]
}
```

---

## 🔐 Authentication Flow

### Login Flow
1. User submits credentials
2. API validates credentials
3. API returns access token and refresh token
4. Store tokens in localStorage
5. Set authorization header for subsequent requests

### Token Refresh Flow
1. Interceptor catches 401 error
2. Attempt to refresh token using refresh token
3. Update access token in localStorage
4. Retry original request with new token

### Logout Flow
1. Call logout API
2. Clear tokens from localStorage
3. Clear Redux store
4. Redirect to login page

---

## 📈 Progress Tracking

### Phase 1: Foundation Setup
- Status: ⏳ Pending
- Start Date: TBD
- End Date: TBD

### Phase 2: Service Layer Migration
- Status: ⏳ Pending
- Start Date: TBD
- End Date: TBD

### Phase 3: Enhanced Features
- Status: ⏳ Pending
- Start Date: TBD
- End Date: TBD

---

## 🎯 Next Steps

1. **Review this plan** with the team
2. **Get API documentation** from backend team
3. **Set up API endpoints** environment variables
4. **Start with authentication** API integration
5. **Migrate services** one by one following the priority order
6. **Test thoroughly** after each service migration
7. **Deploy incrementally** to staging environment

---

## 📝 Notes

- This is a living document and will be updated as we progress
- All changes should follow the project's development guidelines
- All API integrations must include proper error handling
- All API integrations must include loading states
- All API integrations must be tested before moving to production

---

**Last Updated**: [Will be updated as migration progresses]  
**Status**: ⏳ Ready for Implementation

