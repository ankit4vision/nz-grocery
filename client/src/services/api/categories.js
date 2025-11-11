import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Categories API service
 */
export class CategoriesService {
  /**
   * Get all categories
   * 
   * @param {object} params - Query parameters
   * @param {boolean} params.only_active - Filter only active categories (default: true)
   * @returns {Promise} - Categories response
   */
  static async getCategories(params = {}) {
    try {
      // Default to only_active=true for customer portal
      const queryParams = { only_active: true, ...params }
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.CATEGORIES, { params: queryParams })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get category by ID
   * Note: This endpoint may not be available in customer portal API
   * 
   * @param {string|number} categoryId - Category ID
   * @returns {Promise} - Category data
   */
  static async getCategoryById(categoryId) {
    try {
      const endpoint = `/product-service/categories/${categoryId}`
      const response = await apiClient.get(endpoint)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default CategoriesService;
