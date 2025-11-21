import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

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
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Update user profile
   * 
   * @param {object} profileData - Profile data
   * @param {string} profileData.first_name - First name (optional)
   * @param {string} profileData.last_name - Last name (optional)
   * @param {string} profileData.phone - Phone number (optional)
   * @param {string} profileData.date_of_birth - Date of birth in YYYY-MM-DD format (optional)
   * @param {string} profileData.gender - Gender: male, female, other (optional)
   * @returns {Promise} - Updated profile
   */
  static async updateProfile(profileData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Upload profile image
   * 
   * @param {FormData} formData - FormData with image file (key: image_file)
   * @returns {Promise} - Updated profile with image URL
   */
  static async uploadProfileImage(formData) {
    try {
      const response = await apiClient.put('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
   * @returns {Promise} - Password change result
   */
  static async changePassword(passwordData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        current_password: passwordData.current_password || passwordData.currentPassword,
        new_password: passwordData.new_password || passwordData.newPassword,
      })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }


  /**
   * Get user addresses
   * 
   * @param {object} params - Query parameters
   * @param {boolean} params.only_active - Filter to show only active addresses (default: true)
   * @returns {Promise} - User addresses array
   */
  static async getUserAddresses(params = { only_active: true }) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.ADDRESSES.LIST, { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get address by ID
   * 
   * @param {string|number} addressId - Address ID
   * @returns {Promise} - Address details
   */
  static async getAddressById(addressId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.ADDRESSES.GET_BY_ID(addressId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Add user address
   * 
   * @param {object} addressData - Address data
   * @param {string} addressData.address_type - Address type: home, work, other (default: home)
   * @param {string} addressData.address_line1 - Primary address line (required)
   * @param {string} addressData.address_line2 - Secondary address line (optional)
   * @param {string} addressData.city - City name (required)
   * @param {string} addressData.state - State/Province name (required)
   * @param {string} addressData.postal_code - Postal/ZIP code (required)
   * @param {string} addressData.country - Country name (default: New Zealand)
   * @param {number} addressData.latitude - GPS latitude (optional)
   * @param {number} addressData.longitude - GPS longitude (optional)
   * @param {boolean} addressData.is_default - Set as default address (default: false)
   * @returns {Promise} - Created address
   */
  static async addAddress(addressData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.ADDRESSES.CREATE, addressData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Update user address
   * 
   * @param {string|number} addressId - Address ID
   * @param {object} addressData - Address data (all fields optional)
   * @returns {Promise} - Updated address
   */
  static async updateAddress(addressId, addressData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.ADDRESSES.UPDATE(addressId), addressData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
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
      const response = await apiClient.delete(API_ENDPOINTS.USERS.ADDRESSES.DELETE(addressId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Set default address
   * 
   * @param {string|number} addressId - Address ID
   * @returns {Promise} - Updated address with is_default=true
   */
  static async setDefaultAddress(addressId) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.ADDRESSES.SET_DEFAULT(addressId))
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

}

export default UsersService;

