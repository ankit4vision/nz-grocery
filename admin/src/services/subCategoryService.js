import subCategoriesData from '../mock/subCategories.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const subCategoryService = {
  // Get all sub categories
  async getSubCategories() {
    await delay(500)
    return {
      success: true,
      data: subCategoriesData,
      message: 'Sub categories fetched successfully'
    }
  },

  // Get sub category by ID
  async getSubCategoryById(id) {
    await delay(300)
    const subCategory = subCategoriesData.find(subCat => subCat.id === parseInt(id))
    if (subCategory) {
      return {
        success: true,
        data: subCategory,
        message: 'Sub category fetched successfully'
      }
    } else {
      return {
        success: false,
        message: 'Sub category not found'
      }
    }
  },

  // Get sub categories by category ID
  async getSubCategoriesByCategoryId(categoryId) {
    await delay(300)
    const subCategories = subCategoriesData.filter(subCat => subCat.categoryId === parseInt(categoryId))
    return {
      success: true,
      data: subCategories,
      message: 'Sub categories fetched successfully'
    }
  },

  // Create new sub category
  async createSubCategory(subCategoryData) {
    await delay(800)
    
    // Generate new ID
    const existingIds = subCategoriesData.map(subCat => parseInt(subCat.id)).filter(id => !isNaN(id))
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
    
    const newSubCategory = {
      id: newId,
      ...subCategoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    subCategoriesData.push(newSubCategory)
    
    return {
      success: true,
      data: newSubCategory,
      message: 'Sub category created successfully'
    }
  },

  // Update sub category
  async updateSubCategory(id, subCategoryData) {
    await delay(800)
    
    const subCategoryIndex = subCategoriesData.findIndex(subCat => subCat.id === parseInt(id))
    if (subCategoryIndex !== -1) {
      subCategoriesData[subCategoryIndex] = {
        ...subCategoriesData[subCategoryIndex],
        ...subCategoryData,
        updatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        data: subCategoriesData[subCategoryIndex],
        message: 'Sub category updated successfully'
      }
    } else {
      return {
        success: false,
        message: 'Sub category not found'
      }
    }
  },

  // Delete sub category
  async deleteSubCategory(id) {
    await delay(600)
    
    const subCategoryIndex = subCategoriesData.findIndex(subCat => subCat.id === parseInt(id))
    if (subCategoryIndex !== -1) {
      const deletedSubCategory = subCategoriesData.splice(subCategoryIndex, 1)[0]
      
      return {
        success: true,
        data: deletedSubCategory,
        message: 'Sub category deleted successfully'
      }
    } else {
      return {
        success: false,
        message: 'Sub category not found'
      }
    }
  }
}
