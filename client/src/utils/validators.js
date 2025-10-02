/**
 * Form validation utility functions
 */

/**
 * Validate email address
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 * 
 * @example
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number (New Zealand format)
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 * 
 * @example
 * isValidPhone("0212345678") // true
 * isValidPhone("+64212345678") // true
 * isValidPhone("123") // false
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // New Zealand mobile numbers (02x xxx xxxx)
  if (digits.length === 10 && digits.startsWith('02')) {
    return true;
  }
  
  // New Zealand landline numbers (0x xxx xxxx)
  if (digits.length === 9 && digits.startsWith('0')) {
    return true;
  }
  
  // International format (+64)
  if (digits.length === 11 && digits.startsWith('64')) {
    return true;
  }
  
  return false;
};

/**
 * Validate password strength
 * 
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with score and message
 * 
 * @example
 * validatePassword("password123") // { isValid: true, score: 2, message: "Good" }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      message: 'Password is required'
    };
  }
  
  let score = 0;
  const messages = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    messages.push('At least 8 characters');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    messages.push('At least one lowercase letter');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    messages.push('At least one uppercase letter');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    messages.push('At least one number');
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    messages.push('At least one special character');
  }
  
  const isValid = score >= 3;
  let message = '';
  
  if (isValid) {
    if (score >= 4) {
      message = 'Strong';
    } else {
      message = 'Good';
    }
  } else {
    message = messages.join(', ');
  }
  
  return {
    isValid,
    score,
    message
  };
};

/**
 * Validate required field
 * 
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {string|null} - Error message or null if valid
 * 
 * @example
 * validateRequired("", "Name") // "Name is required"
 * validateRequired("John", "Name") // null
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }
  
  return null;
};

/**
 * Validate minimum length
 * 
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Name of the field
 * @returns {string|null} - Error message or null if valid
 * 
 * @example
 * validateMinLength("hi", 3, "Name") // "Name must be at least 3 characters"
 * validateMinLength("hello", 3, "Name") // null
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value || typeof value !== 'string') {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  return null;
};

/**
 * Validate maximum length
 * 
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field
 * @returns {string|null} - Error message or null if valid
 * 
 * @example
 * validateMaxLength("very long text", 10, "Description") // "Description must be no more than 10 characters"
 * validateMaxLength("short", 10, "Description") // null
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (!value || typeof value !== 'string') {
    return null;
  }
  
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  
  return null;
};

/**
 * Validate number range
 * 
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field
 * @returns {string|null} - Error message or null if valid
 * 
 * @example
 * validateNumberRange(5, 1, 10, "Quantity") // null
 * validateNumberRange(15, 1, 10, "Quantity") // "Quantity must be between 1 and 10"
 */
export const validateNumberRange = (value, min, max, fieldName = 'Field') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  
  return null;
};

/**
 * Validate URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 * 
 * @example
 * isValidUrl("https://example.com") // true
 * isValidUrl("not-a-url") // false
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate credit card number (basic Luhn algorithm)
 * 
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} - True if valid card number
 * 
 * @example
 * isValidCreditCard("4111111111111111") // true
 * isValidCreditCard("1234567890123456") // false
 */
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return false;
  }
  
  // Remove spaces and non-digits
  const digits = cardNumber.replace(/\D/g, '');
  
  // Check if it's a reasonable length
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate form data
 * 
 * @param {object} formData - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} - Validation result with errors
 * 
 * @example
 * validateForm({ email: "test@example.com", password: "password123" }, {
 *   email: { required: true, email: true },
 *   password: { required: true, minLength: 8 }
 * })
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const value = formData[field];
    const fieldRules = rules[field];
    
    // Required validation
    if (fieldRules.required) {
      const requiredError = validateRequired(value, fieldRules.fieldName || field);
      if (requiredError) {
        errors[field] = requiredError;
        continue; // Skip other validations if required fails
      }
    }
    
    // Email validation
    if (fieldRules.email && value) {
      if (!isValidEmail(value)) {
        errors[field] = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (fieldRules.phone && value) {
      if (!isValidPhone(value)) {
        errors[field] = 'Please enter a valid phone number';
      }
    }
    
    // Min length validation
    if (fieldRules.minLength && value) {
      const minLengthError = validateMinLength(value, fieldRules.minLength, fieldRules.fieldName || field);
      if (minLengthError) {
        errors[field] = minLengthError;
      }
    }
    
    // Max length validation
    if (fieldRules.maxLength && value) {
      const maxLengthError = validateMaxLength(value, fieldRules.maxLength, fieldRules.fieldName || field);
      if (maxLengthError) {
        errors[field] = maxLengthError;
      }
    }
    
    // Number range validation
    if (fieldRules.numberRange && value !== undefined) {
      const { min, max } = fieldRules.numberRange;
      const numberRangeError = validateNumberRange(value, min, max, fieldRules.fieldName || field);
      if (numberRangeError) {
        errors[field] = numberRangeError;
      }
    }
    
    // Custom validation
    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumberRange,
  isValidUrl,
  isValidCreditCard,
  validateForm,
};
