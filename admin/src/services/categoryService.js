import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

export const categoryService = {
  // Get all categories (using with_counts endpoint)
  async getCategories() {
    try {
      const response = await apiClient.get('/product-service/categories/with_counts')
      return {
        success: true,
        data: response.data,
        message: 'Categories fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get categories with pagination (if needed later)
  async getCategoriesPaginated(params = {}) {
    try {
      const response = await apiClient.get('/product-service/categories/paginated', { params })
      return {
        success: true,
        data: response.data,
        message: 'Categories fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get category options for dropdowns
  async getCategoryOptions(onlyActive = true) {
    try {
      const response = await apiClient.get('/product-service/categories/options', {
        params: { only_active: onlyActive }
      })
      return {
        success: true,
        data: response.data,
        message: 'Category options fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get all categories (simple list)
  async getAllCategories(onlyActive = true) {
    try {
      const response = await apiClient.get('/product-service/categories/', {
        params: { only_active: onlyActive }
      })
      return {
        success: true,
        data: response.data,
        message: 'Categories fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(`/product-service/categories/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Category fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create new category
  async createCategory(categoryData) {
    try {
      console.log('Creating category with data:', categoryData)
      
      // API always expects multipart/form-data format, even without a file
      const formData = new FormData()
      
      // Handle image/file if present (could be File object or base64 string)
      if (categoryData.file) {
        // If it's a File object
        formData.append('file', categoryData.file)
      } else if (categoryData.image && categoryData.image.startsWith('data:image/')) {
        // If it's a base64 data URL, we need to convert it to a File
        const base64Data = categoryData.image
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
        const file = new File([blob], 'category-image', { type: mimeType })
        formData.append('file', file)
      }
      
      // Append all form fields (API expects multipart/form-data even without file)
      // category_name is required
      formData.append('category_name', categoryData.category_name)
      formData.append('category_description', categoryData.category_description || '')
      formData.append('is_active', String(categoryData.is_active !== undefined ? categoryData.is_active : true))
      formData.append('sort_order', String(categoryData.sort_order || 0))

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      console.log('Sending create request with multipart/form-data')
      const response = await apiClient.post('/product-service/categories/', formData, config)
      
      return {
        success: true,
        data: response.data,
        message: 'Category created successfully'
      }
    } catch (error) {
      console.error('Category creation error:', error)
      return handleApiError(error)
    }
  },

  // Update category
  async updateCategory(id, categoryData) {
    try {
      console.log('Updating category with data:', categoryData)
      
      // API always expects multipart/form-data format, even without a file
      const formData = new FormData()
      
      // Handle image/file if present (could be File object or base64 string)
      if (categoryData.file) {
        // If it's a File object
        formData.append('file', categoryData.file)
      } else if (categoryData.image && categoryData.image.startsWith('data:image/')) {
        // If it's a base64 data URL, we need to convert it to a File
        const base64Data = categoryData.image
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
        const file = new File([blob], 'category-image', { type: mimeType })
        formData.append('file', file)
      }
      
      // Append all form fields (API expects multipart/form-data even without file)
      if (categoryData.category_name !== undefined) {
        formData.append('category_name', categoryData.category_name)
      }
      if (categoryData.category_description !== undefined) {
        formData.append('category_description', categoryData.category_description)
      }
      if (categoryData.is_active !== undefined) {
        // Convert boolean to string for FormData
        formData.append('is_active', String(categoryData.is_active))
      }
      if (categoryData.sort_order !== undefined) {
        formData.append('sort_order', String(categoryData.sort_order))
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      console.log('Sending update request with multipart/form-data')
      const response = await apiClient.put(`/product-service/categories/${id}`, formData, config)
      
      return {
        success: true,
        data: response.data,
        message: 'Category updated successfully'
      }
    } catch (error) {
      console.error('Category update error:', error)
      return handleApiError(error)
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      await apiClient.delete(`/product-service/categories/${id}`)
      return {
        success: true,
        data: null,
        message: 'Category deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default categoryService
