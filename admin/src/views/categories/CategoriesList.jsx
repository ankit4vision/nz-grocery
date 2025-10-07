import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faTrash, faInfo, faSearch, faFolder } from '@fortawesome/free-solid-svg-icons'
import { Table, FormModal, Modal } from '../../components'
import CategoryForm from '../../components/pages/categories/CategoryForm'
import { categoryService } from '../../services/categoryService'

const CategoriesList = () => {
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
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Data states
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [categoryToView, setCategoryToView] = useState(null)
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
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || category.isActive.toString() === statusFilter
    return matchesSearch && matchesStatus
  })

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (value, category, index) => (
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faFolder} className="me-2 text-primary" />
          <div>
            <div className="fw-semibold">{category.name}</div>
            <small className="text-muted">{category.description}</small>
          </div>
        </div>
      )
    },
    {
      key: 'subCategoriesCount',
      label: 'Sub Categories',
      render: (value, category, index) => (
        <span className="fw-semibold text-info">
          {category.subCategories?.length || 0} sub categories
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, category, index) => (
        <span
          className={`fw-semibold ${
            category.isActive ? 'text-success' : 'text-secondary'
          }`}
        >
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value, category, index) => new Date(category.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, category, index) => (
        <div className="d-flex gap-2">
          <Button
            variant="info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewCategory(category)
            }}
            title="View Category"
          >
            <FontAwesomeIcon icon={faInfo} />
          </Button>
          <Button
            variant="warning"
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
            variant="danger"
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
  const sortableColumns = ['name', 'status', 'createdAt']

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

  const handleViewCategory = (category) => {
    setCategoryToView(category)
    setShowViewModal(true)
  }

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleAddCategorySubmit = async (formData) => {
    try {
      const response = await categoryService.createCategory(formData)
      if (response.success) {
        setShowAddModal(false)
        loadCategories()
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleEditCategorySubmit = async (formData) => {
    try {
      const response = await categoryService.updateCategory(categoryToEdit.id, formData)
      if (response.success) {
        setShowEditModal(false)
        setCategoryToEdit(null)
        loadCategories()
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const confirmDeleteCategory = async () => {
    try {
      const response = await categoryService.deleteCategory(categoryToDelete.id)
      if (response.success) {
        setShowDeleteModal(false)
        setCategoryToDelete(null)
        loadCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Categories Table Card */}
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center w-100">
                <Card.Title className="mb-0">Categories</Card.Title>
                <Button
                  variant="primary"
                  onClick={handleAddCategory}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Category
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Filters */}
              <div className="d-flex gap-2 align-items-center mb-3">
                <FormControl
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: '200px' }}
                />
                <FormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </FormSelect>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Category Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
        size="lg"
        onConfirm={() => addCategoryFormRef.current?.handleSubmit()}
        confirmText="Create Category"
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
        onConfirm={() => editCategoryFormRef.current?.handleSubmit()}
        confirmText="Update Category"
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

      {/* View Category Modal */}
      <Modal
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setCategoryToView(null)
        }}
        title="Category Details"
        size="lg"
        showFooter={false}
        type="info"
      >
        {categoryToView && (
          <div className="row">
            <div className="col-sm-4"><strong>Name:</strong></div>
            <div className="col-sm-8">{categoryToView.name}</div>
            <div className="col-sm-4"><strong>Description:</strong></div>
            <div className="col-sm-8">{categoryToView.description || 'N/A'}</div>
            <div className="col-sm-4"><strong>Status:</strong></div>
            <div className="col-sm-8">
              <span
                className={`fw-semibold ${
                  categoryToView.isActive ? 'text-success' : 'text-secondary'
                }`}
              >
                {categoryToView.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="col-sm-4"><strong>Sub Categories:</strong></div>
            <div className="col-sm-8">
              <span className="fw-semibold text-info">
                {categoryToView.subCategories?.length || 0} sub categories
              </span>
            </div>
            <div className="col-sm-4"><strong>Created:</strong></div>
            <div className="col-sm-8">{new Date(categoryToView.createdAt).toLocaleDateString()}</div>
          </div>
        )}
      </Modal>

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
