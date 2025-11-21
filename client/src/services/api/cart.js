import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Shopping Cart API service
 * Handles all cart operations including creating cart, adding items, updating quantities, etc.
 */
export class CartService {
  /**
   * Get active cart for a user
   * 
   * @param {number} userId - User ID
   * @returns {Promise} - Active cart response
   */
  static async getActiveCart(userId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.GET_ACTIVE(userId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Create a new shopping cart
   * 
   * @param {object} cartData - Cart creation data
   * @param {number} cartData.user_id - User ID (required)
   * @param {number} cartData.vendor_id - Vendor ID (optional)
   * @returns {Promise} - Created cart response
   */
  static async createCart(cartData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CART.CREATE, cartData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get cart by ID
   * 
   * @param {number} cartId - Cart ID
   * @returns {Promise} - Cart response
   */
  static async getCart(cartId) {
    try {
      const response = await apiClient.get(`/shopping-cart/${cartId}`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get or create active cart for user
   * This is a convenience method that gets active cart or creates one if it doesn't exist
   * 
   * @param {number} userId - User ID
   * @returns {Promise} - Active cart response
   */
  static async getOrCreateActiveCart(userId) {
    try {
      // Try to get active cart first
      const getResponse = await this.getActiveCart(userId)
      
      // If cart exists, return it
      if (getResponse.success && getResponse.data) {
        return getResponse
      }
      
      // If no active cart exists (404 or error), create a new one
      if (getResponse.status === 404 || !getResponse.success) {
        const createResponse = await this.createCart({ user_id: userId })
        return createResponse
      }
      
      return getResponse
    } catch (error) {
      // If getActiveCart fails with 404, create new cart
      if (error.response?.status === 404) {
        return await this.createCart({ user_id: userId })
      }
      return handleApiError(error)
    }
  }

  /**
   * Add item to cart
   * 
   * @param {object} itemData - Item data
   * @param {number} itemData.cart_id - Cart ID (required)
   * @param {number} itemData.product_id - Product ID (required)
   * @param {number} itemData.variant_id - Variant ID (optional)
   * @param {number} itemData.quantity - Quantity (default: 1)
   * @returns {Promise} - Added item response
   */
  static async addItem(itemData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CART.ADD_ITEM, itemData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get cart items with pricing
   * Returns detailed cart items with pricing information
   * 
   * @param {number} cartId - Cart ID
   * @returns {Promise} - Cart items with pricing response
   */
  static async getCartItemsWithPricing(cartId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.GET_ITEMS_WITH_PRICING(cartId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Update cart item quantity
   * 
   * @param {number} cartItemId - Cart item ID
   * @param {number} quantity - New quantity (must be at least 1)
   * @returns {Promise} - Updated item response
   */
  static async updateItemQuantity(cartItemId, quantity) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CART.UPDATE_ITEM(cartItemId), { quantity })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Remove item from cart
   * 
   * @param {number} cartItemId - Cart item ID
   * @returns {Promise} - Removal response
   */
  static async removeItem(cartItemId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get cart summary
   * 
   * @param {number} cartId - Cart ID
   * @returns {Promise} - Cart summary response
   */
  static async getCartSummary(cartId) {
    try {
      const response = await apiClient.get(`/shopping-cart/${cartId}/summary`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Clear cart (delete all items)
   * This is done by deleting each item individually
   * 
   * @param {number} cartId - Cart ID
   * @returns {Promise} - Clear response
   */
  static async clearCart(cartId) {
    try {
      // Get all items first
      const itemsResponse = await this.getCartItemsWithPricing(cartId)
      
      if (!itemsResponse.success || !itemsResponse.data?.items || itemsResponse.data.items.length === 0) {
        return { success: true, message: 'Cart is already empty' }
      }

      // Delete all items
      const deletePromises = itemsResponse.data.items.map(item => 
        this.removeItem(item.cart_item_id)
      )
      
      await Promise.all(deletePromises)
      
      return { success: true, message: 'Cart cleared successfully' }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default CartService
