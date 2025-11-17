import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Card, Badge, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faInfoCircle, 
  faTag, 
  faLayerGroup, 
  faImage as faImageIcon,
  faEdit,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../../../services/productService'
import { categoryService } from '../../../../services/categoryService'

const ReviewStep = ({ formData, onCreateProduct, loading, productId, onEditStep }) => {
  const [attributes, setAttributes] = useState([])
  const [productData, setProductData] = useState(null)
  const [categories, setCategories] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    fetchAttributes()
    if (productId) {
      fetchFullProductDetails()
    }
    fetchCategories()
  }, [productId])

  const fetchAttributes = async () => {
    try {
      const response = await productService.getAttributes()
      if (response.success && response.data) {
        setAttributes(response.data)
      }
    } catch (error) {
      console.error('Error fetching attributes:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategoryOptions(true)
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFullProductDetails = async () => {
    try {
      setLoadingData(true)
      const response = await productService.getProductFullDetails(productId)
      if (response.success && response.data) {
        setProductData(response.data)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      setLoadingData(false)
    }
  }

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return '-'
    const category = categories.find(c => c.category_id === parseInt(categoryId))
    return category ? category.category_name : categoryId
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    return value
  }

  const formatAttributeName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getAttributeName = (attributeId) => {
    const attr = attributes.find(a => a.attribute_id === parseInt(attributeId))
    return attr ? formatAttributeName(attr.attribute_name) : `Attribute ${attributeId}`
  }

  const getAttributeType = (attributeId) => {
    const attr = attributes.find(a => a.attribute_id === parseInt(attributeId))
    return attr ? attr.attribute_type : null
  }

  const getDietaryAttributes = () => {
    // Use API data if available, otherwise use formData
    if (productData && productData.attributes) {
      return productData.attributes
        .filter(attr => {
          const attrDef = attributes.find(a => a.attribute_id === attr.attribute_id)
          return attrDef && (attrDef.attribute_type === 'boolean' || attrDef.attribute_type === 'bool') && 
                 (attr.custom_value === 'true' || attr.custom_value === true)
        })
        .map(attr => {
          const attrDef = attributes.find(a => a.attribute_id === attr.attribute_id)
          return formatAttributeName(attrDef ? attrDef.attribute_name : `Attribute ${attr.attribute_id}`)
        })
    }
    
    const attributeValues = formData.attributes.attributeValues || {}
    return Object.entries(attributeValues)
      .filter(([id, value]) => {
        const type = getAttributeType(id)
        return (type === 'boolean' || type === 'bool') && value === true
      })
      .map(([id]) => getAttributeName(id))
  }

  const getProductDetailAttributes = () => {
    // Use API data if available, otherwise use formData
    if (productData && productData.attributes) {
      return productData.attributes
        .filter(attr => {
          const attrDef = attributes.find(a => a.attribute_id === attr.attribute_id)
          return attrDef && (attrDef.attribute_type === 'text' || attrDef.attribute_type === 'textfield' || attrDef.attribute_type === 'date') &&
                 attr.custom_value && attr.custom_value !== '' && attr.custom_value !== null
        })
        .map(attr => {
          const attrDef = attributes.find(a => a.attribute_id === attr.attribute_id)
          return {
            id: attr.attribute_id,
            name: formatAttributeName(attrDef ? attrDef.attribute_name : `Attribute ${attr.attribute_id}`),
            value: attr.custom_value
          }
        })
    }
    
    const attributeValues = formData.attributes.attributeValues || {}
    return Object.entries(attributeValues)
      .filter(([id, value]) => {
        const type = getAttributeType(id)
        return (type === 'text' || type === 'textfield' || type === 'date') && value !== '' && value !== null && value !== undefined
      })
      .map(([id, value]) => ({
        id,
        name: getAttributeName(id),
        value: value
      }))
  }

  // Get variant images (variants now have images)
  const getVariantImages = (variant) => {
    if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
      return variant.images
    }
    return []
  }

  const getAllVariantImages = () => {
    const variants = (productData?.variants || formData.variants.productVariants || [])
    const gallery = []

    variants.forEach((variant) => {
      const variantImages = getVariantImages(variant)
      variantImages.forEach((url, index) => {
        gallery.push({
          variantName: variant.variant_name || variant.name || 'Variant',
          url,
          isPrimary: index === 0
        })
      })
    })

    return gallery
  }

  // Get display data - prefer API data, fallback to formData
  const getDisplayData = () => {
    if (productData) {
      const product = productData.product || productData
      return {
        name: product.product_name || formData.basicInfo.name,
        category: getCategoryName(product.category_id) || formData.basicInfo.category,
        profitMargin: product.margin || formData.basicInfo.profitMargin,
        description: product.full_description || product.short_description || formData.basicInfo.description,
        sku: product.sku || formData.basicInfo.sku,
        gstRate: product.gst || formData.basicInfo.gstRate,
        variants: productData.variants || formData.variants.productVariants
      }
    }
    return {
      name: formData.basicInfo.name,
      category: getCategoryName(formData.basicInfo.category) || formData.basicInfo.category,
      profitMargin: formData.basicInfo.profitMargin,
      description: formData.basicInfo.description,
      sku: formData.basicInfo.sku,
      gstRate: formData.basicInfo.gstRate,
      variants: formData.variants.productVariants
    }
  }

  if (loadingData) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin className="text-success fs-1 mb-3" />
        <p className="text-muted">Loading product details...</p>
      </div>
    )
  }

  const displayData = getDisplayData()
  const variantImageGallery = getAllVariantImages()

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
            <Button variant="outline-primary" size="sm" onClick={() => onEditStep?.(0)}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>Product Name:</strong> {formatValue(displayData.name)}
              </div>
              <div className="mb-2">
                <strong>Category:</strong> {formatValue(displayData.category)}
              </div>
              <div className="mb-2">
                <strong>Profit Margin:</strong> {displayData.profitMargin ? `${formatValue(displayData.profitMargin)}%` : '-'}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>Description:</strong> {formatValue(displayData.description)}
              </div>
              <div className="mb-2">
                <strong>SKU Code:</strong> {formatValue(displayData.sku)}
              </div>
              <div className="mb-2">
                <strong>GST Rate:</strong> {displayData.gstRate ? `${formatValue(displayData.gstRate)}%` : '-'}
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
            <Button variant="outline-primary" size="sm" onClick={() => onEditStep?.(1)}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>Dietary Information:</strong>
                <div className="mt-2">
                  {getDietaryAttributes().length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {getDietaryAttributes().map((name, idx) => (
                        <Badge key={idx} bg="success">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">None selected</span>
                  )}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>Product Details Information:</strong>
                <div className="mt-2">
                  {getProductDetailAttributes().length > 0 ? (
                    <div>
                      {getProductDetailAttributes().map((item, idx) => (
                        <div key={idx} className="mb-2">
                          <strong>{item.name}:</strong>{' '}
                          <span>{formatValue(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">No product details added</span>
                  )}
                </div>
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
            <Button variant="outline-primary" size="sm" onClick={() => onEditStep?.(2)}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>
          
          <div className="mb-3">
            <strong>Product Variants ({displayData.variants?.length || 0}):</strong>
          </div>
          
          {displayData.variants && displayData.variants.length > 0 ? (
            displayData.variants.map((variant, index) => {
              const variantImages = getVariantImages(variant)
              return (
                <div key={variant.variant_id || variant.id || index} className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{variant.variant_name || variant.name || `Variant ${index + 1}`}:</strong>
                    </div>
                    <Badge bg={variant.is_active !== false && variant.status !== 'inactive' ? 'success' : 'secondary'}>
                      {variant.is_active !== false && variant.status !== 'inactive' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Row className="mt-2">
                    <Col md={3}>
                      <small className="text-muted">SKU:</small>
                      <div>{formatValue(variant.sku)}</div>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">Base Price:</small>
                      <div>${formatValue(variant.base_price || variant.basePrice)}</div>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">Sale Price:</small>
                      <div>{variant.sale_price || variant.salePrice ? `$${formatValue(variant.sale_price || variant.salePrice)}` : '-'}</div>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">Stock:</small>
                      <div>{formatValue(variant.stock_quantity || variant.stock)}</div>
                    </Col>
                  </Row>
                  {/* Variant Images */}
                  {variantImages.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2">Variant Images ({variantImages.length}):</small>
                      <Row>
                        {variantImages.map((imageUrl, imgIndex) => (
                          <Col md={3} key={imgIndex} className="mb-2">
                            <Image 
                              src={imageUrl} 
                              fluid 
                              className="rounded border"
                              style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-muted">No variants added</div>
          )}

          {/* Bulk Pricing */}
          {productData?.bulk_pricing && productData.bulk_pricing.length > 0 && (
            <div className="mt-4">
              <strong>Bulk Pricing Rules:</strong>
              <div className="mt-2">
                {productData.bulk_pricing.map((bp, index) => (
                  <div key={bp.bulk_pricing_id || index} className="border rounded p-2 mb-2">
                    <small>
                      <strong>Quantity:</strong> {bp.minimum_quantity}
                      {bp.maximum_quantity ? ` - ${bp.maximum_quantity}` : '+'} | 
                      <strong> Type:</strong> {bp.discount_type === 'fixed' || bp.discount_type === 'fixed_amount' ? 'Fixed Price' : 'Percentage Discount'} | 
                      <strong> Value:</strong> {bp.discount_value}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>


      {/* Variant Images Gallery */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faImageIcon} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Variant Images Gallery</h5>
            </div>
            <Button variant="outline-primary" size="sm" onClick={() => onEditStep?.(2)}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </Button>
          </div>

          {variantImageGallery.length > 0 ? (
            <Row>
              {variantImageGallery.map((image, index) => (
                <Col lg={2} md={3} sm={4} xs={6} key={`${image.url}-${index}`} className="mb-3">
                  <div className="position-relative">
                    <Image
                      src={image.url}
                      fluid
                      className="rounded border"
                      style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                    />
                    {image.isPrimary && (
                      <Badge bg="primary" className="position-absolute top-0 end-0 m-1">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <small className="text-muted d-block text-truncate mt-1">
                    {image.variantName}
                  </small>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-muted">No variant images uploaded yet</div>
          )}
        </Card.Body>
      </Card>


      {/* Note: Submit button is handled by parent AddProductWizard component */}
    </div>
  )
}

export default ReviewStep
