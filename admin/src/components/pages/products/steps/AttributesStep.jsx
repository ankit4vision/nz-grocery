import React, { useState, useEffect } from 'react'
import { Row, Col, Form, FormControl, FormCheck } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../../../services/productService'

const AttributesStep = ({ data, onChange, errors, productId }) => {
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(true)
  const [attributeValues, setAttributeValues] = useState(data.attributeValues || {})

  // Fetch attributes from API on component mount
  useEffect(() => {
    fetchAttributes()
  }, [])

  // Load existing product attributes if in edit mode
  useEffect(() => {
    if (productId && attributes.length > 0) {
      loadProductAttributes()
    }
  }, [productId, attributes.length])

  // Update parent when attributeValues change
  useEffect(() => {
    onChange({ attributeValues })
  }, [attributeValues])

  const fetchAttributes = async () => {
    try {
      setLoading(true)
      const response = await productService.getAttributes()
      if (response.success && response.data) {
        setAttributes(response.data)
        // Initialize attribute values if not already set and not in edit mode
        if (Object.keys(attributeValues).length === 0 && !productId) {
          const initialValues = {}
          response.data.forEach(attr => {
            if (attr.attribute_type === 'bool') {
              initialValues[attr.attribute_id] = false
            } else {
              initialValues[attr.attribute_id] = ''
            }
          })
          setAttributeValues(initialValues)
        }
      }
    } catch (error) {
      console.error('Error fetching attributes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProductAttributes = async () => {
    try {
      const response = await productService.getProductAttributes(productId)
      if (response.success && response.data) {
        // Convert API response to attributeValues format
        const values = {}
        response.data.forEach(item => {
          values[item.attribute_id] = item.value
        })
        setAttributeValues(prev => ({ ...prev, ...values }))
      }
    } catch (error) {
      console.error('Error loading product attributes:', error)
    }
  }

  // Handle attribute value change
  const handleAttributeChange = (attributeId, value) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: value
    }))
  }

  // Get attributes by type
  const getAttributesByType = (type) => {
    return attributes.filter(attr => {
      if (type === 'bool') {
        return attr.attribute_type === 'bool'
      } else {
        return attr.attribute_type === 'textfield' || attr.attribute_type === 'date'
      }
    })
  }

  // Format attribute name (convert snake_case to Title Case)
  const formatAttributeName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin className="text-success fs-1 mb-3" />
        <p className="text-muted">Loading attributes...</p>
      </div>
    )
  }

  // Get dietary info attributes (bool type)
  const dietaryAttributes = getAttributesByType('bool')
  
  // Get product details attributes (textfield and date types)
  const productDetailAttributes = getAttributesByType('other')

  return (
    <Form>
      {/* Dietary Information Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
          <div>
            <h5 className="mb-0 fw-semibold text-success">Dietary Information</h5>
            <p className="text-muted mb-0 small">Dietary attributes (bool type)</p>
          </div>
        </div>

        {dietaryAttributes.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No dietary information attributes available.</p>
          </div>
        ) : (
          <Row>
            {dietaryAttributes.map((attr) => (
              <Col md={6} key={attr.attribute_id} className="mb-3">
                <FormCheck
                  id={`dietary-${attr.attribute_id}`}
                  type="checkbox"
                  label={
                    <span>
                      {formatAttributeName(attr.attribute_name)}
                      {attr.is_required && <span className="text-danger ms-1">*</span>}
                    </span>
                  }
                  checked={attributeValues[attr.attribute_id] || false}
                  onChange={(e) => handleAttributeChange(attr.attribute_id, e.target.checked)}
                  className={errors[`attribute_${attr.attribute_id}`] ? 'is-invalid' : ''}
                />
                {errors[`attribute_${attr.attribute_id}`] && (
                  <div className="text-danger small mt-1">
                    {errors[`attribute_${attr.attribute_id}`]}
                  </div>
                )}
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Product Details Information Section */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
          <div>
            <h5 className="mb-0 fw-semibold text-success">Product Details Information</h5>
            <p className="text-muted mb-0 small">Product detail attributes (text and date types)</p>
          </div>
        </div>

        {productDetailAttributes.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No product details attributes available.</p>
          </div>
        ) : (
          <Row>
            {productDetailAttributes.map((attr) => (
              <Col md={6} key={attr.attribute_id} className="mb-3">
                <Form.Group>
                  <Form.Label htmlFor={`attr-${attr.attribute_id}`} className="fw-semibold">
                    {formatAttributeName(attr.attribute_name)}
                    {attr.is_required && <span className="text-danger ms-1">*</span>}
                  </Form.Label>
                  {attr.attribute_type === 'textfield' ? (
                    <FormControl
                      id={`attr-${attr.attribute_id}`}
                      type="text"
                      value={attributeValues[attr.attribute_id] || ''}
                      onChange={(e) => handleAttributeChange(attr.attribute_id, e.target.value)}
                      className={`border-2 ${errors[`attribute_${attr.attribute_id}`] ? 'is-invalid' : ''}`}
                      placeholder={`Enter ${formatAttributeName(attr.attribute_name).toLowerCase()}`}
                      required={attr.is_required}
                    />
                  ) : (
                    <div className="position-relative">
                      <FormControl
                        id={`attr-${attr.attribute_id}`}
                        type="date"
                        value={attributeValues[attr.attribute_id] || ''}
                        onChange={(e) => handleAttributeChange(attr.attribute_id, e.target.value)}
                        className={`border-2 ${errors[`attribute_${attr.attribute_id}`] ? 'is-invalid' : ''}`}
                        required={attr.is_required}
                      />
                      <FontAwesomeIcon 
                        icon={faCalendarAlt} 
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  )}
                  {errors[`attribute_${attr.attribute_id}`] && (
                    <div className="text-danger small mt-1">
                      {errors[`attribute_${attr.attribute_id}`]}
                    </div>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Form>
  )
}

export default AttributesStep
