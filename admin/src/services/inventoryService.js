import inventoryData from '../mock/inventory.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const inventoryService = {
  // Get all inventory items
  getInventoryItems: async (filters = {}) => {
    await delay(500)
    
    let filteredData = [...inventoryData]
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.productName.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm)
      )
    }
    
    if (filters.category && filters.category !== 'All Categories') {
      filteredData = filteredData.filter(item => item.category === filters.category)
    }
    
    if (filters.status && filters.status !== 'All Status') {
      filteredData = filteredData.filter(item => item.status === filters.status)
    }
    
    if (filters.dietaryInfo && filters.dietaryInfo !== 'All Items') {
      filteredData = filteredData.filter(item => item.dietaryInfo === filters.dietaryInfo)
    }
    
    // Sort by last updated (newest first)
    filteredData.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    
    return {
      success: true,
      data: filteredData,
      total: filteredData.length
    }
  },

  // Get inventory item by ID
  getInventoryItemById: async (id) => {
    await delay(300)
    
    const item = inventoryData.find(item => item.id === parseInt(id))
    
    if (!item) {
      return {
        success: false,
        error: 'Inventory item not found'
      }
    }
    
    return {
      success: true,
      data: item
    }
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    await delay(200)
    
    const totalProducts = inventoryData.length
    const totalStock = inventoryData.reduce((sum, item) => sum + item.currentStock, 0)
    const lowStockItems = inventoryData.filter(item => item.status === 'low_stock').length
    const outOfStockItems = inventoryData.filter(item => item.status === 'out_of_stock').length
    
    // Calculate expiring items (within next 7 days)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const expiringItems = inventoryData.filter(item => {
      const expiryDate = new Date(item.expiryDate)
      return expiryDate <= sevenDaysFromNow && item.currentStock > 0
    }).length
    
    return {
      success: true,
      data: {
        totalProducts,
        totalStock,
        lowStockItems,
        outOfStockItems,
        expiringItems
      }
    }
  },

  // Update inventory item
  updateInventoryItem: async (id, updateData) => {
    await delay(800)
    
    const itemIndex = inventoryData.findIndex(item => item.id === parseInt(id))
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Inventory item not found'
      }
    }
    
    // Update the item
    inventoryData[itemIndex] = {
      ...inventoryData[itemIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    }
    
    return {
      success: true,
      data: inventoryData[itemIndex]
    }
  },

  // Bulk update inventory items
  bulkUpdateInventory: async (itemIds, updateData) => {
    await delay(1000)
    
    const updatedItems = []
    
    itemIds.forEach(id => {
      const itemIndex = inventoryData.findIndex(item => item.id === parseInt(id))
      if (itemIndex !== -1) {
        inventoryData[itemIndex] = {
          ...inventoryData[itemIndex],
          ...updateData,
          lastUpdated: new Date().toISOString()
        }
        updatedItems.push(inventoryData[itemIndex])
      }
    })
    
    return {
      success: true,
      data: updatedItems,
      updatedCount: updatedItems.length
    }
  },

  // Add inventory history entry
  addInventoryHistory: async (productId, historyEntry) => {
    await delay(500)
    
    const itemIndex = inventoryData.findIndex(item => item.id === parseInt(productId))
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Inventory item not found'
      }
    }
    
    const newHistoryEntry = {
      id: Date.now(),
      ...historyEntry,
      timestamp: new Date().toISOString()
    }
    
    inventoryData[itemIndex].history.unshift(newHistoryEntry)
    
    // Update current stock based on history entry
    if (historyEntry.type === 'stock_increase' || historyEntry.type === 'stock_adjustment') {
      inventoryData[itemIndex].currentStock += historyEntry.change
      inventoryData[itemIndex].available = inventoryData[itemIndex].currentStock - inventoryData[itemIndex].reserved
      
      // Update status based on stock level
      if (inventoryData[itemIndex].currentStock === 0) {
        inventoryData[itemIndex].status = 'out_of_stock'
        inventoryData[itemIndex].stockStatus = 'Out of Stock'
      } else if (inventoryData[itemIndex].currentStock <= inventoryData[itemIndex].lowStockAlert) {
        inventoryData[itemIndex].status = 'low_stock'
        inventoryData[itemIndex].stockStatus = 'Low Stock'
      } else {
        inventoryData[itemIndex].status = 'in_stock'
        inventoryData[itemIndex].stockStatus = 'In Stock'
      }
    }
    
    inventoryData[itemIndex].lastUpdated = new Date().toISOString()
    
    return {
      success: true,
      data: inventoryData[itemIndex]
    }
  },

  // Get inventory history for a product
  getInventoryHistory: async (productId) => {
    await delay(300)
    
    const item = inventoryData.find(item => item.id === parseInt(productId))
    
    if (!item) {
      return {
        success: false,
        error: 'Inventory item not found'
      }
    }
    
    return {
      success: true,
      data: item.history
    }
  },

  // Export inventory data
  exportInventory: async (filters = {}) => {
    await delay(1000)
    
    const result = await inventoryService.getInventoryItems(filters)
    
    if (!result.success) {
      return result
    }
    
    // Simulate CSV export
    const csvData = result.data.map(item => ({
      'Product Name': item.productName,
      'SKU': item.sku,
      'Category': item.category,
      'Current Stock': item.currentStock,
      'Reserved': item.reserved,
      'Available': item.available,
      'Low Stock Alert': item.lowStockAlert,
      'Expiry Date': item.expiryDate,
      'Status': item.stockStatus,
      'Dietary Info': item.dietaryInfo,
      'Last Updated': item.lastUpdated
    }))
    
    return {
      success: true,
      data: csvData,
      filename: `inventory-export-${new Date().toISOString().split('T')[0]}.csv`
    }
  }
}

export default inventoryService
