import React from 'react'
import { Row, Col, Button, Card, Badge, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faInfoCircle, 
  faTag, 
  faLayerGroup, 
  faImage as faImageIcon,
  faEdit,
  faArrowLeft,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

const ReviewStep = ({ formData, onCreateProduct, loading }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    return value
  }

  const getDietaryInfo = () => {
    const dietary = formData.attributes.dietaryInfo
    const selected = Object.entries(dietary)
      .filter(([key, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
    
    return selected.length > 0 ? selected.join(', ') : 'None selected'
  }

  const getNutritionalInfo = () => {
    const nutrition = formData.attributes.nutritionalInfo
    return {
      calories: formatValue(nutrition.calories),
      protein: formatValue(nutrition.protein),
      carbs: formatValue(nutrition.carbs),
      fat: formatValue(nutrition.fat)
    }
  }

  const getPrimaryImage = () => {
    if (formData.images.uploadedImages.length > 0) {
      return formData.images.uploadedImages[formData.images.primaryImageIndex]
    }
    return null
  }

  return (
    <div>
      {/* Basic Information Section */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Basic Information</h5>
            </div>
            <Button variant="outline-primary" size="sm">
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>Product Name:</strong> {formatValue(formData.basicInfo.name)}
              </div>
              <div className="mb-2">
                <strong>Category:</strong> {formatValue(formData.basicInfo.category)}
              </div>
              <div className="mb-2">
                <strong>Profit Margin:</strong> {formatValue(formData.basicInfo.profitMargin)}%
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>Description:</strong> {formatValue(formData.basicInfo.description)}
              </div>
              <div className="mb-2">
                <strong>SKU Code:</strong> {formatValue(formData.basicInfo.sku)}
              </div>
              <div className="mb-2">
                <strong>GST Rate:</strong> {formatValue(formData.basicInfo.gstRate)}%
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Product Attributes Section */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faTag} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Product Attributes</h5>
            </div>
            <Button variant="outline-primary" size="sm">
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>Dietary Information:</strong> {getDietaryInfo()}
              </div>
              <div className="mb-2">
                <strong>Weight:</strong> {formatValue(formData.attributes.weight)} kg
              </div>
              <div className="mb-2">
                <strong>Dimensions:</strong> {formatValue(formData.attributes.dimensions)}
              </div>
              <div className="mb-2">
                <strong>Expiry Date:</strong> {formatValue(formData.attributes.expiryDate)}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>Nutritional Information:</strong>
              </div>
              <div className="ms-3">
                <div className="mb-1">Calories: {getNutritionalInfo().calories}</div>
                <div className="mb-1">Protein: {getNutritionalInfo().protein}g</div>
                <div className="mb-1">Carbs: {getNutritionalInfo().carbs}g</div>
                <div className="mb-1">Fat: {getNutritionalInfo().fat}g</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Pricing & Variants Section */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faLayerGroup} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Pricing & Variants</h5>
            </div>
            <Button variant="outline-primary" size="sm">
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <div className="mb-3">
            <strong>Product Variants:</strong>
          </div>
          
          {formData.variants.productVariants.map((variant, index) => (
            <div key={index} className="border rounded p-3 mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Variant {index + 1}:</strong>
                </div>
                <Badge bg={variant.status === 'active' ? 'success' : 'secondary'}>
                  {variant.status}
                </Badge>
              </div>
              <Row className="mt-2">
                <Col md={3}>
                  <small className="text-muted">SKU:</small>
                  <div>{formatValue(variant.sku)}</div>
                </Col>
                <Col md={3}>
                  <small className="text-muted">Base:</small>
                  <div>${formatValue(variant.basePrice)}</div>
                </Col>
                <Col md={3}>
                  <small className="text-muted">Sale:</small>
                  <div>${formatValue(variant.salePrice)}</div>
                </Col>
                <Col md={3}>
                  <small className="text-muted">Stock:</small>
                  <div>{formatValue(variant.stock)}</div>
                </Col>
              </Row>
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* Product Images Section */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faImageIcon} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Product Images</h5>
            </div>
            <Button variant="outline-primary" size="sm">
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <div className="mb-3">
            <strong>Uploaded Images ({formData.images.uploadedImages.length}/4):</strong>
          </div>
          
          {formData.images.uploadedImages.length > 0 ? (
            <Row>
              {formData.images.uploadedImages.map((image, index) => (
                <Col md={3} key={image.id} className="mb-3">
                  <div className="position-relative">
                    <Image 
                      src={image.url} 
                      fluid 
                      className="rounded border"
                      style={{ height: '100px', objectFit: 'cover' }}
                    />
                    {index === formData.images.primaryImageIndex && (
                      <Badge 
                        bg="primary" 
                        className="position-absolute top-0 end-0 m-1"
                      >
                        Primary
                      </Badge>
                    )}
                    <div className="mt-1">
                      <small className="text-muted text-truncate d-block">
                        {image.name}
                      </small>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-muted">No images uploaded</div>
          )}
        </Card.Body>
      </Card>

      {/* Call to Action */}
      <Card className="mb-4 bg-light">
        <Card.Body className="text-center">
          <h5 className="mb-2">Ready to create your product?</h5>
          <p className="text-muted mb-3">
            Review all information above and click "Create Product" to add it to your store.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-secondary">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Images
            </Button>
            <Button 
              variant="success" 
              onClick={onCreateProduct}
              disabled={loading}
              className="d-flex align-items-center text-white"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              Create Product
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ReviewStep
