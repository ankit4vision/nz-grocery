import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Modal, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWarehouse, 
  faBell, 
  faUpload, 
  faDownload, 
  faSearch, 
  faHistory, 
  faEdit, 
  faEye,
  faExclamationTriangle,
  faCalendarTimes,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faList,
  faRefresh,
  faFileExcel,
  faKeyboard,
  faPlusMinus
} from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import inventoryService from '../../services/inventoryService'
import InventoryHistoryModal from '../../components/pages/inventory/InventoryHistoryModal'

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    status: 'All Status',
    dietaryInfo: 'All Items'
  })
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false)
  const [bulkUpdateData, setBulkUpdateData] = useState({
    lowStockAlert: '',
    status: ''
  })
  
  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // Load inventory data
  useEffect(() => {
    loadInventoryData()
    loadStats()
  }, [filters])

  const loadInventoryData = async () => {
    try {
      setLoading(true)
      const result = await inventoryService.getInventoryItems(filters)
      if (result.success) {
        setInventoryItems(result.data)
        setTotalItems(result.total)
      }
    } catch (error) {
      console.error('Error loading inventory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const result = await inventoryService.getInventoryStats()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSearch = () => {
    loadInventoryData()
  }

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      status: 'All Status',
      dietaryInfo: 'All Items'
    })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(inventoryItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const handleViewHistory = (product) => {
    setSelectedProduct(product)
    setShowHistoryModal(true)
  }

  const handleStockAdjustment = (product) => {
    alert(`Stock adjustment functionality would be implemented here for ${product.productName}`)
  }

  const handleBulkUpdate = async () => {
    try {
      const updateData = {}
      if (bulkUpdateData.lowStockAlert) {
        updateData.lowStockAlert = parseInt(bulkUpdateData.lowStockAlert)
      }
      if (bulkUpdateData.status) {
        updateData.status = bulkUpdateData.status
        updateData.stockStatus = bulkUpdateData.status === 'in_stock' ? 'In Stock' : 
                                bulkUpdateData.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'
      }

      const result = await inventoryService.bulkUpdateInventory(selectedItems, updateData)
      if (result.success) {
        setShowBulkUpdateModal(false)
        setSelectedItems([])
        setBulkUpdateData({ lowStockAlert: '', status: '' })
        loadInventoryData()
        loadStats()
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  const handleExportInventory = async () => {
    try {
      const result = await inventoryService.exportInventory(filters)
      if (result.success) {
        // Simulate download
        const csvContent = result.data.map(row => Object.values(row).join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting inventory:', error)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_stock':
        return <Badge bg="success">In Stock</Badge>
      case 'low_stock':
        return <Badge bg="warning">Low Stock</Badge>
      case 'out_of_stock':
        return <Badge bg="danger">Out of Stock</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  const getStockIndicator = (currentStock, lowStockAlert) => {
    if (currentStock === 0) return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
    if (currentStock <= lowStockAlert) return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />
    return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
  }

  const getExpiryStatus = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-danger'
    if (diffDays <= 7) return 'text-warning'
    return 'text-success'
  }

  // Column definitions for the custom Table component
  const columns = [
    {
      key: 'select',
      header: (
        <Form.Check
          type="checkbox"
          checked={selectedItems.length === inventoryItems.length && inventoryItems.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      render: (_, item) => (
        <Form.Check
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
        />
      )
    },
    {
      key: 'product',
      header: 'Product',
      render: (_, item) => (
        <div className="d-flex align-items-center">
          {item.productImage ? (
            <img
              src={item.productImage}
              alt={item.productName}
              className="rounded me-3"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          ) : (
            <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <FontAwesomeIcon icon={faWarehouse} className="text-muted" />
            </div>
          )}
          <div>
            <div className="fw-semibold">{item.productName}</div>
            <small className="text-muted">{item.dietaryInfo}</small>
          </div>
        </div>
      )
    },
    {
      key: 'sku',
      header: 'SKU',
      render: (sku) => <code>{sku}</code>
    },
    {
      key: 'category',
      header: 'Category',
      render: (category) => <Badge bg="success">{category}</Badge>
    },
    {
      key: 'currentStock',
      header: 'Current Stock',
      render: (stock, item) => (
        <div className="d-flex align-items-center">
          {getStockIndicator(stock, item.lowStockAlert)}
          <span className="ms-2 fw-semibold">{stock}</span>
        </div>
      )
    },
    {
      key: 'reserved',
      header: 'Reserved'
    },
    {
      key: 'available',
      header: 'Available',
      render: (available, item) => (
        <span className={available <= item.lowStockAlert ? 'text-warning' : 'text-success'}>
          {available}
        </span>
      )
    },
    {
      key: 'lowStockAlert',
      header: 'Low Stock Alert',
      render: (alert) => <span className="fw-semibold">{alert}</span>
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      render: (date) => (
        <span className={getExpiryStatus(date)}>
          {new Date(date).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, item) => (
        <div className="d-flex gap-1">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewHistory(item)}
            title="View History"
          >
            <FontAwesomeIcon icon={faHistory} />
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleStockAdjustment(item)}
            title="Stock Adjustment"
          >
            <FontAwesomeIcon icon={faPlusMinus} />
          </Button>
          <Button
            variant="outline-info"
            size="sm"
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['sku', 'category', 'currentStock', 'reserved', 'available', 'lowStockAlert', 'expiryDate']

  if (loading) {
    return (
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <FontAwesomeIcon icon={faWarehouse} className="me-3 text-success fs-4" />
            <h2 className="mb-0 text-dark">Inventory Management</h2>
            <div className="ms-auto">
              <Button variant="success" className="me-2 text-white" onClick={() => setShowBulkUpdateModal(true)}>
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Bulk Update
              </Button>
              <Button variant="primary" onClick={handleExportInventory}>
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export Inventory
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-gradient-success text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div>
                      <h4 className="mb-0">{stats.totalProducts || 0}</h4>
                      <p className="mb-0">Total Products</p>
                    </div>
                    <div className="ms-auto">
                      <FontAwesomeIcon icon={faWarehouse} size="2x" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-info text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div>
                      <h4 className="mb-0">{stats.totalStock || 0}</h4>
                      <p className="mb-0">Total Stock Units</p>
                    </div>
                    <div className="ms-auto">
                      <FontAwesomeIcon icon={faCheckCircle} size="2x" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-warning text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div>
                      <h4 className="mb-0">{stats.lowStockItems || 0}</h4>
                      <p className="mb-0">Low Stock Items</p>
                    </div>
                    <div className="ms-auto">
                      <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-white" style={{ background: 'var(--gradient-danger)' }}>
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div>
                      <h4 className="mb-0">{stats.outOfStockItems || 0}</h4>
                      <p className="mb-0">Out of Stock</p>
                    </div>
                    <div className="ms-auto">
                      <FontAwesomeIcon icon={faTimesCircle} size="2x" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Alert Banners */}
          {stats.lowStockItems > 0 && (
            <Alert variant="warning" className="mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  <strong>{stats.lowStockItems} products are running low on stock.</strong> Consider restocking to avoid stockouts.
                </div>
                <Button variant="warning" size="sm">View Low Stock Items</Button>
              </div>
            </Alert>
          )}

          {stats.expiringItems > 0 && (
            <Alert variant="danger" className="mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <FontAwesomeIcon icon={faCalendarTimes} className="me-2" />
                  <strong>Expiry Warning:</strong> {stats.expiringItems} products are approaching their expiry dates within the next 7 days.
                </div>
                <Button variant="danger" size="sm">View Expiring Items</Button>
              </div>
            </Alert>
          )}

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Search and Filter Section */}
            <div className="mb-4">
              <Row className="g-3">
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Product name or SKU</label>
                    <FormControl
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="border-2"
                    >
                      <option>All Categories</option>
                      <option>Fruits</option>
                      <option>Vegetables</option>
                      <option>Dairy & Eggs</option>
                      <option>Meat & Seafood</option>
                      <option>Pantry Essentials</option>
                      <option>Beverages</option>
                      <option>Frozen Foods</option>
                      <option>Organic</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Stock Status</label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="border-2"
                    >
                      <option>All Status</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Dietary Info</label>
                    <Form.Select
                      value={filters.dietaryInfo}
                      onChange={(e) => setFilters({ ...filters, dietaryInfo: e.target.value })}
                      className="border-2"
                    >
                      <option>All Items</option>
                      <option>Organic</option>
                      <option>Fresh</option>
                      <option>Free Range</option>
                      <option>Frozen</option>
                    </Form.Select>
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

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mb-4 p-3 bg-light rounded-3">
                <Row className="align-items-center">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.length === inventoryItems.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="me-3"
                      />
                      <span className="fw-semibold">Select All Products</span>
                    </div>
                  </Col>
                  <Col md={3}>
                    <Form.Select className="border-2">
                      <option>Bulk Actions</option>
                      <option>Update Low Stock Alert</option>
                      <option>Change Status</option>
                      <option>Export Selected</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button variant="success" size="sm" className="text-white">Apply to Selected</Button>
                      <span className="text-muted">{selectedItems.length} products selected</span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* Inventory Overview Table */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faWarehouse} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Inventory Overview</h4>
                </div>
              </div>
              
              <Table
                data={inventoryItems}
                columns={columns}
                sortableColumns={sortableColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                loading={loading}
                hover
                pagination={true}
                sortable={true}
                emptyMessage="No inventory items found"
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Inventory History Modal */}
      <InventoryHistoryModal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        product={selectedProduct}
      />

      {/* Bulk Update Modal */}
      <Modal show={showBulkUpdateModal} onHide={() => setShowBulkUpdateModal(false)} size="lg" centered="true">
        <Modal.Header closeButton>
          <Modal.Title>Bulk Inventory Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Left Section - Import from Excel/CSV */}
            <Col md={6}>
              <div className="border border-2 border-dashed rounded-3 p-4 text-center h-100">
                <div className="mb-3">
                  <FontAwesomeIcon icon={faFileExcel} className="text-success" size="3x" />
                </div>
                <h5 className="mb-3">Import from Excel/CSV</h5>
                <p className="text-muted mb-4">Upload your inventory data file</p>
                
                <div className="mb-3">
                  <FormControl
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="border-2"
                    onChange={(e) => {
                      // Handle file upload
                      console.log('File selected:', e.target.files[0])
                    }}
                  />
                </div>
                
                <Button variant="link" className="text-primary p-0">
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  Download Template
                </Button>
              </div>
            </Col>

            {/* Right Section - Manual Bulk Update */}
            <Col md={6}>
              <div className="border border-2 border-dashed rounded-3 p-4 text-center h-100">
                <div className="mb-3">
                  <FontAwesomeIcon icon={faKeyboard} className="text-primary" size="3x" />
                </div>
                <h5 className="mb-3">Manual Bulk Update</h5>
                <p className="text-muted mb-4">Update multiple products at once</p>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary" 
                    className="border-2"
                    onClick={() => {
                      // Handle stock levels update
                      console.log('Update Stock Levels')
                    }}
                  >
                    Update Stock Levels
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="border-2"
                    onClick={() => {
                      // Handle prices update
                      console.log('Update Prices')
                    }}
                  >
                    Update Prices
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="border-2"
                    onClick={() => {
                      // Handle categories update
                      console.log('Update Categories')
                    }}
                  >
                    Update Categories
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="success" className="text-white">
            Process Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default InventoryManagement
