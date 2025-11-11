import apiClient from '../../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../../utils/errorHandler'
import { API_ENDPOINTS } from '../../utils/constants'

/**
 * Products API service
 */
export class ProductsService {
  /**
   * Filter product variants with pagination and filters
   * 
   * @param {object} params - Query parameters
   * @param {string} params.product_name - Filter by product name (partial match)
   * @param {number} params.category_id - Filter by category ID
   * @param {number} params.attribute_id - Filter by attribute ID
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.page_size - Items per page (default: 10, max: 100)
   * @returns {Promise} - Product variants response with pagination
   */
  static async getProductVariants(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.VARIANTS_FILTER, { params })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get full product details by ID
   * 
   * @param {string|number} productId - Product ID
   * @returns {Promise} - Full product details including variants, images, attributes, bulk pricing
   */
  static async getProductFullDetails(productId) {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.DETAIL(productId)
      const response = await apiClient.get(endpoint)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get product by ID (alias for getProductFullDetails for backward compatibility)
   * 
   * @param {string|number} productId - Product ID
   * @returns {Promise} - Product data
   */
  static async getProductById(productId) {
    return this.getProductFullDetails(productId)
  }

  /**
   * Search products by name
   * Uses the filter endpoint with product_name parameter
   * 
   * @param {string} query - Search query (product name)
   * @param {object} params - Additional search parameters
   * @returns {Promise} - Search results
   */
  static async searchProducts(query, params = {}) {
    try {
      const searchParams = {
        product_name: query,
        ...params
      }
      return this.getProductVariants(searchParams)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get products by category
   * Uses the filter endpoint with category_id parameter
   * 
   * @param {string|number} categoryId - Category ID
   * @param {object} params - Query parameters
   * @returns {Promise} - Products in category
   */
  static async getProductsByCategory(categoryId, params = {}) {
    try {
      const searchParams = {
        category_id: categoryId,
        ...params
      }
      return this.getProductVariants(searchParams)
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get featured products
   * Can be implemented by filtering with specific criteria or using a featured flag
   * For now, returns products with pagination
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - Featured products
   */
  static async getFeaturedProducts(params = {}) {
    try {
      // For now, return first page of products
      // This can be enhanced when featured flag is available in API
      return this.getProductVariants({ page: 1, page_size: 12, ...params })
    } catch (error) {
      return handleApiError(error)
    }
  }

  /**
   * Get related products
   * Uses the same category to find related products
   * 
   * @param {string|number} productId - Product ID
   * @param {number} limit - Number of related products
   * @returns {Promise} - Related products
   */
  static async getRelatedProducts(productId, limit = 4) {
    try {
      // First get the product to find its category
      const productResponse = await this.getProductFullDetails(productId)
      if (!productResponse.success || !productResponse.data) {
        return { success: false, data: [], message: 'Product not found' }
      }

      const categoryId = productResponse.data.category_id
      if (!categoryId) {
        return { success: false, data: [], message: 'Product category not found' }
      }

      // Get products from same category, excluding current product
      const params = {
        category_id: categoryId,
        page: 1,
        page_size: limit + 1 // Get one extra to exclude current product
      }
      
      const response = await this.getProductVariants(params)
      if (response.success && response.data && response.data.items) {
        // Filter out current product
        const relatedProducts = response.data.items.filter(
          item => item.product_id !== parseInt(productId)
        ).slice(0, limit)
        
        return {
          ...response,
          data: {
            ...response.data,
            items: relatedProducts
          }
        }
      }
      
      return response
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default ProductsService;
