import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Banners API service
 */
export class BannersService {
  /**
   * List banners with optional filters
   *
   * @param {object} params - Query params (is_active, position, banner_type, limit, offset)
   * @returns {Promise<object>} - Standardized response
   */
  static async getBanners(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BANNERS.LIST, { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get banner details by ID
   *
   * @param {number|string} bannerId
   * @returns {Promise<object>}
   */
  static async getBannerById(bannerId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BANNERS.GET_BY_ID(bannerId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default BannersService

