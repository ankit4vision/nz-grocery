// Product Service - API calls for product management
import productsData from '../mock/products.json'
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils/errorHandler'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    await delay(500)
    return {
      success: true,
      data: productsData,
      message: 'Products fetched successfully'
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/product-service/products/${id}`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get full product details (for review step)
  getProductFullDetails: async (id) => {
    try {
      const response = await apiClient.get(`/product-service/products/${id}/full`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      // Map form data to API format
      const apiData = {
        product_name: productData.name || productData.product_name,
        sku: productData.sku,
        category_id: productData.category_id || parseInt(productData.category),
        brand: productData.brand || null,
        short_description: productData.short_description || productData.description || null,
        full_description: productData.full_description || productData.description || null,
        gst: productData.gst || productData.gstRate ? parseFloat(productData.gst || productData.gstRate) : null,
        margin: productData.margin || productData.profitMargin ? parseFloat(productData.margin || productData.profitMargin) : null
      }

      // Remove null values for optional fields if they're empty strings
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === '' || apiData[key] === null) {
          if (key !== 'category_id' && key !== 'product_name' && key !== 'sku') {
            apiData[key] = null
          }
        }
      })

      const response = await apiClient.post('/product-service/products/', apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    await delay(800)
    
    const productIndex = productsData.findIndex(p => p.id === parseInt(id))
    if (productIndex !== -1) {
      const existingProduct = productsData[productIndex]
      
      productsData[productIndex] = {
        ...existingProduct,
        name: productData.name || existingProduct.name,
        description: productData.description !== undefined ? productData.description : existingProduct.description,
        weight: productData.weight !== undefined ? productData.weight : existingProduct.weight,
        category: productData.category !== undefined ? productData.category : existingProduct.category,
        subCategory: productData.subCategory !== undefined ? productData.subCategory : existingProduct.subCategory,
        price: productData.price !== undefined ? productData.price : existingProduct.price,
        oldPrice: productData.oldPrice !== undefined ? productData.oldPrice : existingProduct.oldPrice,
        stock: productData.stock !== undefined ? productData.stock : existingProduct.stock,
        stockStatus: productData.stock !== undefined ? 
          (productData.stock > 50 ? 'high' : productData.stock > 10 ? 'medium' : productData.stock > 0 ? 'low' : 'out') : 
          existingProduct.stockStatus,
        status: productData.status !== undefined ? productData.status : existingProduct.status,
        isActive: productData.isActive !== undefined ? productData.isActive : existingProduct.isActive,
        image: productData.image !== undefined ? productData.image : existingProduct.image,
        sku: productData.sku !== undefined ? productData.sku : existingProduct.sku,
        barcode: productData.barcode !== undefined ? productData.barcode : existingProduct.barcode,
        brand: productData.brand !== undefined ? productData.brand : existingProduct.brand,
        unit: productData.unit !== undefined ? productData.unit : existingProduct.unit,
        tags: productData.tags !== undefined ? productData.tags : existingProduct.tags,
        updatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        data: productsData[productIndex],
        message: 'Product updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Product not found'
      }
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    await delay(600)
    
    const productIndex = productsData.findIndex(p => p.id === parseInt(id))
    if (productIndex !== -1) {
      const deletedProduct = productsData.splice(productIndex, 1)[0]
      
      return {
        success: true,
        data: deletedProduct,
        message: 'Product deleted successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Product not found'
      }
    }
  },

  // Update product status
  updateProductStatus: async (id, status) => {
    await delay(300)
    
    const productIndex = productsData.findIndex(p => p.id === parseInt(id))
    if (productIndex !== -1) {
      productsData[productIndex].status = status
      productsData[productIndex].updatedAt = new Date().toISOString()
      
      return {
        success: true,
        data: productsData[productIndex],
        message: 'Product status updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Product not found'
      }
    }
  },

  // Update product stock
  updateProductStock: async (id, stock) => {
    await delay(300)
    
    const productIndex = productsData.findIndex(p => p.id === parseInt(id))
    if (productIndex !== -1) {
      productsData[productIndex].stock = stock
      productsData[productIndex].stockStatus = stock > 50 ? 'high' : stock > 10 ? 'medium' : stock > 0 ? 'low' : 'out'
      productsData[productIndex].updatedAt = new Date().toISOString()
      
      return {
        success: true,
        data: productsData[productIndex],
        message: 'Product stock updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Product not found'
      }
    }
  },

  // Get product statistics
  getProductStats: async () => {
    await delay(300)
    
    const totalProducts = productsData.length
    const activeProducts = productsData.filter(p => p.status === 'active').length
    const lowStockProducts = productsData.filter(p => p.stockStatus === 'low' || p.stockStatus === 'out').length
    const averageRating = productsData.reduce((sum, p) => sum + p.rating, 0) / totalProducts
    
    return {
      success: true,
      data: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        averageRating: Math.round(averageRating * 10) / 10
      },
      message: 'Product statistics fetched successfully'
    }
  },

  // Search products
  searchProducts: async (searchTerm, filters = {}) => {
    await delay(300)
    
    let filteredProducts = productsData
    
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category)
    }
    
    if (filters.status) {
      filteredProducts = filteredProducts.filter(p => p.status === filters.status)
    }
    
    if (filters.stockStatus) {
      filteredProducts = filteredProducts.filter(p => p.stockStatus === filters.stockStatus)
    }
    
    return {
      success: true,
      data: filteredProducts,
      message: 'Products searched successfully'
    }
  },

  // Export products
  exportProducts: async (format = 'csv', filters = {}) => {
    await delay(1000)
    
    // Simulate export functionality
    const filteredProducts = productsData // In real app, apply filters here
    
    return {
      success: true,
      data: filteredProducts,
      message: 'Products exported successfully'
    }
  },

  // Get all attributes
  getAttributes: async () => {
    try {
      const response = await apiClient.get('/product-service/attributes/')
      return {
        success: true,
        data: response.data || [],
        message: 'Attributes fetched successfully'
      }
    } catch (error) {
      console.error('Error fetching attributes:', error)
      // Fallback to mock data for development
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch attributes'
      }
    }
  },

  // Get product attributes
  getProductAttributes: async (productId) => {
    try {
      const response = await apiClient.get(`/product-service/products/${productId}/attributes/`)
      return {
        success: true,
        data: response.data || [],
        message: 'Product attributes fetched successfully'
      }
    } catch (error) {
      console.error('Error fetching product attributes:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch product attributes'
      }
    }
  },

  // Assign attributes to product
  // API expects: array of { attribute_id, custom_value } objects
  assignProductAttributes: async (productId, attributesArray) => {
    try {
      // If attributesArray is an object with 'attributes' property, extract it
      const attributes = Array.isArray(attributesArray) 
        ? attributesArray 
        : (attributesArray.attributes || [])
      
      // Convert attribute values to API format
      const payload = attributes.map(attr => ({
        attribute_id: parseInt(attr.attribute_id),
        custom_value: attr.value !== undefined && attr.value !== null 
          ? String(attr.value) 
          : null
      }))
      
      const response = await apiClient.post(`/product-service/products/${productId}/attributes/`, payload)
      return {
        success: true,
        data: response.data || [],
        message: 'Attributes assigned successfully'
      }
    } catch (error) {
      console.error('Error assigning attributes:', error)
      return handleApiError(error)
    }
  }
}

export { productService }
