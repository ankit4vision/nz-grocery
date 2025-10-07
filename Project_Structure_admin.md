# Admin Project Structure & Development Guidelines

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
│   │   │   ├── 📁 avatars/            # User avatars
│   │   │   ├── angular.jpg            # Framework images
│   │   │   ├── react.jpg              # Framework images
│   │   │   └── vue.jpg                # Framework images
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
│   │   │   ├── AppSidebar.jsx         # Application sidebar
│   │   │   ├── AppSidebarNav.jsx      # Sidebar navigation
│   │   │   ├── PermissionRoute.jsx     # Route permission wrapper
│   │   │   └── 📁 header/             # Header sub-components
│   │   │       ├── AppHeaderDropdown.jsx
│   │   │       └── index.jsx
│   │   │
│   │   ├── 📁 pages/                  # Page-specific components
│   │   │   ├── 📁 categories/          # Category management
│   │   │   │   └── CategoryForm.jsx   # Category form component
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
│   │   ├── routes.jsx                  # Route definitions
│   │   └── routesConfig.jsx           # Route configuration
│   │
│   ├── 📁 scss/                       # SCSS stylesheets
│   │   ├── examples.scss              # Example styles
│   │   ├── style.scss                 # Main stylesheet
│   │   └── 📁 vendors/                # Third-party styles
│   │       └── simplebar.scss         # SimpleBar styles
│   │
│   ├── 📁 services/                   # API service layer
│   │   ├── categoryService.js         # Category API service
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
│   ├── App.css                        # Main app styles
│   ├── App.jsx                        # Main app component
│   ├── config.js                      # App configuration
│   ├── main.jsx                       # App entry point
│   ├── store.jsx                      # Redux store configuration
│   └── utils.js                       # Utility functions
│
├── 📁 styles/                         # Global styles
│   └── theme.css                      # Theme styles
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
├── PROJECT_STRUCTURE.md               # Project structure documentation
├── README.md                          # Project documentation
├── setup-env.sh                       # Environment setup script
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
- **Primary Framework**: React Bootstrap
- **Icon Library**: FontAwesome (free solid icons)
- **Styling**: Bootstrap classes + custom CSS
- **Responsive Design**: Mobile-first approach

#### 2. **Component Structure Rules**
```jsx
// Standard Page Structure
<Container fluid>
  <Row>
    <Col xs={12}>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center w-100">
            <Card.Title className="mb-0">Page Title</Card.Title>
            <Button variant="primary" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Item
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-2 align-items-center mb-3">
            <FormControl placeholder="Search..." />
            <FormSelect>
              <option value="">All Status</option>
            </FormSelect>
          </div>
          <Table data={data} columns={columns} />
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
```

#### 3. **Form Structure Rules**
```jsx
// Standard Form Structure
<Form>
  <FormRow>
    <TextField
      label="Field Label"
      value={value}
      onChange={handleChange}
      required
      col={6}
      invalid={!!errors.field}
      feedback={errors.field}
    />
  </FormRow>
</Form>
```

#### 4. **Modal Structure Rules**
```jsx
// Standard Modal Structure
<Modal visible={visible} onClose={onClose} title="Modal Title">
  <Modal.Body>
    {/* Modal content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    <Button variant="primary" onClick={onConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

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
- **Vite** for build tooling
- **ESLint** for code linting
- **Prettier** for code formatting
- **React DevTools** for debugging

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

*This document should be updated as the project evolves and new patterns emerge.*
