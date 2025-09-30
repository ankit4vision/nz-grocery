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
│   │   │   │   ├── CustomButton.css
│   │   │   │   ├── CustomInput.jsx
│   │   │   │   ├── CustomInput.css
│   │   │   │   ├── CustomSelect.jsx
│   │   │   │   ├── CustomSelect.css
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Loader.css
│   │   │   │   ├── NavigationButtons.jsx
│   │   │   │   ├── NavigationButtons.css
│   │   │   │   ├── ImageWithFallback.jsx
│   │   │   │   ├── ImageWithFallback.css
│   │   │   │   └── index.js
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── AppNavbar.jsx
│   │   │   │   ├── AppNavbar.css
│   │   │   │   ├── AppFooter.jsx
│   │   │   │   ├── AppFooter.css
│   │   │   │   ├── LayoutWrapper.jsx
│   │   │   │   ├── LayoutWrapper.css
│   │   │   │   ├── BrowseSidebar.jsx
│   │   │   │   ├── BrowseSidebar.css
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Layout.css
│   │   │   │   └── index.js
│   │   │   ├── ui/                  # UI components
│   │   │   │   ├── InfoCard.jsx
│   │   │   │   ├── InfoCard.css
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── StatCard.css
│   │   │   │   ├── ModalDialog.jsx
│   │   │   │   ├── ModalDialog.css
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── ConfirmDialog.css
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── DataTable.css
│   │   │   │   ├── FormWrapper.jsx
│   │   │   │   ├── FormWrapper.css
│   │   │   │   ├── HeroSlider.jsx
│   │   │   │   ├── HeroSlider.css
│   │   │   │   ├── AdsBanner.jsx
│   │   │   │   ├── AdsBanner.css
│   │   │   │   ├── ValueSection.jsx
│   │   │   │   ├── ValueSection.css
│   │   │   │   ├── PriceSection.jsx
│   │   │   │   ├── PriceSection.css
│   │   │   │   ├── HalfPriceSpecial.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductCard.css
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── FeaturedProducts.css
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Products.jsx
│   │   │   ├── Products.css
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
│   │   │   └── custom.css           # Bootstrap overrides
│   │   ├── utils/                   # Utility functions
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # React Context providers
│   │   ├── config/                  # Configuration files
│   │   │   └── fontawesome.js       # FontAwesome configuration
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global CSS
│   ├── .env                         # Environment variables (local)
│   ├── .env.staging                 # Environment variables (staging)
│   ├── .env.production              # Environment variables (production)
│   ├── package.json                 # Dependencies & scripts
│   ├── package-lock.json            # Dependency lock file
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── .gitignore                   # Git ignore rules
│   └── node_modules/                 # Dependencies
├── PROJECT_STRUCTURE.md             # This file
└── README.md                        # Project documentation
```

## 🛠️ Technology Stack

### **Frontend Framework:**
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing

### **UI Library:**
- **React Bootstrap** - Component library
- **Bootstrap 5** - CSS framework
- **React Icons** - Icon library (FaSearch, FaShoppingCart, FaUser, FaChevronLeft, FaChevronRight)
- **FontAwesome** - Icon library for existing components
- **Custom CSS** - Theme & overrides

### **Development Tools:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📋 Development Rules & Guidelines

### **1. File Naming Conventions**
- ✅ Use **PascalCase** for component files: `CustomButton.jsx`
- ✅ Use **camelCase** for utility files: `apiUtils.js`
- ✅ Use **kebab-case** for CSS files: `custom-button.css`
- ✅ Use **lowercase** for folders: `components/`, `pages/`

### **2. Component Structure**
- ✅ **One component per file**
- ✅ **Separate CSS file** for each component
- ✅ **Export from index.js** for clean imports
- ✅ **Use functional components** with hooks

### **3. CSS & Styling Rules**
- ❌ **NO inline CSS** - Always use separate CSS files
- ✅ **Use CSS variables** from `theme.css`
- ✅ **Bootstrap classes** for layout & utilities
- ✅ **Custom CSS** for component-specific styles
- ✅ **Mobile-first** responsive design

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
import './ComponentName.css';
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
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Dependencies
npm install          # Install dependencies
npm update           # Update dependencies
```

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-bootstrap": "^2.8.0",
  "bootstrap": "^5.3.0",
  "react-router-dom": "^6.15.0",
  "react-icons": "^4.11.0",
  "@fortawesome/fontawesome-svg-core": "^6.4.0",
  "@fortawesome/free-solid-svg-icons": "^6.4.0",
  "@fortawesome/react-fontawesome": "^0.2.0",
  "vite": "^4.4.5"
}
```

## 🔧 Component Categories

### **Common Components:**
- `CustomButton` - Reusable button component
- `CustomInput` - Reusable input component
- `CustomSelect` - Reusable select dropdown component
- `Loader` - Loading spinner component
- `AlertMessage` - Alert/notification component
- `NavigationButtons` - Reusable navigation arrow buttons
- `ImageWithFallback` - Image component with fallback placeholder

### **Layout Components:**
- `AppNavbar` - Main navigation bar
- `AppFooter` - Footer component
- `LayoutWrapper` - Main layout wrapper
- `BrowseSidebar` - Product browsing sidebar
- `Layout` - Base layout component

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
- `PriceSection` - Half price specials section
- `HalfPriceSpecial` - Half price special component
- `ProductCard` - Individual product display card
- `FeaturedProducts` - Featured products grid section

## 📊 Data Structure & Mock Data

### **Mock Data Files:**
- `src/data/mockData.js` - Contains all mock data for the application

### **Data Categories:**
- **Hero Slider Data** (`heroSlidesData`) - Image-only slides for hero section
- **Ads Banner Data** (`adsBannerData`) - Promotional offers and deals
- **Features Data** (`featuresData`) - Application features and benefits
- **Stats Data** (`statsData`) - Statistics and metrics
- **Value Categories Data** (`valueCategoriesData`) - Value section categories with discounts
- **Price Section Data** (`priceSectionData`) - Half price special products
- **Featured Products Data** (`featuredProductsData`) - Featured products with ratings, discounts, and favorites

### **Asset Structure:**
- `src/assets/images/main-slider/` - Hero slider images (4 images)
- `src/assets/images/ads-banner/` - Ads banner images (6 images)
- `src/assets/images/logo/` - Logo images (logo-transprant.png)
- `src/assets/images/placeholder.svg` - Default placeholder image for broken images
- `public/approval-requirnment/` - Project requirement reference images

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
import './NewPage.css';

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
touch src/components/common/NewComponent.css

# For layout component
touch src/components/layout/NewComponent.jsx
touch src/components/layout/NewComponent.css

# For UI component
touch src/components/ui/NewComponent.jsx
touch src/components/ui/NewComponent.css
```

#### **Step 3: Component Template**
```jsx
// src/components/category/NewComponent.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import './NewComponent.css';

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
/* src/components/category/NewComponent.css */

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
