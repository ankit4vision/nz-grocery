import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Modal, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWarehouse, 
  faSearch, 
  faHistory, 
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faRefresh,
  faPlusMinus
} from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import { useToast } from '../../components'
import inventoryService from '../../services/inventoryService'
import { categoryService } from '../../services/categoryService'
import StockAdjustmentForm from '../../components/pages/inventory/StockAdjustmentForm'
import InventoryHistoryModal from '../../components/pages/inventory/InventoryHistoryModal'

const InventoryManagement = () => {
  const { success, error: showError } = useToast()
  
  const [inventoryItems, setInventoryItems] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showStockAdjustmentModal, setShowStockAdjustmentModal] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  })
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false)
  const [bulkUpdateData, setBulkUpdateData] = useState({
    low_stock_quantity: ''
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // Load categories and initial data
  useEffect(() => {
    loadCategories()
    loadStats()
  }, [])

  // Reload inventory when filters or pagination changes
  useEffect(() => {
    loadInventoryData()
  }, [currentPage, pageSize, filters.category])

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategoryOptions(true)
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadInventoryData = async () => {
    try {
      setLoading(true)
      const result = await inventoryService.getInventoryItems(filters, {
        page: currentPage,
        pageSize: pageSize
      })
      if (result.success) {
        setInventoryItems(result.data || [])
        setTotalItems(result.total || 0)
      } else {
        showError(result.message || 'Failed to load inventory items')
      }
    } catch (error) {
      console.error('Error loading inventory data:', error)
      showError('Failed to load inventory items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const result = await inventoryService.getInventoryStats()
      if (result.success) {
        setStats(result.data || {})
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1) // Reset to first page on search
    loadInventoryData()
  }

  const handleReset = () => {
    setFilters({
      search: '',
      category: ''
    })
    setCurrentPage(1)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(inventoryItems.map(item => item.variant_id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (variantId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, variantId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== variantId))
    }
  }

  const handleViewHistory = (variant) => {
    setSelectedVariant(variant)
    setShowHistoryModal(true)
  }

  const handleStockAdjustment = (variant) => {
    setSelectedVariant(variant)
    setShowStockAdjustmentModal(true)
  }

  const handleStockAdjustmentSuccess = () => {
    setShowStockAdjustmentModal(false)
    setSelectedVariant(null)
    loadInventoryData()
    loadStats()
    success('Stock updated successfully!')
  }

  const handleBulkUpdate = async () => {
    if (selectedItems.length === 0) {
      showError('Please select at least one item')
      return
    }

    try {
      const updateData = {}
      if (bulkUpdateData.low_stock_quantity) {
        updateData.low_stock_quantity = parseInt(bulkUpdateData.low_stock_quantity)
      }

      if (Object.keys(updateData).length === 0) {
        showError('Please provide at least one field to update')
        return
      }

      const result = await inventoryService.bulkUpdateInventory(selectedItems, updateData)
      if (result.success) {
        success(result.message || 'Bulk update completed successfully')
        setShowBulkUpdateModal(false)
        setSelectedItems([])
        setBulkUpdateData({ low_stock_quantity: '' })
        loadInventoryData()
        loadStats()
      } else {
        showError(result.message || 'Failed to update inventory')
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
      showError('An error occurred while updating inventory')
    }
  }

  // Get stock status based on stock quantity and low stock threshold
  const getStockStatus = (stockQty, lowStockQty) => {
    if (stockQty === 0) return 'out_of_stock'
    if (stockQty <= lowStockQty) return 'low_stock'
    return 'in_stock'
  }

  const getStatusBadge = (stockQty, lowStockQty) => {
    const status = getStockStatus(stockQty, lowStockQty)
    switch (status) {
      case 'in_stock':
        return <Badge bg="success">In Stock</Badge>
      case 'low_stock':
        return <Badge bg="warning">Low Stock</Badge>
      case 'out_of_stock':
        return <Badge bg="danger">Out of Stock</Badge>
      default:
        return <Badge bg="secondary">Unknown</Badge>
    }
  }

  const getStockIndicator = (stockQty, lowStockQty) => {
    if (stockQty === 0) return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
    if (stockQty <= lowStockQty) return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />
    return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
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
          checked={selectedItems.includes(item.variant_id)}
          onChange={(e) => handleSelectItem(item.variant_id, e.target.checked)}
        />
      )
    },
    {
      key: 'product',
      header: 'Product / Variant',
      render: (_, item) => (
        <div className="d-flex align-items-center">
          <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <FontAwesomeIcon icon={faWarehouse} className="text-muted" />
          </div>
          <div>
            <div className="fw-semibold">{item.product_name || 'N/A'}</div>
            <small className="text-muted">{item.variant_name || 'Default Variant'}</small>
            {item.sku && (
              <div className="small text-muted">SKU: {item.sku}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (_, item) => (
        item.category_name ? (
          <Badge bg="success">{item.category_name}</Badge>
        ) : (
          <span className="text-muted">-</span>
        )
      )
    },
    {
      key: 'stock',
      header: 'Stock Quantity',
      render: (_, item) => {
        const stockQty = item.stock_quantity || 0
        const lowStockQty = item.low_stock_quantity || 0
        return (
          <div className="d-flex align-items-center">
            {getStockIndicator(stockQty, lowStockQty)}
            <span className="ms-2 fw-semibold">{stockQty}</span>
          </div>
        )
      }
    },
    {
      key: 'low_stock_quantity',
      header: 'Low Stock Threshold',
      render: (_, item) => (
        <span className="fw-semibold">{item.low_stock_quantity || 0}</span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      render: (_, item) => (
        <div>
          {item.discounted_sale_price ? (
            <>
              <div className="fw-semibold text-success">${item.discounted_sale_price.toFixed(2)}</div>
              {item.sale_price && item.sale_price !== item.discounted_sale_price && (
                <small className="text-muted text-decoration-line-through">${item.sale_price.toFixed(2)}</small>
              )}
            </>
          ) : item.sale_price ? (
            <div className="fw-semibold text-success">${item.sale_price.toFixed(2)}</div>
          ) : (
            <span className="text-muted">-</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Stock Status',
      render: (_, item) => {
        const stockQty = item.stock_quantity || 0
        const lowStockQty = item.low_stock_quantity || 0
        return getStatusBadge(stockQty, lowStockQty)
      }
    },
    {
      key: 'active_status',
      header: 'Active',
      render: (_, item) => (
        item.is_active ? (
          <Badge bg="success">Active</Badge>
        ) : (
          <Badge bg="secondary">Inactive</Badge>
        )
      )
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
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['product', 'category', 'stock', 'low_stock_quantity', 'price']

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
          </div>

          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-gradient-success text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div>
                      <h4 className="mb-0">{stats.totalProducts || 0}</h4>
                      <p className="mb-0">Total Variants</p>
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
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                <strong>{stats.lowStockItems} variants are running low on stock.</strong> Consider restocking to avoid stockouts.
              </div>
            </Alert>
          )}

          {stats.outOfStockItems > 0 && (
            <Alert variant="danger" className="mb-3">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                <strong>Out of Stock Alert:</strong> {stats.outOfStockItems} variants are currently out of stock.
              </div>
            </Alert>
          )}

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Search and Filter Section */}
            <div className="mb-4">
              <Row className="g-3">
                <Col md={4}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Product name or SKU</label>
                    <FormControl
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => {
                        setFilters({ ...filters, category: e.target.value })
                        setCurrentPage(1)
                      }}
                      className="border-2"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2}>
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
                      <span className="fw-semibold">{selectedItems.length} variant(s) selected</span>
                    </div>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="text-white"
                      onClick={() => setShowBulkUpdateModal(true)}
                    >
                      Bulk Update Low Stock Threshold
                    </Button>
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
                serverSidePagination={true}
                sortable={false}
                emptyMessage="No inventory items found"
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentForm
        show={showStockAdjustmentModal}
        onHide={() => {
          setShowStockAdjustmentModal(false)
          setSelectedVariant(null)
        }}
        variant={selectedVariant}
        onSuccess={handleStockAdjustmentSuccess}
      />

      {/* Inventory History Modal */}
      <InventoryHistoryModal
        show={showHistoryModal}
        onHide={() => {
          setShowHistoryModal(false)
          setSelectedVariant(null)
        }}
        variant={selectedVariant}
      />

      {/* Bulk Update Modal */}
      <Modal show={showBulkUpdateModal} onHide={() => setShowBulkUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bulk Update Low Stock Threshold</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" className="mb-3">
            <strong>{selectedItems.length} variant(s)</strong> will be updated with the new low stock threshold.
          </Alert>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Low Stock Threshold</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={bulkUpdateData.low_stock_quantity}
              onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, low_stock_quantity: e.target.value })}
              placeholder="Enter low stock threshold"
              className="border-2"
            />
            <Form.Text className="text-muted">
              Set the minimum stock quantity before a variant is considered low stock
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="success" className="text-white" onClick={handleBulkUpdate}>
            Update Selected Items
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default InventoryManagement
