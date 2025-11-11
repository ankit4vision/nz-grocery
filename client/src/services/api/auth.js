import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

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
   * @returns {Promise} - Login response with token and user
   */
  static async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      
      // Extract token and user from response
      const { access_token, user } = response.data
      
      // Store token and user in localStorage
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * User registration
   * 
   * @param {object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.first_name - User first name
   * @param {string} userData.last_name - User last name
   * @param {string} userData.phone - User phone number (optional)
   * @returns {Promise} - Registration response with token and user
   */
  static async register(userData) {
    try {
      // Transform frontend format to API format
      const apiData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName || userData.first_name,
        last_name: userData.lastName || userData.last_name,
        phone: userData.phone || userData.mobile || null,
      }
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, apiData)
      
      // Extract token and user from response
      const { access_token, user } = response.data
      
      // Store token and user in localStorage
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get current authenticated user
   * 
   * @returns {Promise} - Current user profile
   */
  static async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_CURRENT_USER)
      
      // Update user in localStorage
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Change password
   * 
   * @param {object} passwordData - Password data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   * @returns {Promise} - Password change response
   */
  static async changePassword(passwordData) {
    try {
      // Transform frontend format to API format
      const apiData = {
        current_password: passwordData.currentPassword || passwordData.current_password,
        new_password: passwordData.newPassword || passwordData.new_password,
      }
      
      const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * User logout
   * 
   * @returns {void}
   */
  static logout() {
    // Remove token and user from localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} - Authentication status
   */
  static isAuthenticated() {
    const token = localStorage.getItem('access_token')
    return !!token
  }

  /**
   * Get current user token
   * 
   * @returns {string|null} - Current token or null
   */
  static getToken() {
    return localStorage.getItem('access_token')
  }

  /**
   * Set authentication token
   * 
   * @param {string} token - Authentication token
   */
  static setToken(token) {
    localStorage.setItem('access_token', token)
  }

  /**
   * Remove authentication token
   */
  static removeToken() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  /**
   * Get stored user data
   * 
   * @returns {object|null} - User data or null
   */
  static getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default AuthService
