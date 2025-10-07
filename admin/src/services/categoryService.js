import categoriesData from '../mock/categories.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const categoryService = {
  // Get all categories
  async getCategories() {
    await delay(500)
    return {
      success: true,
      data: categoriesData,
      message: 'Categories fetched successfully'
    }
  },

  // Get category by ID
  async getCategoryById(id) {
    await delay(300)
    const category = categoriesData.find(cat => cat.id === parseInt(id))
    if (category) {
      return {
        success: true,
        data: category,
        message: 'Category fetched successfully'
      }
    } else {
      return {
        success: false,
        message: 'Category not found'
      }
    }
  },

  // Create new category
  async createCategory(categoryData) {
    await delay(800)
    
    // Generate new ID
    const existingIds = categoriesData.map(cat => parseInt(cat.id)).filter(id => !isNaN(id))
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
    
    const newCategory = {
      id: newId,
      ...categoryData,
      subCategories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    categoriesData.push(newCategory)
    
    return {
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    }
  },

  // Update category
  async updateCategory(id, categoryData) {
    await delay(800)
    
    const categoryIndex = categoriesData.findIndex(cat => cat.id === parseInt(id))
    if (categoryIndex !== -1) {
      categoriesData[categoryIndex] = {
        ...categoriesData[categoryIndex],
        ...categoryData,
        updatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        data: categoriesData[categoryIndex],
        message: 'Category updated successfully'
      }
    } else {
      return {
        success: false,
        message: 'Category not found'
      }
    }
  },

  // Delete category
  async deleteCategory(id) {
    await delay(600)
    
    const categoryIndex = categoriesData.findIndex(cat => cat.id === parseInt(id))
    if (categoryIndex !== -1) {
      const deletedCategory = categoriesData.splice(categoryIndex, 1)[0]
      
      return {
        success: true,
        data: deletedCategory,
        message: 'Category deleted successfully'
      }
    } else {
      return {
        success: false,
        message: 'Category not found'
      }
    }
  }
}
