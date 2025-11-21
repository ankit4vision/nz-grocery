import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * FAQ API service
 */
export class FAQService {
  /**
   * Get FAQ entries
   * 
   * @param {object} params - Query parameters
   * @param {boolean} params.is_active - Filter by active status (default: true)
   * @param {number} params.category_id - Filter by category ID (optional)
   * @param {number} params.limit - Maximum number of entries to return (1-100, default: 50)
   * @param {number} params.offset - Number of entries to skip for pagination (default: 0)
   * @returns {Promise} - FAQ entries array
   */
  static async getFAQEntries(params = { is_active: true }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FAQ.ENTRIES.LIST, { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get FAQ entry by ID
   * 
   * @param {string|number} faqId - FAQ entry ID
   * @returns {Promise} - FAQ entry data
   */
  static async getFAQEntryById(faqId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FAQ.ENTRIES.GET_BY_ID(faqId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get FAQ categories
   * 
   * @param {object} params - Query parameters
   * @param {boolean} params.is_active - Filter by active status (default: true)
   * @param {number} params.limit - Maximum number of categories to return (1-100, default: 50)
   * @param {number} params.offset - Number of categories to skip for pagination (default: 0)
   * @returns {Promise} - FAQ categories array
   */
  static async getFAQCategories(params = { is_active: true }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FAQ.CATEGORIES.LIST, { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default FAQService;

