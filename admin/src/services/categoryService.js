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
      name: categoryData.name,
      description: categoryData.description || '',
      image: categoryData.image || '',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      productCount: 0, // New categories start with 0 products
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
      const existingCategory = categoriesData[categoryIndex]
      
      categoriesData[categoryIndex] = {
        ...existingCategory,
        name: categoryData.name || existingCategory.name,
        description: categoryData.description !== undefined ? categoryData.description : existingCategory.description,
        image: categoryData.image !== undefined ? categoryData.image : existingCategory.image,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : existingCategory.isActive,
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
  },

  // Update product count for a category (simulated)
  async updateProductCount(categoryId, productCount) {
    await delay(300)
    
    const categoryIndex = categoriesData.findIndex(cat => cat.id === parseInt(categoryId))
    if (categoryIndex !== -1) {
      categoriesData[categoryIndex].productCount = productCount
      categoriesData[categoryIndex].updatedAt = new Date().toISOString()
      
      return {
        success: true,
        data: categoriesData[categoryIndex],
        message: 'Product count updated successfully'
      }
    } else {
      return {
        success: false,
        message: 'Category not found'
      }
    }
  },

  // Upload category image (simulated - in real app, this would upload to cloud storage)
  async uploadCategoryImage(imageFile) {
    await delay(1000)
    
    // Simulate image upload - return a data URL or cloud URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve({
          success: true,
          data: {
            imageUrl: e.target.result, // In real app, this would be a cloud URL
            fileName: imageFile.name,
            fileSize: imageFile.size
          },
          message: 'Image uploaded successfully'
        })
      }
      reader.readAsDataURL(imageFile)
    })
  }
}
