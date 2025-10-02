import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Products API service
 */
export class ProductsService {
  /**
   * Get all products with pagination and filters
   * 
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.category - Category filter
   * @param {string} params.search - Search query
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc/desc)
   * @returns {Promise} - Products response
   */
  static async getProducts(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   * 
   * @param {string|number} productId - Product ID
   * @returns {Promise} - Product data
   */
  static async getProductById(productId) {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.DETAIL.replace(':id', productId);
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Search products
   * 
   * @param {string} query - Search query
   * @param {object} params - Additional search parameters
   * @returns {Promise} - Search results
   */
  static async searchProducts(query, params = {}) {
    try {
      const searchParams = {
        q: query,
        ...params
      };
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.SEARCH, searchParams);
      return response;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get product categories
   * 
   * @returns {Promise} - Categories data
   */
  static async getCategories() {
    try {
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get featured products
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - Featured products
   */
  static async getFeaturedProducts(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.FEATURED, params);
      return response;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   * 
   * @param {string} categoryId - Category ID
   * @param {object} params - Query parameters
   * @returns {Promise} - Products in category
   */
  static async getProductsByCategory(categoryId, params = {}) {
    try {
      const searchParams = {
        category: categoryId,
        ...params
      };
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.LIST, searchParams);
      return response;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * Get related products
   * 
   * @param {string|number} productId - Product ID
   * @param {number} limit - Number of related products
   * @returns {Promise} - Related products
   */
  static async getRelatedProducts(productId, limit = 4) {
    try {
      const params = {
        related_to: productId,
        limit
      };
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.LIST, params);
      return response;
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }

  /**
   * Get product reviews
   * 
   * @param {string|number} productId - Product ID
   * @param {object} params - Query parameters
   * @returns {Promise} - Product reviews
   */
  static async getProductReviews(productId, params = {}) {
    try {
      const endpoint = `/products/${productId}/reviews`;
      const response = await apiGet(endpoint, params);
      return response;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }

  /**
   * Add product review
   * 
   * @param {string|number} productId - Product ID
   * @param {object} reviewData - Review data
   * @returns {Promise} - Created review
   */
  static async addProductReview(productId, reviewData) {
    try {
      const endpoint = `/products/${productId}/reviews`;
      const response = await apiPost(endpoint, reviewData);
      return response;
    } catch (error) {
      console.error('Error adding product review:', error);
      throw error;
    }
  }

  /**
   * Update product (admin only)
   * 
   * @param {string|number} productId - Product ID
   * @param {object} productData - Product data
   * @returns {Promise} - Updated product
   */
  static async updateProduct(productId, productData) {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.DETAIL.replace(':id', productId);
      const response = await apiPut(endpoint, productData);
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product (admin only)
   * 
   * @param {string|number} productId - Product ID
   * @returns {Promise} - Deletion result
   */
  static async deleteProduct(productId) {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.DETAIL.replace(':id', productId);
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default ProductsService;
