import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Stripe Payment API service
 * Handles Stripe payment intent creation and management
 */
export class StripeService {
  /**
   * Get Stripe configuration
   * 
   * @returns {Promise} - Stripe configuration response
   */
  static async getStripeConfig() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STRIPE.CONFIG)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Create payment intent
   * 
   * @param {object} paymentData - Payment intent data
   * @param {number} paymentData.order_id - Order ID (required)
   * @param {string} paymentData.currency - Currency code (default: 'usd', optional)
   * @returns {Promise} - Payment intent response with client_secret
   */
  static async createPaymentIntent(paymentData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.STRIPE.CREATE_PAYMENT_INTENT, {
        order_id: paymentData.order_id,
        currency: paymentData.currency || 'usd'
      })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get payment intent by ID
   * 
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise} - Payment intent details
   */
  static async getPaymentIntent(paymentIntentId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STRIPE.GET_PAYMENT_INTENT(paymentIntentId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Confirm payment intent
   * 
   * @param {string} paymentIntentId - Payment intent ID
   * @param {object} confirmData - Confirmation data (optional)
   * @param {string} confirmData.payment_method_id - Payment method ID (optional)
   * @param {string} confirmData.return_url - Return URL (optional)
   * @returns {Promise} - Confirmed payment intent
   */
  static async confirmPaymentIntent(paymentIntentId, confirmData = {}) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STRIPE.CONFIRM_PAYMENT_INTENT(paymentIntentId),
        confirmData
      )
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default StripeService

