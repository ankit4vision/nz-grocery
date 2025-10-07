# 📁 Project Structure & Development Rules

## 🤖 **AI DEVELOPMENT GUIDELINES**

### **🚨 CRITICAL RULES FOR AI:**
1. **ALWAYS use Bootstrap classes** - Never use inline styles or custom CSS
2. **ALWAYS follow the mandatory page structure** - Every page must use CContainer > CRow > CCol > CCard > CCardHeader > CCardBody
3. **ALWAYS use EXISTING reusable components** - Don't create new components, use what's already built
4. **ALWAYS use className prop** - Never use style prop
5. **ALWAYS use the reusable Table component** - Never create custom tables
6. **ALWAYS use FormModal and Modal components** - Never create custom modals
7. **ALWAYS use Button, Card, FormFields components** - These are already built and reusable

### **📋 Quick Reference for AI:**

#### **🎯 EXISTING REUSABLE COMPONENTS - USE THESE ONLY:**
```jsx
// ✅ CORRECT: Import and use existing components
import { 
  Table,           // ✅ Use this - reusable table with pagination, sorting
  FormModal,        // ✅ Use this - modal wrapper for forms
  Modal,           // ✅ Use this - generic modal for confirmations/view
  Button,          // ✅ Use this - custom button component
  Card,            // ✅ Use this - custom card component
  FormFields,      // ✅ Use this - TextField, SelectField, FormRow
  GlobalSpinner,   // ✅ Use this - global spinner component with consistent styling
  UserForm,        // ✅ Use this - user form component
  RoleForm,        // ✅ Use this - role form component
  CategoryForm,    // ✅ Use this - category form component
  SubCategoryForm, // ✅ Use this - sub category form component
  useToast         // ✅ Use this - toast notifications
} from '../../components'

// ❌ WRONG: Don't create new components
const CustomTable = () => { /* Don't do this */ }
const CustomModal = () => { /* Don't do this */ }
const CustomButton = () => { /* Don't do this */ }
```

#### **🎯 STANDARD PAGE STRUCTURE:**
```jsx
// ✅ CORRECT: Standard page structure using existing components
<CContainer fluid>
  <CRow>
    <CCol xs={12}>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center w-100">
            <CCardTitle className="mb-0">Page Title</CCardTitle>
            <CButton color="primary" onClick={handleAdd}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Item
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <div className="d-flex gap-2 align-items-center mb-3">
            <CFormInput placeholder="Search..." />
            <CFormSelect>
              <option value="">All Status</option>
            </CFormSelect>
          </div>
          <Table data={data} columns={columns} />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</CContainer>
```

#### **🎯 ACTION BUTTONS PATTERN:**
```jsx
// ✅ CORRECT: Use existing CButton with proper props
<CButton
  color="info"
  variant="outline"
  size="sm"
  title="View Item"
  onClick={(e) => {
    e.stopPropagation()
    handleView()
  }}
>
  <CIcon icon={cilInfo} />
</CButton>
```

---

## 🏗️ Project Folder Structure

```
coreui-react-template/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── vite.svg
├── src/
│   ├── _nav.jsx                    # Sidebar navigation configuration
│   ├── api.js                      # API configuration
│   ├── App.css                     # Global styles
│   ├── App.jsx                     # Main App component
│   ├── config.js                   # Application configuration
│   ├── main.jsx                    # Application entry point
│   ├── routes.jsx                  # Route definitions
│   ├── routesConfig.jsx            # Route configuration
│   ├── store.jsx                   # State management
│   ├── utils.js                    # Utility functions
│   ├── assets/                     # Static assets
│   │   ├── brand/
│   │   │   ├── logo.jsx
│   │   │   └── sygnet.jsx
│   │   ├── images/
│   │   │   ├── avatars/            # User avatars (1.jpg - 9.jpg)
│   │   │   ├── angular.jpg
│   │   │   ├── components.webp
│   │   │   ├── icons.webp
│   │   │   ├── react.jpg
│   │   │   └── vue.jpg
│   │   ├── login-background.png    # Login page background image
│   │   └── react.svg
│   ├── components/                 # Reusable components
│   │   ├── common/                 # Common/shared components
│   │   │   ├── Button.jsx          # Custom button component
│   │   │   ├── Card.jsx            # Custom card component
│   │   │   ├── FormFields.jsx      # Form field components (TextField, SelectField, FormRow)
│   │   │   ├── FormModal.jsx       # Modal wrapper for forms
│   │   │   ├── GlobalSpinner.jsx   # Global spinner component with consistent styling
│   │   │   ├── Modal.jsx           # Generic modal component
│   │   │   ├── Table.jsx           # Reusable table with pagination, sorting
│   │   │   └── ToastProvider.jsx   # Toast notification provider
│   │   ├── layout/                 # Layout components
│   │   │   ├── AppBreadcrumb.jsx   # Breadcrumb navigation
│   │   │   ├── AppContent.jsx      # Main content area with routing
│   │   │   ├── AppFooter.jsx       # Footer component
│   │   │   ├── AppHeader.jsx       # Header component
│   │   │   ├── AppSidebar.jsx      # Sidebar component
│   │   │   └── AppSidebarNav.jsx   # Sidebar navigation
│   │   ├── pages/                  # Page-specific components
│   │   │   ├── categories/
│   │   │   │   └── CategoryForm.jsx    # Category form component
│   │   │   ├── roles/
│   │   │   │   └── RoleForm.jsx        # Role form component
│   │   │   ├── subcategories/
│   │   │   │   └── SubCategoryForm.jsx # Sub category form component
│   │   │   └── users/
│   │   │       ├── __tests__/
│   │   │       │   └── ProfileForm.test.js  # Profile form test file
│   │   │       ├── AddressSection.jsx       # Address section component
│   │   │       ├── PersonalInfoSection.jsx  # Personal info section component
│   │   │       ├── ProfileForm.jsx          # Profile form component
│   │   │       ├── ProfilePictureSection.jsx # Profile picture section component
│   │   │       └── UserForm.jsx             # User form component
│   │   ├── docs/                   # Documentation components
│   │   │   ├── DocsComponents.jsx
│   │   │   ├── DocsExample.jsx
│   │   │   ├── DocsIcons.jsx
│   │   │   └── DocsLink.jsx
│   │   ├── header/                 # Header specific components
│   │   │   ├── AppHeaderDropdown.jsx
│   │   │   └── index.jsx
│   │   └── index.jsx               # Component exports
│   ├── constants/                  # Application constants
│   │   ├── api.js                  # API endpoints
│   │   ├── permissions.js          # Permission constants
│   │   └── README.md
│   ├── context/                    # React contexts
│   │   ├── AuthContext.jsx         # Authentication context
│   │   └── README.md
│   ├── hooks/                      # Custom React hooks
│   │   ├── index.jsx               # Hook exports
│   │   └── README.md
│   ├── layout/                     # Layout components
│   │   ├── DefaultLayout.jsx       # Default page layout
│   │   └── PrivateRoute.jsx        # Protected route component
│   ├── mock/                       # Mock data files
│   │   ├── categories.json         # Category mock data
│   │   ├── profile.json            # Profile mock data
│   │   ├── roles.json              # Role mock data
│   │   ├── settings.json           # Settings mock data
│   │   ├── subCategories.json      # Sub category mock data
│   │   └── users.json              # User mock data
│   ├── pages/                      # Authentication pages
│   │   └── Auth/
│   │       ├── ForgotPassword.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── ResetPassword.jsx
│   ├── scss/                       # SCSS styles
│   │   ├── examples.scss
│   │   ├── style.scss
│   │   └── vendors/
│   │       └── simplebar.scss
│   ├── services/                   # API service layer
│   │   ├── categoryService.js      # Category API service
│   │   ├── profileService.js       # Profile API service
│   │   ├── README.md
│   │   ├── roleService.js          # Role API service
│   │   ├── settingsService.js      # Settings API service
│   │   ├── subCategoryService.js   # Sub category API service
│   │   └── userService.js          # User API service
│   ├── views/                      # Page views/components
│   │   ├── categories/
│   │   │   └── CategoriesList.jsx  # Categories management page
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx       # Dashboard page
│   │   │   └── MainChart.jsx       # Dashboard chart component
│   │   ├── pages/                  # Error pages
│   │   │   ├── page404/
│   │   │   └── page500/
│   │   ├── roles/
│   │   │   └── RolesList.jsx       # Roles management page
│   │   ├── settings/
│   │   │   └── Settings.jsx       # Settings management page
│   │   ├── subcategories/
│   │   │   └── SubCategoriesList.jsx # Sub categories management page
│   │   ├── theme/                  # Theme components
│   │   │   ├── colors/
│   │   │   └── typography/
│   │   └── users/
│   │       ├── Profile.jsx         # User profile page
│   │       └── UsersList.jsx       # Users management page
│   └── styles/
│       └── theme.css               # Theme styles
├── styles/
│   └── theme.css                   # Global theme styles
├── backup/                         # Backup files
│   ├── Charts.jsx
│   ├── Colors.jsx
│   ├── Page404.jsx
│   ├── Page500.jsx
│   ├── README.md
│   └── Typography.jsx
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML template
├── package-lock.json               # Package lock file
├── package.json                    # Package configuration
├── README.md                       # Project documentation
├── vite.config.js                  # Vite configuration
└── PROJECT_STRUCTURE.md            # This file
```

## 📋 Development Rules & Best Practices

### 🎯 **Component Organization Rules**

#### **1. Folder Structure Rules**
- **`/components/common/`** - Reusable components used across multiple pages
- **`/components/layout/`** - Layout-specific components (header, sidebar, footer)
- **`/components/pages/`** - Page-specific form components
- **`/components/docs/`** - Documentation and example components
- **`/views/`** - Main page components with business logic

#### **2. MANDATORY Page Structure**
**Every page MUST follow this exact structure:**

```jsx
// ✅ REQUIRED: Standard page template
import React, { useState, useEffect, useRef } from 'react'
import { CContainer, CRow, CCol, CButton, CFormInput, CFormSelect, CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react'
import { cilPlus, cilPencil, cilTrash, cilInfo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Table, FormModal, Modal, ItemForm, useToast } from '../../components'
import { itemService } from '../../services/itemService'

const ItemsList = () => {
  // State management
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Form refs
  const addItemFormRef = useRef()
  const editItemFormRef = useRef()
  
  // Business logic here...
  
  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center w-100">
                <CCardTitle className="mb-0">Items</CCardTitle>
                <CButton color="primary" onClick={handleAddItem}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Add Item
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex gap-2 align-items-center mb-3">
                <CFormInput
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: '200px' }}
                />
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </CFormSelect>
              </div>
              <Table
                data={filteredItems}
                columns={columns}
                loading={loading}
                hover
                pagination={true}
                sortable={true}
                sortableColumns={['name', 'status', 'createdAt']}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredItems.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      {/* Modals */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Item"
        size="lg"
        onConfirm={() => addItemFormRef.current?.handleSubmit()}
        confirmText="Create Item"
        cancelText="Cancel"
        loading={addItemLoading}
      >
        <ItemForm
          ref={addItemFormRef}
          mode="create"
          onSubmit={handleAddItemSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={addItemLoading}
        />
      </FormModal>
      
      {/* Other modals... */}
    </CContainer>
  )
}

export default ItemsList
```

**This structure ensures:**
- ✅ **Consistent Layout** - All pages look the same
- ✅ **Proper State Management** - Standard state patterns
- ✅ **Modal Integration** - Consistent modal usage
- ✅ **Table Integration** - Standard table configuration
- ✅ **Theme Consistency** - Same visual appearance

#### **2. Component Naming Rules**
- **PascalCase** for component files: `UserForm.jsx`, `CategoriesList.jsx`
- **Descriptive names**: `FormModal.jsx` not `Modal.jsx` for form-specific modals
- **Consistent suffixes**: `List.jsx` for list pages, `Form.jsx` for forms

### 🔧 **Component Development Rules**

#### **1. EXISTING REUSABLE COMPONENTS - USE THESE ONLY**

**🚨 CRITICAL: AI MUST USE EXISTING COMPONENTS, DON'T CREATE NEW ONES**

```jsx
// ✅ CORRECT: Use existing reusable components
import { 
  Table,           // ✅ Reusable table with pagination, sorting, filtering
  FormModal,        // ✅ Modal wrapper for forms with validation
  Modal,           // ✅ Generic modal for confirmations and view
  Button,          // ✅ Custom button component
  Card,            // ✅ Custom card component
  FormFields,      // ✅ TextField, SelectField, FormRow components
  GlobalSpinner,   // ✅ Global spinner component with consistent styling
  UserForm,        // ✅ User form with validation
  RoleForm,        // ✅ Role form with permissions
  CategoryForm,    // ✅ Category form
  SubCategoryForm, // ✅ Sub category form
  useToast         // ✅ Toast notifications
} from '../../components'

// ❌ WRONG: Don't create new components
const CustomTable = () => { /* Don't do this */ }
const CustomModal = () => { /* Don't do this */ }
const CustomButton = () => { /* Don't do this */ }
const CustomForm = () => { /* Don't do this */ }
```

#### **2. Component Usage Examples**

**Table Component:**
```jsx
// ✅ CORRECT: Use existing Table component
<Table
  data={filteredData}
  columns={columns}
  loading={loading}
  hover
  pagination={true}
  sortable={true}
  sortableColumns={['name', 'email', 'status']}
  currentPage={currentPage}
  pageSize={pageSize}
  totalItems={filteredData.length}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

**FormModal Component:**
```jsx
// ✅ CORRECT: Use existing FormModal component
<FormModal
  visible={showAddModal}
  onClose={() => setShowAddModal(false)}
  title="Add New Item"
  size="lg"
  onConfirm={() => addFormRef.current?.handleSubmit()}
  confirmText="Create Item"
  cancelText="Cancel"
  loading={loading}
>
  <ItemForm
    ref={addFormRef}
    mode="create"
    onSubmit={handleSubmit}
    onCancel={() => setShowAddModal(false)}
    loading={loading}
  />
</FormModal>
```

**Modal Component:**
```jsx
// ✅ CORRECT: Use existing Modal component
<Modal
  visible={showViewModal}
  onClose={() => setShowViewModal(false)}
  title="View Details"
  size="lg"
  showFooter={false}
  type="info"
>
  {/* View content */}
</Modal>
```

**FormFields Components:**
```jsx
// ✅ CORRECT: Use existing FormFields components
<FormRow>
  <TextField
    id="name"
    label="Name"
    value={formData.name}
    onChange={(e) => handleChange('name', e.target.value)}
    placeholder="Enter name"
    required
    col={12}
    invalid={!!errors.name}
    feedback={errors.name}
  />
</FormRow>

<FormRow>
  <SelectField
    id="role"
    label="Role"
    value={formData.role}
    onChange={(e) => handleChange('role', e.target.value)}
    options={roleOptions}
    required
    col={12}
    invalid={!!errors.role}
    feedback={errors.role}
  />
</FormRow>
```

**GlobalSpinner Component:**
```jsx
// ✅ CORRECT: Use existing GlobalSpinner component
<GlobalSpinner 
  size="md"           // sm, md, lg, full
  color="primary"     // primary, success, info, warning, danger
  variant="border"     // border, grow
  text="Loading..."   // Custom loading text
  showText={true}     // Show/hide text
  enhanced={false}    // Enhanced pulse animation
  fullScreen={false}  // Full screen overlay
  className=""        // Additional CSS classes
/>

// Examples:
<GlobalSpinner size="sm" showText={false} />                    // Small spinner without text
<GlobalSpinner size="lg" text="Loading Settings..." />         // Large spinner with custom text
<GlobalSpinner fullScreen={true} text="Please wait..." />       // Full screen overlay
<GlobalSpinner enhanced={true} color="success" />               // Enhanced animation with success color
<GlobalSpinner variant="grow" text="Processing..." />           // Growing spinner variant
```

#### **2. Form Components (`/components/pages/`)**
```jsx
// ✅ Good: forwardRef with useImperativeHandle
const UserForm = forwardRef(({ mode, userData, onSubmit }, ref) => {
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      // Form submission logic
    }
  }))
  
  return (
    // Form JSX
  )
})
```

#### **3. Page Components (`/views/`)**
```jsx
// ✅ Good: Complete page with state management
const UsersList = () => {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  
  // Business logic here
  
  return (
    <CContainer fluid>
      {/* Page content */}
    </CContainer>
  )
}
```

### 🎨 **UI/UX Rules**

#### **1. Action Buttons Consistency**
```jsx
// ✅ Standard action button structure
<CButton
  color="info"           // info, warning, danger
  variant="outline"      // Always outline
  size="sm"             // Always small
  title="View User"     // Always include title
  onClick={(e) => {
    e.stopPropagation() // Prevent event bubbling
    handleAction()
  }}
>
  <CIcon icon={cilInfo} />
</CButton>
```

#### **2. Modal Sizes**
- **`size="lg"`** - Standard forms (User, Category, SubCategory)
- **`size="xl"`** - Complex forms (Role with permissions)
- **`size="md"`** - Simple confirmations

#### **3. Table Structure**
```jsx
// ✅ Standard table structure
<Table
  data={filteredData}
  columns={columns}
  loading={loading}
  hover
  pagination={true}
  sortable={true}
  sortableColumns={['name', 'email', 'status']}
  currentPage={currentPage}
  pageSize={pageSize}
  totalItems={filteredData.length}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

### 🔄 **State Management Rules**

#### **1. Local State Pattern**
```jsx
// ✅ Good: Organized state
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)
const [searchTerm, setSearchTerm] = useState('')
const [filters, setFilters] = useState({})
const [modals, setModals] = useState({
  showAdd: false,
  showEdit: false,
  showView: false,
  showDelete: false
})
```

#### **2. Form State Pattern**
```jsx
// ✅ Good: Form state with validation
const [formData, setFormData] = useState({
  name: '',
  email: '',
  role: ''
})
const [errors, setErrors] = useState({})
```

### 🚀 **Service Layer Rules**

#### **1. Service Structure**
```jsx
// ✅ Good: Consistent service pattern
export const userService = {
  getUsers: async () => {
    await delay(300) // Simulate API delay
    return { success: true, data: usersData }
  },
  
  createUser: async (userData) => {
    await delay(300)
    // Implementation
    return { success: true, data: newUser, message: 'User created successfully' }
  }
}
```

#### **2. Error Handling**
```jsx
// ✅ Good: Consistent error handling
try {
  const response = await userService.createUser(userData)
  if (response.success) {
    showToast('success', response.message)
    // Handle success
  }
} catch (error) {
  console.error('Error creating user:', error)
  showToast('error', 'Failed to create user')
}
```

### 📝 **Code Quality Rules**

#### **1. Import Organization**
```jsx
// ✅ Good: Organized imports
import React, { useState, useEffect, useRef } from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { Table, Modal, FormModal, UserForm } from '../../components'
import { userService } from '../../services/userService'
```

#### **2. Event Handling**
```jsx
// ✅ Good: Prevent event bubbling
onClick={(e) => {
  e.stopPropagation()
  handleAction()
}}

// ✅ Good: Form submission
const handleSubmit = () => {
  if (!validateForm()) return
  onSubmit(formData)
}
```

#### **3. Key Generation**
```jsx
// ✅ Good: Unique keys
{data.map((item, index) => (
  <div key={item.id || `item-${index}`}>
    {/* Content */}
  </div>
))}

// ✅ Good: Complex key generation
{Object.entries(groupedData).map(([key, value], index) => (
  <div key={`${key}-${index}-${Date.now()}`}>
    {/* Content */}
  </div>
))}
```

### 🎯 **Navigation Rules**

#### **1. Navigation Structure**
```jsx
// ✅ Good: Hierarchical navigation
{
  component: CNavGroup,
  name: 'User Management',
  icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Users',
      to: '/users',
    },
    {
      component: CNavItem,
      name: 'Role & Permission',
      to: '/roles',
    },
  ],
}
```

### 🔒 **Security Rules**

#### **1. Route Protection**
```jsx
// ✅ Good: Protected routes
<Route path="/users" element={
  <PrivateRoute>
    <UsersList />
  </PrivateRoute>
} />
```

#### **2. Permission Checks**
```jsx
// ✅ Good: Permission-based rendering
{hasPermission('user.create') && (
  <CButton onClick={handleAddUser}>
    Add User
  </CButton>
)}
```

### 📊 **Data Management Rules**

#### **1. Mock Data Structure**
```json
// ✅ Good: Consistent data structure
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### **2. API Response Format**
```jsx
// ✅ Good: Consistent API response
{
  success: true,
  data: result,
  message: "Operation completed successfully"
}
```

### 🎨 **Styling Rules**

#### **1. CSS Architecture**
- **Global CSS Only** - All custom styles must be defined at global level
- **No Component-Level CSS** - Avoid inline styles or component-specific CSS files
- **Theme-Based Consistency** - All pages must follow the same visual theme
- **CoreUI + Bootstrap** - Use existing framework classes, avoid custom CSS

#### **2. Standard Page Layout Structure**
```jsx
// ✅ MANDATORY: Every page must follow this structure
<CContainer fluid>
  <CRow>
    <CCol xs={12}>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center w-100">
            <CCardTitle className="mb-0">Page Title</CCardTitle>
            <CButton color="primary" onClick={handleAdd}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Item
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Filters */}
          <div className="d-flex gap-2 align-items-center mb-3">
            <CFormInput placeholder="Search..." />
            <CFormSelect>
              <option value="">All Status</option>
            </CFormSelect>
          </div>
          
          {/* Table */}
          <Table
            data={data}
            columns={columns}
            loading={loading}
            hover
            pagination={true}
            sortable={true}
            // ... other props
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</CContainer>
```

#### **3. CSS Class Usage Rules - MANDATORY FOR AI**

**🚨 CRITICAL: AI MUST USE BOOTSTRAP CLASSES ONLY**

```jsx
// ✅ CORRECT: Use Bootstrap classes for all styling
<div className="d-flex gap-2 align-items-center mb-3">
  <CFormInput className="me-2" />
  <CButton className="ms-2" />
</div>

// ❌ WRONG: Never use inline styles or custom CSS
<div style={{ display: 'flex', gap: '8px' }}>
  <CFormInput style={{ marginRight: '8px' }} />
</div>
```

**MANDATORY Bootstrap Classes to Use:**
- **Layout**: `d-flex`, `d-block`, `d-inline`, `d-none`
- **Flexbox**: `justify-content-between`, `justify-content-center`, `align-items-center`, `align-items-start`
- **Spacing**: `gap-1`, `gap-2`, `gap-3`, `mb-0`, `mb-1`, `mb-2`, `mb-3`, `mt-1`, `mt-2`, `mt-3`
- **Margins**: `me-1`, `me-2`, `me-3`, `ms-1`, `ms-2`, `ms-3`
- **Width**: `w-100`, `w-50`, `w-25`, `w-auto`
- **Text**: `text-center`, `text-start`, `text-end`, `fw-bold`, `fw-semibold`
- **Colors**: `text-success`, `text-warning`, `text-danger`, `text-info`, `text-secondary`
- **Background**: `bg-primary`, `bg-secondary`, `bg-success`, `bg-danger`

**CoreUI Classes to Use:**
- **Text Weight**: `fw-semibold`, `fw-bold`, `fw-normal`
- **Text Colors**: `text-success`, `text-warning`, `text-danger`, `text-info`, `text-secondary`
- **Text Size**: `text-sm`, `text-lg`

**❌ FORBIDDEN:**
- **NO Inline Styles**: `style={{}}` is not allowed
- **NO Custom CSS**: Don't create new CSS classes
- **NO Component CSS**: Don't add CSS files to components
- **NO Tailwind**: Don't use Tailwind classes

**✅ REQUIRED:**
- **Always use Bootstrap classes** for layout and spacing
- **Always use CoreUI classes** for text styling
- **Always use className prop** instead of style prop

#### **4. Global CSS Files**
```
src/
├── App.css                    # Global application styles
├── scss/
│   ├── style.scss            # Main SCSS file
│   ├── examples.scss         # Example styles
│   └── vendors/
│       └── simplebar.scss    # Third-party styles
└── styles/
    └── theme.css             # Theme-specific styles
```

#### **5. Color Scheme (Theme Consistency)**
- **Success**: `text-success` (green) - Active status, success messages
- **Warning**: `text-warning` (yellow) - Edit actions, warnings
- **Danger**: `text-danger` (red) - Delete actions, errors
- **Info**: `text-info` (blue) - View actions, information
- **Secondary**: `text-secondary` (gray) - Inactive status, disabled

#### **6. Action Button Theme**
```jsx
// ✅ STANDARD: All action buttons must follow this pattern
<CButton
  color="info"           // info, warning, danger
  variant="outline"      // Always outline variant
  size="sm"             // Always small size
  title="Action Name"   // Always include title for accessibility
  onClick={(e) => {
    e.stopPropagation() // Always prevent event bubbling
    handleAction()
  }}
>
  <CIcon icon={cilInfo} /> {/* Consistent icon usage */}
</CButton>
```

#### **7. Modal Theme Consistency**
```jsx
// ✅ STANDARD: Modal structure and theming
<FormModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="lg"              // lg for forms, xl for complex forms
  onConfirm={handleSubmit}
  confirmText="Save"
  cancelText="Cancel"
  loading={loading}
>
  {/* Form content */}
</FormModal>

<Modal
  visible={showViewModal}
  onClose={() => setShowViewModal(false)}
  title="View Details"
  size="lg"
  showFooter={false}    // No footer for view modals
  type="info"           // info, danger, warning, success
>
  {/* View content */}
</Modal>
```

#### **8. Table Theme Consistency**
```jsx
// ✅ STANDARD: Table configuration
<Table
  data={filteredData}
  columns={columns}
  loading={loading}
  hover                    // Always enable hover
  pagination={true}         // Always enable pagination
  sortable={true}          // Always enable sorting
  sortableColumns={['name', 'email', 'status']}
  currentPage={currentPage}
  pageSize={pageSize}
  totalItems={filteredData.length}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

#### **9. Form Theme Consistency**
```jsx
// ✅ STANDARD: Form field structure
<FormRow>
  <TextField
    id="fieldName"
    label="Field Label"
    value={formData.fieldName}
    onChange={(e) => handleChange('fieldName', e.target.value)}
    placeholder="Enter field value"
    required
    col={12}
    invalid={!!errors.fieldName}
    feedback={errors.fieldName}
  />
</FormRow>
```

#### **10. CSS Customization Rules**
- **NO Inline Styles**: Use classes only
- **NO Component CSS**: All styles in global files
- **Theme Variables**: Use CSS variables for consistent theming
- **Responsive Design**: Use Bootstrap responsive classes
- **Accessibility**: Ensure proper contrast and focus states

### 🧪 **Testing Rules**

#### **1. Component Testing**
- Test component rendering
- Test user interactions
- Test form validation
- Test error handling

#### **2. Service Testing**
- Test API calls
- Test data transformation
- Test error scenarios

---

## 📚 **Additional Guidelines**

### **1. File Naming**
- Use **kebab-case** for folders: `user-management/`
- Use **PascalCase** for components: `UserForm.jsx`
- Use **camelCase** for utilities: `userService.js`

### **2. Code Comments**
- Comment complex business logic
- Document API endpoints
- Explain non-obvious code decisions

### **3. Performance**
- Use `React.memo` for expensive components
- Implement proper loading states
- Optimize re-renders with `useCallback` and `useMemo`

### **4. Accessibility**
- Include `title` attributes on icon buttons
- Use semantic HTML elements
- Ensure keyboard navigation support

---

**This structure ensures maintainability, scalability, and consistency across the entire application.** 🚀
