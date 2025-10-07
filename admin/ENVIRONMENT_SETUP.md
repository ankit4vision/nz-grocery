# 🌍 Environment Configuration Guide

## 📋 Overview

The admin project now supports multiple environment configurations similar to the client project. This allows for proper separation of development, staging, and production settings.

## 📁 Environment Files

### **Environment File Structure**
```
admin/
├── env.example          # Template file (safe to commit)
├── env.local           # Local development (git ignored)
├── env.staging         # Staging environment (git ignored)
└── env.production      # Production environment (git ignored)
```

### **File Purposes**

| File | Purpose | Committed | Usage |
|------|---------|-----------|-------|
| `env.example` | Template with all variables | ✅ Yes | Copy to create other env files |
| `env.local` | Local development settings | ❌ No | Default for `npm run dev` |
| `env.staging` | Staging environment | ❌ No | Used with `npm run build:staging` |
| `env.production` | Production environment | ❌ No | Used with `npm run build:prod` |

## 🚀 Available Commands

### **Development Commands**
```bash
# Start development server (uses env.local)
npm run dev
npm start

# Build for different environments
npm run build:dev      # Development build
npm run build:staging  # Staging build
npm run build:prod     # Production build

# Preview builds
npm run preview:dev     # Preview development build
npm run preview:staging # Preview staging build
npm run preview:prod    # Preview production build
```

## ⚙️ Environment Variables

### **Application Configuration**
```bash
VITE_APP_NAME="NZ Grocery Admin"        # Application name
VITE_APP_VERSION="1.0.0"               # Application version
VITE_APP_ENVIRONMENT="development"      # Environment identifier
```

### **API Configuration**
```bash
VITE_API_BASE_URL="http://localhost:3001/api"  # Backend API URL
VITE_API_TIMEOUT="30000"                       # API timeout in ms
```

### **Authentication Configuration**
```bash
VITE_AUTH_TOKEN_KEY="admin_auth_token"         # Token storage key
VITE_AUTH_REFRESH_TOKEN_KEY="admin_refresh_token"  # Refresh token key
VITE_AUTH_TOKEN_EXPIRY="3600000"               # Token expiry time
```

### **Feature Flags**
```bash
VITE_ENABLE_ANALYTICS="true"    # Enable Google Analytics
VITE_ENABLE_DEBUG="true"         # Enable debug mode
VITE_ENABLE_MOCK_DATA="true"    # Use mock data instead of API
```

### **External Services**
```bash
VITE_GOOGLE_ANALYTICS_ID=""     # Google Analytics tracking ID
VITE_SENTRY_DSN=""              # Sentry error tracking DSN
```

### **Build Configuration**
```bash
VITE_BUILD_SOURCEMAP="true"     # Generate source maps
VITE_BUILD_MINIFY="false"       # Minify build output
```

### **Database Configuration**
```bash
VITE_DB_HOST="localhost"        # Database host
VITE_DB_PORT="5432"             # Database port
VITE_DB_NAME="nz_grocery_admin" # Database name
VITE_DB_USER="admin"            # Database user
VITE_DB_PASSWORD=""             # Database password
```

### **Email Configuration**
```bash
VITE_SMTP_HOST="localhost"      # SMTP server host
VITE_SMTP_PORT="587"            # SMTP server port
VITE_SMTP_USER=""               # SMTP username
VITE_SMTP_PASSWORD=""          # SMTP password
```

### **File Upload Configuration**
```bash
VITE_MAX_FILE_SIZE="10485760"                    # Max file size (10MB)
VITE_ALLOWED_FILE_TYPES="jpg,jpeg,png,gif,pdf"  # Allowed file extensions
```

### **Security Configuration**
```bash
VITE_ENABLE_CORS="true"         # Enable CORS
VITE_CORS_ORIGIN="http://localhost:3000"  # Allowed CORS origin
VITE_ENABLE_CSRF="true"         # Enable CSRF protection
```

### **Logging Configuration**
```bash
VITE_LOG_LEVEL="debug"          # Log level (debug, info, warn, error)
VITE_LOG_ENABLE_CONSOLE="true"  # Enable console logging
VITE_LOG_ENABLE_FILE="false"    # Enable file logging
```

## 🔧 Setup Instructions

### **1. Initial Setup**
```bash
# Copy the example file to create your local environment
cp env.example env.local

# Edit the local environment file with your settings
# Use your preferred editor to modify env.local
```

### **2. Environment-Specific Setup**

#### **Local Development**
```bash
# Use env.local for development
npm run dev
```

#### **Staging Deployment**
```bash
# Build for staging
npm run build:staging

# Preview staging build
npm run preview:staging
```

#### **Production Deployment**
```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview:prod
```

## 🛠️ Using Environment Variables in Code

### **Accessing Variables**
```jsx
// In your React components
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
const isDebugMode = import.meta.env.VITE_ENABLE_DEBUG === 'true'

// Using in API calls
const response = await fetch(`${apiBaseUrl}/users`)
```

### **Type Safety (Recommended)**
```jsx
// Create a config object for better type safety
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  appName: import.meta.env.VITE_APP_NAME || 'NZ Grocery Admin',
  isDebugMode: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
}
```

## 🔒 Security Best Practices

### **Environment File Security**
- ✅ **Never commit** `.env.local`, `.env.staging`, `.env.production`
- ✅ **Always commit** `env.example` as a template
- ✅ **Use strong passwords** for production environments
- ✅ **Rotate secrets** regularly in production

### **Variable Naming**
- ✅ **Prefix with VITE_** for client-side access
- ✅ **Use descriptive names** (e.g., `VITE_API_BASE_URL`)
- ✅ **Use UPPERCASE** for environment variables
- ✅ **Use underscores** for word separation

## 🚀 Deployment Workflow

### **Development Workflow**
```bash
# 1. Start development
npm run dev

# 2. Make changes
# 3. Test locally
# 4. Build for staging
npm run build:staging
npm run preview:staging
```

### **Production Workflow**
```bash
# 1. Build for production
npm run build:prod

# 2. Test production build
npm run preview:prod

# 3. Deploy to production server
# (Deploy the 'dist' folder to your web server)
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Environment Variables Not Loading**
```bash
# Check if variables are prefixed with VITE_
VITE_API_BASE_URL="http://localhost:3001/api"  # ✅ Correct
API_BASE_URL="http://localhost:3001/api"        # ❌ Wrong

# Restart development server after changes
npm run dev
```

#### **Build Issues**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build:prod
```

#### **Proxy Issues**
```bash
# Check vite.config.js proxy configuration
# Ensure VITE_API_BASE_URL is set correctly
```

## 📊 Environment Comparison

| Setting | Development | Staging | Production |
|---------|-------------|---------|------------|
| **Debug Mode** | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| **Source Maps** | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| **Minification** | ❌ Disabled | ✅ Enabled | ✅ Enabled |
| **Analytics** | ❌ Disabled | ✅ Enabled | ✅ Enabled |
| **Mock Data** | ✅ Enabled | ❌ Disabled | ❌ Disabled |
| **Console Logs** | ✅ Enabled | ✅ Enabled | ❌ Disabled |

## 🎯 Next Steps

1. **✅ Copy `env.example`** to create your environment files
2. **✅ Update variables** with your specific values
3. **✅ Test builds** for each environment
4. **✅ Deploy** using appropriate build commands

---

**🎉 Your admin project now has professional environment configuration!**
