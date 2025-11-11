import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Alert, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faMinus, 
  faExclamationTriangle,
  faSave,
  faTimes,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import inventoryService from '../../../services/inventoryService'
import { useToast } from '../../../components'

const StockAdjustmentForm = ({ show, onHide, variant, onSuccess }) => {
  const { success, error: showError } = useToast()
  
  const [formData, setFormData] = useState({
    stock_addition: '',
    stock_reduction: '',
    low_stock_quantity: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (show && variant) {
      // Reset form when modal opens
      setFormData({
        stock_addition: '',
        stock_reduction: '',
        low_stock_quantity: variant.low_stock_quantity?.toString() || ''
      })
      setErrors({})
    }
  }, [show, variant])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const stockQty = variant?.stock_quantity || 0

    // At least one field must be provided
    if (!formData.stock_addition && !formData.stock_reduction && !formData.low_stock_quantity) {
      newErrors.submit = 'Please provide at least one field to update (stock addition, stock reduction, or low stock threshold)'
    }

    // Validate stock addition
    if (formData.stock_addition) {
      const addition = parseInt(formData.stock_addition)
      if (isNaN(addition) || addition < 0) {
        newErrors.stock_addition = 'Stock addition must be a valid positive number'
      }
    }

    // Validate stock reduction
    if (formData.stock_reduction) {
      const reduction = parseInt(formData.stock_reduction)
      if (isNaN(reduction) || reduction < 0) {
        newErrors.stock_reduction = 'Stock reduction must be a valid positive number'
      } else if (reduction > stockQty) {
        newErrors.stock_reduction = `Stock reduction cannot exceed current stock (${stockQty})`
      }
    }

    // Validate low stock quantity
    if (formData.low_stock_quantity) {
      const lowStock = parseInt(formData.low_stock_quantity)
      if (isNaN(lowStock) || lowStock < 0) {
        newErrors.low_stock_quantity = 'Low stock quantity must be a valid positive number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      const updateData = {}
      
      if (formData.stock_addition) {
        updateData.stock_addition = parseInt(formData.stock_addition)
      }
      
      if (formData.stock_reduction) {
        updateData.stock_reduction = parseInt(formData.stock_reduction)
      }
      
      if (formData.low_stock_quantity) {
        updateData.low_stock_quantity = parseInt(formData.low_stock_quantity)
      }

      const result = await inventoryService.updateStock(variant.variant_id, updateData)
      
      if (result.success) {
        success('Stock updated successfully!')
        onSuccess && onSuccess(result.data)
        onHide()
      } else {
        showError(result.message || 'Failed to update stock')
        setErrors({ submit: result.message || 'Failed to update stock' })
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      showError('An error occurred while updating stock')
      setErrors({ submit: 'An error occurred while updating stock' })
    } finally {
      setLoading(false)
    }
  }

  if (!variant) return null

  const stockQty = variant.stock_quantity || 0
  const lowStockQty = variant.low_stock_quantity || 0
  const stockAddition = formData.stock_addition ? parseInt(formData.stock_addition) : 0
  const stockReduction = formData.stock_reduction ? parseInt(formData.stock_reduction) : 0
  const newStockQty = stockQty + stockAddition - stockReduction
  const newLowStockQty = formData.low_stock_quantity ? parseInt(formData.low_stock_quantity) : lowStockQty

  return (
    <Modal show={show} onHide={onHide} size="lg" centered="true">
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faWarehouse} className="me-2 text-success" />
            Stock Adjustment - {variant.product_name} {variant.variant_name ? `(${variant.variant_name})` : ''}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Variant Summary */}
        <Card className="mb-4 bg-light">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <FontAwesomeIcon icon={faWarehouse} className="text-muted" size="2x" />
                  </div>
                  <div>
                    <h5 className="mb-1">{variant.product_name || 'N/A'}</h5>
                    <p className="mb-1 text-muted">Variant: {variant.variant_name || 'Default'}</p>
                    {variant.sku && (
                      <p className="mb-1 text-muted">SKU: {variant.sku}</p>
                    )}
                    {variant.category_name && (
                      <p className="mb-0 text-muted">Category: {variant.category_name}</p>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-end">
                  <div className="mb-2">
                    <strong>Current Stock:</strong> {stockQty} units
                  </div>
                  <div className="mb-2">
                    <strong>Low Stock Threshold:</strong> {lowStockQty} units
                  </div>
                  <div>
                    <strong>Variant ID:</strong> {variant.variant_id}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {errors.submit && (
          <Alert variant="danger" className="mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {errors.submit}
          </Alert>
        )}

        {/* Stock Update Form */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FontAwesomeIcon icon={faPlus} className="me-2 text-success" />
                  Stock Addition
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="stock_addition"
                  value={formData.stock_addition}
                  onChange={handleInputChange}
                  placeholder="Enter amount to add"
                  className="border-2"
                  isInvalid={!!errors.stock_addition}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stock_addition}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Amount to add to current stock
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FontAwesomeIcon icon={faMinus} className="me-2 text-danger" />
                  Stock Reduction
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max={stockQty}
                  name="stock_reduction"
                  value={formData.stock_reduction}
                  onChange={handleInputChange}
                  placeholder="Enter amount to reduce"
                  className="border-2"
                  isInvalid={!!errors.stock_reduction}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stock_reduction}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Amount to subtract from current stock (max: {stockQty})
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Low Stock Threshold</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="low_stock_quantity"
                  value={formData.low_stock_quantity}
                  onChange={handleInputChange}
                  placeholder="Enter low stock threshold"
                  className="border-2"
                  isInvalid={!!errors.low_stock_quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.low_stock_quantity}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Minimum stock quantity before variant is considered low stock
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Preview */}
          {(formData.stock_addition || formData.stock_reduction || formData.low_stock_quantity) && (
            <Card className="mb-4 bg-light">
              <Card.Body>
                <h6 className="mb-3">Update Preview</h6>
                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong>Current Stock:</strong> {stockQty} units
                    </div>
                    {formData.stock_addition && (
                      <div className="mb-2">
                        <strong>Addition:</strong> 
                        <span className="text-success"> +{stockAddition} units</span>
                      </div>
                    )}
                    {formData.stock_reduction && (
                      <div className="mb-2">
                        <strong>Reduction:</strong> 
                        <span className="text-danger"> -{stockReduction} units</span>
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>New Stock:</strong> 
                      <span className={
                        newStockQty === 0 ? 'text-danger' :
                        newStockQty <= newLowStockQty ? 'text-warning' : 'text-success'
                      }>
                        {newStockQty} units
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong>Current Low Stock Threshold:</strong> {lowStockQty} units
                    </div>
                    {formData.low_stock_quantity && (
                      <div className="mb-2">
                        <strong>New Low Stock Threshold:</strong> {newLowStockQty} units
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>New Status:</strong> 
                      <span className={
                        newStockQty === 0 ? 'text-danger' :
                        newStockQty <= newLowStockQty ? 'text-warning' : 'text-success'
                      }>
                        {newStockQty === 0 ? 'Out of Stock' :
                         newStockQty <= newLowStockQty ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Updating...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Update Stock
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default StockAdjustmentForm
