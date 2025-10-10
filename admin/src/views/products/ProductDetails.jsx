import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Badge, Card, Image, Table } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faEdit, 
  faTrash,
  faInfoCircle,
  faTag,
  faLayerGroup,
  faImage as faImageIcon,
  faCheckCircle,
  faStar,
  faCalendarAlt,
  faWeight,
  faRuler,
  faLeaf,
  faHeart,
  faDroplet,
  faBreadSlice,
  faShoppingCart,
  faChartLine,
  faEye,
  faDownload,
  faBox
} from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../services/productService'
import productsData from '../../mock/products.json'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load product data
  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      // For now, use mock data - replace with API call
      const foundProduct = productsData.find(p => p.id === parseInt(id))
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setError('Product not found')
      }
    } catch (error) {
      console.error('Error loading product:', error)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/products/edit/${id}`)
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete product:', product.name)
  }

  const handleBack = () => {
    navigate('/products')
  }

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      case 'out_of_stock': return 'danger'
      default: return 'secondary'
    }
  }

  const getStockStatusColor = (stockStatus) => {
    switch (stockStatus) {
      case 'in_stock': return 'success'
      case 'low_stock': return 'warning'
      case 'out': return 'danger'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading product details...</p>
        </div>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faInfoCircle} className="text-danger mb-3" style={{ fontSize: '3rem' }} />
          <h4 className="text-danger">Product Not Found</h4>
          <p className="text-muted">{error || 'The requested product could not be found.'}</p>
          <Button variant="success" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Products
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12}>
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="mb-1 text-dark">{product.name}</h2>
              <p className="text-muted mb-0">Product ID: #{product.id} • SKU: {product.sku || 'N/A'}</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={handleBack}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Products
              </Button>
              <Button 
                variant="outline-warning" 
                onClick={handleEdit}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit Product
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={handleDelete}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            <Row>
              {/* Left Column - Product Image */}
              <Col lg={4} className="mb-4">
                <div className="text-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      rounded
                      className="border"
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center border rounded mx-auto"
                      style={{ 
                        width: '300px', 
                        height: '300px', 
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <FontAwesomeIcon icon={faImageIcon} className="text-muted" style={{ fontSize: '4rem' }} />
                    </div>
                  )}
                  
                  {/* Product Status Badges */}
                  <div className="mt-3 d-flex justify-content-center gap-2">
                    <Badge bg={getStatusColor(product.status)} className="px-3 py-2">
                      {product.status === 'active' ? 'Active' : 
                       product.status === 'inactive' ? 'Inactive' : 
                       product.status === 'out_of_stock' ? 'Out of Stock' : product.status}
                    </Badge>
                    <Badge bg={getStockStatusColor(product.stockStatus)} className="px-3 py-2">
                      {product.stockStatus === 'in_stock' ? 'In Stock' :
                       product.stockStatus === 'low_stock' ? 'Low Stock' :
                       product.stockStatus === 'out' ? 'Out of Stock' : product.stockStatus}
                    </Badge>
                  </div>
                </div>
              </Col>

              {/* Right Column - Product Information */}
              <Col lg={8}>
                {/* Basic Information Section */}
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-3 text-success fs-4" />
                    <h4 className="mb-0 text-success">Basic Information</h4>
                  </div>
                  
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Product Name:</strong>
                        <p className="mb-0 fw-semibold">{product.name}</p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-muted">Category:</strong>
                        <p className="mb-0">
                          <Badge bg="success">{product.category}</Badge>
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-muted">Description:</strong>
                        <p className="mb-0">{product.description || 'No description available'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">SKU Code:</strong>
                        <p className="mb-0 fw-semibold">{product.sku || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-muted">Brand:</strong>
                        <p className="mb-0">{product.brand || 'N/A'}</p>
                      </div>
                      <div className="mb-3">
                        <strong className="text-muted">Created Date:</strong>
                        <p className="mb-0">{new Date(product.createdAt).toLocaleDateString()}</p>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Pricing & Stock Section */}
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                    <FontAwesomeIcon icon={faTag} className="me-3 text-success fs-4" />
                    <h4 className="mb-0 text-success">Pricing & Stock</h4>
                  </div>
                  
                  <Row>
                    <Col md={4}>
                      <Card className="bg-gradient-success text-white h-100">
                        <Card.Body className="text-center">
                          <FontAwesomeIcon icon={faShoppingCart} className="mb-2" style={{ fontSize: '2rem' }} />
                          <h5 className="mb-1">Current Price</h5>
                          <h3 className="mb-0">${product.price}</h3>
                          {product.oldPrice && (
                            <small className="text-light opacity-75">
                              <s>${product.oldPrice}</s>
                            </small>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="bg-gradient-info text-white h-100">
                        <Card.Body className="text-center">
                          <FontAwesomeIcon icon={faBox} className="mb-2" style={{ fontSize: '2rem' }} />
                          <h5 className="mb-1">Stock Level</h5>
                          <h3 className="mb-0">{product.stock}</h3>
                          <small className="text-light opacity-75">units available</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="bg-gradient-warning text-white h-100">
                        <Card.Body className="text-center">
                          <FontAwesomeIcon icon={faChartLine} className="mb-2" style={{ fontSize: '2rem' }} />
                          <h5 className="mb-1">Total Sales</h5>
                          <h3 className="mb-0">{product.sales}</h3>
                          <small className="text-light opacity-75">items sold</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* Rating & Reviews Section */}
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                    <FontAwesomeIcon icon={faStar} className="me-3 text-success fs-4" />
                    <h4 className="mb-0 text-success">Rating & Reviews</h4>
                  </div>
                  
                  <Row>
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3">
                          {renderStarRating(product.rating)}
                        </div>
                        <div>
                          <h5 className="mb-0">{product.rating}/5</h5>
                          <small className="text-muted">({product.reviewCount} reviews)</small>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-end">
                        <Button variant="outline-primary" size="sm">
                          <FontAwesomeIcon icon={faEye} className="me-2" />
                          View All Reviews
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Product Attributes Section */}
            <div className="mb-5">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={faLayerGroup} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Product Attributes</h4>
              </div>
              
              <Row>
                <Col md={6}>
                  <h6 className="fw-semibold mb-3">Dietary Information</h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {product.attributes?.dietaryInfo?.organic && (
                      <Badge bg="success" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faLeaf} className="me-1" />
                        Organic
                      </Badge>
                    )}
                    {product.attributes?.dietaryInfo?.glutenFree && (
                      <Badge bg="info" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faBreadSlice} className="me-1" />
                        Gluten-Free
                      </Badge>
                    )}
                    {product.attributes?.dietaryInfo?.vegan && (
                      <Badge bg="success" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faHeart} className="me-1" />
                        Vegan
                      </Badge>
                    )}
                    {product.attributes?.dietaryInfo?.dairyFree && (
                      <Badge bg="primary" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faDroplet} className="me-1" />
                        Dairy-Free
                      </Badge>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="fw-semibold mb-3">Product Details</h6>
                  <Row>
                    <Col xs={6}>
                      <div className="mb-2">
                        <small className="text-muted">Weight:</small>
                        <p className="mb-0 fw-semibold">
                          {product.attributes?.weight ? `${product.attributes.weight} kg` : 'N/A'}
                        </p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="mb-2">
                        <small className="text-muted">Dimensions:</small>
                        <p className="mb-0 fw-semibold">
                          {product.attributes?.dimensions || 'N/A'}
                        </p>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="mb-2">
                        <small className="text-muted">Expiry Date:</small>
                        <p className="mb-0 fw-semibold">
                          {product.attributes?.expiryDate ? 
                            new Date(product.attributes.expiryDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            {/* Nutritional Information Section */}
            {product.attributes?.nutritionalInfo && (
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Nutritional Information (per serving)</h4>
                </div>
                
                <Row>
                  <Col md={3}>
                    <Card className="text-center h-100">
                      <Card.Body>
                        <h5 className="text-primary mb-1">Calories</h5>
                        <h4 className="mb-0">{product.attributes.nutritionalInfo.calories || 'N/A'}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center h-100">
                      <Card.Body>
                        <h5 className="text-success mb-1">Protein</h5>
                        <h4 className="mb-0">{product.attributes.nutritionalInfo.protein || 'N/A'}g</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center h-100">
                      <Card.Body>
                        <h5 className="text-warning mb-1">Carbs</h5>
                        <h4 className="mb-0">{product.attributes.nutritionalInfo.carbs || 'N/A'}g</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center h-100">
                      <Card.Body>
                        <h5 className="text-danger mb-1">Fat</h5>
                        <h4 className="mb-0">{product.attributes.nutritionalInfo.fat || 'N/A'}g</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {/* Product Variants Section */}
            {product.variants?.productVariants && product.variants.productVariants.length > 0 && (
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Product Variants</h4>
                </div>
                
                <div className="table-responsive">
                  <Table className="border">
                    <thead className="table-light">
                      <tr>
                        <th>Variant Name</th>
                        <th>SKU</th>
                        <th>Base Price</th>
                        <th>Sale Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.productVariants.map((variant, index) => (
                        <tr key={variant.id || index}>
                          <td className="fw-semibold">{variant.name || 'N/A'}</td>
                          <td>{variant.sku || 'N/A'}</td>
                          <td>${variant.basePrice || '0.00'}</td>
                          <td>${variant.salePrice || '0.00'}</td>
                          <td>{variant.stock || '0'} units</td>
                          <td>
                            <Badge bg={variant.status === 'active' ? 'success' : 'secondary'}>
                              {variant.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* Bulk Pricing Section */}
            {product.variants?.bulkPricing && product.variants.bulkPricing.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                  <FontAwesomeIcon icon={faTag} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Bulk Pricing & Discounts</h4>
                </div>
                
                <div className="table-responsive">
                  <Table className="border">
                    <thead className="table-light">
                      <tr>
                        <th>Min Quantity</th>
                        <th>Max Quantity</th>
                        <th>Price Type</th>
                        <th>Price/Discount</th>
                        <th>Final Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.bulkPricing.map((bulkPrice, index) => (
                        <tr key={bulkPrice.id || index}>
                          <td>{bulkPrice.minQuantity || 'N/A'}</td>
                          <td>{bulkPrice.maxQuantity || 'N/A'}</td>
                          <td>
                            <Badge bg="info">
                              {bulkPrice.priceType === 'fixed' ? 'Fixed Price' : 'Percentage Discount'}
                            </Badge>
                          </td>
                          <td>${bulkPrice.price || '0.00'}</td>
                          <td className="fw-semibold text-success">Auto-calculated</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* Product Images Section */}
            {product.images?.uploadedImages && product.images.uploadedImages.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                  <FontAwesomeIcon icon={faImageIcon} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Product Images</h4>
                </div>
                
                <Row>
                  {product.images.uploadedImages.map((image, index) => (
                    <Col md={3} key={image.id || index} className="mb-3">
                      <Card className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={image.url} 
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        {index === product.images.primaryImageIndex && (
                          <Badge 
                            bg="primary" 
                            className="position-absolute top-0 end-0 m-2"
                          >
                            Primary
                          </Badge>
                        )}
                        <Card.Body className="p-2">
                          <small className="text-muted d-block text-truncate">
                            {image.name}
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ProductDetails
