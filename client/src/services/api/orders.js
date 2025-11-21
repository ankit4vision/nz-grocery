import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Orders API service
 */
export class OrdersService {
  /**
   * Get user orders list
   * 
   * @param {object} params - Query parameters
   * @param {string} params.order_status - Filter by order status (pending, confirmed, processing, ready_for_pickup, out_for_delivery, delivered, cancelled, refunded)
   * @param {number} params.limit - Maximum number of orders to return (1-100, default: 50)
   * @param {number} params.offset - Number of orders to skip for pagination (default: 0)
   * @returns {Promise} - Orders array
   */
  static async getOrders(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
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
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get order details with items
   * 
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - Order details with items
   */
  static async getOrderDetails(orderId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_DETAILS(orderId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Create new order
   * 
   * @param {object} orderData - Order data
   * @returns {Promise} - Created order
   */
  static async createOrder(orderData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Cancel order
   * 
   * @param {string|number} orderId - Order ID
   * @param {string} cancellation_reason - Cancellation reason (required)
   * @returns {Promise} - Cancellation result
   */
  static async cancelOrder(orderId, cancellation_reason) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORDERS.CANCEL(orderId), null, {
        params: { cancellation_reason }
      })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

}

export default OrdersService;



