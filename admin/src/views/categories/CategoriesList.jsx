import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faTrash, faSearch, faFolder, faImage, faBox } from '@fortawesome/free-solid-svg-icons'
import { Table, FormModal, Modal } from '../../components'
import { useToast } from '../../components'
import CategoryForm from '../../components/pages/categories/CategoryForm'
import { categoryService } from '../../services/categoryService'

// Component for category image cell
const CategoryImageCell = ({ imageUrl, categoryName }) => {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [imageUrl])

  if (imageUrl && !imageError) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Image
          src={imageUrl}
          alt={categoryName}
          rounded
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          className="border"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  return (
    <div 
      className="d-flex align-items-center justify-content-center border rounded"
      style={{ 
        width: '50px', 
        height: '50px', 
        backgroundColor: '#f8f9fa'
      }}
    >
      <FontAwesomeIcon icon={faImage} className="text-muted" />
    </div>
  )
}

const CategoriesList = () => {
  // Toast notifications
  const { success, error } = useToast()
  
  // State management
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Data states
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  
  // Form refs
  const addCategoryFormRef = useRef(null)
  const editCategoryFormRef = useRef(null)

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getCategories()
      if (response.success) {
        // Map API response to component format - with_counts returns { items: [], total_categories, active_categories, total_products_in_active_categories }
        const mappedCategories = response.data.items || response.data.categories || response.data || []
        setCategories(mappedCategories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter categories
  const filteredCategories = categories.filter(category => {
    // Map API field names to component field names
    const name = category.category_name || category.name || ''
    const description = category.category_description || category.description || ''
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || category.is_active?.toString() === statusFilter ||
                         category.isActive?.toString() === statusFilter
    return matchesSearch && matchesStatus
  })

  // Table columns
  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value, category, index) => {
        const imageUrl = category.category_image_url || category.image
        const categoryName = category.category_name || category.name
        return (
          <CategoryImageCell imageUrl={imageUrl} categoryName={categoryName} />
        )
      }
    },
    {
      key: 'name',
      label: 'Category Name',
      render: (value, category, index) => {
        const categoryName = category.category_name || category.name || ''
        const description = category.category_description || category.description || ''
        return (
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faFolder} className="me-2 text-success" />
            <div>
              <div className="fw-semibold text-dark">{categoryName}</div>
              <small className="text-muted">{description || 'No description'}</small>
            </div>
          </div>
        )
      }
    },
    {
      key: 'productCount',
      label: 'No of Products',
      render: (value, category, index) => (
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faBox} className="me-2 text-info" />
          <span className="fw-semibold text-info">
            {category.product_count || category.productCount || 0} products
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, category, index) => {
        const isActive = category.is_active !== undefined ? category.is_active : category.isActive
        return (
          <span
            className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, category, index) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEditModal(category)
            }}
            title="Edit Category"
          >
            <FontAwesomeIcon icon={faPencil} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteCategory(category)
            }}
            title="Delete Category"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['name', 'productCount', 'status', 'createdAt']

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleAddCategory = () => {
    setShowAddModal(true)
  }

  const handleOpenEditModal = (category) => {
    setCategoryToEdit(category)
    setShowEditModal(true)
  }


  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleAddCategorySubmit = async (formData) => {
    try {
      console.log('Submitting category data:', formData)
      const response = await categoryService.createCategory(formData)
      console.log('API response:', response)
      if (response.success) {
        success(response.message || 'Category created successfully!')
        setShowAddModal(false)
        loadCategories()
      } else {
        console.error('Category creation failed:', response.message || 'Unknown error')
        error(response.message || 'Failed to create category')
      }
    } catch (err) {
      console.error('Error creating category:', err)
      error('An error occurred while creating the category')
    }
  }

  const handleEditCategorySubmit = async (formData) => {
    try {
      const categoryId = categoryToEdit?.category_id || categoryToEdit?.id
      const response = await categoryService.updateCategory(categoryId, formData)
      if (response.success) {
        success(response.message || 'Category updated successfully!')
        setShowEditModal(false)
        setCategoryToEdit(null)
        loadCategories()
      } else {
        console.error('Category update failed:', response.message || 'Unknown error')
        error(response.message || 'Failed to update category')
      }
    } catch (err) {
      console.error('Error updating category:', err)
      error('An error occurred while updating the category')
    }
  }

  const confirmDeleteCategory = async () => {
    try {
      const categoryId = categoryToDelete?.category_id || categoryToDelete?.id
      const response = await categoryService.deleteCategory(categoryId)
      if (response.success) {
        success(response.message || 'Category deleted successfully!')
        setShowDeleteModal(false)
        setCategoryToDelete(null)
        loadCategories()
      } else {
        error(response.message || 'Failed to delete category')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      error('An error occurred while deleting the category')
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <h2 className="mb-0 text-dark">Categories Management</h2>
            <div className="ms-auto">
              <Button variant="primary" onClick={handleAddCategory}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Filters Section */}
            <div className="mb-4">
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Search Categories</label>
                    <FormControl
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status Filter</label>
                    <FormSelect
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </FormSelect>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Categories Table */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={faFolder} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Categories List</h4>
              </div>
              
              <Table
                data={filteredCategories}
                columns={columns}
                sortableColumns={sortableColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                loading={loading}
                hover
                pagination={true}
                sortable={true}
                totalItems={filteredCategories.length}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Add Category Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
        size="lg"
        onSubmit={() => addCategoryFormRef.current?.handleSubmit()}
        submitText="Create Category"
        cancelText="Cancel"
        loading={false}
      >
        <CategoryForm
          ref={addCategoryFormRef}
          mode="create"
          onSubmit={handleAddCategorySubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      {/* Edit Category Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setCategoryToEdit(null)
        }}
        title="Edit Category"
        size="lg"
        onSubmit={() => editCategoryFormRef.current?.handleSubmit()}
        submitText="Update Category"
        cancelText="Cancel"
        loading={false}
      >
        <CategoryForm
          ref={editCategoryFormRef}
          mode="edit"
          categoryData={categoryToEdit}
          onSubmit={handleEditCategorySubmit}
          onCancel={() => {
            setShowEditModal(false)
            setCategoryToEdit(null)
          }}
        />
      </FormModal>


      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setCategoryToDelete(null)
        }}
        title="Delete Category"
        onConfirm={confirmDeleteCategory}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the category <strong>"{categoryToDelete?.name}"</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>
    </Container>
  )
}

export default CategoriesList
