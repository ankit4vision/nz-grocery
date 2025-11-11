/**
 * Handles successful API response
 * @param {Object} response - The axios response object
 * @returns {Object} - Standardized response
 */
export const handleApiResponse = (response) => {
  return {
    success: true,
    data: response.data,
    message: response.data.message || 'Operation successful',
    status: response.status,
  }
}

/**
 * Formats error response
 * @param {Object} error - The error object
 * @returns {Object} - Standardized error response
 */
export const formatErrorResponse = (error) => {
  return {
    success: false,
    data: null,
    message: error.message || 'An error occurred',
    errors: error.errors || [],
    status: error.status || 500,
  }
}

/**
 * Creates a delay for simulating API calls (useful for testing)
 * @param {Number} ms - Milliseconds to delay
 * @returns {Promise}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Parses API response data
 * @param {Object} response - The response object
 * @returns {Object} - Parsed data
 */
export const parseResponse = (response) => {
  if (!response || !response.data) {
    return null
  }

  // If data is an array, return it
  if (Array.isArray(response.data)) {
    return response.data
  }

  // If data has a nested data property, return it
  if (response.data.data) {
    return response.data.data
  }

  // Otherwise return the whole data object
  return response.data
}

/**
 * Extracts pagination info from response
 * @param {Object} response - The response object
 * @returns {Object} - Pagination info
 */
export const extractPagination = (response) => {
  if (!response || !response.data) {
    return null
  }

  return {
    page: response.data.page || 1,
    pageSize: response.data.page_size || response.data.pageSize || 20,
    total: response.data.total || 0,
    totalPages: response.data.total_pages || response.data.totalPages || 0,
    hasNext: response.data.has_next || response.data.hasNext || false,
    hasPrev: response.data.has_prev || response.data.hasPrev || false,
  }
}

export default {
  handleApiResponse,
  formatErrorResponse,
  delay,
  parseResponse,
  extractPagination,
}

