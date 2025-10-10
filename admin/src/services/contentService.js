import api from '../api'

// Banner Management
export const bannerService = {
  // Get all banners
  getBanners: async (params = {}) => {
    try {
      const response = await api.get('/content/banners', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching banners:', error)
      throw error
    }
  },

  // Get banner by ID
  getBannerById: async (id) => {
    try {
      const response = await api.get(`/content/banners/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching banner:', error)
      throw error
    }
  },

  // Create new banner
  createBanner: async (bannerData) => {
    try {
      const formData = new FormData()
      
      // Append all banner data to FormData
      Object.keys(bannerData).forEach(key => {
        if (key === 'image' && bannerData[key]) {
          formData.append('image', bannerData[key])
        } else if (bannerData[key] !== null && bannerData[key] !== undefined) {
          formData.append(key, bannerData[key])
        }
      })

      const response = await api.post('/content/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating banner:', error)
      throw error
    }
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    try {
      const formData = new FormData()
      
      // Append all banner data to FormData
      Object.keys(bannerData).forEach(key => {
        if (key === 'image' && bannerData[key]) {
          formData.append('image', bannerData[key])
        } else if (bannerData[key] !== null && bannerData[key] !== undefined) {
          formData.append(key, bannerData[key])
        }
      })

      const response = await api.put(`/content/banners/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating banner:', error)
      throw error
    }
  },

  // Delete banner
  deleteBanner: async (id) => {
    try {
      const response = await api.delete(`/content/banners/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting banner:', error)
      throw error
    }
  },

  // Update banner status
  updateBannerStatus: async (id, status) => {
    try {
      const response = await api.patch(`/content/banners/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating banner status:', error)
      throw error
    }
  }
}

// FAQ Management
export const faqService = {
  // Get all FAQs
  getFAQs: async (params = {}) => {
    try {
      const response = await api.get('/content/faqs', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      throw error
    }
  },

  // Get FAQ by ID
  getFAQById: async (id) => {
    try {
      const response = await api.get(`/content/faqs/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching FAQ:', error)
      throw error
    }
  },

  // Create new FAQ
  createFAQ: async (faqData) => {
    try {
      const response = await api.post('/content/faqs', faqData)
      return response.data
    } catch (error) {
      console.error('Error creating FAQ:', error)
      throw error
    }
  },

  // Update FAQ
  updateFAQ: async (id, faqData) => {
    try {
      const response = await api.put(`/content/faqs/${id}`, faqData)
      return response.data
    } catch (error) {
      console.error('Error updating FAQ:', error)
      throw error
    }
  },

  // Delete FAQ
  deleteFAQ: async (id) => {
    try {
      const response = await api.delete(`/content/faqs/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      throw error
    }
  },

  // Reorder FAQs
  reorderFAQs: async (faqIds) => {
    try {
      const response = await api.post('/content/faqs/reorder', { faqIds })
      return response.data
    } catch (error) {
      console.error('Error reordering FAQs:', error)
      throw error
    }
  }
}

// Notification Management
export const notificationService = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/content/notifications', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  // Get notification by ID
  getNotificationById: async (id) => {
    try {
      const response = await api.get(`/content/notifications/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching notification:', error)
      throw error
    }
  },

  // Send new notification
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/content/notifications', notificationData)
      return response.data
    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  },

  // Update notification
  updateNotification: async (id, notificationData) => {
    try {
      const response = await api.put(`/content/notifications/${id}`, notificationData)
      return response.data
    } catch (error) {
      console.error('Error updating notification:', error)
      throw error
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/content/notifications/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },

  // Get notification statistics
  getNotificationStats: async () => {
    try {
      const response = await api.get('/content/notifications/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching notification stats:', error)
      throw error
    }
  },

  // Test notification
  testNotification: async (notificationData) => {
    try {
      const response = await api.post('/content/notifications/test', notificationData)
      return response.data
    } catch (error) {
      console.error('Error testing notification:', error)
      throw error
    }
  }
}

// Content Analytics
export const contentAnalyticsService = {
  // Get banner performance
  getBannerPerformance: async (bannerId, dateRange) => {
    try {
      const response = await api.get(`/content/analytics/banners/${bannerId}`, {
        params: { dateRange }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching banner performance:', error)
      throw error
    }
  },

  // Get FAQ analytics
  getFAQAnalytics: async (dateRange) => {
    try {
      const response = await api.get('/content/analytics/faqs', {
        params: { dateRange }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching FAQ analytics:', error)
      throw error
    }
  },

  // Get notification analytics
  getNotificationAnalytics: async (dateRange) => {
    try {
      const response = await api.get('/content/analytics/notifications', {
        params: { dateRange }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching notification analytics:', error)
      throw error
    }
  }
}

// Content Settings
export const contentSettingsService = {
  // Get content settings
  getContentSettings: async () => {
    try {
      const response = await api.get('/content/settings')
      return response.data
    } catch (error) {
      console.error('Error fetching content settings:', error)
      throw error
    }
  },

  // Update content settings
  updateContentSettings: async (settings) => {
    try {
      const response = await api.put('/content/settings', settings)
      return response.data
    } catch (error) {
      console.error('Error updating content settings:', error)
      throw error
    }
  }
}

export default {
  bannerService,
  faqService,
  notificationService,
  contentAnalyticsService,
  contentSettingsService
}
