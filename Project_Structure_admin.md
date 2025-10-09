# NZ Grocery Admin - Project Structure & Development Guidelines

## 📁 Project Folder Structure

```
admin/
├── 📁 public/                          # Static assets
│   ├── favicon.ico                     # Site favicon
│   ├── manifest.json                   # PWA manifest
│   └── vite.svg                        # Vite logo
│
├── 📁 src/                             # Source code
│   ├── 📁 assets/                      # Static assets
│   │   ├── 📁 brand/                  # Brand assets
│   │   │   ├── logo.jsx               # Logo component
│   │   │   └── sygnet.jsx             # Sygnet component
│   │   ├── 📁 images/                 # Image assets
│   │   │   ├── 📁 avatars/            # User avatars (1-9.jpg)
│   │   │   ├── angular.jpg            # Framework images
│   │   │   ├── react.jpg              # Framework images
│   │   │   └── vue.jpg                # Framework images
│   │   ├── 📁 logo/                   # Logo assets
│   │   │   └── logo-transprant.png    # Main logo (transparent)
│   │   └── login-background.png       # Auth background
│   │
│   ├── 📁 components/                 # Reusable components
│   │   ├── 📁 common/                 # Common/shared components
│   │   │   ├── Button.jsx             # Reusable button component
│   │   │   ├── Card.jsx               # Reusable card component
│   │   │   ├── FormFields.jsx         # Form input components
│   │   │   ├── FormModal.jsx          # Modal for forms
│   │   │   ├── GlobalSpinner.jsx     # Global loading spinner
│   │   │   ├── Modal.jsx              # Reusable modal component
│   │   │   ├── Table.jsx              # Data table component
│   │   │   └── ToastProvider.jsx     # Toast notifications
│   │   │
│   │   ├── 📁 docs/                   # Documentation components
│   │   │   ├── DocsComponents.jsx     # Component documentation
│   │   │   ├── DocsExample.jsx        # Example documentation
│   │   │   ├── DocsIcons.jsx         # Icon documentation
│   │   │   └── DocsLink.jsx           # Link documentation
│   │   │
│   │   ├── 📁 layout/                 # Layout components
│   │   │   ├── AppBreadcrumb.jsx      # Breadcrumb navigation
│   │   │   ├── AppContent.jsx         # Main content wrapper
│   │   │   ├── AppFooter.jsx          # Application footer
│   │   │   ├── AppHeader.jsx          # Application header
│   │   │   ├── AppSidebar.jsx         # Application sidebar (CoreUI)
│   │   │   ├── AppSidebarNav.jsx      # Sidebar navigation
│   │   │   ├── PermissionRoute.jsx     # Route permission wrapper
│   │   │   └── 📁 header/             # Header sub-components
│   │   │       ├── AppHeaderDropdown.jsx
│   │   │       └── index.jsx
│   │   │
│   │   ├── 📁 pages/                  # Page-specific components
│   │   │   ├── 📁 categories/          # Category management
│   │   │   │   └── CategoryForm.jsx   # Category form component
│   │   │   ├── 📁 products/           # Product management
│   │   │   │   └── ProductForm.jsx    # Product form component
│   │   │   ├── 📁 roles/              # Role management
│   │   │   │   └── RoleForm.jsx       # Role form component
│   │   │   ├── 📁 subcategories/      # Subcategory management
│   │   │   │   └── SubCategoryForm.jsx # Subcategory form component
│   │   │   └── 📁 users/              # User management
│   │   │       ├── 📁 __tests__/      # User component tests
│   │   │       │   └── ProfileForm.test.js
│   │   │       ├── AddressSection.jsx # Address form section
│   │   │       ├── PersonalInfoSection.jsx # Personal info section
│   │   │       ├── ProfileForm.jsx    # Complete profile form
│   │   │       ├── ProfilePictureSection.jsx # Profile picture section
│   │   │       └── UserForm.jsx       # User form component
│   │   │
│   │   └── index.jsx                   # Component exports
│   │
│   ├── 📁 constants/                   # Application constants
│   │   ├── api.js                      # API endpoint constants
│   │   ├── permissions.js              # Permission constants
│   │   └── README.md                   # Constants documentation
│   │
│   ├── 📁 context/                    # React Context providers
│   │   ├── AuthContext.jsx            # Authentication context
│   │   └── README.md                  # Context documentation
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── index.jsx                   # Hook exports
│   │   └── README.md                   # Hooks documentation
│   │
│   ├── 📁 layout/                     # Layout components
│   │   ├── DefaultLayout.jsx          # Default page layout
│   │   └── PrivateRoute.jsx           # Protected route wrapper
│   │
│   ├── 📁 mock/                       # Mock data for development
│   │   ├── categories.json            # Mock category data
│   │   ├── products.json              # Mock product data
│   │   ├── profile.json               # Mock profile data
│   │   ├── roles.json                 # Mock role data
│   │   ├── settings.json              # Mock settings data
│   │   ├── subCategories.json         # Mock subcategory data
│   │   └── users.json                 # Mock user data
│   │
│   ├── 📁 pages/                      # Page components
│   │   └── 📁 Auth/                   # Authentication pages
│   │       ├── ForgotPassword.jsx     # Forgot password page
│   │       ├── Login.jsx              # Login page
│   │       └── ResetPassword.jsx      # Reset password page
│   │
│   ├── 📁 routes/                     # Routing configuration
│   │   └── index.jsx                  # Route definitions (lazy loading)
│   │
│   ├── 📁 scss/                       # SCSS stylesheets
│   │   ├── examples.scss              # Example styles
│   │   ├── style.scss                 # Main stylesheet
│   │   └── 📁 vendors/                # Third-party styles
│   │       └── simplebar.scss         # SimpleBar styles
│   │
│   ├── 📁 services/                   # API service layer
│   │   ├── categoryService.js         # Category API service
│   │   ├── productService.js          # Product API service
│   │   ├── profileService.js          # Profile API service
│   │   ├── README.md                  # Services documentation
│   │   ├── roleService.js             # Role API service
│   │   ├── settingsService.js         # Settings API service
│   │   ├── subCategoryService.js      # Subcategory API service
│   │   └── userService.js             # User API service
│   │
│   ├── 📁 styles/                     # Additional styles
│   │   └── auth.css                   # Authentication styles
│   │
│   ├── 📁 views/                      # Main view components
│   │   ├── 📁 categories/             # Category management views
│   │   │   └── CategoriesList.jsx     # Categories list view
│   │   ├── 📁 dashboard/              # Dashboard views
│   │   │   ├── Dashboard.jsx          # Main dashboard
│   │   │   └── MainChart.jsx          # Dashboard chart component
│   │   ├── 📁 products/               # Product management views
│   │   │   └── ProductsList.jsx       # Products list view
│   │   ├── 📁 roles/                  # Role management views
│   │   │   └── RolesList.jsx          # Roles list view
│   │   ├── 📁 settings/               # Settings views
│   │   │   └── Settings.jsx           # Settings page
│   │   ├── 📁 subcategories/          # Subcategory management views
│   │   │   └── SubCategoriesList.jsx  # Subcategories list view
│   │   └── 📁 users/                  # User management views
│   │       ├── Profile.jsx            # User profile view
│   │       └── UsersList.jsx          # Users list view
│   │
│   ├── _nav.jsx                       # Navigation configuration
│   ├── App.css                        # Main app styles
│   ├── App.jsx                        # Main app component
│   ├── config.js                      # App configuration
│   ├── main.jsx                       # App entry point
│   ├── routesConfig.jsx               # Route configuration
│   ├── store.jsx                      # Redux store configuration
│   └── utils.js                       # Utility functions
│
├── 📁 styles/                         # Global styles
│   └── theme.css                      # Theme styles (CoreUI overrides)
│
├── .env.example                       # Environment variables example
├── .env.local                         # Local environment variables
├── .env.staging                       # Staging environment variables
├── .env.production                    # Production environment variables
├── .gitignore                         # Git ignore rules
├── eslint.config.js                   # ESLint configuration
├── index.html                         # HTML template
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Dependency lock file
├── README.md                          # Project documentation
└── vite.config.js                     # Vite build configuration
```

## 🎯 Development Rules & Guidelines

### 📋 Component Organization Rules

#### 1. **Component Location Rules**
- **Common Components**: Place in `src/components/common/`
- **Page-Specific Components**: Place in `src/components/pages/[feature]/`
- **Layout Components**: Place in `src/components/layout/`
- **View Components**: Place in `src/views/[feature]/`
- **Page Components**: Place in `src/pages/[feature]/`

#### 2. **Component Naming Rules**
- Use **PascalCase** for component names
- Use **descriptive names** that indicate purpose
- Use **suffixes** for clarity:
  - `Form.jsx` - Form components
  - `List.jsx` - List/table components
  - `Modal.jsx` - Modal components
  - `Section.jsx` - Section components

#### 3. **File Structure Rules**
- **One component per file**
- **Export default** the main component
- **Named exports** for sub-components or utilities
- **Index files** for clean imports

### 🎨 UI/UX Rules

#### 1. **UI Framework Rules**
- **Primary Framework**: React Bootstrap (for main content)
- **Sidebar Framework**: CoreUI React (for sidebar and navigation only)
- **Icon Library**: FontAwesome (free solid icons) + CoreUI Icons (sidebar only)
- **Styling**: Bootstrap classes + custom CSS + CoreUI overrides
- **Theme**: Custom white sidebar with green accents
- **Responsive Design**: Mobile-first approach

#### 2. **Component Structure Rules**
```jsx
// Standard Page Structure with React Bootstrap (Clean Layout - No Nested Cards)
<Container fluid>
  <Row>
    <Col xs={12}>
      {/* Page Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
        <h2 className="mb-0 text-dark">Page Title</h2>
        <div className="ms-auto">
          <Button variant="primary" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3 shadow-sm p-4">
        {/* Section with Clean Header */}
        <div className="mb-5">
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
            <FontAwesomeIcon icon={faIcon} className="me-3 text-success fs-4" />
            <h4 className="mb-0 text-success">Section Title</h4>
          </div>
          
          {/* Content */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Field Label</Form.Label>
                <FormControl className="border-2" />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  </Row>
</Container>
```

#### 3. **Form Structure Rules**
```jsx
// Standard Form Structure with React Bootstrap (Enhanced Styling)
<Form>
  <Row>
    <Col xs={12} md={6}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="field" className="fw-semibold">Field Label</Form.Label>
        <Form.Control
          id="field"
          type="text"
          value={value}
          onChange={handleChange}
          required
          isInvalid={!!errors.field}
          className="border-2"
        />
        <Form.Control.Feedback type="invalid">
          {errors.field}
        </Form.Control.Feedback>
        <FormText className="text-muted">Helper text for the field.</FormText>
      </Form.Group>
    </Col>
  </Row>
</Form>
```

#### 4. **Modal Structure Rules**
```jsx
// Standard Modal Structure with React Bootstrap
<Modal show={visible} onHide={onClose}>
  <Modal.Header closeButton>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Modal content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    <Button variant="primary" onClick={onConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

#### 5. **Sidebar & Navigation Rules (CoreUI Only)**
```jsx
// Navigation Configuration (_nav.jsx) - CoreUI Components
const _nav = [
  {
    component: CNavTitle,
    name: 'Main',
  },
  {
    component: CNavGroup,
    name: 'Dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Admin Dashboard',
        to: '/dashboard',
        badge: {
          color: 'success',
          text: '●',
        },
      },
    ],
  },
]

// Sidebar Structure (AppSidebar.jsx) - CoreUI Components Only
<CSidebar className="sidebar-custom" colorScheme="dark">
  <CSidebarHeader className="border-bottom">
    <CSidebarBrand to="/" className="sidebar-brand-custom">
      <img src={logoImg} alt="NZ Grocery Admin" className="sidebar-brand-logo-full" />
    </CSidebarBrand>
    <CCloseButton className="d-lg-none" dark />
  </CSidebarHeader>
  <AppSidebarNav items={navigation} />
</CSidebar>
```

#### 6. **Theme & Styling Rules**
- **Main Content**: React Bootstrap components with standard Bootstrap styling
- **Sidebar**: CoreUI components with custom white background and subtle shadows
- **Navigation**: CoreUI navigation with dark text and proper contrast on white background
- **Icons**: FontAwesome for main content, CoreUI icons for sidebar only
- **Colors**: Green primary color (#16a34a) with proper contrast
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins throughout

#### 7. **Gradient System & CSS Variables**
```css
/* Theme-based Gradient Variables - Light & Subtle */
--gradient-primary: linear-gradient(135deg, #86efac 0%, #4ade80 100%) !important;
--gradient-success: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%) !important;
--gradient-info: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%) !important;
--gradient-warning: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
--gradient-danger: linear-gradient(135deg, #fca5a5 0%, #f87171 100%) !important;

/* Card Gradient Backgrounds - Light & Subtle */
--card-gradient-primary: linear-gradient(135deg, #86efac 0%, #4ade80 100%) !important;
--card-gradient-success: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%) !important;
--card-gradient-info: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%) !important;
--card-gradient-warning: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;

/* Logo-Inspired Green-Blue Gradient */
--card-gradient-logo: linear-gradient(135deg, #86efac 0%, #b8d7fd 100%) !important;
--card-gradient-logo-alt: linear-gradient(135deg, #4ade80 0%, #fbffbb 100%) !important;
```

#### 8. **Gradient Utility Classes**
```css
/* Gradient Utility Classes */
.bg-gradient-primary { background: var(--card-gradient-primary) !important; }
.bg-gradient-success { background: var(--card-gradient-success) !important; }
.bg-gradient-info { background: var(--card-gradient-info) !important; }
.bg-gradient-warning { background: var(--card-gradient-warning) !important; }
.bg-gradient-logo { background: var(--card-gradient-logo) !important; }
.bg-gradient-logo-alt { background: var(--card-gradient-logo-alt) !important; }
.bg-gradient-light { background: var(--bg-gradient-light) !important; }
.bg-gradient-primary-subtle { background: var(--bg-gradient-primary-subtle) !important; }
```

#### 9. **Section Header Design Pattern**
```jsx
// Standard Section Header with Green Theme
<div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
  <FontAwesomeIcon icon={faIcon} className="me-3 text-success fs-4" />
  <h4 className="mb-0 text-success">Section Title</h4>
</div>
```

#### 10. **Clean Layout Guidelines**
- **Avoid Nested Cards**: Use single container with subtle shadow instead of card-in-card
- **Section Separation**: Use border-bottom dividers with green theme
- **Visual Hierarchy**: Clear typography hierarchy with proper font weights
- **Consistent Spacing**: Use `mb-5` for section spacing, `mb-4` for internal spacing
- **Enhanced Inputs**: Use `border-2` class for better input visibility
- **Theme Consistency**: Apply green color (`text-success`, `border-success`) consistently

### 🔧 State Management Rules

#### 1. **State Management Strategy**
- **Local State**: Use `useState` for component-specific state
- **Global State**: Use Redux for application-wide state
- **Context**: Use React Context for theme, auth, etc.
- **Server State**: Use custom hooks for API calls

#### 2. **State Naming Rules**
- Use **descriptive names** for state variables
- Use **camelCase** for state variables
- Use **boolean prefixes**: `is`, `has`, `can`, `should`
- Use **array suffixes**: `List`, `Items`, `Data`

#### 3. **State Update Rules**
- **Immutable updates** for objects and arrays
- **Functional updates** for state that depends on previous state
- **Batch updates** when possible

### 🌐 API Service Rules

#### 1. **Service Organization**
- **One service per feature** (e.g., `userService.js`)
- **Consistent naming** for service methods
- **Error handling** in all service methods
- **TypeScript interfaces** for request/response types

#### 2. **Service Method Naming**
```javascript
// Standard Service Method Names
const userService = {
  getUsers: () => {},           // GET /users
  getUserById: (id) => {},      // GET /users/:id
  createUser: (data) => {},     // POST /users
  updateUser: (id, data) => {}, // PUT /users/:id
  deleteUser: (id) => {},       // DELETE /users/:id
}
```

#### 3. **Error Handling Rules**
- **Consistent error format** across all services
- **User-friendly error messages**
- **Logging** for debugging purposes
- **Fallback values** for failed requests

### 🎯 Code Quality Rules

#### 1. **Code Style Rules**
- **ESLint configuration** must be followed
- **Prettier formatting** for consistent code style
- **Meaningful variable names**
- **Consistent indentation** (2 spaces)
- **Trailing commas** in objects and arrays

#### 2. **Component Rules**
- **Functional components** only
- **Hooks** for state and lifecycle
- **PropTypes** for prop validation
- **Default props** where appropriate
- **Memoization** for expensive operations

#### 3. **Performance Rules**
- **Lazy loading** for large components
- **Code splitting** for better performance
- **Memoization** for expensive calculations
- **Debouncing** for search inputs
- **Virtualization** for large lists

### 🔐 Security Rules

#### 1. **Authentication Rules**
- **JWT tokens** for authentication
- **Token refresh** mechanism
- **Protected routes** for sensitive pages
- **Role-based access control**

#### 2. **Data Validation Rules**
- **Client-side validation** for UX
- **Server-side validation** for security
- **Input sanitization** for all user inputs
- **XSS protection** for all outputs

#### 3. **API Security Rules**
- **HTTPS only** in production
- **CORS configuration** for API access
- **Rate limiting** for API endpoints
- **Input validation** on all endpoints

### 📱 Responsive Design Rules

#### 1. **Breakpoint Rules**
- **Mobile First**: Design for mobile, enhance for desktop
- **Bootstrap Breakpoints**: xs, sm, md, lg, xl, xxl
- **Consistent spacing** across all screen sizes
- **Touch-friendly** interface elements

#### 2. **Layout Rules**
- **Grid system** for consistent layouts
- **Flexbox** for component alignment
- **Responsive images** with proper sizing
- **Accessible navigation** on all devices

### 🧪 Testing Rules

#### 1. **Testing Strategy**
- **Unit tests** for utility functions
- **Component tests** for UI components
- **Integration tests** for user flows
- **E2E tests** for critical paths

#### 2. **Test Organization**
- **Test files** alongside source files
- **Descriptive test names**
- **Arrange-Act-Assert** pattern
- **Mock external dependencies**

### 📚 Documentation Rules

#### 1. **Code Documentation**
- **JSDoc comments** for functions and components
- **README files** for each major feature
- **Inline comments** for complex logic
- **API documentation** for all endpoints

#### 2. **Component Documentation**
- **PropTypes** with descriptions
- **Usage examples** in comments
- **Default values** documented
- **Dependencies** listed

### 🚀 Deployment Rules

#### 1. **Environment Configuration**
- **Environment-specific** configurations
- **Secure secrets** management
- **Build optimization** for production
- **Error tracking** in production

#### 2. **Build Rules**
- **Code splitting** for optimal loading
- **Asset optimization** for performance
- **Source maps** for debugging
- **Version management** for releases

### 🔄 Version Control Rules

#### 1. **Git Workflow**
- **Feature branches** for new features
- **Descriptive commit messages**
- **Pull request reviews** before merging
- **Semantic versioning** for releases

#### 2. **Code Review Rules**
- **Peer review** for all changes
- **Automated testing** before merge
- **Code quality checks** in CI/CD
- **Documentation updates** with code changes

---

## 📝 Additional Guidelines

### 🎨 Design System
- Follow **Bootstrap design principles**
- Use **consistent color palette**
- Maintain **typography hierarchy**
- Ensure **accessibility compliance**

### 🔧 Development Tools
- **Vite** for build tooling with Rolldown optimization
- **ESLint** for code linting
- **Prettier** for code formatting
- **React DevTools** for debugging
- **React Router DOM** for routing with lazy loading
- **Redux** for state management
- **React Context** for authentication and theme

### 📦 Key Dependencies
- **React 19** - Latest React version
- **React Bootstrap** - Primary UI component library for main content
- **CoreUI React** - UI component library for sidebar and navigation only
- **React Router DOM** - Client-side routing
- **Redux** - State management
- **FontAwesome** - Icon library for main content
- **CoreUI Icons** - Icon library for sidebar only
- **SimpleBar** - Custom scrollbars
- **Axios** - HTTP client for API calls

### 📊 Performance Monitoring
- **Bundle size** monitoring
- **Runtime performance** tracking
- **User experience** metrics
- **Error rate** monitoring

### 🛠️ Maintenance
- **Regular dependency updates**
- **Security patch** management
- **Performance optimization**
- **Code refactoring** as needed

---

## 🚀 Current Project Status

### 🎯 Navigation Structure
- **Main Section**: Dashboard groups with multiple dashboard options
- **Product Management**: Products, categories, subcategories, brands, units
- **User Management**: Users and role & permission management
- **Account Section**: Profile and settings

### 🔧 Technical Implementation
- **CoreUI Components**: Proper use of CSidebar, CSidebarHeader, CSidebarBrand
- **Custom Styling**: theme.css with CoreUI overrides
- **State Management**: Redux for sidebar state (unfoldable, visible)
- **Routing**: React Router with lazy loading for performance
- **Authentication**: JWT-based auth with role-based access control
- **Clean Layout Pattern**: Single container with shadow, no nested cards
- **Green Theme System**: Consistent use of Bootstrap success color (#16a34a)
- **Enhanced Forms**: Better input styling with border-2 and fw-semibold labels
- **Gradient System**: CSS variables and utility classes for theme-based gradients
- **Logo-Inspired Gradients**: Green-blue gradient variants matching brand colors
- **Product Management**: Complete CRUD operations with dashboard-style summary cards
- **Mock Data System**: JSON-based mock data for development and testing
- **Image Handling**: Fallback system with icon display for missing product images

---

*This document should be updated as the project evolves and new patterns emerge.*
