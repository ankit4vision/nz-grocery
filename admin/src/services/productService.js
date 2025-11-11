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
    try {
      // Map form data to API format
      const apiData = {}
      
      // Only include fields that are provided (not undefined)
      if (productData.name !== undefined || productData.product_name !== undefined) {
        apiData.product_name = productData.name || productData.product_name
      }
      if (productData.category_id !== undefined || productData.category !== undefined) {
        apiData.category_id = productData.category_id || parseInt(productData.category)
      }
      if (productData.sku !== undefined) {
        apiData.sku = productData.sku
      }
      if (productData.brand !== undefined) {
        apiData.brand = productData.brand || null
      }
      if (productData.short_description !== undefined || productData.description !== undefined) {
        apiData.short_description = productData.short_description || productData.description || null
      }
      if (productData.full_description !== undefined || productData.description !== undefined) {
        apiData.full_description = productData.full_description || productData.description || null
      }
      if (productData.gst !== undefined || productData.gstRate !== undefined) {
        apiData.gst = productData.gst || productData.gstRate ? parseFloat(productData.gst || productData.gstRate) : null
      }
      if (productData.margin !== undefined || productData.profitMargin !== undefined) {
        apiData.margin = productData.margin || productData.profitMargin ? parseFloat(productData.margin || productData.profitMargin) : null
      }

      // Remove null values for optional fields if they're empty strings
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === '' || apiData[key] === null) {
          if (key !== 'category_id' && key !== 'product_name' && key !== 'sku') {
            apiData[key] = null
          }
        }
      })

      const response = await apiClient.put(`/product-service/products/${id}`, apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
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
  },

  // ========== Variants API Methods ==========
  
  // Get product variants
  getProductVariants: async (productId) => {
    try {
      const response = await apiClient.get(`/product-service/products/${productId}/variants`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create product variant
  createProductVariant: async (productId, variantData) => {
    try {
      const apiData = {
        variant_name: variantData.variant_name || variantData.name,
        variant_value: variantData.variant_value || variantData.name,
        base_price: parseFloat(variantData.base_price || variantData.basePrice || 0),
        sale_price: variantData.sale_price || variantData.salePrice ? parseFloat(variantData.sale_price || variantData.salePrice) : null,
        stock_quantity: variantData.stock_quantity || variantData.stock ? parseInt(variantData.stock_quantity || variantData.stock) : 0,
        is_active: variantData.is_active !== undefined ? variantData.is_active : (variantData.status === 'active'),
        sku: variantData.sku || null
      }
      
      const response = await apiClient.post(`/product-service/products/${productId}/variants`, apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update product variant
  updateProductVariant: async (variantId, variantData) => {
    try {
      const apiData = {}
      
      if (variantData.variant_name !== undefined || variantData.name !== undefined) {
        apiData.variant_name = variantData.variant_name || variantData.name
      }
      if (variantData.variant_value !== undefined || variantData.name !== undefined) {
        apiData.variant_value = variantData.variant_value || variantData.name
      }
      if (variantData.base_price !== undefined || variantData.basePrice !== undefined) {
        apiData.base_price = parseFloat(variantData.base_price || variantData.basePrice)
      }
      if (variantData.sale_price !== undefined || variantData.salePrice !== undefined) {
        apiData.sale_price = variantData.sale_price || variantData.salePrice ? parseFloat(variantData.sale_price || variantData.salePrice) : null
      }
      if (variantData.stock_quantity !== undefined || variantData.stock !== undefined) {
        apiData.stock_quantity = parseInt(variantData.stock_quantity || variantData.stock)
      }
      if (variantData.is_active !== undefined || variantData.status !== undefined) {
        apiData.is_active = variantData.is_active !== undefined ? variantData.is_active : (variantData.status === 'active')
      }
      if (variantData.sku !== undefined) {
        apiData.sku = variantData.sku || null
      }
      
      const response = await apiClient.put(`/product-service/products/variants/${variantId}`, apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Delete product variant
  deleteProductVariant: async (variantId) => {
    try {
      await apiClient.delete(`/product-service/products/variants/${variantId}`)
      return {
        success: true,
        data: null,
        message: 'Variant deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // ========== Bulk Pricing API Methods ==========
  
  // Get product bulk pricing
  getProductBulkPricing: async (productId) => {
    try {
      const response = await apiClient.get(`/product-service/products/${productId}/bulk-pricing`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Create bulk pricing
  createBulkPricing: async (productId, bulkPricingData) => {
    try {
      const apiData = {
        minimum_quantity: parseInt(bulkPricingData.minimum_quantity || bulkPricingData.minQuantity || 1),
        maximum_quantity: bulkPricingData.maximum_quantity || bulkPricingData.maxQuantity ? parseInt(bulkPricingData.maximum_quantity || bulkPricingData.maxQuantity) : null,
        discount_type: bulkPricingData.discount_type || (bulkPricingData.priceType === 'price' ? 'fixed' : 'percentage'),
        discount_value: parseFloat(bulkPricingData.discount_value || bulkPricingData.price || 0)
      }
      
      const response = await apiClient.post(`/product-service/products/${productId}/bulk-pricing`, apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update bulk pricing
  updateBulkPricing: async (bulkPricingId, bulkPricingData) => {
    try {
      const apiData = {}
      
      if (bulkPricingData.minimum_quantity !== undefined || bulkPricingData.minQuantity !== undefined) {
        apiData.minimum_quantity = parseInt(bulkPricingData.minimum_quantity || bulkPricingData.minQuantity)
      }
      if (bulkPricingData.maximum_quantity !== undefined || bulkPricingData.maxQuantity !== undefined) {
        apiData.maximum_quantity = bulkPricingData.maximum_quantity || bulkPricingData.maxQuantity ? parseInt(bulkPricingData.maximum_quantity || bulkPricingData.maxQuantity) : null
      }
      if (bulkPricingData.discount_type !== undefined || bulkPricingData.priceType !== undefined) {
        apiData.discount_type = bulkPricingData.discount_type || (bulkPricingData.priceType === 'price' ? 'fixed' : 'percentage')
      }
      if (bulkPricingData.discount_value !== undefined || bulkPricingData.price !== undefined) {
        apiData.discount_value = parseFloat(bulkPricingData.discount_value || bulkPricingData.price)
      }
      
      const response = await apiClient.put(`/product-service/products/bulk-pricing/${bulkPricingId}`, apiData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Delete bulk pricing
  deleteBulkPricing: async (bulkPricingId) => {
    try {
      await apiClient.delete(`/product-service/products/bulk-pricing/${bulkPricingId}`)
      return {
        success: true,
        data: null,
        message: 'Bulk pricing deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // ========== Product Images API Methods ==========
  
  // Get product images
  getProductImages: async (productId) => {
    try {
      const response = await apiClient.get(`/product-service/products/${productId}/images`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Upload product images
  // files: Array of File objects
  // primaryFlags: Array of booleans indicating which images are primary
  // sortOrders: Array of integers for sort order
  uploadProductImages: async (productId, files, primaryFlags = [], sortOrders = []) => {
    try {
      const formData = new FormData()
      
      // Append files to FormData
      files.forEach(file => {
        formData.append('files', file)
      })

      // Build query params
      const params = {}
      if (primaryFlags.length > 0) {
        params.primary_flags = primaryFlags
      }
      if (sortOrders.length > 0) {
        params.sort_orders = sortOrders
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: Object.keys(params).length > 0 ? params : undefined
      }

      const response = await apiClient.post(`/product-service/products/${productId}/images`, formData, config)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update product images metadata (primary flag, sort order)
  updateProductImagesMeta: async (productId, imagesMeta) => {
    try {
      // imagesMeta should be array of { image_id, is_primary?, sort_order? }
      const payload = {
        items: imagesMeta.map(img => ({
          image_id: parseInt(img.image_id),
          is_primary: img.is_primary !== undefined ? img.is_primary : null,
          sort_order: img.sort_order !== undefined ? parseInt(img.sort_order) : null
        }))
      }

      const response = await apiClient.put(`/product-service/products/${productId}/images/meta`, payload)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Delete product images
  deleteProductImages: async (productId, imageIds) => {
    try {
      // imageIds should be array of image IDs
      // API expects array in query params
      const imageIdsArray = Array.isArray(imageIds) ? imageIds.map(id => parseInt(id)) : [parseInt(imageIds)]
      const response = await apiClient.put(`/product-service/products/${productId}/images`, null, {
        params: {
          delete_image_ids: imageIdsArray
        }
      })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Filter product variants (for Products List)
  getProductVariantsFilter: async (params = {}) => {
    try {
      // Build query params
      const queryParams = {}
      
      if (params.product_name) {
        queryParams.product_name = params.product_name
      }
      if (params.category_id) {
        queryParams.category_id = parseInt(params.category_id)
      }
      if (params.attribute_id) {
        queryParams.attribute_id = parseInt(params.attribute_id)
      }
      if (params.page) {
        queryParams.page = parseInt(params.page)
      }
      if (params.page_size) {
        queryParams.page_size = parseInt(params.page_size)
      }

      const response = await apiClient.get('/product-service/products/variants/filter', {
        params: queryParams
      })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // ========== Product Activation API Method ==========
  
  // Activate/Submit product (activates the product)
  activateProduct: async (productId) => {
    try {
      const response = await apiClient.put(`/product-service/products/${productId}/activate`)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export { productService }
