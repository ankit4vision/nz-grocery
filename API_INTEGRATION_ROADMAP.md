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

### API Integration Pattern

1. **Service Layer**:
   - Use `apiClient` from `admin/src/config/apiClient.js` for all API calls
   - Return standardized response: `{ success: boolean, data: any, message: string }`
   - Use `handleApiError` from `admin/src/utils/errorHandler.js` for error handling
   - Handle both JSON and multipart/form-data requests appropriately

2. **Component Integration**:
   - Use `useToast` hook for user notifications (success/error messages)
   - Implement loading states during API calls
   - Handle API response mapping (API field names vs component expectations)
   - Validate form data before submission

3. **Image Upload**:
   - Use `ImageUpload` component from `admin/src/components/common/ImageUpload.jsx`
   - Component returns base64 string, service should convert to File object for multipart/form-data
   - Handle image preview in edit mode by syncing `value` prop with component state

4. **Error Handling**:
   - Always wrap API calls in try-catch blocks
   - Show user-friendly error messages via toast notifications
   - Log errors to console for debugging (use `console.error`)
   - Handle network errors, validation errors, and server errors gracefully

5. **State Management**:
   - Use `useState` for local component state
   - Use `useEffect` for data fetching on component mount
   - Clear state on modal close/unmount
   - Reset form data after successful submission

6. **Best Practices**:
   - Always check API response structure before mapping
   - Use optional chaining (`?.`) for safe property access
   - Provide fallback values for optional fields
   - Test CRUD operations (Create, Read, Update, Delete) after integration
   - Remove console.log statements before production (or use conditional logging)
   - Update this roadmap after completing each module

### File Naming Conventions
- Services: `{module}Service.js` (e.g., `categoryService.js`)
- Components: `{ComponentName}.jsx` (PascalCase)
- Views: `{Module}List.jsx` or `{Module}Details.jsx`
- Utils: `{utilName}.js` (camelCase)

### Environment Configuration
- Use `.env.local` for local development
- Use `.env.staging` for staging environment
- Use `.env.production` for production
- API base URL: `VITE_API_BASE_URL` environment variable

---

**Last Updated**: 2025-01-28  
**Status**: Category Module Completed - Ready for Dashboard Module Integration

