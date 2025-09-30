/**
 * Data formatting utility functions
 */

/**
 * Format currency
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'NZD')
 * @param {string} locale - Locale (default: 'en-NZ')
 * @returns {string} - Formatted currency string
 * 
 * @example
 * formatCurrency(29.99) // "$29.99"
 * formatCurrency(29.99, 'USD', 'en-US') // "$29.99"
 */
export const formatCurrency = (amount, currency = 'NZD', locale = 'en-NZ') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format number with commas
 * 
 * @param {number} number - Number to format
 * @param {string} locale - Locale (default: 'en-NZ')
 * @returns {string} - Formatted number string
 * 
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (number, locale = 'en-NZ') => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format date
 * 
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'en-NZ')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "30/09/2025"
 * formatDate(new Date(), 'en-US', { dateStyle: 'full' }) // "Monday, September 30, 2025"
 */
export const formatDate = (date, locale = 'en-NZ', options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format file size
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size string
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || bytes < 0) {
    return '0 B';
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

/**
 * Format phone number
 * 
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 * 
 * @example
 * formatPhoneNumber("0212345678") // "021 234 5678"
 */
export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format New Zealand mobile numbers
  if (digits.length === 10 && digits.startsWith('02')) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  
  // Format New Zealand landline numbers
  if (digits.length === 9 && digits.startsWith('0')) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  
  // Return original if doesn't match expected format
  return phone;
};

/**
 * Format percentage
 * 
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted percentage string
 * 
 * @example
 * formatPercentage(0.15) // "15%"
 * formatPercentage(0.1523, 2) // "15.23%"
 */
export const formatPercentage = (value, decimals = 0) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Truncate text
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated text
 * 
 * @example
 * truncateText("This is a long text", 10) // "This is a ..."
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter
 * 
 * @param {string} text - Text to capitalize
 * @returns {string} - Capitalized text
 * 
 * @example
 * capitalizeFirst("hello world") // "Hello world"
 */
export const capitalizeFirst = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format product name for display
 * 
 * @param {string} name - Product name
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} - Formatted product name
 */
export const formatProductName = (name, maxLength = 50) => {
  if (!name || typeof name !== 'string') {
    return 'Unknown Product';
  }
  
  const formatted = capitalizeFirst(name.trim());
  return truncateText(formatted, maxLength);
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatFileSize,
  formatPhoneNumber,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  formatProductName,
};
