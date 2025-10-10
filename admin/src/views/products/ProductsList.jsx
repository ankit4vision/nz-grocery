import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Image, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faPencil, 
  faTrash, 
  faEye, 
  faSearch, 
  faRefresh, 
  faBox, 
  faImage,
  faStar,
  faShoppingCart,
  faBell,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { Table, FormModal, Modal } from '../../components'
import ProductForm from '../../components/pages/products/ProductForm'
import { productService } from '../../services/productService'
import productsData from '../../mock/products.json'

const ProductsList = () => {
  const navigate = useNavigate()
  
  // State management
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Data states
  const [productToDelete, setProductToDelete] = useState(null)
  
  // Stats state
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    averageRating: 0
  })
  
  // Form refs
  const addProductFormRef = useRef(null)

  // Load products
  useEffect(() => {
    loadProducts()
    loadStats()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // For now, use mock data. Replace with actual API call later
      // const response = await productService.getProducts()
      // if (response.success) {
      //   setProducts(response.data)
      // }
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // For now, calculate from mock data. Replace with actual API call later
      // const response = await productService.getProductStats()
      // if (response.success) {
      //   setStats(response.data)
      // }
      
      const totalProducts = productsData.length
      const activeProducts = productsData.filter(p => p.status === 'active').length
      const lowStockProducts = productsData.filter(p => p.stockStatus === 'low' || p.stockStatus === 'out').length
      const averageRating = productsData.reduce((sum, p) => sum + p.rating, 0) / totalProducts
      
      setStats({
        totalProducts,
        activeProducts,
        lowStockProducts,
        averageRating: Math.round(averageRating * 10) / 10
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    const matchesStatus = !statusFilter || product.status === statusFilter
    const matchesStock = !stockFilter || product.stockStatus === stockFilter
    return matchesSearch && matchesCategory && matchesStatus && matchesStock
  })

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category))]

  // Stock status color mapping
  const getStockStatusColor = (status) => {
    switch (status) {
      case 'high': return 'success'
      case 'medium': return 'warning'
      case 'low': return 'danger'
      case 'out': return 'secondary'
      default: return 'secondary'
    }
  }

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      case 'out_of_stock': return 'warning'
      default: return 'secondary'
    }
  }

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon key="half" icon={faStar} className="text-warning" style={{ opacity: 0.5 }} />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-muted" />
      )
    }

    return stars
  }

  // Table columns
  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value, product, index) => (
        <div className="d-flex align-items-center justify-content-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              rounded
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              className="border"
              loading="lazy"
            />
          ) : (
            <div 
              className="d-flex align-items-center justify-content-center border rounded"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#f8f9fa'
              }}
            >
              <FontAwesomeIcon icon={faImage} className="text-muted" />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'product',
      label: 'Product',
      render: (value, product, index) => (
        <div>
          <div className="fw-semibold text-dark">{product.name}</div>
          <small className="text-muted">{product.weight}</small>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value, product, index) => (
        <Badge bg="success" className="px-2 py-1">
          {product.category}
        </Badge>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (value, product, index) => (
        <div>
          <div className="fw-semibold text-success">${product.price}</div>
          {product.oldPrice && (
            <small className="text-muted text-decoration-line-through">${product.oldPrice}</small>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value, product, index) => (
        <div className="d-flex align-items-center">
          <div 
            className={`rounded-circle me-2`}
            style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: getStockStatusColor(product.stockStatus) === 'success' ? '#22c55e' :
                              getStockStatusColor(product.stockStatus) === 'warning' ? '#f59e0b' :
                              getStockStatusColor(product.stockStatus) === 'danger' ? '#ef4444' : '#6b7280'
            }}
          />
          <span className="fw-semibold">{product.stock} units</span>
        </div>
      )
    },
    {
      key: 'sales',
      label: 'Sales',
      render: (value, product, index) => (
        <Badge bg="info" className="px-2 py-1">
          {product.sales} sold
        </Badge>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value, product, index) => (
        <div className="d-flex align-items-center">
          <div className="me-2">
            {renderStarRating(product.rating)}
          </div>
          <span className="fw-semibold">({product.reviewCount})</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, product, index) => (
        <Badge bg={getStatusColor(product.status)} className="px-2 py-1">
          {product.status === 'active' ? 'Active' : 
           product.status === 'inactive' ? 'Inactive' : 
           product.status === 'out_of_stock' ? 'Out of Stock' : product.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, product, index) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewProduct(product)
            }}
            title="View Product"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEditModal(product)
            }}
            title="Edit Product"
          >
            <FontAwesomeIcon icon={faPencil} />
          </Button>
          {product.stockStatus === 'out' ? (
            <Button
              variant="outline-success"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleAddStock(product)
              }}
              title="Add Stock"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          ) : (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteProduct(product)
              }}
              title="Delete Product"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['name', 'category', 'price', 'stock', 'sales', 'rating', 'status']

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleAddProduct = () => {
    navigate('/add-product')
  }

  const handleOpenEditModal = (product) => {
    navigate(`/products/edit/${product.id}`)
  }

  const handleViewProduct = (product) => {
    navigate(`/products/${product.id}`)
  }

  const handleDeleteProduct = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleAddStock = (product) => {
    // TODO: Implement add stock functionality
    console.log('Add stock for product:', product.name)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export products')
  }

  const handleReset = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStatusFilter('')
    setStockFilter('')
    setCurrentPage(1)
  }

  const handleAddProductSubmit = async (formData) => {
    try {
      const response = await productService.createProduct(formData)
      if (response.success) {
        setShowAddModal(false)
        loadProducts()
        loadStats()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }


  const confirmDeleteProduct = async () => {
    try {
      const response = await productService.deleteProduct(productToDelete.id)
      if (response.success) {
        setShowDeleteModal(false)
        setProductToDelete(null)
        loadProducts()
        loadStats()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
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
              <div className="position-relative">
                <FontAwesomeIcon icon={faBell} className="text-muted fs-5" />
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{ fontSize: '0.6rem' }}>
                  3
                </Badge>
              </div>
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
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-primary text-white">
                        <FontAwesomeIcon icon={faBox} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Total Products</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.totalProducts}</div>
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
                        <FontAwesomeIcon icon={faBox} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Active Products</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.activeProducts}</div>
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
                        <FontAwesomeIcon icon={faBox} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Low Stock</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.lowStockProducts}</div>
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
                      <div className="p-3 rounded-3 bg-gradient-success text-white">
                        <FontAwesomeIcon icon={faStar} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Avg Rating</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.averageRating}</div>
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
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <FormSelect
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Stock Status</label>
                    <FormSelect
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Stock</option>
                      <option value="high">High Stock</option>
                      <option value="medium">Medium Stock</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={3}>
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

            {/* Products Table */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faBox} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Products List</h4>
                </div>
                <div className="text-muted">
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products
                </div>
              </div>
              
              <Table
                data={filteredProducts}
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
                totalItems={filteredProducts.length}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Add Product Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="xl"
        onConfirm={() => addProductFormRef.current?.handleSubmit()}
        confirmText="Create Product"
        cancelText="Cancel"
        loading={false}
      >
        <ProductForm
          ref={addProductFormRef}
          mode="create"
          onSubmit={handleAddProductSubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>



      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setProductToDelete(null)
        }}
        title="Delete Product"
        onConfirm={confirmDeleteProduct}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the product <strong>"{productToDelete?.name}"</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>
    </Container>
  )
}

export default ProductsList
