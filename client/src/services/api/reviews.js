import apiClient from '../../config/apiClient';
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Reviews Service
 * Handles all product review related API calls
 */
class ReviewsService {
  /**
   * List product reviews with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.product_id - Filter by product ID
   * @param {number} params.product_variant_id - Filter by product variant ID
   * @param {number} params.user_id - Filter by user ID
   * @param {boolean} params.is_approved - Filter by approval status
   * @param {string} params.sort_by - Sort order: "Newest", "Oldest", "Highest rating", "Lowest rating"
   * @returns {Promise<Object>} Response object with success status and data
   */
  static async getReviews(params = {}) {
    try {
      const endpoint = API_ENDPOINTS.REVIEWS.LIST;
      const response = await apiClient.get(endpoint, { params });
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get a single review by ID
   * @param {number} reviewId - Review ID
   * @returns {Promise<Object>} Response object with success status and data
   */
  static async getReviewById(reviewId) {
    try {
      const endpoint = API_ENDPOINTS.REVIEWS.GET_BY_ID(reviewId);
      const response = await apiClient.get(endpoint);
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create a new product review
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.product_id - Product ID (required)
   * @param {number} reviewData.product_variant_id - Product variant ID (optional)
   * @param {number} reviewData.user_id - User ID (required)
   * @param {number} reviewData.order_id - Order ID (optional)
   * @param {number} reviewData.rating - Rating from 1 to 5 (required)
   * @param {string} reviewData.review_title - Review title (optional, max 255 chars)
   * @param {string} reviewData.review_text - Review text (optional)
   * @param {boolean} reviewData.is_verified_purchase - Whether verified purchase (default: false)
   * @returns {Promise<Object>} Response object with success status and data
   */
  static async createReview(reviewData) {
    try {
      const endpoint = API_ENDPOINTS.REVIEWS.CREATE;
      const response = await apiClient.post(endpoint, reviewData);
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update an existing review
   * @param {number} reviewId - Review ID
   * @param {Object} reviewData - Updated review data (all fields optional)
   * @returns {Promise<Object>} Response object with success status and data
   */
  static async updateReview(reviewId, reviewData) {
    try {
      const endpoint = API_ENDPOINTS.REVIEWS.UPDATE(reviewId);
      const response = await apiClient.put(endpoint, reviewData);
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Delete a review
   * @param {number} reviewId - Review ID
   * @returns {Promise<Object>} Response object with success status
   */
  static async deleteReview(reviewId) {
    try {
      const endpoint = API_ENDPOINTS.REVIEWS.DELETE(reviewId);
      await apiClient.delete(endpoint);
      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default ReviewsService;

