import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEye, 
  faSearch, 
  faRefresh, 
  faUsers, 
  faUser,
  faBan,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal } from '../../components'
import CustomerDetailsModal from '../../components/pages/customers/CustomerDetailsModal'
import SuspendCustomerModal from '../../components/pages/customers/SuspendCustomerModal'
import customerService from '../../services/customerService'
import { useToast } from '../../components'

const CustomersList = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  
  // State management
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('')
  const [registrationDateFilter, setRegistrationDateFilter] = useState('all')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1
  })
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSuspendDetailsModal, setShowSuspendDetailsModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  
  // Data states
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [customerToSuspend, setCustomerToSuspend] = useState(null)
  const [customerToActivate, setCustomerToActivate] = useState(null)
  
  // Stats state
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    suspendedCustomers: 0,
    newThisMonth: 0
  })
  
  // Load stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  // Load customers when pagination or filters change
  // Note: searchTerm is handled separately via handleSearch button click
  useEffect(() => {
    fetchCustomers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.pageSize, statusFilter, cityFilter, registrationDateFilter])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize
      }
      
      // Add filters if set - map to API parameters
      if (searchTerm) {
        // Auto-detect search type: email, phone, or name
        if (searchTerm.includes('@')) {
          params.email = searchTerm
        } else if (/^[\d\s\+\-\(\)]+$/.test(searchTerm)) {
          // Phone number pattern
          params.phone = searchTerm
        } else {
          // Name search
          params.customer_name = searchTerm
        }
      }
      if (statusFilter && statusFilter !== 'all') {
        params.customer_status = statusFilter
      }
      if (cityFilter) {
        params.city = cityFilter
      }
      if (registrationDateFilter && registrationDateFilter !== 'all') {
        const today = new Date()
        let dateFrom, dateTo
        
        switch (registrationDateFilter) {
          case 'today':
            dateFrom = today.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(today.getDate() - 7)
            dateFrom = weekAgo.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(today.getMonth() - 1)
            dateFrom = monthAgo.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          case 'year':
            const yearAgo = new Date(today)
            yearAgo.setFullYear(today.getFullYear() - 1)
            dateFrom = yearAgo.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          default:
            break
        }
        
        if (dateFrom) params.registered_date_from = dateFrom
        if (dateTo) params.registered_date_to = dateTo
      }
      
      const response = await customerService.getCustomers(params)
      if (response.success) {
        setCustomers(response.data.customers || [])
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.total || 0,
          totalPages: response.data.totalPages || 1
        }))
      } else {
        showError(response.message || 'Failed to load customers')
      }
    } catch (err) {
      const errorMsg = 'Failed to load customers'
      showError(errorMsg)
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await customerService.getCustomerStats()
      if (response.success) {
        setStats({
          totalCustomers: response.data.totalCustomers || 0,
          activeCustomers: response.data.activeCustomers || 0,
          suspendedCustomers: response.data.suspendedCustomers || 0,
          newThisMonth: response.data.newThisMonth || 0
        })
      } else {
        console.error('Failed to fetch customer stats:', response.message)
        // Set default values on error
      setStats({
          totalCustomers: 0,
          activeCustomers: 0,
          suspendedCustomers: 0,
          newThisMonth: 0
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'danger'
      case 'inactive': return 'secondary'
      default: return 'secondary'
    }
  }

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Table columns
  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (value, customer, index) => (
        <div className="d-flex align-items-center">
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle me-3"
            style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {getInitials(customer.firstName, customer.lastName)}
          </div>
          <div>
            <div className="fw-semibold text-dark">{customer.firstName} {customer.lastName}</div>
            <small className="text-muted">{customer.customerId}</small>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, customer, index) => (
        <div>
          <div className="fw-semibold text-dark">{customer.email}</div>
          <small className="text-muted">{customer.phone || 'N/A'}</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, customer, index) => (
        <Badge bg={getStatusColor(customer.status)} className="px-2 py-1">
          {customer.status === 'active' ? 'Active' : 
           customer.status === 'suspended' ? 'Suspended' : 
           customer.status === 'inactive' ? 'Inactive' : customer.status}
        </Badge>
      )
    },
    {
      key: 'verification',
      label: 'Verification',
      render: (value, customer, index) => (
        <div>
          <div className="d-flex gap-2 mb-1">
            {customer.emailVerified ? (
              <Badge bg="success" className="px-2 py-1">Email</Badge>
            ) : (
              <Badge bg="secondary" className="px-2 py-1">Email</Badge>
            )}
            {customer.phoneVerified ? (
              <Badge bg="success" className="px-2 py-1">Phone</Badge>
            ) : (
              <Badge bg="secondary" className="px-2 py-1">Phone</Badge>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (value, customer, index) => (
        <div className="text-muted">
          {formatDate(customer.joinedDate)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, customer, index) => (
        <div className="d-flex gap-2 align-items-center">
          <Button
            variant="outline-info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewCustomer(customer)
            }}
            title="View Customer"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <FormSelect
              size="sm"
            value={customer.status}
            onChange={(e) => {
                e.stopPropagation()
              const newStatus = e.target.value
              if (newStatus !== customer.status) {
                if (newStatus === 'suspended') {
                  // Use suspend modal for better UX
                handleSuspendCustomer(customer)
                } else if (newStatus === 'active' && customer.status === 'suspended') {
                  // Use activate confirmation
                handleActivateCustomer(customer)
                } else {
                  // Direct status update
                  handleStatusUpdate(customer, newStatus)
                }
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'auto', minWidth: '120px' }}
            title="Change Status"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </FormSelect>
        </div>
      )
    }
  ]

  // Event handlers
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    // Fetch will be triggered by useEffect when pagination changes
    // But we also need to trigger it immediately for searchTerm
    fetchCustomers()
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCityFilter('')
    setRegistrationDateFilter('all')
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    // Fetch will be triggered by useEffect when filters change
  }

  // Handle status update
  const handleStatusUpdate = async (customer, newStatus) => {
    try {
      const response = await customerService.updateCustomerStatus(customer.userId || customer.id, newStatus)
      if (response.success) {
        success(response.message || `Customer status updated to ${newStatus} successfully`)
        fetchCustomers()
        fetchStats()
      } else {
        showError(response.message || 'Failed to update customer status')
      }
    } catch (error) {
      showError('Failed to update customer status')
      console.error('Error updating customer status:', error)
    }
  }

  const handleViewCustomer = async (customer) => {
    try {
      // Fetch full customer details with addresses
      const response = await customerService.getCustomerDetails(customer.userId || customer.id)
      if (response.success) {
        setSelectedCustomer(response.data)
        setShowDetailsModal(true)
      } else {
        showError(response.message || 'Failed to load customer details')
      }
    } catch (error) {
      showError('Failed to load customer details')
      console.error('Error fetching customer details:', error)
    }
  }

  const handleSuspendCustomer = (customer) => {
    setCustomerToSuspend(customer)
    setShowSuspendDetailsModal(true)
  }

  const handleActivateCustomer = (customer) => {
    setCustomerToActivate(customer)
    setShowActivateModal(true)
  }

  const handleSuspendCustomerSubmit = async (customerId) => {
    try {
      const response = await customerService.suspendCustomer(customerId)
      if (response.success) {
        success(response.message || 'Customer suspended successfully')
        setShowSuspendDetailsModal(false)
        setCustomerToSuspend(null)
        fetchCustomers()
        fetchStats()
      } else {
        showError(response.message || 'Failed to suspend customer')
      }
    } catch (error) {
      showError('Failed to suspend customer')
      console.error('Error suspending customer:', error)
    }
  }

  const confirmActivateCustomer = async () => {
    try {
      const response = await customerService.activateCustomer(customerToActivate.userId || customerToActivate.id)
      if (response.success) {
        success(response.message || 'Customer activated successfully')
        setShowActivateModal(false)
        setCustomerToActivate(null)
        fetchCustomers()
        fetchStats()
      } else {
        showError(response.message || 'Failed to activate customer')
      }
    } catch (error) {
      showError('Failed to activate customer')
      console.error('Error activating customer:', error)
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Customer Management</h2>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-5">
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-success text-white">
                        <FontAwesomeIcon icon={faUsers} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Total Customers</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.totalCustomers}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-info text-white">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Active Customers</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.activeCustomers}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-warning text-white">
                        <FontAwesomeIcon icon={faBan} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Suspended Accounts</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.suspendedCustomers}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-primary text-white">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">New This Month</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.newThisMonth}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Search and Filter Section */}
            <div className="mb-4">
              <Row className="g-3">
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Search Customer</label>
                    <FormControl
                      placeholder="Name, email, or phone"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <FormSelect
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        setPagination(prev => ({ ...prev, currentPage: 1 }))
                        // Fetch will be triggered by useEffect
                      }}
                      className="border-2"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="inactive">Inactive</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">City</label>
                    <FormControl
                      placeholder="Filter by city"
                      value={cityFilter}
                      onChange={(e) => {
                        setCityFilter(e.target.value)
                        setPagination(prev => ({ ...prev, currentPage: 1 }))
                        // Fetch will be triggered by useEffect
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Registration Date</label>
                    <FormSelect
                      value={registrationDateFilter}
                      onChange={(e) => {
                        setRegistrationDateFilter(e.target.value)
                        setPagination(prev => ({ ...prev, currentPage: 1 }))
                        // Fetch will be triggered by useEffect
                      }}
                      className="border-2"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">&nbsp;</label>
                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={handleSearch} className="text-white">
                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                        Search
                      </Button>
                      <Button variant="outline-secondary" onClick={handleReset}>
                        <FontAwesomeIcon icon={faRefresh} className="me-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Customers Table */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUsers} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Customer List</h4>
                </div>
                <div className="text-muted">
                  Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} customers
                </div>
              </div>
              
              <Table
                data={customers}
                columns={columns}
                currentPage={pagination.currentPage}
                pageSize={pagination.pageSize}
                onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }))}
                loading={loading}
                hover
                pagination={true}
                serverSidePagination={true}
                totalItems={pagination.totalItems}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedCustomer(null)
        }}
        customer={selectedCustomer}
        onSuspend={handleSuspendCustomer}
        onActivate={handleActivateCustomer}
      />

      {/* Suspend Customer Details Modal */}
      <SuspendCustomerModal
        visible={showSuspendDetailsModal}
        onClose={() => {
          setShowSuspendDetailsModal(false)
          setCustomerToSuspend(null)
        }}
        customer={customerToSuspend}
        onSuspend={handleSuspendCustomerSubmit}
        loading={false}
      />

      {/* Activate Confirmation Modal */}
      <Modal
        visible={showActivateModal}
        onClose={() => {
          setShowActivateModal(false)
          setCustomerToActivate(null)
        }}
        title="Activate Customer"
        onConfirm={confirmActivateCustomer}
        confirmText="Activate"
        cancelText="Cancel"
        type="success"
      >
        <p>Are you sure you want to activate the customer <strong>"{customerToActivate?.firstName} {customerToActivate?.lastName}"</strong>?</p>
        <p className="text-muted">The customer will be able to place orders again.</p>
      </Modal>
    </Container>
  )
}

export default CustomersList
