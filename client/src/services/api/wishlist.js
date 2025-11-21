import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Wishlist API service
 */
export class WishlistService {
  /**
   * Get all wishlists for the authenticated user
   * 
   * @returns {Promise} - Array of wishlists
   */
  static async getWishlists() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.LIST)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get or create default wishlist
   * 
   * @returns {Promise} - Default wishlist
   */
  static async getDefaultWishlist() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.GET_DEFAULT)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get wishlist by ID
   * 
   * @param {string|number} wishlistId - Wishlist ID
   * @returns {Promise} - Wishlist data
   */
  static async getWishlist(wishlistId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.GET_BY_ID(wishlistId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get wishlist details with items
   * 
   * @param {string|number} wishlistId - Wishlist ID
   * @returns {Promise} - Wishlist with items and product details
   */
  static async getWishlistDetails(wishlistId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.GET_DETAILS(wishlistId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get wishlist items
   * 
   * @param {string|number} wishlistId - Wishlist ID
   * @returns {Promise} - Array of wishlist items
   */
  static async getWishlistItems(wishlistId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WISHLIST.GET_ITEMS(wishlistId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Create new wishlist
   * 
   * @param {object} wishlistData - Wishlist data
   * @param {string} wishlistData.wishlist_name - Wishlist name (default: 'My Wishlist')
   * @param {boolean} wishlistData.is_public - Whether wishlist is public (default: false)
   * @returns {Promise} - Created wishlist
   */
  static async createWishlist(wishlistData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WISHLIST.CREATE, wishlistData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Update wishlist
   * 
   * @param {string|number} wishlistId - Wishlist ID
   * @param {object} wishlistData - Wishlist data (all fields optional)
   * @param {string} wishlistData.wishlist_name - Wishlist name
   * @param {boolean} wishlistData.is_public - Whether wishlist is public
   * @returns {Promise} - Updated wishlist
   */
  static async updateWishlist(wishlistId, wishlistData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WISHLIST.UPDATE(wishlistId), wishlistData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Delete wishlist
   * 
   * @param {string|number} wishlistId - Wishlist ID
   * @returns {Promise} - Deletion result
   */
  static async deleteWishlist(wishlistId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WISHLIST.DELETE(wishlistId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Add item to wishlist
   * 
   * @param {object} itemData - Item data
   * @param {number} itemData.product_id - Product ID (required)
   * @param {number} itemData.variant_id - Product variant ID (optional)
   * @param {number} itemData.wishlist_id - Wishlist ID (optional, uses default if not provided)
   * @returns {Promise} - Added wishlist item
   */
  static async addItem(itemData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WISHLIST.ADD_ITEM, itemData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Remove item from wishlist
   * 
   * @param {string|number} itemId - Wishlist item ID
   * @returns {Promise} - Removal result
   */
  static async removeItem(itemId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WISHLIST.REMOVE_ITEM(itemId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default WishlistService

