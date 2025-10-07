import React, { useState, useEffect, useRef } from 'react'
import { CContainer, CRow, CCol, CButton, CFormInput, CFormSelect, CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react'
import { useToast } from '../../components'
import { Button, Table, Modal, FormModal } from '../../components'
import RoleForm from '../../components/pages/roles/RoleForm'
import { cilPlus, cilPencil, cilTrash, cilInfo, cilMagnifyingGlass, cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import roleService from '../../services/roleService'

const RolesList = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState(null)
  const [roleToView, setRoleToView] = useState(null)
  const [roleToDelete, setRoleToDelete] = useState(null)
  
  // Form refs
  const addRoleFormRef = useRef()
  const editRoleFormRef = useRef()
  
  const { success, error } = useToast()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const response = await roleService.getRoles()
      if (response.success) {
        setRoles(response.data)
      } else {
        error('Failed to fetch roles')
      }
    } catch (err) {
      error('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleAddRole = () => {
    setShowAddModal(true)
  }

  const handleOpenEditModal = (role) => {
    setRoleToEdit(role)
    setShowEditModal(true)
  }

  const handleViewRole = (role) => {
    setRoleToView(role)
    setShowViewModal(true)
  }

  const handleDeleteRole = (role) => {
    setRoleToDelete(role)
    setShowDeleteModal(true)
  }

  const handleAddRoleSubmit = async (formData) => {
    try {
      const response = await roleService.createRole(formData)
      if (response.success) {
        success('Role created successfully!')
        setShowAddModal(false)
        fetchRoles() // Refresh the list
      } else {
        error(response.message || 'Failed to create role')
      }
    } catch (err) {
      error('Failed to create role')
    }
  }

  const handleEditRoleSubmit = async (formData) => {
    try {
      const response = await roleService.updateRole(roleToEdit.id, formData)
      if (response.success) {
        success('Role updated successfully!')
        setShowEditModal(false)
        setRoleToEdit(null)
        fetchRoles() // Refresh the list
      } else {
        error(response.message || 'Failed to update role')
      }
    } catch (err) {
      error('Failed to update role')
    }
  }

  const confirmDeleteRole = async () => {
    try {
      const response = await roleService.deleteRole(roleToDelete.id)
      if (response.success) {
        success('Role deleted successfully!')
        setShowDeleteModal(false)
        setRoleToDelete(null)
        fetchRoles() // Refresh the list
      } else {
        error(response.message || 'Failed to delete role')
      }
    } catch (err) {
      error('Failed to delete role')
    }
  }

  // Filter roles based on search and status
  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && role.isActive) ||
      (statusFilter === 'inactive' && !role.isActive)
    
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      render: (value, role, index) => (
        <div className="d-flex align-items-center">
          <CIcon icon={cilLockLocked} className="me-2 text-primary" />
          <div>
            <div className="fw-semibold">{role.name}</div>
            <small className="text-muted">{role.description}</small>
          </div>
        </div>
      )
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (value, role, index) => (
        <div>
          <span className="fw-semibold text-info">
            {role.permissions?.length || 0} permissions
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, role, index) => (
        <span
          className={`fw-semibold ${
            role.isActive ? 'text-success' : 'text-secondary'
          }`}
        >
          {role.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value, role, index) => new Date(role.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, role, index) => (
        <div className="d-flex gap-2">
          <CButton
            color="info"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewRole(role)
            }}
            title="View Role"
          >
            <CIcon icon={cilInfo} />
          </CButton>
          <CButton
            color="warning"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEditModal(role)
            }}
            title="Edit Role"
          >
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteRole(role)
            }}
            title="Delete Role"
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </div>
      )
    }
  ]

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          {/* Roles Table Card */}
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center w-100">
                <CCardTitle className="mb-0">Roles</CCardTitle>
                <Button
                  variant="primary"
                  icon={<CIcon icon={cilPlus} />}
                  onClick={handleAddRole}
                >
                  Add Role
                </Button>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Filters */}
              <div className="d-flex gap-2 align-items-center mb-3">
                <CFormInput
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: '200px' }}
                />
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </div>
              
              <Table
                data={filteredRoles}
                columns={columns}
                loading={loading}
                hover
                pagination={true}
                sortable={true}
                sortableColumns={['name', 'status', 'createdAt']}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredRoles.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Add Role Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Role"
        size="xl"
        onConfirm={() => addRoleFormRef.current?.handleSubmit()}
        confirmText="Create Role"
        cancelText="Cancel"
        loading={false}
      >
        <RoleForm
          ref={addRoleFormRef}
          mode="create"
          onSubmit={handleAddRoleSubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      {/* Edit Role Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setRoleToEdit(null)
        }}
        title="Edit Role"
        size="xl"
        onConfirm={() => editRoleFormRef.current?.handleSubmit()}
        confirmText="Update Role"
        cancelText="Cancel"
        loading={false}
      >
        <RoleForm
          ref={editRoleFormRef}
          mode="edit"
          roleData={roleToEdit}
          onSubmit={handleEditRoleSubmit}
          onCancel={() => {
            setShowEditModal(false)
            setRoleToEdit(null)
          }}
        />
      </FormModal>

      {/* View Role Modal */}
      <Modal
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setRoleToView(null)
        }}
        title="Role Details"
        size="xl"
        showFooter={false}
        type="info"
      >
        {roleToView && (
          <div className="row">
            <div className="col-md-4 text-center mb-3">
              <div
                className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#6c757d'
                }}
              >
                <CIcon icon={cilLockLocked} size="2xl" />
              </div>
              <h5 className="mt-2 mb-0">{roleToView.name}</h5>
              <p className="text-muted mb-0">{roleToView.description}</p>
            </div>
            <div className="col-md-8">
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Role Name:</strong></div>
                <div className="col-sm-8">{roleToView.name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Description:</strong></div>
                <div className="col-sm-8">{roleToView.description}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Status:</strong></div>
                <div className="col-sm-8">
                  <span
                    className={`fw-semibold ${
                      roleToView.isActive ? 'text-success' : 'text-secondary'
                    }`}
                  >
                    {roleToView.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Permissions:</strong></div>
                <div className="col-sm-8">
                  <span className="fw-semibold text-info">
                    {roleToView.permissions?.length || 0} permissions
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Created:</strong></div>
                <div className="col-sm-8">{new Date(roleToView.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Last Updated:</strong></div>
                <div className="col-sm-8">{new Date(roleToView.updatedAt || roleToView.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Role"
        onConfirm={confirmDeleteRole}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete role <strong>{roleToDelete?.name}</strong>?</p>
        <p className="text-muted">This action cannot be undone and may affect users assigned to this role.</p>
      </Modal>
    </CContainer>
  )
}

export default RolesList