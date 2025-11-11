// Inventory Service - API calls for inventory management
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils/errorHandler'
import { productService } from './productService'

const inventoryService = {
  // Get all inventory items (product variants with stock)
  // Uses the same API as ProductsList - product variants filter
  getInventoryItems: async (filters = {}, pagination = {}) => {
    try {
      const params = {
        page: pagination.page || 1,
        page_size: pagination.pageSize || 10
      }
      
      // Apply filters
      if (filters.search) {
        params.product_name = filters.search
      }
      
      if (filters.category && filters.category !== 'All Categories' && filters.category !== '') {
        params.category_id = parseInt(filters.category)
      }
      
      // Stock status filter - map to API format if needed
      // Note: The API doesn't directly support stock status filter, 
      // but we can filter client-side or use inventory statistics
      if (filters.status && filters.status !== 'All Status' && filters.status !== '') {
        // This will be handled client-side after fetching
        params._stock_status = filters.status
      }
      
      const response = await productService.getProductVariantsFilter(params)
      
      if (response.success && response.data) {
        let items = response.data.items || []
        
        // Apply client-side stock status filter if needed
        if (filters.status && filters.status !== 'All Status' && filters.status !== '') {
          items = items.filter(variant => {
            const stockQty = variant.stock_quantity || 0
            const lowStockQty = variant.low_stock_quantity || 0
            
            if (filters.status === 'out_of_stock') {
              return stockQty === 0
            } else if (filters.status === 'low_stock') {
              return stockQty > 0 && stockQty <= lowStockQty
            } else if (filters.status === 'in_stock') {
              return stockQty > lowStockQty
            }
            return true
          })
        }
        
        return {
          success: true,
          data: items,
          total: response.data.total_count || 0,
          totalPages: response.data.total_pages || 0
        }
      }
      
      return handleApiError(new Error(response.message || 'Failed to fetch inventory items'))
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    try {
      const response = await apiClient.get('/product-service/products/inventory-statistics')
      
      if (response.data) {
        const stats = response.data
        return {
          success: true,
          data: {
            totalProducts: stats.total_product_variants || 0,
            totalStock: stats.total_stock_quantity || 0,
            lowStockItems: stats.low_stock_variants || 0,
            outOfStockItems: stats.out_of_stock_variants || 0,
            inStockItems: stats.in_stock_variants || 0,
            activeVariants: stats.active_product_variants || 0,
            inactiveVariants: stats.inactive_product_variants || 0,
            averageStock: stats.average_stock_per_variant || 0,
            variantsBelowThreshold: stats.variants_below_threshold || 0
          },
          message: 'Inventory statistics fetched successfully'
        }
      }
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update stock for a product variant
  // API: PUT /product-service/products/variants/stock/update
  // Request: { variant_id, stock_addition?, stock_reduction?, low_stock_quantity? }
  updateStock: async (variantId, stockData) => {
    try {
      const requestData = {
        variant_id: parseInt(variantId)
      }
      
      // Add stock addition if provided
      if (stockData.stock_addition !== undefined && stockData.stock_addition !== null) {
        requestData.stock_addition = parseInt(stockData.stock_addition)
      }
      
      // Add stock reduction if provided
      if (stockData.stock_reduction !== undefined && stockData.stock_reduction !== null) {
        requestData.stock_reduction = parseInt(stockData.stock_reduction)
      }
      
      // Update low stock quantity if provided
      if (stockData.low_stock_quantity !== undefined && stockData.low_stock_quantity !== null) {
        requestData.low_stock_quantity = parseInt(stockData.low_stock_quantity)
      }
      
      const response = await apiClient.put('/product-service/products/variants/stock/update', requestData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get inventory item by variant ID (uses product variants filter)
  getInventoryItemById: async (variantId) => {
    try {
      // Use product variants filter to get specific variant
      const response = await productService.getProductVariantsFilter({ 
        page: 1, 
        page_size: 1000 
      })
      
      if (response.success && response.data) {
        const variant = response.data.items?.find(v => v.variant_id === parseInt(variantId))
        
        if (!variant) {
          return {
            success: false,
            message: 'Inventory item not found',
            error: 'not_found'
          }
        }
        
        return {
          success: true,
          data: variant,
          message: 'Inventory item fetched successfully'
        }
      }
      
      return {
        success: false,
        message: 'Failed to fetch inventory item',
        error: 'fetch_error'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Bulk update inventory items (update multiple variants)
  bulkUpdateInventory: async (variantIds, updateData) => {
    try {
      const results = []
      const errors = []
      
      // Update each variant
      for (const variantId of variantIds) {
        try {
          const result = await inventoryService.updateStock(variantId, updateData)
          if (result.success) {
            results.push(result.data)
          } else {
            errors.push({ variantId, error: result.message })
          }
        } catch (error) {
          errors.push({ variantId, error: error.message })
        }
      }
      
      return {
        success: errors.length === 0,
        data: results,
        errors: errors.length > 0 ? errors : undefined,
        updatedCount: results.length,
        message: errors.length > 0 
          ? `Updated ${results.length} of ${variantIds.length} items. ${errors.length} failed.`
          : `Successfully updated ${results.length} items.`
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get inventory history for a variant (placeholder - API may not exist yet)
  getInventoryHistory: async (variantId) => {
    try {
      // TODO: Implement when inventory history API is available
      // For now, return empty array
      return {
        success: true,
        data: [],
        message: 'Inventory history not available yet'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Export inventory data
  exportInventory: async (filters = {}) => {
    try {
      // Fetch all inventory items (with large page size for export)
      const result = await inventoryService.getInventoryItems(filters, { page: 1, pageSize: 10000 })
      
      if (!result.success) {
        return result
      }
      
      // Format data for CSV export
      const csvData = result.data.map(variant => ({
        'Product Name': variant.product_name || '',
        'Variant Name': variant.variant_name || '',
        'SKU': variant.sku || '',
        'Category': variant.category_name || '',
        'Stock Quantity': variant.stock_quantity || 0,
        'Low Stock Quantity': variant.low_stock_quantity || 0,
        'Price': variant.sale_price || variant.discounted_sale_price || 0,
        'Status': variant.is_active ? 'Active' : 'Inactive',
        'Stock Status': variant.stock_quantity === 0 ? 'Out of Stock' :
                       (variant.stock_quantity <= (variant.low_stock_quantity || 0) ? 'Low Stock' : 'In Stock')
      }))
      
      return {
        success: true,
        data: csvData,
        filename: `inventory-export-${new Date().toISOString().split('T')[0]}.csv`
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default inventoryService
