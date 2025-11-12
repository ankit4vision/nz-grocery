// Profile Management Service
import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

class ProfileService {
  /**
   * Transform API response (snake_case) to frontend format (camelCase)
   */
  transformApiToFrontend(apiData) {
    if (!apiData) return null
    
    return {
      userId: apiData.user_id,
      email: apiData.email,
      phone: apiData.phone || '',
      firstName: apiData.first_name || '',
      lastName: apiData.last_name || '',
      userType: apiData.user_type,
      isActive: apiData.is_active,
      isVerified: apiData.is_verified,
      emailVerified: apiData.email_verified,
      phoneVerified: apiData.phone_verified,
      avatar: apiData.profile_image_url || '',
      dateOfBirth: apiData.date_of_birth || '',
      gender: apiData.gender || '',
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
      lastLogin: apiData.last_login,
      // Address fields (if available in API response)
      address: apiData.address || '',
      city: apiData.city || '',
      state: apiData.state || '',
      zipCode: apiData.zip_code || apiData.postal_code || '',
      country: apiData.country || '',
      bio: apiData.bio || ''
    }
  }

  /**
   * Transform frontend format (camelCase) to API request format (snake_case)
   */
  transformFrontendToApi(frontendData) {
    const apiData = {}
    
    // Only include fields that are provided (API accepts optional fields)
    if (frontendData.firstName !== undefined) {
      apiData.first_name = frontendData.firstName
    }
    if (frontendData.lastName !== undefined) {
      apiData.last_name = frontendData.lastName
    }
    if (frontendData.phone !== undefined) {
      apiData.phone = frontendData.phone || null
    }
    if (frontendData.dateOfBirth !== undefined) {
      apiData.date_of_birth = frontendData.dateOfBirth || null
    }
    if (frontendData.gender !== undefined) {
      apiData.gender = frontendData.gender || null
    }
    
    return apiData
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiClient.get('/users/profile')
      const transformedData = this.transformApiToFrontend(response.data)
      
      return {
        success: true,
        data: transformedData,
        message: 'Profile fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Update current user profile
  async updateProfile(profileData) {
    try {
      // Transform frontend data to API format
      const apiData = this.transformFrontendToApi(profileData)
      
      const response = await apiClient.put('/users/profile', apiData)
      const transformedData = this.transformApiToFrontend(response.data)
      
      return {
        success: true,
        data: transformedData,
        message: 'Profile updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Change user password
  async changePassword(passwordData) {
    try {
      // API expects: { current_password, new_password }
      const apiData = {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      }
      
      await apiClient.put('/users/change-password', apiData)
      
      return {
        success: true,
        data: { message: 'Password changed successfully' },
        message: 'Password changed successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Upload profile avatar
  async uploadAvatar(file) {
    try {
      // Handle base64 string or File object
      let fileToUpload = file
      
      // If it's a base64 string, convert to File
      if (typeof file === 'string' && file.startsWith('data:image/')) {
        const base64Data = file.split(',')[1]
        const mimeType = file.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mimeType })
        fileToUpload = new File([blob], 'profile-image', { type: mimeType })
      }
      
      const formData = new FormData()
      formData.append('image_file', fileToUpload)

      const response = await apiClient.put('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const transformedData = this.transformApiToFrontend(response.data)
      
      return {
        success: true,
        data: transformedData,
        message: 'Avatar uploaded successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Delete profile avatar (by uploading empty/null)
  async deleteAvatar() {
    try {
      // API doesn't have a delete endpoint, so we can update profile with null image
      // Or we can use the profile-image endpoint with empty file
      // For now, we'll update profile to remove image_url
      const response = await apiClient.put('/users/profile', {
        profile_image_url: null
      })
      
      const transformedData = this.transformApiToFrontend(response.data)
      
      return {
        success: true,
        data: transformedData,
        message: 'Avatar deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get user activity logs
  async getActivityLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.activity) queryParams.append('activity', params.activity)

      const endpoint = `${API_ENDPOINTS.USERS.GET_PROFILE}/activity?${queryParams.toString()}`
      const response = await apiService.get(endpoint)
      
      return {
        success: true,
        data: response.data,
        message: 'Activity logs fetched successfully'
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch activity logs'
      }
    }
  }

  // Export profile data
  async exportProfileData(format = 'json') {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.USERS.GET_PROFILE}/export?format=${format}`, {
        responseType: 'blob'
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Profile data exported successfully'
      }
    } catch (error) {
      console.error('Error exporting profile data:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to export profile data'
      }
    }
  }

  // Update profile preferences
  async updatePreferences(preferences) {
    try {
      const response = await apiService.put(`${API_ENDPOINTS.USERS.GET_PROFILE}/preferences`, preferences)
      return {
        success: true,
        data: response.data,
        message: 'Preferences updated successfully'
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update preferences'
      }
    }
  }

  // Get profile statistics
  async getProfileStats() {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.USERS.GET_PROFILE}/stats`)
      return {
        success: true,
        data: response.data,
        message: 'Profile statistics fetched successfully'
      }
    } catch (error) {
      console.error('Error fetching profile statistics:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch profile statistics'
      }
    }
  }

  // Validate profile data
  validateProfileData(data) {
    const errors = {}

    // Required fields
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!data.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Optional field validations
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 13) {
        errors.dateOfBirth = 'You must be at least 13 years old'
      } else if (age > 120) {
        errors.dateOfBirth = 'Please enter a valid birth date'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Format profile data for API
  formatProfileData(data) {
    return {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
      city: data.city?.trim(),
      state: data.state?.trim(),
      zipCode: data.zipCode?.trim(),
      country: data.country?.trim(),
      bio: data.bio?.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      avatar: data.avatar
    }
  }
}

// Create and export service instance
export const profileService = new ProfileService()

// Export class for testing
export { ProfileService }

export default profileService
