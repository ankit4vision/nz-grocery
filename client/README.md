# NZ Grocery Store - React Frontend

A modern React application built with Vite and React Bootstrap for the NZ Grocery Store.

## 🚀 Features

- **React 18** with Vite for fast development
- **React Bootstrap** for beautiful, responsive UI components
- **React Router** for client-side routing
- **Custom CSS** for Bootstrap overrides and styling
- **Environment Configuration** for different deployment stages
- **Clean Project Structure** with organized folders

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── layout/          # Layout components
│   │   ├── Layout.jsx   # Main layout with navigation
│   │   └── Layout.css   # Layout-specific styles
│   ├── ui/              # UI components (buttons, cards, etc.)
│   └── common/          # Common shared components
├── pages/               # Page components
│   ├── Home.jsx         # Homepage
│   ├── Home.css         # Homepage styles
│   ├── Products.jsx     # Products listing
│   ├── Products.css     # Products page styles
│   ├── About.jsx        # About page
│   └── About.css        # About page styles
├── styles/              # Global CSS files
│   └── custom.css       # Custom Bootstrap overrides
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── assets/              # Static assets
├── App.jsx              # Main App component
├── App.css              # App-specific styles
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🌍 Environment Configuration

The project includes environment files for different stages:

- `.env` - Development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

## 🎨 **Component Library**

The project includes a comprehensive component library built with React Bootstrap:

### **Common Components**
- `CustomButton` - Enhanced button with loading states, icons, and variants
- `CustomInput` - Form input with validation states and icons
- `CustomSelect` - Dropdown select with custom styling
- `Loader` - Loading spinner with overlay support
- `AlertMessage` - Alert messages with icons and variants

### **Layout Components**
- `AppNavbar` - Responsive navigation bar
- `AppFooter` - Footer with links and social media
- `LayoutWrapper` - Main layout wrapper with navbar and footer

### **UI Components**
- `InfoCard` - Information display cards with icons
- `StatCard` - Statistics cards with change indicators
- `ModalDialog` - Custom modal dialogs
- `DataTable` - Data tables with sorting and actions
- `FormWrapper` - Form containers with headers
- `ConfirmDialog` - Confirmation dialogs

## 🎨 **Theming System**

The project uses CSS custom properties for easy theming:

- **Colors** - Primary, secondary, status colors, and neutrals
- **Typography** - Font families, sizes, weights, and line heights
- **Spacing** - Consistent spacing scale
- **Border Radius** - Rounded corners scale
- **Shadows** - Elevation system
- **Transitions** - Animation timing

All components use these variables for consistent styling and easy theme changes.

## 📱 Pages

1. **Home** (`/`) - Welcome page with features and stats
2. **Products** (`/products`) - Product catalog with grid and table views
3. **About** (`/about`) - Company information and team details

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Dependencies

- **react** - React library
- **react-dom** - React DOM rendering
- **react-bootstrap** - Bootstrap components for React
- **bootstrap** - Bootstrap CSS framework
- **react-router-dom** - Client-side routing
- **react-router-bootstrap** - Bootstrap components for React Router

## 🚀 Deployment

The application is configured for deployment with environment-specific builds:

- Development: Uses `.env` file
- Staging: Uses `.env.staging` file
- Production: Uses `.env.production` file

Build the application with the appropriate environment file for your deployment target.