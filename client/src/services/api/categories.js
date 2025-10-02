import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Categories API service
 */
export class CategoriesService {
  /**
   * Get all categories
   * 
   * @param {object} params - Query parameters
   * @returns {Promise} - Categories response
   */
  static async getCategories(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.CATEGORIES, params);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   * 
   * @param {string|number} categoryId - Category ID
   * @returns {Promise} - Category data
   */
  static async getCategoryById(categoryId) {
    try {
      const endpoint = `/categories/${categoryId}`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  /**
   * Get category with products
   * 
   * @param {string|number} categoryId - Category ID
   * @param {object} params - Query parameters
   * @returns {Promise} - Category with products
   */
  static async getCategoryWithProducts(categoryId, params = {}) {
    try {
      const endpoint = `/categories/${categoryId}/products`;
      const response = await apiGet(endpoint, params);
      return response;
    } catch (error) {
      console.error('Error fetching category with products:', error);
      throw error;
    }
  }

  /**
   * Get subcategories
   * 
   * @param {string|number} parentCategoryId - Parent category ID
   * @returns {Promise} - Subcategories
   */
  static async getSubcategories(parentCategoryId) {
    try {
      const endpoint = `/categories/${parentCategoryId}/subcategories`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  }

  /**
   * Get popular categories
   * 
   * @param {number} limit - Number of categories to return
   * @returns {Promise} - Popular categories
   */
  static async getPopularCategories(limit = 10) {
    try {
      const params = { limit, popular: true };
      const response = await apiGet(API_ENDPOINTS.PRODUCTS.CATEGORIES, params);
      return response;
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      throw error;
    }
  }

  /**
   * Search categories
   * 
   * @param {string} query - Search query
   * @param {object} params - Additional search parameters
   * @returns {Promise} - Search results
   */
  static async searchCategories(query, params = {}) {
    try {
      const searchParams = {
        q: query,
        ...params
      };
      const endpoint = '/categories/search';
      const response = await apiGet(endpoint, searchParams);
      return response;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }

  /**
   * Create category (admin only)
   * 
   * @param {object} categoryData - Category data
   * @returns {Promise} - Created category
   */
  static async createCategory(categoryData) {
    try {
      const response = await apiPost(API_ENDPOINTS.PRODUCTS.CATEGORIES, categoryData);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category (admin only)
   * 
   * @param {string|number} categoryId - Category ID
   * @param {object} categoryData - Category data
   * @returns {Promise} - Updated category
   */
  static async updateCategory(categoryId, categoryData) {
    try {
      const endpoint = `/categories/${categoryId}`;
      const response = await apiPut(endpoint, categoryData);
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category (admin only)
   * 
   * @param {string|number} categoryId - Category ID
   * @returns {Promise} - Deletion result
   */
  static async deleteCategory(categoryId) {
    try {
      const endpoint = `/categories/${categoryId}`;
      const response = await apiDelete(endpoint);
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  /**
   * Get category statistics
   * 
   * @param {string|number} categoryId - Category ID
   * @returns {Promise} - Category statistics
   */
  static async getCategoryStats(categoryId) {
    try {
      const endpoint = `/categories/${categoryId}/stats`;
      const response = await apiGet(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }
}

export default CategoriesService;
