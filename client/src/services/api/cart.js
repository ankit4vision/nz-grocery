import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Cart API service
 */
export class CartService {
  /**
   * Get cart items
   * 
   * @returns {Promise} - Cart data
   */
  static async getCart() {
    try {
      const response = await apiGet(API_ENDPOINTS.CART.GET);
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  /**
   * Add item to cart
   * 
   * @param {object} itemData - Item data
   * @param {string|number} itemData.productId - Product ID
   * @param {number} itemData.quantity - Quantity
   * @param {object} itemData.options - Product options (size, color, etc.)
   * @returns {Promise} - Added item
   */
  static async addItem(itemData) {
    try {
      const response = await apiPost(API_ENDPOINTS.CART.ADD_ITEM, itemData);
      return response;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   * 
   * @param {string|number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} - Updated item
   */
  static async updateItemQuantity(itemId, quantity) {
    try {
      const endpoint = API_ENDPOINTS.CART.UPDATE_ITEM.replace(':id', itemId);
      const response = await apiPut(endpoint, { quantity });
      return response;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  /**
   * Update cart item options
   * 
   * @param {string|number} itemId - Cart item ID
   * @param {object} options - New options
   * @returns {Promise} - Updated item
   */
  static async updateItemOptions(itemId, options) {
    try {
      const endpoint = API_ENDPOINTS.CART.UPDATE_ITEM.replace(':id', itemId);
      const response = await apiPut(endpoint, { options });
      return response;
    } catch (error) {
      console.error('Error updating cart item options:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   * 
   * @param {string|number} itemId - Cart item ID
   * @returns {Promise} - Removal result
   */
  static async removeItem(itemId) {
    try {
      const endpoint = API_ENDPOINTS.CART.REMOVE_ITEM.replace(':id', itemId);
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   * 
   * @returns {Promise} - Clear result
   */
  static async clearCart() {
    try {
      const response = await apiDelete(API_ENDPOINTS.CART.CLEAR);
      return response;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Apply coupon to cart
   * 
   * @param {string} couponCode - Coupon code
   * @returns {Promise} - Coupon application result
   */
  static async applyCoupon(couponCode) {
    try {
      const endpoint = '/cart/coupon';
      const response = await apiPost(endpoint, { code: couponCode });
      return response;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  /**
   * Remove coupon from cart
   * 
   * @returns {Promise} - Coupon removal result
   */
  static async removeCoupon() {
    try {
      const endpoint = '/cart/coupon';
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }

  /**
   * Get cart summary
   * 
   * @returns {Promise} - Cart summary
   */
  static async getCartSummary() {
    try {
      const endpoint = '/cart/summary';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      throw error;
    }
  }

  /**
   * Validate cart items
   * 
   * @returns {Promise} - Validation result
   */
  static async validateCart() {
    try {
      const endpoint = '/cart/validate';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error validating cart:', error);
      throw error;
    }
  }

  /**
   * Save cart for later
   * 
   * @param {string} name - Saved cart name
   * @returns {Promise} - Save result
   */
  static async saveCart(name) {
    try {
      const endpoint = '/cart/save';
      const response = await apiPost(endpoint, { name });
      return response;
    } catch (error) {
      console.error('Error saving cart:', error);
      throw error;
    }
  }

  /**
   * Get saved carts
   * 
   * @returns {Promise} - Saved carts
   */
  static async getSavedCarts() {
    try {
      const endpoint = '/cart/saved';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching saved carts:', error);
      throw error;
    }
  }

  /**
   * Load saved cart
   * 
   * @param {string|number} savedCartId - Saved cart ID
   * @returns {Promise} - Load result
   */
  static async loadSavedCart(savedCartId) {
    try {
      const endpoint = `/cart/saved/${savedCartId}/load`;
      const response = await apiPost(endpoint);
      return response;
    } catch (error) {
      console.error('Error loading saved cart:', error);
      throw error;
    }
  }

  /**
   * Delete saved cart
   * 
   * @param {string|number} savedCartId - Saved cart ID
   * @returns {Promise} - Deletion result
   */
  static async deleteSavedCart(savedCartId) {
    try {
      const endpoint = `/cart/saved/${savedCartId}`;
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error deleting saved cart:', error);
      throw error;
    }
  }

  /**
   * Get cart shipping options
   * 
   * @param {object} address - Delivery address
   * @returns {Promise} - Shipping options
   */
  static async getShippingOptions(address) {
    try {
      const endpoint = '/cart/shipping-options';
      const response = await apiPost(endpoint, { address });
      return response;
    } catch (error) {
      console.error('Error fetching shipping options:', error);
      throw error;
    }
  }

  /**
   * Set shipping method
   * 
   * @param {string} shippingMethodId - Shipping method ID
   * @returns {Promise} - Set result
   */
  static async setShippingMethod(shippingMethodId) {
    try {
      const endpoint = '/cart/shipping-method';
      const response = await apiPost(endpoint, { methodId: shippingMethodId });
      return response;
    } catch (error) {
      console.error('Error setting shipping method:', error);
      throw error;
    }
  }
}

export default CartService;
