import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

// Banner Management
export const bannerService = {
  // Get all banners
  async getBanners(params = {}) {
    try {
      const response = await apiClient.get('/banners/', { params })
      return {
        success: true,
        data: response.data,
        message: 'Banners fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get banner by ID
  async getBannerById(id) {
    try {
      const response = await apiClient.get(`/banners/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Banner fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create new banner (multipart/form-data)
  async createBanner(bannerData) {
    try {
      const formData = new FormData()
      
      // Required fields
      formData.append('banner_title', bannerData.banner_title)
      formData.append('banner_type', bannerData.banner_type)
      
      // Handle image file (could be File object or base64 string)
      if (bannerData.image_file) {
        // If it's a File object, use it directly
        formData.append('image_file', bannerData.image_file)
      } else if (bannerData.image && bannerData.image.startsWith('data:image/')) {
        // If it's a base64 data URL, convert it to a File
        const base64Data = bannerData.image
        const [metadata, base64String] = base64Data.split(',')
        const mimeMatch = metadata.match(/:(.*?);/)
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
        
        // Convert base64 to blob
        const byteCharacters = atob(base64String)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mimeType })
        
        // Create File from blob
        const file = new File([blob], 'banner-image', { type: mimeType })
        formData.append('image_file', file)
      }
      
      // Optional fields
      if (bannerData.banner_description !== undefined && bannerData.banner_description !== null) {
        formData.append('banner_description', bannerData.banner_description)
      }
      if (bannerData.link_url !== undefined && bannerData.link_url !== null) {
        formData.append('link_url', bannerData.link_url)
      }
      if (bannerData.position !== undefined && bannerData.position !== null) {
        formData.append('position', bannerData.position)
      }
      if (bannerData.target_category_id !== undefined && bannerData.target_category_id !== null) {
        formData.append('target_category_id', String(bannerData.target_category_id))
      }
      if (bannerData.target_product_id !== undefined && bannerData.target_product_id !== null) {
        formData.append('target_product_id', String(bannerData.target_product_id))
      }
      if (bannerData.start_date !== undefined && bannerData.start_date !== null) {
        formData.append('start_date', bannerData.start_date)
      }
      if (bannerData.end_date !== undefined && bannerData.end_date !== null) {
        formData.append('end_date', bannerData.end_date)
      }
      if (bannerData.is_active !== undefined && bannerData.is_active !== null) {
        formData.append('is_active', String(bannerData.is_active))
      }
      if (bannerData.sort_order !== undefined && bannerData.sort_order !== null) {
        formData.append('sort_order', String(bannerData.sort_order))
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const response = await apiClient.post('/banners/', formData, config)
      return {
        success: true,
        data: response.data,
        message: 'Banner created successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update banner (JSON - according to OpenAPI spec)
  async updateBanner(id, bannerData) {
    try {
      const response = await apiClient.put(`/banners/${id}`, bannerData)
      return {
        success: true,
        data: response.data,
        message: 'Banner updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Delete banner
  async deleteBanner(id) {
    try {
      await apiClient.delete(`/banners/${id}`)
      return {
        success: true,
        data: null,
        message: 'Banner deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// FAQ Category Management
export const faqCategoryService = {
  // Get all FAQ categories
  async getCategories(params = {}) {
    try {
      const response = await apiClient.get('/faq/categories/', { params })
      return {
        success: true,
        data: response.data,
        message: 'FAQ categories fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get FAQ category by ID
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(`/faq/categories/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'FAQ category fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create new FAQ category
  async createCategory(categoryData) {
    try {
      const response = await apiClient.post('/faq/categories/', categoryData)
      return {
        success: true,
        data: response.data,
        message: 'FAQ category created successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update FAQ category
  async updateCategory(id, categoryData) {
    try {
      const response = await apiClient.put(`/faq/categories/${id}`, categoryData)
      return {
        success: true,
        data: response.data,
        message: 'FAQ category updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Delete FAQ category
  async deleteCategory(id) {
    try {
      await apiClient.delete(`/faq/categories/${id}`)
      return {
        success: true,
        data: null,
        message: 'FAQ category deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// FAQ Entry Management
export const faqService = {
  // Get all FAQ entries
  async getFAQs(params = {}) {
    try {
      const response = await apiClient.get('/faq/entries/', { params })
      return {
        success: true,
        data: response.data,
        message: 'FAQs fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get FAQ entry by ID
  async getFAQById(id) {
    try {
      const response = await apiClient.get(`/faq/entries/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'FAQ fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create new FAQ entry
  async createFAQ(faqData) {
    try {
      const response = await apiClient.post('/faq/entries/', faqData)
      return {
        success: true,
        data: response.data,
        message: 'FAQ created successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update FAQ entry
  async updateFAQ(id, faqData) {
    try {
      const response = await apiClient.put(`/faq/entries/${id}`, faqData)
      return {
        success: true,
        data: response.data,
        message: 'FAQ updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Delete FAQ entry
  async deleteFAQ(id) {
    try {
      await apiClient.delete(`/faq/entries/${id}`)
      return {
        success: true,
        data: null,
        message: 'FAQ deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default {
  bannerService,
  faqCategoryService,
  faqService
}
