import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Orders API service
 */
export class OrdersService {
  /**
   * Get user orders
   * 
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Order status filter
   * @returns {Promise} - Orders response
   */
  static async getOrders(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.ORDERS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   * 
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - Order data
   */
  static async getOrderById(orderId) {
    try {
      const endpoint = API_ENDPOINTS.ORDERS.DETAIL.replace(':id', orderId);
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Create new order
   * 
   * @param {object} orderData - Order data
   * @param {object} orderData.shippingAddress - Shipping address
   * @param {object} orderData.billingAddress - Billing address
   * @param {string} orderData.paymentMethod - Payment method
   * @param {string} orderData.shippingMethod - Shipping method
   * @param {string} orderData.notes - Order notes
   * @returns {Promise} - Created order
   */
  static async createOrder(orderData) {
    try {
      const response = await apiPost(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   * 
   * @param {string|number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} - Cancellation result
   */
  static async cancelOrder(orderId, reason = '') {
    try {
      const endpoint = API_ENDPOINTS.ORDERS.CANCEL.replace(':id', orderId);
      const response = await apiPost(endpoint, { reason });
      return response;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  /**
   * Get order tracking information
   * 
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - Tracking information
   */
  static async getOrderTracking(orderId) {
    try {
      const endpoint = `/orders/${orderId}/tracking`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      throw error;
    }
  }

  /**
   * Get order items
   * 
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - Order items
   */
  static async getOrderItems(orderId) {
    try {
      const endpoint = `/orders/${orderId}/items`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }

  /**
   * Request order return
   * 
   * @param {string|number} orderId - Order ID
   * @param {object} returnData - Return data
   * @param {Array} returnData.items - Items to return
   * @param {string} returnData.reason - Return reason
   * @returns {Promise} - Return request result
   */
  static async requestReturn(orderId, returnData) {
    try {
      const endpoint = `/orders/${orderId}/return`;
      const response = await apiPost(endpoint, returnData);
      return response;
    } catch (error) {
      console.error('Error requesting return:', error);
      throw error;
    }
  }

  /**
   * Get order returns
   * 
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - Order returns
   */
  static async getOrderReturns(orderId) {
    try {
      const endpoint = `/orders/${orderId}/returns`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching order returns:', error);
      throw error;
    }
  }

  /**
   * Add order review
   * 
   * @param {string|number} orderId - Order ID
   * @param {object} reviewData - Review data
   * @returns {Promise} - Review result
   */
  static async addOrderReview(orderId, reviewData) {
    try {
      const endpoint = `/orders/${orderId}/review`;
      const response = await apiPost(endpoint, reviewData);
      return response;
    } catch (error) {
      console.error('Error adding order review:', error);
      throw error;
    }
  }

  /**
   * Get order invoice
   * 
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - Invoice data
   */
  static async getOrderInvoice(orderId) {
    try {
      const endpoint = `/orders/${orderId}/invoice`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching order invoice:', error);
      throw error;
    }
  }

  /**
   * Download order invoice
   * 
   * @param {string|number} orderId - Order ID
   * @param {string} format - File format (pdf, html)
   * @returns {Promise} - Download result
   */
  static async downloadOrderInvoice(orderId, format = 'pdf') {
    try {
      const endpoint = `/orders/${orderId}/invoice/download`;
      const response = await apiGet(endpoint, { format });
      return response;
    } catch (error) {
      console.error('Error downloading order invoice:', error);
      throw error;
    }
  }

  /**
   * Reorder items
   * 
   * @param {string|number} orderId - Order ID
   * @param {Array} itemIds - Item IDs to reorder
   * @returns {Promise} - Reorder result
   */
  static async reorderItems(orderId, itemIds = []) {
    try {
      const endpoint = `/orders/${orderId}/reorder`;
      const response = await apiPost(endpoint, { itemIds });
      return response;
    } catch (error) {
      console.error('Error reordering items:', error);
      throw error;
    }
  }

  /**
   * Get order statistics
   * 
   * @returns {Promise} - Order statistics
   */
  static async getOrderStats() {
    try {
      const endpoint = '/orders/stats';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  /**
   * Get order history
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - Order history
   */
  static async getOrderHistory(params = {}) {
    try {
      const endpoint = '/orders/history';
      const response = await apiGet(endpoint, params);
      return response;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }
}

export default OrdersService;
