/**
 * Application-specific constants
 */

// Application Information
export const APP_INFO = {
  NAME: 'NZ Grocery',
  VERSION: '1.0.0',
  DESCRIPTION: 'New Zealand\'s premier online grocery store',
  AUTHOR: 'NZ Grocery Team',
  WEBSITE: 'https://nzgrocery.com',
  SUPPORT_EMAIL: 'support@nzgrocery.com',
  PHONE: '+64 9 123 4567',
};

// Business Information
export const BUSINESS_INFO = {
  COMPANY_NAME: 'NZ Grocery Ltd',
  REGISTRATION_NUMBER: 'NZ123456789',
  GST_NUMBER: '12-345-678',
  ADDRESS: {
    STREET: '123 Queen Street',
    CITY: 'Auckland',
    POSTAL_CODE: '1010',
    COUNTRY: 'New Zealand',
  },
  BUSINESS_HOURS: {
    MONDAY_TO_FRIDAY: '8:00 AM - 8:00 PM',
    SATURDAY: '9:00 AM - 6:00 PM',
    SUNDAY: '10:00 AM - 5:00 PM',
  },
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_WISHLIST: true,
  ENABLE_COMPARE: true,
  ENABLE_REVIEWS: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_GUEST_CHECKOUT: true,
  ENABLE_SUBSCRIPTION: false,
  ENABLE_MULTI_VENDOR: false,
  ENABLE_LIVE_CHAT: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
};

// Application Limits
export const LIMITS = {
  MAX_CART_ITEMS: 50,
  MAX_WISHLIST_ITEMS: 100,
  MAX_SEARCH_HISTORY: 20,
  MAX_RECENT_PRODUCTS: 10,
  MAX_ADDRESSES: 5,
  MAX_PAYMENT_METHODS: 3,
  MAX_ORDER_HISTORY: 100,
  MAX_REVIEWS_PER_PRODUCT: 1000,
  MAX_REVIEW_LENGTH: 500,
  MAX_COMMENT_LENGTH: 200,
};

// Time Constants
export const TIME_CONSTANTS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  CART_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300, // 300ms
  ANIMATION_DURATION: 250, // 250ms
  NOTIFICATION_DURATION: 5000, // 5 seconds
  AUTO_SAVE_DELAY: 2000, // 2 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRY_ATTEMPTS: 3,
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^(\+64|0)[2-9]\d{7,9}$/,
    MIN_LENGTH: 9,
    MAX_LENGTH: 12,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s'-]+$/,
  },
  ADDRESS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
  },
  POSTAL_CODE: {
    PATTERN: /^\d{4}$/,
  },
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/nzgrocery',
  TWITTER: 'https://twitter.com/nzgrocery',
  INSTAGRAM: 'https://instagram.com/nzgrocery',
  LINKEDIN: 'https://linkedin.com/company/nzgrocery',
  YOUTUBE: 'https://youtube.com/nzgrocery',
  TIKTOK: 'https://tiktok.com/@nzgrocery',
};

// Legal Pages
export const LEGAL_PAGES = {
  TERMS_OF_SERVICE: '/terms',
  PRIVACY_POLICY: '/privacy',
  COOKIE_POLICY: '/cookies',
  REFUND_POLICY: '/refunds',
  SHIPPING_POLICY: '/shipping',
  RETURN_POLICY: '/returns',
  ACCESSIBILITY: '/accessibility',
  SITEMAP: '/sitemap',
};

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  MAINTENANCE_ERROR: 'MAINTENANCE_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  EMAIL_VERIFIED: 'Email verified successfully!',
  ITEM_ADDED_TO_CART: 'Item added to cart!',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart.',
  CART_CLEARED: 'Cart cleared successfully.',
  ORDER_PLACED: 'Order placed successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
  WISHLIST_UPDATED: 'Wishlist updated!',
  ADDRESS_ADDED: 'Address added successfully!',
  ADDRESS_UPDATED: 'Address updated successfully!',
  ADDRESS_DELETED: 'Address deleted successfully!',
  PAYMENT_METHOD_ADDED: 'Payment method added!',
  PAYMENT_METHOD_UPDATED: 'Payment method updated!',
  PAYMENT_METHOD_DELETED: 'Payment method deleted!',
  SUBSCRIPTION_CREATED: 'Subscription created!',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled.',
  NOTIFICATION_SETTINGS_UPDATED: 'Notification settings updated!',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'Please log in to continue.',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND_ERROR: 'The requested resource was not found.',
  CONFLICT_ERROR: 'This action conflicts with existing data.',
  RATE_LIMIT_ERROR: 'Too many requests. Please try again later.',
  MAINTENANCE_ERROR: 'The system is under maintenance. Please try again later.',
  PAYMENT_ERROR: 'Payment failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  PHONE_ALREADY_EXISTS: 'An account with this phone number already exists.',
  WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  REQUIRED_FIELD: 'This field is required.',
  MIN_LENGTH_ERROR: 'This field is too short.',
  MAX_LENGTH_ERROR: 'This field is too long.',
  INVALID_FORMAT: 'Invalid format.',
  CART_EMPTY: 'Your cart is empty.',
  PRODUCT_OUT_OF_STOCK: 'This product is out of stock.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  ORDER_NOT_FOUND: 'Order not found.',
  REVIEW_ALREADY_EXISTS: 'You have already reviewed this product.',
  INVALID_COUPON: 'Invalid coupon code.',
  EXPIRED_COUPON: 'This coupon has expired.',
  COUPON_ALREADY_USED: 'This coupon has already been used.',
};

// Default Values
export const DEFAULT_VALUES = {
  PAGE_SIZE: 20,
  SORT_BY: 'name',
  SORT_ORDER: 'asc',
  CURRENCY: 'NZD',
  LANGUAGE: 'en',
  THEME: 'light',
  TIMEZONE: 'Pacific/Auckland',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: '24h',
  NUMBER_FORMAT: 'en-NZ',
};

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  CART_ITEMS: 'cart_items',
  WISHLIST: 'wishlist',
  RECENT_SEARCHES: 'recent_searches',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
  PAYMENT_METHODS: 'payment_methods',
  NOTIFICATION_SETTINGS: 'notification_settings',
  THEME_SETTINGS: 'theme_settings',
  LANGUAGE_SETTINGS: 'language_settings',
};

export default {
  APP_INFO,
  BUSINESS_INFO,
  FEATURE_FLAGS,
  LIMITS,
  TIME_CONSTANTS,
  VALIDATION_RULES,
  SOCIAL_LINKS,
  LEGAL_PAGES,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  DEFAULT_VALUES,
  CACHE_KEYS,
};
