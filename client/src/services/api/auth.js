import { apiPost, apiGet, apiPut, apiDelete } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Authentication API service
 */
export class AuthService {
  /**
   * User login
   * 
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember me option
   * @returns {Promise} - Login response with token
   */
  static async login(credentials) {
    try {
      const response = await apiPost(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Store token in localStorage if login successful
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * User registration
   * 
   * @param {object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @param {string} userData.phone - User phone number
   * @returns {Promise} - Registration response
   */
  static async register(userData) {
    try {
      const response = await apiPost(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * User logout
   * 
   * @returns {Promise} - Logout response
   */
  static async logout() {
    try {
      const response = await apiPost(API_ENDPOINTS.AUTH.LOGOUT);
      
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      
      return response;
    } catch (error) {
      console.error('Error logging out:', error);
      // Still remove token even if API call fails
      localStorage.removeItem('authToken');
      throw error;
    }
  }

  /**
   * Refresh authentication token
   * 
   * @returns {Promise} - New token response
   */
  static async refreshToken() {
    try {
      const response = await apiPost(API_ENDPOINTS.AUTH.REFRESH);
      
      // Update token in localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Remove invalid token
      localStorage.removeItem('authToken');
      throw error;
    }
  }

  /**
   * Forgot password
   * 
   * @param {string} email - User email
   * @returns {Promise} - Forgot password response
   */
  static async forgotPassword(email) {
    try {
      const response = await apiPost(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw error;
    }
  }

  /**
   * Reset password
   * 
   * @param {object} resetData - Reset password data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @param {string} resetData.confirmPassword - Confirm new password
   * @returns {Promise} - Reset password response
   */
  static async resetPassword(resetData) {
    try {
      const response = await apiPost(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
      return response;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Verify email
   * 
   * @param {string} token - Verification token
   * @returns {Promise} - Verification response
   */
  static async verifyEmail(token) {
    try {
      const endpoint = '/auth/verify-email';
      const response = await apiPost(endpoint, { token });
      return response;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  /**
   * Resend verification email
   * 
   * @param {string} email - User email
   * @returns {Promise} - Resend response
   */
  static async resendVerificationEmail(email) {
    try {
      const endpoint = '/auth/resend-verification';
      const response = await apiPost(endpoint, { email });
      return response;
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} - Authentication status
   */
  static isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current user token
   * 
   * @returns {string|null} - Current token or null
   */
  static getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   * 
   * @param {string} token - Authentication token
   */
  static setToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Remove authentication token
   */
  static removeToken() {
    localStorage.removeItem('authToken');
  }

  /**
   * Get current user profile
   * 
   * @returns {Promise} - Current user profile
   */
  static async getCurrentUser() {
    try {
      const endpoint = '/auth/me';
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
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
      const endpoint = '/auth/profile';
      const response = await apiPut(endpoint, profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Change password
   * 
   * @param {object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} - Password change response
   */
  static async changePassword(passwordData) {
    try {
      const endpoint = '/auth/change-password';
      const response = await apiPost(endpoint, passwordData);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Delete user account
   * 
   * @param {object} confirmationData - Confirmation data
   * @returns {Promise} - Account deletion response
   */
  static async deleteAccount(confirmationData) {
    try {
      const endpoint = '/auth/account';
      const response = await apiDelete(endpoint, confirmationData);
      
      // Remove token after account deletion
      localStorage.removeItem('authToken');
      
      return response;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export default AuthService;
