import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Users API service
 */
export class UsersService {
  /**
   * Get user profile
   * 
   * @returns {Promise} - User profile data
   */
  static async getProfile() {
    try {
      const response = await apiGet(API_ENDPOINTS.USERS.PROFILE);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * 
   * @param {object} profileData - Profile data
   * @returns {Promise} - Updated profile
   */
  static async updateProfile(profileData) {
    try {
      const response = await apiPut(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Change password
   * 
   * @param {object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} - Password change result
   */
  static async changePassword(passwordData) {
    try {
      const response = await apiPost(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Get user orders
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - User orders
   */
  static async getUserOrders(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.ORDERS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  /**
   * Get user favorites
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - User favorites
   */
  static async getUserFavorites(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.FAVORITES.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  }

  /**
   * Add product to favorites
   * 
   * @param {string|number} productId - Product ID
   * @returns {Promise} - Favorite result
   */
  static async addToFavorites(productId) {
    try {
      const endpoint = API_ENDPOINTS.FAVORITES.ADD.replace(':id', productId);
      const response = await apiPost(endpoint);
      return response;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  /**
   * Remove product from favorites
   * 
   * @param {string|number} productId - Product ID
   * @returns {Promise} - Removal result
   */
  static async removeFromFavorites(productId) {
    try {
      const endpoint = API_ENDPOINTS.FAVORITES.REMOVE.replace(':id', productId);
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Get user addresses
   * 
   * @returns {Promise} - User addresses
   */
  static async getUserAddresses() {
    try {
      const endpoint = '/users/addresses';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  }

  /**
   * Add user address
   * 
   * @param {object} addressData - Address data
   * @returns {Promise} - Created address
   */
  static async addAddress(addressData) {
    try {
      const endpoint = '/users/addresses';
      const response = await apiPost(endpoint, addressData);
      return response;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  /**
   * Update user address
   * 
   * @param {string|number} addressId - Address ID
   * @param {object} addressData - Address data
   * @returns {Promise} - Updated address
   */
  static async updateAddress(addressId, addressData) {
    try {
      const endpoint = `/users/addresses/${addressId}`;
      const response = await apiPut(endpoint, addressData);
      return response;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  /**
   * Delete user address
   * 
   * @param {string|number} addressId - Address ID
   * @returns {Promise} - Deletion result
   */
  static async deleteAddress(addressId) {
    try {
      const endpoint = `/users/addresses/${addressId}`;
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - User notifications
   */
  static async getUserNotifications(params = {}) {
    try {
      const endpoint = '/users/notifications';
      const response = await apiGet(endpoint, params);
      return response;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * 
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise} - Update result
   */
  static async markNotificationAsRead(notificationId) {
    try {
      const endpoint = `/users/notifications/${notificationId}/read`;
      const response = await apiPut(endpoint);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   * 
   * @returns {Promise} - User statistics
   */
  static async getUserStats() {
    try {
      const endpoint = '/users/stats';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  /**
   * Upload user avatar
   * 
   * @param {FormData} formData - Form data with avatar file
   * @returns {Promise} - Upload result
   */
  static async uploadAvatar(formData) {
    try {
      const endpoint = '/users/avatar';
      const response = await apiPost(endpoint, formData);
      return response;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Delete user account
   * 
   * @param {object} confirmationData - Confirmation data
   * @returns {Promise} - Deletion result
   */
  static async deleteAccount(confirmationData) {
    try {
      const endpoint = '/users/account';
      const response = await apiDelete(endpoint, confirmationData);
      return response;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export default UsersService;
