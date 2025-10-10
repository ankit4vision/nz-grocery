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

const StockAdjustmentForm = ({ show, onHide, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'stock_adjustment',
    change: '',
    description: '',
    reason: '',
    reference: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (show && product) {
      // Reset form when modal opens
      setFormData({
        type: 'stock_adjustment',
        change: '',
        description: '',
        reason: '',
        reference: ''
      })
      setErrors({})
    }
  }, [show, product])

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

    if (!formData.change || formData.change === '0') {
      newErrors.change = 'Change amount is required and cannot be zero'
    } else if (isNaN(formData.change)) {
      newErrors.change = 'Change amount must be a valid number'
    } else if (parseInt(formData.change) > 0 && parseInt(formData.change) > product.currentStock) {
      newErrors.change = 'Increase amount cannot exceed current stock for adjustments'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required'
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
      
      const historyEntry = {
        type: formData.type,
        change: parseInt(formData.change),
        description: formData.description,
        reason: formData.reason,
        reference: formData.reference || `ADJ-${Date.now()}`,
        user: 'Admin User' // This would come from auth context
      }

      const result = await inventoryService.addInventoryHistory(product.id, historyEntry)
      
      if (result.success) {
        onSuccess && onSuccess(result.data)
        onHide()
      } else {
        setErrors({ submit: result.error || 'Failed to update inventory' })
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
      setErrors({ submit: 'An error occurred while updating inventory' })
    } finally {
      setLoading(false)
    }
  }

  const getAdjustmentTypeOptions = () => [
    { value: 'stock_adjustment', label: 'Stock Adjustment', icon: faExclamationTriangle, color: 'warning' },
    { value: 'stock_increase', label: 'Stock Increase', icon: faPlus, color: 'success' },
    { value: 'damage_removal', label: 'Damage Removal', icon: faMinus, color: 'danger' },
    { value: 'expiry_removal', label: 'Expiry Removal', icon: faTimes, color: 'danger' }
  ]

  const getReasonOptions = () => [
    'Damaged goods',
    'Expired products',
    'Theft/Loss',
    'Quality control',
    'Supplier return',
    'Inventory correction',
    'Other'
  ]

  if (!product) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered="true">
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faWarehouse} className="me-2 text-success" />
            Stock Adjustment - {product.productName}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Product Summary */}
        <Card className="mb-4 bg-light">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="d-flex align-items-center">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-white rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      <FontAwesomeIcon icon={faWarehouse} className="text-muted" size="2x" />
                    </div>
                  )}
                  <div>
                    <h5 className="mb-1">{product.productName}</h5>
                    <p className="mb-1 text-muted">SKU: {product.sku}</p>
                    <p className="mb-0 text-muted">Category: {product.category}</p>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-end">
                  <div className="mb-2">
                    <strong>Current Stock:</strong> {product.currentStock} units
                  </div>
                  <div className="mb-2">
                    <strong>Available:</strong> {product.available} units
                  </div>
                  <div>
                    <strong>Low Stock Alert:</strong> {product.lowStockAlert} units
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

        {/* Adjustment Form */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Adjustment Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="border-2"
                  isInvalid={!!errors.type}
                >
                  {getAdjustmentTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Change Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="change"
                  value={formData.change}
                  onChange={handleInputChange}
                  placeholder="Enter amount (use negative for decrease)"
                  className="border-2"
                  isInvalid={!!errors.change}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.change}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Use positive numbers to increase stock, negative to decrease
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reason</Form.Label>
                <Form.Select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="border-2"
                  isInvalid={!!errors.reason}
                >
                  <option value="">Select reason</option>
                  {getReasonOptions().map(reason => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.reason}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reference Number</Form.Label>
                <Form.Control
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  placeholder="Optional reference number"
                  className="border-2"
                />
                <Form.Text className="text-muted">
                  Optional reference for tracking purposes
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed description of the adjustment"
              className="border-2"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Provide a clear description of why this adjustment is being made
            </Form.Text>
          </Form.Group>

          {/* Preview */}
          {formData.change && (
            <Card className="mb-4 bg-light">
              <Card.Body>
                <h6 className="mb-3">Adjustment Preview</h6>
                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong>Current Stock:</strong> {product.currentStock} units
                    </div>
                    <div className="mb-2">
                      <strong>Change:</strong> 
                      <span className={parseInt(formData.change) > 0 ? 'text-success' : 'text-danger'}>
                        {parseInt(formData.change) > 0 ? ' +' : ' '}{formData.change} units
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong>New Stock:</strong> 
                      <span className={
                        (product.currentStock + parseInt(formData.change)) <= product.lowStockAlert ? 'text-warning' : 'text-success'
                      }>
                        {product.currentStock + parseInt(formData.change)} units
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>New Status:</strong> 
                      <span className={
                        (product.currentStock + parseInt(formData.change)) === 0 ? 'text-danger' :
                        (product.currentStock + parseInt(formData.change)) <= product.lowStockAlert ? 'text-warning' : 'text-success'
                      }>
                        {(product.currentStock + parseInt(formData.change)) === 0 ? 'Out of Stock' :
                         (product.currentStock + parseInt(formData.change)) <= product.lowStockAlert ? 'Low Stock' : 'In Stock'}
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
