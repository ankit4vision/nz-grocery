// Product Service - API calls for product management
import productsData from '../mock/products.json'
import apiClient from '../config/apiClient'

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
    await delay(300)
    const product = productsData.find(p => p.id === parseInt(id))
    if (product) {
      return {
        success: true,
        data: product,
        message: 'Product fetched successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Product not found'
      }
    }
  },

  // Create new product
  createProduct: async (productData) => {
    await delay(800)
    
    // Generate new ID
    const existingIds = productsData.map(p => parseInt(p.id)).filter(id => !isNaN(id))
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
    
    const newProduct = {
      id: newId,
      name: productData.name,
      description: productData.description || '',
      weight: productData.weight || '',
      category: productData.category || '',
      subCategory: productData.subCategory || '',
      price: productData.price || 0,
      oldPrice: productData.oldPrice || null,
      stock: productData.stock || 0,
      stockStatus: productData.stock > 50 ? 'high' : productData.stock > 10 ? 'medium' : productData.stock > 0 ? 'low' : 'out',
      sales: 0, // New products start with 0 sales
      rating: 0,
      reviewCount: 0,
      status: productData.status || 'active',
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      image: productData.image || '',
      sku: productData.sku || '',
      barcode: productData.barcode || '',
      brand: productData.brand || '',
      unit: productData.unit || 'kg',
      tags: productData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    productsData.push(newProduct)
    
    return {
      success: true,
      data: newProduct,
      message: 'Product created successfully'
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
  assignProductAttributes: async (productId, attributes) => {
    try {
      const response = await apiClient.post(`/product-service/products/${productId}/attributes/`, attributes)
      return {
        success: true,
        data: response.data || [],
        message: 'Attributes assigned successfully'
      }
    } catch (error) {
      console.error('Error assigning attributes:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to assign attributes'
      }
    }
  }
}

export { productService }
