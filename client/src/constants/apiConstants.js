/**
 * API-specific constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  VERSION: 'v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  MAX_CONCURRENT_REQUESTS: 5,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHANGE_PASSWORD: '/auth/change-password',
    DELETE_ACCOUNT: '/auth/account',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    ADDRESSES: '/users/addresses',
    PAYMENT_METHODS: '/users/payment-methods',
    NOTIFICATIONS: '/users/notifications',
    PREFERENCES: '/users/preferences',
    STATS: '/users/stats',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    FEATURED: '/products/featured',
    RECOMMENDED: '/products/recommended',
    RELATED: '/products/:id/related',
    REVIEWS: '/products/:id/reviews',
    ADD_REVIEW: '/products/:id/reviews',
    COMPARE: '/products/compare',
    BULK: '/products/bulk',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: '/categories/:id',
    PRODUCTS: '/categories/:id/products',
    SUBCATEGORIES: '/categories/:id/subcategories',
    POPULAR: '/categories/popular',
    SEARCH: '/categories/search',
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items/:id',
    REMOVE_ITEM: '/cart/items/:id',
    CLEAR: '/cart/clear',
    COUPON: '/cart/coupon',
    SUMMARY: '/cart/summary',
    VALIDATE: '/cart/validate',
    SAVE: '/cart/save',
    SAVED: '/cart/saved',
    LOAD_SAVED: '/cart/saved/:id/load',
    DELETE_SAVED: '/cart/saved/:id',
    SHIPPING_OPTIONS: '/cart/shipping-options',
    SHIPPING_METHOD: '/cart/shipping-method',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders/:id',
    CANCEL: '/orders/:id/cancel',
    TRACKING: '/orders/:id/tracking',
    ITEMS: '/orders/:id/items',
    RETURN: '/orders/:id/return',
    RETURNS: '/orders/:id/returns',
    REVIEW: '/orders/:id/review',
    INVOICE: '/orders/:id/invoice',
    DOWNLOAD_INVOICE: '/orders/:id/invoice/download',
    REORDER: '/orders/:id/reorder',
    STATS: '/orders/stats',
    HISTORY: '/orders/history',
  },

  // Favorites/Wishlist
  FAVORITES: {
    LIST: '/favorites',
    ADD: '/favorites/:id',
    REMOVE: '/favorites/:id',
    BULK_ADD: '/favorites/bulk',
    BULK_REMOVE: '/favorites/bulk',
  },

  // Search
  SEARCH: {
    PRODUCTS: '/search/products',
    CATEGORIES: '/search/categories',
    SUGGESTIONS: '/search/suggestions',
    HISTORY: '/search/history',
    CLEAR_HISTORY: '/search/history/clear',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
    DELETE_ALL: '/notifications/clear',
    SETTINGS: '/notifications/settings',
    PREFERENCES: '/notifications/preferences',
  },

  // Analytics
  ANALYTICS: {
    TRACK: '/analytics/track',
    PAGE_VIEW: '/analytics/page-view',
    EVENT: '/analytics/event',
    CONVERSION: '/analytics/conversion',
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    AVATAR: '/upload/avatar',
    DOCUMENT: '/upload/document',
    BULK: '/upload/bulk',
  },

  // System
  SYSTEM: {
    HEALTH: '/system/health',
    STATUS: '/system/status',
    VERSION: '/system/version',
    CONFIG: '/system/config',
    MAINTENANCE: '/system/maintenance',
  },
};

// Request Methods
export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  CSV: 'text/csv',
  PDF: 'application/pdf',
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  IMAGE_GIF: 'image/gif',
  IMAGE_WEBP: 'image/webp',
};

// API Headers
export const API_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  X_API_KEY: 'X-API-Key',
  X_REQUEST_ID: 'X-Request-ID',
  X_CORRELATION_ID: 'X-Correlation-ID',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_CLIENT_PLATFORM: 'X-Client-Platform',
  X_CLIENT_DEVICE: 'X-Client-Device',
  X_CLIENT_IP: 'X-Client-IP',
  X_CLIENT_USER_AGENT: 'X-Client-User-Agent',
  X_CLIENT_LANGUAGE: 'X-Client-Language',
  X_CLIENT_TIMEZONE: 'X-Client-Timezone',
  X_CLIENT_CURRENCY: 'X-Client-Currency',
  X_CLIENT_THEME: 'X-Client-Theme',
  X_CLIENT_FEATURES: 'X-Client-Features',
  X_CLIENT_DEBUG: 'X-Client-Debug',
  X_CLIENT_TEST: 'X-Client-Test',
  X_CLIENT_BETA: 'X-Client-Beta',
  X_CLIENT_EXPERIMENTAL: 'X-Client-Experimental',
};

// API Response Codes
export const API_RESPONSE_CODES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  MAINTENANCE_ERROR: 'MAINTENANCE_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// API Error Types
export const API_ERROR_TYPES = {
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT',
  MAINTENANCE: 'MAINTENANCE',
  PAYMENT: 'PAYMENT',
  UNKNOWN: 'UNKNOWN',
};

// API Cache Keys
export const API_CACHE_KEYS = {
  PRODUCTS: 'api_products',
  CATEGORIES: 'api_categories',
  USER_PROFILE: 'api_user_profile',
  CART: 'api_cart',
  ORDERS: 'api_orders',
  FAVORITES: 'api_favorites',
  SEARCH_RESULTS: 'api_search_results',
  NOTIFICATIONS: 'api_notifications',
  SYSTEM_STATUS: 'api_system_status',
};

// API Rate Limits
export const API_RATE_LIMITS = {
  GENERAL: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
    REQUESTS_PER_DAY: 10000,
  },
  AUTH: {
    LOGIN_ATTEMPTS_PER_MINUTE: 5,
    LOGIN_ATTEMPTS_PER_HOUR: 20,
    LOGIN_ATTEMPTS_PER_DAY: 50,
  },
  SEARCH: {
    REQUESTS_PER_MINUTE: 30,
    REQUESTS_PER_HOUR: 500,
  },
  UPLOAD: {
    REQUESTS_PER_MINUTE: 10,
    REQUESTS_PER_HOUR: 100,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
};

export default {
  API_CONFIG,
  HTTP_STATUS,
  API_ENDPOINTS,
  REQUEST_METHODS,
  CONTENT_TYPES,
  API_HEADERS,
  API_RESPONSE_CODES,
  API_ERROR_TYPES,
  API_CACHE_KEYS,
  API_RATE_LIMITS,
};
