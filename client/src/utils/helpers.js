/**
 * General helper utility functions
 */

/**
 * Generate unique ID
 * 
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Unique ID
 * 
 * @example
 * generateId() // "id_1234567890"
 * generateId("user") // "user_1234567890"
 */
export const generateId = (prefix = 'id') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Deep clone an object
 * 
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 * 
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
};

/**
 * Check if object is empty
 * 
 * @param {any} obj - Object to check
 * @returns {boolean} - True if object is empty
 * 
 * @example
 * isEmpty({}) // true
 * isEmpty({ a: 1 }) // false
 * isEmpty([]) // true
 * isEmpty([1, 2]) // false
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) {
    return true;
  }
  
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  
  return false;
};

/**
 * Get nested object property safely
 * 
 * @param {object} obj - Object to get property from
 * @param {string} path - Dot notation path
 * @param {any} defaultValue - Default value if property doesn't exist
 * @returns {any} - Property value or default
 * 
 * @example
 * const obj = { user: { profile: { name: 'John' } } };
 * get(obj, 'user.profile.name') // 'John'
 * get(obj, 'user.profile.age', 0) // 0
 */
export const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Set nested object property safely
 * 
 * @param {object} obj - Object to set property on
 * @param {string} path - Dot notation path
 * @param {any} value - Value to set
 * @returns {object} - Modified object
 * 
 * @example
 * const obj = {};
 * set(obj, 'user.profile.name', 'John');
 * // obj = { user: { profile: { name: 'John' } } }
 */
export const set = (obj, path, value) => {
  const keys = path.split('.');
  const result = deepClone(obj);
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Remove duplicates from array
 * 
 * @param {Array} array - Array to remove duplicates from
 * @param {string} key - Key to check for duplicates (optional)
 * @returns {Array} - Array without duplicates
 * 
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * unique([{id: 1}, {id: 2}, {id: 1}], 'id') // [{id: 1}, {id: 2}]
 */
export const unique = (array, key = null) => {
  if (!Array.isArray(array)) {
    return [];
  }
  
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = get(item, key);
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Group array by key
 * 
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} - Grouped object
 * 
 * @example
 * const users = [{name: 'John', age: 25}, {name: 'Jane', age: 25}];
 * groupBy(users, 'age') // {25: [{name: 'John', age: 25}, {name: 'Jane', age: 25}]}
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) {
    return {};
  }
  
  return array.reduce((groups, item) => {
    const groupKey = get(item, key);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Sort array by key
 * 
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array
 * 
 * @example
 * const users = [{name: 'John', age: 25}, {name: 'Jane', age: 30}];
 * sortBy(users, 'age', 'desc') // [{name: 'Jane', age: 30}, {name: 'John', age: 25}]
 */
export const sortBy = (array, key, direction = 'asc') => {
  if (!Array.isArray(array)) {
    return [];
  }
  
  return [...array].sort((a, b) => {
    const aValue = get(a, key);
    const bValue = get(b, key);
    
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Debounce function
 * 
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {function} - Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

/**
 * Throttle function
 * 
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} - Throttled function
 * 
 * @example
 * const throttledScroll = throttle(scrollFunction, 100);
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Sleep function
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after sleep
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * 
 * @param {function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} - Promise that resolves with function result
 * 
 * @example
 * const result = await retryWithBackoff(apiCall, 3, 1000);
 */
export const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Check if value is truthy
 * 
 * @param {any} value - Value to check
 * @returns {boolean} - True if value is truthy
 * 
 * @example
 * isTruthy(1) // true
 * isTruthy(0) // false
 * isTruthy('') // false
 * isTruthy('hello') // true
 */
export const isTruthy = (value) => {
  return Boolean(value);
};

/**
 * Check if value is falsy
 * 
 * @param {any} value - Value to check
 * @returns {boolean} - True if value is falsy
 * 
 * @example
 * isFalsy(0) // true
 * isFalsy('') // true
 * isFalsy(null) // true
 * isFalsy(1) // false
 */
export const isFalsy = (value) => {
  return !Boolean(value);
};

/**
 * Capitalize first letter of each word
 * 
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 * 
 * @example
 * capitalizeWords('hello world') // 'Hello World'
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Convert string to slug
 * 
 * @param {string} str - String to convert
 * @returns {string} - Slug string
 * 
 * @example
 * slugify('Hello World!') // 'hello-world'
 */
export const slugify = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate random string
 * 
 * @param {number} length - Length of string
 * @param {string} chars - Character set to use
 * @returns {string} - Random string
 * 
 * @example
 * randomString(8) // 'aB3dE7fG'
 * randomString(6, '0123456789') // '123456'
 */
export const randomString = (length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if device is mobile
 * 
 * @returns {boolean} - True if device is mobile
 * 
 * @example
 * isMobile() // true/false
 */
export const isMobile = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is tablet
 * 
 * @returns {boolean} - True if device is tablet
 * 
 * @example
 * isTablet() // true/false
 */
export const isTablet = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent);
};

/**
 * Check if device is desktop
 * 
 * @returns {boolean} - True if device is desktop
 * 
 * @example
 * isDesktop() // true/false
 */
export const isDesktop = () => {
  return !isMobile() && !isTablet();
};

export default {
  generateId,
  deepClone,
  isEmpty,
  get,
  set,
  unique,
  groupBy,
  sortBy,
  debounce,
  throttle,
  sleep,
  retryWithBackoff,
  isTruthy,
  isFalsy,
  capitalizeWords,
  slugify,
  randomString,
  isMobile,
  isTablet,
  isDesktop,
};
