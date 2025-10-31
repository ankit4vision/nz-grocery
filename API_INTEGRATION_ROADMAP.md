# API Integration Roadmap - NZ Grocery Admin

## ✅ Completed Modules

### 1. Authentication Module ✅
- Login API Integration
- Logout Functionality
- Token Management (JWT)
- Protected Routes
- Auto-redirect on 401

### 2. Category Management Module ✅
- List Categories (with counts) - `GET /product-service/categories/with_counts`
- Get Category Details - `GET /product-service/categories/{category_id}`
- Create Category (with image upload) - `POST /product-service/categories/`
- Update Category (with image upload) - `PUT /product-service/categories/{category_id}`
- Delete Category - `DELETE /product-service/categories/{category_id}`
- Get Category Options (for dropdowns) - `GET /product-service/categories/options`
- Image upload support (base64 to File conversion)
- Toast notifications for all operations
- Image preview in edit form

---

## 🎯 Module Integration Order

### Priority 1: Category Management Module 📁 ✅ **COMPLETED**
**Why First**: Master data module - essential for organizing products. Many other modules depend on categories.

**APIs Integrated**:
- `GET /product-service/categories/with_counts` - List all categories with product counts
- `GET /product-service/categories/{category_id}` - Get category by ID
- `POST /product-service/categories/` - Create category (multipart/form-data)
- `PUT /product-service/categories/{category_id}` - Update category (multipart/form-data)
- `DELETE /product-service/categories/{category_id}` - Delete category
- `GET /product-service/categories/options` - Get category options for dropdowns

**Files Updated**:
- `admin/src/services/categoryService.js` ✅ Completed
- `admin/src/views/categories/CategoriesList.jsx` ✅ Completed
- `admin/src/components/pages/categories/CategoryForm.jsx` ✅ Completed
- `admin/src/components/common/ImageUpload.jsx` ✅ Enhanced for edit mode

**Features Implemented**:
- Full CRUD operations with real API
- Image upload (base64 to File conversion for multipart/form-data)
- Toast notifications for success/error messages
- Image preview in edit form
- Error handling and loading states
- Responsive table with proper image display

**Time Taken**: Completed

---

### Priority 2: Dashboard Module 📊
**Why Second**: Dashboard provides overview and is the first page users see after login.

**APIs Needed**:
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/charts` - Chart data
- `GET /dashboard/activities` - Recent activities
- `GET /dashboard/quick-actions` - Quick actions

**Files to Update**:
- `admin/src/views/dashboard/Dashboard.jsx`
- `admin/src/services/dashboardService.js` (needs to be created)
- `admin/src/views/dashboard/MainChart.jsx`

**Estimated Time**: 2-3 hours

---

### Priority 3: Users Management Module 👥 (SKIP FOR NOW)
**Why Later**: Can be done after core business modules are working.

**APIs Needed**:
- `GET /users` - List all users (with pagination, filters)
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `POST /users/bulk-delete` - Bulk delete
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update profile
- `POST /users/avatar` - Upload avatar
- `PUT /users/{id}/status` - Change user status

**Files to Update**:
- `admin/src/services/userService.js`
- `admin/src/views/users/UsersList.jsx`
- `admin/src/components/pages/users/UserForm.jsx`
- `admin/src/views/users/Profile.jsx`
- `admin/src/components/pages/users/ProfileForm.jsx`

**Estimated Time**: 4-5 hours

---

### Priority 4: Products Management Module 🛍️
**Why Third**: Core business functionality.

**APIs Needed**:
- `GET /products` - List all products
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /categories` - List categories
- `GET /subcategories` - List subcategories
- File upload for product images

**Files to Update**:
- `admin/src/services/productService.js`
- `admin/src/services/categoryService.js`
- `admin/src/services/subCategoryService.js`
- `admin/src/views/products/ProductsList.jsx`
- `admin/src/views/products/ProductDetails.jsx`
- `admin/src/components/pages/products/AddProductWizard.jsx`
- `admin/src/components/pages/products/ProductForm.jsx`
- `admin/src/views/categories/CategoriesList.jsx`
- `admin/src/views/subcategories/SubCategoriesList.jsx`

**Estimated Time**: 6-8 hours

---

### Priority 5: Orders Management Module 📦
**Why Fourth**: Track and manage customer orders.

**APIs Needed**:
- `GET /orders` - List all orders (with filters)
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update order status
- `PUT /orders/{id}/payment-status` - Update payment status
- `GET /orders/stats` - Order statistics
- `GET /orders/{id}/history` - Order history

**Files to Update**:
- `admin/src/services/orderService.js`
- `admin/src/views/orders/OrdersList.jsx`
- `admin/src/components/pages/orders/OrderDetailsModal.jsx`

**Estimated Time**: 4-5 hours

---

### Priority 6: Customers Management Module 👤
**Why Fifth**: Manage customer data.

**APIs Needed**:
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get customer by ID
- `PUT /customers/{id}` - Update customer
- `PUT /customers/{id}/status` - Change customer status
- `GET /customers/{id}/orders` - Get customer orders

**Files to Update**:
- `admin/src/services/customerService.js`
- `admin/src/views/customers/CustomersList.jsx`
- `admin/src/components/pages/customers/CustomerDetailsModal.jsx`
- `admin/src/components/pages/customers/SuspendCustomerModal.jsx`

**Estimated Time**: 3-4 hours

---

### Priority 7: Inventory Management Module 📋
**Why Sixth**: Track stock and inventory.

**APIs Needed**:
- `GET /inventory` - List inventory items
- `GET /inventory/{id}` - Get inventory item
- `PUT /inventory/{id}` - Update stock
- `POST /inventory/{id}/adjust` - Adjust stock
- `GET /inventory/{id}/history` - Stock history
- `GET /inventory/low-stock` - Low stock alerts

**Files to Update**:
- `admin/src/services/inventoryService.js`
- `admin/src/views/inventory/InventoryManagement.jsx`
- `admin/src/components/pages/inventory/StockAdjustmentForm.jsx`
- `admin/src/components/pages/inventory/InventoryHistoryModal.jsx`

**Estimated Time**: 3-4 hours

---

### Priority 8: Content Management Module 📝
**Why Seventh**: Manage site content.

**APIs Needed**:
- `GET /banners` - List banners
- `POST /banners` - Create banner
- `PUT /banners/{id}` - Update banner
- `DELETE /banners/{id}` - Delete banner
- `GET /faqs` - List FAQs
- `POST /faqs` - Create FAQ
- `PUT /faqs/{id}` - Update FAQ
- `DELETE /faqs/{id}` - Delete FAQ
- `GET /notifications` - List notifications
- `POST /notifications` - Send notification

**Files to Update**:
- `admin/src/services/contentService.js`
- `admin/src/views/content/ContentManagement.jsx`
- `admin/src/views/content/BannersPromotions.jsx`
- `admin/src/views/content/FAQManagement.jsx`
- `admin/src/views/content/Notifications.jsx`
- `admin/src/components/pages/content/BannerFormModal.jsx`
- `admin/src/components/pages/content/FAQFormModal.jsx`
- `admin/src/components/pages/content/NotificationFormModal.jsx`

**Estimated Time**: 4-5 hours

---

### Priority 9: Settings Module ⚙️
**Why Eighth**: System configuration.

**APIs Needed**:
- `GET /settings` - Get all settings
- `PUT /settings/general` - Update general settings
- `PUT /settings/email` - Update email settings
- `PUT /settings/aws` - Update AWS settings
- `POST /settings/test-email` - Test email
- `POST /settings/test-aws` - Test AWS

**Files to Update**:
- `admin/src/services/settingsService.js`
- `admin/src/views/settings/Settings.jsx`

**Estimated Time**: 2-3 hours

---

## 📋 Integration Checklist

### Per Module Integration Steps:
1. [ ] Update service file to use real API
2. [ ] Remove mock data imports
3. [ ] Add error handling
4. [ ] Test API integration
5. [ ] Update components to handle API responses
6. [ ] Add loading states
7. [ ] Test all CRUD operations
8. [ ] Update documentation

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
- Authentication Module
- Category Management Module

⏳ **In Progress**:
- None

📋 **Next Up**:
- Dashboard Module (Priority 2)

---

## 📝 Notes

- All API integrations will use the established pattern from Authentication module
- Error handling is standardized across all services
- Loading states should be implemented for better UX
- Test all integrations before moving to next module
- Update documentation after each integration

---

## 🛠️ Development Guidelines

### Code Structure
- **Services**: All API calls should be in dedicated service files (`admin/src/services/`)
- **Components**: Reusable components in `admin/src/components/common/` or `admin/src/components/pages/`
- **Views**: Page-level components in `admin/src/views/`
- **Utils**: Helper functions in `admin/src/utils/`
- **Config**: Configuration files in `admin/src/config/`

### Service Layer Migration Pattern

**Before (Mock Data)**:
```javascript
import mockData from '../mock/data.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
import { handleApiError } from '../utils/errorHandler'

const moduleService = {
  async getItems(params = {}) {
    try {
      const response = await apiClient.get('/module', { params })
      return {
        success: true,
        data: response.data,
        message: 'Items fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getItemById(id) {
    try {
      const response = await apiClient.get(`/module/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Item fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async createItem(data) {
    try {
      const response = await apiClient.post('/module', data)
      return {
        success: true,
        data: response.data,
        message: 'Item created successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateItem(id, data) {
    try {
      const response = await apiClient.put(`/module/${id}`, data)
      return {
        success: true,
        data: response.data,
        message: 'Item updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async deleteItem(id) {
    try {
      await apiClient.delete(`/module/${id}`)
      return {
        success: true,
        data: null,
        message: 'Item deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default moduleService
```

### Error Handling Pattern

**Error Handler Utility** (`admin/src/utils/errorHandler.js`):
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

**Example: List Component with CRUD Operations**:
```javascript
import React, { useState, useEffect } from 'react'
import { useToast } from '../../components'
import moduleService from '../../services/moduleService'

const ModuleList = () => {
  const { success, error } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await moduleService.getItems()
      if (response.success) {
        setItems(response.data.items || response.data || [])
      } else {
        error(response.message || 'Failed to load items')
      }
    } catch (err) {
      error('An error occurred while loading items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      const response = await moduleService.createItem(formData)
      if (response.success) {
        success(response.message || 'Item created successfully!')
        loadItems() // Refresh list
      } else {
        error(response.message || 'Failed to create item')
      }
    } catch (err) {
      error('An error occurred while creating item')
    }
  }

  const handleUpdate = async (id, formData) => {
    try {
      const response = await moduleService.updateItem(id, formData)
      if (response.success) {
        success(response.message || 'Item updated successfully!')
        loadItems() // Refresh list
      } else {
        error(response.message || 'Failed to update item')
      }
    } catch (err) {
      error('An error occurred while updating item')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await moduleService.deleteItem(id)
      if (response.success) {
        success(response.message || 'Item deleted successfully!')
        loadItems() // Refresh list
      } else {
        error(response.message || 'Failed to delete item')
      }
    } catch (err) {
      error('An error occurred while deleting item')
    }
  }

  // Component JSX...
}
```

### Image Upload Handling

**Service Layer (multipart/form-data)**:
```javascript
async createItem(categoryData) {
  try {
    let dataToSend = categoryData
    let config = {}

    // Check if image exists (base64 string)
    if (categoryData.image && categoryData.image.startsWith('data:image/')) {
      // Convert base64 to File object
      const base64Data = categoryData.image.split(',')[1]
      const mimeType = categoryData.image.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      const file = new File([blob], 'item-image', { type: mimeType })

      // Create FormData
      const formData = new FormData()
      formData.append('name', categoryData.name)
      formData.append('description', categoryData.description || '')
      formData.append('file', file)

      dataToSend = formData
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }

    const response = await apiClient.post('/module', dataToSend, config)
    return {
      success: true,
      data: response.data,
      message: 'Item created successfully'
    }
  } catch (error) {
    return handleApiError(error)
  }
}
```

**Component Usage**:
```javascript
// ImageUpload component returns base64 string
<ImageUpload
  value={formData.image || categoryData?.image_url}
  onChange={(base64String) => setFormData({ ...formData, image: base64String })}
/>

// On submit, pass image as base64 string
const submitData = {
  name: formData.name,
  description: formData.description,
  image: formData.image // base64 string - service will convert to File
}
```

### Response Format Standards

**Success Response**:
```javascript
{
  success: true,
  data: {
    // Response data (object or array)
  },
  message: "Operation successful"
}
```

**Error Response**:
```javascript
{
  success: false,
  message: "Error message",
  errors: [], // Optional validation errors array
  error: "error_type" // network, validation, unauthorized, etc.
}
```

### Authentication Flow

**Login**:
```javascript
// Service
async login(credentials) {
  try {
    const response = await apiClient.post('/auth/login', credentials)
    const { access_token, user } = response.data
    
    // Store token and user
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return {
      success: true,
      data: { access_token, user },
      message: 'Login successful'
    }
  } catch (error) {
    return handleApiError(error)
  }
}

// Component
const handleLogin = async (credentials) => {
  const response = await authService.login(credentials)
  if (response.success) {
    // Update auth context
    // Navigate to dashboard
  } else {
    error(response.message)
  }
}
```

**Token Management** (apiClient interceptor):
```javascript
// Request interceptor - adds token to headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handles 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### API Client Configuration

**File**: `admin/src/config/apiClient.js`
```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://13.211.171.89:8000',
  timeout: 10000,
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
    if (error.response?.status === 401 && !error.config._retry) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Environment Configuration

**File Structure**:
```
admin/
├── .env.local          # Local development (gitignored)
├── .env.staging        # Staging environment
└── .env.production     # Production environment
```

**Example `.env.local`**:
```env
VITE_API_BASE_URL=http://13.211.171.89:8000
```

**Usage in Code**:
```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // ...
})
```

### File Naming Conventions
- **Services**: `{module}Service.js` (e.g., `categoryService.js`)
- **Components**: `{ComponentName}.jsx` (PascalCase)
- **Views**: `{Module}List.jsx` or `{Module}Details.jsx`
- **Utils**: `{utilName}.js` (camelCase)
- **Config**: `{configName}.js` (camelCase)

### State Management Best Practices

1. **Component State**:
   - Use `useState` for local component state
   - Use `useEffect` for data fetching on mount
   - Clear state on modal close/unmount
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
- [ ] Test image upload (if applicable)
- [ ] Test form validation
- [ ] Test pagination (if applicable)
- [ ] Test search/filter (if applicable)

---

**Last Updated**: 2025-01-28  
**Status**: Category Module Completed - Ready for Dashboard Module Integration

