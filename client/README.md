# NZ Grocery Store - React Frontend

A modern React application built with Vite and React Bootstrap for the NZ Grocery Store.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🔧 Build Commands

### Development Build
```bash
npm run build:dev
```

### Staging Build
```bash
npm run build:staging
```

### Production Build
```bash
npm run build:prod
```

### Preview Builds
```bash
npm run preview:dev      # Preview dev build
npm run preview:staging  # Preview staging build
npm run preview:prod     # Preview production build
```

## 📦 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Bootstrap** - Component library
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **FontAwesome** - Icon library
- **Local Storage** - Data persistence
- **Context API** - State management

## 📁 Project Structure

```
client/
├── public/                      # Static assets
│   ├── approval-requirnment/    # Project requirement images
│   └── vite.svg
├── src/                         # Source code
│   ├── components/              # Reusable components
│   │   ├── common/              # Common/shared components
│   │   │   ├── AlertMessage.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── CustomButton.jsx
│   │   │   ├── CustomSelect.jsx
│   │   │   ├── ImageWithFallback.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── LoadMore.jsx
│   │   │   ├── NavigationButtons.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── index.js
│   │   ├── layout/              # Layout components
│   │   │   ├── AppFooter.jsx
│   │   │   ├── AppNavbar.jsx
│   │   │   ├── BrowseSidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LayoutWrapper.jsx
│   │   │   ├── UserProfileDropdown.jsx
│   │   │   └── index.js
│   │   ├── ui/                  # UI components
│   │   │   ├── AdsBanner.jsx
│   │   │   ├── AllCategories.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   ├── CategoryOverview.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── CustomerReviews.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── DeliveryInfo.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── ForgotPasswordModal.jsx
│   │   │   ├── FormWrapper.jsx
│   │   │   ├── HalfPriceSpecial.jsx
│   │   │   ├── HelpCenter.jsx
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── InfoCard.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   ├── ModalDialog.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── OrderItems.jsx
│   │   │   ├── OrderStatus.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── OrderSummaryBreakdown.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── PaymentMethod.jsx
│   │   │   ├── PriceSection.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductImageGallery.jsx
│   │   │   ├── ProductInfo.jsx
│   │   │   ├── ProfileInformation.jsx
│   │   │   ├── PurchaseNote.jsx
│   │   │   ├── SignupModal.jsx
│   │   │   ├── SimilarProducts.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ValueSection.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   └── index.js
│   │   └── index.js
│   ├── pages/                   # Page components
│   │   ├── About.jsx & About.css
│   │   ├── Checkout.jsx & Checkout.css
│   │   ├── Home.jsx & Home.css
│   │   ├── OrderDetails.jsx & OrderDetails.css
│   │   ├── ProductDetail.jsx & ProductDetail.css
│   │   ├── Products.jsx & Products.css
│   │   └── UserDashboard.jsx & UserDashboard.css
│   ├── data/                    # Mock data files
│   │   └── mockData.js
│   ├── assets/                  # Static assets
│   │   ├── images/              # Image assets
│   │   │   ├── ads-banner/      # Ads banner images (6 files)
│   │   │   ├── main-slider/     # Hero slider images (4 files)
│   │   │   ├── placeholder.svg
│   │   ├── logo/                # Logo images
│   │   │   └── logo-transprant.png
│   │   └── react.svg
│   ├── styles/                  # Global styles
│   │   ├── components/          # Component-specific styles
│   │   │   ├── buttons/         # Button component styles
│   │   │   │   ├── custom-button.css
│   │   │   │   └── load-more.css
│   │   │   ├── forms/           # Form component styles
│   │   │   │   └── custom-select.css
│   │   │   ├── cards/           # Card component styles
│   │   │   │   └── product-card.css
│   │   │   ├── modals/          # Modal component styles
│   │   │   │   └── modal-dialog.css
│   │   │   ├── tables/          # Table component styles
│   │   │   │   └── data-table.css
│   │   │   ├── navigation/      # Navigation component styles
│   │   │   │   ├── app-navbar.css
│   │   │   │   ├── breadcrumb.css
│   │   │   │   ├── navigation-buttons.css
│   │   │   │   └── user-profile-dropdown.css
│   │   │   ├── layout-elements/ # Layout component styles
│   │   │   │   ├── app-footer.css
│   │   │   │   ├── browse-sidebar.css
│   │   │   │   ├── layout-wrapper.css
│   │   │   │   └── layout.css
│   │   │   ├── ui-elements/     # UI element styles
│   │   │   │   ├── alert-message.css
│   │   │   │   ├── hero-slider.css
│   │   │   │   ├── image-with-fallback.css
│   │   │   │   └── loader.css
│   │   │   ├── ui-components/   # UI component styles (31 files)
│   │   │   │   ├── ads-banner.css
│   │   │   │   ├── all-categories.css
│   │   │   │   ├── auth-modal.css
│   │   │   │   ├── cart-sidebar.css
│   │   │   │   ├── category-overview.css
│   │   │   │   ├── change-password.css
│   │   │   │   ├── confirm-dialog.css
│   │   │   │   ├── customer-reviews.css
│   │   │   │   ├── delivery-info.css
│   │   │   │   ├── featured-products.css
│   │   │   │   ├── form-wrapper.css
│   │   │   │   ├── help-center.css
│   │   │   │   ├── info-card.css
│   │   │   │   ├── my-orders.css
│   │   │   │   ├── order-items.css
│   │   │   │   ├── order-status.css
│   │   │   │   ├── order-summary-breakdown.css
│   │   │   │   ├── order-summary.css
│   │   │   │   ├── pagination.css
│   │   │   │   ├── payment-method.css
│   │   │   │   ├── price-section.css
│   │   │   │   ├── product-filters.css
│   │   │   │   ├── product-grid.css
│   │   │   │   ├── product-image-gallery.css
│   │   │   │   ├── product-info.css
│   │   │   │   ├── profile-information.css
│   │   │   │   ├── purchase-note.css
│   │   │   │   ├── similar-products.css
│   │   │   │   ├── stat-card.css
│   │   │   │   ├── value-section.css
│   │   │   │   └── wishlist.css
│   │   │   └── index.css
│   │   ├── layouts/             # Layout-specific styles
│   │   │   └── index.css
│   │   ├── utilities/           # Utility classes
│   │   │   └── index.css
│   │   ├── theme.css            # CSS variables & theme
│   │   ├── custom.css           # Bootstrap overrides
│   │   └── global-forms.css     # Global form controls styling
│   ├── utils/                   # Utility functions
│   │   ├── api.js
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── index.js
│   ├── hooks/                   # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useCart.js
│   │   ├── useDebounce.js
│   │   ├── useFavorites.js
│   │   ├── useLocalStorage.js
│   │   └── index.js
│   ├── services/                # API services
│   │   ├── api/                 # API service modules
│   │   │   ├── auth.js
│   │   │   ├── cart.js
│   │   │   ├── categories.js
│   │   │   ├── orders.js
│   │   │   ├── products.js
│   │   │   ├── users.js
│   │   │   └── index.js
│   │   └── index.js
│   ├── context/                 # React Context providers
│   │   ├── AppContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── UserContext.jsx
│   │   └── index.js
│   ├── constants/               # Application constants
│   │   ├── apiConstants.js
│   │   ├── appConstants.js
│   │   ├── uiConstants.js
│   │   └── index.js
│   ├── config/                  # Configuration files
│   │   └── fontawesome.js
│   ├── __tests__/               # Test files
│   │   └── sample.test.js
│   ├── __mocks__/               # Mock files
│   │   └── index.js
│   ├── test-utils/              # Test utilities
│   │   ├── index.js
│   │   ├── setup.js
│   │   └── testData.js
│   ├── App.jsx                  # Main App component
│   ├── App.css                  # App component styles
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global CSS
├── .env.local                   # Environment variables (local)
├── .env.staging                 # Environment variables (staging)
├── .env.production              # Environment variables (production)
├── .env.example                 # Environment variables template
├── .htaccess                    # Apache configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── package-lock.json            # Dependency lock file
├── vite.config.js               # Vite configuration
├── vitest.config.js             # Vitest configuration
├── eslint.config.js             # ESLint configuration
├── .gitignore                   # Git ignore rules
└── node_modules/                # Dependencies
```
