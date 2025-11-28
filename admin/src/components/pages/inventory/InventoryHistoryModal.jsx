import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faPlus, 
  faMinus, 
  faExclamationTriangle,
  faClock,
  faUser,
  faFileAlt,
  faRefresh
} from '@fortawesome/free-solid-svg-icons'
import inventoryService from '../../../services/inventoryService'

const InventoryHistoryModal = ({ show, onHide, variant }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (show && variant) {
      loadHistory()
    } else {
      // Reset state when modal closes
      setHistory([])
      setError(null)
    }
  }, [show, variant])

  const loadHistory = async () => {
    if (!variant) return
    
    try {
      setLoading(true)
      setError(null)
      const result = await inventoryService.getInventoryHistory(variant.variant_id)
      if (result.success) {
        setHistory(result.data || [])
      } else {
        setError(result.message || 'Failed to load inventory history')
      }
    } catch (error) {
      console.error('Error loading inventory history:', error)
      setError('An error occurred while loading inventory history')
    } finally {
      setLoading(false)
    }
  }

  // Map API change_type to display format
  const getHistoryTypeIcon = (changeType) => {
    // API returns change_type as string (e.g., 'stock_addition', 'stock_reduction', 'order_fulfillment', etc.)
    const type = changeType?.toLowerCase() || ''
    
    if (type.includes('addition') || type.includes('increase') || type.includes('add')) {
      return <FontAwesomeIcon icon={faPlus} className="text-success" />
    } else if (type.includes('reduction') || type.includes('decrease') || type.includes('reduce') || type.includes('fulfillment')) {
      return <FontAwesomeIcon icon={faMinus} className="text-danger" />
    } else if (type.includes('adjustment') || type.includes('adjust')) {
      return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />
    } else {
      return <FontAwesomeIcon icon={faFileAlt} className="text-info" />
    }
  }

  const getHistoryTypeColor = (changeType) => {
    const type = changeType?.toLowerCase() || ''
    
    if (type.includes('addition') || type.includes('increase') || type.includes('add')) {
      return 'success'
    } else if (type.includes('reduction') || type.includes('decrease') || type.includes('reduce') || type.includes('fulfillment')) {
      return 'danger'
    } else if (type.includes('adjustment') || type.includes('adjust')) {
      return 'warning'
    } else {
      return 'info'
    }
  }

  const getHistoryTypeLabel = (changeType) => {
    const type = changeType?.toLowerCase() || ''
    
    if (type.includes('addition') || type.includes('increase') || type.includes('add')) {
      return 'Stock Addition'
    } else if (type.includes('reduction') || type.includes('decrease') || type.includes('reduce')) {
      return 'Stock Reduction'
    } else if (type.includes('fulfillment')) {
      return 'Order Fulfillment'
    } else if (type.includes('adjustment') || type.includes('adjust')) {
      return 'Stock Adjustment'
    } else {
      // Return formatted change type (e.g., 'stock_addition' -> 'Stock Addition')
      return changeType
        ? changeType
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'Other'
    }
  }

  const formatChange = (quantityChange) => {
    // quantity_change can be positive or negative
    return quantityChange > 0 ? `+${quantityChange}` : `${quantityChange}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      return dateString
    }
  }

  // Get user display name (created_by is user ID, we'll show it as is or fetch user name if needed)
  const getUserDisplay = (createdBy) => {
    if (!createdBy) return 'System'
    // For now, show user ID. In future, we can fetch user name from user service
    return `User #${createdBy}`
  }


  if (!variant) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered="true">
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faClock} className="me-2 text-success" />
            Inventory History - {variant.product_name} {variant.variant_name ? `(${variant.variant_name})` : ''}
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
                  <div className="bg-white rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <FontAwesomeIcon icon={faFileAlt} className="text-muted" size="2x" />
                  </div>
                  <div>
                    <h5 className="mb-1">{variant.product_name || 'N/A'}</h5>
                    <p className="mb-1 text-muted">Variant: {variant.variant_name || 'Default'}</p>
                    {variant.sku && (
                      <p className="mb-1 text-muted">SKU: {variant.sku}</p>
                    )}
                    {variant.category_name && (
                      <Badge bg="success">{variant.category_name}</Badge>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-end">
                  <div className="mb-2">
                    <strong>Current Stock:</strong> {variant.stock_quantity || 0} units
                  </div>
                  <div className="mb-2">
                    <strong>Low Stock Threshold:</strong> {variant.low_stock_quantity || 0} units
                  </div>
                  <div>
                    <strong>Variant ID:</strong> {variant.variant_id}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* History Timeline */}
        <div className="position-relative">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" size="3x" />
              <h5 className="text-danger">Error Loading History</h5>
              <p className="text-muted">{error}</p>
              <Button variant="outline-primary" size="sm" onClick={loadHistory} className="mt-2">
                <FontAwesomeIcon icon={faRefresh} className="me-2" />
                Retry
              </Button>
            </div>
          ) : history.length > 0 ? (
            history.map((item, index) => (
              <div key={item.stock_history_id || index} className="mb-3">
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center flex-grow-1">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '32px', 
                            height: '32px',
                            backgroundColor: `var(--bs-${getHistoryTypeColor(item.change_type)})`,
                            color: 'white'
                          }}
                        >
                          {getHistoryTypeIcon(item.change_type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <Badge bg={getHistoryTypeColor(item.change_type)} className="me-2">
                              {getHistoryTypeLabel(item.change_type)}
                            </Badge>
                          </div>
                          {item.reason && (
                            <p className="mb-1 text-muted small">{item.reason}</p>
                          )}
                          <div className="d-flex align-items-center gap-3 mt-2">
                            <small className="text-muted">
                              <FontAwesomeIcon icon={faUser} className="me-1" />
                              {getUserDisplay(item.created_by)}
                            </small>
                            {item.previous_stock !== undefined && item.new_stock !== undefined && (
                              <small className="text-muted">
                                Stock: {item.previous_stock} → {item.new_stock}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-end ms-3">
                        <div className={`text-${getHistoryTypeColor(item.change_type)} fw-bold mb-1`}>
                          {formatChange(item.quantity_change)} units
                        </div>
                        <small className="text-muted">
                          {formatDate(item.created_at)}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faClock} className="text-muted mb-3" size="3x" />
              <h5 className="text-muted">No History Available</h5>
              <p className="text-muted">No inventory changes have been recorded for this variant.</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InventoryHistoryModal
