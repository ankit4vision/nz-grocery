# API Integration Roadmap - NZ Grocery Admin

## ✅ Completed Modules

### 1. Authentication Module ✅
- Login API Integration
- Logout Functionality
- Token Management (JWT)
- Protected Routes
- Auto-redirect on 401

### 2. Category Management Module ✅
- List Categories (with counts)
- Get Category Details
- Create Category (with image upload)
- Update Category (with image upload)
- Delete Category
- Get Category Options (for dropdowns)

---

## 🎯 Module Integration Order

### Priority 1: Category Management Module 📁
**Why First**: Master data module - essential for organizing products. Many other modules depend on categories.

**APIs Needed**:
- `GET /categories` - List all categories
- `GET /categories/{id}` - Get category by ID
- `POST /categories` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category
- `POST /categories/{id}/image` - Upload category image (if supported)
- `GET /categories/{id}/subcategories` - Get subcategories for a category

**Files to Update**:
- `admin/src/services/categoryService.js` ✅ Ready
- `admin/src/views/categories/CategoriesList.jsx` ✅ Ready
- `admin/src/components/pages/categories/CategoryForm.jsx` ✅ Ready

**Estimated Time**: 2-3 hours

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

⏳ **In Progress**:
- None

📋 **Next Up**:
- Category Management Module (Priority 1)

---

## 📝 Notes

- All API integrations will use the established pattern from Authentication module
- Error handling is standardized across all services
- Loading states should be implemented for better UX
- Test all integrations before moving to next module
- Update documentation after each integration

---

**Last Updated**: [Current Date]  
**Status**: Ready for Dashboard Module Integration

