// Settings Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'
import settingsMockData from '../mock/settings.json'

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SettingsService {
  // Get all settings
  async getSettings() {
    try {
      // For development, return mock data
      return {
        success: true,
        data: settingsMockData.settings,
        message: 'Settings fetched successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.get(API_ENDPOINTS.SETTINGS.BASE)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'Settings fetched successfully'
      // }
    } catch (error) {
      console.error('Error fetching settings:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch settings'
      }
    }
  }

  // Update general settings
  async updateGeneralSettings(generalData) {
    try {
      // For development, simulate successful update
      const updatedSettings = {
        ...settingsMockData.settings,
        general: {
          ...settingsMockData.settings.general,
          ...generalData,
          updatedAt: new Date().toISOString()
        }
      }
      
      return {
        success: true,
        data: generalData,
        message: 'General settings updated successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.put(API_ENDPOINTS.SETTINGS.GENERAL, generalData)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'General settings updated successfully'
      // }
    } catch (error) {
      console.error('Error updating general settings:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update general settings'
      }
    }
  }

  // Update email settings
  async updateEmailSettings(emailData) {
    try {
      // For development, simulate successful update
      return {
        success: true,
        data: emailData,
        message: 'Email settings updated successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.put(API_ENDPOINTS.SETTINGS.EMAIL, emailData)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'Email settings updated successfully'
      // }
    } catch (error) {
      console.error('Error updating email settings:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update email settings'
      }
    }
  }

  // Update AWS S3 settings
  async updateAWSSettings(awsData) {
    try {
      // For development, simulate successful update
      return {
        success: true,
        data: awsData,
        message: 'AWS S3 settings updated successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.put(API_ENDPOINTS.SETTINGS.AWS, awsData)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'AWS S3 settings updated successfully'
      // }
    } catch (error) {
      console.error('Error updating AWS S3 settings:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update AWS S3 settings'
      }
    }
  }

  // Update all settings at once
  async updateAllSettings(allSettingsData) {
    try {
      // For development, simulate successful update
      return {
        success: true,
        data: allSettingsData,
        message: 'All settings updated successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.put(API_ENDPOINTS.SETTINGS.BASE, allSettingsData)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'All settings updated successfully'
      // }
    } catch (error) {
      console.error('Error updating all settings:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update settings'
      }
    }
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      // For development, simulate successful test
      return {
        success: true,
        data: { message: 'Email configuration test successful' },
        message: 'Email configuration test successful'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.post(API_ENDPOINTS.SETTINGS.TEST_EMAIL)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'Email configuration test successful'
      // }
    } catch (error) {
      console.error('Error testing email configuration:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to test email configuration'
      }
    }
  }

  // Test AWS S3 configuration
  async testAWSConfiguration() {
    try {
      // For development, simulate successful test
      return {
        success: true,
        data: { message: 'AWS S3 configuration test successful' },
        message: 'AWS S3 configuration test successful'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.post(API_ENDPOINTS.SETTINGS.TEST_AWS)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'AWS S3 configuration test successful'
      // }
    } catch (error) {
      console.error('Error testing AWS S3 configuration:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to test AWS S3 configuration'
      }
    }
  }

  // Validate settings data
  validateGeneralSettings(data) {
    const errors = {}

    if (!data.appName?.trim()) {
      errors.appName = 'App name is required'
    }
    if (!data.businessName?.trim()) {
      errors.businessName = 'Business name is required'
    }
    if (!data.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  validateEmailSettings(data) {
    const errors = {}

    if (!data.smtpHost?.trim()) {
      errors.smtpHost = 'SMTP Host is required'
    }
    if (!data.smtpPort?.trim()) {
      errors.smtpPort = 'SMTP Port is required'
    } else if (!/^\d+$/.test(data.smtpPort)) {
      errors.smtpPort = 'Port must be a number'
    }
    if (!data.smtpUsername?.trim()) {
      errors.smtpUsername = 'SMTP Username is required'
    }
    if (!data.fromEmail?.trim()) {
      errors.fromEmail = 'From Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.fromEmail)) {
      errors.fromEmail = 'Please enter a valid email address'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  validateAWSSettings(data) {
    const errors = {}

    if (!data.accessKeyId?.trim()) {
      errors.accessKeyId = 'Access Key ID is required'
    }
    if (!data.secretAccessKey?.trim()) {
      errors.secretAccessKey = 'Secret Access Key is required'
    }
    if (!data.bucketName?.trim()) {
      errors.bucketName = 'Bucket Name is required'
    }
    if (!data.region?.trim()) {
      errors.region = 'Region is required'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

// Create and export service instance
export const settingsService = new SettingsService()

// Export class for testing
export { SettingsService }

export default settingsService
