import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Image, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faPencil, 
  faSearch, 
  faRefresh, 
  faBox, 
  faImage,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import { useToast } from '../../components'

const ProductsList = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  
  // State management
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Categories for filter dropdown
  const [categories, setCategories] = useState([])
  
  // Stats state
  const [stats, setStats] = useState({
    totalVariants: 0,
    activeVariants: 0,
    lowStockVariants: 0
  })

  // Load variants and categories
  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadVariants()
  }, [currentPage, pageSize, searchTerm, categoryFilter])

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

  const loadVariants = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        page_size: pageSize
      }
      
      if (searchTerm) {
        params.product_name = searchTerm
      }
      if (categoryFilter) {
        params.category_id = parseInt(categoryFilter)
      }
      
      const response = await productService.getProductVariantsFilter(params)
      
      if (response.success && response.data) {
        setVariants(response.data.items || [])
        setTotalCount(response.data.total_count || 0)
        setTotalPages(response.data.total_pages || 0)
        
        // Calculate stats from current page data (or we could fetch separately)
        const activeCount = (response.data.items || []).filter(v => v.is_active).length
        const lowStockCount = (response.data.items || []).filter(v => 
          v.stock_quantity <= v.low_stock_quantity
        ).length
        
        setStats({
          totalVariants: response.data.total_count || 0,
          activeVariants: activeCount, // This is just for current page, would need separate API for accurate count
          lowStockVariants: lowStockCount // Same here
        })
      } else {
        showError(response.message || 'Failed to load product variants')
      }
    } catch (error) {
      console.error('Error loading variants:', error)
      showError('Failed to load product variants. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Stock status color mapping based on stock quantity
  const getStockStatusColor = (stockQuantity, lowStockQuantity) => {
    if (stockQuantity === 0) return 'secondary'
    if (stockQuantity <= lowStockQuantity) return 'danger'
    if (stockQuantity <= lowStockQuantity * 2) return 'warning'
    return 'success'
  }

  // Status color mapping
  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'secondary'
  }

  // Get stock status text
  const getStockStatusText = (stockQuantity, lowStockQuantity) => {
    if (stockQuantity === 0) return 'Out of Stock'
    if (stockQuantity <= lowStockQuantity) return 'Low Stock'
    if (stockQuantity <= lowStockQuantity * 2) return 'Medium Stock'
    return 'In Stock'
  }

  // Table columns
  const columns = [
    {
      key: 'product',
      label: 'Product / Variant',
      render: (value, variant, index) => (
        <div>
          <div className="fw-semibold text-dark">{variant.product_name}</div>
          <small className="text-muted">{variant.variant_name}</small>
          {variant.sku && (
            <div className="small text-muted">SKU: {variant.sku}</div>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value, variant, index) => (
        variant.category_name ? (
          <Badge bg="success" className="px-2 py-1">
            {variant.category_name}
          </Badge>
        ) : (
          <span className="text-muted">-</span>
        )
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (value, variant, index) => (
        <div>
          {variant.discounted_sale_price ? (
            <>
              <div className="fw-semibold text-success">${variant.discounted_sale_price.toFixed(2)}</div>
              {variant.sale_price && variant.sale_price !== variant.discounted_sale_price && (
                <small className="text-muted text-decoration-line-through">${variant.sale_price.toFixed(2)}</small>
              )}
              {variant.discount_percentage > 0 && (
                <Badge bg="danger" className="ms-1">{variant.discount_percentage}% off</Badge>
              )}
            </>
          ) : variant.sale_price ? (
            <div className="fw-semibold text-success">${variant.sale_price.toFixed(2)}</div>
          ) : (
            <span className="text-muted">-</span>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value, variant, index) => {
        const stockColor = getStockStatusColor(variant.stock_quantity, variant.low_stock_quantity)
        const stockText = getStockStatusText(variant.stock_quantity, variant.low_stock_quantity)
        return (
          <div className="d-flex align-items-center">
            <div 
              className="rounded-circle me-2"
              style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: stockColor === 'success' ? '#22c55e' :
                                stockColor === 'warning' ? '#f59e0b' :
                                stockColor === 'danger' ? '#ef4444' : '#6b7280'
              }}
            />
            <div>
              <span className="fw-semibold">{variant.stock_quantity} units</span>
              <div className="small text-muted">{stockText}</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'weight',
      label: 'Weight',
      render: (value, variant, index) => (
        variant.weight ? (
          <span>{variant.weight} kg</span>
        ) : (
          <span className="text-muted">-</span>
        )
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, variant, index) => (
        <Badge bg={getStatusColor(variant.is_active)} className="px-2 py-1">
          {variant.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, variant, index) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleEditProduct(variant)
            }}
            title="Edit Product"
          >
            <FontAwesomeIcon icon={faPencil} />
          </Button>
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['product', 'category', 'price', 'stock', 'status']

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleAddProduct = () => {
    navigate('/add-product')
  }

  const handleEditProduct = (variant) => {
    // Navigate to Product Wizard in edit mode using product_id (not variant_id)
    navigate(`/products/edit/${variant.product_id}`)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export variants')
  }

  const handleReset = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBox} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Product Management</h2>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Button variant="success" onClick={handleAddProduct} className="text-white">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Product
              </Button>
              <Button variant="primary" onClick={handleExport}>
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-5">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-primary text-white">
                        <FontAwesomeIcon icon={faBox} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Total Variants</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.totalVariants.toLocaleString()}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-info text-white">
                        <FontAwesomeIcon icon={faBox} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Active Variants</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.activeVariants}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-warning text-white">
                        <FontAwesomeIcon icon={faBox} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Low Stock</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.lowStockVariants}</div>
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
                    <label className="form-label fw-semibold">Search Products</label>
                    <FormControl
                      placeholder="Product name"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <FormSelect
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="border-2"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id || category.category_id} value={category.id || category.category_id}>
                          {category.name || category.category_name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                </Col>
                <Col md={5}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">&nbsp;</label>
                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={() => {}} className="text-white">
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

            {/* Product Variants Table */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faBox} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Product Variants List</h4>
                </div>
                <div className="text-muted">
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()} variants
                </div>
              </div>
              
              <Table
                data={variants}
                columns={columns}
                sortableColumns={sortableColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
                hover
                pagination={true}
                sortable={false}
                totalItems={totalCount}
              />
            </div>
          </div>
        </Col>
      </Row>

    </Container>
  )
}

export default ProductsList
