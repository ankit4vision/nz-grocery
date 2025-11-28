/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'cart',
  FAVORITES: 'favorites',
  USER: 'user',
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  FRESH_PRODUCE: 'fresh-produce',
  MEAT_SEAFOOD: 'meat-seafood',
  DAIRY_EGGS: 'dairy-eggs',
  BAKERY: 'bakery',
  PANTRY: 'pantry',
  BEVERAGES: 'beverages',
  FROZEN: 'frozen',
  HEALTH_BEAUTY: 'health-beauty',
  HOUSEHOLD: 'household',
  BABY: 'baby',
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  DIGITAL_WALLET: 'digital_wallet',
};

// Delivery Options
export const DELIVERY_OPTIONS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  SAME_DAY: 'same_day',
  SCHEDULED: 'scheduled',
  PICKUP: 'pickup',
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VENDOR: 'vendor',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Language Options
export const LANGUAGES = {
  EN: 'en',
  MA: 'ma', // Māori
};

// Currency
export const CURRENCY = {
  CODE: 'NZD',
  SYMBOL: '$',
  LOCALE: 'en-NZ',
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
};

// Rating System
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ITEM_ADDED_TO_CART: 'Item added to cart successfully!',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart.',
  ORDER_PLACED: 'Order placed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PHONE: {
    PATTERN: /^(\+64|0)[2-9]\d{7,9}$/,
    MESSAGE: 'Please enter a valid New Zealand phone number',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  ADDRESS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GET_CURRENT_USER: '/auth/me',
    CHANGE_PASSWORD: '/users/change-password',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    ADDRESSES: {
      LIST: '/users/addresses',
      CREATE: '/users/addresses',
      GET_BY_ID: (id) => `/users/addresses/${id}`,
      UPDATE: (id) => `/users/addresses/${id}`,
      DELETE: (id) => `/users/addresses/${id}`,
      SET_DEFAULT: (id) => `/users/addresses/${id}/set-default`,
    },
  },
  PRODUCTS: {
    CATEGORIES: '/product-service/categories/',
    VARIANTS_FILTER: '/product-service/products/variants/filter',
    DETAIL: (productId) => `/product-service/products/${productId}/full`,
  },
  CART: {
    GET_ACTIVE: (userId) => `/shopping-cart/user/${userId}/active`,
    CREATE: '/shopping-cart/',
    ADD_ITEM: '/shopping-cart/items/',
    GET_ITEMS_WITH_PRICING: (cartId) => `/shopping-cart/${cartId}/items/with-pricing`,
    GET_CART_DETAILS: (cartId) => `/shopping-cart/${cartId}/details`,
    UPDATE_ITEM: (itemId) => `/shopping-cart/items/${itemId}`,
    REMOVE_ITEM: (itemId) => `/shopping-cart/items/${itemId}`,
  },
  ORDERS: {
    CREATE: '/orders/',
    LIST: '/orders/',
    GET_BY_ID: (orderId) => `/orders/${orderId}`,
    GET_DETAILS: (orderId) => `/orders/${orderId}/details`,
    CANCEL: (orderId) => `/orders/${orderId}/cancel`,
  },
  WISHLIST: {
    LIST: '/wishlists/',
    GET_DEFAULT: '/wishlists/default',
    GET_BY_ID: (wishlistId) => `/wishlists/${wishlistId}`,
    GET_DETAILS: (wishlistId) => `/wishlists/${wishlistId}/details`,
    GET_ITEMS: (wishlistId) => `/wishlists/${wishlistId}/items`,
    CREATE: '/wishlists/',
    UPDATE: (wishlistId) => `/wishlists/${wishlistId}`,
    DELETE: (wishlistId) => `/wishlists/${wishlistId}`,
    ADD_ITEM: '/wishlists/items',
    REMOVE_ITEM: (itemId) => `/wishlists/items/${itemId}`,
  },
  REVIEWS: {
    LIST: '/product-service/reviews/',
    GET_BY_ID: (reviewId) => `/product-service/reviews/${reviewId}`,
    CREATE: '/product-service/reviews/',
    UPDATE: (reviewId) => `/product-service/reviews/${reviewId}`,
    DELETE: (reviewId) => `/product-service/reviews/${reviewId}`,
  },
  FAQ: {
    CATEGORIES: {
      LIST: '/faq/categories/',
      GET_BY_ID: (categoryId) => `/faq/categories/${categoryId}`,
    },
    ENTRIES: {
      LIST: '/faq/entries/',
      GET_BY_ID: (faqId) => `/faq/entries/${faqId}`,
    },
  },
  STRIPE: {
    CONFIG: '/product-service/stripe/config',
    CREATE_PAYMENT_INTENT: '/product-service/stripe/payment-intents',
    GET_PAYMENT_INTENT: (paymentIntentId) => `/product-service/stripe/payment-intents/${paymentIntentId}`,
    CONFIRM_PAYMENT_INTENT: (paymentIntentId) => `/product-service/stripe/payment-intents/${paymentIntentId}/confirm`,
  },
  BANNERS: {
    LIST: '/banners/',
    GET_BY_ID: (bannerId) => `/banners/${bannerId}`,
  },
};

export default {
  API_CONFIG,
  STORAGE_KEYS,
  PAGINATION,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  DELIVERY_OPTIONS,
  USER_ROLES,
  THEMES,
  LANGUAGES,
  CURRENCY,
  DATE_FORMATS,
  FILE_UPLOAD,
  SEARCH_CONFIG,
  RATING,
  NOTIFICATION_TYPES,
  ANIMATION_DURATION,
  BREAKPOINTS,
  Z_INDEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  API_ENDPOINTS,
};
