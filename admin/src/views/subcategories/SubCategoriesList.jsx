import React, { useState, useEffect, useRef } from 'react'
import { CContainer, CRow, CCol, CButton, CFormInput, CFormSelect, CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react'
import { cilPlus, cilPencil, cilTrash, cilInfo, cilSearch, cilTags } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Table, FormModal, Modal } from '../../components'
import SubCategoryForm from '../../components/pages/subcategories/SubCategoryForm'
import { subCategoryService } from '../../services/subCategoryService'
import { categoryService } from '../../services/categoryService'

const SubCategoriesList = () => {
  // State management
  const [subCategories, setSubCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Data states
  const [subCategoryToEdit, setSubCategoryToEdit] = useState(null)
  const [subCategoryToView, setSubCategoryToView] = useState(null)
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null)
  
  // Form refs
  const addSubCategoryFormRef = useRef(null)
  const editSubCategoryFormRef = useRef(null)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [subCategoriesResponse, categoriesResponse] = await Promise.all([
        subCategoryService.getSubCategories(),
        categoryService.getCategories()
      ])
      
      if (subCategoriesResponse.success) {
        setSubCategories(subCategoriesResponse.data)
      }
      
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  // Filter sub categories
  const filteredSubCategories = subCategories.filter(subCategory => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subCategory.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || subCategory.categoryId.toString() === categoryFilter
    const matchesStatus = !statusFilter || subCategory.isActive.toString() === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Sub Category Name',
      render: (value, subCategory, index) => (
        <div className="d-flex align-items-center">
          <CIcon icon={cilTags} className="me-2 text-info" />
          <div>
            <div className="fw-semibold">{subCategory.name}</div>
            <small className="text-muted">{subCategory.description}</small>
          </div>
        </div>
      )
    },
    {
      key: 'categoryId',
      label: 'Parent Category',
      render: (value, subCategory, index) => (
        <span className="fw-semibold text-primary">
          {getCategoryName(subCategory.categoryId)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, subCategory, index) => (
        <span
          className={`fw-semibold ${
            subCategory.isActive ? 'text-success' : 'text-secondary'
          }`}
        >
          {subCategory.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value, subCategory, index) => new Date(subCategory.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, subCategory, index) => (
        <div className="d-flex gap-2">
          <CButton
            color="info"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewSubCategory(subCategory)
            }}
            title="View Sub Category"
          >
            <CIcon icon={cilInfo} />
          </CButton>
          <CButton
            color="warning"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEditModal(subCategory)
            }}
            title="Edit Sub Category"
          >
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteSubCategory(subCategory)
            }}
            title="Delete Sub Category"
          >
            <CIcon icon={cilTrash} />
          </CButton>
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

  const handleAddSubCategory = () => {
    setShowAddModal(true)
  }

  const handleOpenEditModal = (subCategory) => {
    setSubCategoryToEdit(subCategory)
    setShowEditModal(true)
  }

  const handleViewSubCategory = (subCategory) => {
    setSubCategoryToView(subCategory)
    setShowViewModal(true)
  }

  const handleDeleteSubCategory = (subCategory) => {
    setSubCategoryToDelete(subCategory)
    setShowDeleteModal(true)
  }

  const handleAddSubCategorySubmit = async (formData) => {
    try {
      const response = await subCategoryService.createSubCategory(formData)
      if (response.success) {
        setShowAddModal(false)
        loadData()
      }
    } catch (error) {
      console.error('Error creating sub category:', error)
    }
  }

  const handleEditSubCategorySubmit = async (formData) => {
    try {
      const response = await subCategoryService.updateSubCategory(subCategoryToEdit.id, formData)
      if (response.success) {
        setShowEditModal(false)
        setSubCategoryToEdit(null)
        loadData()
      }
    } catch (error) {
      console.error('Error updating sub category:', error)
    }
  }

  const confirmDeleteSubCategory = async () => {
    try {
      const response = await subCategoryService.deleteSubCategory(subCategoryToDelete.id)
      if (response.success) {
        setShowDeleteModal(false)
        setSubCategoryToDelete(null)
        loadData()
      }
    } catch (error) {
      console.error('Error deleting sub category:', error)
    }
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          {/* Sub Categories Table Card */}
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center w-100">
                <CCardTitle className="mb-0">Sub Categories</CCardTitle>
                <CButton
                  color="primary"
                  onClick={handleAddSubCategory}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Add Sub Category
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Filters */}
              <div className="d-flex gap-2 align-items-center mb-3">
                <CFormInput
                  placeholder="Search sub categories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: '200px' }}
                />
                <CFormSelect
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </CFormSelect>
              </div>
              <Table
                data={filteredSubCategories}
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
                totalItems={filteredSubCategories.length}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Add Sub Category Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Sub Category"
        size="lg"
        onConfirm={() => addSubCategoryFormRef.current?.handleSubmit()}
        confirmText="Create Sub Category"
        cancelText="Cancel"
        loading={false}
      >
        <SubCategoryForm
          ref={addSubCategoryFormRef}
          mode="create"
          categories={categories}
          onSubmit={handleAddSubCategorySubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      {/* Edit Sub Category Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSubCategoryToEdit(null)
        }}
        title="Edit Sub Category"
        size="lg"
        onConfirm={() => editSubCategoryFormRef.current?.handleSubmit()}
        confirmText="Update Sub Category"
        cancelText="Cancel"
        loading={false}
      >
        <SubCategoryForm
          ref={editSubCategoryFormRef}
          mode="edit"
          subCategoryData={subCategoryToEdit}
          categories={categories}
          onSubmit={handleEditSubCategorySubmit}
          onCancel={() => {
            setShowEditModal(false)
            setSubCategoryToEdit(null)
          }}
        />
      </FormModal>

      {/* View Sub Category Modal */}
      <Modal
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSubCategoryToView(null)
        }}
        title="Sub Category Details"
        size="lg"
        showFooter={false}
        type="info"
      >
        {subCategoryToView && (
          <div className="row">
            <div className="col-sm-4"><strong>Name:</strong></div>
            <div className="col-sm-8">{subCategoryToView.name}</div>
            <div className="col-sm-4"><strong>Description:</strong></div>
            <div className="col-sm-8">{subCategoryToView.description || 'N/A'}</div>
            <div className="col-sm-4"><strong>Parent Category:</strong></div>
            <div className="col-sm-8">
              <span className="fw-semibold text-primary">
                {getCategoryName(subCategoryToView.categoryId)}
              </span>
            </div>
            <div className="col-sm-4"><strong>Status:</strong></div>
            <div className="col-sm-8">
              <span
                className={`fw-semibold ${
                  subCategoryToView.isActive ? 'text-success' : 'text-secondary'
                }`}
              >
                {subCategoryToView.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="col-sm-4"><strong>Created:</strong></div>
            <div className="col-sm-8">{new Date(subCategoryToView.createdAt).toLocaleDateString()}</div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSubCategoryToDelete(null)
        }}
        title="Delete Sub Category"
        onConfirm={confirmDeleteSubCategory}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the sub category <strong>"{subCategoryToDelete?.name}"</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>
    </CContainer>
  )
}

export default SubCategoriesList
