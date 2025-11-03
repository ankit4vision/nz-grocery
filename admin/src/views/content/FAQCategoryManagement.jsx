import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Spinner, Table, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import FAQCategoryFormModal from '../../components/pages/content/FAQCategoryFormModal'
import { faqCategoryService } from '../../services/contentService'
import { useToast } from '../../components'

const FAQCategoryManagement = () => {
  const { success, error: showError } = useToast()
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async (filterActive = null) => {
    setLoading(true)
    try {
      const params = {}
      if (filterActive !== null) {
        params.is_active = filterActive
      } else if (statusFilter !== 'all') {
        params.is_active = statusFilter === 'active'
      }

      const response = await faqCategoryService.getCategories(params)
      if (response.success) {
        const categoriesList = Array.isArray(response.data) ? response.data : []
        // Sort by sort_order, then by category_name
        const sortedCategories = [...categoriesList].sort((a, b) => {
          if (a.sort_order !== b.sort_order) {
            return (a.sort_order || 0) - (b.sort_order || 0)
          }
          return (a.category_name || '').localeCompare(b.category_name || '')
        })
        setCategories(sortedCategories)
      } else {
        showError(response.message || 'Failed to load FAQ categories')
      }
    } catch (err) {
      showError('An error occurred while loading FAQ categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowCategoryModal(true)
  }

  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId)
    const categoryName = category?.category_name || 'this category'
    
    if (window.confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all FAQ entries in this category.`)) {
      try {
        const response = await faqCategoryService.deleteCategory(categoryId)
        if (response.success) {
          success(response.message || 'FAQ category deleted successfully!')
          loadCategories()
        } else {
          showError(response.message || 'Failed to delete FAQ category')
        }
      } catch (err) {
        showError('An error occurred while deleting FAQ category')
      }
    }
  }

  const handleSaveCategory = async (categoryData) => {
    try {
      let response
      if (editingCategory) {
        // Update existing category
        response = await faqCategoryService.updateCategory(editingCategory.category_id, categoryData)
      } else {
        // Create new category
        response = await faqCategoryService.createCategory(categoryData)
      }

      if (response.success) {
        success(response.message || (editingCategory ? 'FAQ category updated successfully!' : 'FAQ category created successfully!'))
        setShowCategoryModal(false)
        loadCategories()
      } else {
        showError(response.message || `Failed to ${editingCategory ? 'update' : 'create'} FAQ category`)
      }
    } catch (err) {
      showError(`An error occurred while ${editingCategory ? 'updating' : 'creating'} FAQ category`)
    }
  }

  const handleStatusFilter = (filterValue) => {
    setStatusFilter(filterValue)
    if (filterValue === 'all') {
      loadCategories()
    } else {
      loadCategories(filterValue === 'active')
    }
  }

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <span className="badge bg-success text-white">Active</span>
    } else {
      return <span className="badge bg-secondary text-white">Inactive</span>
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  return (
    <>
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <h4 className="mb-0 text-success">FAQ Categories</h4>
        <div className="ms-auto d-flex gap-2 align-items-center">
          <Form.Select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="border-2"
            style={{ width: 'auto' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
          <Button variant="success" onClick={handleAddCategory} className="text-white">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted">Loading FAQ categories...</p>
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No FAQ categories found. Click "Add Category" to create your first category.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Category Name</th>
                    <th>Sort Order</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.category_id}>
                      <td className="fw-semibold">{category.category_name}</td>
                      <td>{category.sort_order || 0}</td>
                      <td>{getStatusBadge(category.is_active)}</td>
                      <td className="text-muted small">
                        {formatDate(category.created_at)}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="px-3"
                            title="Edit Category"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.category_id)}
                            className="px-3"
                            title="Delete Category"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Category Form Modal */}
      <FAQCategoryFormModal
        show={showCategoryModal}
        onHide={() => {
          setShowCategoryModal(false)
          setEditingCategory(null)
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </>
  )
}

export default FAQCategoryManagement

