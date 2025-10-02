# NZ Grocery - React + Vite Project

## 📁 Project Folder Structure

```
nz-grocery/
├── client/                          # Main React application
│   ├── public/                      # Static assets
│   │   ├── vite.svg
│   │   ├── approval-requirnment/    # Approval requirement images
│   │   │   ├── browseprodcuts.png
│   │   │   ├── home.png
│   │   │   └── listing.png
│   │   └── index.html
│   ├── src/                         # Source code
│   │   ├── components/              # Reusable components
│   │   │   ├── common/              # Common/shared components
│   │   │   │   ├── CustomButton.jsx
│   │   │   │   ├── CustomSelect.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── AlertMessage.jsx
│   │   │   │   ├── NavigationButtons.jsx
│   │   │   │   ├── ImageWithFallback.jsx
│   │   │   │   ├── Breadcrumb.jsx
│   │   │   │   ├── LoadMore.jsx
│   │   │   │   ├── ScrollToTop.jsx
│   │   │   │   └── index.js
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── AppNavbar.jsx
│   │   │   │   ├── AppFooter.jsx
│   │   │   │   ├── LayoutWrapper.jsx
│   │   │   │   ├── BrowseSidebar.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── UserProfileDropdown.jsx
│   │   │   │   └── index.js
│   │   │   ├── ui/                  # UI components
│   │   │   │   ├── InfoCard.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── ModalDialog.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── FormWrapper.jsx
│   │   │   │   ├── HeroSlider.jsx
│   │   │   │   ├── AdsBanner.jsx
│   │   │   │   ├── ValueSection.jsx
│   │   │   │   ├── PriceSection.jsx
│   │   │   │   ├── HalfPriceSpecial.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── CategoryOverview.jsx
│   │   │   │   ├── ProductFilters.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── AllCategories.jsx
│   │   │   │   ├── ProductImageGallery.jsx
│   │   │   │   ├── ProductInfo.jsx
│   │   │   │   ├── SimilarProducts.jsx
│   │   │   │   ├── CustomerReviews.jsx
│   │   │   │   ├── CartSidebar.jsx
│   │   │   │   ├── DeliveryInfo.jsx
│   │   │   │   ├── PaymentMethod.jsx
│   │   │   │   ├── OrderSummary.jsx
│   │   │   │   ├── OrderStatus.jsx
│   │   │   │   ├── OrderSummaryBreakdown.jsx
│   │   │   │   ├── OrderItems.jsx
│   │   │   │   ├── PurchaseNote.jsx
│   │   │   │   ├── ProfileInformation.jsx
│   │   │   │   ├── ChangePassword.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── Wishlist.jsx
│   │   │   │   ├── HelpCenter.jsx
│   │   │   │   ├── LoginModal.jsx
│   │   │   │   ├── SignupModal.jsx
│   │   │   │   ├── ForgotPasswordModal.jsx
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Products.jsx
│   │   │   ├── Products.css
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ProductDetail.css
│   │   │   ├── Checkout.jsx
│   │   │   ├── Checkout.css
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── OrderDetails.css
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── UserDashboard.css
│   │   │   ├── About.jsx
│   │   │   └── About.css
│   │   ├── data/                    # Mock data files
│   │   │   └── mockData.js
│   │   ├── assets/                  # Static assets
│   │   │   ├── images/              # Image assets
│   │   │   │   ├── ads-banner/      # Ads banner images
│   │   │   │   │   ├── banner1.jpg
│   │   │   │   │   ├── banner2.jpg
│   │   │   │   │   ├── banner3.jpg
│   │   │   │   │   ├── banner4.jpg
│   │   │   │   │   ├── banner5.jpg
│   │   │   │   │   └── banner6.jpg
│   │   │   │   └── main-slider/     # Hero slider images
│   │   │   │       ├── 6994918.jpg
│   │   │   │       ├── 8449371.jpg
│   │   │   │       ├── 8449377.jpg
│   │   │   │       └── 8486222.jpg
│   │   │   │   ├── logo/            # Logo images
│   │   │   │   │   └── logo-transprant.png
│   │   │   │   └── placeholder.svg  # Default placeholder image
│   │   │   └── react.svg
│   │   ├── styles/                  # Global styles
│   │   │   ├── theme.css            # CSS variables & theme
│   │   │   ├── custom.css           # Bootstrap overrides
│   │   │   ├── global-forms.css     # Global form controls styling
│   │   │   ├── components/          # Component-specific styles
│   │   │   │   ├── buttons/         # Button component styles
│   │   │   │   │   └── custom-button.css
│   │   │   │   ├── forms/           # Form component styles
│   │   │   │   │   └── custom-select.css
│   │   │   │   ├── cards/           # Card component styles
│   │   │   │   │   └── product-card.css
│   │   │   │   ├── modals/          # Modal component styles
│   │   │   │   │   └── modal-dialog.css
│   │   │   │   ├── tables/          # Table component styles
│   │   │   │   │   └── data-table.css
│   │   │   │   ├── navigation/      # Navigation component styles
│   │   │   │   │   ├── app-navbar.css
│   │   │   │   │   ├── breadcrumb.css
│   │   │   │   │   ├── navigation-buttons.css
│   │   │   │   │   └── user-profile-dropdown.css
│   │   │   │   ├── layout-elements/ # Layout component styles
│   │   │   │   │   ├── app-footer.css
│   │   │   │   │   ├── browse-sidebar.css
│   │   │   │   │   ├── layout.css
│   │   │   │   │   └── layout-wrapper.css
│   │   │   │   ├── ui-elements/     # UI element styles
│   │   │   │   │   ├── hero-slider.css
│   │   │   │   │   ├── alert-message.css
│   │   │   │   │   ├── loader.css
│   │   │   │   │   └── image-with-fallback.css
│   │   │   │   ├── ui-components/   # UI component styles
│   │   │   │   │   ├── all-categories.css
│   │   │   │   │   ├── product-filters.css
│   │   │   │   │   ├── product-grid.css
│   │   │   │   │   ├── pagination.css
│   │   │   │   │   ├── category-overview.css
│   │   │   │   │   ├── featured-products.css
│   │   │   │   │   ├── price-section.css
│   │   │   │   │   ├── value-section.css
│   │   │   │   │   ├── ads-banner.css
│   │   │   │   │   ├── form-wrapper.css
│   │   │   │   │   ├── confirm-dialog.css
│   │   │   │   │   ├── stat-card.css
│   │   │   │   │   ├── info-card.css
│   │   │   │   │   ├── product-image-gallery.css
│   │   │   │   │   ├── product-info.css
│   │   │   │   │   ├── similar-products.css
│   │   │   │   │   ├── customer-reviews.css
│   │   │   │   │   ├── cart-sidebar.css
│   │   │   │   │   ├── delivery-info.css
│   │   │   │   │   ├── payment-method.css
│   │   │   │   │   ├── order-summary.css
│   │   │   │   │   ├── order-status.css
│   │   │   │   │   ├── order-summary-breakdown.css
│   │   │   │   │   ├── order-items.css
│   │   │   │   │   ├── purchase-note.css
│   │   │   │   │   ├── profile-information.css
│   │   │   │   │   ├── change-password.css
│   │   │   │   │   ├── my-orders.css
│   │   │   │   │   ├── wishlist.css
│   │   │   │   │   ├── help-center.css
│   │   │   │   │   └── auth-modal.css
│   │   │   │   └── index.css        # Central import file
│   │   │   ├── layouts/             # Layout-specific styles
│   │   │   │   └── index.css
│   │   │   └── utilities/           # Utility classes
│   │   │       └── index.css
│   │   ├── utils/                   # Utility functions
│   │   │   ├── api.js               # API utilities
│   │   │   ├── formatters.js        # Data formatting
│   │   │   ├── validators.js        # Form validation
│   │   │   ├── constants.js         # App constants
│   │   │   ├── helpers.js           # General helpers
│   │   │   └── index.js             # Export file
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useLocalStorage.js   # Local storage hook
│   │   │   ├── useDebounce.js       # Debounce hook
│   │   │   ├── useApi.js            # API hook
│   │   │   ├── useCart.js           # Cart management hook
│   │   │   ├── useFavorites.js      # Favorites hook
│   │   │   └── index.js             # Export file
│   │   ├── services/                # API services
│   │   │   ├── api/                 # API service modules
│   │   │   │   ├── products.js      # Products API
│   │   │   │   ├── categories.js    # Categories API
│   │   │   │   ├── users.js         # Users API
│   │   │   │   ├── cart.js          # Cart API
│   │   │   │   ├── orders.js        # Orders API
│   │   │   │   └── auth.js          # Authentication API
│   │   │   └── index.js             # Export file
│   │   ├── context/                 # React Context providers
│   │   │   ├── CartContext.jsx      # Cart state management
│   │   │   ├── UserContext.jsx      # User state management
│   │   │   ├── ThemeContext.jsx     # Theme state management
│   │   │   ├── AppContext.jsx       # App-wide state
│   │   │   └── index.js             # Export file
│   │   ├── __tests__/               # Test files
│   │   │   └── sample.test.js       # Sample test
│   │   ├── __mocks__/               # Mock files
│   │   │   └── index.js             # Mock utilities
│   │   ├── test-utils/              # Test utilities
│   │   │   ├── render.js            # Custom render function
│   │   │   └── testData.js          # Test data
│   │   ├── config/                  # Configuration files
│   │   │   └── fontawesome.js       # FontAwesome configuration
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global CSS
│   ├── .env.local                   # Environment variables (local)
│   ├── .env.staging                 # Environment variables (staging)
│   ├── .env.production              # Environment variables (production)
│   ├── .env.example                 # Environment variables template
│   ├── package.json                 # Dependencies & scripts
│   ├── package-lock.json            # Dependency lock file
│   ├── vite.config.js               # Vite configuration
│   ├── vitest.config.js             # Vitest configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── .gitignore                   # Git ignore rules
│   └── node_modules/                 # Dependencies
├── PROJECT_STRUCTURE.md             # This file
└── README.md                        # Project documentation
```

## 🛠️ Technology Stack

### **Frontend Framework:**
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing

### **UI Library:**
- **React Bootstrap** - Component library
- **Bootstrap 5** - CSS framework
- **React Icons** - Icon library (FaSearch, FaShoppingCart, FaUser, FaChevronLeft, FaChevronRight, FaTimes, FaTrash, FaMinus, FaPlus)
- **FontAwesome** - Icon library for existing components
- **Custom CSS** - Theme & overrides
- **Offcanvas** - React Bootstrap offcanvas for cart sidebar

### **Development Tools:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Git** - Version control

## 📋 Development Rules & Guidelines

### **1. File Naming Conventions**
- ✅ Use **PascalCase** for component files: `CustomButton.jsx`
- ✅ Use **camelCase** for utility files: `apiUtils.js`
- ✅ Use **kebab-case** for CSS files: `custom-button.css`
- ✅ Use **lowercase** for folders: `components/`, `pages/`

### **2. Component Structure**
- ✅ **One component per file**
- ✅ **Centralized CSS** in `styles/components/` directory
- ✅ **Export from index.js** for clean imports
- ✅ **Use functional components** with hooks
- ✅ **Import CSS from centralized location**

### **3. CSS & Styling Rules**
- ❌ **NO inline CSS** - Always use separate CSS files
- ✅ **Use CSS variables** from `theme.css`
- ✅ **Bootstrap classes** for layout & utilities
- ✅ **Custom CSS** for component-specific styles
- ✅ **Mobile-first** responsive design
- ✅ **Centralized CSS** in `styles/components/` directory
- ✅ **Categorized styles** by component type

### **4. Import Organization**
```jsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Container, Row, Col } from 'react-bootstrap';

// 3. Internal components
import { CustomButton } from '../common';
import { AppNavbar } from '../layout';

// 4. Styles
import '../../styles/components/category/component-name.css';
```

### **5. Component Props & State**
- ✅ **Use TypeScript-style prop validation** in comments
- ✅ **Destructure props** for cleaner code
- ✅ **Use useState** for local state
- ✅ **Use useEffect** for side effects

### **6. Environment Variables**
- ✅ **Prefix with VITE_** for client-side access
- ✅ **Use .env files** for different environments
- ✅ **Never commit sensitive data**

### **7. Git Workflow**
- ✅ **Feature branches** for new features
- ✅ **Descriptive commit messages**
- ✅ **Pull requests** for code review
- ✅ **Keep commits atomic**

## 🎨 Theme & Design System

### **CSS Variables (theme.css):**
```css
:root {
  /* Colors */
  --primary-color: #28a745;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  
  /* Typography */
  --font-family-base: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Border Radius */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
}
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run build:staging # Build for staging
npm run build:prod   # Build for production
npm run preview      # Preview production build
npm run preview:dev  # Preview development build
npm run preview:staging # Preview staging build
npm run preview:prod # Preview production build
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
npm run test:watch   # Run tests in watch mode

# Dependencies
npm install          # Install dependencies
npm update           # Update dependencies
```

## 📦 Key Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-bootstrap": "^2.10.10",
  "bootstrap": "^5.3.8",
  "react-router-dom": "^7.9.3",
  "react-icons": "^5.5.0",
  "@fortawesome/fontawesome-svg-core": "^7.0.1",
  "@fortawesome/free-solid-svg-icons": "^7.0.1",
  "@fortawesome/react-fontawesome": "^3.0.2",
  "vite": "npm:rolldown-vite@7.1.12",
  "vitest": "^3.2.4",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.8.0",
  "@testing-library/user-event": "^14.6.1"
}
```

## 🔧 Component Categories

### **Common Components:**
- `CustomButton` - Reusable button component
- `CustomSelect` - Reusable select dropdown component
- `Loader` - Loading spinner component
- `AlertMessage` - Alert/notification component
- `NavigationButtons` - Reusable navigation arrow buttons
- `ImageWithFallback` - Image component with fallback placeholder
- `Breadcrumb` - Breadcrumb navigation component
- `LoadMore` - Load more button component
- `ScrollToTop` - Scroll to top functionality component

### **Layout Components:**
- `AppNavbar` - Main navigation bar with search, cart, and user authentication
- `AppFooter` - Footer component
- `LayoutWrapper` - Main layout wrapper
- `BrowseSidebar` - Product browsing sidebar
- `Layout` - Base layout component
- `UserProfileDropdown` - User profile dropdown menu with authentication state, user info display, and navigation links

### **UI Components:**
- `InfoCard` - Information display card
- `StatCard` - Statistics display card
- `DataTable` - Data table with sorting/filtering
- `ModalDialog` - Modal dialog component
- `ConfirmDialog` - Confirmation dialog
- `FormWrapper` - Form wrapper component
- `HeroSlider` - Hero section image slider
- `AdsBanner` - Promotional ads carousel banner
- `ValueSection` - Value categories display section
- `PriceSection` - Half price specials section with cart integration
- `HalfPriceSpecial` - Half price special component
- `ProductCard` - Individual product display card with dynamic cart functionality
- `FeaturedProducts` - Featured products grid section
- `CategoryOverview` - Category overview component
- `ProductFilters` - Product filtering and sorting component
- `ProductGrid` - Product grid display component
- `Pagination` - Pagination controls component
- `AllCategories` - All categories horizontal slider component
- `ProductImageGallery` - Product image gallery with thumbnails and modal
- `ProductInfo` - Product details, pricing, and add-to-cart functionality
- `SimilarProducts` - Similar products carousel section
- `CustomerReviews` - Customer reviews display and write review functionality
- `CartSidebar` - Shopping cart sidebar with full cart management functionality
- `DeliveryInfo` - Delivery information form with day/time selection and contact details
- `PaymentMethod` - Payment method selection with card details and payment options
- `OrderSummary` - Order summary with items, pricing breakdown, promo codes, and checkout button
- `OrderStatus` - Order status display with payment status badge, order summary cards, and progress tracker
- `OrderSummaryBreakdown` - Order amount breakdown component showing subtotal, shipping, tax, discount, and total
- `OrderItems` - Itemized product list component displaying order items with images, quantities, and prices
- `PurchaseNote` - Delivery instructions and special notes component
- `ProfileInformation` - User profile information form with photo upload, personal details, and address management
- `ChangePassword` - Password change form with current/new password fields and validation
- `MyOrders` - User order history display with order status and details
- `Wishlist` - User wishlist management with product cards and summary
- `HelpCenter` - FAQ and help center with categorized questions and contact options
- `LoginModal` - User login modal with email/mobile toggle and form validation
- `SignupModal` - User registration modal with form validation and terms acceptance
- `ForgotPasswordModal` - Password reset modal with 3-step process (Email → OTP → New Password)

## 🛒 Cart System & State Management

### **Cart Context (`CartContext.jsx`):**
- **Global State Management** - Centralized cart state using React Context
- **Cart Actions** - Add, remove, update quantity, clear cart
- **Real-time Updates** - Instant cart count and price calculations
- **Local Storage** - Persistent cart data across sessions
- **Error Handling** - Comprehensive error states and loading management

### **User Context (`UserContext.jsx`):**
- **Authentication Management** - Login, logout, signup, password reset
- **User Profile State** - User information, preferences, and session management
- **Loading States** - Prevents premature redirects during authentication checks
- **Local Storage Integration** - Persistent user sessions across browser refreshes
- **OTP Management** - OTP generation, storage, and verification for password reset
- **Session Management** - Session creation, validation, and destruction

### **Cart Functionality:**
- **Add to Cart** - Works across all pages (Home, Products, Product Detail)
- **Dynamic UI** - Shows "Add to Cart" or quantity selector based on cart state
- **Quantity Management** - Increase/decrease quantities with visual feedback
- **Cart Sidebar** - Professional offcanvas cart panel
- **Real-time Badge** - Cart item count in navigation
- **Price Calculations** - Automatic subtotal and savings calculations
- **Empty State** - Engaging empty cart with call-to-action

### **Cart Integration Points:**
- **Home Page** - Featured products and Half Price Special sections
- **Products Page** - Product grid with cart functionality
- **Product Detail** - Main product and similar products
- **Checkout Page** - Complete checkout flow with cart integration
- **Order Details Page** - Order confirmation and tracking after checkout
- **Navigation** - Cart icon with item count badge
- **Layout Wrapper** - Cart sidebar integration

## 📊 Data Structure & Mock Data

### **Mock Data Files:**
- `src/data/mockData.js` - Contains all mock data for the application

### **Data Categories:**
- **Ads Banner Data** (`adsBannerData`) - Promotional offers and deals
- **Hero Slider Data** (`heroSlidesData`) - Image-only slides for hero section
- **Products Data** (`productsData`) - Sample products for home page
- **Categories Data** (`categoriesData`) - Product categories with icons and descriptions
- **Features Data** (`featuresData`) - Application features and benefits
- **Stats Data** (`statsData`) - Statistics and metrics
- **Specials Data** (`specialsData`) - Special offers and promotions
- **Value Categories Data** (`valueCategoriesData`) - Value section categories with discounts
- **Price Section Data** (`priceSectionData`) - Half price special products
- **Products Listing Data** (`productsListingData`) - Comprehensive product data for Products page
- **Filter Options Data** (`filterOptionsData`) - Sorting and filtering options
- **Featured Products Data** (`featuredProductsData`) - Featured products with ratings, discounts, and favorites
- **Popular Cards Data** (`popularCardsData`) - BrowseSidebar popular suggestions and offers
- **Navigation Data** (`navItemsData`) - Main navigation menu items
- **Footer Links Data** (`footerLinksData`) - Footer navigation links
- **Social Links Data** (`socialLinksData`) - Social media links
- **Product Detail Data** (`productDetailData`) - Detailed product information for product detail page
- **Similar Products Data** (`similarProductsData`) - Similar products for product detail page
- **Customer Reviews Data** (`customerReviewsData`) - Customer reviews and ratings for products
- **Order Details Data** (`orderDetailsData`) - Sample order data with status, progress steps, items, and customer information
- **Authentication Mock Data** (`authMockData`) - User authentication data with users, OTP storage, sessions, and helper functions

### **Asset Structure:**
- `src/assets/images/main-slider/` - Hero slider images (4 images)
- `src/assets/images/ads-banner/` - Ads banner images (6 images)
- `src/assets/images/logo/` - Logo images (logo-transprant.png)
- `src/assets/images/placeholder.svg` - Default placeholder image for broken images
- `public/approval-requirnment/` - Project requirement reference images

### **Page Structure:**
- **Home Page** (`Home.jsx`) - Main landing page with hero slider, ads banner, value section, price section, and featured products
- **Products Page** (`Products.jsx`) - Product listing page with breadcrumb, categories, product grid, and pagination
- **Product Detail Page** (`ProductDetail.jsx`) - Individual product detail page with image gallery, product info, similar products, and customer reviews
- **Checkout Page** (`Checkout.jsx`) - Complete checkout flow with delivery information, payment method, and order summary
- **Order Details Page** (`OrderDetails.jsx`) - Order tracking and details page with progress status, order summary, items list, delivery notes, and context-aware back navigation
- **User Dashboard Page** (`UserDashboard.jsx`) - User account dashboard with tabbed navigation for profile, password, orders, wishlist, and help, with authentication protection and loading states
- **About Page** (`About.jsx`) - About page component

## 🔐 Authentication System

### **Authentication Features:**
- **Login Modal** - Email/mobile toggle with form validation and pre-filled demo credentials
- **Signup Modal** - User registration with form validation and terms acceptance
- **Forgot Password Modal** - 3-step password reset process (Email → OTP → New Password)
- **User Profile Dropdown** - Context-aware navigation with user avatar, name, and role display
- **Session Management** - Persistent login sessions with localStorage integration
- **Loading States** - Prevents premature redirects during authentication checks
- **OTP System** - OTP generation, storage, and verification for password reset

### **Authentication Flow:**
1. **Login** - User enters credentials → Validation → Session creation → Dashboard access
2. **Signup** - User registration → Account creation → Auto-login → Dashboard access
3. **Password Reset** - Email entry → OTP verification → New password → Login
4. **Logout** - Session destruction → Redirect to home page
5. **Protected Routes** - Dashboard requires authentication with loading states

### **User Context Integration:**
- **Global State** - User authentication state across entire application
- **Profile Data** - User information, preferences, and session management
- **Loading Management** - Prevents race conditions during authentication checks
- **Local Storage** - Persistent sessions across browser refreshes
- **Error Handling** - Comprehensive error states and user feedback

## 🚀 Creating New Functionality & Pages

### **📄 Creating a New Page**

#### **Step 1: Create Page Files**
```bash
# Create page component
touch src/pages/NewPage.jsx
touch src/pages/NewPage.css
```

#### **Step 2: Page Component Structure**
```jsx
// src/pages/NewPage.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CustomButton } from '../components/common';
import '../../styles/pages/new-page.css';

const NewPage = () => {
  return (
    <Container className="new-page-container">
      <Row>
        <Col>
          <h1 className="page-title">New Page Title</h1>
          {/* Page content */}
        </Col>
      </Row>
    </Container>
  );
};

export default NewPage;
```

#### **Step 3: Add Route**
```jsx
// src/App.jsx
import NewPage from './pages/NewPage';

// Add to Routes
<Route path="/new-page" element={<NewPage />} />

// Example: Order Details route
<Route path="/order/:orderId" element={<OrderDetails />} />
```

#### **Step 4: Update Navigation**
```jsx
// src/components/layout/AppNavbar.jsx
// Add to navItems array
{ name: 'New Page', path: '/new-page' }
```

### **🧩 Creating a New Component**

#### **Step 1: Determine Component Category**
- **Common:** Reusable across multiple pages
- **Layout:** Layout-related components
- **UI:** User interface elements

#### **Step 2: Create Component Files**
```bash
# For common component
touch src/components/common/NewComponent.jsx
touch src/styles/components/category/new-component.css

# For layout component
touch src/components/layout/NewComponent.jsx
touch src/styles/components/layout-elements/new-component.css

# For UI component
touch src/components/ui/NewComponent.jsx
touch src/styles/components/ui-components/new-component.css
```

#### **Step 3: Component Template**
```jsx
// src/components/category/NewComponent.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import '../../styles/components/category/new-component.css';

const NewComponent = ({ 
  title, 
  onAction, 
  className = '' 
}) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Component initialization
  }, []);

  const handleAction = () => {
    // Component logic
    onAction?.();
  };

  return (
    <div className={`new-component ${className}`}>
      <Card>
        <Card.Header>
          <h5>{title}</h5>
        </Card.Header>
        <Card.Body>
          {/* Component content */}
          <Button onClick={handleAction}>
            Action Button
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewComponent;
```

#### **Step 4: Update Index Files**
```jsx
// src/components/category/index.js
export { default as NewComponent } from './NewComponent';
```

### **🔧 Creating New Functionality**

#### **Step 1: Plan the Feature**
- ✅ **Define requirements** clearly
- ✅ **Identify components** needed
- ✅ **Plan state management** approach
- ✅ **Consider API integration** needs

#### **Step 2: Create Required Files**
```bash
# Create utility functions if needed
touch src/utils/newFeatureUtils.js

# Create custom hooks if needed
touch src/hooks/useNewFeature.js

# Create context if needed
touch src/context/NewFeatureContext.jsx
```

#### **Step 3: Implementation Checklist**
- ✅ **Create components** following naming conventions
- ✅ **Add proper CSS** styling (no inline styles)
- ✅ **Implement error handling**
- ✅ **Add loading states**
- ✅ **Test responsive design**
- ✅ **Update navigation** if needed

### **📋 Development Workflow**

#### **Before Starting:**
1. ✅ **Read requirements** thoroughly
2. ✅ **Check existing components** for reuse
3. ✅ **Plan component structure**
4. ✅ **Identify dependencies** needed

#### **During Development:**
1. ✅ **Follow naming conventions**
2. ✅ **Use existing components** when possible
3. ✅ **Write clean, readable code**
4. ✅ **Test on multiple screen sizes**
5. ✅ **Check browser compatibility**

#### **After Development:**
1. ✅ **Test functionality** thoroughly
2. ✅ **Check for console errors**
3. ✅ **Validate responsive design**
4. ✅ **Update documentation**
5. ✅ **Create pull request**

### **🎨 Styling Guidelines for New Components**

#### **CSS File Structure:**
```css
/* src/styles/components/category/new-component.css */

/* Component root */
.new-component {
  /* Base styles */
}

/* Component variants */
.new-component--primary {
  /* Primary variant */
}

.new-component--secondary {
  /* Secondary variant */
}

/* Component states */
.new-component:hover {
  /* Hover state */
}

.new-component:active {
  /* Active state */
}

/* Responsive design */
@media (max-width: 768px) {
  .new-component {
    /* Mobile styles */
  }
}
```

#### **CSS Variables Usage:**
```css
.new-component {
  background-color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--text-primary);
}
```

### **🔗 Integration Rules**

#### **Adding to Navigation:**
```jsx
// src/components/layout/AppNavbar.jsx
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'New Page', path: '/new-page' }, // Add new item
  // ... other items
];
```

#### **Adding to Sidebar:**
```jsx
// src/components/layout/BrowseSidebar.jsx
const categories = [
  {
    id: 'new-category',
    name: 'New Category',
    icon: '🆕',
    subcategories: ['Sub 1', 'Sub 2', 'Sub 3']
  },
  // ... existing categories
];
```

### **🧪 Testing Checklist**

#### **Functionality Testing:**
- ✅ **All features work** as expected
- ✅ **Error handling** is proper
- ✅ **Loading states** are shown
- ✅ **User interactions** are smooth

#### **UI/UX Testing:**
- ✅ **Responsive design** works on all devices
- ✅ **Accessibility** features are implemented
- ✅ **Visual consistency** with existing design
- ✅ **Performance** is optimal

#### **Browser Testing:**
- ✅ **Chrome** - Latest version
- ✅ **Firefox** - Latest version
- ✅ **Safari** - Latest version
- ✅ **Edge** - Latest version

### **📝 Documentation Requirements**

#### **Component Documentation:**
```jsx
/**
 * NewComponent - Description of what this component does
 * 
 * @param {string} title - The title to display
 * @param {function} onAction - Callback function when action is triggered
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <NewComponent 
 *   title="Sample Title" 
 *   onAction={() => console.log('Action triggered')}
 *   className="custom-class"
 * />
 */
```

#### **Feature Documentation:**
- ✅ **Purpose** of the feature
- ✅ **How to use** the feature
- ✅ **Props/parameters** explanation
- ✅ **Examples** of usage
- ✅ **Known limitations**

## 🎯 Best Practices

### **Performance:**
- ✅ **Lazy loading** for routes
- ✅ **Memoization** for expensive calculations
- ✅ **Optimize images** and assets
- ✅ **Code splitting** for large bundles

### **Accessibility:**
- ✅ **Semantic HTML** elements
- ✅ **ARIA labels** for screen readers
- ✅ **Keyboard navigation** support
- ✅ **Color contrast** compliance

### **Code Quality:**
- ✅ **Consistent formatting** with Prettier
- ✅ **ESLint rules** enforcement
- ✅ **Component documentation**
- ✅ **Error boundaries** for error handling

## 🐛 Debugging Tips

### **Common Issues:**
1. **Import errors** - Check file paths and exports
2. **CSS conflicts** - Use specific selectors
3. **State updates** - Check dependency arrays
4. **Router issues** - Verify route configurations

### **Development Tools:**
- **React DevTools** - Component inspection
- **Vite DevTools** - Build analysis
- **Browser DevTools** - Network & performance

## 📝 Notes

- **Always test** on multiple browsers
- **Keep dependencies** up to date
- **Document** complex logic
- **Follow** the established patterns
- **Ask questions** when unsure

---

**Happy Coding! 🚀**
